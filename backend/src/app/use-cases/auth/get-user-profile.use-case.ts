import { UserRepository } from '../../../domain/repositories/user.repository.interface';
import { ApplicationError } from '../../../shared/erros/app.error';
import { UserResponse } from '../../interfaces/user';

export class GetUserProfileUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string): Promise<UserResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      // This case is rare if the token is valid, but could happen if the user was deleted
      // after the token was issued.
      throw new ApplicationError('User for this token not found.', 404);
    }

    // The user.toObject() method already prevents the password from being exposed.
    return user.toObject();
  }
}