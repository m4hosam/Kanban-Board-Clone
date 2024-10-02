import React from "react";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import styled from "styled-components";
import { Task } from "@/types";

// interface Task {
//   id: number;
//   title: string;
//   completed: boolean;
// }

interface CardProps {
  task: Task;
  index: number;
}

interface ContainerProps {
  isDragging: boolean;
  isDraggable?: boolean;
  isBacklog?: boolean;
}

const Container = styled.div<ContainerProps>`
  border-radius: 10px;
  box-shadow: 5px 5px 5px 2px grey;
  padding: 8px;
  color: #000;
  margin-bottom: 8px;
  min-height: 120px;
  margin-left: 10px;
  margin-right: 10px;
  background-color: ${(props) => bgcolorChange(props)};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const TextContent = styled.div``;

const Icons = styled.div`
  display: flex;
  justify-content: end;
  padding: 2px;
`;

function bgcolorChange(props: ContainerProps): string {
  return props.isDragging
    ? "lightgreen"
    : props.isDraggable
    ? props.isBacklog
      ? "#F2D7D5"
      : "#DCDCDC"
    : props.isBacklog
    ? "#F2D7D5"
    : "#EAF4FC";
}

export default function Card({ task, index }: CardProps) {
  return (
    <Draggable draggableId={`${task.id}`} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          <div style={{ display: "flex", justifyContent: "start", padding: 2 }}>
            <span>
              <small>
                #{task.id}
                {"  "}
              </small>
            </span>
          </div>
          <div
            style={{ display: "flex", justifyContent: "center", padding: 2 }}
          >
            <TextContent>{task.title}</TextContent>
          </div>
          <Icons>
            <div>
              <p>d</p>
            </div>
          </Icons>
          {/* {provided.placeholder} */}
        </Container>
      )}
    </Draggable>
  );
}
