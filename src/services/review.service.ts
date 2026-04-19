import { Prisma } from "@prisma/client";
import { ReviewRepository } from "../repositories/review.repository";
import { HttpError } from "../utils/http-error";

interface CreateReviewInput {
  userId: string;
  hotelId: string;
  rating: number;
  comment: string;
}

export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  public async createReview(input: CreateReviewInput) {
    const comment = input.comment.trim();
    if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
      throw new HttpError("rating must be an integer between 1 and 5", 400);
    }

    if (!comment) {
      throw new HttpError("comment cannot be empty", 400);
    }

    const hotel = await this.reviewRepository.findHotelById(input.hotelId);
    if (!hotel) {
      throw new HttpError("Hotel not found", 404);
    }

    try {
      const review = await this.reviewRepository.createReview({
        userId: input.userId,
        hotelId: input.hotelId,
        rating: input.rating,
        comment
      });

      return {
        id: review.id,
        rating: review.rating,
        comment: review.comment ?? "",
        hotelId: review.hotelId,
        userId: review.userId,
        createdAt: review.createdAt
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new HttpError("You have already reviewed this hotel", 409);
      }

      throw error;
    }
  }

  public async getHotelReviews(hotelId: string) {
    const hotel = await this.reviewRepository.findHotelById(hotelId);
    if (!hotel) {
      throw new HttpError("Hotel not found", 404);
    }

    const reviews = await this.reviewRepository.findReviewsByHotelId(hotelId);
    return reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment ?? "",
      hotelId: review.hotelId,
      createdAt: review.createdAt,
      user: {
        id: review.user.id,
        name: review.user.name
      }
    }));
  }
}
