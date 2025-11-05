// src/app/use-cases/installation/update-installation.use-case.ts
import { InstallationRepository } from '../../../domain/repositories/installation.repository.interface';
import { ApplicationError } from '../../../shared/erros/app.error';
import { UpdateInstallationRequest, InstallationResponse } from '../../interfaces/installation';


export class UpdateInstallationUseCase {
  constructor(private installationRepository: InstallationRepository) {}

  async execute(id: string, request: UpdateInstallationRequest): Promise<InstallationResponse> {
    const existingInstallation = await this.installationRepository.findById(id);
    if (!existingInstallation) {
      throw new ApplicationError(`Installation with ID ${id} not found.`, 404);
    }

    // You can also move specific status transitions into the entity
    // e.g., existingInstallation.startInstallation(), existingInstallation.completeInstallation()
    existingInstallation.update(request);

    const updatedInstallation = await this.installationRepository.save(existingInstallation);
    return updatedInstallation.toObject();
  }
}