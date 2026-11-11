import { z } from "zod"

export const schemaformrelato = z.object({
  relatoCliente: z.string(),
  avaliacaoTecnica: z.string(),
  fornecedorPeca: z.string(),
  pecasRiscoDano: z.string(),
  clienteDesistiu: z.boolean(),
})

export type SchemaformRelato = z.infer<typeof schemaformrelato>