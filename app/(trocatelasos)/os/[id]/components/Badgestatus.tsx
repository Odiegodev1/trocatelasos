"use client"
import { Badge } from "@/components/ui/badge";

// Definição dos mesmos status do seu sistema
const STATUS_MAP: Record<number, string> = {
  1: "Recebido",
  2: "Em análise",
  3: "Aguardando Aprovação",
  4: "Aguardando peça",
  5: "Em reparo",
  6: "Pronto para retirada",
  7: "Entregue",
  8: "Cancelada"
};

interface BadgeStatusProps {
  statusId: number;
}

export function BadgeStatus({ statusId }: BadgeStatusProps) {
  const title = STATUS_MAP[statusId] || "Desconhecido";
  const isCancelled = statusId === 8;

  return (
    <Badge
      variant={isCancelled ? "destructive" : "default"}
      className={`whitespace-nowrap h-7 font-medium border select-none transition-all ${
        isCancelled
          ? "bg-destructive text-destructive-foreground border-destructive"
          : "bg-purple-600 text-white border-purple-600 dark:bg-purple-700 dark:border-purple-600"
      }`}
    >
      <span className="mr-1 opacity-60 font-mono text-xs">{statusId}</span>
      {title}
    </Badge>
  );
}
