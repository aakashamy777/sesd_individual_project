import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { AuthRepository } from "../repositories/auth.repository";
import { HttpError } from "../utils/http-error";
import { env } from "../utils/env";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  public async register(input: RegisterInput): Promise<AuthResponse> {
    const existingUser = await this.authRepository.findUserByEmail(input.email);
    if (existingUser) {
      throw new HttpError("Email already registered", 409);
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const user = await this.authRepository.createUser({
      ...input,
      password: hashedPassword
    });

    return this.buildAuthResponse(user.id, user.name, user.email, user.role);
  }

  public async login(input: LoginInput): Promise<AuthResponse> {
    const user = await this.authRepository.findUserByEmail(input.email);
    if (!user) {
      throw new HttpError("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new HttpError("Invalid email or password", 401);
    }

    return this.buildAuthResponse(user.id, user.name, user.email, user.role);
  }

  private buildAuthResponse(
    id: string,
    name: string,
    email: string,
    role: UserRole
  ): AuthResponse {
    const payload = { sub: id, role };
    const signOptions: SignOptions = {
      expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"]
    };

    const token = jwt.sign(payload, env.jwtSecret, signOptions);

    return {
      token,
      user: { id, name, email, role }
    };
  }
}
