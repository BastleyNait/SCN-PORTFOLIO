export const personalData = {
  name: "Sebastian Arley Chirinos Negrón",
  shortName: "Sebastian Chirinos",
  username: "BastleyNait",
  title: "Systems Engineer Developer | React & FastAPI | Node JS & Django | AI/ML & Cloud Enthusiast",
  degree: "Systems Engineer",
  status: "Final Semester - National University of San Agustín de Arequipa (UNSA)",
  location: "Arequipa, Peru 🇵🇪",
  email: "schirinosne@gmail.com",
  linkedin: "https://www.linkedin.com/in/sebastian-chirinos-negron/",
  whatsapp: "https://wa.me/51987545926",
  github: "https://github.com/BastleyNait",
  portfolioUrl: "https://github.com/BastleyNait",
  bio: "Systems Engineer / Software Engineer passionate about modern software engineering, microservices architecture, and Edge AI. I have 5+ projects deployed to production on Vercel and Google Cloud. Systems Engineering graduate from UNSA with strong fundamentals in security, networking, software testing, and agile methodologies.",
  stats: [
    { label: "Production Projects", value: "4+", icon: "Rocket" },
    { label: "Frontend", value: "React / Next.js / Vue.js", icon: "Layers" },
    { label: "Backend", value: "Node.js / Django / FastAPI", icon: "Server" },
    { label: "Mobile Focus", value: "React Native & Kotlin", icon: "Smartphone" },
  ],
  typingLines: [
    "Systems Engineer Developer | React + FastAPI",
    "Cloud & Machine Learning Enthusiast",
    "4+ Production Projects Deployed",
    "UNSA Systems Engineer (Final Semester)",
    "Open to new job opportunities 🚀"
  ]
};

export const projectsData = [
  {
    id: "lo-exacto",
    title: "Lo Exacto",
    category: "Full stack Web & Landing",
    description: "Production web platform and corporate landing page for management and digital presence.",
    longDescription: "Production-optimized web platform featuring Next.js architecture and PostgreSQL persistence. Designed for high performance, superior SEO, and ultra-fluid navigation.",
    tech: ["Next.js", "React", "PostgreSQL", "Tailwind CSS", "Vercel"],
    liveUrl: "https://www.lo-exacto.com/",
    repoUrl: "https://github.com/BastleyNait/LO-EXACTO.git",
    featured: true,
    status: "Production",
    gradient: "from-sky-500/20 via-blue-600/20 to-indigo-700/20",
    accentColor: "#38bdf8",
    previewType: "iframe",
    previewFallbackImage: "./lo-exacto.png"
  },
  {
    id: "calitop-services",
    title: "Calitop Services",
    category: "Full stack Web & Landing",
    description: "Corporate web platform in production with interactive catalog and administrative dashboard.",
    longDescription: "Comprehensive web system featuring a dynamic services catalog, administrative control panel, and a robust PostgreSQL backend supporting inventory and service management.",
    tech: ["Next.js", "PostgreSQL", "React", "Tailwind CSS", "Vercel"],
    liveUrl: "https://www.calitop-services.com/",
    repoUrl: "https://github.com/BastleyNait/CALITOP-WEB",
    featured: true,
    status: "Production",
    gradient: "from-cyan-500/20 via-teal-600/20 to-emerald-700/20",
    accentColor: "#2dd4bf",
    previewType: "iframe",
    previewFallbackImage: "./calitop.png"
  },
  {
    id: "revolt-laptop",
    title: "Revolt Laptop",
    category: "E-Commerce & POS",
    description: "Custom e-commerce platform for selling refurbished laptops with an admin dashboard.",
    longDescription: "Specialized e-commerce for refurbished computers. Includes an interactive catalog with advanced filters, real-time stock management, and an order administration panel.",
    tech: ["Next.js", "PostgreSQL", "React", "Tailwind CSS", "Vercel"],
    liveUrl: "https://revolt-laptops.vercel.app/",
    repoUrl: "https://github.com/BastleyNait/REVOLT-LAP",
    featured: true,
    status: "Production",
    gradient: "from-purple-500/20 via-violet-600/20 to-slate-800/20",
    accentColor: "#a855f7",
    previewType: "iframe",
    previewFallbackImage: "./revolt.png"
  },
  {
    id: "boom-pos",
    title: "Boom POS & CRM",
    category: "E-Commerce & POS",
    description: "Complete Point of Sale (POS) and CRM system with high-quality UI/UX design.",
    longDescription: "Enterprise-grade solution for real-time business management. Integrates a reactive checkout interface, customer CRM module, centralized state with Zustand, and a high-speed backend built with Flask and PostgreSQL.",
    tech: ["Next.js", "Zustand", "Flask", "PostgreSQL", "API Routes"],
    liveUrl: "https://boom-pos.vercel.app/",
    repoUrl: "https://github.com/BastleyNait/BOOM-POS",
    featured: true,
    status: "Production",
    gradient: "from-amber-500/20 via-orange-600/20 to-rose-700/20",
    accentColor: "#f59e0b",
    previewType: "iframe",
    previewFallbackImage: "./boom-pos.png"
  },
  {
    id: "anemivision",
    title: "Anemivision (Edge AI Mobile)",
    category: "AI & Edge ML",
    description: "Native Android system for OFFLINE anemia detection using on-device Machine Learning.",
    longDescription: "Medical mobile application featuring offline artificial intelligence inference (Edge Computing). Computer vision processing optimized via TensorFlow Lite and PyTorch on native Android (Kotlin).",
    tech: ["TensorFlow Lite", "PyTorch", "Android", "Kotlin", "Computer Vision"],
    liveUrl: null,
    repoUrl: "https://github.com/BastleyNait/ANEMIVISION",
    featured: true,
    status: "Mobile Native / Edge AI",
    gradient: "from-emerald-500/20 via-cyan-600/20 to-blue-700/20",
    accentColor: "#10b981",
    previewType: "image",
    previewFallbackImage: "./anemivision.png"
  }
];

