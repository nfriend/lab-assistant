import { makeIdsSpeakable } from '../../src/util/make-ids-speakable';

test('leaves ids <= 100 alone', () => {
  expect(makeIdsSpeakable(100)).toBe('100');
});

test('adds <say-as> tags to ids > 100 so that they are spoken as individual digits', () => {
  expect(makeIdsSpeakable(101)).toBe('<say-as interpret-as="digits">101</say-as>');
});
