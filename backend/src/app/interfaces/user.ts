export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
}


export interface UpdateUserRequest {
  name?: string;
  email?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeleteResponse {
  id: string;
}