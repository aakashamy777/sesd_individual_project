import { Prisma } from "@prisma/client";
import { HotelRepository } from "../repositories/hotel.repository";
import { HttpError } from "../utils/http-error";

interface CreateHotelInput {
  name: string;
  city: string;
  address: string;
  description?: string;
}

interface UpdateHotelInput {
  name?: string;
  city?: string;
  address?: string;
  description?: string;
}

export class HotelService {
  constructor(private readonly hotelRepository: HotelRepository) {}

  public createHotel(input: CreateHotelInput) {
    const data: Prisma.HotelCreateInput = {
      name: input.name,
      city: input.city,
      address: input.address,
      description: input.description
    };

    return this.hotelRepository.create(data);
  }

  public getHotels() {
    return this.hotelRepository.findAll();
  }

  public async getHotelById(id: string) {
    const hotel = await this.hotelRepository.findById(id);
    if (!hotel) {
      throw new HttpError("Hotel not found", 404);
    }

    return hotel;
  }

  public async updateHotel(id: string, input: UpdateHotelInput) {
    await this.getHotelById(id);

    const data: Prisma.HotelUpdateInput = {
      name: input.name,
      city: input.city,
      address: input.address,
      description: input.description
    };

    return this.hotelRepository.update(id, data);
  }

  public async deleteHotel(id: string) {
    await this.getHotelById(id);

    const roomCount = await this.hotelRepository.countRoomsByHotelId(id);
    if (roomCount > 0) {
      throw new HttpError("Cannot delete hotel with existing rooms", 409);
    }

    return this.hotelRepository.delete(id);
  }
}
