import { api, getErrorMessage } from './api';

interface AvailableRoomsParams {
  hotelId: string;
  startDate: string;
  endDate: string;
}

export const roomService = {
  async getAvailableRooms({ hotelId, startDate, endDate }: AvailableRoomsParams) {
    try {
      const response = await api.get('/rooms/available', {
        params: { hotelId, startDate, endDate },
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
