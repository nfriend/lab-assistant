#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const argv = require('yargs').argv;

const ASK_DIR = '/root/.ask';
const AWS_DIR = '/root/.aws';

// Create the .ask directory
if (!fs.existsSync(ASK_DIR)) {
  fs.mkdirSync(ASK_DIR);
}

const askCliCconfig = {
  profiles: {
    default: {
      token: {
        access_token: argv.askAccessToken,
        refresh_token: argv.askRefreshToken,
        token_type: 'bearer',
        expires_in: 3600,
        expires_at: '2019-08-23T12:30:49.193Z',
      },
      vendor_id: argv.askVendorId,
      aws_profile: 'default',
    },
  },
};

console.log('askCliCconfig:');
console.log(JSON.stringify(askCliCconfig, null, 2));

fs.writeFileSync(
  path.resolve(ASK_DIR, 'cli_config'),
  JSON.stringify(askCliCconfig, null, 2),
);

// Create the .aws directory
if (!fs.existsSync(AWS_DIR)) {
  fs.mkdirSync(AWS_DIR);
}

// prettier-ignore
const awsConfig = [
  '[default]',
  'output = json',
  'region = us-east-1',
  ''
].join('\n');

console.log('awsConfig:');
console.log(JSON.stringify(awsConfig, null, 2));

fs.writeFileSync(path.resolve(AWS_DIR, 'config'), askCliCconfig);

const awsCredentials = [
  '[default]',
  `aws_access_key_id = ${argv.awsAccessKeyId}`,
  `aws_secret_access_key = ${argv.awsSecretAccessKey}`,
  '',
].join('\n');

console.log('awsCredentials:');
console.log(JSON.stringify(awsCredentials, null, 2));

fs.writeFileSync(path.resolve(AWS_DIR, 'credentials'), awsCredentials);
