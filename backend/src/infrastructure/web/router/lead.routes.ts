// src/infrastructure/web/router/lead.routes.ts
import { Router } from 'express';
import { LeadController } from '../controllers/lead.controller';
import { PrismaLeadRepository } from '../../database/repositories/lead.repository';
import { CreateLeadUseCase } from '../../../app/use-cases/lead/create-lead.use-case';
import { GetAllLeadsUseCase } from '../../../app/use-cases/lead/get-all-leads.use-case';
import { GetLeadByIdUseCase } from '../../../app/use-cases/lead/get-lead-by-id.use-case';
import { UpdateLeadUseCase } from '../../../app/use-cases/lead/update-lead.use-case';
import { DeleteLeadUseCase } from '../../../app/use-cases/lead/delete-lead.use-case';
import { PrismaUserRepository } from '../../database/repositories/user.repository'; 
import { authMiddleware } from '../middlewares/auth.middleware';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request.interface';
const createLeadsRouter = (): Router => {
  const router = Router();

  const leadRepository = new PrismaLeadRepository();
  const userRepository = new PrismaUserRepository(); 

  const createLeadUseCase = new CreateLeadUseCase(leadRepository, userRepository);
  const getAllLeadsUseCase = new GetAllLeadsUseCase(leadRepository);
  const getLeadByIdUseCase = new GetLeadByIdUseCase(leadRepository);
  const updateLeadUseCase = new UpdateLeadUseCase(leadRepository, userRepository);
  const deleteLeadUseCase = new DeleteLeadUseCase(leadRepository);

  const leadController = new LeadController(
    createLeadUseCase,
    getAllLeadsUseCase,
    getLeadByIdUseCase,
    updateLeadUseCase,
    deleteLeadUseCase,
  );

  router.post('/', authMiddleware, (req, res) => leadController.create(req as AuthenticatedRequest, res));
  router.get('/', authMiddleware, (req, res) => leadController.findAll(req as AuthenticatedRequest, res));
  router.get('/:id', (req, res) => leadController.findById(req, res));
  router.put('/:id', authMiddleware, (req, res) => leadController.update(req as AuthenticatedRequest, res));
  router.delete('/:id', (req, res) => leadController.delete(req, res));

  return router;
};

export default createLeadsRouter;