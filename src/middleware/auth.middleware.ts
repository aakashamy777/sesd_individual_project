import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../utils/env";
import { HttpError } from "../utils/http-error";

interface AuthTokenPayload extends JwtPayload {
  sub: string;
  role?: string;
}

const extractBearerToken = (authorizationHeader?: string): string => {
  if (!authorizationHeader) {
    throw new HttpError("Authorization token is missing", 401);
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new HttpError("Invalid authorization header format", 401);
  }

  return token;
};

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const token = extractBearerToken(req.headers.authorization);

  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    if (typeof decoded === "string" || !decoded.sub) {
      throw new HttpError("Invalid token payload", 401);
    }

    const payload = decoded as AuthTokenPayload;
    req.user = {
      id: payload.sub,
      role: payload.role
    };

    next();
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    throw new HttpError("Invalid or expired token", 401);
  }
};
