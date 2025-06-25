export class SessionPaymentManager {
  static KEY = "pagoResumenDatos";

  static guardar(data: {
    citacion: string;
    item: string;
    cedula: string;
    servicio: string;
    valor: string;
    nombres: string;
    apellidos: string;
    telefono: string;
    email: string;
  }) {
    localStorage.setItem(this.KEY, JSON.stringify(data));
  }

  static guardarParcial(dataParcial: Partial<ReturnType<typeof this.obtener>>) {
    const actual = this.obtener() || {};
    const combinado = { ...actual, ...dataParcial };
    localStorage.setItem(this.KEY, JSON.stringify(combinado));
  }

  static obtener() {
    const data = localStorage.getItem(this.KEY);
    return data ? JSON.parse(data) : null;
  }

  static limpiar() {
    localStorage.removeItem(this.KEY);
  }
}
