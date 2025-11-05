
import { PrismaLeadStatus } from '@prisma/client';
import { Lead } from '../entities/lead.entity';

export interface LeadRepository {
  findById(id: string): Promise<Lead | null>;
  findByEmail(email: string): Promise<Lead | null>;
  findAll(status?: PrismaLeadStatus): Promise<Lead[]>; 
  save(lead: Lead): Promise<Lead>; 
  delete(id: string): Promise<void>;
}