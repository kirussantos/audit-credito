"use client";

const ETAPAS = [
  "Consultando taxas do Banco Central...",
  "Calculando diferença de juros compostos...",
  "Comparando com a taxa média de mercado...",
  "Gerando relatório de análise...",
];

interface Props {
  visivel: boolean;
  etapa: number; // 0 = aguardando, 1-4 = etapas em progresso
}

export default function BarraProgresso({ visivel, etapa }: Props) {
  if (!visivel) return null;

  const progresso = Math.min((etapa / ETAPAS.length) * 100, 100);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(28, 40, 51, 0.75)" }}
      aria-live="polite"
      aria-busy="true"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#EBF5FB" }}
          >
            <svg
              className="w-5 h-5 animate-spin"
              style={{ color: "#1B4F72" }}
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12" cy="12" r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-base">
              Analisando sua dívida
            </h3>
            <p className="text-sm text-gray-500">Aguarde alguns instantes</p>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="w-full bg-gray-100 rounded-full h-2 mb-6 overflow-hidden">
          <div
            className="h-2 rounded-full transition-all duration-700 ease-in-out"
            style={{
              width: `${progresso}%`,
              backgroundColor: "#2E86C1",
            }}
          />
        </div>

        {/* Lista de etapas */}
        <ul className="space-y-3">
          {ETAPAS.map((msg, idx) => {
            const numEtapa = idx + 1;
            const concluida = etapa > numEtapa;
            const ativa    = etapa === numEtapa;
            const pendente = etapa < numEtapa;

            return (
              <li key={idx} className="flex items-center gap-3">
                {/* Ícone de status */}
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                  {concluida && (
                    <svg className="w-5 h-5" style={{ color: "#1E8449" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {ativa && (
                    <svg className="w-4 h-4 animate-spin" style={{ color: "#2E86C1" }} fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                  )}
                  {pendente && (
                    <span className="w-4 h-4 rounded-full border-2 border-gray-200 block" />
                  )}
                </span>

                {/* Mensagem */}
                <span
                  className={`text-sm transition-colors duration-300 ${
                    concluida
                      ? "text-gray-400 line-through"
                      : ativa
                      ? "font-medium text-gray-800"
                      : "text-gray-400"
                  }`}
                >
                  {msg}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
