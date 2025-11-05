import Axios from "./Axios";


/**
 * get info user by token
 */
const getInfoUser = async (access_token: string) => {
  try {
    
    const response = await Axios.get('/api/auth/me', {
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
    console.log("Erreur lors de la recupération de l'info user: ", error);
    
    const errorMessage = error.response?.data || "Erreur inconnue";
    return {
      success: false,
      data: errorMessage,
    };
  }
};



/**
 * get all users
 */
const getAllUsers = async (access_token: string) => {
  try {
    const response = await Axios.get('/api/users', {
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
    console.log("Erreur lors de la recupération des utilisateurs: ", error);
    
    const errorMessage = error.response?.data || "Erreur inconnue";
    return {
      success: false,
      data: errorMessage,
    };
  }
};




export const userService = {
  getInfoUser,
  getAllUsers
};