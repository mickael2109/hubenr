import { Installation, recordToInstallation } from '../../../domain/entities/installation.entity';
import { InstallationRepository } from '../../../domain/repositories/installation.repository.interface';
import { QuoteRepository } from '../../../domain/repositories/quote.repository.interface';
import { QuoteStatus } from '../../../domain/entities/quote.entity';
import { CreateInstallationRequest, InstallationResponse } from '../../interfaces/installation';
import { ApplicationError } from '../../../shared/erros/app.error';


export class CreateInstallationUseCase {
  constructor(
    private installationRepository: InstallationRepository,
    private quoteRepository: QuoteRepository,
  ) {}

  async execute(request: CreateInstallationRequest): Promise<InstallationResponse> {
    const quote = await this.quoteRepository.findById(request.quoteId);
    if (!quote) {
      throw new ApplicationError(`Quote with ID ${request.quoteId} not found.`, 404);
    }
    if (quote.status !== QuoteStatus.SIGNED) {
      throw new ApplicationError('Installations can only be created from SIGNED quotes.', 400);
    }

    const existingInstallation = await this.installationRepository.findByQuoteId(request.quoteId);
    if (existingInstallation) {
      throw new ApplicationError('An installation for this quote already exists.', 409);
    }

    
    const newInstallation = recordToInstallation({ quoteId: request.quoteId });
    
    const savedInstallation = await this.installationRepository.save(newInstallation);

    return savedInstallation.toObject();
  }
}