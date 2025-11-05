import { QuoteRepository } from '../../../domain/repositories/quote.repository.interface';
import { ApplicationError } from '../../../shared/erros/app.error';
import { QuoteResponse } from '../../interfaces/quote';
export class MarkQuoteAsRefusedUseCase {
  constructor(private quoteRepository: QuoteRepository) {}

  async execute(id: string): Promise<QuoteResponse> {
    const existingQuote = await this.quoteRepository.findById(id);

    if (!existingQuote) {
      throw new ApplicationError(`Quote with ID ${id} not found.`, 404);
    }

    try {
      existingQuote.markAsRefused();
    } catch (domainError: any) {
      throw new ApplicationError(domainError.message, 400);
    }

    const updatedQuote = await this.quoteRepository.save(existingQuote);
    return updatedQuote.toObject();
  }
}