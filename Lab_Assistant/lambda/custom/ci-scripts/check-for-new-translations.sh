#!/bin/bash

# Build the skill and regenerate all translation files
npm run build-and-translate

# Run "git status", because for some reason the command
# below doesn't correct detect changes otherwise ¯\＿(ツ)＿/¯
git status

if git diff-index --quiet HEAD --; then
    echo -e "\033[32;1mAll translation files are up to date 👍\033[0m"
    exit 0
else
    echo -e "\033[31;1m⚠️  New text has been added! Please run \"npm run translate\" and commit these changes. ⚠️\033[0m"
    exit 1
fi
