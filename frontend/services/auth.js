import { api } from '@/services/api';

export async function loginRequest(payload) {
  const { data } = await api.post('/auth/login', payload);
  return data;
}

export async function registerRequest(payload) {
  const { data } = await api.post('/auth/register', payload);
  return data;
}
