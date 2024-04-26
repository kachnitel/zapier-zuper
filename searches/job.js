// find a particular job by name
const perform = async (z, bundle) => {
  const endpoint = 'jobs';
  const url = `https://${bundle.authData.region}.zuperpro.com/api/${endpoint}`;

  const response = await z.request({
    url: url,
    params: {
      [bundle.inputData.key]: bundle.inputData.value
    }
  });

  return response.json.data;
};

module.exports = {
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/main/packages/schema/docs/build/schema.md#searchschema
  key: 'job',
  noun: 'Job',

  display: {
    label: 'Find a Job',
    description: 'Finds a list of jobs where filter parameter can be set. See https://zuperpro.readme.io/reference/get-all-jobs for more details.'
  },

  operation: {
    perform,

    // `inputFields` defines the fields a user could provide
    // Zapier will pass them in as `bundle.inputData` later. Searches need at least one `inputField`.
    inputFields: [
      {
        key: 'name',
        required: true,
        // list: true,
        // helpText: 'Find the Job with this name.'
        children: [
          {
            key: 'key',
            required: true,
            type: 'string',
            helpText: 'The key to filter by. See https://zuperpro.readme.io/reference/get-all-jobs for more details.'
          },
          {
            key: 'value',
            required: true,
            type: 'string',
            helpText: 'The value to filter by. See https://zuperpro.readme.io/reference/get-all-jobs for more details.'
          }
        ]
      }
    ],

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obvious placeholder values that we can show to any user.
    sample: {
      results: [
        {
          job_uid: '123'
        }
      ],
      count: 1
    },

    // If fields are custom to each user (like spreadsheet columns), `outputFields` can create human labels
    // For a more complete example of using dynamic fields see
    // https://github.com/zapier/zapier-platform/tree/main/packages/cli#customdynamic-fields
    // Alternatively, a static field definition can be provided, to specify labels for the fields
    outputFields: [
      // these are placeholders to match the example `perform` above
      // {key: 'id', label: 'Person ID'},
      // {key: 'name', label: 'Person Name'}
    ]
  }
};
