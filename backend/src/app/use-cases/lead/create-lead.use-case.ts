// src/app/use-cases/lead/create-lead.use-case.ts
import { Lead } from '../../../domain/entities/lead.entity';
import { LeadRepository } from '../../../domain/repositories/lead.repository.interface';
import { UserRepository } from '../../../domain/repositories/user.repository.interface'; 
import { ApplicationError } from '../../../shared/erros/app.error';
import { CreateLeadRequest, LeadResponse } from '../../interfaces/lead';

export class CreateLeadUseCase {
  constructor(
    private leadRepository: LeadRepository,
    private userRepository: UserRepository, 
  ) {}

  async execute(request: CreateLeadRequest): Promise<LeadResponse> {
    const existingLead = await this.leadRepository.findByEmail(request.email);
    if (existingLead) {
      throw new ApplicationError('Lead with this email already exists.', 409);
    }

    const assignedUser = await this.userRepository.findById(request.assignedToUserId);
    if (!assignedUser) {
      throw new ApplicationError(`Assigned user with ID ${request.assignedToUserId} not found.`, 400);
    }

    const newLead = Lead.create({
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
      phone: request.phone,
      company: request.company,
      assignedToUserId: request.assignedToUserId,
      assignedToUser: assignedUser
    });

    
    const savedLead = await this.leadRepository.save(newLead);

    
    return savedLead.toObject(); 
  }
}