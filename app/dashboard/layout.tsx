import { ProvedorNavegacao } from "@/app/contexts/NavegacaoContext";
import { CascoLayout } from "@/app/components/blocos/CascoLayout";
import { GuardaAuth } from "@/app/components/blocos/GuardaAuth";

export default function LayoutDashboard({ children }: { children: React.ReactNode }) {
  return (
    <GuardaAuth>
      <ProvedorNavegacao>
        <CascoLayout>{children}</CascoLayout>
      </ProvedorNavegacao>
    </GuardaAuth>
  );
}
