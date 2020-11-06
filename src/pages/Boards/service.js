import request from '@/utils/request';

const URL = '/board';

export const fetchBoardService = async (params) => request(URL, { params });

export const deleteBoardService = async (id) => request(`${URL}/${id}`, { method: 'DELETE' });

export const createBoardService = async (params) => request(URL, { method: 'POST', data: params });

export const updateBoardService = async (params) =>
  request(`${URL}/${params.id}`, { method: 'PUT', data: params });

export const createStatusListService = async (params) =>
  request('/status_list', { method: 'POST', data: params });

export const fetchStatusListService = async (params) => request('/status_list', { params });

export const deleteStatusListService = async (params) =>
  request(`/status_list/${params.id}`, { method: 'DELETE' });
