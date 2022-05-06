/// <reference types="cypress" />

const encrypt = require('cypress-nextjs-auth0/encrypt');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  on('task', { encrypt });
};
