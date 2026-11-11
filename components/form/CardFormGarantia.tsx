"use client"

import { useEffect, useRef, useState } from "react"

import { Controller, useForm, useWatch } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import { addDays, format, startOfDay } from "date-fns"

import { ptBR } from "date-fns/locale"

import {

  CalendarDays,

  CheckCircle2,

  ChevronDownIcon,

  Clock3,

  Loader2,

  MessageSquareText,

  ShieldCheck,

} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

import {

  Field,

  FieldError,

  FieldGroup,

  FieldLabel,

} from "@/components/ui/field"

import { Input } from "@/components/ui/input"

import { Button } from "@/components/ui/button"

import { Textarea } from "@/components/ui/textarea"

import { Calendar } from "@/components/ui/calendar"

import {

  Popover,

  PopoverContent,

  PopoverTrigger,

} from "@/components/ui/popover"

import {

  schemaformgarantia,

  type SchemaformGarantia,

} from "./schemaformgarantia"

import { salvarDadosOS } from "@/lib/os-temporaria"

type Status = "idle" | "typing" | "saving" | "saved"

export function CardFormGarantia() {

  const [status, setStatus] = useState<Status>("idle")

  const [openCalendar, setOpenCalendar] = useState(false)

  const firstRender = useRef(true)

// FORMULÁRIO

  const form = useForm<SchemaformGarantia>({

    resolver: zodResolver(schemaformgarantia),

    defaultValues: {

      garantiaDias: 90,

// Evita Blocking Route no Next.js 16

      comecaEm: undefined,

      venceEm: undefined,

      cobertura: "",

      recadoCliente: "",

    },

  })

// DATA ATUAL SOMENTE NO CLIENTE

  useEffect(() => {

    const dataExistente = form.getValues("comecaEm")

    if (!dataExistente) {

      const hoje = startOfDay(new Date())

      form.setValue("comecaEm", hoje, {

        shouldDirty: false,

        shouldTouch: false,

        shouldValidate: false,

      })

      form.setValue("venceEm", addDays(hoje, 90), {

        shouldDirty: false,

        shouldTouch: false,

        shouldValidate: false,

      })

    }

  }, [form])

// OBSERVA OS VALORES

  const values = useWatch({

    control: form.control,

  })

  const garantiaDias = useWatch({

    control: form.control,

    name: "garantiaDias",

  })

  const comecaEm = useWatch({

    control: form.control,

    name: "comecaEm",

  })

  const venceEm = useWatch({

    control: form.control,

    name: "venceEm",

  })

// CALCULA AUTOMATICAMENTE O VENCIMENTO

  useEffect(() => {

    if (!comecaEm) return

    const dias = Number(garantiaDias)

    if (!Number.isFinite(dias) || dias < 0) {

      return

    }

    const vencimento = addDays(

      startOfDay(comecaEm),

      dias

    )

    const vencimentoAtual = form.getValues("venceEm")

// Evita atualizações desnecessárias

    if (

      vencimentoAtual?.getTime() ===

      vencimento.getTime()

    ) {

      return

    }

    form.setValue("venceEm", vencimento, {

      shouldDirty: false,

      shouldTouch: false,

      shouldValidate: false,

    })

  }, [comecaEm, garantiaDias, form])

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

// Salva temporariamente para impressão

      salvarDadosOS("garantia", dados)

      console.log("💾 GARANTIA SALVA:", {

        ...dados,

        comecaEm: dados.comecaEm

          ? format(dados.comecaEm, "yyyy-MM-dd")

          : null,

        venceEm: dados.venceEm

          ? format(dados.venceEm, "yyyy-MM-dd")

          : null,

        coberturaItens: dados.cobertura

          .split("\n")

          .map((item) => item.trim())

          .filter(Boolean),

      })

      setStatus("saved")

    }, 800)

    return () => clearTimeout(timer)

  }, [values, form])

  return (

    <div className="w-full max-w-4xl space-y-5">

      

      <div className="flex items-center justify-between gap-4">

        <h1 className="text-sm font-bold">

          GARANTIA E AVISO AO CLIENTE

        </h1>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">

          {status === "typing" && (

            <span>Alterações pendentes...</span>

          )}

          {status === "saving" && (

            <>

              <Loader2 className="size-3 animate-spin" />

              <span>Processando...</span>

            </>

          )}

          {status === "saved" && (

            <>

              <CheckCircle2 className="size-3 text-green-600" />

              <span className="text-green-600">

                Dados salvos temporariamente

              </span>

            </>

          )}

        </div>

      </div>

      <Card>

        <CardContent>

          <form

id="form-garantia"

onSubmit={(e) => e.preventDefault()}

          >

            <FieldGroup>

              

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                

                <Controller

name="garantiaDias"

control={form.control}

render={({ field, fieldState }) => (

                    <Field data-invalid={fieldState.invalid}>

                      <FieldLabel htmlFor="garantiaDias">

                        Garantia (dias)

                      </FieldLabel>

                      <div className="relative">

                        <Input

id="garantiaDias"

type="number"

min={0}

step={1}

value={field.value ?? 0}

onBlur={field.onBlur}

onChange={(e) => {

                            const valor = e.target.value

                            field.onChange(

                              valor === ""

                                ? 0

                                : Number(valor)

                            )

                          }}

className="pr-10"

                        />

                        <Clock3 className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                      </div>

                      {fieldState.invalid && (

                        <FieldError

errors={[fieldState.error]}

                        />

                      )}

                    </Field>

                  )}

                />

                

                <Controller

name="comecaEm"

control={form.control}

render={({ field, fieldState }) => (

                    <Field data-invalid={fieldState.invalid}>

                      <FieldLabel htmlFor="comecaEm">

                        Começa em

                      </FieldLabel>

                      <Popover

open={openCalendar}

onOpenChange={setOpenCalendar}

                      >

                        <PopoverTrigger

render={

                            <Button

id="comecaEm"

type="button"

variant="outline"

aria-invalid={fieldState.invalid}

className="w-full justify-between text-left font-normal"

                            >

                              <span

className={

                                  !field.value

                                    ? "text-muted-foreground"

                                    : ""

                                }

                              >

                                {field.value

                                  ? format(

                                      field.value,

                                      "dd/MM/yyyy",

                                      { locale: ptBR }

                                    )

                                  : "Selecione uma data"}

                              </span>

                              <ChevronDownIcon className="size-4 opacity-60" />

                            </Button>

                          }

                        />

                        <PopoverContent

className="w-auto p-0"

align="start"

                        >

                          <Calendar

mode="single"

selected={field.value}

defaultMonth={field.value}

onSelect={(date) => {

                              if (!date) return

                              field.onChange(date)

                              setOpenCalendar(false)

                            }}

locale={ptBR}

                          />

                        </PopoverContent>

                      </Popover>

                      {fieldState.invalid && (

                        <FieldError

errors={[fieldState.error]}

                        />

                      )}

                    </Field>

                  )}

                />

              

                <Field>

                  <FieldLabel htmlFor="venceEm">

                    Vence em

                  </FieldLabel>

                  <div className="relative">

                    <Input

id="venceEm"

value={

                        venceEm

                          ? format(

                              venceEm,

                              "dd/MM/yyyy",

                              { locale: ptBR }

                            )

                          : ""

                      }

placeholder="Calculando..."

readOnly

className="bg-muted/40 pr-10 font-medium"

                    />

                    <CalendarDays className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  </div>

                </Field>

              </div>

              

              {comecaEm && venceEm && (

                <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">

                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-600" />

                  <div className="space-y-1">

                    <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">

                      Garantia configurada

                    </p>

                    <p className="text-xs leading-relaxed text-emerald-700 dark:text-emerald-500">

                      O serviço terá{" "}

                      <strong>

                        {garantiaDias ?? 0} dias

                      </strong>{" "}

                      de garantia, começando em{" "}

                      <strong>

                        {format(

                          comecaEm,

                          "dd/MM/yyyy",

                          { locale: ptBR }

                        )}

                      </strong>{" "}

                      e vencendo em{" "}

                      <strong>

                        {format(

                          venceEm,

                          "dd/MM/yyyy",

                          { locale: ptBR }

                        )}

                      </strong>.

                    </p>

                  </div>

                </div>

              )}

        

              <Controller

name="cobertura"

control={form.control}

render={({ field, fieldState }) => (

                  <Field data-invalid={fieldState.invalid}>

                    <FieldLabel htmlFor="cobertura">

                      O que a garantia cobre

                    </FieldLabel>

                    <Textarea

                      {...field}

value={field.value ?? ""}

id="cobertura"

placeholder={

                        "Defeitos de fabricação da peça substituída\nProblemas relacionados à instalação\nFalhas no funcionamento do componente"

                      }

rows={5}

className="min-h-32 resize-y"

                    />

                    <p className="text-xs text-muted-foreground">

                      Escreva um item por linha. Essas informações

                      aparecerão na ordem de serviço.

                    </p>

                    {fieldState.invalid && (

                      <FieldError

errors={[fieldState.error]}

                      />

                    )}

                  </Field>

                )}

              />

           

              <Controller

name="recadoCliente"

control={form.control}

render={({ field, fieldState }) => (

                  <Field data-invalid={fieldState.invalid}>

                    <FieldLabel htmlFor="recadoCliente">

                      Recado para o cliente

                    </FieldLabel>

                    <div className="relative">

                      <Textarea

                        {...field}

value={field.value ?? ""}

id="recadoCliente"

placeholder="Ex.: Seu aparelho está pronto para retirada. Obrigado pela preferência!"

rows={4}

className="min-h-28 resize-y"

                      />

                      <MessageSquareText className="pointer-events-none absolute bottom-3 right-3 size-4 text-muted-foreground" />

                    </div>

                    <p className="text-xs text-muted-foreground">

                      Essa mensagem aparecerá na página pública

                      de acompanhamento da OS.

                    </p>

                    {fieldState.invalid && (

                      <FieldError

errors={[fieldState.error]}

                      />

                    )}

                  </Field>

                )}

              />

            </FieldGroup>

          </form>

        </CardContent>

      </Card>

    </div>

  )

}