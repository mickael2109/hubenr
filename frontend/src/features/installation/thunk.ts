/* eslint-disable no-useless-catch */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { installationService } from '../../service/installation.service';
import type { InstallationDateUpdateInterface } from '../../types/InstallationInterface';




/**
 * get all installations
 */
export const getAllInstallation = createAsyncThunk(
  'installation/getAllInstallation',
  async (access_token: string) => {
    try {
      const response = await installationService.getAllInstallation(access_token); 
      return response.data; 
    } catch (err) {
      throw err;
    }
  }
);


/**
 * create installations
 */
export const createInstallation = createAsyncThunk(
  'installation/createInstallation',
  async (quoteId: string) => {
    try {
      const response = await installationService.createInstallation(quoteId); 
      return response.data; 
    } catch (err) {
      throw err;
    }
  }
);




/**
 * update installations
 */
export const updateInstallation = createAsyncThunk(
  'installation/updateInstallation',
  async (data : InstallationDateUpdateInterface) => {
    try {
      const response = await installationService.updateInstallation(data); 
      return response.data; 
    } catch (err) {
      throw err;
    }
  }
);


