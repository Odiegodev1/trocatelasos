import { DotPattern } from "@/components/ui/dot-pattern";
import { GridPattern } from "@/components/ui/grid-pattern";
import { cn } from "cn";
import { FormContent } from "./components/FormContent";

export default function LoginPage(){
    return(
        <div className="flex flex-1 min-h-screen w-full ">
  <div className="bg-background relative flex min-h-screen w-1/2 flex-col p-10 overflow-hidden ">
  <GridPattern
        squares={[
     
        ]}
        />
        <div className="flex flex-col  justify-between min-h-full">
            <div>
                <h1 className="text-4xl font-extrabold">TROCA TELAS</h1>
                <p className="text-muted-foreground">ORDENS DE SERVIÇO</p>
            </div>

            <div className="space-y-4">
                <h1 className="max-w-[1250] text-6xl font-extrabold w-full">Cada aparelho na bancada, com a ficha completa.</h1>
           <div className="flex items-center gap-5"><span className="size-4 rounded-sm bg-cyan-500"/>Ordens numeradas em sequência, com checklist de entrada.</div>
           <div className="flex items-center gap-5"><span className="size-4 rounded-sm bg-cyan-500"/>Impressão A4 no formato da OS e envio em PDF.</div>
           <div className="flex items-center gap-5"><span className="size-4 rounded-sm bg-cyan-500"/>Link para o cliente acompanhar e ver a garantia.</div>
           
            </div>

            <div>
                <h1 className="text-muted-foreground font-semibold">JACONÉ . SAQUAREMA</h1>
            </div>
        </div>
    </div>

    <div className="flex items-center w-1/2  justify-center">
        <div>
            <div className="flex flex-col gap-1.5">
                <h1 className="text-muted-foreground">ACESSO DA EQUIPE</h1>
                <h1 className="text-4xl font-semibold">Entrar no sistema</h1>
                <h1 className="text-sm  text-muted-foreground">Use o e-mail e senha cadastrados pela loja.</h1>
            </div>

            <FormContent />
        </div>
    </div>
        </div>
    )
}