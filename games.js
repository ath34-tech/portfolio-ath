/* =========================================================
   Games: crossword, the Typesetter arcade, KV-cache calculator
   Emits `badge` CustomEvents that main.js turns into achievements.
   ========================================================= */
(function () {
  const badge = (id, title, sub) => document.dispatchEvent(new CustomEvent("badge", { detail: { id, title, sub } }));

  /* ---------------- KV CACHE CALCULATOR ---------------- */
  (function kv() {
    const tok = document.getElementById("kvTok");
    if (!tok) return;
    const out = document.getElementById("kvOut"), unit = document.getElementById("kvUnit");
    const per = document.getElementById("kvPer"), meter = document.getElementById("kvMeter");
    const tokL = document.getElementById("kvTokL"), bytesL = document.getElementById("kvBytesL");
    const L = 36, H = 8, D = 128, MAXT = 40960;
    let bytes = 2, touched = false;
    function render() {
      const t = +tok.value;
      const perTok = 2 * L * H * D * bytes; // K and V
      const total = perTok * t;
      const gib = total / 1024 ** 3;
      if (gib >= 1) { out.textContent = gib.toFixed(2); unit.textContent = "GiB"; }
      else { out.textContent = (total / 1024 ** 2).toFixed(0); unit.textContent = "MiB"; }
      per.textContent = `${(perTok / 1024).toFixed(perTok % 1024 ? 1 : 0)} KiB / token`;
      tokL.textContent = t.toLocaleString("en-US");
      bytesL.textContent = bytes;
      meter.style.width = ((perTok * t) / (2 * L * H * D * 2 * MAXT)) * 100 + "%";
    }
    tok.addEventListener("input", () => {
      render();
      if (!touched) { touched = true; badge("kv", "Inference Correspondent", "You moved the KV-cache slider"); }
    });
    document.querySelectorAll(".kv-prec button").forEach((b) =>
      b.addEventListener("click", () => {
        document.querySelectorAll(".kv-prec button").forEach((x) => x.classList.remove("on"));
        b.classList.add("on");
        bytes = +b.dataset.b;
        render();
        if (bytes === 0.5) badge("quant", "Quantized", "Squeezed the cache to int4");
      })
    );
    render();
  })();

  /* ---------------- CROSSWORD ---------------- */
  (function crossword() {
    const el = document.getElementById("xw");
    if (!el) return;
    const ROWS = 11, COLS = 9;
    const words = [
      { n: 1, dir: "A", r: 0, c: 0, a: "FASTAPI", clue: "Python framework under RouteLLMESH and Bodh's backend" },
      { n: 4, dir: "A", r: 4, c: 2, a: "LIVEKIT", clue: "Self-hosted real-time rooms that carry Bodh's audio" },
      { n: 6, dir: "A", r: 6, c: 1, a: "GROQ", clue: "Fast inference provider that shows up in more than one of these builds" },
      { n: 7, dir: "A", r: 9, c: 3, a: "BODH", clue: "Hindi for “understanding”; the voice interviewer" },
      { n: 2, dir: "D", r: 0, c: 3, a: "TAURI", clue: "Rust shell around Pixie's React interface" },
      { n: 3, dir: "D", r: 0, c: 5, a: "PIXIE", clue: "The local desktop agent that launched on Product Hunt" },
      { n: 4, dir: "D", r: 4, c: 2, a: "LORA", clue: "Low-rank adapters, the fine-tuning trick from Paath.Live" },
      { n: 5, dir: "D", r: 4, c: 6, a: "KVCACHE", clue: "Memory an LLM keeps for past tokens, which got its own lab" },
    ];
    const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    const nums = {};
    words.forEach((w) => {
      nums[w.r + "," + w.c] = w.n;
      [...w.a].forEach((ch, i) => {
        const r = w.r + (w.dir === "D" ? i : 0), c = w.c + (w.dir === "A" ? i : 0);
        grid[r][c] = ch;
      });
    });
    const inputs = {};
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        const cell = document.createElement("div");
        cell.className = "cell" + (grid[r][c] ? "" : " void");
        if (grid[r][c]) {
          if (nums[r + "," + c]) { const s = document.createElement("sup"); s.textContent = nums[r + "," + c]; cell.appendChild(s); }
          const inp = document.createElement("input");
          inp.maxLength = 1; inp.dataset.r = r; inp.dataset.c = c;
          inp.setAttribute("aria-label", `Row ${r + 1} column ${c + 1}`);
          inp.autocomplete = "off"; inp.spellcheck = false;
          cell.appendChild(inp);
          inputs[r + "," + c] = inp;
        }
        el.appendChild(cell);
      }
    const ca = document.getElementById("cluesA"), cd = document.getElementById("cluesD");
    words.forEach((w) => {
      const li = document.createElement("li");
      li.innerHTML = `<b>${w.n}</b>${w.clue} (${w.a.length})`;
      w.li = li;
      li.addEventListener("click", () => { dir = w.dir; inputs[w.r + "," + w.c].focus(); });
      (w.dir === "A" ? ca : cd).appendChild(li);
    });

    let dir = "A", cur = null;
    const cellsOf = (w) => [...w.a].map((_, i) => inputs[(w.r + (w.dir === "D" ? i : 0)) + "," + (w.c + (w.dir === "A" ? i : 0))]);
    const wordAt = (r, c, d) => words.find((w) => w.dir === d && cellsOf(w).includes(inputs[r + "," + c]));
    function highlight() {
      Object.values(inputs).forEach((i) => i.parentNode.classList.remove("hl", "focus"));
      words.forEach((w) => w.li.classList.remove("on"));
      if (!cur) return;
      const r = +cur.dataset.r, c = +cur.dataset.c;
      let w = wordAt(r, c, dir);
      if (!w) { dir = dir === "A" ? "D" : "A"; w = wordAt(r, c, dir); }
      if (w) { cellsOf(w).forEach((i) => i.parentNode.classList.add("hl")); w.li.classList.add("on"); }
      cur.parentNode.classList.add("focus");
    }
    function move(step) {
      const r = +cur.dataset.r + (dir === "D" ? step : 0), c = +cur.dataset.c + (dir === "A" ? step : 0);
      const n = inputs[r + "," + c];
      if (n) n.focus();
    }
    let solved = false;
    function checkDone() {
      words.forEach((w) => w.li.classList.toggle("done", cellsOf(w).every((i, k) => i.value.toUpperCase() === w.a[k])));
      const all = Object.entries(inputs).every(([k, i]) => { const [r, c] = k.split(",").map(Number); return i.value.toUpperCase() === grid[r][c]; });
      if (all && !solved) {
        solved = true;
        document.getElementById("xwStatus").textContent = "Solved. The editor tips his hat.";
        Object.values(inputs).forEach((i) => i.parentNode.classList.add("good"));
        badge("xw", "Puzzle Editor", "You solved the Daily Crossword");
        window.Scene && window.Scene.burst();
      }
    }
    Object.values(inputs).forEach((inp) => {
      inp.addEventListener("focus", () => { if (cur === inp) return; cur = inp; highlight(); });
      inp.addEventListener("click", () => { if (cur === inp && document.activeElement === inp) { dir = dir === "A" ? "D" : "A"; highlight(); } });
      inp.addEventListener("input", () => {
        inp.value = inp.value.replace(/[^a-z]/gi, "").slice(-1).toUpperCase();
        inp.parentNode.classList.remove("bad");
        if (inp.value) move(1);
        checkDone();
      });
      inp.addEventListener("keydown", (e) => {
        const k = e.key;
        if (k === "Backspace" && !inp.value) { move(-1); e.preventDefault(); }
        else if (k === "ArrowRight" || k === "ArrowLeft") { dir = "A"; highlight(); move(k === "ArrowRight" ? 1 : -1); e.preventDefault(); }
        else if (k === "ArrowDown" || k === "ArrowUp") { dir = "D"; highlight(); move(k === "ArrowDown" ? 1 : -1); e.preventDefault(); }
      });
    });
    document.getElementById("xwCheck").addEventListener("click", () => {
      let wrong = 0, empty = 0;
      Object.entries(inputs).forEach(([k, i]) => {
        const [r, c] = k.split(",").map(Number);
        if (!i.value) empty++;
        else if (i.value !== grid[r][c]) { wrong++; i.parentNode.classList.add("bad"); }
      });
      document.getElementById("xwStatus").textContent = solved ? "Solved." : wrong ? `${wrong} letter${wrong > 1 ? "s" : ""} misprinted.` : `${empty} blank${empty === 1 ? "" : "s"} left.`;
    });
    document.getElementById("xwHint").addEventListener("click", () => {
      const open = Object.entries(inputs).filter(([k, i]) => { const [r, c] = k.split(",").map(Number); return i.value !== grid[r][c]; });
      if (!open.length) return;
      const [k, i] = open[(Math.random() * open.length) | 0];
      const [r, c] = k.split(",").map(Number);
      i.value = grid[r][c]; i.parentNode.classList.remove("bad");
      checkDone();
    });
  })();

  /* ---------------- THE TYPESETTER ---------------- */
  (function typesetter() {
    const cv = document.getElementById("game");
    if (!cv) return;
    const g = cv.getContext("2d");
    const W = cv.width, H = cv.height;
    const overlay = document.getElementById("gameOverlay"), msg = document.getElementById("gameMsg");
    const startBtn = document.getElementById("gameStart");
    const ui = { target: document.getElementById("gTarget"), set: document.getElementById("gSet"), ink: document.getElementById("gInk"), score: document.getElementById("gScore") };
    const TARGETS = ["SHIP IT", "HIRE ATH", "LOW LATENCY", "MODEL AUTO", "BARGE IN"];
    let state, running = false, raf = 0, keys = {};

    function reset(level = 0) {
      const target = TARGETS[level % TARGETS.length];
      state = { level, target, idx: 0, ink: 3, score: state ? state.score : 0, stick: W / 2, letters: [], t: 0, spawn: 0, splats: [], flash: 0 };
      skipSpaces();
      hud();
    }
    function skipSpaces() { while (state.target[state.idx] === " ") state.idx++; }
    function hud() {
      ui.target.textContent = state.target;
      ui.set.textContent = state.target.slice(0, state.idx).trim() || "—";
      ui.ink.textContent = "●".repeat(state.ink) + "○".repeat(Math.max(0, 3 - state.ink));
      ui.score.textContent = state.score;
    }
    function spawn() {
      const need = state.target[state.idx];
      const pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const ch = Math.random() < 0.42 ? need : pool[(Math.random() * 26) | 0];
      const speed = 70 + state.level * 18 + Math.random() * 40;
      state.letters.push({ ch, x: 30 + Math.random() * (W - 60), y: -20, v: speed, rot: (Math.random() - 0.5) * 0.6, vr: (Math.random() - 0.5) * 2 });
    }
    function loop(ts) {
      if (!running) return;
      const now = ts / 1000;
      const dt = Math.min(now - (state.last || now), 0.05);
      state.last = now;
      state.t += dt;
      state.spawn -= dt;
      if (state.spawn <= 0) { spawn(); state.spawn = Math.max(0.35, 0.85 - state.level * 0.08); }
      if (keys.ArrowLeft) state.stick -= 420 * dt;
      if (keys.ArrowRight) state.stick += 420 * dt;
      state.stick = Math.max(50, Math.min(W - 50, state.stick));

      const stickY = H - 34;
      for (const L of state.letters) {
        L.y += L.v * dt; L.rot += L.vr * dt;
        if (!L.dead && L.y > stickY - 14 && L.y < stickY + 10 && Math.abs(L.x - state.stick) < 50) {
          L.dead = true;
          if (L.ch === state.target[state.idx]) {
            state.idx++; state.score += 10 + state.level * 5; skipSpaces();
            state.flash = 0.25;
            if (state.idx >= state.target.length) return levelUp();
          } else {
            state.ink--; state.splats.push({ x: L.x, y: stickY, r: 4, a: 1 });
            if (state.ink <= 0) return gameOver();
          }
          hud();
        }
      }
      state.letters = state.letters.filter((L) => !L.dead && L.y < H + 30);
      draw(stickY);
      raf = requestAnimationFrame(loop);
    }
    function draw(stickY) {
      g.fillStyle = "#0d0607"; g.fillRect(0, 0, W, H);
      // rules like newsprint
      g.strokeStyle = "rgba(90,43,51,.5)"; g.lineWidth = 1;
      for (let x = W / 4; x < W; x += W / 4) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
      // set text preview
      g.font = '900 30px "Playfair Display", serif'; g.textAlign = "center";
      g.fillStyle = "rgba(239,227,211,.12)";
      g.fillText(state.target, W / 2, 52);
      g.fillStyle = "#c9a46a";
      const setText = state.target.slice(0, state.idx);
      const full = g.measureText(state.target).width;
      g.textAlign = "left";
      g.fillText(setText, W / 2 - full / 2, 52);
      // letters
      for (const L of state.letters) {
        g.save(); g.translate(L.x, L.y); g.rotate(L.rot);
        const want = L.ch === state.target[state.idx];
        g.fillStyle = "#efe3d3"; g.fillRect(-15, -17, 30, 34);
        g.fillStyle = want ? "#7a1424" : "#2a1215";
        g.font = '900 22px "Playfair Display", serif'; g.textAlign = "center"; g.textBaseline = "middle";
        g.fillText(L.ch, 0, 1);
        g.restore();
      }
      // splats
      for (const s of state.splats) { s.r += 1.2; s.a -= 0.02; g.fillStyle = `rgba(195,58,80,${Math.max(0, s.a)})`; g.beginPath(); g.arc(s.x, s.y, s.r, 0, 6.283); g.fill(); }
      state.splats = state.splats.filter((s) => s.a > 0);
      // stick
      state.flash = Math.max(0, state.flash - 0.016);
      g.fillStyle = state.flash ? "#c9a46a" : "#9e2236";
      g.fillRect(state.stick - 50, stickY, 100, 8);
      g.fillStyle = "#5a2b33"; g.fillRect(state.stick - 54, stickY + 8, 108, 4);
    }
    function levelUp() {
      running = false;
      cancelAnimationFrame(raf);
      badge("type" + state.level, state.level ? `Typesetter, Grade ${state.level + 1}` : "Typesetter", `Set “${state.target}”`);
      window.Scene && window.Scene.burst();
      msg.textContent = `“${state.target}” is set. Next headline?`;
      startBtn.querySelector("span").textContent = "Next edition";
      overlay.classList.remove("hide");
      state.nextLevel = state.level + 1;
    }
    function gameOver() {
      running = false;
      cancelAnimationFrame(raf);
      msg.textContent = `Out of ink at ${state.score} points. The press waits for no one.`;
      startBtn.querySelector("span").textContent = "Reink & retry";
      overlay.classList.remove("hide");
      state.nextLevel = 0; state.score = 0;
      hud();
    }
    function start() {
      if (state && state.resume) {
        state.resume = false; state.nextLevel = 0;
        overlay.classList.add("hide");
        running = true; state.last = 0;
        raf = requestAnimationFrame(loop);
        return;
      }
      const lvl = state && state.nextLevel ? state.nextLevel : 0;
      if (!lvl && state) state.score = 0;
      reset(lvl);
      overlay.classList.add("hide");
      running = true;
      state.last = 0;
      raf = requestAnimationFrame(loop);
    }
    startBtn.addEventListener("click", start);
    const setFromPointer = (e) => {
      if (!state) return;
      const r = cv.getBoundingClientRect();
      state.stick = ((e.clientX - r.left) / r.width) * W;
    };
    cv.addEventListener("pointermove", setFromPointer);
    cv.addEventListener("pointerdown", setFromPointer);
    cv.style.touchAction = "none";
    addEventListener("keydown", (e) => {
      if (!running) return;
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") { keys[e.key] = true; e.preventDefault(); }
    });
    addEventListener("keyup", (e) => { keys[e.key] = false; });
    // pause when the arcade scrolls out of view
    new IntersectionObserver(([en]) => {
      if (!en.isIntersecting && running) { running = false; cancelAnimationFrame(raf); msg.textContent = "Paused while you were reading."; startBtn.querySelector("span").textContent = "Resume"; state.nextLevel = state.level; state.resume = true; overlay.classList.remove("hide"); }
    }).observe(cv);

    // idle attract frame
    reset(0);
    draw(H - 34);
  })();
})();
