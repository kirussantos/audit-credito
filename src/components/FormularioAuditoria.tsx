"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { schemaFormulario, FormularioData } from "@/lib/validations";
import BarraProgresso from "./BarraProgresso";
import { track, trackCustom } from "@/lib/track";

/* ── Campos obrigatórios na etapa 1 ─────────────────────────────────────── */
const CAMPOS_ETAPA_1 = [
  "tipoCredito", "instituicao", "valorDivida",
  "taxaJurosMensal", "dataContrato", "mesesAtraso",
] as const;

/* ── Tipos de crédito — linguagem simples ────────────────────────────────── */
const TIPOS = [
  {
    value: "pessoal" as const,
    label: "Empréstimo Pessoal",
    desc: "O banco depositou dinheiro na sua conta",
    icon: "M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    value: "cheque_especial" as const,
    label: "Cheque Especial",
    desc: "Conta ficou no negativo e o banco cobriu",
    icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
  },
  {
    value: "consignado" as const,
    label: "Consignado",
    desc: "Desconta direto do salário ou INSS",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  },
  {
    value: "cartao_rotativo" as const,
    label: "Fatura em Aberto",
    desc: "Pagou só o mínimo da fatura do cartão",
    icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  },
  {
    value: "cartao_parcelado" as const,
    label: "Compra Parcelada",
    desc: "Dividiu uma compra em várias vezes no cartão",
    icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  },
];

const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function delay(ms: number) { return new Promise<void>(r => setTimeout(r, ms)); }
function calcAnual(m: number) { return m > 0 ? (Math.pow(1 + m / 100, 12) - 1) * 100 : 0; }
function calcMensal(a: number) { return a > 0 ? (Math.pow(1 + a / 100, 1 / 12) - 1) * 100 : 0; }
function fmt2(n: number) { return n.toFixed(2).replace(".", ","); }

function periodoLabel(meses: number): string {
  if (!meses || meses <= 0) return "";
  const anos = Math.floor(meses / 12);
  const m = meses % 12;
  const parts: string[] = [];
  if (anos > 0) parts.push(`${anos} ${anos === 1 ? "ano" : "anos"}`);
  if (m > 0) parts.push(`${m} ${m === 1 ? "mês" : "meses"}`);
  return parts.join(" e ");
}

function endDateLabel(dataContrato: string, meses: number): string {
  if (!dataContrato || !meses || meses <= 0 || !/^\d{2}\/\d{4}$/.test(dataContrato)) return "";
  const [mm, yyyy] = dataContrato.split("/").map(Number);
  const end = new Date(yyyy, mm - 1 + meses - 1);
  return `${MESES[end.getMonth()]}/${String(end.getFullYear()).slice(2)}`;
}

/* ── FieldError ──────────────────────────────────────────────────────────── */
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

