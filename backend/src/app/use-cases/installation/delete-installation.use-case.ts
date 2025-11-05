// src/app/use-cases/installation/delete-installation.use-case.ts
import { InstallationRepository } from '../../../domain/repositories/installation.repository.interface';
import { ApplicationError } from '../../../shared/erros/app.error';

export class DeleteInstallationUseCase {
  constructor(private installationRepository: InstallationRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.installationRepository.findById(id);
    if (!existing) {
      throw new ApplicationError(`Installation with ID ${id} not found.`, 404);
    }
    await this.installationRepository.delete(id);
  }
}