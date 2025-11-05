import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { installationState } from "./type";
import type { InstallationInterface } from "../../types/InstallationInterface";
import { createInstallation, getAllInstallation, updateInstallation } from "./thunk";


const initialState: installationState = {
    status: "idle",
    error: null,
    installations: [],
    installationSelected: null,
};

const installationSlice = createSlice({
  name: "installation",
  initialState,
  reducers: { 
    selectInstallation: (state, action: PayloadAction<InstallationInterface>) => {
      state.installationSelected = action.payload;
    },
  },
   

  extraReducers: (builder) => {


    /**
     * get all installations
     */
    builder.addCase(getAllInstallation.fulfilled, (state, action) => {
      const { data, success } = action.payload;
      
      if(success){
        state.installations = data
      }
      state.error = null;
      state.status = "succeeded";
    });

    builder.addCase(getAllInstallation.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(getAllInstallation.rejected, (state, action) => {    
      state.status = "failed";
      state.error = action.error.message || "An error occurred";
    });



    /**
     * create installation
     */
    builder.addCase(createInstallation.fulfilled, (state, action) => {
      const { data, success } = action.payload;
      
      if(success){
        state.installations.push(data);
      }
      state.status = "succeeded";
      state.error = null;
    });

    builder.addCase(createInstallation.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(createInstallation.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string || "Failed to add publication";
    });


    /**
     * update installation
     */
    builder.addCase(updateInstallation.fulfilled, (state, action) => {
      const { data, success } = action.payload;
      
      if (success && data?.id) {
        const idx = state.installations.findIndex((p) => p.id === data.id);
        if (idx !== -1) {
          state.installations[idx] = data
        }
        if (state.installationSelected?.id === data.id) {
          state.installationSelected= data
        }
      }
    });

    builder.addCase(updateInstallation.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(updateInstallation.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string || "Failed to add publication";
    });



  },
});


export const { selectInstallation } = installationSlice.actions
export default installationSlice.reducer;


