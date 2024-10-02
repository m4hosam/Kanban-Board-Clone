// src/types.ts
// export type ColumnType = "To Do" | "In Progress" | "Done";

// export interface Task {
//   id: string;
//   title: string;
//   description: string;
//   status: ColumnType;
// }

// src/types.ts
export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
}

export type Status = "todo" | "in-progress" | "done";
