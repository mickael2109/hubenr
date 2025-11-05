import { TOKEN_KEY } from "../storage/admin";
import type { InstallationDateUpdateInterface } from "../types/InstallationInterface";
import Axios from "./Axios";
import Cookies from 'js-cookie';

/**
 * get all quotes
 */
const getAllInstallation = async (access_token: string) => {
  try {
    const response = await Axios.get('/api/installations', {
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
    console.log("Erreur lors de la recupération des installations: ", error);
    
    const errorMessage = error.response?.data || "Erreur inconnue";
    return {
      success: false,
      data: errorMessage,
    };
  }
};


/**
 * add installation
 */
const createInstallation = async (quoteId : string) => {
  try {
    const tokenUser = Cookies.get(TOKEN_KEY);

    const response = await Axios.post(`api/installations`, {
      quoteId: quoteId
    },{
       headers: {
          Authorization: `Bearer ${tokenUser || ''}`,
        }
    })

 
    

    return {
      success: true,
      data: response.data,
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("Erreur lors de la création d'installaton de ce devis: ", error);
    
    const errorMessage = error.response?.data || "Erreur inconnue";
    return {
      success: false,
      data: errorMessage,
    };
  }
};




/**
 * update installation
 */
const updateInstallation = async (data : InstallationDateUpdateInterface) => {
  try {
    const tokenUser = Cookies.get(TOKEN_KEY);

    const response = await Axios.put(`api/installations/${data.id}`, {
      status: data.status
    },{
       headers: {
          Authorization: `Bearer ${tokenUser || ''}`,
        }
    })

 
    

    return {
      success: true,
      data: response.data,
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("Erreur lors de la modification d'installation: ", error);
    
    const errorMessage = error.response?.data || "Erreur inconnue";
    return {
      success: false,
      data: errorMessage,
    };
  }
};



export const installationService = {
  getAllInstallation,
  createInstallation,
  updateInstallation
};