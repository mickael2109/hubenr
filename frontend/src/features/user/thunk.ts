/* eslint-disable no-useless-catch */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../service/user.service';



/**
 * get info user by token
 */
export const getInfoUser = createAsyncThunk(
  'user/getInfoUser',
  async (access_token: string) => {
    try {
      const response = await userService.getInfoUser(access_token); 
      return response.data; 
    } catch (err) {
      throw err;
    }
  }
);




/**
 * get all users
 */
export const getAllUsers = createAsyncThunk(
  'user/getAllUsers',
  async (access_token: string) => {
    try {
      const response = await userService.getAllUsers(access_token); 
      return response.data; 
    } catch (err) {
      throw err;
    }
  }
);

