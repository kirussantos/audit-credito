# COMPLIANCE_REPORT — AuditCrédito
**Agente:** Compliance  
**Data:** 2026-04-28  
**Escopo:** Revisão completa de LGPD, CDC, Copy, Meta Ads e Segurança Técnica  
**Resultado:** 8 itens CORRIGIDOS nesta execução | 5 itens pendentes de ação humana

---

## RESUMO EXECUTIVO

| Categoria         | OK  | Corrigido aqui | Pendente (ação humana) |
|-------------------|-----|----------------|------------------------|
| LGPD              | 3   | 5              | 3                      |
| CDC               | 4   | 0              | 2                      |
| Copy / Disclaimers| 8   | 1              | 0                      |
| Meta Ads          | 4   | 0              | 0 (externo ao código)  |
| Segurança Técnica | 5   | 3              | 1                      |
| **TOTAL**         | **24** | **9**        | **6**                  |

---

## 1. REVISÃO LGPD

### 1.1 Coleta de CPF
| Status | Prioridade |
|--------|-----------|
| ✅ OK — Corrigido em execução anterior | Alta |

**Verificação:** O schema Zod (`validations.ts`) coleta apenas: `nome`, `email`, `tipoCredito`, `instituicao`, `valorDivida`, `taxaJurosMensal`, `dataContrato`, `mesesAtraso`. Nenhum CPF ou RG.

**Nota:** O modelo de requerimento no PDF contém `[SEU CPF]` como **placeholder** que o usuário preenche manualmente offline — não é coletado pelo sistema. Correto.

---

### 1.2 Página /politica-de-privacidade
| Status | Prioridade |
|--------|-----------|
| ✅ IMPLEMENTADO nesta execução | Alta |

**Ação realizada:** Criado `src/app/politica-de-privacidade/page.tsx` com:
- Identificação dos dados coletados (nome, email, dados da dívida, IP)
- Base legal: consentimento explícito (LGPD art. 7º, I)
- Prazo de retenção: 90 dias para dados de análise, 30 dias para IP
- Direitos do titular (acesso, correção, exclusão, portabilidade, revogação)
- Prestadores de serviço (Resend, Firebase/Google)
- Contato: privacidade@auditcredito.com.br

---

### 1.3 Página /termos-de-uso
| Status | Prioridade |
|--------|-----------|
| ✅ IMPLEMENTADO nesta execução | Alta |

**Ação realizada:** Criado `src/app/termos-de-uso/page.tsx` com:
- Natureza informativa e educacional do serviço
- Limitações explícitas (sem valor jurídico, sem limpar nome)
- Direito de arrependimento 7 dias (CDC art. 49)
- Identificação do fornecedor (campo CNPJ marcado como "a definir")
- Foro competente

---

### 1.4 Banner de consentimento de cookies
| Status | Prioridade |
|--------|-----------|
| ⚠️ PENDENTE — Ação humana necessária | Média |

**Situação:** O projeto usa apenas cookies de sessão do Next.js (estritamente necessários). Não há rastreamento de terceiros. A política de privacidade já documenta isso.

**Ação recomendada:** Implementar banner simples de cookies antes do lançamento, mesmo que apenas para informar uso de cookies de sessão. Exemplo de lib: `react-cookie-consent`. Baixa complexidade técnica.

---

### 1.5 Consentimento explícito do usuário (base legal LGPD)
| Status | Prioridade |
|--------|-----------|
| ✅ IMPLEMENTADO nesta execução | Alta |

**Ação realizada:** Adicionado checkbox de consentimento LGPD no step 2 do `FormularioAuditoria.tsx`:
- Texto claro: "Concordo com o uso dos dados informados exclusivamente para gerar esta análise"
- Links para Política de Privacidade e Termos de Uso
- Validação: submissão bloqueada sem aceite
- Mensagem de erro se tentar enviar sem consentimento

---

