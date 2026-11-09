# Ath Tripathi — Portfolio Reference

> A working source-of-truth document for rebuilding Ath's personal portfolio.
> Use this as content and positioning context, not as copy to paste verbatim.
> Last compiled: 9 November 2026.
>
> **Accuracy rule:** Facts explicitly corrected by Ath take precedence over older drafts. Where dates, titles, or metrics conflict, the uncertainty is called out rather than silently guessed.

---

## 1. Identity

- **Name:** Ath Tripathi
- **Location:** Lucknow, India
- **Education:** B.Tech, Computer Science and Engineering (AI Specialization), Institute of Engineering and Technology (IET), Lucknow
- **Education dates:** 2024–2028 (latest resume context)
- **CGPA:** 8.07/10 (latest corrected resume value; older drafts contained 9.19 and should not be reused)
- **Email:** athtripathi@gmail.com
- **GitHub:** https://github.com/ath34-tech
- **LinkedIn:** https://www.linkedin.com/in/ath-tripathi-320115230/
- **Current/older portfolio:** https://athtripathi.netlify.app/

## 2. Professional positioning

### Core positioning

Ath is an applied AI / LLM engineer with strong full-stack and backend foundations. His work sits at the intersection of:

- LLM and agent engineering
- Inference engineering and model serving
- Backend systems and API design
- Voice AI and real-time conversational systems
- AI product engineering: taking a useful idea from architecture through implementation and user-facing product

He does **not** want to be presented as only an ML researcher, only a frontend/full-stack developer, or as a DevOps specialist. The intended positioning is someone who can understand and build the complete path from model behavior and inference to backend orchestration and a usable product.

### What should come through

- Builds working AI products, not just notebooks or demos.
- Understands the practical engineering around LLMs: routing, serving, latency, memory, tool use, streaming, and evaluation.
- Comfortable moving between Python/backend work and a product interface.
- Takes ownership, learns unfamiliar systems quickly, tests and debugs, and thinks about the user experience.
- Can explain complex technical topics in clear language.
- Values practical impact and honest engineering claims over buzzwords.

### Roles and opportunities of interest

- Applied AI Engineer
- LLM Engineer / Agent Engineer
- AI Product Engineer
- Backend Engineer working on AI infrastructure
- Inference / model-serving engineering roles

Target environments include AI-first startups and YC-style early-stage teams, where end-to-end ownership matters.

## 3. Technical skills and areas of focus

Treat these as the strongest portfolio skill clusters. Avoid presenting every technology as equally deep.

### Languages
- Python
- C++
- JavaScript / TypeScript

### AI / LLM engineering
- LLM APIs and model integration
- Agentic systems and tool calling
- Prompting, structured outputs, and orchestration
- LoRA / QLoRA fine-tuning
- Model routing and provider abstraction
- Inference concepts: prefill/decode, TTFT, TPOT, batching, KV cache, GQA/MLA, quantization
- Streaming and evaluation of conversational systems
- Voice AI pipelines: speech-to-text, LLM response generation, text-to-speech, interruption/barge-in

### Backend and systems
- FastAPI
- Django
- REST / OpenAI-compatible APIs
- PostgreSQL
- Redis
- Docker
- Real-time communication and streaming
- API integrations
- System design and database fundamentals

### Frontend / product
- React
- Vite
- Tauri
- Expo / React Native (JavaScript)
- Vanilla CSS (a preferred styling approach)

### Tools and platforms seen in projects
- Ollama
- Groq
- Gemini models
- LiveKit
- Deepgram
- LangSmith
- Docker
- PostgreSQL
- Redis

**Skills presentation constraint:** Do not brand Ath as DevOps-heavy. Do not add Ansible, RabbitMQ, or Elasticsearch to the LinkedIn/portfolio skill list. Kubernetes, cloud-native infrastructure, observability, and Go are areas of interest/learning, but should not be overstated as professional mastery.

## 4. Selected projects

The projects below are the strongest known portfolio candidates. Prioritize a small number of substantial projects and explain the engineering decisions, constraints, and outcomes.

### 4.1 Pixie — Local desktop AI productivity agent

