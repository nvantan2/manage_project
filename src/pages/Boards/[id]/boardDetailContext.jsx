import React, { useState, useEffect } from 'react';
import { useLocation } from 'umi';

import { TYPE_MODAL } from './constant';
import { fetchStatusList, fetchTasks } from './service';

const BoardDetailContext = React.createContext({
  dataBoard: {
    task: {},
    columns: {},
    columnOrder: [],
  },
  isVisibleModal: false,
  typeModal: TYPE_MODAL.addColumn,
  setIsVisibleModal: null,
  setDataBoard: null,
  setTypeModal: null,
});

export const BoardDetailProvider = (props) => {
  const location = useLocation();
  const [dataBoard, setDataBoard] = useState({
    task: {},
    columns: {},
    columnOrder: [],
  });
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [typeModal, setTypeModal] = useState(TYPE_MODAL.addColumn);

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

  useEffect(() => {
    fetchInitial(location.pathname.split('/')[2]);
  }, []);

  return (
    <BoardDetailContext.Provider
      value={{ dataBoard, setDataBoard, isVisibleModal, setIsVisibleModal, typeModal, setTypeModal }}
    >
      {props.children}
    </BoardDetailContext.Provider>
  );
};

export default BoardDetailContext;
