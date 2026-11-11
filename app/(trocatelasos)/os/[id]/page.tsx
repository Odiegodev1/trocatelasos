import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";

import { auth } from "@/lib/auth";

import { buscarOrdemServico } from "@/app/actions/ordem-servico/buscar-ordem-servico";
import { DetalhesOrdemServico } from "./components/DetalhesOrdemServico";


interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function ConteudoOS({
  params,
}: PageProps) {
  // Permite renderização dinâmica.
  await connection();

  // Agora o acesso aos params acontece dentro do Suspense.
  const { id } = await params;

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const numero = Number(id);

  if (!Number.isSafeInteger(numero) || numero <= 0) {
    notFound();
  }

  const resultado = await buscarOrdemServico(numero);

  if (!resultado.success || !resultado.data) {
    notFound();
  }

  return (
    <DetalhesOrdemServico dadosOS={resultado.data as any}
      
    />
  );
}

function CarregandoOS() {
  return (
    <main className="mx-auto max-w-5xl space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <div className="h-3 w-32 animate-pulse rounded bg-muted" />

          <div className="h-8 w-60 animate-pulse rounded bg-muted" />

          <div className="h-4 w-48 animate-pulse rounded bg-muted" />
        </div>

        <div className="h-10 w-32 animate-pulse rounded-lg bg-muted" />
      </div>

      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-48 w-full animate-pulse rounded-xl border bg-muted/40"
        />
      ))}
    </main>
  );
}

export default function PaginaOrdemServico({
  params,
}: PageProps) {
  return (
    <Suspense fallback={<CarregandoOS />}>
      <ConteudoOS params={params} />
    </Suspense>
  );
}