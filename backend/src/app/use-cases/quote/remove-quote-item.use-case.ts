import { QuoteRepository } from '../../../domain/repositories/quote.repository.interface';
import { ApplicationError } from '../../../shared/erros/app.error';
import { QuoteResponse } from '../../interfaces/quote';

export class RemoveQuoteItemUseCase {
  constructor(private quoteRepository: QuoteRepository) {}

  async execute(quoteId: string, itemId: string): Promise<QuoteResponse> {
    const existingQuote = await this.quoteRepository.findById(quoteId);

    if (!existingQuote) {
      throw new ApplicationError(`Quote with ID ${quoteId} not found.`, 404);
    }

    if (existingQuote.status !== 'DRAFT') {
      throw new ApplicationError('Cannot remove items from a quote that is not in DRAFT status.', 400);
    }

    const initialItemCount = existingQuote.items.length;
    existingQuote.removeItem(itemId);

    if (existingQuote.items.length === initialItemCount) {
        throw new ApplicationError(`Quote item with ID ${itemId} not found in quote ${quoteId}.`, 404);
    }

    const updatedQuote = await this.quoteRepository.save(existingQuote);
    return updatedQuote.toObject();
  }
}