# Portfólio — Henrique Fiorotti

Portfólio em Next.js e React, com páginas geradas estaticamente, conteúdo em JavaScript/JSX e identidade visual inspirada em janelas de desktop.

## Executar localmente

Use Node.js 24 LTS e as versões do lockfile.

```bash
npm ci
npm run dev
```

Acesse `http://localhost:3000`.

No PowerShell, use `npm.cmd` se a política de execução bloquear `npm.ps1`.

## Comandos

- `npm run dev`: inicia o ambiente de desenvolvimento.
- `npm run build`: gera a versão de produção.
- `npm start`: executa a versão de produção.
- `npm run lint -- --max-warnings=0`: verifica o código com ESLint.
- `npm audit`: consulta vulnerabilidades conhecidas.
- `npm run test:browser`: testa a versão de produção com Playwright e axe.
- `npm run audit:performance -- current`: mede desempenho com Lighthouse.
- `npm run optimize:media`: regenera as prévias WebP a partir dos originais locais.

## Publicação na Vercel

Importe o repositório como projeto Next.js, com a raiz do repositório como Root
Directory e `npm run build` como comando de build. Use a saída padrão do Next.js;
`legacy/` não é o diretório de publicação.

O domínio canônico e o sitemap usam automaticamente `VERCEL_PROJECT_PRODUCTION_URL`.
Mantenha habilitada a exposição das variáveis de sistema na Vercel. Para substituir
o domínio, configure `SITE_URL` com a origem pública completa e faça novo deploy.
Veja `.env.example`. Nenhum segredo deve usar o prefixo `NEXT_PUBLIC_`.

Sem domínio configurado localmente, não há canonical e o sitemap fica vazio;
as prévias de compartilhamento usam localhost apenas no build local. Previews
da Vercel recebem `noindex`, com links canônicos apontando à produção.

## Testes e medições

Gere o build e mantenha `npm start -- --hostname 127.0.0.1 --port 3217` ativo.
Execute `npm run test:browser` ou `npm run audit:performance -- current` em outro
terminal. `AUDIT_URL` permite usar outro endereço.

Os testes usam Edge no Windows. Em Linux/macOS, instale o Chromium com
`npx playwright install chromium`. Para o Lighthouse, configure `CHROME_PATH`
com o caminho do Chrome/Edge se a detecção automática não encontrar o navegador.

Relatórios e capturas ficam em `.audit/`, fora do Git. São três rodadas na home
por perfil (celular e desktop), com rede/CPU simuladas pelo Lighthouse, e uma
rodada de celular no currículo. Compare medianas no mesmo computador, sem builds
ou outros testes simultâneos. Os resultados de laboratório não substituem dados
de visitantes reais. O loader conserva sua sequência e duração de apresentação.

O workflow `Quality checks` executa lint, auditoria de produção, build e testes
no navegador. O Dependabot propõe atualizações. O ESLint usa a linha 9 enquanto
os plugins React/import/a11y do `eslint-config-next` não suportarem a linha 10.

## Estrutura

- `app/`: páginas, layout e estilos globais.
- `components/`: componentes reutilizáveis da interface.
- `data/`: conteúdo dos projetos e do currículo.
- `public/`: imagens e vídeos.
- `app/styles/`: estilos separados por responsabilidade, começando pelo loader.
- `assets/source/`: originais e arquivos antigos, fora da publicação do Next.js.
- `legacy/`: versão HTML/CSS/JavaScript/PHP anterior.
- `scripts/`: otimização, testes e medições reproduzíveis.
- `docs/`: resultados da revisão.

O currículo está disponível em `/curriculo`. O PDF em
`public/curriculo-henrique-fiorotti.pdf` é gerado automaticamente pelo `prebuild`
a partir de `data/resume.js` e `data/portfolio.js`, os mesmos dados do HTML.
Use `npm run generate:resume` para regenerar sem compilar o site e inclua o PDF
atualizado no commit. A CI verifica se o arquivo publicado coincide com a fonte.

## Experiências e estudos de caso

Resultados desta etapa e situação do deploy: [revisão STAR e produção](docs/star-and-production-review.md).

A experiência profissional usa `star` em `data/resume.js` (situação, tarefa,
ação e resultado). As páginas estáticas `/projetos/[slug]` usam
`data/case-studies.js`. Descreva resultados demonstráveis: não transforme objetivos
em ganhos medidos nem atribua a uma pessoa o trabalho completo de uma equipe.
Os resultados atuais descrevem entregas documentadas; métricas de impacto e casos
específicos de atendimento podem ser acrescentados quando confirmados.

O diretório de projetos permite filtrar por área. Sua abertura usa `<details>`
nativo para manter a página inicial compacta. Sem JavaScript, a lista pode ser
aberta com todos os projetos e links; somente os filtros dependem de JavaScript.

## Verificação contínua e produção

- `npm run check:links`: verifica demonstrações e repositórios em pequenos lotes,
  com timeout e repetição de falhas transitórias. HTTP 404/410 falha o comando;
  bloqueios como 403/429/999 exigem revisão manual. O workflow semanal publica o
  relatório como artefato e destaca revisões pendentes, sem remover links sozinho.
- `npm run profile:runtime -- nome`: perfil de CPU e tarefas longas no celular,
  com CPU 4x. Saída em `.audit/runtime-nome`. Esses 12 segundos de observação
  não equivalem ao TBT do Lighthouse nem ao INP de visitantes reais.
- `AUDIT_URL=https://portfolio-henrique-edi3.vercel.app npm run audit:deployment`:
  verifica HTTPS, rotas, canonical e cabeçalhos da versão publicada.
  No PowerShell, use `$env:AUDIT_URL='https://portfolio-henrique-edi3.vercel.app'`
  antes de executar o comando.
- `AUDIT_URL` também pode apontar o Lighthouse para a publicação. Guarde resultados
  de produção separados dos testes locais e registre qual versão foi medida.

O domínio confirmado é `https://portfolio-henrique-edi3.vercel.app`.
`SITE_URL` e `VERCEL_PROJECT_PRODUCTION_URL` têm precedência sobre esse padrão.

Para coletar métricas reais, a integração de **Vercel Speed Insights** está
preparada: habilite o recurso no painel do projeto, configure
`NEXT_PUBLIC_SPEED_INSIGHTS=1` e faça um novo deploy. Confira a disponibilidade
e o uso no seu plano antes de ativar. A integração está desativada por padrão
para não solicitar um endpoint inexistente. Não há dados de visitantes reais
até a ativação, a publicação e a chegada de tráfego.
Documentação: https://vercel.com/docs/speed-insights/quickstart

## Segurança e desempenho

Cabeçalhos são definidos em `next.config.mjs`. A CSP permite scripts inline para
a hidratação estática do Next.js, mas não permite `unsafe-eval` em produção,
incorporação em iframes ou recursos externos. É uma proteção complementar, não
uma CSP estrita baseada em nonces. HTTPS é fornecido pela Vercel.

Fontes e imagens são locais. Vídeos só recebem `src` ao interagir e respeitam
movimento reduzido. O conteúdo permanece acessível sem JavaScript; um temporizador
libera a página se o loader falhar. O tema funciona com armazenamento bloqueado;
posições de janelas não são persistidas. E-mail, telefone e currículo continuam
públicos intencionalmente.
