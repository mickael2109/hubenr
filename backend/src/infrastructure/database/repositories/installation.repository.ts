import prisma from '../prisma/client';
import { domainStatusToPrismaInstallation, Installation, InstallationStatus, recordToInstallation } from '../../../domain/entities/installation.entity';
import { InstallationRepository } from '../../../domain/repositories/installation.repository.interface';

export class PrismaInstallationRepository implements InstallationRepository {
  async findById(id: string): Promise<Installation | null> {
    const record = await prisma.installation.findUnique({ where: { id } });
    return record ? recordToInstallation(record) : null;
  }
  
  async findByQuoteId(quoteId: string): Promise<Installation | null> {
    const record = await prisma.installation.findUnique({ where: { quoteId } });
    return record ? recordToInstallation(record) : null;
  }

  async findAll(status?: InstallationStatus): Promise<Installation[]> {
    const records = await prisma.installation.findMany({ 
      where: status ? { status } : {},
      include: { quote: true}
    });
    
    return records.map(record => recordToInstallation(record));
  }
  
  async save(installation: Installation): Promise<Installation> {
    const data = installation.toObject();

    

    const createData = {
      id: data.id,
      // quoteId: data.quoteId,
      startDate: data.startDate ?? new Date(),
      endDate: data.endDate ?? new Date(),
      status: domainStatusToPrismaInstallation(data.status),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      quote: { connect: { id: data.quoteId } },
    };
    
    const updateData = {
      startDate: data.startDate ?? new Date(),
      endDate: data.endDate ?? new Date(),
      status: domainStatusToPrismaInstallation(data.status),
      updatedAt: data.updatedAt,
    };

    console.log("createData : ",createData);
    

    const savedRecord = await prisma.installation.upsert({
      where: { id: installation.id },
      update: updateData,
      create: createData,
    });

    console.log("savedRecord: ",savedRecord);
    
    return recordToInstallation(savedRecord);
  }

  async delete(id: string): Promise<void> {
    await prisma.installation.delete({ where: { id } });
  }
}