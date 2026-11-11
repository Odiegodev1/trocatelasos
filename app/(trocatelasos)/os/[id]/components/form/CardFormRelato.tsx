"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { schemaformrelato, type SchemaformRelato } from "./schemaformrelato"
import { useAutoSalvarOS } from "@/lib/useAutoSalvarOS"

export function CardFormRelato() {
  const form = useForm<SchemaformRelato>({
    resolver: zodResolver(schemaformrelato),
    defaultValues: { relatoCliente: "", avaliacaoTecnica: "", fornecedorPeca: "", pecasRiscoDano: "", clienteDesistiu: false },
  })
  const status = useAutoSalvarOS("relato", form)
  return (
    <div className="w-full max-w-4xl space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="text-sm font-bold uppercase tracking-wide">Relato e avaliação técnica</h2>
          <p className="mt-1 text-xs text-muted-foreground">Informações fornecidas pelo cliente e observações do técnico.</p>
        </div>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          {status === "saved" && <CheckCircle2 className="size-3 text-emerald-600" />}
          {status === "typing" ? "Salvando..." : status === "saved" ? "Salvo automaticamente" : ""}
        </span>
      </div>
      <Card><CardContent><FieldGroup>
        {([
          ["relatoCliente", "Relato do cliente", "Descreva o problema relatado pelo cliente..."],
          ["avaliacaoTecnica", "Avaliação técnica e observações", "Informe os testes realizados, defeitos identificados e observações..."],
          ["pecasRiscoDano", "Peças com risco de dano (item 3.1 do termo)", "Informe as peças que apresentam risco de dano durante o procedimento..."],
        ] as const).map(([name, label, placeholder]) => (
          <Controller key={name} name={name} control={form.control} render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={name}>{label}</FieldLabel>
              <Textarea {...field} value={field.value ?? ""} id={name} placeholder={placeholder} className="min-h-28 resize-y" aria-invalid={fieldState.invalid} />
              {name === "pecasRiscoDano" && <p className="flex items-center gap-2 text-xs text-muted-foreground"><AlertTriangle className="size-3.5" />Registre os riscos antes de iniciar o serviço.</p>}
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )} />
        ))}
        <Controller name="fornecedorPeca" control={form.control} render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="fornecedorPeca">Fornecedor da peça</FieldLabel>
            <Input {...field} value={field.value ?? ""} id="fornecedorPeca" placeholder="Nome do fornecedor ou distribuidor" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )} />
        <Controller name="clienteDesistiu" control={form.control} render={({ field }) => (
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:bg-muted/40">
            <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
            <div><p className="text-sm font-medium">Cliente optou por não realizar o serviço</p>
              <p className="mt-1 text-xs text-muted-foreground">Marque quando o cliente decidir não prosseguir com o reparo.</p></div>
          </label>
        )} />
      </FieldGroup></CardContent></Card>
    </div>
  )
}
