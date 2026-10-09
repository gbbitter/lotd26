/* Wapperman v4 – gedeelde topscores + verplichte naam.
   STAP 1: maak een gratis Supabase-project, voer de SQL uit (zie handleiding) en vul hieronder URL en "anon public" key in.
   Laat je ze leeg, dan werkt alles nog steeds, maar staan de scores alleen op dit apparaat. */
const LB = { url: "https://kqaacbzeaokkdceirdfj.supabase.co", key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxYWFjYnplYW9ra2RjZWlyZGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0Mzc0MDIsImV4cCI6MjEwNzAxMzQwMn0.ActIR4sojnRWQyC_kJdN6BUl2u2q5BnY3cW57N8Cthw" };   // bv. url: "https://abcd1234.supabase.co", key: "eyJ..."

const leaderboard = (() => {
  const LOCAL = "lotd-wapperman-scores", CACHE = "lotd-wapperman-top-cache", PEND = "lotd-wapperman-pending";
  let lastErr = "";
  const online = () => !!(LB.url && LB.key);
  const rd = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch { return d; } };
  const wr = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  async function api(path, opt) {
    const r = await fetch(LB.url.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "") + "/rest/v1/" + path, { cache: "no-store", ...opt, headers: { apikey: LB.key, ...(LB.key.startsWith("eyJ") ? { Authorization: "Bearer " + LB.key } : {}), "Content-Type": "application/json", ...((opt && opt.headers) || {}) } });
    if (!r.ok) { let m = ""; try { m = (await r.json()).message || ""; } catch {} lastErr = "HTTP " + r.status + (m ? " – " + m : ""); throw new Error(lastErr); } lastErr = ""; return r;
  }
  async function flush() {                       // eerder mislukte scores alsnog versturen
    const p = rd(PEND, []); if (!p.length) return; const rest = [];
    for (const it of p) { try { await api("rpc/submit_score", { method: "POST", body: JSON.stringify({ p_name: it.name, p_score: it.score }) }); } catch { rest.push(it); } }
    wr(PEND, rest);
  }
  function localInsert(name, score) {            // alleen-lokaal: beste score per naam
    const list = rd(LOCAL, []), k = name.toLowerCase(), i = list.findIndex(r => r.name.toLowerCase() === k);
    if (i >= 0) { if (score > list[i].score) list[i] = { name, score }; } else list.push({ name, score });
    list.sort((a, b) => b.score - a.score); wr(LOCAL, list.slice(0, 10));
  }
  async function getTopScores() {
    if (!online()) return { list: rd(LOCAL, []).slice(0, 10), source: "local" };
    try { await flush(); const r = await api("scores?select=name,score&order=score.desc,updated_at.asc&limit=10"), list = await r.json(); wr(CACHE, list); return { list, source: "online" }; }
    catch { return { list: rd(CACHE, []), source: "cache" }; }
  }
  async function submitScore(name, score) {
    name = String(name).trim().slice(0, 16); score = Math.max(0, Math.round(score));
    if (!online()) { localInsert(name, score); return { ok: true, source: "local" }; }
    try { await api("rpc/submit_score", { method: "POST", body: JSON.stringify({ p_name: name, p_score: score }) }); return { ok: true, source: "online" }; }
    catch { const p = rd(PEND, []); p.push({ name, score }); wr(PEND, p); return { ok: false, queued: true, source: "cache" }; }
  }
  return { getTopScores, submitScore, online, err: () => lastErr };
})();

