import { generateUuid } from "../../shared/utils/uuid";

interface QuoteItemProps {
  id?: string;
  quoteId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total?: number; 
  createdAt?: Date;
  updatedAt?: Date;
}

export class QuoteItem {
  public readonly id: string;
  public quoteId: string;
  public description: string;
  public quantity: number;
  public unitPrice: number;
  public total: number;
  public readonly createdAt: Date;
  public updatedAt: Date;

  private constructor(props: QuoteItemProps) {
    this.id = props.id || generateUuid();
    this.quoteId = props.quoteId;
    this.description = props.description;
    this.quantity = props.quantity;
    this.unitPrice = props.unitPrice;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this.total = this.calculateTotal(); // Calculate on creation/hydration
  }

  public static create(props: QuoteItemProps): QuoteItem {
    if (!props.quoteId || !props.description || props.quantity <= 0 || props.unitPrice <= 0) {
      throw new Error('Quote ID, description, quantity (positive), and unit price (positive) are required for a quote item.');
    }
    return new QuoteItem(props);
  }

  private calculateTotal(): number {
    return this.quantity * this.unitPrice;
  }

  public update(updateProps: { description?: string; quantity?: number; unitPrice?: number }): void {
    if (updateProps.description !== undefined) this.description = updateProps.description;
    if (updateProps.quantity !== undefined) {
      if (updateProps.quantity <= 0) throw new Error('Quantity must be positive.');
      this.quantity = updateProps.quantity;
    }
    if (updateProps.unitPrice !== undefined) {
      if (updateProps.unitPrice <= 0) throw new Error('Unit price must be positive.');
      this.unitPrice = updateProps.unitPrice;
    }
    this.total = this.calculateTotal(); // Recalculate total
    this.updatedAt = new Date();
  }

  public toObject() {
    return {
      id: this.id,
      quoteId: this.quoteId,
      description: this.description,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      total: this.total,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}