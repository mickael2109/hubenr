// src/infrastructure/web/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { LoginUseCase } from '../../../app/use-cases/auth/login.use-case';
import { RefreshTokenUseCase } from '../../../app/use-cases/auth/refresh-token.use-case';
import { ApplicationError } from '../../../shared/erros/app.error';
import { GetUserProfileUseCase } from '../../../app/use-cases/auth/get-user-profile.use-case';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request.interface';

export class AuthController {
  constructor(
    private loginUseCase: LoginUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
    private getUserProfileUseCase: GetUserProfileUseCase,
  ) {}

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const tokens = await this.loginUseCase.execute({ email, password });
      return res.status(200).json({
        success: true,
        data: tokens,
      });
    } catch (error: any) {
      if (error instanceof ApplicationError) {
        return res.status(error.statusCode).json({ message: error.message, success: false });
      }
      return res.status(500).json({ message: 'Internal server error during login.', success: false });
    }
  }
  
  async refresh(req: Request, res: Response) {
      try {
          const { refreshToken } = req.body;
          if (!refreshToken) {
              return res.status(400).json({ message: 'Refresh token is required.', success: false });
          }
          const result = await this.refreshTokenUseCase.execute({ refreshToken });
          return res.status(200).json({
              success: true,
              data: result,
          });
      } catch (error: any) {
          if (error instanceof ApplicationError) {
              return res.status(error.statusCode).json({ message: error.message, success: false });
          }
          return res.status(500).json({ message: 'Internal server error during token refresh.', success: false });
      }
  }

  async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user.userId;
      
      const userProfile = await this.getUserProfileUseCase.execute(userId);
      
      return res.status(200).json({
        success: true,
        data: userProfile,
      });
    } catch (error: any) {
      if (error instanceof ApplicationError) {
        return res.status(error.statusCode).json({ message: error.message, success: false });
      }
      return res.status(500).json({ message: 'Internal server error while fetching user profile.' });
    }
  }
}