### 1.6 Retenção de dados — prazo definido
| Status | Prioridade |
|--------|-----------|
| ✅ IMPLEMENTADO nesta execução | Alta |

**Ação realizada:** Prazo de 90 dias documentado na Política de Privacidade. 

**Ação recomendada (pendente):** Implementar job de exclusão automática no Firestore (ex: Cloud Scheduler + Cloud Function) que exclua documentos com `geradoEm` > 90 dias. Atualmente a exclusão é apenas documental.

---

### 1.7 IP armazenado no Firestore
| Status | Prioridade |
|--------|-----------|
| ⚠️ PENDENTE — Ação humana necessária | Média |

**Situação:** O `route.ts /api/calcular` salva o IP do usuário no Firestore para controle de rate limit. IP é dado pessoal sob LGPD.

**Base legal:** Legítimo interesse para segurança (LGPD art. 7º, IX), mas deve ser documentado.

**Ação realizada:** Documentado na Política de Privacidade (seção 2 e 4 — retenção 30 dias).

**Ação recomendada:** Implementar exclusão automática do campo `ip` após 30 dias, ou hash o IP antes de armazenar (ex: `crypto.createHash('sha256').update(ip + SALT).digest('hex')`).

---

### 1.8 Logs sem dados pessoais
| Status | Prioridade |
|--------|-----------|
| ✅ CORRIGIDO nesta execução | Alta |

**Problema encontrado:** 
- `enviar-email/route.ts` logava o e-mail completo do destinatário
- `webhook/route.ts` logava até 500 chars do payload (poderia conter e-mail)

**Ação realizada:**
- `enviar-email`: e-mail agora é mascarado (`us***@email.com`)
- `webhook`: log agora exibe apenas as chaves do payload (nunca os valores)

---

## 2. REVISÃO CDC

### 2.1 Promessas de resultado
| Status | Prioridade |
|--------|-----------|
| ✅ OK | Alta |

Nenhuma promessa de resultado encontrada. O FAQ da landing page inclui explicitamente: *"Não. Esta ferramenta não limpa meu nome..."* e *"Não. É uma análise informativa..."*. O PDF (pág. 3) contém seção *"Estar acima da média NÃO é automaticamente ilegal"*.

---

### 2.2 Práticas enganosas (art. 37)
| Status | Prioridade |
|--------|-----------|
| ✅ OK | Alta |

Nenhuma prática enganosa encontrada. Preço (R$ 19,90) exibido claramente sem âncoras falsas. Sem urgência artificial ("últimas vagas", contadores fake). A análise gratuita é genuinamente gratuita.

---

### 2.3 Informações claras sobre o produto (art. 31)
| Status | Prioridade |
|--------|-----------|
| ✅ OK | Alta |

A landing page descreve claramente: o que é o produto, o que está incluído na análise gratuita, o que está incluído no relatório pago, de onde vêm os dados, e as limitações.

---

### 2.4 Direito de arrependimento 7 dias informado
| Status | Prioridade |
|--------|-----------|
| ✅ OK | Alta |

Mencionado em: landing page (footer), email template, `BotaoCheckout.tsx`, e `termos-de-uso/page.tsx` (art. 49 CDC citado explicitamente).

---

### 2.5 Identificação do fornecedor — CNPJ
| Status | Prioridade |
|--------|-----------|
| ⚠️ PENDENTE — Ação humana necessária | **Alta** |

**Problema:** CNPJ consta como "a definir" em `page.tsx`, `termos-de-uso/page.tsx` e `obrigado/ObrigadoConteudo.tsx`. A atividade comercial (venda de produto digital) exige CNPJ válido registrado.

**Ação recomendada:** Abrir MEI ou empresa e atualizar todos os arquivos com o CNPJ real antes do lançamento comercial.

**Arquivos a atualizar:**
- `src/app/page.tsx` (footer)
- `src/app/termos-de-uso/page.tsx` (seção 8)
- `src/app/api/enviar-email/route.ts` (remetente do e-mail)

---

