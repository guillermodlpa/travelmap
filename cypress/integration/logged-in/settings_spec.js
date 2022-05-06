describe('Logged In Test', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.login({
      username: Cypress.env('auth0Username'),
      password: Cypress.env('auth0Password'),
    });

    cy.visit('/my/maps'); // this is the callback URL defined in Auth0
  });

  it('enables the user to go to settings', () => {
    cy.get('[aria-label="Settings"]').click();
    cy.contains("Cypress Test User's Settings");
  });
});
