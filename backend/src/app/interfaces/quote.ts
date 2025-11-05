// src/app/interfaces/quote.ts
import { QuoteStatus } from '../../domain/entities/quote.entity';

export interface CreateQuoteItemRequest {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface QuoteItemResponse {
  id: string;
  quoteId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateQuoteRequest {
  leadId: string;
  items: CreateQuoteItemRequest[]; // Initial items for the quote
  expiresAt?: Date; // Optional expiry date
}

export interface UpdateQuoteRequest {
  leadId?: string;
  expiresAt?: Date;
}

export interface QuoteResponse {
  id: string;
  leadId: string;
  totalAmount: number;
  status: QuoteStatus;
  sentAt?: Date;
  signedAt?: Date;
  expiresAt?: Date;
  signedProof?: any;
  createdAt: Date;
  updatedAt: Date;
  items: QuoteItemResponse[];
}

export interface AddQuoteItemRequest {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface UpdateQuoteItemRequest {
  description?: string;
  quantity?: number;
  unitPrice?: number;
}

export interface MarkQuoteAsSentRequest {
    expiresAt: Date;
}

export interface MarkQuoteAsSignedRequest {
    signedProof: any;
}