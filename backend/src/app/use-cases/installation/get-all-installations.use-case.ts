// src/app/use-cases/installation/get-all-installations.use-case.ts
import { InstallationRepository } from '../../../domain/repositories/installation.repository.interface';
import { InstallationStatus } from '../../../domain/entities/installation.entity';
import { InstallationResponse } from '../../interfaces/installation';

export class GetAllInstallationsUseCase {
  constructor(private installationRepository: InstallationRepository) {}

  async execute(status?: InstallationStatus): Promise<InstallationResponse[]> {
    const installations = await this.installationRepository.findAll(status);
    return installations.map(installation => installation.toObject());
  }
}