-- AlterTable
ALTER TABLE "vendas" ADD COLUMN     "produtoId" TEXT,
ADD COLUMN     "quantidade" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "vendas" ADD CONSTRAINT "vendas_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
