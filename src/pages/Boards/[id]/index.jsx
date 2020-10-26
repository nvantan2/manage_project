import { PlusOutlined } from '@ant-design/icons';
import React, { useContext } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import _ from 'lodash';
import { Button, Form, Modal } from 'antd';

import BoardDetailContext, { BoardDetailProvider } from './boardDetailContext';
import Column from './components/column';
import FormModal from './components/formModal';
import { TYPE_MODAL } from './constant';

import styles from './index.less';

const getTitleModal = (typeModal) => {
  switch (typeModal) {
    case TYPE_MODAL.addColumn:
      return TYPE_MODAL.addColumn;
    default:
      return TYPE_MODAL.addColumn;
  }
};

const BoardDetailContainer = () => {
  const [form] = Form.useForm();
  const {
    dataBoard,
    setDataBoard,
    isVisibleModal,
    setIsVisibleModal,
    typeModal,
    setTypeModal,
  } = useContext(BoardDetailContext);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const start = dataBoard.columns[source.droppableId];
    const finish = dataBoard.columns[destination.droppableId];

    if (start === finish) {
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
  };

  const onFinishForm = (values) => {
    console.log(values);
  };

  return (
    <>
      <Modal
        form={form}
        visible={isVisibleModal}
        title={getTitleModal(typeModal)}
        footer={null}
        onCancel={() => setIsVisibleModal(false)}
      >
        <Form onFinish={onFinishForm} labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
          <FormModal typeModal={typeModal} />

          <div className={styles['board-detail-btn-group']}>
            <Button onClick={() => setIsVisibleModal(false)}>Cancel</Button>
            <Button htmlType="submit" type="primary">
              Ok
            </Button>
          </div>
        </Form>
      </Modal>

      <DragDropContext onDragEnd={onDragEnd}>
        {!_.isEmpty(dataBoard.columns) && (
          <div className={styles['board-detail-container']}>
            {dataBoard.columnOrder.map((columnId, index) => {
              const column = dataBoard.columns[columnId];
              const tasks = column.taskIds.map((taskId) => dataBoard.tasks[taskId]);
              return <Column key={column.id} column={column} tasks={tasks} index={index} />;
            })}
            <div style={{ padding: 5 }}>
              <Button
                className={styles['board-detail-btn']}
                icon={<PlusOutlined />}
                onClick={() => {
                  setTypeModal(TYPE_MODAL.addColumn);
                  setIsVisibleModal(true);
                }}
              >
                New column
              </Button>
            </div>
          </div>
        )}
      </DragDropContext>
    </>
  );
};

const BoardDetail = () => {
  return (
    <BoardDetailProvider>
      <BoardDetailContainer />
    </BoardDetailProvider>
  );
};

export default BoardDetail;