### 2.6 Endereço físico do fornecedor
| Status | Prioridade |
|--------|-----------|
| ⚠️ PENDENTE — Ação humana necessária | Alta |

**Problema:** O CDC exige identificação do fornecedor com endereço. Atualmente consta apenas e-mail e CNPJ "a definir".

**Ação recomendada:** Incluir endereço completo nos Termos de Uso e footer após abertura da empresa.

---

## 3. REVISÃO DE COPY

### 3.1 Termos proibidos
| Status | Prioridade |
|--------|-----------|
| ✅ OK | Alta |

Varredura realizada em todos os arquivos `.ts` e `.tsx`:

| Termo proibido | Resultado |
|---------------|-----------|
| "laudo" | ❌ Não encontrado |
| "auditoria oficial" | ❌ Não encontrado |
| "documento autenticado" | ❌ Não encontrado |
| "força legal" | ❌ Não encontrado |
| "derrubar dívida" | ❌ Não encontrado |
| "limpar nome garantido" | ❌ Não encontrado |
| "conectando ao Banco Central" (acesso especial) | ❌ Não encontrado |

**Nota sobre o nome "AuditCrédito":** O uso de "auditoria" é como marca, não como afirmação de auditoria oficial ou certificada. Aceitável desde que nunca acompanhado de "oficial", "certificada" ou similar.

---

### 3.2 Status "Potencialmente abusivo"
| Status | Prioridade |
|--------|-----------|
| ✅ CORRIGIDO nesta execução | Alta |

**Problema:** `ResultadoAuditoria.tsx` usava o rótulo `"Potencialmente abusivo"` na interface web — linguagem jurídica que pode induzir interpretação equivocada.

**Ação realizada:** Alterado para `"Significativamente acima da média"` — factual, sem julgamento jurídico.

**Nota:** O PDF já usava `"POTENCIALMENTE ACIMA DA MÉDIA"` (mais cuidadoso). Agora ambos estão alinhados com linguagem não-jurídica.

---

### 3.3 Disclaimers em todas as superfícies
| Status | Prioridade |
|--------|-----------|
| ✅ OK | Alta |

| Superfície | Disclaimer presente |
|-----------|---------------------|
| Página de resultado (`ResultadoAuditoria.tsx`) | ✅ Completo com série SGS e data |
| PDF — rodapé de cada página | ✅ "Documento informativo. Não constitui parecer jurídico." |
| PDF — capa (página 1) | ✅ Disclaimer completo em caixa destacada |
| PDF — página 3 | ✅ Seção dedicada: "Estar acima da média NÃO é automaticamente ilegal" |
| Landing page — footer | ✅ Aviso legal completo |
| E-mail transacional | ✅ Parágrafo de disclaimer no rodapé |
| Termos de Uso | ✅ Seção 2 com box de atenção |

---

### 3.4 FAQ responde honestamente às perguntas-chave
| Status | Prioridade |
|--------|-----------|
| ✅ OK | Alta |

| Pergunta | Resposta |
|---------|---------|
| "Isso limpa meu nome?" | ✅ "Não. Esta ferramenta compara taxas..." |
| "O relatório tem valor jurídico?" | ✅ "Não. É uma análise informativa..." |
| "De onde vêm os dados?" | ✅ "Diretamente da API pública do BCB (SGS)" |
| "Preciso pagar?" | ✅ Análise gratuita; relatório R$ 19,90 |
| "Meus dados ficam armazenados?" | ✅ Explicação clara + link para política |

---

## 4. REVISÃO META ADS COMPLIANCE

*Nota: Não há criativos de anúncios no codebase. Esta seção documenta as diretrizes para uso externo.*

### 4.1 Simulação de notícia ou portal oficial
| Status | Prioridade |
|--------|-----------|
| ✅ OK (design não imita portais gov) | Alta |

O design é de fintech moderna (azul escuro, branco, verde). Sem elementos que imitem G1, UOL, portais governamentais ou notícias jornalísticas.

---

