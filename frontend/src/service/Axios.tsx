import axios from 'axios'
import Cookies from 'js-cookie';
import { TOKEN_KEY, TOKEN_KEY_REFRESH } from '../storage/admin';

const access_token: string = Cookies.get(TOKEN_KEY) || "";


export const BackUrl = 'https://hubenr-dataven-io.onrender.com'  
// export const BackUrl = 'http://localhost:3000'

const Axios = axios.create({
  baseURL: BackUrl,
  headers: {
    Authorization: access_token ? `Bearer ${access_token}` : "",
  }
})


// Interceptor pour capturer les erreurs et gérer le refresh token
Axios.interceptors.response.use(
  response => response,
  async error => {
    if (!error.response) {
      throw new Error('Network Error');
    }
    // Si le token est expiré (401), tente de le rafraîchir
    if (error.response.status === 401) {
      const refreshToken = Cookies.get(TOKEN_KEY_REFRESH);
      if (refreshToken) {
        try {
          const res = await axios.post(
            `${BackUrl}/auth/refresh`,
            { refresh_token: refreshToken }
          );
          
          if (res.data && res.data.success && res.data.data.access_token) {
            Cookies.set(TOKEN_KEY, res.data.data.access_token);
            error.config.headers.Authorization = `Bearer ${res.data.data.access_token}`;
            return Axios.request(error.config);
          }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (refreshErr) {
          Cookies.remove(TOKEN_KEY);
          Cookies.remove(TOKEN_KEY_REFRESH);
        }
      }
    }
    return Promise.reject(error);
  }
);




// Interceptor pour capturer les erreurs
Axios.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      throw new Error('Network Error');
    }
    return Promise.reject(error);
  }
)

Axios.interceptors.request.use(
    request => {
        const access_token: string = Cookies.get("___smiliin") || "";

        // Assurer que le token est présent et valide
        if (access_token) {
            request.headers.Authorization = `Bearer ${access_token}`;
        }
        return request;
    },
    error => {
        // Gérer les erreurs d'intercepteur
        return Promise.reject(error);
    }
);


export default Axios
