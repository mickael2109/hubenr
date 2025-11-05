import type { RootState } from "../../app/store";



export const getUsers = (state: RootState) => state.user.users;
export const getUserSelected = (state: RootState) => state.user.userSelected;
export const getUserConnected = (state: RootState) => state.user.userConnected;