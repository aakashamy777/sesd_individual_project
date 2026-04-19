import { api, getErrorMessage } from './api';

export const hotelService = {
  async getAllHotels(city?: string) {
    try {
      const response = await api.get('/hotels', {
        params: city ? { city } : undefined,
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getHotelById(hotelId: string) {
    try {
      const response = await api.get(`/hotels/${hotelId}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
