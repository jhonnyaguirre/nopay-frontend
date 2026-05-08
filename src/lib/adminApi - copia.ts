import { AdminSession } from "./seguridad/AdminSession";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

type AdminLoginPayload = {
  email: string;
  password: string;
};

export async function adminLogin(payload: AdminLoginPayload) {
  const response = await fetch(`${API_BASE}/admin/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(data.error || "No se pudo iniciar sesión");
  }

  return data;
}

export async function validarAdminToken() {
  const token = AdminSession.getToken();

  if (!token) {
    return false;
  }

  const response = await fetch(`${API_BASE}/admin/auth/validar`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.ok;
}