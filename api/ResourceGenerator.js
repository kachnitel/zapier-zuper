require('dotenv').config();
const Swagger = require('./Zuper/zuper-64d0f29eed551011e0c7f4f3.json');
console.log(Swagger);
class ResourceGenerator {
  constructor() {
    this._resources = [];
  }

  getResource(key) {
    if (!this._resources.length) {
      this.generate();
    }

    return this._resources.find(r => r.key === key);
  }

  /**
   * get https://api.woodelivery.com/swagger/v1/swagger.json and parse it
   * for each path, get the response schema and generate output fields
   */
  generate() {
    this.forEachKey(Swagger.components.schemas, (component, schema) => {
      // skip resources not ending in Model
      if (!component.endsWith('Model')) {
        return;
      }

      const resource = this.generateResource(component, schema);
      this._resources.push(resource);
    });

    return this._resources;
  }

  /**
   * generate a resource for a component
   */
  generateResource(component) {
    const schema = Swagger.components.schemas[component];

    const resource = {
      key: component.replace(/Model$/, '').toLowerCase(),
      noun: this._generateNoun(component),
      sample: this._generateSample(schema.properties),
      outputFields: this._generateOutputFields(component)
    };

    return resource;
  }

  /**
   * Generate the actions for a component.
   *
   * Finds all paths that send or receive the component as a request or response
   * Look into Swagger.paths[][].responses.2??.content.*.schema.$ref
   * If it is a reference to a schema, then it is an action (format "#/components/schemas/{component}")
   */
  generateActions(component, resourceKey) {
    const actions = {};

    this.forEachKey(Swagger.paths, (path, methods) => {
      this.forEachKey(methods, (method, methodSpec) => {
        const description = methodSpec.summary;
        const responses = methodSpec.responses;
        const requestData = methodSpec.requestBody;

        this.forEachKey(responses, (responseCode, responseSpec) => {
          if (responseCode > 299) {
            return;
          }

          let responseSpecSchema = responseSpec.content?.['application/json']?.schema;

          if (!responseSpecSchema) {
            return;
          }

          let responseRef = responseSpecSchema.$ref || responseSpecSchema.items?.$ref;

          if (!responseRef || responseRef !== `#/components/schemas/${component}`) {
            return;
          }

          // find matching request data
          let requestRefSchema = requestData?.content?.['application/json']?.schema;

          if (!requestRefSchema) {
            // TODO: no request data, but response is a model, so it is a list action;
            // update _generateAction to handle this (no inputFields)
            return;
          }

          let requestRef = requestRefSchema.$ref || requestRefSchema.items?.$ref;

          if (!requestRef) {
            return;
          }

          // get Model name from ref
          const requestModelName = requestRef.split('/').pop();

          // TODO: not a part of action, but needs to be known to enable returning line items
          // if Zapier receives array, it will return only first line item.
          // if array is enclosed in an object, it will return all line items.
          // https://github.com/zapier/zapier-platform/blob/main/packages/cli/README.md#returning-line-items-array-of-objects
          // If array is detected, allow setting the action to return data wrapped in an object
          let isRequestArray = requestRefSchema.type === 'array';
          let isResponseArray = responseSpecSchema.type === 'array';

          actions[`${method}_${requestModelName}`] = this._generateAction(
            component,
            path,
            method,
            requestModelName,
            resourceKey,
            description
          );
        });
      });
    });

    return actions;
  }

  _generateAction(component, path, method, requestModelName, resourceKey, description) {
    const action = {
      key: `${method}_${requestModelName}`,
      noun: this._generateNoun(component),
      display: {
        label: this._generateActionNoun(requestModelName),
        description: description
      },
      operation: {
        resource: resourceKey,
        inputFields: this._generateInputFields(requestModelName),
        // outputFields: this._generateOutputFields(component),
        perform: this._generatePerform(path, method)
      }
    };

    return action;
  }


  _generateInputFields(modelName) {
    // find ref in components.schemas
    let schema = Swagger.components.schemas[modelName];

    if (!schema) {
      throw new Error(`Could not find schema for ${modelName}`);
    }

    const fields = this._generateFields(schema.properties, schema.required);

    return fields;
  }

  // _generateOutputFields(schema) {
  _generateOutputFields(modelName) {
    const properties = Swagger.components.schemas[modelName].properties;
    const required = Swagger.components.schemas[modelName].required;
    const fields = this._generateFields(properties, required);
    // const fields = this._generateFields(schema.properties, schema.required);
    return fields;
  }

  /**
   * @param {object} properties
   * @param {array} required
   */
  _generateFields(properties, required = []) {
    const fields = [];
    this.forEachKey(properties, (key, property) => {
      const field = {
        key: key,
        label: this._generateFieldLabel(key),
        type: this._generateFieldType(property),
        required: required.includes(key),
        helpText: property.description
      };

      fields.push(field);
    });

    return fields;
  }

  _generateFieldType(property) {
    if (property.type === 'string' && property.format === 'date-time') {
      return 'datetime';
    }

    if (property.type === 'array' && property.items?.$ref) {
      return 'string';
      // TODO: dynamic field with id of ref? or id and name object?
    }

    return property.type;
  }

  _generateFieldLabel(key) {
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/(?<!^)([A-Z])(?![A-Z])/g, ' $1');
  }

  _generateSample(properties) {
    const sample = {};
    this.forEachKey(properties, (key, property) => {
      let sampleValue = null;

      if (property.type === 'string') {
        sampleValue = key + ' value';
      } else if (property.type === 'integer') {
        sampleValue = 1;
      } else if (property.type === 'boolean') {
        sampleValue = true;
      } else if (property.type === 'array') {
        sampleValue = [];
      } else if (property.type === 'object') {
        sampleValue = {};
      }

      sample[key] = sampleValue;
    });

    return sample;
  }

  _generateNoun(component) {
    return component.replace(/Model$/, '');
  }

  _generateActionNoun(modelName) {
    return modelName.replace(/Request$/, '').replace(/(?<!^)([A-Z])(?![A-Z])/g, ' $1');
  }

  _generatePerform(path, method) {
    const ucMethod = method.toUpperCase();

    return async (z, bundle) => {
      const url = `${process.env.BASE_URL}${path}`;
      const params = ucMethod === 'GET' ? bundle.inputData : {};
      const body = ucMethod === 'POST' ? bundle.inputData : {};
      const headers = ucMethod === 'POST' ? {
        'Content-Type': 'application/json'
      } : {};

      const response = await z.request({
        url: url,
        method: ucMethod,
        params: params,
        body: body,
        headers: headers
      });

      return response.json.data;
    };
  }

  forEachKey(obj, callback) {
    Object.keys(obj).forEach(key => {
      if (undefined === obj[key]) {
        throw new Error(`Undefined value for key ${key}`);
      }
      callback(key, obj[key]);
    });
  }
}

module.exports = ResourceGenerator;
