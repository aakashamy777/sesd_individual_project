import { Request, Response } from "express";
import { RoomService } from "../services/room.service";
import { HttpError } from "../utils/http-error";

const getParamValue = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
};

const getQueryValue = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
};

export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  public createRoom = async (req: Request, res: Response): Promise<void> => {
    const { type, capacity, price, hotelId } = req.body as {
      type?: string;
      capacity?: number;
      price?: number;
      hotelId?: string;
    };

    if (!type || capacity === undefined || price === undefined || !hotelId) {
      throw new HttpError("type, capacity, price, and hotelId are required", 400);
    }

    const room = await this.roomService.createRoom({
      type,
      capacity,
      price,
      hotelId
    });

    res.status(201).json(room);
  };

  public getRooms = async (_req: Request, res: Response): Promise<void> => {
    const rooms = await this.roomService.getRooms();
    res.status(200).json(rooms);
  };

  public getAvailableRooms = async (req: Request, res: Response): Promise<void> => {
    const hotelId = getQueryValue(req.query.hotelId as string | string[] | undefined);
    const startDate = getQueryValue(req.query.startDate as string | string[] | undefined);
    const endDate = getQueryValue(req.query.endDate as string | string[] | undefined);

    if (!hotelId || !startDate || !endDate) {
      throw new HttpError("hotelId, startDate, and endDate are required", 400);
    }

    const rooms = await this.roomService.getAvailableRooms({
      hotelId,
      startDate,
      endDate
    });

    res.status(200).json(rooms);
  };

  public getRoomById = async (req: Request, res: Response): Promise<void> => {
    const roomId = getParamValue(req.params.id);
    const room = await this.roomService.getRoomById(roomId);
    res.status(200).json(room);
  };

  public updateRoom = async (req: Request, res: Response): Promise<void> => {
    const { type, capacity, price, hotelId } = req.body as {
      type?: string;
      capacity?: number;
      price?: number;
      hotelId?: string;
    };

    const roomId = getParamValue(req.params.id);
    const room = await this.roomService.updateRoom(roomId, {
      type,
      capacity,
      price,
      hotelId
    });

    res.status(200).json(room);
  };

  public deleteRoom = async (req: Request, res: Response): Promise<void> => {
    const roomId = getParamValue(req.params.id);
    await this.roomService.deleteRoom(roomId);
    res.status(204).send();
  };
}
