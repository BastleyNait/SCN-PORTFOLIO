export { caseStudies } from './caseStudies';

export const personalData = {
  name: "Sebastian Arley Chirinos Negrón",
  shortName: "Sebastian Chirinos",
  username: "BastleyNait",
  title: "Full-Stack Engineer · Software Architect · AI-Augmented Delivery",
  role: "Full-Stack Engineer & Software Architect",
  headline: "I orchestrate AI. I own the architecture.",
  location: "Arequipa, Peru",
  email: "schirinosne@gmail.com",
  linkedin: "https://www.linkedin.com/in/sebastian-chirinos-negron/",
  whatsapp: "https://wa.me/51987545926",
  github: "https://github.com/BastleyNait",
  portfolioUrl: "https://sebastian-cn-portfolio.vercel.app",
  bio: "Writing code stopped being the hard part. Deciding what to build, where state lives, what runs on-device, and what to reject before it merges — that is the job. I direct AI agents through a spec-first pipeline and personally own every architectural call behind six systems running in production across web, point of sale, cloud document delivery, native Android and offline machine learning.",
  shortBio: "I design the system, direct the agents, and defend every line that ships.",
  stats: [
    { label: "Systems in production", value: "6", icon: "Rocket" },
    { label: "Decisions on record", value: "6", icon: "ScrollText" },
    { label: "Product domains shipped", value: "4", icon: "Boxes" },
    { label: "Languages in production", value: "5", icon: "Braces" }
  ],
  typingLines: [
    "I orchestrate AI. I own the architecture.",
    "Spec first, agents second, review always.",
    "6 systems in production — design to deploy.",
    "Edge AI that runs with the network off.",
    "Open to Full-Stack & Software Engineering roles"
  ]
};

/* ------------------------------------------------------------------ *
 * How the work actually gets done: the orchestration loop.
 * Each phase declares who owns it — that ownership split is the point.
 * ------------------------------------------------------------------ */
export const orchestrationData = {
  thesis: "Every engineer has the same code generator now. The differences that survive contact with production are the ones a model cannot make for you: what to build, how to bound it, and what to refuse.",
  loop: [
    {
      step: "01",
      phase: "Frame",
      owner: "human",
      title: "Constraints before code",
      description: "I write the spec first: who uses it, expected load, budget, latency ceiling, and how it is allowed to fail. No agent starts until the acceptance criteria leave nothing to interpretation.",
      artifacts: ["Spec", "Acceptance criteria", "Non-goals"]
    },
    {
      step: "02",
      phase: "Decide",
      owner: "human",
      title: "The call a model cannot make for me",
      description: "Data model, service boundaries, sync versus async, where state lives, what runs on the device. Every choice is written down together with the trade-off I accepted.",
      artifacts: ["Decision record", "Data model", "Boundaries"]
    },
    {
      step: "03",
      phase: "Orchestrate",
      owner: "shared",
      title: "Bounded tasks, frozen interfaces",
      description: "Agents get one scoped task each against an interface I already fixed. Small diffs, explicit contracts, and no agent allowed to reach across more than one layer.",
      artifacts: ["Scoped tasks", "Typed contracts", "Small diffs"]
    },
    {
      step: "04",
      phase: "Reject",
      owner: "human",
      title: "Nothing ships that I cannot defend",
      description: "I read every line before it merges. Confident-looking code hiding an N+1 query, a race on shared state, or a key left in the bundle gets thrown out rather than patched.",
      artifacts: ["Line-by-line review", "Security pass", "Perf budget"]
    },
    {
      step: "05",
      phase: "Prove",
      owner: "human",
      title: "Measured, never assumed",
      description: "Ship behind checks, watch real traffic, and fold what production teaches back into the next decision record so the same mistake cannot be made twice.",
      artifacts: ["CI/CD", "Monitoring", "Post-ship notes"]
    }
  ],
  split: {
    delegatedTitle: "Delegated to agents",
    delegatedTag: "LEVERAGE",
    delegated: [
      "Scaffolding, CRUD layers and migrations",
      "Test cases derived from a spec I already wrote",
      "Mechanical refactors behind a fixed interface",
      "First-draft types, docs and fixtures"
    ],
    ownedTitle: "Never delegated",
    ownedTag: "JUDGEMENT",
    owned: [
      "Data model and service boundaries",
      "Trade-offs between cost, latency and complexity",
      "Auth, secrets and anything touching money or health data",
      "Whether the feature deserves to exist at all"
    ]
  }
};

/* ------------------------------------------------------------------ *
 * Architecture decision records. Context → options → call → trade-off.
 * These are the choices behind the projects below.
 * ------------------------------------------------------------------ */
