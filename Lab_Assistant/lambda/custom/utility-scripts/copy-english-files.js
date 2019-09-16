#!/usr/bin/env node

// This utility script copies the relevant en-US files/sections
// to other English-speaking locales to allow
// this skill to be available in those stores.
// Be sure to run this script AFTER running "npm run model"

const path = require('path');
const fs = require('fs');

const supportedEnglishCodes = ['en-CA', 'en-GB', 'en-AU', 'en-IN'];

// Copy en-US.json to en-CA.json, en-GB.json, etc.
const modelDir = path.resolve(__dirname, '../../../models');
const enUsModelJsonPath = path.resolve(__dirname, modelDir, 'en-US.json');
const enUsModelJson = require(enUsModelJsonPath);

supportedEnglishCodes.forEach(code => {
  const newFilePath = path.resolve(modelDir, `${code}.json`);
  fs.writeFileSync(newFilePath, JSON.stringify(enUsModelJson, null, 2));
});

// Copy the manifest.publishingInformation.locales.en-US and
// manifest.privacyAndCompliance.locales.en-US sections in
// skill.json to en-CA, en-GB, etc.
const skillJsonPath = path.resolve(__dirname, '../../../skill.json');
const skillJson = require(skillJsonPath);

const enUsPublishing = skillJson.manifest.publishingInformation.locales['en-US'];
const enUsPrivacy = skillJson.manifest.privacyAndCompliance.locales['en-US'];
supportedEnglishCodes.forEach(code => {
  skillJson.manifest.publishingInformation.locales[code] = enUsPublishing;
  skillJson.manifest.privacyAndCompliance.locales[code] = enUsPrivacy;
});

fs.writeFileSync(skillJsonPath, JSON.stringify(skillJson, null, 2));
