describe('Logged In Test', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.login({
      username: Cypress.env('auth0Username'),
      password: Cypress.env('auth0Password'),
    });

    cy.visit('/my/maps'); // this is the callback URL defined in Auth0
  });

  it('lets the user log out', () => {
    cy.get('[aria-label="Log Out"]').should('exist');

    cy.logout('/');

    cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
    cy.get('[aria-label="Log Out"]').should('not.exist');
  });
});
