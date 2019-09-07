// A utility script that merges en-US.base.json into en-US.json.
// This is necessary because Alexa Skill Utterance and Schema Generator
// (https://github.com/KayLerch/alexa-utterance-generator)
// doesn't yet support dialogs.

import * as fs from 'fs';
import * as _ from 'lodash';
import * as path from 'path';

const basePath = '../../models';

const base = require(path.resolve(basePath, 'en-US.base.json'));
const model = require(path.resolve(basePath, 'en-US.json'));

const merged = _.defaultsDeep({}, base, model);

fs.writeFileSync(path.resolve(basePath, 'en-US.json'), JSON.stringify(merged, null, 2));
