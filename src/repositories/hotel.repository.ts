import { Hotel, Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";

export class HotelRepository {
  public create(data: Prisma.HotelCreateInput): Promise<Hotel> {
    return prisma.hotel.create({ data });
  }

  public findAll(): Promise<Hotel[]> {
    return prisma.hotel.findMany({
      orderBy: { createdAt: "desc" }
    });
  }

  public findById(id: string): Promise<Hotel | null> {
    return prisma.hotel.findUnique({ where: { id } });
  }

  public update(id: string, data: Prisma.HotelUpdateInput): Promise<Hotel> {
    return prisma.hotel.update({
      where: { id },
      data
    });
  }

  public delete(id: string): Promise<Hotel> {
    return prisma.hotel.delete({ where: { id } });
  }

  public countRoomsByHotelId(hotelId: string): Promise<number> {
    return prisma.room.count({
      where: { hotelId }
    });
  }
}
