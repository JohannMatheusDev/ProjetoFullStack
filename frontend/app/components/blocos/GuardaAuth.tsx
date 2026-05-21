"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { buscarToken } from "@/app/lib/api";

export function GuardaAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    const token = buscarToken();
    if (!token) {
      router.replace("/login");
    } else {
      setAutorizado(true);
    }
  }, [router]);

  if (!autorizado) return null;
  return <>{children}</>;
}
