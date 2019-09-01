# Lab Assistant

An Alexa skill for managing your open-source projects hosted on [GitLab.com](https://gitlab.com/) using your voice.

## Installation

Enable the Lab Assistant skill on your Amazon site of choice:

_Note: these are placeholder links until the skill is live._

- [Amazon.com]()
- [Amazon.ca]()
- [Amazon.co.uk]()
- [Amazon.com.au]()
- [Amazon.in]()

_Don't see your local Amazon store? You can help out by translating Lab Assistant into your language! See the **Contributing** section below for more details._

## Usage

- "Alexa, open Lab Assistant"

### Todos

- "Todos"
- "Do I have any todos?"
- "How many todos do I have?"
- "What does my day look like?"
- "Read me my todos"

### Issues

- "Issues"
- "Do I have any issues assigned to me?"
- "How many issues do I have?"
- "Read me my issues"

### Merge Requests

- "Merge requests"
- "Do I have any merge requests?"
- "How many merge requests do I have"
- "Read me my merge requests"

### Connecting to your GitLab.com account

Any command that requires you to connect your GitLab.com account will automatically prompt you to login, so you shouldn't have to worry about manually connecting your account. If for some reason you _do_ want to explicity connect your account, you can say:

- "Connect my account"

## FAQ

### Can I use this skill for self-managed GitLab instances?

No, this skill only integrates with [GitLab.com](https://gitlab.com/). This is because Alexa Skills must specify an OAuth provider at build time.

If you _do_ want to use this skill with a self-managed GitLab instance, you can clone this repo and deploy this code as a separate skill that is pointed at your GitLab instance.

## Developing

### Building

1. Clone this repo
2. `cd lab-assistant/Lab_Assistant/lambda/custom`
3. `npm install`
4. `npm run build`

### Testing

The easiest way to develop on this project is using test-driven development through [Jest](https://jestjs.io/). You can run the tests using `npm run test` or `npm run test-watch`. See the [existing tests](https://gitlab.com/nfriend/lab-assistant/tree/master/Lab_Assistant/lambda/custom/tests) for some examples.

### i18n

This project uses [`i18next`](https://www.i18next.com/) for internationalization ("i18n"). [`i18next-scanner`](https://github.com/i18next/i18next-scanner) is used to extract the strings directly from the source into this project's [i18n directory](https://gitlab.com/nfriend/lab-assistant/tree/master/Lab_Assistant/lambda/custom/i18n). You can run this extraction process by building the project (`npm run build`) and then running `npm run translate`. Alternatively, you can run `npm run build-and-translate`.

### Linting

This project uses [Prettier](https://prettier.io/) and [TSLint](https://palantir.github.io/tslint/) to help keep the codebase consistent. You can run all linting checks using `npm run lint`. Many of the more tedious errors can be fixed automatically; to do this, run `npm run lint-fix`.

### Continuous Integration

This project includes a [pipeline](https://gitlab.com/nfriend/lab-assistant/blob/master/.gitlab-ci.yml) that runs a number of automated checks to ensure tests are passing, translation files are up-to-date, and that the code contains no linting errors. Currently, the pipeline is: <a href="https://gitlab.com/nfriend/lab-assistant/pipelines/latest" target="_blank"><img src="https://gitlab.com/nfriend/lab-assistant/badges/master/pipeline.svg" alt="GitLab build status"></a>

### Deploying

To deploy, run `npm run deploy`. This command uses the [Alexa Skills Kit (ASK) CLI](https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html) to update the latest **development** version of this skill. Production deployments/submissions are a manual process.

## Contributing

Merge requests are welcome! :pray: :bow:

If you'd like to contribute code, see the **Developing** section above.

If you're interested in translating Lab Assistant into another language (thereby making it available in other Amazon stores), please open a merge request with translated versions of these files:

- https://gitlab.com/nfriend/lab-assistant/blob/master/Lab_Assistant/lambda/custom/i18n/en/translation.json
- https://gitlab.com/nfriend/lab-assistant/blob/master/Lab_Assistant/models/en-US.json
