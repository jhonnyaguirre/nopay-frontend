// lib/seguridad/JWTService.ts

import { API_BASE_URL } from "config/apiConfig";

export interface TokenResponse {
    token: string;
    expiresIn: number;
  }
  
  export class JWTService {
    static async crearToken(usuario: string, password: string): Promise<string | null> {
      try {
        const response = await fetch(`${API_BASE_URL}/sesion/crear`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usuario, password }),
        });
  
        if (!response.ok) {
          //console.error('Error al generar el token:', response.statusText);
          return null;
        }
  
        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        return data.token;
      } catch (error) {
        //console.error('Excepción al generar token:', error);
        return null;
      }
    }
  
    static getToken(): string | null {
      return localStorage.getItem('authToken');
    }
  
    static clearToken() {
      localStorage.removeItem('authToken');
    }
  }
  