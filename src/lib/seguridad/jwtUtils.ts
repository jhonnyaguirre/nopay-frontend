import { API_BASE_URL } from "config/apiConfig";

export const saveAuthToken = (token: string) => {
    localStorage.setItem('authToken', token);
  };
  
  export const getAuthToken = (): string | null => {
    return localStorage.getItem('authToken');
  };
  
  export const clearAuthToken = () => {
    localStorage.removeItem('authToken');
  };
  
  export const isTokenExpired = async (): Promise<boolean> => {
    const token = getAuthToken();
    if (!token) return true;
  
    try {
      const res = await fetch(`${API_BASE_URL}/sesion/validar`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (res.status === 200) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      //console.error('Error validando token:', error);
      return true;
    }
  };
  