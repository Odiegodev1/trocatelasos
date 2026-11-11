"use client"

import { useEffect, useRef, useState } from "react"

import { Controller, useForm, useWatch } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import {

  Check,

  CheckCircle2,

  CircleHelp,

  Eraser,

  Loader2,

  MonitorSmartphone,

  Smartphone,

  Zap,

} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import { Checkbox } from "@/components/ui/checkbox"

import {

  itensEstado,

  schemaformestado,

  type RespostaEstado,

  type SchemaformEstado,

  type SecaoEstado,

} from "./schemaformestado"

import { salvarDadosOS } from "@/lib/os-temporaria"

type Status = "idle" | "typing" | "saving" | "saved"

const opcoes: {

  value: RespostaEstado

  label: string

  active: string

  inactive: string

}[] = [

  {

    value: "SIM",

    label: "SIM",

    active:

      "!bg-red-600 !text-white !border-red-600 hover:!bg-red-700",

    inactive:

      "hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950",

  },

  {

    value: "NAO",

    label: "NÃO",

    active:

      "!bg-emerald-600 !text-white !border-emerald-600 hover:!bg-emerald-700",

    inactive:

      "hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950",

  },

  {

    value: "AUSENTE",

    label: "?",

    active:

      "!bg-amber-500 !text-white !border-amber-500 hover:!bg-amber-600",

    inactive:

      "hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950",

  },

  {

    value: "NAO_AVALIADO",

    label: "!",

    active:

      "!bg-slate-700 !text-white !border-slate-700 hover:!bg-slate-800",

    inactive:

      "hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800",

  },

]

const secoes = [

  {

    id: "tela",

    titulo: "Tela",

    descricao: "Display, frontal, touch e película",

    icon: MonitorSmartphone,

  },

  {

    id: "energia",

    titulo: "Energia / Sistema",

    descricao: "Inicialização, bateria e funcionamento",

    icon: Zap,

  },

  {

    id: "geral",

    titulo: "Geral",

    descricao: "Estrutura física e demais componentes",

    icon: Smartphone,

  },

] as const

