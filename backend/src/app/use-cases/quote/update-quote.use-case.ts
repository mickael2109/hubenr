
import { QuoteRepository } from '../../../domain/repositories/quote.repository.interface';
import { LeadRepository } from '../../../domain/repositories/lead.repository.interface';
import { UpdateQuoteRequest, QuoteResponse } from '../../interfaces/quote';
import { ApplicationError } from '../../../shared/erros/app.error';

export class UpdateQuoteUseCase {
  constructor(
    private quoteRepository: QuoteRepository,
    private leadRepository: LeadRepository,
  ) {}

  async execute(id: string, request: UpdateQuoteRequest): Promise<QuoteResponse> {
    const existingQuote = await this.quoteRepository.findById(id);

    if (!existingQuote) {
      throw new ApplicationError(`Quote with ID ${id} not found.`, 404);
    }

    // Only DRAFT or SENT quotes can be generally updated
    if (existingQuote.status !== 'DRAFT' && existingQuote.status !== 'SENT') {
      throw new ApplicationError(`Cannot update a quote with status ${existingQuote.status}.`, 400);
    }

    // Validate LeadId if changed
    if (request.leadId && request.leadId !== existingQuote.leadId) {
      const newLead = await this.leadRepository.findById(request.leadId);
      if (!newLead) {
        throw new ApplicationError(`New lead with ID ${request.leadId} not found.`, 400);
      }
    }

    try {
      existingQuote.updateGeneralInfo(request); // Update method on entity
    } catch (domainError: any) {
      throw new ApplicationError(domainError.message, 400);
    }

    const updatedQuote = await this.quoteRepository.save(existingQuote);

    return updatedQuote.toObject();
  }
}