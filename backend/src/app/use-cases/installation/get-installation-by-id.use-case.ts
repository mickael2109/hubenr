// src/app/use-cases/installation/get-installation-by-id.use-case.ts
import { InstallationRepository } from '../../../domain/repositories/installation.repository.interface';
import { ApplicationError } from '../../../shared/erros/app.error';
import { InstallationResponse } from '../../interfaces/installation';

export class GetInstallationByIdUseCase {
  constructor(private installationRepository: InstallationRepository) {}

  async execute(id: string): Promise<InstallationResponse> {
    const installation = await this.installationRepository.findById(id);
    if (!installation) {
      throw new ApplicationError(`Installation with ID ${id} not found.`, 404);
    }
    return installation.toObject();
  }
}