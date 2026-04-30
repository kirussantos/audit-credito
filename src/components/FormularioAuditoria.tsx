"use client";

import { useState, useRef, useEffect } from "react";
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

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="mt-1.5 text-xs font-medium flex items-center gap-1" style={{ color: "var(--danger)" }}>
      <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {msg}
    </p>
  );
}

function FieldLabel({ htmlFor, children, hint }: { htmlFor: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex items-center justify-between mb-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-semibold" style={{ color: "var(--text-2)" }}>
        {children}
      </label>
      {hint && <span className="text-xs" style={{ color: "var(--text-4)" }}>{hint}</span>}
    </div>
  );
}

/* ─── StepIndicator ─────────────────────────────────────────────────────── */
function StepIndicator({ etapa }: { etapa: 1 | 2 }) {
  return (
    <div className="flex items-center mb-8">
      {[{ n: 1, label: "Dados do crédito" }, { n: 2, label: "Seus dados" }].map(({ n, label }, i) => {
        const done = etapa > n;
        const active = etapa === n;
        return (
          <div key={n} className="flex items-center" style={{ flex: i === 0 ? "initial" : 1 }}>
            {i > 0 && (
              <div
                className="h-0.5 flex-1 mx-3 transition-all duration-500"
                style={{ background: done || active ? "var(--navy-mid)" : "var(--bdr-2)" }}
              />
            )}
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 flex-shrink-0"
                style={{
                  background: done ? "var(--cta)" : active ? "var(--navy-mid)" : "var(--bdr)",
                  color: done || active ? "#fff" : "var(--text-4)",
                  boxShadow: active ? "0 0 0 3px rgba(30,58,95,0.2)" : "none",
                }}
              >
                {done ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : n}
              </div>
              <span className="text-sm font-medium hidden sm:block" style={{ color: active ? "var(--navy-mid)" : done ? "var(--cta)" : "var(--text-4)" }}>
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── MonthPicker ───────────────────────────────────────────────────────── */
const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function MonthPicker({
  value,
  onChange,
  hasError,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  hasError?: boolean;
  id: string;
}) {
  const anoAtual = new Date().getFullYear();
  const mesAtual = new Date().getMonth() + 1;

  const [open, setOpen] = useState(false);
  const [ano, setAno] = useState<number>(() => {
    if (value && /^\d{2}\/\d{4}$/.test(value)) return parseInt(value.split("/")[1]);
    return anoAtual;
  });

  const wrapRef = useRef<HTMLDivElement>(null);

  /* Fecha ao clicar fora */
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const mesSel = value && /^\d{2}\/\d{4}$/.test(value) ? parseInt(value.split("/")[0]) : null;
  const anoSel = value && /^\d{2}\/\d{4}$/.test(value) ? parseInt(value.split("/")[1]) : null;

  const displayValue = mesSel && anoSel
    ? `${MESES[mesSel - 1]} / ${anoSel}`
    : "";

  function selectMes(mes: number) {
    const mm = String(mes).padStart(2, "0");
    onChange(`${mm}/${ano}`);
    setOpen(false);
  }

  function isDisabled(mes: number) {
    return ano === anoAtual && mes > mesAtual;
  }

  function isSelected(mes: number) {
    return mes === mesSel && ano === anoSel;
  }

  return (
    <div ref={wrapRef} className="relative">
      {/* Trigger button */}
      <button
        id={id}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`inp has-pfx has-sfx text-left cursor-pointer ${hasError ? "err" : ""}`}
        style={{ color: displayValue ? "var(--text)" : "var(--text-4)" }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {displayValue || "Selecione mês / ano"}
      </button>

      {/* Calendar icon (prefix) */}
      <div className="inp-pfx pointer-events-none">
        <svg className="w-4 h-4" style={{ color: "var(--text-4)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      {/* Chevron (suffix) */}
      <div className="inp-sfx pointer-events-none">
        <svg
          className="w-4 h-4 transition-transform duration-200"
          style={{ color: "var(--text-4)", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          className="absolute left-0 z-50 mt-1.5 w-64 rounded-2xl overflow-hidden"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--bdr-2)",
            boxShadow: "0 12px 40px -4px rgba(13,27,42,0.18), 0 4px 12px rgba(0,0,0,0.08)",
            top: "100%",
          }}
        >
          {/* Year navigation */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid var(--bdr)", background: "var(--surface-2)" }}
          >
            <button
              type="button"
              onClick={() => setAno((y) => Math.max(1990, y - 1))}
              disabled={ano <= 1990}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{
                color: ano <= 1990 ? "var(--text-4)" : "var(--navy-mid)",
                background: ano <= 1990 ? "transparent" : "var(--surface-3)",
              }}
              aria-label="Ano anterior"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <span className="font-bold text-base tabular-nums" style={{ color: "var(--text)" }}>
              {ano}
            </span>

            <button
              type="button"
              onClick={() => setAno((y) => Math.min(anoAtual, y + 1))}
              disabled={ano >= anoAtual}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{
                color: ano >= anoAtual ? "var(--text-4)" : "var(--navy-mid)",
                background: ano >= anoAtual ? "transparent" : "var(--surface-3)",
              }}
              aria-label="Próximo ano"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-3 gap-1.5 p-3">
            {MESES.map((m, i) => {
              const mes = i + 1;
              const sel = isSelected(mes);
              const dis = isDisabled(mes);
              return (
                <button
                  key={m}
                  type="button"
                  role="option"
                  aria-selected={sel}
                  disabled={dis}
                  onClick={() => selectMes(mes)}
                  className="rounded-xl py-2 text-sm font-semibold transition-all duration-150"
                  style={{
                    background: sel
                      ? "var(--navy-mid)"
                      : "transparent",
                    color: sel
                      ? "#fff"
                      : dis
                      ? "var(--text-4)"
                      : "var(--text-2)",
                    cursor: dis ? "not-allowed" : "pointer",
                    border: sel ? "none" : "1px solid transparent",
                  }}
                >
                  {m}
                </button>
              );
            })}
          </div>

          {/* Quick shortcut: limpar */}
          {value && (
            <div style={{ borderTop: "1px solid var(--bdr)", padding: "0.5rem 0.75rem" }}>
              <button
                type="button"
                onClick={() => { onChange(""); setOpen(false); }}
                className="w-full text-center text-xs py-1.5 rounded-lg transition-colors"
                style={{ color: "var(--text-3)", background: "transparent" }}
              >
                Limpar seleção
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Componente principal ──────────────────────────────────────────────── */
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
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormularioData>({
    resolver: zodResolver(schemaFormulario),
    mode: "onBlur",
  });

  const dataContrato = watch("dataContrato") ?? "";

  const avancarEtapa = async () => {
    const valido = await trigger([...CAMPOS_ETAPA_1]);
    if (valido) setEtapa(2);
  };

  const onSubmit = async (data: FormularioData) => {
    if (!consentimento) { setErroConsentimento(true); return; }
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
      setErroEnvio(err instanceof Error ? err.message : "Erro desconhecido. Tente novamente.");
    }
  };

  return (
    <>
      <BarraProgresso visivel={processando} etapa={etapaProcessamento} />

      <div className="w-full max-w-xl mx-auto">
        <StepIndicator etapa={etapa} />

        <form onSubmit={handleSubmit(onSubmit)} noValidate>

          {/* ── ETAPA 1 ──────────────────────────────────────────────── */}
          {etapa === 1 && (
            <div className="space-y-5 anim-fade">

              {/* Tipo de crédito */}
              <div>
                <FieldLabel htmlFor="tipoCredito">Tipo de crédito</FieldLabel>
                <div className="inp-wrap">
                  <select
                    id="tipoCredito"
                    {...register("tipoCredito")}
                    className={`inp select-inp ${errors.tipoCredito ? "err" : ""}`}
                  >
                    <option value="">Selecione o tipo de crédito...</option>
                    {TIPOS_CREDITO_OPTIONS.map((op) => (
                      <option key={op.value} value={op.value}>{op.label}</option>
                    ))}
                  </select>
                </div>
                <FieldError msg={errors.tipoCredito?.message} />
              </div>

              {/* Banco */}
              <div>
                <FieldLabel htmlFor="instituicao" hint="Ex: Nubank, Itaú, Bradesco...">
                  Banco ou instituição financeira
                </FieldLabel>
                <div className="inp-wrap">
                  <div className="inp-pfx">
                    <svg className="w-4 h-4" style={{ color: "var(--text-4)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                    </svg>
                  </div>
                  <input
                    id="instituicao"
                    type="text"
                    placeholder="Banco do Brasil"
                    {...register("instituicao")}
                    className={`inp has-pfx ${errors.instituicao ? "err" : ""}`}
                  />
                </div>
                <FieldError msg={errors.instituicao?.message} />
              </div>

              {/* Valor + Taxa */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel htmlFor="valorDivida">Valor da dívida</FieldLabel>
                  <div className="inp-wrap">
                    <span className="inp-pfx font-semibold text-xs" style={{ color: "var(--text-3)" }}>R$</span>
                    <input
                      id="valorDivida"
                      type="number"
                      step="0.01"
                      min="100"
                      placeholder="5.000,00"
                      {...register("valorDivida", { valueAsNumber: true })}
                      className={`inp has-pfx ${errors.valorDivida ? "err" : ""}`}
                    />
                  </div>
                  <FieldError msg={errors.valorDivida?.message} />
                </div>

                <div>
                  <FieldLabel htmlFor="taxaJurosMensal">Taxa cobrada</FieldLabel>
                  <div className="inp-wrap">
                    <input
                      id="taxaJurosMensal"
                      type="number"
                      step="0.01"
                      min="0.1"
                      max="30"
                      placeholder="4,50"
                      {...register("taxaJurosMensal", { valueAsNumber: true })}
                      className={`inp has-sfx ${errors.taxaJurosMensal ? "err" : ""}`}
                    />
                    <span className="inp-sfx text-xs font-semibold">% a.m.</span>
                  </div>
                  <FieldError msg={errors.taxaJurosMensal?.message} />
                </div>
              </div>

              {/* Data do contrato + Período */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  {/* Hidden input for RHF validation */}
                  <input
                    type="hidden"
                    {...register("dataContrato")}
                  />
                  <FieldLabel htmlFor="dataContrato">Mês/ano do contrato</FieldLabel>
                  <div className="inp-wrap">
                    <MonthPicker
                      id="dataContrato"
                      value={dataContrato}
                      onChange={(v) => {
                        setValue("dataContrato", v, { shouldValidate: true, shouldDirty: true });
                      }}
                      hasError={!!errors.dataContrato}
                    />
                  </div>
                  <FieldError msg={errors.dataContrato?.message} />
                </div>

                <div>
                  <FieldLabel htmlFor="mesesAtraso" hint="1 a 360">
                    Período (meses)
                  </FieldLabel>
                  <div className="inp-wrap">
                    <input
                      id="mesesAtraso"
                      type="number"
                      step="1"
                      min="1"
                      max="360"
                      placeholder="24"
                      {...register("mesesAtraso", { valueAsNumber: true })}
                      className={`inp has-sfx ${errors.mesesAtraso ? "err" : ""}`}
                    />
                    <span className="inp-sfx text-xs font-semibold">meses</span>
                  </div>
                  <FieldError msg={errors.mesesAtraso?.message} />
                </div>
              </div>

              <div className="pt-1">
                <button type="button" onClick={avancarEtapa} className="btn-navy w-full py-3.5 text-base">
                  Continuar
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <p className="text-xs text-center" style={{ color: "var(--text-4)" }}>
                Nenhum CPF ou dado bancário é solicitado
              </p>
            </div>
          )}

          {/* ── ETAPA 2 ──────────────────────────────────────────────── */}
          {etapa === 2 && (
            <div className="space-y-5 anim-fade">

              <div
                className="rounded-xl px-4 py-3 flex items-center gap-3"
                style={{ background: "var(--surface-3)", border: "1px solid var(--bdr)" }}
              >
                <svg className="w-4 h-4 flex-shrink-0" style={{ color: "var(--blue)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs" style={{ color: "var(--text-3)" }}>
                  Dados do crédito preenchidos. Só precisamos saber onde entregar o resultado.
                </p>
              </div>

              {/* Nome */}
              <div>
                <FieldLabel htmlFor="nome">Seu nome completo</FieldLabel>
                <div className="inp-wrap">
                  <div className="inp-pfx">
                    <svg className="w-4 h-4" style={{ color: "var(--text-4)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="nome"
                    type="text"
                    placeholder="Maria da Silva"
                    {...register("nome")}
                    className={`inp has-pfx ${errors.nome ? "err" : ""}`}
                  />
                </div>
                <FieldError msg={errors.nome?.message} />
              </div>

              {/* E-mail */}
              <div>
                <FieldLabel htmlFor="email">Seu e-mail</FieldLabel>
                <div className="inp-wrap">
                  <div className="inp-pfx">
                    <svg className="w-4 h-4" style={{ color: "var(--text-4)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="maria@email.com"
                    {...register("email")}
                    className={`inp has-pfx ${errors.email ? "err" : ""}`}
                  />
                </div>
                <p className="mt-1.5 text-xs" style={{ color: "var(--text-4)" }}>
                  Usado apenas para entregar o relatório — sem spam, jamais.
                </p>
                <FieldError msg={errors.email?.message} />
              </div>

              {/* Consentimento LGPD */}
              <div
                className="rounded-xl p-4"
                style={{
                  background: erroConsentimento ? "#FEF2F2" : "var(--surface-2)",
                  border: `1px solid ${erroConsentimento ? "var(--danger-bdr)" : "var(--bdr)"}`,
                  transition: "background 0.2s, border-color 0.2s",
                }}
              >
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <div className="relative flex-shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      id="consentimento"
                      checked={consentimento}
                      onChange={(e) => {
                        setConsentimento(e.target.checked);
                        if (e.target.checked) setErroConsentimento(false);
                      }}
                      className="sr-only"
                    />
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center border-2 transition-all duration-150"
                      style={{
                        background: consentimento ? "var(--cta)" : "white",
                        borderColor: consentimento ? "var(--cta)" : "var(--bdr-2)",
                      }}
                    >
                      {consentimento && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-xs leading-relaxed" style={{ color: "var(--text-3)" }}>
                    Concordo com o uso dos dados informados exclusivamente para gerar esta análise.
                    Nenhum CPF ou dado bancário é coletado. Consulte a{" "}
                    <a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer" className="underline font-medium" style={{ color: "var(--blue)" }}>
                      Política de Privacidade
                    </a>{" "}e os{" "}
                    <a href="/termos-de-uso" target="_blank" rel="noopener noreferrer" className="underline font-medium" style={{ color: "var(--blue)" }}>
                      Termos de Uso
                    </a>.
                  </span>
                </label>
                {erroConsentimento && (
                  <p className="mt-2 text-xs font-medium flex items-center gap-1" style={{ color: "var(--danger)" }}>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Você precisa aceitar os termos para continuar.
                  </p>
                )}
              </div>

              {/* Erro de envio */}
              {erroEnvio && (
                <div
                  className="rounded-xl px-4 py-3 flex items-start gap-3 text-sm"
                  style={{ background: "var(--danger-bg)", border: "1px solid var(--danger-bdr)" }}
                >
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--danger)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span style={{ color: "var(--danger)" }}>{erroEnvio}</span>
                </div>
              )}

              {/* Botões */}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setEtapa(1)} className="btn-ghost flex-1" disabled={processando}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Voltar
                </button>
                <button type="submit" className="btn-cta flex-[2] py-3.5 text-sm" disabled={processando}>
                  {processando ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Analisando...
                    </>
                  ) : (
                    <>
                      Analisar minha dívida
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  );
}
