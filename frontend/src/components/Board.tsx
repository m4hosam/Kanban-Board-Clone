import { useState, useEffect } from "react";
import {
  DragDropContext,
  DropResult,
  DraggableLocation,
} from "react-beautiful-dnd";
import Column from "./Column";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export default function Board() {
  const [toDo, setToDo] = useState<Task[]>([]);
  const [inProgress, setInProgress] = useState<Task[]>([]);
  const [done, setDone] = useState<Task[]>([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((response) => response.json())
      .then((json: Task[]) => {
        setDone(json.filter((task) => task.completed));
        setToDo(json.filter((task) => !task.completed));
      });
  }, []);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    const sourceList = getList(source.droppableId);
    const destList = getList(destination.droppableId);

    if (source.droppableId === destination.droppableId) {
      const reorderedList = reorder(
        sourceList,
        source.index,
        destination.index
      );
      updateList(source.droppableId, reorderedList);
      console.log(reorderedList);
    } else {
      const result = move(sourceList, destList, source, destination);
      updateList(source.droppableId, result[source.droppableId]);
      updateList(destination.droppableId, result[destination.droppableId]);
    }
  };

  const getList = (droppableId: string): Task[] => {
    switch (droppableId) {
      case "1":
        return toDo;
      case "2":
        return inProgress;
      case "3":
        return done;
      default:
        return [];
    }
  };

  const updateList = (droppableId: string, newList: Task[]) => {
    switch (droppableId) {
      case "1":
        setToDo(newList);
        break;
      case "2":
        setInProgress(newList);
        break;
      case "3":
        setDone(newList);
        break;
    }
  };

  const reorder = (
    list: Task[],
    startIndex: number,
    endIndex: number
  ): Task[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const move = (
    source: Task[],
    destination: Task[],
    droppableSource: DraggableLocation,
    droppableDestination: DraggableLocation
  ): { [key: string]: Task[] } => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result: { [key: string]: Task[] } = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <h2 style={{ textAlign: "center" }}>PROGRESS BOARD</h2>
      <div className="flex justify-between items-center flex-row w-1300 mx-auto gap-7">
        <Column title={"TO DO"} tasks={toDo} id={"1"} />
        <Column title={"IN Progress"} tasks={inProgress} id={"2"} />
        <Column title={"DONE"} tasks={done} id={"3"} />
      </div>
    </DragDropContext>
  );
}
