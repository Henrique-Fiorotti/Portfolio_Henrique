# STAR, currículo e acompanhamento de produção

Continuação da revisão de 20/09/2026. Resultados de laboratório em Edge,
Lighthouse 13.5.0. A home recebeu três rodadas por perfil; o currículo, uma rodada
mobile. O site público e o build local são versões diferentes e estão separados
abaixo. Os relatórios brutos em `.audit/` são locais e não entram no Git.

## Entregas

- Experiência da Braido em Situação, Tarefa, Ação e Resultado, compartilhada entre
  home, currículo HTML e PDF. Os resultados descrevem entregas já documentadas.
- Três estudos de caso estáticos: ORBIS, API de usuários com FastAPI e API de
  produtos com Node.js. O ORBIS identifica a liderança e o front-end como atuação
  pessoal em um projeto de equipe; as APIs descrevem o escopo técnico disponível.
- Destaques com links próprios e inclusão no sitemap. A navegação "Projetos"
  leva aos estudos de caso antes do carrossel.
- Visão geral dos dez projetos com filtros por área, código e demonstrações.
  Um `<details>` nativo evita estender a home com dez cards duplicados e permite
  abrir a lista sem JavaScript. O carrossel original permanece disponível.
- PDF gerado em cada build a partir das mesmas fontes do currículo HTML. Uma
  página, texto selecionável, links clicáveis; verificação de conteúdo por
  extração de texto e inspeção visual. Geração determinística verificada e
  comparação do arquivo com o Git preparada na CI.
- Cache dos caracteres do fundo animado; os quadros deixam de executar milhares
  de `fillText`. O fundo só anima depois da introdução que o cobre; os tempos e a
  sequência da introdução foram preservados.
- Checagem semanal de links e comando para auditar a publicação. Speed Insights
  integrado por configuração, sem habilitar um serviço na conta do usuário.

## Comparação local

"Anterior" é o resultado da primeira revisão (`.audit/final`). "Atual" é
`.audit/star-optimized`, com STAR, estudos, filtros e otimizações adicionais.

| Medida | Anterior | Atual |
|---|---:|---:|
| Home mobile — desempenho | 85 | 86 |
| Home mobile — LCP | 3,67 s | 3,42 s |
| Home mobile — TBT | 248 ms | 275 ms |
| Home mobile — transferência inicial | 0,41 MB | 0,36 MB |
| Home desktop — desempenho | 99 | 100 |
| Home desktop — LCP | 0,75 s | 0,78 s |
| Currículo mobile — desempenho | 96 | 97 |

Acessibilidade, boas práticas e SEO: 100 nas sete rodadas atuais. Isso não prova
conformidade completa de acessibilidade nem ausência de problemas de segurança.

O TBT mobile **não melhorou em relação à primeira revisão**: mediana de 275 ms,
com rodadas de 385, 275 e 122 ms. A nota variou entre 82, 86 e 90. O LCP continua
identificando a introdução; não representa o momento em que ela termina. A
otimização do canvas reduz trabalho de renderização, mas não elimina o custo de
hidratação, layout e scripts. Não se deve extrapolar um perfil de CPU para TBT ou
INP de visitantes. O volume inicial também depende das imagens que entram no
viewport e da disposição do conteúdo, não só de compressão.

O perfil exploratório antes da alteração identificou a função de desenho do
canvas como maior consumidora de CPU. Uma primeira comparação com o cache
reduziu as tarefas longas de 71 para 33 e o bloqueio acumulado de 1.523 para
1.131 ms durante navegação e 12 segundos após o carregamento, com CPU 4x. São
amostras diagnósticas únicas, não uma estimativa estatística nem o TBT do
Lighthouse. Os perfis completos ficam em `.audit/runtime-before-star` e
`.audit/runtime-after-star`; o perfil da implementação final fica em
`.audit/runtime-star-optimized`.

No perfil final, a amostra registrou 10 tarefas longas e 578 ms de bloqueio
acumulado, contra 71 e 1.523 ms na amostra inicial. O tempo amostrado diretamente
na função de desenho caiu de 5.577 para 2.040 ms. Isso é coerente com a redução
de trabalho repetido e dos quadros cobertos pela introdução; continua sendo uma
comparação exploratória de execução, distinta dos resultados Lighthouse acima.

## Versão pública observada

Endereço confirmado: https://portfolio-henrique-edi3.vercel.app/

