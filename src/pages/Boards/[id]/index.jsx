import { PlusOutlined } from '@ant-design/icons';
import React, { useContext, useState, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import _ from 'lodash';
import { Button, Form, Modal, notification, Input, Spin } from 'antd';
import moment from 'moment';

import { getAuthority } from '@/utils/authority';
import BoardDetailContext, { BoardDetailProvider } from './boardDetailContext';
import Column from './column';
import { fetchBoard, fetchStatusList, fetchTasks, updateStatusList } from './service';
import { TYPE_DROPPABLE } from './constants';

import styles from './index.less';

const BoardDetailContainer = ({ boardId }) => {
  const ROLE = getAuthority()[0];
  const [form] = Form.useForm();
  const { dataBoard, setDataBoard, loading, setLoading } = useContext(BoardDetailContext);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);

  const onDragEnd = (result) => {
    try {
      const { destination, source, draggableId, type } = result;
      if (!destination) {
        return;
      }

      if (destination.droppableId === source.droppableId && destination.index === source.index) {
        return;
      }

      const start = dataBoard.columns[source.droppableId];
      const finish = dataBoard.columns[destination.droppableId];

      if (start === finish) {
        if (type === TYPE_DROPPABLE.person) {
          const newColumnOrder = [...dataBoard.columnOrder];
          newColumnOrder.splice(source.index, 1);
          newColumnOrder.splice(destination.index, 0, draggableId);

          const newState = {
            ...dataBoard,
            columnOrder: newColumnOrder,
          };
          setDataBoard(newState);
          updateStatusList({
            ..._.omit(newState, ['tasks', 'title', 'members', 'description']),
            columns: JSON.stringify(newState.columns),
            columnOrder: JSON.stringify(newState.columnOrder),
          });
          return;
        }

        const newTaskIds = Array.from(start.taskIds);
        newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, draggableId);

        const newColumn = {
          ...start,
          taskIds: newTaskIds,
        };

        const newState = {
          ...dataBoard,
          columns: {
            ...dataBoard.columns,
            [newColumn.id]: newColumn,
          },
        };
        setDataBoard(newState);
        updateStatusList({
          ..._.omit(newState, ['tasks', 'title', 'members', 'description']),
          columns: JSON.stringify(newState.columns),
          columnOrder: JSON.stringify(newState.columnOrder),
        });
        return;
      }

      const startTaskIds = Array.from(start.taskIds);
      startTaskIds.splice(source.index, 1);
      const newStart = {
        ...start,
        taskIds: startTaskIds,
      };

      const finishTaskIds = Array.from(finish.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...finish,
        taskIds: finishTaskIds,
      };

      const newState = {
        ...dataBoard,
        columns: {
          ...dataBoard.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      };
      setDataBoard(newState);
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

  const onFinishForm = (values) => {
    try {
      setLoadingForm(true);
      const newId = values.title.toLowerCase().replace(/[^A-Z0-9]+/gi, '');
      if (dataBoard.columnOrder.includes(newId)) {
        notification.error({
          message: 'Title already exists !',
          description: 'please try again!',
        });
        setLoadingForm(false);
        return;
      }
      const newState = {
        ...dataBoard,
        columns: {
          ...dataBoard.columns,
          [newId]: { id: newId, title: values.title, taskIds: [] },
        },
        columnOrder: [...dataBoard.columnOrder, newId],
      };
      updateStatusList({
        ..._.omit(newState, ['tasks', 'title', 'members', 'description']),
        columns: JSON.stringify(newState.columns),
        columnOrder: JSON.stringify(newState.columnOrder),
      }).then(() => {
        setDataBoard(newState);
        setLoadingForm(false);
        setIsVisibleModal(false);
        form.resetFields();
      });
      return;
    } catch (error) {
      setLoadingForm(false);
      notification.error({
        message: 'Something went wrong !',
        description: 'please try again later!',
      });
    }
  };

  const fetchInitial = async () => {
    try {
      const data = await Promise.all([
        fetchStatusList({ boardId }),
        fetchTasks({ boardId }),
        fetchBoard({ id: boardId }),
      ]);
      const statusList = data[0][0];
      const objTask = data[1].reduce((obj, cur) => {
        return {
          ...obj,
          [cur.id]: { ...cur, members: JSON.parse(cur.members), tags: JSON.parse(cur.tags) },
        };
      }, {});
      setDataBoard({
        ...statusList,
        columns: JSON.parse(statusList.columns),
        columnOrder: JSON.parse(statusList.columnOrder),
        tasks: objTask,
        title: data[2].title,
        createdAt: data[2].createdAt,
        description: data[2].description,
        members: JSON.parse(data[2].members),
      });
      setLoading(false);
    } catch (error) {
      setDataBoard({
        tasks: {},
        columns: {},
        columnOrder: [],
      });
    }
  };

  useEffect(() => {
    fetchInitial();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          margin: 'auto',
          paddingTop: 80,
          textAlign: 'center',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }
  return (
    <div>
      <Modal
        visible={isVisibleModal}
        title="Add column :"
        footer={null}
        onCancel={() => setIsVisibleModal(false)}
      >
        <Form form={form} onFinish={onFinishForm} labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
          <Form.Item label="Title" name="title" rules={[{ required: true }, { whitespace: true }]}>
            <Input autoFocus />
          </Form.Item>

          <div className={styles['board-detail-btn-group']}>
            <Button onClick={() => setIsVisibleModal(false)}>Cancel</Button>
            <Button htmlType="submit" type="primary" loading={loadingForm}>
              Ok
            </Button>
          </div>
        </Form>
      </Modal>

      <h3 style={{ padding: '0 5px' }}>
        <span className={styles['title-board']}>
          <strong>{dataBoard.title}</strong>
        </span>

        {dataBoard.createdAt && (
          <span style={{ fontSize: 14, fontStyle: 'italic' }}>
            {moment(dataBoard.createdAt).format('HH:mm MM-DD-YYYY')}
          </span>
        )}
      </h3>

      <DragDropContext onDragEnd={onDragEnd}>
        {!_.isEmpty(dataBoard.columns) && (
          <div className={styles['board-detail-container']}>
            <Droppable droppableId="columns" direction="horizontal" type={TYPE_DROPPABLE.person}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ display: 'flex', alignItems: 'flex-start' }}
                >
                  {dataBoard.columnOrder.map((columnId, index) => {
                    const column = dataBoard.columns[columnId];
                    const tasks = column.taskIds.map((taskId) => dataBoard.tasks[taskId]);
                    return (
                      <Column
                        key={column.id}
                        boardId={boardId}
                        column={column}
                        tasks={tasks}
                        index={index}
                      />
                    );
                  })}
                  {provided.placeholder}
                  {ROLE === 'admin' && (
                    <div style={{ padding: 5 }}>
                      <Button
                        className={styles['board-detail-btn']}
                        icon={<PlusOutlined />}
                        onClick={() => {
                          setIsVisibleModal(true);
                        }}
                      >
                        New column
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        )}
      </DragDropContext>
    </div>
  );
};

const BoardDetail = (props) => {
  return (
    <BoardDetailProvider>
      <BoardDetailContainer boardId={props.match.params.id} />
    </BoardDetailProvider>
  );
};

export default BoardDetail;
