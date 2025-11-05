import type { UserInterface } from "./UserInterface";

export interface LeadInterface {
    id: string;         
    firstName: string;  
    lastName: string;     
    email: string; 
    phone: string;
    company: string;
    status: LeadStatus,
    assignedToUserId: string;
    createdAt: string;  
    updatedAt: string;  
    assignedToUser: UserInterface | null
}


export interface LeadDataInterface {
    firstName: string;  
    lastName: string;     
    email: string; 
    phone: string;
    company: string;
    status: LeadStatus,
    assignedToUserId: string;
}



export const LeadStatus = {
  NEW: "Nouveau",
  CONTACTED: "Contacté",
  RECONTACT: "En relance",
  APPOINTMENT :"RDV pris",
  QUOTESENT: "Devis envoyé"
} as const;

export type LeadStatus = keyof typeof LeadStatus;