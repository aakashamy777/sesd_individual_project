import { Request, Response } from "express";
import { UserRole } from "@prisma/client";
import { AuthService } from "../services/auth.service";
import { HttpError } from "../utils/http-error";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  public register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, role } = req.body as {
      name?: string;
      email?: string;
      password?: string;
      role?: UserRole;
    };

    if (!name || !email || !password) {
      throw new HttpError("name, email, and password are required", 400);
    }

    const result = await this.authService.register({
      name,
      email,
      password,
      role
    });

    res.status(201).json(result);
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      throw new HttpError("email and password are required", 400);
    }

    const result = await this.authService.login({ email, password });

    res.status(200).json(result);
  };
}
