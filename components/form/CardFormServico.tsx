"use client"

import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { schemaservicos, type Schemaservicos } from "./schemaformservico"
import { useAutoSalvarOS } from "@/lib/useAutoSalvarOS"
import { DadosOSFormulario } from "../os/tipos-formulario"

const campos = [
  { name: "servico", label: "Serviço", placeholder: "Troca de tela, bateria, etc...", fullWidth: true },
  { name: "cliente", label: "NOME DO CLIENTE", placeholder: "Maria Costa", fullWidth: false },
  { name: "phone", label: "Telefone", placeholder: "(22) 99965-0436", fullWidth: false },
  { name: "cpf", label: "CPF", placeholder: "000.000.000-00", fullWidth: false },
  { name: "endereco", label: "Endereço", placeholder: "Rua 4 com a 18, Jaconé, Saquarema RJ", fullWidth: true },
] as const

interface CardFormServicoProps {
  os?: DadosOSFormulario
}

export function CardFormServicoOs({ os }: CardFormServicoProps) {
  const form = useForm<Schemaservicos>({
    resolver: zodResolver(schemaservicos),
    defaultValues: {
      cliente: os?.cliente?.nome ?? "",
      cpf: os?.cliente?.cpf ?? "",
      endereco: os?.cliente?.endereco ?? "",
      phone: os?.cliente?.telefone ?? "",
      servico: os?.servico ?? "",
    },
  })

  const status = useAutoSalvarOS("servico", form)

  useEffect(() => {
    if (!os) return

    form.reset({
      cliente: os.cliente?.nome ?? "",
      cpf: os.cliente?.cpf ?? "",
      endereco: os.cliente?.endereco ?? "",
      phone: os.cliente?.telefone ?? "",
      servico: os.servico ?? "",
    })
  }, [os, form])

  return (
    <div className="w-full max-w-4xl space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-bold">SERVIÇO E CLIENTE</h2>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          {status === "saved" && <CheckCircle2 className="size-3 text-green-600" />}
          {status === "typing"
            ? "Salvando..."
            : status === "saved"
              ? "Salvo automaticamente"
              : ""}
        </span>
      </div>

      <Card>
        <CardContent>
          <FieldGroup>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {campos.map(({ name, label, placeholder, fullWidth }) => (
                <div key={name} className={fullWidth ? "md:col-span-3" : ""}>
                  <Controller
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
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>
              ))}
            </div>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  )
}
