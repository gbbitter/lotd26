/* Wapperman v2 – mobile-first. Vervangt het volledige game.js */
const leaderboard = (() => {
  const KEY = "lotd-wapperman-scores";
  async function getTopScores() {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]").slice(0, 10); } catch { return []; }
  }
  async function submitScore(name, score) {
    try {
      const scores = await getTopScores();
      scores.push({ name: String(name).trim().slice(0, 16), score: Math.max(0, Math.round(score)) });
      scores.sort((a, b) => b.score - a.score);
      localStorage.setItem(KEY, JSON.stringify(scores.slice(0, 10)));
      return scores.slice(0, 10);
    } catch { return []; }
  }
  return { getTopScores, submitScore };
})();

(() => {
  "use strict";
  const BEST_KEY = "lotd-wapperman-best", BLUE = "#0000ff", INK = "#111";
  const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, String(v)); } catch {} } };
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const rnd = (a, b) => a + Math.random() * (b - a), clamp = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t;
  const CTRY_NOTE = 0; // (placeholder zodat regelnummers stabiel blijven)

  const CSS = `
.wg{position:fixed;inset:0;z-index:2000;background:#fff;color:#000;touch-action:manipulation;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;overscroll-behavior:none;font-family:inherit}
.wg canvas{display:block;margin:0 auto;touch-action:none;border-left:2px solid #000;border-right:2px solid #000}
.wg-hud{position:absolute;left:0;right:0;top:0;padding:calc(10px + env(safe-area-inset-top,0px)) 14px 0;display:flex;justify-content:space-between;align-items:flex-start;pointer-events:none}
.wg-score{font-size:46px;font-weight:900;line-height:1;font-variant-numeric:tabular-nums}
.wg-best{font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.65;margin-top:4px}
.wg-x{pointer-events:auto;width:48px;height:48px;border:2px solid #000;background:#fff;color:#000;font-size:22px;font-weight:700;border-radius:0;padding:0}
.wg-ov{position:absolute;inset:0;display:none;overflow:auto;background:rgba(255,255,255,.95);padding:calc(24px + env(safe-area-inset-top,0px)) 20px calc(24px + env(safe-area-inset-bottom,0px));touch-action:pan-y}
.wg-ov.on{display:flex}
.wg-card{margin:auto;width:100%;max-width:360px;text-align:center}
.wg h2{font-size:42px;line-height:1;margin:0 0 12px;text-transform:uppercase;color:#000}
.wg p{margin:0 0 18px;font-size:16px;line-height:1.4;color:#000}
.wg-btn{display:block;width:100%;min-height:58px;margin:0 0 10px;border:2px solid #000;background:#000;color:#fff;font:inherit;font-size:18px;font-weight:800;text-transform:uppercase;border-radius:0;touch-action:manipulation;cursor:pointer}
.wg-btn.alt{background:#fff;color:#000}
.wg-btn:active{background:${BLUE};color:#fff;border-color:${BLUE}}
@media (hover:hover){.wg-btn:hover{background:${BLUE};color:#fff;border-color:${BLUE}}}
.wg-btn[disabled]{opacity:.35;pointer-events:none}
.wg input{display:block;width:100%;min-height:58px;margin:0 0 10px;padding:0 14px;border:2px solid #000;font-size:16px;border-radius:0;text-align:center;background:#fff;color:#000;box-sizing:border-box}
.wg ol{list-style:none;margin:0 0 18px;padding:0;text-align:left}
.wg li{display:flex;gap:10px;padding:10px 8px;border-bottom:1px solid #000;font-size:18px}
.wg li i{font-style:normal;width:28px;opacity:.5}
.wg li span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.wg li.me{background:${BLUE};color:#fff}`;

  let root, cv, cx, scoreEl, bestEl, ov, ro, raf, last = 0, sprite, prevOverflow;
  let W = 0, H = 0, s = 1, groundY = 0, lanes = 6, laneW = 60, maxV = 300;
  let state = "start", score = 0, best = Number(store.get(BEST_KEY) || 0), lock = 0;
  let x = 0, vel = 0, clock = 0, elapsed = 0, spawnT = 0, prevGap = 2, hitT = 0, def = 0, shakeT = 0;
  let obstacles = [], keyDir = 0, touchDir = 0, active = null, mouseX = null;

  function makeSprite() {
    const D = 128, c = document.createElement("canvas"); c.width = c.height = D;
    const g = c.getContext("2d"), fam = '"Arial Black","Helvetica Neue",Arial,sans-serif', lines = ["left", "of the", "dial"];
    g.fillStyle = "#000"; g.beginPath(); g.arc(D / 2, D / 2, D / 2, 0, 7); g.fill();
    g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "alphabetic";
    const fs = lines.map(t => { g.font = `900 100px ${fam}`; return 100 * D * .7 / g.measureText(t).width; });
    const hs = fs.map(f => f * .74), gap = 5, total = hs.reduce((a, b) => a + b, 0) + gap * 2;
    let y = (D - total) / 2;
    lines.forEach((t, i) => { g.font = `900 ${fs[i]}px ${fam}`; y += hs[i]; g.fillText(t, D / 2, y); y += gap; });
    return c;
  }

  function resize() {
    if (!root) return;
    const rw = root.clientWidth, rh = root.clientHeight, d = Math.min(2, devicePixelRatio || 1);
    W = Math.min(rw, 520); H = rh;
    cv.width = Math.round(W * d); cv.height = Math.round(H * d); cv.style.width = W + "px"; cv.style.height = H + "px";
    cx.setTransform(d, 0, 0, d, 0, 0);
    s = clamp(W / 390, .8, 1.3); groundY = H - 38 * s;
    lanes = clamp(Math.round(W / 64), 5, 8); laneW = W / lanes; maxV = W * .9;
    x = x ? clamp(x, 30 * s, W - 30 * s) : W / 2;
  }

  /* ---------- spel ---------- */
  function start() {
    state = "playing"; score = 0; elapsed = 0; spawnT = .6; hitT = 0; def = 0; shakeT = 0;
    obstacles = []; x = W / 2; vel = 0; touchDir = 0; active = null; prevGap = Math.floor(lanes / 2);
    hide(); scoreEl.textContent = "0";
  }
  const speedNow = () => 190 + Math.min(340, elapsed * 6.5);
  const intervalNow = () => Math.max(.34, .95 - elapsed * .012);
  function spawnRow() {
    const reach = Math.max(1, Math.floor(maxV * intervalNow() / laneW * .6));
    const gap = clamp(prevGap + Math.round(rnd(-reach, reach)), 0, lanes - 1); prevGap = gap;
    const fill = Math.min(.62, .25 + elapsed * .009), size = Math.min(laneW * .74, 60 * s), sp = speedNow();
    for (let l = 0; l < lanes; l++) {
      if (l === gap || Math.random() > fill) continue;
      obstacles.push({ x: (l + .5) * laneW + rnd(-.08, .08) * laneW, y: -size - rnd(0, laneW * .6), size, speed: sp * rnd(.95, 1.05), rot: rnd(0, 6.28), spin: rnd(-1.2, 1.2) });
    }
  }
  function hits(o) {
    const parts = [[112, 17], [78, 15], [42, 14]];
    for (const [hy, r] of parts) { const dx = o.x - x, dy = o.y - (groundY - hy * s), rr = o.size * .42 + r * s; if (dx * dx + dy * dy < rr * rr) return true; }
    return false;
  }
  function update(dt) {
    elapsed += dt; const sc = Math.floor(elapsed * 10);
    if (sc !== score) { score = sc; scoreEl.textContent = score; }
    const dir = touchDir || keyDir; let want = 0;
    if (dir) want = dir * maxV; else if (mouseX !== null) want = clamp((mouseX - x) * 10, -maxV, maxV);
    vel += (want - vel) * Math.min(1, 14 * dt); x = clamp(x + vel * dt, 30 * s, W - 30 * s);
    spawnT -= dt; if (spawnT <= 0) { spawnRow(); spawnT += intervalNow(); }
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const o = obstacles[i]; o.y += o.speed * dt; o.rot += o.spin * dt;
      if (hits(o)) { crash(); return; }
      if (o.y > groundY + 20 * s) obstacles.splice(i, 1);
    }
  }
  function crash() {
    state = "hit"; hitT = 0; shakeT = reduced ? 0 : .28;
    best = Math.max(best, score); store.set(BEST_KEY, best);
    try { navigator.vibrate && navigator.vibrate(120); } catch {}
  }

  /* ---------- tekenen ---------- */
  function poly(p, from, color, lw) {
    cx.strokeStyle = color; cx.lineWidth = lw; cx.lineCap = cx.lineJoin = "round"; cx.beginPath();
    cx.moveTo(p[from][0], p[from][1]); for (let i = from + 1; i < p.length; i++) cx.lineTo(p[i][0], p[i][1]); cx.stroke();
  }
  function wapper(px, gy, t, d) {
    const k = 1 - d, bh = (92 - 50 * d) * s, sw = f => Math.sin(t * 5.5 + f * 2.2) * 10 * s * k * f + d * 12 * s * f * f;
    cx.fillStyle = "#555"; cx.fillRect(px - 20 * s, gy, 40 * s, 9 * s);
    cx.fillStyle = INK; cx.beginPath();
    const N = 8;
    for (let i = 0; i <= N; i++) { const f = i / N, w = (15 - 4 * f) * s, bx = px + sw(f) - w, by = gy - bh * f; i ? cx.lineTo(bx, by) : cx.moveTo(bx, by); }
    for (let i = N; i >= 0; i--) { const f = i / N, w = (15 - 4 * f) * s; cx.lineTo(px + sw(f) + w, gy - bh * f); }
    cx.closePath(); cx.fill();
    if (d < .5) { cx.save(); cx.translate(px + sw(.5), gy - bh * .5); cx.rotate(-Math.PI / 2); cx.fillStyle = "#fff"; cx.font = `800 ${9 * s}px sans-serif`; cx.textAlign = "center"; cx.textBaseline = "middle"; cx.fillText("left of the dial", 0, 0); cx.restore(); }
    const sy = gy - bh * .88, sx = px + sw(.88);
    for (const side of [-1, 1]) {
      const ph = side > 0 ? 0 : 1.7, fl = Math.sin(t * 9 + ph) * k, a = lerp(1.35 + fl * .85, 2.9, d), L = (64 - 8 * d) * s;
      const dx = side * Math.sin(a), dy = -Math.cos(a), ex = sx + dx * L, ey = sy + dy * L;
      const off = (Math.sin(t * 9 + ph + 1) * 14 * k + 7 * d) * s * side, mx = (sx + ex) / 2 - dy * off, my = (sy + ey) / 2 + dx * off, p = [];
      for (let i = 0; i <= 12; i++) { const u = i / 12, v = 1 - u; p.push([v * v * sx + 2 * v * u * mx + u * u * ex, v * v * sy + 2 * v * u * my + u * u * ey]); }
      poly(p, 0, INK, 17 * s); poly(p, 4, "#fff", 12 * s);
    }
    const hx = px + sw(1), hy = gy - bh - 18 * s * (1 - .3 * d);
    cx.save(); cx.translate(hx, hy); cx.rotate(d * .7 + Math.sin(t * 6) * .07 * k);
    cx.beginPath(); cx.ellipse(0, 0, 20 * s, 25 * s, 0, 0, 7); cx.fillStyle = "#fff"; cx.fill();
    cx.save(); cx.clip();
    cx.fillStyle = BLUE; cx.beginPath(); cx.moveTo(-30 * s, -30 * s); cx.lineTo(30 * s, -30 * s); cx.lineTo(30 * s, -3 * s);
    cx.quadraticCurveTo(14 * s, -9 * s, 0, -3 * s); cx.quadraticCurveTo(-14 * s, -9 * s, -30 * s, -3 * s); cx.closePath(); cx.fill();
    cx.fillStyle = INK;
    for (const e of [-1, 1]) { cx.beginPath(); cx.ellipse(e * 8 * s, -6 * s, 5.5 * s, 7 * s, e * .3, 0, 7); cx.fill(); }
    cx.beginPath(); cx.moveTo(0, 3 * s); cx.lineTo(-3 * s, 10 * s); cx.lineTo(3 * s, 10 * s); cx.closePath(); cx.fill();
    cx.fillRect(-11 * s, 13 * s, 22 * s, 8 * s); cx.strokeStyle = "#fff"; cx.lineWidth = 1.6 * s;
    for (let i = -1; i <= 1; i++) { cx.beginPath(); cx.moveTo(i * 5 * s, 13 * s); cx.lineTo(i * 5 * s, 21 * s); cx.stroke(); }
    if (d > .4) { cx.lineWidth = 2 * s; for (const e of [-1, 1]) { cx.beginPath(); cx.moveTo(e * 8 * s - 3 * s, -9 * s); cx.lineTo(e * 8 * s + 3 * s, -3 * s); cx.moveTo(e * 8 * s + 3 * s, -9 * s); cx.lineTo(e * 8 * s - 3 * s, -3 * s); cx.stroke(); } }
    cx.restore();
    cx.lineWidth = 3 * s; cx.strokeStyle = INK; cx.beginPath(); cx.ellipse(0, 0, 20 * s, 25 * s, 0, 0, 7); cx.stroke();
    cx.restore();
  }
  function draw() {
    cx.save(); cx.fillStyle = "#fff"; cx.fillRect(0, 0, W, H);
    if (shakeT > 0) cx.translate(rnd(-5, 5), rnd(-5, 5));
    cx.strokeStyle = "#e6e6e6"; cx.lineWidth = 2;
    const off = (clock * 120) % 60;
    for (let i = 1; i < lanes; i++) { cx.beginPath(); cx.setLineDash([14, 46]); cx.lineDashOffset = -off; cx.moveTo(i * laneW, 0); cx.lineTo(i * laneW, H); cx.stroke(); }
    cx.setLineDash([]);
    cx.fillStyle = INK; cx.fillRect(0, groundY + 9 * s, W, 4); cx.fillStyle = "#f0f0f0"; cx.fillRect(0, groundY + 13 * s, W, H);
    for (const o of obstacles) { cx.save(); cx.translate(o.x, o.y); cx.rotate(o.rot); cx.drawImage(sprite, -o.size / 2, -o.size / 2, o.size, o.size); cx.restore(); }
    wapper(x, groundY, clock, def);
    cx.restore();
  }
  function loop(ts) {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(.05, (ts - (last || ts)) / 1000); last = ts; clock += dt;
    if (state === "playing") update(dt);
    else if (state === "hit") { hitT += dt; def = Math.min(1, hitT / .9); if (hitT >= .9) gameOver(); }
    if (shakeT > 0) shakeT -= dt;
    draw();
  }

  /* ---------- schermen ---------- */
  function show(html, bind) { ov.innerHTML = `<div class="wg-card">${html}</div>`; ov.classList.add("on"); ov.scrollTop = 0; if (bind) bind(); }
  function hide() { ov.classList.remove("on"); ov.innerHTML = ""; }
  function on(sel, fn) { const el = ov.querySelector(sel); if (el) el.addEventListener("click", () => { if (performance.now() < lock) return; fn(el); }); }
  function showStart() {
    state = "start"; bestEl.textContent = "Record " + best;
    show(`<h2>Wapperman</h2><p>Ontwijk de logo's. Houd links of rechts op je scherm ingedrukt om te bewegen. Op desktop: muis of pijltjestoetsen.</p><button class="wg-btn" id="a">Start</button><button class="wg-btn alt" id="b">Top 10</button>`,
      () => { on("#a", start); on("#b", () => showTop()); });
  }
  function gameOver() {
    state = "over"; lock = performance.now() + 700; bestEl.textContent = "Record " + best;
    show(`<h2>Af!</h2><p>Score <b>${score}</b><br>Record <b>${best}</b></p><button class="wg-btn" id="r">Opnieuw spelen</button><input id="n" maxlength="16" placeholder="Naam (optioneel)" autocomplete="off" enterkeyhint="done" aria-label="Naam (optioneel)"><button class="wg-btn alt" id="sv" disabled>Opslaan in Top 10</button><button class="wg-btn alt" id="t">Bekijk Top 10</button>`, () => {
      const n = ov.querySelector("#n"), sv = ov.querySelector("#sv");
      n.addEventListener("input", () => { sv.disabled = !n.value.trim(); });
      n.addEventListener("keydown", e => { if (e.key === "Enter" && !sv.disabled) sv.click(); });
      on("#r", start); on("#t", () => showTop());
      on("#sv", async () => {
        const name = n.value.trim(); if (!name) return; sv.disabled = true;
        const list = await leaderboard.submitScore(name, score); showTop(list, { name: name.slice(0, 16), score });
      });
    });
  }
  async function showTop(list, me) {
    state = "top"; lock = performance.now() + 250;
    if (!list) list = await leaderboard.getTopScores();
    let mark = me ? list.findIndex(r => r.name === me.name && r.score === me.score) : -1;
    const rows = list.map((r, i) => `<li class="${i === mark ? "me" : ""}"><i>${i + 1}</i><span>${esc(r.name)}</span><b>${r.score}</b></li>`).join("") || "<li><span>Nog geen scores</span></li>";
    show(`<h2>Top 10</h2><ol>${rows}</ol><button class="wg-btn" id="a">Spelen</button><button class="wg-btn alt" id="b">Terug</button>`,
      () => { on("#a", start); on("#b", showStart); });
  }

  /* ---------- invoer ---------- */
  function steer(e) { const r = cv.getBoundingClientRect(); touchDir = e.clientX < r.left + r.width / 2 ? -1 : 1; }
  function onDown(e) {
    if (state !== "playing" || e.target.closest(".wg-x")) return;
    if (e.pointerType === "mouse") { mouseX = e.clientX - cv.getBoundingClientRect().left; return; }
    e.preventDefault(); active = e.pointerId; try { root.setPointerCapture(e.pointerId); } catch {} steer(e);
  }
  function onMove(e) {
    if (state !== "playing") return;
    if (e.pointerType === "mouse") mouseX = e.clientX - cv.getBoundingClientRect().left;
    else if (e.pointerId === active) steer(e);
  }
  function onUp(e) { if (e.pointerId === active) { active = null; touchDir = 0; } }
  function onKeyDown(e) {
    if (e.target && /INPUT|BUTTON|TEXTAREA/.test(e.target.tagName)) return;
    const l = ["ArrowLeft", "a", "A"].includes(e.key), r = ["ArrowRight", "d", "D"].includes(e.key);
    if (state === "playing") { if (l) { keyDir = -1; mouseX = null; } if (r) { keyDir = 1; mouseX = null; } }
    else if ((e.key === "Enter" || e.key === " ") && (state === "start" || state === "over") && performance.now() > lock) { e.preventDefault(); start(); }
  }
  function onKeyUp(e) { if (["ArrowLeft", "a", "A", "ArrowRight", "d", "D"].includes(e.key)) keyDir = 0; }
  function onVis() {
    if (document.hidden && state === "playing") {
      state = "paused"; touchDir = 0; active = null; lock = performance.now() + 300;
      show(`<h2>Pauze</h2><button class="wg-btn" id="a">Verder</button>`, () => on("#a", () => { hide(); last = 0; state = "playing"; }));
    }
  }

  /* ---------- mount ---------- */
  function mount() {
    if (root) return;
    if (!document.getElementById("wg-style")) { const st = document.createElement("style"); st.id = "wg-style"; st.textContent = CSS; document.head.appendChild(st); }
    root = document.createElement("div"); root.className = "wg";
    root.innerHTML = `<canvas></canvas><div class="wg-hud"><div><div class="wg-score">0</div><div class="wg-best"></div></div><button class="wg-x" aria-label="Sluiten">✕</button></div><div class="wg-ov"></div>`;
    document.body.appendChild(root);
    cv = root.querySelector("canvas"); cx = cv.getContext("2d"); scoreEl = root.querySelector(".wg-score"); bestEl = root.querySelector(".wg-best"); ov = root.querySelector(".wg-ov");
    prevOverflow = [document.documentElement.style.overflow, document.body.style.overflow];
    document.documentElement.style.overflow = document.body.style.overflow = "hidden";
    sprite = makeSprite(); mouseX = null; keyDir = touchDir = 0; active = null; last = 0; x = 0; obstacles = []; def = 0;
    resize(); ro = new ResizeObserver(resize); ro.observe(root);
    root.addEventListener("pointerdown", onDown); root.addEventListener("pointermove", onMove);
    ["pointerup", "pointercancel", "lostpointercapture"].forEach(t => root.addEventListener(t, onUp));
    root.querySelector(".wg-x").addEventListener("click", () => { unmount(); location.hash = "#/"; });
    window.addEventListener("keydown", onKeyDown); window.addEventListener("keyup", onKeyUp);
    document.addEventListener("visibilitychange", onVis); window.addEventListener("hashchange", unmount);
    showStart(); raf = requestAnimationFrame(loop);
  }
  function unmount() {
    if (!root) return;
    cancelAnimationFrame(raf); ro && ro.disconnect();
    window.removeEventListener("keydown", onKeyDown); window.removeEventListener("keyup", onKeyUp);
    document.removeEventListener("visibilitychange", onVis); window.removeEventListener("hashchange", unmount);
    document.documentElement.style.overflow = prevOverflow[0]; document.body.style.overflow = prevOverflow[1];
    root.remove(); root = null; state = "start";
  }
  window.WappermanGame = { mount, unmount };
})();
