"use client"

export type SecaoOS = "servico" | "aparelho" | "prazo" | "estado" | "relato" | "garantia"
const prefixo = "trocatelas:os:"

export function salvarDadosOS<T>(secao: SecaoOS, dados: T) {
  if (typeof window === "undefined") return
  sessionStorage.setItem(prefixo + secao, JSON.stringify(dados))
}

export function obterDadosOS<T>(secao: SecaoOS): T | null {
  if (typeof window === "undefined") return null
  try {
    const valor = sessionStorage.getItem(prefixo + secao)
    return valor ? (JSON.parse(valor) as T) : null
  } catch { return null }
}
