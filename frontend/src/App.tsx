import React, { useState } from "react";
import Column from "./components/Column";
import { Task } from "./types";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

const initialTasks: Task[] = [
  {
    id: uuidv4(),
    title: "Task 1",
    description: "Description 1",
    status: "todo",
  },
  {
    id: uuidv4(),
    title: "Task 2",
    description: "Description 2",
    status: "in-progress",
  },
];

const columnsOrder = ["todo", "in-progress", "done"];

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addTask = () => {
    const newTask: Task = {
      id: uuidv4(),
      title: "New Task",
      description: "New Task Description",
      status: "todo",
    };
    setTasks([...tasks, newTask]);
  };

  const editTask = (taskId: string) => {
    // Edit task logic
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  // Handle task drag and drop between columns
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If there's no destination (e.g., dropped outside any droppable), do nothing
    if (!destination) return;

    // If the task is dropped in the same position, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Get the source column and destination column
    const sourceColumn = source.droppableId;
    const destinationColumn = destination.droppableId;

    // Move task between columns
    setTasks((prevTasks) => {
      const newTasks = [...prevTasks];

      // Remove task from source column
      const [movedTask] = newTasks.splice(source.index, 1);

      // Update the task's status based on the new column
      movedTask.status = destinationColumn as "todo" | "in-progress" | "done";

      // Add task to destination column at the correct position
      newTasks.splice(destination.index, 0, movedTask);

      return newTasks;
    });
  };

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={addTask}
        className="mb-4 bg-blue-500 text-white p-2 rounded"
      >
        Add Task
      </button>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4">
          {columnsOrder.map((col) => (
            <Column
              key={col}
              title={
                col === "todo"
                  ? "To Do"
                  : col === "in-progress"
                  ? "In Progress"
                  : "Done"
              }
              tasks={tasks.filter((task) => task.status === col)}
              onEditTask={editTask}
              onDeleteTask={deleteTask}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default App;
