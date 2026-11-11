import { z } from "zod"

export const schemaformgarantia = z.object({
  garantiaDias: z.number().int().min(0),

  comecaEm: z.date(),

  venceEm: z.date(),

  cobertura: z.string(),

  recadoCliente: z.string(),
})

export type SchemaformGarantia = z.infer<typeof schemaformgarantia>