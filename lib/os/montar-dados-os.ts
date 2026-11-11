"use client"

import { itensEstado } from "@/app/(trocatelasos)/os/[id]/components/form/schemaformestado"

import type {
  CriarOrdemServicoInput,
} from "@/lib/validations/ordem-servico"

type Dados = Record<string, any>

function ler(secao: string): Dados {
  try {
    return JSON.parse(
      sessionStorage.getItem(
        `trocatelas:os:${secao}`
      ) || "{}"
    )
  } catch {
    return {}
  }
}

function primeiro(...valores: unknown[]): any {
  return valores.find(
    (v) => v !== undefined && v !== null && v !== ""
  )
}

function texto(...valores: unknown[]): string {
  return String(primeiro(...valores) ?? "")
}

function numero(valor: unknown): number {
  if (typeof valor === "number") return valor

  const texto = String(valor ?? "0")
    .replace(/[R$\s]/g, "")
    .replace(/\./g, "")
    .replace(",", ".")

  const resultado = Number(texto)

  return Number.isFinite(resultado) ? resultado : 0
}

function dataISO(valor: unknown): string | null {
  if (!valor) return null

  const texto = String(valor)

  // Data já serializada pelo JSON.stringify

  if (/^\d{4}-\d{2}-\d{2}/.test(texto)) {
    return texto.slice(0, 10)
  }

  // Data no formato brasileiro

  const brasileiro = texto.match(
    /^(\d{2})\/(\d{2})\/(\d{4})$/
  )

  if (brasileiro) {
    return `${brasileiro[3]}-${brasileiro[2]}-${brasileiro[1]}`
  }

  return null
}

function formaPagamento(
  valor: unknown
): CriarOrdemServicoInput["pagamento"]["formaPagamento"] {
  const formas = {
    pix: "PIX",
    dinheiro: "DINHEIRO",
    cartao_debito: "CARTAO_DEBITO",
    cartao_credito: "CARTAO_CREDITO",
    dinheiro_pix: "DINHEIRO_PIX",
    transferencia: "TRANSFERENCIA",
  } as const

  const chave = String(valor ?? "")
    .trim()
    .toLowerCase()

  return formas[chave as keyof typeof formas] ?? null
}

export function montarDadosOS(): CriarOrdemServicoInput {
  const servico = ler("servico")
  const cliente = ler("cliente")
  const aparelho = ler("aparelho")
  const prazo = ler("prazo")
  const estado = ler("estado")
  const relato = ler("relato")
  const garantia = ler("garantia")

  const respostas = (estado.respostas ?? {}) as Record<
    string,
    string
  >

  const grupos = [
    {
      grupo: "TELA" as const,
      itens: itensEstado.tela,
    },
    {
      grupo: "ENERGIA" as const,
      itens: itensEstado.energia,
    },
    {
      grupo: "GERAL" as const,
      itens: itensEstado.geral,
    },
  ]

  const opcoesValidas = [
    "SIM",
    "NAO",
    "AUSENTE",
    "NAO_AVALIADO",
  ]

  const checklist = grupos.flatMap((grupo) =>
    grupo.itens.flatMap(([itemId]) => {
      const opcao = respostas[itemId]

      if (!opcoesValidas.includes(opcao)) {
        return []
      }

      return [
        {
          itemId,
          grupo: grupo.grupo,
          opcao: opcao as
            | "SIM"
            | "NAO"
            | "AUSENTE"
            | "NAO_AVALIADO",
        },
      ]
    })
  )

  return {
    cliente: {
      nome: texto(
        cliente.nome,
        servico.cliente
      ),

      telefone: texto(
        cliente.telefone,
        servico.telefone,
        servico.phone
      ),

      cpfRg: texto(
        cliente.cpfRg,
        cliente.cpf,
        servico.cpf
      ),

      endereco: texto(
        cliente.endereco,
        servico.endereco
      ),
    },

    servico: texto(
      servico.servico,
      servico.service
    ),

    aparelho: {
      modelo: texto(
        aparelho.modelo,
        aparelho.aparelho,
        servico.modelo
      ),

      imei: texto(
        aparelho.imei,
        servico.imei
      ),
    },

    pagamento: {
      total: numero(
        primeiro(
          aparelho.total,
          servico.total,
          servico.valor
        )
      ),

      sinal: numero(
        primeiro(
          aparelho.sinal,
          servico.sinal
        )
      ),

      formaPagamento: formaPagamento(
        primeiro(
          aparelho.fpagamento,
          servico.formaPagamento,
          servico.forma
        )
      ),

      pago: Boolean(
        primeiro(
          aparelho.pago,
          servico.pago
        ) ?? false
      ),
    },

    prazo: {
      entrada: dataISO(
        primeiro(
          prazo.aentrada,
          prazo.entrada
        )
      ),

      previsao: dataISO(prazo.previsao),

      entrega: dataISO(prazo.entrega),

      receptor: texto(prazo.receptor),

      tecnico: texto(prazo.tecnico),

      entregador: texto(prazo.entregador),
    },

    estado: {
      clienteNaoSabe: Boolean(
        estado.clienteNaoSabe
      ),

      jaFoiAberto: Boolean(
        primeiro(
          estado.jaFoiAberto,
          estado.aparelhoAberto
        )
      ),

      naoTestado: Boolean(
        primeiro(
          estado.naoTestado,
          estado.naoTestadoBancada
        )
      ),

      outroDescricao: texto(
        estado.outroDescricao
      ),

      respostas: checklist,
    },

    relato: {
      relatoCliente: texto(
        relato.relatoCliente
      ),

      avaliacaoTecnica: texto(
        relato.avaliacaoTecnica
      ),

      fornecedor: texto(
        relato.fornecedorPeca,
        relato.fornecedor
      ),

      pecasRisco: texto(
        relato.pecasRiscoDano,
        relato.pecasRisco
      ),

      optouNaoRealizar: Boolean(
        primeiro(
          relato.clienteDesistiu,
          relato.optouNaoRealizar
        )
      ),
    },

    garantia: {
      dias: numero(
        primeiro(
          garantia.garantiaDias,
          garantia.dias,
          90
        )
      ),

      inicio: dataISO(
        primeiro(
          garantia.comecaEm,
          garantia.inicio
        )
      ),

      vencimento: dataISO(
        primeiro(
          garantia.venceEm,
          garantia.vencimento
        )
      ),

      cobertura: texto(
        garantia.cobertura
      ),
    },
  }
}