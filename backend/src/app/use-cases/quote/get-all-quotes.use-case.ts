import { QuoteRepository } from '../../../domain/repositories/quote.repository.interface';
import { QuoteStatus } from '../../../domain/entities/quote.entity';
import { QuoteResponse } from '../../interfaces/quote';

export class GetAllQuotesUseCase {
  constructor(private quoteRepository: QuoteRepository) {}

  async execute(status?: QuoteStatus, leadId?: string): Promise<QuoteResponse[]> {
    const quotes = await this.quoteRepository.findAll(status, leadId);
    return quotes.map(quote => quote.toObject());
  }
}