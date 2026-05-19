import { AdminSession } from "./seguridad/AdminSession";

const API_BASE =
  //process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.nopaylegal.com";
  

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

  if (!token) return false;

  const response = await fetch(`${API_BASE}/admin/auth/validar`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.ok;
}

export async function listarAdminCasos(params?: {
  tipo?: string;
  estado?: string;
  q?: string;
}) {
  const token = AdminSession.getToken();

  if (!token) {
    throw new Error("Sesión administrativa no encontrada");
  }

  const search = new URLSearchParams();

  if (params?.tipo) search.set("tipo", params.tipo);
  if (params?.estado) search.set("estado", params.estado);
  if (params?.q) search.set("q", params.q);

  const url = `${API_BASE}/admin/casos${
    search.toString() ? `?${search.toString()}` : ""
  }`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(data.error || "No se pudo obtener la bandeja de casos");
  }

  return data;
}

export async function obtenerAdminCasoDetalle(tipo: string, id: number) {
  const token = AdminSession.getToken();

  if (!token) {
    throw new Error("Sesión administrativa no encontrada");
  }

  const response = await fetch(`${API_BASE}/admin/casos/${tipo}/${id}/detalle`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(data.error || "No se pudo obtener el detalle del caso");
  }

  return data.detalle;
}

export async function obtenerAdminCasosResumen() {
  const token = AdminSession.getToken();

  if (!token) {
    throw new Error("Sesión administrativa no encontrada");
  }

  const response = await fetch(`${API_BASE}/admin/casos/resumen`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(data.error || "No se pudo obtener el resumen");
  }

  return data;
}



export async function actualizarAdminCasoSeccion(params: {
  tipo: string;
  id: number;
  seccion: string;
  payload: any;
}) {
  const token = AdminSession.getToken();

  if (!token) {
    throw new Error("Sesión administrativa no encontrada");
  }

  const response = await fetch(
  `${API_BASE}/admin/casos/${params.tipo}/${params.id}/seccion/${params.seccion}/actualizar`,
  {
    method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params.payload),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(data.error || "No se pudo actualizar la sección");
  }
  
  if (Number(data.actualizados || 0) <= 0) {
  throw new Error(
    "El backend respondió OK, pero no actualizó ningún registro. Revisa sección, campos permitidos o secuencial."
  );
}

  return data;
}

export async function listarEstadosAdminCaso() {
  const token = AdminSession.getToken();

  if (!token) {
    throw new Error("Sesión administrativa no encontrada");
  }

  const response = await fetch(`${API_BASE}/admin/casos/estados-admin`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(data.error || "No se pudo obtener estados admin");
  }

  return data.estados || [];
}