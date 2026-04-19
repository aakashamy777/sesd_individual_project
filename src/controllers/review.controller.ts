import { Request, Response } from "express";
import { ReviewService } from "../services/review.service";
import { HttpError } from "../utils/http-error";

const getParamValue = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
};

export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  public createReview = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const { hotelId, rating, comment } = req.body as {
      hotelId?: string;
      rating?: number;
      comment?: string;
    };

    if (!userId) {
      throw new HttpError("Authenticated user not found in request", 401);
    }

    if (!hotelId || rating === undefined || comment === undefined) {
      throw new HttpError("hotelId, rating, and comment are required", 400);
    }

    const review = await this.reviewService.createReview({
      userId,
      hotelId,
      rating,
      comment
    });

    res.status(201).json(review);
  };

  public getHotelReviews = async (req: Request, res: Response): Promise<void> => {
    const hotelId = getParamValue(req.params.hotelId);
    if (!hotelId) {
      throw new HttpError("hotelId is required", 400);
    }

    const reviews = await this.reviewService.getHotelReviews(hotelId);
    res.status(200).json(reviews);
  };
}
