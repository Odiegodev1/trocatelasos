"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function buscarOrdemServico(numero: number) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false as const,
      error: "Usuário não autorizado.",
      data: null,
    };
  }

  if (!Number.isSafeInteger(numero) || numero <= 0) {
    return {
      success: false as const,
      error: "Número da OS inválido.",
      data: null,
    };
  }

  try {
    const os = await prisma.ordemServico.findFirst({
      where: {
        numero,
      },
      include: {
        cliente: true,
        checklist: true,
        historico: true,
      },
    });

    if (!os) {
      return {
        success: false as const,
        error: "Ordem de serviço não encontrada.",
        data: null,
      };
    }

    // Converte os tipos do Prisma para dados serializáveis.
    const data = {
      ...os,

      total: os.total.toNumber(),
      sinal: os.sinal?.toNumber() ?? 0,

      dataEntrada: os.dataEntrada.toISOString(),
      dataPrevisao: os.dataPrevisao?.toISOString() ?? null,
      dataEntrega: os.dataEntrega?.toISOString() ?? null,

      garantiaInicio: os.garantiaInicio?.toISOString() ?? null,
      garantiaVenceEm: os.garantiaVenceEm?.toISOString() ?? null,

      createdAt: os.createdAt.toISOString(),
      updatedAt: os.updatedAt.toISOString(),

      cliente: {
        ...os.cliente,
      },

      historico: os.historico.map((item) => ({
        ...item,
      })),
    };

    return {
      success: true as const,
      error: null,
      data,
    };
  } catch (error) {
    console.error("[BUSCAR_OS]", error);

    return {
      success: false as const,
      error: "Erro ao buscar ordem de serviço.",
      data: null,
    };
  }
}