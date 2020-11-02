import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import React, { useContext, useRef, useState, useEffect } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Button, Popconfirm, notification } from 'antd';
import _ from 'lodash';
import ContentEditable from 'react-contenteditable';
import moment from 'moment';

import { getAuthority } from '@/utils/authority';
import { html2Value } from '@/utils/utils';
import Task from './task';
import BoardDetailContext from './boardDetailContext';
import { createTask, updateStatusList } from './service';
import { TYPE_DROPPABLE } from './constants';

import styles from './column.less';

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? '#ddd' : 'lightgrey',
  padding: '8px 8px 20px',
  width: 250,
  borderBottomRightRadius: 2,
  borderBottomLeftRadius: 2,
});

const Column = (props) => {
  const ROLE = getAuthority()[0];
  const { setDataBoard, dataBoard, boardId } = useContext(BoardDetailContext);
  const titleNewColumn = useRef(props.column.title);
  const titleNewColumnRef = useRef(null);
  const [isEditTitleColumn, setIsEditTitleColumn] = useState(false);
  const [isShowInputNewTask, setIsShowNewTask] = useState(false);
  const titleNewTask = useRef('');
  const titleNewTaskRef = useRef(null);

  const onDeleteColumn = () => {
    const newState = {
      ...dataBoard,
      columns: { ..._.omit(dataBoard.columns, [props.column.id]) },
      columnOrder: dataBoard.columnOrder.filter((item) => item !== props.column.id),
    };
    updateStatusList({
      ..._.omit(newState, ['tasks', 'title', 'description', 'members']),
      columns: JSON.stringify(newState.columns),
      columnOrder: JSON.stringify(newState.columnOrder),
    }).then(() => {
      setDataBoard(newState);
    });
  };

  const handleBlurTitleNewColumn = () => {
    const newTitle = html2Value(titleNewColumn.current).trim();
    const newId = newTitle.toLowerCase().replace(/[^A-Z0-9]+/gi, '');

    if (!newTitle || newTitle === props.column.title || dataBoard.columnOrder.includes(newId)) {
      titleNewColumn.current = props.column.title;
      setIsEditTitleColumn(false);
      return;
    }
    try {
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
        ..._.omit(newState, ['tasks', 'title', 'members', 'description']),
        columns: JSON.stringify(newState.columns),
        columnOrder: JSON.stringify(newState.columnOrder),
      }).then(() => {
        setDataBoard(newState);
        setIsEditTitleColumn(false);
      });
    } catch (error) {
      notification.error({
        message: 'Something went wrong !',
        description: 'please try again later!',
      });
    }
  };

  const handleBlurTitleNewTask = async () => {
    const newTitle = html2Value(titleNewTask.current).trim();

    if (!newTitle) {
      titleNewTask.current = '';
      setIsShowNewTask(false);
      return;
    }
    try {
      const newTask = await createTask({
        title: newTitle,
        boardId,
        createdAt: moment().utc(),
        description: '',
        tags: '[]',
        deadline: '',
        prLink: '',
        members: '[]',
      });
      const newState = {
        ...dataBoard,
        tasks: { ...dataBoard.tasks, [newTask.id]: { ...newTask, members: [], tags: [] } },
        columns: {
          ...dataBoard.columns,
          [props.column.id]: {
            ...dataBoard.columns[props.column.id],
            taskIds: [...dataBoard.columns[props.column.id].taskIds, newTask.id],
          },
        },
      };
      setDataBoard(newState);
      setIsShowNewTask(false);
      titleNewTask.current = '';

      updateStatusList({
        ..._.omit(newState, ['tasks', 'title', 'members', 'description']),
        columns: JSON.stringify(newState.columns),
        columnOrder: JSON.stringify(newState.columnOrder),
      });
    } catch (error) {
      notification.error({
        message: 'Something went wrong !',
        description: 'please try again later!',
      });
    }
  };

  useEffect(() => {
    if (isShowInputNewTask) {
      titleNewTaskRef.current.focus();
    }
  }, [isShowInputNewTask]);

  useEffect(() => {
    if (isEditTitleColumn) {
      titleNewColumnRef.current.focus();
    }
  }, [isEditTitleColumn]);

  return (
    <>
      <Draggable
        draggableId={props.column.id}
        index={props.index}
        isDragDisabled={ROLE !== 'admin'}
      >
        {(provided) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            style={{ ...provided.draggableProps.style, outline: 'unset' }}
          >
            <div className={styles.column}>
              <div className={styles['column-header']}>
                <ContentEditable
                  style={{ display: `${isEditTitleColumn ? 'block' : 'none'}` }}
                  html={titleNewColumn.current}
                  disabled={ROLE !== 'admin'}
                  innerRef={titleNewColumnRef}
                  onBlur={handleBlurTitleNewColumn}
                  onChange={(e) => {
                    titleNewColumn.current = e.target.value;
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.target.blur();
                    }
                  }}
                />
                <h3
                  style={{ display: `${isEditTitleColumn ? 'none' : 'block'}` }}
                  onClick={() => setIsEditTitleColumn(ROLE === 'admin')}
                >
                  {props.column.title}
                </h3>
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
                        <Task key={task.id} task={task} index={index} columnId={props.column.id} />
                      ))}
                      {provided.placeholder}
                      {!props.index && ROLE === 'admin' && (
                        <div className={styles['column-footer']}>
                          <ContentEditable
                            innerRef={titleNewTaskRef}
                            html={titleNewTask.current}
                            onBlur={handleBlurTitleNewTask}
                            onChange={(e) => {
                              titleNewTask.current = e.target.value;
                            }}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.target.blur();
                              }
                            }}
                            style={{ display: `${isShowInputNewTask ? 'block' : 'none'}` }}
                            placeholder="Enter a title for this task"
                            tagName="p"
                          />
                          {!isShowInputNewTask && (
                            <Button
                              icon={<PlusOutlined />}
                              type="ghost"
                              onClick={() => {
                                setIsShowNewTask(true);
                                titleNewTask.current = '';
                              }}
                            >
                              Add new task
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          </div>
        )}
      </Draggable>
    </>
  );
};

export default Column;
