
import { InstallationStatus } from '../../domain/entities/installation.entity';
import { QuoteItem } from '../../domain/entities/quote-item.entity';

export interface CreateInstallationRequest {
  quoteId: string;
}

export interface UpdateInstallationRequest {
  status?: InstallationStatus;
  startDate?: Date;
  endDate?: Date;
}

export interface InstallationResponse {
  id: string;
  quoteId: string;
  status: InstallationStatus;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date
}