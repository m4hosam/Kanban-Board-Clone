// src/App.tsx
import React, { useState, useRef, useEffect } from "react";
import { DragDropContext, DropResult, DragStart } from "react-beautiful-dnd";
import Column from "./components/Column";
import { Task, ColumnType } from "./types";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const scrollTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) {
        clearInterval(scrollTimerRef.current);
      }
    };
  }, []);

  const onDragStart = (start: DragStart) => {
    if (scrollTimerRef.current) {
      clearInterval(scrollTimerRef.current);
    }
    const scrollInterval = 15;
    const scrollStep = 5;
    const scrollThreshold = 100;

    scrollTimerRef.current = window.setInterval(() => {
      const columnElement = document.querySelector(
        `[data-rbd-droppable-id='${start.source.droppableId}']`
      );
      if (columnElement) {
        const rect = columnElement.getBoundingClientRect();
        const mouseY = (window as any).mousePosY || 0;

        if (mouseY < rect.top + scrollThreshold) {
          columnElement.scrollTop -= scrollStep;
        } else if (mouseY > rect.bottom - scrollThreshold) {
          columnElement.scrollTop += scrollStep;
        }
      }
    }, scrollInterval);
  };

  const onDragEnd = (result: DropResult) => {
    if (scrollTimerRef.current) {
      clearInterval(scrollTimerRef.current);
    }

    const { source, destination } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newTasks = Array.from(tasks);
    const draggedTask = newTasks.find(
      (task, index) =>
        task.status === source.droppableId && index === source.index
    );

    if (!draggedTask) return;

    newTasks.splice(newTasks.indexOf(draggedTask), 1);
    draggedTask.status = destination.droppableId as ColumnType;

    newTasks.splice(
      newTasks.findIndex((task) => task.status === destination.droppableId) +
        destination.index,
      0,
      draggedTask
    );

    setTasks(newTasks);
  };

  const addTask = (title: string, description: string, status: ColumnType) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      status,
    };
    setTasks([...tasks, newTask]);
  };

  const editTask = (id: string, title: string, description: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, title, description } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const columns: ColumnType[] = ["To Do", "In Progress", "Done"];

  return (
    <div className="App">
      <h1>Kanban Board</h1>
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            height: "calc(100vh - 100px)",
          }}
        >
          {columns.map((columnTitle) => (
            <Column
              key={columnTitle}
              title={columnTitle}
              tasks={tasks.filter((task) => task.status === columnTitle)}
              onAddTask={addTask}
              onEditTask={editTask}
              onDeleteTask={deleteTask}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default App;
