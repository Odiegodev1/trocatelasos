import { z } from "zod"

export const respostaEstadoSchema = z.enum([
  "SIM",
  "NAO",
  "AUSENTE",
  "NAO_AVALIADO",
])

export const itensEstado = {
  tela: [
    ["displayManchas", "Display com manchas e/ou listras"],
    ["displayPiscando", "Display piscando"],
    ["frontalApagada", "Frontal apagada"],
    ["frontalTrincas", "Frontal com trincas"],
    ["touchFantasma", "Touch com toques fantasmas"],
    ["touchSemResposta", "Touch não reconhece toques"],
    ["vidroArranhoes", "Vidro e/ou película com arranhões"],
    ["vidroDescolando", "Vidro e/ou película descolando"],
  ],
  energia: [
    ["naoLiga", "Aparelho não liga"],
    ["bateriaInativa", "Bateria inativa"],
    ["bateriaInchada", "Bateria inchada"],
    ["sistemaBloqueado", "Sistema bloqueado"],
    ["sistemaCorrompido", "Sistema corrompido"],
    ["sistemaReiniciando", "Sistema reiniciando"],
    ["sistemaTravado", "Sistema travado"],
    ["outro", "Outro"],
  ],
  geral: [
    ["contatoAgua", "Aparelho com sinais de contato com água"],
    ["botoesAvarias", "Botões com avarias"],
    ["carcacaAvarias", "Carcaça ou aro com avarias"],
    ["conectorCarga", "Conector de carga com avarias"],
    ["conectorFone", "Conector de fone de ouvido com avarias"],
    ["lenteCamera", "Lente de câmera com avarias"],
    ["sensorDigital", "Sensor de digital com avarias"],
    ["tampaTraseira", "Tampa traseira com avarias"],
  ],
} as const

export type RespostaEstado = z.infer<typeof respostaEstadoSchema>

export type SecaoEstado = keyof typeof itensEstado

export const schemaformestado = z.object({
  clienteNaoSabe: z.boolean(),
  aparelhoAberto: z.boolean(),
  naoTestadoBancada: z.boolean(),

  respostas: z.record(z.string(), respostaEstadoSchema.optional()),

  outroDescricao: z.string(),
})

export type SchemaformEstado = z.infer<typeof schemaformestado>