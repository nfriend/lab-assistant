#!/bin/bash

# Build the project (since the merge-model script 
# is written in TypeScript)
npm run build

# Generate a new skill model
npm run model

# Run "git status", because for some reason the command
# below doesn't correct detect changes otherwise ¯\＿(ツ)＿/¯
git status

if git diff-index --quiet HEAD --; then
    echo -e "\033[32;1mThe model file is up to date 👍\033[0m"
    exit 0
else
    echo -e "\033[31;1m⚠️  The model has been changed! Please run \"npm run model\" and commit these changes. ⚠️\033[0m"
    echo "Diff:"
    git diff ../../models/en-US.json
    
    exit 1
fi