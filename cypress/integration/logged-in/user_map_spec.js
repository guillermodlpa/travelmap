describe('Logged In Test', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.login({
      username: Cypress.env('auth0Username'),
      password: Cypress.env('auth0Password'),
    });

    cy.visit('/my/maps'); // this is the callback URL defined in Auth0
  });

  it('displays the user map', () => {
    cy.contains('Welcome Cypress Test User');
    cy.get('[data-test="UserMapList"]').within(() => {
      cy.contains('Cypress Test User');
    });
  });

  it('lets the user view their map', () => {
    cy.get('[data-test="UserMapList"]').within(() => {
      cy.contains('View').click();
    });
    cy.contains('Visited countries (7)');
    cy.get('[aria-label="Edit"]').should('exist');
    cy.get('[aria-label="Share"]').should('exist');
  });
});
