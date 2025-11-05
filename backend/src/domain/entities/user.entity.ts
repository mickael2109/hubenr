import { generateUuid } from "../../shared/utils/uuid";
import { compare } from 'bcryptjs';


interface UserProps {
  id?: string;
  email: string;
  name: string;
  password: string; 
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  public readonly id: string;
  public email: string;
  public name: string;
  private passwordHash: string; 
  public readonly createdAt: Date;
  public updatedAt: Date;

  private constructor(props: UserProps) {
    this.id = props.id || generateUuid();
    this.email = props.email;
    this.name = props.name;
    this.passwordHash = props.password;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  public static create(props: UserProps): User {
    if (!props.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(props.email)) {
      throw new Error('Invalid email format.');
    }
    if (!props.password) {
      throw new Error('Password is required.');
    }
    return new User(props);
  }


  public async comparePassword(plainPassword: string): Promise<boolean> {
    return compare(plainPassword, this.passwordHash);
  }

  public update(updateProps: { name?: string; email?: string }): void {
    if (updateProps.name !== undefined) {
      this.name = updateProps.name;
    }
    if (updateProps.email !== undefined) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateProps.email)) {
        throw new Error('Invalid email format for update.');
      }
      this.email = updateProps.email;
    }
    this.updatedAt = new Date(); 
  }


  public toObject() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  public toPersistenceObject() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      password: this.passwordHash,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}