
import { Quote } from '../../../domain/entities/quote.entity';
import { QuoteItem } from '../../../domain/entities/quote-item.entity';
import { QuoteRepository } from '../../../domain/repositories/quote.repository.interface';
import { LeadRepository } from '../../../domain/repositories/lead.repository.interface';
import { CreateQuoteRequest, QuoteResponse } from '../../interfaces/quote';
import { ApplicationError } from '../../../shared/erros/app.error';

export class CreateQuoteUseCase {
  constructor(
    private quoteRepository: QuoteRepository,
    private leadRepository: LeadRepository,
  ) {}

  async execute(request: CreateQuoteRequest): Promise<QuoteResponse> {
    // 1. Validate Lead
    const existingLead = await this.leadRepository.findById(request.leadId);
    if (!existingLead) {
      throw new ApplicationError(`Lead with ID ${request.leadId} not found.`, 400);
    }

    // 2. Create Quote Entity
    const newQuote = Quote.create({
      leadId: request.leadId,
      expiresAt: request.expiresAt,
    });

    // 3. Create QuoteItem Entities and add to Quote
    const quoteItems: QuoteItem[] = [];
    for (const itemRequest of request.items) {
      const quoteItem = QuoteItem.create({
        quoteId: newQuote.id, // Assign to the new quote's ID
        description: itemRequest.description,
        quantity: itemRequest.quantity,
        unitPrice: itemRequest.unitPrice,
      });
      quoteItems.push(quoteItem);
    }
    newQuote.items.forEach(item => newQuote.addOrUpdateItem(item)); // Add items to entity

    // 4. Save Quote (which should also handle items through its repository)
    const savedQuote = await this.quoteRepository.save(newQuote);

    return savedQuote.toObject();
  }
}