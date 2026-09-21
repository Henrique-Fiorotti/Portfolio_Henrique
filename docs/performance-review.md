# Revisão do portfólio — 20/09/2026

Medições locais na versão de produção, no mesmo computador Windows, com Edge e
Lighthouse 13.5.0. Três rodadas por perfil na home; os valores abaixo são medianas.
O currículo recebeu uma rodada em cada versão. Configurações padrão do Lighthouse:
celular com CPU 4x e rede simulada; desktop com CPU 1x e rede simulada de desktop.
Nenhuma medição é de visitantes reais ou do domínio publicado na Vercel.

## Home — celular

| Medida | Antes | Depois |
|---|---:|---:|
| Desempenho | 71/100 | 85/100 |
| FCP | 2.51 s | 1.03 s |
| LCP | 8.40 s | 3.67 s |
| TBT | 73 ms | 248 ms |
| CLS | 0.00009 | 0.00010 |
| Transferência | 6.38 MB | 0.41 MB |

## Home — desktop

| Medida | Antes | Depois |
|---|---:|---:|
| Desempenho | 93/100 | 99/100 |
| FCP | 0.72 s | 0.27 s |
| LCP | 1.59 s | 0.75 s |
| TBT | 0 ms | 0 ms |
| CLS | 0.00033 | 0.00033 |
| Transferência | 6.31 MB | 0.38 MB |

## Currículo — celular (uma rodada)

| Medida | Antes | Depois |
|---|---:|---:|
| Desempenho | 84/100 | 96/100 |
| FCP | 2.72 s | 0.76 s |
| LCP | 3.16 s | 2.56 s |
| TBT | 182 ms | 94 ms |
| CLS | 0.00000 | 0.00000 |
| Transferência | 0.29 MB | 0.32 MB |

## Interpretação

A transferência inicial da home no perfil celular caiu aproximadamente 93.5%.
Os sete SVGs que continham fotos/prévias embutidas somavam 7.590.598 bytes; suas
versões WebP somam 153.888 bytes (redução de 98,0%). Isso é tamanho de arquivos,
não a transferência total, que inclui HTML, scripts, fontes e outras imagens.

O Lighthouse identificou letras do loader como candidatos ao LCP da home.
**O LCP da tabela não significa que o visitante já terminou de assistir à introdução.**
A sequência GSAP de apresentação foi conservada, com aproximadamente 4,4 segundos
de duração depois de iniciada. O limite de recuperação é de 8 segundos quando o
JavaScript falha; com JavaScript desativado, o conteúdo já nasce visível.

Consulte também o TBT, sem assumir que todas as medidas melhoraram. Um FCP mais
cedo muda a janela em que o Lighthouse soma bloqueios; ainda existe custo de
hidratação e animações na thread principal. O currículo pode transferir mais
bytes com as fontes locais, embora deixe de depender da folha de estilos remota
do Google e do fundo animado. Os resultados variam entre rodadas; TBT não é INP.
Medições de INP e da experiência real devem ser feitas após a publicação.

O trabalho total na thread principal da home móvel caiu de
5.42 s para 3.83 s (medianas),
enquanto o TBT passou de 73 ms para 248 ms. São medidas diferentes: o TBT conta
somente o excesso de 50 ms das tarefas longas dentro de uma janela específica.
Não houve regressão de funcionalidade nos testes; a resposta em aparelhos físicos
e dados de campo ainda precisa ser acompanhada.

## Mudanças aplicadas

- Next.js 16.3.5 e cadeia de dependências corrigida. Instalação limpa com npm ci;
  auditoria completa sem vulnerabilidades conhecidas no momento da verificação.
- Fontes locais via next/font, imagens WebP responsivas via next/image e vídeos
  sem download inicial. As prévias de APIs foram copiadas para arquivos locais.
- Home dividida em conteúdo de servidor e interações menores. Janelas estáticas
  não instalam listeners de arraste. Canvas e Lenis ficam apenas na home;
  cálculos invariantes do canvas são reaproveitados. O carrossel só prepara suas
  animações perto da área visível ou ao receber uma interação.
- Loader com conteúdo acessível sem JavaScript, temporizador de recuperação e
  respeito a movimento reduzido. Tema continua funcionando sem localStorage.
- Cabeçalho corrigido em telas pequenas, foco de teclado visível, navegação do
  carrossel por setas/Home/End e contraste corrigido nos subtítulos e botões.
- CSP compatível com geração estática, nosniff, bloqueio de iframe e políticas
  de referência/permissões. A CSP admite scripts inline do Next e não equivale
  a uma política estrita com nonce; unsafe-eval só é permitido no desenvolvimento.
- Metadados sociais, imagem de compartilhamento, robots e sitemap. Na Vercel,
  o endereço vem de VERCEL_PROJECT_PRODUCTION_URL; SITE_URL permite sobrescrever.
- Link incompatível do HCG-AUTO removido; o repositório continua disponível.
- Arquivos antigos preservados em legacy/ e assets/source/, fora de public/.
  A pasta de originais continua legível se o repositório Git for público.
