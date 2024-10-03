import { useState, useEffect, useCallback } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import Column from "./Column";
import { Task, ColumnType } from "@/types";

const apiUrl = import.meta.env.VITE_API_URL;

// Define column structure using the ColumnType
const COLUMNS: Record<ColumnType, keyof ColumnsState> = {
  "To Do": "todo",
  "In Progress": "inProgress",
  Done: "done",
} as const;

interface ColumnsState {
  todo: Task[];
  inProgress: Task[];
  done: Task[];
}

export default function Board() {
  const [columns, setColumns] = useState<ColumnsState>({
    todo: [],
    inProgress: [],
    done: [],
  });

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/tasks`);
      const tasks: Task[] = await response.json();

      setColumns({
        todo: tasks.filter((task) => task.status === "To Do"),
        inProgress: tasks.filter((task) => task.status === "In Progress"),
        done: tasks.filter((task) => task.status === "Done"),
      });
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Used to update task status when dragged and dropped
  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Type assertion since we know our droppableIds are ColumnType
    const sourceStatus = source.droppableId as ColumnType;
    const destStatus = destination.droppableId as ColumnType;

    const sourceKey = COLUMNS[sourceStatus];
    const destKey = COLUMNS[destStatus];

    const sourceColumn = columns[sourceKey];
    const task = sourceColumn.find((t) => t.id === draggableId);

    if (!task) return;

    const updatedTask = { ...task, status: destStatus };

    // Optimistic update
    setColumns((prev) => {
      const newColumns = { ...prev };
      newColumns[sourceKey] = prev[sourceKey].filter((t) => t.id !== task.id);

      if (sourceKey === destKey) {
        const column = [...newColumns[sourceKey]];
        column.splice(destination.index, 0, updatedTask);
        newColumns[sourceKey] = column;
      } else {
        const destColumn = [...prev[destKey]];
        destColumn.splice(destination.index, 0, updatedTask);
        newColumns[destKey] = destColumn;
      }

      return newColumns;
    });

    // Update task status in the database
    try {
      const response = await fetch(`${apiUrl}/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        revertDragChange(task, sourceKey, destKey, source.index);
      }
    } catch (error) {
      console.error("Failed to update task:", error);
      revertDragChange(task, sourceKey, destKey, source.index);
    }
  };

  // Revert task status change if update fails
  const revertDragChange = (
    task: Task,
    sourceKey: keyof ColumnsState,
    destKey: keyof ColumnsState,
    sourceIndex: number
  ) => {
    setColumns((prev) => {
      const newColumns = { ...prev };
      newColumns[destKey] = prev[destKey].filter((t) => t.id !== task.id);
      const sourceColumn = [...prev[sourceKey]];
      sourceColumn.splice(sourceIndex, 0, task);
      newColumns[sourceKey] = sourceColumn;
      return newColumns;
    });
  };

  // Function to add a new task
  const addTask = async (
    taskTitle: string,
    taskDescription: string,
    columnId: string
  ) => {
    const status = columnId as ColumnType;
    const columnKey = COLUMNS[status];

    const tempTask: Task = {
      id: `temp-${Date.now()}`,
      title: taskTitle,
      description: taskDescription,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setColumns((prev) => ({
      ...prev,
      [columnKey]: [...prev[columnKey], tempTask],
    }));

    try {
      const response = await fetch(`${apiUrl}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: taskTitle,
          description: taskDescription,
          status,
        }),
      });

      const createdTask = await response.json();

      setColumns((prev) => ({
        ...prev,
        [columnKey]: prev[columnKey].map((task) =>
          task.id === tempTask.id ? createdTask : task
        ),
      }));
    } catch (error) {
      console.error("Failed to add task:", error);
      setColumns((prev) => ({
        ...prev,
        [columnKey]: prev[columnKey].filter((task) => task.id !== tempTask.id),
      }));
    }
  };

  // Function to delete a task
  const deleteTask = async (taskId: string) => {
    let deletedTask: Task | undefined;
    let taskColumn: keyof ColumnsState | undefined;
    let taskIndex: number | undefined;

    setColumns((prev) => {
      const newColumns = { ...prev };
      for (const [_, columnKey] of Object.entries(COLUMNS)) {
        const index = prev[columnKey].findIndex((task) => task.id === taskId);
        if (index !== -1) {
          deletedTask = prev[columnKey][index];
          taskColumn = columnKey;
          taskIndex = index;
          newColumns[columnKey] = prev[columnKey].filter(
            (task) => task.id !== taskId
          );
          break;
        }
      }
      return newColumns;
    });

    try {
      const response = await fetch(`${apiUrl}/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (
        !response.ok &&
        deletedTask &&
        taskColumn &&
        taskIndex !== undefined
      ) {
        revertDelete(deletedTask, taskColumn, taskIndex);
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
      if (deletedTask && taskColumn && taskIndex !== undefined) {
        revertDelete(deletedTask, taskColumn, taskIndex);
      }
    }
  };

  const revertDelete = (
    task: Task,
    columnKey: keyof ColumnsState,
    index: number
  ) => {
    setColumns((prev) => ({
      ...prev,
      [columnKey]: [
        ...prev[columnKey].slice(0, index),
        task,
        ...prev[columnKey].slice(index),
      ],
    }));
  };

  const updateTask = async (taskId: string, updatedFields: Partial<Task>) => {
    let originalTask: Task | undefined;
    let taskColumn: keyof ColumnsState | undefined;

    for (const [_, columnKey] of Object.entries(COLUMNS)) {
      const task = columns[columnKey].find((t) => t.id === taskId);
      if (task) {
        originalTask = task;
        taskColumn = columnKey;
        break;
      }
    }

    if (!originalTask || !taskColumn) return;

    setColumns((prev) => {
      const newColumns = { ...prev };
      newColumns[taskColumn!] = prev[taskColumn!].map((task) =>
        task.id === taskId ? { ...task, ...updatedFields } : task
      );
      return newColumns;
    });

    try {
      const response = await fetch(`${apiUrl}/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });

      if (!response.ok) {
        revertUpdate(taskColumn, originalTask);
      }
    } catch (error) {
      console.error("Failed to update task:", error);
      revertUpdate(taskColumn, originalTask);
    }
  };

  const revertUpdate = (columnKey: keyof ColumnsState, originalTask: Task) => {
    setColumns((prev) => {
      const newColumns = { ...prev };
      newColumns[columnKey] = prev[columnKey].map((task) =>
        task.id === originalTask.id ? originalTask : task
      );
      return newColumns;
    });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <h1 className="text-center text-2xl font-medium" data-cy="board-title">
        Kanban Board
      </h1>
      <div
        className="flex justify-between items-center overflow-x-auto flex-row w-1300 mx-auto gap-7"
        data-cy="board-columns"
      >
        {(Object.entries(COLUMNS) as [ColumnType, keyof ColumnsState][]).map(
          ([title, key]) => (
            <Column
              key={title}
              title={title}
              tasks={columns[key]}
              id={title}
              addTask={addTask}
              updateTask={updateTask}
              deleteTask={deleteTask}
              data-cy={`column-${key}`}
            />
          )
        )}
      </div>
    </DragDropContext>
  );
}
