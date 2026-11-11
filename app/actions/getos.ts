"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function Getos() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      data: [],
      error: "Usuário não autorizado",
    };
  }

  try {
    const os = await prisma.ordemServico.findMany({
      select: {
        id: true,
        numero: true,
        aparelho: true,
        servico: true,
        status: true,
        dataEntrada: true,
        dataPrevisao: true,
        garantiaVenceEm: true,
        total: true,
        sinal: true,
        pago: true,
        cliente: {
          select: {
            nome: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const data = os.map((item) => ({
      id: item.id,
      numero: item.numero,
      aparelho: item.aparelho,
      servico: item.servico,
      cliente: item.cliente.nome,
      status: item.status,
      dataEntrada: item.dataEntrada.toISOString(),
      dataPrevisao: item.dataPrevisao?.toISOString() ?? null,
      garantiaVenceEm: item.garantiaVenceEm?.toISOString() ?? null,
      total: item.total.toNumber(),
      sinal: item.sinal?.toNumber() ?? 0,
      pago: item.pago,
    }));

    return {
      data,
      error: null,
    };
  } catch (error) {
    console.error("[GET_OS]", error);

    return {
      data: [],
      error: "Não foi possível carregar as ordens de serviço.",
    };
  }
}