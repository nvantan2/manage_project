import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import _ from 'lodash';

import Column from './components/column';

import styles from './index.less';

const BoardDetail = () => {
  const [dataBoard, setDataBoard] = useState({
    tasks: {
      'task-1': { id: 'task-1', title: 'Task 1' },
      'task-2': { id: 'task-2', title: 'Task 2' },
      'task-3': { id: 'task-3', title: 'Task 3' },
      'task-4': { id: 'task-4', title: 'Task 4' },
    },
    columns: {
      'column-1': {
        id: 'column-1',
        title: 'To do',
        taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
      },
      'column-2': {
        id: 'column-2',
        title: 'In progress',
        taskIds: [],
      },
      'column-3': {
        id: 'column-3',
        title: 'Done',
        taskIds: [],
      },
    },
    // Facilitate reordering of the columns
    columnOrder: ['column-1', 'column-2', 'column-3'],
  });

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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {!_.isEmpty(dataBoard) && (
        <div className={styles['board-detail-container']}>
          {dataBoard.columnOrder.map((columnId) => {
            const column = dataBoard.columns[columnId];
            const tasks = column.taskIds.map((taskId) => dataBoard.tasks[taskId]);

            return <Column key={column.id} column={column} tasks={tasks} />;
          })}
        </div>
      )}
    </DragDropContext>
  );
};

export default BoardDetail;
