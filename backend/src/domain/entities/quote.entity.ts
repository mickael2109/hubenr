import { PrismaQuoteStatus } from "@prisma/client";
import { generateUuid } from "../../shared/utils/uuid";
import { QuoteItem } from "./quote-item.entity";


export enum QuoteStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  SIGNED = 'SIGNED',
  REFUSED = 'REFUSED',
  EXPIRED = 'EXPIRED',
}

interface QuoteProps {
  id?: string;
  leadId: string;
  totalAmount?: number; 
  status?: QuoteStatus;
  sentAt?: Date;
  signedAt?: Date;
  expiresAt?: Date;
  signedProof?: any; 
  createdAt?: Date;
  updatedAt?: Date;
  items?: QuoteItem[]; 
}

export class Quote {
  public readonly id: string;
  public leadId: string;
  public totalAmount: number;
  public status: QuoteStatus;
  public sentAt?: Date;
  public signedAt?: Date;
  public expiresAt?: Date;
  public signedProof?: any;
  public readonly createdAt: Date;
  public updatedAt: Date;
  private _items: QuoteItem[];

  private constructor(props: QuoteProps) {
    this.id = props.id || generateUuid();
    this.leadId = props.leadId;
    this.totalAmount = props.totalAmount ?? 0;
    this.status = props.status || QuoteStatus.DRAFT;
    this.sentAt = props.sentAt;
    this.signedAt = props.signedAt;
    this.expiresAt = props.expiresAt;
    this.signedProof = props.signedProof;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this._items = props.items || [];
    this.calculateTotalAmount(); 
  }

  public static create(props: QuoteProps): Quote {
    if (!props.leadId) {
      throw new Error('Lead ID is required for a quote.');
    }
    const quote = new Quote(props);
    return quote;
  }

  // Getters for items
  public get items(): QuoteItem[] {
    return [...this._items]; 
  }

  // Domain logic for adding items
  public addOrUpdateItem(item: QuoteItem): void {
    const existingIndex = this._items.findIndex(i => i.id === item.id);
    if (existingIndex !== -1) {
      this._items[existingIndex] = item; 
    } else {
      this._items.push(item); 
    }
    this.calculateTotalAmount();
    this.updatedAt = new Date();
  }

  public removeItem(itemId: string): void {
    const initialLength = this._items.length;
    this._items = this._items.filter(item => item.id !== itemId);
    if (this._items.length !== initialLength) { 
        this.calculateTotalAmount();
        this.updatedAt = new Date();
    }
  }

  private calculateTotalAmount(): void {
    this.totalAmount = this._items.reduce((sum, item) => sum + item.total, 0);
  }

  public markAsSent(expiresAt: Date): void {
    if (this.status !== QuoteStatus.DRAFT) {
      throw new Error('Only draft quotes can be marked as sent.');
    }
    this.status = QuoteStatus.SENT;
    this.sentAt = new Date();
    this.expiresAt = expiresAt;
    this.updatedAt = new Date();
  }

  public markAsSigned(signedProof: any): void {
    if (this.status !== QuoteStatus.SENT) {
      throw new Error('Only sent quotes can be marked as signed.');
    }
    this.status = QuoteStatus.SIGNED;
    this.signedAt = new Date();
    this.signedProof = signedProof;
    this.updatedAt = new Date();
  }

  public markAsRefused(): void {
    if (this.status !== QuoteStatus.SENT) {
      throw new Error('Only sent quotes can be marked as refused.');
    }
    this.status = QuoteStatus.REFUSED;
    this.updatedAt = new Date();
  }

  public markAsExpired(): void {
    if (this.status === QuoteStatus.SIGNED || this.status === QuoteStatus.REFUSED) {
      throw new Error('Signed or refused quotes cannot expire.');
    }
    if (this.expiresAt && new Date() < this.expiresAt) {
      throw new Error('Quote has not yet expired.');
    }
    this.status = QuoteStatus.EXPIRED;
    this.updatedAt = new Date();
  }

  public updateGeneralInfo(updateProps: { leadId?: string; expiresAt?: Date; signedProof?: any }): void {
    if (this.status !== QuoteStatus.DRAFT && this.status !== QuoteStatus.SENT) {
      throw new Error('Only draft or sent quotes can be updated.');
    }
    if (updateProps.leadId !== undefined) this.leadId = updateProps.leadId;
    if (updateProps.expiresAt !== undefined) this.expiresAt = updateProps.expiresAt;
    if (updateProps.signedProof !== undefined) this.signedProof = updateProps.signedProof;
    this.updatedAt = new Date();
  }

  public toObject() {
    return {
      id: this.id,
      leadId: this.leadId,
      totalAmount: this.totalAmount,
      status: this.status,
      sentAt: this.sentAt,
      signedAt: this.signedAt,
      expiresAt: this.expiresAt,
      signedProof: this.signedProof,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      items: this._items.map(item => item.toObject()),
    };
  }
}



export function prismaStatusToDomain(status: PrismaQuoteStatus): QuoteStatus {
  switch (status) {
    case 'DRAFT': return QuoteStatus.DRAFT;
    case 'SENT': return QuoteStatus.SENT;
    case 'SIGNED': return QuoteStatus.SIGNED;
    case 'REFUSED': return QuoteStatus.REFUSED;
    case 'EXPIRED': return QuoteStatus.EXPIRED;
    default: return status as unknown as QuoteStatus;
  }
}




export function recordToQuote(record: any): Quote {
  if (!record) return null as unknown as Quote;
  const props = { ...record, status: prismaStatusToDomain(record.status) };
  
  return Quote.create(props);
}