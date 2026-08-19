#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source_root="$repo_root/resources/aiinstall/starter-pack"
output_root="$repo_root/public/aiinstall"
pack_tmp="$(mktemp -d "${TMPDIR:-/tmp}/aiinstall-starter-pack.XXXXXX")"

cleanup() {
  rm -rf "$pack_tmp"
}

trap cleanup EXIT

build_track_pack() {
  local track="$1"
  local output_name="$2"
  local stage="$pack_tmp/$track"

  mkdir -p "$stage"
  cp -R "$source_root/common/." "$stage/"
  cp -R "$source_root/$track/." "$stage/"
  (
    cd "$stage"
    zip -X -q -r "$output_root/$output_name" .
  )
}

mkdir -p "$output_root"

build_track_pack "claude" "ai-install-claude-starter-pack.zip"
build_track_pack "codex" "ai-install-codex-starter-pack.zip"

legacy_stage="$pack_tmp/legacy"
mkdir -p "$legacy_stage"
cp -R "$source_root/common/." "$legacy_stage/"
cp "$source_root/legacy/README-START-HERE.md" "$legacy_stage/README-START-HERE.md"
cp "$source_root/claude/CLAUDE-STARTER.md" "$legacy_stage/CLAUDE-STARTER.md"
cp "$source_root/codex/AGENTS-STARTER.md" "$legacy_stage/AGENTS-STARTER.md"
(
  cd "$legacy_stage"
  zip -X -q -r "$output_root/ai-install-starter-pack.zip" .
)

# Keep the legacy shared pack at the short public URL for existing links.
# The platform pre-work pages use the track-specific packs above.
cp "$output_root/ai-install-starter-pack.zip" "$output_root/starter-pack.zip"

claude_pack="$output_root/ai-install-claude-starter-pack.zip"
codex_pack="$output_root/ai-install-codex-starter-pack.zip"

unzip -Z1 "$claude_pack" "CLAUDE-STARTER.md" >/dev/null
unzip -Z1 "$codex_pack" "AGENTS-STARTER.md" >/dev/null

if unzip -Z1 "$claude_pack" "AGENTS-STARTER.md" >/dev/null 2>&1; then
  echo "Claude starter pack must not contain AGENTS-STARTER.md" >&2
  exit 1
fi

if unzip -Z1 "$codex_pack" "CLAUDE-STARTER.md" >/dev/null 2>&1; then
  echo "Codex starter pack must not contain CLAUDE-STARTER.md" >&2
  exit 1
fi

unzip -p "$claude_pack" "README-START-HERE.md" | grep -Fq "/aiinstall/ready"
unzip -p "$codex_pack" "README-START-HERE.md" | grep -Fq "/aiinstall/ready"
