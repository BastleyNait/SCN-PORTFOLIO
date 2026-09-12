export const personalData = {
  name: "Sebastian Arley Chirinos Negrón",
  shortName: "Sebastian Chirinos",
  username: "BastleyNait",
  title: "Ingeniero Full-Stack · Arquitecto de Software · Entrega asistida por IA",
  role: "Ingeniero Full-Stack y Arquitecto de Software",
  headline: "Orquesto la IA. La arquitectura es mía.",
  location: "Arequipa, Perú 🇵🇪",
  email: "schirinosne@gmail.com",
  linkedin: "https://www.linkedin.com/in/sebastian-chirinos-negron/",
  whatsapp: "https://wa.me/51987545926",
  github: "https://github.com/BastleyNait",
  portfolioUrl: "https://sebastian-cn-portfolio.vercel.app",
  bio: "Escribir código dejó de ser lo difícil. Decidir qué construir, dónde vive el estado, qué corre en el dispositivo y qué rechazar antes de que se integre: ese es el trabajo. Dirijo agentes de IA con un proceso donde la especificación va primero, y respondo personalmente por cada decisión de arquitectura detrás de cinco sistemas en producción entre web, punto de venta, Android nativo y machine learning offline.",
  shortBio: "Diseño el sistema, dirijo a los agentes y defiendo cada línea que sale a producción.",
  stats: [
    { label: "Sistemas en producción", value: "5", icon: "Rocket" },
    { label: "Decisiones documentadas", value: "6", icon: "ScrollText" },
    { label: "Dominios entregados", value: "4", icon: "Boxes" },
    { label: "Lenguajes en producción", value: "5", icon: "Braces" }
  ],
  typingLines: [
    "Orquesto la IA. La arquitectura es mía.",
    "Primero la spec, después los agentes, siempre la revisión.",
    "5 sistemas en producción — del diseño al deploy.",
    "Edge AI que funciona con la red apagada.",
    "Disponible para roles Full-Stack e Ingeniería de Software 🚀"
  ]
};

/* ------------------------------------------------------------------ *
 * Cómo se hace realmente el trabajo: el ciclo de orquestación.
 * Cada fase declara quién la posee — esa división es justamente el punto.
 * ------------------------------------------------------------------ */
export const orchestrationData = {
  thesis: "Hoy todos tienen el mismo generador de código. Las diferencias que sobreviven al contacto con producción son las que un modelo no puede tomar por ti: qué construir, cómo acotarlo y qué rechazar.",
  loop: [
    {
      step: "01",
      phase: "Encuadrar",
      owner: "human",
      title: "Restricciones antes que código",
      description: "Escribo la especificación primero: quién lo usa, carga esperada, presupuesto, techo de latencia y cómo se le permite fallar. Ningún agente arranca hasta que los criterios de aceptación no dejen nada a interpretación.",
      artifacts: ["Especificación", "Criterios de aceptación", "No-objetivos"]
    },
    {
      step: "02",
      phase: "Decidir",
      owner: "human",
      title: "La decisión que un modelo no puede tomar por mí",
      description: "Modelo de datos, fronteras entre servicios, síncrono o asíncrono, dónde vive el estado, qué corre en el dispositivo. Cada elección queda escrita junto al trade-off que acepté.",
      artifacts: ["Registro de decisión", "Modelo de datos", "Fronteras"]
    },
    {
      step: "03",
      phase: "Orquestar",
      owner: "shared",
      title: "Tareas acotadas, interfaces congeladas",
      description: "Cada agente recibe una sola tarea acotada contra una interfaz que yo ya fijé. Diffs pequeños, contratos explícitos y ningún agente autorizado a cruzar más de una capa.",
      artifacts: ["Tareas acotadas", "Contratos tipados", "Diffs pequeños"]
    },
    {
      step: "04",
      phase: "Rechazar",
      owner: "human",
      title: "No sale nada que no pueda defender",
      description: "Leo cada línea antes de integrarla. El código que se ve seguro pero esconde un N+1, una condición de carrera o una clave dentro del bundle se descarta, no se parcha.",
      artifacts: ["Revisión línea por línea", "Pase de seguridad", "Presupuesto de performance"]
    },
    {
      step: "05",
      phase: "Comprobar",
      owner: "human",
      title: "Medido, nunca supuesto",
      description: "Despliego detrás de verificaciones, observo tráfico real y devuelvo lo que enseña producción al siguiente registro de decisión, para que el mismo error no se pueda repetir.",
      artifacts: ["CI/CD", "Monitoreo", "Notas post-deploy"]
    }
  ],
  split: {
    delegatedTitle: "Delegado a los agentes",
    delegatedTag: "APALANCAMIENTO",
    delegated: [
      "Scaffolding, capas CRUD y migraciones",
      "Casos de prueba derivados de una spec que ya escribí",
      "Refactors mecánicos detrás de una interfaz fija",
      "Primeros borradores de tipos, documentación y fixtures"
    ],
    ownedTitle: "Nunca delegado",
    ownedTag: "CRITERIO",
    owned: [
      "Modelo de datos y fronteras entre servicios",
      "Trade-offs entre costo, latencia y complejidad",
      "Autenticación, secretos y todo lo que toque dinero o datos de salud",
      "Si la funcionalidad merece existir siquiera"
    ]
  }
};

