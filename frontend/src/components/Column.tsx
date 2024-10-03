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
import { IoIosAdd } from "react-icons/io"; // Icon for the Add Task button

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
    <div className="column bg-gray-100 rounded-md w-[300px] md:w-[400px] h-[500px] overflow-y-scroll border scrollbar-hide">
      {/* Column title */}
      <h3 className="p-2 bg-green-600 text-white font-medium text-center sticky top-0 z-10">
        {title}
      </h3>

      {/* Section to add a new task */}
      <div className="p-2">
        {isAddingTask ? (
          <div className="flex flex-col gap-2">
            {/* Input for task title */}
            <Input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Title"
            />
            {/* Input for task description */}
            <Input
              type="text"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Description"
            />
            <div className="flex gap-2">
              {/* Button to add task */}
              <Button onClick={handleAddTask} className="rounded-md w-1/2">
                Add Task
              </Button>
              {/* Button to cancel task creation */}
              <Button
                onClick={() => setIsAddingTask(false)}
                className="rounded-md w-1/2"
                variant="destructive"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          // Button to show the form for adding a new task
          <button
            onClick={() => setIsAddingTask(true)}
            className="flex bg-green-200 text-white py-2 w-full rounded-md text-center items-center justify-center"
          >
            <IoIosAdd size={18} className="text-black" />
          </button>
        )}
      </div>

      {/* Droppable area for drag-and-drop functionality */}
      <Droppable droppableId={id}>
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-1 transition-colors ease-in-out duration-200 flex-grow min-h-[100px] ${
              snapshot.isDraggingOver ? "bg-gray-300" : "bg-gray-100"
            }`}
          >
            {/* Mapping through tasks and rendering them as Cards */}
            {tasks.map((task, index) => (
              <Card
                key={task.id}
                index={index}
                task={task}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            ))}
            {/* Placeholder for proper drag-and-drop spacing */}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
