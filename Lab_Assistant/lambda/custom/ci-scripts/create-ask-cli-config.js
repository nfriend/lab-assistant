#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ASK_DIR = '/root/.ask';

// Create the .ask directory
if (!fs.existsSync(ASK_DIR)) {
  fs.mkdirSync(ASK_DIR);
}

const config = {
  profiles: {
    default: {
      token: {
        access_token: 'access token here',
        refresh_token: 'refresh token here',
        token_type: 'bearer',
        expires_in: 3600,
        expires_at: '2019-08-23T12:30:49.193Z',
      },
      vendor_id: 'vender ID here',
      aws_profile: 'default',
    },
  },
};

// write the configuration JSON to cli_config
fs.writeFileSync(
  path.resolve(ASK_DIR, 'cli_config'),
  JSON.stringify(config, null, 2),
);
