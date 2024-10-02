import React, { useState } from "react";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Task } from "@/types";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CardProps {
  task: Task;
  index: number;
  updateTask: (id: string, updatedTask: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

interface ContainerProps {
  isDragging: boolean;
}

function getBackgroundColor({ isDragging }: ContainerProps): string {
  return isDragging ? "bg-gray-200 bg-opacity-70" : "bg-white";
}

export default function TaskCard({
  task,
  index,
  updateTask,
  deleteTask,
}: CardProps) {
  const [isEditing, setIsEditing] = useState(false); // State to track if the card is being edited
  const [editTitle, setEditTitle] = useState(task.title); // State for edited title
  const [editDescription, setEditDescription] = useState(task.description); // State for edited description

  // Function to handle saving the task after editing
  const handleSave = () => {
    updateTask(task.id, { title: editTitle, description: editDescription });
    setIsEditing(false); // Exit edit mode after saving
  };

  return (
    <Draggable draggableId={`${task.id}`} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`rounded-lg shadow-md p-4 mb-4 min-h-[120px] mx-2 cursor-pointer flex flex-col justify-between ${getBackgroundColor(
            {
              isDragging: snapshot.isDragging,
            }
          )}`}
        >
          {isEditing ? (
            <div className="flex flex-col gap-2">
              {/* Input for editing the task title */}
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              {/* Input for editing the task description */}
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>
          ) : (
            <div className="flex flex-row gap-2 items-start">
              <div className="flex flex-col gap-2 w-[90%]">
                <div>
                  <p className="text-left text-black font-medium">
                    {task.title}
                  </p>
                </div>
                <div>
                  <p className="text-left text-gray-500 text-sm">
                    {task.description}
                  </p>
                </div>
              </div>
              <button
                className="bg-transparent hover:border-white py-1 px-3"
                onClick={() => setIsEditing(true)}
              >
                <FaRegEdit className="text-slate-600" />
              </button>
            </div>
          )}
          <div className="flex justify-end items-end  p-1 mt-2">
            {isEditing ? (
              // Display Save and Cancel buttons while editing
              <>
                <Button className="py-0 px-3 mr-2 w-1/2" onClick={handleSave}>
                  Save
                </Button>
                <Button
                  className="py-0 px-3 w-1/2"
                  variant="destructive"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              // Display Edit button when not editing

              <Dialog>
                <DialogTrigger asChild>
                  <button className="bg-transparent hover:border-white py-2 px-3">
                    <MdDelete className="text-red-600 " />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Are You sure</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete the Task?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-between flex-row-reverse w-full gap-3">
                    <DialogClose asChild className="w-1/2">
                      <Button
                        type="submit"
                        onClick={() => deleteTask(task.id)}
                        variant="destructive"
                        size="sm"
                        className="px-3 w-1/2"
                      >
                        Yes
                      </Button>
                    </DialogClose>

                    <DialogClose asChild className="w-1/2">
                      <Button type="button" variant="secondary">
                        No
                      </Button>
                    </DialogClose>
                  </div>
                  <DialogFooter className="sm:justify-start"></DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
