# Rastreamento de anúncios (Google Ads e Meta Ads)

Estado atual: **ligado desde 10/11/2026** (commit `917b0d7`). O site mostra o aviso de cookies
(Recusar/Aceitar) e só carrega o Google Tag Manager depois do "Aceitar". Sem aceite não há cookie,
chamada ao Google nem envio ao sistema de atendimento. A **origem do contato no WhatsApp**
(código no texto pronto da mensagem) funciona sempre. O pixel da Meta **não** está ligado.

Arquivo de controle: `public/assets/track.js` (bloco `CFG` no topo).

## Contêiner do Google Tag Manager (criado em 06/11/2026)

- Conta: **Urolaser Especialidades Médicas** · Contêiner: **www.urolaservca.com.br** (Web)
- ID: **`GTM-PKSQB3SV`** (ainda NÃO está no site: `CFG.gtm` em `track.js` continua vazio)
- Criado no login **suporte.tivdc@gmail.com**. Adicionar o e-mail da clínica como administrador
  (Administrador > Gerenciamento de usuários) para ela ser dona do contêiner.
- Já configurado (espaço de trabalho, ainda sem versão publicada):
  - Acionadores: `Evento - generate_lead (WhatsApp)`, `Evento - contact (telefone e e-mail)`, `Evento - get_directions (Traçar rota)`
  - Variáveis da camada de dados: `DLV - method`, `DLV - page_type`
- **Google Analytics 4** (criado em 09/11/2026): conta nova da clínica (não a da TIVDC), fuso
  Horário Bahia, fluxo web `https://www.urolaservca.com.br`, ID da métrica **`G-KWPP77M49J`**.
  Medição otimizada desligada (site de saúde: só `page_view` + os eventos abaixo).
- Tags criadas no espaço de trabalho (ainda sem versão publicada):
  - `GA4 - Configuração` (Google Analytics, acionador Initialization - All Pages)
  - `GA4 - Evento generate_lead`, `GA4 - Evento contact`, `GA4 - Evento get_directions`
    (cada uma com o seu acionador de evento personalizado)
- Versão 2 ("v1 - GA4 e eventos de contato") **publicada em 09/11/2026**. O site ainda não
  carrega o contêiner (`CFG.gtm` vazio), então não tem efeito para os visitantes.
- Acesso: `urolaservca@gmail.com` convidado como **Administrador** no Tag Manager (convite
  pendente de aceite) e no Google Analytics (conta a354402169).
- Pendente: tags de conversão do **Google Ads** e da **Meta** (faltam os IDs), marcar
  `generate_lead` como evento-chave no GA4 (só aparece depois do primeiro evento recebido).
- Para ligar no site: preencher `CFG.gtm` e atualizar a política de privacidade no mesmo envio.

## 1. Origem do contato (já ativa, sem cookies)

O botão de WhatsApp acrescenta ao texto pronto um código que o sistema de atendimento já lê
(`src/lib/acquisition.ts`, função `detectAcquisition`):

| Visita | Texto da mensagem termina com | Canal no sistema |
|---|---|---|
| Sem parâmetros | `#site-<contexto>` (ex.: `#site-urologia`, `#site-home`, `#site-artigo-biopsia-de-prostata`, `#site-novembro-azul`) | Site da Clínica |
| `utm_source=google` + `utm_medium=cpc` (ou `gclid`) | `#gads-<campanha>` | Google Ads |
| `utm_source=google&utm_medium=site&utm_campaign=gmn` (link do site no Perfil da Empresa) | `#gmn-site` | Google Meu Negócio · site |
| Botão de WhatsApp do Perfil da Empresa (link `wa.me` direto) | `#gmn-perfil` | Google Meu Negócio |
| `utm_source=instagram&utm_medium=bio` | `#ig-bio` | Instagram Orgânico |
| `utm_source=facebook` (orgânico) | `#fb-<campanha>` | Facebook Orgânico |
| `utm_source=meta` ou `instagram` + `utm_medium=paid` | `utm_source=...&utm_medium=paid&utm_campaign=<campanha>` | Facebook Ads / Instagram Ads |

Para desligar o código (mantendo só a frase "Vim pelo Instagram/Google"): `refCodes: false`.

### URLs para configurar
- **Perfil da Empresa (site):** `https://www.urolaservca.com.br/?utm_source=google&utm_medium=site&utm_campaign=gmn`
- **Perfil da Empresa (WhatsApp):** `https://wa.me/5577999257550?text=Ol%C3%A1!%20Vim%20pelo%20Google%20e%20quero%20agendar%20uma%20consulta.%20%23gmn-perfil`
- **Bio do Instagram:** `https://www.urolaservca.com.br/?utm_source=instagram&utm_medium=bio`
- **Google Ads (sufixo do URL final):** `utm_source=google&utm_medium=cpc&utm_campaign={campaignid}-NOME-DA-CAMPANHA`
  (use um nome curto, sem acento; o código sai como `#gads-nome-da-campanha`)
- **Meta Ads (parâmetros de URL):** `utm_source=meta&utm_medium=paid&utm_campaign=NOME-DA-CAMPANHA`

Melhor opção para Meta: anúncio **clique para o WhatsApp**. O sistema já identifica esses
contatos pelo `externalAdReply` (canal "Instagram Ads"/"Facebook Ads" com o ID do anúncio),
sem depender do site nem de cookies.

