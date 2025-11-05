import { Router } from 'express';
import createUsersRouter from './user.routes';
import createLeadsRouter from './lead.routes';
import createQuotesRouter from './quote.routes';
import createInstallationsRouter from './installation.routes';
import createWebhooksRouter from './webhook.routes';
import createReportingRouter from './reporting.routes';
import createAuthRouter from './auth.routes';

const setupRoutes = (): Router => {
  const router = Router();
  router.use('/auth', createAuthRouter()); 
  router.use('/users', createUsersRouter()); 
  router.use('/leads', createLeadsRouter()); 
  router.use('/quotes', createQuotesRouter()); 
  router.use('/installations', createInstallationsRouter());
  router.use('/webhooks', createWebhooksRouter());
  router.use('/reporting', createReportingRouter());
  return router;
};

export default setupRoutes;