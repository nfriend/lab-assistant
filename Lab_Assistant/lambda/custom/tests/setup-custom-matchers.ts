import * as diff from 'jest-diff';
import { has, isString } from 'lodash';

expect.extend({
  toSpeek(lambdaResult: any, speech: string) {
    const options: any = {
      comment: 'SSML speech equality',
      isNot: this.isNot,
      promise: (this as any).promise,
    };

    const ssmlExists = has(lambdaResult, 'response.outputSpeech.ssml');
    const ssmlIsString = isString(lambdaResult.response.outputSpeech.ssml);

    let ssmlMatches: boolean;
    let ssmlWithoutTags: string;
    if (ssmlExists && ssmlIsString) {
      const ssml: string = lambdaResult.response.outputSpeech.ssml.trim();
      ssmlMatches = ssml === `<speak>${speech}</speak>`;
      ssmlWithoutTags = ssml.replace(/<\/?speak>/g, '');
    }

    const pass = ssmlExists && ssmlIsString && ssmlMatches;

    const message = pass
      ? () =>
          this.utils.matcherHint('toSpeek', undefined, undefined, options) +
          '\n\n' +
          `Expected: ${this.utils.printExpected(speech)}\n` +
          `Received: ${this.utils.printReceived(ssmlWithoutTags)}`
      : () => {
          const diffString = diff(speech, ssmlWithoutTags, {
            expand: this.expand,
          });
          return (
            this.utils.matcherHint('toSpeek', undefined, undefined, options) +
            '\n\n' +
            (diffString && diffString.includes('- Expect')
              ? `Difference:\n\n${diffString}`
              : `Expected: ${this.utils.printExpected(speech)}\n` +
                `Received: ${this.utils.printReceived(ssmlWithoutTags)}`)
          );
        };

    return { actual: ssmlWithoutTags, message, pass };
  },
});
