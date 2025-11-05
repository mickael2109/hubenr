import { UserRepository } from '../../../domain/repositories/user.repository.interface';
import { ApplicationError } from '../../../shared/erros/app.error';
import { DeleteResponse, UserResponse } from '../../interfaces/user';

export class DeleteUserByIdUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string): Promise<DeleteResponse> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new ApplicationError(`User with ID ${id} not found.`, 404); 
    }


    await this.userRepository.delete(id);

    return {
        id: user.id
    };
  }
}