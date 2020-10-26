import { PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import _ from 'lodash';
import { useLocation } from 'umi';
import { Button } from 'antd';

import { fetchStatusList, fetchTasks } from './service';
import Column from './components/column';

import styles from './index.less';

const BoardDetail = () => {
  const location = useLocation();
  const [dataBoard, setDataBoard] = useState({
    task: {},
    columns: {},
    columnOrder: [],
  });

  const fetchInitial = async (boardId) => {
    try {
      const data = await Promise.all([fetchStatusList({ boardId }), fetchTasks({ boardId })]);
      const statusList = data[0][0];
      const objTask = data[1].reduce((obj, cur) => {
        return { ...obj, [cur.id]: cur };
      }, {});
      setDataBoard({ ...statusList, tasks: objTask });
    } catch (error) {
      setDataBoard({
        task: {},
        columns: {},
        columnOrder: [],
      });
    }
  };

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

  useEffect(() => {
    fetchInitial(location.pathname.split('/')[2]);
  }, []);

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        {!_.isEmpty(dataBoard.columns) && (
          <div className={styles['board-detail-container']}>
            {dataBoard.columnOrder.map((columnId, index) => {
              const column = dataBoard.columns[columnId];
              const tasks = column.taskIds.map((taskId) => dataBoard.tasks[taskId]);

              return <Column key={column.id} column={column} tasks={tasks} index={index} />;
            })}
            <div style={{ padding: 5 }}>
              <Button className={styles['board-detail-btn']} type="primary" icon={<PlusOutlined />}>
                New column
              </Button>
            </div>
          </div>
        )}
      </DragDropContext>
    </>
  );
};

export default BoardDetail;
