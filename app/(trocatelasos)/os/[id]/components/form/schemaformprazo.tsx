
import { z } from "zod";

// 1. Definição do Schema de Validação
export const schemaformPrazo = z.object({
  aentrada: z.date().optional(),
  previsao: z.date().optional(),
  entrega: z.date().optional(),
  receptor:z.string().optional(),
  tecnico:z.string().optional(),
  entregador:z.string().optional()

});

// 2. Exportação do Tipo inferido pelo Zod para o TypeScript
export type SchemaformPrazo = z.infer<typeof schemaformPrazo>;