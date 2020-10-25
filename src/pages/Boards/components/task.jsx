import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const grid = 8;
const getItemStyle = (isDragging, draggableStyle) => {
  return {
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    background: isDragging ? 'lightgreen' : 'grey',

    ...draggableStyle,
  };
};

const Task = (props) => {
  return (
    <Draggable draggableId={props.task.id} index={props.index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
          onClick={() => console.log(props.task, props.droppableId)}
        >
          <div>{props.task.content}</div>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
