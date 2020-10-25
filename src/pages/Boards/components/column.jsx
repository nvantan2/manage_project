import { Button } from 'antd';
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from './task';

const grid = 8;
const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250,
});

const Column = (props) => {
  return (
    <div style={{ padding: 5, marginRight: 5 }}>
      <div style={{border: "1px solid #ddd", padding: 5 }}>
        <div style={{ display: 'flex'}}>
          <h3>{props.column.title}</h3>
          <Button type="primary">edit</Button>
          <Button type="primary">delete</Button>
        </div>
        <Droppable droppableId={props.column.id} type="TASK">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {props.tasks.map((task, index) => (
                <Task key={task.id} task={task} index={index} droppableId={props.column.id} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};

export default Column;
