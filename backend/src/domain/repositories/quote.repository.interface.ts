import { Quote, QuoteStatus } from '../entities/quote.entity';

export interface QuoteRepository {
  findById(id: string): Promise<Quote | null>;
  findAll(status?: QuoteStatus, leadId?: string): Promise<Quote[]>;
  save(quote: Quote): Promise<Quote>; 
  delete(id: string): Promise<void>;
  // Additional methods if QuoteItem is managed separately
  // findQuoteItemById(itemId: string): Promise<QuoteItem | null>;
  // saveQuoteItem(item: QuoteItem): Promise<QuoteItem>;
  // deleteQuoteItem(itemId: string): Promise<void>;
}