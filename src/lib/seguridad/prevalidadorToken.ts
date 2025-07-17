// lib/seguridad/prevalidadorToken.ts
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { setUserProfile } from 'lib/seguridad/SessionUser';


/**
 * Valida si el JWT está expirado (por fecha de expiración exp en payload)
 * @param token El JWT (string)
 * @returns true si el token ES VÁLIDO, false si está expirado o malformado
 */
export function isJWTValid(token: string | undefined | null): boolean {
    if (!token) return false;
    try {
        const payloadBase64 = token.split('.')[1];
        // Añadir padding si falta (para atob)
        const padded = payloadBase64 + '='.repeat((4 - payloadBase64.length % 4) % 4);
        const payload = JSON.parse(atob(padded));
        if (!payload.exp) return false; // No hay expiración, no es válido
        const now = Math.floor(Date.now() / 1000);
        return payload.exp > now;
    } catch (e) {
        return false; // Token corrupto, expirado o formato inválido
    }
}


export function useLogout() {
    const router = useRouter();

    // Opcional: recibe una función para cerrar menús, o la defines donde la uses
    return useCallback((closeAllMenus?: () => void) => {
        // 🔐 Eliminar todos los datos relacionados con la sesión
        localStorage.removeItem('userName');
        localStorage.removeItem('userPhotoUrl');
        localStorage.removeItem('authToken');
        localStorage.removeItem('authTokenWizard');
        localStorage.removeItem('sessionNonce');
        localStorage.removeItem('sessionWizardData');

        // 🧠 Limpiar visualmente el estado del usuario
        setUserProfile({ name: '', photoUrl: '' });

        // 🚪 Redirigir a la pantalla inicial
        if (typeof closeAllMenus === 'function') closeAllMenus();
        
    }, [router]);
}