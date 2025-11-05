
import { LeadRepository } from '../../../domain/repositories/lead.repository.interface';
import { ApplicationError } from '../../../shared/erros/app.error';
import { LeadResponse } from '../../interfaces/lead';

export class GetLeadByIdUseCase {
  constructor(private leadRepository: LeadRepository) {}

  async execute(id: string): Promise<LeadResponse> {
    const lead = await this.leadRepository.findById(id);

    if (!lead) {
      throw new ApplicationError(`Lead with ID ${id} not found.`, 404);
    }

    return lead.toObject();
  }
}