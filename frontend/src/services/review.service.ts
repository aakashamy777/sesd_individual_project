import { api, getErrorMessage } from './api';

interface AddReviewPayload {
  hotelId: string;
  rating: number;
  comment: string;
}

export const reviewService = {
  async addReview(payload: AddReviewPayload) {
    try {
      const response = await api.post('/reviews', payload);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getHotelReviews(hotelId: string) {
    try {
      const response = await api.get(`/hotels/${hotelId}/reviews`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
