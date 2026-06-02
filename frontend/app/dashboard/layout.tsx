import { ProvedorNavegacao } from "@/app/contexts/NavegacaoContext";
import { CascoLayout } from "@/app/components/blocos/CascoLayout";
import { GuardaAuth } from "@/app/components/blocos/GuardaAuth";
import { ConectorSocket } from "@/app/components/blocos/ConectorSocket";

export default function LayoutDashboard({ children }: { children: React.ReactNode }) {
  return (
    <GuardaAuth>
      <ProvedorNavegacao>
        <ConectorSocket />
        <CascoLayout>{children}</CascoLayout>
      </ProvedorNavegacao>
    </GuardaAuth>
  );
}
