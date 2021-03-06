#!/bin/bash
# Shell script for ask-cli pre-deploy hook for Node.js
# Script Usage: pre_deploy_hook.sh <SKILL_NAME> <DO_DEBUG> <TARGET>

# SKILL_NAME is the preformatted name passed from the CLI, after removing special characters.
# DO_DEBUG is boolean value for debug logging
# TARGET is the deploy TARGET provided to the CLI. (eg: all, skill, lambda etc.)

# Run this script under skill root folder

# The script does the following:
#  - Run "npm install" and "npm run build" in each sourceDir in skill.json

SKILL_NAME=$1
DO_DEBUG=${2:-false}
TARGET=${3:-"all"}

if [ $DO_DEBUG == false ]
then
    exec > /dev/null 2>&1
fi

# Install _all_ dependencies
install_dependencies() {
    npm install > /dev/null 2>&1
    return $?
}

# Run the build
build() {
    npm run build > /dev/null 2>&1
    return $?
}

# Generate translation files
translate() {
    npm run translate > /dev/null 2>&1
    return $?
}

# Remove all devDependencies (to decrease the size of
# the bundle that we will upload to lambda)
prune() {
    npm prune --production > /dev/null 2>&1
    return $?
}

echo "###########################"
echo "##### pre-deploy hook #####"
echo "###########################"

if [[ $TARGET == "all" || $TARGET == "lambda" ]]; then
    grep "sourceDir" ./skill.json | cut -d: -f2 |  sed 's/"//g' | sed 's/,//g' | while read -r SOURCE_DIR; do

        # change directory to the current skill's lambda function
        cd "$SOURCE_DIR"

        if install_dependencies; then
            echo "Succesfully installed dependencies for ($SOURCE_DIR)."
        else
            echo "There was a problem installing dependencies for ($SOURCE_DIR)."
            exit 1
        fi

        if build; then
            echo "Succesfully built ($SOURCE_DIR)."
        else
            echo "There was a problem building ($SOURCE_DIR)."
            exit 1
        fi

        if translate; then
            echo "Succesfully generated translation files for ($SOURCE_DIR)."
        else
            echo "There was a problem generating translation files for ($SOURCE_DIR)."
            exit 1
        fi

        if prune; then
            echo "Succesfully pruned ($SOURCE_DIR)."
        else
            echo "There was a problem removing devDependencies for ($SOURCE_DIR)."
            exit 1
        fi

        # go back to where we were
        cd -
    done
    echo "###########################"
fi

exit 0

