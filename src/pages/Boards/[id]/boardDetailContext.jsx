import React, { useState, useEffect } from 'react';
import { useLocation } from 'umi';

import { fetchBoard, fetchStatusList, fetchTasks } from './service';

const BoardDetailContext = React.createContext({
  dataBoard: {
    task: {},
    columns: {},
    columnOrder: [],
    title: '',
    createdAt: '',
    description: '',
    members: [],
  },
  setDataBoard: null,
  boardId: 0,
});

export const BoardDetailProvider = (props) => {
  const location = useLocation();
  const boardId = location.pathname.split('/')[2];

  const [dataBoard, setDataBoard] = useState({
    tasks: {},
    columns: {},
    columnOrder: [],
    title: '',
    createdAt: '',
    description: '',
    members: [],
  });

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

  return (
    <BoardDetailContext.Provider
      value={{
        dataBoard,
        setDataBoard,
        boardId,
      }}
    >
      {props.children}
    </BoardDetailContext.Provider>
  );
};

export default BoardDetailContext;
