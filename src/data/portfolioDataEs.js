export const personalData = {
  name: "Sebastian Arley Chirinos Negrón",
  shortName: "Sebastian Chirinos",
  username: "BastleyNait",
  title: "Systems Engineer Developer | React & FastAPI | Node JS & Django | AI/ML & Cloud Enthusiast",
  degree: "Ingeniero de Sistemas",
  status: "Último Ciclo - Universidad Nacional de San Agustín de Arequipa (UNSA)",
  location: "Arequipa, Perú 🇵🇪",
  email: "schirinosne@gmail.com",
  linkedin: "https://www.linkedin.com/in/sebastian-chirinos-negron/",
  whatsapp: "https://wa.me/51987545926", // Reemplaza con tu número de WhatsApp
  github: "https://github.com/BastleyNait",
  portfolioUrl: "https://github.com/BastleyNait",
  bio: "Systems Engineer / Software Engineer apasionado por la ingeniería de software moderna, la arquitectura de microservicios y la inteligencia artificial en el borde (Edge AI). Cuento con 5+ proyectos desplegados a producción en Vercel y Google Cloud. Graduando de Ingeniería de Sistemas de la UNSA con sólidos fundamentos en seguridad, networking, software testing y metodologías ágiles.",
  stats: [
    { label: "Proyectos en Producción", value: "4+", icon: "Rocket" },
    { label: "Frontend", value: "React / Next.js / Vue.js", icon: "Layers" },
    { label: "Backend", value: "Node.js / Django / FastAPI", icon: "Server" },
    { label: "Enfoque Móvil", value: "React Native & Kotlin", icon: "Smartphone" },
  ],
  typingLines: [
    "Systems Engineer Developer | React + FastAPI",
    "Cloud & Machine Learning Enthusiast",
    "4+ Proyectos Desplegados a Producción",
    "Ingeniero de Sistemas UNSA (Último Ciclo)",
    "Abierto a nuevas oportunidades laborales 🚀"
  ]
};

