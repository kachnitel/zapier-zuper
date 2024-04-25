const chalk = require('chalk');
const readline = require('readline');
const ResourceGenerator = require('../api/ResourceGenerator');

const generator = new ResourceGenerator();
const resources = generator.generate();

const actions = {};

function renderField(field) {
  let entry = `- (${field.type}) ${field.key} [${field.label}]`;
  if (field.required) {
    entry = chalk.bold.green(entry);
  } else {
    entry = chalk.green(entry);
  }

  if (field.helpText) {
    entry += chalk.dim(`  ${field.helpText}`);
  }

  if (field.sample) {
    entry += chalk.gray(`  ${field.sample}`);
  }

  return entry;
}

function renderHeader() {
  return chalk.green(`- (type) key [label]`) + chalk.dim(`  helpText`) + chalk.gray(`  sample`) + '\n'
       + chalk.green(`- (----) --- [-----]`) + chalk.dim(`  --------`) + chalk.gray(`  ------`) + '\n';
}

/**
 * Show the operation.inputFields and operation.outputFields for an action,
 * operation.resource if defined
 * @param {int} actionIndex
 */
function showDetails(actionIndex) {
  let action = actions[actionIndex];

  process.stdout.write(chalk.bold.green(action.display.label) + '\n');
  process.stdout.write(chalk.dim(action.display.description) + '\n');

  process.stdout.write(chalk.bold.green(action.noun) + ' ' + chalk.yellow(action.key) + '\n');
  process.stdout.write(chalk.yellow('Input fields:\n'));
  process.stdout.write(renderHeader());
  Object.keys(action.operation.inputFields).forEach(inputFieldIndex => {
    let inputField = action.operation.inputFields[inputFieldIndex];
    process.stdout.write(renderField(inputField) + '\n');
  });

  let resource = resources.find(resource => resource.key === action.operation.resource);
  let outputFields = action.operation.outputFields
    || resource.outputFields
    || {};

  process.stdout.write(chalk.yellow(action.operation.outputFields ? 'Output fields:\n' : 'Output fields (resource):\n'));
  process.stdout.write(renderHeader());
  Object.keys(outputFields).forEach(outputFieldIndex => {
    let outputField = outputFields[outputFieldIndex];
    // add sample if defined
    if (resource.sample && resource.sample[outputField.key]) {
      outputField.sample = resource.sample[outputField.key];
    }
    process.stdout.write(renderField(outputField) + '\n');
  });

  if (action.operation.resource) {
    process.stdout.write(chalk.yellow('Resource:\n'));
    process.stdout.write(chalk.green(`- ${action.operation.resource}\n`));
  }

  process.exit(0);
}


process.stdout.write(chalk.bold.green('Resources:\n'));

let i = 0;
Object.keys(resources).forEach(key => {
  const resource = resources[key];
  let model = resource.noun + 'Model';
  let resourceActions = generator.generateActions(model, resource.key);

  process.stdout.write(chalk.bold.green(resource.noun) + ' ');
  process.stdout.write(chalk.yellow('Actions:\n'));
  Object.keys(resourceActions).forEach(actionName => {
    process.stdout.write(chalk.green(`- [${++i}] ${actionName}\n`));

    actions[i] = resourceActions[actionName];
  });
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question(
  'Please enter the number of the resource you want to display details for (hit enter to quit): ',
  (resourceNumber) => {
    if (!resourceNumber) {
      process.exit(0);
    }

    if (!actions[resourceNumber]) {
      console.error(chalk.red('Invalid resource number'));
      process.exit(1);
    }

    showDetails(resourceNumber);

    rl.close();
  }
);
