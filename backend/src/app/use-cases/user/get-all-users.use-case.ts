import { UserRepository } from '../../../domain/repositories/user.repository.interface';
import { UserResponse } from '../../interfaces/user';

export class GetAllUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<UserResponse[]> {
    const users = await this.userRepository.findAll();
    return users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }
}