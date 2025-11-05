// src/app/use-cases/auth/refresh-token.use-case.ts
import { RefreshTokenRequest, RefreshTokenResponse } from '../../interfaces/auth';
import { verify, sign } from 'jsonwebtoken';
import { config } from '../../../infrastructure/config';
import { ApplicationError } from '../../../shared/erros/app.error';

interface JwtPayload {
  userId: string;
  email: string;
}

export class RefreshTokenUseCase {
  async execute(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    try {
      const payload = verify(request.refreshToken, config.jwtRefreshSecret) as JwtPayload;
      
      const newAccessTokenPayload = { userId: payload.userId, email: payload.email };
      const accessToken = sign(newAccessTokenPayload, config.jwtSecret, { expiresIn: 60 * 60 * 24 * 7 }); // 1j

      return { accessToken };
    } catch (error) {
      throw new ApplicationError('Invalid or expired refresh token.', 401);
    }
  }
}