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
  const LOGO = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lotd-logo-ZT0NXLfkMhqMtDx3563rts4EYOOP5N.png";
  const WAPPER = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wapperman-R4qXDHgnZRhjPaSZ6E2qybqlZnXLLe.webp";
  let canvas, ctx, raf, last, state = "start", score = 0, best = Number(localStorage.getItem("lotd-wapperman-best") || 0);
  let x = 0, target = 0, velocity = 0, elapsed = 0, spawn = 0, obstacles = [], keys = { left: false, right: false }, touchDir = 0;
  const logo = new Image(); logo.crossOrigin = "anonymous"; logo.src = LOGO;
  const mascot = new Image(); mascot.crossOrigin = "anonymous"; mascot.src = WAPPER;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
  const $ = id => document.getElementById(id);
  function view() { return `<section class="game" aria-label="Wapperman game"><div class="game-head"><span class="game-title">Wapperman</span><span class="game-score" id="game-score">0</span></div><canvas id="wapper-canvas" tabindex="0"></canvas><div class="game-help">Houd links of rechts ingedrukt om te bewegen</div><div id="game-overlay" class="game-overlay"></div></section>`; }
  function mount() { $("main").innerHTML = view(); canvas = $("wapper-canvas"); ctx = canvas.getContext("2d"); resize(); bind(); showStart(); if (!raf) raf = requestAnimationFrame(loop); }
  function resize() { if (!canvas) return; const r = canvas.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1); canvas.width = r.width * d; canvas.height = r.height * d; ctx.setTransform(d,0,0,d,0,0); if (!x) x = r.width / 2; target = Math.max(45, Math.min(r.width - 45, target || x)); }
  function bind() { window.addEventListener("resize", resize, { passive: true }); canvas.addEventListener("pointerdown", e => { e.preventDefault(); if (state !== "playing") { start(); return; } touchDir = e.offsetX < canvas.clientWidth / 2 ? -1 : 1; }); canvas.addEventListener("pointermove", e => { if (state === "playing" && e.pointerType === "mouse") target = e.offsetX; }); window.addEventListener("pointerup", () => touchDir = 0); window.addEventListener("keydown", e => { if (["ArrowLeft","a","A"].includes(e.key)) keys.left = true; if (["ArrowRight","d","D"].includes(e.key)) keys.right = true; if (e.key === "Enter" && state === "gameover") start(); }); window.addEventListener("keyup", e => { if (["ArrowLeft","a","A"].includes(e.key)) keys.left = false; if (["ArrowRight","d","D"].includes(e.key)) keys.right = false; }); }
  function showStart() { overlay(`<h2>Wapperman</h2><p>Dodge de Left of the Dial-logo's en blijf zo lang mogelijk overeind.</p><strong>Tik om te starten</strong><button data-top>Top 10</button>`); }
  function overlay(html) { $("game-overlay").innerHTML = html; $("game-overlay").onclick = e => { if (e.target.dataset.top) showTop(); else if (state === "start") start(); else if (e.target.dataset.save) save(); else if (e.target.dataset.retry) start(); }; }
  function start() { state = "playing"; score = 0; elapsed = 0; spawn = 0; obstacles.length = 0; x = canvas.clientWidth / 2; target = x; $("game-overlay").innerHTML = ""; canvas.focus(); }
  function spawnLogo() { const w = canvas.clientWidth, size = 42 + Math.random() * 22; obstacles.push({ x: size / 2 + Math.random() * (w - size), y: -size, size, speed: 110 + Math.min(110, elapsed * 3) + Math.random() * 55, rot: (Math.random()-.5)*.5 }); }
  function hit(o) { const dx = o.x - x, dy = o.y - (canvas.clientHeight - 74); return dx*dx + dy*dy < Math.pow(o.size * .45 + 27, 2); }
  function update(dt) { elapsed += dt; score = Math.floor(elapsed * 10); $("game-score").textContent = score; const w = canvas.clientWidth; let dir = touchDir || (keys.left ? -1 : keys.right ? 1 : 0); if (dir) target += dir * 300 * dt; target = Math.max(32, Math.min(w - 32, target)); velocity += (target - x) * 8 * dt; velocity *= Math.pow(.001, dt); x += velocity * dt; x = Math.max(32, Math.min(w - 32, x)); spawn -= dt; const rate = Math.max(.36, .9 - elapsed * .008); if (spawn <= 0) { spawnLogo(); spawn = rate; } for (let i = obstacles.length - 1; i >= 0; i--) { const o = obstacles[i]; o.y += o.speed * dt; if (hit(o)) { state = "hit"; if (navigator.vibrate) navigator.vibrate(120); setTimeout(gameOver, 850); return; } if (o.y > canvas.clientHeight + 80) obstacles.splice(i,1); } }
  function draw() { const w = canvas.clientWidth, h = canvas.clientHeight; ctx.clearRect(0,0,w,h); ctx.fillStyle="#fff"; ctx.fillRect(0,0,w,h); ctx.strokeStyle="#111"; ctx.lineWidth=2; for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(i*w/4,0);ctx.lineTo(i*w/4,h);ctx.strokeStyle="#eee";ctx.stroke();} obstacles.forEach(o=>{ctx.save();ctx.translate(o.x,o.y);ctx.rotate(o.rot);if(logo.complete)ctx.drawImage(logo,-o.size/2,-o.size/2,o.size,o.size);else{ctx.fillStyle="#111";ctx.beginPath();ctx.arc(0,0,o.size/2,0,Math.PI*2);ctx.fill();}ctx.restore();}); const bob=state==="hit"?20:Math.sin(elapsed*7)*5, bodyY=h-72+bob; ctx.save(); ctx.translate(x,bodyY); ctx.fillStyle="#111"; ctx.beginPath();ctx.ellipse(0,12,27,state==="hit"?25:40,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#0000ff";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-20,-4);ctx.quadraticCurveTo(-48,Math.sin(elapsed*8)*18-26,-64,-8);ctx.moveTo(20,-4);ctx.quadraticCurveTo(48,Math.sin(elapsed*8+1)*18-26,64,-8);ctx.stroke();ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(0,-33,25,0,Math.PI*2);ctx.fill();ctx.fillStyle="#0000ff";ctx.beginPath();ctx.arc(-9,-35,5,0,Math.PI*2);ctx.arc(9,-35,5,0,Math.PI*2);ctx.fill();ctx.restore(); }
  function loop(t) { const dt = Math.min(.05, (t-(last||t))/1000); last=t; if(state === "playing") update(dt); draw(); raf=requestAnimationFrame(loop); }
  function gameOver() { if(state !== "hit") return; state="gameover"; best=Math.max(best,score); localStorage.setItem("lotd-wapperman-best",best); overlay(`<h2>Game over</h2><p>Score <b>${score}</b> · Persoonlijk record <b>${best}</b></p><input id="score-name" maxlength="16" placeholder="Naam (optioneel)" aria-label="Naam (optioneel)"><button data-save disabled>Opslaan</button><button data-retry>Opnieuw spelen</button>`); const input=$("score-name"), saveBtn=document.querySelector("[data-save]"); input.oninput=()=>saveBtn.disabled=!input.value.trim(); }
  async function save() { const input=$("score-name"); if(!input.value.trim()) return; await leaderboard.submitScore(input.value,score); showTop(); }
  async function showTop() { state="top"; const scores=await leaderboard.getTopScores(); overlay(`<h2>Top 10</h2><ol class="game-top">${scores.map(s=>`<li><span>${esc(s.name)}</span><b>${s.score}</b></li>`).join("") || "<li>Nog geen scores</li>"}</ol><button data-retry>Opnieuw spelen</button>`); }
  window.WappermanGame = { mount };
})();