export const decisionLog = [
  {
    id: "adr-001",
    project: "Boom POS & CRM",
    tag: "State & Reliability",
    title: "Cart lives on the client, the ledger lives on the server",
    context: "A sale cannot stall because the venue lost its connection halfway through checkout.",
    options: ["Server-authoritative cart on every keystroke", "Local cart, server as the transaction ledger"],
    decision: "Zustand holds the working cart in the browser. Flask and PostgreSQL own the ledger, and each completed sale posts as a single idempotent transaction.",
    tradeoff: "I took on reconciliation logic to buy a checkout that never blocks on the network."
  },
  {
    id: "adr-002",
    project: "Anemivision",
    tag: "Edge AI & Privacy",
    title: "Inference on the device, never in the cloud",
    context: "Anemia screening happens in clinics with unreliable connectivity, using images of a patient.",
    options: ["Hosted inference API", "Quantized model embedded in the Android app"],
    decision: "The PyTorch model is quantized to TensorFlow Lite and runs inside the app. No patient image ever leaves the phone.",
    tradeoff: "I gave up model size and painless retraining in exchange for zero network dependency and no health data in transit."
  },
  {
    id: "adr-003",
    project: "Lo Exacto & Calitop",
    tag: "Rendering Strategy",
    title: "Rendering chosen per route, not per project",
    context: "Public pages are judged by crawlers and first paint. The admin area is judged by how fresh its data is.",
    options: ["Server-render everything", "Static-generate everything", "Split the decision by route"],
    decision: "Public routes are statically generated and revalidated. The dashboard renders on the server. One PostgreSQL instance sits behind both.",
    tradeoff: "Two mental models coexist in one codebase, which buys crawlable marketing pages and an admin view that is never stale."
  },
  {
    id: "adr-004",
    project: "Revolt Laptop",
    tag: "Data Integrity",
    title: "The database, not the cache, decides whether stock exists",
    context: "Refurbished units are one of a kind, so selling the same laptop twice is a real failure, not a rounding error.",
    options: ["Trust the cached catalog count", "Enforce the decrement inside the order transaction"],
    decision: "Stock is decremented within the order transaction and guarded by a database constraint. The catalog cache is explicitly allowed to lag.",
    tradeoff: "A catalog that is a few seconds stale is acceptable. A double-sold machine is not."
  },
  {
    id: "adr-005",
    project: "Across all systems",
    tag: "Operational Surface",
    title: "PostgreSQL until something measured forces otherwise",
    context: "Every project arrives with a suggestion to add a queue, a cache and a document store on day one.",
    options: ["Adopt the specialised stores up front", "Defer until a benchmark demands them"],
    decision: "One PostgreSQL instance carries the system. Redis and vector search were introduced only where a measurement justified the extra moving part.",
    tradeoff: "I trade theoretical headroom for an operational surface a single engineer can genuinely run and reason about."
  },
  {
    id: "adr-006",
    project: "AI-assisted delivery",
    tag: "Orchestration",
    title: "Interfaces are written by hand before generation starts",
    context: "Agents produce their most useful work when the contract they are filling in is already frozen.",
    options: ["Let the agent design the API as it implements", "Fix types, endpoints and error shapes first"],
    decision: "I write the types, the endpoints and the error shapes myself. Agents implement against a contract they are not allowed to change.",
    tradeoff: "A slower start, in return for bounded reviews and integration failures that stop being a category of bug."
  }
];

