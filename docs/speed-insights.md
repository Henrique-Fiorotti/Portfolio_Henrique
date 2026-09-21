# Speed Insights no portfólio

O Speed Insights coleta sinais de desempenho durante visitas reais e apresenta
uma avaliação da experiência. Ajuda a acompanhar se uma alteração deixou o
portfólio mais lento e se o comportamento observado no laboratório também
acontece nos aparelhos dos visitantes. Não corrige nem acelera o código sozinho.

Os sinais de desempenho incluem tempo até o conteúdo principal aparecer (LCP),
resposta às interações (INP) e mudanças inesperadas de posição na página (CLS).
O TBT do Lighthouse é uma medida de laboratório; não é o INP de visitantes reais.

## Opção gratuita e Plus

A documentação consultada nesta etapa informa:

- Speed Insights gratuito em todos os planos, com uma nota geral de experiência
  (RES) e uma franquia de 10.000 eventos nos últimos 30 dias, compartilhada pela
  equipe. Evento não significa necessariamente um visitante único.
- Speed Insights Plus libera detalhes de todas as métricas e segmentações,
  com condições e cobrança próprias. A integração inicial não exige contratar Plus.

Verifique as condições atuais no painel e na
[documentação de limites](https://vercel.com/docs/speed-insights/limits-and-pricing).

## Ativação neste projeto

1. Abra o projeto na Vercel e a aba **Speed Insights**; habilite a opção gratuita
   se o painel solicitar ativação.
2. Publique a versão atual: a integração é ativada automaticamente no ambiente
   de produção da Vercel (`VERCEL_ENV=production`). Não é necessário criar uma
   variável para a configuração padrão.
3. Opcionalmente, `NEXT_PUBLIC_SPEED_INSIGHTS=0` desativa a coleta e `1` força
   a ativação em qualquer ambiente. Faça novo deploy após mudar esse valor.
4. Visite algumas páginas e interaja com elas. Depois acompanhe o painel.
   São necessárias visitas para coletar dados; ausência de dados logo após
   ativar não demonstra falha do site.

A integração está em `app/layout.jsx`. A configuração anterior exigia uma
variável de ativação mesmo em produção; essa exigência foi removida. A
disponibilidade do endpoint sozinha não confirma o envio de métricas: confira
também o carregamento do script e as respostas das solicitações de coleta.

Para verificar após o novo deploy, use a aba Network do navegador e confira o
script com `data-sdkn="@vercel/speed-insights/next"`, além do painel. A Vercel pode
usar um caminho gerado (`/<identificador>/script.js`) em vez do caminho padrão
`/_vercel/speed-insights/`. Extensões de bloqueio podem impedir a coleta.

Após a publicação da ativação automática, o navegador carregou o SDK 2.0.0
com HTTP 200 e sem erros de console. O script servido pela Vercel ignora
`navigator.webdriver` e navegadores Headless: por isso a visita automatizada de
verificação não enviou métricas, comportamento esperado. Não foi confirmada a
presença de dados no painel autenticado. Verifique com uma visita normal e
acompanhe a chegada de dados reais, sem tratar auditorias como visitantes.

Referências: [primeiros passos](https://vercel.com/docs/speed-insights/quickstart)
e [métricas](https://vercel.com/docs/speed-insights/metrics).
