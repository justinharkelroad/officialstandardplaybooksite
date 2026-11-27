#!/usr/bin/env python3
from pathlib import Path
import sys

skills_root = Path(__file__).resolve().parents[2]
shared = skills_root / "_standard-agency-intelligence-shared"
if not shared.exists():
    shared = skills_root / "_shared"
sys.path.insert(0, str(shared))
from report_core import cli


if __name__ == "__main__":
    cli("agency-quote-conversion")