### 4.2 Promessas de resultado financeiro específico
| Status | Prioridade |
|--------|-----------|
| ✅ OK — Evitar nos criativos | Alta |

**Proibido nos anúncios:**
- ❌ "Recupere R$ X do seu banco"
- ❌ "Banco te deve dinheiro — descubra quanto"
- ❌ "Ganhe na Justiça contra o banco"

**Criativos seguros aprovados:**
- ✅ "Você sabe qual é a taxa média de juros do seu banco? Descubra gratuitamente."
- ✅ "Compare sua taxa de juros com os dados oficiais do Banco Central."
- ✅ "Ferramenta gratuita de comparação de taxas de juros — dados do BCB."
- ✅ "Sua taxa de juros está dentro da média? Compare agora — é grátis."

---

### 4.3 Cloaker ou redirecionamento enganoso
| Status | Prioridade |
|--------|-----------|
| ✅ OK | Alta |

Nenhum mecanismo de cloaking no codebase. Todas as rotas são diretas.

---

### 4.4 Copy informativa, não sensacionalista
| Status | Prioridade |
|--------|-----------|
| ✅ OK | Média |

A landing page usa linguagem direta e informativa. O subtítulo "sem promessas vazias" é diferenciador positivo para Meta Ads compliance.

---

## 5. REVISÃO TÉCNICA DE SEGURANÇA

### 5.1 Validação de input em todos os endpoints (Zod)
| Status | Prioridade |
|--------|-----------|
| ✅ OK | Alta |

| Endpoint | Validação |
|---------|-----------|
| `POST /api/calcular` | ✅ `schemaFormulario.safeParse()` com erros estruturados |
| `POST /api/gerar-pdf` | ✅ Verifica `analiseId` (string) + fallback Firestore |
| `POST /api/enviar-email` | ✅ Verifica `analiseId` e `email` (typeof string) |
| `POST /api/webhook` | ✅ `normalizarPayload()` — rejeita graciosamente formatos desconhecidos |

---

### 5.2 Rate limiting
| Status | Prioridade |
|--------|-----------|
| ✅ OK (com limitação documentada) | Alta |

Implementado: 10 req/hora por IP, in-memory Map. Retorna HTTP 429 com mensagem clara.

**Limitação conhecida:** Rate limit é por processo Node.js. Em ambiente multi-worker (ex: Vercel com múltiplas instâncias), um usuário pode fazer até `10 × N_workers` requisições. Documentado no código. Para produção com tráfego alto, substituir por Redis (ex: Upstash).

---

### 5.3 Webhook com validação de assinatura
| Status | Prioridade |
|--------|-----------|
| ✅ OK | Alta |

Suporta três métodos de validação via `CHECKOUT_WEBHOOK_SECRET`:
- Header `Hottok` (Hotmart)
- Query param `?token=` (Kiwify)
- Header `X-Webhook-Token` (genérico)

Sem secret configurado → aceita em dev (documentado). Em produção, obrigatório configurar.

---

### 5.4 Logs sem dados sensíveis
| Status | Prioridade |
|--------|-----------|
| ✅ CORRIGIDO nesta execução | Alta |

**Problema encontrado e corrigido:**
- `enviar-email/route.ts`: e-mail agora mascarado em logs
- `webhook/route.ts`: payload reduzido a chaves (sem valores)

---

### 5.5 HTTPS obrigatório
| Status | Prioridade |
|--------|-----------|
| ✅ OK (configurado via headers) | Alta |

Adicionado header `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` no `next.config.ts`. HTTPS em si é provido pela plataforma de hospedagem (Vercel, Railway, etc.).

---

### 5.6 Headers de segurança HTTP
| Status | Prioridade |
|--------|-----------|
| ✅ IMPLEMENTADO nesta execução | Alta |

**Ação realizada:** `next.config.ts` agora inclui os seguintes headers em todas as rotas:

