import { PrismaLeadStatus } from "@prisma/client";
import { generateUuid } from "../../shared/utils/uuid";
import { User } from "./user.entity";

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  RECONTACT = 'RECONTACT',
  APPOINTMENT = 'APPOINTMENT',
  QUOTESENT = 'QUOTESENT',
}

interface LeadProps {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  status?: LeadStatus;
  assignedToUserId: string; // User ID
  createdAt?: Date;
  updatedAt?: Date;
  assignedToUser?: User 
}

export class Lead {
  public readonly id: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public phone?: string;
  public company?: string;
  public status: LeadStatus;
  public assignedToUserId: string;
  public readonly createdAt: Date;
  public updatedAt: Date;
  public assignedToUser?: User;

  private constructor(props: LeadProps) {
    this.id = props.id || generateUuid();
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.email = props.email;
    this.phone = props.phone;
    this.company = props.company;
    this.status = props.status || LeadStatus.NEW;
    this.assignedToUserId = props.assignedToUserId;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this.assignedToUser = props.assignedToUser;
  }

  public static create(props: LeadProps): Lead {
    if (!props.firstName || !props.lastName || !props.email || !props.assignedToUserId) {
      throw new Error('First name, last name, email, and assigned user ID are required for a lead.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(props.email)) {
      throw new Error('Invalid email format for lead.');
    }
    return new Lead(props);
  }

  public update(updateProps: { firstName?: string; lastName?: string; email?: string; phone?: string; company?: string; status?: LeadStatus; assignedToUserId?: string }): void {
    if (updateProps.firstName !== undefined) this.firstName = updateProps.firstName;
    if (updateProps.lastName !== undefined) this.lastName = updateProps.lastName;
    if (updateProps.email !== undefined) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateProps.email)) {
        throw new Error('Invalid email format for lead update.');
      }
      this.email = updateProps.email;
    }
    if (updateProps.phone !== undefined) this.phone = updateProps.phone;
    if (updateProps.company !== undefined) this.company = updateProps.company;
    if (updateProps.status !== undefined) {
      if (!Object.values(LeadStatus).includes(updateProps.status)) {
        throw new Error(`Invalid lead status: ${updateProps.status}`);
      }
      this.status = updateProps.status;
    }
    if (updateProps.assignedToUserId !== undefined) this.assignedToUserId = updateProps.assignedToUserId;
    
    this.updatedAt = new Date();
  }

  public toObject() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      company: this.company,
      status: this.status,
      assignedToUserId: this.assignedToUserId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      assignedToUser: this.assignedToUser,
    };
  }
}


export function prismaStatusToDomain(status: PrismaLeadStatus): LeadStatus {
  switch (status) {
    case 'NEW': return LeadStatus.NEW;
    case 'CONTACTED': return LeadStatus.CONTACTED;
    case 'RECONTACT': return LeadStatus.RECONTACT;
    case 'APPOINTMENT': return LeadStatus.APPOINTMENT;
    case 'QUOTESENT': return LeadStatus.QUOTESENT;
    default: return status as unknown as LeadStatus;
  }
}


export function domainStatusToPrisma(status: LeadStatus): PrismaLeadStatus {
  switch (status) {
    case LeadStatus.NEW: return 'NEW';
    case LeadStatus.CONTACTED: return 'CONTACTED';
    case LeadStatus.RECONTACT: return 'RECONTACT';
    case LeadStatus.APPOINTMENT: return 'APPOINTMENT';
    case LeadStatus.QUOTESENT: return 'QUOTESENT';
    default: return status as unknown as PrismaLeadStatus;
  }
}


export function recordToLead(record: any): Lead {
  if (!record) return null as unknown as Lead;
  const props = { ...record, status: prismaStatusToDomain(record.status) };
  
  return Lead.create(props);
}