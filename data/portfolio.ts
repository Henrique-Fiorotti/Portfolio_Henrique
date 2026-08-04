export type Project = {
  slug: string;
  windowTitle: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  video?: string;
  technologies: string[];
  site?: string;
  repository: string;
  accent: string;
};

export const profile = {
  name: "Henrique Fiorotti",
  email: "hberdoldifiorotti@gmail.com",
  github: "https://github.com/Henrique-Fiorotti",
  linkedin: "https://www.linkedin.com/in/henrique-berdoldi-fiorotti-4594bb291/",
  about:
    "Sou estudante de Técnico em Desenvolvimento de Sistemas pelo SENAI e atuo na automação de rotinas com Python e JavaScript. Desenvolvo soluções front-end e back-end, sempre buscando unir uma boa experiência visual a código organizado.",
};

export const skills = ["HTML", "CSS", "JavaScript", "Python", "PHP", "React", "Tailwind"];
export const tools = ["GitHub", "VS Code", "MySQL", "Excel", "Canva", "Illustrator", "Photoshop"];

export const projects: Project[] = [
  {
    slug: "hcg-auto",
    windowTitle: "HCG.exe",
    title: "HCG-AUTO",
    subtitle: "Sistema de reservas para concessionária",
    description:
      "Sistema de reservas online para uma concessionária especializada em carros japoneses, com criação de conta, autenticação e gerenciamento de reservas.",
    image: "/images/hcg.png",
    video: "/videos/nissan-kicks-transparente.webm",
    technologies: ["HTML", "CSS", "JavaScript", "PHP", "GitHub", "Canva"],
    site: "https://gpc186.github.io/Galeria_Brutalista/",
    repository: "https://github.com/Henrique-Fiorotti/hcg-auto",
    accent: "#e8399a",
  },
  {
    slug: "brutalist-gallery",
    windowTitle: "BTG.exe",
    title: "THE BRUTALIST GALLERY",
    subtitle: "Galeria digital brutalista",
    description:
      "Experimento visual inspirado no design brutalista, desenvolvido para explorar composição, tipografia e interações digitais marcantes.",
    image: "/images/btg.png",
    video: "/videos/logo-3d-rotacao-eixo-y.webm",
    technologies: ["HTML", "CSS", "JavaScript", "GitHub"],
    site: "https://henrique-fiorotti.github.io/Brutalist_Gallery/index.html",
    repository: "https://github.com/Henrique-Fiorotti/Brutalist_Gallery",
    accent: "#ff4b4b",
  },
  {
    slug: "leitzo",
    windowTitle: "Leitzo.exe",
    title: "Leitzo",
    subtitle: "E-commerce de chocolates artesanais",
    description:
      "Site de vendas especializado em chocolates artesanais, com experiência visual envolvente e uma interface adaptada a diferentes telas.",
    image: "/images/leitzo.png",
    video: "/videos/leitzo-logo-3d-rotacao.webm",
    technologies: ["HTML", "CSS", "JavaScript", "Tailwind", "Canva"],
    site: "https://henrique-fiorotti.github.io/Leitzo/",
    repository: "https://github.com/Henrique-Fiorotti/Leitzo",
    accent: "#a96b27",
  },
  {
    slug: "crud",
    windowTitle: "CRUD.exe",
    title: "CRUD TO-DO",
    subtitle: "Create · Read · Update · Delete",
    description:
      "Aplicação de lista de tarefas que reúne as quatro operações fundamentais de persistência em uma interface direta e funcional.",
    image: "/images/crud.png",
    video: "/videos/To-do (1).mp4",
    technologies: ["HTML", "CSS", "JavaScript", "GitHub"],
    repository: "https://github.com/Henrique-Fiorotti/CRUD_basic",
    accent: "#32ae36",
  },
];
