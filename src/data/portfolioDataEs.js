export const personalData = {
  name: "Sebastian Arley Chirinos Negrón",
  shortName: "Sebastian Chirinos",
  username: "BastleyNait",
  title: "Ingeniero Full-Stack · Arquitecto de Software · React, Next.js y Python",
  role: "Ingeniero Full-Stack y Arquitecto de Software",
  headline: "Ingeniero full-stack. Seis sistemas en producción en cuatro dominios.",
  location: "Arequipa, Perú",
  email: "schirinosne@gmail.com",
  linkedin: "https://www.linkedin.com/in/sebastian-chirinos-negron/",
  whatsapp: "https://wa.me/51987545926",
  github: "https://github.com/BastleyNait",
  portfolioUrl: "https://sebastian-cn-portfolio.vercel.app",
  bio: "Los cuatro dominios son web, punto de venta, entrega de documentos en la nube y machine learning en el dispositivo. En cada sistema tracé las fronteras de servicio, diseñé el modelo de datos y elegí qué rechazar. Cada decisión de abajo está escrita con el concepto que la sostiene, el trade-off que acepté y dónde se rompe a diez veces el tamaño.",
  shortBio: "Ingeniero full-stack. Seis sistemas en producción en cuatro dominios.",
  stats: [
    { label: "Sistemas en producción", value: "6", icon: "Rocket" },
    { label: "Decisiones documentadas", value: "7", icon: "ScrollText" },
    { label: "Dominios entregados", value: "4", icon: "Boxes" },
    { label: "Lenguajes en producción", value: "5", icon: "Braces" }
  ],
  typingLines: [
    "Un QR en el instrumento que resuelve a su certificado.",
    "Un cobro idempotente que sobrevive a una conexión caída.",
    "Invariantes en la base de datos, no en una función auxiliar.",
    "Edge AI que funciona con la red apagada.",
    "Disponible para roles Full-Stack e Ingeniería de Software"
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
    project: "GEOTOP Certificados",
    tag: "Camino de lectura",
    title: "El identificador vive en el instrumento, no en un catálogo",
    context: "Un técnico parado en campo con un instrumento en las manos necesita saber si su calibración sigue vigente, desde un teléfono y quizá sin buena señal.",
    options: ["Una app móvil con catálogo y login", "Una búsqueda web por número de serie", "Un QR impreso en el instrumento que resuelve al documento"],
    decision: "Un QR impreso en el equipo físico resuelve directo al certificado de ese instrumento en almacenamiento de objetos en la nube. Sin app que instalar, sin cuenta, sin número de serie que escribir.",
    tradeoff: "Cualquiera que tenga el instrumento en la mano puede leer su certificado. Para un documento cuyo propósito es mostrarse a quien lo pida, eso es la funcionalidad y no la filtración.",
    concept: "Diseño del camino de lectura y el costo de cada salto",
    theory: "Cada paso entre el escaneo y el PDF es un lugar donde la red puede fallar: un login es un viaje de ida y vuelta, una búsqueda en catálogo es una consulta, instalar una app es una descarga sobre una conexión que ya es débil. El camino de lectura más barato es el que tiene menos saltos que puedan fallar por separado, así que el identificador se movió al objeto mismo y lo único que queda por entregar es un archivo.",
    atScale: "Público por URL deja de ser aceptable en cuanto un certificado contenga algo que un competidor no debería ver. El diseño asume que el documento está hecho para mostrarse; uno privado necesitaría un enlace firmado con expiración, lo que devuelve un salto y obliga a pensar el desfase de reloj.",
    verified: "Escaneado desde el equipo con un teléfono, sobre una conexión limitada a propósito, sin nada instalado y sin cuenta.",
    caseStudy: "geotop-certificates"
  },
  {
    id: "adr-002",
    project: "Boom POS & CRM",
    tag: "Estado y fiabilidad",
    title: "El carrito vive en el cliente, el libro contable en el servidor",
    context: "Una venta no puede quedarse trabada porque el local perdió conexión a mitad del cobro.",
    options: ["Carrito autoritativo en el servidor en cada pulsación", "Carrito local con el servidor como libro contable"],
    decision: "Zustand mantiene el carrito de trabajo en el navegador. Flask y PostgreSQL son dueños del libro contable, y cada venta cerrada se registra como una única transacción idempotente.",
    tradeoff: "Asumí lógica de reconciliación a cambio de un cobro que nunca se bloquea esperando a la red.",
    concept: "Idempotencia",
    theory: "Una escritura idempotente se puede aplicar dos veces y deja el mismo estado que aplicarla una. Un checkout reintentado sobre una conexión que se cae no debe producir dos ventas, así que el cliente genera la clave y el servidor trata la repetición de esa clave como la misma transacción, no como una nueva.",
    atScale: "La reconciliación es el punto débil. Con muchas terminales vendiendo a la vez, un carrito que vive en el cliente necesita una regla explícita de conflicto para el mismo artículo, y hoy esa regla está en código de aplicación y no en el modelo de datos.",
    verified: "Envié la misma venta cerrada varias veces y tras desconexiones forzadas; el libro contable tiene que mostrar exactamente una.",
    caseStudy: "boom-pos"
  },
  {
    id: "adr-003",
    project: "Anemivision",
    tag: "Edge AI y privacidad",
    title: "Inferencia en el dispositivo, nunca en la nube",
    context: "El tamizaje de anemia ocurre en clínicas con conectividad poco fiable, usando imágenes de un paciente.",
    options: ["API de inferencia alojada", "Modelo cuantizado embebido en la app Android"],
    decision: "El modelo de PyTorch se cuantiza a TensorFlow Lite y corre dentro de la app. Ninguna imagen del paciente sale del teléfono.",
    tradeoff: "Cedí tamaño de modelo y reentrenamiento cómodo a cambio de cero dependencia de red y ningún dato de salud en tránsito.",
    concept: "Cuantización post-entrenamiento",
    theory: "Convertir pesos float32 a int8 reduce el modelo unas cuatro veces y lo hace correr en la CPU de un teléfono, a cambio de algo de precisión. La pregunta real nunca fue el tamaño: era si ese costo de precisión es menor que el costo de exigir red en una clínica que no siempre la tiene.",
    atScale: "Un modelo que viaja dentro del binario no se puede corregir sin publicar. Mejorarlo es una actualización de app y una revisión de tienda, no un deploy, así que el ciclo de reentrenamiento es más lento que con un modelo hospedado.",
    verified: "Comparé la precisión del modelo float contra el cuantizado antes de publicar, y corrí la inferencia en el dispositivo con la red apagada.",
    caseStudy: "anemivision"
  },
  {
    id: "adr-004",
    project: "Lo Exacto y Calitop",
    tag: "Estrategia de render",
    title: "El render se elige por ruta, no por proyecto",
    context: "Las páginas públicas las juzgan los rastreadores y el primer pintado. El área administrativa se juzga por qué tan fresco está el dato.",
    options: ["Renderizar todo en servidor", "Generar todo estático", "Dividir la decisión por ruta"],
    decision: "Las rutas públicas se generan estáticas y se revalidan. El panel renderiza en servidor. Una sola instancia de PostgreSQL sostiene a ambos.",
    tradeoff: "Conviven dos modelos mentales en un mismo repositorio, y eso compra páginas rastreables y un panel que nunca está desactualizado.",
    concept: "Presupuesto de desactualización",
    theory: "La generación estática compra primer pintado y rastreabilidad sirviendo algo que era cierto hace un momento. La pregunta útil no es qué modo de render es mejor, sino cuánto se le permite envejecer a cada ruta: el texto comercial tolera minutos, un panel de inventario no tolera nada.",
    atScale: "Dos modelos de render en un mismo código es un costo de comprensión que crece con el equipo. Con más gente editando hay que documentar la ventana de revalidación por ruta, o alguien va a asumir la equivocada y publicar un precio viejo.",
    verified: "Verifiqué rastreabilidad y primer pintado en las rutas públicas, y confirmé que las lecturas del panel llegan a la base y no a una página cacheada."
  },
  {
    id: "adr-005",
    project: "Revolt Laptop",
    tag: "Integridad de datos",
    title: "Quien decide si hay stock es la base de datos, no la caché",
    context: "Las unidades reacondicionadas son piezas únicas, así que vender dos veces la misma laptop es una falla real, no un redondeo.",
    options: ["Confiar en el conteo cacheado del catálogo", "Forzar el descuento dentro de la transacción del pedido"],
    decision: "El stock se descuenta dentro de la transacción del pedido y queda protegido por una restricción de base de datos. A la caché del catálogo se le permite explícitamente ir atrasada.",
    tradeoff: "Un catálogo con unos segundos de retraso es aceptable. Una máquina vendida dos veces no lo es.",
    concept: "Invariantes y niveles de aislamiento",
    theory: "\"El stock nunca baja de cero\" es un invariante, y un invariante que se hace cumplir en código de aplicación vale lo que valga el camino concurrente más débil. Bajo read-committed, dos pedidos pueden leer la misma fila de stock antes de que cualquiera escriba. La restricción dentro de la transacción es lo que hace fallar al segundo en vez de vender de más.",
    atScale: "Subir el nivel de aislamiento eliminaría la carrera en teoría y costaría throughput en la práctica. La restricción es la respuesta más barata acá porque el catálogo es chico; uno más grande exigiría medir la contención antes de elegir.",
    verified: "Lancé intentos de pedido concurrentes contra la misma unidad única; solo uno puede tener éxito."
  },
  {
    id: "adr-006",
    project: "En todos los sistemas",
    tag: "Superficie operativa",
    title: "PostgreSQL hasta que una medición obligue a otra cosa",
    context: "Cada proyecto llega con la sugerencia de sumar una cola, una caché y un almacén documental desde el primer día.",
    options: ["Adoptar los almacenes especializados de entrada", "Postergar hasta que un benchmark los exija"],
    decision: "Una sola instancia de PostgreSQL sostiene el sistema. Redis y la búsqueda vectorial entraron solo donde una medición justificó la pieza extra.",
    tradeoff: "Cambio margen teórico de escalado por una superficie operativa que un solo ingeniero puede operar y razonar de verdad.",
    concept: "Superficie operativa",
    theory: "El costo de un componente no es la tarde que toma agregarlo. Es la suma de sus modos de falla, sus backups, su monitoreo y sus actualizaciones, pagada a las tres de la mañana por quien esté de guardia. Cada almacén que se suma multiplica esa superficie antes de sumar capacidad.",
    atScale: "Una sola instancia es un punto único de falla, y ese es el límite honesto de esta decisión. Es aceptable mientras un ingeniero opere el sistema y es lo primero que cambia cuando deje de serlo.",
    verified: "Redis y la búsqueda vectorial entraron solo después de que una medición mostrara a PostgreSQL como cuello de botella en ese camino puntual, no porque la arquitectura se viera incompleta sin ellos."
  },
  {
    id: "adr-007",
    project: "Entrega asistida por IA",
    tag: "Orquestación",
    title: "Las interfaces se escriben a mano antes de generar nada",
    context: "Los agentes producen su trabajo más útil cuando el contrato que están completando ya está congelado.",
    options: ["Dejar que el agente diseñe la API mientras implementa", "Fijar tipos, endpoints y formas de error primero"],
    decision: "Escribo yo los tipos, los endpoints y las formas de error. Los agentes implementan contra un contrato que no tienen permitido cambiar.",
    tradeoff: "Un arranque más lento, a cambio de revisiones acotadas y fallas de integración que dejan de ser una categoría de bug.",
    concept: "Diseño por contrato primero",
    theory: "Fijar tipos, endpoints y formas de error antes de implementar convierte la integración de un problema de descubrimiento en uno de verificación. Es la misma razón por la que existen schema-first y OpenAPI-first: el contrato pasa a ser la unidad de revisión, así que un diff se juzga contra algo y no por su propio mérito.",
    atScale: "Un contrato congelado a veces es el contrato equivocado. El precio es disciplina de versionado, porque cambiar uno cuando ya hay consumidores es una migración con ventana de deprecación, no una edición.",
    verified: "Cada implementación se revisa contra el contrato que recibió, que es lo que hace que las fallas de integración dejen de ser una categoría de bug."
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
    previewImage: "boom-pos",
    caseStudy: "boom-pos"
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
    previewLabel: "anemivision.apk",
    status: "Edge AI",
    previewImage: "anemivision",
    caseStudy: "anemivision"
  },
  {
    id: "geotop-certificates",
    title: "GEOTOP Certificados",
    category: "Plataformas Web",
    role: "Arquitectura · Backend · Infraestructura",
    description: "Sistema de certificados en la nube para una empresa de equipos de topografía, verificable escaneando el propio instrumento.",
    longDescription: "Los certificados de calibración salieron del papel al almacenamiento de objetos en la nube, direccionables desde un QR impreso en el instrumento físico, detrás de un servicio Flask en Google Compute Engine.",
    keyDecision: "El QR resuelve directo al PDF, así que un técnico en campo no necesita app, ni login, ni número de serie.",
    tech: ["Flask", "Google Compute Engine", "Nginx", "Almacenamiento compatible con S3", "QR"],
    liveUrl: null,
    repoUrl: "https://github.com/BastleyNait/GEOTOP-PDF",
    featured: true,
    status: "Producción",
    previewLabel: "gestor de certificados",
    previewImage: "geotop-certificates",
    caseStudy: "geotop-certificates"
  }
];

