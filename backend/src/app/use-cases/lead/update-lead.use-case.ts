// src/app/use-cases/lead/update-lead.use-case.ts
import { PrismaLeadStatus } from '@prisma/client';
import { LeadRepository } from '../../../domain/repositories/lead.repository.interface';
import { UserRepository } from '../../../domain/repositories/user.repository.interface';
import { ApplicationError } from '../../../shared/erros/app.error';
import { UpdateLeadRequest, LeadResponse } from '../../interfaces/lead';
import { prismaStatusToDomain } from '../../../domain/entities/lead.entity';

export class UpdateLeadUseCase {
  constructor(
    private leadRepository: LeadRepository,
    private userRepository: UserRepository,
  ) {}

  async execute(id: string, request: UpdateLeadRequest): Promise<LeadResponse> {
    const existingLead = await this.leadRepository.findById(id);

    if (!existingLead) {
      throw new ApplicationError(`Lead with ID ${id} not found.`, 404, false);
    }

    // Check if new email conflicts with another lead's email
    if (request.email && request.email !== existingLead.email) {
      const leadWithSameEmail = await this.leadRepository.findByEmail(request.email);
      if (leadWithSameEmail && leadWithSameEmail.id !== id) {
        throw new ApplicationError('Another lead with this email already exists.', 409);
      }
    }

    // Validate assignedToUserId if provided
    if (request.assignedToUserId && request.assignedToUserId !== existingLead.assignedToUserId) {
      const assignedUser = await this.userRepository.findById(request.assignedToUserId);
      if (!assignedUser) {
        throw new ApplicationError(`Assigned user with ID ${request.assignedToUserId} not found.`, 400);
      }
    }

    try {
      const updateProps: any = { ...request };
      if (request.status !== undefined) {
        updateProps.status = prismaStatusToDomain(request.status as PrismaLeadStatus);
      }
      existingLead.update(updateProps);
    } catch (domainError: any) {
      throw new ApplicationError(domainError.message, 400);
    }

    const updatedLead = await this.leadRepository.save(existingLead);

    return updatedLead.toObject();
  }
}