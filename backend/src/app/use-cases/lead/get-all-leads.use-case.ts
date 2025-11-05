import { LeadRepository } from '../../../domain/repositories/lead.repository.interface';
import { LeadStatus } from '../../../domain/entities/lead.entity';
import { LeadResponse } from '../../interfaces/lead';

export class GetAllLeadsUseCase {
  constructor(private leadRepository: LeadRepository) {}

  async execute(status?: LeadStatus): Promise<LeadResponse[]> {
    const leads = ((await this.leadRepository.findAll(status)));
    
    return leads.map(lead => lead.toObject());
  }
}