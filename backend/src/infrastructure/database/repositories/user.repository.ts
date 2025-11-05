
import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository.interface';
import prisma from '../prisma/client';

export class PrismaUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const userRecord = await prisma.user.findUnique({ where: { id } });
    if (!userRecord) {
      return null;
    }
    return User.create(userRecord);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userRecord = await prisma.user.findUnique({ where: { email } });
    if (!userRecord) {
      return null;
    }
    return User.create(userRecord);
  }

  async save(user: User): Promise<User> {
    const data = user.toPersistenceObject();

    const savedRecord = await prisma.user.upsert({
      where: { id: user.id },
      update: data,
      create: data,
    });
    return User.create(savedRecord);
  }

  async findAll(): Promise<User[]> {
    const userRecords = await prisma.user.findMany();
    return userRecords.map((record: any) => User.create(record));
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}