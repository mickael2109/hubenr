import { QuoteRepository } from '../../../domain/repositories/quote.repository.interface';
import { QuoteStatus } from '../../../domain/entities/quote.entity';
import { ApplicationError } from '../../../shared/erros/app.error';

export class DeleteQuoteUseCase {
  constructor(private quoteRepository: QuoteRepository) {}

  async execute(id: string): Promise<void> {
    const existingQuote = await this.quoteRepository.findById(id);

    if (!existingQuote) {
      throw new ApplicationError(`Quote with ID ${id} not found.`, 404);
    }
    
    // Prevent deletion if quote is signed and has an installation
    // This will be checked in the repository or a domain service if complex
    if (existingQuote.status === QuoteStatus.SIGNED) {
        // Here, you might check for associated installations. For simplicity, we'll assume
        // The repository might handle cascade delete restrictions from the DB
        // or we'd inject an InstallationRepository to check.
        throw new ApplicationError(`Cannot delete a signed quote.`, 400);
    }

    await this.quoteRepository.delete(id);
  }
}