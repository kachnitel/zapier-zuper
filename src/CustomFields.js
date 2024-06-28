const getCustomFields = async (z, bundle) => {
  const endpoint = 'settings/custom_fields';
  const url = `https://${bundle.authData.region}.zuperpro.com/api/${endpoint}?module_name=JOB`;

  const response = await z.request({
    method: 'GET',
    url: url
  });

  const customFields = response.data.data.map(field => {
    return {
      key: snakeCase(field.field_name),
      label: field.field_name
    };
  });

  return customFields;
}

/**
 * customFields: [
 *   {"key":"stove_type","label":"Stove type"},
 *   {"key":"order_id","label":"Order ID"},
 *   ...
 * ]
 *
 * bundle.inputData: {
 *   ...
 *   "stove_type":"Electric",
 *   "order_id":"20987",
 *
 * ...
 * }
 *
 * payload: {
 *   "label": "Stove Type",
 *   "value": "Stuff"
 *   ...
 * }
 *
 * Find labels for custom fields
 * if inputData property name matches a custom field key, then add a new object to customFieldsData array
 */
const getCustomFieldsData = async (z, bundle) => {
  const customFields = await getCustomFields(z, bundle);

  const customFieldsData = [];

  Object.keys(bundle.inputData).forEach(key => {
    const field = customFields.find(field => field.key === key);

    if (field) {
      customFieldsData.push({
        label: field.label,
        value: bundle.inputData[key]
      });
    }
  });

  return customFieldsData;
}

/**
 * Convert field name to snake case
 *
 * @param {string} subject
 * @returns
 */
const snakeCase = (subject) => {
  return subject.toLowerCase().replace(/ /g, '_');
}

module.exports = {
  getCustomFields,
  getCustomFieldsData
};
