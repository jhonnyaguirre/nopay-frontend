// lib/seguridad/SessionPaymentManager.ts

export class SessionPaymentManager {
    static KEY = "pagoResumenDatos";
  
    static guardar(data: {
      citacion: string;
      item: string;
      cedula: string;
      servicio: string;
      valor: string;
    }) {
      localStorage.setItem(this.KEY, JSON.stringify(data));
    }
  
    static obtener() {
      const data = localStorage.getItem(this.KEY);
      return data ? JSON.parse(data) : null;
    }
  
    static limpiar() {
      localStorage.removeItem(this.KEY);
    }
  }
  