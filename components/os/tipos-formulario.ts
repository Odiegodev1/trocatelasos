export type DadosOSFormulario = {
    id: string
    numero: number
    servico: string
    aparelho: string
    imei: string | null
    total: number
    sinal: number
    formaPagamento: string | null
    pago: boolean
  
    dataEntrada: string
    dataPrevisao: string | null
    dataEntrega: string | null
  
    receptor: string | null
    tecnico: string | null
    entregador: string | null
  
    clienteNaoSabe: boolean
    jaFoiAberto: boolean
    naoTestado: boolean
    outroDescricao: string | null
  
    relatoCliente: string | null
    avaliacaoTecnica: string | null
    fornecedor: string | null
    pecasRisco: string | null
    optouNaoRealizar: boolean
  
    garantiaDias: number
    garantiaInicio: string | null
    garantiaVenceEm: string | null
    garantiaCobertura: string | null
    mensagemCliente: string | null
  
    cliente: {
      nome: string
      telefone?: string | null
      cpf?: string | null
      endereco?: string | null
    }
  
    checklist: Array<{
      item: string
      resposta: string
    }>
  }