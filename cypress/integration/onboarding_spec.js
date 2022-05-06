describe('Onboarding Test', () => {
  it('registers and lands into the view of editing a map', () => {
    cy.visit('/');

    cy.login({
      username: Cypress.env('auth0NewUserUsername'),
      password: Cypress.env('auth0NewUserPassword'),
    });

    cy.visit('/my/maps'); // this is the callback URL defined in Auth0

    cy.url().should('include', '/map/edit?onboarding');
  });
});
