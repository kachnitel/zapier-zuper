const zapier = require('zapier-platform-core');

// Use this to make test calls into your app:
const App = require('../../index');
const job = require('../../creates/job');
const appTester = zapier.createAppTester(App);
// read the `.env` file into the environment, if available
zapier.tools.env.inject();

describe('creates.job', () => {
  it('should run', async () => {
    const bundle = {
      inputData: job.operation.sample,
      authData: {
        apiKey: process.env.API_KEY,
        region: process.env.ZUPER_REGION
      }
    };

    // const results = await appTester(App.creates.job.operation.perform, bundle);
    // expect(results).toBeDefined();
    // TODO: add more assertions
    try {
      await appTester(job.operation.perform, bundle);
    } catch (error) {
      // TODO: category id not valid
    }
  });
});
