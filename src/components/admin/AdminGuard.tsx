"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
import { AdminSession, AdminUser } from "../../lib/seguridad/AdminSession";
import { validarAdminToken } from "../../lib/adminApi";

type AdminGuardProps = {
  children: React.ReactNode;
};

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();

  const [validando, setValidando] = useState(true);
  const [usuario, setUsuario] = useState<AdminUser | null>(null);

  useEffect(() => {
    const validarSesion = async () => {
      const token = AdminSession.getToken();
      const user = AdminSession.getUsuario();

      if (!token || !user) {
        AdminSession.cerrarSesion();
        router.replace("/admin/login");
        return;
      }

      const tokenValido = await validarAdminToken();

      if (!tokenValido) {
        AdminSession.cerrarSesion();
        router.replace("/admin/login");
        return;
      }

      setUsuario(user);
      setValidando(false);
    };

    validarSesion();
  }, [router]);

  if (validando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07070A] text-white">
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7F1D1D] via-[#EC4899] to-[#F59E0B]">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>

          <Loader2 className="mx-auto mb-4 h-7 w-7 animate-spin text-pink-300" />

          <p className="font-semibold">Validando sesión administrativa...</p>
          <p className="mt-2 text-sm text-white/45">
            Protegiendo el backoffice NoPay
          </p>
        </div>
      </main>
    );
  }

  if (!usuario) return null;

  return <>{children}</>;
}