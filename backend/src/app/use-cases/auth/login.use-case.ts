// src/app/use-cases/auth/login.use-case.ts
import { UserRepository } from '../../../domain/repositories/user.repository.interface';
import { LoginRequest, LoginResponse } from '../../interfaces/auth';
import { sign } from 'jsonwebtoken';
import { ApplicationError } from '../../../shared/erros/app.error';
import { config } from '../../../infrastructure/config';

export class LoginUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(request: LoginRequest): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      throw new ApplicationError('Invalid credentials.', 401);
    }

    const isPasswordValid = await user.comparePassword(request.password);
    if (!isPasswordValid) {
      throw new ApplicationError('Invalid credentials.', 401);
    }

    const payload = { userId: user.id, email: user.email };

    const accessToken = sign(payload, config.jwtSecret!, { expiresIn: 60 * 60 * 24 }); // 1j
    const refreshToken = sign(payload, config.jwtRefreshSecret, { expiresIn: 60 * 60 * 24 * 7 });

    return { accessToken, refreshToken };
  }
}