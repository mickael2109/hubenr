// src/infrastructure/web/router/installation.routes.ts
import { Router } from 'express';
import { InstallationController } from '../controllers/installation.controller';
import { PrismaInstallationRepository } from '../../database/repositories/installation.repository';
import { PrismaQuoteRepository } from '../../database/repositories/quote.repository';
import { CreateInstallationUseCase } from '../../../app/use-cases/installation/create-installation.use-case';
import { GetAllInstallationsUseCase } from '../../../app/use-cases/installation/get-all-installations.use-case';
import { GetInstallationByIdUseCase } from '../../../app/use-cases/installation/get-installation-by-id.use-case';
import { UpdateInstallationUseCase } from '../../../app/use-cases/installation/update-installation.use-case';
import { DeleteInstallationUseCase } from '../../../app/use-cases/installation/delete-installation.use-case';

const createInstallationsRouter = (): Router => {
  const router = Router();

  // Dependency Injection
  const installationRepository = new PrismaInstallationRepository();
  const quoteRepository = new PrismaQuoteRepository();

  const createInstallationUseCase = new CreateInstallationUseCase(installationRepository, quoteRepository);
  const getAllInstallationsUseCase = new GetAllInstallationsUseCase(installationRepository);
  const getInstallationByIdUseCase = new GetInstallationByIdUseCase(installationRepository);
  const updateInstallationUseCase = new UpdateInstallationUseCase(installationRepository);
  const deleteInstallationUseCase = new DeleteInstallationUseCase(installationRepository);

  const installationController = new InstallationController(
    createInstallationUseCase,
    getAllInstallationsUseCase,
    getInstallationByIdUseCase,
    updateInstallationUseCase,
    deleteInstallationUseCase,
  );

  // Routes
  router.post('/', (req, res) => installationController.create(req, res));
  router.get('/', (req, res) => installationController.findAll(req, res));
  router.get('/:id', (req, res) => installationController.findById(req, res));
  router.put('/:id', (req, res) => installationController.update(req, res));
  router.delete('/:id', (req, res) => installationController.delete(req, res));

  return router;
};

export default createInstallationsRouter;