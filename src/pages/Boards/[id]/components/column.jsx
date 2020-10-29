import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import React, { useContext, useRef, useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Button, Popconfirm, notification } from 'antd';
import _ from 'lodash';
import ContentEditable from 'react-contenteditable';

import { getAuthority } from '@/utils/authority';
import Task from './task';
import BoardDetailContext from '../boardDetailContext';
import { updateStatusList } from '../service';
import { TYPE_DROPPABLE } from '../constants';

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
  const { setDataBoard, dataBoard } = useContext(BoardDetailContext);
  const [titleColumn, setTitleColumn] = useState(props.column.title);
  const titleColumnRef = useRef(null);

  const onDeleteColumn = () => {
    const newState = {
      ...dataBoard,
      columns: { ..._.omit(dataBoard.columns, [props.column.id]) },
      columnOrder: dataBoard.columnOrder.filter((item) => item !== props.column.id),
    };
    updateStatusList({
      ..._.omit(newState, ['tasks']),
      columns: JSON.stringify(newState.columns),
      columnOrder: JSON.stringify(newState.columnOrder),
    }).then(() => {
      setDataBoard(newState);
    });
  };

  const handleChangeTitleColumn = (e) => {
    setTitleColumn(e.target.value);
  };

  const handleBlurTitleColumn = () => {
    const newTitle = titleColumnRef.current.lastHtml.trim();
    if (!newTitle) {
      setTitleColumn(props.column.title);
      return;
    }
    try {
      const newId = newTitle.toLowerCase().replace(/[^A-Z0-9]+/gi, '');
      const editColumnId = dataBoard.columnOrder[props.index];
      const newState = {
        ...dataBoard,
        columns: {
          ..._.omit(dataBoard.columns, [editColumnId]),
          [newId]: { ...dataBoard.columns[editColumnId], id: newId, title: newTitle },
        },
        columnOrder: dataBoard.columnOrder.map((item, index) => {
          if (index === props.index) {
            return newId;
          }
          return item;
        }),
      };

      updateStatusList({
        ..._.omit(newState, ['tasks']),
        columns: JSON.stringify(newState.columns),
        columnOrder: JSON.stringify(newState.columnOrder),
      }).then(() => setDataBoard(newState));
    } catch (error) {
      notification.error({
        message: 'Something went wrong !',
        description: 'please try again later!',
      });
    }
  };

  return (
    <>
      <Draggable draggableId={props.column.id} index={props.index}>
        {(provided) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            style={{ ...provided.draggableProps.style }}
          >
            <div className={styles.column}>
              <div className={styles['column-header']}>
                <ContentEditable
                  ref={titleColumnRef}
                  html={titleColumn}
                  disabled={ROLE !== 'admin'}
                  onBlur={handleBlurTitleColumn}
                  onChange={handleChangeTitleColumn}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.target.blur();
                    }
                  }}
                />
                {ROLE === 'admin' && (
                  <div className={styles['column-btn-group']}>
                    <Popconfirm
                      title={`Are you sure delete column ${props.column.title} ?`}
                      onConfirm={onDeleteColumn}
                    >
                      <Button icon={<DeleteFilled style={{ color: '#ff4d4f' }} />} type="ghost" />
                    </Popconfirm>
                  </div>
                )}
              </div>
              <div className={styles['column-body']}>
                <Droppable droppableId={props.column.id} type={TYPE_DROPPABLE.task}>
                  {/* eslint-disable-next-line @typescript-eslint/no-shadow */}
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
                  <Button
                    className={styles['column-body-btn']}
                    icon={<PlusOutlined />}
                    type="ghost"
                  >
                    Add new task
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Draggable>
    </>
  );
};

export default Column;
