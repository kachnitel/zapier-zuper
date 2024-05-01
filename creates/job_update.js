// create a particular job by name
const perform = async (z, bundle) => {
  const endpoint = 'jobs';
  const url = `https://${bundle.authData.region}.zuperpro.com/api/${endpoint}`;

  const job = {
    job_uid: bundle.inputData.job_uid,
    job_title: bundle.inputData.job_title,
    job_category: bundle.inputData.job_category,
    job_priority: bundle.inputData.job_priority,
    due_date: bundle.inputData.due_date,
    organization: bundle.inputData.organization,
    property: bundle.inputData.property,
    customer_uid: bundle.inputData.customer_uid,
    customer_address: {
      city: bundle.inputData.customer_address__city,
      state: bundle.inputData.customer_address__state,
      street: bundle.inputData.customer_address__street,
      country: bundle.inputData.customer_address__country,
      zip_code: bundle.inputData.customer_address__zip_code,
      geo_coordinates: [
        bundle.inputData.customer_address__geo_coordinates__latitude,
        bundle.inputData.customer_address__geo_coordinates__longitude
      ]
    },
    job_description: bundle.inputData.job_description,
    team_uid: bundle.inputData.team_uid
  };

  const response = await z.request({
    method: 'PUT',
    url: url,
    // if `body` is an object, it'll automatically get run through JSON.stringify
    // if you don't want to send JSON, pass a string in your chosen format here instead
    // body: { job: bundle.inputData }
    body: { job: job }
  });
  // this should return a single object
  return response.data;
};

module.exports = {
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/main/packages/schema/docs/build/schema.md#createschema
  key: 'job_update',
  noun: 'Job',

  display: {
    label: 'Update Job',
    description: 'Update job.'
  },

  operation: {
    perform,

    // `inputFields` defines the fields a user could provide
    // Zapier will pass them in as `bundle.inputData` later. They're optional.
    // End-users will map data into these fields. In general, they should have any fields that the API can accept. Be sure to accurately mark which fields are required!
    inputFields: [
      {
        key: 'job_uid',
        required: true
      },
      {
        key: 'customer_uid',
      },
      {
        key: 'job_title',
      },
      {
        key: 'job_category',
      },
      {
        key: 'job_priority',
        required: false,
        choices: {
          'LOW': 'Low',
          'MEDIUM': 'Medium',
          'HIGH': 'High',
          'URGENT': 'Urgent'
        }
      },
      {
        key: 'due_date',
        type: 'datetime'
      },
      {
        key: 'organization',
        required: false
      },
      {
        key: 'property',
        required: false
      },
      {
        key: 'customer_address',
        children: [
          {
            key: 'customer_address__city'
          },
          {
            key: 'customer_address__state'
          },
          {
            key: 'customer_address__street'
          },
          {
            key: 'customer_address__country'
          },
          {
            key: 'customer_address__zip_code'
          },
          {
            key: 'customer_address__geo_coordinates__latitude',
            type: 'number'
          },
          {
            key: 'customer_address__geo_coordinates__longitude',
            type: 'number'
          }
        ]
      },
      {
        key: 'job_description',
        required: false
      },
      {
        key: 'team_uid',
        required: false
      }
    ],

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obvious placeholder values that we can show to any user.
    sample: {
      job_uid: 'd4e8fdq4a-fq56fcq-fqef8',
      customer_uid: 'd4e8fdq4a-fq56fcq-fqef8',
      job_title: 'Job Title',
      job_category: 'd4e8fdq4a-fq56fcq-fqef8',
      due_date: '2021-08-18T00:00:00Z',
      organization: '2b7005b0-61ec-11eb-be1a-5f41b7fdd76b',
      property: 'b48bb210-6203-11eb-915b-e306107ad87d',
      customer_address: {
        customer_address__city: 'City',
        customer_address__state: 'State',
        customer_address__street: 'Street',
        customer_address__country: 'Country',
        customer_address__zip_code: 'Zip Code'
      },
      job_description: 'Job Description',
      team_uid: 'd4e8fdq4a-fq56fcq-fqef8'
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
