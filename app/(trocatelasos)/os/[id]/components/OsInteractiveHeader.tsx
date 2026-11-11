
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

export function OsInteractiveHeader({
  slug,
  initialStatusId,
}: OsInteractiveHeaderProps) {
  const [currentStatusId, setCurrentStatusId] =
    useState<number>(initialStatusId)

  return (
    <div className="w-full space-y-6">
      <div className="flex w-full max-w-4xl items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex cursor-pointer items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeftCircle size={20} />
            <span className="font-medium">Ordens</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Ordem de serviço
            </span>

            <h1 className="text-3xl font-extrabold tracking-tight">
              #{slug}
            </h1>
          </div>

          <BadgeStatus statusId={currentStatusId} />
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" className="gap-2">
            <Printer size={16} />
            Imprimir
          </Button>

          <Button variant="outline" size="sm" className="gap-2">
            <MessageCircleMore size={16} />
            WhatsApp
          </Button>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <span className="mb-2 block px-5 text-xs font-medium text-muted-foreground">
          Atualizar estágio do reparo:
        </span>

        <StatusServicos
          selectedId={currentStatusId}
          onSelect={setCurrentStatusId}
        />
      </div>
    </div>
  )
}
