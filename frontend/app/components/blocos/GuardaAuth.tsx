"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { buscarSessao } from "@/app/lib/authMock";

export function GuardaAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    const sessao = buscarSessao();
    if (!sessao) {
      router.replace("/login");
    } else {
      setAutorizado(true);
    }
  }, [router]);

  if (!autorizado) return null;
  return <>{children}</>;
}
