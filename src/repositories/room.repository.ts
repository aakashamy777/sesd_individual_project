import { Prisma, Room } from "@prisma/client";
import { prisma } from "../utils/prisma";

export class RoomRepository {
  public create(data: Prisma.RoomUncheckedCreateInput): Promise<Room> {
    return prisma.room.create({ data });
  }

  public findAll(): Promise<Room[]> {
    return prisma.room.findMany({
      orderBy: { createdAt: "desc" }
    });
  }

  public findById(id: string): Promise<Room | null> {
    return prisma.room.findUnique({ where: { id } });
  }

  public update(id: string, data: Prisma.RoomUncheckedUpdateInput): Promise<Room> {
    return prisma.room.update({
      where: { id },
      data
    });
  }

  public delete(id: string): Promise<Room> {
    return prisma.room.delete({ where: { id } });
  }

  public findHotelById(hotelId: string): Promise<{ id: string } | null> {
    return prisma.hotel.findUnique({
      where: { id: hotelId },
      select: { id: true }
    });
  }

  public findAvailableRooms(
    hotelId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Room[]> {
    return prisma.room.findMany({
      where: {
        hotelId,
        bookings: {
          none: {
            startDate: {
              lt: endDate
            },
            endDate: {
              gt: startDate
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }
}
