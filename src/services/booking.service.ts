import { BookingStatus, Prisma } from "@prisma/client";
import { BookingRepository } from "../repositories/booking.repository";
import { HttpError } from "../utils/http-error";

interface CreateBookingInput {
  userId: string;
  roomId: string;
  startDate: string;
  endDate: string;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export class BookingService {
  constructor(private readonly bookingRepository: BookingRepository) { }

  public async createBooking(input: CreateBookingInput) {
    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new HttpError("startDate and endDate must be valid ISO date strings", 400);
    }

    if (startDate >= endDate) {
      throw new HttpError("startDate must be earlier than endDate", 400);
    }

    const startDateOnly = new Date(startDate);
    startDateOnly.setHours(0, 0, 0, 0);

    const currentDateOnly = new Date();
    currentDateOnly.setHours(0, 0, 0, 0);

    if (startDateOnly < currentDateOnly) {
      throw new HttpError("startDate must be today or a future date", 400);
    }

    try {
      return await this.createBookingTransaction(input.userId, input.roomId, startDate, endDate);
    } catch (error: any) {
      if (error instanceof HttpError) {
        throw error;
      }

      if (error?.code === "P2034") {
        try {
          return await this.createBookingTransaction(
            input.userId,
            input.roomId,
            startDate,
            endDate
          );
        } catch (retryError: any) {
          if (retryError?.code === "P2034") {
            throw new HttpError("Booking conflicted with another request, please retry", 409);
          }

          if (retryError instanceof HttpError) {
            throw retryError;
          }

          throw retryError;
        }
      }

      throw error;
    }
  }

  public async getUserBookings(userId: string) {
    return this.bookingRepository.findUserBookings(userId);
  }

  public async getAllBookings() {
    return this.bookingRepository.findAllBookings();
  }

  public async cancelBooking(bookingId: string, userId: string) {
    const booking = await this.bookingRepository.findBookingById(bookingId);
    if (!booking) {
      throw new HttpError("Booking not found", 404);
    }

    if (booking.userId !== userId) {
      throw new HttpError("You can only cancel your own booking", 403);
    }

    if (booking.status === BookingStatus.COMPLETED) {
      throw new HttpError("Completed bookings cannot be cancelled", 400);
    }

    const currentDate = new Date();
    const bookingEndDate = new Date(booking.endDate);
    if (currentDate > bookingEndDate) {
      throw new HttpError("Completed bookings cannot be cancelled", 400);
    }

    if (booking.status === BookingStatus.CANCELLED) {
      return booking;
    }

    return this.bookingRepository.cancelBooking(bookingId);
  }

  private createBookingTransaction(
    userId: string,
    roomId: string,
    startDate: Date,
    endDate: Date
  ) {
    return this.bookingRepository.runInTransaction(async (tx) => {
      const room = await this.bookingRepository.findRoomById(tx, roomId);
      if (!room) {
        throw new HttpError("Room not found", 404);
      }

      const overlappingCount = await this.bookingRepository.countOverlappingBookings(
        tx,
        roomId,
        startDate,
        endDate
      );

      if (overlappingCount > 0) {
        throw new HttpError("Room is not available for selected dates", 409);
      }

      const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / MS_PER_DAY);

      // Dynamic Pricing Logic
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const daysToStart = Math.ceil((startDate.getTime() - today.getTime()) / MS_PER_DAY);

      let multiplier = 1.0;
      if (daysToStart <= 3) {
        multiplier = 1.5; // 50% surge for near-day bookings
      } else if (daysToStart <= 7) {
        multiplier = 1.2; // 20% surge
      }

      const basePrice = Number(room.price);
      const dynamicPrice = basePrice * multiplier;
      const totalPrice = dynamicPrice * totalDays;

      return this.bookingRepository.createConfirmedBooking(tx, {
        userId,
        roomId,
        startDate,
        endDate,
        totalPrice
      });
    });
  }
}
