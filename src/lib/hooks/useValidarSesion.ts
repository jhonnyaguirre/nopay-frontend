// lib/hooks/useValidarSesion.ts
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_BASE_URL } from 'config/apiConfig';

export const useValidarSesion = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [validando, setValidando] = useState(true);

  useEffect(() => {
    if (!searchParams) return;

    const nonce = localStorage.getItem('sessionNonce');
    const token = searchParams.get('token');

    if (!nonce || !token) {
      router.replace('/');
      return;
    }

    const validarSesion = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/sesion/validar?nonce=${nonce}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          throw new Error("Sesión inválida");
        }

        const result = await res.json();
        if (!result.valida) {
          throw new Error("Sesión no encontrada o inválida");
        }

        setValidando(false);
      } catch (err) {
        //console.warn("Error validando sesión:", err);
        router.replace('/');
      }
    };

    validarSesion();
  }, [searchParams]);

  return { validando };
};
