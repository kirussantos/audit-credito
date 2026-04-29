"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { schemaFormulario, FormularioData, TIPOS_CREDITO_OPTIONS } from "@/lib/validations";
import BarraProgresso from "./BarraProgresso";

const CAMPOS_ETAPA_1 = [
  "tipoCredito",
  "instituicao",
  "valorDivida",
  "taxaJurosMensal",
  "dataContrato",
  "mesesAtraso",
] as const;

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function CampoErro({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-600">{msg}</p>;
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 " +
  "placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2E86C1] focus:border-transparent " +
  "transition-colors bg-white";

const inputErroClass =
  "w-full rounded-lg border border-red-400 px-3 py-2.5 text-sm text-gray-900 " +
  "placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent " +
  "transition-colors bg-white";

export default function FormularioAuditoria() {
  const router = useRouter();
  const [etapa, setEtapa] = useState<1 | 2>(1);
  const [processando, setProcessando] = useState(false);
  const [etapaProcessamento, setEtapaProcessamento] = useState(0);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const [consentimento, setConsentimento] = useState(false);
  const [erroConsentimento, setErroConsentimento] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormularioData>({
    resolver: zodResolver(schemaFormulario),
    mode: "onBlur",
  });

  const avancarEtapa = async () => {
    const valido = await trigger([...CAMPOS_ETAPA_1]);
    if (valido) setEtapa(2);
  };

  const onSubmit = async (data: FormularioData) => {
    if (!consentimento) {
      setErroConsentimento(true);
      return;
    }
    setErroConsentimento(false);
    setProcessando(true);
    setEtapaProcessamento(1);
    setErroEnvio(null);

    try {
      const res = await fetch("/api/calcular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      setEtapaProcessamento(2);
      await delay(500);
      setEtapaProcessamento(3);
      await delay(400);
      setEtapaProcessamento(4);

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { message?: string }).message ?? "Erro ao processar a análise.");
      }

      const resultado = await res.json();
      await delay(500);

      sessionStorage.setItem("auditoria_resultado", JSON.stringify(resultado));
      router.push("/resultado");
    } catch (err) {
      setProcessando(false);
      setEtapaProcessamento(0);
      setErroEnvio(
        err instanceof Error ? err.message : "Erro desconhecido. Tente novamente."
      );
    }
  };

  return (
    <>
      <BarraProgresso visivel={processando} etapa={etapaProcessamento} />

      <div className="w-full max-w-xl mx-auto">
        {/* Indicador de etapas */}
        <div className="flex items-center gap-3 mb-8">
          {[1, 2].map((n) => (
            <div key={n} className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors"
                style={{
                  backgroundColor: etapa >= n ? "#1B4F72" : "#E5E7EB",
                  color: etapa >= n ? "#fff" : "#6B7280",
                }}
              >
                {n}
              </div>
              <span className="text-sm text-gray-600 hidden sm:block">
                {n === 1 ? "Dados do crédito" : "Seus dados"}
              </span>
              {n < 2 && <div className="w-8 h-px bg-gray-300 mx-1" />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* ── ETAPA 1: Dados do crédito ── */}
          {etapa === 1 && (
            <div className="space-y-5">
              {/* Tipo de crédito */}
              <div>
                <Label htmlFor="tipoCredito">Tipo de crédito</Label>
                <select
                  id="tipoCredito"
                  {...register("tipoCredito")}
                  className={errors.tipoCredito ? inputErroClass : inputClass}
                >
                  <option value="">Selecione o tipo...</option>
                  {TIPOS_CREDITO_OPTIONS.map((op) => (
                    <option key={op.value} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </select>
                <CampoErro msg={errors.tipoCredito?.message} />
              </div>

              {/* Banco / Instituição */}
              <div>
                <Label htmlFor="instituicao">Banco ou instituição financeira</Label>
                <input
                  id="instituicao"
                  type="text"
                  placeholder="Ex: Banco do Brasil, Nubank, Itaú..."
                  {...register("instituicao")}
                  className={errors.instituicao ? inputErroClass : inputClass}
                />
                <CampoErro msg={errors.instituicao?.message} />
              </div>

              {/* Valor da dívida + Taxa em linha */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="valorDivida">Valor da dívida (R$)</Label>
                  <input
                    id="valorDivida"
                    type="number"
                    step="0.01"
                    min="100"
                    placeholder="5000.00"
                    {...register("valorDivida", { valueAsNumber: true })}
                    className={errors.valorDivida ? inputErroClass : inputClass}
                  />
                  <CampoErro msg={errors.valorDivida?.message} />
                </div>

                <div>
                  <Label htmlFor="taxaJurosMensal">Taxa cobrada (% a.m.)</Label>
                  <input
                    id="taxaJurosMensal"
                    type="number"
                    step="0.01"
                    min="0.1"
                    max="30"
                    placeholder="4.50"
                    {...register("taxaJurosMensal", { valueAsNumber: true })}
                    className={errors.taxaJurosMensal ? inputErroClass : inputClass}
                  />
                  <CampoErro msg={errors.taxaJurosMensal?.message} />
                </div>
              </div>

              {/* Data do contrato + Período em linha */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dataContrato">Mês/ano do contrato</Label>
                  <input
                    id="dataContrato"
                    type="text"
                    placeholder="MM/AAAA"
                    maxLength={7}
                    {...register("dataContrato")}
                    className={errors.dataContrato ? inputErroClass : inputClass}
                  />
                  <CampoErro msg={errors.dataContrato?.message} />
                </div>

                <div>
                  <Label htmlFor="mesesAtraso">Período (meses)</Label>
                  <input
                    id="mesesAtraso"
                    type="number"
                    step="1"
                    min="1"
                    max="360"
                    placeholder="24"
                    {...register("mesesAtraso", { valueAsNumber: true })}
                    className={errors.mesesAtraso ? inputErroClass : inputClass}
                  />
                  <CampoErro msg={errors.mesesAtraso?.message} />
                </div>
              </div>

              {/* Botão avançar */}
              <button
                type="button"
                onClick={avancarEtapa}
                className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90 active:opacity-80"
                style={{ backgroundColor: "#1B4F72" }}
              >
                Continuar →
              </button>
            </div>
          )}

          {/* ── ETAPA 2: Dados de contato ── */}
          {etapa === 2 && (
            <div className="space-y-5">
              <div>
                <Label htmlFor="nome">Seu nome completo</Label>
                <input
                  id="nome"
                  type="text"
                  placeholder="Maria da Silva"
                  {...register("nome")}
                  className={errors.nome ? inputErroClass : inputClass}
                />
                <CampoErro msg={errors.nome?.message} />
              </div>

              <div>
                <Label htmlFor="email">Seu e-mail</Label>
                <input
                  id="email"
                  type="email"
                  placeholder="maria@email.com"
                  {...register("email")}
                  className={errors.email ? inputErroClass : inputClass}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Usamos apenas para entregar seu relatório.
                </p>
                <CampoErro msg={errors.email?.message} />
              </div>

              {/* Consentimento LGPD */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentimento}
                    onChange={(e) => {
                      setConsentimento(e.target.checked);
                      if (e.target.checked) setErroConsentimento(false);
                    }}
                    className="mt-0.5 flex-shrink-0 w-4 h-4 rounded border-gray-300 accent-[#1B4F72]"
                  />
                  <span className="text-xs text-gray-600 leading-relaxed">
                    Concordo com o uso dos dados informados (nome, e-mail e dados da dívida)
                    exclusivamente para gerar esta análise. Nenhum CPF ou dado bancário é coletado.
                    Consulte a{" "}
                    <a
                      href="/politica-de-privacidade"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2E86C1] underline"
                    >
                      Política de Privacidade
                    </a>
                    {" "}e os{" "}
                    <a
                      href="/termos-de-uso"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2E86C1] underline"
                    >
                      Termos de Uso
                    </a>.
                  </span>
                </label>
                {erroConsentimento && (
                  <p className="mt-2 text-xs text-red-600">
                    Você precisa aceitar os termos para continuar.
                  </p>
                )}
              </div>

              {/* Erro de envio */}
              {erroEnvio && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {erroEnvio}
                </div>
              )}

              {/* Botões */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setEtapa(1)}
                  className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
                >
                  ← Voltar
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-3 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90 active:opacity-80"
                  style={{ backgroundColor: "#1B4F72" }}
                >
                  Analisar minha dívida
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  );
}
