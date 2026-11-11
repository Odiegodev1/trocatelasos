"use client"

import { Check, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

interface StatusItem {
  id: number
  title: string
}

interface StatusServicosProps {
  selectedId: number
  onSelect: (id: number) => void
}

const status: StatusItem[] = [
  {
    id: 1,
    title: "Recebido",
  },
  {
    id: 2,
    title: "Em análise",
  },
  {
    id: 3,
    title: "Aguardando aprovação",
  },
  {
    id: 4,
    title: "Aguardando peça",
  },
  {
    id: 5,
    title: "Em reparo",
  },
  {
    id: 6,
    title: "Pronto",
  },
  {
    id: 7,
    title: "Entregue",
  },
]

export function StatusServicos({
  selectedId,
  onSelect,
}: StatusServicosProps) {
  return (
    <div className="w-full overflow-x-auto pb-3">
      <div className="flex min-w-max items-start">
        {status.map((item, index) => {
          const concluido = item.id < selectedId
          const ativo = item.id === selectedId

          return (
            <div
              key={item.id}
              className="flex items-start"
            >
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                className="group flex min-w-[105px] flex-col items-center gap-2 outline-none"
              >
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all",
                    concluido &&
                      "border-primary bg-primary text-primary-foreground",
                    ativo &&
                      "border-primary bg-primary/10 text-primary ring-4 ring-primary/10",
                    !concluido &&
                      !ativo &&
                      "border-muted-foreground/30 bg-background text-muted-foreground",
                    "group-hover:border-primary"
                  )}
                >
                  {concluido ? (
                    <Check size={17} strokeWidth={2.5} />
                  ) : (
                    <Circle
                      size={ativo ? 13 : 15}
                      fill={ativo ? "currentColor" : "none"}
                    />
                  )}
                </div>

                <span
                  className={cn(
                    "max-w-[105px] text-center text-xs font-medium transition-colors",
                    ativo && "font-bold text-primary",
                    concluido && "text-foreground",
                    !ativo &&
                      !concluido &&
                      "text-muted-foreground"
                  )}
                >
                  {item.title}
                </span>
              </button>

              {index !== status.length - 1 && (
                <div
                  className={cn(
                    "mt-[17px] h-[2px] w-8 transition-colors sm:w-12",
                    item.id < selectedId
                      ? "bg-primary"
                      : "bg-border"
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}