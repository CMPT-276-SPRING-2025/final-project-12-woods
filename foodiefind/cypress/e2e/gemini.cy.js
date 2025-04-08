describe('Gemini Integration', () => {
  beforeEach(() => {
    cy.visit('/gemini');
  });

  it('loads the chat interface', () => {
    cy.get('input[placeholder*="type your message"]').should('exist');
    cy.get('button').contains('Send').should('exist');
  });

  it('allows sending messages', () => {
    const testMessage = 'Hello, Gemini!';
    
    // Type and send a message
    cy.get('input[placeholder*="type your message"]').type(testMessage);
    cy.get('button').contains('Send').click();
    
    // Verify message appears in chat
    cy.contains(testMessage).should('exist');
    
    // Wait for and verify response
    cy.wait(1000);
    cy.contains('Mocked Gemini response').should('exist');
  });

  it('shows loading state while waiting for response', () => {
    cy.get('input[placeholder*="type your message"]').type('Test message');
    cy.get('button').contains('Send').click();
    
    // Verify loading state
    cy.contains('Loading').should('exist');
    
    // Wait for response and verify loading state is gone
    cy.wait(1000);
    cy.contains('Loading').should('not.exist');
  });

  it('handles multiple messages in conversation', () => {
    const messages = [
      'Hello, Gemini!',
      'How are you?',
      'Tell me about food'
    ];
    
    messages.forEach(message => {
      cy.get('input[placeholder*="type your message"]').type(message);
      cy.get('button').contains('Send').click();
      cy.contains(message).should('exist');
      cy.wait(1000);
    });
    
    // Verify all messages and responses are in the chat
    messages.forEach(message => {
      cy.contains(message).should('exist');
    });
    cy.contains('Mocked Gemini response').should('have.length.at.least', messages.length);
  });

  it('clears input after sending message', () => {
    const testMessage = 'Test message';
    
    cy.get('input[placeholder*="type your message"]').type(testMessage);
    cy.get('button').contains('Send').click();
    
    cy.get('input[placeholder*="type your message"]').should('have.value', '');
  });
}); 