| Página / perfil | Desempenho | Observação |
|---|---:|---|
| Home mobile | 63 | Mediana de 58, 65 e 63; LCP 6,86 s; transferência 5,76 MB |
| Home desktop | 89 | Mediana de 89, 90 e 78 |
| Currículo mobile | 82 | Uma rodada |

Na medição, o deploy ainda servia a versão anterior às melhorias locais:

- HTTPS/HSTS presente, mas sem CSP, `nosniff` ou canonical na home.
- `/robots.txt`, `/sitemap.xml`, `/opengraph-image` e `/projetos/orbis` retornaram 404.
- Home, currículo HTML e PDF retornaram 200.

Essas observações estão em `.audit/deployment/results.json` e as sete medições
em `.audit/public-before-star`. Não se deve apresentar o resultado local como
resultado já publicado. Depois do deploy, repetir `audit:deployment` e
`audit:performance` apontando `AUDIT_URL` para o domínio público.

## Links

A demonstração antiga de Identidade & Cultura retornou 404; o botão público foi
retirado, mantendo o repositório. A segunda execução encontrou 16 URLs com HTTP
200 e uma revisão pendente: LinkedIn respondeu 999, bloqueando a automação.
Status 200 não verifica semanticamente o conteúdo de uma página. O relatório
fica em `.audit/links/results.json`; o workflow semanal em
`.github/workflows/links.yml` destaca bloqueios para revisão manual.

## Validações e limites

- Lint sem avisos, build estático e auditoria npm sem vulnerabilidades conhecidas.
- 23 grupos de verificações de navegador: desktop/celular, STAR, filtros,
  estudos de caso, teclado, contraste, erros, PDF, links internos e cenários
  sem JavaScript/armazenamento. Capturas revisadas para experiência, diretório
  e PDF. Testes automatizados não substituem leitor de tela ou aparelho físico.
- PDF com todos os campos esperados do currículo encontrados no texto extraído.
- O workflow foi preparado; sua execução no GitHub depende do envio dos commits.
- Não há autenticação Vercel neste ambiente para ativar Speed Insights. É preciso
  habilitar o recurso no painel, configurar `NEXT_PUBLIC_SPEED_INSIGHTS=1` e
  publicar novamente. Dados reais só existirão após tráfego na versão publicada.
- Não foram inventados números de produtividade, SLA, redução de falhas ou
  resultados comerciais. Um caso específico de suporte e sua consequência
  confirmada podem tornar o STAR profissional mais concreto posteriormente.

Referências: [Speed Insights](https://vercel.com/docs/speed-insights/quickstart),
[laboratório versus campo](https://web.dev/articles/lab-and-field-data-differences),
[PDFKit](https://pdfkit.org/docs/text.html).

## Verificação após a publicação

Na continuação, a publicação já servia o conteúdo STAR do commit `e291a60`.
O workflow [Quality checks](https://github.com/Henrique-Fiorotti/Portfolio_Henrique/actions/runs/35545733795)
terminou com sucesso para esse commit. Home, currículo, PDF, estudo ORBIS,
robots, sitemap e imagem social responderam 200; CSP, nosniff, HSTS e canonical
estavam presentes. O verificador foi corrigido para aceitar a equivalência entre
o canonical da raiz com e sem barra final, mantendo a rejeição de domínio,
protocolo, caminho ou query diferentes.

Nova medição sobre o domínio público (`.audit/public-star`), com o mesmo número
de rodadas e perfis da medição pública anterior:

| Medida pública | Antes do deploy | Após o deploy |
|---|---:|---:|
| Home mobile — desempenho | 63 | 83 |
| Home mobile — LCP | 6,86 s | 2,81 s |
| Home mobile — TBT | 211 ms | 476 ms |
| Home mobile — transferência inicial | 5,76 MB | 0,35 MB |
| Home desktop — desempenho | 89 | 100 |
| Currículo mobile — desempenho | 82 | 98 |

As notas mobile foram 88, 83 e 83. Acessibilidade, boas práticas e SEO ficaram
em 100 nas sete rodadas. Capturas não indicaram overflow horizontal nem erros
de JavaScript. O aumento de TBT continua explícito: a melhora do carregamento
não elimina a necessidade de investigar resposta às interações. Esses testes
são Lighthouse sobre a publicação, não dados de visitantes reais.

O endpoint do Speed Insights respondeu 200, mas a página ainda não carregava a
integração habilitada. A coleta de campo depende da configuração no painel e de
um novo build com `NEXT_PUBLIC_SPEED_INSIGHTS=1`. Consulte o
[guia de ativação e limites](speed-insights.md).