/* ── HelpTip — dica expansível ───────────────────────────────────────────── */
function HelpTip({ label = "Como encontro essa informação?", children }: {
  label?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-1.5">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 text-xs cursor-pointer"
        style={{ color: "var(--blue)" }}
      >
        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {open ? "Fechar dica" : label}
      </button>
      {open && (
        <div
          className="mt-2 p-3 rounded-xl text-xs leading-relaxed anim-fade"
          style={{ background: "var(--surface-3)", border: "1px solid var(--bdr)", color: "var(--text-3)" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/* ── StepIndicator ───────────────────────────────────────────────────────── */
function StepIndicator({ etapa }: { etapa: 1 | 2 }) {
  return (
    <div className="flex items-center mb-8">
      {[{ n: 1, label: "Sobre a dívida" }, { n: 2, label: "Seus dados" }].map(({ n, label }, i) => {
        const done = etapa > n;
        const active = etapa === n;
        return (
          <div key={n} className="flex items-center" style={{ flex: i === 0 ? "initial" : 1 }}>
            {i > 0 && (
              <div
                className="h-0.5 flex-1 mx-3 rounded-full transition-all duration-500"
                style={{ background: done ? "var(--cta)" : "var(--bdr)" }}
              />
            )}
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 flex-shrink-0"
                style={{
                  background: done ? "var(--cta)" : active ? "var(--navy-mid)" : "var(--surface-2)",
                  color: done || active ? "#fff" : "var(--text-4)",
                  boxShadow: active ? "0 0 0 4px rgba(30,58,95,0.12)" : "none",
                }}
              >
                {done ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : n}
              </div>
              <span
                className="text-sm font-medium hidden sm:block"
                style={{ color: active ? "var(--navy-mid)" : done ? "var(--cta)" : "var(--text-4)" }}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── MonthPicker ─────────────────────────────────────────────────────────── */
function MonthPicker({ value, onChange, hasError, id }: {
  value: string;
  onChange: (v: string) => void;
  hasError?: boolean;
  id: string;
}) {
  const anoAtual = new Date().getFullYear();
  const mesAtual = new Date().getMonth() + 1;
  const [open, setOpen]       = useState(false);
  const [flipped, setFlipped] = useState(false); // abre para cima quando não há espaço abaixo
  const [ano, setAno] = useState<number>(() => {
    if (value && /^\d{2}\/\d{4}$/.test(value)) return parseInt(value.split("/")[1]);
    return anoAtual;
  });
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    /* ── Detecta se o dropdown cabe abaixo; se não, abre para cima ── */
    if (wrapRef.current) {
      const rect = wrapRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setFlipped(spaceBelow < 310); // 310px ≈ altura do dropdown
    }

    /* ── Fecha ao clicar/tocar fora (mouse + touch) ── */
    function handler(e: MouseEvent | TouchEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [open]);

  const mesSel = value && /^\d{2}\/\d{4}$/.test(value) ? parseInt(value.split("/")[0]) : null;
  const anoSel = value && /^\d{2}\/\d{4}$/.test(value) ? parseInt(value.split("/")[1]) : null;
  const displayValue = mesSel && anoSel ? `${MESES[mesSel - 1]} / ${anoSel}` : "";

  function selectMes(mes: number) {
    onChange(`${String(mes).padStart(2, "0")}/${ano}`);
    setOpen(false);
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        id={id} type="button" onClick={() => setOpen(o => !o)}
        className={`inp has-pfx has-sfx text-left cursor-pointer ${hasError ? "err" : ""}`}
        style={{ color: displayValue ? "var(--text)" : "var(--text-4)" }}
        aria-haspopup="listbox" aria-expanded={open}
      >
        {displayValue || "Clique para escolher o mês e o ano"}
      </button>
      <div className="inp-pfx pointer-events-none">
        <svg className="w-4 h-4" style={{ color: "var(--text-4)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <div className="inp-sfx pointer-events-none">
        <svg
          className="w-4 h-4 transition-transform duration-200"
          style={{ color: "var(--text-4)", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 w-64 rounded-2xl overflow-hidden"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--bdr-2)",
            boxShadow: "0 12px 40px -4px rgba(13,27,42,0.18), 0 4px 12px rgba(0,0,0,0.08)",
            zIndex: 9999,
            /* Abre para cima ou para baixo conforme espaço disponível */
            ...(flipped
              ? { bottom: "calc(100% + 6px)", top: "auto" }
              : { top: "calc(100% + 6px)", bottom: "auto" }),
          }}
        >
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid var(--bdr)", background: "var(--surface-2)" }}
          >
            <button
              type="button" onClick={() => setAno(y => Math.max(1990, y - 1))} disabled={ano <= 1990}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
              style={{ color: ano <= 1990 ? "var(--text-4)" : "var(--navy-mid)", background: ano <= 1990 ? "transparent" : "var(--surface-3)" }}
              aria-label="Ano anterior"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="font-bold text-base tabular-nums" style={{ color: "var(--text)" }}>{ano}</span>
            <button
              type="button" onClick={() => setAno(y => Math.min(anoAtual, y + 1))} disabled={ano >= anoAtual}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
              style={{ color: ano >= anoAtual ? "var(--text-4)" : "var(--navy-mid)", background: ano >= anoAtual ? "transparent" : "var(--surface-3)" }}
              aria-label="Próximo ano"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5 p-3">
            {MESES.map((m, i) => {
              const mes = i + 1;
              const sel = mes === mesSel && ano === anoSel;
              const dis = ano === anoAtual && mes > mesAtual;
              return (
                <button
                  key={m} type="button" role="option" aria-selected={sel} disabled={dis}
                  onClick={() => selectMes(mes)}
                  className="rounded-xl py-2 text-sm font-semibold transition-all duration-150"
                  style={{
                    background: sel ? "var(--navy-mid)" : "transparent",
                    color: sel ? "#fff" : dis ? "var(--text-4)" : "var(--text-2)",
                    cursor: dis ? "not-allowed" : "pointer",
                    border: sel ? "none" : "1px solid transparent",
                  }}
                >
                  {m}
                </button>
              );
            })}
          </div>

          {value && (
            <div style={{ borderTop: "1px solid var(--bdr)", padding: "0.5rem 0.75rem" }}>
              <button
                type="button" onClick={() => { onChange(""); setOpen(false); }}
                className="w-full text-center text-xs py-1.5 rounded-lg cursor-pointer"
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

/* ════════════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
════════════════════════════════════════════════════════════════════════════ */
export default function FormularioAuditoria() {
  const router = useRouter();
  const [etapa, setEtapa] = useState<1 | 2>(1);
  const [processando, setProcessando] = useState(false);
  const [etapaProcessamento, setEtapaProcessamento] = useState(0);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const [consentimento, setConsentimento] = useState(false);
  const [erroConsentimento, setErroConsentimento] = useState(false);

  /* ── Taxa toggle: a.m. ↔ a.a. ────────────────────────────────────────── */
  const [taxaIsAnual, setTaxaIsAnual] = useState(false);
  const [taxaDisplayStr, setTaxaDisplayStr] = useState("");
  const primeiroToqueRef = useRef(false);

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

  const tipoAtual    = watch("tipoCredito");
  const dataContrato = watch("dataContrato") ?? "";
  const mesesWatch   = watch("mesesAtraso") ?? 0;
  const taxaMensal   = watch("taxaJurosMensal") ?? 0;
  const valorWatch   = watch("valorDivida") ?? 0;
  const instituicaoW = watch("instituicao") ?? "";

  /* ── Labels de período ────────────────────────────────────────────────── */
  const startLabel = dataContrato && /^\d{2}\/\d{4}$/.test(dataContrato)
    ? (() => { const [mm, yyyy] = dataContrato.split("/"); return `${MESES[parseInt(mm) - 1]}/${String(yyyy).slice(2)}`; })()
    : "";
  const endLabel = endDateLabel(dataContrato, mesesWatch);

  /* ── Handler da taxa — BUG FIX: sempre chama setValue, mesmo com campo vazio ── */
  function handleTaxaInput(val: string) {
    setTaxaDisplayStr(val);
    const num = parseFloat(val.replace(",", ".")) || 0;
    // Sempre atualiza o RHF: quando vazio → 0 → falha validação (min 0.1)
    const mensal = num > 0 ? (taxaIsAnual ? calcMensal(num) : num) : 0;
    setValue("taxaJurosMensal", parseFloat(mensal.toFixed(4)), {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  function toggleTaxaMode() {
    const stored = taxaMensal;
    if (!taxaIsAnual && stored > 0) {
      // a.m. → a.a.: converte para anual
      setTaxaDisplayStr(fmt2(calcAnual(stored)));
    } else if (taxaIsAnual && stored > 0) {
      // a.a. → a.m.: mostra o mensal armazenado
      setTaxaDisplayStr(fmt2(stored));
    }
    setTaxaIsAnual(p => !p);
  }

  /* ── Primeiro toque no formulário → InitiateCheckout ─────────────────── */
  function handlePrimeiroToque() {
    if (primeiroToqueRef.current) return;
    primeiroToqueRef.current = true;
    track("InitiateCheckout", { content_name: "FormularioAuditoria" });
  }

  /* ── Avançar etapa ────────────────────────────────────────────────────── */
  const avancarEtapa = async () => {
    const valido = await trigger([...CAMPOS_ETAPA_1]);
    if (valido) {
      setEtapa(2);
      track("Lead", { content_name: "FormularioAuditoria", etapa: 2 });
    }
  };

  /* ── Submissão ────────────────────────────────────────────────────────── */
  const onSubmit = async (data: FormularioData) => {
    if (!consentimento) { setErroConsentimento(true); return; }
    setErroConsentimento(false);
    setProcessando(true);
    setEtapaProcessamento(1);
    setErroEnvio(null);

    /* Dispara evento de análise submetida */
    trackCustom("AnaliseSubmetida", {
      tipo_credito: data.tipoCredito,
      instituicao: data.instituicao,
      valor_divida: data.valorDivida,
    });

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

  const brl = (n: number) =>
    n > 0
      ? `R$ ${n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : "—";

  const tipoInfo = TIPOS.find(t => t.value === tipoAtual);

  /* ── Render ───────────────────────────────────────────────────────────── */
  return (
    <>
      <BarraProgresso visivel={processando} etapa={etapaProcessamento} />

      <div className="w-full max-w-xl mx-auto">
        <StepIndicator etapa={etapa} />

        <form onSubmit={handleSubmit(onSubmit)} onFocus={handlePrimeiroToque} noValidate>

          {/* ══════════ ETAPA 1 ══════════════════════════════════════════ */}
          {etapa === 1 && (
            <div className="space-y-6 anim-fade">

              {/* ── Aviso introdutório ───────────────────────────────── */}
              <div
                className="rounded-xl px-4 py-3.5 text-sm leading-relaxed"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--bdr)",
                  color: "var(--text-3)",
                }}
              >
                Preencha com o que tiver no seu contrato ou extrato.{" "}
                <strong style={{ color: "var(--text)" }}>Não precisa ser 100% exato</strong>{" "}
                — mesmo valores aproximados já mostram se os juros cobrados estão acima do limite do Banco Central.
              </div>

              {/* ── Tipo de crédito ──────────────────────────────────── */}
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-2)" }}>
                  Que tipo de dívida você quer verificar?
                  <span className="ml-0.5 text-xs" style={{ color: "var(--danger)" }}>*</span>
                </p>
                <p className="text-xs mb-3" style={{ color: "var(--text-4)" }}>
                  Escolha a opção que mais se parece com a sua situação
                </p>
                {/* Hidden input registrado no RHF */}
                <input type="hidden" {...register("tipoCredito")} />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TIPOS.map(tipo => {
                    const sel = tipoAtual === tipo.value;
                    return (
                      <button
                        key={tipo.value}
                        type="button"
                        onClick={() => setValue("tipoCredito", tipo.value, { shouldValidate: true, shouldDirty: true })}
                        className="text-left rounded-xl p-3 border-2 transition-all duration-150 cursor-pointer"
                        style={{
                          background: sel ? "rgba(30,58,95,0.06)" : "var(--surface)",
                          borderColor: sel ? "var(--navy-mid)" : "var(--bdr-2)",
                          boxShadow: sel ? "0 0 0 3px rgba(30,58,95,0.08)" : "none",
                        }}
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center mb-2 transition-colors"
                          style={{ background: sel ? "var(--navy-mid)" : "var(--surface-2)" }}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                            stroke={sel ? "#fff" : "var(--text-3)"} strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={tipo.icon} />
                          </svg>
                        </div>
                        <p
                          className="text-xs font-bold leading-tight mb-0.5"
                          style={{ color: sel ? "var(--navy-mid)" : "var(--text)" }}
                        >
                          {tipo.label}
                        </p>
                        <p className="text-xs leading-tight" style={{ color: sel ? "var(--navy-soft)" : "var(--text-4)" }}>
                          {tipo.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
                <FieldError msg={errors.tipoCredito?.message} />
              </div>

              {/* ── Banco ─────────────────────────────────────────────── */}
              <div>
                <label htmlFor="instituicao" className="block text-sm font-semibold mb-1.5"
                  style={{ color: "var(--text-2)" }}>
                  Em qual banco está essa dívida?
                  <span className="ml-0.5 text-xs" style={{ color: "var(--danger)" }}>*</span>
                </label>
                <div className="inp-wrap">
                  <div className="inp-pfx">
                    <svg className="w-4 h-4" style={{ color: "var(--text-4)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                    </svg>
                  </div>
                  <input
                    id="instituicao" type="text"
                    placeholder="Ex: Nubank, Itaú, Bradesco, Caixa..."
                    {...register("instituicao")}
                    className={`inp has-pfx ${errors.instituicao ? "err" : ""}`}
                  />
                </div>
                <FieldError msg={errors.instituicao?.message} />
              </div>

              {/* ── Valor + Prazo (2 colunas) ─────────────────────────── */}
              <div className="grid grid-cols-2 gap-4">

                {/* Valor */}
                <div>
                  <label htmlFor="valorDivida" className="block text-sm font-semibold mb-1.5"
                    style={{ color: "var(--text-2)" }}>
                    Quanto você pegou emprestado?
                    <span className="ml-0.5 text-xs" style={{ color: "var(--danger)" }}>*</span>
                  </label>
                  <div className="inp-wrap">
                    <span className="inp-pfx font-bold text-xs" style={{ color: "var(--text-3)" }}>R$</span>
                    <input
                      id="valorDivida" type="number" step="0.01" min="100"
                      placeholder="5000"
                      {...register("valorDivida", { valueAsNumber: true })}
                      className={`inp has-pfx ${errors.valorDivida ? "err" : ""}`}
                    />
                  </div>
                  <p className="mt-1 text-xs" style={{ color: "var(--text-4)" }}>
                    O total que você recebeu — não o valor da parcela
                  </p>
                  <HelpTip label="Onde encontro esse valor?">
                    <p className="font-semibold mb-1.5" style={{ color: "var(--text-2)" }}>
                      Procure no contrato ou extrato por:
                    </p>
                    <ul className="space-y-1 mb-2">
                      <li>→ <strong>&ldquo;Valor Financiado&rdquo;</strong></li>
                      <li>→ <strong>&ldquo;Valor do Empréstimo&rdquo;</strong></li>
                      <li>→ <strong>&ldquo;Valor Concedido&rdquo;</strong></li>
                    </ul>
                    <p
                      className="text-xs"
                      style={{
                        color: "var(--text-4)",
                        borderTop: "1px solid var(--bdr)",
                        paddingTop: "0.5rem",
                        marginTop: "0.5rem",
                      }}
                    >
                      Exemplo: pegou R$&nbsp;10.000 para pagar em 24 parcelas?
                      Coloque <strong>10000</strong> — não o valor das parcelas.
                    </p>
                  </HelpTip>
                  <FieldError msg={errors.valorDivida?.message} />
                </div>

                {/* Prazo */}
                <div>
                  <label htmlFor="mesesAtraso" className="block text-sm font-semibold mb-1.5"
                    style={{ color: "var(--text-2)" }}>
                    Total de parcelas
                    <span className="ml-0.5 text-xs" style={{ color: "var(--danger)" }}>*</span>
                  </label>
                  <div className="inp-wrap">
                    <input
                      id="mesesAtraso" type="number" step="1" min="1" max="360"
                      placeholder="24"
                      {...register("mesesAtraso", { valueAsNumber: true })}
                      className={`inp has-sfx ${errors.mesesAtraso ? "err" : ""}`}
                    />
                    <span className="inp-sfx text-xs font-semibold">meses</span>
                  </div>
                  {startLabel && endLabel && mesesWatch > 0 ? (
                    <p className="mt-1 text-xs font-medium" style={{ color: "var(--text-3)" }}>
                      {startLabel} → {endLabel} &nbsp;·&nbsp; {periodoLabel(mesesWatch)}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs" style={{ color: "var(--text-4)" }}>
                      Ex: 12, 24, 36 ou 60 parcelas
                    </p>
                  )}
                  <HelpTip label="Não sei o total de parcelas">
                    <p className="mb-1.5">
                      Some todas as parcelas mensais. Se são{" "}
                      <strong>24 vezes</strong>, coloque <strong>24</strong>.
                    </p>
                    <p>
                      No contrato procure por:{" "}
                      <strong>&ldquo;Prazo&rdquo;</strong>,{" "}
                      <strong>&ldquo;Nº de Parcelas&rdquo;</strong> ou{" "}
                      <strong>&ldquo;Duração&rdquo;</strong>.
                    </p>
                  </HelpTip>
                  <FieldError msg={errors.mesesAtraso?.message} />
                </div>
              </div>

              {/* ── Taxa de juros ─────────────────────────────────────── */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="taxa-display" className="text-sm font-semibold"
                    style={{ color: "var(--text-2)" }}>
                    Qual a taxa de juros cobrada?
                    <span className="ml-0.5 text-xs" style={{ color: "var(--danger)" }}>*</span>
                  </label>

                  {/* Toggle a.m. / a.a. */}
                  <div
                    className="flex items-center rounded-lg overflow-hidden"
                    style={{ border: "1.5px solid var(--bdr-2)", background: "var(--surface-2)" }}
                  >
                    {(["a.m.", "a.a."] as const).map((modo, i) => {
                      const ativo = taxaIsAnual ? i === 1 : i === 0;
                      return (
                        <button
                          key={modo}
                          type="button"
                          onClick={() => { if (!ativo) toggleTaxaMode(); }}
                          className="text-xs font-bold px-2.5 py-1 transition-all duration-150"
                          style={{
                            background: ativo ? "var(--navy-mid)" : "transparent",
                            color: ativo ? "#fff" : "var(--text-3)",
                            cursor: ativo ? "default" : "pointer",
                          }}
                          title={ativo ? undefined : `Mudar para % ${modo}`}
                        >
                          % {modo}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* a.m. = ao mês / a.a. = ao ano — explicação inline */}
                <p className="text-xs mb-2" style={{ color: "var(--text-4)" }}>
                  {taxaIsAnual
                    ? "Digite a taxa anual que aparece no contrato (ex: 79,8% a.a.)"
                    : "Digite a taxa mensal que aparece no contrato (ex: 4,99% a.m.)"}
                  {" — "}
                  <button
                    type="button"
                    onClick={() => toggleTaxaMode()}
                    className="underline cursor-pointer"
                    style={{ color: "var(--blue)" }}
                  >
                    a taxa está {taxaIsAnual ? "ao mês" : "ao ano"}?
                  </button>
                </p>

                {/* Hidden input para RHF */}
                <input type="hidden" {...register("taxaJurosMensal")} />

                <div className="inp-wrap">
                  <input
                    id="taxa-display"
                    type="number"
                    step="0.01"
                    value={taxaDisplayStr}
                    onChange={e => handleTaxaInput(e.target.value)}
                    onBlur={() => trigger("taxaJurosMensal")}
                    placeholder={taxaIsAnual ? "Ex: 79,80" : "Ex: 4,99"}
                    className={`inp has-sfx ${errors.taxaJurosMensal ? "err" : ""}`}
                  />
                  <span className="inp-sfx text-xs font-bold" style={{ color: "var(--text-3)" }}>
                    % {taxaIsAnual ? "a.a." : "a.m."}
                  </span>
                </div>

                {/* Conversor em tempo real */}
                {taxaMensal > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-px" style={{ background: "var(--bdr)" }} />
                    <span
                      className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      style={{ background: "var(--surface-3)", color: "var(--text-3)", border: "1px solid var(--bdr-2)" }}
                    >
                      {taxaIsAnual
                        ? `= ${fmt2(taxaMensal)}% ao mês`
                        : `= ${fmt2(calcAnual(taxaMensal))}% ao ano`}
                    </span>
                    <div className="flex-1 h-px" style={{ background: "var(--bdr)" }} />
                  </div>
                )}

                <FieldError msg={errors.taxaJurosMensal?.message} />

                <HelpTip label="Onde encontro a taxa de juros?">
                  <div className="space-y-2.5">
                    <div>
                      <p className="font-semibold mb-1" style={{ color: "var(--text-2)" }}>Onde procurar:</p>
                      <ul className="space-y-0.5">
                        <li>📄 <strong>No contrato:</strong> procure &ldquo;Taxa de Juros&rdquo; ou &ldquo;CET&rdquo;</li>
                        <li>📱 <strong>No app do banco:</strong> Empréstimos → Ver contrato</li>
                        <li>🧾 <strong>Na fatura:</strong> seção &ldquo;Informações do Financiamento&rdquo;</li>
                      </ul>
                    </div>
                    <div style={{ borderTop: "1px solid var(--bdr)", paddingTop: "0.5rem" }}>
                      <p className="font-semibold mb-1" style={{ color: "var(--text-2)" }}>Como vai aparecer no papel:</p>
                      <ul className="space-y-0.5">
                        <li>→ <strong>&ldquo;4,99% a.m.&rdquo;</strong> (ao mês) — use o botão <strong>% a.m.</strong></li>
                        <li>→ <strong>&ldquo;79,8% a.a.&rdquo;</strong> (ao ano) — use o botão <strong>% a.a.</strong></li>
                      </ul>
                    </div>
                    <p
                      className="text-xs"
                      style={{
                        color: "var(--text-4)",
                        borderTop: "1px solid var(--bdr)",
                        paddingTop: "0.5rem",
                      }}
                    >
                      Dica: se aparecer mais de um número, use a <strong>&ldquo;Taxa Nominal&rdquo;</strong> — não o CET (que inclui outros custos além dos juros).
                    </p>
                  </div>
                </HelpTip>
              </div>

              {/* ── Data do contrato ──────────────────────────────────── */}
              <div>
                <label htmlFor="dataContrato" className="block text-sm font-semibold mb-1.5"
                  style={{ color: "var(--text-2)" }}>
                  Quando começou essa dívida?
                  <span className="ml-0.5 text-xs" style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input type="hidden" {...register("dataContrato")} />
                <div className="inp-wrap">
                  <MonthPicker
                    id="dataContrato"
                    value={dataContrato}
                    onChange={v => setValue("dataContrato", v, { shouldValidate: true, shouldDirty: true })}
                    hasError={!!errors.dataContrato}
                  />
                </div>
                <p className="mt-1 text-xs" style={{ color: "var(--text-4)" }}>
                  Mês e ano em que você assinou o contrato ou fez a compra
                </p>
                <HelpTip label="Não sei a data exata">
                  <p>
                    Use o mês e ano aproximado — não precisa ser o dia exato. Está no contrato como{" "}
                    <strong>&ldquo;Data de Contratação&rdquo;</strong> ou na fatura como a data do
                    primeiro lançamento.
                  </p>
                </HelpTip>
                <FieldError msg={errors.dataContrato?.message} />
              </div>

              {/* ── Botão continuar ───────────────────────────────────── */}
              <div className="pt-1">
                <button type="button" onClick={avancarEtapa} className="btn-navy w-full py-3.5 text-base">
                  Verificar meus juros
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <p className="text-xs text-center" style={{ color: "var(--text-4)" }}>
                Não pedimos CPF, senha ou qualquer dado bancário
              </p>
            </div>
          )}

          {/* ══════════ ETAPA 2 ══════════════════════════════════════════ */}
          {etapa === 2 && (
            <div className="space-y-5 anim-fade">

              {/* ── Resumo dos dados da etapa 1 ───────────────────────── */}
              <div
                className="rounded-2xl p-4"
                style={{ background: "var(--surface-2)", border: "1px solid var(--bdr)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--cta)" }}
                  >
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--text-3)" }}>
                    Dados que você informou
                  </span>
                  <button
                    type="button" onClick={() => setEtapa(1)}
                    className="ml-auto text-xs underline cursor-pointer"
                    style={{ color: "var(--blue)" }}
                  >
                    Corrigir
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  {tipoInfo && (
                    <div>
                      <p className="text-xs mb-0.5" style={{ color: "var(--text-4)" }}>Tipo de dívida</p>
                      <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>{tipoInfo.label}</p>
                    </div>
                  )}
                  {instituicaoW && (
                    <div>
                      <p className="text-xs mb-0.5" style={{ color: "var(--text-4)" }}>Banco</p>
                      <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>{instituicaoW}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: "var(--text-4)" }}>Valor emprestado</p>
                    <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>{brl(valorWatch)}</p>
                  </div>
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: "var(--text-4)" }}>Taxa cobrada</p>
                    <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>
                      {taxaMensal > 0
                        ? <>{fmt2(taxaMensal)}% a.m. &nbsp;·&nbsp; {fmt2(calcAnual(taxaMensal))}% a.a.</>
                        : "—"}
                    </p>
                  </div>
                  {dataContrato && (
                    <div>
                      <p className="text-xs mb-0.5" style={{ color: "var(--text-4)" }}>Início</p>
                      <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>
                        {startLabel}{mesesWatch > 0 && endLabel ? ` → ${endLabel}` : ""}
                      </p>
                    </div>
                  )}
                  {mesesWatch > 0 && (
                    <div>
                      <p className="text-xs mb-0.5" style={{ color: "var(--text-4)" }}>Duração</p>
                      <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>{periodoLabel(mesesWatch)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Nome ──────────────────────────────────────────────── */}
              <div>
                <label htmlFor="nome" className="block text-sm font-semibold mb-1.5"
                  style={{ color: "var(--text-2)" }}>
                  Qual é o seu nome?
                  <span className="ml-0.5 text-xs" style={{ color: "var(--danger)" }}>*</span>
                </label>
                <div className="inp-wrap">
                  <div className="inp-pfx">
                    <svg className="w-4 h-4" style={{ color: "var(--text-4)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="nome" type="text" placeholder="Ex: Maria da Silva"
                    {...register("nome")}
                    className={`inp has-pfx ${errors.nome ? "err" : ""}`}
                  />
                </div>
                <FieldError msg={errors.nome?.message} />
              </div>

              {/* ── E-mail ────────────────────────────────────────────── */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-1.5"
                  style={{ color: "var(--text-2)" }}>
                  Seu e-mail para receber o resultado
                  <span className="ml-0.5 text-xs" style={{ color: "var(--danger)" }}>*</span>
                </label>
                <div className="inp-wrap">
                  <div className="inp-pfx">
                    <svg className="w-4 h-4" style={{ color: "var(--text-4)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="email" type="email" placeholder="Ex: maria@gmail.com"
                    {...register("email")}
                    className={`inp has-pfx ${errors.email ? "err" : ""}`}
                  />
                </div>
                <p className="mt-1.5 text-xs" style={{ color: "var(--text-4)" }}>
                  Vamos enviar sua análise gratuita aqui. Nada de spam, prometemos.
                </p>
                <FieldError msg={errors.email?.message} />
              </div>

              {/* ── Consentimento LGPD ───────────────────────────────── */}
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
                      type="checkbox" id="consentimento"
                      checked={consentimento}
                      onChange={e => {
                        setConsentimento(e.target.checked);
                        if (e.target.checked) setErroConsentimento(false);
                      }}
                      className="sr-only"
                    />
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center border-2 transition-all duration-150"
                      style={{ background: consentimento ? "var(--cta)" : "white", borderColor: consentimento ? "var(--cta)" : "var(--bdr-2)" }}
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
                    Sem CPF ou dado bancário coletado. Ver{" "}
                    <a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer"
                      className="underline font-medium" style={{ color: "var(--blue)" }}>
                      Política de Privacidade
                    </a>{" "}e{" "}
                    <a href="/termos-de-uso" target="_blank" rel="noopener noreferrer"
                      className="underline font-medium" style={{ color: "var(--blue)" }}>
                      Termos de Uso
                    </a>.
                  </span>
                </label>
                {erroConsentimento && (
                  <p className="mt-2 text-xs font-medium flex items-center gap-1" style={{ color: "var(--danger)" }}>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Você precisa aceitar para continuar.
                  </p>
                )}
              </div>

              {/* ── Erro de envio ─────────────────────────────────────── */}
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

              {/* ── Botões ───────────────────────────────────────────── */}
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
                      Ver minha análise gratuita
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
