/// <reference types="cypress" />
/// <reference types="cypress-real-events" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
// cypress/support/commands.js

Cypress.Commands.add("clearBoard", () => {
  // This assumes you're using localStorage to store tasks
  // If you're using a different storage mechanism, adjust accordingly
  //   cy.window().then((win) => {
  //     win.localStorage.clear();
  //   });
  // If you have a backend, you might want to reset the database here
  cy.request("DELETE", "http://localhost:3000/tasks");
});

Cypress.Commands.add(
  "addTask",
  (column: string, title: string, description: string) => {
    cy.get(`[data-cy="column-${column}"]`).within(() => {
      cy.get('[data-cy="add-task-button"]').click();
      cy.get('[data-cy="new-task-title"]').type(title);
      cy.get('[data-cy="new-task-description"]').type(description);
      cy.get('[data-cy="add-task-submit"]').click();
    });
  }
);
