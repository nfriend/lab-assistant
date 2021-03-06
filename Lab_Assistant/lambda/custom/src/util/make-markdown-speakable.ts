import * as i18n from 'i18next';
import { first, uniq } from 'lodash';
import * as remark from 'remark';
import * as requestPromise from 'request-promise';
import { getUsersName } from './get-users-name';
import { makeIdsSpeakable } from './make-ids-speakable';
const emoji = require('remark-emoji');
const strip = require('strip-markdown');

const processor = remark()
  .use(strip)
  .use(emoji);

/**
 * Manipulates the provided text to make it more speakable
 * @param text The text to transform
 * @param rp A request-promise instance that is setup to
 * @param summarize Whether to "summarize" the text by returning only the first sentence
 * make authenticated calls to the GitLab.com API
 */
export const makeMarkDownSpeakable = async (
  text: string,
  rp: typeof requestPromise,
  summarize: boolean = false,
): Promise<string> => {
  text = await markdownToPlainText(text);
  text = await replaceUserNames(text, rp);
  text = replaceGitLabLinksAndRefs(text);
  text = expandAcronymns(text);

  if (summarize) {
    text = getSummary(text);
  }

  return text;
};

/**
 * Strips out all markdown syntax and replaces :emojis:
 * @param text The text to transform
 */
const markdownToPlainText = async (text: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    processor.process(text, (err, file) => {
      if (err) {
        reject(err);
      } else {
        resolve(String(file));
      }
    });
  });
};

/**
 * Extracts all @-mentioned users from the text and replaces the
 * username with the user's actual name using the GitLab API
 * TODO: i18n? Doesn't currently work with characters outside of [a-zA-Z0-9]
 * @param text The text to transform
 * @rp A request-promise instance that is setup to make
 * authenticated calls to the GitLab.com API
 */
const replaceUserNames = async (text: string, rp: typeof requestPromise): Promise<string> => {
  // Get a list of all usernames mentioned in the text
  let usernames = text.match(/(?![a-z0-9])@[a-z0-9-_]+(?![a-z0-9])/gi);

  // Filter out duplicates, and reverse sort this list.
  // This is to avoid a username like @nathan
  // interfering with a username like @nathanfriend,
  // because the longer name will be replaced first.
  usernames = uniq(usernames)
    .map(u => u.toLowerCase())
    .sort()
    .reverse();

  // Using the GitLab.com API, build a map of username to name
  // replacements, like [{ username: 'nfriend', name: 'Nathan Friend' }]
  const replacements = await Promise.all(
    usernames.map(async un => {
      return {
        username: un,
        name: await getUsersName(un, rp),
      };
    }),
  );

  // perform the replacements
  replacements.forEach(r => {
    text = text.replace(
      new RegExp(`(?![a-z0-9-_])${escapeRegExp(r.username)}(?![a-z0-9-_])`, 'gi'),
      r.name,
    );
  });

  return text;
};

/**
 * Expands some common acronyms
 * I.e. "WDYT" => "what do you think"
 * TODO: i18n?
 * @param text The text to transform
 */
const expandAcronymns = (text: string): string => {
  const replacements = [
    {
      regex: /\blgtm\b/gi,
      replacement: 'looks good to me',
    },
    {
      regex: /\bbtw\b/gi,
      replacement: 'btw',
    },
    {
      regex: /\bafaik\b/gi,
      replacement: 'as far as i know',
    },
    {
      regex: /\btbh\b/gi,
      replacement: 'to be honest',
    },
    {
      regex: /\bwdyt\b/gi,
      replacement: 'wdyt',
    },
    {
      regex: /\bimo\b/gi,
      replacement: 'in my opinion',
    },
    {
      regex: /\bmwps\b/gi,
      replacement: 'merge when pipeline succeeds',
    },
    {
      regex: /\bmr\b/gi,
      replacement: 'merge request',
    },
    {
      regex: /\bfe\b/gi,
      replacement: 'front end',
    },
    {
      regex: /\bBE\b/g,
      replacement: 'back end',
    },
    {
      regex: /\bdb\b/gi,
      replacement: 'database',
    },
    {
      regex: /\bwip\b/gi,
      replacement: 'work in progress',
    },
  ];

  replacements.forEach(r => {
    text = text.replace(r.regex, r.replacement);
  });

  return text;
};

/**
 * Makes a string safe to use in a RegExp
 * From https://stackoverflow.com/a/1144788/1063392
 * @param str The string to be used as part of a RegExp
 */
const escapeRegExp = (str: string) => {
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
};

/**
 * Replaces GitLab links and references to issues and merge requests
 * with more speakable versions
 * @param text The text to transform
 */
const replaceGitLabLinksAndRefs = (text: string): string => {
  // matches a link to a GitLab issue or merge request, i.e. https://gitlab.com/nfriend/lab-assistant/issues/1
  const linkRegex = /https&#x3A;\/\/gitlab\.com\/[^\s.,!?]*\/(issues|merge_requests)\/([0-9]+)[^\s.,!?]*/i;
  // matches a reference to a GitLab issue or merge request. i.e. nfriend/lab-assistant#1
  const refRegex = /[^\s.,!?]*\/[^\s.,!?]*(?:\/[^\s.,!?]*)*(#|!)([0-9]+)/i;

  [linkRegex, refRegex].forEach(regex => {
    let match: RegExpExecArray;

    // tslint:disable-next-line:no-conditional-assignment
    while ((match = regex.exec(text)) !== null) {
      const type =
        match[1].toLowerCase() === 'issues' || match[1] === '#'
          ? i18n.t('issue')
          : i18n.t('merge request');
      const id = makeIdsSpeakable(parseInt(match[2], 10));
      const speakable = i18n.t('{{type}} number {{id}}', { type, id });

      text = text.replace(match[0], speakable);
    }
  });

  return text;
};

/**
 * Cuts off the string after the first punctuation
 * @param str The text to transform
 */
const getSummary = (str: string): string => {
  const cutoffCharacters = ['.', '!', '?', ';'];

  let earliestIndex = Number.MAX_VALUE;
  for (const char of cutoffCharacters) {
    const charIndex = str.indexOf(char);
    if (charIndex !== -1 && charIndex < earliestIndex) {
      earliestIndex = charIndex;
    }
  }

  return str.substring(0, earliestIndex + 1);
};
