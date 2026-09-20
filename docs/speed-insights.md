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
2. Em **Settings → Environment Variables**, configure
   `NEXT_PUBLIC_SPEED_INSIGHTS` com o valor `1` para **Production**.
3. Faça um novo deploy. Variáveis `NEXT_PUBLIC_` entram no build; apenas salvar
   a variável não modifica o JavaScript da publicação existente.
4. Visite algumas páginas e interaja com elas. Depois acompanhe o painel.
   São necessárias visitas para coletar dados; ausência de dados logo após
   ativar não demonstra falha do site.

A integração está em `app/layout.jsx`. Na publicação verificada nesta etapa,
o endpoint `/_vercel/speed-insights/script.js` respondeu 200, mas a página não
incluía o componente habilitado. A disponibilidade do endpoint sozinha não
confirma envio de métricas ou ativação na conta.

Para verificar após o novo deploy, use a aba Network do navegador e procure
solicitações para `/_vercel/speed-insights/`, além de conferir o painel. Extensões
de bloqueio podem impedir a coleta. Evite confundir o acesso do auditor automático
com uma amostra representativa de visitantes.

Referências: [primeiros passos](https://vercel.com/docs/speed-insights/quickstart)
e [métricas](https://vercel.com/docs/speed-insights/metrics).
