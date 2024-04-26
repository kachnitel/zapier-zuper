const zapier = require('zapier-platform-core');

// Use this to make test calls into your app:
const App = require('../../index');
const appTester = zapier.createAppTester(App);
// read the `.env` file into the environment, if available
zapier.tools.env.inject();

describe('searches.customer', () => {
  it('should run', async () => {
    const bundle = {
      inputData: {
        email: ''
      },
      authData: {
        apiKey: process.env.API_KEY,
        region: process.env.ZUPER_REGION
      }
    };

    const results = await appTester(App.searches.customer.operation.perform, bundle);
    expect(results).toBeDefined();
    expect(results.length).toBeGreaterThan(0);
  });

  it('should fail on bad email', async () => {
    const bundle = {
      inputData: {
        email: 'bad-email'
      },
      authData: {
        apiKey: process.env.API_KEY,
        region: process.env.ZUPER_REGION
      }
    };

    try {
      await appTester(App.searches.customer.operation.perform, bundle);
    } catch (error) {
      expect(error.message).toContain('No customer found.');
    }
  });
});
