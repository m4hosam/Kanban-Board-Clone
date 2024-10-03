import { useState } from "react";
import Card from "./Card";
import {
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from "react-beautiful-dnd";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ColumnProps } from "@/types";
import "./scroll.css"; // Custom CSS for scrollbars
import { FaPlus } from "react-icons/fa";

export default function Column({
  title,
  tasks,
  id,
  addTask,
  updateTask,
  deleteTask,
}: ColumnProps) {
  // State to manage new task form visibility
  const [isAddingTask, setIsAddingTask] = useState(false);
  // States for new task inputs
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  // Function to handle task addition
  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle, newTaskDescription, id);
      setNewTaskTitle(""); // Reset input fields
      setIsAddingTask(false); // Close form after adding
    }
  };

  return (
    <div
      className="column bg-gray-100 rounded-md w-[300px] md:w-[400px] md:h-[500px] h-[470px] overflow-y-scroll border scrollbar-hide"
      data-cy={`column-${id.toLowerCase().replace(" ", "-")}`}
    >
      <h3
        className="p-2 bg-green-600 text-white font-medium text-center sticky top-0 z-10"
        data-cy="column-title"
      >
        {title}
      </h3>

      <div className="p-2">
        {isAddingTask ? (
          <div className="flex flex-col gap-2 " data-cy="add-task-form">
            <Input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Title"
              data-cy="new-task-title"
            />
            <Input
              type="text"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Description"
              data-cy="new-task-description"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleAddTask}
                className="rounded-md w-1/2"
                data-cy="add-task-submit"
              >
                Add Task
              </Button>
              <Button
                onClick={() => setIsAddingTask(false)}
                className="rounded-md w-1/2"
                variant="destructive"
                data-cy="add-task-cancel"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingTask(true)}
            className="flex bg-green-200 text-white py-3 w-full rounded-md text-center items-center justify-center"
            data-cy="add-task-button"
          >
            <FaPlus size={13} className="text-green-900 " />
          </button>
        )}
      </div>

      <Droppable droppableId={id}>
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-1 transition-colors ease-in-out duration-200 flex-grow min-h-[100px] border-r-4 ${
              snapshot.isDraggingOver ? "bg-gray-300" : "bg-gray-100"
            }`}
            data-cy="task-list"
          >
            {tasks.map((task, index) => (
              <Card
                key={task.id}
                index={index}
                task={task}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
