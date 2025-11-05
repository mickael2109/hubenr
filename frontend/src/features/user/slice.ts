import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { a_UserState } from "./type";
import { getAllUsers, getInfoUser } from "./thunk";
import type { UserInterface } from "../../types/UserInterface";


const initialState: a_UserState = {
    status: "idle",
    error: null,
    users: [],
    userSelected: null,
    userConnected: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: { 
    selectUser: (state, action: PayloadAction<UserInterface>) => {
      state.userSelected = action.payload;
    },
    selectUserConnected: (state, action: PayloadAction<UserInterface>) => {
      state.userConnected = action.payload;
    },
  },
   

  extraReducers: (builder) => {


    /**
     * get info user by token
     */
    builder.addCase(getInfoUser.fulfilled, (state, action) => {
      const { data, success } = action.payload;
      
      if(success){
        state.userConnected = data.user
      }
      state.error = null;
      state.status = "succeeded";
    });

    builder.addCase(getInfoUser.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(getInfoUser.rejected, (state, action) => {    
      state.status = "failed";
      state.error = action.error.message || "An error occurred";
    });



    /**
     * get all users
     */
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      const { data, success } = action.payload;
      
      if(success){
        state.users = data
      }
      state.error = null;
      state.status = "succeeded";
    });

    builder.addCase(getAllUsers.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(getAllUsers.rejected, (state, action) => {    
      state.status = "failed";
      state.error = action.error.message || "An error occurred";
    });




  },
});


export const { selectUser, selectUserConnected, } = userSlice.actions
export default userSlice.reducer;


