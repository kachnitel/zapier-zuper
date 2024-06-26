const authentication = require("./authentication");

const findCustomer = require("./searches/customer");
const createCustomer = require("./creates/customer");

const findJob = require("./searches/job");
const findJobs = require("./searches/jobs");
const getJob = require("./searches/job_get");
const createJob = require("./creates/job");
const updateJob = require("./creates/job_update");

module.exports = {
  // This is just shorthand to reference the installed dependencies you have.
  // Zapier will need to know these before we can upload.
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication: authentication.config,
  beforeRequest: [...authentication.befores],
  afterResponse: [...authentication.afters],

  // If you want your trigger to show up, you better include it here!
  triggers: {},

  // If you want your searches to show up, you better include it here!
  searches: {
    [findCustomer.key]: findCustomer,
    [findJob.key]: findJob,
    [findJobs.key]: findJobs,
    [getJob.key]: getJob
  },

  // If you want your creates to show up, you better include it here!
  creates: {
    [createCustomer.key]: createCustomer,
    [createJob.key]: createJob,
    [updateJob.key]: updateJob
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
