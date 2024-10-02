import React, { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import Column from "./Column";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Done";
  createdAt: Date;
  updatedAt: Date;
}

export default function Board() {
  const [toDo, setToDo] = useState<Task[]>([]);
  const [inProgress, setInProgress] = useState<Task[]>([]);
  const [done, setDone] = useState<Task[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/tasks")
      .then((response) => response.json())
      .then((json: Task[]) => {
        setDone(json.filter((task) => task.status === "Done"));
        setToDo(json.filter((task) => task.status === "To Do"));
        setInProgress(json.filter((task) => task.status === "In Progress"));
        // console.log(toDo);
      });
  }, []);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

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

      // Send update request to the backend
      try {
        const response = await fetch(`http://localhost:3000/tasks/${task.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTask),
        });

        if (response.ok) {
          // Update frontend state
          deletePreviousState(source.droppableId, draggableId);
          // Insert the task into the new position within the same or different column
          if (destination.droppableId === source.droppableId) {
            // Same column - reorder tasks
            reorderTaskInSameColumn(
              destination.droppableId,
              source.index,
              destination.index,
              task
            );
          } else {
            // Different column - update status and place the task in the new column
            task.status =
              destination.droppableId === "1"
                ? "To Do"
                : destination.droppableId === "2"
                ? "In Progress"
                : "Done";
            task.updatedAt = new Date();
            setNewState(destination.droppableId, task);
          }
          // setNewState(destination.droppableId, task);
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

    // Get the tasks from the correct column
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

    // Remove the task from the original position
    columnTasks.splice(sourceIndex, 1);
    // Add the task to the new position
    columnTasks.splice(destinationIndex, 0, movedTask);

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
      const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      const createdTask = await response.json();

      // Now, add the task to the appropriate column in the frontend state
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

  const updateTask = async (taskId: string, updatedTask: Partial<Task>) => {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        // Update task in the frontend state after successful update
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
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the task from the frontend state
        setToDo((prev) => prev.filter((task) => task.id !== taskId));
        setInProgress((prev) => prev.filter((task) => task.id !== taskId));
        setDone((prev) => prev.filter((task) => task.id !== taskId));
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  function findItemById(id: string, array: Task[]): Task | undefined {
    return array.find((item) => item.id === id);
  }

  function removeItemById(id: string, array: Task[]): Task[] {
    return array.filter((item) => item.id !== id);
  }

  function deletePreviousState(sourceDroppableId: string, taskId: string) {
    switch (sourceDroppableId) {
      case "1":
        setToDo(removeItemById(taskId, toDo));
        break;
      case "2":
        setInProgress(removeItemById(taskId, inProgress));
        break;
      case "3":
        setDone(removeItemById(taskId, done));
        break;
    }
  }

  function setNewState(destinationDroppableId: string, task: Task) {
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
