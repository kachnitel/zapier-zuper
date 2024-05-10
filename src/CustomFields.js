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
      label: field.field_name,
      // type: field.field_type
    };
  });

  // return customFields;
  return {
    key: 'custom_fields',
    children: customFields
  };
}

const getCustomFieldsData = async (z, bundle) => {
  const customFields = await this.getCustomFields(z, bundle);

  return Object.keys(bundle.inputData.custom_fields[0]).map(key => {
    return {
      label: customFields.children.find(field => field.key === key).label,
      value: bundle.inputData.custom_fields[0][key]
    };
  });
}

module.exports = {
  getCustomFields,
  getCustomFieldsData
};
