import type { RootState } from "../../app/store";



export const getLeads = (state: RootState) => state.lead.leads;
export const getLeadSelected = (state: RootState) => state.lead.leadSelected;