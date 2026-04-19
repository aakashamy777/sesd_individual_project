import { Request, Response } from "express";
import { HealthService } from "../services/health.service";

export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  public getHealth = (_req: Request, res: Response): void => {
    const status = this.healthService.getHealthStatus();

    res.status(200).json({
      status
    });
  };
}
