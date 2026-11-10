# Rastreamento de anúncios (Google Ads e Meta Ads)

Estado atual: **desligado**. Hoje o site não usa cookies, não mostra aviso e não chama terceiros.
Só uma coisa funciona: a **origem do contato no WhatsApp** (código no texto pronto da mensagem).

Arquivo de controle: `public/assets/track.js` (bloco `CFG` no topo).

## 1. Origem do contato (já ativa, sem cookies)

O botão de WhatsApp acrescenta ao texto pronto um código que o sistema de atendimento já lê
(`src/lib/acquisition.ts`, função `detectAcquisition`):

| Visita | Texto da mensagem termina com | Canal no sistema |
|---|---|---|
| Sem parâmetros | `#site-<contexto>` (ex.: `#site-urologia`, `#site-home`, `#site-artigo-biopsia-de-prostata`, `#site-novembro-azul`) | Site da Clínica |
| `utm_source=google` + `utm_medium=cpc` (ou `gclid`) | `#gads-<campanha>` | Google Ads |
| `utm_source=google&utm_medium=perfil` (Perfil da Empresa) | `#gmn-perfil` | Google Meu Negócio |
| `utm_source=instagram&utm_medium=bio` | `#ig-bio` | Instagram Orgânico |
| `utm_source=facebook` (orgânico) | `#fb-<campanha>` | Facebook Orgânico |
| `utm_source=meta` ou `instagram` + `utm_medium=paid` | `utm_source=...&utm_medium=paid&utm_campaign=<campanha>` | Facebook Ads / Instagram Ads |

Para desligar o código (mantendo só a frase "Vim pelo Instagram/Google"): `refCodes: false`.

### URLs para configurar
- **Perfil da Empresa (site):** `https://www.urolaservca.com.br/?utm_source=google&utm_medium=perfil`
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

## 3. Integração com o sistema de atendimento (cliques com `gclid`/`fbclid`)

Se `CFG.endpoint` for preenchido, depois do "Aceitar" e quando a visita tiver `gclid`, `gbraid`,
`wbraid` ou `fbclid`, o site:
1. gera um token curto (6 letras/números),
2. envia `POST` (JSON, `sendBeacon`) para o endpoint: 
   `{ "token": "223z8h", "landing": "/", "referrer": "...", "ts": "ISO-8601", "params": { "utm_source": "google", "utm_medium": "cpc", "utm_campaign": "...", "gclid": "..." } }`
3. acrescenta `ref:223z8h` ao final do texto do WhatsApp.

**Pendente no sistema de atendimento** (não feito, repositório principal):
- rota que receba o POST e guarde `token -> params` (com data, para expirar);
- ler `ref:([a-z0-9]{6})` na 1ª mensagem (junto de `detectAcquisition`) e ligar à conversa;
- quando o contato virar consulta/paciente, enviar a conversão: 
  - **Google Ads**: importação de conversões offline com o `gclid` (ou `gbraid`/`wbraid`);
  - **Meta**: Conversions API com `fbclid`/`fbc` e telefone com hash (SHA-256).
- opcional: aceitar `#igads-`/`#fbads-` em vez da URL `utm_...` no texto (mais discreto).

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