/* ------------------------------------------------------------------ *
 * Registros de decisión de arquitectura.
 * Contexto → opciones → decisión → trade-off.
 * ------------------------------------------------------------------ */
export const decisionLog = [
  {
    id: "adr-001",
    project: "Boom POS & CRM",
    tag: "Estado y fiabilidad",
    title: "El carrito vive en el cliente, el libro contable en el servidor",
    context: "Una venta no puede quedarse trabada porque el local perdió conexión a mitad del cobro.",
    options: ["Carrito autoritativo en el servidor en cada pulsación", "Carrito local con el servidor como libro contable"],
    decision: "Zustand mantiene el carrito de trabajo en el navegador. Flask y PostgreSQL son dueños del libro contable, y cada venta cerrada se registra como una única transacción idempotente.",
    tradeoff: "Asumí lógica de reconciliación a cambio de un cobro que nunca se bloquea esperando a la red."
  },
  {
    id: "adr-002",
    project: "Anemivision",
    tag: "Edge AI y privacidad",
    title: "Inferencia en el dispositivo, nunca en la nube",
    context: "El tamizaje de anemia ocurre en clínicas con conectividad poco fiable, usando imágenes de un paciente.",
    options: ["API de inferencia alojada", "Modelo cuantizado embebido en la app Android"],
    decision: "El modelo de PyTorch se cuantiza a TensorFlow Lite y corre dentro de la app. Ninguna imagen del paciente sale del teléfono.",
    tradeoff: "Cedí tamaño de modelo y reentrenamiento cómodo a cambio de cero dependencia de red y ningún dato de salud en tránsito."
  },
  {
    id: "adr-003",
    project: "Lo Exacto y Calitop",
    tag: "Estrategia de render",
    title: "El render se elige por ruta, no por proyecto",
    context: "Las páginas públicas las juzgan los rastreadores y el primer pintado. El área administrativa se juzga por qué tan fresco está el dato.",
    options: ["Renderizar todo en servidor", "Generar todo estático", "Dividir la decisión por ruta"],
    decision: "Las rutas públicas se generan estáticas y se revalidan. El panel renderiza en servidor. Una sola instancia de PostgreSQL sostiene a ambos.",
    tradeoff: "Conviven dos modelos mentales en un mismo repositorio, y eso compra páginas rastreables y un panel que nunca está desactualizado."
  },
  {
    id: "adr-004",
    project: "Revolt Laptop",
    tag: "Integridad de datos",
    title: "Quien decide si hay stock es la base de datos, no la caché",
    context: "Las unidades reacondicionadas son piezas únicas, así que vender dos veces la misma laptop es una falla real, no un redondeo.",
    options: ["Confiar en el conteo cacheado del catálogo", "Forzar el descuento dentro de la transacción del pedido"],
    decision: "El stock se descuenta dentro de la transacción del pedido y queda protegido por una restricción de base de datos. A la caché del catálogo se le permite explícitamente ir atrasada.",
    tradeoff: "Un catálogo con unos segundos de retraso es aceptable. Una máquina vendida dos veces no lo es."
  },
  {
    id: "adr-005",
    project: "En todos los sistemas",
    tag: "Superficie operativa",
    title: "PostgreSQL hasta que una medición obligue a otra cosa",
    context: "Cada proyecto llega con la sugerencia de sumar una cola, una caché y un almacén documental desde el primer día.",
    options: ["Adoptar los almacenes especializados de entrada", "Postergar hasta que un benchmark los exija"],
    decision: "Una sola instancia de PostgreSQL sostiene el sistema. Redis y la búsqueda vectorial entraron solo donde una medición justificó la pieza extra.",
    tradeoff: "Cambio margen teórico de escalado por una superficie operativa que un solo ingeniero puede operar y razonar de verdad."
  },
  {
    id: "adr-006",
    project: "Entrega asistida por IA",
    tag: "Orquestación",
    title: "Las interfaces se escriben a mano antes de generar nada",
    context: "Los agentes producen su trabajo más útil cuando el contrato que están completando ya está congelado.",
    options: ["Dejar que el agente diseñe la API mientras implementa", "Fijar tipos, endpoints y formas de error primero"],
    decision: "Escribo yo los tipos, los endpoints y las formas de error. Los agentes implementan contra un contrato que no tienen permitido cambiar.",
    tradeoff: "Un arranque más lento, a cambio de revisiones acotadas y fallas de integración que dejan de ser una categoría de bug."
  }
];

