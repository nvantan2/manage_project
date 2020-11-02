import React, { useState } from 'react';

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
});

export const BoardDetailProvider = (props) => {
  const [dataBoard, setDataBoard] = useState({
    tasks: {},
    columns: {},
    columnOrder: [],
    title: '',
    createdAt: '',
    description: '',
    members: [],
  });

  return (
    <BoardDetailContext.Provider
      value={{
        dataBoard,
        setDataBoard,
      }}
    >
      {props.children}
    </BoardDetailContext.Provider>
  );
};

export default BoardDetailContext;
