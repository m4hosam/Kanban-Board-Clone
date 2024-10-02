// src/components/Column.tsx
import React from "react";
import { Droppable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";
import AddTaskForm from "./AddTaskForm";
import { Task, ColumnType } from "../types";

interface ColumnProps {
  title: ColumnType;
  tasks: Task[];
  onAddTask: (title: string, description: string, status: ColumnType) => void;
  onEditTask: (id: string, title: string, description: string) => void;
  onDeleteTask: (id: string) => void;
}

const Column: React.FC<ColumnProps> = ({
  title,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
}) => {
  return (
    <Droppable droppableId={title}>
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={{
            minWidth: "300px",
            background: snapshot.isDraggingOver ? "#e0e0e0" : "#f4f5f7",
            borderRadius: "5px",
            padding: "10px",
            transition: "background-color 0.2s ease",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h2>{title}</h2>
          <AddTaskForm
            onAddTask={(taskTitle, description) =>
              onAddTask(taskTitle, description, title)
            }
          />
          <div style={{ flexGrow: 1, minHeight: "100px" }}>
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
              />
            ))}
          </div>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default Column;
