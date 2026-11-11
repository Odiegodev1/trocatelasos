"use client"

import { Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { itensEstado } from "./form/schemaformestado"

type Dados = Record<string, unknown>

function ler(secao: string): Dados {
  try {
    const salvo = sessionStorage.getItem(
      `trocatelas:os:${secao}`
    )

    return salvo ? JSON.parse(salvo) : {}
  } catch {
    return {}
  }
}

function esc(v: unknown): string {
  return String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c] ?? c
  )
}

function valor(...itens: unknown[]): unknown {
  return (
    itens.find(
      (v) => v !== undefined && v !== null && v !== ""
    ) ?? ""
  )
}

function data(v: unknown): string {
  if (!v) return "____/____/______"

  const texto = String(v)

  const d = new Date(
    texto.length === 10 ? `${texto}T12:00:00` : texto
  )

  return Number.isNaN(d.getTime())
    ? "____/____/______"
    : d.toLocaleDateString("pt-BR")
}

function moeda(v: unknown): string {
  if (v === undefined || v === null || v === "") {
    return "________"
  }

  const n =
    typeof v === "number"
      ? v
      : Number(
          String(v)
            .replace(/[R$\s]/g, "")
            .replace(/\./g, "")
            .replace(",", ".")
        )

  return Number.isFinite(n)
    ? n.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "________"
}

const grupos = [
  { titulo: "TELA", itens: itensEstado.tela },
  {
    titulo: "ENERGIA / SISTEMA",
    itens: itensEstado.energia,
  },
  { titulo: "GERAL", itens: itensEstado.geral },
] as const

const opcoes = [
  "SIM",
  "NAO",
  "AUSENTE",
  "NAO_AVALIADO",
] as const

