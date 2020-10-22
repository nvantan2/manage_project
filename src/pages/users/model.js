import {
  createUserService,
  deleteUserService,
  fetchUserService,
  updateUserService,
} from './service';

export default {
  namespace: 'users',
  state: { data: [], isError: false },
  effects: {
    *fetchUser({ params }, { put, call }) {
      const users = yield call(fetchUserService, params);
      yield put({ type: 'fetchUserReducer', payload: users });
    },
    *updateUser({ params, callback }, { put, call }) {
      const user = yield call(updateUserService, params);
      if (user.id) {
        yield put({ type: 'updateUserReducer', payload: user });
        callback(user);
      } else callback(null);
      // try {
      //   const user = yield call(updateUserService, params);
      //   yield put({ type: 'updateUserReducer', payload: user });
      //   callback(user);
      // } catch (error) {
      //   callback(null);
      // }
    },
    *createUser({ params, callback }, { put, call }) {
      const user = yield call(createUserService, params);
      if (user.id) {
        yield put({ type: 'createUserReducer', payload: user });
        callback(user);
      } else callback(null);
    },
    *deleteUser({ params, callback }, { put, call }) {
      const user = yield call(deleteUserService, params.id);
      if (user.id) {
        yield put({ type: 'deleteUserReducer', payload: user.id });
        callback(user);
      } else callback(null);
    },
  },
  reducers: {
    fetchUserReducer(state, action) {
      return { ...state, data: action.payload };
    },
    updateUserReducer(state, action) {
      return {
        ...state,
        data: state.data.map((item) => {
          if (item.id !== action.payload.id) {
            return item;
          } return action.payload;
        }),
      };
    },
    createUserReducer(state, action) {
      return {
        ...state,
        data: [action.payload, ...state.data],
      };
    },
    deleteUserReducer(state, action) {
      return {
        ...state,
        data: [...state.data.filter((item) => item.id !== action.payload)],
      };
    },
  },
};
