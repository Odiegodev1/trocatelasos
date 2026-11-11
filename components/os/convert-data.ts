export function converterData(
    valor: string | null | undefined
  ): Date | undefined {
    if (!valor) return undefined
  
    const data = new Date(valor)
  
    return Number.isNaN(data.getTime())
      ? undefined
      : data
  }