import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getDb } from "@/lib/firebase";
import { gerarRelatorioPDF } from "@/lib/pdf-generator";
import type { RespostaAnalise } from "@/types";

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY não configurado.");
  return new Resend(key);
}

// ─── Template HTML do email ───────────────────────────────────────────────────

function htmlEmail(nome: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F2F3F4;font-family:Arial,Helvetica,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F2F3F4;padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">

        <!-- Cabeçalho -->
        <tr><td style="background:#1B4F72;padding:28px 40px">
          <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700">AuditCrédito</p>
          <p style="margin:4px 0 0;color:#AED6F1;font-size:12px">Ferramenta educacional independente</p>
        </td></tr>

        <!-- Corpo -->
        <tr><td style="padding:36px 40px">
          <h1 style="margin:0 0 8px;color:#1C2833;font-size:20px;font-weight:700">
            Seu relatório está pronto, ${nome.split(" ")[0]}!
          </h1>
          <p style="margin:0 0 20px;color:#5D6D7E;font-size:14px">
            Obrigado por usar o AuditCrédito. Seu relatório de análise comparativa de taxas de juros está em anexo neste e-mail.
          </p>

          <div style="background:#EBF5FB;border-left:4px solid #2E86C1;border-radius:4px;padding:16px 20px;margin-bottom:24px">
            <p style="margin:0 0 8px;color:#1B4F72;font-size:13px;font-weight:700">📄 O que está no relatório</p>
            <ul style="margin:0;padding-left:20px;color:#1C2833;font-size:13px;line-height:1.8">
              <li>Comparativo entre a taxa cobrada e a taxa média do Banco Central</li>
              <li>Cálculo detalhado usando a fórmula de juros compostos</li>
              <li>Modelo de Requerimento Administrativo para enviar ao banco</li>
              <li>Guia passo a passo de negociação e canais gratuitos</li>
              <li>Referências legais (CDC, Súmula 297 do STJ)</li>
            </ul>
          </div>

          <p style="margin:0 0 8px;color:#1C2833;font-size:14px;font-weight:700">Como usar o relatório:</p>
          <ol style="margin:0 0 24px;padding-left:20px;color:#5D6D7E;font-size:13px;line-height:2">
            <li>Abra o PDF em anexo e leia o resumo na Página 2.</li>
            <li>Use o modelo de requerimento (Página 4) para entrar em contato com o banco.</li>
            <li>Caso não obtenha retorno, acesse os canais gratuitos listados na Página 4.</li>
          </ol>

          <div style="background:#EAFAF1;border-radius:8px;padding:16px 20px;margin-bottom:24px">
            <p style="margin:0 0 10px;color:#1E8449;font-size:13px;font-weight:700">🔗 Recursos gratuitos úteis</p>
            <table cellpadding="0" cellspacing="0">
              <tr><td style="padding:3px 0">
                <a href="https://www.consumidor.gov.br/" style="color:#2E86C1;font-size:13px;text-decoration:none">
                  ▸ consumidor.gov.br — Reclamações online gratuitas
                </a>
              </td></tr>
              <tr><td style="padding:3px 0">
                <a href="https://www3.bcb.gov.br/CALCJUROS/" style="color:#2E86C1;font-size:13px;text-decoration:none">
                  ▸ Calculadora do Cidadão — Banco Central do Brasil
                </a>
              </td></tr>
              <tr><td style="padding:3px 0">
                <a href="https://www.consumidor.gov.br/pages/conteudo/publico/5" style="color:#2E86C1;font-size:13px;text-decoration:none">
                  ▸ Encontre o PROCON do seu estado
                </a>
              </td></tr>
            </table>
          </div>

          <div style="background:#FEF9E7;border-radius:8px;padding:14px 20px">
            <p style="margin:0;color:#D35400;font-size:12px">
              <strong>Garantia de 7 dias:</strong> Se por qualquer motivo você não ficar satisfeito, envie um e-mail para nós dentro de 7 dias corridos e faremos o reembolso integral, sem perguntas.
            </p>
          </div>
        </td></tr>

        <!-- Disclaimer -->
        <tr><td style="background:#F2F3F4;padding:20px 40px">
          <p style="margin:0;color:#7F8C8D;font-size:11px;line-height:1.6">
            Este documento é informativo e não constitui parecer jurídico, financeiro ou legal. A análise compara a taxa informada com dados públicos do Banco Central do Brasil. Para ações formais de contestação, recomendamos consultar um advogado especializado.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Corpo inválido." }, { status: 400 });
  }

  const analiseId = typeof body.analiseId === "string" ? body.analiseId : undefined;
  const emailDest  = typeof body.email     === "string" ? body.email     : undefined;

  if (!analiseId) {
    return NextResponse.json({ message: "analiseId é obrigatório." }, { status: 400 });
  }

  // ── Buscar dados da análise ─────────────────────────────────────────────────

  let dados: RespostaAnalise | null = null;
  const db = getDb();

  if (db) {
    const snap = await db.collection("analises").doc(analiseId).get();
    if (!snap.exists) {
      return NextResponse.json({ message: "Análise não encontrada." }, { status: 404 });
    }
    dados = snap.data() as RespostaAnalise;
  }

  // Fallback: dados enviados diretamente no corpo (dev/demo)
  if (!dados && body.resultado && body.contrato) {
    dados = body as unknown as RespostaAnalise;
  }

  if (!dados) {
    return NextResponse.json(
      { message: "Dados da análise não disponíveis. Configure o Firebase ou envie os dados no corpo." },
      { status: 422 }
    );
  }

  const destinatario = emailDest ?? dados.email;
  if (!destinatario) {
    return NextResponse.json({ message: "E-mail do destinatário não encontrado." }, { status: 422 });
  }

  // ── Gerar PDF ───────────────────────────────────────────────────────────────

  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await gerarRelatorioPDF(dados);
  } catch (err) {
    console.error("[enviar-email] Erro ao gerar PDF:", err);
    return NextResponse.json({ message: "Erro ao gerar o relatório PDF." }, { status: 500 });
  }

  // ── Enviar email via Resend ─────────────────────────────────────────────────

  const nomeArquivo = `auditcredito-relatorio-${analiseId.slice(0, 8)}.pdf`;

  try {
    const resend = getResend();
    const { error } = await resend.emails.send({
      from:    "AuditCrédito <noreply@auditcredito.com.br>",
      to:      [destinatario],
      subject: "Seu Relatório de Análise de Taxas está pronto",
      html:    htmlEmail(dados.nome),
      attachments: [{
        filename: nomeArquivo,
        content:  pdfBuffer,
      }],
    });

    if (error) {
      throw new Error(error.message);
    }

    const emailMask = destinatario.replace(/(.{2}).+(@.+)/, "$1***$2");
    console.log(`[enviar-email] Enviado para ${emailMask} | análise ${analiseId}`);

    // Registrar envio no Firestore
    if (db) {
      db.collection("analises").doc(analiseId).update({
        emailEnviadoEm: new Date().toISOString(),
        emailDestinatario: destinatario,
      }).catch((e) => console.error("[enviar-email] Firestore update error:", e));
    }

    return NextResponse.json({ message: "Email enviado com sucesso.", destinatario });

  } catch (err) {
    console.error("[enviar-email] Erro no Resend:", err);

    // Fallback: salvar PDF como base64 no Firestore para acesso direto
    if (db) {
      try {
        await db.collection("analises").doc(analiseId).update({
          pdfBase64:       pdfBuffer.toString("base64"),
          pdfFalhaEmail:   new Date().toISOString(),
          pdfDestinatario: destinatario,
        });
        console.log("[enviar-email] Fallback: PDF salvo no Firestore.");
      } catch (fbErr) {
        console.error("[enviar-email] Fallback Firestore também falhou:", fbErr);
      }
    }

    return NextResponse.json(
      { message: "Falha ao enviar email. PDF salvo para acesso direto." },
      { status: 502 }
    );
  }
}
