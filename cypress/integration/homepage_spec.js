describe('Homepage Test', () => {
  it('Loads recent maps on the dashboard and allows to view them', () => {
    cy.visit('/');

    cy.contains('Recently Created Travelmaps');
    cy.contains('Log In');
    cy.contains('Create a Travelmap');
  });
});
