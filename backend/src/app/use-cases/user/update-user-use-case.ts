import { UserRepository } from '../../../domain/repositories/user.repository.interface';
import { ApplicationError } from '../../../shared/erros/app.error';
import {  UpdateUserRequest, UserResponse } from '../../interfaces/user';

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string, request: UpdateUserRequest): Promise<UserResponse> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new ApplicationError(`User with ID ${id} not found.`, 404);
    }

    if (request.email && request.email !== existingUser!.email) {
      const userWithSameEmail = await this.userRepository.findByEmail(request.email);
      if (userWithSameEmail && userWithSameEmail.id !== id) {
        throw new ApplicationError('Another user with this email already exists.', 409);
      }
    }

    try {
      existingUser!.update(request);
    } catch (domainError: any) {
      throw new ApplicationError(domainError.message, 400);
    }

    const updatedUser = await this.userRepository.save(existingUser!); 


    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }
}