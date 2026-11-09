/* =========================================================
   BUILD LOGS — "how I built it" articles for each project.
   window.Reader.open(id) / .close()
   Facts come from the portfolio reference; anything unmeasured
   is labelled as a goal or left to the repo/write-up.
   ========================================================= */
(function () {
  const P = {
    pixie: {
      kicker: "Build log · A1 · Product · Desktop",
      title: "How I built Pixie, a desktop AI agent that runs on your own machine",
      deck: "A Tauri shell, a React front end, a Python brain, and one provider layer that treats a laptop model and a cloud model the same way.",
      meta: [["Status", "Launched · Product Hunt ~#50 for about a week"], ["Role", "Design, build & launch"], ["Stack", "Tauri · React · Vite · Python · Ollama · Groq · GPT · Gemini"]],
      flow: [["React + Vite", "the interface"], ["Tauri", "native shell & packaging"], ["Python backend", "agent loop"], ["Provider layer", "one interface"], ["Ollama · Groq · GPT · Gemini", "local or hosted"]],
      body: [
        { h: "Why a desktop agent", p: ["Most AI assistants live in a browser tab and talk to someone else's server. I wanted one that sits on the desktop, close to the files and tools people already use. I also wanted it to run on a local model when privacy or cost matters more than raw capability."] },
        { h: "The shape of the app", p: ["Pixie has three layers. The interface is React + Vite, wrapped in Tauri so it ships as a real desktop app and not a browser tab in disguise. Behind it, a Python backend runs the agent loop: it takes the conversation, decides whether a tool is needed, calls it, and returns the answer.", "The part I'm happiest with is the provider layer. Ollama (local), Groq, GPT and Gemini all sit behind the same interface, so switching from a laptop model to a hosted one is a setting, not a rewrite."] },
        { h: "Picking tools in two steps", p: ["I don't hand the model every tool schema at once and hope for a perfect function call. Pixie works in two passes. First it chooses a tool by reading the short tool descriptions. Then it builds the parameters for just that tool.", "Each prompt stays small and focused. That matters a lot when the model is a small local one running through Ollama, not a frontier model with a huge context window."],
          code: "# step 1: choose, using descriptions only\ntool = choose_tool(user_msg, [t.description for t in tools])\n\n# step 2: fill in arguments for that one tool\nargs = build_params(user_msg, tool.schema)\nresult = tool.run(**args)", cap: "Simplified sketch of the two-step tool flow." },
        { h: "Memory the user controls", p: ["An assistant that remembers is useful right up until it remembers the wrong thing. Pixie gives the user conversation and memory controls, so what the agent keeps is visible and can be cleared."] },
        { call: "The hard part wasn't the agent. It was onboarding.", p: ["For a developer, pulling a model through Ollama is one line. For everyone else it's a wall: install a runtime, pick a model, wait for gigabytes to download, and hope the laptop has enough RAM. Making local setup approachable became the main product problem, bigger than any prompt."] },
        { h: "Where it's going", p: ["The direction I'm exploring is a free tier plus a low-cost Pro tier (around ₹300), smoother onboarding, and a guided setup for local models."] },
        { h: "What I learned", list: ["Packaging and onboarding decide whether people ever see your agent loop.", "A provider abstraction pays for itself the first time a model or a price changes.", "Small models reward small, single-purpose prompts."] },
      ],
      links: [["Visit Pixie", "https://pixie-ath.netlify.app/"]],
    },

    routellmesh: {
      kicker: "Build log · A2 · Infrastructure",
      title: "How I built RouteLLMESH, an OpenAI-compatible LLM router",
      deck: "One endpoint your existing code already knows how to call, and a router behind it that decides which model should answer.",
      meta: [["Status", "Open source · Docker image on Docker Hub"], ["Role", "Design & build"], ["Stack", "FastAPI · PostgreSQL 17 · Redis · Groq · Docker · LangSmith"]],
      flow: [["Your app", "OpenAI SDK"], ["/v1/chat/completions", "FastAPI"], ["Router", "model: auto"], ["Provider adapters", "Groq & others"], ["Response", "OpenAI-shaped"]],
      body: [
        { h: "The problem", p: ["Applications usually hard-code one model. Every request, from “summarise this sentence” to “plan this migration”, goes to the same place at the same price. Switching providers means touching SDK code everywhere."] },
        { h: "Speak the API everyone already speaks", p: ["RouteLLMESH exposes an OpenAI-compatible surface. Any client that can talk to OpenAI can talk to it by changing the base URL. That decision drove everything else: if a gateway isn't a drop-in replacement, nobody adopts it."],
          code: 'from openai import OpenAI\n\nclient = OpenAI(base_url="http://localhost:8000/v1", api_key="...")\n\nresp = client.chat.completions.create(\n    model="auto",  # let the gateway decide\n    messages=[{"role": "user", "content": "Explain KV caching in two lines"}],\n)', cap: "Illustrative. See the repo README for the exact host and setup." },
        { h: "What model:auto does", p: ["When a request asks for auto, the router weighs the task and its complexity against cost. Simple requests can go to a cheaper, faster model. Harder ones go to a stronger one. Ask for a specific model and the gateway simply passes the request through."] },
        { h: "State and observability", p: ["PostgreSQL 17 and Redis hold the gateway's state. In development I run Postgres on port 5433 so it never collides with a local install. LangSmith tracing started as an experiment and turned out to be essential. When a router makes a decision you need to see why, or you can't tell a good route from a lucky one."] },
        { call: "Compatibility is a long tail", p: ["The happy path works in an afternoon. Matching the details clients rely on (response shapes, streaming chunks, error formats) is where the real work is, because one mismatch breaks an SDK somewhere."] },
        { h: "Shipping it", p: ["The gateway is packaged as a Docker image and published on Docker Hub, so trying it takes one pull, not a setup guide."] },
        { h: "What I learned", list: ["Compatibility is the feature. Routing is the bonus.", "Routing decisions need traces, or they can't be debugged.", "Cost-aware routing is a product decision as much as a technical one."] },
      ],
      links: [["GitHub repository", "https://github.com/ath34-tech/routeLLMESH"], ["Docker Hub", "https://hub.docker.com/r/ath49/routellmesh"], ["Medium (LLM routing write-up)", "https://athtripathi.medium.com/"]],
    },

    bodh: {
      kicker: "Build log · A3 · Voice AI · Real-time",
      title: "How I built Bodh AI, a voice interviewer for 12-year-olds",
      deck: "Real-time speech in Hindi and Hinglish, where the hardest bugs are pauses, interruptions and saying goodbye.",
      meta: [["Status", "Live demo"], ["Role", "Architecture & build"], ["Stack", "LiveKit (self-hosted) · FastAPI · Deepgram · Gemini 3.1 Flash-Lite · Groq"]],
      flow: [["Student mic", "48 kHz PCM"], ["LiveKit", "self-hosted rooms"], ["Deepgram", "speech → text"], ["Interview brain", "Gemini 3.1 Flash-Lite / Groq"], ["TTS", "text → speech"]],
      body: [
        { h: "Who it's for", p: ["Bodh runs spoken interviews for Grade 7–8 students, roughly 12 to 15 years old, in Hindi and Hinglish. That audience shaped everything. Students don't have personal accounts, so they join with a school code and a student ID. They don't speak in tidy sentences either, so the system has to cope with code-switching, hesitation and half-finished thoughts."] },
        { h: "The pipeline", p: ["Audio moves through a self-hosted LiveKit server running in Docker, as 48 kHz PCM. A FastAPI backend manages multiple rooms at once. Deepgram turns speech into text. An LLM layer decides what to say next: I've worked with Gemini 3.1 Flash-Lite and experimented with Groq. A text-to-speech stage speaks the reply, and I'm still evaluating TTS options."] },
        { h: "An interview is a state machine, not a chat", p: ["A chatbot answers the last message. An interviewer has a plan. For each question, Bodh tracks how confident it is in what the student knows, what evidence it has heard, and whether the topic is done. It uses that state to choose the follow-up."],
          code: '{\n  "question": "q3",\n  "confidence": 0.6,\n  "evidence": ["explained that plants need sunlight"],\n  "completed": false\n}', cap: "Simplified shape of the per-question state." },
        { call: "The bugs that make a voice agent feel robotic", list: ["Barge-in: when a student starts talking, the agent has to stop speaking right away, not finish its sentence.", "Awkward pauses: silence after a student finishes feels far longer on a voice call than in a chat window.", "Repeated or skipped questions when the state and the conversation drift apart.", "Hanging up too early: a casual “okay bye” in the middle of an answer shouldn't end the interview."] },
        { h: "Latency budget", p: ["The target is a sub-second turn: roughly 500 ms to under a second, depending on which stage you measure. These are design targets, not published benchmarks. I'll post numbers once I have measurements I trust."] },
        { h: "What I learned", list: ["In voice, timing is part of correctness.", "Explicit conversation state beats hoping the LLM remembers the plan.", "Design for the real user. Twelve-year-olds don't talk like test scripts."] },
      ],
      links: [["Try Bodh AI", "https://bodh-voice.netlify.app/"]],
    },

    kvcache: {
      kicker: "Build log · A4 · Inference",
      title: "Building KV Cache Lab to see what a long conversation costs",
      deck: "Inference concepts are easy to recite and hard to feel, so I built a tool that shows them live.",
      meta: [["Status", "In progress"], ["Role", "Design & build"], ["Stack", "FastAPI · Ollama (Qwen3 8B) · React · Vite · SSE · database-backed chats"]],
      flow: [["React + Vite", "chat & dashboard"], ["SSE /chat", "token stream"], ["FastAPI", "metrics + DB"], ["Ollama", "Qwen3 8B, local"]],
      body: [
        { h: "Why", p: ["Prefill, decode, TTFT, TPOT and the KV cache come up in every inference talk. I wanted to watch them change while chatting with a real model on my own machine, not just read about them."] },
        { h: "The build", p: ["A FastAPI backend talks to a local Ollama model, streams tokens to a React + Vite front end over Server-Sent Events, and stores conversations in a database. A metrics dashboard sits next to the chat. I started on Qwen3 4B and moved to Qwen3 8B."] },
        { h: "The math the lab is built on", p: ["Every token the model has seen leaves a key vector and a value vector in every layer. For Qwen3 8B the reported config is 36 layers, 8 KV heads and a head dimension of 128:"],
          code: "bytes per token = 2 (K and V) × 36 layers × 8 kv_heads × 128 dim × 2 bytes (fp16)\n                = 147,456 bytes ≈ 144 KiB\n\nfull 40,960-token context ≈ 5.63 GiB of cache", cap: "This is the number the slider on the front page computes." },
        { call: "Why the 8 KV heads matter", p: ["With an embedding size of 4,096 and a head dimension of 128, the model has 32 query heads but only 8 KV heads. That's grouped-query attention. If every query head had its own K and V, the cache would be 4× larger: about 576 KiB per token, or roughly 22.5 GiB for the full context."] },
        { h: "KVCacheConfig", p: ["The estimate lives in a small config object, so the same code can describe any model from its metadata."],
          code: "@dataclass\nclass KVCacheConfig:\n    n_layers: int = 36\n    n_kv_heads: int = 8\n    head_dim: int = 128\n    bytes_per_elem: int = 2  # fp16\n\n    def bytes_per_token(self) -> int:\n        return 2 * self.n_layers * self.n_kv_heads * self.head_dim * self.bytes_per_elem", cap: "Sketch of the config behind the memory estimate." },
        { h: "Status", p: ["Active build. The core is live chat, the KV memory estimate and the metrics dashboard. I'll publish it when I'd be happy to hand it to someone learning inference."] },
      ],
      links: [],
    },

    retree: {
      kicker: "Build log · A5 · Research · Agent memory",
      title: "Implementing ReTree: from a memory paper to running code",
      deck: "How should an agent organise what it has already experienced, and how does that change what it does next?",
      meta: [["Status", "Open source + write-up"], ["Role", "Paper implementation"], ["Source", "arXiv:2608.10676"]],
      flow: [["Paper", "arXiv:2608.10676"], ["Minimal implementation", "the core idea, runnable"], ["Experiments", "watch behaviour change"], ["Write-up", "Medium + video"]],
      body: [
        { h: "Why agent memory", p: ["Most agents either forget everything between tasks or stuff the whole history into the prompt. Both break down quickly. ReTree is a structured take on agent memory: organising past experience so the useful parts can be found and reused."] },
        { h: "How I approach a paper", p: ["My rule for paper implementations is to get the smallest version of the core idea running first, then grow it. Reading a method section and making it execute are different skills, and the gap between them is where most of the learning happens."] },
        { h: "What's in the repo", p: ["The repository has my implementation of the ReTree memory concepts, and a companion Medium article walks through it. For the exact algorithm and any results, the repo and the write-up are the source of truth. I'd rather point you there than summarise numbers loosely here."] },
        { h: "What I learned", list: ["Memory is a retrieval problem as much as a storage problem.", "A paper's diagram hides a lot of engineering decisions.", "Writing it up is how I check that I actually understood it."] },
      ],
      links: [["GitHub repository", "https://github.com/ath34-tech/Retree-Memory-Implementation"], ["The paper on arXiv", "https://arxiv.org/abs/2608.10676"], ["Medium write-up", "https://athtripathi.medium.com/"]],
    },

    atlas: {
      kicker: "Build log · A6 · Research · Evaluation",
      title: "Implementing ATLAS: testing agents with time in the loop",
      deck: "Building agents is half the job. The other half is knowing whether they work.",
      meta: [["Status", "Open source"], ["Role", "Research implementation"], ["Model", "Gemini 3.1 Flash-Lite"]],
      flow: [["Idea", "ATLAS time-testing"], ["Implementation", "Python"], ["Model", "Gemini 3.1 Flash-Lite"], ["Evaluation", "agent behaviour under test"]],
      body: [
        { h: "Why evaluation", p: ["It's easy to demo an agent and hard to say whether it's reliable. ATLAS is an approach to time-aware testing of agents, and I implemented it to understand evaluation from the inside, not just read the summary."] },
        { h: "Why a small, fast model", p: ["I used Gemini 3.1 Flash-Lite. Evaluation means many model calls, so a fast, inexpensive model keeps the build-measure-change loop short."] },
        { h: "Where to read more", p: ["The problem statement, the method and any measured results are in the repository. That's the source of truth, and I'm keeping claims here deliberately small until the write-up is complete."] },
      ],
      links: [["GitHub repository", "https://github.com/ath34-tech/ATLAS-time-testing"]],
    },

    dexa: {
      kicker: "Concept note · A7 · Developer tooling",
      title: "Dexa: sketching a terminal-first ML copilot",
      deck: "An ML assistant that lives where ML work actually happens: in the terminal.",
      meta: [["Status", "Concept / prototype, not a public release"], ["Role", "Concept & prototyping"], ["Focus", "Sandboxing · dataset versioning"]],
      flow: [["Terminal", "your shell"], ["Dexa", "copilot"], ["Sandbox", "safe code execution"], ["Dataset versions", "reproducible runs"]],
      body: [
        { h: "The idea", p: ["A lot of ML work happens in a terminal: run a script, tweak a dataset, run it again. Dexa is a concept for a copilot that lives there instead of in a separate chat window."] },
        { h: "What I explored", p: ["Two pieces. Sandboxed code execution, so the assistant can run code without risking your environment. And dataset versioning, so every experiment traces back to the exact data it used."] },
        { h: "Status", p: ["Concept and prototype stage. It isn't a public release, and it's labelled that way on purpose."] },
      ],
      links: [],
    },
  };
  const ORDER = ["pixie", "routellmesh", "bodh", "kvcache", "retree", "atlas", "dexa"];

  const root = document.getElementById("reader");
  const body = document.getElementById("readerBody");
  const page = root && root.querySelector(".reader-page");
  if (!root) return;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function render(id) {
    const d = P[id];
    const i = ORDER.indexOf(id), next = ORDER[(i + 1) % ORDER.length];
    const flow = d.flow.map((f, k) => `${k ? '<span class="rd-arrow"><i></i></span>' : ""}<div class="rd-node" style="--d:${k * 0.35}s"><b>${esc(f[0])}</b><span>${esc(f[1])}</span></div>`).join("");
    const sections = d.body.map((s) => {
      const ps = (s.p || []).map((x) => `<p>${esc(x)}</p>`).join("");
      const list = s.list ? `<ul>${s.list.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : "";
      const code = s.code ? `<figure class="rd-code"><pre><code>${esc(s.code)}</code></pre>${s.cap ? `<figcaption class="mono">${esc(s.cap)}</figcaption>` : ""}</figure>` : "";
      if (s.call) return `<aside class="rd-call"><span class="mono">The hard part</span><h3>${esc(s.call)}</h3>${ps}${list}</aside>`;
      return `<section class="rd-sec"><h2>${esc(s.h)}</h2>${ps}${list}${code}</section>`;
    }).join("");
    const links = d.links.length ? `<div class="rd-links">${d.links.map(([l, u]) => `<a class="mono" href="${u}" target="_blank" rel="noopener">${esc(l)} ↗</a>`).join("")}</div>` : "";
    body.innerHTML = `
      <div class="rd-head">
        <div class="kicker mono">${esc(d.kicker)}</div>
        <h1 id="rdTitle">${esc(d.title)}</h1>
        <p class="rd-deck">${esc(d.deck)}</p>
        <div class="rd-byline mono">By Ath Tripathi · Build log</div>
        <dl class="rd-meta">${d.meta.map(([k, v]) => `<div><dt class="mono">${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
      </div>
      <figure class="rd-flow-wrap"><figcaption class="mono">System flow</figcaption><div class="rd-flow">${flow}</div></figure>
      <div class="rd-body">${sections}</div>
      ${links}
      <button class="rd-next" type="button" data-next="${next}"><span class="mono">Next build log</span><b>${esc(P[next].title)} →</b></button>`;
    body.querySelector(".rd-next").addEventListener("click", () => open(next, true));
  }

  let isOpen = false, lastFocus = null;
  function open(id, swap) {
    if (!P[id]) return;
    render(id);
    page.scrollTop = 0;
    try { history.replaceState(null, "", "#build/" + id); } catch (e) {}
    document.dispatchEvent(new CustomEvent("badge", { detail: { id: "log-" + id, title: "Behind the Byline", sub: "Read a build log" } }));
    if (window.__lenis) window.__lenis.stop();
    if (isOpen && swap) {
      if (window.gsap) gsap.fromTo(body, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" });
      return;
    }
    lastFocus = document.activeElement;
    isOpen = true;
    root.classList.add("open");
    root.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("reader-open");
    if (window.gsap) {
      gsap.fromTo(".reader-backdrop", { opacity: 0 }, { opacity: 1, duration: 0.4 });
      gsap.fromTo(page, { rotateY: -75, x: -120, opacity: 0, transformPerspective: 1800, transformOrigin: "0% 50%" }, { rotateY: 0, x: 0, opacity: 1, duration: 0.9, ease: "expo.out" });
      gsap.from(body.querySelectorAll(".rd-head > *, .rd-flow-wrap, .rd-sec, .rd-call"), { y: 30, opacity: 0, stagger: 0.05, duration: 0.6, delay: 0.25, ease: "power3.out" });
    }
    page.querySelector(".reader-close").focus({ preventScroll: true });
  }
  function close() {
    if (!isOpen) return;
    isOpen = false;
    const done = () => {
      root.classList.remove("open");
      root.setAttribute("aria-hidden", "true");
      document.documentElement.classList.remove("reader-open");
      if (window.__lenis) window.__lenis.start();
      lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
    };
    try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {}
    if (window.gsap) {
      gsap.to(page, { rotateY: 60, x: 80, opacity: 0, duration: 0.5, ease: "power3.in", transformOrigin: "100% 50%" });
      gsap.to(".reader-backdrop", { opacity: 0, duration: 0.5, onComplete: done });
    } else done();
  }
  root.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) close(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && isOpen) close(); });

  window.Reader = { open, close, get isOpen() { return isOpen; }, data: P };

  // deep link: #build/pixie
  const m = location.hash.match(/^#build\/(\w+)/);
  if (m && P[m[1]]) setTimeout(() => open(m[1]), 2600);
})();
