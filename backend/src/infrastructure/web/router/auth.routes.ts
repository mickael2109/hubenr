import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { LoginUseCase } from '../../../app/use-cases/auth/login.use-case';
import { RefreshTokenUseCase } from '../../../app/use-cases/auth/refresh-token.use-case';
import { PrismaUserRepository } from '../../database/repositories/user.repository';
import { GetUserProfileUseCase } from '../../../app/use-cases/auth/get-user-profile.use-case';
import { authMiddleware } from '../middlewares/auth.middleware';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request.interface';

const createAuthRouter = (): Router => {
  const router = Router();
  const userRepository = new PrismaUserRepository();
  
  const loginUseCase = new LoginUseCase(userRepository);
  const refreshTokenUseCase = new RefreshTokenUseCase();
  const getUserProfileUseCase = new GetUserProfileUseCase(userRepository);
  
  const authController = new AuthController(loginUseCase, refreshTokenUseCase, getUserProfileUseCase);
  
  router.post('/login', (req, res) => authController.login(req, res));
  router.post('/refresh-token', (req, res) => authController.refresh(req, res));
  router.get(
    '/me',
    authMiddleware,
    (req, res) => authController.getProfile(req as AuthenticatedRequest, res)
  );

  return router;
};

export default createAuthRouter;