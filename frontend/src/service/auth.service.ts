import type { loginInterface } from '../types/AuthInterface';
import Axios from './Axios';



/**
 * LOGIN
 */
const login = async (typeLogin: loginInterface) => {
  try {
    
    const response = await Axios.post('/api/auth/login', {
      email:typeLogin.email,
      password: typeLogin.password
    },);
    
    return {
      success: true,
      data: response.data
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("Erreur lors de l'authentification: ",error);
    
    const errorMessage = error.response.data;
    return {
      success: false,
      data: errorMessage,
    };
  }
};



export const authService = {
  login,
};