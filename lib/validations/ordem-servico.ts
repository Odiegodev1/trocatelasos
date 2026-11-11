import { z } from "zod"

export const opcaoChecklistSchema = z.enum([
  "SIM",
  "NAO",
  "AUSENTE",
  "NAO_AVALIADO",
])

export const grupoChecklistSchema = z.enum([
  "TELA",
  "ENERGIA",
  "GERAL",
])

const dataOpcional = z
  .string()
  .nullable()
  .optional()
  .refine(
    (value) =>
      !value ||
      /^\d{4}-\d{2}-\d{2}$/.test(value),
    "Use o formato AAAA-MM-DD"
  )

export const criarOrdemServicoSchema = z.object({
  cliente: z.object({
    nome: z.string().trim().min(2),
    telefone: z.string().trim().optional(),
    cpfRg: z.string().trim().optional(),
    endereco: z.string().trim().optional(),
  }),

  servico: z.string().trim().min(2),

  aparelho: z.object({
    modelo: z.string().trim().min(2),
    imei: z.string().trim().optional(),
  }),

  pagamento: z.object({
    total: z.coerce.number().min(0),
    sinal: z.coerce.number().min(0),

    formaPagamento: z
      .enum([
        "DINHEIRO",
        "PIX",
        "CARTAO_DEBITO",
        "CARTAO_CREDITO",
        "DINHEIRO_PIX",
        "TRANSFERENCIA",
      ])
      .nullable()
      .optional(),

    pago: z.boolean().default(false),
  }),

  prazo: z.object({
    entrada: dataOpcional,
    previsao: dataOpcional,
    entrega: dataOpcional,

    receptor: z.string().optional(),
    tecnico: z.string().optional(),
    entregador: z.string().optional(),
  }),

  estado: z.object({
    clienteNaoSabe: z.boolean().default(false),
    jaFoiAberto: z.boolean().default(false),
    naoTestado: z.boolean().default(false),

    outroDescricao: z.string().optional(),

    respostas: z.array(
      z.object({
        itemId: z.string().min(1),
        grupo: grupoChecklistSchema,
        opcao: opcaoChecklistSchema,
      })
    ),
  }),

  relato: z.object({
    relatoCliente: z.string().optional(),
    avaliacaoTecnica: z.string().optional(),
    fornecedor: z.string().optional(),
    pecasRisco: z.string().optional(),

    optouNaoRealizar: z.boolean().default(false),
  }),

  garantia: z.object({
    dias: z.coerce.number().int().min(0).max(3650),

    inicio: dataOpcional,
    vencimento: dataOpcional,

    cobertura: z.string().optional(),
  }),
}).superRefine((dados, ctx) => {
  if (dados.pagamento.sinal > dados.pagamento.total) {
    ctx.addIssue({
      code: "custom",
      path: ["pagamento", "sinal"],
      message: "O sinal não pode superar o total.",
    })
  }

  const ids = dados.estado.respostas.map(
    (item) => item.itemId
  )

  if (new Set(ids).size !== ids.length) {
    ctx.addIssue({
      code: "custom",
      path: ["estado", "respostas"],
      message: "Existem itens duplicados no checklist.",
    })
  }
})

export type CriarOrdemServicoInput = z.input<
  typeof criarOrdemServicoSchema
>