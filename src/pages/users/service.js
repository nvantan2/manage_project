import request from '@/utils/request';

const URL = '/users';

export const fetchUserService = async (params) => request(URL, { params });

export const deleteUserService = async (id) => request(`${URL}/${id}`, { method: 'DELETE' });

export const createUserService = async (params) => request(URL, { method: 'POST', data: params });

export const updateUserService = async (params) =>
  request(`${URL}/${params.id}`, { method: 'PUT', data: params });
