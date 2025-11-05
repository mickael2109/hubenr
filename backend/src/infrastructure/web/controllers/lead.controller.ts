import { Request, Response } from 'express';
import { CreateLeadUseCase } from '../../../app/use-cases/lead/create-lead.use-case';
import { GetAllLeadsUseCase } from '../../../app/use-cases/lead/get-all-leads.use-case';
import { GetLeadByIdUseCase } from '../../../app/use-cases/lead/get-lead-by-id.use-case';
import { UpdateLeadUseCase } from '../../../app/use-cases/lead/update-lead.use-case';
import { DeleteLeadUseCase } from '../../../app/use-cases/lead/delete-lead.use-case'; 
import { CreateLeadRequest, UpdateLeadRequest } from '../../../app/interfaces/lead';
import { LeadStatus } from '../../../domain/entities/lead.entity';
import { ApplicationError } from '../../../shared/erros/app.error';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request.interface';

export class LeadController {
  constructor(
    private createLeadUseCase: CreateLeadUseCase,
    private getAllLeadsUseCase: GetAllLeadsUseCase,
    private getLeadByIdUseCase: GetLeadByIdUseCase,
    private updateLeadUseCase: UpdateLeadUseCase,
    private deleteLeadUseCase: DeleteLeadUseCase, 
  ) {}

  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const createRequest = req.body as CreateLeadRequest;

      // Basic validation
      if (!createRequest.firstName || !createRequest.lastName || !createRequest.email || !createRequest.assignedToUserId) {
        return res.status(400).json({ message: 'Missing required fields for lead creation.' });
      }

      const lead = await this.createLeadUseCase.execute(createRequest);
      return res.status(201).json({
        success: true,
        data: lead,
      });
    } catch (error: any) {
      console.error('Error in LeadController.create:', error);
      if (error instanceof ApplicationError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Failed to create lead.', success: false });
    }
  }

  async findAll(req: AuthenticatedRequest, res: Response) {
    try {
      const statusFilter = req.query.status as LeadStatus | undefined;
      // Basic validation for status filter
      if (statusFilter && !Object.values(LeadStatus).includes(statusFilter)) {
        return res.status(400).json({ message: `Invalid status filter: ${statusFilter}`, success: false });
      }

      const leads = await this.getAllLeadsUseCase.execute(statusFilter);
      
      return res.status(200).json({
        success: true,
        data: leads,
      });
    } catch (error: any) {
      console.error('Error in LeadController.findAll:', error);
      return res.status(500).json({ message: 'Failed to retrieve leads.', success: false });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const lead = await this.getLeadByIdUseCase.execute(id);
      return res.status(200).json(lead);
    } catch (error: any) {
      console.error('Error in LeadController.findById:', error);
      if (error instanceof ApplicationError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Failed to retrieve lead.', success: false });
    }
  }

  async update(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body as UpdateLeadRequest;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: 'At least one field must be provided for update.', success: false });
      }

      const updatedLead = await this.updateLeadUseCase.execute(id, updateData);
      return res.status(200).json({
        success: true,
        data: updatedLead,
      });
    } catch (error: any) {
      console.error('Error in LeadController.update:', error);
      if (error instanceof ApplicationError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Failed to update lead.', success: false });
    }
  }

  // New method for delete
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deletedLead = await this.deleteLeadUseCase.execute(id);
      return res.status(200).json({
        success: true,
        data: deletedLead,
      }); 
    } catch (error: any) {
      console.error('Error in LeadController.delete:', error);
      if (error instanceof ApplicationError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Failed to delete lead.', success: false });
    }
  }
}