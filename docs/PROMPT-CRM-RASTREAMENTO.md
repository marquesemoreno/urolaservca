# Prompt para a sessão do CRM (ajustar rastreamento e links)

Copie o bloco abaixo e cole na sessão do Claude que trabalha no sistema de atendimento.

```
Contexto: o site da Urolaser (repo marquesemoreno/urolaservca, www.urolaservca.com.br) agora
marca a origem de cada contato no WhatsApp. Preciso que o CRM entenda isso e que a gente feche
o ciclo de anúncios. Leia docs/RASTREAMENTO.md daquele repo para os detalhes.

1) Origem por código no texto da mensagem (já funciona no site)
O texto pronto do wa.me termina com um código. Confirme que src/lib/acquisition.ts
(detectAcquisition) reconhece todos, e corrija o que faltar:
  - #site-<contexto>  -> "Site da Clínica" (ex.: #site-home, #site-urologia,
    #site-artigo-biopsia-de-prostata, #site-novembro-azul). Guarde o <contexto> como detalhe.
  - #gads-<campanha>  -> Google Ads
  - #gmn-<x>          -> Google Meu Negócio (ex.: #gmn-perfil, #gmn-site)
  - #ig-<x>           -> Instagram (ex.: #ig-bio)
  - #fb-<x>           -> Facebook
O código deve ser removido/ignorado na exibição da primeira mensagem, mas salvo no lead.

2) Token de clique pago (ainda não implementado no CRM)
Quando o visitante chega com gclid/fbclid e aceita cookies, o site anexa ao texto o token
"ref:xxxxxx" e envia um sendBeacon (POST) para CFG.endpoint com: ref, gclid/fbclid, utm_*,
página, horário. Crie:
  - um endpoint público POST (ex.: /api/track/click) com CORS só para https://www.urolaservca.com.br,
    validação do corpo, limite de tamanho e rate limit; grava ref -> gclid/fbclid/utm.
  - ao chegar uma conversa cujo texto contém "ref:xxxxxx", casar com o registro e anexar
    gclid/fbclid/campanha ao lead.
  - dados mínimos, sem IP bruto, retenção definida (ex.: 90 dias para cliques sem conversa).
Depois me diga a URL final do endpoint para eu colocar em CFG.endpoint (public/assets/track.js).

3) Conversões offline (Google Ads e Meta)
Quando o lead virar consulta agendada/realizada, exportar a conversão com gclid (Google Ads,
conversões offline) e fbclid/ID de evento (Meta Conversions API). Envie só o necessário, sem
dados clínicos nem diagnóstico, apenas o evento e o identificador de clique. Veja a restrição
de publicidade em saúde das duas plataformas antes de enviar qualquer parâmetro.

4) Relatório
No CRM, mostrar por origem: conversas iniciadas, agendamentos e comparecimentos, com o detalhe
(campanha / página do site). Visitas ao site NÃO vêm pelo CRM, ficam no Google Analytics.

5) Links para o Google Meu Negócio e redes (me devolva prontos para colar)
  - Site no GBP: https://www.urolaservca.com.br/?utm_source=google&utm_medium=organic&utm_campaign=gmn
  - WhatsApp no GBP: https://wa.me/5577999257550?text=Ol%C3%A1!%20Vim%20pelo%20Google%20e%20quero%20agendar%20uma%20consulta.%20%23gmn-perfil
  - Instagram bio: https://www.urolaservca.com.br/?utm_source=instagram&utm_medium=bio
Confirme que cada um cai no canal certo no CRM.

Entregue: o que mudou, como testar (mensagem de exemplo para cada código) e o que eu preciso
configurar do meu lado.
```
