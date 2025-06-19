import { API_BASE_URL } from 'config/apiConfig';
import { redirect } from 'next/navigation';

export const validarSesionSegura = async (token: string) => {
  const sessionNonce = localStorage.getItem("sessionNonce");

  if (!sessionNonce) {
    alert("Tu sesión ha expirado o no es válida.");
    redirect('/');
    return false;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/sesion/validar?sessionNonce=${sessionNonce}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Respuesta inválida");

    const data = await res.json();

    if (!data.valida) {
      alert("Sesión inválida. Redirigiendo...");
      redirect('/');
      return false;
    }

    return true;
  } catch (err) {
    //console.error("Error al validar sesión:", err);
    alert("Error en la sesión. Redirigiendo...");
    redirect('/');
    return false;
  }
};
