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
      try {
        const users = yield call(fetchUserService, params);
        yield put({ type: 'fetchUserReducer', payload: users });
      } catch (error) {
        yield put({ type: 'fetchUserReducer', payload: [] });
      }
    },
    *updateUser({ params, callback }, { put, call }) {
      try {
        const user = yield call(updateUserService, params);
        if (user.id) {
          yield put({ type: 'updateUserReducer', payload: user });
          callback(user);
        } else callback(null);
      } catch (error) {
        callback(null);
      }
    },
    *createUser({ params, callback }, { put, call }) {
      try {
        const users = yield call(fetchUserService);
        if (
          users.filter((user) => user.email === params.email || user.userName === params.userName)
            .length
        ) {
          callback({ isError: true, error: 'User name or email already exists' });
          return;
        }
        const user = yield call(createUserService, params);
        if (user.id) {
          yield put({ type: 'createUserReducer', payload: user });
          callback({ ...user, isError: false });
        } else callback(null);
      } catch (error) {
        callback(null);
      }
    },
    *deleteUser({ params, callback }, { put, call }) {
      try {
        const user = yield call(deleteUserService, params.id);
        if (user.id) {
          yield put({ type: 'deleteUserReducer', payload: user.id });
          callback(user);
        } else callback(null);
      } catch (error) {
        callback(null);
      }
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
          }
          return action.payload;
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
