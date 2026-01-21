module.exports = {
  default: {
    require: ['test/step-definitions/**/*.ts', 'test/support/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'html:test-results/cucumber-report.html',
      'json:test-results/cucumber-report.json',
      'junit:test-results/cucumber-report.xml'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    publishQuiet: true
  },
  security: {
    require: ['test/step-definitions/**/*.ts', 'test/support/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: ['progress-bar', 'html:test-results/security-report.html'],
    tags: '@security'
  },
  authentication: {
    require: ['test/step-definitions/**/*.ts', 'test/support/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: ['progress-bar'],
    tags: '@authentication'
  },
  'user-management': {
    require: ['test/step-definitions/**/*.ts', 'test/support/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: ['progress-bar'],
    tags: '@user-management'
  }
};