export function ImprimirOSMesmoEstilo() {
  function imprimir() {
    const servico = ler("servico")
    const cliente = ler("cliente")
    const aparelho = ler("aparelho")
    const prazo = ler("prazo")
    const estado = ler("estado")
    const relato = ler("relato")
    const garantia = ler("garantia")

    const respostas = (estado.respostas ?? {}) as Record<
      string,
      string
    >

    const linha = (rotulo: string, conteudo: unknown) => `
      <div class="linha">
        <span>${esc(rotulo)}:</span>
        <strong>${esc(
          conteudo === "" || conteudo == null
            ? "____________"
            : conteudo
        )}</strong>
      </div>
    `

    const checkbox = (marcado: boolean) => `
      <span class="caixa ${marcado ? "marcada" : ""}">
        ${marcado ? "✓" : ""}
      </span>
    `

    const checklist = grupos
      .map(
        (g) => `
          <div class="grupo">
            <div class="grupo-topo">
              <div class="colunas">
                <span>SIM</span>
                <span>NÃO</span>
                <span>?</span>
                <span>!</span>
              </div>
              <b>${g.titulo}</b>
            </div>

            ${g.itens
              .map(
                ([id, nome]) => `
                  <div class="item">
                    <div class="colunas">
                      ${opcoes
                        .map((op) =>
                          checkbox(respostas[id] === op)
                        )
                        .join("")}
                    </div>

                    <span>
                      ${esc(nome)}
                      ${
                        id === "outro" && estado.outroDescricao
                          ? `: ${esc(estado.outroDescricao)}`
                          : ""
                      }
                    </span>
                  </div>
                `
              )
              .join("")}
          </div>
        `
      )
      .join("")

    const inicio = valor(
      garantia.comecaEm,
      prazo.entrega
    )

    let vencimento = garantia.venceEm

    if (!vencimento && inicio) {
      const texto = String(inicio)

      const d = new Date(
        texto.length === 10
          ? `${texto}T12:00:00`
          : texto
      )

      if (!Number.isNaN(d.getTime())) {
        d.setDate(
          d.getDate() + Number(garantia.garantiaDias || 0)
        )

        vencimento = d.toISOString()
      }
    }

    const pagamento = {
      pix: "PIX",
      dinheiro: "DINHEIRO",
      cartao_credito: "CARTÃO DE CRÉDITO",
    } as Record<string, string>

    const forma = String(
      valor(
        aparelho.fpagamento,
        servico.formaPagamento,
        servico.forma
      )
    )

    const conteudo = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta
  name="viewport"
  content="width=device-width, initial-scale=1"
>

<title>Ordem de Serviço - Troca Telas</title>

<style>
  * {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
  }

  body {
    background: #e5e7eb;
    color: #111;
    font-family: Arial, Helvetica, sans-serif;
  }

  /* BARRA SUPERIOR */

  .barra {
    position: sticky;
    top: 0;
    z-index: 100;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;

    padding: 14px 24px;

    background: #111827;
    color: white;
  }

  .barra span {
    font-size: 13px;
    font-weight: 600;
  }

  .barra button {
    border: 0;
    border-radius: 7px;

    padding: 11px 18px;

    background: #2563eb;
    color: white;

    font-size: 13px;
    font-weight: 700;

    cursor: pointer;
  }

  /* VISUALIZAÇÃO */

  .area-preview {
    display: flex;
    justify-content: center;

    padding: 20px;
    overflow-x: auto;
  }

  /* FOLHA A4 */

  .folha {
    --escala: 1;

    position: relative;

    flex: none;

    width: 210mm;
    height: 297mm;

    padding: 5mm 6mm;

    background: white;

    box-shadow: 0 8px 35px #0002;

    overflow: hidden;
  }

  /*
   * O conteúdo ocupa a área útil inteira.
   * Quando necessário, o JavaScript reduz
   * proporcionalmente a escala.
   */

  .conteudo-os {
    width: calc(100% / var(--escala));
    height: calc(100% / var(--escala));

    display: flex;
    flex-direction: column;

    transform: scale(var(--escala));
    transform-origin: top left;

    font-size: 8px;
  }

  /* CABEÇALHO */

  .cabecalho {
    flex: 0 0 auto;

    min-height: 17mm;

    display: grid;
    grid-template-columns: 35% 65%;

    align-items: center;

    padding: 2px 4px;
  }

  .logo {
    font-size: 23px;
    font-weight: 1000;
    letter-spacing: -1.4px;
    line-height: 0.85;
  }

  .logo small {
    font-size: 11px;
    letter-spacing: -0.3px;
  }

  .contato {
    text-align: center;
    font-size: 8px;
    line-height: 1.5;
  }

  .contato b {
    font-size: 9px;
  }

  /* QUADROS */

  .quadro {
    flex-shrink: 0;

    border: 1.5px solid #111;
    border-radius: 13px;

    margin-top: 3px;
    padding: 7px 9px;

    min-width: 0;
  }

  /* CLIENTE */

  .titulo-os {
    font-size: 15px;
    font-weight: 900;
    margin-bottom: 6px;
  }

  .titulo-os span {
    font-size: 13px;
  }

  .nome {
    font-size: 9px;
    margin-bottom: 8px;
  }

  .linha {
    min-width: 0;

    font-size: 8px;
    line-height: 1.45;

    overflow-wrap: anywhere;
  }

  .linha span {
    font-weight: 500;
  }

  .linha strong {
    font-weight: 800;
  }

  .tres {
    display: grid;
    grid-template-columns: 32% 26% 42%;
    gap: 4px;
  }

  .tres > div {
    min-width: 0;
  }

  /* APARELHO */

  .equip {
    padding: 7px 8px;
  }

  .equip-dados {
    display: grid;

    grid-template-columns: 43% 27% 30%;

    gap: 5px;

    padding-bottom: 5px;
  }

  .equip-dados > div {
    min-width: 0;
  }

  .equip-dados .linha {
    margin-bottom: 4px;
  }

  .equip-dados .central {
    padding-left: 5px;
  }

  .equip-dados .direita {
    padding-left: 5px;
  }

  .pago {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    gap: 5px;

    margin: 4px 0;

    font-size: 10px;
    font-weight: 800;
  }

  /* CHECKLIST */

  .titulo-check {
    margin: 4px -6px 6px;

    padding: 5px;

    background: #f1f1f1;

    text-align: center;
    font-size: 8px;
    font-weight: 800;
  }

  .flags {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));

    gap: 6px;

    margin-bottom: 8px;
  }

  .flags > div {
    display: flex;
    align-items: center;

    gap: 5px;

    font-size: 7px;
  }

  .caixa {
    display: inline-flex;

    width: 10px;
    height: 10px;

    flex: 0 0 10px;

    align-items: center;
    justify-content: center;

    border: 1px solid #111;

    font-size: 9px;
    font-weight: 900;
    line-height: 1;
  }

  .caixa.marcada {
    background: #111;
    color: white;
  }

  .checkgrid {
    display: grid;

    grid-template-columns: repeat(
      3,
      minmax(0, 1fr)
    );

    gap: 7px;
  }

  .grupo {
    min-width: 0;
  }

  .grupo-topo {
    display: grid;

    grid-template-columns: 76px 1fr;

    align-items: center;

    margin-bottom: 5px;

    text-align: center;
    font-size: 7px;
  }

  .grupo-topo b {
    font-size: 8px;
  }

  .colunas {
    display: grid;

    grid-template-columns: repeat(4, 1fr);

    gap: 3px;

    width: 76px;

    align-items: center;
    justify-items: center;
  }

  .grupo-topo .colunas {
    font-size: 6px;
    font-weight: 800;
  }

  .item {
    display: grid;

    grid-template-columns: 76px 1fr;

    gap: 4px;

    align-items: center;

    min-height: 15px;

    font-size: 6.7px;
  }

  .item > span {
    overflow-wrap: anywhere;
  }

  .legenda {
    margin-top: 7px;

    text-align: center;

    font-size: 6.4px;
    line-height: 1.4;
  }

  /* RELATO */

  .avaliacao {
    min-height: 32mm;

    display: grid;
    grid-template-rows: 1fr 1fr;

    padding: 5px;
  }

  .relato,
  .tecnico {
    display: grid;

    grid-template-columns: 20% 80%;

    position: relative;

    padding: 5px 3px 14px;
  }

  .relato {
    border-bottom: 1px dotted #555;
  }

  .relato b,
  .tecnico b {
    font-size: 9px;
  }

  .texto-livre {
    white-space: pre-wrap;
    overflow-wrap: anywhere;

    font-size: 8px;
    line-height: 1.3;

    padding-right: 5px;
  }

  .desistencia {
    position: absolute;

    right: 3px;
    bottom: 3px;

    display: flex;
    align-items: center;

    gap: 5px;

    font-size: 7px;
  }

  .fornecedor {
    position: absolute;

    right: 3px;
    bottom: 2px;

    font-size: 7px;
  }

  /* TERMOS */

  .termo {
    /*
     * Ocupa todo o espaço vertical restante.
     * Isso evita a área branca no fim da A4.
     */

    flex: 1 1 auto;

    min-height: 0;

    display: flex;
    flex-direction: column;

    padding: 7px 9px;
  }

  .termo-titulo {
    flex: 0 0 auto;

    text-align: center;

    font-size: 11px;
    font-weight: 900;

    margin-bottom: 6px;
  }

  .termos {
    flex: 1 1 auto;

    min-height: 0;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    font-size: 7px;
    font-weight: 700;

    line-height: 1.3;
  }

  .termos p {
    margin: 2px 0;
    overflow-wrap: anywhere;
  }

  .termos .grupo-termo {
    margin-top: 5px;
    font-weight: 900;
  }

  /* ASSINATURAS */

  .assinaturas {
    flex: 0 0 auto;

    margin-top: 8px;

    font-size: 7px;
    font-weight: 800;

    line-height: 1.35;
  }

  .assinaturas p {
    margin: 7px 0;
    overflow-wrap: anywhere;
  }

  .aviso-final {
    flex: 0 0 auto;

    margin-top: 7px;

    text-align: center;

    font-size: 9px;
    font-weight: 900;
  }

  /* IMPRESSÃO */

  @page {
    size: A4 portrait;
    margin: 0;
  }

  @media print {
    html,
    body {
      width: 210mm !important;
      height: 297mm !important;

      margin: 0 !important;
      padding: 0 !important;

      background: white !important;
    }

    .barra {
      display: none !important;
    }

    .area-preview {
      display: block !important;

      width: 210mm !important;
      height: 297mm !important;

      margin: 0 !important;
      padding: 0 !important;

      overflow: hidden !important;
    }

    .folha {
      width: 210mm !important;
      height: 297mm !important;

      margin: 0 !important;
      padding: 5mm 6mm !important;

      box-shadow: none !important;

      overflow: hidden !important;

      break-after: avoid !important;
      page-break-after: avoid !important;
    }

    * {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }

  /* RESPONSIVIDADE DA PRÉ-VISUALIZAÇÃO */

  @media screen and (max-width: 850px) {
    .barra {
      padding: 12px;
    }

    .barra span {
      font-size: 11px;
    }

    .barra button {
      padding: 9px 12px;
      font-size: 11px;
    }

    .area-preview {
      justify-content: flex-start;
      padding: 12px;
    }
  }
</style>
</head>

<body>

<div class="barra">
  <span>Pré-visualização da ordem de serviço</span>

  <button type="button" onclick="imprimirA4()">
    Imprimir / Salvar PDF
  </button>
</div>

<div class="area-preview">

<main class="folha" id="folha">

<div class="conteudo-os" id="conteudo-os">

  <!-- CABEÇALHO -->

  <header class="cabecalho">

    <div class="logo">
      ▣ TROCA<br>
      &nbsp; TELAS<br>
      <small>&nbsp; &nbsp; E MUITO +</small>
    </div>

    <div class="contato">
      <b>
        ASSISTÊNCIA TÉCNICA E ACESSÓRIOS
        PARA CELULARES E INFORMÁTICA
      </b>
      <br>
      Rua 13, esquina com 91, 1287 -
      Jaconé, Saquarema - RJ
      <br>
      (22) 99899-5338 •
      lojatrocatelas@gmail.com
    </div>

  </header>

  <!-- CLIENTE -->

  <section class="quadro dados">

    <div class="titulo-os">
      ${esc(valor(servico.numeroOS, "_____"))}

      <span>
        ${esc(
          valor(
            servico.servico,
            servico.service,
            "SERVIÇO"
          )
        )}
      </span>
    </div>

    <div class="nome">
      NOME:
      <strong>
        ${esc(
          valor(
            cliente.nome,
            servico.cliente,
            "________________________"
          )
        )}
      </strong>
    </div>

    <div class="tres">

      ${linha(
        "TELEFONE",
        valor(
          cliente.telefone,
          cliente.phone,
          servico.phone
        )
      )}

      ${linha(
        "CPF/RG",
        valor(cliente.cpf, servico.cpf)
      )}

      ${linha(
        "ENDEREÇO",
        valor(cliente.endereco, servico.endereco)
      )}

    </div>

  </section>

  <!-- APARELHO E VALORES -->

  <section class="quadro equip">

    <div class="equip-dados">

      <div>
        ${linha(
          "APARELHO",
          valor(
            aparelho.modelo,
            aparelho.aparelho,
            servico.modelo
          )
        )}

        ${linha(
          "IMEI",
          valor(aparelho.imei, servico.imei)
        )}

        ${linha(
          "ENTRADA",
          data(valor(prazo.aentrada, prazo.entrada))
        )}

        ${linha("PREVISÃO", data(prazo.previsao))}

        ${linha("ENTREGA", data(prazo.entrega))}
      </div>

      <div class="central">
        ${linha("RECEPTOR", prazo.receptor)}
        ${linha("TÉCNICO", prazo.tecnico)}
        ${linha("ENTREGADOR", prazo.entregador)}
      </div>

      <div class="direita">

        ${linha(
          "TOTAL R$",
          moeda(
            valor(
              aparelho.total,
              servico.total,
              servico.valor
            )
          )
        )}

        ${linha(
          "SINAL R$",
          moeda(valor(aparelho.sinal, servico.sinal))
        )}

        ${linha(
          "FORMA",
          pagamento[forma] ?? forma
        )}

        <div class="pago">
          ${checkbox(
            Boolean(aparelho.pago ?? servico.pago)
          )}
          PAGO
        </div>

        ${linha(
          "GARANTIA",
          `${garantia.garantiaDias ?? "___"} DIAS`
        )}

        ${linha("A PARTIR DE", data(inicio))}

        ${linha("VENCE EM", data(vencimento))}

      </div>

    </div>

    <!-- ESTADO DO APARELHO -->

    <div class="titulo-check">
      Condições gerais do aparelho durante
      a chegada na assistência técnica:
    </div>

    <div class="flags">

      <div>
        ${checkbox(Boolean(estado.clienteNaoSabe))}
        Cliente não sabe o que ocorreu
      </div>

      <div>
        ${checkbox(Boolean(estado.aparelhoAberto))}
        Aparelho já foi aberto
      </div>

      <div>
        ${checkbox(Boolean(estado.naoTestadoBancada))}
        Nada foi testado em bancada
      </div>

    </div>

    <div class="checkgrid">
      ${checklist}
    </div>

    <div class="legenda">
      ☑ SIM = Existência de Inconformidades
      &nbsp; | &nbsp;
      ☑ NÃO = Não existência de Inconformidades
      &nbsp; | &nbsp;
      ☑ ? = Componente ausente
      &nbsp; | &nbsp;
      ☑ ! = Impossível definir estado devido
      às condições atuais do aparelho
    </div>

  </section>

  <!-- RELATO -->

  <section class="quadro avaliacao">

    <div class="relato">

      <b>Relato do Cliente</b>

      <div class="texto-livre">
        ${esc(relato.relatoCliente)}
      </div>

      <div class="desistencia">
        ${checkbox(Boolean(relato.clienteDesistiu))}
        Optou por não realizar o serviço
      </div>

    </div>

    <div class="tecnico">

      <b>
        Avaliação Técnica<br>
        e Observações
      </b>

      <div class="texto-livre">
        ${esc(relato.avaliacaoTecnica)}
      </div>

      <div class="fornecedor">
        Fornecedor:
        ${esc(
          relato.fornecedorPeca || "________________"
        )}
      </div>

    </div>

  </section>

  <!-- TERMOS -->

  <section class="quadro termo">

    <div class="termo-titulo">
      O CONSUMIDOR DECLARA E RECONHECE:
    </div>

    <div class="termos">

      <p class="grupo-termo">
        1. ESTAR CIENTE DAS RESPONSABILIDADES
        DA ASSISTÊNCIA TÉCNICA:
      </p>

      <p>
        1.1 Executar apenas o serviço previamente acordado;
      </p>

      <p>
        1.2 Realizar checagem para identificar e registrar
        o estado do aparelho no momento de entrada
        na assistência;
      </p>

      <p>
        1.3 Informar o cliente sobre o andamento do serviço,
        atualizações no orçamento etc;
      </p>

      <p class="grupo-termo">
        2. ESTAR CIENTE DAS RESPONSABILIDADES DO CLIENTE:
      </p>

      <p>
        2.1 Conferir o estado do aparelho e o resultado
        do serviço realizado no momento da retirada
        do aparelho. Com a finalidade de atestar
        o estado do aparelho e se o serviço realizado
        está conforme com o serviço acordado;
      </p>

      <p>
        2.2 Retirar o aparelho em até 3 meses (90 dias)
        após a realização do serviço. O aparelho
        abandonado será retirado após pagamento de
        multa de 2% e juros de 1% ao mês sobre o
        valor do serviço. A assistência poderá retirar
        materiais e peças aplicadas, de forma a
        reparar o prejuízo;
      </p>

      <p>
        2.3 Realizar backup dos dados, pois a assistência
        não se responsabiliza pelos dados e/ou sua perda;
      </p>

      <p>
        2.4 Retirar do aparelho todos os acessórios não
        solicitados pelo técnico. Ex.: Capas, chips,
        cartões de memória etc;
      </p>

      <p>
        2.5 O aparelho será entregue apenas ao cliente
        titular, o legítimo dono ou a pessoa com a
        posse desse documento;
      </p>

      <p>
        2.6 Fornecer dados pessoais e de contato
        verdadeiros, a fim de facilitar a
        identificação e comunicação;
      </p>

      <p class="grupo-termo">
        3. ESTAR CIENTE DAS CONDIÇÕES DE REALIZAÇÃO
        DO SERVIÇO E CANCELAMENTO:
      </p>

      <p>
        3.1 Estou ciente que para realização do serviço
        nesse aparelho há risco de danificar e/ou
        destruir completamente as seguintes peças:
        <u>
          ${esc(
            relato.pecasRiscoDano ||
              "________________________________________"
          )}
        </u>;
      </p>

      <p>
        3.2 Estou ciente que a data de entrega do serviço
        pode ser alterada por imprevistos. A alteração
        dessa data será avisada previamente pela
        assistência ao titular dessa ordem de serviço.
      </p>

      <p>
        3.3 Estou ciente que em caso de cancelamento
        será cobrada integralmente a mão de obra
        e os materiais gastos. Caso a peça já esteja
        aplicada no aparelho, não será possível
        cancelar o serviço.
      </p>

      <p>
        3.4 Estou ciente que o serviço será cancelado
        sem custos caso não possa ser executado,
        nesse caso a assistência informará ao
        cliente sobre a devolução do aparelho
        e o estorno do sinal.
      </p>

      <p class="grupo-termo">
        4. ESTAR CIENTE DAS CONDIÇÕES DE GARANTIA
        DO SERVIÇO PRESTADO:
      </p>

      <p>
        4.1 Os prazos de garantia são determinados
        a partir da data da realização do serviço;
      </p>

      <p>
        4.2 A garantia da peça cobre o mau funcionamento
        da peça por defeito de fabricação e será
        anulada caso sejam retirados ou rompidos
        os selos de garantia do serviço e/ou caso
        haja quaisquer avarias na peça aplicada
        (ex.: arranhões e trincas na peça trocada,
        manchas e marcas de uso, bateria perfurada,
        imersão em água, rompimento dos contatos
        dos conectores etc). Seu prazo é
        determinado pelo fornecedor.
      </p>

      <p>
        4.3 A garantia do serviço (aplicação,
        instalação etc) cobre os procedimentos
        realizados no serviço para instalar
        a peça no aparelho, será anulada em
        caso de rompimento do selo de garantia.
        Seu prazo é determinado pela
        assistência técnica.
      </p>

    </div>

    <!-- ASSINATURAS -->

    <div class="assinaturas">

      <p>
        EU, ________________________________________________________________,
        DECLARO QUE LI, FUI INFORMADO SOBRE ESSAS CONDIÇÕES
        E ACEITO OS TERMOS DESTA ORDEM DE SERVIÇO.
      </p>

      <p>
        EU, ________________________________________________________________,
        DECLARO QUE RETIREI O APARELHO DA ASSISTÊNCIA
        TÉCNICA SEM A ORDEM DE SERVIÇO, PORTANDO
        DOCUMENTAÇÃO VÁLIDA EM CONCORDÂNCIA COM
        OS DADOS DA ORDEM DE SERVIÇO.
      </p>

    </div>

    <div class="aviso-final">
      É NECESSÁRIA A APRESENTAÇÃO DESTE DOCUMENTO
      PARA RETIRADA DO APARELHO
    </div>

  </section>

</div>
</main>
</div>

<script>
  /*
   * AJUSTE AUTOMÁTICO A4
   *
   * 1. Mede a altura real do conteúdo.
   * 2. Reduz a escala quando necessário.
   * 3. Mantém o documento ocupando toda a altura útil.
   * 4. Recalcula antes da impressão.
   */

  function ajustarA4() {
    const folha = document.getElementById("folha");
    const conteudo = document.getElementById("conteudo-os");

    if (!folha || !conteudo) return;

    folha.style.setProperty("--escala", "1");

    const estilo = getComputedStyle(folha);

    const alturaUtil =
      folha.clientHeight -
      parseFloat(estilo.paddingTop) -
      parseFloat(estilo.paddingBottom);

    /*
     * Mede o tamanho mínimo necessário.
     * scrollHeight considera o conteúdo completo.
     */

    const alturaConteudo = conteudo.scrollHeight;

    let escala = 1;

    if (alturaConteudo > alturaUtil) {
      escala = alturaUtil / alturaConteudo;
    }

    /*
     * Margem de segurança contra arredondamentos
     * do navegador e da impressora.
     */

    escala = Math.min(1, escala * 0.995);

    folha.style.setProperty(
      "--escala",
      String(escala)
    );
  }

  function imprimirA4() {
    ajustarA4();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.print();
      });
    });
  }

  window.addEventListener("load", ajustarA4);

  window.addEventListener("resize", ajustarA4);

  window.addEventListener("beforeprint", ajustarA4);

  window.addEventListener("afterprint", ajustarA4);

  if (document.fonts) {
    document.fonts.ready.then(ajustarA4);
  }

  setTimeout(ajustarA4, 200);
</script>

</body>
</html>
`

    const janela = window.open("", "_blank")

    if (!janela) {
      alert(
        "Permita pop-ups para visualizar a impressão."
      )
      return
    }

    janela.document.open()
    janela.document.write(conteudo)
    janela.document.close()
  }

  return (
    <Button type="button" onClick={imprimir}>
      <Printer className="mr-2 size-4" />
      Imprimir OS
    </Button>
  )
}