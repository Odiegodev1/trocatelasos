"use client"

import { useEffect, useState } from "react"
import type { UseFormReturn, FieldValues } from "react-hook-form"
import { obterDadosOS, salvarDadosOS, type SecaoOS } from "./os-temporaria"

export type StatusOS = "idle" | "typing" | "saved"

/** Restaura os dados ao montar e salva todas as alterações com debounce. */
export function useAutoSalvarOS<T extends FieldValues>(secao: SecaoOS, form: UseFormReturn<T>) {
  const [status, setStatus] = useState<StatusOS>("idle")
  useEffect(() => {
    const anterior = obterDadosOS<Partial<T>>(secao)
    if (anterior) {
      // Campos Date são serializados como strings pelo sessionStorage.
      const dados = { ...anterior } as Record<string, unknown>
      for (const campo of ["aentrada", "previsao", "entrega", "comecaEm", "venceEm"]) {
        if (typeof dados[campo] === "string") {
          const data = new Date(dados[campo])
          if (!Number.isNaN(data.getTime())) dados[campo] = data
        }
      }
      form.reset({ ...form.getValues(), ...dados } as T)
    }
    // Salva imediatamente também os valores iniciais.
    salvarDadosOS(secao, form.getValues())
    const subscription = form.watch(() => {
      setStatus("typing")
    })
    return () => subscription.unsubscribe()
  }, [secao, form])

  useEffect(() => {
    if (status !== "typing") return
    const timer = window.setTimeout(() => {
      salvarDadosOS(secao, form.getValues())
      setStatus("saved")
    }, 500)
    return () => window.clearTimeout(timer)
  }, [status, secao, form])

  // Persistência síncrona a cada alteração, evitando perda ao clicar em imprimir antes do debounce.
  useEffect(() => {
    const subscription = form.watch(() => salvarDadosOS(secao, form.getValues()))
    return () => subscription.unsubscribe()
  }, [form, secao])
  return status
}
