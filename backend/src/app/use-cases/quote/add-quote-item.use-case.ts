import { QuoteRepository } from '../../../domain/repositories/quote.repository.interface';
import { QuoteItem } from '../../../domain/entities/quote-item.entity';
import { AddQuoteItemRequest, QuoteResponse } from '../../interfaces/quote';
import { ApplicationError } from '../../../shared/erros/app.error';

export class AddQuoteItemUseCase {
  constructor(private quoteRepository: QuoteRepository) {}

  async execute(quoteId: string, request: AddQuoteItemRequest): Promise<QuoteResponse> {
    const existingQuote = await this.quoteRepository.findById(quoteId);

    if (!existingQuote) {
      throw new ApplicationError(`Quote with ID ${quoteId} not found.`, 404);
    }

    if (existingQuote.status !== 'DRAFT') {
      throw new ApplicationError('Cannot add items to a quote that is not in DRAFT status.', 400);
    }

    try {
      const newItem = QuoteItem.create({
        quoteId: quoteId,
        description: request.description,
        quantity: request.quantity,
        unitPrice: request.unitPrice,
      });
      existingQuote.addOrUpdateItem(newItem);
    } catch (domainError: any) {
      throw new ApplicationError(domainError.message, 400);
    }

    const updatedQuote = await this.quoteRepository.save(existingQuote);
    return updatedQuote.toObject();
  }
}