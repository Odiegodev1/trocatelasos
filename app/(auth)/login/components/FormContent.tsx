"use client"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { schemaformlogin, Schemaformlogin } from "./schemaformlogin";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { CreateUser } from "./action/loginacess";
import { redirect } from "next/navigation";

export function FormContent(){
    const form = useForm<Schemaformlogin>({
        resolver: zodResolver(schemaformlogin),
        defaultValues:{
            gmail: "",
            password: "",
        }
    })
    async function onSubmit(data:Schemaformlogin) {
       const res = await CreateUser(data)
       if(res.success){
        redirect("/")
       }
        
    }
    return(
        <div className="mt-4">
             <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <Controller
              name="gmail"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Gmail
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="exampla@gmail.com"
                    autoComplete="off"
                    type="email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

<Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Senha
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="********"
                    type="password"
                    
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
               <Button type="submit" variant="outline" className="cursor-pointer">Entrar</Button>
          </FieldGroup>
       
        </form>
        </div>
    )
}