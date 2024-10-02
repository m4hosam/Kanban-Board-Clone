import React from "react";
import styled from "styled-components";
import Card from "./Card";
import "./scroll.css";
import {
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from "react-beautiful-dnd";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface ColumnProps {
  title: string;
  tasks: Task[];
  id: string;
}

const Container = styled.div`
  background-color: #f4f5f7;
  border-radius: 2.5px;
  width: 400px;
  height: 900px;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  border: 1px solid gray;
`;

const Title = styled.h3`
  padding: 8px;
  background-color: pink;
  text-align: center;
`;

const TaskList = styled.div<{ isDraggingOver: boolean }>`
  padding: 3px;
  transition: background-color 0.2s ease;
  background-color: ${(props) =>
    props.isDraggingOver ? "#e0e0e0" : "#f4f5f7"};
  flex-grow: 1;
  min-height: 100px;
`;

export default function Column({ title, tasks, id }: ColumnProps) {
  return (
    <Container className="column">
      <Title
        style={{
          backgroundColor: "lightblue",
          position: "sticky",
          top: "0",
        }}
      >
        {title}
      </Title>
      <Droppable droppableId={id}>
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <TaskList
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {tasks.map((task, index) => (
              <Card key={task.id} index={index} task={task} />
            ))}
            {provided.placeholder}
          </TaskList>
        )}
      </Droppable>
    </Container>
  );
}
