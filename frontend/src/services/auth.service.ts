import { api, getErrorMessage } from './api';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  async login(payload: LoginPayload) {
    try {
      const response = await api.post('/auth/login', payload);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async register(payload: RegisterPayload) {
    try {
      const response = await api.post('/auth/register', payload);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
