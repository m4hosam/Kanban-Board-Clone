// src/types.ts
export type ColumnType = "To Do" | "In Progress" | "Done";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Done";
  createdAt: Date;
  updatedAt: Date;
}

export interface ColumnProps {
  title: string;
  tasks: Task[];
  id: string;
  addTask: (
    taskTitle: string,
    taskDescription: string,
    columnId: string
  ) => void;
  updateTask: (id: string, updatedTask: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

export interface CardProps {
  task: Task;
  index: number;
  updateTask: (id: string, updatedTask: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}
