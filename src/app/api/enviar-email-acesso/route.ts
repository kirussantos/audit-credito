/**
 * /api/enviar-email-acesso
 *
 * Fallback de entrega: enviado quando o webhook recebe um pagamento aprovado
 * mas não consegue associar um analiseId (utm_content vazio).
 *
 * Envia email informando que o acesso foi liberado e orienta o cliente a
 * voltar ao site para refazer a análise gratuitamente.
 */

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY não configurado.");
  return new Resend(key);
}

function htmlAcesso(nome: string): string {
  const primeiroNome = nome.split(" ")[0];
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F2F3F4;font-family:Arial,Helvetica,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F2F3F4;padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
        style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">

        <!-- Cabeçalho -->
        <tr><td style="background:#1B4F72;padding:28px 40px">
          <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700">AuditCrédito</p>
          <p style="margin:4px 0 0;color:#AED6F1;font-size:12px">Ferramenta educacional independente</p>
        </td></tr>

        <!-- Corpo -->
        <tr><td style="padding:36px 40px">
          <h1 style="margin:0 0 8px;color:#1C2833;font-size:20px;font-weight:700">
            Olá, ${primeiroNome}! Sua compra foi confirmada ✓
          </h1>
          <p style="margin:0 0 20px;color:#5D6D7E;font-size:14px">
            Recebemos a confirmação do seu pagamento. Para gerar seu relatório personalizado,
            siga o passo a passo abaixo — leva menos de 2 minutos.
          </p>

          <div style="background:#EBF5FB;border-left:4px solid #2E86C1;border-radius:4px;padding:16px 20px;margin-bottom:24px">
            <p style="margin:0 0 10px;color:#1B4F72;font-size:13px;font-weight:700">📋 Como acessar seu relatório</p>
            <ol style="margin:0;padding-left:20px;color:#1C2833;font-size:13px;line-height:2.2">
              <li>Acesse <a href="https://www.auditcredito.com.br" style="color:#2E86C1">www.auditcredito.com.br</a></li>
              <li>Preencha o formulário com os dados do seu contrato</li>
              <li>Clique em <strong>"Analisar meu contrato"</strong></li>
              <li>Na tela de resultado, clique em <strong>"Baixar meu relatório"</strong></li>
              <li>Seu PDF será gerado e enviado para <strong>${nome}</strong> imediatamente</li>
            </ol>
          </div>

          <div style="background:#EAFAF1;border-radius:8px;padding:16px 20px;margin-bottom:24px">
            <p style="margin:0 0 8px;color:#1E8449;font-size:13px;font-weight:700">✅ O que você vai receber</p>
            <ul style="margin:0;padding-left:20px;color:#1C2833;font-size:13px;line-height:1.8">
              <li>Comparativo da sua taxa com a média do Banco Central do Brasil</li>
              <li>Análise jurídica personalizada gerada por Inteligência Artificial</li>
              <li>Modelo de Requerimento Administrativo editável</li>
              <li>Guia passo a passo de negociação com o banco</li>
            </ul>
          </div>

          <div style="background:#FEF9E7;border-radius:8px;padding:14px 20px">
            <p style="margin:0;color:#D35400;font-size:12px">
              <strong>Garantia de 7 dias:</strong> Se não ficar satisfeito, responda este
              e-mail dentro de 7 dias corridos e faremos o reembolso integral.
            </p>
          </div>
        </td></tr>

        <!-- Rodapé -->
        <tr><td style="background:#F2F3F4;padding:20px 40px">
          <p style="margin:0;color:#7F8C8D;font-size:11px;line-height:1.6">
            Dúvidas? Responda este e-mail. Este documento é informativo e não constitui
            parecer jurídico ou financeiro.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Corpo inválido." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const nome  = typeof body.nome  === "string" ? body.nome.trim()  : "Cliente";

  if (!email) {
    return NextResponse.json({ message: "email é obrigatório." }, { status: 400 });
  }

  try {
    const resend = getResend();
    const { error } = await resend.emails.send({
      from:    "AuditCrédito <noreply@auditcredito.com.br>",
      to:      [email],
      subject: "Sua compra foi confirmada — acesse seu relatório aqui",
      html:    htmlAcesso(nome),
    });

    if (error) throw new Error(error.message);

    console.log(`[enviar-email-acesso] Email de acesso enviado para ${email}`);
    return NextResponse.json({ message: "Email de acesso enviado." });

  } catch (err) {
    console.error("[enviar-email-acesso] Erro:", err);
    return NextResponse.json(
      { message: "Falha ao enviar email de acesso." },
      { status: 502 },
    );
  }
}
