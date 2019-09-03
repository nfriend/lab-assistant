#!/bin/bash

# Generate a new skill model
# We can't use "npm run model" here as npm isn't available in the java image
cd ../../models 
java -jar alexa-generate.jar ./en-US.grammar ./en-US.json

# Run "git status", because for some reason the command
# below doesn't correct detect changes otherwise ¯\＿(ツ)＿/¯
git status

if git diff-index --quiet HEAD --; then
    echo -e "\033[32;1mThe model file is up to date 👍\033[0m"
    exit 0
else
    echo -e "\033[31;1m⚠️  The model has been changed! Please run \"npm run model\" and commit these changes. ⚠️\033[0m"
    exit 1
fi
