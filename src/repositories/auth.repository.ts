import { User, UserRole } from "@prisma/client";
import { prisma } from "../utils/prisma";

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export class AuthRepository {
  public findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  public createUser(input: CreateUserInput): Promise<User> {
    return prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: input.password,
        role: input.role ?? UserRole.CUSTOMER
      }
    });
  }
}
