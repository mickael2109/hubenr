// src/infrastructure/web/router/reporting.routes.ts
import { Router } from 'express';
import { ReportingController } from '../controllers/reporting.controller';
import { PrismaReportingRepository } from '../../database/repositories/reporting.repository';
import { GetDashboardStatsUseCase } from '../../../app/use-cases/reporting/get-dashboard-stats.use-case';

const createReportingRouter = (): Router => {
  const router = Router();

  // Dependency Injection
  const reportingRepository = new PrismaReportingRepository();
  const getDashboardStatsUseCase = new GetDashboardStatsUseCase(reportingRepository);
  const reportingController = new ReportingController(getDashboardStatsUseCase);

  // Routes
  router.get('/dashboard-stats', (req, res) => reportingController.getDashboardStats(req, res));

  return router;
};

export default createReportingRouter;