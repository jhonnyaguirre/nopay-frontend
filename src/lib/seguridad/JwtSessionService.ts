// lib/seguridad/JwtSessionService.ts
import { API_BASE_URL } from 'config/apiConfig';
import { createSessionNonce } from './sessionUtils';

//export async function crearSesionJWT(cedula: string, usuarioId: number, tokenAPI: string):
export async function crearSesionJWT(cedula: string, usuarioId: string, tokenAPI: string): Promise<string> {

    const nonce = createSessionNonce();

    const response = await fetch(`${API_BASE_URL}/sesion/crear`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenAPI}`
        },
        body: JSON.stringify({
            sessionNonce: nonce,
            usuarioId,
            cedula,
            userAgent: navigator.userAgent,
            ip: "" // puedes dejarlo vacío si el backend la resuelve
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'No se pudo crear el JWT de sesión');
    }

    const data = await response.json();
    const jwt = data.token;
    localStorage.setItem('authToken', jwt);
    localStorage.setItem('jwtSesion', jwt);


    return jwt;
}

export function getSesionJWT(): string | null {
    return localStorage.getItem('jwtSesion');
}

export function limpiarSesionJWT(): void {
    localStorage.removeItem('jwtSesion');
}
