import { DeleteFilled, EditFilled } from '@ant-design/icons';
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Button, Popconfirm } from 'antd';
import Task from './task';

import styles from './column.less';

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? '#ddd' : 'lightgrey',
  padding: '8px 8px 30px',
  width: 250,
  borderBottomRightRadius: 2,
  borderBottomLeftRadius: 2,
});

const Column = (props) => {
  return (
    <div className={styles.column}>
      <div className={styles['column-header']}>
        <h3>{props.column.title}</h3>
        <div className={styles['column-btn-group']}>
          <Button icon={<EditFilled style={{ color: '#1890ff' }} />} type="ghost" />
          <Popconfirm title="Are you sure delete column this ?">
            <Button icon={<DeleteFilled style={{ color: '#ff4d4f' }} />} type="ghost" />
          </Popconfirm>
        </div>
      </div>
      <Droppable droppableId={props.column.id} type="TASK">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {props.tasks.map((task, index) => (
              <Task key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
