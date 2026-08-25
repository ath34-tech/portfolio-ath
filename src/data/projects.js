export const projects = [
  {
    id: "pixie",
    number: "01",
    title: "Pixie",
    category: "AI / DESKTOP / AGENTS",
    status: "LIVE",
    year: "2026",
    image: "/assets/pixie_preview.jpg",
    tagline: "A desktop-native AI agent that can actually do work.",
    summary: "Desktop-native AI productivity agent built around custom Python agent orchestration, tool execution, memory management, observability, and long-running multi-step workflows.",
    stack: ["React.js", "Tauri", "Rust", "Python", "Cloudflare R2"],
    links: {
      live: "https://pixie-ath.netlify.app/",
      producthunt: "https://www.producthunt.com/products/pixie-7?launch=pixie-9",
      github: "https://github.com/AthTripathi/pixie"
    },
    featured: true,
    problem: "Most desktop AI assistants act as isolated chatbots that cannot read local files, execute multi-step tools, or retain long-term state across complex productivity tasks without overflowing context windows.",
    approach: "Built a native desktop container (Tauri/Rust) backed by an asynchronous Python agent runtime. Implemented context compression, conversation summarization, dynamic tool schema loading, and local/notion integrations.",
    architecture: {
      description: "Desktop UI communicates via Rust IPC with a Python orchestration daemon. The agent manages short-term message buffers, dynamic tool dispatching, and asynchronous execution loops.",
      nodes: [
        { id: "ui", label: "Tauri / React UI", type: "frontend" },
        { id: "ipc", label: "Rust IPC Bridge", type: "bridge" },
        { id: "engine", label: "Python Agent Engine", type: "core", active: true },
        { id: "context", label: "Context Compressor", type: "engine" },
        { id: "tools", label: "Tool Schema Loader", type: "engine" },
        { id: "storage", label: "Cloudflare R2 / Memory", type: "storage" }
      ],
      flow: ["ui -> ipc", "ipc -> engine", "engine -> context", "engine -> tools", "tools -> storage"]
    },
    decisions: [
      {
        number: "01",
        title: "Dynamic Tool Schema Loading",
        problem: "Injecting every tool's complete JSON schema into the initial prompt context caused high token overhead, latency, and frequent schema confusion.",
        decision: "Load lightweight tool summaries during initial prompt assembly, and fetch full JSON parameter schemas only after the model emits a specific tool selection intent.",
        why: "Reduced prompt context overhead by over 60%, improved tool selection accuracy, and accelerated initial model response time."
      },
      {
        number: "02",
        title: "Asynchronous IPC Architecture",
        problem: "Blocking single-threaded calls between the frontend UI and long-running Python execution caused desktop UI freezes during complex multi-step web and file operations.",
        decision: "Used Rust sidecar IPC streaming with non-blocking event loops, pushing partial tool status outputs to the React layer via asynchronous web sockets.",
        why: "Guaranteed smooth 60fps UI responsiveness during heavy background file analysis and API scraping operations."
      }
    ],
    technicalNotes: [
      {
        title: "CONTEXT COMPRESSION & SUMMARIZATION",
        content: "The memory manager automatically triggers context window compression when message histories cross safety thresholds. It replaces raw conversation turns with structured summaries while retaining active state variables."
      }
    ],
    codeSnippet: {
      label: "AGENT TOOL DISPATCHER (PYTHON)",
      language: "python",
      code: `async def dispatch_tool(self, tool_name: str, raw_arguments: dict) -> ToolResult:
    """Dispatches tool call with dynamic schema validation & context isolation."""
    if tool_name not in self.registry:
        raise ToolNotFoundError(f"Tool '{tool_name}' not dynamically loaded.")
        
    schema = await self.registry.get_schema(tool_name)
    validated_args = schema.validate(raw_arguments)
    
    with tracer.start_span(name=f"tool_exec_{tool_name}"):
        result = await self.registry[tool_name].execute(**validated_args)
        return self.memory.record_execution(tool_name, result)`
    },
    results: [
      "Custom agent orchestration handling multi-step file, Notion, and Excel operations.",
      "Integrated tracing and observability for every execution step.",
      "Context-efficient tool discovery decreasing token usage during long workflows."
    ],
    learnings: "Building long-running AI agents requires viewing context as a scarce cache rather than an unbounded dump. Agent reliability is primarily determined by tool schema design and error recovery paths."
  },
  {
    id: "bodh-ai",
    number: "02",
    title: "Bodh AI",
    category: "AI / VOICE / ASSESSMENT",
    status: "LIVE",
    year: "2026",
    image: "/assets/bodhai_preview.jpg",
    tagline: "A conversational approach to student assessment.",
    summary: "An AI-driven student assessment system designed around natural voice interactions, automated speech-to-text, evaluation pipelines, and structured outcome reporting.",
    stack: ["Python", "FastAPI", "React.js", "PostgreSQL", "Speech-to-Text", "LLM Evaluation"],
    links: {
      live: "https://bodh-voice.netlify.app/",
      github: "https://github.com/AthTripathi/bodh-ai"
    },
    featured: true,
    problem: "Traditional text-based assessments measure memorization rather than deep conceptual understanding, while manual oral examinations fail to scale across large student populations.",
    approach: "Designed a conversational assessment pipeline that engages students in dynamic oral dialogue, evaluates spoken responses in real-time, probes follow-up edge cases, and compiles structured diagnostic reports.",
    architecture: {
      description: "Student voice stream is processed through STT, passed into an adaptive assessment engine, evaluated for conceptual accuracy, and rendered back as natural audio while persisting diagnostic records.",
      nodes: [
        { id: "student", label: "Student Audio Stream", type: "user" },
        { id: "stt", label: "Speech-To-Text (STT)", type: "pipeline" },
        { id: "eval", label: "Assessment Engine", type: "core", active: true },
        { id: "llm", label: "LLM Evaluator", type: "engine" },
        { id: "tts", label: "TTS Synthesizer", type: "pipeline" },
        { id: "db", label: "PostgreSQL Diagnostic DB", type: "storage" }
      ],
      flow: ["student -> stt", "stt -> eval", "eval -> llm", "eval -> tts", "eval -> db"]
    },
    decisions: [
      {
        number: "01",
        title: "Adaptive Questioning Pipeline",
        problem: "Static question banks allow students to guess without revealing true depth of understanding.",
        decision: "Formulated dynamic state evaluation where the system probes deeper into ambiguous student answers before finalizing a module score.",
        why: "Distinguishes between shallow keyword memorization and genuine conceptual comprehension."
      }
    ],
    technicalNotes: [
      {
        title: "PRIVACY & ANONYMIZATION",
        content: "Audio streams are processed transiently in memory without persisting raw voice biometric audio to disk. Diagnostic metrics are tied to anonymized session tokens."
      }
    ],
    codeSnippet: {
      label: "ASSESSMENT ENGINE STATE MACHINE",
      language: "python",
      code: `class AssessmentSessionManager:
    async def evaluate_turn(self, session_id: str, spoken_transcript: str) -> TurnResponse:
        session = await self.db.get_session(session_id)
        evaluation = await self.evaluator.analyze_concept(
            rubric=session.current_rubric,
            transcript=spoken_transcript
        )
        
        if evaluation.confidence < 0.75 and session.followup_count < 2:
            return await self.generate_probing_question(session, evaluation)
            
        return await self.record_and_advance(session, evaluation)`
    },
    results: [
      "Conversational oral assessment framework producing structured rubric evaluations.",
      "Non-intrusive voice-driven workflow for natural student interaction.",
      "Real-time scoring across conceptual understanding and technical accuracy."
    ],
    learnings: "Voice-driven AI applications require tight streaming control to manage latency perception. Structuring prompts around explicit rubric criteria is essential for consistent evaluation."
  },
  {
    id: "ocr-pipeline",
    number: "03",
    title: "OCR Pipeline",
    category: "OCR / COMPUTER VISION / DATA",
    status: "LIVE",
    year: "2025",
    image: "/assets/ocr_preview.jpg",
    tagline: "Transforming scanned academic records into structured data.",
    summary: "Large-scale document digitization pipeline designed to process noisy scanned documents through deterministic image preprocessing, multi-engine OCR extraction, field validation, and selective AI fallbacks.",
    stack: ["Python", "OpenCV", "Tesseract", "FastAPI", "PostgreSQL", "Docker"],
    links: {
      github: "https://github.com/AthTripathi/ocr-pipeline"
    },
    featured: true,
    problem: "Historical scanned academic grade sheets and institutional marksheets contain severe rotational tilt, background noise, low contrast, and non-standard table layouts that break naive OCR tools.",
    approach: "Built a hybrid deterministic-first data pipeline: apply computer vision deskewing, binarization, and bounding box table extraction first, run deterministic OCR matching, and invoke expensive LLM extraction only on low-confidence fields.",
    architecture: {
      description: "Scanned document moves through image preprocessing, structural table segmentation, dual OCR engines, deterministic field parsing, confidence scoring, and selective AI fallback before database commit.",
      nodes: [
        { id: "scan", label: "Scanned Document", type: "input" },
        { id: "prep", label: "OpenCV Preprocessor", type: "cv" },
        { id: "ocr", label: "OCR Extractor", type: "engine" },
        { id: "score", label: "Confidence Scorer", type: "core", active: true },
        { id: "fallback", label: "Selective AI Fallback", type: "ai" },
        { id: "db", label: "Structured Database", type: "storage" }
      ],
      flow: ["scan -> prep", "prep -> ocr", "ocr -> score", "score -> fallback", "fallback -> db"]
    },
    decisions: [
      {
        number: "01",
        title: "Deterministic First, AI Second",
        problem: "Sending thousands of full high-resolution document scans directly to vision LLMs is prohibitively expensive and slow at scale.",
        decision: "Process 85%+ of records deterministically using OpenCV binarization, grid line detection, and regex table parsing. Route only ambiguous low-confidence crops (<80% match) to AI models.",
        why: "Reduced overall infrastructure processing costs by 78% while maintaining high accuracy across thousands of records."
      },
      {
        number: "02",
        title: "Adaptive Document Deskewing",
        problem: "Scanned pages submitted at 5-15 degree angles caused bounding-box table row misalignments during OCR parsing.",
        decision: "Implemented Radon-transform and Hough-line based angle estimation to automatically deskew pages prior to line segmentation.",
        why: "Increased table line extraction recall from 64% to 96% on historical archived marksheets."
      }
    ],
    technicalNotes: [
      {
        title: "ZERO DATA EXPOSURE",
        content: "All processing benchmarks and test suites utilize synthetic non-personally identifiable institutional sample sheets. Personal student data is never committed or logged."
      }
    ],
    codeSnippet: {
      label: "DETERMINISTIC CONFIDENCE ROUTER",
      language: "python",
      code: `def process_document_crop(crop_img, expected_schema):
    """Parses cropped table field and routes to AI only when confidence fails."""
    raw_text = tesseract_ocr(crop_img)
    field_data, confidence = parse_deterministic(raw_text, expected_schema)
    
    if confidence >= 0.85:
        return field_data, "DETERMINISTIC_PASS"
        
    # Selective AI fallback on isolated field crop
    ai_extracted = vision_llm_fallback(crop_img, context=expected_schema)
    return ai_extracted, "AI_FALLBACK_PASS"`
    },
    results: [
      "Processed complex historical academic marksheets into validated SQL tables.",
      "Hybrid architecture keeping cost predictable through deterministic validation.",
      "High accuracy across skewed, low-contrast, and multi-column tabular documents."
    ],
    learnings: "High-throughput data engineering relies on placing fast deterministic filters in front of heavy AI components rather than replacing traditional computer vision with black-box LLMs."
  },
  {
    id: "routellmesh",
    number: "04",
    title: "RouteLLMESH",
    category: "AI INFRASTRUCTURE",
    status: "LIVE",
    year: "2025",
    image: "/assets/routellmesh_preview.jpg",
    tagline: "An intelligent LLM gateway and provider router.",
    summary: "Intelligent LLM gateway that routes incoming API requests across multiple providers using modular routing strategies, fallback mechanisms, Redis-backed metadata, and an OpenAI-compatible interface.",
    stack: ["Python", "FastAPI", "Redis", "Docker", "GCP"],
    links: {
      dockerhub: "https://hub.docker.com/repository/docker/ath49/routellmesh",
      github: "https://github.com/AthTripathi/RouteLLMESH"
    },
    featured: true,
    problem: "Applications reliant on single AI model APIs suffer from unexpected provider outages, rate limits, latency spikes, and lock-in, requiring complex application-side fallback logic.",
    approach: "Engineered a proxy gateway implementing the standard OpenAI API specification. The router inspects request load, calculates cost heuristics, tracks provider health in Redis, and handles silent fallbacks.",
    architecture: {
      description: "Client applications connect via OpenAI-compatible endpoints. The routing engine evaluates heuristic rules, queries Redis health states, routes to downstream model providers, and manages failovers.",
      nodes: [
        { id: "client", label: "Client Application", type: "client" },
        { id: "proxy", label: "OpenAI-Compatible Proxy", type: "gateway" },
        { id: "router", label: "Routing Engine", type: "core", active: true },
        { id: "redis", label: "Redis Latency & Rate DB", type: "storage" },
        { id: "providers", label: "GPT / Gemini / Anthropic", type: "external" }
      ],
      flow: ["client -> proxy", "proxy -> router", "router -> redis", "router -> providers"]
    },
    decisions: [
      {
        number: "01",
        title: "OpenAI API Abstraction Boundary",
        problem: "Changing downstream LLM providers often requires updating SDK calls and response parsers across multiple codebase locations.",
        decision: "Exposed strict OpenAI-compatible HTTP headers and payload endpoints (/v1/chat/completions), translating internal vendor-specific variations within custom provider adapters.",
        why: "Allowed applications to switch target backend providers without changing a single line of client application code."
      },
      {
        number: "02",
        title: "Redis Circuit-Breaker for Latency Anomalies",
        problem: "When a cloud provider experiences 500 errors or high latency, requests block for 30+ seconds before timing out.",
        decision: "Maintained sliding-window latency stats in Redis. When failure thresholds exceed 5% in a 60-second window, the router trips a circuit breaker and reroutes traffic automatically.",
        why: "Prevented application timeouts and ensured seamless fallback during provider degradation."
      }
    ],
    technicalNotes: [
      {
        title: "STREAMING COMPATIBILITY",
        content: "Supports Server-Sent Events (SSE) token streaming across all abstracted backend providers while maintaining dynamic token counting for pricing metadata."
      }
    ],
    codeSnippet: {
      label: "ROUTER CIRCUIT BREAKER & FALLBACK (PYTHON)",
      language: "python",
      code: `async def route_completion(request: CompletionRequest) -> AsyncGenerator:
    primary_provider = await redis_tracker.get_optimal_provider(request.model)
    
    try:
        async for chunk in provider_adapter.stream(primary_provider, request):
            yield chunk
    except (ProviderTimeoutError, RateLimitError) as e:
        logger.warning(f"Primary provider '{primary_provider}' degraded. Triggering fallback.")
        fallback_provider = await redis_tracker.get_fallback(primary_provider)
        
        async for chunk in provider_adapter.stream(fallback_provider, request):
            yield chunk`
    },
    results: [
      "OpenAI-compatible unified API interface with zero client code modification.",
      "Automatic failover routing preserving high application availability.",
      "Redis-backed health and latency tracking across multi-cloud provider endpoints."
    ],
    learnings: "Infrastructure routing layers must remain ultra-thin. Keeping proxy latency overhead under 5ms requires asynchronous non-blocking connection pooling and minimal middleware allocation."
  },
  {
    id: "scout-crm",
    number: "05",
    title: "Scout CRM",
    category: "FULL STACK / CRM / BACKEND",
    status: "LIVE",
    year: "2025",
    image: "/assets/scout_crm_preview.jpg",
    tagline: "A full-stack CRM built for structured sales workflows.",
    summary: "Full-stack CRM platform providing role-based access control (RBAC), lead management, customer interaction logs, analytics dashboards, advanced query filtering, and asynchronous background jobs.",
    stack: ["React.js", "FastAPI", "PostgreSQL", "Redis", "Docker"],
    links: {
      live: "https://mango-scout.netlify.app/",
      github: "https://github.com/AthTripathi/Scout-CRM"
    },
    featured: true,
    problem: "Sales teams lack lightweight CRM tools that support complex multi-tenant role permissions, custom lead state filtering, and background outreach scheduling without bloated software clutter.",
    approach: "Designed a clean React single-page frontend backed by a high-performance FastAPI service with PostgreSQL relational schema modeling, JWT authentication, granular RBAC middleware, and Redis task workers.",
    architecture: {
      description: "React client interacts with FastAPI REST endpoints protected by JWT/RBAC middleware. Database queries utilize indexed PostgreSQL tables, while heavy bulk lead processing runs on background workers.",
      nodes: [
        { id: "ui", label: "React Frontend", type: "frontend" },
        { id: "api", label: "FastAPI REST Server", type: "core", active: true },
        { id: "auth", label: "JWT / RBAC Middleware", type: "security" },
        { id: "db", label: "PostgreSQL DB", type: "storage" },
        { id: "worker", label: "Redis Task Queue", type: "worker" }
      ],
      flow: ["ui -> api", "api -> auth", "api -> db", "api -> worker"]
    },
    decisions: [
      {
        number: "01",
        title: "Role-Based Access Control (RBAC) Middleware",
        problem: "Mixing permission checks inside API route handlers creates duplicate security logic and high vulnerability risk.",
        decision: "Centralized permission enforcement using declarative dependency injection in FastAPI, verifying token scopes against database role tables before route handlers execute.",
        why: "Simplified authorization code auditing and guaranteed uniform security policies across all API endpoints."
      }
    ],
    technicalNotes: [
      {
        title: "BACKGROUND BULK OPERATIONS",
        content: "Bulk CSV lead imports and automated email sequences execute asynchronously in background task queues to keep the main web thread latency low."
      }
    ],
    codeSnippet: {
      label: "FASTAPI DECLARATIVE RBAC DEPENDENCY",
      language: "python",
      code: `def RequirePermission(permission: str):
    async def permission_dependency(current_user: User = Depends(get_current_user)):
        if not current_user.has_permission(permission):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"User lacks required permission: '{permission}'"
            )
        return current_user
    return Depends(permission_dependency)`
    },
    results: [
      "Robust full-stack sales management application with granular user roles.",
      "Responsive React interface optimized for quick lead search and filtering.",
      "Asynchronous background processing for bulk lead imports and outreach."
    ],
    learnings: "Relational database schema modeling requires anticipating dynamic search filters early. Adding composite indexes on frequently filtered fields significantly improves query response times."
  },
  {
    id: "ai-trade-copilot",
    number: "06",
    title: "AI Trade Copilot",
    category: "DISTRIBUTED SYSTEMS / EVENT STREAMING",
    status: "LIVE",
    year: "2025",
    image: "/assets/trade_copilot_preview.jpg",
    tagline: "Event-driven trading analytics & AI mentor alerts.",
    summary: "Distributed microservices platform leveraging Spring Boot, Kafka, and AI to process trading event streams, compute technical indicators, analyze trader behavior, and deliver instant Telegram alerts.",
    stack: ["Spring Boot", "Kafka", "React.js", "PostgreSQL", "Gemini", "Telegram"],
    links: {
      github: "https://github.com/ath34-tech/trade-copilot"
    },
    featured: true,
    problem: "Active market traders struggle to detect emotion-driven trading mistakes, manage risk parameters in real-time, and aggregate market indicator signals across disparate data channels.",
    approach: "Built an event-driven microservices architecture using Apache Kafka to consume trade execution events, run windowed indicator calculations in Spring Boot, evaluate behavioral risk using Gemini, and dispatch instant push notifications.",
    architecture: {
      description: "Market and user trade execution events are published into Kafka topics. Specialized microservices compute indicators, calculate behavioral risk metrics, and trigger Gemini AI analysis for real-time alert routing.",
      nodes: [
        { id: "stream", label: "Trade Event Stream", type: "input" },
        { id: "kafka", label: "Apache Kafka Event Bus", type: "event", active: true },
        { id: "spring", label: "Spring Boot Microservices", type: "core" },
        { id: "ai", label: "Gemini AI Trade Mentor", type: "ai" },
        { id: "dash", label: "React Dashboard / Telegram", type: "output" }
      ],
      flow: ["stream -> kafka", "kafka -> spring", "spring -> ai", "spring -> dash"]
    },
    decisions: [
      {
        number: "01",
        title: "Event Streaming over Monolithic REST",
        problem: "Polling database tables for trade executions caused race conditions and delayed critical risk notifications by several seconds.",
        decision: "Adopted Apache Kafka pub/sub architecture with dedicated consumer groups for indicator aggregation, behavioral risk calculation, and alert dispatches.",
        why: "Achieved sub-second event notification processing and decoupled core calculation services."
      }
    ],
    technicalNotes: [
      {
        title: "BEHAVIORAL RISK ANALYSIS",
        content: "Tracks trade frequency, position scaling, and drawdowns to flag high-risk revenge-trading behavior before capital loss escalates."
      }
    ],
    codeSnippet: {
      label: "KAFKA TRADE EVENT CONSUMER (SPRING BOOT)",
      language: "java",
      code: `@KafkaListener(topics = "trade-executions", groupId = "analytics-group")
public void consumeTradeEvent(TradeEvent event) {
    log.info("Processing trade event for user: {}", event.getUserId());
    
    IndicatorResult metrics = analyticsService.calculateWindowedRisk(event);
    if (metrics.isHighRiskPattern()) {
        aiMentorService.generateBehavioralAlert(event, metrics)
            .thenAccept(telegramAlertService::sendInstantAlert);
    }
}`
    },
    results: [
      "Decoupled event-driven microservices architecture powered by Apache Kafka.",
      "Real-time technical indicator calculation and behavioral risk scoring.",
      "Instant multi-channel push notification system via Telegram and React UI."
    ],
    learnings: "Distributed event-driven architectures require careful topic partition key design to guarantee strict message ordering per user while maximizing parallel consumer throughput."
  }
];
