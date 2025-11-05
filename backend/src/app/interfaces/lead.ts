import { PrismaLeadStatus } from "@prisma/client";
import { User } from "../../domain/entities/user.entity";


export interface CreateLeadRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  assignedToUserId: string; 
}

export interface UpdateLeadRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: PrismaLeadStatus;
  assignedToUserId?: string;
}

export interface LeadResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  status: PrismaLeadStatus;
  assignedToUserId: string;
  createdAt: Date;
  updatedAt: Date;
  assignedToUser?: User
}