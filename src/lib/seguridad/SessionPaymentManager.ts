export class SessionPaymentManager {
    static KEY = "pagoResumenDatos";
  
    static guardar(data: any) { // Usamos any para evitar líos de tipos ahora mismo
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.KEY, JSON.stringify(data));
      }
    }
  
    static obtener() {
      if (typeof window === 'undefined') return null;
      const data = localStorage.getItem(this.KEY);
      return data ? JSON.parse(data) : null;
    }
  
    static limpiar() {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.KEY);
      }
    }
}