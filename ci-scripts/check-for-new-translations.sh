#!/bin/bash

# Build the skill and regenerate all translation files
npm run build-and-translate

# Run "git status", because for some reason the command
# below doesn't correct detect changes otherwise ¯\＿(ツ)＿/¯
git status

if git diff-index --quiet HEAD --; then
    echo "All translation files are up to date 👍"
    exit 0
else
    echo "New text has been added! Please run \"npm run translate\" and commit these changes."
    exit 1
fi