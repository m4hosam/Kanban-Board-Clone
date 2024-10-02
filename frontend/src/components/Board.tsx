import { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import Column from "./Column";
import { Task } from "@/types";

// interface Task {
//   id: string;
//   title: string;
//   description: string;
//   status: "To Do" | "In Progress" | "Done";
//   createdAt: Date;
//   updatedAt: Date;
// }

const apiUrl = import.meta.env.VITE_API_URL;

export default function Board() {
  // console.log(import.meta.env);
  // State hooks to manage tasks in different columns
  const [toDo, setToDo] = useState<Task[]>([]);
  const [inProgress, setInProgress] = useState<Task[]>([]);
  const [done, setDone] = useState<Task[]>([]);

  // Fetch tasks on initial component mount
  useEffect(() => {
    fetch(`${apiUrl}/tasks`)
      .then((response) => response.json())
      .then((tasks: Task[]) => {
        // Organize tasks by their status into separate columns
        setToDo(tasks.filter((task) => task.status === "To Do"));
        setInProgress(tasks.filter((task) => task.status === "In Progress"));
        setDone(tasks.filter((task) => task.status === "Done"));
      })
      .catch((error) => console.error("Failed to fetch tasks:", error));
  }, []);

  // Handle the drag-and-drop task reordering
  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return; // Task dropped outside of a valid destination

    // If the task is dropped in the same position, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Find the task being moved
    const task = findItemById(draggableId, [...toDo, ...inProgress, ...done]);

    if (task) {
      const newStatus =
        destination.droppableId === "1"
          ? "To Do"
          : destination.droppableId === "2"
          ? "In Progress"
          : "Done";

      const updatedTask = { ...task, status: newStatus };

      try {
        // Update task status on the backend
        const response = await fetch(`${apiUrl}/tasks/${task.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTask),
        });

        if (response.ok) {
          // Update the frontend state after a successful backend update
          deletePreviousState(source.droppableId, draggableId);

          if (destination.droppableId === source.droppableId) {
            // Reorder within the same column
            reorderTaskInSameColumn(
              destination.droppableId,
              source.index,
              destination.index,
              task
            );
          } else {
            // Move to a different column
            task.status = newStatus;
            task.updatedAt = new Date(); // Update the timestamp
            setNewState(destination.droppableId, task);
          }
        }
      } catch (error) {
        console.error("Failed to update task:", error);
      }
    }
  };

  // Helper function to reorder tasks within the same column
  const reorderTaskInSameColumn = (
    droppableId: string,
    sourceIndex: number,
    destinationIndex: number,
    movedTask: Task
  ) => {
    let columnTasks: Task[] = [];

    // Determine the correct column based on droppableId
    switch (droppableId) {
      case "1":
        columnTasks = [...toDo];
        break;
      case "2":
        columnTasks = [...inProgress];
        break;
      case "3":
        columnTasks = [...done];
        break;
    }

    // Move the task within the same column
    columnTasks.splice(sourceIndex, 1); // Remove from old position
    columnTasks.splice(destinationIndex, 0, movedTask); // Add to new position

    // Update the state with reordered tasks
    switch (droppableId) {
      case "1":
        setToDo(columnTasks);
        break;
      case "2":
        setInProgress(columnTasks);
        break;
      case "3":
        setDone(columnTasks);
        break;
    }
  };

  // Function to add a new task to the board
  const addTask = async (
    taskTitle: string,
    taskDescription: string,
    columnId: string
  ) => {
    const newTask = {
      title: taskTitle,
      description: taskDescription,
      status:
        columnId === "1" ? "To Do" : columnId === "2" ? "In Progress" : "Done",
    };

    try {
      const response = await fetch(`${apiUrl}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      const createdTask = await response.json();

      // Add the new task to the correct column in the frontend state
      switch (columnId) {
        case "1":
          setToDo((prev) => [...prev, createdTask]);
          break;
        case "2":
          setInProgress((prev) => [...prev, createdTask]);
          break;
        case "3":
          setDone((prev) => [...prev, createdTask]);
          break;
      }
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  // Function to update an existing task
  const updateTask = async (taskId: string, updatedTask: Partial<Task>) => {
    try {
      const response = await fetch(`${apiUrl}/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        // Update the task in the frontend state
        updateLocalState(taskId, updatedTask);
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  // Function to delete a task
  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`${apiUrl}/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the task from the frontend state
        removeTaskFromState(taskId);
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  // Helper functions
  function findItemById(id: string, array: Task[]): Task | undefined {
    return array.find((item) => item.id === id);
  }

  function removeItemById(id: string, array: Task[]): Task[] {
    return array.filter((item) => item.id !== id);
  }

  function deletePreviousState(sourceDroppableId: string, taskId: string) {
    // Remove task from the original column state
    switch (sourceDroppableId) {
      case "1":
        setToDo((prev) => removeItemById(taskId, prev));
        break;
      case "2":
        setInProgress((prev) => removeItemById(taskId, prev));
        break;
      case "3":
        setDone((prev) => removeItemById(taskId, prev));
        break;
    }
  }

  function setNewState(destinationDroppableId: string, task: Task) {
    // Add task to the new column state
    switch (destinationDroppableId) {
      case "1":
        setToDo((prev) => [task, ...prev]);
        break;
      case "2":
        setInProgress((prev) => [task, ...prev]);
        break;
      case "3":
        setDone((prev) => [task, ...prev]);
        break;
    }
  }

  function updateLocalState(taskId: string, updatedTask: Partial<Task>) {
    // Update task in all columns by checking each one
    setToDo((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, ...updatedTask } : task
      )
    );
    setInProgress((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, ...updatedTask } : task
      )
    );
    setDone((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, ...updatedTask } : task
      )
    );
  }

  function removeTaskFromState(taskId: string) {
    // Remove task from all columns by filtering each one
    setToDo((prev) => prev.filter((task) => task.id !== taskId));
    setInProgress((prev) => prev.filter((task) => task.id !== taskId));
    setDone((prev) => prev.filter((task) => task.id !== taskId));
  }
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <h1 className="text-center text-2xl font-medium">Kanban Board</h1>
      <div className="flex justify-between items-center overflow-x-auto flex-row w-1300 mx-auto gap-7">
        <Column
          title={"To Do"}
          tasks={toDo}
          id={"1"}
          addTask={addTask}
          updateTask={updateTask}
          deleteTask={deleteTask}
        />
        <Column
          title={"In Progress"}
          tasks={inProgress}
          id={"2"}
          addTask={addTask}
          updateTask={updateTask}
          deleteTask={deleteTask}
        />
        <Column
          title={"Done"}
          tasks={done}
          id={"3"}
          addTask={addTask}
          updateTask={updateTask}
          deleteTask={deleteTask}
        />
      </div>
    </DragDropContext>
  );
}
