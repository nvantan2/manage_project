import React, { useState, useEffect } from 'react';
import { useLocation } from 'umi';

import { fetchStatusList, fetchTasks } from './service';

const BoardDetailContext = React.createContext({
  dataBoard: {
    task: {},
    columns: {},
    columnOrder: [],
  },
  setDataBoard: null,
  boardId: 0
});

export const BoardDetailProvider = (props) => {
  const location = useLocation();
  const boardId = location.pathname.split('/')[2];

  const [dataBoard, setDataBoard] = useState({
    tasks: {},
    columns: {},
    columnOrder: [],
  });

  const fetchInitial = async () => {
    try {
      const data = await Promise.all([fetchStatusList({ boardId }), fetchTasks({ boardId })]);
      const statusList = data[0][0];
      const objTask = data[1].reduce((obj, cur) => {
        return { ...obj, [cur.id]: cur };
      }, {});
      setDataBoard({
        ...statusList,
        columns: JSON.parse(statusList.columns),
        columnOrder: JSON.parse(statusList.columnOrder),
        tasks: objTask,
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
        boardId
      }}
    >
      {props.children}
    </BoardDetailContext.Provider>
  );
};

export default BoardDetailContext;
