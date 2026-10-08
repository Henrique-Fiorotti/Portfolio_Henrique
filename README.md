# Portfólio — Henrique Fiorotti

Portfólio pessoal responsivo desenvolvido com Next.js e React, com projetos, habilidades e currículo organizados em componentes reutilizáveis.

## Executar localmente

É necessário ter Node.js 20.9 ou mais recente instalado.

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000` (você será levado a `/pt`, `/en`… conforme o idioma do navegador).

## Comandos

- `npm run dev`: inicia o ambiente de desenvolvimento.
- `npm run build`: gera a versão de produção.
- `npm start`: executa a versão de produção.

## Estrutura

- `app/`: páginas, layout e estilos globais.
- `components/`: componentes reutilizáveis da interface.
- `data/`: conteúdo dos projetos e do currículo.
- `public/`: imagens e vídeos.

O currículo é uma seção da página inicial (`#curriculo`), com download em PDF (`public/curriculo-henrique-fiorotti.pdf`). Endereços antigos como `/curriculo` redirecionam para essa seção.

## Idiomas

Cada idioma tem a própria URL estática: `/pt`, `/en`, `/es`, `/fr` e `/de`. Quem acessa `/` (ou qualquer endereço sem idioma) é redirecionado pelo `proxy.js` para o idioma escolhido antes no seletor (cookie) ou, na primeira visita, para o idioma do navegador; idiomas não suportados caem em inglês e robôs de busca em português. As páginas declaram as versões umas das outras com `hreflang`.

Os textos ficam em `data/i18n.js`, `data/portfolio.js` e `data/resume.js`; para adicionar um idioma, inclua o código em `locales` e as traduções nesses três arquivos.

Fora da Vercel, defina `SITE_URL` (por exemplo `https://seudominio.com`) para que os links canônicos e `hreflang` usem o domínio certo.
