// src/infrastructure/web/controllers/reporting.controller.ts
import { Request, Response } from 'express';
import { GetDashboardStatsUseCase } from '../../../app/use-cases/reporting/get-dashboard-stats.use-case';
import { ApplicationError } from '../../../shared/erros/app.error';


export class ReportingController {
  constructor(
    private getDashboardStatsUseCase: GetDashboardStatsUseCase,
  ) {}

  async getDashboardStats(req: Request, res: Response) {
    try {
      const stats = await this.getDashboardStatsUseCase.execute();
      return res.status(200).json(stats);
    } catch (error: any) {
      console.error(`Error in ReportingController:`, error);
      if (error instanceof ApplicationError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Failed to retrieve dashboard stats.' });
    }
  }
}