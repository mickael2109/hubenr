
import { QuoteRepository } from '../../../domain/repositories/quote.repository.interface';
import { ApplicationError } from '../../../shared/erros/app.error';
import { MarkQuoteAsSentRequest, QuoteResponse } from '../../interfaces/quote';

export class MarkQuoteAsSentUseCase {
  constructor(private quoteRepository: QuoteRepository) {}

  async execute(id: string, request: MarkQuoteAsSentRequest): Promise<QuoteResponse> {
    const existingQuote = await this.quoteRepository.findById(id);

    if (!existingQuote) {
      throw new ApplicationError(`Quote with ID ${id} not found.`, 404);
    }

    try {
      existingQuote.markAsSent(request.expiresAt);
    } catch (domainError: any) {
      throw new ApplicationError(domainError.message, 400);
    }

    const updatedQuote = await this.quoteRepository.save(existingQuote);
    return updatedQuote.toObject();
  }
}