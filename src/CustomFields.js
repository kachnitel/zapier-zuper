const getCustomFields = async (z, bundle) => {
  const endpoint = 'settings/custom_fields';
  const url = `https://${bundle.authData.region}.zuperpro.com/api/${endpoint}?module_name=JOB`;

  const response = await z.request({
    method: 'GET',
    url: url
  });

  const customFields = response.data.data.map(field => {
    return {
      key: field._id,
      label: field.field_name
    };
  });

  return customFields;
}

/**
 * customFields: [
 *   {"key":"6639631ac29f4ace04386586","label":"Stove type"},
 *   {"key":"6639631ac29f4ace04386589","label":"Order ID"},
 *   ...
 * ]
 *
 * bundle.inputData: {
 *   ...
 *   "6639631ac29f4ace04386586":"Electric",
 *   "6639631ac29f4ace04386589":"20987",
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

module.exports = {
  getCustomFields,
  getCustomFieldsData
};
