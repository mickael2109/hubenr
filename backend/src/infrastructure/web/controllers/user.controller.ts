import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../../app/use-cases/user/create-user.use-case';
import { GetAllUsersUseCase } from '../../../app/use-cases/user/get-all-users.use-case';
import { CreateUserRequest, UpdateUserRequest } from '../../../app/interfaces/user';
import { ApplicationError } from '../../../shared/erros/app.error';
import { GetUserByIdUseCase } from '../../../app/use-cases/user/get-user-by-id.use-case';
import { UpdateUserUseCase } from '../../../app/use-cases/user/update-user-use-case';
import { DeleteUserByIdUseCase } from '../../../app/use-cases/user/delete-user-by-id.use-case';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request.interface';

export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private getAllUsersUseCase: GetAllUsersUseCase,
    private getUserByIdUseCase: GetUserByIdUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deleteUserUseCase: DeleteUserByIdUseCase,
  ) {}

  async create(req: Request, res: Response) {
    try {
      const { email, name, password } = req.body as CreateUserRequest;

      if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
      }

      const user = await this.createUserUseCase.execute({ email, name, password });
      return res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      console.error('Error in UserController.create:', error);
      if (error instanceof ApplicationError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Failed to create user.', success: false });
    }
  }

  async findAll(req: AuthenticatedRequest, res: Response) {
    try {
      const users = await this.getAllUsersUseCase.execute();
      return res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error: any) {
      console.error('Error in UserController.findAll:', error);
      return res.status(500).json({ message: 'Failed to retrieve users.', success: false });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params; 

      const user = await this.getUserByIdUseCase.execute(id);
      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      console.error('Error in UserController.findById:', error);
      if (error instanceof ApplicationError) {
        return res.status(error.statusCode).json({ 
          message: error.message,
          success: false
         });
      }
      return res.status(500).json({ message: 'Failed to retrieve user.' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body as UpdateUserRequest;

      // Basic validation: ensure at least one field is provided for update
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: 'At least one field (name, email) must be provided for update.' });
      }

      const updatedUser = await this.updateUserUseCase.execute(id, updateData);
      return res.status(200).json({
        success: true,
        data: updatedUser,
      });
    } catch (error: any) {
      console.error('Error in UserController.update:', error);
      if (error instanceof ApplicationError) {
        return res.status(error.statusCode).json({ message: error.message, success: false });
      }
      return res.status(500).json({ message: 'Failed to update user.', success: false });
    }
  }


  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deletedUser = await this.deleteUserUseCase.execute(id);
      return res.status(200).json({
        success: true,
        data: deletedUser,
      });
    } catch (error: any) {
      console.error('Error in UserController.delete:', error);
      if (error instanceof ApplicationError) {
        return res.status(error.statusCode).json({ message: error.message, success: false });
      }
      return res.status(500).json({ message: 'Failed to update user.', success: false });
    }
  }
}