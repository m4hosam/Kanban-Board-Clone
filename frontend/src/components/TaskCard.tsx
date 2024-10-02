// src/components/TaskCard.tsx
import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Task } from "../types";

interface TaskCardProps {
  task: Task;
  index: number;
  onEditTask: (id: string, title: string, description: string) => void;
  onDeleteTask: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  index,
  onEditTask,
  onDeleteTask,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEditTask(task.id, title, description);
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            userSelect: "none",
            padding: 16,
            margin: "0 0 8px 0",
            minHeight: "50px",
            backgroundColor: snapshot.isDragging ? "#f0f0f0" : "white",
            boxShadow: snapshot.isDragging
              ? "0 5px 10px rgba(0, 0, 0, 0.1)"
              : "none",
            borderRadius: "4px",
            ...provided.draggableProps.style,
          }}
        >
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <button type="submit">Save</button>
            </form>
          ) : (
            <>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={() => onDeleteTask(task.id)}>Delete</button>
            </>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