## 2. Ligar o rastreamento de anúncios (quando for anunciar)

1. Criar um contêiner no **Google Tag Manager** e colar o ID (`GTM-XXXXXXX`) em `CFG.gtm`.
2. **No mesmo dia, atualizar a Política de Privacidade** (seção 7): informar que o site usa cookies
   do Google (e da Meta, se o pixel for usado) para medir anúncios, só com consentimento, e que
   a escolha pode ser mudada em "Preferências de cookies" no rodapé.
3. Publicar. Passam a existir: aviso de cookies (Recusar/Aceitar), link "Preferências de cookies"
   no rodapé e carregamento do GTM **somente após "Aceitar"** (Consent Mode: tudo negado por padrão).
4. No GTM, criar as tags usando estes eventos (enviados só com consentimento):

| Evento (dataLayer) | Quando | Uso sugerido |
|---|---|---|
| `generate_lead` (`method: whatsapp`) | clique em qualquer botão de WhatsApp | Conversão principal (Google Ads) e evento `Lead` (Meta) |
| `contact` (`method: phone` ou `email`) | clique em telefone ou e-mail | Conversão secundária (`Contact` na Meta) |
| `get_directions` | clique em "Traçar rota" | Conversão secundária |

Os eventos **não levam** especialidade, artigo nem condição de saúde, só `page_type`
(`home`, `artigo`, `institucional`). É de propósito: as políticas do Google e da Meta
restringem o envio de dados de saúde.

## 3. Integração com o sistema de atendimento (cliques com `gclid`/`fbclid`) — ativa

`CFG.endpoint = https://www.conectasaudevc.com.br/api/track/click` (com `www`: sem `www` redireciona
e o beacon se perde). Depois do "Aceitar", com `gclid`, `gbraid`, `wbraid` ou `fbclid`, o site:
1. gera um token curto (6 letras/números),
2. envia `POST` (`sendBeacon`, `Content-Type: text/plain`, sem verificação prévia de CORS) com
   `{ "token", "ts", "params": { utm_*, gclid/gbraid/wbraid/fbclid, ref } }`. **Não vai página de
   entrada nem referrer** (a página pode ser de um tema de saúde),
3. acrescenta `ref:xxxxxx` ao final do texto do WhatsApp.

No CRM (repo `marcacao`, já no ar):
- o endpoint aceita JSON ou text/plain até 2 KB, CORS só para `https://www.urolaservca.com.br`,
  grava token + identificadores de clique + `utm_*`, e apaga os cliques após **90 dias**;
- a 1ª mensagem com `ref:xxxxxx` liga o clique à conversa; `#site-`, `#gads-`, `#gmn-`, `#ig-`,
  `#fb-` (e `#igads-`, `#fbads-`) viram canal + detalhe e somem da tela do atendimento;
- **Meta (API de Conversões):** evento `Lead` só ao **agendar**, só com `event_name`, `event_time`,
  `event_id`, `action_source=system_generated` e `fbc`. Sem telefone, URL nem dado clínico;
- **Google Ads (conversões offline):** planilha em
  `https://www.conectasaudevc.com.br/api/conversions/google-ads` (Basic Auth; usuário e senha
  são digitados no Google Ads por quem administra). Colunas: Google Click ID, Conversion Name
  (`Agendamento` ou `Comparecimento`, nomes exatos) e Conversion Time (fuso -0300).

**`Contact` × `Lead` (Meta):** o clique no WhatsApp é `Contact`; `Lead` é exclusivo da API de
Conversões do CRM (agendamento). Se o pixel for ligado: só PageView e `Contact`, sem
correspondência avançada, sem eventos automáticos, sem parâmetros extras.

**Google Ads:** conversão do clique no WhatsApp, se criada, é **secundária**. Principais:
`Agendamento` (principal) e `Comparecimento` (secundária por ora; vira principal com ~30/mês).
Sem remarketing nem público por página de saúde.

**Privacidade do Google Analytics:** o `track.js` define `page_location`, `page_title` e
`page_referrer` genéricos (`/`, `/artigos`, `/institucional`; título genérico; só origem do
referrer externo), mantendo apenas `utm_*` e `gclid` na entrada por anúncio. Assim nenhum
tema de saúde (nome de artigo/especialidade) chega ao Google.

## 4. Cuidados (saúde)

- **Google Ads:** não usar remarketing nem públicos baseados em páginas de saúde (política de
  publicidade personalizada). Usar só conversões.
- **Meta:** o pixel pode bloquear eventos de páginas que revelem condição de saúde. Usar apenas
  `Lead`/`Contact`, sem os eventos automáticos nem a correspondência avançada.
- **CFM:** anúncios sem promessa de resultado, sem antes/depois, sem preço como atrativo,
  com nome e CRM do responsável técnico (ver Resolução CFM 2.336/2023).
- Cada ligação de ferramenta nova exige atualizar a política de privacidade.

## 5. Teste antes de publicar
1. Abrir `/?utm_source=google&utm_medium=cpc&utm_campaign=teste&gclid=X` e ver o texto do
   WhatsApp terminar em `#gads-teste`.
2. Com `gtm` preenchido: o aviso aparece; antes do "Aceitar" **nenhuma** chamada a
   `googletagmanager.com`; depois do "Aceitar" o GTM carrega; "Recusar" não carrega nada.
3. No GTM, usar "Visualizar" e clicar nos botões para ver `generate_lead`.