- **Project:** Pixie
- **Website:** https://pixie-ath.netlify.app/
- **Product Hunt:** Launched on Product Hunt; reached approximately #50 and remained around that position for about a week (confirm exact historical badge/launch wording before publishing).
- **Stack:** Tauri, React, Vite, Python; integrations have included Ollama, Groq, GPT, and Gemini.
- **What it is:** A local desktop AI productivity agent designed to help users work with AI tools on their own machine.
- **Engineering themes:**
  - Desktop app architecture with a Tauri + React frontend and Python backend.
  - Local model support through Ollama alongside hosted model providers.
  - Tool selection based on tool descriptions, followed by parameter construction.
  - Conversation and memory controls.
  - Product decisions around local execution, user experience, and packaging.
- **Product direction discussed:** Free tier plus a low-cost Pro tier (around ₹300); improve onboarding and make Ollama/local model setup approachable.
- **Portfolio angle:** Product engineering, desktop architecture, model/provider integration, and the trade-offs involved in making a local AI assistant usable.

### 4.2 RouteLLMESH — OpenAI-compatible LLM routing gateway

- **Repository:** https://github.com/ath34-tech/routeLLMESH
- **What it is:** A FastAPI-based, OpenAI-compatible gateway that routes requests between LLM providers/models.
- **Stack / infrastructure:** FastAPI, PostgreSQL 17 (configured on port 5433 in the development setup), Redis, Groq, Docker, LangSmith.
- **Core ideas:**
  - OpenAI-compatible API surface.
  - `model:auto` routing mode.
  - Routing based on cost and task/complexity considerations.
  - Provider abstraction and a centralized gateway.
  - Observability / tracing experiments with LangSmith.
