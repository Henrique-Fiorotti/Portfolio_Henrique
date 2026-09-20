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

O currículo está disponível em `/curriculo` e pode ser salvo como PDF usando a impressão do navegador.

O arquivo de download fica em `public/curriculo-henrique-fiorotti.pdf`; revise o
PDF e os dados HTML quando atualizar sua experiência.

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
