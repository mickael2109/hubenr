import { Installation, InstallationStatus } from '../entities/installation.entity';

export interface InstallationRepository {
  findById(id: string): Promise<Installation | null>;
  findByQuoteId(quoteId: string): Promise<Installation | null>;
  findAll(status?: InstallationStatus): Promise<Installation[]>;
  save(installation: Installation): Promise<Installation>;
  delete(id: string): Promise<void>;
}