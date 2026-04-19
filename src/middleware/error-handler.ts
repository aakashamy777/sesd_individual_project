import { NextFunction, Request, Response } from "express";

interface ErrorWithStatus extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: ErrorWithStatus,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode ?? 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({ message });
};