export const projectsData = [
  {
    id: "lo-exacto",
    title: "Lo Exacto",
    category: "Plataformas Web",
    role: "Arquitectura · Implementación · Despliegue",
    description: "Plataforma web en producción y sitio corporativo construidos para visibilidad en buscadores y carga instantánea.",
    longDescription: "Plataforma en producción sobre Next.js con persistencia en PostgreSQL, afinada para rastreabilidad, primer pintado y navegación sin saltos.",
    keyDecision: "Generación estática en rutas públicas, render en servidor para el panel, una sola base de datos detrás de ambos.",
    tech: ["Next.js", "React", "PostgreSQL", "Tailwind CSS", "Vercel"],
    liveUrl: "https://www.lo-exacto.com/",
    repoUrl: "https://github.com/BastleyNait/LO-EXACTO.git",
    featured: true,
    status: "Producción",
    accentColor: "#38bdf8",
    previewImage: "lo-exacto"
  },
  {
    id: "calitop-services",
    title: "Calitop Services",
    category: "Plataformas Web",
    role: "Arquitectura · Implementación · Despliegue",
    description: "Plataforma corporativa en producción con catálogo interactivo y panel administrativo.",
    longDescription: "Sistema web que combina un catálogo dinámico de servicios, un panel de control administrativo y un backend PostgreSQL que cubre inventario y registro de servicios.",
    keyDecision: "Las lecturas del catálogo se cachean y pueden ir atrasadas; toda escritura pasa por el camino transaccional.",
    tech: ["Next.js", "PostgreSQL", "React", "Tailwind CSS", "Vercel"],
    liveUrl: "https://www.calitop-services.com/",
    repoUrl: "https://github.com/BastleyNait/CALITOP-WEB",
    featured: true,
    status: "Producción",
    accentColor: "#2dd4bf",
    previewImage: "calitop-services"
  },
  {
    id: "revolt-laptop",
    title: "Revolt Laptop",
    category: "Comercio y POS",
    role: "Arquitectura · Modelo de datos · Despliegue",
    description: "Plataforma de comercio para laptops reacondicionadas donde cada unidad en stock es única.",
    longDescription: "Tienda y panel administrativo para máquinas reacondicionadas irrepetibles: catálogo filtrable, control transaccional de stock y administración de pedidos.",
    keyDecision: "El stock se descuenta dentro de la transacción del pedido bajo una restricción de base de datos, así una unidad no se puede vender dos veces.",
    tech: ["Next.js", "PostgreSQL", "React", "Tailwind CSS", "Vercel"],
    liveUrl: "https://revolt-laptops.vercel.app/",
    repoUrl: "https://github.com/BastleyNait/REVOLT-LAP",
    featured: true,
    status: "Producción",
    accentColor: "#a855f7",
    previewImage: "revolt-laptop"
  },
  {
    id: "boom-pos",
    title: "Boom POS & CRM",
    category: "Comercio y POS",
    role: "Arquitectura · Diseño de estado · Backend",
    description: "Punto de venta y CRM construidos para seguir vendiendo cuando la conexión no coopera.",
    longDescription: "Sistema de gestión que combina un cobro reactivo con un módulo CRM de clientes, estado de cliente centralizado en Zustand y un backend Flask con PostgreSQL dueño del libro contable.",
    keyDecision: "El carrito pertenece al cliente; el servidor registra cada venta cerrada como una transacción idempotente.",
    tech: ["Next.js", "Zustand", "Flask", "PostgreSQL", "API Routes"],
    liveUrl: "https://boom-pos.vercel.app/",
    repoUrl: "https://github.com/BastleyNait/BOOM-POS",
    featured: true,
    status: "Producción",
    accentColor: "#f59e0b",
    previewImage: "boom-pos"
  },
  {
    id: "anemivision",
    title: "Anemivision",
    category: "Edge AI y Móvil",
    role: "Arquitectura · Pipeline del modelo · Android",
    description: "App Android nativa que detecta anemia totalmente offline, con la inferencia dentro del dispositivo.",
    longDescription: "Aplicación de tamizaje médico que ejecuta inferencia de visión por computadora cuantizada en el propio dispositivo mediante TensorFlow Lite, construida nativamente para Android en Kotlin.",
    keyDecision: "El modelo viaja dentro de la app, así ninguna imagen del paciente se transmite a ningún lado.",
    tech: ["TensorFlow Lite", "PyTorch", "Android", "Kotlin", "Computer Vision"],
    liveUrl: null,
    repoUrl: "https://github.com/BastleyNait/ANEMIVISION",
    featured: true,
    status: "Edge AI",
    accentColor: "#10b981",
    previewImage: "anemivision"
  }
];

