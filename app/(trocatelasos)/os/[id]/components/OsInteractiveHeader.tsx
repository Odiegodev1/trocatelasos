"use client"
import { useState } from "react"
import { ArrowLeftCircle, MessageCircleMore, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BadgeStatus } from "./Badgestatus"
import { StatusServicos } from "./StatusServicos"

interface OsInteractiveHeaderProps {
  slug: string
  initialStatusId: number
}

export function OsInteractiveHeader({ slug, initialStatusId }: OsInteractiveHeaderProps) {
  // Gerencia o estado interativo do status atualizado pelo clique
  const [currentStatusId, setCurrentStatusId] = useState<number>(initialStatusId)

  return (
    <div className="space-y-6 w-full">
      {/* Bloco superior com as informações e botões */}
      <div className="flex items-center max-w-4xl justify-between w-full">
        <div className="flex items-center gap-4">
          <div className="flex gap-2 text-muted-foreground items-center cursor-pointer hover:text-foreground transition-colors">
            <ArrowLeftCircle size={20} />
            <span className="font-medium">Ordens</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Ordem de serviço
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight">#{slug}</h1>
          </div>

          {/* O Badge agora atualiza dinamicamente em tempo real ao clicar embaixo */}
          <BadgeStatus statusId={currentStatusId} />
        </div>

        <div className="space-x-4 flex items-center">
          <Button variant="outline" size="sm" className="gap-2">
            <Printer size={16} /> Imprimir
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <MessageCircleMore size={16} /> WhatsApp
          </Button>
        </div>
      </div>

      {/* Seletor de Status (Stepper) posicionado logo abaixo */}
      <div className="pt-4 border-t border-border">
        <span className="text-xs font-medium text-muted-foreground px-5 block mb-2">
          Atualizar estágio do reparo:
        </span>
        <StatusServicos selectedId={currentStatusId} onSelect={setCurrentStatusId} />
      </div>
    </div>
  )
}
