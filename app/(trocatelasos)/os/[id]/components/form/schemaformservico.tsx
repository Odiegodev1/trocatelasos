
import { z } from "zod";

// 1. Definição do Schema de Validação
export const schemaservicos = z.object({
  servico:z.string().min(1, "O serviço e obrigatorio"),
  cliente: z.string().min(1, "O nome do cliente e obrigatorio"),
  phone: z.string().optional(),
  cpf:z.string().optional(),
  endereco:z.string().optional()
});

// 2. Exportação do Tipo inferido pelo Zod para o TypeScript
export type Schemaservicos = z.infer<typeof schemaservicos>;