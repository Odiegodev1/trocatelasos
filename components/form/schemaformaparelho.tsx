
import { z } from "zod";

// 1. Definição do Schema de Validação
export const schemaaparelho = z.object({
  aparelho:z.string().min(1, "O aparelho e obrigatorio"),
  imei: z.string().optional(),
  total: z.number().optional(),
  sinal:z.number().optional(),
  fpagamento:z.string().optional(),
  pago:z.boolean().optional()

});

// 2. Exportação do Tipo inferido pelo Zod para o TypeScript
export type Schemaaparelho = z.infer<typeof schemaaparelho>;