| Header | Valor |
|--------|-------|
| `X-Frame-Options` | `SAMEORIGIN` — previne clickjacking |
| `X-Content-Type-Options` | `nosniff` — previne MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | camera/mic/geolocation desabilitados |
| `Strict-Transport-Security` | HTTPS forçado por 2 anos |
| `Content-Security-Policy` | `default-src 'self'` + whitelist BCB/Firebase |

---

### 5.7 Exposição de dados sensíveis em respostas de API
| Status | Prioridade |
|--------|-----------|
| ⚠️ ATENÇÃO — Avaliar antes do lançamento | Média |

**Situação:** O endpoint `POST /api/calcular` retorna o objeto `RespostaAnalise` completo incluindo `nome` e `email` do usuário no response body. Esses dados são armazenados em `sessionStorage` no cliente.

**Avaliação:** `sessionStorage` é isolado por origem e aba — não persiste entre sessões. Aceitável para o fluxo atual. Não há risco de vazamento entre usuários.

**Recomendação:** Em versão futura, considerar retornar apenas o `id` da análise e fazer fetch separado para exibição, evitando dados pessoais no sessionStorage.

---

### 5.8 Metadados do layout (lang e title)
| Status | Prioridade |
|--------|-----------|
| ✅ CORRIGIDO nesta execução | Média |

**Problemas encontrados e corrigidos em `layout.tsx`:**
- `lang="en"` → `lang="pt-BR"`
- `title: "Create Next App"` → título descritivo do produto
- `description: "Generated by create next app"` → meta description real para SEO

---

## 6. ITENS PENDENTES — REQUEREM AÇÃO HUMANA

| # | Item | Prioridade | Prazo recomendado |
|---|------|-----------|-------------------|
| 1 | **Registrar CNPJ** (MEI ou empresa) e atualizar em todos os arquivos | **Alta** | Antes do lançamento comercial |
| 2 | **Incluir endereço físico** no footer e nos Termos de Uso | Alta | Com o CNPJ |
| 3 | **Implementar banner de cookies** (pode ser simples — apenas session cookies) | Média | Antes do lançamento |
| 4 | **Job de exclusão automática** no Firestore (90 dias para análises, 30 dias para IP) | Média | 30 dias após lançamento |
| 5 | **Hash do IP** antes de armazenar no Firestore | Média | Versão 1.1 |
| 6 | **Rate limit distribuído** (Redis/Upstash) se usar múltiplos workers | Baixa | Quando escalar |

---

## 7. CHECKLIST FINAL DE LANÇAMENTO

### Obrigatório antes de vender
- [x] Sem CPF coletado
- [x] Política de privacidade publicada
- [x] Termos de uso publicados
- [x] Consentimento explícito no formulário
- [x] Disclaimer em todas as superfícies
- [x] FAQ honesto (limpar nome, valor jurídico)
- [x] Direito de arrependimento 7 dias informado
- [x] Headers de segurança HTTP
- [x] Validação de input (Zod) em todos endpoints
- [x] Rate limiting ativo
- [x] Webhook com validação de secret
- [x] Logs sem dados pessoais
- [ ] **CNPJ real** cadastrado e exibido
- [ ] **Endereço físico** do fornecedor
- [ ] **Banner de cookies** implementado
- [ ] Variável `CHECKOUT_WEBHOOK_SECRET` configurada em produção
- [ ] Variável `RESEND_API_KEY` configurada em produção
- [ ] Variável `FIREBASE_SERVICE_ACCOUNT_KEY` configurada (ou aceitar modo sem Firestore)

### Recomendado (pode lançar sem, mas implementar logo depois)
- [ ] Job de exclusão automática no Firestore
- [ ] Hash do IP antes de armazenar
- [ ] Rate limit com Redis para múltiplos workers
- [ ] E-mail `privacidade@auditcredito.com.br` configurado e monitorado

---

*Relatório gerado pelo Agente Compliance em 2026-04-28.*  
*Próxima revisão recomendada: após registro do CNPJ e antes do primeiro anúncio pago.*
