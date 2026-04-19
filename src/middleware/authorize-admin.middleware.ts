import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/http-error";

export const requireAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== "ADMIN") {
    throw new HttpError("Admin access required", 403);
  }

  next();
};
