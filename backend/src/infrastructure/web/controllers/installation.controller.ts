// src/infrastructure/web/controllers/installation.controller.ts
import { Request, Response } from 'express';
import { CreateInstallationUseCase } from '../../../app/use-cases/installation/create-installation.use-case';
import { GetAllInstallationsUseCase } from '../../../app/use-cases/installation/get-all-installations.use-case';
import { GetInstallationByIdUseCase } from '../../../app/use-cases/installation/get-installation-by-id.use-case';
import { UpdateInstallationUseCase } from '../../../app/use-cases/installation/update-installation.use-case';
import { CreateInstallationRequest, UpdateInstallationRequest } from '../../../app/interfaces/installation';
import { InstallationStatus } from '../../../domain/entities/installation.entity';
import { DeleteInstallationUseCase } from '../../../app/use-cases/installation/delete-installation.use-case';
import { ApplicationError } from '../../../shared/erros/app.error';

export class InstallationController {
  constructor(
    private createInstallationUseCase: CreateInstallationUseCase,
    private getAllInstallationsUseCase: GetAllInstallationsUseCase,
    private getInstallationByIdUseCase: GetInstallationByIdUseCase,
    private updateInstallationUseCase: UpdateInstallationUseCase,
    private deleteInstallationUseCase: DeleteInstallationUseCase,
  ) {}

  async create(req: Request, res: Response) {
    try {
      const request = req.body as CreateInstallationRequest;
      if (!request.quoteId) {
        return res.status(400).json({ message: 'quoteId is required.', success: false });
      }
      const installation = await this.createInstallationUseCase.execute(request);
      return res.status(201).json({
        data: installation,
        success: true
      });
    } catch (error: any) {
      this.handleError(error, res, 'Failed to create installation.');
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const status = req.query.status as InstallationStatus | undefined;
      const installations = await this.getAllInstallationsUseCase.execute(status);
      return res.status(200).json({
        data: installations,
        success: true
      });
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve installations.');
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const installation = await this.getInstallationByIdUseCase.execute(id);
      return res.status(200).json({
        data: installation,
        success: true
      });
    } catch (error: any) {
      this.handleError(error, res, 'Failed to retrieve installation.');
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const request = req.body as UpdateInstallationRequest;
      const updated = await this.updateInstallationUseCase.execute(id, request);
      return res.status(200).json({
        data: updated,
        success: true
      });
    } catch (error: any) {
      this.handleError(error, res, 'Failed to update installation.');
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.deleteInstallationUseCase.execute(id);
      return res.status(204).send({
        success: true,
        data: {
          id: id
        }
      });
    } catch (error: any) {
      this.handleError(error, res, 'Failed to delete installation.');
    }
  }

  private handleError(error: any, res: Response, defaultMessage: string) {
    console.error(`Error in InstallationController:`, error);
    if (error instanceof ApplicationError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: defaultMessage });
  }
}