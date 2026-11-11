/*
  Warnings:

  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'TECNICO');

-- CreateEnum
CREATE TYPE "StatusOS" AS ENUM ('RECEBIDO', 'ANALISE', 'AGUARDANDO_APROVACAO', 'AGUARDANDO_PECA', 'REPARO', 'PRONTO', 'ENTREGUE', 'CANCELADO');

-- CreateEnum
CREATE TYPE "FormaPagamento" AS ENUM ('DINHEIRO', 'PIX', 'CARTAO_DEBITO', 'CARTAO_CREDITO', 'DINHEIRO_PIX', 'TRANSFERENCIA');

-- CreateEnum
CREATE TYPE "GrupoChecklist" AS ENUM ('TELA', 'ENERGIA', 'GERAL');

-- CreateEnum
CREATE TYPE "OpcaoChecklist" AS ENUM ('SIM', 'NAO', 'AUSENTE', 'NAO_AVALIADO');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'TECNICO',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT,
    "cpf_rg" TEXT,
    "endereco" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ordens_servico" (
    "id" TEXT NOT NULL,
    "numero" SERIAL NOT NULL,
    "codigo_acesso" TEXT NOT NULL,
    "status" "StatusOS" NOT NULL DEFAULT 'RECEBIDO',
    "servico" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "aparelho" TEXT NOT NULL,
    "imei" TEXT,
    "total" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "sinal" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "forma_pagamento" "FormaPagamento",
    "pago" BOOLEAN NOT NULL DEFAULT false,
    "data_entrada" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_previsao" DATE,
    "data_entrega" DATE,
    "receptor" TEXT,
    "tecnico" TEXT,
    "entregador" TEXT,
    "cliente_nao_sabe" BOOLEAN NOT NULL DEFAULT false,
    "ja_foi_aberto" BOOLEAN NOT NULL DEFAULT false,
    "nao_testado" BOOLEAN NOT NULL DEFAULT false,
    "outro_descricao" TEXT,
    "relato_cliente" TEXT,
    "avaliacao_tecnica" TEXT,
    "fornecedor" TEXT,
    "pecas_risco" TEXT,
    "optou_nao_realizar" BOOLEAN NOT NULL DEFAULT false,
    "garantia_dias" INTEGER NOT NULL DEFAULT 90,
    "garantia_inicio" DATE,
    "garantia_vence_em" DATE,
    "garantia_cobertura" TEXT,
    "mensagem_cliente" TEXT,
    "criado_por_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ordens_servico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checklist_respostas" (
    "id" TEXT NOT NULL,
    "os_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "grupo" "GrupoChecklist" NOT NULL,
    "opcao" "OpcaoChecklist" NOT NULL,

    CONSTRAINT "checklist_respostas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historico_status" (
    "id" TEXT NOT NULL,
    "os_id" TEXT NOT NULL,
    "status" "StatusOS" NOT NULL,
    "observacao" TEXT,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historico_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracoes" (
    "id" TEXT NOT NULL DEFAULT 'loja',
    "empresa" TEXT NOT NULL DEFAULT 'TROCA TELAS E MUITO+',
    "subtitulo" TEXT NOT NULL DEFAULT 'ASSISTÊNCIA TÉCNICA E ACESSÓRIOS PARA CELULARES E INFORMÁTICA',
    "endereco" TEXT NOT NULL DEFAULT 'Rua 13, esquina com 91, 1287 - Jaconé, Saquarema - RJ',
    "telefone" TEXT NOT NULL DEFAULT '(22) 99899-5338',
    "email" TEXT NOT NULL DEFAULT 'lojatrocatelas@gmail.com',
    "logo_url" TEXT,
    "tecnico_padrao" TEXT,
    "garantia_padrao_dias" INTEGER NOT NULL DEFAULT 90,
    "retirada_dias" INTEGER NOT NULL DEFAULT 90,
    "multa_percentual" DECIMAL(5,2) NOT NULL DEFAULT 2,
    "juros_percentual" DECIMAL(5,2) NOT NULL DEFAULT 1,
    "qr_na_os" BOOLEAN NOT NULL DEFAULT true,
    "cobertura_padrao" TEXT,
    "exclusoes_garantia" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "clientes_nome_idx" ON "clientes"("nome");

-- CreateIndex
CREATE INDEX "clientes_telefone_idx" ON "clientes"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "ordens_servico_numero_key" ON "ordens_servico"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "ordens_servico_codigo_acesso_key" ON "ordens_servico"("codigo_acesso");

-- CreateIndex
CREATE INDEX "ordens_servico_cliente_id_idx" ON "ordens_servico"("cliente_id");

-- CreateIndex
CREATE INDEX "ordens_servico_status_idx" ON "ordens_servico"("status");

-- CreateIndex
CREATE INDEX "ordens_servico_data_previsao_idx" ON "ordens_servico"("data_previsao");

-- CreateIndex
CREATE INDEX "ordens_servico_created_at_idx" ON "ordens_servico"("created_at");

-- CreateIndex
CREATE INDEX "checklist_respostas_os_id_idx" ON "checklist_respostas"("os_id");

-- CreateIndex
CREATE UNIQUE INDEX "checklist_respostas_os_id_item_id_key" ON "checklist_respostas"("os_id", "item_id");

-- CreateIndex
CREATE INDEX "historico_status_os_id_created_at_idx" ON "historico_status"("os_id", "created_at");

-- CreateIndex
CREATE INDEX "accounts_user_id_idx" ON "accounts"("user_id");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- AddForeignKey
ALTER TABLE "ordens_servico" ADD CONSTRAINT "ordens_servico_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordens_servico" ADD CONSTRAINT "ordens_servico_criado_por_id_fkey" FOREIGN KEY ("criado_por_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_respostas" ADD CONSTRAINT "checklist_respostas_os_id_fkey" FOREIGN KEY ("os_id") REFERENCES "ordens_servico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_status" ADD CONSTRAINT "historico_status_os_id_fkey" FOREIGN KEY ("os_id") REFERENCES "ordens_servico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_status" ADD CONSTRAINT "historico_status_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
