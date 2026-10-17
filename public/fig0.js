/*
 * Fig. 0 — the ceramic.
 *
 * One glossy white knot, glazed like porcelain, turning slowly over a soft
 * shadow. Each piece of work has its own knot: point at a project (on a
 * phone, scroll it to the middle of the screen) and the knot becomes that
 * project's torus knot — engram a (2,3) trefoil, loci a (3,4), and so on —
 * and the caption under it names the pair. The cursor tilts it a little.
 *
 * Two views of the one knot: the opening panel, and a close view that
 * stays beside the work. Each view has its own canvas, renderer and studio
 * light, and only draws while it is on screen. Paused in a background tab;
 * with reduced motion it holds still and changes shape without moving.
 *
 * Needs only three.js (vendored at /vendor/, mapped by the page's import map).
 */
import * as THREE from "three";

const stages = Array.from(document.querySelectorAll("[data-stage]")).filter((el) => el.querySelector("canvas"));
if (stages.length) boot();

function boot() {
  const reduce = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);

  /* ---- the knots: one shape per piece of work ---------------------- */
  const FORMS = {
    home: [2, 5],
    engram: [2, 3],
    loci: [3, 4],
    whetstone: [2, 7],
    spindle: [3, 5],
    reverie: [5, 3],
    conoid: [3, 7],
  };
  const NAMES = Object.keys(FORMS);
  const knot = (p, q) => new THREE.TorusKnotGeometry(1.1, 0.33, 400, 64, p, q);
  const geo = knot(...FORMS.home);
  geo.morphAttributes.position = [];
  geo.morphAttributes.normal = [];
  for (const n of NAMES) {
    const g = knot(...FORMS[n]);
    geo.morphAttributes.position.push(g.attributes.position);
    geo.morphAttributes.normal.push(g.attributes.normal);
    g.dispose();
  }
  const glaze = new THREE.MeshPhysicalMaterial({
    color: "#fbfbf8",
    roughness: 0.22,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    sheen: 0.3,
    iridescence: 0.25,
    iridescenceIOR: 1.3,
  });

  // the shadow: a blurred disc on the floor, not a shadow map
  const shade = document.createElement("canvas");
  shade.width = shade.height = 256;
  const g2 = shade.getContext("2d");
  const grad = g2.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, "rgba(0,0,0,.26)");
  grad.addColorStop(0.5, "rgba(0,0,0,.09)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g2.fillStyle = grad;
  g2.fillRect(0, 0, 256, 256);
  const blobGeo = new THREE.PlaneGeometry(5.4, 2.1);

  const LIFT = 2.15; // the knot's centre above the floor

  /* ---- a view: renderer, studio, knot, shadow ---------------------- */
  function makeView(el) {
    const canvas = el.querySelector("canvas");
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch (e) {
      el.classList.add("no-gl");
      return null;
    }
    const small = Math.min(window.innerWidth, window.innerHeight) < 700;
    renderer.setPixelRatio(Math.min(small ? 1.5 : 2, window.devicePixelRatio || 1));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;

    const scene = new THREE.Scene();
    // a white studio for the glaze to reflect: soft boxes around a pale room
    const studio = new THREE.Scene();
    studio.background = new THREE.Color("#d8d8d2");
    const box = (w, h, x, y, z, power) => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffffff").multiplyScalar(power), side: THREE.DoubleSide }),
      );
      m.position.set(x, y, z);
      m.lookAt(0, 0, 0);
      studio.add(m);
    };
    box(8, 4, 0, 7, 2, 2.6);
    box(3, 9, -8, 1, 2, 1.6);
    box(3, 9, 8, 1, -1, 1.2);
    box(14, 2, 0, -7, 0, 0.7);
    box(4, 4, 0, 1, 9, 0.9);
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(studio, 0.04).texture;
    pmrem.dispose();
    scene.add(new THREE.HemisphereLight(0xffffff, 0xdcdcd5, 0.4));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(-3, 10, 4);
    scene.add(key);

    const mesh = new THREE.Mesh(geo, glaze);
    mesh.position.y = LIFT;
    mesh.morphTargetInfluences = NAMES.map((n) => (n === "home" ? 1 : 0));
    scene.add(mesh);
    const blob = new THREE.Mesh(blobGeo, new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shade), transparent: true, depthWrite: false }));
    blob.rotation.x = -Math.PI / 2;
    blob.position.y = 0.01;
    scene.add(blob);

    const close = el.getAttribute("data-stage") !== "hero";
    let cap = null;
    if (close) {
      cap = document.createElement("span");
      cap.className = "pin";
      cap.setAttribute("aria-hidden", "true");
      el.appendChild(cap);
    }
    return { el, renderer, scene, mesh, close, cap, camera: new THREE.PerspectiveCamera(28, 1, 0.1, 100), W: 0, H: 0, seen: false };
  }
  const views = stages.map(makeView).filter(Boolean);
  if (!views.length) return;

  /* ---- which knot ---------------------------------------------------- */
  let form = "home";
  const want = NAMES.map((n) => (n === form ? 1 : 0));
  const now = NAMES.map((n) => (n === form ? 1 : 0));
  const rows = Array.from(document.querySelectorAll("a[data-form]"));
  function become(name) {
    if (!FORMS[name] || name === form) return;
    form = name;
    NAMES.forEach((n, i) => (want[i] = n === name ? 1 : 0));
    stages.forEach((s) => s.setAttribute("data-form", name));
    rows.forEach((r) => r.classList.toggle("here", r.getAttribute("data-form") === name));
    for (const v of views) {
      if (!v.cap) continue;
      const [p, q] = FORMS[name];
      v.cap.innerHTML = name === "home" ? "" : `<b>${name === "conoid" ? "CONOID" : name}</b> a (${p}, ${q}) torus knot`;
      v.cap.classList.toggle("on", name !== "home");
    }
    if (reduce) {
      NAMES.forEach((_, i) => (now[i] = want[i]));
      drawAll();
    }
  }
  const fine = !!(window.matchMedia && matchMedia("(hover: hover)").matches);
  rows.forEach((el) => {
    el.addEventListener("pointerenter", () => become(el.getAttribute("data-form")));
    el.addEventListener("focusin", () => become(el.getAttribute("data-form")));
    if (fine) el.addEventListener("pointerleave", () => become("home"));
  });
  if (!fine && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && become(e.target.getAttribute("data-form"))),
      { rootMargin: "-48% 0px -48% 0px" },
    );
    rows.forEach((el) => io.observe(el));
  }

  /* ---- framing ------------------------------------------------------ */
  const TAN = Math.tan(THREE.MathUtils.degToRad(14));
  const EL = THREE.MathUtils.degToRad(5);
  function frame(v) {
    const W = v.el.clientWidth, H = v.el.clientHeight;
    if (!W || !H) return false;
    if (W !== v.W || H !== v.H) {
      v.W = W;
      v.H = H;
      v.renderer.setSize(W, H, false);
      const wide = W >= 700;
      // where the knot sits in its view (fractions of the view) and how much of it it may fill
      const at = v.close ? { x: 0.5, y: 0.47, h: 0.68, w: 0.9 } : wide ? { x: 0.68, y: 0.46, h: 0.8, w: 0.5 } : { x: 0.5, y: 0.3, h: 0.44, w: 0.9 };
      // knot and shadow: about 4.5 units tall; the knot about 4.4 wide (its shadow may spill wider)
      const d = Math.max(4.5 / (at.h * 2 * TAN), 4.4 / (at.w * 2 * TAN * (W / H)));
      const cy = 2.1;
      v.camera.aspect = W / H;
      v.camera.position.set(0, cy + Math.sin(EL) * d, Math.cos(EL) * d);
      v.camera.lookAt(0, cy, 0);
      v.camera.setViewOffset(W, H, W / 2 - at.x * W, H / 2 - at.y * H, W, H);
      v.camera.updateProjectionMatrix();
    }
    return true;
  }

  /* ---- the cursor tilts it ------------------------------------------ */
  const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener(
    "pointermove",
    (e) => {
      tilt.tx = (e.clientY / window.innerHeight - 0.5) * 0.35;
      tilt.ty = (e.clientX / window.innerWidth - 0.5) * 0.5;
    },
    { passive: true },
  );

  let t = 0.4;
  function drawAll() {
    for (const v of views) {
      if (!v.seen || !frame(v)) continue;
      // face-on, so each knot's symmetry reads: it turns in its own plane and sways a little
      v.mesh.rotation.set(Math.sin(t * 0.9) * 0.28 - 0.18 + tilt.x, Math.cos(t * 0.7) * 0.28 + tilt.y, t * 0.55);
      for (let i = 0; i < now.length; i++) v.mesh.morphTargetInfluences[i] = now[i];
      v.renderer.render(v.scene, v.camera);
    }
  }

  /* ---- the loop ----------------------------------------------------- */
  let last = 0, raf = 0, running = false;
  function loop(ms) {
    raf = 0;
    if (!running) return;
    const dt = Math.min(0.05, (ms - (last || ms)) / 1000);
    last = ms;
    t += dt * 0.22;
    tilt.x += (tilt.tx - tilt.x) * Math.min(1, dt * 3);
    tilt.y += (tilt.ty - tilt.y) * Math.min(1, dt * 3);
    for (let i = 0; i < now.length; i++) now[i] += (want[i] - now[i]) * Math.min(1, dt * 5);
    drawAll();
    if (views.some((v) => v.seen)) raf = requestAnimationFrame(loop);
    else running = false;
  }
  function start() {
    if (running || reduce || document.hidden) return;
    running = true;
    last = 0;
    raf = requestAnimationFrame(loop);
  }
  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }
  const seen = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const v = views.find((x) => x.el === e.target);
      if (v) v.seen = e.isIntersecting;
    });
    if (reduce) drawAll();
    else start();
  });
  views.forEach((v) => seen.observe(v.el));
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  window.addEventListener("resize", () => reduce && drawAll());

  views.forEach((v) => {
    const r = v.el.getBoundingClientRect();
    v.seen = r.bottom > 0 && r.top < window.innerHeight;
  });
  stages.forEach((s) => {
    s.classList.add("on");
    s.setAttribute("data-form", form);
  });
  drawAll();
  start();
}
