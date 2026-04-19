import { HealthRepository } from "../repositories/health.repository";

export class HealthService {
  constructor(private readonly healthRepository: HealthRepository) {}

  public getHealthStatus(): string {
    this.healthRepository.getClient();
    return "ok";
  }
}
