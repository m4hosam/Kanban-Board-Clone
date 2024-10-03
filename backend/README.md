# Kanban Backend Service

This is a backend service for a Kanban board application built with Node.js, Express, TypeScript, and Prisma ORM. It provides RESTful API endpoints for managing tasks in a Kanban board.

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Folder Structure](#folder-structure)
4. [Prerequisites](#prerequisites)
5. [Getting Started](#getting-started)
6. [API Endpoints](#api-endpoints)
7. [Running Tests](#running-tests)
8. [Deployment](#deployment)

## Features

- Create, read, update, and delete tasks
- Move tasks between different statuses (To Do, In Progress, Done)
- RESTful API design
- PostgreSQL database for data persistence
- Dockerized application for easy deployment

## Tech Stack

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Jest (for testing)
- Docker

## Folder Structure

```
kanban-backend/
│
├── src/
│   ├── controllers/
│   │   └── TaskController.ts
│   ├── models/
│   │   └── Task.ts
│   ├── routes/
│   │   └── taskRoutes.ts
│   ├── services/
│   │   └── TaskService.ts
│   └── app.ts
│
├── prisma/
│   └── schema.prisma
│
├── __tests__/
│   ├── TaskService.test.ts
│   └── TaskController.test.ts
│
├── dist/            # Compiled JavaScript files
├── node_modules/
├── .env
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── jest.config.js
├── package.json
├── README.md
└── tsconfig.json
```

## Prerequisites

- Node.js (v14 or later)
- Docker and Docker Compose
- PostgreSQL (if running locally without Docker)

## Getting Started

1. Clone the repository:

   ```
   git clone https://github.com/m4hosam/pigon-kanban-clone.git
   cd pigon-kanban-clone/backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your postgreSQL connection as following:

   ```
   DATABASE_URL="postgresql://kanbanuser:kanbanpassword@postgres:5432/kanban?schema=public"
   ```

4. Run the application using Docker:

   ```
   docker-compose up --build
   ```

The server should now be running at `http://localhost:3000`.

## API Endpoints

- `POST /tasks`: Create a new task
- `GET /tasks`: Retrieve all tasks
- `PUT /tasks/:id`: Update a task
- `PATCH /tasks/:id`: Partially update a task
- `DELETE /tasks/:id`: Delete a task

## Running Tests

To run the test suite:

```
npm test
```

## Deployment

1. Ensure you have Docker and Docker Compose installed on your deployment machine.

2. Clone the repository on your deployment machine.

3. Create a `.env` file with the appropriate database URL for your production environment.

4. Build and run the Docker containers:

   ```
   docker-compose up --build -d
   ```



Your Kanban backend service should now be deployed and running.

For any issues or questions, please open an issue in the GitHub repository.
