
import { z } from "zod";

// 1. Definição do Schema de Validação
export const schemaformPrazo = z.object({
  aentrada: z.string().optional(),
  previsao: z.string().optional(),
  entrega: z.string().optional(),
  receptor:z.string().optional(),
  tecnico:z.string().optional(),
  entregador:z.string().optional()

});

// 2. Exportação do Tipo inferido pelo Zod para o TypeScript
export type SchemaformPrazo = z.infer<typeof schemaformPrazo>;