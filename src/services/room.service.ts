import { Prisma } from "@prisma/client";
import { RoomRepository } from "../repositories/room.repository";
import { HttpError } from "../utils/http-error";

interface CreateRoomInput {
  type: string;
  capacity: number;
  price: number;
  hotelId: string;
}

interface UpdateRoomInput {
  type?: string;
  capacity?: number;
  price?: number;
  hotelId?: string;
}

interface AvailabilityInput {
  hotelId: string;
  startDate: string;
  endDate: string;
}

export class RoomService {
  constructor(private readonly roomRepository: RoomRepository) { }

  public async createRoom(input: CreateRoomInput) {
    await this.ensureHotelExists(input.hotelId);

    const data: Prisma.RoomUncheckedCreateInput = {
      type: input.type,
      capacity: input.capacity,
      price: input.price,
      hotelId: input.hotelId
    };

    return this.roomRepository.create(data);
  }

  public getRooms() {
    return this.roomRepository.findAll();
  }

  public async getRoomById(id: string) {
    const room = await this.roomRepository.findById(id);
    if (!room) {
      throw new HttpError("Room not found", 404);
    }

    return room;
  }

  public async updateRoom(id: string, input: UpdateRoomInput) {
    await this.getRoomById(id);

    if (input.hotelId) {
      await this.ensureHotelExists(input.hotelId);
    }

    const data: Prisma.RoomUncheckedUpdateInput = {
      type: input.type,
      capacity: input.capacity,
      price: input.price,
      hotelId: input.hotelId
    };

    return this.roomRepository.update(id, data);
  }

  public async deleteRoom(id: string) {
    await this.getRoomById(id);
    return this.roomRepository.delete(id);
  }

  public async getAvailableRooms(input: AvailabilityInput) {
    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      throw new HttpError("startDate and endDate must be valid ISO date strings", 400);
    }

    if (startDate >= endDate) {
      throw new HttpError("startDate must be earlier than endDate", 400);
    }

    await this.ensureHotelExists(input.hotelId);

    const rooms = await this.roomRepository.findAvailableRooms(input.hotelId, startDate, endDate);

    // Dynamic Pricing for display
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysToStart = Math.ceil((startDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));

    let multiplier = 1.0;
    if (daysToStart <= 3) {
      multiplier = 1.5;
    } else if (daysToStart <= 7) {
      multiplier = 1.2;
    }

    return rooms.map(room => ({
      ...room,
      price: Number(room.price) * multiplier
    }));
  }

  private async ensureHotelExists(hotelId: string): Promise<void> {
    const hotel = await this.roomRepository.findHotelById(hotelId);
    if (!hotel) {
      throw new HttpError("Hotel not found for this room", 404);
    }
  }
}
