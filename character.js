/* =========================================================
   INKY — the Times' 3D press-bot mascot.
   window.makeInky(THREE) → { group, update(t, dt, state) }
   Also boots the hero "front-page photograph" renderer.
   ========================================================= */
(function () {
  const THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
  window.loadThree = () => (window.__three ||= import(THREE_URL));

  function paperTexture(THREE) {
    const c = document.createElement("canvas");
    c.width = 128; c.height = 160;
    const g = c.getContext("2d");
    g.fillStyle = "#efe3d3"; g.fillRect(0, 0, 128, 160);
    g.fillStyle = "#2a1215"; g.fillRect(8, 8, 112, 3);
    g.font = '600 24px "Grenze Gotisch", serif'; g.textAlign = "center";
    g.fillText("Ath Times", 64, 34);
    g.fillRect(8, 40, 112, 2);
    g.fillStyle = "#7a1424"; g.fillRect(8, 48, 60, 40);
    g.fillStyle = "rgba(42,18,21,.55)";
    for (let y = 50; y < 152; y += 6) g.fillRect(y < 92 ? 74 : 8, y, y < 92 ? 46 : 112, 2);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  window.makeInky = function (THREE) {
    const M = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.1, ...o });
    const maroon = M(0x8a1a2c, { roughness: 0.45 });
    const maroonDark = M(0x4a0b15, { roughness: 0.6 });
    const cream = M(0xefe3d3, { roughness: 0.55 });
    const dark = M(0x120708, { roughness: 0.15, metalness: 0.4 });
    const gold = M(0xc9a46a, { metalness: 0.7, roughness: 0.3 });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffd28a });
    const bulbMat = new THREE.MeshStandardMaterial({ color: 0xc33a50, emissive: 0xc33a50, emissiveIntensity: 1.5 });

    const group = new THREE.Group();
    const root = new THREE.Group();
    group.add(root);

    // torso + details
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.34, 0.3, 8, 20), maroon);
    torso.position.y = 0.78; root.add(torso);
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.05, 8, 24), cream);
    collar.rotation.x = Math.PI / 2; collar.position.y = 1.08; root.add(collar);
    const badge = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.025, 24), gold);
    badge.rotation.x = Math.PI / 2; badge.position.set(0.15, 0.9, 0.32); root.add(badge);
    for (let i = 0; i < 3; i++) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 8), gold);
      b.position.set(0, 0.95 - i * 0.14, 0.345 - i * 0.004); root.add(b);
    }
    const strap = new THREE.Mesh(new THREE.TorusGeometry(0.37, 0.025, 6, 40), M(0x2a1215));
    strap.rotation.set(0.1, 0, 0.75); strap.position.y = 0.8; root.add(strap);
    const bag = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.26, 0.14), M(0x3a1f24, { roughness: 0.8 }));
    bag.position.set(-0.32, 0.5, 0.14); bag.rotation.z = 0.15; root.add(bag);
    const bagPapers = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.12, 0.09), cream);
    bagPapers.position.set(-0.33, 0.66, 0.14); bagPapers.rotation.z = 0.2; root.add(bagPapers);

    // head
    const head = new THREE.Group(); head.position.y = 1.36; root.add(head);
    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.42, 36, 28), cream);
    skull.scale.set(1.15, 0.95, 1); head.add(skull);
    const visor = new THREE.Mesh(new THREE.SphereGeometry(0.34, 36, 28), dark);
    visor.scale.set(1.12, 0.72, 0.55); visor.position.set(0, -0.02, 0.2); head.add(visor);
    const eyes = [];
    for (const x of [-0.13, 0.13]) {
      const e = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 12), eyeMat);
      e.scale.set(1, 1.35, 0.4); e.position.set(x, 0.0, 0.385); head.add(e); eyes.push(e);
    }
    const smile = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 6, 16, Math.PI), eyeMat);
    smile.rotation.z = Math.PI; smile.position.set(0, -0.11, 0.37); head.add(smile);
    for (const x of [-0.5, 0.5]) {
      const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.08, 20), gold);
      ear.rotation.z = Math.PI / 2; ear.position.set(x, 0, 0); head.add(ear);
    }
    // newsboy cap
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.45, 32, 14, 0, Math.PI * 2, 0, Math.PI / 2), maroonDark);
    cap.scale.set(1.18, 0.55, 1.08); cap.position.y = 0.16; head.add(cap);
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.505, 0.505, 0.06, 36, 1, true), M(0x2a1215));
    band.scale.set(1.04, 1, 0.93); band.position.y = 0.17; head.add(band);
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.03, 24, 1, false, -Math.PI / 2, Math.PI), maroonDark);
    brim.scale.set(1.25, 1, 1); brim.position.set(0, 0.15, 0.36); brim.rotation.x = 0.12; head.add(brim);
    const capBtn = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), gold);
    capBtn.position.y = 0.41; head.add(capBtn);
    const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.28, 8), gold);
    ant.position.set(0.22, 0.44, -0.05); ant.rotation.z = -0.35; head.add(ant);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 14, 12), bulbMat);
    bulb.position.set(0.27, 0.57, -0.05); head.add(bulb);

    // arms (pivot at shoulders)
    function arm(side) {
      const pivot = new THREE.Group();
      pivot.position.set(0.4 * side, 1.0, 0);
      const a = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.3, 6, 12), maroon);
      a.position.y = -0.22; pivot.add(a);
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), cream);
      hand.position.y = -0.44; pivot.add(hand);
      pivot.rotation.z = 0.18 * side;
      root.add(pivot);
      return { pivot, hand };
    }
    const armL = arm(1), armR = arm(-1);
    const paper = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.38, 0.015), new THREE.MeshStandardMaterial({ map: paperTexture(THREE), roughness: 0.8 }));
    paper.position.set(0.05, -0.5, 0.1); paper.rotation.set(-0.2, 0.3, 0.15);
    armL.pivot.add(paper);

    // legs (pivot at hips)
    function leg(side) {
      const pivot = new THREE.Group();
      pivot.position.set(0.15 * side, 0.42, 0);
      const l = new THREE.Mesh(new THREE.CapsuleGeometry(0.085, 0.2, 6, 12), maroonDark);
      l.position.y = -0.16; pivot.add(l);
      const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.1, 0.26), dark);
      shoe.position.set(0, -0.34, 0.05); pivot.add(shoe);
      root.add(pivot);
      return pivot;
    }
    const legL = leg(1), legR = leg(-1);

    group.traverse((o) => { if (o.isMesh) o.castShadow = true; });

    const s = { lookX: 0, lookY: 0, wave: 0, jump: 0, blinkT: 2, riding: false, pedal: 0 };
    function update(t, dt, input = {}) {
      Object.assign(s, input);
      // blink
      s.blinkT -= dt;
      const blink = s.blinkT < 0.12 ? Math.abs(Math.cos((s.blinkT / 0.12) * Math.PI)) : 1;
      if (s.blinkT < 0) s.blinkT = 2 + Math.random() * 3;
      eyes.forEach((e) => (e.scale.y = 1.35 * Math.max(0.08, blink)));
      bulbMat.emissiveIntensity = 1 + Math.sin(t * 4) * 0.8;
      ant.rotation.x = Math.sin(t * 3) * 0.1;

      head.rotation.y += (s.lookX * 0.7 - head.rotation.y) * 0.12;
      head.rotation.x += (-s.lookY * 0.35 - head.rotation.x) * 0.12;
      head.rotation.z = Math.sin(t * 1.3) * 0.04;

      if (s.riding) {
        root.position.y = Math.sin(t * 10) * 0.01;
        root.rotation.x = 0.18;
        const p = s.pedal;
        legL.rotation.x = -1.35 + Math.sin(p) * 0.45;
        legR.rotation.x = -1.35 - Math.sin(p) * 0.45;
        armL.pivot.rotation.set(-1.15, 0, 0.12);
        armR.pivot.rotation.set(-1.15, 0, -0.12);
        paper.visible = false;
      } else {
        s.jump *= 0.92;
        root.position.y = Math.sin(t * 2) * 0.035 + Math.sin(Math.min(s.jump, 1) * Math.PI) * 0.35 * (s.jump > 0.05 ? 1 : 0);
        root.rotation.x = 0;
        legL.rotation.x = Math.sin(t * 2) * 0.05;
        legR.rotation.x = -Math.sin(t * 2) * 0.05;
        armL.pivot.rotation.set(-0.35 + Math.sin(t * 2) * 0.05, 0, 0.22);
        s.wave *= 0.985;
        const w = Math.min(s.wave, 1);
        armR.pivot.rotation.set(Math.sin(t * 2 + 1) * 0.06 * (1 - w), 0, -0.18 - w * (2.5 + Math.sin(t * 14) * 0.35));
        paper.visible = true;
      }
    }
    return { group, update, state: s };
  };

  /* ---------------- hero photograph ---------------- */
  const canvas = document.getElementById("inkyCanvas");
  if (!canvas) return;
  const stage = document.getElementById("inkyStage");
  const bubble = document.getElementById("bubble");
  const lines = [
    "Hi! I'm Inky. I deliver Ath's builds. Click me.",
    "Click any project card to read how Ath built it.",
    "There's a whole city further down. You can ride my bike through it!",
    "Psst: every crossword answer is part of Ath's stack.",
    "Ath is looking for Applied AI and LLM engineering roles.",
    "RouteLLMESH picks the model. I just pick the route.",
    "Try ↑↑↓↓←→←→BA. Don't tell the editor.",
  ];
  let li = 0;

  window.loadThree().then((THREE) => {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    camera.position.set(0, 1.25, 5.2);
    camera.lookAt(0, 0.95, 0);

    scene.add(new THREE.HemisphereLight(0xffe8d0, 0x2a0a10, 1.1));
    const key = new THREE.DirectionalLight(0xffe1c2, 2.2); key.position.set(2, 3, 3); scene.add(key);
    const rim = new THREE.PointLight(0xc33a50, 12, 10); rim.position.set(-1.8, 1.8, -1.5); scene.add(rim);
    const rim2 = new THREE.PointLight(0xc9a46a, 6, 10); rim2.position.set(1.8, 0.4, -1.2); scene.add(rim2);

    const inky = window.makeInky(THREE);
    scene.add(inky.group);

    // pedestal
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.82, 0.12, 48), new THREE.MeshStandardMaterial({ color: 0x1d0d10, roughness: 0.4, metalness: 0.3 }));
    ped.position.y = -0.06; scene.add(ped);
    const ringM = new THREE.MeshBasicMaterial({ color: 0xc9a46a });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.012, 8, 80), ringM);
    ring.rotation.x = Math.PI / 2; ring.position.y = 0.005; scene.add(ring);

    // orbiting mini newspapers
    const papers = [];
    const pMat = new THREE.MeshStandardMaterial({ map: paperTexture(THREE), side: THREE.DoubleSide, roughness: 0.8 });
    for (let i = 0; i < 4; i++) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.33), pMat);
      m.userData.a = (i / 4) * Math.PI * 2;
      scene.add(m); papers.push(m);
    }

    function size() {
      const w = stage.clientWidth, h = stage.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    size(); addEventListener("resize", size);

    let lookX = 0, lookY = 0, visible = true, last = performance.now();
    addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      lookX = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / 500));
      lookY = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height * 0.35)) / -400));
    }, { passive: true });

    function say(text) {
      bubble.textContent = text;
      bubble.classList.remove("pop"); void bubble.offsetWidth; bubble.classList.add("pop");
    }
    stage.addEventListener("click", () => {
      inky.state.wave = 1.6; inky.state.jump = 1;
      li = (li + 1) % lines.length; say(lines[li]);
      document.dispatchEvent(new CustomEvent("badge", { detail: { id: "inky", title: "Met Inky", sub: "Said hi to the press bot" } }));
    });
    setInterval(() => { if (visible && !document.hidden) { inky.state.wave = 1.2; } }, 9000);

    new IntersectionObserver(([en]) => (visible = en.isIntersecting)).observe(stage);

    (function loop(now) {
      requestAnimationFrame(loop);
      if (!visible) { last = now; return; }
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      const t = now / 1000;
      inky.update(t, dt, { lookX, lookY });
      inky.group.rotation.y += (lookX * 0.35 - inky.group.rotation.y) * 0.05;
      papers.forEach((p, i) => {
        const a = p.userData.a + t * 0.5;
        p.position.set(Math.cos(a) * 1.15, 1.0 + Math.sin(t * 1.3 + i) * 0.25, Math.sin(a) * 0.7);
        p.rotation.set(Math.sin(t + i) * 0.4, -a + Math.PI / 2, Math.cos(t * 0.8 + i) * 0.3);
      });
      ring.rotation.z = t * 0.2;
      renderer.render(scene, camera);
    })(performance.now());
  });
})();
