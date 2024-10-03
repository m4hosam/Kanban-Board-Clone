import { useState } from "react";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { CardProps } from "@/types";
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

interface ContainerProps {
  isDragging: boolean;
}

// Function to determine background color based on drag state
function getBackgroundColor({ isDragging }: ContainerProps): string {
  return isDragging ? "bg-gray-200 bg-opacity-70" : "bg-white";
}

export default function TaskCard({
  task,
  index,
  updateTask,
  deleteTask,
}: CardProps) {
  // State to track if the task is being edited
  const [isEditing, setIsEditing] = useState(false);
  // States for editing task title and description
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);

  // Handle task update after editing
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
            { isDragging: snapshot.isDragging }
          )}`}
        >
          {/* Editing mode: input fields for title and description */}
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>
          ) : (
            // Display task title and description when not editing
            <div className="flex flex-row gap-2 items-start">
              <div className="flex flex-col gap-2 w-[90%]">
                <p className="text-left text-black font-medium">{task.title}</p>
                <p className="text-left text-gray-500 text-sm">
                  {task.description}
                </p>
              </div>
              {/* Edit button */}
              <button
                className="bg-transparent hover:border-white py-1 px-3"
                onClick={() => setIsEditing(true)}
              >
                <FaRegEdit className="text-slate-600" />
              </button>
            </div>
          )}

          {/* Footer with save/cancel buttons or delete dialog */}
          <div className="flex justify-end items-end p-1 mt-2">
            {isEditing ? (
              // Buttons for saving or canceling edits
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
              // Dialog for confirming task deletion
              <Dialog>
                <DialogTrigger asChild>
                  <button className="bg-transparent hover:border-white py-2 px-3">
                    <MdDelete className="text-red-600 " />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Are You Sure?</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this task?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-between flex-row-reverse w-full gap-3">
                    {/* Confirm delete button */}
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

                    {/* Cancel delete button */}
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
