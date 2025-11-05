

export interface QuoteInterface {
    id: string;         
    leadId: string;  
    totalAmount: number;     
    signedAt: string; 
    sentAt: string;
    expiresAt: string;
    signedProof:signedProofInterface | null;
    status: QuoteStatus,
    createdAt: string;  
    updatedAt: string;  
    items: QuoteItemInterface[] | []
}



export interface signedProofInterface {
    signedAt: string;    
    ipAddress: string;     
    userAgent: string; 
}

export interface QuoteDataInterface {
    leadId: string;    
    description: string;     
    quantity: number; 
    unitPrice: number;
}


export interface sendQuoteDataInterface {
    quoteId: string;    
    expiresAt: string;  
}





export interface QuoteItemInterface {
    id: string;         
    quoteId: string;  
    description: string;     
    quantity: number; 
    unitPrice: number;
    total: number,
    createdAt: string;  
    updatedAt: string;  
}


export interface QuoteItemDataInterface {
    quoteId: string;    
    quoteItemId: string;    
    description: string;     
    quantity: number; 
    unitPrice: number;
}


export const QuoteStatus = {
  DRAFT: "Draft",
  SENT: "Envoyé",
  SIGNED: "Signé",
  REFUSED :"Refusé",
  EXPIRED: "Expiré"
} as const;

export type QuoteStatus = keyof typeof QuoteStatus;


