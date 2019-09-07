// See https://developer.amazon.com/docs/custom-skills/speechcon-reference-interjections-english-us.html

import * as i18n from 'i18next';
import { chooseOne } from './choose-one';
import { mft } from './mark-for-translation';

export const getFailureInterjection = () => {
  const interjection = chooseOne(
    mft('ack'),
    mft('argh'),
    mft('aww applesauce'),
    mft('bah humbug'),
    mft('blah'),
    mft('blarg'),
    mft('blast'),
    mft('blimey'),
    mft('boo hoo'),
    mft('bummer'),
    mft("d'oh"),
    mft('dang'),
    mft('darn'),
    mft('drat'),
    mft('dun dun dun'),
    mft('fiddlesticks'),
    mft('good grief'),
    mft('great scott'),
    mft('jiminy cricket'),
    mft('no'),
    mft('oh boy'),
    mft('oh brother'),
    mft('oh dear'),
    mft('oh my'),
    mft('oh snap'),
    mft('oof'),
    mft('oops'),
    mft('ouch'),
    mft('ow'),
    mft('oy'),
    mft('phooey'),
    mft('rats'),
    mft('ruh roh'),
    mft('shiver me timbers'),
    mft('shoot'),
    mft('shucks'),
    mft('ugh'),
    mft('uh oh'),
    mft('wah wah'),
    mft('watch out'),
    mft('well'),
    mft('whoa'),
    mft('whoops'),
    mft('whoops a daisy '),
    mft('yikes'),
    mft('yowza'),
    mft('yowzer'),
    mft('yuck'),
  );

  return i18n.t('<say-as interpret-as="interjection">{{interjection}}!</say-as>', { interjection });
};
