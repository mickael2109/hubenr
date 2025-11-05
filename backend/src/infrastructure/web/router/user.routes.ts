import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { CreateUserUseCase } from '../../../app/use-cases/user/create-user.use-case';
import { GetAllUsersUseCase } from '../../../app/use-cases/user/get-all-users.use-case';
import { PrismaUserRepository } from '../../database/repositories/user.repository';
import { GetUserByIdUseCase } from '../../../app/use-cases/user/get-user-by-id.use-case';
import { UpdateUserUseCase } from '../../../app/use-cases/user/update-user-use-case';
import { DeleteUserByIdUseCase } from '../../../app/use-cases/user/delete-user-by-id.use-case';
import { authMiddleware } from '../middlewares/auth.middleware';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request.interface';

const createUsersRouter = (): Router => {
  const router = Router();

  // Dependency Injection setup for User feature
  const userRepository = new PrismaUserRepository(); // Concrete implementation
  const createUserUseCase = new CreateUserUseCase(userRepository); // Use Case depends on interface
  const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
  const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
  const updateUserUseCase = new UpdateUserUseCase(userRepository);  
  const deleteUserUseCase = new DeleteUserByIdUseCase(userRepository);

  const userController = new UserController(createUserUseCase, getAllUsersUseCase, getUserByIdUseCase, updateUserUseCase, deleteUserUseCase);

  router.post('/register', (req, res) => userController.create(req, res));
  router.get('/', authMiddleware, (req, res) => userController.findAll(req as AuthenticatedRequest, res));
  // router.get('/', (req, res) => userController.findAll(req, res));
  router.get('/:id', (req, res) => userController.findById(req, res));
  router.put('/:id', (req, res) => userController.update(req, res));
  router.delete('/:id', (req, res) => userController.delete(req, res));

  return router;
};

export default createUsersRouter;