import {
  createBoardService,
  deleteBoardService,
  fetchBoardService,
  updateBoardService,
  createStatusListService,
  fetchStatusListService,
  deleteStatusListService,
} from './service';

const STATUS_LIST_DEFAULT = {
  columns: {
    done: { id: 'done', title: 'Done', taskIds: [] },
    backlog: { id: 'backlog', title: 'Back log', taskIds: [] },
    review: { id: 'review', title: 'Review', taskIds: [] },
    todo: { id: 'todo', title: 'To do', taskIds: [] },
  },
  columnOrder: ['backlog', 'todo', 'review', 'done'],
};

export default {
  namespace: 'boards',
  state: [],
  effects: {
    *fetchBoard({ params }, { put, call }) {
      try {
        const boards = yield call(fetchBoardService, params);
        yield put({ type: 'fetchBoardReducer', payload: boards });
      } catch (error) {
        yield put({ type: 'fetchBoardReducer', payload: [] });
      }
    },
    *updateBoard({ params, callback }, { put, call }) {
      try {
        const board = yield call(updateBoardService, params);
        if (board.id) {
          yield put({ type: 'updateBoardReducer', payload: board });
          callback(board);
        } else callback(null);
      } catch (error) {
        callback(null);
      }
    },
    *createBoard({ params, callback }, { put, call }) {
      try {
        const board = yield call(createBoardService, params);
        if (board.id) {
          yield call(createStatusListService, {
            columns: JSON.stringify(STATUS_LIST_DEFAULT.columns),
            columnOrder: JSON.stringify(STATUS_LIST_DEFAULT.columnOrder),
            boardId: board.id,
          });
          yield put({ type: 'createBoardReducer', payload: board });
          callback(board);
        } else callback(null);
      } catch (error) {
        callback(null);
      }
    },
    *deleteBoard({ params, callback }, { put, call, all }) {
      try {
        const idStatusList = yield call(fetchStatusListService, { boardId: params.id });
        const boards = yield all([
          call(deleteBoardService, params.id),
          call(deleteStatusListService, { id: idStatusList[0].id }),
        ]);

        if (boards[0].id) {
          yield put({ type: 'deleteBoardReducer', payload: boards[0].id });
          callback(boards[0]);
        } else callback(null);
      } catch (error) {
        callback(null);
      }
    },
  },
  reducers: {
    fetchBoardReducer(state, action) {
      return action.payload;
    },
    updateBoardReducer(state, action) {
      return state.map((item) => {
        if (item.id !== action.payload.id) {
          return item;
        }
        return action.payload;
      });
    },
    createBoardReducer(state, action) {
      return [action.payload, ...state];
    },
    deleteBoardReducer(state, action) {
      return state.filter((item) => item.id !== action.payload);
    },
  },
};
