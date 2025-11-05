
import { LeadRepository } from '../../../domain/repositories/lead.repository.interface';
import { ApplicationError } from '../../../shared/erros/app.error';
import { DeleteResponse } from '../../interfaces/user';


export class DeleteLeadUseCase {
  constructor(private leadRepository: LeadRepository) {}

  async execute(id: string): Promise<DeleteResponse> {
    const existingLead = await this.leadRepository.findById(id);

    if (!existingLead) {
      throw new ApplicationError(`Lead with ID ${id} not found.`, 404);
    }
 

    await this.leadRepository.delete(id);

    
    return {
      id: existingLead.id
    }
  }
}