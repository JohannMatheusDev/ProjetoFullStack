import { ProvedorNavegacao } from "@/app/contexts/NavegacaoContext";
import { CascoLayout } from "@/app/components/blocos/CascoLayout";

export default function LayoutDashboard({ children }: { children: React.ReactNode }) {
  return (
    <ProvedorNavegacao>
      <CascoLayout>{children}</CascoLayout>
    </ProvedorNavegacao>
  );
}
