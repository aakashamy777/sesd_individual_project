import { Prisma, Review } from "@prisma/client";
import { prisma } from "../utils/prisma";

type ReviewWithUser = Review & {
  user: {
    id: string;
    name: string;
  };
};

export class ReviewRepository {
  public findHotelById(hotelId: string): Promise<{ id: string } | null> {
    return prisma.hotel.findUnique({
      where: { id: hotelId },
      select: { id: true }
    });
  }

  public createReview(data: Prisma.ReviewUncheckedCreateInput): Promise<Review> {
    return prisma.review.create({ data });
  }

  public findReviewsByHotelId(hotelId: string): Promise<ReviewWithUser[]> {
    return prisma.review.findMany({
      where: { hotelId },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }
}
