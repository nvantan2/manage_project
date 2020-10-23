import {
  createBoardService,
  deleteBoardService,
  fetchBoardService,
  updateBoardService,
} from './service';

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
          yield put({ type: 'createBoardReducer', payload: board });
          callback(board);
        } else callback(null);
      } catch (error) {
        callback(null);
      }
    },
    *deleteBoard({ params, callback }, { put, call }) {
      try {
        const board = yield call(deleteBoardService, params.id);
        if (board.id) {
          yield put({ type: 'deleteBoardReducer', payload: board.id });
          callback(board);
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
