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
        console.log(toDo);
      });
  }, []);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const task = findItemById(draggableId, [...toDo, ...inProgress, ...done]);

    if (task) {
      deletePreviousState(source.droppableId, draggableId);
      task.status =
        destination.droppableId === "1"
          ? "To Do"
          : destination.droppableId === "2"
          ? "In Progress"
          : "Done";
      task.updatedAt = new Date();
      setNewState(destination.droppableId, task);
    }
  };

  const addTask = (
    taskTitle: string,
    taskDescription: string,
    columnId: string
  ) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskTitle,
      description: taskDescription,
      status:
        columnId === "1" ? "To Do" : columnId === "2" ? "In Progress" : "Done",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    switch (columnId) {
      case "1":
        setToDo((prev) => [...prev, newTask]);
        break;
      case "2":
        setInProgress((prev) => [...prev, newTask]);
        break;
      case "3":
        setDone((prev) => [...prev, newTask]);
        break;
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
      <h2 style={{ textAlign: "center" }}>PROGRESS BOARD</h2>
      <div className="flex justify-between items-center flex-row w-1300 mx-auto gap-7">
        <Column title={"TO DO"} tasks={toDo} id={"1"} addTask={addTask} />
        <Column
          title={"IN Progress"}
          tasks={inProgress}
          id={"2"}
          addTask={addTask}
        />
        <Column title={"DONE"} tasks={done} id={"3"} addTask={addTask} />
      </div>
    </DragDropContext>
  );
}
