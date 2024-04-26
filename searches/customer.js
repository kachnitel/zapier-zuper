// find a particular customer by name
const perform = async (z, bundle) => {
  const endpoint = 'customers';
  const url = `https://${bundle.authData.region}.zuperpro.com/api/${endpoint}`;

  const response = await z.request({
    // url: 'https://jsonplaceholder.typicode.com/posts',
    url: url,
    params: {
      'filter.customer_email': bundle.inputData.email
    }
  });

  const responseData = response.json;

  // this should return an array of objects (but only the first will be used)
  return responseData.data;
};

module.exports = {
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/main/packages/schema/docs/build/schema.md#searchschema
  key: 'customer',
  noun: 'Customer',

  display: {
    label: 'Find Customer',
    description: 'Finds a customer based on name.'
  },

  operation: {
    perform,

    // `inputFields` defines the fields a user could provide
    // Zapier will pass them in as `bundle.inputData` later. Searches need at least one `inputField`.
    inputFields: [
      { key: 'email', required: true, helpText: 'Find the Customer with this email.' }
    ],

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obvious placeholder values that we can show to any user.
    sample: {
      id: 1,
      email: 'john@doe.ca'
    },

    // If fields are custom to each user (like spreadsheet columns), `outputFields` can create human labels
    // For a more complete example of using dynamic fields see
    // https://github.com/zapier/zapier-platform/tree/main/packages/cli#customdynamic-fields
    // Alternatively, a static field definition can be provided, to specify labels for the fields
    outputFields: [
      // these are placeholders to match the example `perform` above
      // {key: 'id', label: 'Person ID'},
      // {key: 'name', label: 'Person Name'}
      { key: 'customer_uid', label: 'Customer UID' },
      { key: 'customer_email', label: 'Customer Email' },
      { key: 'customer_first_name', label: 'Customer First Name' },
      { key: 'customer_last_name', label: 'Customer Last Name' }
    ]
  }
};
