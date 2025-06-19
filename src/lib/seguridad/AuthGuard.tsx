// lib/seguridad/AuthGuard.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TokenUtils } from "./TokenUtils";

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const router = useRouter();

  useEffect(() => {
    const token = TokenUtils.getToken();

    if (!token) {
      // redirige si no hay sesión
      router.push("/login");
    }
  }, [router]);

  return <>{children}</>;
}
