import { stringify } from 'querystring';
import { history } from 'umi';
import { fakeAccountLogin } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, { userName: payload.userName });

      if (response.length) {
        if (response[0].password === payload.password) {
          yield put({
            type: 'changeLoginStatus',
            payload: { ...response[0], status: 'ok' },
          });

          const urlParams = new URL(window.location.href);
          const params = getPageQuery();
          let { redirect } = params;

          if (redirect) {
            const redirectUrlParams = new URL(redirect);

            if (redirectUrlParams.origin === urlParams.origin) {
              redirect = redirect.substr(urlParams.origin.length);

              if (redirect.match(/^\/.*#/)) {
                redirect = redirect.substr(redirect.indexOf('#') + 1);
              }
            } else {
              window.location.href = '/';
              return;
            }
          }

          history.replace(redirect || '/');
        } else {
          yield put({
            type: 'changeLoginStatus',
            payload: { status: 'error' },
          });
        }
      } else {
        yield put({
          type: 'changeLoginStatus',
          payload: { status: 'error' },
        });
      }
    },

    *logout() {
      yield window.localStorage.setItem("user", '{}');

      const { redirect } = getPageQuery(); // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.role);
      window.localStorage.setItem("user", JSON.stringify(payload));
      return { ...state, status: payload.status };
    },
  },
};
export default Model;
