import React, { useState } from "react";
import Card from "./Card";
import {
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from "react-beautiful-dnd";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Task } from "@/types";
import "./scroll.css";
import { IoIosAdd } from "react-icons/io";

interface ColumnProps {
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

export default function Column({
  title,
  tasks,
  id,
  addTask,
  updateTask,
  deleteTask,
}: ColumnProps) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle, newTaskDescription, id);
      setNewTaskTitle("");
      setIsAddingTask(false);
    }
  };

  return (
    <div className="column bg-gray-100 rounded-md w-[300px] md:w-[400px]  h-[500px] overflow-y-scroll border scrollbar-hide">
      <h3 className="p-2 bg-light-blue-500 text-center sticky top-0 z-10">
        {title}
      </h3>

      {/* Add Task Section */}
      <div className="p-2">
        {isAddingTask ? (
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Title"
            />
            <Input
              type="text"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Description"
            />
            <div className="flex gap-2">
              <Button onClick={handleAddTask} className="rounded-md w-1/2">
                Add Task
              </Button>
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
          <button
            onClick={() => setIsAddingTask(true)}
            className="flex bg-slate-400 text-white py-2 w-full rounded-md text-center items-center justify-center"
          >
            <IoIosAdd size={18} className="text-black" />
          </button>
        )}
      </div>

      <Droppable droppableId={id}>
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-1 transition-colors ease-in-out duration-200 flex-grow min-h-[100px] ${
              snapshot.isDraggingOver ? "bg-gray-300" : "bg-gray-100"
            }`}
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
