"use client"




import { SalvarOrdemServico } from "@/components/os/SalvarOrdemServico"
import { ImprimirOSMesmoEstilo } from "./[id]/components/ImprimirOS"
import { CardFormServico } from "./[id]/components/form/CardFormServico"
import { CardFormAparelho } from "./[id]/components/form/CardFormAparelho"
import { CardFormPrazo } from "./[id]/components/form/CardFormPrazo"
import { CardFormEstadoAparelho } from "./[id]/components/form/CardFormEstadoAparelho"
import { CardFormRelato } from "./[id]/components/form/CardFormRelato"
import { CardFormGarantia } from "./[id]/components/form/CardFormGarantia"


export default function NovaOS() {
  return (
    <main className="mx-auto max-w-5xl space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Nova ordem de serviço
          </h1>

          <p className="text-sm text-muted-foreground">
            Preencha as informações do atendimento.
          </p>
        </div>
        <SalvarOrdemServico />
        <ImprimirOSMesmoEstilo />
      </div>
    

      <CardFormServico />
      <CardFormAparelho />

      <CardFormPrazo />

      <CardFormEstadoAparelho />

      <CardFormRelato />

      <CardFormGarantia />

      <div className="flex justify-end border-t pt-6">
        <ImprimirOSMesmoEstilo />
      </div>
    </main>
  )
}