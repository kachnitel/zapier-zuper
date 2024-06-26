'use strict';

require('dotenv').config();

// TODO: use Generator % schema to generate this

// You want to make a request to an endpoint that is either specifically designed
// to test auth, or one that every user will have access to. eg: `/me`.
// By returning the entire request object, you have access to the request and
// response data for testing purposes. Your connection label can access any data
// from the returned response using the `json.` prefix. eg: `{{json.username}}`.
const test = (z, bundle) =>
  z.request({ url: `https://${bundle.authData.region}.zuperpro.com/api/user/all` });

// This function runs after every outbound request. You can use it to check for
// errors or modify the response. You can have as many as you need. They'll need
// to each be registered in your index.js file.
const handleBadResponses = (response, z, bundle) => {
  if (response.status === 401) {
    throw new z.errors.Error(
      // This message is surfaced to the user
      'The API Key you supplied is incorrect',
      'AuthenticationError',
      response.status
    );
  }

  if (response.status === 400 && response.data && response.data.content) {
    throw new z.errors.Error(
      // This message is surfaced to the user
      response.data.content,
      'AuthenticationError',
      response.status
    );
  }

  return response;
};

// This function runs before every outbound request. You can have as many as you
// need. They'll need to each be registered in your index.js file.
const includeApiKey = (request, z, bundle) => {
  if (bundle.authData.apiKey) {
    // Use these lines to include the API key in the querystring
    // request.params = request.params || {};
    // request.params.api_key = bundle.authData.apiKey;

    // If you want to include the API key in the header instead, uncomment this:
    request.headers['x-api-key'] = bundle.authData.apiKey;
  }

  return request;
};

module.exports = {
  config: {
    // "custom" is the catch-all auth type. The user supplies some info and Zapier can
    // make authenticated requests with it
    type: 'custom',

    // Define any input app's auth requires here. The user will be prompted to enter
    // this info when they connect their account.
    fields: [
      {
        key: 'apiKey',
        label: 'API Key',
        required: true,
        helpText: 'See https://developers.zuper.co/api-docs/#authentication'
      },
      {
        key: 'region',
        label: 'Region',
        required: true,
        helpText: 'See "dc_name" in Response at https://zuperpro.readme.io/docs/getting-started#what-is-my-base-api-url'
      }
    ],

    // The test method allows Zapier to verify that the credentials a user provides
    // are valid. We'll execute this method whenever a user connects their account for
    // the first time.
    test,

    // This template string can access all the data returned from the auth test. If
    // you return the test object, you'll access the returned data with a label like
    // `{{json.X}}`. If you return `response.data` from your test, then your label can
    // be `{{X}}`. This can also be a function that returns a label. That function has
    // the standard args `(z, bundle)` and data returned from the test can be accessed
    // in `bundle.inputData.X`.
    connectionLabel: (z, bundle) => {
      // return bundle.inputData.apiKey;
      return 'API Key: ***' + bundle.inputData.apiKey.substr(-4) + ' Region: ' + bundle.inputData.region;
    }
  },
  befores: [includeApiKey],
  afters: [handleBadResponses],
};
