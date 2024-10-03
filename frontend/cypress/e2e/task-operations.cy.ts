// cypress/integration/kanban.spec.js

describe("Kanban Board E2E Tests", () => {
  beforeEach(() => {
    // Visit the application and clear the board before each test
    cy.visit("http://localhost:8080");
    cy.clearBoard();
  });

  it("should load the Kanban board", () => {
    cy.get('[data-cy="board-title"]').should("contain", "Kanban Board");
    cy.get('[data-cy="column-to-do"]').should("be.visible");
    cy.get('[data-cy="column-in-progress"]').should("be.visible");
    cy.get('[data-cy="column-done"]').should("be.visible");
  });

  it("should add a new task", () => {
    const taskTitle = "New Test Task";
    const taskDescription = "This is a test task description";

    cy.addTask("to-do", taskTitle, taskDescription);

    cy.get('[data-cy="column-to-do"]').within(() => {
      cy.get('[data-cy="task-title"]').should("contain", taskTitle);
      cy.get('[data-cy="task-description"]').should("contain", taskDescription);
    });
  });

  it("should edit a task", () => {
    const initialTitle = "Initial Task";
    const initialDescription = "Initial description";
    const updatedTitle = "Updated Task Title";
    const updatedDescription = "This is an updated task description";

    cy.addTask("to-do", initialTitle, initialDescription);

    cy.get('[data-cy="column-to-do"]').within(() => {
      cy.get('[data-cy="edit-task-button"]').first().click();
      cy.get('[data-cy="edit-task-title"]').clear().type(updatedTitle);
      cy.get('[data-cy="edit-task-description"]')
        .clear()
        .type(updatedDescription);
      cy.get('[data-cy="save-task-button"]').click();
    });

    cy.get('[data-cy="task-title"]').should("contain", updatedTitle);
    cy.get('[data-cy="task-description"]').should(
      "contain",
      updatedDescription
    );
  });

  it("should delete a task", () => {
    const taskToDelete = "Task to be deleted";

    cy.addTask("to-do", taskToDelete, "This task will be deleted");
    cy.wait(500); // Wait for DOM to update

    cy.get('[data-cy="column-to-do"]').within(() => {
      cy.get('[data-cy="delete-task-button"]').first().click();
    });

    cy.get('[data-cy="confirm-delete-button"]').click();
    cy.wait(500); // Wait for DOM to update

    cy.get('[data-cy="column-to-do"]').should("not.contain", taskToDelete);
  });

  it("should drag and drop a task between columns", () => {
    const dragTaskTitle = "Drag Test Task";

    cy.addTask("to-do", dragTaskTitle, "This task will be dragged");

    cy.get('[data-cy="column-to-do"]')
      .find(`[data-cy^="task-"]`)
      .contains(dragTaskTitle)
      .as("dragTask");

    cy.get("@dragTask")
      .realMouseDown({ position: "center" })
      .realMouseMove(0, 10, { position: "center" })
      .wait(200);
    cy.get('[data-cy="column-in-progress"]')
      .realMouseMove(0, 0, { position: "center" })
      .realMouseUp();
    // Wait for the drag operation to complete
    cy.wait(500);

    cy.get('[data-cy="column-in-progress"]').should("contain", dragTaskTitle);
  });

  it("should handle adding multiple tasks", () => {
    const tasks = [
      { title: "Task 1", description: "Description 1" },
      { title: "Task 2", description: "Description 2" },
      { title: "Task 3", description: "Description 3" },
    ];

    tasks.forEach((task) => {
      cy.addTask("in-progress", task.title, task.description);
    });

    cy.get('[data-cy="column-in-progress"]').within(() => {
      tasks.forEach((task) => {
        cy.get('[data-cy="task-title"]').should("contain", task.title);
        cy.get('[data-cy="task-description"]').should(
          "contain",
          task.description
        );
      });
    });
  });

  it("should persist tasks after page reload", () => {
    const taskTitle = "Persistent Task";
    cy.addTask("to-do", taskTitle, "This task should persist");
    cy.addTask("in-progress", taskTitle, "This task should persist");
    cy.addTask("done", taskTitle, "This task should persist");

    cy.reload();

    cy.get('[data-cy="column-to-do"]').should("contain", taskTitle);
    cy.get('[data-cy="column-in-progress"]').should("contain", taskTitle);
    cy.get('[data-cy="column-done"]').should("contain", taskTitle);
  });
});
