import { QuoteRepository } from '../../../domain/repositories/quote.repository.interface';
import { ApplicationError } from '../../../shared/erros/app.error';
import { UpdateQuoteItemRequest, QuoteResponse } from '../../interfaces/quote';

export class UpdateQuoteItemUseCase {
  constructor(private quoteRepository: QuoteRepository) {}

  async execute(quoteId: string, itemId: string, request: UpdateQuoteItemRequest): Promise<QuoteResponse> {
    const existingQuote = await this.quoteRepository.findById(quoteId);

    if (!existingQuote) {
      throw new ApplicationError(`Quote with ID ${quoteId} not found.`, 404);
    }

    if (existingQuote.status !== 'DRAFT') {
      throw new ApplicationError('Cannot update items on a quote that is not in DRAFT status.', 400);
    }

    const existingItem = existingQuote.items.find(item => item.id === itemId);
    if (!existingItem) {
      throw new ApplicationError(`Quote item with ID ${itemId} not found in quote ${quoteId}.`, 404);
    }

    try {
      existingItem.update(request); // Update the item entity
      existingQuote.addOrUpdateItem(existingItem); // Re-add to trigger total recalculation
    } catch (domainError: any) {
      throw new ApplicationError(domainError.message, 400);
    }

    const updatedQuote = await this.quoteRepository.save(existingQuote);
    return updatedQuote.toObject();
  }
}