// Outcomes describe existing deliveries, not unverified business impact.
export const caseStudies = {
  orbis: {
    category: "Front-end",
    context: "TCC SENAI · Projeto em equipe",
    role: "Liderança de projeto e desenvolvimento front-end",
    star: {
      situation: "O TCC do SENAI tinha como proposta uma plataforma de monitoramento industrial preditivo, reunindo máquinas, sensores, alertas e equipes.",
      task: "Organizar as etapas e as entregas da equipe e desenvolver as principais telas e fluxos do sistema.",
      action: "Dividi tarefas, acompanhei entregas e desenvolvi o front-end com Next.js e React. Integrei a API da equipe aos formulários, tabelas, dashboard e fluxos de navegação.",
      result: "Front-end com telas e fluxos conectados à API da equipe, reunindo a visualização de dados e as rotinas de operação do projeto.",
    },
    decisions: [
      "React Hook Form e Zod nos formulários e na validação dos dados.",
      "TanStack Table e Recharts na apresentação de tabelas e gráficos.",
      "Socket.IO Client na comunicação em tempo real com a aplicação.",
    ],
    evidence: "O repositório permite explorar o código. O projeto foi desenvolvido em equipe; minha atuação documentada foi na liderança e no front-end.",
  },
  "fastapi-rest-api": {
    category: "Back-end",
    context: "Projeto de API REST",
    role: "Escopo: gerenciamento de usuários, validação e documentação",
    star: {
      situation: "Uma API de usuários precisa organizar as operações de cadastro, leitura, atualização e exclusão e tratar os dados recebidos.",
      task: "Disponibilizar essas operações por uma API REST com validação, respostas seguras e documentação consultável.",
      action: "O projeto utiliza Python e FastAPI, validação via Pydantic, tratamento de erros e documentação automática com Swagger e ReDoc.",
      result: "API com CRUD de usuários, validação das entradas e documentação dos endpoints disponíveis no projeto.",
    },
    decisions: [
      "Pydantic para definir e validar os dados recebidos pela API.",
      "Swagger e ReDoc para consultar os contratos e explorar os endpoints.",
      "Tratamento de erros e respostas seguras como parte do escopo da API.",
    ],
    evidence: "Explore as rotas, os esquemas de validação e a organização do código no repositório.",
  },
  "node-express-product-api": {
    category: "Back-end",
    context: "Estudo prático de back-end",
    role: "Escopo: rotas HTTP e consulta de produtos",
    star: {
      situation: "Estudo da construção de serviços HTTP com JavaScript no servidor.",
      task: "Criar uma API simples para consultar produtos e praticar a organização de rotas e recursos HTTP.",
      action: "O projeto utiliza Node.js e Express para construir as rotas de consulta de produtos.",
      result: "API de consulta de produtos como entrega prática do estudo de Node.js, Express e REST.",
    },
    decisions: [
      "Node.js para executar JavaScript no servidor.",
      "Express para definir as rotas HTTP da aplicação.",
      "Escopo concentrado em consulta de produtos para exercitar os fundamentos.",
    ],
    evidence: "O repositório permite consultar as rotas e a implementação do estudo.",
  },
};

export const projectCategories = {
  orbis: "Front-end", producplus: "Full stack", hubit: "Front-end",
  "identidade-cultura": "Front-end", "fastapi-rest-api": "Back-end",
  "node-express-product-api": "Back-end", "hcg-auto": "Full stack",
  "brutalist-gallery": "Front-end", leitzo: "Front-end", crud: "Front-end",
};