(() => {
  "use strict";
  const BEST_KEY = "lotd-wapperman-best", MUTE_KEY = "lotd-wapperman-muted", BLUE = "#0000ff";
  const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, String(v)); } catch {} } };
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const EN = { "Ontwijk de logo's, ook met je armen. Pak de blauwe ster voor een schild. Houd links of rechts op je scherm ingedrukt. Op desktop: muis of pijltjestoetsen.": "Dodge the logos, arms included. Grab the blue star for a shield. Hold the left or right side of your screen. On desktop: mouse or arrow keys.", "Nieuw record!": "New record!", "Af!": "Game over!", "Logo's ontweken:": "Logos dodged:", "Opnieuw spelen": "Play again", "Naam": "Name", "Laden…": "Loading…", "Opnieuw proberen": "Try again", "Opslaan in Top 10": "Save to Top 10", "Bekijk Top 10": "View Top 10", "Nog geen scores": "No scores yet", "Spelen": "Play", "Terug": "Back", "Pauze": "Paused", "Verder": "Resume", "SCHILD WEG": "SHIELD GONE", "SCHILD!": "SHIELD!", "NIEUW RECORD!": "NEW RECORD!" };
  const Lg = (nl, en) => window.LOTD_LANG === "en" ? en : nl;
  const tr = s => { if (window.LOTD_LANG !== "en") return s; let o = String(s); for (const k in EN) o = o.split(k).join(EN[k]); return o; };
  const rnd = (a, b) => a + Math.random() * (b - a), clamp = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t;

  /* ===== TUNING: pas hier de moeilijkheid aan ===== */
  const T = {
    speedStart: 210, speedGain: 6.2, speedMax: 460,   // valsnelheid (px/s) = start + min(max, tijd*gain)
    rowStart: .95, rowGain: .011, rowMin: .30,        // seconden tussen rijen logo's
    fillStart: .35, fillGain: .009, fillMax: .8,      // kans dat een baan (buiten de opening) gevuld is
    zigAfter: 25, diagAfter: 28,                      // vanaf welke seconde zigzag- en diagonale logo's komen
    nearPx: 10, nearBonus: 5,                         // "net gemist" marge en bonuspunten
    mile: 250, nightEvery: 400                        // mijlpaal en dag/nacht-wissel (punten)
  };
  const PAL = {
    day: { bg: "#fff", ink: "#111", paper: "#fff", lane: "#e6e6e6", gfill: "#f0f0f0", base: "#555" },
    night: { bg: "#0b0b0b", ink: "#fff", paper: "#0b0b0b", lane: "#262626", gfill: "#161616", base: "#bbb" }
  };
  const CSS = `
.wg{position:fixed;inset:0;z-index:2000;background:#fff;color:#000;touch-action:manipulation;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;overscroll-behavior:none;font-family:inherit}
.wg.night{background:#0b0b0b}
.wg canvas{display:block;margin:0 auto;touch-action:none;border-left:2px solid #000;border-right:2px solid #000}
.wg.night canvas{border-color:#fff}
.wg-hud{position:absolute;left:0;right:0;top:0;padding:calc(10px + env(safe-area-inset-top,0px)) 14px 0;display:flex;justify-content:space-between;align-items:flex-start;pointer-events:none}
.wg-score{font-size:46px;font-weight:900;line-height:1;font-variant-numeric:tabular-nums}
.wg-best{font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.65;margin-top:4px}
.wg.night .wg-score,.wg.night .wg-best{color:#fff}
.wg-btns{display:flex;gap:8px;pointer-events:auto}
.wg-x,.wg-snd{width:48px;height:48px;border:2px solid #000;background:#fff;color:#000;font-size:20px;font-weight:700;border-radius:0;padding:0}
.wg.night .wg-x,.wg.night .wg-snd{background:#0b0b0b;color:#fff;border-color:#fff}
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
.wg li.me{background:${BLUE};color:#fff}
.wg-q{font-weight:700}.wg-note{font-size:13px;border:2px solid #000;padding:8px;margin:0 0 14px}`;

  let root, cv, cx, scoreEl, bestEl, ov, sndEl, ro, raf, last = 0, sprites, prevOverflow, ac = null;
  let W = 0, H = 0, s = 1, groundY = 0, lanes = 6, laneW = 60, maxV = 300;
  let state = "start", score = 0, best = Number(store.get(BEST_KEY) || 0), lock = 0, muted = store.get(MUTE_KEY) === "1";
  let x = 0, vel = 0, clock = 0, elapsed = 0, spawnT = 0, diagT = 0, pickupT = 0, prevGap = 2, hitT = 0, def = 0, shakeT = 0, flash = 0;
  let bonus = 0, dodged = 0, shield = 0, inv = 0, night = false, nextMile = T.mile, recShown = false, bestAtStart = 0, isRec = false;
  let obstacles = [], pickups = [], particles = [], pops = [], keyDir = 0, touchDir = 0, active = null, mouseX = null;

  /* ---------- geluid (kleine synth, geen bestanden) ---------- */
  function beep(f, d = .08, type = "square", v = .05, slide = 0) {
    if (muted) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === "suspended") ac.resume();
      const o = ac.createOscillator(), g = ac.createGain(), n = ac.currentTime;
      o.type = type; o.frequency.setValueAtTime(f, n); if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f + slide), n + d);
      g.gain.setValueAtTime(v, n); g.gain.exponentialRampToValueAtTime(.001, n + d); o.connect(g); g.connect(ac.destination); o.start(); o.stop(n + d);
    } catch {}
  }

  function makeSprite(inv) {
    const D = 128, c = document.createElement("canvas"); c.width = c.height = D;
    const g = c.getContext("2d"), fam = '"Arial Black","Helvetica Neue",Arial,sans-serif', lines = ["left", "of the", "dial"];
    g.fillStyle = inv ? "#fff" : "#000"; g.beginPath(); g.arc(D / 2, D / 2, D / 2, 0, 7); g.fill();
    g.fillStyle = inv ? "#000" : "#fff"; g.textAlign = "center"; g.textBaseline = "alphabetic";
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
    lanes = clamp(Math.round(W / 62), 6, 9); laneW = W / lanes; maxV = W * .95;
    x = x ? clamp(x, 30 * s, W - 30 * s) : W / 2;
  }

  /* ---------- effecten ---------- */
  function pop(txt, px, py, size = 22, col) { pops.push({ txt: tr(txt), x: px, y: py, t: 0, life: 1.1, size, col }); }
  function burst(px, py, n = 24) {
    if (reduced) n = 8;
    for (let i = 0; i < n; i++) { const a = rnd(0, 6.28), v = rnd(80, 300); particles.push({ x: px, y: py, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 120, t: 0, life: rnd(.5, .9), c: ["#111", BLUE, "#fff"][i % 3], r: rnd(3, 7) }); }
  }
  const setScore = n => { score = n; scoreEl.textContent = n; bestEl.textContent = "Record " + Math.max(best, n); };

  /* ---------- spel ---------- */
  function start() {
    state = "playing"; elapsed = 0; spawnT = .6; diagT = 4; pickupT = 12; hitT = 0; def = 0; shakeT = 0; flash = 0;
    bonus = 0; dodged = 0; shield = 0; inv = 0; night = false; nextMile = T.mile; recShown = false; isRec = false; bestAtStart = best;
    obstacles = []; pickups = []; particles = []; pops = []; x = W / 2; vel = 0; touchDir = 0; active = null; prevGap = Math.floor((lanes - 3) / 2);
    root.classList.remove("night"); hide(); setScore(0); beep(520, .06, "square", .04, 400);
  }
  const speedNow = () => T.speedStart + Math.min(T.speedMax, elapsed * T.speedGain);
  const intervalNow = () => Math.max(T.rowMin, T.rowStart - elapsed * T.rowGain);
  const lsize = () => Math.min(laneW * .8, 60 * s);

  function spawnRow() {
    const sp = speedNow(), iv = intervalNow(), size = lsize(), gw = 3;
    const reach = Math.max(1, Math.floor(maxV * iv / laneW * .6));
    const g = clamp(prevGap + Math.round(rnd(-reach, reach)), 0, lanes - gw); prevGap = g;
    const fill = Math.min(T.fillMax, T.fillStart + elapsed * T.fillGain);
    for (let l = 0; l < lanes; l++) {
      if ((l >= g && l < g + gw) || Math.random() > fill) continue;
      const o = { x: (l + .5) * laneW + rnd(-.06, .06) * laneW, y: -size - rnd(0, laneW * .5), size, speed: sp * rnd(.96, 1.04), rot: rnd(0, 6.28), spin: rnd(-1.2, 1.2), age: 0 };
      if (elapsed > T.zigAfter && Math.min(Math.abs(l - g), Math.abs(l - (g + gw - 1))) >= 2 && Math.random() < .4) { o.bx = o.x; o.zig = 1; o.w = rnd(2.2, 3.2); o.ph = rnd(0, 6); o.amp = laneW * .55; }
      obstacles.push(o);
    }
    if (pickupT <= 0 && !shield) { pickups.push({ x: (g + gw / 2) * laneW, y: -size - 14, speed: sp, r: 16 * s }); pickupT = rnd(14, 20); }
  }
  function spawnDiag() {
    const size = lsize() * 1.1, left = Math.random() < .5, sp = speedNow() * .8;
    obstacles.push({ x: left ? -size : W + size, y: rnd(H * .05, H * .35), size, speed: sp * .55, vx: (left ? 1 : -1) * sp * rnd(.45, .7), rot: 0, spin: left ? 2.5 : -2.5, age: 0 });
  }

  /* vorm van Wapperman: één bron voor tekenen EN botsen (armen tellen mee!) */
  function geom(px, gy, t, d) {
    const k = 1 - d, bh = (92 - 50 * d) * s, sw = f => Math.sin(t * 5.5 + f * 2.2) * 7 * s * k * f + d * 12 * s * f * f;
    const sy = gy - bh * .88, sx = px + sw(.88), arms = [];
    for (const side of [-1, 1]) {
      const ph = side > 0 ? 0 : 1.7, fl = Math.sin(t * 9 + ph) * k, a = lerp(1.35 + fl * .85, 2.9, d), L = (50 - 8 * d) * s;
      const dx = side * Math.sin(a), dy = -Math.cos(a), ex = sx + dx * L, ey = sy + dy * L;
      const off = (Math.sin(t * 9 + ph + 1) * 10 * k + 7 * d) * s * side, mx = (sx + ex) / 2 - dy * off, my = (sy + ey) / 2 + dx * off, p = [];
      for (let i = 0; i <= 12; i++) { const u = i / 12, v = 1 - u; p.push([v * v * sx + 2 * v * u * mx + u * u * ex, v * v * sy + 2 * v * u * my + u * u * ey]); }
      arms.push(p);
    }
    const hx = px + sw(1), hy = gy - bh - 18 * s * (1 - .3 * d);
    const parts = [[px + sw(.2), gy - bh * .2, 13 * s], [px + sw(.55), gy - bh * .55, 14 * s], [hx, hy, 17 * s]];
    for (const p of arms) for (let i = 2; i < p.length; i++) parts.push([p[i][0], p[i][1], 4.5 * s]);
    return { bh, sw, sy, sx, arms, hx, hy, parts };
  }
  function gapTo(ox, oy, or, G) { let m = 1e9; for (const [px, py, pr] of G.parts) { const g = Math.hypot(ox - px, oy - py) - or - pr; if (g < m) m = g; } return m; }

  function update(dt) {
    elapsed += dt; setScoreIfChanged();
    const dir = touchDir || keyDir; let want = 0;
    if (dir) want = dir * maxV; else if (mouseX !== null) want = clamp((mouseX - x) * 10, -maxV, maxV);
    vel += (want - vel) * Math.min(1, 18 * dt); x = clamp(x + vel * dt, 30 * s, W - 30 * s);
    const G = geom(x, groundY, clock, 0);
    spawnT -= dt; pickupT -= dt; diagT -= dt;
    if (spawnT <= 0) { spawnRow(); spawnT += intervalNow(); }
    if (elapsed > T.diagAfter && diagT <= 0) { spawnDiag(); diagT = rnd(3.5, 6) - Math.min(2, elapsed / 60); }
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const o = obstacles[i]; o.age += dt; o.y += o.speed * dt; o.rot += o.spin * dt;
      if (o.zig) o.x = o.bx + Math.sin(o.age * o.w + o.ph) * o.amp;
      if (o.vx) o.x += o.vx * dt;
      if (inv <= 0) {
        const g = gapTo(o.x, o.y, o.size * .4, G);
        if (g < 0) {
          if (shield) { shield = 0; inv = 1; burst(o.x, o.y, 18); pop("SCHILD WEG", x, groundY - 130 * s, 18, BLUE); beep(180, .25, "sawtooth", .07, -120); obstacles.splice(i, 1); continue; }
          crash(G); return;
        }
        if (g < T.nearPx) o.near = true;
      }
      if (o.near && !o.paid && o.y > groundY - 50 * s) { o.paid = true; bonus += T.nearBonus; pop("+" + T.nearBonus, x, groundY - 140 * s, 16, BLUE); beep(900, .04, "triangle", .04); }
      if (o.y > groundY + 20 * s || o.x < -90 || o.x > W + 90) { dodged++; obstacles.splice(i, 1); }
    }
    for (let i = pickups.length - 1; i >= 0; i--) {
      const p = pickups[i]; p.y += p.speed * dt;
      if (gapTo(p.x, p.y, p.r, G) < 0) { shield = 1; burst(p.x, p.y, 10); pop("SCHILD!", x, groundY - 130 * s, 20, BLUE); beep(520, .09, "square", .05, 500); pickups.splice(i, 1); }
      else if (p.y > groundY + 20 * s) pickups.splice(i, 1);
    }
    inv = Math.max(0, inv - dt);
    const n = Math.floor(score / T.nightEvery) % 2 === 1;
    if (n !== night) { night = n; root.classList.toggle("night", n); flash = .3; }
    while (score >= nextMile) {
      pop(String(nextMile), W / 2, H * .3, 54); flash = .25; beep(660, .07, "square", .05); setTimeout(() => beep(880, .1, "square", .05), 80);
      if (typeof ACTS !== "undefined" && ACTS.length) pop(ACTS[(Math.random() * ACTS.length) | 0].name, W / 2, H * .3 + 40, 18);
      nextMile += T.mile;
    }
    if (!recShown && bestAtStart > 0 && score > bestAtStart) { recShown = true; pop("NIEUW RECORD!", W / 2, H * .42, 26, BLUE); beep(880, .12, "square", .05, 400); }
  }
  function setScoreIfChanged() { const n = Math.floor(elapsed * 10) + bonus; if (n !== score) setScore(n); }
  function crash(G) {
    state = "hit"; hitT = 0; shakeT = reduced ? 0 : .3; isRec = score > bestAtStart && score > 0;
    best = Math.max(best, score); store.set(BEST_KEY, best); burst(x, groundY - 60 * s, 30);
    beep(300, .35, "sawtooth", .08, -260); try { navigator.vibrate && navigator.vibrate(140); } catch {}
  }

  /* ---------- tekenen ---------- */
  function poly(p, from, color, lw) {
    cx.strokeStyle = color; cx.lineWidth = lw; cx.lineCap = cx.lineJoin = "round"; cx.beginPath();
    cx.moveTo(p[from][0], p[from][1]); for (let i = from + 1; i < p.length; i++) cx.lineTo(p[i][0], p[i][1]); cx.stroke();
  }
  function star(px, py, r) { cx.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; cx.lineTo(px + Math.cos(a) * rr, py + Math.sin(a) * rr); } cx.closePath(); cx.fill(); }
  function wapper(px, gy, t, d, P) {
    const G = geom(px, gy, t, d), { bh, sw } = G, INK = P.ink, PAPER = P.paper;
    cx.fillStyle = P.base; cx.fillRect(px - 20 * s, gy, 40 * s, 9 * s);
    cx.fillStyle = INK; cx.beginPath(); const N = 8;
    for (let i = 0; i <= N; i++) { const f = i / N, w = (15 - 4 * f) * s, bx = px + sw(f) - w, by = gy - bh * f; i ? cx.lineTo(bx, by) : cx.moveTo(bx, by); }
    for (let i = N; i >= 0; i--) { const f = i / N, w = (15 - 4 * f) * s; cx.lineTo(px + sw(f) + w, gy - bh * f); }
    cx.closePath(); cx.fill();
    if (d < .5) { cx.save(); cx.translate(px + sw(.5), gy - bh * .5); cx.rotate(-Math.PI / 2); cx.fillStyle = PAPER; cx.font = `800 ${9 * s}px sans-serif`; cx.textAlign = "center"; cx.textBaseline = "middle"; cx.fillText("left of the dial", 0, 0); cx.restore(); }
    for (const p of G.arms) { poly(p, 0, INK, 17 * s); poly(p, 4, PAPER, 12 * s); }
    cx.save(); cx.translate(G.hx, G.hy); cx.rotate(d * .7 + Math.sin(t * 6) * .07 * (1 - d));
    cx.beginPath(); cx.ellipse(0, 0, 20 * s, 25 * s, 0, 0, 7); cx.fillStyle = PAPER; cx.fill();
    cx.save(); cx.clip();
    cx.fillStyle = BLUE; cx.beginPath(); cx.moveTo(-30 * s, -30 * s); cx.lineTo(30 * s, -30 * s); cx.lineTo(30 * s, -3 * s);
    cx.quadraticCurveTo(14 * s, -9 * s, 0, -3 * s); cx.quadraticCurveTo(-14 * s, -9 * s, -30 * s, -3 * s); cx.closePath(); cx.fill();
    cx.fillStyle = INK;
    for (const e of [-1, 1]) { cx.beginPath(); cx.ellipse(e * 8 * s, -6 * s, 5.5 * s, 7 * s, e * .3, 0, 7); cx.fill(); }
    cx.beginPath(); cx.moveTo(0, 3 * s); cx.lineTo(-3 * s, 10 * s); cx.lineTo(3 * s, 10 * s); cx.closePath(); cx.fill();
    cx.fillRect(-11 * s, 13 * s, 22 * s, 8 * s); cx.strokeStyle = PAPER; cx.lineWidth = 1.6 * s;
    for (let i = -1; i <= 1; i++) { cx.beginPath(); cx.moveTo(i * 5 * s, 13 * s); cx.lineTo(i * 5 * s, 21 * s); cx.stroke(); }
    if (d > .4) { cx.strokeStyle = PAPER; cx.lineWidth = 2 * s; for (const e of [-1, 1]) { cx.beginPath(); cx.moveTo(e * 8 * s - 3 * s, -9 * s); cx.lineTo(e * 8 * s + 3 * s, -3 * s); cx.moveTo(e * 8 * s + 3 * s, -9 * s); cx.lineTo(e * 8 * s - 3 * s, -3 * s); cx.stroke(); } }
    cx.restore();
    cx.lineWidth = 3 * s; cx.strokeStyle = INK; cx.beginPath(); cx.ellipse(0, 0, 20 * s, 25 * s, 0, 0, 7); cx.stroke();
    cx.restore();
  }
  function draw() {
    const P = night ? PAL.night : PAL.day;
    cx.save(); cx.fillStyle = P.bg; cx.fillRect(0, 0, W, H);
    if (shakeT > 0) cx.translate(rnd(-5, 5), rnd(-5, 5));
    cx.strokeStyle = P.lane; cx.lineWidth = 2; const off = (clock * 120) % 60;
    for (let i = 1; i < lanes; i++) { cx.beginPath(); cx.setLineDash([14, 46]); cx.lineDashOffset = -off; cx.moveTo(i * laneW, 0); cx.lineTo(i * laneW, H); cx.stroke(); }
    cx.setLineDash([]);
    cx.fillStyle = P.ink; cx.fillRect(0, groundY + 9 * s, W, 4); cx.fillStyle = P.gfill; cx.fillRect(0, groundY + 13 * s, W, H);
    const spr = night ? sprites[1] : sprites[0];
    for (const o of obstacles) { cx.save(); cx.translate(o.x, o.y); cx.rotate(o.rot); cx.drawImage(spr, -o.size / 2, -o.size / 2, o.size, o.size); cx.restore(); }
    for (const p of pickups) { cx.fillStyle = BLUE; cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 7); cx.fill(); cx.strokeStyle = "#fff"; cx.lineWidth = 2.5; cx.beginPath(); cx.arc(p.x, p.y, p.r - 3, 0, 7); cx.stroke(); cx.fillStyle = "#fff"; star(p.x, p.y, p.r * .6); }
    if (inv > 0 && state === "playing") cx.globalAlpha = Math.floor(clock * 14) % 2 ? .35 : 1;
    wapper(x, groundY, clock, def, P); cx.globalAlpha = 1;
    if (shield && state === "playing") { cx.strokeStyle = BLUE; cx.lineWidth = 3; cx.globalAlpha = .6 + Math.sin(clock * 8) * .3; cx.beginPath(); cx.ellipse(x, groundY - 62 * s, 58 * s, 84 * s, 0, 0, 7); cx.stroke(); cx.globalAlpha = 1; }
    for (const p of particles) { cx.fillStyle = p.c; cx.globalAlpha = 1 - p.t / p.life; cx.fillRect(p.x - p.r / 2, p.y - p.r / 2, p.r, p.r); cx.strokeStyle = P.ink; cx.lineWidth = 1; cx.strokeRect(p.x - p.r / 2, p.y - p.r / 2, p.r, p.r); }
    cx.globalAlpha = 1; cx.textAlign = "center"; cx.textBaseline = "middle";
    for (const p of pops) { cx.globalAlpha = Math.min(1, (p.life - p.t) * 2.5); cx.font = `900 ${p.size}px "Arial Black",Arial,sans-serif`; cx.lineWidth = 4; cx.strokeStyle = P.paper; cx.strokeText(p.txt, p.x, p.y - p.t * 30); cx.fillStyle = p.col || P.ink; cx.fillText(p.txt, p.x, p.y - p.t * 30); }
    cx.globalAlpha = 1;
    if (flash > 0) { cx.fillStyle = `rgba(0,0,255,${Math.min(.3, flash)})`; cx.fillRect(0, 0, W, H); }
    cx.restore();
  }
  function fx(dt) {
    for (let i = particles.length - 1; i >= 0; i--) { const p = particles[i]; p.t += dt; p.vy += 700 * dt; p.x += p.vx * dt; p.y += p.vy * dt; if (p.t > p.life) particles.splice(i, 1); }
    for (let i = pops.length - 1; i >= 0; i--) { pops[i].t += dt; if (pops[i].t > pops[i].life) pops.splice(i, 1); }
    if (shakeT > 0) shakeT -= dt; if (flash > 0) flash -= dt;
  }
  function loop(ts) {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(.05, (ts - (last || ts)) / 1000); last = ts; clock += dt;
    if (state === "playing") update(dt);
    else if (state === "hit") { hitT += dt; def = Math.min(1, hitT / .9); if (hitT >= .9) gameOver(); }
    fx(dt); draw();
  }

  /* ---------- schermen ---------- */
  function showT(html, bind) { show(tr(html), bind); }
  function show(html, bind) { ov.innerHTML = `<div class="wg-card">${html}</div>`; ov.classList.add("on"); ov.scrollTop = 0; if (bind) bind(); }
  function hide() { ov.classList.remove("on"); ov.innerHTML = ""; }
  function on(sel, fn) { const el = ov.querySelector(sel); if (el) el.addEventListener("click", () => { if (performance.now() < lock) return; fn(el); }); }
  function showStart() {
    state = "start"; bestEl.textContent = "Record " + best;
    showT(`<h2>Wapperman</h2><p>Ontwijk de logo's, ook met je armen. Pak de blauwe ster voor een schild. Houd links of rechts op je scherm ingedrukt. Op desktop: muis of pijltjestoetsen.</p><button class="wg-btn" id="a">Start</button><button class="wg-btn alt" id="b">Top 10</button>`,
      () => { on("#a", start); on("#b", () => showTop()); });
  }
  function gameOver() {
    state = "over"; lock = performance.now() + 600; bestEl.textContent = "Record " + best;
    showT(`<h2>${isRec ? "Nieuw record!" : "Af!"}</h2><p>Score <b>${score}</b> · Record <b>${best}</b><br>Logo's ontweken: <b>${dodged}</b></p><p class="wg-q" id="qm"></p><div id="sbox"><input id="n" maxlength="16" placeholder="Naam" autocomplete="off" enterkeyhint="done" aria-label="Naam"><button class="wg-btn" id="sv" disabled>Opslaan in Top 10</button></div><button class="wg-btn alt" id="r">Opnieuw spelen</button><button class="wg-btn alt" id="t">Bekijk Top 10</button>`, () => {
      const n = ov.querySelector("#n"), sv = ov.querySelector("#sv"), qm = ov.querySelector("#qm"), box = ov.querySelector("#sbox");
      n.value = store.get("lotd-wapperman-name") || ""; sv.disabled = !n.value.trim();
      n.addEventListener("input", () => { sv.disabled = !n.value.trim(); });
      n.addEventListener("keydown", e => { if (e.key === "Enter" && !sv.disabled) sv.click(); });
      on("#r", start); on("#t", () => showTop());
      on("#sv", async () => {
        const name = n.value.trim().slice(0, 16); if (!name) return; sv.disabled = true; store.set("lotd-wapperman-name", name);
        const res = await leaderboard.submitScore(name, score); showTop({ name, score }, res);
      });
      leaderboard.getTopScores().then(({ list }) => {         // haal je de Top 10? zo niet, dan geen naamveld
        if (state !== "over") return; const need = list.length >= 10 ? list[9].score : -1;
        if (score > need) qm.textContent = Lg("Je haalt de Top 10! Vul je naam in.", "You made the Top 10! Enter your name.");
        else { box.style.display = "none"; qm.innerHTML = Lg(`Net niet in de Top 10. Je mist nog <b>${need - score + 1}</b> punten.`, `Just missed the Top 10. You need <b>${need - score + 1}</b> more points.`); }
      });
    });
  }
  async function showTop(me, res) {
    state = "top"; lock = performance.now() + 250;
    showT(`<h2>Top 10</h2><p>Laden…</p>`);
    const { list, source } = await leaderboard.getTopScores(); if (state !== "top") return;
    const note = res && res.queued ? Lg("Geen verbinding: je score wordt later verstuurd.", "No connection: your score will be sent later.") + (leaderboard.err() ? " [" + leaderboard.err() + "]" : "")
      : source === "local" ? Lg("Let op: deze scores staan alleen op dit apparaat.", "Note: these scores are stored on this device only.")
      : source === "cache" ? Lg("Offline: laatst bekende stand.", "Offline: last known standings.") : "";
    const mark = me ? list.findIndex(r => r.name.toLowerCase() === me.name.toLowerCase() && r.score === me.score) : -1;
    const rows = list.map((r, i) => `<li class="${i === mark ? "me" : ""}"><i>${i + 1}</i><span>${esc(r.name)}</span><b>${r.score}</b></li>`).join("") || `<li><span>${Lg("Nog geen scores", "No scores yet")}</span></li>`;
    show(`<h2>Top 10</h2>${note ? `<p class="wg-note">${note}</p>` : ""}<ol>${rows}</ol>` + tr(`<button class="wg-btn" id="a">Spelen</button>${source === "cache" ? '<button class="wg-btn alt" id="rt">Opnieuw proberen</button>' : ""}<button class="wg-btn alt" id="b">Terug</button>`),
      () => { on("#a", start); on("#rt", () => showTop(me)); on("#b", showStart); });
  }

  /* ---------- invoer ---------- */
  function steer(e) { const r = cv.getBoundingClientRect(); touchDir = e.clientX < r.left + r.width / 2 ? -1 : 1; }
  function onDown(e) {
    if (state !== "playing" || e.target.closest(".wg-btns")) return;
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
      showT(`<h2>Pauze</h2><button class="wg-btn" id="a">Verder</button>`, () => on("#a", () => { hide(); last = 0; state = "playing"; }));
    }
  }

  /* ---------- mount ---------- */
  function mount() {
    if (root) return;
    if (!document.getElementById("wg-style")) { const st = document.createElement("style"); st.id = "wg-style"; st.textContent = CSS; document.head.appendChild(st); }
    root = document.createElement("div"); root.className = "wg";
    root.innerHTML = `<canvas></canvas><div class="wg-hud"><div><div class="wg-score">0</div><div class="wg-best"></div></div><div class="wg-btns"><button class="wg-snd" aria-label="Geluid"></button><button class="wg-x" aria-label="Sluiten">✕</button></div></div><div class="wg-ov"></div>`;
    document.body.appendChild(root);
    cv = root.querySelector("canvas"); cx = cv.getContext("2d"); scoreEl = root.querySelector(".wg-score"); bestEl = root.querySelector(".wg-best"); ov = root.querySelector(".wg-ov"); sndEl = root.querySelector(".wg-snd");
    prevOverflow = [document.documentElement.style.overflow, document.body.style.overflow];
    document.documentElement.style.overflow = document.body.style.overflow = "hidden";
    sprites = [makeSprite(false), makeSprite(true)]; mouseX = null; keyDir = touchDir = 0; active = null; last = 0; x = 0; obstacles = []; pickups = []; particles = []; pops = []; def = 0; night = false;
    sndEl.textContent = muted ? "🔇" : "🔊";
    sndEl.addEventListener("click", () => { muted = !muted; store.set(MUTE_KEY, muted ? "1" : "0"); sndEl.textContent = muted ? "🔇" : "🔊"; if (!muted) beep(660, .06); });
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
