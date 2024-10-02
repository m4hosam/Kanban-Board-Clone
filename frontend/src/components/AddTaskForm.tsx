// src/components/AddTaskForm.tsx
import React, { useState } from "react";

interface AddTaskFormProps {
  onAddTask: (title: string, description: string) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() !== "" && description.trim() !== "") {
      onAddTask(title, description);
      setTitle("");
      setDescription("");
      setIsFormVisible(false);
    }
  };

  return (
    <div>
      {isFormVisible ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">Add Task</button>
          <button type="button" onClick={() => setIsFormVisible(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <button onClick={() => setIsFormVisible(true)}>Add Task</button>
      )}
    </div>
  );
};

export default AddTaskForm;
