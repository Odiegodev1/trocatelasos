"use client";

import { useMemo, useState } from "react";
import {
  tableFeatures,
  useTable,
  flexRender,
  globalFilteringFeature,
  columnFilteringFeature,
  createFilteredRowModel,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Printer, Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useRouter } from "next/navigation";

export interface OrdemServicoTabela {
  id: string;
  numero: number;
  aparelho: string;
  servico: string;
  cliente: string;
  status: string;
  dataEntrada: string;
  dataPrevisao: string | null;
  garantiaVenceEm: string | null;
  total: number;
  sinal: number;
  pago: boolean;
}

interface TabelaOsProps {
  tabelaos: OrdemServicoTabela[];
}

interface Person {
  id: string;
  os: number;
  cliente: string;
  aparelho: string;
  situacao: string;
  datas: string;
  garantia: string;
  valor: string;
  tipoValor: string;
  quitado: boolean;
}

const formatarMoeda = (valor: number) => {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const formatarData = (data: string | null) => {
  if (!data) return null;

  const date = new Date(data);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });
};

const formatarStatus = (status: string) => {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/^./, (letra) => letra.toUpperCase());
};

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
});

export function TabelaOs({ tabelaos }: TabelaOsProps) {
  const router = useRouter();

  const [globalFilter, setGlobalFilter] = useState("");

  // Dados reais recebidos do PostgreSQL.
  const data = useMemo<Person[]>(() => {
    return tabelaos.map((item) => {
      const restante = Math.max(0, item.total - item.sinal);

      const entrada = formatarData(item.dataEntrada);
      const previsao = formatarData(item.dataPrevisao);
      const garantia = formatarData(item.garantiaVenceEm);

      return {
        id: item.id,
        os: item.numero,
        cliente: item.cliente,
        aparelho: `${item.aparelho} • ${item.servico}`,
        situacao: formatarStatus(item.status),
        datas: [
          entrada ? `Entrada: ${entrada}` : "Entrada não informada",
          previsao ? `Previsão: ${previsao}` : null,
        ]
          .filter(Boolean)
          .join(" • "),
        garantia: garantia
          ? `Garantia até ${garantia}`
          : "Garantia não iniciada",
        valor: formatarMoeda(item.total),
        tipoValor: item.pago
          ? "Quitado"
          : restante > 0
            ? `Falta ${formatarMoeda(restante)}`
            : "Pagamento pendente",
        quitado: item.pago,
      };
    });
  }, [tabelaos]);

  function handleRedirect(numero: number) {
    router.push(`/os/${numero}`);
  }

  function handlePrint(osData: Person) {
    // Abre uma janela isolada para não alterar a página atual.
    const printWindow = window.open("", "_blank", "width=850,height=700");

    if (!printWindow) {
      window.alert(
        "Não foi possível abrir a impressão. Verifique se o navegador está bloqueando pop-ups."
      );
      return;
    }

    // Evita interpretar dados de clientes como HTML.
    const escaparHtml = (valor: string) =>
      valor.replace(/[&<>"']/g, (caractere) => {
        const entidades: Record<string, string> = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        };

        return entidades[caractere] ?? caractere;
      });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />
          <title>Ordem de Serviço #${osData.os}</title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 40px;
              font-family: Arial, Helvetica, sans-serif;
              color: #111;
              background: #fff;
            }

            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 2px solid #111;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }

            .header h1 {
              font-size: 22px;
              margin: 0 0 8px;
            }

            .header p {
              margin: 0;
              font-size: 13px;
              color: #555;
            }

            .numero {
              text-align: right;
            }

            .numero strong {
              display: block;
              font-size: 24px;
            }

            .numero span {
              font-size: 12px;
              color: #666;
            }

            .section {
              margin-bottom: 25px;
            }

            .section h2 {
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #666;
              margin-bottom: 12px;
            }

            .field {
              padding: 12px 0;
              border-bottom: 1px solid #eee;
              font-size: 14px;
            }

            .field strong {
              display: inline-block;
              min-width: 160px;
            }

            .signature {
              margin-top: 90px;
              text-align: center;
            }

            .signature .line {
              width: 300px;
              border-top: 1px solid #111;
              margin: 0 auto 10px;
            }

            .signature span {
              font-size: 13px;
            }

            .footer {
              margin-top: 60px;
              border-top: 1px solid #ddd;
              padding-top: 15px;
              text-align: center;
              color: #777;
              font-size: 11px;
            }

            @media print {
              body {
                padding: 20px;
              }

              @page {
                size: A4;
                margin: 15mm;
              }
            }
          </style>
        </head>

        <body>
          <div class="header">
            <div>
              <h1>TROCA TELAS</h1>
              <p>Assistência técnica • Jaconé</p>
              <p>Ficha de atendimento</p>
            </div>

            <div class="numero">
              <strong>#${String(osData.os).padStart(4, "0")}</strong>
              <span>ORDEM DE SERVIÇO</span>
            </div>
          </div>

          <div class="section">
            <h2>Informações do atendimento</h2>

            <div class="field">
              <strong>Cliente:</strong>
              ${escaparHtml(osData.cliente)}
            </div>

            <div class="field">
              <strong>Aparelho / Serviço:</strong>
              ${escaparHtml(osData.aparelho)}
            </div>

            <div class="field">
              <strong>Situação:</strong>
              ${escaparHtml(osData.situacao)}
            </div>

            <div class="field">
              <strong>Prazos:</strong>
              ${escaparHtml(osData.datas)}
            </div>

            <div class="field">
              <strong>Garantia:</strong>
              ${escaparHtml(osData.garantia)}
            </div>
          </div>

          <div class="section">
            <h2>Pagamento</h2>

            <div class="field">
              <strong>Valor do serviço:</strong>
              ${escaparHtml(osData.valor)}
            </div>

            <div class="field">
              <strong>Situação:</strong>
              ${escaparHtml(osData.tipoValor)}
            </div>
          </div>

          <div class="signature">
            <div class="line"></div>
            <span>Assinatura do cliente</span>
          </div>

          <div class="footer">
            Troca Telas • Ordem de Serviço #${osData.os}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  const columns: Array<ColumnDef<typeof features, Person>> = [
    {
      accessorKey: "os",
      header: "OS",
      cell: (info) => (
        <span className="font-mono font-semibold text-gray-600 dark:text-gray-400">
          #{String(info.getValue()).padStart(4, "0")}
        </span>
      ),
    },
    {
      accessorFn: (row) => row.cliente,
      id: "cliente",
      header: "Cliente / Aparelho",
      cell: (info) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {info.getValue() as string}
          </span>

          <span className="text-xs text-gray-500 dark:text-gray-400">
            {info.row.original.aparelho}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "situacao",
      header: "Situação",
      cell: (info) => {
        const situacao = info.getValue() as string;

        const status = situacao.toLowerCase();

        const isConcluido =
          status === "concluído" ||
          status === "concluido" ||
          status === "entregue";

        const isCancelado = status === "cancelado";

        const classeStatus = isConcluido
          ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900"
          : isCancelado
            ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900"
            : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900";

        return (
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${classeStatus}`}
          >
            {situacao}
          </span>
        );
      },
    },
    {
      accessorKey: "datas",
      header: "Prazos",
      cell: (info) => (
        <div className="flex flex-col gap-0.5 text-sm">
          <span className="text-gray-700 dark:text-gray-300">
            {info.getValue() as string}
          </span>

          <span className="text-xs text-gray-400 dark:text-gray-500">
            {info.row.original.garantia}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "valor",
      header: "Pagamento",
      cell: (info) => {
        const quitado = info.row.original.quitado;

        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {info.getValue() as string}
            </span>

            <span
              className={`text-xs font-medium ${
                quitado
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            >
              {info.row.original.tipoValor}
            </span>
          </div>
        );
      },
    },
    {
      id: "acoes",
      header: "",
      cell: (info) => (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              handlePrint(info.row.original);
            }}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
            title="Imprimir OS"
            aria-label={`Imprimir OS ${info.row.original.os}`}
          >
            <Printer size={18} />
          </button>
        </div>
      ),
    },
  ];

  const table = useTable({
    key: "ordens-servico-table",
    features,
    columns,
    data,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue) => {
      const busca = String(filterValue).toLowerCase().trim();

      if (!busca) return true;

      const numero = String(row.original.os).toLowerCase();
      const cliente = row.original.cliente.toLowerCase();
      const aparelho = row.original.aparelho.toLowerCase();

      return (
        numero.includes(busca) ||
        cliente.includes(busca) ||
        aparelho.includes(busca)
      );
    },
  });

  const linhas = table.getRowModel().rows;
  const totalFiltrado = linhas.length;

  return (
    <div className="w-full space-y-4">
      {/* Pesquisa */}
      <InputGroup className="h-10 max-w-full">
        <InputGroupInput
          placeholder="Buscar por número da OS, cliente ou aparelho"
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
        />

        <InputGroupAddon>
          <Search size={18} />
        </InputGroupAddon>

        <InputGroupAddon align="inline-end">
          {totalFiltrado}
        </InputGroupAddon>
      </InputGroup>

      {/* Tabela */}
      <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b bg-gray-50/75 transition-colors dark:bg-gray-900/50"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="h-11 whitespace-nowrap px-4 font-medium text-gray-500 dark:text-gray-400"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {totalFiltrado === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="p-10 text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Search
                        size={28}
                        className="text-muted-foreground/50"
                      />

                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        Nenhuma ordem de serviço encontrada
                      </p>

                      <p className="text-xs text-gray-500">
                        {globalFilter
                          ? "Tente pesquisar por outro número, cliente ou aparelho."
                          : "As ordens cadastradas aparecerão aqui."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                linhas.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => handleRedirect(row.original.os)}
                    className="cursor-pointer transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-900/50"
                  >
                    {row.getAllCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="whitespace-nowrap p-4 align-middle"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}