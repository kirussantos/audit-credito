// ─────────────────────────────────────────────────────────────────────────────
// artigos.ts — Blog do AuditCredito
// Conteúdo educacional sobre juros bancários, direitos do consumidor e
// auditoria de contratos de crédito no Brasil.
// ─────────────────────────────────────────────────────────────────────────────

export type Secao =
  | { tipo: "intro"; paragrafos: string[] }
  | { tipo: "h2"; titulo: string; paragrafos: string[] }
  | { tipo: "lista"; titulo: string; itens: string[] }
  | { tipo: "destaque"; texto: string }
  | { tipo: "tabela"; cabecalhos: string[]; linhas: string[][] }
  | { tipo: "cta" }
  | { tipo: "faq"; itens: { q: string; r: string }[] }

export type Artigo = {
  slug: string
  titulo: string
  descricao: string
  dataPublicacao: string
  tempoLeitura: number
  categoria: string
  palavrasChave: string[]
  secoes: Secao[]
}

// ─────────────────────────────────────────────────────────────────────────────
// ARTIGOS
// ─────────────────────────────────────────────────────────────────────────────

export const artigos: Artigo[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // 1. juros-abusivos-como-identificar
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "juros-abusivos-como-identificar",
    titulo: "Juros Abusivos: Como Identificar Se o Banco Está Cobrando Demais",
    descricao:
      "Saiba o que são juros abusivos, quais sinais indicam cobrança excessiva pelo banco e como a legislação brasileira protege você nessa situação.",
    dataPublicacao: "2025-04-10",
    tempoLeitura: 7,
    categoria: "Educação Financeira",
    palavrasChave: [
      "juros abusivos",
      "como identificar juros abusivos",
      "banco cobrando demais",
      "CDC art 51",
      "taxa de juros contrato",
    ],
    secoes: [
      {
        tipo: "intro",
        paragrafos: [
          "Você já olhou para a parcela do seu empréstimo e teve aquela sensação de que algo não estava certo? Que o valor estava alto demais em relação ao que você pegou emprestado? Essa intuição pode estar correta. No Brasil, o problema dos juros abusivos em contratos bancários é muito mais comum do que a maioria das pessoas imagina.",
          "Juros abusivos são, em linguagem simples, taxas de juros cobradas em um nível tão elevado que causam desequilíbrio entre o que o banco ganha e o que o consumidor paga — beneficiando apenas uma das partes do contrato de forma desproporcional. A lei brasileira reconhece essa prática e oferece mecanismos de proteção ao consumidor.",
          "Neste artigo, você vai aprender a reconhecer os sinais de alerta, entender o que a lei diz e descobrir o que pode fazer se suspeitar que está pagando mais do que deveria.",
        ],
      },
      {
        tipo: "h2",
        titulo: "O que exatamente são juros abusivos?",
        paragrafos: [
          "A taxa de juros é o preço que você paga por usar o dinheiro de outra pessoa — no caso, do banco. Ela existe e é legítima. O problema começa quando essa taxa sobe a um patamar tão alto que foge completamente da realidade do mercado.",
          "O Banco Central do Brasil (BCB) publica mensalmente as taxas médias cobradas em cada tipo de crédito: empréstimo pessoal, crédito consignado, cheque especial, cartão de crédito rotativo, financiamento de veículos, entre outros. Esses dados são públicos e estão disponíveis no site do Banco Central. Quando a taxa do seu contrato está significativamente acima da média daquele tipo de crédito naquele período, há um sinal claro de possível abuso.",
          "Importante: uma taxa acima da média não é automaticamente ilegal, pois a legislação brasileira não fixou um teto geral para juros bancários (exceto em modalidades específicas, como o cheque especial e o crédito consignado do INSS). Porém, o Código de Defesa do Consumidor (CDC) prevê que cláusulas contratuais que coloquem o consumidor em desvantagem exagerada podem ser anuladas na Justiça.",
        ],
      },
      {
        tipo: "destaque",
        texto:
          "O Art. 51 do CDC declara nulas de pleno direito as cláusulas contratuais que 'estabeleçam obrigações consideradas iníquas, abusivas, que coloquem o consumidor em desvantagem exagerada, ou sejam incompatíveis com a boa-fé ou a equidade'.",
      },
      {
        tipo: "lista",
        titulo: "5 sinais de alerta que indicam juros abusivos no seu contrato",
        itens: [
          "Sua taxa está muito acima da média do BCB: se a média do mercado para empréstimo pessoal está em determinada faixa e o banco cobrou de você um valor duas, três ou mais vezes superior, isso é um sinal grave. Consulte as Notas de Crédito publicadas mensalmente pelo Banco Central para comparar.",
          "O contrato não discrimina a taxa de juros de forma clara: todo contrato de crédito deve informar a taxa de juros mensal e anual de forma expressa. Se você assinou um documento que só mostra o valor da parcela sem detalhar a taxa, seus direitos de informação previstos no CDC (Art. 6, inciso III) foram violados.",
          "A taxa mudou sem que você fosse avisado: contratos com taxa pós-fixada podem prever variação, mas o banco é obrigado a comunicar o consumidor com antecedência sobre alterações. Variações unilaterais e sem aviso prévio são práticas abusivas.",
          "O valor total a pagar é muito maior do que o esperado: em crédito com juros compostos — que é a regra no Brasil — o custo total cresce rapidamente. Mas se ao somar todas as parcelas o total for mais do que o dobro ou o triplo do valor que você tomou emprestado, vale revisar o contrato com atenção.",
          "Você não recebeu cópia do contrato: o Art. 46 do CDC diz que o consumidor não está obrigado a cumprir cláusulas de um contrato se não tiver tido oportunidade de tomar conhecimento prévio do seu conteúdo. Negar a cópia do contrato ao consumidor é ilegal.",
        ],
      },
      {
        tipo: "h2",
        titulo: "O que diz a legislação brasileira",
        paragrafos: [
          "O Código de Defesa do Consumidor (Lei nº 8.078/1990) é a principal proteção do consumidor bancário. O Art. 51 do CDC lista as cláusulas que são nulas de pleno direito, incluindo aquelas que impliquem renúncia de direitos ou que coloquem o consumidor em desvantagem exagerada. Juros muito acima do mercado se enquadram nessa categoria segundo entendimento consolidado nos tribunais brasileiros.",
          "O Superior Tribunal de Justiça (STJ) já pacificou o entendimento, através da Súmula 382, de que a estipulação de juros remuneratórios superiores a 12% ao ano por si só não indica abusividade — ou seja, o juiz deve comparar a taxa cobrada com a média do mercado para aquele tipo de crédito. Por isso, a comparação com os dados do Banco Central é tão importante: ela é o próprio critério que os tribunais usam.",
          "Além do CDC, o Banco Central edita resoluções que regulamentam o sistema financeiro. A Resolução CMN nº 4.558/2017, por exemplo, determina que as instituições financeiras devem fornecer ao cliente informações claras sobre as condições do crédito antes da contratação, incluindo o Custo Efetivo Total (CET), que representa o custo real do crédito levando em conta juros, tarifas e seguros.",
        ],
      },
      {
        tipo: "h2",
        titulo: "O que fazer se você suspeitar de juros abusivos",
        paragrafos: [
          "O primeiro passo é reunir toda a documentação do seu contrato: a proposta assinada, o extrato de pagamentos realizados, o demonstrativo de débitos se houver saldo devedor em aberto. Com esses documentos em mãos, é possível calcular a taxa efetiva que está sendo cobrada e compará-la com a média do Banco Central para o mesmo período.",
          "Esse cálculo não é simples de fazer manualmente, mas ferramentas especializadas — como a auditoria oferecida pelo AuditCredito — fazem esse trabalho de forma automática, comparando a taxa do seu contrato com os dados oficiais do BCB e gerando um laudo detalhado que pode ser usado em negociações com o banco ou em ações judiciais.",
          "Se confirmada a abusividade, você pode: negociar diretamente com o banco, registrar reclamação na ouvidoria da instituição, acionar o PROCON, abrir reclamação no consumidor.gov.br, recorrer ao Banco Central pelo serviço Fale com o BC, ou ingressar com ação judicial para revisão contratual e devolução dos valores pagos a mais.",
        ],
      },
      {
        tipo: "cta",
      },
      {
        tipo: "faq",
        itens: [
          {
            q: "Existe um percentual de juros que é automaticamente considerado abusivo no Brasil?",
            r: "Não existe um percentual único fixado em lei para todos os tipos de crédito. O STJ usa como parâmetro a comparação com a taxa média de mercado divulgada pelo Banco Central para aquela modalidade. Quando a taxa cobrada é significativamente superior à média, os tribunais tendem a reconhecer a abusividade. Para modalidades específicas como cheque especial e consignado INSS, existem tetos legais.",
          },
          {
            q: "Posso contestar juros de um contrato que já quitei?",
            r: "Sim. O Art. 27 do CDC estabelece prazo prescricional de 5 anos para ações de reparação de danos nas relações de consumo. Para revisão de cláusula contratual, o prazo pode ser ainda maior conforme o Código Civil. Se você quitou um contrato recentemente e suspeita de abuso, ainda pode ter direito à devolução dos valores pagos a maior.",
          },
          {
            q: "O banco pode processar alguém que contestar os juros?",
            r: "Não. Contestar um contrato que você acredita conter cláusulas abusivas é um direito garantido pelo CDC e pela Constituição Federal. O banco pode defender sua posição no processo, mas não pode processar criminalmente nem aplicar sanções ao consumidor por exercer esse direito.",
          },
          {
            q: "O que é o Custo Efetivo Total (CET) e por que ele é importante?",
            r: "O CET é a taxa que representa o custo real de um crédito, incluindo juros, tarifas, seguros e todos os encargos. O banco é obrigado por lei a informar o CET antes de você assinar o contrato. Se a taxa de juros parece razoável mas o CET é muito mais alto, significa que o banco está embutindo outros custos elevados no crédito.",
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 2. taxa-media-juros-banco-central
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "taxa-media-juros-banco-central",
    titulo: "Taxa Média do Banco Central: Como Usar os Dados Oficiais",
    descricao:
      "Entenda o que são as taxas médias publicadas pelo Banco Central, como interpretá-las e por que são o principal critério para detectar juros abusivos.",
    dataPublicacao: "2025-04-17",
    tempoLeitura: 6,
    categoria: "Banco Central",
    palavrasChave: [
      "taxa média banco central",
      "nota de crédito BCB",
      "SGS banco central",
      "média juros mercado",
      "taxa referência juros",
    ],
    secoes: [
      {
        tipo: "intro",
        paragrafos: [
          "Todo mês, o Banco Central do Brasil (BCB) coleta informações de todas as instituições financeiras e publica as taxas médias cobradas em cada tipo de crédito. Esses dados são o termômetro oficial do custo do crédito no Brasil — e também a principal ferramenta para identificar se o banco está cobrando demais de você.",
          "Esses números são públicos, gratuitos e estão disponíveis no sistema do Banco Central. O problema é que poucos consumidores sabem que eles existem, como interpretá-los ou como usá-los para comparar com o que está no próprio contrato.",
          "Neste artigo, você vai entender o que são essas publicações, quais séries de dados importam para o consumidor comum e como usar essas informações para saber se a taxa do seu empréstimo ou financiamento está dentro do normal.",
        ],
      },
      {
        tipo: "h2",
        titulo: "O que são as Notas de Crédito do Banco Central?",
        paragrafos: [
          "As Notas de Crédito são publicações mensais do BCB que consolidam informações sobre o comportamento do crédito no sistema financeiro nacional. Elas mostram o volume de crédito concedido, as taxas médias por modalidade, os prazos médios e a inadimplência. Para o consumidor, as taxas médias por modalidade são a informação mais relevante.",
          "Essas notas são geradas a partir de dados que todas as instituições financeiras são obrigadas a reportar mensalmente ao Banco Central. Isso significa que a média publicada reflete a realidade do mercado naquele período — não é uma estimativa, é um levantamento completo do sistema.",
          "Para acessar esses dados de forma organizada, o Banco Central mantém o SGS (Sistema Gerenciador de Séries Temporais), um banco de dados que permite consultar a evolução histórica de cada indicador. Cada tipo de crédito tem um número de série específico no SGS.",
        ],
      },
      {
        tipo: "h2",
        titulo: "As principais modalidades de crédito e suas séries no SGS",
        paragrafos: [
          "Para o consumidor pessoa física, as modalidades mais relevantes são: crédito pessoal não consignado (empréstimo pessoal comum), crédito pessoal consignado (descontado em folha ou benefício INSS), cheque especial, cartão de crédito rotativo e cartão de crédito parcelado. Cada uma tem uma dinâmica de risco diferente — e por isso, taxas muito diferentes.",
        ],
      },
      {
        tipo: "tabela",
        cabecalhos: [
          "Modalidade de Crédito",
          "Faixa Típica (a.m.)",
          "Característica Principal",
        ],
        linhas: [
          [
            "Crédito Pessoal Não Consignado",
            "3% a 7% a.m.",
            "Sem garantia, maior risco para o banco",
          ],
          [
            "Crédito Pessoal Consignado (INSS)",
            "1,5% a 2,1% a.m.",
            "Desconto direto no benefício, menor risco",
          ],
          [
            "Crédito Pessoal Consignado (Privado)",
            "1,8% a 3,5% a.m.",
            "Desconto em folha de pagamento CLT",
          ],
          [
            "Cheque Especial",
            "até 8% a.m. (teto legal)",
            "Crédito automático, sem análise no uso",
          ],
          [
            "Cartão Rotativo",
            "12% a 16% a.m.",
            "Dívida do saldo mínimo, custo altíssimo",
          ],
          [
            "Cartão Parcelado",
            "2% a 4% a.m.",
            "Parcelas fixas acordadas com a operadora",
          ],
          [
            "Financiamento de Veículos",
            "1,5% a 3% a.m.",
            "Garantia real (veículo), menor risco",
          ],
        ],
      },
      {
        tipo: "destaque",
        texto:
          "As faixas de taxas na tabela acima são referências gerais e variam conforme o cenário econômico, a política do Banco Central e o perfil de risco do tomador. Consulte sempre a Nota de Crédito do mês em que seu contrato foi assinado para a comparação correta.",
      },
      {
        tipo: "h2",
        titulo: "Como interpretar a taxa média e o que ela representa",
        paragrafos: [
          "A taxa média do BCB é uma média ponderada pelo volume de operações. Isso significa que ela leva em conta todos os empréstimos daquele tipo contratados no país naquele mês, ponderando pelo valor de cada operação. Não é uma média simples — é uma média que reflete o peso real de cada operação no mercado.",
          "Isso tem uma implicação importante: uma taxa acima da média não é automaticamente abusiva. Consumidores com histórico de crédito ruim, que não possuem garantias ou que tomam valores menores tendem a receber taxas mais altas. Os bancos precificam o risco individualmente.",
          "Porém, quando a taxa cobrada é muito superior à média — especialmente para consumidores com bom histórico de crédito — a diferença deixa de ser explicada pelo risco e passa a configurar uma vantagem exagerada para o banco. É nesse ponto que o CDC entra em cena e os tribunais reconhecem a abusividade.",
          "O Superior Tribunal de Justiça (STJ) consolidou o entendimento de que a comparação com a taxa média do BCB é o critério adequado para avaliar a abusividade dos juros bancários. Ou seja, os dados oficiais do Banco Central não são apenas informativos: eles são usados diretamente como prova em processos judiciais.",
        ],
      },
      {
        tipo: "h2",
        titulo: "A diferença entre taxa nominal e taxa efetiva",
        paragrafos: [
          "Quando o banco anuncia uma taxa, precisa deixar claro se ela é nominal ou efetiva. A taxa nominal é o percentual bruto, sem considerar a capitalização dos juros. A taxa efetiva já incorpora o efeito dos juros compostos — ou seja, os juros que incidem sobre juros ao longo do tempo.",
          "Por exemplo: uma taxa de 3% ao mês pode parecer razoável. Mas 3% ao mês em regime de juros compostos equivale a uma taxa efetiva de mais de 42% ao ano. A lei exige que o banco informe ambas as taxas no contrato, bem como o Custo Efetivo Total (CET), que inclui também as tarifas e seguros.",
          "Ao comparar sua taxa com a média do BCB, certifique-se de que está comparando o mesmo tipo: taxa mensal com taxa mensal, taxa efetiva com taxa efetiva. Uma comparação incorreta pode levar à conclusão errada.",
        ],
      },
      {
        tipo: "cta",
      },
      {
        tipo: "faq",
        itens: [
          {
            q: "Onde encontro os dados de taxa média do Banco Central?",
            r: "No site do Banco Central (bcb.gov.br), na seção de Notas de Crédito, publicadas mensalmente. Os dados históricos estão disponíveis no SGS (Sistema Gerenciador de Séries Temporais). Você também pode usar ferramentas como o AuditCredito, que consultam esses dados automaticamente e fazem a comparação com o seu contrato.",
          },
          {
            q: "O banco pode cobrar mais do que a taxa média sem ser abusivo?",
            r: "Sim, pode, desde que a diferença seja justificável pelo risco do cliente. Mas quando a taxa é muito superior à média de mercado sem justificativa proporcional, os tribunais tendem a reconhecer o abuso. A comparação com a média do BCB é o critério usado pelo STJ para avaliar essa questão.",
          },
          {
            q: "O que é o CET e por que ele importa mais do que a taxa de juros?",
            r: "O Custo Efetivo Total (CET) representa o custo real do crédito incluindo juros, tarifas administrativas, seguros obrigatórios e outros encargos. Um empréstimo com taxa de juros baixa pode ter um CET alto se o banco embutir várias tarifas. O banco é obrigado a informar o CET antes da assinatura do contrato.",
          },
          {
            q: "Por que as taxas do cartão rotativo são tão mais altas do que as de um empréstimo pessoal?",
            r: "O cartão rotativo é a dívida formada quando você não paga o valor total da fatura. Para o banco, é o tipo de crédito com maior risco de inadimplência e, historicamente, tinha pouca regulação. Em 2023, o Congresso aprovou uma lei limitando o crescimento dessa dívida a 100% do valor original, mas as taxas mensais ainda são as mais altas do mercado.",
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 3. cheque-especial-juros-altos
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "cheque-especial-juros-altos",
    titulo: "Cheque Especial: Por Que É o Crédito Mais Caro do Brasil",
    descricao:
      "Descubra por que o cheque especial tem os juros mais altos do mercado, como o limite de 8% ao mês funciona e quando o banco pode estar cobrando além do permitido.",
    dataPublicacao: "2025-04-24",
    tempoLeitura: 6,
    categoria: "Tipos de Crédito",
    palavrasChave: [
      "cheque especial juros",
      "taxa cheque especial",
      "limite cheque especial banco central",
      "cheque especial abusivo",
      "8% ao mês cheque especial",
    ],
    secoes: [
      {
        tipo: "intro",
        paragrafos: [
          "O cheque especial é aquele limite de crédito automático que o banco coloca à sua disposição na conta corrente. Quando o saldo zera e você faz um pagamento, o banco cobre a diferença usando esse limite — e começa a cobrar juros altíssimos sobre o valor usado, às vezes sem que você perceba imediatamente.",
          "Por muito tempo, o cheque especial foi o produto financeiro com as maiores taxas de juros em toda a história do sistema bancário brasileiro. Em alguns períodos, as taxas chegavam a ultrapassar 10%, 12% ou até 15% ao mês em algumas instituições — o que equivale a taxas anuais estratosféricas.",
          "Em 2020, o Banco Central impôs um teto de 8% ao mês para essa modalidade. Mas mesmo com o limite, o cheque especial continua sendo uma das formas de crédito mais caras disponíveis. Entender como ele funciona é essencial para evitar cair nessa armadilha.",
        ],
      },
      {
        tipo: "h2",
        titulo: "Por que os bancos cobram tanto no cheque especial?",
        paragrafos: [
          "Do ponto de vista do banco, o cheque especial é o tipo de crédito de maior risco. Quando você usa o limite, o banco está emprestando dinheiro sem pedir garantias, sem analisar o motivo do uso e sem negociar um prazo de pagamento. É um crédito instantâneo, automático e sem qualquer análise no momento do uso.",
          "Além disso, o cheque especial é usado geralmente em momentos de aperto financeiro — o que aumenta a chance de inadimplência. O banco compensa esse risco com taxas muito mais altas do que em modalidades onde há garantia ou análise de crédito.",
          "Há também um componente estratégico: os bancos lucram muito com o cheque especial. O custo de oferecer o limite é baixo, mas o retorno financeiro é alto. Por isso, muitos bancos oferecem limites generosos sem que o cliente tenha solicitado, esperando que ele os use em momentos de necessidade.",
        ],
      },
      {
        tipo: "destaque",
        texto:
          "Desde janeiro de 2020, o Banco Central limitou a taxa do cheque especial a 8% ao mês, por meio da Resolução CMN nº 4.765/2019. Qualquer banco que cobre acima desse percentual está infringindo uma norma regulatória federal.",
      },
      {
        tipo: "h2",
        titulo: "Como os juros compostos transformam uma dívida pequena em grande",
        paragrafos: [
          "Para entender o perigo do cheque especial, é preciso entender o que são juros compostos — também chamados de 'juros sobre juros'. Ao contrário dos juros simples, onde o juro é sempre calculado sobre o valor original, nos juros compostos o juro do mês anterior é somado ao valor da dívida e passa a gerar novos juros no mês seguinte.",
          "Imagine que você ficou R$ 1.000 no cheque especial a uma taxa de 8% ao mês. No primeiro mês, o juro é de R$ 80, e a dívida passa para R$ 1.080. No segundo mês, os 8% incidem sobre R$ 1.080 — são R$ 86,40 de juro. A dívida vai para R$ 1.166,40. E assim por diante.",
          "Seguindo essa lógica, em cerca de 9 meses sem pagar nada, aqueles R$ 1.000 teriam dobrado. Em 18 meses, seriam quase quatro vezes o valor original. São números que rapidamente se tornam impossíveis de pagar com renda normal.",
        ],
      },
      {
        tipo: "tabela",
        cabecalhos: ["Mês", "Dívida Inicial", "Juros (8% a.m.)", "Dívida Final"],
        linhas: [
          ["1º", "R$ 1.000,00", "R$ 80,00", "R$ 1.080,00"],
          ["3º", "R$ 1.259,71", "R$ 100,78", "R$ 1.360,49"],
          ["6º", "R$ 1.586,87", "R$ 126,95", "R$ 1.713,82"],
          ["9º", "R$ 1.999,00", "R$ 159,92", "R$ 2.158,92"],
          ["12º", "R$ 2.518,17", "R$ 201,45", "R$ 2.719,62"],
          ["18º", "R$ 3.996,00", "R$ 319,68", "R$ 4.315,68"],
        ],
      },
      {
        tipo: "lista",
        titulo: "Como evitar cair na armadilha do cheque especial",
        itens: [
          "Configure alertas de saldo no aplicativo do banco para ser avisado antes de entrar no cheque especial.",
          "Se precisar do dinheiro, compare: um empréstimo pessoal tem taxa muito menor do que o cheque especial. Use o crédito mais barato disponível.",
          "Solicite ao banco a redução ou cancelamento do limite do cheque especial se você tende a usá-lo inadvertidamente.",
          "Se já está no cheque especial, quite o valor o mais rápido possível — cada dia de atraso aumenta a dívida.",
          "Nunca use o cheque especial como complemento de renda. Ele é uma solução emergencial de curtíssimo prazo.",
        ],
      },
      {
        tipo: "cta",
      },
      {
        tipo: "faq",
        itens: [
          {
            q: "O limite de 8% ao mês do cheque especial é garantido por lei?",
            r: "Sim. A Resolução CMN nº 4.765/2019 estabeleceu esse teto, com vigência a partir de 6 de janeiro de 2020. Qualquer banco que cobre acima de 8% ao mês no cheque especial está descumprindo uma norma do Conselho Monetário Nacional, que é um órgão regulador do sistema financeiro brasileiro.",
          },
          {
            q: "O banco pode aumentar o limite do cheque especial sem minha autorização?",
            r: "Não, o banco não pode aumentar o limite sem o consentimento do correntista. No entanto, muitos bancos oferecem aumentos de limite de forma automática atrelados a promoções ou análises periódicas de crédito. Você pode recusar qualquer oferta de aumento e solicitar a redução do limite a qualquer momento.",
          },
          {
            q: "Se eu usar o cheque especial e não pagar, o banco pode fazer o quê?",
            r: "O banco pode cobrar juros e encargos previstos no contrato (respeitando o teto legal), negativar seu nome nos órgãos de proteção ao crédito (SPC, Serasa) e, após esgotar as tentativas de cobrança, mover ação judicial para recuperação da dívida.",
          },
          {
            q: "Existe alguma isenção de juros no início do uso do cheque especial?",
            r: "Alguns bancos oferecem um período de carência — geralmente alguns dias sem cobrança de juros ao entrar no cheque especial. Mas isso varia conforme a política de cada banco e o tipo de conta. Leia sempre o contrato da sua conta corrente para saber as condições específicas.",
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 4. cartao-credito-rotativo-juros
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "cartao-credito-rotativo-juros",
    titulo: "Cartão Rotativo: A Armadilha dos Juros Compostos",
    descricao:
      "Entenda como o crédito rotativo do cartão de crédito funciona, por que os juros são tão altos e como a lei de 2023 limitou o crescimento dessa dívida no Brasil.",
    dataPublicacao: "2025-05-01",
    tempoLeitura: 5,
    categoria: "Tipos de Crédito",
    palavrasChave: [
      "cartão rotativo juros",
      "rotativo cartão de crédito",
      "juros compostos cartão",
      "lei cartão rotativo 2023",
      "100% dívida cartão crédito",
    ],
    secoes: [
      {
        tipo: "intro",
        paragrafos: [
          "Você sabe o que acontece quando você paga apenas o valor mínimo da fatura do cartão de crédito? A parte que não foi paga entra no chamado crédito rotativo — e começa a acumular juros que estão entre os mais altos do mercado financeiro brasileiro.",
          "O rotativo do cartão de crédito é uma das principais causas de endividamento das famílias brasileiras. Muitas pessoas entram nessa situação sem entender exatamente como ela funciona, e a dívida cresce rapidamente antes que percebam o tamanho do problema.",
          "Neste artigo, você vai entender como o rotativo funciona, por que os juros são tão altos, o que mudou com a lei de 2023 e como sair dessa situação se você já está nela.",
        ],
      },
      {
        tipo: "h2",
        titulo: "O que é o crédito rotativo?",
        paragrafos: [
          "Quando você recebe a fatura do cartão de crédito, tem três opções: pagar o valor total, pagar o valor mínimo ou pagar qualquer valor intermediário. Se você pagar o valor total, não há juros — o cartão funciona como um período de carência sem custo.",
          "Mas se você pagar qualquer valor abaixo do total — mesmo que seja R$ 1 a menos — o saldo restante entra automaticamente no crédito rotativo. A partir daí, o banco começa a cobrar juros sobre esse saldo, e esses juros são muito altos.",
          "A diferença entre o rotativo e o parcelado do cartão é importante: o parcelado é quando você escolhe, no ato da compra, pagar em X vezes. Nesse caso, as taxas são menores e o prazo é pré-definido. O rotativo, por outro lado, é a dívida que surge do não pagamento da fatura cheia — não foi uma escolha planejada, e as taxas são muito mais altas.",
        ],
      },
      {
        tipo: "destaque",
        texto:
          "O crédito rotativo do cartão historicamente teve as maiores taxas de juros de toda a economia brasileira. Por isso, o Congresso aprovou em 2023 uma lei que limita o crescimento dessa dívida ao dobro do valor original — e os bancos foram obrigados a oferecer alternativas de parcelamento.",
      },
      {
        tipo: "h2",
        titulo: "A mudança de 2023: a dívida não pode mais crescer sem limite",
        paragrafos: [
          "Em 2023, o governo federal aprovou a Lei nº 14.690/2023, que criou regras para o crédito rotativo do cartão. A principal mudança é que a dívida no rotativo não pode ultrapassar 100% do valor original — ou seja, se você ficou devendo R$ 1.000, o total com juros não pode passar de R$ 2.000.",
          "Além disso, a lei determinou que, quando o consumidor não paga a fatura cheia e a dívida entra no rotativo por mais de um mês, o banco é obrigado a oferecer uma alternativa de parcelamento com condições mais favoráveis. A ideia é dar uma saída ao consumidor antes que a dívida saia do controle.",
          "Essa mudança foi importante, mas não eliminou o problema. As taxas mensais do rotativo continuam muito altas, e o limite de 100% ainda significa que uma dívida de R$ 2.000 pode chegar a R$ 4.000. Para quem não tem renda para pagar, isso ainda é devastador.",
        ],
      },
      {
        tipo: "h2",
        titulo: "Como os juros compostos fazem a dívida crescer",
        paragrafos: [
          "Pense nos juros compostos como uma bola de neve descendo uma ladeira. No começo, a bola é pequena. Mas cada vez que ela rola, vai juntando mais neve e fica maior. Os juros do mês passado viram parte da dívida e passam a gerar novos juros no mês seguinte — e assim por diante.",
          "Se você tem uma dívida de R$ 2.000 no rotativo a uma taxa de 14% ao mês, em 6 meses, sem nenhum pagamento, a dívida seria de mais de R$ 4.300. Em 12 meses, ultrapassaria R$ 9.200. São números que rapidamente se tornam impossíveis de pagar com renda normal.",
          "É por isso que o primeiro conselho de todo especialista em finanças pessoais é: nunca entre no rotativo do cartão. Se não consegue pagar a fatura cheia, use um empréstimo pessoal para quitar o cartão — as taxas serão menores.",
        ],
      },
      {
        tipo: "lista",
        titulo: "3 estratégias práticas para sair do rotativo",
        itens: [
          "Contrate um empréstimo pessoal para quitar o cartão: mesmo com taxa entre 3% e 6% ao mês, um empréstimo pessoal é muito mais barato do que o rotativo. Use o dinheiro do empréstimo para pagar a fatura cheia e fique com uma única dívida menor e mais controlável.",
          "Negocie o parcelamento diretamente com o banco: desde a lei de 2023, o banco é obrigado a oferecer parcelamento quando a dívida está no rotativo. Ligue para a central do cartão e solicite essa negociação. Compare as taxas oferecidas com as de outras opções de crédito.",
          "Bloqueie temporariamente o cartão: enquanto está pagando a dívida, evite criar novas dívidas no mesmo cartão. A maioria dos bancos permite bloquear o cartão pelo próprio aplicativo, sem precisar cancelá-lo.",
        ],
      },
      {
        tipo: "cta",
      },
      {
        tipo: "faq",
        itens: [
          {
            q: "Se eu pagar o mínimo da fatura, isso prejudica meu score de crédito?",
            r: "Pagar o mínimo mantém seu cadastro em dia — você não ficará negativado. Mas a dívida no rotativo pode crescer rapidamente e, se eventualmente não conseguir pagar, vai sim prejudicar seu histórico. Além disso, ter dívida alta em relação ao limite do cartão pode reduzir seu score mesmo sem inadimplência.",
          },
          {
            q: "O banco pode me cobrar mais de 100% do valor original no rotativo?",
            r: "Não, desde a Lei nº 14.690/2023. Essa lei estabeleceu que o total da dívida no rotativo não pode ultrapassar 100% do valor da fatura que originou a dívida. Se o banco cobrar além disso, está descumprindo a lei e você pode reclamar no PROCON, no consumidor.gov.br ou acionar o Banco Central.",
          },
          {
            q: "Qual a diferença entre taxa de juros do rotativo e do cartão parcelado?",
            r: "O parcelado é quando você divide uma compra em parcelas no momento da compra — as taxas costumam ser bem mais baixas. O rotativo é a dívida criada automaticamente quando você não paga a fatura cheia. As taxas do rotativo são historicamente as mais altas do mercado de crédito brasileiro.",
          },
          {
            q: "É possível contestar juros do rotativo que considero abusivos?",
            r: "Sim. Mesmo no rotativo, se as taxas cobradas eram muito superiores à média de mercado para essa modalidade no período correspondente, é possível contestar judicialmente. O AuditCredito pode analisar seu extrato e compará-lo com as taxas médias oficiais do Banco Central para verificar se há base para contestação.",
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 5. como-contestar-juros-abusivos
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "como-contestar-juros-abusivos",
    titulo: "Como Contestar Juros Abusivos no Banco: Passo a Passo",
    descricao:
      "Guia completo com os 5 passos para contestar juros abusivos: da documentação até o PROCON, consumidor.gov.br e ação judicial. Conheça seus direitos.",
    dataPublicacao: "2025-05-08",
    tempoLeitura: 8,
    categoria: "Ação Prática",
    palavrasChave: [
      "como contestar juros abusivos",
      "reclamar banco PROCON",
      "revisão contratual juros",
      "ouvidoria banco",
      "ação judicial juros abusivos",
    ],
    secoes: [
      {
        tipo: "intro",
        paragrafos: [
          "Descobrir que você pode estar pagando juros abusivos é o primeiro passo. O segundo — e mais importante — é fazer algo a respeito. Muitas pessoas ficam paralisadas por não saber por onde começar, ou acreditam que contestar o banco é algo reservado apenas a quem pode pagar um advogado.",
          "A boa notícia é que existe um caminho claro, com etapas que você pode seguir por conta própria, sem gastar nada nas fases iniciais. O direito de revisar contratos bancários abusivos está garantido pelo Código de Defesa do Consumidor e pela jurisprudência dos tribunais brasileiros.",
          "Atenção: o Art. 27 do CDC estabelece um prazo prescricional de 5 anos para ações de reparação de danos nas relações de consumo. Isso significa que você tem um prazo para agir — e quanto mais tempo passa, menos você pode recuperar. Se você suspeita de abuso em um contrato recente ou em um que está ativo, não espere.",
        ],
      },
      {
        tipo: "destaque",
        texto:
          "O prazo para entrar com ação por juros abusivos em contratos bancários é de 5 anos a partir do momento em que o dano ocorreu (CDC, Art. 27). Para contratos ainda ativos, o prazo conta a partir do término do contrato.",
      },
      {
        tipo: "lista",
        titulo: "Passo 1: Calcule e documente (antes de qualquer coisa)",
        itens: [
          "Reúna o contrato original assinado, incluindo todos os anexos e adendos.",
          "Obtenha o extrato completo de pagamentos realizados — peça ao banco se não tiver.",
          "Se o contrato ainda está ativo, solicite o demonstrativo de saldo devedor atualizado.",
          "Use uma ferramenta de auditoria — como o AuditCredito em auditcredito.com.br/auditoria — para calcular a taxa efetiva do seu contrato e compará-la com a média do Banco Central para aquela modalidade e período.",
          "Guarde tudo em PDF, com data. Esse material será a base de qualquer reclamação ou ação futura.",
        ],
      },
      {
        tipo: "h2",
        titulo: "Passo 2: Contate o banco por escrito (ouvidoria)",
        paragrafos: [
          "Antes de acionar qualquer órgão externo, você deve dar ao banco a oportunidade de resolver a situação. Mas faça isso de forma documentada. Não basta ligar e conversar — você precisa de registro escrito do que foi solicitado e da resposta recebida.",
          "Envie um e-mail ou carta para a Ouvidoria do banco (todas as instituições financeiras são obrigadas por regulação do Banco Central a ter uma ouvidoria). Na comunicação, descreva sua solicitação de forma clara: informe o número do contrato, o período em questão, a taxa que está sendo cobrada, a taxa média do BCB para aquela modalidade, e solicite a revisão das condições ou a devolução dos valores pagos a maior.",
          "A ouvidoria tem prazo regulatório para responder: 10 dias úteis para a maioria das reclamações, podendo ser prorrogado para até 15 dias em casos mais complexos. Guarde o protocolo de atendimento. Se a resposta for negativa ou insatisfatória, é hora de partir para o próximo passo.",
        ],
      },
      {
        tipo: "h2",
        titulo: "Passo 3: Consumidor.gov.br",
        paragrafos: [
          "O consumidor.gov.br é uma plataforma pública gratuita do governo federal que permite registrar reclamações contra empresas, incluindo bancos e financeiras. As empresas cadastradas são obrigadas a responder em até 10 dias úteis.",
          "A taxa de resolução de reclamações nessa plataforma costuma ser positiva para os consumidores em casos fundamentados. Ao registrar sua reclamação, seja específico: informe o número do contrato, as taxas cobradas, a comparação com a média do BCB e o que você está solicitando (revisão, devolução, renegociação).",
          "Anexe todos os documentos que você reuniu no Passo 1 e a resposta (ou ausência de resposta) da ouvidoria do banco. Uma reclamação bem documentada no consumidor.gov.br tem muito mais chance de resultado positivo.",
        ],
      },
      {
        tipo: "h2",
        titulo: "Passo 4: PROCON",
        paragrafos: [
          "Se a resposta no consumidor.gov.br não for satisfatória, o próximo passo é o PROCON. O Programa de Proteção e Defesa do Consumidor existe em todos os estados e em muitos municípios, e tem poder para aplicar multas e sanções administrativas aos bancos.",
          "Muitos PROCONs aceitam reclamações online — verifique o site do PROCON do seu estado. O atendimento presencial também é uma opção. O PROCON é gratuito para o consumidor. Leve toda a documentação: contrato, extratos, correspondência com a ouvidoria e o registro da reclamação no consumidor.gov.br.",
          "O PROCON não tem poder para forçar o banco a devolver dinheiro — ele aplica multas administrativas. Mas a abertura de um processo no PROCON frequentemente leva os bancos a oferecerem acordos extrajudiciais vantajosos para o consumidor.",
        ],
      },
      {
        tipo: "h2",
        titulo: "Passo 5: Ação judicial (Juizado Especial Cível ou advogado)",
        paragrafos: [
          "Se todas as etapas anteriores não resolverem, a via judicial é o caminho para obter efetivamente a devolução dos valores pagos a maior e a revisão do contrato. Aqui você tem duas opções principais.",
          "Para causas de até 20 salários mínimos, você pode entrar com ação no Juizado Especial Cível (JEC) — popularmente chamado de 'pequenas causas' — sem precisar de advogado. O processo é mais simples e rápido do que a Justiça comum. Leve toda a documentação organizada, especialmente o laudo de auditoria comparando sua taxa com a média do BCB.",
          "Para causas de valor maior ou mais complexas, procure um advogado especializado em direito bancário ou do consumidor. Muitos trabalham com honorários de êxito — ou seja, só cobram se ganhar — especialmente em casos de juros abusivos, onde a jurisprudência é favorável ao consumidor.",
        ],
      },
      {
        tipo: "cta",
      },
      {
        tipo: "faq",
        itens: [
          {
            q: "Preciso de advogado para contestar juros abusivos?",
            r: "Não necessariamente. Nas fases administrativas (ouvidoria, consumidor.gov.br, PROCON), você pode agir sozinho. No Juizado Especial Cível, para causas de até 20 salários mínimos, também é possível sem advogado. Para valores maiores ou se quiser representação, procure um advogado de direito do consumidor ou bancário.",
          },
          {
            q: "Quanto tempo leva para resolver uma contestação de juros abusivos?",
            r: "Depende do caminho escolhido. Na ouvidoria: até 15 dias. No consumidor.gov.br: até 10 dias úteis. No PROCON: semanas a meses. No Juizado Especial Cível: geralmente 6 a 18 meses. Na Justiça comum: pode levar anos. Por isso, comece pelos canais administrativos antes de ir ao Judiciário.",
          },
          {
            q: "Se eu ganhar a ação, o banco devolve o dinheiro de que forma?",
            r: "O juiz pode determinar a devolução do valor pago a maior em forma de depósito em conta, abatimento de dívida remanescente ou compensação com parcelas futuras, dependendo da situação de cada contrato. Em contratos já quitados, a devolução tende a ser em dinheiro, corrigida monetariamente.",
          },
          {
            q: "O banco pode me fechar conta ou recusar crédito se eu reclamar?",
            r: "Não legalmente. Nenhum banco pode encerrar uma conta ou negar crédito em retaliação ao exercício de direitos do consumidor. Isso configuraria prática abusiva adicional. Você pode registrar qualquer represália no PROCON e no consumidor.gov.br como reclamação separada.",
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 6. credito-consignado-taxas
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "credito-consignado-taxas",
    titulo: "Crédito Consignado: Taxas Baixas, Mas Cuidado com o Contrato",
    descricao:
      "O consignado tem os juros mais baixos do mercado, mas fraudes e cobranças abusivas acontecem. Saiba quem tem direito, quais são os limites legais e como verificar seu contrato.",
    dataPublicacao: "2025-05-15",
    tempoLeitura: 6,
    categoria: "Tipos de Crédito",
    palavrasChave: [
      "crédito consignado taxa",
      "consignado INSS taxa",
      "juros consignado servidor público",
      "consignado abusivo",
      "margem consignável",
    ],
    secoes: [
      {
        tipo: "intro",
        paragrafos: [
          "O crédito consignado é frequentemente apresentado como 'o empréstimo mais barato do Brasil' — e de fato, as taxas dessa modalidade costumam ser bem menores do que as de um empréstimo pessoal comum. Mas isso não significa que está livre de problemas ou de abusos.",
          "Fraudes no consignado do INSS, cobranças além dos tetos legais e contratos com cláusulas prejudiciais ao tomador são problemas reais e documentados. Para idosos e aposentados — os maiores usuários do consignado — esses golpes podem causar prejuízos financeiros graves.",
          "Neste artigo, você vai entender quem tem direito ao consignado, por que as taxas são mais baixas, quais são os limites legais de taxa e o que fazer se suspeitar que está pagando mais do que deveria.",
        ],
      },
      {
        tipo: "h2",
        titulo: "Quem pode contratar crédito consignado?",
        paragrafos: [
          "O consignado é um empréstimo cujas parcelas são descontadas diretamente da fonte de renda do tomador, antes de o dinheiro chegar à sua conta. Por isso, ele está disponível apenas para quem tem uma fonte de renda estável e previsível que pode ser debitada diretamente.",
          "As três categorias principais de tomadores são: servidores públicos municipais, estaduais e federais; aposentados e pensionistas do INSS; e trabalhadores com carteira assinada (CLT) em empresas que têm convênio com instituições financeiras.",
          "Cada categoria tem regras específicas quanto ao teto de taxa de juros, ao percentual máximo da renda que pode ser comprometido (margem consignável) e às entidades autorizadas a oferecer o produto.",
        ],
      },
      {
        tipo: "destaque",
        texto:
          "A margem consignável limita o desconto em folha: para beneficiários do INSS, no máximo 45% do benefício pode ser comprometido com parcelas de empréstimos e cartão consignado. Comprometer mais do que isso é ilegal.",
      },
      {
        tipo: "tabela",
        cabecalhos: [
          "Tipo de Beneficiário",
          "Teto de Taxa (a.m.)",
          "Margem Consignável",
          "Órgão Regulador",
        ],
        linhas: [
          [
            "Aposentados e Pensionistas INSS",
            "~1,80% a.m. (revisto periodicamente)",
            "45% do benefício líquido",
            "MPS / Banco Central",
          ],
          [
            "Servidores Públicos Federais",
            "Definido por cada órgão",
            "35% da remuneração",
            "SIGEPE / órgão empregador",
          ],
          [
            "Trabalhadores CLT (setor privado)",
            "Negociado com o banco",
            "35% do salário líquido",
            "Banco Central / CLT",
          ],
        ],
      },
      {
        tipo: "h2",
        titulo: "Por que as taxas do consignado são mais baixas?",
        paragrafos: [
          "A lógica é simples: risco menor significa taxa menor. Quando o banco empresta dinheiro sem garantia, existe o risco de o tomador não pagar — e o banco precisa cobrar uma taxa mais alta para cobrir essa possibilidade. No consignado, o desconto é automático na fonte de renda. Se você não pagar, não é porque não quer — é porque a parcela já foi descontada antes de você receber.",
          "Para o banco, o risco de inadimplência no consignado é muito baixo. E como o custo de risco está embutido na taxa de juros, a taxa cai substancialmente. Um empréstimo pessoal não consignado pode custar várias vezes mais ao mês do que um consignado do INSS.",
          "Esse diferencial torna o consignado muito atrativo — e também o torna alvo de fraudes. Correspondentes bancários desonestos, financeiras não autorizadas e telefonemas de golpistas são problemas reais. Sempre verifique se a instituição é autorizada pelo Banco Central antes de assinar qualquer contrato.",
        ],
      },
      {
        tipo: "lista",
        titulo: "Sinais de alerta no crédito consignado",
        itens: [
          "Taxa acima do teto legal: para o consignado do INSS, o governo federal revisa periodicamente a taxa máxima permitida. Qualquer cobrança acima desse teto é ilegal. Verifique no site do Ministério da Previdência Social ou do BCB qual é a taxa máxima vigente.",
          "Desconto na conta sem que você tenha contratado: fraudes no consignado acontecem quando uma financeira cadastra um contrato no seu CPF sem sua autorização. Monitore seus extratos mensalmente e reporte ao banco e ao INSS se identificar descontos não reconhecidos.",
          "Margem consignável extrapolada: se a soma de todos os seus descontos consignados ultrapassar 45% do seu benefício (para INSS), há irregularidade. Acesse o extrato de consignações pelo Meu INSS para ver todos os contratos ativos em seu nome.",
          "Contrato com cobranças extras não explicadas: seguros embutidos com prêmio alto, tarifas de cadastro abusivas ou IOF calculado incorretamente podem elevar o CET muito acima da taxa nominal. Compare sempre o CET informado, não apenas a taxa de juros.",
          "Pressão para assinar rapidamente: nenhuma oferta legítima de crédito exige que você assine sem tempo para ler o contrato. Qualquer pressão para assinar imediatamente é sinal de alerta.",
        ],
      },
      {
        tipo: "h2",
        titulo: "Como verificar seus contratos de consignado",
        paragrafos: [
          "Para beneficiários do INSS, o Meu INSS (meu.inss.gov.br) permite consultar todos os contratos de empréstimo consignado cadastrados em seu nome, com os valores das parcelas, taxas e datas. É a ferramenta mais importante para monitorar eventuais fraudes.",
          "Para servidores públicos federais, o SIGEPE tem funcionalidade similar. Para trabalhadores CLT, a verificação é feita diretamente no contracheque e nos extratos bancários.",
          "Se encontrar um contrato que não reconhece, reporte imediatamente à Central 135 do INSS (para beneficiários da Previdência), à ouvidoria do banco e ao Banco Central. Contratos fraudulentos podem ser cancelados e os valores devolvidos.",
        ],
      },
      {
        tipo: "cta",
      },
      {
        tipo: "faq",
        itens: [
          {
            q: "Posso contratar consignado se estiver com o nome sujo?",
            r: "Em muitos casos, sim. Como o consignado tem garantia no desconto em folha, algumas instituições financeiras concedem o crédito mesmo para pessoas com restrição no CPF. Isso é uma vantagem da modalidade, mas também é explorado por golpistas que oferecem consignado a condições piores que as legais para pessoas em situação de vulnerabilidade.",
          },
          {
            q: "O que é portabilidade do consignado e como funciona?",
            r: "A portabilidade permite que você transfira seu empréstimo consignado para outra instituição que ofereça taxa menor, sem pagar multa. O novo banco quita a dívida com o banco original e você passa a pagar para o novo banco, com a mesma parcela ou menor. É um direito garantido e pode gerar economia significativa.",
          },
          {
            q: "Fiz um consignado e a taxa cobrada está acima do teto. O que faço?",
            r: "Documente a situação (extrato, contrato, taxa cobrada vs. teto vigente) e entre com reclamação na ouvidoria do banco, no consumidor.gov.br e no Banco Central (Fale com o BC). Se não resolver, o PROCON e a via judicial estão disponíveis. O AuditCredito pode gerar um laudo comparando sua taxa com os tetos legais.",
          },
          {
            q: "Posso cancelar um contrato de consignado que não reconheço?",
            r: "Sim. Se você não autorizou o contrato, trata-se de fraude. Reporte ao INSS pela Central 135, ao banco pelo canal de atendimento e registre boletim de ocorrência. A instituição é obrigada a cancelar o contrato fraudulento, devolver os valores descontados e reparar os danos.",
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 7. cdc-juros-bancarios-direitos
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "cdc-juros-bancarios-direitos",
    titulo: "CDC e Juros Bancários: O Que a Lei Garante a Você",
    descricao:
      "Conheça os artigos do Código de Defesa do Consumidor que protegem você em contratos bancários: direito à informação, cláusulas nulas e como usar a lei a seu favor.",
    dataPublicacao: "2025-05-22",
    tempoLeitura: 7,
    categoria: "Direitos do Consumidor",
    palavrasChave: [
      "CDC juros bancários",
      "código defesa consumidor banco",
      "artigo 51 CDC",
      "artigo 46 CDC",
      "direitos consumidor banco",
    ],
    secoes: [
      {
        tipo: "intro",
        paragrafos: [
          "Quando você assina um contrato de empréstimo ou financiamento com um banco, você está numa relação de consumo — e isso tem uma consequência muito importante: o Código de Defesa do Consumidor (CDC), Lei nº 8.078/1990, se aplica integralmente.",
          "O CDC foi criado justamente para equilibrar relações onde uma das partes tem muito mais poder do que a outra. Em um contrato bancário, o banco tem toda a expertise jurídica, financeira e técnica. O consumidor, em geral, não tem. A lei reconhece essa desigualdade e cria um conjunto de direitos que protegem o lado mais fraco.",
          "Conhecer esses direitos é o primeiro passo para exercê-los. Neste artigo, vamos explicar os principais artigos do CDC que se aplicam a contratos bancários, o que o Código Civil acrescenta e como o Banco Central regula as instituições financeiras para proteger o consumidor.",
        ],
      },
      {
        tipo: "h2",
        titulo: "Art. 6 do CDC — O direito à informação clara",
        paragrafos: [
          "O Art. 6 do CDC lista os direitos básicos do consumidor. O inciso III estabelece que é direito do consumidor 'a informação adequada e clara sobre os diferentes produtos e serviços, com especificação correta de quantidade, características, composição, qualidade, tributos incidentes e preço, bem como sobre os riscos que apresentem'.",
          "Aplicado a contratos bancários, isso significa que o banco é obrigado a informar, de forma clara e compreensível: a taxa de juros mensal e anual, o Custo Efetivo Total (CET), todas as tarifas cobradas, o valor total a ser pago, o número e valor das parcelas e quaisquer condições para variação da taxa.",
          "Se o banco não forneceu essas informações de forma clara antes da assinatura — por exemplo, se o contrato estava cheio de linguagem técnica sem explicação — isso já configura violação de um direito básico do consumidor e pode ser usado em sua defesa.",
        ],
      },
      {
        tipo: "h2",
        titulo: "Art. 46 do CDC — Você não é obrigado pelo que não entendeu",
        paragrafos: [
          "O Art. 46 do CDC diz: 'Os contratos que regulam as relações de consumo não obrigarão os consumidores, se não lhes for dada a oportunidade de tomar conhecimento prévio de seu conteúdo, ou se os respectivos instrumentos forem redigidos de modo a dificultar a compreensão de seu sentido e alcance.'",
          "Esse é um dos artigos mais poderosos para o consumidor bancário. Se você assinou um contrato que estava em linguagem técnica impenetrável, sem que o gerente ou o representante do banco explicasse o que você estava assinando — especialmente as cláusulas sobre juros e encargos — esse contrato pode ser questionado na Justiça.",
          "Isso não significa que você pode sair de qualquer contrato apenas alegando que não entendeu. Mas significa que, em combinação com outros elementos (taxa acima da média, falta de informações obrigatórias, etc.), esse artigo fortalece muito a posição do consumidor num processo de revisão contratual.",
        ],
      },
      {
        tipo: "destaque",
        texto:
          "O Art. 51, IV do CDC declara nulas as cláusulas que 'estabeleçam obrigações consideradas iníquas, abusivas, que coloquem o consumidor em desvantagem exagerada, ou sejam incompatíveis com a boa-fé ou a equidade.' Taxas muito acima da média de mercado se enquadram nessa definição.",
      },
      {
        tipo: "h2",
        titulo: "Art. 51 do CDC — As cláusulas que a lei considera nulas",
        paragrafos: [
          "O Art. 51 do CDC é o mais aplicado em casos de revisão de contratos bancários. Ele lista as cláusulas abusivas que são nulas de pleno direito — ou seja, que não produzem efeito legal, independentemente de o consumidor ter assinado o contrato.",
          "O inciso IV desse artigo declara nulas as cláusulas que coloquem o consumidor em 'desvantagem exagerada'. O inciso XV declara nulas aquelas que estejam 'em desacordo com o sistema de proteção ao consumidor'. E o parágrafo primeiro define que vantagem exagerada é aquela que 'restringe direitos ou obrigações fundamentais inerentes à natureza do contrato, de tal modo a ameaçar seu objeto ou o equilíbrio contratual'.",
          "Os tribunais brasileiros, especialmente o STJ, usam esses dispositivos para declarar a nulidade de taxas de juros que estão muito acima da média de mercado. A consequência prática é que o juiz pode substituir a taxa abusiva pela taxa média do mercado e determinar a devolução dos valores pagos a maior.",
        ],
      },
      {
        tipo: "h2",
        titulo: "Art. 42 do CDC e o Código Civil — Proteção adicional",
        paragrafos: [
          "O Art. 42 do CDC proíbe que o fornecedor, ao cobrar dívidas do consumidor, exponha-o ao ridículo, ameace-o ou use meios desleais. O parágrafo único desse artigo vai além e determina que o consumidor cobrado em quantia indevida tem direito à repetição do indébito — ou seja, à devolução em dobro do que pagou a mais — salvo se o erro foi justificável. Esse ponto deve ser analisado por um advogado no contexto de cada caso.",
          "Além do CDC, o Código Civil (Lei nº 10.406/2002) oferece proteções adicionais. O Art. 205 estabelece prazo prescricional geral de 10 anos para ações de revisão de contratos que não tenham prazo específico. Em combinação com o prazo de 5 anos do CDC (Art. 27), o consumidor pode ter mais tempo do que imagina para contestar um contrato.",
          "O Banco Central, por sua vez, edita resoluções do Conselho Monetário Nacional (CMN) que regulamentam como as instituições financeiras devem operar. A exigência de informar o CET antes da contratação, o teto do cheque especial, as regras do consignado — tudo isso é regulação do BCB que complementa os direitos do CDC.",
        ],
      },
      {
        tipo: "h2",
        titulo: "A dica prática: documente tudo",
        paragrafos: [
          "Todo o arcabouço legal descrito neste artigo só funciona na prática quando você tem prova do que aconteceu. Guarde contratos, extratos, comprovantes de pagamento, registros de ligações e correspondências com o banco.",
          "Quando você precisar contestar algo — seja na ouvidoria, no PROCON ou na Justiça — a documentação é a diferença entre ganhar e perder. Um laudo técnico de auditoria que compara as taxas do seu contrato com as médias oficiais do Banco Central é o documento mais valioso que você pode apresentar.",
        ],
      },
      {
        tipo: "cta",
      },
      {
        tipo: "faq",
        itens: [
          {
            q: "O CDC se aplica a todos os contratos com bancos?",
            r: "Sim. O STJ consolidou o entendimento de que as instituições financeiras são fornecedoras de serviços e os clientes são consumidores, e portanto o CDC se aplica às relações bancárias (Súmula 297 do STJ). Isso inclui empréstimos, financiamentos, cartões de crédito e qualquer outro produto bancário.",
          },
          {
            q: "Uma cláusula abusiva anula o contrato inteiro?",
            r: "Em geral, não. O Art. 51, parágrafo segundo do CDC prevê que a nulidade de uma cláusula não invalida o contrato inteiro, exceto quando o contrato se tornar oneroso demais para uma das partes sem aquela cláusula. Na prática, o juiz costuma substituir a cláusula abusiva por condições razoáveis e manter o restante do contrato.",
          },
          {
            q: "Quanto tempo tenho para contestar um contrato bancário?",
            r: "Para ações de reparação de danos nas relações de consumo, o CDC estabelece 5 anos (Art. 27). Para revisão de cláusulas contratuais com base no Código Civil, o prazo pode ser de até 10 anos (Art. 205 do CC). Em casos ativos, o prazo começa a contar diferente — consulte um advogado para sua situação específica.",
          },
          {
            q: "O que é a 'repetição do indébito em dobro' e como ela funciona?",
            r: "É o direito previsto no Art. 42, parágrafo único do CDC. Se o banco cobrou um valor indevido — como juros acima do contratado ou encargos não previstos — você pode ter direito à devolução do dobro do que pagou a mais, não apenas do valor exato. Isso depende de prova de que a cobrança foi indevida e de que não houve erro justificável do banco.",
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 8. reclamar-banco-procon-consumidor-gov
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "reclamar-banco-procon-consumidor-gov",
    titulo: "Como Reclamar do Banco Sem Pagar Nada: PROCON e Consumidor.gov",
    descricao:
      "Guia prático e gratuito para registrar reclamações contra bancos no consumidor.gov.br, PROCON e Banco Central — com modelo de texto e o que anexar.",
    dataPublicacao: "2025-05-29",
    tempoLeitura: 6,
    categoria: "Ação Prática",
    palavrasChave: [
      "reclamar banco PROCON",
      "consumidor.gov.br banco",
      "fale com BC banco central",
      "reclamação banco gratuita",
      "como registrar reclamação banco",
    ],
    secoes: [
      {
        tipo: "intro",
        paragrafos: [
          "Muitas pessoas acreditam que brigar com um banco exige contratar um advogado caro ou ter muito tempo disponível. Na prática, existem canais gratuitos, simples e eficazes para registrar reclamações contra instituições financeiras — e muitas delas são resolvidas sem precisar de nenhuma ação judicial.",
          "O Brasil tem três canais principais para reclamações contra bancos: o consumidor.gov.br, o PROCON e o próprio Banco Central (pelo serviço Fale com o BC). Cada um tem uma função diferente, e usá-los na ordem certa aumenta muito suas chances de resolução.",
          "Neste artigo, você vai aprender exatamente como usar cada canal, o que escrever na reclamação, quais documentos anexar e um modelo de texto que pode adaptar para o seu caso.",
        ],
      },
      {
        tipo: "h2",
        titulo: "Consumidor.gov.br — O canal mais eficaz para começar",
        paragrafos: [
          "O consumidor.gov.br é uma plataforma pública do governo federal, gerida pela Secretaria Nacional do Consumidor (SENACON). As principais instituições financeiras do país estão cadastradas e são obrigadas a responder reclamações em até 10 dias úteis.",
          "Para fazer sua reclamação, acesse consumidor.gov.br, crie uma conta com seu CPF, busque pelo nome do banco e registre sua reclamação com o máximo de detalhes possível. A plataforma é gratuita, online e disponível 24 horas.",
          "A grande vantagem do consumidor.gov.br é que as empresas monitoram a taxa de resolução de reclamações — e um índice de satisfação baixo pode prejudicar a reputação da instituição. Por isso, muitos bancos têm equipes dedicadas a resolver reclamações registradas nessa plataforma com rapidez.",
        ],
      },
      {
        tipo: "lista",
        titulo: "O que incluir na sua reclamação no consumidor.gov.br",
        itens: [
          "Identificação do contrato: número do contrato, tipo de crédito (empréstimo pessoal, consignado, cartão, etc.), data de assinatura e valor contratado.",
          "A taxa cobrada: informe a taxa de juros mensal e/ou o CET conforme consta no seu contrato ou nos seus extratos.",
          "A comparação com a média do BCB: mencione que a taxa do seu contrato é superior à média divulgada pelo Banco Central para aquela modalidade no mesmo período. Se tiver um laudo de auditoria, mencione isso.",
          "O que você está pedindo: seja específico — revisão da taxa, devolução de valores pagos a maior, renegociação, cancelamento de cobrança indevida.",
          "O que já tentou resolver: se já entrou em contato com a ouvidoria, informe o número do protocolo e a resposta recebida.",
        ],
      },
      {
        tipo: "h2",
        titulo: "Modelo de texto para reclamação",
        paragrafos: [
          "Você pode adaptar o seguinte texto para o seu caso: 'Em [data de assinatura], contratei com [Nome do Banco] um [tipo de crédito] no valor de R$ [valor], conforme contrato número [número]. A taxa de juros indicada foi de [taxa]% ao mês. Ao comparar com as taxas médias divulgadas pelo Banco Central do Brasil para a modalidade [modalidade] no período correspondente, verifiquei que a taxa cobrada está significativamente acima da média de mercado. Solicito a revisão das condições do contrato com adequação da taxa à média de mercado e a devolução dos valores pagos a maior, corrigidos monetariamente. Protocolo anterior com ouvidoria: [número], resposta recebida em [data].'",
          "Não precisa ser perfeito — o mais importante é ser claro, específico e documentar o que você está pedindo. Evite linguagem emocional: mantenha o tom factual e objetivo.",
        ],
      },
      {
        tipo: "h2",
        titulo: "PROCON — Para quando o banco não resolver",
        paragrafos: [
          "Se a resposta do banco no consumidor.gov.br não foi satisfatória, o PROCON é o próximo passo. O Programa de Proteção e Defesa do Consumidor existe em todos os estados e em muitos municípios, e tem poderes administrativos que o consumidor.gov.br não tem — ele pode aplicar multas e instaurar processos administrativos.",
          "Muitos PROCONs têm atendimento online. Busque pelo PROCON do seu estado na internet. Se preferir atendimento presencial, ligue antes para verificar se é necessário agendamento. O serviço é completamente gratuito para o consumidor.",
          "Leve toda a documentação: contrato, extratos, número do protocolo da ouvidoria e do consumidor.gov.br, e o comprovante de que a empresa não resolveu. Um processo bem documentado no PROCON tem muito mais chance de gerar um acordo favorável ao consumidor.",
        ],
      },
      {
        tipo: "h2",
        titulo: "Banco Central (Fale com o BC) — Para violações regulatórias",
        paragrafos: [
          "O Banco Central tem um canal chamado 'Fale com o BC' para receber reclamações sobre instituições financeiras. Diferente do consumidor.gov.br e do PROCON, o Fale com o BC não resolve disputas entre cliente e banco — ele serve para denunciar descumprimento de normas regulatórias.",
          "Isso significa que o Fale com o BC é a ferramenta certa quando o banco está cobrando acima do teto legal (como no cheque especial acima de 8% ao mês), quando uma financeira não autorizada está operando, quando você suspeita de fraude no consignado, ou quando o banco se recusou a fornecer informações obrigatórias por lei.",
          "O BCB pode abrir processos administrativos e aplicar penalidades às instituições. As denúncias do Fale com o BC alimentam a fiscalização do sistema financeiro. Acesse pelo site do Banco Central (bcb.gov.br) ou pelo aplicativo Meu BC.",
        ],
      },
      {
        tipo: "lista",
        titulo: "Documentos que você deve ter em mãos ao reclamar",
        itens: [
          "Contrato assinado (todas as páginas, incluindo condições gerais).",
          "Extrato completo de pagamentos realizados ou débitos em conta.",
          "Demonstrativo de saldo devedor atualizado, se o contrato ainda estiver ativo.",
          "Laudo de auditoria comparando sua taxa com a média do Banco Central — o AuditCredito gera esse documento em formato profissional, disponível em auditcredito.com.br/auditoria.",
          "Comprovante de comunicação anterior com a ouvidoria (número de protocolo, e-mail enviado ou resposta recebida).",
          "Print ou cópia de qualquer comunicação do banco sobre o contrato (cartas, e-mails, notificações de cobrança).",
        ],
      },
      {
        tipo: "cta",
      },
      {
        tipo: "faq",
        itens: [
          {
            q: "Em quanto tempo o consumidor.gov.br resolve uma reclamação contra banco?",
            r: "Os bancos cadastrados têm até 10 dias úteis para responder. Na prática, muitas respostas chegam em 5 a 7 dias. A plataforma monitora o índice de solução e satisfação de cada empresa — o que cria incentivo para que os bancos realmente resolvam os problemas registrados.",
          },
          {
            q: "O PROCON pode forçar o banco a devolver dinheiro?",
            r: "O PROCON tem poder administrativo para aplicar multas e fiscalizar, mas não tem poder judicial para forçar uma devolução de valores. Ele pode, porém, criar pressão suficiente para que o banco ofereça um acordo. Para garantir a devolução de valores, o caminho é o Juizado Especial Cível ou a Justiça comum.",
          },
          {
            q: "Posso registrar reclamação no consumidor.gov.br e no PROCON ao mesmo tempo?",
            r: "Sim. Não existe impedimento legal para usar múltiplos canais simultaneamente. Na prática, recomenda-se começar pelo consumidor.gov.br e acionar o PROCON se não obtiver resultado, para concentrar sua energia e documentação. Mas se o caso for urgente, pode usar ambos ao mesmo tempo.",
          },
          {
            q: "O banco pode me cobrar por pedir documentos do meu próprio contrato?",
            r: "Não para documentos básicos do contrato. O banco é obrigado a fornecer cópia do contrato sem custo. Para extratos de meses anteriores, alguns bancos cobram tarifas previstas em tabela — mas a via digital costuma ser gratuita. Se o banco negar a entrega do contrato, isso já é violação do CDC e deve ser registrado na reclamação.",
          },
        ],
      },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export function getArtigo(slug: string): Artigo | undefined {
  return artigos.find((a) => a.slug === slug)
}