export const projectsData = [
  {
    id: "lo-exacto",
    title: "Lo Exacto",
    category: "Web Platforms",
    role: "Architecture · Implementation · Deployment",
    description: "Production web platform and corporate site built for search visibility and instant loads.",
    longDescription: "Production platform on Next.js with PostgreSQL persistence, tuned for crawlability, first paint and navigation that never stutters.",
    keyDecision: "Static generation for public routes, server rendering for the dashboard, one database behind both.",
    tech: ["Next.js", "React", "PostgreSQL", "Tailwind CSS", "Vercel"],
    liveUrl: "https://www.lo-exacto.com/",
    repoUrl: "https://github.com/BastleyNait/LO-EXACTO.git",
    featured: true,
    status: "Production",
    previewImage: "lo-exacto"
  },
  {
    id: "calitop-services",
    title: "Calitop Services",
    category: "Web Platforms",
    role: "Architecture · Implementation · Deployment",
    description: "Corporate platform in production with an interactive catalog and an administrative dashboard.",
    longDescription: "Web system combining a dynamic services catalog, an administrative control panel and a PostgreSQL backend covering inventory and service records.",
    keyDecision: "Catalog reads are cached and allowed to lag; every write goes through the transactional path.",
    tech: ["Next.js", "PostgreSQL", "React", "Tailwind CSS", "Vercel"],
    liveUrl: "https://www.calitop-services.com/",
    repoUrl: "https://github.com/BastleyNait/CALITOP-WEB",
    featured: true,
    status: "Production",
    previewImage: "calitop-services"
  },
  {
    id: "revolt-laptop",
    title: "Revolt Laptop",
    category: "Commerce & POS",
    role: "Architecture · Data model · Deployment",
    description: "Commerce platform for refurbished laptops where every unit in stock is unique.",
    longDescription: "Storefront and admin panel for one-of-a-kind refurbished machines: filterable catalog, transactional stock control and order administration.",
    keyDecision: "Stock is decremented inside the order transaction under a database constraint, so a unit cannot be sold twice.",
    tech: ["Next.js", "PostgreSQL", "React", "Tailwind CSS", "Vercel"],
    liveUrl: "https://revolt-laptops.vercel.app/",
    repoUrl: "https://github.com/BastleyNait/REVOLT-LAP",
    featured: true,
    status: "Production",
    previewImage: "revolt-laptop"
  },
  {
    id: "boom-pos",
    title: "Boom POS & CRM",
    category: "Commerce & POS",
    role: "Architecture · State design · Backend",
    description: "Point of sale and CRM built to keep selling when the connection does not cooperate.",
    longDescription: "Business management system pairing a reactive checkout with a customer CRM module, centralised client state in Zustand, and a Flask and PostgreSQL backend that owns the transaction ledger.",
    keyDecision: "The cart is client-owned; the server records each completed sale as one idempotent transaction.",
    tech: ["Next.js", "Zustand", "Flask", "PostgreSQL", "API Routes"],
    liveUrl: "https://boom-pos.vercel.app/",
    repoUrl: "https://github.com/BastleyNait/BOOM-POS",
    featured: true,
    status: "Production",
    previewImage: "boom-pos"
  },
  {
    id: "anemivision",
    title: "Anemivision",
    category: "Edge AI & Mobile",
    role: "Architecture · Model pipeline · Android",
    description: "Native Android app detecting anemia entirely offline, with inference on the device.",
    longDescription: "Medical screening application running quantized computer vision inference on-device through TensorFlow Lite, built natively for Android in Kotlin.",
    keyDecision: "The model ships inside the app, so no patient image is ever transmitted anywhere.",
    tech: ["TensorFlow Lite", "PyTorch", "Android", "Kotlin", "Computer Vision"],
    liveUrl: null,
    repoUrl: "https://github.com/BastleyNait/ANEMIVISION",
    featured: true,
    previewLabel: "anemivision.apk",
    status: "Edge AI",
    previewImage: "anemivision"
  },
  {
    id: "geotop-certificates",
    title: "GEOTOP Certificates",
    category: "Web Platforms",
    role: "Architecture · Backend · Infrastructure",
    description: "Cloud certificate system for a surveying equipment company, verified by scanning the instrument itself.",
    longDescription: "Calibration certificates moved off paper into cloud object storage, addressable from a QR code printed on the physical instrument, behind a Flask service on Google Compute Engine.",
    keyDecision: "The QR resolves straight to the PDF, so a technician in the field needs no app, no login and no serial number.",
    tech: ["Flask", "Google Compute Engine", "Nginx", "S3-compatible storage", "QR"],
    liveUrl: null,
    repoUrl: "https://github.com/BastleyNait/GEOTOP-PDF",
    featured: true,
    status: "Production",
    previewLabel: "gestor de certificados",
    previewImage: "geotop-certificates",
    caseStudy: "geotop-certificates"
  }
];

export const techStackData = [
  {
    category: "Languages",
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
    category: "Mobile",
    icon: "Smartphone",
    items: [
      { name: "React Native" },
      { name: "Native Android" },
      { name: "Kotlin Mobile" }
    ]
  },
  {
    category: "Cloud & DevOps",
    icon: "Cloud",
    items: [
      { name: "Docker" },
      { name: "Google Cloud" },
      { name: "AWS" },
      { name: "Vercel" }
    ]
  },
  {
    category: "Data & APIs",
    icon: "Database",
    items: [
      { name: "PostgreSQL" },
      { name: "Vector DB" },
      { name: "MongoDB" },
      { name: "Redis" },
      { name: "REST & GraphQL" }
    ]
  },
  {
    category: "AI / ML",
    icon: "Brain",
    items: [
      { name: "TensorFlow Lite" },
      { name: "PyTorch" },
      { name: "Ollama / Local LLMs" },
      { name: "Pandas & NumPy" }
    ]
  }
];

export const engineeringPrinciples = [
  {
    title: "Architecture & System Design",
    icon: "Building2",
    description: "Boundaries drawn before code exists: clean and hexagonal layering, distributed services, and a data model that survives the second feature request.",
    tag: "Architecture"
  },
  {
    title: "Requirements & Scope Control",
    icon: "ClipboardCheck",
    description: "Turning a vague ask into acceptance criteria, then defending the non-goals that keep a delivery from quietly doubling in size.",
    tag: "Scope"
  },
  {
    title: "Security & Networking",
    icon: "ShieldCheck",
    description: "Network fundamentals, OWASP Top 10 applied in review, secrets kept out of bundles, and auditing on systems that handle money or health data.",
    tag: "Security"
  },
  {
    title: "Testing & Review Gates",
    icon: "TestTube2",
    description: "Unit, integration and end-to-end coverage used as the gate that generated code has to pass before it gets anywhere near a merge.",
    tag: "Quality"
  },
  {
    title: "Agile Delivery",
    icon: "Kanban",
    description: "Scrum and Kanban run as small reversible increments, so a wrong decision costs one iteration instead of one release.",
    tag: "Delivery"
  },
  {
    title: "Cloud & DevOps",
    icon: "CloudCognitive",
    description: "Containers, CI/CD pipelines and infrastructure on Vercel, AWS and Google Cloud, sized to what one engineer can actually operate.",
    tag: "Cloud"
  }
];
