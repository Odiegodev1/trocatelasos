"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { toast } from "sonner"

import {
  Loader2,
  Save,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import { montarDadosOS } from "@/lib/os/montar-dados-os"
import { criarOrdemServico } from "@/app/actions/ordem-servico/criar-ordem-servico"



export function SalvarOrdemServico() {
  const router = useRouter()

  const [salvando, setSalvando] = useState(false)

  async function salvar() {
    if (salvando) return

    setSalvando(true)

    try {
      // Ler dados dos formulários

      const dados = montarDadosOS()

      // Enviar para o servidor

      const resultado = await criarOrdemServico(dados)

      if (!resultado.success) {
        toast.error(resultado.error)
        return
      }

      toast.success(
        `OS #${resultado.data.numero} criada com sucesso!`
      )

      // Limpar somente após confirmar o salvamento

      const secoes = [
        "servico",
        "cliente",
        "aparelho",
        "prazo",
        "estado",
        "relato",
        "garantia",
      ]

      for (const secao of secoes) {
        sessionStorage.removeItem(
          `trocatelas:os:${secao}`
        )
      }

      // Abrir OS criada

      router.push(
        `/os/${resultado.data.id}`
      )

      router.refresh()
    } catch (error) {
      console.error(error)

      toast.error(
        "Erro inesperado ao salvar a ordem de serviço."
      )
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Button
      type="button"
      onClick={salvar}
      disabled={salvando}
      className="gap-2"
    >
      {salvando ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Salvando...
        </>
      ) : (
        <>
          <Save className="size-4" />
          Salvar ordem de serviço
        </>
      )}
    </Button>
  )
}