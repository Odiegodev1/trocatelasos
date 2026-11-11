"use server"

import { randomBytes } from "node:crypto"

import { revalidatePath } from "next/cache"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

import {
  criarOrdemServicoSchema,
  type CriarOrdemServicoInput,
} from "@/lib/validations/ordem-servico"

function converterData(
  value?: string | null
): Date | null {
  if (!value) return null

  const date = new Date(`${value}T00:00:00.000Z`)

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    throw new Error("Data inválida.")
  }

  return date
}

function somarDias(
  data: Date | null,
  dias: number
): Date | null {
  if (!data) return null

  const resultado = new Date(data)

  resultado.setUTCDate(
    resultado.getUTCDate() + dias
  )

  return resultado
}

export async function criarOrdemServico(
  input: CriarOrdemServicoInput
) {
  try {
    // 1. Verificar autenticação

    const session = await auth()

    if (!session?.user?.id) {
      return {
        success: false as const,
        error: "Você precisa estar autenticado.",
      }
    }

    // 2. Verificar usuário no banco

    const usuario = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        role: true,
      },
    })

    if (
      !usuario ||
      !["ADMIN", "TECNICO"].includes(usuario.role)
    ) {
      return {
        success: false as const,
        error: "Você não tem permissão para criar OS.",
      }
    }

    // 3. Validar dados

    const validacao =
      criarOrdemServicoSchema.safeParse(input)

    if (!validacao.success) {
      return {
        success: false as const,
        error: "Verifique os dados da ordem de serviço.",
        issues: validacao.error.flatten(),
      }
    }

    const dados = validacao.data

    // 4. Preparar datas

    const dataEntrada =
      converterData(dados.prazo.entrada) ??
      new Date(
        new Date().toISOString().slice(0, 10) +
          "T00:00:00.000Z"
      )

    const dataPrevisao = converterData(
      dados.prazo.previsao
    )

    const dataEntrega = converterData(
      dados.prazo.entrega
    )

    const garantiaInicio = converterData(
      dados.garantia.inicio
    )

    const garantiaVencimento =
      converterData(dados.garantia.vencimento) ??
      somarDias(
        garantiaInicio,
        dados.garantia.dias
      )

    // 5. Gerar código de acesso público

    const codigoAcesso = randomBytes(24).toString(
      "hex"
    )

    // 6. Criar tudo em uma transação

    const ordem = await prisma.$transaction(
      async (tx) => {
        // Criar cliente

        const cliente = await tx.cliente.create({
          data: {
            nome: dados.cliente.nome,
            telefone: dados.cliente.telefone,
            cpfRg: dados.cliente.cpfRg,
            endereco: dados.cliente.endereco,
          },
        })

        // Criar ordem de serviço

        const os = await tx.ordemServico.create({
          data: {
            codigoAcesso,

            status: "RECEBIDO",

            servico: dados.servico,

            clienteId: cliente.id,

            aparelho: dados.aparelho.modelo,
            imei: dados.aparelho.imei,

            total: dados.pagamento.total,
            sinal: dados.pagamento.sinal,

            formaPagamento:
              dados.pagamento.formaPagamento,

            pago: dados.pagamento.pago,

            dataEntrada,
            dataPrevisao,
            dataEntrega,

            receptor: dados.prazo.receptor,
            tecnico: dados.prazo.tecnico,
            entregador: dados.prazo.entregador,

            clienteNaoSabe:
              dados.estado.clienteNaoSabe,

            jaFoiAberto:
              dados.estado.jaFoiAberto,

            naoTestado:
              dados.estado.naoTestado,

            outroDescricao:
              dados.estado.outroDescricao,

            relatoCliente:
              dados.relato.relatoCliente,

            avaliacaoTecnica:
              dados.relato.avaliacaoTecnica,

            fornecedor:
              dados.relato.fornecedor,

            pecasRisco:
              dados.relato.pecasRisco,

            optouNaoRealizar:
              dados.relato.optouNaoRealizar,

            garantiaDias:
              dados.garantia.dias,

            garantiaInicio,
            garantiaVenceEm:
              garantiaVencimento,

            garantiaCobertura:
              dados.garantia.cobertura,

            criadoPorId: usuario.id,
          },
        })

        // Salvar checklist

        if (dados.estado.respostas.length > 0) {
          await tx.checklistResposta.createMany({
            data: dados.estado.respostas.map(
              (resposta) => ({
                osId: os.id,
                itemId: resposta.itemId,
                grupo: resposta.grupo,
                opcao: resposta.opcao,
              })
            ),
          })
        }

        // Registrar histórico inicial

        await tx.historicoStatus.create({
          data: {
            osId: os.id,

            status: "RECEBIDO",

            observacao:
              "Ordem de serviço criada.",

            userId: usuario.id,
          },
        })

        return os
      }
    )

    // 7. Atualizar listagens

    revalidatePath("/os")
    revalidatePath("/dashboard")

    // 8. Retornar resultado

    return {
      success: true as const,

      data: {
        id: ordem.id,
        numero: ordem.numero,
        status: ordem.status,
      },
    }
  } catch (error) {
    console.error("[CRIAR_ORDEM_SERVICO]", error)

    return {
      success: false as const,
      error:
        "Não foi possível salvar a ordem de serviço.",
    }
  }
}