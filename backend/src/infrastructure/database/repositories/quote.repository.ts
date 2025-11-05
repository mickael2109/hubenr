import { Quote, QuoteStatus, recordToQuote } from "../../../domain/entities/quote.entity";
import prisma from '../prisma/client';
import { QuoteRepository } from "../../../domain/repositories/quote.repository.interface";
import { QuoteItem } from "../../../domain/entities/quote-item.entity";


export class PrismaQuoteRepository implements QuoteRepository {
  async findById(id: string): Promise<Quote | null> {
    const quoteRecord = await prisma.quote.findUnique({
      where: { id },
      include: {
        items: true, // Include related QuoteItems
      },
    });

    if (!quoteRecord) return null;

    // Re-hydrate QuoteItems as domain entities
    const items = quoteRecord.items.map(itemRecord => 
      QuoteItem.create(
        {
          ...itemRecord,
          unitPrice: Number(itemRecord.unitPrice), 
          total: Number(itemRecord.total),         
        }
      ));

    return recordToQuote({
         ...quoteRecord,
        totalAmount: Number(quoteRecord.totalAmount),
        items
    })
  }

  async findAll(status?: QuoteStatus, leadId?: string): Promise<Quote[]> {
    const whereClause: any = {};
    if (status) whereClause.status = status;
    if (leadId) whereClause.leadId = leadId;

    const quoteRecords = await prisma.quote.findMany({
      where: whereClause,
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

     
    return quoteRecords.map(record => {
      const items = record.items.map(itemRecord => QuoteItem.create({
        ...itemRecord,
        unitPrice: Number(itemRecord.unitPrice), 
        total: Number(itemRecord.total),    
      }));

      
    
      return recordToQuote({ ...record, items });
    });
  }

  async save(quote: Quote): Promise<Quote> {
    const quoteData = quote.toObject();
    const itemsData = quoteData.items; // Get items from the Quote entity

    // Prepare data for upsert operation
    const connectOrCreateItems = itemsData
      .filter(item => item.id) // Existing items
      .map(item => ({
        where: { id: item.id },
        update: {
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
        },
        create: {
          id: item.id, // For new items that already have a generated ID from entity
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
        },
      }));

    const createNewItems = itemsData
      .filter(item => !item.id) // New items without ID (should ideally have one from entity creation)
      .map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
      }));


    // Transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // 1. Get current items in DB for this quote to find items to delete
      const existingDbItems = await tx.quoteItem.findMany({
        where: { quoteId: quote.id },
        select: { id: true },
      });
      const dbItemIds = new Set(existingDbItems.map(item => item.id));
      const entityItemIds = new Set(itemsData.map(item => item.id));

      const itemsToDelete = Array.from(dbItemIds).filter(id => !entityItemIds.has(id));

      if (itemsToDelete.length > 0) {
        await tx.quoteItem.deleteMany({
          where: {
            id: { in: itemsToDelete },
            quoteId: quote.id,
          },
        });
      }

      // 2. Upsert the Quote itself
      const savedQuoteRecord = await tx.quote.upsert({
        where: { id: quote.id },
        update: {
          leadId: quote.leadId,
          totalAmount: quote.totalAmount,
          status: quote.status,
          sentAt: quote.sentAt,
          signedAt: quote.signedAt,
          expiresAt: quote.expiresAt,
          signedProof: quote.signedProof,
          updatedAt: new Date(),
          items: {
            upsert: itemsData.map(item => ({
              where: { id: item.id || '' }, // Must provide ID, even if new, for upsert. Entity generates ID.
              update: {
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                total: item.total,
              },
              create: {
                id: item.id, // Ensure new items created via upsert use the entity's generated ID
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                total: item.total,
              },
            })),
          },
        },
        create: {
          id: quote.id,
          leadId: quote.leadId,
          totalAmount: quote.totalAmount,
          status: quote.status,
          sentAt: quote.sentAt,
          signedAt: quote.signedAt,
          expiresAt: quote.expiresAt,
          signedProof: quote.signedProof,
          createdAt: quote.createdAt,
          updatedAt: quote.updatedAt,
          items: {
            create: itemsData.map(item => ({ // Create all items directly for a new quote
              id: item.id,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.total,
            })),
          },
        },
        include: { items: true }, // Include items to re-hydrate correctly
      });
      return savedQuoteRecord;
    });


    // Re-hydrate Quote and its items from the transaction result
    const items = result.items.map(itemRecord => QuoteItem.create({
      ...itemRecord,
      unitPrice: Number(itemRecord.unitPrice), 
      total: Number(itemRecord.total), 
    }));
    return recordToQuote({ ...result, items });
  }

  async delete(id: string): Promise<void> {
    await prisma.quoteItem.deleteMany({
      where: { quoteId: id },
    });
    await prisma.quote.delete({ where: { id } });
  }
}