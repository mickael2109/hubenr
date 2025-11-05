import { TOKEN_KEY } from "../storage/admin";
import type { LeadDataInterface, LeadInterface } from "../types/LeadInterface";
import Axios from "./Axios";
import Cookies from 'js-cookie';

/**
 * get all leads
 */
const getAllLeads = async (access_token: string) => {
  try {
    const response = await Axios.get('/api/leads', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    
    return {
      success: true,
      data: response.data,
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("Erreur lors de la recupération des leads: ", error);
    
    const errorMessage = error.response?.data || "Erreur inconnue";
    return {
      success: false,
      data: errorMessage,
    };
  }
};


/**
 * add leads
 */
const createLead = async (dataLead : LeadDataInterface) => {
  try {

    const tokenUser = Cookies.get(TOKEN_KEY);
    
    const response = await Axios.post('/api/leads', {
      firstName: dataLead.firstName,
      lastName: dataLead.lastName,
      email: dataLead.email,
      phone: dataLead.phone,
      company: dataLead.company,
      assignedToUserId: dataLead.assignedToUserId,
      status: dataLead.status
    },{
       headers: {
          Authorization: `Bearer ${tokenUser || ''}`,
        }
    });
    

    return {
      success: true,
      data: response.data,
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("Erreur lors de la création d'un lead: ", error);
    
    const errorMessage = error.response?.data || "Erreur inconnue";
    return {
      success: false,
      data: errorMessage,
    };
  }
};




/**
 * update leads
 */
const updateLead = async (dataLead : LeadInterface) => {
  try {

    const tokenUser = Cookies.get(TOKEN_KEY);
    
    const response = await Axios.put(`/api/leads/${dataLead.id}`, {
      firstName: dataLead.firstName,
      lastName: dataLead.lastName,
      email: dataLead.email,
      phone: dataLead.phone,
      company: dataLead.company,
      assignedToUserId: dataLead.assignedToUserId,
      status: dataLead.status
    },{
       headers: {
          Authorization: `Bearer ${tokenUser || ''}`,
        }
    });
    

    return {
      success: true,
      data: response.data,
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("Erreur lors de la création d'un lead: ", error);
    
    const errorMessage = error.response?.data || "Erreur inconnue";
    return {
      success: false,
      data: errorMessage,
    };
  }
};



export const leadsService = {
  getAllLeads,
  createLead,
  updateLead
};