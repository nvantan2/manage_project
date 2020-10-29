import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const grid = 8;
const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? '#ccc' : 'grey',
  ...draggableStyle,
  padding: 0,
  borderRadius: 2,
  cursor: 'pointer',
});

const Task = (props) => {
  return (
    <Draggable draggableId={props.task.id} index={props.index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
        >
          <div>{props.task.title}</div>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
