const {
  config: authentication,
  befores: authBefores,
  afters: authAfters
} = require('./authentication');

const findCustomer = require("./searches/customer");
const createCustomer = require("./creates/customer");

module.exports = {
  // This is just shorthand to reference the installed dependencies you have.
  // Zapier will need to know these before we can upload.
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication: authentication,
  beforeRequest: [...authBefores],
  afterResponse: [...authAfters],

  // If you want your trigger to show up, you better include it here!
  triggers: {},

  // If you want your searches to show up, you better include it here!
  searches: {
    [findCustomer.key]: findCustomer
  },

  // If you want your creates to show up, you better include it here!
  creates: {
    [createCustomer.key]: createCustomer
  },

  searchOrCreates: {
    [findCustomer.key]: {
      key: findCustomer.key,
      display: {
        label: 'Find or Create Customer',
        description: 'Finds or creates a customer based on email.'
      },
      search: findCustomer.key,
      create: createCustomer.key
    }
  },

  resources: {}
};