export const techStackData = [
  {
    category: "Languages",
    icon: "Code2",
    items: [
      { name: "JavaScript", level: "Advanced", logo: "https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" },
      { name: "TypeScript", level: "Advanced", logo: "https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" },
      { name: "Python", level: "Advanced", logo: "https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" },
      { name: "Kotlin", level: "Intermediate/Advanced", logo: "https://img.shields.io/badge/Kotlin-7F52FF?style=for-the-badge&logo=kotlin&logoColor=white" },
      { name: "Java", level: "Intermediate", logo: "https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" }
    ]
  },
  {
    category: "Frontend",
    icon: "Layout",
    items: [
      { name: "React", level: "Advanced", logo: "https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" },
      { name: "Next.js", level: "Advanced", logo: "https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" },
      { name: "Zustand", level: "Advanced", logo: "https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white" },
      { name: "Tailwind CSS", level: "Advanced", logo: "https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" },
      { name: "Bootstrap", level: "Intermediate", logo: "https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" }
    ]
  },
  {
    category: "Backend",
    icon: "Server",
    items: [
      { name: "FastAPI", level: "Advanced", logo: "https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" },
      { name: "Node.js", level: "Advanced", logo: "https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" },
      { name: "Django", level: "Intermediate", logo: "https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white" },
      { name: "Flask", level: "Intermediate", logo: "https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" }
    ]
  },
  {
    category: "Mobile",
    icon: "Smartphone",
    items: [
      { name: "React Native", level: "Advanced", logo: "https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" },
      { name: "Native Android", level: "Intermediate/Advanced", logo: "https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white" },
      { name: "Kotlin Mobile", level: "Intermediate", logo: "https://img.shields.io/badge/Kotlin-7F52FF?style=for-the-badge&logo=kotlin&logoColor=white" }
    ]
  },
  {
    category: "Cloud & DevOps",
    icon: "Cloud",
    items: [
      { name: "Docker", level: "Intermediate/Advanced", logo: "https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" },
      { name: "Google Cloud", level: "Intermediate", logo: "https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white" },
      { name: "AWS", level: "Intermediate", logo: "https://img.shields.io/badge/AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" },
      { name: "Vercel Deployment", level: "Advanced", logo: "https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" }
    ]
  },
  {
    category: "Databases & APIs",
    icon: "Database",
    items: [
      { name: "PostgreSQL", level: "Advanced", logo: "https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" },
      { name: "Vector DB", level: "Intermediate", logo: "https://img.shields.io/badge/Vector_DB-0A7E8C?style=for-the-badge&logo=chromadb&logoColor=white" },
      { name: "MongoDB", level: "Intermediate", logo: "https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" },
      { name: "Redis", level: "Intermediate", logo: "https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" },
      { name: "REST API & GraphQL", level: "Advanced", logo: "https://img.shields.io/badge/REST_API-005571?style=for-the-badge&logo=fastapi&logoColor=white" }
    ]
  },
  {
    category: "AI / ML & Data",
    icon: "Brain",
    items: [
      { name: "TensorFlow Lite", level: "Intermediate", logo: "https://img.shields.io/badge/TensorFlow_Lite-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" },
      { name: "PyTorch", level: "Intermediate", logo: "https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white" },
      { name: "Ollama / Local LLMs", level: "Intermediate", logo: "https://img.shields.io/badge/Ollama-000000?style=for-the-badge&logo=ollama&logoColor=white" },
      { name: "Pandas & NumPy", level: "Intermediate", logo: "https://img.shields.io/badge/Pandas-150458?style=for-the-badge&logo=pandas&logoColor=white" }
    ]
  }
];

export const engineeringPrinciples = [
  {
    title: "Software Architecture & Design",
    icon: "Building2",
    description: "Design patterns, distributed systems, microservices, and scalable code with clean architecture (Clean Architecture / Hexagonal).",
    tag: "Architecture"
  },
  {
    title: "Requirements Engineering & Management",
    icon: "ClipboardCheck",
    description: "Rigorous software project management, requirements gathering, and structured iterative deliveries.",
    tag: "Project Mgmt"
  },
  {
    title: "Security & Networking",
    icon: "ShieldCheck",
    description: "Computer networking fundamentals, secure development (OWASP Top 10), and information systems auditing.",
    tag: "Security"
  },
  {
    title: "Software Testing & Quality",
    icon: "TestTube2",
    description: "Unit, integration, and end-to-end (E2E) testing, maintaining high quality standards and code coverage.",
    tag: "Testing"
  },
  {
    title: "Agile Methodologies",
    icon: "Kanban",
    description: "Experience in iterative frameworks like Scrum and Kanban for continuous delivery and efficient teamwork.",
    tag: "Agile"
  },
  {
    title: "Cloud Deployment & DevOps",
    icon: "CloudCognitive",
    description: "Docker containers, CI/CD pipelines, server configuration, and infrastructure on Vercel, AWS, and Google Cloud.",
    tag: "Cloud"
  }
];