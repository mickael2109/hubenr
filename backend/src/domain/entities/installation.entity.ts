import { PrismaInstallationStatus } from "@prisma/client";
import { generateUuid } from "../../shared/utils/uuid";

export enum InstallationStatus {
  PREPARATION = 'PREPARATION',
  INPROGRESS = 'INPROGRESS',
  COMPLETED = 'COMPLETED',
}

interface InstallationProps {
  id?: string;
  quoteId: string;
  status?: InstallationStatus;
  startDate: Date;
  endDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Installation {
  public readonly id: string;
  public readonly quoteId: string; // An installation is tied to one quote and cannot be changed
  public status: InstallationStatus;
  public startDate: Date;
  public endDate: Date;
  public readonly createdAt: Date;
  public updatedAt: Date;

  private constructor(props: InstallationProps) {
    this.id = props.id || generateUuid();
    this.quoteId = props.quoteId;
    this.status = props.status || InstallationStatus.PREPARATION;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  public static create(props: InstallationProps): Installation {
    if (!props.quoteId) {
      throw new Error('Quote ID is required to create an installation.');
    }
    return new Installation(props);
  }

  public startInstallation(): void {
    if (this.status !== InstallationStatus.PREPARATION) {
      throw new Error('Installation can only be started from PREPARATION status.');
    }
    this.status = InstallationStatus.INPROGRESS;
    this.startDate = new Date();
    this.updatedAt = new Date();
  }

  public completeInstallation(): void {
    if (this.status !== InstallationStatus.INPROGRESS) {
      throw new Error('Installation must be IN PROGRESS to be completed.');
    }
    this.status = InstallationStatus.COMPLETED;
    this.endDate = new Date();
    this.updatedAt = new Date();
  }

  public update(props: { status?: InstallationStatus; startDate?: Date; endDate?: Date }): void {
      if (props.status) this.status = props.status;
      if (props.startDate) this.startDate = props.startDate;
      if (props.endDate) this.endDate = props.endDate;
      this.updatedAt = new Date();
  }

  public toObject() {
    return {
      id: this.id,
      quoteId: this.quoteId,
      status: this.status,
      startDate: this.startDate ?? null, // 👈 null au lieu de undefined
      endDate: this.endDate ?? null, 
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}


function prismaStatusToDomain(status: PrismaInstallationStatus): InstallationStatus {
  switch (status) {
    case 'PREPARATION': return InstallationStatus.PREPARATION;
    case 'INPROGRESS': return InstallationStatus.INPROGRESS;
    case 'COMPLETED': return InstallationStatus.COMPLETED;
    default: return status as unknown as InstallationStatus;
  }
}


export function domainStatusToPrismaInstallation(status: InstallationStatus): PrismaInstallationStatus {
  switch (status) {
    case InstallationStatus.PREPARATION: return 'PREPARATION';
    case InstallationStatus.INPROGRESS: return 'INPROGRESS';
    case InstallationStatus.COMPLETED: return 'COMPLETED';
    default: return status as unknown as PrismaInstallationStatus;
  }
}



export function recordToInstallation(record: any): Installation {
  if (!record) return null as unknown as Installation;
  const props = { ...record, status: prismaStatusToDomain(record.status) };
  
  return Installation.create(props);
}