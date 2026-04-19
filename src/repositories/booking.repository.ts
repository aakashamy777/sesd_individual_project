import { Booking, BookingStatus, Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";

export class BookingRepository {
  public runInTransaction<T>(
    handler: (tx: Prisma.TransactionClient) => Promise<T>
  ): Promise<T> {
    return prisma.$transaction(handler, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable
    });
  }

  public findRoomById(
    tx: Prisma.TransactionClient,
    roomId: string
  ): Promise<{ id: string; price: Prisma.Decimal } | null> {
    return tx.room.findUnique({
      where: { id: roomId },
      select: {
        id: true,
        price: true
      }
    });
  }

  public countOverlappingBookings(
    tx: Prisma.TransactionClient,
    roomId: string,
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    return tx.booking.count({
      where: {
        roomId,
        startDate: { lt: endDate },
        endDate: { gt: startDate }
      }
    });
  }

  public createConfirmedBooking(
    tx: Prisma.TransactionClient,
    data: {
      userId: string;
      roomId: string;
      startDate: Date;
      endDate: Date;
      totalPrice: number;
    }
  ): Promise<Booking> {
    return tx.booking.create({
      data: {
        userId: data.userId,
        roomId: data.roomId,
        startDate: data.startDate,
        endDate: data.endDate,
        totalPrice: data.totalPrice,
        status: BookingStatus.CONFIRMED
      }
    });
  }

  public findBookingById(bookingId: string): Promise<Booking | null> {
    return prisma.booking.findUnique({
      where: { id: bookingId }
    });
  }

  public findUserBookings(userId: string): Promise<Booking[]> {
    return prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
  }

  public findAllBookings(): Promise<Booking[]> {
    return prisma.booking.findMany({
      orderBy: { createdAt: "desc" }
    });
  }

  public cancelBooking(bookingId: string): Promise<Booking> {
    return prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CANCELLED
      }
    });
  }
}
