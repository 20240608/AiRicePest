#!/usr/bin/env python3
"""Utility script to safely reset the admin password without shell escaping issues."""

from __future__ import annotations

import argparse
import sys
from getpass import getpass

from app import app
from models import db, User
from utils import hash_password


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Reset a user's password using the Flask application's configuration."
    )
    parser.add_argument(
        "--username",
        default="admin",
        help="Username to reset (default: admin)",
    )
    parser.add_argument(
        "--password",
        help="New password. If omitted, you will be prompted securely.",
    )
    parser.add_argument(
        "--no-confirm",
        action="store_true",
        help="Skip password confirmation prompt (useful for CI).",
    )
    return parser.parse_args()


def prompt_password(args: argparse.Namespace) -> str:
    password = args.password or getpass("Enter new password: ")
    if not password:
        print("Error: password cannot be empty", file=sys.stderr)
        sys.exit(1)

    if not args.no_confirm and not args.password:
        confirm = getpass("Confirm new password: ")
        if password != confirm:
            print("Error: passwords do not match", file=sys.stderr)
            sys.exit(1)

    if len(password) < 8:
        print("Error: password must be at least 8 characters", file=sys.stderr)
        sys.exit(1)

    return password


def reset_password(username: str, password: str) -> None:
    with app.app_context():
        user = User.query.filter_by(username=username).first()
        if not user:
            print(f"Error: user '{username}' not found", file=sys.stderr)
            sys.exit(1)

        user.password_hash = hash_password(password)
        db.session.commit()
        print(f"Password for '{username}' updated successfully.")


def main() -> None:
    args = parse_args()
    password = prompt_password(args)
    reset_password(args.username, password)


if __name__ == "__main__":
    main()
