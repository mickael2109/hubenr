import { hash } from 'bcryptjs';

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return hash(password, SALT_ROUNDS);
};