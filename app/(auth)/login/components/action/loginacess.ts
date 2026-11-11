"use server"

import { signIn } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { AuthError } from "next-auth"
import { Schemaformlogin } from "../schemaformlogin"

export async function CreateUser(data: Schemaformlogin) {
  try {
    await signIn("credentials", {
      email: data.gmail,
      password: data.password,
      redirect: false,
    })

    revalidatePath("/")

    return {
      success: true,
      message: "Login realizado com sucesso!",
    }

  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            error: "E-mail ou senha incorretos.",
          }

        default:
          return {
            success: false,
            error: "Erro na autenticação.",
          }
      }
    }

    console.error("Erro interno:", error)

    return {
      success: false,
      error: "Erro interno no servidor.",
    }
  }
}