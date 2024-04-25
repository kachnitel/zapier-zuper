// create a particular customer by name
const perform = async (z, bundle) => {
  const endpoint = 'customers';
  const url = `https://${process.env.ZUPER_REGION}.zuperpro.com/api/${endpoint}`;

  const response = await z.request({
    method: 'POST',
    url: url,
    // if `body` is an object, it'll automatically get run through JSON.stringify
    // if you don't want to send JSON, pass a string in your chosen format here instead
    body: { customer: {
      customer_first_name: bundle.inputData.customerFirstName,
      customer_last_name: bundle.inputData.customerLastName,
      customer_company_name: bundle.inputData.customerCompanyName,
      customer_email: bundle.inputData.customerEmail,
      customer_category: bundle.inputData.customerCategory
    } }
  });
  // this should return a single object
  return response.data;
};

module.exports = {
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/main/packages/schema/docs/build/schema.md#createschema
  key: 'customer',
  noun: 'Customer',

  display: {
    label: 'Create Customer',
    description: 'Creates a new customer, probably with input from previous steps.'
  },

  operation: {
    perform,

    // `inputFields` defines the fields a user could provide
    // Zapier will pass them in as `bundle.inputData` later. They're optional.
    // End-users will map data into these fields. In general, they should have any fields that the API can accept. Be sure to accurately mark which fields are required!
    inputFields: [
      {key: 'customerFirstName', required: true, label: 'First Name', helpText: 'The first name of the customer.'},
      {key: 'customerLastName', required: true, label: 'Last Name', helpText: 'The last name of the customer.'},
      {key: 'customerCompanyName', required: false, label: 'Company Name', helpText: 'The company name of the customer.'},
      {key: 'customerEmail', required: true, label: 'Email', helpText: 'The email of the customer.'},
      // TODO: https://github.com/zapier/zapier-platform/tree/main/packages/cli#dynamic-dropdowns
      {key: 'customerCategory', required: true, label: 'Category', helpText: 'The category of the customer.'}
    ],

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obvious placeholder values that we can show to any user.
    sample: {
      customerFirstName: 'John',
      customerLastName: 'Doe',
      customerEmail: 'johndoe@example.com',
      customerCategory: 'd4e8fdq4a-fq56fcq-fqef8'
    },

    // If fields are custom to each user (like spreadsheet columns), `outputFields` can create human labels
    // For a more complete example of using dynamic fields see
    // https://github.com/zapier/zapier-platform/tree/main/packages/cli#customdynamic-fields
    // Alternatively, a static field definition can be provided, to specify labels for the fields
    // outputFields: [
    //   // these are placeholders to match the example `perform` above
    //   // {key: 'id', label: 'Person ID'},
    //   // {key: 'name', label: 'Person Name'}
    // ]
  }
};
