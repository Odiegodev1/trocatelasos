"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { schemaaparelho, type Schemaaparelho } from "./schemaformaparelho"
import { useAutoSalvarOS } from "@/lib/useAutoSalvarOS"

export function CardFormAparelho() {
  const form = useForm<Schemaaparelho>({
    resolver: zodResolver(schemaaparelho),
    defaultValues: { aparelho: "", fpagamento: "", imei: "", pago: false, sinal: "", total: "" },
  })
  const status = useAutoSalvarOS("aparelho", form)
  const campos = [
    { name: "aparelho", label: "APARELHO", placeholder: "iPhone 17 Pro Max" },
    { name: "imei", label: "IMEI / SÉRIE", placeholder: "Número de série" },
    { name: "total", label: "TOTAL (R$)", placeholder: "480" },
    { name: "sinal", label: "SINAL (R$)", placeholder: "150" },
  ] as const
  return (
    <div className="w-full max-w-4xl space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-bold">APARELHO E VALORES</h2>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          {status === "saved" && <CheckCircle2 className="size-3 text-green-600" />}
          {status === "typing" ? "Salvando..." : status === "saved" ? "Salvo automaticamente" : ""}
        </span>
      </div>
      <Card><CardContent><FieldGroup>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {campos.map(({ name, label, placeholder }) => (
            <Controller key={name} name={name} control={form.control} render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={name}>{label}</FieldLabel>
                <Input {...field} value={field.value ?? ""} id={name} placeholder={placeholder} autoComplete="off" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )} />
          ))}
        </div>
        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2">
          <Controller name="fpagamento" control={form.control} render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>FORMA DE PAGAMENTO</FieldLabel>
              <Select name={field.name} value={field.value || undefined} onValueChange={field.onChange}>
                <SelectTrigger aria-invalid={fieldState.invalid}><SelectValue placeholder="Selecione o pagamento" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">Pix</SelectItem>
                  <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="cartao_credito">Cartão de crédito</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )} />
          <Controller name="pago" control={form.control} render={({ field }) => (
            <label className="flex h-10 items-center gap-3 rounded-md border px-3 text-sm">
              <Switch name={field.name} checked={field.value} onCheckedChange={field.onChange} />
              Pago
            </label>
          )} />
        </div>
      </FieldGroup></CardContent></Card>
    </div>
  )
}
