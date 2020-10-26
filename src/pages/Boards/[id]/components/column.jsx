import { DeleteFilled, EditFilled, PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Button, Popconfirm } from 'antd';

import { getAuthority } from '@/utils/authority';
import Task from './task';

import styles from './column.less';

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? '#ddd' : 'lightgrey',
  padding: '8px 8px 40px',
  width: 250,
  borderBottomRightRadius: 2,
  borderBottomLeftRadius: 2,
});

const Column = (props) => {
  const ROLE = getAuthority()[0];

  return (
    <div className={styles.column}>
      <div className={styles['column-header']}>
        <h3>{props.column.title}</h3>
        {ROLE === 'admin' && (
          <div className={styles['column-btn-group']}>
            <Button icon={<EditFilled style={{ color: '#1890ff' }} />} type="ghost" />
            <Popconfirm title="Are you sure delete column this ?">
              <Button icon={<DeleteFilled style={{ color: '#ff4d4f' }} />} type="ghost" />
            </Popconfirm>
          </div>
        )}
      </div>
      <div className={styles['column-body']}>
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
        {!props.index && ROLE === 'admin' && (
          <Button className={styles['column-body-btn']} icon={<PlusOutlined />} type="ghost">
            Add new task
          </Button>
        )}
      </div>
    </div>
  );
};

export default Column;