export const techStackData = [
  {
    category: "Lenguajes",
    icon: "Code2",
    items: [
      { name: "JavaScript" },
      { name: "TypeScript" },
      { name: "Python" },
      { name: "Kotlin" },
      { name: "Java" }
    ]
  },
  {
    category: "Frontend",
    icon: "Layout",
    items: [
      { name: "React" },
      { name: "Next.js" },
      { name: "Zustand" },
      { name: "Tailwind CSS" },
      { name: "Bootstrap" }
    ]
  },
  {
    category: "Backend",
    icon: "Server",
    items: [
      { name: "FastAPI" },
      { name: "Node.js" },
      { name: "Django" },
      { name: "Flask" }
    ]
  },
  {
    category: "Móvil",
    icon: "Smartphone",
    items: [
      { name: "React Native" },
      { name: "Android Nativo" },
      { name: "Kotlin Mobile" }
    ]
  },
  {
    category: "Cloud y DevOps",
    icon: "Cloud",
    items: [
      { name: "Docker" },
      { name: "Google Cloud" },
      { name: "AWS" },
      { name: "Vercel" }
    ]
  },
  {
    category: "Datos y APIs",
    icon: "Database",
    items: [
      { name: "PostgreSQL" },
      { name: "Vector DB" },
      { name: "MongoDB" },
      { name: "Redis" },
      { name: "REST y GraphQL" }
    ]
  },
  {
    category: "IA / ML",
    icon: "Brain",
    items: [
      { name: "TensorFlow Lite" },
      { name: "PyTorch" },
      { name: "Ollama / LLMs locales" },
      { name: "Pandas y NumPy" }
    ]
  }
];

