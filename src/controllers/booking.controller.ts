import { Request, Response } from "express";
import { BookingService } from "../services/booking.service";
import { HttpError } from "../utils/http-error";

const getParamValue = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
};

export class BookingController {
  constructor(private readonly bookingService: BookingService) { }

  public createBooking = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const { roomId, startDate, endDate } = req.body as {
      roomId?: string;
      startDate?: string;
      endDate?: string;
    };

    if (!userId) {
      throw new HttpError("Authenticated user not found in request", 401);
    }

    if (!roomId || !startDate || !endDate) {
      throw new HttpError("roomId, startDate, and endDate are required", 400);
    }

    const booking = await this.bookingService.createBooking({
      userId,
      roomId,
      startDate,
      endDate
    });

    res.status(201).json(booking);
  };

  public getUserBookings = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      throw new HttpError("Authenticated user not found", 401);
    }
    const bookings = await this.bookingService.getUserBookings(userId);
    res.json(bookings);
  };

  public getAllBookings = async (req: Request, res: Response): Promise<void> => {
    const bookings = await this.bookingService.getAllBookings();
    res.json(bookings);
  };

  public cancelBooking = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const bookingId = getParamValue(req.params.id);

    if (!userId) {
      throw new HttpError("Authenticated user not found in request", 401);
    }

    if (!bookingId) {
      throw new HttpError("bookingId is required", 400);
    }

    const cancelledBooking = await this.bookingService.cancelBooking(bookingId, userId);

    res.status(200).json(cancelledBooking);
  };
}
