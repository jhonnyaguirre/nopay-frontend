export type AdminUser = {
  secuencial: number;
  email: string;
  nombres: string;
  apellidos: string;
  roles: string;
};

const ADMIN_TOKEN_KEY = "nopay_admin_token";
const ADMIN_USER_KEY = "nopay_admin_user";

export class AdminSession {
  static guardar(token: string, usuario: AdminUser) {
    if (typeof window === "undefined") return;

    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(usuario));
  }

  static getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  }

  static getUsuario(): AdminUser | null {
    if (typeof window === "undefined") return null;

    const raw = localStorage.getItem(ADMIN_USER_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as AdminUser;
    } catch {
      return null;
    }
  }

  static estaAutenticado(): boolean {
    return !!this.getToken();
  }

  static cerrarSesion() {
    if (typeof window === "undefined") return;

    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
  }

  static tieneRol(rol: string): boolean {
    const usuario = this.getUsuario();
    if (!usuario?.roles) return false;

    return usuario.roles
      .split(",")
      .map((r) => r.trim().toUpperCase())
      .includes(rol.toUpperCase());
  }
}