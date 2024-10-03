# Kanban Board Clone

This project is a Kanban board clone built using **React**, **TypeScript**, and **Vite**. It provides a simple task management interface with drag-and-drop functionality using `react-beautiful-dnd`. The backend for managing tasks is handled by **Node.js**, **Express**, and **PostgreSQL**.

## Features

- **Add Tasks:** Easily add new tasks to any column.
- **Edit Tasks:** Edit the title and description of tasks.
- **Delete Tasks:** Remove tasks after confirmation.
- **Drag-and-Drop:** Move tasks between columns using drag-and-drop.
- **Responsive Design:** Works well on various screen sizes.

## Tech Stack

### Frontend:

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: Adds type safety to JavaScript.
- **Vite**: A fast development environment for modern web projects.
- **react-beautiful-dnd**: Handles drag-and-drop interactions.
- **shadcn UI** and **TailwindCSS**: For custom styling and UI components.
- **Icons**: Using `react-icons` for UI icons.

### Backend (Assumed setup):

- **Node.js**: JavaScript runtime for the backend.
- **Express**: Web framework for building the backend API.
- **PostgreSQL**: Database for storing task and column information.

## Installation and Setup

To run the project locally, follow these steps:

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (>=14.x)
- **Vite** (bundled with this project)
- **PostgreSQL** (if backend is set up for data persistence)

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/m4hosam/pigon-kanban-clone.git
   cd pigon-kanban-clone/frontend
   ```

2. **Install dependencies:**

   Install the project dependencies using the package manager:

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   If you have a `.env` file for the backend (PostgreSQL connection), configure the environment variables accordingly.

   ```
   VITE_API_URL='http://localhost:3000'
   ```

4. **Run the project:**

   Start the development server using Vite:

   ```bash
   npm run dev
   ```

5. **Build the project for production:**

   To build the project for deployment:

   ```bash
   npm run build
   ```

6. **Run e2e tests:**

   The project uses **Cypress** for e2e testing. Run the tests with:

   ```bash
   npm run cypress:open
   ```

## Folder Structure

- **/src**: Contains all the frontend code, including components, hooks, types, and utilities.
  - **/components**: Includes reusable UI components like `Card` and `Column`.
  - **/ui**: Contains UI elements such as buttons, inputs, and modals.
  - **/types**: TypeScript types used across the app.
  - **/pages**: Main application pages and views.

## Usage

1. **Adding a Task**: Click the "Add Task" button to open a form. Enter a title and description for the task and click "Add."
2. **Editing a Task**: Click the edit icon on a task to change its title or description. Click "Save" to update the task.
3. **Deleting a Task**: Click the delete icon, confirm the deletion, and the task will be removed.
4. **Drag-and-Drop**: Click and drag a task to move it between columns.
