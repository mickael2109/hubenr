import prisma from '../prisma/client';
import { domainStatusToPrisma, Lead, LeadStatus, recordToLead } from '../../../domain/entities/lead.entity';
import { LeadRepository } from '../../../domain/repositories/lead.repository.interface';




export class PrismaLeadRepository implements LeadRepository {
  async findById(id: string): Promise<Lead | null> {
    const leadRecord = await prisma.lead.findUnique({ where: { id } });
    if (!leadRecord) return null;
    return recordToLead(leadRecord);
  }

  async findByEmail(email: string): Promise<Lead | null> {
    const leadRecord = await prisma.lead.findUnique({ where: { email } });
    if (!leadRecord) return null;
    return recordToLead(leadRecord);
  }

  async findAll(status?: LeadStatus): Promise<Lead[]> {
    const whereClause = status ? { status: status } : {};
    const leadRecords = await prisma.lead.findMany({ 
      where: {
        ...whereClause,
      },
      include: {
        assignedToUser: true,
      }, 
    });
    
    return leadRecords.map(record => recordToLead(record));
  }

  async save(lead: Lead): Promise<Lead> {
    const data = lead.toObject();

    const prismaData = {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      company: data.company,
      status: domainStatusToPrisma(data.status),
      assignedToUserId: data.assignedToUserId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    const savedRecord = await prisma.lead.upsert({
      where: { id: lead.id },
      update: prismaData,
      create: prismaData,
      include: {
        assignedToUser: true,
      },
    });
    return recordToLead(savedRecord);
  }

  async delete(id: string): Promise<void> {
    await prisma.lead.delete({ where: { id } });
  }
}