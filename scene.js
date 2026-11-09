/* =========================================================
   3D press-room scene — Three.js (loaded as an ES module from CDN
   via dynamic import so the site also works from file://)
   Public API: window.Scene = { scroll, warp, pointer, burst(), spin() }
   ========================================================= */
(function () {
  const API = (window.Scene = {
    scroll: 0,          // 0..1 page progress
    warp: 0,            // 0..1 flythrough intensity
    velocity: 0,        // scroll velocity (signed, smoothed by caller)
    pointer: { x: 0, y: 0 },
    ready: false,
    burst() { API._burst = 1; },
    spin() { API._burst = Math.max(API._burst, 0.5); },
    _burst: 0,
    _spin: 0,
  });

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = matchMedia("(max-width: 760px)").matches;
  const canvas = document.getElementById("scene");
  if (!canvas) return;

  const fontsReady = Promise.race([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise((r) => setTimeout(r, 2500)),
  ]);

  Promise.all([import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"), fontsReady])
    .then(([THREE]) => init(THREE))
    .catch((e) => {
      console.warn("3D scene unavailable:", e);
      document.dispatchEvent(new Event("scene:ready"));
    });

  function init(THREE) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
    renderer.setSize(innerWidth, innerHeight, false);
    renderer.setClearColor(0x0d0607, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 120);
    camera.position.set(0, 0, 9);

    const DEPTH = 72; // world units the camera travels over the whole page

    /* ---------- newspaper textures ---------- */
    const heads = [
      ["The Ath Times", "ATH SHIPS AN LLM ROUTER"],
      ["The Ath Times", "ATH'S VOICE AGENT LEARNS TO LISTEN"],
      ["The Ath Times", "PIXIE RUNS ON YOUR LAPTOP"],
      ["The Ath Times", "KV CACHE: 144 KIB PER TOKEN"],
      ["The Ath Times", "ATH TURNS PAPERS INTO CODE"],
    ];
    function rnd(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
    function makePage(i) {
      const W = 512, H = 680;
      const c = document.createElement("canvas");
      c.width = W; c.height = H;
      const g = c.getContext("2d");
      const r = rnd(1000 + i * 77);
      g.fillStyle = "#1d0f12"; g.fillRect(0, 0, W, H);
      // paper fibres
      for (let k = 0; k < 1400; k++) {
        g.fillStyle = `rgba(239,227,211,${r() * 0.035})`;
        g.fillRect(r() * W, r() * H, 1 + r() * 2, 1);
      }
      const ink = "rgba(239,227,211,0.78)";
      g.fillStyle = ink;
      g.fillRect(28, 26, W - 56, 4);
      g.font = '600 62px "Grenze Gotisch", serif';
      g.textAlign = "center";
      g.fillText(heads[i % heads.length][0], W / 2, 92);
      g.fillRect(28, 108, W - 56, 3); g.fillRect(28, 115, W - 56, 1);
      g.font = '500 11px "IBM Plex Mono", monospace';
      g.fillStyle = "rgba(201,164,106,.9)";
      g.fillText("ATH TRIPATHI  ·  VOL. XXII  ·  APPLIED AI EDITION", W / 2, 132);
      // headline
      g.fillStyle = ink;
      g.font = '900 34px "Playfair Display", serif';
      g.textAlign = "left";
      const words = heads[i % heads.length][1].split(" ");
      let line = "", y = 178;
      for (const w of words) {
        const t = line ? line + " " + w : w;
        if (g.measureText(t).width > W - 64) { g.fillText(line, 30, y); line = w; y += 38; } else line = t;
      }
      g.fillText(line, 30, y);
      y += 22;
      // image block
      const imgW = W * 0.52, imgH = 170;
      const grd = g.createRadialGradient(30 + imgW * 0.35, y + 60, 10, 30 + imgW * 0.5, y + 80, imgW * 0.7);
      grd.addColorStop(0, "#c33a50"); grd.addColorStop(1, "#3a0911");
      g.fillStyle = grd; g.fillRect(30, y, imgW, imgH);
      g.fillStyle = "rgba(13,6,7,.75)";
      for (let yy = y; yy < y + imgH; yy += 6)
        for (let xx = 30; xx < 30 + imgW; xx += 6) {
          g.beginPath(); g.arc(xx + 3, yy + 3, 1.2 + r() * 1.2, 0, 6.283); g.fill();
        }
      // body columns
      const cols = [[30 + imgW + 16, W - 30, y, y + imgH], [30, W / 2 - 10, y + imgH + 18, H - 30], [W / 2 + 10, W - 30, y + imgH + 18, H - 30]];
      for (const [x0, x1, y0, y1] of cols) {
        for (let yy = y0; yy < y1; yy += 9) {
          const len = (x1 - x0) * (0.75 + r() * 0.25);
          g.fillStyle = `rgba(239,227,211,${0.18 + r() * 0.16})`;
          g.fillRect(x0, yy, r() < 0.08 ? len * 0.4 : len, 3);
        }
      }
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      return tex;
    }
    const textures = heads.map((_, i) => makePage(i));

    /* ---------- sheets ---------- */
    const sheetVS = `
      uniform float uTime; uniform float uSeed; uniform float uWave;
      varying vec2 vUv; varying float vShade; varying float vDepth;
      void main(){
        vUv = uv;
        vec3 p = position;
        float a = p.x*1.6 + uTime*1.1 + uSeed;
        float b = p.y*1.2 + uTime*.7 + uSeed*1.7;
        float curl = .07 + uWave*.05;
        p.z += sin(a)*.13*uWave + sin(b)*.09*uWave + p.x*p.x*curl;
        float dzdx = cos(a)*1.6*.13*uWave + 2.*p.x*curl;
        float dzdy = cos(b)*1.2*.09*uWave;
        vShade = clamp(.78 - dzdx*.35 + dzdy*.25, .35, 1.25);
        vec4 mv = modelViewMatrix * vec4(p,1.);
        vDepth = -mv.z;
        gl_Position = projectionMatrix * mv;
      }`;
    const sheetFS = `
      uniform sampler2D uTex; uniform float uOpacity;
      varying vec2 vUv; varying float vShade; varying float vDepth;
      void main(){
        vec4 t = texture2D(uTex, vUv);
        vec3 col = t.rgb * vShade;
        col += vec3(.48,.08,.14) * (1.-vShade) * .25;           // maroon in the shadows
        float edge = smoothstep(0.,.015,vUv.x)*smoothstep(1.,.985,vUv.x)*smoothstep(0.,.012,vUv.y)*smoothstep(1.,.988,vUv.y);
        float fade = smoothstep(34., 10., vDepth) * smoothstep(1.2, 4., vDepth);
        gl_FragColor = vec4(col, uOpacity * fade * edge);
      }`;

    const sheetCount = mobile ? 14 : 24;
    const geo = new THREE.PlaneGeometry(2.4, 3.2, 28, 28);
    const sheets = [];
    for (let i = 0; i < sheetCount; i++) {
      const mat = new THREE.ShaderMaterial({
        vertexShader: sheetVS, fragmentShader: sheetFS,
        uniforms: {
          uTex: { value: textures[i % textures.length] },
          uTime: { value: 0 }, uSeed: { value: i * 1.37 }, uWave: { value: 1 },
          uOpacity: { value: 0.62 },
        },
        transparent: true, side: THREE.DoubleSide, depthWrite: false,
      });
      const m = new THREE.Mesh(geo, mat);
      const ang = i * 2.1;
      const rad = 4.2 + (i % 3) * 1.2;
      const base = {
        x: Math.cos(ang) * rad,
        y: 1.5 - (i / sheetCount) * (DEPTH + 6),
        z: Math.sin(ang) * rad * 0.6 - 3,
        rx: (Math.random() - 0.5) * 0.9, ry: (Math.random() - 0.5) * 1.6, rz: (Math.random() - 0.5) * 0.8,
        spin: 0.08 + Math.random() * 0.12,
      };
      // keep the centre of the viewport clear for text
      if (Math.abs(base.x) < 3.2) base.x = Math.sign(base.x || 1) * (3.2 + Math.random() * 1.5);
      m.userData = base;
      m.position.set(base.x, base.y, base.z);
      scene.add(m);
      sheets.push(m);
    }

    scene.add(new THREE.AmbientLight(0x4a1a22, 1.2));
    const key = new THREE.PointLight(0xffd7b0, 40, 30); key.position.set(4, 4, 6); scene.add(key);
    const rim = new THREE.PointLight(0xc33a50, 60, 30); rim.position.set(-4, -2, 3); scene.add(rim);

    /* ---------- ink particles ---------- */
    const pCount = mobile ? 700 : 1600;
    const pos = new Float32Array(pCount * 3), seed = new Float32Array(pCount), col = new Float32Array(pCount * 3);
    const palette = [new THREE.Color(0xc33a50), new THREE.Color(0xc9a46a), new THREE.Color(0xefe3d3), new THREE.Color(0x7a1424)];
    for (let i = 0; i < pCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = 6 - Math.random() * (DEPTH + 14);
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16 - 2;
      seed[i] = Math.random();
      const c = palette[(Math.random() * (Math.random() < 0.6 ? 2 : 4)) | 0];
      col.set([c.r, c.g, c.b], i * 3);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    pGeo.setAttribute("aCol", new THREE.BufferAttribute(col, 3));
    const pMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uBurst: { value: 0 }, uPR: { value: renderer.getPixelRatio() }, uWarp: { value: 0 }, uCam: { value: new THREE.Vector3() } },
      vertexShader: `
        attribute float aSeed; attribute vec3 aCol;
        uniform float uTime, uBurst, uPR, uWarp; uniform vec3 uCam;
        varying vec3 vCol; varying float vA;
        void main(){
          vec3 p = position;
          p.y += mod(uTime*(.15+aSeed*.35) , 6.) - 3.;
          p.x += sin(uTime*.4 + aSeed*20.)*.4;
          vec3 dir = normalize(p - uCam + vec3(.0001));
          p += dir * uBurst * (4. + aSeed*10.);
          p.z += uWarp * aSeed * 6.;
          vec4 mv = modelViewMatrix * vec4(p,1.);
          gl_PointSize = (8. + aSeed*18.) * uPR * (1. + uBurst*1.5) / -mv.z;
          gl_Position = projectionMatrix * mv;
          vCol = aCol; vA = smoothstep(30.,4.,-mv.z) * (.35 + aSeed*.65);
        }`,
      fragmentShader: `
        varying vec3 vCol; varying float vA;
        void main(){
          float d = length(gl_PointCoord-.5);
          float a = smoothstep(.5,.0,d);
          gl_FragColor = vec4(vCol, a*vA*.8);
        }`,
    });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    /* ---------- loop ---------- */
    const clock = new THREE.Clock();
    const camTarget = new THREE.Vector3();
    let camY = 0, px = 0, py = 0, warpS = 0, velS = 0, orbSpin = 0;

    function frame() {
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      px += (API.pointer.x - px) * 0.06;
      py += (API.pointer.y - py) * 0.06;
      warpS += (API.warp - warpS) * 0.08;
      velS += (API.velocity - velS) * 0.1;

      const targetY = -API.scroll * DEPTH;
      camY += (targetY - camY) * (reduced ? 1 : 0.08);
      camera.position.x = px * 0.9;
      camera.position.y = camY + py * 0.5;
      camera.position.z = 9 - warpS * 5;
      camTarget.set(px * 0.3, camY - 0.2 - velS * 0.02, 0);
      camera.lookAt(camTarget);
      camera.rotation.z += Math.sin(warpS * Math.PI) * 0.12;
      const fov = 45 + Math.sin(warpS * Math.PI) * 28;
      if (Math.abs(camera.fov - fov) > 0.01) { camera.fov = fov; camera.updateProjectionMatrix(); }

      // sheets
      const vel = Math.min(Math.abs(velS) * 0.02, 1.5);
      for (const s of sheets) {
        const u = s.userData;
        s.material.uniforms.uTime.value = t;
        s.material.uniforms.uWave.value = 1 + vel * 1.5 + warpS * 2;
        s.rotation.set(
          u.rx + Math.sin(t * u.spin + u.y) * 0.25 + py * 0.15,
          u.ry + t * u.spin * 0.4 + warpS * 3 + px * 0.2,
          u.rz + Math.cos(t * u.spin) * 0.15
        );
        s.position.x = u.x * (1 + warpS * 0.6);
        s.position.z = u.z + Math.sin(t * 0.3 + u.y) * 0.4 + warpS * 4;
      }

      key.position.set(4 + px * 3, camY + 4 - py * 3, 6);
      rim.position.set(-4 - px * 2, camY - 2, 3);

      API._burst *= 0.95;
      pMat.uniforms.uTime.value = t;
      pMat.uniforms.uBurst.value = API._burst;
      pMat.uniforms.uWarp.value = warpS;
      pMat.uniforms.uCam.value.copy(camera.position);

      renderer.render(scene, camera);
      requestAnimationFrame(frame);
    }

    addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight, false);
    });

    API.ready = true;
    document.dispatchEvent(new Event("scene:ready"));
    requestAnimationFrame(frame);
  }
})();
