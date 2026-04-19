import { api, getErrorMessage } from './api';

interface CreateBookingPayload {
  roomId: string;
  startDate: string;
  endDate: string;
}

export const bookingService = {
  async createBooking(payload: CreateBookingPayload) {
    try {
      const response = await api.post('/bookings', payload);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getUserBookings() {
    try {
      const response = await api.get('/bookings/me');
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      if (message.includes('404')) {
        throw new Error('Bookings list endpoint is unavailable on the backend.');
      }
      throw new Error(getErrorMessage(error));
    }
  },

  async cancelBooking(bookingId: string) {
    try {
      const response = await api.patch(`/bookings/${bookingId}/cancel`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