export const projectsData = [
  {
    id: "lo-exacto",
    title: "Lo Exacto",
    category: "Full stack Web & Landing",
    description: "Plataforma web de producción y landing corporativo para gestión y presencia digital.",
    longDescription: "Plataforma web optimizada para producción con arquitectura Next.js y persistencia en PostgreSQL. Diseñada para alto rendimiento, SEO superior y navegación ultra fluida.",
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
    description: "Plataforma web corporativa en producción con catálogo interactivo y panel de administración.",
    longDescription: "Sistema web integral que incluye catálogo dinámico de servicios, panel de control administrativo y backend robusto en PostgreSQL con soporte para gestión de inventarios y servicios.",
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
    description: "Plataforma de comercio electrónico propia para venta de laptops reacondicionadas con panel admin.",
    longDescription: "E-commerce especializado en computadoras reacondicionadas. Incluye catálogo interactivo con filtros avanzados, gestión de stock en tiempo real y panel de administración de pedidos.",
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
    description: "Sistema completo de Punto de Venta (POS) y CRM con diseño UI/UX de alta calidad.",
    longDescription: "Solución de nivel empresarial para gestión comercial en tiempo real. Integra interfaz reactiva para caja, módulo de CRM de clientes, estado centralizado con Zustand y backend de alta velocidad con Flask y PostgreSQL.",
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
    description: "Sistema nativo Android para detección de anemia OFFLINE mediante Machine Learning en el dispositivo.",
    longDescription: "Aplicación móvil médica con inferencia de inteligencia artificial sin conexión a internet (Edge Computing). Procesamiento de visión por computadora optimizado mediante TensorFlow Lite y PyTorch sobre Android nativo (Kotlin).",
    tech: ["TensorFlow Lite", "PyTorch", "Android", "Kotlin", "Computer Vision"],
    liveUrl: null, // Próximamente
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
    category: "Lenguajes",
    icon: "Code2",
    items: [
      { name: "JavaScript", level: "Avanzado", logo: "https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" },
      { name: "TypeScript", level: "Avanzado", logo: "https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" },
      { name: "Python", level: "Avanzado", logo: "https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" },
      { name: "Kotlin", level: "Intermedio/Avanzado", logo: "https://img.shields.io/badge/Kotlin-7F52FF?style=for-the-badge&logo=kotlin&logoColor=white" },
      { name: "Java", level: "Intermedio", logo: "https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" }
    ]
  },
  {
    category: "Frontend",
    icon: "Layout",
    items: [
      { name: "React", level: "Avanzado", logo: "https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" },
      { name: "Next.js", level: "Avanzado", logo: "https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" },
      { name: "Zustand", level: "Avanzado", logo: "https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white" },
      { name: "Tailwind CSS", level: "Avanzado", logo: "https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" },
      { name: "Bootstrap", level: "Intermedio", logo: "https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" }
    ]
  },
  {
    category: "Backend",
    icon: "Server",
    items: [
      { name: "FastAPI", level: "Avanzado", logo: "https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" },
      { name: "Node.js", level: "Avanzado", logo: "https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" },
      { name: "Django", level: "Intermedio", logo: "https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white" },
      { name: "Flask", level: "Intermedio", logo: "https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" }
    ]
  },
  {
    category: "Mobile",
    icon: "Smartphone",
    items: [
      { name: "React Native", level: "Avanzado", logo: "https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" },
      { name: "Android Nativo", level: "Intermedio/Avanzado", logo: "https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white" },
      { name: "Kotlin Mobile", level: "Intermedio", logo: "https://img.shields.io/badge/Kotlin-7F52FF?style=for-the-badge&logo=kotlin&logoColor=white" }
    ]
  },
  {
    category: "Cloud & DevOps",
    icon: "Cloud",
    items: [
      { name: "Docker", level: "Intermedio/Avanzado", logo: "https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" },
      { name: "Google Cloud", level: "Intermedio", logo: "https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white" },
      { name: "AWS", level: "Intermedio", logo: "https://img.shields.io/badge/AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" },
      { name: "Vercel Deployment", level: "Avanzado", logo: "https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" }
    ]
  },
  {
    category: "Bases de Datos & APIs",
    icon: "Database",
    items: [
      { name: "PostgreSQL", level: "Avanzado", logo: "https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" },
      { name: "Vector DB", level: "Intermedio", logo: "https://img.shields.io/badge/Vector_DB-0A7E8C?style=for-the-badge&logo=chromadb&logoColor=white" },
      { name: "MongoDB", level: "Intermedio", logo: "https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" },
      { name: "Redis", level: "Intermedio", logo: "https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" },
      { name: "REST API & GraphQL", level: "Avanzado", logo: "https://img.shields.io/badge/REST_API-005571?style=for-the-badge&logo=fastapi&logoColor=white" }
    ]
  },
  {
    category: "AI / ML & Data",
    icon: "Brain",
    items: [
      { name: "TensorFlow Lite", level: "Intermedio", logo: "https://img.shields.io/badge/TensorFlow_Lite-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" },
      { name: "PyTorch", level: "Intermedio", logo: "https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white" },
      { name: "Ollama / LLMs Local", level: "Intermedio", logo: "https://img.shields.io/badge/Ollama-000000?style=for-the-badge&logo=ollama&logoColor=white" },
      { name: "Pandas & NumPy", level: "Intermedio", logo: "https://img.shields.io/badge/Pandas-150458?style=for-the-badge&logo=pandas&logoColor=white" }
    ]
  }
];

export const engineeringPrinciples = [
  {
    title: "Arquitectura de Software y Diseño",
    icon: "Building2",
    description: "Patrones de diseño, sistemas distribuidos, microservicios y código escalable con arquitectura limpia (Clean Architecture / Hexagonal).",
    tag: "Arquitectura"
  },
  {
    title: "Ingeniería de Requerimientos y Gestión",
    icon: "ClipboardCheck",
    description: "Gestión rigurosa de proyectos de software, levantamiento de requerimientos y entregas estructuradas iterativas.",
    tag: "Project Mgmt"
  },
  {
    title: "Seguridad y Redes",
    icon: "ShieldCheck",
    description: "Fundamentos de redes de computadoras, desarrollo seguro (OWASP Top 10) y auditoría de sistemas de información.",
    tag: "Security"
  },
  {
    title: "Testing y Calidad de Software",
    icon: "TestTube2",
    description: "Pruebas unitarias, de integración y end-to-end (E2E), manteniendo altos estándares de calidad y cobertura de código.",
    tag: "Testing"
  },
  {
    title: "Metodologías Ágiles",
    icon: "Kanban",
    description: "Experiencia en marcos de trabajo iterativos como Scrum y Kanban para entregas continuas y trabajo en equipo eficiente.",
    tag: "Agile"
  },
  {
    title: "Cloud Deployment & DevOps",
    icon: "CloudCognitive",
    description: "Contenedores Docker, canalizaciones CI/CD, configuración de servidores e infraestructura en Vercel, AWS y Google Cloud.",
    tag: "Cloud"
  }
];
