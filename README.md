# Kanban Board Project

This project is a full-stack Kanban board application built using modern web technologies. It consists of a React frontend and a Node.js backend, both containerized using Docker for easy deployment and development.

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Folder Structure](#folder-structure)
4. [Prerequisites](#prerequisites)
5. [Getting Started](#getting-started)
6. [API Endpoints](#api-endpoints)
7. [Frontend Usage](#frontend-usage)
8. [Running Tests](#running-tests)
9. [Deployment](#deployment)

## Features

- **Add Tasks:** Easily add new tasks to any column.
- **Edit Tasks:** Edit the title and description of tasks.
- **Delete Tasks:** Remove tasks after confirmation.
- **Drag-and-Drop:** Move tasks between columns using drag-and-drop.
- **Responsive Design:** Works well on various screen sizes.
- **RESTful API:** Backend provides a complete set of CRUD operations for tasks.
- **Database Persistence:** Tasks are stored in a PostgreSQL database.

## Tech Stack

### Frontend:

- React with TypeScript
- Vite for fast development and building
- react-beautiful-dnd for drag-and-drop functionality
- shadcn UI and TailwindCSS for styling
- react-icons for UI icons

### Backend:

- Node.js with Express
- TypeScript
- Prisma ORM for database operations
- PostgreSQL for data storage
- Jest for testing

### DevOps:

- Docker and Docker Compose for containerization
- Postman collection for API testing

## Folder Structure

```
kanban-board-project/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │       ├── ui/
│   │       ├── Board.tsx
│   │       ├── Card.tsx
│   │       ├── Column.tsx
│   │       └── scroll.css
│   │   ├── App.tsx
│   ├── public/
│   ├── package.json
│   └── Dockerfile
│
├── backend/
│   ├── src/
│   │   ├── __tests__/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── app.ts
│   ├── prisma/
│   ├── __tests__/
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
├── Kanban Pigon.postman_collection.json
└── README.md
```

## Prerequisites

- Docker and Docker Compose
- Node.js (v20 or later) for local development

## Getting Started

1. Clone the repository:

   ```
   git clone https://github.com/m4hosam/pigon-kanban-clone.git
   cd pigon-kanban-clone
   ```

2. Start the application using Docker Compose:

   ```
   docker-compose up --build
   ```

The frontend will be available at `http://localhost:8080`, and the backend API at `http://localhost:3000`.

## API Endpoints

- `POST /tasks`: Create a new task
- `GET /tasks`: Retrieve all tasks
- `PUT /tasks/:id`: Update a task
- `PATCH /tasks/:id`: Partially update a task
- `DELETE /tasks/:id`: Delete a task

For detailed API testing, you can use the provided Postman collection: `Kanban Pigon.postman_collection.json`.

## Frontend Usage

1. **Adding a Task**: Click the "Add Task" button, enter a title and description, then click "Add."
2. **Editing a Task**: Click the edit icon on a task, make changes, and click "Save."
3. **Deleting a Task**: Click the delete icon and confirm the deletion.
4. **Drag-and-Drop**: Click and drag a task to move it between columns.

## Running Tests

### Backend Tests

Before running the tests, ensure that all dependencies are installed and the `DATABASE_URL` for PostgreSQL is added to your `.env` file.

To run the backend tests, execute the following command:

```bash
npm run test
```

For more details, refer to the [Backend README](backend/README.md).

### Frontend E2E Tests

Ensure that all dependencies are installed and the `VITE_API_URL` for the backend is included in your `.env` file.

To run the end-to-end tests for the frontend, use the following command:

```bash
npm run cypress:open
```

For more information, check the [Frontend README](frontend/README.md).

---

Feel free to adjust any part of it further!