- **Docker Hub:** https://hub.docker.com/r/ath49/routellmesh
- **Related writing:** Medium article about LLM routing (find and link the exact article from Ath's Medium profile before publishing).
- **Portfolio angle:** Backend engineering, API compatibility, routing decisions, cost-aware model selection, and production-oriented LLM infrastructure.

### 4.3 Bodh AI — Voice-based student interview system

- **Website:** https://bodh-voice.netlify.app/
- **What it is:** A voice-based interview experience for Grade 7–8 students (approximately ages 12–15).
- **User experience:** Designed for Hindi/Hinglish interaction; students enter using a school code and student ID rather than a conventional individual login.
- **Stack / architecture discussed:**
  - Self-hosted LiveKit using Docker.
  - FastAPI backend with multi-room support.
  - Deepgram for speech-to-text.
  - Gemini 3.1 Flash-Lite and Groq experiments for the LLM layer.
  - Text-to-speech options under evaluation.
  - 48 kHz PCM audio.
  - Interview state tracked through fields such as confidence, completed, and evidence.
- **Hard engineering problems explored:**
  - Keeping the conversation natural.
  - Reducing end-to-end latency (target discussed: roughly 500 ms to under 1 second, depending on the stage being measured).
  - Barge-in / interruption handling.
  - Avoiding awkward pauses, repeated questions, skipped questions, and premature disconnects on goodbye.
  - Designing follow-up questions based on interview state and evidence.
- **Portfolio angle:** Real-time voice AI, streaming architecture, stateful conversation design, latency debugging, and product design for a specific learner audience.
- **Accuracy note:** Describe latency as a target or engineering goal unless a measured benchmark is available.

### 4.4 ATLAS — Time-aware testing / agent evaluation

- **Repository:** https://github.com/ath34-tech/ATLAS-time-testing
- **Model used in implementation:** Gemini 3.1 Flash-Lite.
- **What it is:** An implementation/exploration of the ATLAS time-testing idea.
- **Portfolio angle:** Research-to-implementation, agent testing, evaluation design, and experimentation.
- **Accuracy note:** Add a concise problem statement, exact method, and measured result only after checking the repository and accompanying write-up.

### 4.5 ReTree — Memory implementation

- **Repository:** https://github.com/ath34-tech/Retree-Memory-Implementation
- **Related paper:** arXiv:2608.10676
- **Related writing:** Medium article describing the implementation.
- **What it is:** An implementation/exploration of ReTree memory concepts for agent systems.
- **Portfolio angle:** Agent memory, retrieval/organization of experience, paper implementation, and understanding how memory changes agent behavior.
- **Accuracy note:** Confirm the precise algorithm and benchmark claims from the repository/article before publishing.

### 4.6 Dexa — Terminal-first ML copilot

- **What it is:** A terminal-first ML copilot concept.
- **Explored capabilities:** Code sandboxing and dataset versioning.
- **Portfolio angle:** Developer tooling and practical ML workflow support.
- **Status:** Concept/prototype context; do not imply a polished public release unless confirmed.

### 4.7 KV Cache Lab — LLM inference learning tool

- **What it is:** A local web application for exploring KV-cache behavior and inference metrics.
- **Architecture:** FastAPI backend, local Ollama model, React/Vite frontend, SSE chat endpoint, and database-backed conversations.
- **Model configuration used during development:** Qwen3 8B; reported metadata included 36 layers, 8 KV heads, head/key/value dimension 128, context length 40,960, and embedding dimension 4,096. An earlier setup used Qwen3 4B.
- **Planned/implemented concepts:** KV-cache memory estimation through a `KVCacheConfig`, live chat, and a metrics dashboard.
- **Portfolio angle:** Turning inference internals into an interactive engineering/learning tool.
- **Status:** Active build context; verify current completion before describing as shipped.

### Other project / product concepts

- **Fback:** Automated post-payment customer feedback flow. Each customer receives a link that expires after 24 hours; supports chat, voice, and voice notes. FastAPI backend. Brand color discussed: `#7c2d12`.
- **Mango Scout / MANGOneeds:** Agency lead discovery system concept.
- **OKF Knowledge Builder:** Concept for converting PDFs, spreadsheets, and chat content into an OKF knowledge structure, with GPT/Claude/Gemini roles.
- **Scout CRM:** Appeared in earlier portfolio/resume discussions; confirm whether this is a distinct shipped project and whether it should be public.
- **AI Trade Copilot:** Explicitly removed from an earlier resume direction; do not reintroduce without asking.

## 5. Experience

### Paath.Live — Machine Learning Intern

- **Role:** ML Intern.
- **Work:** Fine-tuning models using LoRA / QLoRA.
- **Important correction:** Paath.Live is the correct ML internship. Do **not** attribute this role to Softpro India.
- **Dates:** Not reliably established in the latest context; confirm before publishing.

### Manifold Ventures — Full-Stack Intern / Part-time

- **Dates:** December 2024 – June 2025 (known from prior context).
- **Work themes:** Full-stack development, integrations, and work on the Meavana Chrome extension.
- **Portfolio angle:** Product implementation, integrations, and working across frontend/backend boundaries.
- **Exact title:** Full-stack intern / part-time has been used; use the wording Ath confirms for the final site.

### Vcriate — Problem Setter / Technical Assessment Reviewer

- **Problem Setter Intern:** May 2025 – August 2025.
- **Work:** Created 35+ problems and reviewed 130+ problems/assessments (the exact scope of the 130+ figure should be checked).
- **Later work:** Freelance/contract technical assessment review, including DSA and SQL online assessments and reports.
- **Latest resume context:** Technical Assessment Reviewer, June 2025 – Present, freelance/contract; reviewed 130+ DSA/SQL assessments.
- **Important nuance:** Ath has also said he is not currently working with Vcriate. Confirm whether the freelance/contract relationship is still active before using “Present.”
- **Portfolio angle:** Assessment design, technical correctness, problem quality, and reviewing solutions at scale.

### Fractal Coding Club — DSA Mentor

- **Dates:** February 2025 – Present in prior resume context; confirm current status.
- **Work:** Mentored 200+ students in data structures and algorithms.
- **Portfolio angle:** Teaching, mentorship, breaking down complex topics, and technical communication.

## 6. Achievements and proof points

Use only metrics that can be substantiated and keep the wording precise.

- **Mentorship:** 200+ students mentored in DSA through Fractal Coding Club.
- **Technical assessment work:** 130+ DSA/SQL assessments reviewed (confirm exact scope and current Vcriate status).
- **Problem setting:** 35+ problems created during the Vcriate problem-setter internship.
- **Competitive programming:**
  - Codeforces: Specialist (latest correction; do not use older “Pupil 1356” wording).
  - CodeChef: 3-star.
  - DSA practice: 600+ problems solved (latest figure; older references said 400+).
- **Writing reach:** 30K+ Medium views (historical metric; refresh analytics before publishing).
- **TutorialsPoint:** 74 tutorials authored (latest known figure).
- **Product Hunt:** Pixie reached approximately #50 for about one week; verify exact launch metric.
- **Hackathons:**
  - Ankuran — Winner.
  - IIT BHU MLWARE / Eco Hackathon — Top 10.
  - NSUT Hack for Delhi — Top 50 / Top 10 appears inconsistently across drafts; verify exact result and category before publishing.
  - IIIT Lucknow — Round 3.
- **Open source:** Has explored/contributed to open-source projects and LFX-related opportunities. Do not list a specific accepted contribution or merged PR without verifying the repository/PR.

## 7. Writing, teaching, and creator work

Ath has a meaningful technical communication footprint. This should support the engineering story rather than make the portfolio look like a generic content-writer site.

- **Medium:** https://athtripathi.medium.com/
  - 30K+ views historically.
  - Topics include AI/LLMs, engineering implementations, and technical explainers.
  - ReTree and LLM routing are known related article topics.
- **TutorialsPoint author page:** https://www.tutorialspoint.com/authors/ath-tripathi
  - 74 tutorials in latest known context.
- **YouTube:** https://youtube.com/@TeachMeAth
  - Channel/creator identity: TeachMeAth.
  - Planned/known content includes ReTree implementation, agentic system design, OKF, and KV Cache Lab.
- **Technical content capabilities:** Long-form tutorials, concise LinkedIn/X technical posts, explaining engineering concepts, and SEO/AEO/GEO-aware content.
- **Content style:** Practical, specific, technically grounded, and human. Avoid generic AI-generated-sounding prose.

## 8. Hackathons, communities, and open source

- Mentors DSA learners through Fractal Coding Club.
- Participates in hackathons and has built projects under time constraints.
- Interested in LFX and cloud-native/open-source engineering.
- Open-source learning interests have included Meshery, OpenTelemetry, Jaeger, Kmesh/MCP, GPU observability, and KV-cache-aware scheduling.
- Has explored system-level topics such as observability for AI applications, serving infrastructure, and distributed systems.
- **Cello project:** Ath previously referred to an open-source project contribution by this name. Details are not present in the currently consolidated facts; retrieve the exact repository, contribution, and PR before featuring it.

## 9. Learning and technical interests

These are useful for a “currently exploring” section or technical writing feed, but should be separated from proven experience.

- LLM inference and serving: prefill/decode, TTFT, TPOT, continuous batching, KV cache, GQA/MLA, quantization.
- Model serving systems, including vLLM; TensorRT-LLM and Triton were topics Ath wanted to understand in context rather than technologies to claim as hands-on expertise without evidence.
- Distributed systems and database internals: B-trees, MVCC, WAL, sharding.
- Networking and system design.
- Agent architecture, memory, evaluation, tool use, and multi-agent systems.
- Kubernetes/cloud-native infrastructure and observability.
- Go.
- OpenTelemetry / AI observability.
- Voice agent architecture and real-time audio.

## 10. Personal working style and engineering values

These are useful as themes in the About section and project case studies.

- Learns by building and testing, not only by reading.
- Likes first-principles understanding: begin with a simple explanation, then move into architecture, math, and implementation.
- Values ownership and the ability to move from an unclear problem to a working solution.
- Cares about user experience and the practical friction of using a technical product.
- Enjoys debugging real failure modes and understanding why a system behaves as it does.
- Wants claims to be honest and measurable.
- Prefers explaining difficult technical ideas in simple language.
- Likes documenting architecture and decisions before implementation.

## 11. Portfolio design and writing preferences

### Visual / product approach
- Portfolio should feel like an engineer-builder's personal site, not a generic resume template.
- Strong preference for a deliberate visual identity and real references/inspiration before coding.
- Uses Refero to collect design references.
- Writes a `design.md` / PRD before implementation.
- Often creates separate Markdown specifications for groups of pages.
- Prefers React + Vite and vanilla CSS; does not want Tailwind or heavy UI libraries by default.
- Wants the site to be clear, fast, responsive, and easy to maintain.
- Can use visual personality (brutalist / pop-art / pixel-inspired motifs have been explored for TeachMeAth), but the portfolio should remain readable and credible to startup engineering teams.

### Writing voice
- Natural, direct, confident, and honest.
- Concrete over abstract.
- Avoid empty phrases such as “passionate about leveraging cutting-edge technology,” “delve,” “robust,” and “seamless.”
- Avoid inflated claims and generic AI buzzwords.
- Prefer describing what was built, the hard part, the trade-off, and what changed.
- Short, useful headings; no long self-congratulatory paragraphs.
- Do not describe Ath as “just an ML enthusiast” or “just a full-stack developer.”

## 12. Suggested portfolio information architecture

A useful starting structure (not a mandate):

1. **Home**
   - One clear positioning statement.
   - A short explanation of the kind of systems Ath builds.
   - Selected projects with live demos / repositories.
   - Links to GitHub, LinkedIn, email, and writing.
2. **Projects**
   - Pixie
   - RouteLLMESH
   - Bodh AI
   - ReTree
   - ATLAS
   - KV Cache Lab (once its current status is clear)
3. **Experience**
   - Paath.Live
   - Manifold Ventures
   - Vcriate
   - Fractal Coding Club
4. **Writing**
   - Medium
   - TutorialsPoint
   - TeachMeAth / YouTube
5. **About**
   - Engineering approach, interests, and what kinds of problems Ath wants to work on.
6. **Contact**
   - Email, GitHub, LinkedIn.

For each featured project, aim to include:
- Problem / user
- Why the problem matters
- Ath's role and ownership
- Architecture diagram or concise system flow
- Stack (only technologies actually used)
- One or two difficult engineering decisions
- Failure modes / trade-offs / what was learned
- Demo, repository, and related write-up
- Measured outcome, if available

## 13. Links index

| Destination | Link |
|---|---|
| GitHub | https://github.com/ath34-tech |
| LinkedIn | https://www.linkedin.com/in/ath-tripathi-320115230/ |
| Email | mailto:athtripathi@gmail.com |
| Existing portfolio | https://athtripathi.netlify.app/ |
| Medium | https://athtripathi.medium.com/ |
| TutorialsPoint author page | https://www.tutorialspoint.com/authors/ath-tripathi |
| YouTube / TeachMeAth | https://youtube.com/@TeachMeAth |
| Pixie | https://pixie-ath.netlify.app/ |
| RouteLLMESH repository | https://github.com/ath34-tech/routeLLMESH |
| RouteLLMESH Docker Hub | https://hub.docker.com/r/ath49/routellmesh |
| Bodh AI | https://bodh-voice.netlify.app/ |
| ATLAS repository | https://github.com/ath34-tech/ATLAS-time-testing |
| ReTree implementation | https://github.com/ath34-tech/Retree-Memory-Implementation |
| ReTree paper | https://arxiv.org/abs/2608.10676 |

## 14. Items to verify before publishing

These are the known gaps/conflicts. Do not silently invent answers.

1. Confirm current degree dates and CGPA. Latest resume context says 2024–2028 and 8.07; older material says 2023–2027 and 9.19.
2. Confirm Paath.Live internship dates.
3. Confirm exact Manifold Ventures title and whether “part-time” should be included.
4. Confirm whether Vcriate freelance review work is still active. Older context says not currently working there; latest resume draft used “Present.”
5. Confirm whether Fractal Coding Club mentorship is still ongoing.
6. Confirm the exact NSUT Hack for Delhi result (Top 50 vs Top 10).
7. Verify Pixie's Product Hunt ranking and duration before using a precise badge/claim.
8. Refresh Medium views and TutorialsPoint tutorial count.
9. Confirm whether 600+ DSA problems is still the preferred current figure.
10. Add exact URLs for the ReTree and LLM-routing Medium articles.
11. Verify the current state and public demo/repository of KV Cache Lab.
12. Retrieve the Cello open-source repository and exact contribution/PR details.
13. Confirm which projects are public and which are prototypes that should be labelled accordingly.
14. Confirm whether Scout CRM should appear and whether it is separate from Mango Scout.
15. Add measured performance/results for Bodh AI only if backed by actual tests.

---

## 15. Short bio drafts (starting points)

### One-line
Applied AI and LLM engineer building agentic products, voice systems, and the backend infrastructure that makes them work.

### Short
I'm Ath, a CSE (AI) student at IET Lucknow. I build AI products end to end — from LLM orchestration and inference-aware backends to real-time voice experiences and user-facing applications. I enjoy getting into the engineering details, debugging the hard parts, and making the result useful to real people.

### More systems-oriented
I build the systems around AI models: routing, APIs, memory, streaming, inference-aware tooling, and product interfaces. My projects range from a local desktop AI agent to an OpenAI-compatible LLM gateway and a real-time voice interview system.

> These are draft directions. The final homepage copy should be shaped around the portfolio's visual direction and the roles Ath wants to attract.