export const techStackData = [
  {
    category: "Lenguajes",
    icon: "Code2",
    items: [
      { name: "JavaScript", level: "Avanzado" },
      { name: "TypeScript", level: "Avanzado" },
      { name: "Python", level: "Avanzado" },
      { name: "Kotlin", level: "Intermedio/Avanzado" },
      { name: "Java", level: "Intermedio" }
    ]
  },
  {
    category: "Frontend",
    icon: "Layout",
    items: [
      { name: "React", level: "Avanzado" },
      { name: "Next.js", level: "Avanzado" },
      { name: "Zustand", level: "Avanzado" },
      { name: "Tailwind CSS", level: "Avanzado" },
      { name: "Bootstrap", level: "Intermedio" }
    ]
  },
  {
    category: "Backend",
    icon: "Server",
    items: [
      { name: "FastAPI", level: "Avanzado" },
      { name: "Node.js", level: "Avanzado" },
      { name: "Django", level: "Intermedio" },
      { name: "Flask", level: "Intermedio" }
    ]
  },
  {
    category: "Móvil",
    icon: "Smartphone",
    items: [
      { name: "React Native", level: "Avanzado" },
      { name: "Android Nativo", level: "Intermedio/Avanzado" },
      { name: "Kotlin Mobile", level: "Intermedio" }
    ]
  },
  {
    category: "Cloud y DevOps",
    icon: "Cloud",
    items: [
      { name: "Docker", level: "Intermedio/Avanzado" },
      { name: "Google Cloud", level: "Intermedio" },
      { name: "AWS", level: "Intermedio" },
      { name: "Vercel", level: "Avanzado" }
    ]
  },
  {
    category: "Datos y APIs",
    icon: "Database",
    items: [
      { name: "PostgreSQL", level: "Avanzado" },
      { name: "Vector DB", level: "Intermedio" },
      { name: "MongoDB", level: "Intermedio" },
      { name: "Redis", level: "Intermedio" },
      { name: "REST y GraphQL", level: "Avanzado" }
    ]
  },
  {
    category: "IA / ML",
    icon: "Brain",
    items: [
      { name: "TensorFlow Lite", level: "Intermedio" },
      { name: "PyTorch", level: "Intermedio" },
      { name: "Ollama / LLMs locales", level: "Intermedio" },
      { name: "Pandas y NumPy", level: "Intermedio" }
    ]
  }
];

export const engineeringPrinciples = [
  {
    title: "Arquitectura y diseño de sistemas",
    icon: "Building2",
    description: "Fronteras trazadas antes de que exista el código: capas limpias y hexagonales, servicios distribuidos y un modelo de datos que sobrevive al segundo requerimiento.",
    tag: "Arquitectura"
  },
  {
    title: "Requisitos y control de alcance",
    icon: "ClipboardCheck",
    description: "Convertir un pedido difuso en criterios de aceptación, y después defender los no-objetivos que evitan que una entrega duplique su tamaño en silencio.",
    tag: "Alcance"
  },
  {
    title: "Seguridad y redes",
    icon: "ShieldCheck",
    description: "Fundamentos de redes, OWASP Top 10 aplicado en revisión, secretos fuera del bundle y auditoría sobre sistemas que manejan dinero o datos de salud.",
    tag: "Seguridad"
  },
  {
    title: "Pruebas y compuertas de revisión",
    icon: "TestTube2",
    description: "Cobertura unitaria, de integración y end-to-end usada como la compuerta que el código generado debe pasar antes de acercarse a un merge.",
    tag: "Calidad"
  },
  {
    title: "Entrega ágil",
    icon: "Kanban",
    description: "Scrum y Kanban ejecutados como incrementos pequeños y reversibles, para que una decisión equivocada cueste una iteración y no un release.",
    tag: "Entrega"
  },
  {
    title: "Cloud y DevOps",
    icon: "CloudCognitive",
    description: "Contenedores, pipelines de CI/CD e infraestructura en Vercel, AWS y Google Cloud, dimensionados a lo que un ingeniero puede operar de verdad.",
    tag: "Cloud"
  }
];