export function CardFormEstadoAparelho() {

  const [status, setStatus] = useState<Status>("idle")

  const firstRender = useRef(true)

  const form = useForm<SchemaformEstado>({

resolver: zodResolver(schemaformestado),

    defaultValues: {

      clienteNaoSabe: false,

      aparelhoAberto: false,

      naoTestadoBancada: false,

      respostas: {},

      outroDescricao: "",

    },

  })

// Observa as alterações do formulário

  const values = useWatch({

    control: form.control,

  })

// SALVAMENTO AUTOMÁTICO

  useEffect(() => {

    if (firstRender.current) {

      firstRender.current = false

      return

    }

    setStatus("typing")

    const timer = setTimeout(() => {

      setStatus("saving")

      const dados = form.getValues()

      salvarDadosOS("estado", dados)

      console.log("💾 ESTADO DO APARELHO:", dados)

      setStatus("saved")

    }, 800)

    return () => clearTimeout(timer)

  }, [values, form])

// Marca apenas os itens ainda não respondidos como NÃO

  function marcarRestantesComoNao(secao: SecaoEstado) {

    const respostas = {

      ...form.getValues("respostas"),

    }

    for (const [id] of itensEstado[secao]) {

      if (!respostas[id]) {

        respostas[id] = "NAO"

      }

    }

    form.setValue("respostas", respostas, {

      shouldDirty: true,

    })

  }

// Limpa as respostas de uma seção

  function limparSecao(secao: SecaoEstado) {

    const respostas = {

      ...form.getValues("respostas"),

    }

    for (const [id] of itensEstado[secao]) {

      delete respostas[id]

    }

    form.setValue("respostas", respostas, {

      shouldDirty: true,

    })

    if (secao === "energia") {

      form.setValue("outroDescricao", "", {

        shouldDirty: true,

      })

    }

  }

// Seleciona ou desmarca uma resposta

  function selecionarResposta(

id: string,

resposta: RespostaEstado

  ) {

    const respostas = {

      ...form.getValues("respostas"),

    }

    if (respostas[id] === resposta) {

      delete respostas[id]

    } else {

      respostas[id] = resposta

    }

    form.setValue("respostas", respostas, {

      shouldDirty: true,

    })

  }

  const respostas = values.respostas ?? {}

  const totalItens = Object.values(itensEstado).reduce(

    (total, itens) => total + itens.length,

    0

  )

  const totalRespondidos = Object.values(respostas).filter(

    Boolean

  ).length

  const percentual = Math.round(

    (totalRespondidos / totalItens) * 100

  )

  return (

    <div className="w-full max-w-4xl space-y-5">

 

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h2 className="text-sm font-bold uppercase tracking-wide">

            Estado do aparelho na chegada

          </h2>

          <p className="mt-1 text-xs text-muted-foreground">

            Registre as condições identificadas no recebimento.

          </p>

        </div>

  

        <div className="flex items-center gap-2 text-xs">

          {status === "typing" && (

            <span className="text-muted-foreground">

              Alterações pendentes...

            </span>

          )}

          {status === "saving" && (

            <span className="flex items-center gap-1 text-muted-foreground">

              <Loader2 className="size-3 animate-spin" />

              Processando...

            </span>

          )}

          {status === "saved" && (

            <span className="flex items-center gap-1 text-emerald-600">

              <CheckCircle2 className="size-3" />

              Registrado no console

            </span>

          )}

        </div>

      </div>



      <Card>

        <CardContent className="space-y-5">

          <div>

            <h3 className="text-sm font-semibold">

              Informações do recebimento

            </h3>

            <p className="mt-1 text-xs text-muted-foreground">

              Selecione as situações aplicáveis ao aparelho.

            </p>

          </div>

          <div className="grid gap-3">

            {[

              {

                name: "clienteNaoSabe",

                label: "Cliente não sabe o que ocorreu",

              },

              {

                name: "aparelhoAberto",

                label: "Aparelho já foi aberto",

              },

              {

                name: "naoTestadoBancada",

                label: "Nada foi testado em bancada",

              },

            ].map((item) => (

              <Controller

key={item.name}

name={

                  item.name as

                    | "clienteNaoSabe"

                    | "aparelhoAberto"

                    | "naoTestadoBancada"

                }

control={form.control}

render={({ field }) => (

                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/40">

                    <Checkbox

checked={field.value}

onCheckedChange={(checked) =>

                        field.onChange(checked === true)

                      }

                    />

                    <span className="text-sm">

                      {item.label}

                    </span>

                  </label>

                )}

              />

            ))}

          </div>

        </CardContent>

      </Card>



      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-lg border bg-muted/20 px-4 py-3 text-xs">

        <span className="font-medium">

          Legenda:

        </span>

        <span className="flex items-center gap-1.5">

          <span className="font-bold text-red-600">

            SIM

          </span>

          Tem o problema

        </span>

        <span className="flex items-center gap-1.5">

          <span className="font-bold text-emerald-600">

            NÃO

          </span>

          Não tem

        </span>

        <span className="flex items-center gap-1.5">

          <span className="font-bold text-amber-600">

            ?

          </span>

          Componente ausente

        </span>

        <span className="flex items-center gap-1.5">

          <span className="font-bold">

            !

          </span>

          Não dá para avaliar

        </span>

      </div>



      <div className="space-y-2">

        <div className="flex justify-between text-xs">

          <span className="text-muted-foreground">

            Checklist preenchido

          </span>

          <span className="font-medium">

            {totalRespondidos} de {totalItens} itens

          </span>

        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-muted">

          <div

className="h-full rounded-full bg-emerald-600 transition-all duration-300"

style={{

              width: `${percentual}%`,

            }}

          />

        </div>

      </div>



      {secoes.map((secao) => {

        const Icon = secao.icon

        const itens = itensEstado[secao.id]

        return (

          <Card

key={secao.id}

className="overflow-hidden"

          >

            <CardContent className="p-0">

             

              <div className="flex flex-col gap-4 border-b bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex size-9 items-center justify-center rounded-lg border bg-background">

                    <Icon className="size-4" />

                  </div>

                  <div>

                    <h3 className="text-sm font-semibold">

                      {secao.titulo}

                    </h3>

                    <p className="text-xs text-muted-foreground">

                      {secao.descricao}

                    </p>

                  </div>

                </div>

            
                <div className="flex flex-wrap gap-2">

                  <Button

type="button"

variant="outline"

size="sm"

onClick={() =>

                      marcarRestantesComoNao(secao.id)

                    }

                  >

                    <Check className="size-3.5" />

                    Marcar resto como NÃO

                  </Button>

                  <Button

type="button"

variant="ghost"

size="sm"

onClick={() =>

                      limparSecao(secao.id)

                    }

                  >

                    <Eraser className="size-3.5" />

                    Limpar

                  </Button>

                </div>

              </div>

             <div className="divide-y">

                {itens.map(([id, label]) => {

                  const selecionado = respostas[id]

                  return (

                    <div

key={id}

className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"

                    >

                      <span className="text-sm">

                        {label}

                      </span>

                 

                      <div className="grid grid-cols-4 gap-1.5 sm:flex">

                        {opcoes.map((opcao) => {

                          const ativo =

                            selecionado === opcao.value

                          return (

                            <Button

key={opcao.value}

type="button"

size="sm"

variant="outline"

aria-pressed={ativo}

aria-label={`${label}: ${opcao.label}`}

onClick={() =>

                                selecionarResposta(

id,

opcao.value

                                )

                              }

className={`

                                min-w-12

                                cursor-pointer

                                rounded-md

                                border

                                font-semibold

                                transition-all

                                duration-200

                                ${

                                  ativo

                                    ? opcao.active

                                    : opcao.inactive

                                }

                              `}

                            >

                              {opcao.label}

                            </Button>

                          )

                        })}

                      </div>

                    

                      {id === "outro" && (

                        <Controller

name="outroDescricao"

control={form.control}

render={({ field }) => (

                            <Input

                              {...field}

placeholder="Descreva o problema"

className="w-full sm:max-w-52"

                            />

                          )}

                        />

                      )}

                    </div>

                  )

                })}

              </div>

            </CardContent>

          </Card>

        )

      })}

   
      <div className="flex items-start gap-2 rounded-lg border border-dashed p-4 text-xs text-muted-foreground">

        <CircleHelp className="mt-0.5 size-4 shrink-0" />

        <p>

          Os itens sem seleção permanecem pendentes de avaliação.

          Utilize Marcar resto como NÃO apenas quando os demais

          componentes tiverem sido verificados.

        </p>

      </div>

    </div>

  )

}