import { fetchUserService } from './service';

export default {
  namespace: 'users',
  state: [],
  effects: {
    *fetchUser({ params }, { put, call }) {
      const users = yield call(fetchUserService, params);
      yield put({ type: 'receiveUser', payload: users });
    }
  },
  reducers: {
    receiveUser(_, action) {
      return action.payload;
    },
  },
};
