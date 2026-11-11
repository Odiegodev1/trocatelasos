import { z } from "zod"

export const schemaformlogin = z.object({
gmail:z.string().min(1, "O GMAIL e obrigatorio"),
password:z.string().min(1,"A senha e obrigatoria")
})

export type Schemaformlogin = z.infer<typeof schemaformlogin>