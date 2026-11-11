import { Suspense } from "react";
import { HeaderComponent } from "@/components/HeaderComponent";
import { TabelaOs } from "@/components/tabelaos";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Getos } from "../actions/getos";


async function ConteudoOrdens() {
  await connection();

  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const resultado = await Getos();

  return (
    <main className="w-full space-y-5 max-w-7xl mx-auto">
      <div>
        <span className="text-muted-foreground text-xs">
          TROCA TELAS · JACONÉ
        </span>

        <h1 className="text-2xl font-extrabold">
          Ordens de serviço
        </h1>
      </div>

      {resultado.error ? (
        <p className="text-sm text-destructive">
          {resultado.error}
        </p>
      ) : (
        <TabelaOs tabelaos={resultado.data} />
      )}
    </main>
  );
}

function CarregandoOrdens() {
  return (
    <main className="w-full max-w-7xl mx-auto space-y-5 animate-pulse">
      <div className="space-y-2">
        <div className="h-3 w-36 rounded bg-muted" />
        <div className="h-8 w-60 rounded bg-muted" />
      </div>

      <div className="h-10 w-full rounded-lg bg-muted" />

      <div className="h-80 w-full rounded-xl bg-muted" />
    </main>
  );
}

export default function TrocatelasosPage() {
  return (
    <div className="flex flex-col min-h-screen w-full gap-7">
      <HeaderComponent />

      <Suspense fallback={<CarregandoOrdens />}>
        <ConteudoOrdens />
      </Suspense>
    </div>
  );
}