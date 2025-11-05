import { Request, Response } from 'express';
import { ProcessSignatureWebhookUseCase } from '../../../app/use-cases/quote/process-signature-webhook.use-case';

export class WebhookController {
  constructor(
    private processSignatureWebhookUseCase: ProcessSignatureWebhookUseCase
  ) {}

  async handleUniversign(req: Request, res: Response) {
    try {
      const payload = req.body;
      
      await this.processSignatureWebhookUseCase.execute(payload);
      res.status(200).send({ 
        message: 'Webhook processed successfully.',
        data:{
          quoteId: payload.quoteId,
        },
        success: true,
       });
    } catch (error: any) {
      console.error('Webhook processing error:', error);
      res.status(500).send({ message: 'Error processing webhook.', success: false });
    }
  }
}