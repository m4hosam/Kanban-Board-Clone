// cypress.d.ts

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to add a task.
     * @example cy.addTask('Task Title', 'Task Description')
     */
    addTask(
      column: string,
      title: string,
      description: string
    ): Chainable<Element>;
    clearBoard(): Chainable<Element>;
  }
}
