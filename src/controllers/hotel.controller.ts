import { Request, Response } from "express";
import { HotelService } from "../services/hotel.service";
import { HttpError } from "../utils/http-error";

const getParamValue = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
};

export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  public createHotel = async (req: Request, res: Response): Promise<void> => {
    const { name, city, address, description } = req.body as {
      name?: string;
      city?: string;
      address?: string;
      description?: string;
    };

    if (!name || !city || !address) {
      throw new HttpError("name, city, and address are required", 400);
    }

    const hotel = await this.hotelService.createHotel({
      name,
      city,
      address,
      description
    });

    res.status(201).json(hotel);
  };

  public getHotels = async (_req: Request, res: Response): Promise<void> => {
    const hotels = await this.hotelService.getHotels();
    res.status(200).json(hotels);
  };

  public getHotelById = async (req: Request, res: Response): Promise<void> => {
    const hotelId = getParamValue(req.params.id);
    const hotel = await this.hotelService.getHotelById(hotelId);
    res.status(200).json(hotel);
  };

  public updateHotel = async (req: Request, res: Response): Promise<void> => {
    const { name, city, address, description } = req.body as {
      name?: string;
      city?: string;
      address?: string;
      description?: string;
    };

    const hotelId = getParamValue(req.params.id);
    const hotel = await this.hotelService.updateHotel(hotelId, {
      name,
      city,
      address,
      description
    });

    res.status(200).json(hotel);
  };

  public deleteHotel = async (req: Request, res: Response): Promise<void> => {
    const hotelId = getParamValue(req.params.id);
    await this.hotelService.deleteHotel(hotelId);
    res.status(204).send();
  };
}
