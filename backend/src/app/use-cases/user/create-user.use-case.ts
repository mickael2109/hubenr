import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository.interface';
import { ApplicationError } from '../../../shared/erros/app.error';
import { hashPassword } from '../../../shared/utils/password';
import { CreateUserRequest, UserResponse } from '../../interfaces/user';

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(request: CreateUserRequest): Promise<UserResponse> {
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new ApplicationError('User with this email already exists.', 409); // 409 Conflict
    }

    const hashedPassword = await hashPassword(request.password);

    const newUser = User.create({
      email: request.email,
      name: request.name,
      password: hashedPassword
    });

    const savedUser = await this.userRepository.save(newUser);

    return savedUser.toObject();
    
  }
}