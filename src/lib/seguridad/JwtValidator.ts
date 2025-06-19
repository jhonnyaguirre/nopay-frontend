// lib/seguridad/JwtValidator.ts

import { API_BASE_URL } from "config/apiConfig";

export async function validarJWTconBackend(): Promise<boolean> {
    const token = localStorage.getItem('jwtSesion');
    if (!token) return false;
  
    const response = await fetch(`${API_BASE_URL}/sesion/validar`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  
    if (!response.ok) return false;
  
    const data = await response.json();
    return data.valido === true;
  }
  