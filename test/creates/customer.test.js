const zapier = require('zapier-platform-core');

// Use this to make test calls into your app:
const App = require('../../index');
const customer = require('../../creates/customer');
const appTester = zapier.createAppTester(App);
// read the `.env` file into the environment, if available
zapier.tools.env.inject();

describe('creates.customer', () => {
  it('should run', async () => {
    // console.log(customer.operation.sample);
    const bundle = {
      inputData: customer.operation.sample,
      authData: {
        apiKey: process.env.API_KEY,
        region: process.env.ZUPER_REGION
      }
    };

    try {
      await appTester(App.creates.customer.operation.perform, bundle);
    } catch (error) {
      // TODO:
      // we dont have a category and don't wanna create customer anyways
      // assert status is 400 and message is The Category is not valid
    }
  });
});
