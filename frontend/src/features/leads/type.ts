import type { LeadInterface } from "../../types/LeadInterface";


export interface leadsState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    leads: LeadInterface[];
    leadSelected: LeadInterface | null;
}

