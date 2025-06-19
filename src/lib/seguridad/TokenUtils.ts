// lib/seguridad/TokenUtils.ts

export class TokenUtils {
    static saveToken(token: string) {
      localStorage.setItem("authToken", token);
    }
  
    static getToken(): string | null {
      return localStorage.getItem("authToken");
    }
  
    static clearToken() {
      localStorage.removeItem("authToken");
    }
  
    static isAuthenticated(): boolean {
      return !!this.getToken();
    }
  }
  