import { TOKEN_KEY } from "../storage/admin";
import type { QuoteDataInterface, QuoteItemDataInterface, QuoteStatus, sendQuoteDataInterface } from "../types/QuoteInterface";
import Axios from "./Axios";
import Cookies from 'js-cookie';

/**
 * get all quotes
 */
const getAllQuotes = async (access_token: string) => {
  try {
    const response = await Axios.get('/api/quotes', {
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
    console.log("Erreur lors de la recupération des devis: ", error);
    
    const errorMessage = error.response?.data || "Erreur inconnue";
    return {
      success: false,
      data: errorMessage,
    };
  }
};


/**
 * add quote
 */
const createQuote = async (quoteData : QuoteDataInterface) => {
  try {
    const tokenUser = Cookies.get(TOKEN_KEY);
    const res1 = await Axios.post('/api/quotes', {
      leadId: quoteData.leadId,
      items: [
        {
            description: "tes",
            quantity: 1,
            unitPrice: 1
        }
    ]
    },{
       headers: {
          Authorization: `Bearer ${tokenUser || ''}`,
        }
    });

    console.log("res1", res1.data.data.id);
    
    const quoteId = res1.data.data.id;

    const res2 = await Axios.post(`api/quotes/${quoteId}/items`, {
      description: quoteData.description,
      quantity: quoteData.quantity,
      unitPrice: quoteData.unitPrice
    },{
       headers: {
          Authorization: `Bearer ${tokenUser || ''}`,
        }
    });

    

    return {
      success: true,
      data: res2.data,
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("Erreur lors de la création d'un devis: ", error);
    
    const errorMessage = error.response?.data || "Erreur inconnue";
    return {
      success: false,
      data: errorMessage,
    };
  }
};




/**
 * add quote item
 */
const createQuoteItem = async (quoteItemData : QuoteItemDataInterface) => {
  try {
    const tokenUser = Cookies.get(TOKEN_KEY);

    const response = await Axios.post(`api/quotes/${quoteItemData.quoteId}/items`, {
      description: quoteItemData.description,
      quantity: quoteItemData.quantity,
      unitPrice: quoteItemData.unitPrice
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
    console.log("Erreur lors d'ajout élément dans un devis: ", error);
    
    const errorMessage = error.response?.data || "Erreur inconnue";
    return {
      success: false,
      data: errorMessage,
    };
  }
};




/**
 * update quote item
 */
const updateQuoteItem = async (quoteItemData : QuoteItemDataInterface) => {
  try {
    const tokenUser = Cookies.get(TOKEN_KEY);

    const response = await Axios.put(`api/quotes/${quoteItemData.quoteId}/items/${quoteItemData.quoteItemId}`, {
      description: quoteItemData.description,
      quantity: quoteItemData.quantity,
      unitPrice: quoteItemData.unitPrice
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
    console.log("Erreur lors d'ajout élément dans un devis: ", error);
    
    const errorMessage = error.response?.data || "Erreur inconnue";
    return {
      success: false,
      data: errorMessage,
    };
  }
};





/**
 * delete quote item
 */
const deleteQuoteItem = async (quoteItemData : QuoteItemDataInterface) => {
  try {
    const tokenUser = Cookies.get(TOKEN_KEY);

    const response = await Axios.delete(`api/quotes/${quoteItemData.quoteId}/items/${quoteItemData.quoteItemId}`,{
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
    console.log("Erreur lors du suppression d'élement dans un devis: ", error);
    
    const errorMessage = error.response?.data || "Erreur inconnue";
    return {
      success: false,
      data: errorMessage,
    };
  }
};




/**
 * envoyer le quote 
 */
const sendQuote = async (data : sendQuoteDataInterface) => {
  try {
    const tokenUser = Cookies.get(TOKEN_KEY);

    const response = await Axios.post(`api/quotes/${data.quoteId}/send`, {
      expiresAt: data.expiresAt
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
    console.log("Erreur lors d'envoie du devis: ", error);
    
    const errorMessage = error.response?.data || "Erreur inconnue";
    return {
      success: false,
      data: errorMessage,
    };
  }
};



/**
 * signer le quote 
 */
const signedQuote = async (quoteId : string) => {
  try {
    const tokenUser = Cookies.get(TOKEN_KEY);

    const response = await Axios.post(`api/quotes/${quoteId}/sign`,{
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
    console.log("Erreur lors d'envoie du devis: ", error);
    
    const errorMessage = error.response?.data || "Erreur inconnue";
    return {
      success: false,
      data: errorMessage,
    };
  }
};




/**
 * refuser le quote 
 */
const refusedQuote = async (quoteId : string, status: QuoteStatus) => {
  try {
    const tokenUser = Cookies.get(TOKEN_KEY);

    
    const response = await Axios.post(`/api/webhooks/universign`,{
      quoteId: quoteId,
      status: status.toLocaleLowerCase(),
      eventData: { 
          reason: "Client declined"
      }
    },{
       headers: {
          Authorization: `Bearer ${tokenUser || ''}`,
        }
    })
    

    return {
      success: true,
      data: {
        ...response.data,
        status: status
      },
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("Erreur lors d'envoie du devis: ", error);
    
    const errorMessage = error.response?.data || "Erreur inconnue";
    return {
      success: false,
      data: errorMessage,
    };
  }
};




export const quoteService = {
  getAllQuotes,
  createQuote,
  createQuoteItem,
  updateQuoteItem,
  deleteQuoteItem,
  sendQuote,
  signedQuote,
  refusedQuote
};