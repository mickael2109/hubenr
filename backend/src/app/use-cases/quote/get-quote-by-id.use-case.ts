import { QuoteRepository } from '../../../domain/repositories/quote.repository.interface';
import { ApplicationError } from '../../../shared/erros/app.error';
import { QuoteResponse } from '../../interfaces/quote';

export class GetQuoteByIdUseCase {
  constructor(private quoteRepository: QuoteRepository) {}

  async execute(id: string): Promise<QuoteResponse> {
    const quote = await this.quoteRepository.findById(id);

    if (!quote) {
      throw new ApplicationError(`Quote with ID ${id} not found.`, 404);
    }

    return quote.toObject();
  }
}