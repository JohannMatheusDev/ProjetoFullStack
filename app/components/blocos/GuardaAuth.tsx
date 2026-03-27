"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { buscarSessao } from "@/app/lib/authMock";

export function GuardaAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const sessao = buscarSessao();

  useEffect(() => {
    if (!sessao) {
      router.replace("/login");
    }
  }, [router, sessao]);

  if (!sessao) return null;

  return <>{children}</>;
}
