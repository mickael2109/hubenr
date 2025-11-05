import { Router } from 'express';
import { WebhookController } from '../controllers/webhook.controller';
import { ProcessSignatureWebhookUseCase } from '../../../app/use-cases/quote/process-signature-webhook.use-case';
import { PrismaQuoteRepository } from '../../database/repositories/quote.repository';

const createWebhooksRouter = (): Router => {
    const router = Router();

    const quoteRepository = new PrismaQuoteRepository();
    const processSignatureWebhookUseCase = new ProcessSignatureWebhookUseCase(quoteRepository);
    const webhookController = new WebhookController(processSignatureWebhookUseCase);
    
    // As per requirements: POST /webhooks/universign
    router.post('/universign', (req, res) => webhookController.handleUniversign(req, res));

    return router;
};

export default createWebhooksRouter;