- ESLint, workflow de qualidade e Dependabot configurados. O ESLint permanece
  na linha 9 por compatibilidade com os plugins de eslint-config-next.

## Verificação

Build de produção e lint sem avisos aprovados. Foram concluídos 19
grupos de verificações no navegador, incluindo todos os projetos em temas claro
e escuro, viewport de 320 px, modal/Escape/foco, PDF, imagens sociais, cabeçalhos,
falha de bundles, JavaScript desativado e armazenamento bloqueado. Nenhuma violação
WCAG A/AA foi detectada pelo axe nos cenários testados. Isso não substitui testes
humanos com leitores de tela ou uma auditoria de segurança completa.

Os workflows foram preparados localmente; sua execução no GitHub e os cabeçalhos
do domínio público precisam ser conferidos depois do deploy. E-mail, telefone e
currículo continuam públicos. O domínio definitivo não foi inventado: sem variável
de domínio no build local, o sitemap fica vazio e não é emitido canonical.

## Rodada de trabalho na thread principal

Esta rodada partiu de uma medição, não de uma suposição. O perfil de CPU da
página inicial sob desaceleração de 4x (`npm run profile:runtime`) mostrou que,
dos 2643 ms de trabalho na thread principal após o carregamento, 2240 ms eram o
desenho do fundo animado em canvas, que gerava long tasks a cada poucas centenas
de milissegundos com a página parada.

O renderizador foi extraído para `lib/code-background.js`, que só precisa de um
contexto 2D, e passou a rodar num worker através de `transferControlToOffscreen`.
Navegadores sem OffscreenCanvas mantêm o laço anterior na thread principal. A
matemática do desenho não mudou. Medido no mesmo build e perfil: long tasks
caíram de 20 para 8 e o desenho deixou de aparecer na thread principal.

Em seguida, o detalhamento do Lighthouse apontou 927 ms em "Style & Layout" no
celular. A animação de entrada animava `width` em cada letra e `left`, `top`,
`font-size`, `font-weight` e `letter-spacing` no nome, propriedades que forçam
novo layout a cada quadro. Comparando a mesma página com e sem a introdução:

| Medida (4x de desaceleração) | Antes | Depois |
|---|---:|---:|
| Layouts durante a introdução | 120 | 17 |
| Layouts sem a introdução (referência) | 12 | 14 |
| Tempo de layout com introdução | 1216 ms | ~570 ms |
| Tempo de layout sem introdução | 640 ms | ~590 ms |
| Cumulative layout shift | 0,0001–0,0003 | 0 |

As larguras passaram a ser medidas uma única vez; o colapso é recalculado a
partir da escala atual das letras e reposiciona tudo com transforms, e o voo até
o logo virou um FLIP. O custo de layout da introdução ficou dentro do ruído de
zero.

O que **não** mudou: o TBT e a nota de desempenho do Lighthouse. As três rodadas
móveis deram 232, 140 e 239 ms de TBT contra 272, 193 e 134 ms antes — a mesma
faixa. O TBT aqui é dominado pela avaliação inicial dos scripts (o pacote de
animação com GSAP, ScrollTrigger e Lenis custa 426 ms de CPU na janela de
carregamento, mais que o react-dom), e o LCP de ~3,4 s é determinado pela
duração da introdução, que segura o conteúdo. Nenhuma das duas mudanças ataca
esses dois pontos; elas reduzem trabalho sustentado, resposta a interação e
consumo de bateria.

A suíte de navegador passou a ter 27 grupos, com duas verificações novas: o
fundo precisa estar sob o controle do worker (o canvas da página não pode mais
devolver um contexto 2D) e a introdução precisa pousar o nome exatamente sobre o
logo do cabeçalho, com tolerância de 1 px. Capturas quadro a quadro da introdução
antes e depois coincidem na entrada e no colapso; o pouso, que antes errava o
logo em cerca de 13 px, agora é exato. Lint, build e os 27 grupos passam.

Dois caminhos permanecem em aberto, ambos com contrapartidas de produto:
encurtar a introdução (melhora o LCP diretamente) e adiar o carregamento do
GSAP, hoje impossível sem reestruturar a introdução, que depende dele para
revelar o conteúdo.

## Evidências e reprodução

- [Relatórios anteriores](../.audit/before/summary.json)
- [Relatórios finais](../.audit/final/summary.json)
- [Verificações de navegador](../.audit/checks/summary.json)
- [Captura em 320 px](../.audit/checks/mobile-320.png)
- [Imagem de compartilhamento](../.audit/checks/share-image.png)
- Cada diretório de medições inclui HTML e JSON completos de cada rodada.

Os arquivos brutos ficam em .audit/, ignorado pelo Git. Para reproduzir, siga o
README e execute npm run audit:performance com o servidor de produção ativo.

Referências de implementação: [imagens no Next.js](https://nextjs.org/docs/app/api-reference/components/image),
[CSP e geração estática](https://nextjs.org/docs/app/guides/content-security-policy),
[variáveis de domínio da Vercel](https://vercel.com/docs/environment-variables/system-environment-variables).
