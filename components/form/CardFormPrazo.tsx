"use client"

import { useEffect, useState } from "react"
import { Controller, useForm, useWatch, type Control } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format, isValid, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CheckCircle2, ChevronDownIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { schemaformPrazo, type SchemaformPrazo } from "./schemaformprazo"
import { useAutoSalvarOS } from "@/lib/useAutoSalvarOS"
import { DadosOSFormulario } from "../os/tipos-formulario"

type DateFieldName = "aentrada" | "previsao" | "entrega"

type DateFieldProps = {
  name: DateFieldName
  label: string
  control: Control<SchemaformPrazo>
  openCalendar: DateFieldName | null
  setOpenCalendar: (name: DateFieldName | null) => void
  defaultMonth?: Date
}

function parseDateValue(value: unknown): Date | undefined {
  if (!value) return undefined
  if (value instanceof Date) return isValid(value) ? value : undefined
  if (typeof value === "string") {
    const parsed = parseISO(value)
    return isValid(parsed) ? parsed : undefined
  }
  return undefined
}

function DateField({
  name,
  label,
  control,
  openCalendar,
  setOpenCalendar,
  defaultMonth,
}: DateFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const dateValue = parseDateValue(field.value)

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            <Popover
              open={openCalendar === name}
              onOpenChange={(open) => setOpenCalendar(open ? name : null)}
            >
              <PopoverTrigger
                render={
                  <Button
                    ref={field.ref}
                    id={name}
                    type="button"
                    variant="outline"
                    className="w-full justify-between text-left font-normal"
                    aria-invalid={fieldState.invalid}
                    onBlur={field.onBlur}
                  >
                    <span className={!dateValue ? "text-muted-foreground" : ""}>
                      {dateValue
                        ? format(dateValue, "dd/MM/yyyy", { locale: ptBR })
                        : "Selecione uma data"}
                    </span>
                    <ChevronDownIcon className="size-4 opacity-60" />
                  </Button>
                }
              />
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateValue}
                  defaultMonth={dateValue ?? defaultMonth}
                  onSelect={(date) => {
                    field.onChange(date ? format(date, "yyyy-MM-dd") : undefined)
                    setOpenCalendar(null)
                  }}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )
      }}
    />
  )
}

interface CardFormPrazoProps {
  os?: DadosOSFormulario
}

export function CardFormPrazoOs({ os }: CardFormPrazoProps) {
  const [openCalendar, setOpenCalendar] = useState<DateFieldName | null>(null)
  
  const form = useForm<SchemaformPrazo>({
    resolver: zodResolver(schemaformPrazo),
    defaultValues: {
      aentrada: os?.dataEntrada ?? "",
      previsao: os?.dataPrevisao ?? undefined,
      entrega: os?.dataEntrega ?? undefined,
      receptor: os?.receptor ?? "",
      tecnico: os?.tecnico ?? "",
      entregador: os?.entregador ?? "",
    },
  })

  // Sincroniza o formulário assim que os dados de 'os' chegarem
  useEffect(() => {
    if (!os) return

    form.reset({
      aentrada: os.dataEntrada ?? "",
      previsao: os.dataPrevisao ?? undefined,
      entrega: os.dataEntrega ?? undefined,
      receptor: os.receptor ?? "",
      tecnico: os.tecnico ?? "",
      entregador: os.entregador ?? "",
    })
  }, [os, form])


  const entrada = useWatch({ control: form.control, name: "aentrada" })
  const entradaDate = parseDateValue(entrada)

  return (
    <div className="w-full max-w-4xl space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-bold">PRAZOS E RESPONSÁVEIS</h2>
     
      </div>

      <Card>
        <CardContent>
          <FieldGroup>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <DateField
                name="aentrada"
                label="Data de entrada"
                control={form.control}
                openCalendar={openCalendar}
                setOpenCalendar={setOpenCalendar}
              />
              <DateField
                name="previsao"
                label="Previsão de entrega"
                control={form.control}
                openCalendar={openCalendar}
                setOpenCalendar={setOpenCalendar}
                defaultMonth={entradaDate}
              />
              <DateField
                name="entrega"
                label="Data de entrega"
                control={form.control}
                openCalendar={openCalendar}
                setOpenCalendar={setOpenCalendar}
                defaultMonth={entradaDate}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {(
                [
                  ["receptor", "Recebido por", "Nome do responsável"],
                  ["tecnico", "Técnico responsável", "Nome do técnico"],
                  ["entregador", "Entregue por", "Nome do responsável"],
                ] as const
              ).map(([name, label, placeholder]) => (
                <Controller
                  key={name}
                  name={name}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={name}>{label}</FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        id={name}
                        placeholder={placeholder}
                        autoComplete="off"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              ))}
            </div>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  )
}
