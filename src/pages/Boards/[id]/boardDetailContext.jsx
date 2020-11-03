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
  loading: true,
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

  const [loading, setLoading] = useState(true);

  return (
    <BoardDetailContext.Provider
      value={{
        dataBoard,
        setDataBoard,
        loading,
        setLoading,
      }}
    >
      {props.children}
    </BoardDetailContext.Provider>
  );
};

export default BoardDetailContext;
