/* eslint-disable no-useless-catch */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { leadsService } from '../../service/lead.service';
import type { LeadDataInterface, LeadInterface } from '../../types/LeadInterface';




/**
 * get all leads
 */
export const getAllLeads = createAsyncThunk(
  'lead/getAllLeads',
  async (access_token: string) => {
    try {
      const response = await leadsService.getAllLeads(access_token); 
      return response.data; 
    } catch (err) {
      throw err;
    }
  }
);


/**
 * create lead
 */
export const createLead = createAsyncThunk(
  'lead/createLead',
  async (dataLead: LeadDataInterface) => {
    try {
      const response = await leadsService.createLead(dataLead); 
      return response.data; 
    } catch (err) {
      throw err;
    }
  }
);



/**
 * update lead
 */
export const updateLead = createAsyncThunk(
  'lead/updateLead',
  async (dataLead: LeadInterface) => {
    try {
      const response = await leadsService.updateLead(dataLead); 
      return response.data; 
    } catch (err) {
      throw err;
    }
  }
);

