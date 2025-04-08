describe('Google Maps Integration', () => {
  beforeEach(() => {
    cy.visit('/google-maps');
  });

  it('loads the map page', () => {
    cy.get('[data-testid="google-map"]').should('exist');
  });

  it('allows searching for locations', () => {
    cy.get('input[placeholder*="search"]').type('New York');
    cy.get('button').contains('Search').click();
    
    // Wait for search results
    cy.wait(1000);
    
    // Verify search results are displayed
    cy.get('.search-results').should('exist');
  });

  it('displays markers on the map', () => {
    // Wait for map to load
    cy.wait(2000);
    
    // Verify markers are present
    cy.get('[data-testid="marker"]').should('have.length.at.least', 1);
  });

  it('shows location details when clicking a marker', () => {
    // Wait for map to load
    cy.wait(2000);
    
    // Click the first marker
    cy.get('[data-testid="marker"]').first().click();
    
    // Verify location details are displayed
    cy.get('.location-details').should('exist');
  });
}); 