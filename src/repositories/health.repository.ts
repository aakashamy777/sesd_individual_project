import { prisma } from "../utils/prisma";

export class HealthRepository {
  public getClient(): typeof prisma {
    return prisma;
  }
}
