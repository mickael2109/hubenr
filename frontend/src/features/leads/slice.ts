import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { leadsState } from "./type";
import type { LeadInterface } from "../../types/LeadInterface";
import { createLead, getAllLeads, updateLead } from "./thunk";


const initialState: leadsState = {
    status: "idle",
    error: null,
    leads: [],
    leadSelected: null,
};

const leadSlice = createSlice({
  name: "lead",
  initialState,
  reducers: { 
    selectLead: (state, action: PayloadAction<LeadInterface>) => {
      state.leadSelected = action.payload;
    },
  },
   

  extraReducers: (builder) => {


    /**
     * get all users
     */
    builder.addCase(getAllLeads.fulfilled, (state, action) => {
      const { data, success } = action.payload;
      
      if(success){
        state.leads = data
      }
      state.error = null;
      state.status = "succeeded";
    });

    builder.addCase(getAllLeads.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(getAllLeads.rejected, (state, action) => {    
      state.status = "failed";
      state.error = action.error.message || "An error occurred";
    });



    /**
     * create lead
     */
    builder.addCase(createLead.fulfilled, (state, action) => {
      const { data, success } = action.payload;
      
      if(success){
        state.leads.push(data);
      }
      state.status = "succeeded";
      state.error = null;
    });

    builder.addCase(createLead.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(createLead.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string || "Failed to add publication";
    });


    /**
     * update lead
     */
    builder.addCase(updateLead.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(updateLead.fulfilled, (state, action) => {
      const { data, success } = action.payload as { success: boolean; data: LeadInterface };
      
      if (success && data?.id) {
        const idx = state.leads.findIndex((p) => p.id === data.id);
        if (idx !== -1) {
          const oldPublication = state.leads[idx];

          state.leads[idx] = {
            ...oldPublication, 
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            company: data.company,
            assignedToUserId: data.assignedToUserId,
            status: data.status,
            updatedAt: data.updatedAt,
          };
        }

        if (state.leadSelected?.id === data.id) {
          const oldPublication = state.leadSelected;
          state.leadSelected= {
            ...oldPublication, 
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            company: data.company,
            assignedToUserId: data.assignedToUserId,
            status: data.status,
            updatedAt: data.updatedAt,
          };
        }
      }
      state.status = "succeeded";
      state.error = null;
    });

    builder.addCase(updateLead.rejected, (state, action) => {
      state.status = "failed";
      state.error = (action.payload as string) || action.error.message || "Failed to update publication";
    });





  },
});


export const { selectLead } = leadSlice.actions
export default leadSlice.reducer;


