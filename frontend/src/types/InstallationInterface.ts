

export interface InstallationInterface {
    id: string;         
    quoteId: string;  
    status: InstallationStatus,
    startDate: string;
    endDate: string;
    createdAt: string;  
    updatedAt: string;  
}

export  interface InstallationDateUpdateInterface {
    id: string;         
    status: InstallationStatus
}


export const InstallationStatus = {
  PREPARATION: "Préparation",
  INPROGRESS: "En cours",
  COMPLETED: "Terminé"
} as const;

export type InstallationStatus = keyof typeof InstallationStatus;


