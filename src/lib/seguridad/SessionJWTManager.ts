import { API_BASE_URL } from "config/apiConfig";

export class SessionJWTManager {
    static TOKEN_KEY = "authToken";

    static guardar(token: string) {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    static obtener(): string | null {
        //console.log("TOKEN LEIDO:", localStorage.getItem(this.TOKEN_KEY));
        return localStorage.getItem(this.TOKEN_KEY);
    }

    static limpiar() {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    static async isValid(): Promise<boolean> {
        const token = this.obtener();
        if (!token) return false;

        try {
            const res = await fetch(`${API_BASE_URL}/sesion/validar`, {
                method: "GET", // ✅ CORREGIDO
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return res.ok;
        } catch (err) {
            return false;
        }
    }


}
