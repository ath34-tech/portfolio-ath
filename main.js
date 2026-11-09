/* =========================================================
   THE TRIPATHI TIMES — interaction & scroll choreography
   ========================================================= */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasGSAP = typeof window.gsap !== "undefined";
  const S = window.Scene || { pointer: {}, burst() {}, spin() {} };

  /* ---------- date line ---------- */
  try {
    const d = new Date();
    $("#today").textContent = d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  } catch (e) {}

  /* ---------- text splitting ---------- */
  function split(el) {
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            const w = document.createElement("span");
            w.className = "w";
            [...part].forEach((ch) => {
              const c = document.createElement("span");
              c.className = "ch"; c.textContent = ch;
              w.appendChild(c);
            });
            frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    el.setAttribute("aria-label", el.textContent.trim());
    walk(el);
    $$(".ch", el).forEach((c) => c.setAttribute("aria-hidden", "true"));
  }
  $$(".split").forEach(split);
  const mast = $("#mast");
  split(mast);

  /* ---------- badges / achievements (the game layer) ---------- */
  const BADGES_KEY = "ttt-badges-v1";
  let badges = {};
  try { badges = JSON.parse(localStorage.getItem(BADGES_KEY) || "{}"); } catch (e) {}
  const toasts = $("#toasts");
  function award(id, title, sub) {
    if (badges[id]) return;
    badges[id] = title;
    try { localStorage.setItem(BADGES_KEY, JSON.stringify(badges)); } catch (e) {}
    renderBadges();
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = `<div class="t-ico">✦</div><div><span>Badge earned</span><b>${title}</b><span>${sub}</span></div>`;
    toasts.appendChild(t);
    if (hasGSAP) {
      gsap.fromTo(t, { y: -30, rotateX: -80, opacity: 0, transformPerspective: 600 }, { y: 0, rotateX: 0, opacity: 1, duration: 0.7, ease: "back.out(1.7)" });
      gsap.to(t, { y: -20, opacity: 0, duration: 0.5, delay: 3.4, onComplete: () => t.remove() });
    } else setTimeout(() => t.remove(), 3800);
  }
  function renderBadges() {
    const list = Object.values(badges);
    $("#hudBadges").textContent = list.length;
    $("#footBadges").textContent = list.length ? "Your press credentials: " + list.join(" · ") : "";
  }
  renderBadges();
  document.addEventListener("badge", (e) => award(e.detail.id, e.detail.title, e.detail.sub));

  /* ---------- stories read ---------- */
  const storyEls = $$("[data-story]");
  const read = new Set();
  $("#hudTotal").textContent = storyEls.length;
  const storyIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const name = en.target.dataset.story;
      if (read.has(name)) return;
      read.add(name);
      $("#hudRead").textContent = read.size;
      if (hasGSAP) gsap.fromTo("#hudRead", { scale: 1.8, color: "#efe3d3" }, { scale: 1, color: "#c9a46a", duration: 0.6 });
      if (read.size === 2) award("cub", "Cub Reporter", "You started reading the paper");
      if (read.size === Math.ceil(storyEls.length / 2)) award("beat", "Beat Reporter", "Half the edition read");
      if (read.size === storyEls.length) { award("eic", "Editor-in-Chief", "Every story, front to back"); S.burst(); }
    });
  }, { threshold: 0.3 });
  storyEls.forEach((el) => storyIO.observe(el));

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (!reduced && typeof window.Lenis !== "undefined") {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
    window.__lenis = lenis;
    if (hasGSAP) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      let target = null;
      try { target = $(a.getAttribute("href")); } catch (err) {}
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -40, duration: 1.6 });
      else target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    })
  );

  /* ---------- scroll → scene, HUD, nav ---------- */
  const nav = $("#topnav");
  const navLinks = $$(".nav-links a");
  let lastY = scrollY, vel = 0;
  function onScroll() {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? scrollY / max : 0;
    S.scroll = p;
    $("#hudPct").textContent = Math.round(p * 100) + "%";
    $("#hudBar").style.width = p * 100 + "%";
    nav.classList.toggle("show", scrollY > innerHeight * 0.6);
    if (p > 0.985) award("press", "Off the Press", "Reached the colophon");
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  // velocity sampler
  (function sample() {
    const y = scrollY;
    vel += (y - lastY - vel) * 0.25;
    lastY = y;
    S.velocity = vel;
    requestAnimationFrame(sample);
  })();
  // active nav
  const secIO = new IntersectionObserver((ens) => {
    ens.forEach((en) => {
      if (!en.isIntersecting) return;
      navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("#front, .section, .pressroom").forEach((s) => secIO.observe(s));

  /* ---------- pointer: scene, cursor ---------- */
  const dot = $(".cursor-dot"), ring = $(".cursor-ring"), label = $(".cursor-label");
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  addEventListener("pointermove", (e) => {
    mx = e.clientX; my = e.clientY;
    S.pointer.x = (mx / innerWidth) * 2 - 1;
    S.pointer.y = -((my / innerHeight) * 2 - 1);
    dot.style.transform = `translate3d(${mx}px,${my}px,0)`;
  }, { passive: true });
  if (finePointer) {
    (function follow() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      requestAnimationFrame(follow);
    })();
    const labels = { read: "Read", write: "Write", open: "Open", play: "Play", drag: "Tilt", spin: "Spin" };
    document.addEventListener("pointerover", (e) => {
      const t = e.target.closest("[data-cursor]");
      if (t) { label.textContent = labels[t.dataset.cursor] || ""; ring.classList.add("big"); }
      else if (e.target.closest("a, button, input, textarea")) { label.textContent = ""; ring.classList.add("big"); ring.style.background = "transparent"; ring.style.borderColor = "rgba(201,164,106,.8)"; }
    });
    document.addEventListener("pointerout", (e) => {
      const t = e.target.closest("[data-cursor], a, button, input, textarea");
      if (t && !t.contains(e.relatedTarget)) { ring.classList.remove("big"); ring.style.background = ""; ring.style.borderColor = ""; }
    });
  }

  /* ---------- project cards open their build log ---------- */
  $$("[data-project]").forEach((card) => {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", "Open build log: " + ($("h3", card) || card).textContent);
    card.addEventListener("click", (e) => {
      if (!e.target.closest(".read-more") && e.target.closest("a, input, label, .kvcalc")) return;
      window.Reader && window.Reader.open(card.dataset.project);
    });
    card.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && e.target === card) { e.preventDefault(); window.Reader && window.Reader.open(card.dataset.project); }
    });
  });

  /* ---------- 3D tilt cards ---------- */
  if (finePointer && !reduced) {
    $$(".tilt, .tilt-soft").forEach((el) => {
      const max = el.classList.contains("tilt-soft") ? 4 : el.classList.contains("story-lead") ? 6 : 10;
      let raf = 0;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.setProperty("--gx", x * 100 + "%");
        el.style.setProperty("--gy", y * 100 + "%");
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          // independent `rotate`/`translate` props so GSAP's `transform` tweens never collide
          const ax = (0.5 - y) * max, ay = (x - 0.5) * max, ang = Math.hypot(ax, ay);
          el.style.transition = "rotate .14s ease-out, translate .14s ease-out, border-color .4s";
          el.style.rotate = ang > 0.01 ? `${ax.toFixed(3)} ${ay.toFixed(3)} 0 ${ang.toFixed(2)}deg` : "none";
          el.style.translate = "0 0 16px";
        });
      });
      el.addEventListener("pointerleave", () => {
        cancelAnimationFrame(raf);
        el.style.transition = "rotate .9s cubic-bezier(.2,.8,.2,1), translate .9s cubic-bezier(.2,.8,.2,1), border-color .4s";
        el.style.rotate = "none";
        el.style.translate = "none";
      });
    });

    /* magnetic buttons */
    $$(".magnetic").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2);
        el.style.transition = "translate .15s ease-out, padding .4s, color .3s, border-color .3s";
        el.style.translate = `${x * 0.25}px ${y * 0.35}px`;
        const s = el.querySelector("span, b");
        if (s) s.style.translate = `${x * 0.12}px ${y * 0.15}px`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.transition = "translate .6s cubic-bezier(.2,.8,.2,1), padding .4s, color .3s, border-color .3s";
        el.style.translate = "none";
        const s = el.querySelector("span, b");
        if (s) s.style.translate = "none";
      });
    });

    /* masthead letters lean toward the pointer */
    const mastChars = $$(".ch", mast);
    addEventListener("pointermove", (e) => {
      if (scrollY > innerHeight) return;
      mastChars.forEach((c) => {
        const r = c.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy);
        const f = Math.max(0, 1 - d / 260);
        c.style.translate = f ? `${(-dx * f * 0.08).toFixed(1)}px ${(-dy * f * 0.12).toFixed(1)}px ${(f * 60).toFixed(1)}px` : "none";
        c.style.rotate = f ? `y ${(dx * f * 0.12).toFixed(1)}deg` : "none";
        c.style.color = f > 0.55 ? "#c33a50" : "";
      });
    }, { passive: true });
  }

  /* ---------- masthead spin easter egg ---------- */
  let spins = 0;
  mast.addEventListener("click", () => {
    spins++;
    S.spin();
    if (hasGSAP) gsap.fromTo($$(".ch", mast), { rotateX: 0 }, { rotateX: 360, duration: 1.1, stagger: 0.03, ease: "power3.inOut", clearProps: "rotateX" });
    if (spins === 1) award("spin", "Hot Off the Press", "You spun the masthead");
    if (spins === 5) award("spin5", "Press Operator", "Five spins. The rollers are warm.");
  });

  /* ---------- konami: ink storm ---------- */
  const seq = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let ki = 0;
  addEventListener("keydown", (e) => {
    if (e.target.matches("input, textarea")) return;
    ki = e.key.toLowerCase() === seq[ki].toLowerCase() ? ki + 1 : e.key === seq[0] ? 1 : 0;
    if (ki === seq.length) {
      ki = 0;
      S.burst(); S.spin();
      award("konami", "Ink Storm", "The secret press code");
      if (hasGSAP) gsap.fromTo("#paper", { x: -8 }, { x: 0, duration: 0.6, ease: "elastic.out(1, .2)", clearProps: "x" });
    }
  });

  /* ---------- letter to the editor ---------- */
  /* ---------- mail chooser ----------
     mailto: alone does nothing on machines without a default mail app,
     so every email action opens a chooser: Gmail, Outlook, mail app, or copy. */
  const EMAIL = "athtripathi@gmail.com";
  const mailer = $("#mailer");
  let mailCopyText = EMAIL, mailLastFocus = null;
  function openMailer({ subject = "Hello from your portfolio", body = "Hi Ath,\n\n", fromLetter = false } = {}) {
    const s = encodeURIComponent(subject), b = encodeURIComponent(body), to = encodeURIComponent(EMAIL);
    $("#mGmail").href = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${s}&body=${b}`;
    $("#mOutlook").href = `https://outlook.live.com/mail/0/deeplink/compose?to=${to}&subject=${s}&body=${b}`;
    $("#mDefault").href = `mailto:${EMAIL}?subject=${s}&body=${b}`;
    mailCopyText = fromLetter ? `To: ${EMAIL}\nSubject: ${subject}\n\n${body}` : EMAIL;
    $("#mCopyLbl").textContent = fromLetter ? "Copy the whole letter and address" : "Copy the address to paste anywhere";
    $("#mailerTitle").textContent = fromLetter ? "Your letter is sealed. How should it travel?" : "Write to Ath";
    $("#mailerSub").textContent = fromLetter
      ? `To ${EMAIL}. Pick an option and your subject and message will already be filled in. Just press send.`
      : `To ${EMAIL}. Pick how you'd like to write. A subject line is filled in for you.`;
    mailLastFocus = document.activeElement;
    mailer.hidden = false;
    if (lenis) lenis.stop();
    if (hasGSAP) gsap.fromTo(".mailer-card", { y: 40, rotateX: -30, opacity: 0, transformPerspective: 900 }, { y: 0, rotateX: 0, opacity: 1, duration: 0.55, ease: "back.out(1.5)" });
    $("#mGmail").focus({ preventScroll: true });
  }
  function closeMailer() {
    if (mailer.hidden) return;
    mailer.hidden = true;
    if (lenis) lenis.start();
    mailLastFocus && mailLastFocus.focus && mailLastFocus.focus({ preventScroll: true });
  }
  mailer.addEventListener("click", (e) => {
    if (e.target.closest("[data-mclose]")) closeMailer();
    else if (e.target.closest("#mGmail, #mOutlook, #mDefault")) { award("letter", "Correspondent", "You wrote to the editor"); setTimeout(closeMailer, 150); }
  });
  addEventListener("keydown", (e) => { if (e.key === "Escape") closeMailer(); });
  $("#mCopy").addEventListener("click", async () => {
    let ok = false;
    try { await navigator.clipboard.writeText(mailCopyText); ok = true; } catch (err) {
      const ta = document.createElement("textarea"); ta.value = mailCopyText; document.body.appendChild(ta); ta.select();
      try { ok = document.execCommand("copy"); } catch (e2) {}
      ta.remove();
    }
    $("#mCopyLbl").textContent = ok ? "Copied ✓ Paste it into any email" : EMAIL;
  });
  // every mailto link on the page goes through the chooser
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="mailto:"]');
    if (!a || a.closest("#mailer")) return;
    e.preventDefault();
    openMailer({ subject: "Hello from your portfolio", body: "Hi Ath,\n\n" });
  });

  $("#letterForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    const subject = f.subject.value.trim();
    const body = `${f.msg.value.trim()}\n\n— ${f.name.value.trim()}`;
    if (hasGSAP) gsap.fromTo(".wax", { scale: 2.2, rotate: -40, opacity: 0 }, { scale: 1, rotate: -12, opacity: 1, duration: 0.6, ease: "back.out(2)" });
    setTimeout(() => openMailer({ subject, body, fromLetter: true }), 450);
  });

  /* ---------- no GSAP? show everything and stop ---------- */
  if (!hasGSAP) { $("#loader").remove(); return; }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- ticker ---------- */
  const tMove = $(".ticker-move");
  tMove.innerHTML += tMove.innerHTML;
  const tick = gsap.to(tMove, { xPercent: -50, duration: 40, ease: "none", repeat: -1 });
  ScrollTrigger.create({
    onUpdate: (self) => {
      const v = self.getVelocity() / 300;
      gsap.to(tick, { timeScale: (self.direction > 0 ? 1 : -1) * Math.min(6, 1 + Math.abs(v)), duration: 0.2, overwrite: true });
      gsap.to(tick, { timeScale: self.direction > 0 ? 1 : -1, duration: 1.2, delay: 0.25 });
    },
  });

  /* ---------- loader → intro ---------- */
  const loadNum = $("#loadNum"), loadBar = $(".loader-bar span");
  const counter = { v: 0 };
  let sceneReady = !!S.ready;
  document.addEventListener("scene:ready", () => (sceneReady = true));
  if (lenis) lenis.stop();
  const loadTl = gsap.timeline();
  loadTl.from(".loader-mast", { rotateX: -90, opacity: 0, y: 40, transformPerspective: 800, duration: 1, ease: "power3.out" })
    .to(counter, {
      v: 100, duration: reduced ? 0.2 : 1.6, ease: "power2.inOut",
      onUpdate: () => { loadNum.textContent = Math.round(counter.v); loadBar.style.width = counter.v + "%"; },
    }, 0.2)
    .add(() => {
      const wait = () => (sceneReady || performance.now() > 6000 ? intro() : setTimeout(wait, 100));
      wait();
    });

  function intro() {
    const tl = gsap.timeline({ onComplete: () => { lenis && lenis.start(); ScrollTrigger.refresh(); } });
    tl.to("#loader", { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "power4.inOut" })
      .set("#loader", { display: "none" })
      .from(".dateline", { y: -20, opacity: 0, duration: 0.6 }, "-=0.3")
      .from($$(".ch", mast), {
        rotateX: -100, y: 80, z: -200, opacity: 0, transformPerspective: 700,
        duration: 1.1, stagger: { each: 0.035, from: "center" }, ease: "expo.out",
      }, "-=0.4")
      .from(".ear", { opacity: 0, y: 20, stagger: 0.1 }, "-=0.8")
      .from(".rule-double, .subnav", { scaleX: 0, transformOrigin: "50% 50%", duration: 0.8, ease: "power3.inOut" }, "-=0.8")
      .from("#headline .ch", {
        yPercent: 120, rotateX: -90, opacity: 0, transformPerspective: 600,
        duration: 0.9, stagger: 0.012, ease: "power4.out",
      }, "-=0.5")
      .from(".lead .kicker, .lead .deck, .lead .byline, .lead .cols-2, .cta-row", { y: 30, opacity: 0, stagger: 0.08, duration: 0.7 }, "-=0.6")
      .from(".side-box", { rotateY: -70, x: 60, opacity: 0, transformPerspective: 900, transformOrigin: "100% 50%", stagger: 0.12, duration: 1, ease: "power3.out" }, "-=0.9")
      .from(".hud, .ticker", { opacity: 0, y: 20, duration: 0.6 }, "-=0.6");
  }

  if (reduced) return;

  /* ---------- masthead peels away on scroll ---------- */
  gsap.to(".mast", {
    rotateX: 60, y: -60, z: -200, opacity: 0.2, transformOrigin: "50% 0%", ease: "none",
    scrollTrigger: { trigger: ".masthead", start: "top top", end: "40% top", scrub: true },
  });
  gsap.to(".front-grid", {
    rotateX: 14, y: -40, scale: 0.94, opacity: 0.3, transformOrigin: "50% 100%", transformPerspective: 1400, ease: "none",
    scrollTrigger: { trigger: ".front-grid", start: "60% 40%", end: "bottom top", scrub: true },
  });

  /* ---------- section titles: letters stand up ---------- */
  $$(".section .sec-title").forEach((t) => {
    gsap.from($$(".ch", t), {
      rotateX: -110, yPercent: 80, opacity: 0, transformPerspective: 600,
      stagger: 0.03, ease: "power3.out",
      scrollTrigger: { trigger: t, start: "top 90%", end: "top 55%", scrub: 0.8 },
    });
  });
  $$(".section-head").forEach((h) => {
    gsap.from(h, { borderTopColor: "rgba(239,227,211,0)", duration: 1.2, scrollTrigger: { trigger: h, start: "top 85%" } });
    gsap.from($$(".sec-deck, .sec-no", h), { opacity: 0, y: 20, stagger: 0.1, duration: 0.8, scrollTrigger: { trigger: h, start: "top 85%" } });
  });

  /* ---------- pages fold up into place ---------- */
  // cards fold up into place and always finish flat & full-height (no half-tilted scrub state)
  gsap.from(".story-lead", {
    rotateX: 40, y: 160, z: -300, opacity: 0, transformPerspective: 1600, transformOrigin: "50% 100%",
    duration: 1.3, ease: "expo.out", clearProps: "transform,opacity",
    scrollTrigger: { trigger: ".story-lead", start: "top 92%", toggleActions: "play none none reverse" },
  });
  $$(".story-grid .story").forEach((s, i) => {
    gsap.from(s, {
      rotateX: -55, rotateY: i % 2 ? 18 : -18, y: 140, z: -260, opacity: 0, transformPerspective: 1400, transformOrigin: "50% 0%",
      duration: 1.2, delay: (i % 2) * 0.12, ease: "expo.out", clearProps: "transform,opacity",
      scrollTrigger: { trigger: s, start: "top 94%", toggleActions: "play none none reverse" },
    });
  });
  gsap.from(".city-stage", {
    rotateX: 35, scale: 0.85, opacity: 0, transformPerspective: 1600, transformOrigin: "50% 100%",
    duration: 1.3, ease: "expo.out", clearProps: "transform,opacity",
    scrollTrigger: { trigger: ".city-stage", start: "top 90%", toggleActions: "play none none reverse" },
  });
  $$(".stamp").forEach((s) => {
    gsap.from(s, { scale: 3, rotate: -30, opacity: 0, duration: 0.5, ease: "back.out(2.5)", scrollTrigger: { trigger: s, start: "top 80%" } });
  });
  gsap.from(".ad", {
    rotateY: -90, opacity: 0, transformPerspective: 1200, transformOrigin: "0% 50%",
    stagger: { each: 0.1, grid: "auto", from: "start" }, duration: 1, ease: "power3.out",
    scrollTrigger: { trigger: ".classifieds", start: "top 75%" },
  });
  gsap.from(".col-card", {
    rotateX: 80, y: 80, opacity: 0, transformPerspective: 1000, transformOrigin: "50% 100%",
    stagger: 0.15, duration: 1.1, ease: "power3.out",
    scrollTrigger: { trigger: ".column-grid", start: "top 80%" },
  });
  gsap.from(".manifesto p", {
    clipPath: "inset(0 100% 0 0)", ease: "none",
    scrollTrigger: { trigger: ".manifesto", start: "top 85%", end: "top 45%", scrub: true },
  });
  gsap.from(".hon", { y: 60, rotateZ: (i) => (i % 2 ? 4 : -4), opacity: 0, stagger: 0.1, duration: 0.8, ease: "back.out(1.6)", scrollTrigger: { trigger: ".honours", start: "top 85%" } });
  gsap.from(".puzzle-box", { rotateY: (i) => (i ? 25 : -25), z: -200, opacity: 0, transformPerspective: 1400, duration: 1.2, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: ".puzzle-grid", start: "top 80%" } });
  gsap.from(".letter", { rotateX: 70, y: 120, opacity: 0, transformPerspective: 1400, transformOrigin: "50% 100%", ease: "none", scrollTrigger: { trigger: ".letter-grid", start: "top 100%", end: "top 55%", scrub: 1 } });
  gsap.from(".wire-link", { x: 80, opacity: 0, stagger: 0.08, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".wire", start: "top 80%" } });
  gsap.from(".foot-mast .ch, .foot-mast", { opacity: 0, y: 40, rotateX: -90, transformPerspective: 600, duration: 1, scrollTrigger: { trigger: ".colophon", start: "top 85%" } });

  /* ---------- counters ---------- */
  $$(".stat .num").forEach((n) => {
    const to = +n.dataset.to, o = { v: 0 };
    gsap.to(o, {
      v: to, duration: 2, ease: "power3.out",
      scrollTrigger: { trigger: n, start: "top 85%" },
      onUpdate: () => (n.textContent = Math.round(o.v)),
    });
  });
  gsap.from(".stat", { rotateX: -70, opacity: 0, transformPerspective: 900, transformOrigin: "50% 0%", stagger: 0.08, duration: 1, scrollTrigger: { trigger: ".stats", start: "top 80%" } });

  /* ---------- velocity skew ---------- */
  const skewTargets = $$(".story-grid, .classifieds, .stats, .column-grid");
  const skewSetters = skewTargets.map((t) => gsap.quickTo(t, "skewY", { duration: 0.5, ease: "power3" }));
  ScrollTrigger.create({
    onUpdate: (self) => {
      const v = gsap.utils.clamp(-2.5, 2.5, self.getVelocity() / -500);
      skewSetters.forEach((q) => q(v));
    },
  });
  ScrollTrigger.addEventListener("scrollEnd", () => skewSetters.forEach((q) => q(0)));
  gsap.ticker.add(() => { if (Math.abs(S.velocity || 0) < 0.5) skewSetters.forEach((q) => q(0)); });

  /* ---------- STOP THE PRESS fly-through ---------- */
  ScrollTrigger.create({
    trigger: "#flythrough", start: "top top", end: "bottom bottom", scrub: true,
    onUpdate: (self) => {
      const p = self.progress;
      S.warp = Math.sin(Math.min(p * 1.15, 1) * Math.PI) ** 1.2;
      if (p > 0.6) award("fly", "Stopped the Press", "You flew through the front page");
    },
    onLeave: () => (S.warp = 0), onLeaveBack: () => (S.warp = 0),
  });
  gsap.timeline({ scrollTrigger: { trigger: "#flythrough", start: "top 75%", end: "bottom bottom", scrub: 1 } })
    .fromTo("#flyText", { scale: 0.45, rotateX: 70, opacity: 0.15, letterSpacing: "0.5em", transformPerspective: 900 }, { scale: 1, rotateX: 0, opacity: 1, letterSpacing: "0em", duration: 0.3, ease: "power2.out" })
    .to("#flyText", { scale: 1.08, duration: 0.1 })
    .to("#flyText", { scale: 30, opacity: 0, duration: 0.6, ease: "power3.in" })
    .fromTo("#flySub", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.12 }, 0.25)
    .to("#flySub", { opacity: 0, duration: 0.12 }, 0.5);

  /* ---------- Press Room horizontal pin ---------- */
  const mm = gsap.matchMedia();
  mm.add("(min-width: 761px)", () => {
    const track = $("#prTrack");
    const plates = $$(".plate", track);
    const dist = () => track.scrollWidth - innerWidth + 80;
    const updatePlates = () => {
      const cx = innerWidth / 2;
      plates.forEach((p) => {
        const r = p.getBoundingClientRect();
        const d = (r.left + r.width / 2 - cx) / innerWidth; // -1..1
        gsap.set(p, { rotateY: d * -38, z: -Math.abs(d) * 260, y: Math.abs(d) * 30, opacity: 1 - Math.min(0.6, Math.abs(d) * 0.7) });
      });
    };
    const tw = gsap.to(track, {
      x: () => -dist(), ease: "none",
      scrollTrigger: {
        trigger: ".pressroom", start: "top top", end: () => "+=" + dist(), pin: ".pr-sticky", pinSpacing: true,
        scrub: 1, invalidateOnRefresh: true, onUpdate: updatePlates, onRefresh: updatePlates,
      },
    });
    updatePlates();
    return () => { tw.scrollTrigger && tw.scrollTrigger.kill(); tw.kill(); gsap.set(plates, { clearProps: "all" }); };
  });

  // refresh once fonts settle so pin distances are right
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
