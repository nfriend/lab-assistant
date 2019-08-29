import { makeMarkDownSpeakable } from '../../src/util/make-markdown-speakable';

const rpMock: any = {
  get: (url: string) => {
    const urlsToUsers: { [url: string]: { name: string } } = {
      'https://gitlab.com/api/v4/users?username=nfriend': {
        name: 'Nathan Friend',
      },
      'https://gitlab.com/api/v4/users?username=nfriend2': {
        name: 'The Other Nathan Friend',
      },
    };

    const result = urlsToUsers.hasOwnProperty(url) ? [urlsToUsers[url]] : [];
    return Promise.resolve(result);
  },
};

// Not testing emojis at the moment because I can't seem to get the tests to expect() properly
test('makes the text (more) speakable', async () => {
  const input =
    "Hey @nfriend, LGTM! @nfriend2 @nfriend3 Can you review @nfriend's [MR?](https://example.com)\n\n> a quote\n# a title";
  const expected =
    "Hey Nathan Friend, looks good to me! The Other Nathan Friend @nfriend3 Can you review Nathan Friend's merge request?\n\na quote\n\na title\n";
  const output = await makeMarkDownSpeakable(input, rpMock);

  expect(output).toBe(expected);
});

test('only includes the first sentence when summarize = true', async () => {
  const input =
    "Hey @nfriend, LGTM! :smile: @nfriend2 @nfriend3 Can you review @nfriend's MR?:bow:";
  const expected = 'Hey Nathan Friend, looks good to me!';
  const output = await makeMarkDownSpeakable(input, rpMock, true);
  expect(output).toBe(expected);
});

test('replaces GitLab links', async () => {
  const input =
    'Check out https://gitlab.com/gitlab-org/gitlab-ee/merge_requests/2#note_209393205 and https://gitlab.com/gitlab-org/gitlab-ee/issues/9982#note_189977200. Thanks!';
  const expected =
    'Check out merge request number 2 and issue number <say-as interpret-as="digits">9982</say-as>. Thanks!\n';
  const output = await makeMarkDownSpeakable(input, rpMock);
  expect(output).toBe(expected);
});

test('replaces GitLab references', async () => {
  const input =
    'Check out gitlab-org/gitlab-ee!2 and gitlab-org/memory-team/memory-team-onboarding#9982. Thanks!';
  const expected =
    'Check out merge request number 2 and issue number <say-as interpret-as="digits">9982</say-as>. Thanks!\n';
  const output = await makeMarkDownSpeakable(input, rpMock);
  expect(output).toBe(expected);
});
