"use client"


import { ImprimirOSMesmoEstilo } from "./ImprimirOS"

import { CardFormServico } from "./form/CardFormServico"
import { CardFormAparelho } from "./form/CardFormAparelho"
import { CardFormPrazo } from "./form/CardFormPrazo"
import { CardFormEstadoAparelho } from "./form/CardFormEstadoAparelho"
import { CardFormRelato } from "./form/CardFormRelato"
import { CardFormGarantia } from "./form/CardFormGarantia"
import { DadosOSFormulario } from "@/components/os/tipos-formulario"
import { CardFormServicoOs } from "@/components/form/CardFormServico";
import { CardFormAparelhoOs } from "@/components/form/CardFormAparelho";
import { CardFormPrazoOs } from "@/components/form/CardFormPrazo";
import { CardFormEstadoAparelhoOs } from "@/components/form/CardFormEstadoAparelho";

interface DetalhesOrdemServicoProps {
  dadosOS?: DadosOSFormulario
}

export function DetalhesOrdemServico({ dadosOS }: DetalhesOrdemServicoProps) {
  return (
    <main className="mx-auto max-w-5xl space-y-8 p-4 md:p-8">

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-medium text-muted-foreground">
            TROCA TELAS · ORDEM DE SERVIÇO
          </span>

          <h1 className="text-2xl font-bold">
           {dadosOS?.numero ? `OS #${dadosOS.numero}` : "Ordem de serviço"}
          </h1>

          <p className="text-sm text-muted-foreground">
           
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full border px-3 py-1 text-xs font-medium">
           
          </span>

          <ImprimirOSMesmoEstilo />
        </div>
      </div>

      <CardFormServicoOs os={dadosOS }/>

      <CardFormAparelhoOs os={dadosOS} />

      <CardFormPrazoOs os={dadosOS}  />

      <CardFormEstadoAparelhoOs os={dadosOS} />

      <CardFormRelato />

      <CardFormGarantia/>

      <div className="flex justify-end border-t pt-6">
        <ImprimirOSMesmoEstilo />
      </div>

    </main>
  )
}