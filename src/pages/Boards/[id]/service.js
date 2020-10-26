import request from '@/utils/request';

export const fetchStatusList = (params) => {
  return request('/status_list', {params});
};

export const fetchTasks = (params) => {
  return request(`/board_issue`, { params });
};
