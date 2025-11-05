// src/app/use-cases/quote/process-signature-webhook.use-case.ts
import { QuoteRepository } from '../../../domain/repositories/quote.repository.interface';
import { ApplicationError } from '../../../shared/erros/app.error';

interface WebhookPayload {
  quoteId: string;
  status: 'signed' | 'refused' | 'expired';
  eventData: any;
}

export class ProcessSignatureWebhookUseCase {
  constructor(private quoteRepository: QuoteRepository) {}

  async execute(payload: WebhookPayload): Promise<void> {
    const quote = await this.quoteRepository.findById(payload.quoteId);
    if (!quote) {
      console.error(`Webhook received for non-existent quote ID: ${payload.quoteId}`);
      return;
    }

    try {
      switch (payload.status) {
        case 'signed':
          quote.markAsSigned(payload.eventData);
          break;
        case 'refused':
          quote.markAsRefused();
          break;
        case 'expired':
          quote.markAsExpired();
          break;
        default:
          throw new ApplicationError(`Invalid webhook status: ${payload.status}`, 400);
      }
      await this.quoteRepository.save(quote);
    } catch (error: any) {
        console.error(`Error processing webhook for quote ${payload.quoteId}:`, error.message);
    }
  }
}