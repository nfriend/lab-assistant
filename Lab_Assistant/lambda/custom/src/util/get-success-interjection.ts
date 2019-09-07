// See https://developer.amazon.com/docs/custom-skills/speechcon-reference-interjections-english-us.html

import * as i18n from 'i18next';
import { chooseOne } from './choose-one';
import { mft } from './mark-for-translation';

export const getSuccessInterjection = () => {
  const interjection = chooseOne(
    mft('alrighty'),
    mft('awesome'),
    mft('aww yeah '),
    mft('bazinga'),
    mft('beep beep'),
    mft('booya'),
    mft('bing'),
    mft('bingo'),
    mft('cha ching'),
    mft('cheers'),
    mft('cowabunga'),
    mft('dynomite'),
    mft('eggselent'),
    mft('eureka'),
    mft('high five'),
    mft('hip hip hooray'),
    mft('hurrah'),
    mft('hurray'),
    mft('huzzah'),
    mft('kaboom'),
    mft('kapow'),
    mft('kerbam'),
    mft('kerboom'),
    mft('kerching'),
    mft('schwing'),
    mft('schwing'),
    mft('ta da'),
    mft('wahoo'),
    mft('whammo'),
    mft('woo hoo'),
    mft('yippee'),
    mft('zap'),
  );

  return i18n.t('<say-as interpret-as="interjection">{{interjection}}!</say-as>', { interjection });
};
