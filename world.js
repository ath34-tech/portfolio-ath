/* =========================================================
   RIDE THROUGH ATH'S CITY — a small 3D open world.
   Inky rides a delivery bike around a ring road. Every building is
   one of Ath's projects, roles or achievements, sized by how much
   there is to tell. Press Enter on a doorstep to walk inside and
   read the full wall poster.
   ========================================================= */
(function () {
  const stage = document.getElementById("cityStage");
  if (!stage) return;
  const $ = (id) => document.getElementById(id);
  const canvas = $("cityCanvas"), mapCv = $("cityMap"), overlay = $("cityOverlay");
  const startBtn = $("cityStart"), exitBtn = $("cityExit"), plaque = $("cityPlaque");
  const plq = { k: $("plqKicker"), t: $("plqTitle"), p: $("plqText"), b: $("plqBtn") };
  const ui = { visited: $("cityVisited"), total: $("cityTotal"), speed: $("citySpeed") };
  const room = $("bldRoom"), poster = $("poster"), roomName = $("roomName"), fade = $("cityFade");
  const badge = (id, title, sub) => document.dispatchEvent(new CustomEvent("badge", { detail: { id, title, sub } }));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- buildings (size = how much there is to tell) ----------
     project: w × d footprint, h height · award: s = scale of the domed hall · job: office block */
  const B = [
    { id: "pixie", type: "project", title: "Pixie", sub: "Desktop AI agent · Launched", w: 9.5, d: 8, h: 24, text: "A local desktop AI agent with a Tauri + React shell and a Python brain. Runs Ollama locally or Groq, GPT and Gemini in the cloud. Launched on Product Hunt (~#50 for about a week)." },
    { id: "ankuran", type: "award", title: "Ankuran", sub: "Hackathon · Winner", s: 1.35, text: "Winner of the Ankuran hackathon." },
    { id: "routellmesh", type: "project", title: "RouteLLMESH", sub: "LLM routing gateway", w: 8.5, d: 7.5, h: 21, text: "An OpenAI-compatible FastAPI gateway. Send model:auto and it routes by cost and task complexity." },
    { id: "manifold", type: "job", title: "Manifold Ventures", sub: "Full-stack intern · 7 months", w: 9, d: 6.5, h: 12, text: "Full-stack product work and integrations from Dec 2024 to Jun 2025, including the Meavana Chrome extension." },
    { id: "bodh", type: "project", title: "Bodh AI", sub: "Real-time voice interviewer", w: 8.5, d: 7.5, h: 19, text: "Spoken Hindi/Hinglish interviews for Grade 7–8 students, on self-hosted LiveKit, Deepgram, an LLM and TTS." },
    { id: "hack4delhi", type: "award", title: "Hack4Delhi", sub: "Top 10 finalist", s: 1.15, text: "Top 10 finalist at Hack4Delhi." },
    { id: "kvcache", type: "project", title: "KV Cache Lab", sub: "Inference learning tool", w: 7.5, d: 6.5, h: 15, text: "A local lab that shows how KV-cache memory grows: Qwen3 8B costs 144 KiB per token at fp16." },
    { id: "vcriate", type: "job", title: "Vcriate", sub: "Problem setter → reviewer", w: 8, d: 6, h: 10.5, text: "Wrote 35+ problems as a problem-setter intern, then reviewed 130+ DSA and SQL assessments on contract." },
    { id: "retree", type: "project", title: "ReTree", sub: "Agent memory · paper → code", w: 7, d: 6, h: 13, text: "An implementation of the ReTree agent-memory paper (arXiv:2608.10676), with a Medium write-up." },
    { id: "cp", type: "award", title: "Competitive Programming", sub: "CF Specialist · CodeChef 3★", s: 1.1, text: "Codeforces Specialist, CodeChef 3★, and 600+ DSA problems solved." },
    { id: "paath", type: "job", title: "Paath.Live", sub: "Machine Learning intern", w: 7.5, d: 6, h: 11, text: "Fine-tuned models with LoRA and QLoRA." },
    { id: "atlas", type: "project", title: "ATLAS", sub: "Time-aware agent testing", w: 7, d: 6, h: 12, text: "An implementation of the ATLAS time-testing idea for agent evaluation, on Gemini 3.1 Flash-Lite." },
    { id: "writing", type: "award", title: "The Writer's Guild", sub: "74 tutorials · 30K+ views", s: 1.2, text: "74 tutorials on TutorialsPoint, 30K+ Medium views, and the TeachMeAth channel." },
    { id: "iitbhu", type: "award", title: "IIT BHU", sub: "MLWARE / Eco · Top 10", s: 1.0, text: "Top 10 at the IIT BHU MLWARE / Eco hackathon." },
    { id: "dexa", type: "project", title: "Dexa", sub: "ML copilot · prototype", w: 5.5, d: 5, h: 7, text: "A concept for a terminal-first ML copilot, exploring sandboxed execution and dataset versioning. Prototype." },
  ];

  /* ---------- wall-poster content for roles & awards (projects use the build logs) ---------- */
  const POSTERS = {
    paath: {
      kicker: "Career notice · Machine Learning", title: "Paath.Live: Machine Learning Intern",
      deck: "Adapting pretrained language models to specific jobs with LoRA and QLoRA.",
      meta: [["Role", "Machine Learning Intern"], ["Focus", "LoRA / QLoRA fine-tuning"], ["Company", "Paath.Live"]],
      body: [
        { h: "What I did", p: ["My work at Paath.Live was fine-tuning models with LoRA and QLoRA: teaching a pretrained model a specific job without retraining all of its weights."] },
        { h: "LoRA and QLoRA, briefly", p: ["LoRA freezes the base model and trains small low-rank adapter matrices beside it, so only a tiny fraction of parameters change. QLoRA goes further and keeps the frozen base model in 4-bit precision while training the adapters. That makes fine-tuning possible on much more modest GPUs."] },
        { h: "What it taught me", list: ["A falling loss curve isn't the same as a useful model. You have to read the outputs.", "The memory budget shapes almost every training decision.", "Fine-tuning is one tool among several. Sometimes better prompting or retrieval is the right answer."] },
      ],
    },
    manifold: {
      kicker: "Career notice · Full-stack", title: "Manifold Ventures: Full-Stack Intern",
      deck: "December 2024 to June 2025. Shipping product work across the frontend/backend boundary.",
      meta: [["Role", "Full-stack intern (part-time)"], ["Dates", "Dec 2024 – Jun 2025"], ["Highlight", "Meavana Chrome extension"]],
      body: [
        { h: "What I did", p: ["Full-stack development and third-party integrations, including work on the Meavana Chrome extension. The work ran across the whole feature: the interface, the API behind it, and the services it connects to."] },
        { h: "Why it mattered", p: ["It was my first long stretch of shipping inside a product team, where a feature isn't finished when the code compiles but when it works for the person using it."] },
        { h: "What I took away", list: ["Integrations fail in ways no tutorial covers, so build for the error path.", "A browser extension is a product with its own constraints: permissions, lifecycle and review.", "Owning a feature end to end is faster than handing it off between layers."] },
      ],
    },
    vcriate: {
      kicker: "Career notice · Assessment", title: "Vcriate: Problem Setter, then Assessment Reviewer",
      deck: "Writing problems that test real understanding, then judging hundreds of solutions to them.",
      meta: [["Problem Setter Intern", "May – Aug 2025"], ["Then", "Technical assessment reviewer (contract)"], ["Output", "35+ problems · 130+ reviews"]],
      body: [
        { h: "Setting problems", p: ["As a problem-setter intern I wrote 35+ problems. A good problem has one clear idea, an unambiguous statement, and test cases that catch wrong solutions, not just confirm right ones."] },
        { h: "Reviewing assessments", p: ["Later, on contract, I reviewed 130+ DSA and SQL online assessments and wrote reports on them. That meant checking correctness, judging solution quality, and explaining what each candidate did well or missed."] },
        { h: "What it sharpened", list: ["Reading other people's code fast and fairly.", "Spotting the edge case before the test suite does.", "Writing feedback someone can act on."] },
      ],
    },
    ankuran: {
      kicker: "Achievement · Hackathon", title: "Ankuran Hackathon: Winner",
      deck: "First place.",
      meta: [["Result", "Winner"], ["Event", "Ankuran"], ["Format", "Hackathon"]],
      body: [
        { h: "The result", p: ["I won the Ankuran hackathon."] },
        { h: "How I approach a hackathon", p: ["A hackathon squeezes a product cycle into hours. Pick a problem small enough to finish, build the exact path a judge will click through, and cut everything else. The same instinct carries over to real products: ship the core loop first."] },
      ],
    },
    hack4delhi: {
      kicker: "Achievement · Hackathon", title: "Hack4Delhi: Top 10 Finalist",
      deck: "One of the top ten finalist teams.",
      meta: [["Result", "Top 10 finalist"], ["Event", "Hack4Delhi"], ["Format", "Hackathon"]],
      body: [
        { h: "The result", p: ["Made the Top 10 finalists at Hack4Delhi."] },
        { h: "Building under a deadline", p: ["Hackathons are where I practise the most important early-stage skill: deciding what not to build, so that what does get built actually works on demo day."] },
      ],
    },
    iitbhu: {
      kicker: "Achievement · Hackathon", title: "IIT BHU MLWARE / Eco Hackathon: Top 10",
      deck: "A top-ten finish at IIT BHU.",
      meta: [["Result", "Top 10"], ["Event", "MLWARE / Eco Hackathon"], ["Host", "IIT BHU"]],
      body: [{ h: "The result", p: ["Finished in the Top 10 at the IIT BHU MLWARE / Eco hackathon."] }],
    },
    cp: {
      kicker: "Achievement · Competitive programming", title: "Codeforces Specialist · CodeChef 3★",
      deck: "600+ data-structures and algorithms problems solved.",
      meta: [["Codeforces", "Specialist"], ["CodeChef", "3★"], ["Practice", "600+ problems"]],
      body: [
        { h: "The numbers", p: ["Specialist on Codeforces, 3★ on CodeChef, and more than 600 DSA problems solved."] },
        { h: "Why it matters for engineering", p: ["Contest problems build the habit of thinking about complexity before writing code, and of finding the edge case before a user does. Those habits show up everywhere, from database queries to KV-cache budgets."] },
      ],
    },
    writing: {
      kicker: "Achievement · Writing & teaching", title: "The Writer's Guild",
      deck: "74 tutorials, 30K+ Medium views, and a YouTube channel called TeachMeAth.",
      meta: [["TutorialsPoint", "74 tutorials"], ["Medium", "30K+ views"], ["YouTube", "TeachMeAth"]],
      body: [
        { h: "What I write", p: ["Long-form tutorials on TutorialsPoint, implementation write-ups on Medium (LLM routing, ReTree memory), and videos on agentic system design and inference."] },
        { h: "How I write", p: ["Simple explanation first. Then the architecture, then the math, then working code. If I can't explain a system simply, I don't understand it yet."] },
      ],
      links: [["Medium", "https://athtripathi.medium.com/"], ["TutorialsPoint", "https://www.tutorialspoint.com/authors/ath-tripathi"], ["YouTube", "https://youtube.com/@TeachMeAth"]],
    },
  };

  ui.total.textContent = B.length;
  const RING_R = 37;
  let THREE, renderer, scene, camera, bike, inky, wheels = [], lean, headSpot;
  let active = false, visible = false, started = false, ready = false;
  let mode = "ride"; // ride | entering | inside
  const keys = { up: 0, down: 0, left: 0, right: 0, brake: 0 };
  const st = { x: -19.5, z: 0, h: Math.PI, v: 0, steer: 0, pedal: 0 };
  const visited = new Set();
  let near = null, inside = null;

  window.loadThree().then((T) => { THREE = T; return document.fonts ? document.fonts.ready : null; }).then(init).catch((e) => console.warn("city unavailable", e));

  /* ---------- textures ---------- */
  function windowsTex(seed, lit, job) {
    const c = document.createElement("canvas"); c.width = 128; c.height = 256;
    const g = c.getContext("2d");
    g.fillStyle = job ? "#18131a" : "#1c0b0f"; g.fillRect(0, 0, 128, 256);
    let s = seed;
    const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    if (job) {
      // office: long horizontal window bands
      for (let y = 10; y < 250; y += 22) {
        g.fillStyle = "#2a2028"; g.fillRect(4, y, 120, 12);
        for (let x = 6; x < 122; x += 12) if (r() < lit) { g.fillStyle = r() < 0.6 ? "#cfe0f0" : "#ffcf8a"; g.fillRect(x, y + 2, 10, 8); }
      }
    } else {
      for (let y = 8; y < 248; y += 16)
        for (let x = 8; x < 120; x += 16) {
          const on = r() < lit;
          g.fillStyle = on ? (r() < 0.7 ? "#ffcf8a" : "#efe3d3") : "#2b1418";
          g.fillRect(x, y, 9, 10);
        }
    }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }
  const KICK = { project: "THE BUILDS  ·  PROJECT", award: "★  ACHIEVEMENT  ★", job: "CAREER NOTICE  ·  ROLE" };
  function labelTex(b) {
    const c = document.createElement("canvas"); c.width = 1024; c.height = 400;
    const g = c.getContext("2d");
    const grd = g.createLinearGradient(0, 0, 0, 400);
    const cols = { project: ["#7a1424", "#4a0b15"], award: ["#2a1a10", "#140c08"], job: ["#2a2030", "#141018"] }[b.type];
    grd.addColorStop(0, cols[0]); grd.addColorStop(1, cols[1]);
    g.fillStyle = grd; g.fillRect(0, 0, 1024, 400);
    g.strokeStyle = "#c9a46a"; g.lineWidth = 8; g.strokeRect(14, 14, 996, 372);
    g.lineWidth = 2; g.strokeRect(30, 30, 964, 340);
    g.fillStyle = "#c9a46a"; g.textAlign = "center";
    g.font = '500 30px "IBM Plex Mono", monospace';
    g.fillText(KICK[b.type], 512, 90);
    g.fillStyle = "#efe3d3";
    let fs = 132;
    g.font = `900 ${fs}px "Playfair Display", serif`;
    while (g.measureText(b.title).width > 900 && fs > 50) { fs -= 6; g.font = `900 ${fs}px "Playfair Display", serif`; }
    g.fillText(b.title, 512, 225);
    g.font = 'italic 500 42px "Playfair Display", serif';
    g.fillStyle = "#e6c9a6";
    g.fillText(b.sub, 512, 310);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    return t;
  }
  function emblemTex() {
    const c = document.createElement("canvas"); c.width = c.height = 1024;
    const g = c.getContext("2d");
    g.translate(512, 512);
    g.strokeStyle = "rgba(201,164,106,.8)"; g.lineWidth = 10;
    g.beginPath(); g.arc(0, 0, 470, 0, 7); g.stroke();
    g.lineWidth = 3; g.beginPath(); g.arc(0, 0, 430, 0, 7); g.stroke();
    g.fillStyle = "rgba(239,227,211,.9)"; g.textAlign = "center";
    g.font = '600 220px "Grenze Gotisch", serif'; g.fillText("Ath", 0, 60);
    g.font = '500 44px "IBM Plex Mono", monospace'; g.fillStyle = "rgba(201,164,106,.9)";
    g.fillText("THE ATH TIMES · CITY DESK", 0, 150);
    g.fillText("RIDE TO A GLOWING DOOR", 0, -150);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  /* ---------- building factories ---------- */
  function makeProject(b, i, grp, job) {
    const { w, d, h } = b;
    const tex = windowsTex(17 + i * 31, job ? 0.55 : 0.5, job);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(Math.max(1, w / 7), h / 10);
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: tex, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.55, roughness: job ? 0.3 : 0.6, metalness: job ? 0.3 : 0 });
    const roof = new THREE.MeshStandardMaterial({ color: job ? 0x221a24 : 0x2a1015 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), [mat, mat, roof, mat, mat, mat]);
    body.position.y = h / 2; body.castShadow = body.receiveShadow = true; grp.add(body);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(body.geometry), new THREE.LineBasicMaterial({ color: job ? 0x8aa0b4 : 0xc33a50, transparent: true, opacity: 0.6 }));
    edges.position.copy(body.position); grp.add(edges);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(w + 0.6, 0.5, d + 0.6), new THREE.MeshStandardMaterial({ color: job ? 0x2a2030 : 0x4a0b15 }));
    cap.position.y = h + 0.25; grp.add(cap);
    if (job) {
      // entrance canopy + rooftop water tank
      const can = new THREE.Mesh(new THREE.BoxGeometry(4, 0.25, 2), new THREE.MeshStandardMaterial({ color: 0xc9a46a, metalness: 0.7, roughness: 0.3 }));
      can.position.set(0, 3.3, d / 2 + 1); grp.add(can);
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1.6, 16), new THREE.MeshStandardMaterial({ color: 0x3a2a30 }));
      tank.position.set(-w / 4, h + 1.3, -d / 4); grp.add(tank);
    } else if (h > 18) {
      // spire on the biggest builds
      const sp = new THREE.Mesh(new THREE.ConeGeometry(0.5, 5, 8), new THREE.MeshStandardMaterial({ color: 0xc9a46a, metalness: 0.8, roughness: 0.25 }));
      sp.position.set(w / 2 - 1, h + 3, -d / 2 + 1); grp.add(sp);
      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 8), new THREE.MeshBasicMaterial({ color: 0xff5a6e }));
      tip.position.set(w / 2 - 1, h + 5.6, -d / 2 + 1); grp.add(tip);
    }
    const door = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 3), new THREE.MeshBasicMaterial({ color: 0xffcf8a }));
    door.position.set(0, 1.5, d / 2 + 0.01); grp.add(door);
    return { roofY: h + 0.5, front: d / 2, radius: Math.max(w, d) * 0.6 + 0.8, signW: Math.min(11, w + 2) };
  }
  function makeAward(b, grp) {
    const s = b.s, hall = new THREE.Group(); hall.scale.setScalar(s); grp.add(hall);
    const w = 8, d = 6, h = 5;
    const stone = new THREE.MeshStandardMaterial({ color: 0x3a2620, roughness: 0.8 });
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), stone);
    m.position.y = h / 2; m.castShadow = m.receiveShadow = true; hall.add(m);
    const steps = new THREE.Mesh(new THREE.BoxGeometry(w + 1, 0.4, d + 1.4), new THREE.MeshStandardMaterial({ color: 0x4a3328 }));
    steps.position.set(0, 0.2, 0.3); steps.receiveShadow = true; hall.add(steps);
    const colMat = new THREE.MeshStandardMaterial({ color: 0xefe3d3, roughness: 0.5 });
    for (let k = 0; k < 4; k++) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, h, 14), colMat);
      col.position.set(-3 + k * 2, h / 2, d / 2 + 0.6); col.castShadow = true; hall.add(col);
    }
    const slab = new THREE.Mesh(new THREE.BoxGeometry(w + 0.8, 0.5, d + 1.6), new THREE.MeshStandardMaterial({ color: 0x4a3328 }));
    slab.position.set(0, h + 0.25, 0.3); hall.add(slab);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(2.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xc9a46a, metalness: 0.85, roughness: 0.25 }));
    dome.position.y = h + 0.5; dome.castShadow = true; hall.add(dome);
    const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.5), new THREE.MeshBasicMaterial({ color: 0xffd28a }));
    star.position.y = h + 3.6; hall.add(star);
    b.star = star;
    const door = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 2.6), new THREE.MeshBasicMaterial({ color: 0xffcf8a }));
    door.position.set(0, 1.7, d / 2 + 0.01); hall.add(door);
    return { roofY: (h + 3) * s, front: (d / 2 + 1) * s, radius: 5 * s, signW: 9 * Math.min(s, 1.15) };
  }

  /* ---------- init ---------- */
  function init() {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d0607);
    scene.fog = new THREE.Fog(0x0d0607, 32, 105);
    camera = new THREE.PerspectiveCamera(55, 16 / 9, 0.1, 220);
    camera.position.set(0, 30, 52);

    scene.add(new THREE.HemisphereLight(0xffd9c0, 0x1a0508, 0.7));
    const moon = new THREE.DirectionalLight(0xffe2c8, 1.1);
    moon.position.set(25, 45, 15); moon.castShadow = true;
    moon.shadow.mapSize.set(2048, 2048);
    Object.assign(moon.shadow.camera, { left: -65, right: 65, top: 65, bottom: -65, near: 1, far: 130 });
    scene.add(moon);
    const glow = new THREE.PointLight(0xc33a50, 60, 40); glow.position.set(0, 8, 0); scene.add(glow);

    const ground = new THREE.Mesh(new THREE.CircleGeometry(130, 64), new THREE.MeshStandardMaterial({ color: 0x170a0d, roughness: 0.95 }));
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
    const grid = new THREE.GridHelper(260, 130, 0x2a1418, 0x1f0e12); grid.position.y = 0.01; scene.add(grid);
    const road = new THREE.Mesh(new THREE.RingGeometry(16, 23, 128), new THREE.MeshStandardMaterial({ color: 0x241417, roughness: 0.85 }));
    road.rotation.x = -Math.PI / 2; road.position.y = 0.02; road.receiveShadow = true; scene.add(road);
    const dashMat = new THREE.MeshBasicMaterial({ color: 0xc9a46a });
    for (let i = 0; i < 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      const dsh = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.02, 1.1), dashMat);
      dsh.position.set(Math.cos(a) * 19.5, 0.04, Math.sin(a) * 19.5); dsh.rotation.y = -a; scene.add(dsh);
    }
    const plaza = new THREE.Mesh(new THREE.CircleGeometry(10, 64), new THREE.MeshStandardMaterial({ color: 0x2a1418, roughness: 0.7 }));
    plaza.rotation.x = -Math.PI / 2; plaza.position.y = 0.03; plaza.receiveShadow = true; scene.add(plaza);
    const emblem = new THREE.Mesh(new THREE.PlaneGeometry(17, 17), new THREE.MeshBasicMaterial({ map: emblemTex(), transparent: true }));
    emblem.rotation.set(-Math.PI / 2, 0, -Math.PI / 2); emblem.position.y = 0.05; scene.add(emblem);

    const roller = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 5, 32), new THREE.MeshStandardMaterial({ color: 0x7a1424, metalness: 0.5, roughness: 0.35 }));
    roller.rotation.z = Math.PI / 2; roller.position.y = 3.2; roller.castShadow = true; scene.add(roller);
    for (const x of [-2.8, 2.8]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.4, 3.4, 0.9), new THREE.MeshStandardMaterial({ color: 0xc9a46a, metalness: 0.7, roughness: 0.3 }));
      leg.position.set(x, 1.7, 0); leg.castShadow = true; scene.add(leg);
    }
    scene.userData.roller = roller;

    const pathMat = new THREE.MeshStandardMaterial({ color: 0x2a161a, roughness: 0.8 });
    B.forEach((b, i) => {
      const a = (i / B.length) * Math.PI * 2;
      const grp = new THREE.Group();
      scene.add(grp);
      const info = b.type === "award" ? makeAward(b, grp) : makeProject(b, i, grp, b.type === "job");
      // push big footprints a little further out so fronts line up
      const R = RING_R + info.front - 3;
      const x = Math.cos(a) * R, z = Math.sin(a) * R;
      grp.position.set(x, 0, z);
      grp.rotation.y = Math.atan2(-x, -z);

      const sign = new THREE.Mesh(new THREE.PlaneGeometry(info.signW, info.signW * 0.39), new THREE.MeshBasicMaterial({ map: labelTex(b), side: THREE.DoubleSide }));
      sign.position.set(0, info.roofY + 1.2 + info.signW * 0.2, Math.min(1, info.front * 0.3));
      grp.add(sign);
      for (const sx of [-info.signW * 0.35, info.signW * 0.35]) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.4, 6), new THREE.MeshStandardMaterial({ color: 0x2a1215 }));
        post.position.set(sx, info.roofY + 0.6, sign.position.z); grp.add(post);
      }
      const markLocal = new THREE.Vector3(0, 0, info.front + 3.6);
      const path = new THREE.Mesh(new THREE.PlaneGeometry(3, 3.6), pathMat);
      path.rotation.x = -Math.PI / 2; path.position.set(0, 0.03, info.front + 1.8); grp.add(path);
      const col = { project: 0xc33a50, award: 0xc9a46a, job: 0x8aa0b4 }[b.type];
      const mk = new THREE.Mesh(new THREE.RingGeometry(1.3, 1.65, 40), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.9, side: THREE.DoubleSide }));
      mk.rotation.x = -Math.PI / 2; mk.position.copy(markLocal).setY(0.06); grp.add(mk);
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 7, 32, 1, true), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
      beam.position.copy(markLocal).setY(3.5); grp.add(beam);
      grp.updateMatrixWorld();
      b.marker = grp.localToWorld(markLocal.clone());
      b.door = grp.localToWorld(new THREE.Vector3(0, 1.6, info.front));
      b.center = new THREE.Vector2(x, z);
      b.radius = info.radius;
      b.mk = mk; b.beam = beam; b.angle = a;
    });

    const poleMat = new THREE.MeshStandardMaterial({ color: 0x2a1215, metalness: 0.5 });
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffe0b0 });
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2 + 0.12;
      const r = i % 2 ? 24.2 : 14.8;
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 4.4, 8), poleMat);
      pole.position.set(Math.cos(a) * r, 2.2, Math.sin(a) * r); pole.castShadow = true; scene.add(pole);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 10), bulbMat);
      bulb.position.set(pole.position.x, 4.5, pole.position.z); scene.add(bulb);
    }
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x2b1a16 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x5a1a26, roughness: 0.8, flatShading: true });
    for (let i = 0; i < 60; i++) {
      const a = Math.random() * Math.PI * 2, r = 52 + Math.random() * 22;
      const s = 0.8 + Math.random() * 1.2;
      const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.15 * s, 0.2 * s, 1.4 * s, 6), trunkMat);
      tr.position.set(Math.cos(a) * r, 0.7 * s, Math.sin(a) * r); scene.add(tr);
      const lf = new THREE.Mesh(new THREE.ConeGeometry(1.1 * s, 2.6 * s, 7), leafMat);
      lf.position.set(tr.position.x, 2.6 * s, tr.position.z); lf.castShadow = true; scene.add(lf);
    }
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 + 0.3;
      const lf = new THREE.Mesh(new THREE.IcosahedronGeometry(0.9, 0), leafMat);
      lf.position.set(Math.cos(a) * 12.3, 1.6, Math.sin(a) * 12.3); lf.castShadow = true; scene.add(lf);
      const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 1.2, 6), trunkMat);
      tr.position.set(lf.position.x, 0.6, lf.position.z); scene.add(tr);
    }
    const pageMat = new THREE.MeshBasicMaterial({ color: 0xefe3d3, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
    const pages = [];
    for (let i = 0; i < 24; i++) {
      const p = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.05), pageMat);
      p.userData = { a: Math.random() * 6.28, r: 10 + Math.random() * 45, y: 8 + Math.random() * 20, s: 0.05 + Math.random() * 0.1 };
      scene.add(p); pages.push(p);
    }
    scene.userData.pages = pages;

    buildBike();
    size();
    addEventListener("resize", size);
    ready = true;
    drawMap();
    new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (!visible && active) pause("Bike parked while you were reading. Hop back on?");
    }, { threshold: 0.15 }).observe(stage);
    requestAnimationFrame(loop);
  }

  function tube(a, b, r, mat) {
    const dir = new THREE.Vector3().subVectors(b, a);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, dir.length(), 10), mat);
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    m.castShadow = true;
    return m;
  }
  function buildBike() {
    bike = new THREE.Group();
    lean = new THREE.Group(); bike.add(lean);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xc33a50, metalness: 0.6, roughness: 0.3 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x0d0607, roughness: 0.9 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xc9a46a, metalness: 0.8, roughness: 0.25 });
    const V = (x, y, z) => new THREE.Vector3(x, y, z);
    const rear = V(0, 0.45, -0.8), front = V(0, 0.45, 0.85), seat = V(0, 1.12, -0.3), headT = V(0, 1.2, 0.55), bb = V(0, 0.5, 0);
    [[rear, seat], [seat, bb], [bb, rear], [seat, headT], [headT, bb], [headT, front]].forEach(([a, b]) => lean.add(tube(a, b, 0.045, frameMat)));
    lean.add(tube(V(0, 1.2, 0.55), V(0, 1.45, 0.5), 0.04, goldMat));
    lean.add(tube(V(-0.45, 1.45, 0.5), V(0.45, 1.45, 0.5), 0.035, goldMat));
    const seatM = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.07, 0.42), darkMat); seatM.position.set(0, 1.18, -0.3); lean.add(seatM);
    const basket = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.32, 0.5), new THREE.MeshStandardMaterial({ color: 0x4a2a1e, roughness: 0.9 }));
    basket.position.set(0, 1.3, 1.0); lean.add(basket);
    const papersM = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, 0.4), new THREE.MeshStandardMaterial({ color: 0xefe3d3 }));
    papersM.position.set(0, 1.5, 1.0); papersM.rotation.z = 0.1; lean.add(papersM);
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 10), new THREE.MeshBasicMaterial({ color: 0xfff1d6 }));
    lamp.position.set(0, 1.25, 1.3); lean.add(lamp);
    headSpot = new THREE.SpotLight(0xffe7c4, 60, 30, 0.55, 0.5, 1.2);
    headSpot.position.set(0, 1.3, 1.3);
    const tgt = new THREE.Object3D(); tgt.position.set(0, 0, 9); lean.add(tgt); headSpot.target = tgt;
    lean.add(headSpot);
    for (const p of [rear, front]) {
      const holder = new THREE.Group(); holder.position.copy(p); lean.add(holder);
      const spin = new THREE.Group(); holder.add(spin);
      const tire = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.07, 12, 36), darkMat);
      tire.rotation.y = Math.PI / 2; tire.castShadow = true; spin.add(tire);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.015, 6, 36), goldMat); rim.rotation.y = Math.PI / 2; spin.add(rim);
      for (let k = 0; k < 4; k++) {
        const sp = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.72, 0.015), goldMat);
        sp.rotation.x = (k * Math.PI) / 4; spin.add(sp);
      }
      wheels.push(spin);
    }
    inky = window.makeInky(THREE);
    inky.group.scale.setScalar(0.82);
    inky.group.position.set(0, 1.18 - 0.42 * 0.82, -0.35);
    lean.add(inky.group);
    const blob = new THREE.Mesh(new THREE.CircleGeometry(1.1, 24), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35, depthWrite: false }));
    blob.rotation.x = -Math.PI / 2; blob.scale.set(0.6, 1.4, 1); blob.position.y = 0.05; bike.add(blob);
    scene.add(bike);
    bike.position.set(st.x, 0, st.z);
  }

  function size() {
    if (!renderer) return;
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }

  /* ---------- enter / leave a building ---------- */
  function posterHTML(b) {
    let d, isProject = b.type === "project";
    if (isProject) d = window.Reader && window.Reader.data[b.id];
    else d = POSTERS[b.id];
    if (!d) d = { kicker: b.type, title: b.title, deck: b.text, meta: [], body: [] };
    const label = { project: "Project", award: "Achievement", job: "Career" }[b.type];
    const flow = d.flow ? `<div class="rd-flow poster-flow">${d.flow.map((f, k) => `${k ? '<span class="rd-arrow"><i></i></span>' : ""}<div class="rd-node" style="--d:${k * 0.35}s"><b>${esc(f[0])}</b><span>${esc(f[1])}</span></div>`).join("")}</div>` : "";
    const body = (d.body || []).map((s) => {
      const ps = (s.p || []).map((x) => `<p>${esc(x)}</p>`).join("");
      const list = s.list ? `<ul>${s.list.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : "";
      const code = s.code ? `<pre><code>${esc(s.code)}</code></pre>` : "";
      return s.call ? `<section class="ps ps-call"><h3>${esc(s.call)}</h3>${ps}${list}</section>` : `<section class="ps"><h3>${esc(s.h)}</h3>${ps}${list}${code}</section>`;
    }).join("");
    const links = (d.links || []).map(([l, u]) => `<a class="mono" href="${u}" target="_blank" rel="noopener">${esc(l)} ↗</a>`).join("");
    return `
      <div class="poster-top mono"><span>The Ath Times · Wall poster</span><span class="poster-tag poster-${b.type}">${label}</span></div>
      <div class="poster-head">
        <div class="kicker mono">${esc(d.kicker)}</div>
        <h2 class="poster-title">${esc(d.title)}</h2>
        <p class="poster-deck">${esc(d.deck)}</p>
      </div>
      <dl class="poster-meta">${(d.meta || []).map(([k, v]) => `<div><dt class="mono">${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
      ${flow}
      <div class="poster-body">${body}</div>
      <div class="poster-foot">${isProject ? `<button class="btn" type="button" data-log="${b.id}"><span>Open the full build log</span></button>` : ""}${links}</div>
      <div class="poster-sign blackletter">Ath</div>`;
  }
  function enter(b) {
    if (!b || mode !== "ride") return;
    mode = "entering"; inside = b;
    st.v = 0; Object.keys(keys).forEach((k) => (keys[k] = 0));
    plaque.hidden = true;
    const from = camera.position.clone();
    const to = new THREE.Vector3(b.door.x, 1.7, b.door.z);
    const look = new THREE.Vector3(b.door.x, 1.6, b.door.z);
    const ahead = to.clone().add(to.clone().sub(new THREE.Vector3(b.marker.x, 1.7, b.marker.z)).setLength(2));
    const o = { t: 0 };
    const step = () => {
      camera.position.lerpVectors(from, to, o.t);
      camera.lookAt(look.clone().lerp(ahead, o.t));
    };
    const done = () => {
      mode = "inside";
      poster.innerHTML = posterHTML(b);
      poster.scrollTop = 0;
      roomName.textContent = "Inside: " + b.title;
      room.hidden = false;
      stage.classList.add("in-room");
      if (window.gsap) {
        gsap.fromTo(fade, { opacity: 1 }, { opacity: 0, duration: 0.6 });
        gsap.fromTo(".room-3d", { scale: 1.25 }, { scale: 1, duration: 1, ease: "expo.out" });
        gsap.fromTo(poster, { rotateX: -18, y: 60, opacity: 0, transformPerspective: 1400, transformOrigin: "50% 0%" }, { rotateX: 0, y: 0, opacity: 1, duration: 0.9, delay: 0.15, ease: "expo.out" });
        gsap.from(poster.querySelectorAll(".poster-head > *, .poster-meta, .poster-flow, .ps"), { y: 24, opacity: 0, stagger: 0.05, delay: 0.35, duration: 0.6, ease: "power3.out" });
      } else fade.style.opacity = 0;
      poster.focus({ preventScroll: true });
      badge("enter", "Open House", "Walked into one of Ath's buildings");
      badge("in-" + b.id, "Read the poster", "Inside " + b.title);
    };
    if (window.gsap) {
      gsap.to(o, { t: 1, duration: 0.9, ease: "power2.in", onUpdate: step });
      gsap.to(fade, { opacity: 1, duration: 0.35, delay: 0.6, onComplete: done });
    } else { o.t = 1; step(); done(); }
  }
  function leave() {
    if (mode !== "inside") return;
    const b = inside;
    room.hidden = true;
    stage.classList.remove("in-room");
    // step back out onto the doorstep, facing the plaza
    st.x = b.marker.x + Math.cos(b.angle) * -1.5;
    st.z = b.marker.z + Math.sin(b.angle) * -1.5;
    st.h = Math.atan2(-Math.cos(b.angle), -Math.sin(b.angle));
    camera.position.set(st.x + Math.cos(b.angle) * 3, 4, st.z + Math.sin(b.angle) * 3);
    if (window.gsap) gsap.fromTo(fade, { opacity: 1 }, { opacity: 0, duration: 0.6 });
    else fade.style.opacity = 0;
    mode = "ride"; inside = null; near = null;
    stage.focus({ preventScroll: true });
  }
  poster.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-log]");
    if (btn && window.Reader) window.Reader.open(btn.dataset.log);
  });
  $("roomExit").addEventListener("click", leave);

  /* ---------- controls ---------- */
  const keyMap = { ArrowUp: "up", w: "up", W: "up", ArrowDown: "down", s: "down", S: "down", ArrowLeft: "left", a: "left", A: "left", ArrowRight: "right", d: "right", D: "right", " ": "brake" };
  // capture phase: runs before the build-log reader's own Escape handler
  addEventListener("keydown", (e) => {
    if (!active || (window.Reader && window.Reader.isOpen)) return;
    if (mode === "inside") {
      if (e.key === "Escape" || e.key === "Backspace") { e.preventDefault(); leave(); }
      return;
    }
    if (mode !== "ride") return;
    if (e.key === "Escape") { pause("Parked. Hop back on whenever you like."); return; }
    if (e.key === "Enter" && near) { e.preventDefault(); enter(near); return; }
    const k = keyMap[e.key];
    if (k) { keys[k] = 1; e.preventDefault(); }
  }, true);
  addEventListener("keyup", (e) => { const k = keyMap[e.key]; if (k) keys[k] = 0; });
  stage.querySelectorAll(".city-touch button").forEach((btn) => {
    const k = btn.dataset.k;
    btn.addEventListener("pointerdown", (e) => { e.preventDefault(); keys[k] = 1; });
    ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => btn.addEventListener(ev, () => (keys[k] = 0)));
  });
  function start() {
    if (!ready) return;
    active = true; started = true;
    overlay.classList.add("hide");
    stage.classList.add("riding");
    stage.focus({ preventScroll: true });
    if (window.__lenis) window.__lenis.scrollTo(stage, { offset: -(innerHeight - stage.offsetHeight) / 2, duration: 0.8 });
    else stage.scrollIntoView({ block: "center", behavior: "smooth" });
    badge("ride", "Paperboy", "Took Inky's bike for a ride");
  }
  function pause(msg) {
    if (mode === "inside") leave();
    active = false;
    Object.keys(keys).forEach((k) => (keys[k] = 0));
    stage.classList.remove("riding");
    overlay.classList.remove("hide");
    $("cityMsg").innerHTML = msg;
    startBtn.querySelector("span").textContent = "Keep riding";
  }
  window.__city = { st, B, get mode() { return mode; } }; // handy for debugging / tests
  startBtn.addEventListener("click", start);
  exitBtn.addEventListener("click", () => pause("Parked. Hop back on whenever you like."));
  plq.b.addEventListener("click", () => near && enter(near));

  /* ---------- loop ---------- */
  let last = performance.now(), orbit = 0;
  function loop(now) {
    requestAnimationFrame(loop);
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    if (!visible || !ready || mode === "inside") return;
    const t = now / 1000;

    if (active && mode === "ride" && !(window.Reader && window.Reader.isOpen)) physics(dt);
    else st.v *= 0.9;

    bike.position.set(st.x, 0, st.z);
    bike.rotation.y = st.h;
    const sp = Math.min(Math.abs(st.v) / 14, 1);
    lean.rotation.z += (-st.steer * sp * 0.38 - lean.rotation.z) * 0.15;
    wheels.forEach((w) => (w.rotation.x += (st.v * dt) / 0.42));
    st.pedal += st.v * dt * 1.6;
    inky.update(t, dt, { riding: true, pedal: st.pedal, lookX: st.steer * 0.4, lookY: 0 });

    const fx = Math.sin(st.h), fz = Math.cos(st.h);
    if (mode === "ride") {
      if (started) {
        const back = 7.5 + sp * 2;
        const tx = st.x - fx * back, tz = st.z - fz * back, ty = 3.6 + sp * 0.6;
        const k = 1 - Math.exp(-4 * dt);
        camera.position.x += (tx - camera.position.x) * k;
        camera.position.y += (ty - camera.position.y) * k;
        camera.position.z += (tz - camera.position.z) * k;
        camera.lookAt(st.x + fx * 3, 1.3, st.z + fz * 3);
        const fov = 55 + sp * 12;
        if (Math.abs(camera.fov - fov) > 0.05) { camera.fov = fov; camera.updateProjectionMatrix(); }
      } else {
        orbit += dt * 0.08;
        camera.position.set(Math.cos(orbit) * 34, 46, Math.sin(orbit) * 34);
        camera.lookAt(0, 0, 0);
      }
    }

    scene.userData.roller.rotation.x = t * 0.6;
    scene.userData.pages.forEach((p) => {
      const u = p.userData; u.a += u.s * dt;
      p.position.set(Math.cos(u.a) * u.r, u.y + Math.sin(t + u.r) * 0.8, Math.sin(u.a) * u.r);
      p.rotation.set(t * u.s * 6, u.a, t * 0.3);
    });
    B.forEach((b, i) => {
      const pulse = 0.5 + Math.sin(t * 3 + i) * 0.5;
      b.mk.scale.setScalar(1 + pulse * 0.15);
      b.beam.material.opacity = 0.08 + pulse * 0.1 + (b === near ? 0.2 : 0);
      if (b.star) b.star.rotation.y = t * 1.5;
    });

    if (mode === "ride") proximity();
    if (active) { ui.speed.textContent = Math.round(Math.abs(st.v) * 3.6); drawMap(); }
    renderer.render(scene, camera);
  }

  function physics(dt) {
    const MAX = 14;
    if (keys.up) st.v += 11 * dt;
    else if (keys.down) st.v -= (st.v > 0 ? 18 : 6) * dt;
    else st.v *= 1 - 0.9 * dt;
    if (keys.brake) st.v *= 1 - 4 * dt;
    st.v = Math.max(-4, Math.min(MAX, st.v));
    const target = (keys.left ? 1 : 0) - (keys.right ? 1 : 0);
    st.steer += (target - st.steer) * Math.min(1, dt * 8);
    st.h += st.steer * dt * 1.9 * Math.max(-1, Math.min(1, st.v / 5));
    st.x += Math.sin(st.h) * st.v * dt;
    st.z += Math.cos(st.h) * st.v * dt;
    for (const b of B) {
      const dx = st.x - b.center.x, dz = st.z - b.center.y;
      const d = Math.hypot(dx, dz), R = b.radius;
      if (d < R) { st.x = b.center.x + (dx / d) * R; st.z = b.center.y + (dz / d) * R; st.v *= 0.6; }
    }
    { const d = Math.hypot(st.x, st.z); if (d < 3.6) { st.x *= 3.6 / d; st.z *= 3.6 / d; st.v *= 0.6; } }
    const r = Math.hypot(st.x, st.z);
    if (r > 56) { st.x *= 56 / r; st.z *= 56 / r; st.v *= 0.5; }
  }

  function proximity() {
    let best = null, bd = 4.2;
    for (const b of B) {
      const d = Math.hypot(st.x - b.marker.x, st.z - b.marker.z);
      if (d < bd) { bd = d; best = b; }
    }
    if (best !== near) {
      near = best;
      if (near) {
        plq.k.textContent = { project: "Project", award: "Achievement", job: "Career" }[near.type] + " · on the doorstep";
        plq.t.textContent = near.title;
        plq.p.textContent = near.text;
        plaque.hidden = false;
        if (window.gsap) gsap.fromTo(plaque, { y: 30, rotateX: -60, opacity: 0, transformPerspective: 800 }, { y: 0, rotateX: 0, opacity: 1, duration: 0.5, ease: "back.out(1.6)" });
        if (!visited.has(near.id)) {
          visited.add(near.id);
          near.mk.material.color.set(0xefe3d3);
          ui.visited.textContent = visited.size;
          if (visited.size === 5) badge("city5", "Beat Courier", "Visited five buildings");
          if (visited.size === B.length) { badge("cityall", "City Editor", "Visited every building in Ath's city"); window.Scene && window.Scene.burst(); }
        }
      } else plaque.hidden = true;
    }
  }

  function drawMap() {
    const g = mapCv.getContext("2d"), W = mapCv.width, c = W / 2, s = (W / 2 - 8) / 56;
    g.clearRect(0, 0, W, W);
    g.fillStyle = "rgba(13,6,7,.8)"; g.beginPath(); g.arc(c, c, c - 2, 0, 7); g.fill();
    g.strokeStyle = "rgba(201,164,106,.6)"; g.lineWidth = 1; g.stroke();
    g.strokeStyle = "rgba(90,43,51,.9)"; g.lineWidth = 7 * s * 0.9; g.beginPath(); g.arc(c, c, 19.5 * s, 0, 7); g.stroke();
    B.forEach((b) => {
      g.fillStyle = visited.has(b.id) ? "#efe3d3" : { project: "#c33a50", award: "#c9a46a", job: "#8aa0b4" }[b.type];
      const sz = 4 + b.radius * 0.9;
      g.fillRect(c + b.center.x * s - sz / 2, c + b.center.y * s - sz / 2, sz, sz);
    });
    g.save(); g.translate(c + st.x * s, c + st.z * s); g.rotate(-st.h);
    g.fillStyle = "#efe3d3"; g.beginPath(); g.moveTo(0, 6); g.lineTo(-4, -4); g.lineTo(4, -4); g.closePath(); g.fill();
    g.restore();
  }
})();
