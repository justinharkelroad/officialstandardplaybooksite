#!/usr/bin/env python3
"""Install the bundled Standard skills into the current project only."""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path


def detect_platform(workspace: Path) -> str:
    codex = (workspace / "AGENTS-STARTER.md").exists() or (workspace / "AGENTS.md").exists()
    claude = (workspace / "CLAUDE-STARTER.md").exists() or (workspace / "CLAUDE.md").exists()
    if codex and not claude:
        return "codex"
    if claude and not codex:
        return "claude"
    raise ValueError("Could not determine one platform. Pass --platform codex or --platform claude.")


def validate_skill(path: Path, expected_name: str) -> None:
    skill_file = path / "SKILL.md"
    if not skill_file.exists():
        raise ValueError(f"Missing {skill_file}")
    content = skill_file.read_text(encoding="utf-8")
    if not content.startswith("---\n") or f"name: {expected_name}" not in content.split("---", 2)[1]:
        raise ValueError(f"Invalid frontmatter in {skill_file}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Install Standard Agency Intelligence skills locally.")
    parser.add_argument("--workspace", default=".", help="MY BIZ BRAIN folder. Defaults to the current folder.")
    parser.add_argument("--platform", choices=["codex", "claude"])
    parser.add_argument("--replace", action="store_true", help="Back up and replace a previous Standard skill installation.")
    args = parser.parse_args()

    workspace = Path(args.workspace).expanduser().resolve()
    source = workspace / "STANDARD-SKILLS"
    manifest_path = source / "manifest.json"
    if not manifest_path.exists():
        raise ValueError(f"Missing skill manifest: {manifest_path}")
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    platform = args.platform or detect_platform(workspace)
    destination = workspace / (".agents/skills" if platform == "codex" else ".claude/skills")
    shared_source = source / "_shared"
    shared_target = destination / "_standard-agency-intelligence-shared"
    required_shared = [
        shared_source / "report_core.py",
        shared_source / "report_artifacts.py",
    ]
    missing_shared = [path for path in required_shared if not path.is_file()]
    if not shared_source.is_dir() or missing_shared:
        raise ValueError(f"Missing shared analyzer file(s): {missing_shared}")

    skill_plan: list[tuple[Path, Path, str]] = []
    for name in manifest["skills"]:
        source_skill = source / name
        validate_skill(source_skill, name)
        skill_plan.append((source_skill, destination / name, name))

    # Validate the complete bundled analyzer before touching an attendee's project.
    subprocess.run([sys.executable, str(shared_source / "report_core.py"), "--self-test"], check=True)

    install_plan = skill_plan + [(shared_source, shared_target, shared_target.name)]
    existing = [target for _, target, _ in install_plan if target.exists()]
    receipt = workspace / "SKILLS-INSTALLED.md"
    if existing and not args.replace:
        rendered = ", ".join(str(path.relative_to(workspace)) for path in existing)
        raise ValueError(
            f"Standard skill installation already exists at: {rendered}. "
            "No files were changed. Re-run with --replace to back it up and update it."
        )

    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S-%f")
    backup_root = workspace / ".standard-skill-backups" / timestamp
    moved: list[tuple[Path, Path]] = []
    created: list[Path] = []
    installed: list[str] = []
    try:
        destination.mkdir(parents=True, exist_ok=True)
        if args.replace and (existing or receipt.exists()):
            backup_root.mkdir(parents=True, exist_ok=False)
            for target in existing:
                backup = backup_root / target.name
                shutil.move(str(target), str(backup))
                moved.append((backup, target))
            if receipt.exists():
                receipt_backup = backup_root / receipt.name
                shutil.move(str(receipt), str(receipt_backup))
                moved.append((receipt_backup, receipt))

        for source_path, target, label in install_plan:
            shutil.copytree(source_path, target)
            created.append(target)
            if label in manifest["skills"]:
                validate_skill(target, label)
                installed.append(label)

        subprocess.run([sys.executable, str(shared_target / "report_core.py"), "--self-test"], check=True)
    except (OSError, ValueError, subprocess.CalledProcessError):
        for target in reversed(created):
            if target.exists():
                shutil.rmtree(target)
        for backup, original in reversed(moved):
            if backup.exists():
                original.parent.mkdir(parents=True, exist_ok=True)
                shutil.move(str(backup), str(original))
        raise

    lines = [
        "# Standard Skills Installed",
        "",
        f"- Platform: {platform.title()}",
        f"- Pack version: {manifest['version']}",
        f"- Installed: {datetime.now(timezone.utc).isoformat()}",
        f"- Project destination: {destination.relative_to(workspace)}",
        f"- Validation: {len(installed)}/{len(manifest['skills'])} skills passed",
        *(
            [f"- Previous installation backup: {backup_root.relative_to(workspace)}"]
            if moved
            else []
        ),
        "",
        "## Skills",
        "",
        *[f"- {name}: installed and validated" for name in installed],
        "",
        "Source agency reports remain outside MY BIZ BRAIN. Point the relevant skill at a report when analysis is needed.",
        "",
    ]
    receipt.write_text("\n".join(lines), encoding="utf-8")
    print(f"Installed and validated {len(installed)} skills for {platform}.")
    print(f"Receipt: {receipt}")


if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        print(f"ERROR: {error}", file=sys.stderr)
        raise SystemExit(2)