export const engineeringPrinciples = [
  {
    title: "Arquitectura y diseño de sistemas",
    icon: "Building2",
    description: "Dónde trazar una frontera es la decisión que todo lo demás hereda. Capas, bordes de servicio y un modelo de datos que sobrevive al segundo pedido de funcionalidad.",
    concepts: ["Acoplamiento y cohesión", "Contextos acotados", "Arquitectura hexagonal", "Trade-offs de CAP"],
    evidence: "El render se dividió por ruta y no por proyecto, con una sola instancia de PostgreSQL detrás de las páginas públicas y del panel.",
    adr: "adr-004",
    tag: "Arquitectura"
  },
  {
    title: "Requisitos e invariantes",
    icon: "ClipboardCheck",
    description: "Convertir un pedido vago en criterios de aceptación, nombrar las reglas que nunca pueden romperse, y defender los no-objetivos que evitan que una entrega se duplique.",
    concepts: ["Invariantes", "Criterios de aceptación", "No-objetivos", "Modos de falla"],
    evidence: "\"El stock nunca baja de cero\" se escribió como invariante antes de que existiera el flujo de pedido, y por eso terminó en una restricción y no en una función auxiliar.",
    adr: "adr-005",
    tag: "Alcance"
  },
  {
    title: "Seguridad y redes",
    icon: "ShieldCheck",
    description: "Modelado de amenazas antes que funcionalidad, el OWASP Top 10 aplicado en revisión y no citado, y secretos que nunca llegan al bundle.",
    concepts: ["Modelado de amenazas", "OWASP Top 10", "Datos en tránsito y en reposo", "Terminación TLS", "RBAC"],
    evidence: "Ninguna imagen de paciente sale del dispositivo en Anemivision, porque la forma más barata de proteger datos en tránsito es no tenerlos. El servicio de certificados termina el tráfico público en Nginx.",
    adr: "adr-003",
    tag: "Seguridad"
  },
  {
    title: "Concurrencia y correctitud",
    icon: "TestTube2",
    description: "Los bugs que sobreviven a una revisión de código son los que necesitan que dos cosas pasen a la vez. Las pruebas existen para volverlos reproducibles.",
    concepts: ["Condiciones de carrera", "Idempotencia", "Aislamiento transaccional", "Pirámide de pruebas"],
    evidence: "Dos casos que cada release tiene que sobrevivir: el mismo cobro enviado dos veces sobre una conexión que se cae, y dos pedidos compitiendo por una única unidad de stock.",
    adr: "adr-002",
    tag: "Correctitud"
  },
  {
    title: "Entrega y radio de impacto",
    icon: "Kanban",
    description: "Incrementos chicos y reversibles, para que una decisión equivocada cueste una iteración y no un release, y para que lo que se rompió sea lo que acaba de cambiar.",
    concepts: ["Radio de impacto", "Reversibilidad", "Presupuestos de desactualización", "Revisión post-deploy"],
    evidence: "A las rutas públicas se les permite estar segundos desactualizadas y al panel no, que es un presupuesto deliberado y no un efecto secundario de la caché.",
    adr: "adr-004",
    tag: "Entrega"
  },
  {
    title: "Cloud y operación",
    icon: "CloudCognitive",
    description: "Infraestructura del tamaño que un ingeniero puede operar de verdad a las tres de la mañana, no del tamaño que se ve completo en un diagrama.",
    concepts: ["Proxy inverso", "Almacenamiento de objetos frente a base de datos", "Superficie operativa", "CI/CD"],
    evidence: "Los certificados viven en almacenamiento de objetos y no en la base de datos, así que servir un documento nunca pasa por lógica de aplicación ni compite con una escritura.",
    adr: "adr-001",
    tag: "Operación"
  }
];
