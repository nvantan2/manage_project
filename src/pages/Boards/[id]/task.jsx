import { CloseOutlined } from '@ant-design/icons';
import { Button, Popconfirm, notification } from 'antd';
import React, { useContext, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import _ from 'lodash';

import BoardDetailContext from './boardDetailContext';

import styles from './task.less';
import { deleteTask, updateStatusList } from './service';
import TaskDetail from './taskDetail';

const grid = 8;
const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? '#ccc' : 'grey',
  ...draggableStyle,
  padding: '0 5px 5px',
  borderRadius: 2,
  cursor: 'pointer',
  outline: 'unset',
  minHeight: 60,
});

const Task = (props) => {
  const { dataBoard, setDataBoard } = useContext(BoardDetailContext);
  const [visible, setVisible] = useState(false);

  const onDeleteTask = () => {
    const newState = {
      ...dataBoard,
      tasks: { ..._.omit(dataBoard.tasks, [props.task.id]) },
      columns: {
        ...dataBoard.columns,
        [props.columnId]: {
          ...dataBoard.columns[props.columnId],
          taskIds: dataBoard.columns[props.columnId].taskIds.filter(
            (item) => item !== props.task.id,
          ),
        },
      },
    };
    setDataBoard(newState);
    try {
      Promise.all([
        updateStatusList({
          ..._.omit(newState, ['tasks']),
          columns: JSON.stringify(newState.columns),
          columnOrder: JSON.stringify(newState.columnOrder),
        }),
        deleteTask({ id: props.task.id }),
      ]);
    } catch (error) {
      notification.error({
        message: 'Something went wrong !',
        description: 'please try again later!',
      });
    }
  };

  return (
    <>
      <TaskDetail taskId={props.task.id} visible={visible} setVisible={setVisible} />
      <Draggable draggableId={props.task.id} index={props.index}>
        {(provided, snapshot) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
            onClick={() => setVisible(true)}
          >
            <div className={styles['task-card-header']}>
              <h3>{props.task.title}</h3>
              <Popconfirm
                title={`Are you sure delete task ${props.task.title} ?`}
                onConfirm={onDeleteTask}
              >
                <Button icon={<CloseOutlined />} type="ghost" />
              </Popconfirm>
            </div>
          </div>
        )}
      </Draggable>
    </>
  );
};

export default Task;
