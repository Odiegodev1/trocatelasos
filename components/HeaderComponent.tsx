"use client";

import { FileText, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function HeaderComponent() {
    const pathname = usePathname();

    return(
         <header className="flex w-full items-center h-20 border-b bg-zinc-900/30">
             <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
                <div className="flex items-center gap-8"> 
                    <div className="">
                    <h1 className="text-2xl font-extrabold tracking-wider" >Troca Telas</h1>
                    <p className="text-sm text-muted-foreground">ORDENS DE SERVIÇO</p>
                </div>

                <div className="space-x-4 text-muted-foreground">
                    <Link 
                    className={`text-sm p-2 rounded-md font-medium hover:bg-accent ${pathname === "/" ? "text-primary border-b-4 border-purple-500 " : ""}`}

                    href="/" > Ordens</Link>
                    <Link 
                    className={`text-sm p-2 rounded-md font-medium hover:bg-accent ${pathname === "/configuracoes" ? " border-b-4 border-purple-500  text-primary" : ""}`}
                    href="/configuracoes"
                    >Configurações</Link>
                </div>
                </div>

                <div className="flex items-center gap-7">
                    <div className="size-8 flex items-center justify-center rounded-md cursor-pointer hover:bg-accent">
                        <Sun className="size-5"  />
                    </div>

                    <Button variant="outline" size="sm" className="cursor-pointer">Nova os <FileText /></Button>
                </div>
             </div>
         </header>
    )
}