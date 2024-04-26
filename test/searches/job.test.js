const zapier = require('zapier-platform-core');

// Use this to make test calls into your app:
const App = require('../../index');
const appTester = zapier.createAppTester(App);
// read the `.env` file into the environment, if available
zapier.tools.env.inject();

describe('searches.job', () => {
  it('should 404', async () => {
    const bundle = {
      inputData: {
        uid: 123
      },
      authData: {
        apiKey: process.env.API_KEY,
        region: process.env.ZUPER_REGION
      }
    };

    try {
      await appTester(App.searches.job.operation.perform, bundle);
    } catch (error) {
      // TODO:
      // assert status is 404 and message is Job Not found for given UID
    }
  });
});
