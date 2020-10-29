import request from '@/utils/request';

const URL_STATUS_LIST = '/status_list';
const URL_TASK = '/board_issue';

export const fetchStatusList = (params) => {
  return request(URL_STATUS_LIST, { params });
};

export const fetchTasks = (params) => {
  return request(URL_TASK, { params });
};

export const updateStatusList = (params) => {
  return request(`${URL_STATUS_LIST}/${params.id}`, { method: 'PUT', data: params });
};