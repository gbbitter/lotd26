/* Wapperman v5 – combo, bands ontdekken, wind/regen-golven, slow-mo, gedeelde topscores.
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

  const EN = { "Ontwijk de logo's, ook met je armen. Pak de blauwe ster voor een schild. Houd links of rechts op je scherm ingedrukt. Op desktop: muis of pijltjestoetsen.": "Dodge the logos, arms included. Grab the blue star for a shield. Hold the left or right side of your screen. On desktop: mouse or arrow keys.", "Nieuw record!": "New record!", "Af!": "Game over!", "Logo's ontweken:": "Logos dodged:", "Opnieuw spelen": "Play again", "Naam": "Name", "Laden…": "Loading…", "Opnieuw proberen": "Try again", "Opslaan in Top 10": "Save to Top 10", "Bekijk Top 10": "View Top 10", "Nog geen scores": "No scores yet", "Spelen": "Play", "Terug": "Back", "Pauze": "Paused", "Verder": "Resume", "SCHILD WEG": "SHIELD GONE", "SCHILD!": "SHIELD!", "NIEUW RECORD!": "NEW RECORD!", "Ontwijk de logo's, ook met je armen. Houd links of rechts op je scherm ingedrukt. Pak de ster voor een schild, de radio-dial voor slow-mo en de vinyls om bands te ontdekken. Dicht langs een logo geeft combo-punten.": "Dodge the logos, arms included. Hold the left or right side of the screen. Grab the star for a shield, the radio dial for slow-mo and the records to discover bands. Near misses build a combo.", "Desktop: muis of pijltjestoetsen.": "Desktop: mouse or arrow keys.", "Houd links of rechts op je scherm ingedrukt. Pak de ster voor een schild, de radio-dial voor slow-mo en de vinyls om bands te ontdekken. Dicht langs een logo geeft combo-punten.": "Hold the left or right side of the screen. Grab the star for a shield, the radio dial for slow-mo and the records to discover bands. Near misses build a combo.", "Max combo:": "Max combo:", "Bands ontdekt": "Bands discovered", "Tik op een band voor info": "Tap a band for info", "Deel je score": "Share your score", "COMBO WEG": "COMBO LOST", "DIAL: SLOW-MO": "DIAL: SLOW-MO", "WIND ←": "WIND ←", "WIND →": "WIND →", "REGEN!": "RAIN!", "OVERLEEFD +25": "SURVIVED +25", "Gekopieerd": "Copied" };
  const curLang = () => window.LOTD_LANG || store.get("lotd-lang") || "nl";
  const Lg = (nl, en) => curLang() === "en" ? en : nl;
  const tr = s => { if (curLang() !== "en") return s; let o = String(s); for (const k in EN) o = o.split(k).join(EN[k]); return o; };
  const rnd = (a, b) => a + Math.random() * (b - a), clamp = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t;

  /* ===== TUNING: pas hier de moeilijkheid aan ===== */
  const T = {
    speedStart: 210, speedGain: 6.2, speedMax: 460,   // valsnelheid (px/s) = start + min(max, tijd*gain)
    rowStart: .95, rowGain: .011, rowMin: .30,        // seconden tussen rijen logo's
    fillStart: .35, fillGain: .009, fillMax: .8,      // kans dat een baan (buiten de opening) gevuld is
    zigAfter: 25, diagAfter: 28,                      // vanaf welke seconde zigzag- en diagonale logo's komen
    nearPx: 10, nearBonus: 5,                         // "net gemist" marge en bonuspunten
    mile: 250,                                        // mijlpaal (punten); podia wisselen bij 500/1000/1500/2250
    comboWindow: 4.5, comboStep: 3, comboMax: 5,      // combo: seconden om door te gaan, acties per niveau, max vermenigvuldiger
    slowScale: .55, slowTime: 5,                      // radio-dial: tempo en duur
    tokenPts: 10, tokenEvery: [6, 9],                 // vinyl (band ontdekken): punten en interval (s)
    eventFirst: 32, eventMin: 26, eventMax: 38,       // eerste golf (wind/regen) en tijd tussen golven (s)
    windPush: .3, windTime: 5, regenTime: 4.5, warnTime: 1.7
  };
  /* podia: elke festivaldag een eigen kleur (vervangt de oude dag/nacht-wissel) */
  const STAGES = [["Woensdag", "Wednesday", 0], ["Donderdag", "Thursday", 500], ["Vrijdag", "Friday", 1000], ["Zaterdag", "Saturday", 1500], ["Afterparty", "Afterparty", 2250]];
  const PALS = [
    { bg: "#ffffff", ink: "#141414", paper: "#ffffff", lane: "#ececf1", floor: "#f3f3f7", crowd: "#d9d9e2", acc: "#1717ff", dark: false },
    { bg: "#eef0ff", ink: "#141414", paper: "#ffffff", lane: "#dce1ff", floor: "#dde3ff", crowd: "#b9c4ff", acc: "#1717ff", dark: false },
    { bg: "#1717ff", ink: "#ffffff", paper: "#1717ff", lane: "rgba(255,255,255,.16)", floor: "#0f0fd6", crowd: "#3c3cff", acc: "#ffffff", dark: true },
    { bg: "#141414", ink: "#ffffff", paper: "#141414", lane: "#2a2a2e", floor: "#1c1c20", crowd: "#2e2e36", acc: "#7d8bff", dark: true },
    { bg: "#07070c", ink: "#ffffff", paper: "#07070c", lane: "#1a1a2c", floor: "#0e0e1a", crowd: "#22224a", acc: "#8f9cff", dark: true, beams: true }
  ];
  /* skins: vrij te spelen met sterren (missies), record of platenkast */
  const SKINS = [
    { id: "classic", nl: "Klassiek", en: "Classic", body: null, arm: null, band: "#1717ff", need: () => true, how: ["Altijd beschikbaar", "Always available"] },
    { id: "electric", nl: "Electric", en: "Electric", body: "#1717ff", arm: "#ffffff", band: "#141414", need: P => P.stars >= 3, how: ["3 sterren uit missies", "3 stars from missions"] },
    { id: "interessant", nl: "Interessant", en: "Interesting", body: "#8fa0ff", arm: "#ffffff", band: "#141414", need: P => P.stars >= 6, how: ["6 sterren uit missies", "6 stars from missions"] },
    { id: "doek", nl: "Wit doek", en: "White sheet", body: "#ffffff", arm: "#1717ff", band: "#1717ff", need: (P, b) => b >= 1000, how: ["Record van 1000+", "Record of 1000+"] },
    { id: "platen", nl: "Platenkast", en: "Record crate", body: "#141414", arm: "#c6d0ff", band: "#c6d0ff", vinyl: true, need: P => P.crate.length >= 25, how: ["25 bands in je platenkast", "25 bands in your crate"] },
    { id: "after", nl: "Afterparty", en: "Afterparty", body: "#0b0b14", arm: "#8f9cff", band: "#ff3d9a", glow: true, need: (P, b) => b >= 2250, how: ["Haal de Afterparty (2250)", "Reach the Afterparty (2250)"] }
  ];
  /* missies: elke dag 3 nieuwe, allemaal ‘in één potje’ */
  const MISSIONS = [
    { k: "dodged", v: [40, 80, 140], nl: n => `Ontwijk ${n} logo's`, en: n => `Dodge ${n} logos` },
    { k: "mult", v: [3, 4, 5], nl: n => `Haal combo x${n}`, en: n => `Reach combo x${n}` },
    { k: "found", v: [2, 4, 6], nl: n => `Ontdek ${n} bands`, en: n => `Discover ${n} bands` },
    { k: "waves", v: [1, 2, 3], nl: n => `Overleef ${n} ${n > 1 ? "golven" : "golf"} wind of regen`, en: n => `Survive ${n} wind or rain ${n > 1 ? "waves" : "wave"}` },
    { k: "score", v: [300, 700, 1200], nl: n => `Scoor ${n} punten`, en: n => `Score ${n} points` },
    { k: "nears", v: [8, 15, 25], nl: n => `${n} keer net gemist`, en: n => `${n} near misses` },
    { k: "shields", v: [1, 2, 3], nl: n => `Pak ${n} ${n > 1 ? "schilden" : "schild"}`, en: n => `Grab ${n} ${n > 1 ? "shields" : "shield"}` },
    { k: "stage", v: [1, 2, 3], nl: n => `Haal ${STAGES[n][0]}`, en: n => `Reach ${STAGES[n][1]}` }
  ];
  const FONT_D = '"Barlow Condensed","Arial Narrow",Arial,sans-serif', FONT_B = '"Barlow",Arial,sans-serif';
  const CSS = `
.wg{position:fixed;inset:0;z-index:2000;background:#fff;color:#141414;touch-action:manipulation;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;overscroll-behavior:none;font-family:"Barlow",Arial,sans-serif;transition:background .5s}
.wg.dark{background:#141414;color:#fff}
.wg canvas{display:block;margin:0 auto;touch-action:none;box-shadow:-1px 0 0 rgba(20,20,20,.1),1px 0 0 rgba(20,20,20,.1)}
.wg-hud{position:absolute;left:0;right:0;top:0;padding:calc(10px + env(safe-area-inset-top,0px)) 12px 0;display:grid;grid-template-columns:1fr auto 1fr;align-items:start;gap:8px;pointer-events:none;max-width:560px;margin:0 auto}
.wg-score{font:800 52px/.88 "Barlow Condensed","Arial Narrow",Arial,sans-serif;font-variant-numeric:tabular-nums;letter-spacing:-.01em}
.wg-rec{display:flex;align-items:center;gap:7px;margin-top:7px}
.wg-best{white-space:nowrap;font:600 11px/1 "Barlow",Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase;opacity:.7}
.wg-recbar{display:block;width:56px;height:4px;border-radius:2px;background:rgba(20,20,20,.12);overflow:hidden}.wg.dark .wg-recbar{background:rgba(255,255,255,.2)}
.wg-recbar b{display:block;height:100%;width:0;background:#1717ff;transition:width .2s}.wg.dark .wg-recbar b{background:#fff}
.wg-recbar.done b{background:#ff3d9a}
.wg-combo{margin-top:8px;min-height:26px}
.wg-combo span{display:inline-block;background:#1717ff;color:#fff;font:800 16px/1 "Barlow Condensed",Arial,sans-serif;letter-spacing:.03em;padding:5px 8px 4px;border-radius:3px}.wg.dark .wg-combo span{background:#fff;color:#1717ff}
.wg-combo i{display:block;width:74px;height:3px;margin-top:3px;background:#1717ff;transform-origin:left;border-radius:2px}.wg.dark .wg-combo i{background:#fff}
.wg-mid{display:flex;flex-direction:column;align-items:center;gap:6px;padding-top:2px}
.wg-stage{font:700 12px/1 "Barlow",Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;background:#141414;color:#fff;padding:6px 9px 5px;border-radius:3px;white-space:nowrap}.wg.dark .wg-stage{background:#fff;color:#141414}
.wg-pw{display:flex;gap:4px}.wg-pw span{font:700 11px/1 "Barlow",Arial,sans-serif;letter-spacing:.04em;background:#1717ff;color:#fff;padding:5px 7px;border-radius:3px;white-space:nowrap}.wg.dark .wg-pw span{background:#fff;color:#1717ff}
.wg-btns{display:flex;gap:6px;pointer-events:auto;justify-self:end}
.wg-x,.wg-snd{width:44px;height:44px;border:1px solid rgba(20,20,20,.16);background:#fff;color:#141414;font-size:18px;font-weight:700;border-radius:6px;padding:0;display:flex;align-items:center;justify-content:center}
.wg.dark .wg-x,.wg.dark .wg-snd{background:transparent;color:#fff;border-color:rgba(255,255,255,.35)}
.wg-ov{position:absolute;inset:0;display:none;overflow:auto;background:rgba(255,255,255,.93);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px);padding:calc(18px + env(safe-area-inset-top,0px)) 18px calc(22px + env(safe-area-inset-bottom,0px));touch-action:pan-y;color:#141414}
.wg-ov.on{display:flex}
.wg-card{margin:auto;width:100%;max-width:400px;text-align:left;animation:wgIn .25s ease-out}
@keyframes wgIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.wg-kick{display:inline-flex;align-items:center;gap:7px;color:#1717ff;font:600 11px/1.2 "Barlow",Arial,sans-serif;letter-spacing:.07em;text-transform:uppercase;margin:0 0 8px}
.wg-kick:before{content:"";width:7px;height:7px;border-radius:50%;background:#1717ff}
.wg h2{font:800 64px/.88 "Barlow Condensed","Arial Narrow",Arial,sans-serif;margin:0 0 12px;text-transform:uppercase;color:#141414;letter-spacing:-.005em}
.wg h2 em{font-style:normal;color:#1717ff}
.wg h3{font:700 12px/1.2 "Barlow",Arial,sans-serif;letter-spacing:.07em;text-transform:uppercase;color:#5e5e66;margin:18px 0 8px}
.wg p{margin:0 0 16px;font-size:16px;line-height:1.45;color:#2a2a2e}
.wg-sub{font-size:13px!important;color:#5e5e66!important}
.wg-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:4px 0 16px}
.wg-stats div{border:1px solid #e2e2e8;border-radius:6px;padding:9px 8px 8px;background:#fff;min-width:0}
.wg-stats b{display:block;font:800 26px/1 "Barlow Condensed",Arial,sans-serif;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wg-stats small{display:block;margin-top:4px;font:600 10px/1.15 "Barlow",Arial,sans-serif;letter-spacing:.04em;text-transform:uppercase;color:#5e5e66}
.wg-stats .hl{background:#1717ff;border-color:#1717ff;color:#fff}.wg-stats .hl small{color:#dfe4ff}
.wg-big{display:flex;align-items:baseline;gap:10px;margin:2px 0 12px}.wg-big b{font:800 92px/.8 "Barlow Condensed",Arial,sans-serif;color:#1717ff;font-variant-numeric:tabular-nums}.wg-big span{font:600 13px "Barlow",Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#5e5e66}
.wg-mis{border:1px solid #e2e2e8;border-radius:6px;background:#fff;margin:0 0 16px;overflow:hidden}
.wg-mis .wg-mis-h{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:#141414;color:#fff;font:700 12px/1 "Barlow",Arial,sans-serif;letter-spacing:.07em;text-transform:uppercase}
.wg-mis .wg-mis-h b{color:#c6d0ff;letter-spacing:.02em}
.wg-mis li{display:flex!important;align-items:center;gap:10px;padding:11px 12px!important;border-bottom:1px solid #ececf1!important;font-size:15px!important}
.wg-mis li:last-child{border-bottom:0!important}
.wg-mis li i{flex:none;width:22px!important;height:22px;border-radius:50%;border:2px solid #c9c9d2;opacity:1!important;display:flex;align-items:center;justify-content:center;font-style:normal;font-size:13px;color:#fff}
.wg-mis li.ok i{background:#1717ff;border-color:#1717ff}
.wg-mis li.ok span{color:#5e5e66;text-decoration:line-through}
.wg-mis li.now{background:#eef0ff}
.wg-mis li small{margin-left:auto;font:600 12px "Barlow",Arial,sans-serif;color:#1717ff;white-space:nowrap}
.wg-btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:58px;margin:0 0 8px;border:0;background:#1717ff;color:#fff;font:800 22px/1 "Barlow Condensed",Arial,sans-serif;letter-spacing:.04em;text-transform:uppercase;border-radius:6px;touch-action:manipulation;cursor:pointer}
.wg-btn:active{transform:scale(.985);background:#0f0fd0}
.wg-btn.alt{background:#fff;color:#141414;border:1px solid #d6d6dd;font-size:18px;min-height:50px}
.wg-btn.alt:active{background:#eef0ff}
.wg-btn.ink{background:#141414}
.wg-btn[disabled]{opacity:.35;pointer-events:none}
.wg-row{display:grid;grid-template-columns:1fr 1fr;gap:8px}.wg-row .wg-btn{margin:0 0 8px}
.wg input{display:block;width:100%;min-height:54px;margin:0 0 8px;padding:0 14px;border:1px solid #d6d6dd;font:600 17px "Barlow",Arial,sans-serif;border-radius:6px;text-align:center;background:#fff;color:#141414;box-sizing:border-box}
.wg input:focus{outline:2px solid #1717ff;border-color:#1717ff}
.wg ol{list-style:none;margin:0 0 16px;padding:0;text-align:left}
.wg li{display:flex;align-items:center;gap:12px;padding:11px 4px;border-bottom:1px solid #ececf1;font-size:17px;font-weight:600}
.wg-top li i{font:800 22px/1 "Barlow Condensed",Arial,sans-serif;font-style:normal;width:26px;color:#a0a0aa}
.wg-top li:nth-child(-n+3) i{color:#1717ff}
.wg-top li span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.wg-top li b{font:800 24px/1 "Barlow Condensed",Arial,sans-serif;font-variant-numeric:tabular-nums}
.wg-top li.me{background:#1717ff;color:#fff;border-radius:4px;padding-left:8px;padding-right:8px}.wg-top li.me i{color:#c6d0ff}
.wg-chips{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 14px}
.wg-chip{position:relative;border:1px solid #d6d6dd;background:#fff;color:#141414;font:700 15px "Barlow Condensed",Arial,sans-serif;letter-spacing:.01em;padding:8px 11px;min-height:40px;border-radius:4px;cursor:pointer;text-align:left}
.wg-chip.fav{border-color:#1717ff;background:#eef0ff}
.wg-chip sup{position:absolute;top:-7px;right:-5px;background:#ff3d9a;color:#fff;font:700 9px/1 "Barlow",Arial,sans-serif;letter-spacing:.04em;padding:3px 4px;border-radius:3px}
.wg-q{font-weight:700}
.wg-note{font-size:13px!important;border:1px solid #e2e2e8;border-radius:6px;padding:9px 10px;margin:0 0 14px;background:#fff}
.wg-unlock{display:flex;align-items:center;gap:10px;background:#141414;color:#fff;border-radius:6px;padding:10px 12px;margin:0 0 10px;font:600 14px/1.3 "Barlow",Arial,sans-serif}
.wg-unlock b{font:800 18px "Barlow Condensed",Arial,sans-serif;letter-spacing:.02em;color:#c6d0ff}
.wg-gotmis{display:flex;align-items:center;gap:10px;background:#eef0ff;border-radius:6px;padding:10px 12px;margin:0 0 8px;font:600 14px "Barlow",Arial,sans-serif;color:#1717ff}
.wg-skins{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:0 0 16px}
.wg-skin{display:flex;flex-direction:column;align-items:center;gap:6px;border:1px solid #e2e2e8;border-radius:6px;background:#fff;padding:10px 6px 9px;font:700 15px "Barlow Condensed",Arial,sans-serif;color:#141414;cursor:pointer}
.wg-skin canvas{width:64px;height:84px;box-shadow:none;margin:0}
.wg-skin small{font:500 10.5px/1.2 "Barlow",Arial,sans-serif;color:#5e5e66;text-align:center}
.wg-skin.on{border:2px solid #1717ff;background:#eef0ff}
.wg-skin.lock{opacity:.55;cursor:default}
.wg-how li{align-items:flex-start;font-weight:500;font-size:15px;line-height:1.35}
.wg-how li svg{flex:none;width:36px;height:36px}
.wg-how li b{display:block;font:700 18px "Barlow Condensed",Arial,sans-serif;letter-spacing:.01em}
.wg-crate{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 16px}
.wg-prog{height:8px;border-radius:4px;background:#ececf1;overflow:hidden;margin:2px 0 14px}.wg-prog b{display:block;height:100%;background:#1717ff}
#modal .ov{z-index:2100}
@media (max-width:360px){.wg h2{font-size:54px}.wg-stats b{font-size:22px}.wg-big b{font-size:76px}}
@media (prefers-reduced-motion:reduce){.wg-card{animation:none}.wg{transition:none}}`;

  let root, cv, cx, scoreEl, bestEl, ov, sndEl, ro, raf, last = 0, sprites, prevOverflow, ac = null;
  let W = 0, H = 0, s = 1, groundY = 0, lanes = 6, laneW = 60, maxV = 300;
  let state = "start", score = 0, best = Number(store.get(BEST_KEY) || 0), lock = 0, muted = store.get(MUTE_KEY) === "1";
  let x = 0, vel = 0, clock = 0, elapsed = 0, spawnT = 0, diagT = 0, pickupT = 0, prevGap = 2, hitT = 0, def = 0, shakeT = 0, flash = 0;
  let bonus = 0, dodged = 0, shield = 0, inv = 0, stage = 0, nextMile = T.mile, recShown = false, bestAtStart = 0, isRec = false;
  let obstacles = [], pickups = [], tokens = [], particles = [], pops = [], keyDir = 0, touchDir = 0, active = null, mouseX = null;
  let combo = 0, comboT = 0, mult = 1, maxMult = 1, found = [], slow = 0, lastDir = 1, tokenT = 5, evT = 0, evKind = null, evPhase = "", evClock = 0, windDir = 1, comboEl;
  let banner = null, crowd = [], run = {}, newFound = [], misDoneRun = [], todayMis = null, unlockBefore = [], stageEl, pwEl, recbarEl, pwLast = "";

  /* ---------- profiel: platenkast, sterren, missies, skins, reeks (los van de oude score-opslag) ---------- */
  const PROF_KEY = "lotd-wapperman-profile";
  const dstr = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const today = () => dstr(new Date());
  const yesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return dstr(d); };
  let prof = (() => { let p = null; try { p = JSON.parse(store.get(PROF_KEY)); } catch {} p = Object.assign({ games: 0, time: 0, crate: [], stars: 0, streak: 0, lastDay: "", mis: { d: "", done: [0, 0, 0] }, skin: "classic" }, p && typeof p === "object" ? p : {}); if (!Array.isArray(p.crate)) p.crate = []; if (!p.mis || !Array.isArray(p.mis.done)) p.mis = { d: "", done: [0, 0, 0] }; return p; })();
  const saveProf = () => store.set(PROF_KEY, JSON.stringify(prof));
  function missionsToday() {
    const d = today(); if (prof.mis.d !== d) { prof.mis = { d, done: [0, 0, 0] }; saveProf(); }
    let h = 7; for (const ch of d) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const r2 = () => { h = (Math.imul(h, 1664525) + 1013904223) >>> 0; return h / 4294967296; };
    const pool = MISSIONS.slice(), out = [];
    for (let lvl = 0; lvl < 3; lvl++) { const m = pool.splice(Math.floor(r2() * pool.length), 1)[0]; out.push({ m, n: m.v[lvl] }); }
    return out;
  }
  const misText = x => Lg(x.m.nl(x.n), x.m.en(x.n));
  const streakNow = () => (prof.lastDay === today() || prof.lastDay === yesterday()) ? prof.streak || 0 : 0;
  const unlockedIds = () => SKINS.filter(k => k.need(prof, best)).map(k => k.id);
  const skinOf = () => SKINS.find(k => k.id === prof.skin && k.need(prof, best)) || SKINS[0];
  const crateTotal = () => typeof ACTS !== "undefined" ? new Set(ACTS.filter(a => !a.cancelled && !a.after && a.genre !== "Extra").map(a => a.name)).size : 0;
  const isFavAct = id => { try { return typeof favs !== "undefined" && Array.isArray(favs) && favs.includes(id); } catch { return false; } };
  const stageFor = sc => { let i = 0; STAGES.forEach((z, k) => { if (sc >= z[2]) i = k; }); return i; };
  const stageName = i => Lg(STAGES[i][0], STAGES[i][1]);
  const isLight = hex => { const h = hex.replace("#", ""); if (h.length < 6) return true; const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16); return (r * 299 + g * 587 + b * 114) / 1000 > 150; };
  function checkMissions() {
    if (!todayMis) return;
    run.score = score; run.mult = maxMult; run.found = found.length; run.dodged = dodged; run.stage = stage;
    todayMis.forEach((m, i) => {
      if (prof.mis.done[i] || (run[m.m.k] || 0) < m.n) return;
      prof.mis.done[i] = 1; prof.stars = (prof.stars || 0) + 1; misDoneRun.push(i); saveProf();
      pop(Lg("MISSIE ✓  +★", "MISSION ✓  +★"), W / 2, H * .52, 26, BLUE); beep(988, .08, "square", .05); setTimeout(() => beep(1318, .14, "square", .05), 90);
    });
  }

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
    const gap = 15 * s, n = Math.ceil(W / gap) + 2; crowd = [];
    for (let i = 0; i < n; i++) crowd.push({ x: (i - .5) * gap + rnd(-3, 3) * s, r: rnd(6.5, 9) * s, ph: rnd(0, 6.28), hand: Math.random(), dy: rnd(0, 4) * s });
  }

  /* ---------- effecten ---------- */
  function pop(txt, px, py, size = 22, col) { pops.push({ txt: tr(txt), x: px, y: py, t: 0, life: 1.1, size, col }); }
  function burst(px, py, n = 24) {
    if (reduced) n = 8;
    for (let i = 0; i < n; i++) { const a = rnd(0, 6.28), v = rnd(80, 300); particles.push({ x: px, y: py, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 120, t: 0, life: rnd(.5, .9), c: ["#141414", BLUE, "#ff3d9a", "#ffffff"][i % 4], r: rnd(3, 7) }); }
  }
  const setScore = n => { score = n; scoreEl.textContent = n; bestEl.textContent = "Record " + Math.max(best, n);
    if (recbarEl) { const tgt = state === "playing" ? bestAtStart : best; recbarEl.parentNode.style.visibility = tgt > 0 ? "" : "hidden"; recbarEl.style.width = (tgt > 0 ? Math.min(100, n / tgt * 100) : 0).toFixed(1) + "%"; recbarEl.parentNode.classList.toggle("done", tgt > 0 && n > tgt); } };
  const paintStage = () => { if (stageEl) stageEl.textContent = stageName(stage); };

  /* ---------- spel ---------- */
  function start() {
    state = "playing"; elapsed = 0; spawnT = .6; diagT = 4; pickupT = 12; hitT = 0; def = 0; shakeT = 0; flash = 0;
    bonus = 0; dodged = 0; shield = 0; inv = 0; nextMile = T.mile; recShown = false; isRec = false; bestAtStart = best;
    obstacles = []; pickups = []; tokens = []; particles = []; pops = []; x = W / 2; vel = 0; touchDir = 0; active = null; prevGap = Math.floor((lanes - 3) / 2);
    combo = 0; comboT = 0; mult = 1; maxMult = 1; found = []; slow = 0; tokenT = 5; evT = T.eventFirst; evKind = null; evPhase = ""; evClock = 0; renderCombo();
    stage = 0; banner = null; run = { waves: 0, nears: 0, shields: 0 }; newFound = []; misDoneRun = []; todayMis = missionsToday(); unlockBefore = unlockedIds();
    root.classList.remove("dark"); paintStage(); hide(); setScore(0); beep(520, .06, "square", .04, 400);
  }
  const speedNow = () => T.speedStart + Math.min(T.speedMax, elapsed * T.speedGain);
  const intervalNow = () => Math.max(T.rowMin, T.rowStart - elapsed * T.rowGain);
  const lsize = () => Math.min(laneW * .8, 60 * s);
  const isRegen = () => evKind === "regen" && evPhase === "on", isWind = () => evKind === "wind" && evPhase === "on";
  function renderCombo() { if (!comboEl) return; if (mult > 1) { comboEl.innerHTML = "<span>COMBO x" + mult + '</span><i style="transform:scaleX(' + clamp(comboT / T.comboWindow, 0, 1).toFixed(2) + ')"></i>'; } else comboEl.innerHTML = "";
    if (pwEl) { const t = (shield ? `<span>${Lg("SCHILD", "SHIELD")}</span>` : "") + (slow > 0 ? `<span>SLOW-MO ${Math.ceil(slow)}s</span>` : ""); if (t !== pwLast) { pwEl.innerHTML = t; pwLast = t; } } }
  function gain(n) { combo += n; comboT = T.comboWindow; const m = Math.min(T.comboMax, 1 + Math.floor(combo / T.comboStep)); if (m > mult) pop("COMBO x" + m, x, groundY - 150 * s, 20, BLUE); mult = m; maxMult = Math.max(maxMult, mult); }
  function spawnRow() {
    const R = isRegen(), sp = speedNow() * (R ? 1.1 : 1), iv = intervalNow() * (R ? .6 : 1), size = lsize() * (R ? .72 : 1), gw = 3;
    const reach = Math.max(1, Math.floor(maxV * iv / laneW * .6));
    const g = clamp(prevGap + Math.round(rnd(-reach, reach)), 0, lanes - gw); prevGap = g;
    const fill = Math.min(T.fillMax, T.fillStart + elapsed * T.fillGain);
    for (let l = 0; l < lanes; l++) {
      if ((l >= g && l < g + gw) || Math.random() > fill) continue;
      const o = { x: (l + .5) * laneW + rnd(-.06, .06) * laneW, y: -size - rnd(0, laneW * .5), size, speed: sp * rnd(.96, 1.04), rot: rnd(0, 6.28), spin: rnd(-1.2, 1.2), age: 0 };
      if (elapsed > T.zigAfter && Math.min(Math.abs(l - g), Math.abs(l - (g + gw - 1))) >= 2 && Math.random() < .4) { o.bx = o.x; o.zig = 1; o.w = rnd(2.2, 3.2); o.ph = rnd(0, 6); o.amp = laneW * .55; }
      obstacles.push(o);
    }
    if (pickupT <= 0 && !(shield && slow > 0)) { const type = !shield && Math.random() < .55 ? "shield" : "dial"; pickups.push({ x: (g + gw / 2) * laneW, y: -size - 14, speed: sp, r: 16 * s, type }); pickupT = rnd(13, 19); }
    tokenT -= iv;
    if (tokenT <= 0 && typeof ACTS !== "undefined" && ACTS.length) {
      const pool = ACTS.filter(a => !a.cancelled && !a.after && a.genre !== "Extra" && !found.some(f => f.id === a.id)), favPool = pool.filter(a => isFavAct(a.id));
      const a = favPool.length && Math.random() < .22 ? favPool[(Math.random() * favPool.length) | 0] : pool.length ? pool[(Math.random() * pool.length) | 0] : null;
      if (a) { const far = x < (g + gw / 2) * laneW ? gw - .5 : .5; tokens.push({ x: (g + far) * laneW, y: -size - 14, speed: sp, r: 13 * s, act: a, ph: rnd(0, 6), fav: isFavAct(a.id) }); }
      tokenT = rnd(T.tokenEvery[0], T.tokenEvery[1]);
    }
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
    const dir = touchDir || keyDir; let want = 0; const sdt = dt * (slow > 0 ? T.slowScale : 1);
    if (dir) { want = dir * maxV; lastDir = dir; } else if (mouseX !== null) want = clamp((mouseX - x) * 10, -maxV, maxV);
    if (isWind()) want += windDir * maxV * T.windPush;
    vel += (want - vel) * Math.min(1, 18 * dt);
    x = clamp(x + vel * dt, 30 * s, W - 30 * s); slow = Math.max(0, slow - dt);
    if (comboT > 0) { comboT -= dt; if (comboT <= 0 && mult > 1) pop("COMBO WEG", x, groundY - 150 * s, 16); if (comboT <= 0) { combo = 0; mult = 1; } } renderCombo();
    /* golven: wind / regen met waarschuwing */
    if (!evKind) { evT -= dt; if (evT <= 0) { evKind = Math.random() < .5 ? "wind" : "regen"; evPhase = "warn"; evClock = T.warnTime; windDir = Math.random() < .5 ? -1 : 1; pop(evKind === "wind" ? (windDir < 0 ? "WIND ←" : "WIND →") : "REGEN!", W / 2, H * .24, 34, BLUE); beep(440, .12, "sawtooth", .05); setTimeout(() => beep(440, .12, "sawtooth", .05), 180); } }
    else { evClock -= dt; if (evClock <= 0) { if (evPhase === "warn") { evPhase = "on"; evClock = evKind === "wind" ? T.windTime : T.regenTime; } else { evKind = null; evPhase = ""; evT = rnd(T.eventMin, T.eventMax); bonus += 25; run.waves = (run.waves || 0) + 1; pop("OVERLEEFD +25", W / 2, H * .24, 22, BLUE); beep(700, .08, "square", .05); } } }
    const G = geom(x, groundY, clock, 0);
    spawnT -= sdt; pickupT -= sdt; diagT -= sdt;
    if (spawnT <= 0) { spawnRow(); spawnT += intervalNow() * (isRegen() ? .6 : 1); }
    if (elapsed > T.diagAfter && diagT <= 0) { spawnDiag(); diagT = rnd(3.5, 6) - Math.min(2, elapsed / 60); }
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const o = obstacles[i]; o.age += sdt; o.y += o.speed * sdt; o.rot += o.spin * sdt;
      if (o.zig) o.x = o.bx + Math.sin(o.age * o.w + o.ph) * o.amp;
      if (o.vx) o.x += o.vx * sdt;
      if (inv <= 0) {
        const g = gapTo(o.x, o.y, o.size * .4, G);
        if (g < 0) {
          if (shield) { shield = 0; inv = 1; burst(o.x, o.y, 18); pop("SCHILD WEG", x, groundY - 130 * s, 18, BLUE); beep(180, .25, "sawtooth", .07, -120); obstacles.splice(i, 1); continue; }
          crash(G); return;
        }
        if (g < T.nearPx) o.near = true;
      }
      if (o.near && !o.paid && o.y > groundY - 50 * s) { o.paid = true; run.nears = (run.nears || 0) + 1; const pts = T.nearBonus * mult; bonus += pts; gain(1); pop("+" + pts, x, groundY - 140 * s, 16, BLUE); beep(900 + mult * 60, .04, "triangle", .04); }
      if (o.y > groundY + 20 * s || o.x < -90 || o.x > W + 90) { dodged++; obstacles.splice(i, 1); }
    }
    for (let i = pickups.length - 1; i >= 0; i--) {
      const p = pickups[i]; p.y += p.speed * sdt;
      if (gapTo(p.x, p.y, p.r, G) < 0) {
        burst(p.x, p.y, 10);
        if (p.type === "dial") { slow = T.slowTime; pop("DIAL: SLOW-MO", x, groundY - 130 * s, 20, BLUE); beep(700, .25, "sine", .06, -450); }
        else { shield = 1; run.shields = (run.shields || 0) + 1; pop("SCHILD!", x, groundY - 130 * s, 20, BLUE); beep(520, .09, "square", .05, 500); }
        pickups.splice(i, 1); try { navigator.vibrate && navigator.vibrate(25); } catch {}
      }
      else if (p.y > groundY + 20 * s) pickups.splice(i, 1);
    }
    for (let i = tokens.length - 1; i >= 0; i--) {
      const k = tokens[i]; k.y += k.speed * sdt;
      if (gapTo(k.x, k.y, k.r, G) < 0) {
        const fav = k.fav, pts = T.tokenPts * mult * (fav ? 2 : 1); bonus += pts; gain(2); found.push(k.act); burst(k.x, k.y, 12);
        pop(k.act.name, x, groundY - 160 * s, 18, BLUE); pop("+" + pts + (fav ? Lg("  FAVORIET x2", "  FAVOURITE x2") : ""), x, groundY - 135 * s, 14, fav ? "#ff3d9a" : undefined);
        if (!prof.crate.includes(k.act.name) && !newFound.includes(k.act.name)) { newFound.push(k.act.name); pop(Lg("NIEUW IN JE PLATENKAST", "NEW IN YOUR CRATE"), x, groundY - 186 * s, 12, BLUE); } beep(784, .06, "square", .04); setTimeout(() => beep(1046, .09, "square", .04), 70); try { navigator.vibrate && navigator.vibrate(20); } catch {}
        tokens.splice(i, 1);
      } else if (k.y > groundY + 20 * s) tokens.splice(i, 1);
    }
    inv = Math.max(0, inv - dt);
    const st = stageFor(score);
    if (st !== stage) { stage = st; root.classList.toggle("dark", PALS[stage].dark); flash = .35; banner = { txt: stageName(st).toUpperCase(), t: 0 }; paintStage(); beep(523, .08, "square", .05); setTimeout(() => beep(659, .08, "square", .05), 90); setTimeout(() => beep(784, .14, "square", .05), 180); }
    while (score >= nextMile) {
      const isStage = STAGES.some(z => z[2] === nextMile);
      if (!isStage) { pop(String(nextMile), W / 2, H * .3, 54); flash = .25; beep(660, .07, "square", .05); setTimeout(() => beep(880, .1, "square", .05), 80); }
      if (isStage) { /* podiumwissel: de banner neemt het over */ }
      else if (typeof ACTS !== "undefined" && ACTS.length) pop(ACTS[(Math.random() * ACTS.length) | 0].name, W / 2, H * .3 + 40, 18);
      nextMile += T.mile;
    }
    checkMissions();
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
  function wapper(px, gy, t, d, P, SK) {
    SK = SK || skinOf();
    const G = geom(px, gy, t, d), { bh, sw } = G, INK = P.ink, BODY = SK.body || P.ink, ARM = SK.arm || P.paper, HEAD_INK = "#141414";
    const outline = SK.body && (SK.body === P.bg || isLight(SK.body) === isLight(P.bg));
    cx.fillStyle = P.dark ? "#55555f" : "#9a9aa4"; cx.fillRect(px - 20 * s, gy, 40 * s, 9 * s);
    if (SK.glow && !reduced) { cx.shadowColor = SK.arm; cx.shadowBlur = 18 * s; }
    cx.fillStyle = BODY; cx.beginPath(); const N = 8;
    for (let i = 0; i <= N; i++) { const f = i / N, w = (15 - 4 * f) * s, bx = px + sw(f) - w, by = gy - bh * f; i ? cx.lineTo(bx, by) : cx.moveTo(bx, by); }
    for (let i = N; i >= 0; i--) { const f = i / N, w = (15 - 4 * f) * s; cx.lineTo(px + sw(f) + w, gy - bh * f); }
    cx.closePath(); cx.fill(); cx.shadowBlur = 0;
    if (outline) { cx.strokeStyle = INK; cx.lineWidth = 2 * s; cx.stroke(); }
    if (SK.vinyl) { cx.strokeStyle = SK.arm; cx.lineWidth = 2 * s; for (const f of [.3, .42]) { cx.beginPath(); cx.moveTo(px + sw(f) - 12 * s, gy - bh * f); cx.lineTo(px + sw(f) + 12 * s, gy - bh * f); cx.stroke(); } }
    if (d < .5) { cx.save(); cx.translate(px + sw(.62), gy - bh * .62); cx.rotate(-Math.PI / 2); cx.fillStyle = SK.body ? (isLight(BODY) ? "#141414" : "#ffffff") : P.paper; cx.font = `800 ${10 * s}px ${FONT_D}`; cx.textAlign = "center"; cx.textBaseline = "middle"; cx.fillText("LEFT OF THE DIAL", 0, 0); cx.restore(); }
    for (const p of G.arms) { poly(p, 0, outline ? INK : BODY, 17 * s); poly(p, 4, ARM, 12 * s); }
    cx.save(); cx.translate(G.hx, G.hy); cx.rotate(d * .7 + Math.sin(t * 6) * .07 * (1 - d));
    cx.beginPath(); cx.ellipse(0, 0, 20 * s, 25 * s, 0, 0, 7); cx.fillStyle = "#ffffff"; cx.fill();
    cx.save(); cx.clip();
    cx.fillStyle = SK.band; cx.beginPath(); cx.moveTo(-30 * s, -30 * s); cx.lineTo(30 * s, -30 * s); cx.lineTo(30 * s, -3 * s);
    cx.quadraticCurveTo(14 * s, -9 * s, 0, -3 * s); cx.quadraticCurveTo(-14 * s, -9 * s, -30 * s, -3 * s); cx.closePath(); cx.fill();
    cx.fillStyle = HEAD_INK;
    for (const e of [-1, 1]) { cx.beginPath(); cx.ellipse(e * 8 * s, -6 * s, 5.5 * s, 7 * s, e * .3, 0, 7); cx.fill(); }
    cx.beginPath(); cx.moveTo(0, 3 * s); cx.lineTo(-3 * s, 10 * s); cx.lineTo(3 * s, 10 * s); cx.closePath(); cx.fill();
    cx.fillRect(-11 * s, 13 * s, 22 * s, 8 * s); cx.strokeStyle = "#ffffff"; cx.lineWidth = 1.6 * s;
    for (let i = -1; i <= 1; i++) { cx.beginPath(); cx.moveTo(i * 5 * s, 13 * s); cx.lineTo(i * 5 * s, 21 * s); cx.stroke(); }
    if (d > .4) { cx.strokeStyle = "#ffffff"; cx.lineWidth = 2 * s; for (const e of [-1, 1]) { cx.beginPath(); cx.moveTo(e * 8 * s - 3 * s, -9 * s); cx.lineTo(e * 8 * s + 3 * s, -3 * s); cx.moveTo(e * 8 * s + 3 * s, -9 * s); cx.lineTo(e * 8 * s - 3 * s, -3 * s); cx.stroke(); } }
    cx.restore();
    cx.lineWidth = 3 * s; cx.strokeStyle = P.dark ? "#ffffff" : HEAD_INK; cx.beginPath(); cx.ellipse(0, 0, 20 * s, 25 * s, 0, 0, 7); cx.stroke();
    cx.restore();
  }
  function drawCrowd(P) {
    const beat = clock * (2.1 + stage * .18), live = state === "playing", hype = live ? .1 + .13 * (mult - 1) + (slow > 0 ? .1 : 0) : .05;
    cx.fillStyle = P.crowd; cx.strokeStyle = P.crowd; cx.lineCap = "round";
    for (const c of crowd) {
      const bob = reduced ? 0 : Math.abs(Math.sin(beat * Math.PI + c.ph)) * (live ? 3.5 : 1.2) * s, hy = H - c.r * .55 - c.dy - bob;
      cx.beginPath(); cx.arc(c.x, hy, c.r, 0, 7); cx.fill();
      if (c.hand < hype) { cx.lineWidth = 3.2 * s; for (const sd of [-1, 1]) { const wv = reduced ? 0 : Math.sin(beat * Math.PI * 2 + c.ph + sd) * 2 * s; cx.beginPath(); cx.moveTo(c.x + sd * c.r * .7, hy); cx.lineTo(c.x + sd * (c.r * .9) + wv, hy - c.r * 2.1); cx.stroke(); } }
    }
  }
  function drawBeams(P) {
    cx.save(); cx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 3; i++) {
      const bx = W * (.18 + i * .32), a = -Math.PI / 2 + (reduced ? (i - 1) * .3 : Math.sin(clock * .7 + i * 2.1) * .55), L = H * 1.1, sp = .09;
      const gr = cx.createLinearGradient(bx, H, bx + Math.cos(a) * L, H + Math.sin(a) * L); gr.addColorStop(0, "rgba(120,135,255,.32)"); gr.addColorStop(1, "rgba(120,135,255,0)");
      cx.fillStyle = gr; cx.beginPath(); cx.moveTo(bx, H); cx.lineTo(bx + Math.cos(a - sp) * L, H + Math.sin(a - sp) * L); cx.lineTo(bx + Math.cos(a + sp) * L, H + Math.sin(a + sp) * L); cx.closePath(); cx.fill();
    }
    cx.restore();
  }
  function drawBanner(P) {
    if (!banner) return; const D = 2.1, t = banner.t; if (t > D) { banner = null; return; }
    const ease = u => 1 - Math.pow(1 - u, 3), pin = ease(Math.min(1, t / .32)), pout = t > D - .32 ? ease((t - (D - .32)) / .32) : 0, off = (1 - pin) * W - pout * W;
    const yy = H * .34, hh = 70 * s, onBlue = P.acc === "#ffffff";
    cx.fillStyle = onBlue ? "#ffffff" : "#1717ff"; cx.fillRect(off, yy - hh / 2, W, hh);
    cx.fillStyle = onBlue ? "#1717ff" : "#ffffff"; cx.textAlign = "center"; cx.textBaseline = "middle";
    cx.font = `800 ${50 * s}px ${FONT_D}`; cx.fillText(banner.txt, off + W / 2, yy + 3 * s);
    cx.fillStyle = P.ink; cx.font = `700 ${12 * s}px ${FONT_B}`; cx.fillText(Lg(`PODIUM ${stage + 1} / ${STAGES.length}`, `STAGE ${stage + 1} / ${STAGES.length}`), off + W / 2, yy - hh / 2 - 12 * s);
  }
  function draw() {
    const P = PALS[stage] || PALS[0];
    cx.save(); cx.fillStyle = P.bg; cx.fillRect(0, 0, W, H);
    if (shakeT > 0) cx.translate(rnd(-5, 5), rnd(-5, 5));
    if (P.beams) drawBeams(P);
    cx.strokeStyle = P.lane; cx.lineWidth = 2; const off = (clock * 120) % 60;
    for (let i = 1; i < lanes; i++) { cx.beginPath(); cx.setLineDash([14, 46]); cx.lineDashOffset = -off; cx.moveTo(i * laneW, 0); cx.lineTo(i * laneW, H); cx.stroke(); }
    cx.setLineDash([]);
    cx.fillStyle = P.floor; cx.fillRect(0, groundY + 12 * s, W, H); cx.fillStyle = P.ink; cx.fillRect(0, groundY + 9 * s, W, 3 * s);
    drawCrowd(P);
    const spr = P.dark ? sprites[1] : sprites[0];
    for (const o of obstacles) { cx.save(); cx.translate(o.x, o.y); cx.rotate(o.rot); cx.drawImage(spr, -o.size / 2, -o.size / 2, o.size, o.size); cx.restore(); }
    const onBlue = P.acc === "#ffffff";
    for (const p of pickups) {
      const pulse = 1 + Math.sin(clock * 6 + p.x) * .06;
      if (p.type === "dial") { cx.fillStyle = "#fff"; cx.beginPath(); cx.arc(p.x, p.y, p.r * pulse, 0, 7); cx.fill(); cx.strokeStyle = BLUE; cx.lineWidth = 3.5; cx.beginPath(); cx.arc(p.x, p.y, p.r - 1.5, 0, 7); cx.stroke(); const a = -2.4 + Math.sin(clock * 3 + p.x) * .7; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(p.x + Math.cos(a) * p.r * .7, p.y + Math.sin(a) * p.r * .7); cx.stroke(); cx.fillStyle = BLUE; cx.beginPath(); cx.arc(p.x, p.y, 3, 0, 7); cx.fill(); }
      else { cx.fillStyle = onBlue ? "#fff" : BLUE; cx.beginPath(); cx.arc(p.x, p.y, p.r * pulse, 0, 7); cx.fill(); cx.strokeStyle = onBlue ? BLUE : "#fff"; cx.lineWidth = 2.5; cx.beginPath(); cx.arc(p.x, p.y, p.r - 3, 0, 7); cx.stroke(); cx.fillStyle = onBlue ? BLUE : "#fff"; star(p.x, p.y, p.r * .6); }
    }
    for (const k of tokens) {
      const wob = Math.sin(clock * 4 + k.ph) * 2, ky = k.y + wob;
      if (k.fav) { cx.strokeStyle = "#ff3d9a"; cx.lineWidth = 3; cx.beginPath(); cx.arc(k.x, ky, k.r + 4 + Math.sin(clock * 8) * 1.5, 0, 7); cx.stroke(); }
      cx.fillStyle = P.dark ? "#ffffff" : "#141414"; cx.beginPath(); cx.arc(k.x, ky, k.r, 0, 7); cx.fill();
      cx.strokeStyle = P.dark ? "#c9c9d2" : "#55555f"; cx.lineWidth = 1.2; for (const rr of [.8, .62]) { cx.beginPath(); cx.arc(k.x, ky, k.r * rr, 0, 7); cx.stroke(); }
      cx.fillStyle = k.fav ? "#ff3d9a" : onBlue ? "#1717ff" : BLUE; cx.beginPath(); cx.arc(k.x, ky, k.r * .36, 0, 7); cx.fill(); cx.fillStyle = "#fff"; cx.beginPath(); cx.arc(k.x, ky, 1.8, 0, 7); cx.fill();
    }
    if (isWind() && state === "playing") { cx.strokeStyle = P.acc; cx.lineWidth = 2; cx.globalAlpha = .4; for (let i = 0; i < 14; i++) { const yy = (i * 97 + clock * 260) % H, xx = ((i * 131 + clock * 700 * windDir) % (W + 120) + W + 120) % (W + 120) - 60; cx.beginPath(); cx.moveTo(xx, yy); cx.lineTo(xx + 46 * windDir, yy); cx.stroke(); } cx.globalAlpha = 1; }
    if (inv > 0 && state === "playing") cx.globalAlpha = Math.floor(clock * 14) % 2 ? .35 : 1;
    wapper(x, groundY, clock, def, P); cx.globalAlpha = 1;
    if (shield && state === "playing") { cx.strokeStyle = P.acc; cx.lineWidth = 3; cx.globalAlpha = .6 + Math.sin(clock * 8) * .3; cx.beginPath(); cx.ellipse(x, groundY - 62 * s, 58 * s, 84 * s, 0, 0, 7); cx.stroke(); cx.globalAlpha = 1; }
    for (const p of particles) { cx.fillStyle = p.c === BLUE ? P.acc : p.c; cx.globalAlpha = 1 - p.t / p.life; cx.fillRect(p.x - p.r / 2, p.y - p.r / 2, p.r, p.r); }
    cx.globalAlpha = 1; cx.textAlign = "center"; cx.textBaseline = "middle";
    for (const p of pops) { cx.globalAlpha = Math.min(1, (p.life - p.t) * 2.5); cx.font = `800 ${p.size * 1.12}px ${FONT_D}`; cx.lineWidth = 5; cx.lineJoin = "round"; cx.strokeStyle = P.bg; cx.strokeText(p.txt, p.x, p.y - p.t * 30); cx.fillStyle = p.col === BLUE ? P.acc : (p.col || P.ink); cx.fillText(p.txt, p.x, p.y - p.t * 30); }
    cx.globalAlpha = 1;
    drawBanner(P);
    if (flash > 0) { cx.fillStyle = onBlue ? `rgba(255,255,255,${Math.min(.3, flash)})` : `rgba(23,23,255,${Math.min(.3, flash)})`; cx.fillRect(0, 0, W, H); }
    if (state === "playing" && slow > 0) { cx.strokeStyle = P.acc; cx.lineWidth = 6; cx.globalAlpha = .5 + Math.sin(clock * 6) * .2; cx.strokeRect(3, 3, W - 6, H - 6); cx.globalAlpha = 1; }
    cx.restore();
  }
  function fx(dt) {
    for (let i = particles.length - 1; i >= 0; i--) { const p = particles[i]; p.t += dt; p.vy += 700 * dt; p.x += p.vx * dt; p.y += p.vy * dt; if (p.t > p.life) particles.splice(i, 1); }
    for (let i = pops.length - 1; i >= 0; i--) { pops[i].t += dt; if (pops[i].t > pops[i].life) pops.splice(i, 1); }
    if (shakeT > 0) shakeT -= dt; if (flash > 0) flash -= dt; if (banner) banner.t += dt;
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
  const ICON = {
    logo: `<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="17" fill="#141414"/><text x="18" y="15" font-family="Arial Black,Arial" font-weight="900" font-size="7.5" fill="#fff" text-anchor="middle">left of</text><text x="18" y="23" font-family="Arial Black,Arial" font-weight="900" font-size="7.5" fill="#fff" text-anchor="middle">the dial</text></svg>`,
    star: `<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="17" fill="#1717ff"/><path fill="#fff" d="M18 7l3.2 7 7.6.8-5.7 5.1 1.6 7.5L18 23.6l-6.7 3.8 1.6-7.5-5.7-5.1 7.6-.8z"/></svg>`,
    dial: `<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="16" fill="#fff" stroke="#1717ff" stroke-width="3"/><path d="M18 18l-7-6" stroke="#1717ff" stroke-width="3" stroke-linecap="round"/><circle cx="18" cy="18" r="3" fill="#1717ff"/></svg>`,
    vinyl: `<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="17" fill="#141414"/><circle cx="18" cy="18" r="13" fill="none" stroke="#55555f"/><circle cx="18" cy="18" r="10" fill="none" stroke="#55555f"/><circle cx="18" cy="18" r="6" fill="#1717ff"/><circle cx="18" cy="18" r="1.6" fill="#fff"/></svg>`,
    fav: `<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="16" fill="none" stroke="#ff3d9a" stroke-width="3"/><circle cx="18" cy="18" r="11" fill="#141414"/><circle cx="18" cy="18" r="4.5" fill="#ff3d9a"/></svg>`,
    wind: `<svg viewBox="0 0 36 36"><rect width="36" height="36" rx="6" fill="#eef0ff"/><path d="M6 13h17M9 19h20M6 25h14" stroke="#1717ff" stroke-width="3" stroke-linecap="round"/></svg>`,
    combo: `<svg viewBox="0 0 36 36"><rect width="36" height="36" rx="6" fill="#1717ff"/><text x="18" y="24" font-family="Arial Black,Arial" font-weight="900" font-size="14" fill="#fff" text-anchor="middle">x5</text></svg>`
  };
  const misHtml = () => { const mis = missionsToday(), dn = prof.mis.done.filter(Boolean).length;
    return `<div class="wg-mis"><div class="wg-mis-h"><span>${Lg("Missies van vandaag", "Today's missions")}</span><b>★ ${dn}/3</b></div><ol>${mis.map((m, i) => `<li class="${prof.mis.done[i] ? "ok" : ""}${misDoneRun.includes(i) ? " now" : ""}"><i>${prof.mis.done[i] ? "✓" : ""}</i><span>${esc(misText(m))}</span>${misDoneRun.includes(i) ? "<small>+★</small>" : ""}</li>`).join("")}</ol></div>`; };
  function showStart() {
    state = "start"; bestEl.textContent = "Record " + best; stage = 0; root.classList.remove("dark"); paintStage(); setScore(0);
    show(`<div class="wg-kick">Left of the Dial · ${Lg("het spel", "the game")}</div><h2>Wapper<br>man<em>.</em></h2>
      <p>${Lg("Wapper, ontwijk de logo's en verzamel onderweg bands van het festival.", "Flap, dodge the logos and collect festival bands along the way.")}</p>
      <div class="wg-stats"><div class="hl"><b>${best}</b><small>Record</small></div><div><b>${prof.crate.length}</b><small>${Lg("Platen", "Records")}</small></div><div><b>★${prof.stars || 0}</b><small>${Lg("Sterren", "Stars")}</small></div><div><b>${streakNow()}</b><small>${Lg("Dagen op rij", "Day streak")}</small></div></div>
      ${misHtml()}
      <button class="wg-btn" id="a">${Lg("Spelen", "Play")} →</button>
      <div class="wg-row"><button class="wg-btn alt" id="b">Top 10</button><button class="wg-btn alt" id="c">${Lg("Platenkast", "Crate")}</button><button class="wg-btn alt" id="d">Skins</button><button class="wg-btn alt" id="e">${Lg("Hoe werkt het?", "How to play")}</button></div>`,
      () => { on("#a", start); on("#b", () => showTop()); on("#c", showCrate); on("#d", showSkins); on("#e", showHow); });
  }
  function showHow() {
    state = "start"; lock = performance.now() + 200;
    const row = (ic, t, d) => `<li>${ICON[ic]}<span><b>${t}</b>${d}</span></li>`;
    show(`<div class="wg-kick">${Lg("Spelregels", "How to play")}</div><h2>${Lg("Zo<br>werkt<em>'t.</em>", "How it<br>works<em>.</em>")}</h2>
      <p class="wg-sub">${Lg("Houd links of rechts op je scherm ingedrukt. Desktop: muis of pijltjestoetsen.", "Hold the left or right side of the screen. Desktop: mouse or arrow keys.")}</p>
      <ol class="wg-how">${row("logo", Lg("Ontwijk de logo's", "Dodge the logos"), Lg("Ook met je wapperende armen. Eén tik en je bent af.", "Your flapping arms count too. One touch and you're out."))}
      ${row("combo", Lg("Net gemist = combo", "Near miss = combo"), Lg("Dicht langs een logo geeft punten en bouwt je combo op tot x5.", "Close calls give points and build your combo up to x5."))}
      ${row("star", Lg("Ster: schild", "Star: shield"), Lg("Beschermt je één keer.", "Protects you once."))}
      ${row("dial", Lg("Radio-dial: slow-mo", "Radio dial: slow-mo"), Lg("Vijf seconden alles langzamer.", "Five seconds of slow motion."))}
      ${row("vinyl", Lg("Vinyl: ontdek een band", "Vinyl: discover a band"), Lg("Echte bands van het festival. Ze komen in je platenkast.", "Real festival bands. They go into your crate."))}
      ${row("fav", Lg("Roze vinyl: je favoriet", "Pink vinyl: your favourite"), Lg("Een band uit jouw lijst: dubbele punten.", "A band from your list: double points."))}
      ${row("wind", Lg("Wind en regen", "Wind and rain"), Lg("Golven die je wegduwen of meer logo's sturen. Overleef ze voor +25.", "Waves that push you or send more logos. Survive them for +25."))}</ol>
      <p class="wg-sub">${Lg("Elke 500 punten een nieuwe festivaldag, tot de Afterparty. Elke dag drie nieuwe missies: sterren speel je om in skins.", "Every 500 points a new festival day, up to the Afterparty. Three new missions every day: stars unlock skins.")}</p>
      <button class="wg-btn" id="a">${Lg("Spelen", "Play")} →</button><button class="wg-btn alt" id="b">${Lg("Terug", "Back")}</button>`, () => { on("#a", start); on("#b", showStart); });
  }
  function showCrate() {
    state = "start"; lock = performance.now() + 200;
    const tot = crateTotal(), have = prof.crate.slice().sort((a, b) => a.localeCompare(b)), pct = tot ? Math.round(have.length / tot * 100) : 0;
    const favNames = new Set(typeof ACTS !== "undefined" ? ACTS.filter(a => isFavAct(a.id)).map(a => a.name) : []);
    show(`<div class="wg-kick">${Lg("Jouw verzameling", "Your collection")}</div><h2>${Lg("Platen<br>kast<em>.</em>", "Record<br>crate<em>.</em>")}</h2>
      <p><b>${have.length}</b> ${Lg("van de", "of")} ${tot} ${Lg("bands ontdekt", "bands discovered")} (${pct}%)</p><div class="wg-prog"><b style="width:${pct}%"></b></div>
      ${have.length ? `<div class="wg-crate">${have.map(n => `<button class="wg-chip${favNames.has(n) ? " fav" : ""}" data-n="${esc(n)}">${esc(n)}</button>`).join("")}</div><p class="wg-sub">${Lg("Tik op een band voor tijden en info.", "Tap a band for times and info.")}</p>` : `<p class="wg-sub">${Lg("Nog leeg. Pak de vinyls in het spel om bands te verzamelen.", "Still empty. Grab the records in the game to collect bands.")}</p>`}
      <button class="wg-btn" id="a">${Lg("Spelen", "Play")} →</button><button class="wg-btn alt" id="b">${Lg("Terug", "Back")}</button>`, () => {
        ov.querySelectorAll("[data-n]").forEach(c => c.addEventListener("click", () => { if (typeof ACTS === "undefined" || typeof openAct !== "function") return; const a = ACTS.find(x => x.name === c.dataset.n && !x.cancelled) || ACTS.find(x => x.name === c.dataset.n); if (a) try { openAct(a.id); } catch {} }));
        on("#a", start); on("#b", showStart);
      });
  }
  function skinPreview(cv2, SK) {
    const d = 2, keep = [cx, s]; cv2.width = 64 * d; cv2.height = 84 * d; const g = cv2.getContext("2d"); g.setTransform(d, 0, 0, d, 0, 0);
    cx = g; s = .52; try { wapper(32, 76, 1.3, 0, PALS[0], SK); } finally { cx = keep[0]; s = keep[1]; }
  }
  function showSkins() {
    state = "start"; lock = performance.now() + 200;
    const cur = skinOf().id;
    show(`<div class="wg-kick">${Lg("Kies je wapperman", "Pick your flapper")}</div><h2>Skins<em>.</em></h2>
      <p class="wg-sub">${Lg("Sterren verdien je met de dagelijkse missies.", "Earn stars with the daily missions.")} ★ ${prof.stars || 0}</p>
      <div class="wg-skins">${SKINS.map(k => { const ok = k.need(prof, best); return `<button class="wg-skin${k.id === cur ? " on" : ""}${ok ? "" : " lock"}" data-k="${k.id}" ${ok ? "" : 'aria-disabled="true"'}><canvas></canvas>${Lg(k.nl, k.en)}<small>${ok ? (k.id === cur ? Lg("Gekozen", "Selected") : Lg("Tik om te kiezen", "Tap to pick")) : "🔒 " + Lg(k.how[0], k.how[1])}</small></button>`; }).join("")}</div>
      <button class="wg-btn" id="a">${Lg("Spelen", "Play")} →</button><button class="wg-btn alt" id="b">${Lg("Terug", "Back")}</button>`, () => {
        ov.querySelectorAll(".wg-skin").forEach(b => { const k = SKINS.find(z => z.id === b.dataset.k); skinPreview(b.querySelector("canvas"), k);
          b.addEventListener("click", () => { if (!k.need(prof, best)) return; prof.skin = k.id; saveProf(); beep(660, .05); showSkins(); }); });
        on("#a", start); on("#b", showStart);
      });
  }
  function finishRun() {
    const d = today(); if (prof.lastDay !== d) { prof.streak = prof.lastDay === yesterday() ? (prof.streak || 0) + 1 : 1; prof.lastDay = d; }
    prof.games = (prof.games || 0) + 1; prof.time = Math.round((prof.time || 0) + elapsed);
    newFound.forEach(n => { if (!prof.crate.includes(n)) prof.crate.push(n); });
    saveProf();
  }
  const fmtT = t => { const m = Math.floor(t / 60), sec = Math.floor(t % 60); return m + ":" + String(sec).padStart(2, "0"); };
  function gameOver() {
    state = "over"; lock = performance.now() + 700; bestEl.textContent = "Record " + best; finishRun();
    const unlocked = unlockedIds().filter(id => !unlockBefore.includes(id)).map(id => SKINS.find(k => k.id === id));
    const chips = found.length ? `<h3>${Lg("Bands ontdekt", "Bands discovered")}</h3><div class="wg-chips">${found.slice(0, 10).map(f => `<button class="wg-chip${isFavAct(f.id) ? " fav" : ""}" data-f="${esc(f.id)}">${esc(f.name)}${newFound.includes(f.name) ? `<sup>${Lg("NIEUW", "NEW")}</sup>` : ""}</button>`).join("")}</div>` : "";
    const mis = misDoneRun.map(i => `<div class="wg-gotmis">★ ${Lg("Missie voltooid", "Mission complete")}: ${esc(misText(todayMis[i]))}</div>`).join("");
    const unl = unlocked.map(k => `<div class="wg-unlock"><span>${Lg("Nieuwe skin vrijgespeeld", "New skin unlocked")}</span><b>${Lg(k.nl, k.en)}</b></div>`).join("");
    show(`<div class="wg-kick">${stageName(stage)} · ${fmtT(elapsed)}</div><h2>${isRec ? Lg("Nieuw<br>record<em>!</em>", "New<br>record<em>!</em>") : Lg("Af<em>.</em>", "Out<em>.</em>")}</h2>
      <div class="wg-big"><b>${score}</b><span>${Lg("punten", "points")}</span></div>
      <div class="wg-stats"><div class="hl"><b>${best}</b><small>Record</small></div><div><b>${dodged}</b><small>${Lg("Ontweken", "Dodged")}</small></div><div><b>x${maxMult}</b><small>Max combo</small></div><div><b>${found.length}</b><small>Bands</small></div></div>
      ${mis}${unl}${chips}
      <p class="wg-q" id="qm"></p><div id="sbox"><input id="n" maxlength="16" placeholder="${Lg("Je naam", "Your name")}" autocomplete="off" enterkeyhint="done" aria-label="${Lg("Naam", "Name")}"><button class="wg-btn ink" id="sv" disabled>${Lg("Opslaan in Top 10", "Save to Top 10")}</button></div>
      <button class="wg-btn" id="r">${Lg("Nog een keer", "Play again")} ↻</button>
      <div class="wg-row"><button class="wg-btn alt" id="t">Top 10</button><button class="wg-btn alt" id="sh">${Lg("Deel score", "Share score")}</button></div>
      <button class="wg-btn alt" id="m">${Lg("Missies, platen & skins", "Missions, crate & skins")}</button>`, () => {
      ov.querySelectorAll(".wg-chip").forEach(c => c.addEventListener("click", () => { if (performance.now() < lock) return; if (typeof openAct === "function") { try { openAct(c.dataset.f); } catch {} } }));
      on("#sh", el => shareScore(el));
      const n = ov.querySelector("#n"), sv = ov.querySelector("#sv"), qm = ov.querySelector("#qm"), box = ov.querySelector("#sbox");
      n.value = ""; sv.disabled = true;
      n.addEventListener("input", () => { sv.disabled = !n.value.trim(); });
      n.addEventListener("keydown", e => { if (e.key === "Enter" && !sv.disabled) sv.click(); });
      on("#r", start); on("#t", () => showTop()); on("#m", showStart);
      on("#sv", async () => {
        const name = n.value.trim().slice(0, 16); if (!name) return; sv.disabled = true;
        const res = await leaderboard.submitScore(name, score); showTop({ name, score }, res);
      });
      box.style.display = "none";
      leaderboard.getTopScores().then(({ list }) => {         // haal je de Top 10? zo niet, dan geen naamveld
        if (state !== "over") return; const need = list.length >= 10 ? list[9].score : -1;
        if (score > need) { box.style.display = ""; qm.textContent = Lg("Je haalt de Top 10! Vul je naam in.", "You made the Top 10! Enter your name."); }
        else qm.innerHTML = Lg(`Net niet in de Top 10. Je mist nog <b>${need - score + 1}</b> punten.`, `Just missed the Top 10. You need <b>${need - score + 1}</b> more points.`);
      });
    });
  }
  async function shareScore(el) {
    const url = location.origin + location.pathname + "#/game", text = Lg(`Ik haalde ${score} punten in Wapperman (Left of the Dial 2026). Kun jij dit verbeteren?`, `I scored ${score} in Wapperman (Left of the Dial 2026). Can you beat it?`);
    try {
      const blob = await scoreCard(), file = blob && new File([blob], "wapperman-score.png", { type: "image/png" });
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: "Wapperman", text: text + " " + url }); return; }
    } catch (e) { if (e && e.name === "AbortError") return; }
    if (navigator.share) navigator.share({ title: "Wapperman", text, url }).catch(() => {});
    else if (navigator.clipboard) navigator.clipboard.writeText(text + " " + url).then(() => { el.textContent = Lg("Gekopieerd", "Copied"); }).catch(() => {});
  }
  function scoreCard() {           /* deelbare afbeelding 1080x1350 in festivalstijl */
    return new Promise(res => {
      const c = document.createElement("canvas"); c.width = 1080; c.height = 1350; const g = c.getContext("2d"), keep = [cx, s];
      g.fillStyle = "#1717ff"; g.fillRect(0, 0, 1080, 1350);
      g.fillStyle = "#141414"; g.fillRect(0, 0, 1080, 70); g.fillStyle = "#fff"; g.font = `700 30px ${FONT_D}`; g.textBaseline = "middle"; g.fillText("LEFT OF THE DIAL 2026  ✳  21 / 22 / 23 / 24 " + Lg("OKTOBER", "OCTOBER") + "  ✳  ROTTERDAM", 40, 37);
      g.textBaseline = "alphabetic"; g.fillStyle = "#fff"; g.font = `800 150px ${FONT_D}`; g.fillText("WAPPERMAN.", 60, 250);
      g.font = `800 420px ${FONT_D}`; g.fillText(String(score), 50, 640);
      g.font = `700 44px ${FONT_B}`; g.fillStyle = "#c6d0ff"; g.fillText(Lg("PUNTEN", "POINTS") + (isRec ? Lg("  ·  NIEUW RECORD!", "  ·  NEW RECORD!") : ""), 64, 720);
      g.fillStyle = "#fff"; g.font = `600 40px ${FONT_B}`;
      [[Lg("Podium", "Stage"), stageName(stage)], [Lg("Ontweken", "Dodged"), dodged], ["Max combo", "x" + maxMult], [Lg("Bands ontdekt", "Bands found"), found.length]].forEach(([k, v], i) => { const y = 830 + i * 70; g.fillStyle = "#c6d0ff"; g.fillText(k, 64, y); g.fillStyle = "#fff"; g.font = `800 52px ${FONT_D}`; g.fillText(String(v), 420, y); g.font = `600 40px ${FONT_B}`; });
      g.fillStyle = "#141414"; g.fillRect(0, 1190, 1080, 160); g.fillStyle = "#fff"; g.font = `800 56px ${FONT_D}`; g.fillText(Lg("KUN JIJ DIT VERBETEREN?", "CAN YOU BEAT IT?"), 60, 1265); g.font = `600 34px ${FONT_B}`; g.fillStyle = "#c6d0ff"; g.fillText(location.host + "/#/game", 60, 1315);
      cx = g; s = 3.1; try { wapper(860, 1150, 1.1, 0, PALS[2], skinOf()); } catch {} finally { cx = keep[0]; s = keep[1]; }
      c.toBlob(b => res(b), "image/png");
    });
  }
  async function showTop(me, res) {
    state = "top"; lock = performance.now() + 250;
    show(`<div class="wg-kick">${Lg("Iedereen die meespeelt", "Everyone playing")}</div><h2>Top 10<em>.</em></h2><p>${Lg("Laden…", "Loading…")}</p>`);
    const { list, source } = await leaderboard.getTopScores(); if (state !== "top") return;
    const note = res && res.queued ? Lg("Geen verbinding: je score wordt later verstuurd.", "No connection: your score will be sent later.") + (leaderboard.err() ? " [" + leaderboard.err() + "]" : "")
      : source === "local" ? Lg("Let op: deze scores staan alleen op dit apparaat.", "Note: these scores are stored on this device only.")
      : source === "cache" ? Lg("Offline: laatst bekende stand.", "Offline: last known standings.") : "";
    const mark = me ? list.findIndex(r => r.name.toLowerCase() === me.name.toLowerCase() && r.score === me.score) : -1;
    const rows = list.map((r, i) => `<li class="${i === mark ? "me" : ""}"><i>${i + 1}</i><span>${esc(r.name)}</span><b>${r.score}</b></li>`).join("") || `<li><span>${Lg("Nog geen scores", "No scores yet")}</span></li>`;
    show(`<div class="wg-kick">${Lg("Iedereen die meespeelt", "Everyone playing")}</div><h2>Top 10<em>.</em></h2>${note ? `<p class="wg-note">${note}</p>` : ""}<ol class="wg-top">${rows}</ol><button class="wg-btn" id="a">${Lg("Spelen", "Play")} →</button>${source === "cache" ? `<button class="wg-btn alt" id="rt">${Lg("Opnieuw proberen", "Try again")}</button>` : ""}<button class="wg-btn alt" id="b">${Lg("Terug", "Back")}</button>`,
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
      show(`<div class="wg-kick">${stageName(stage)} · ${score} ${Lg("punten", "points")}</div><h2>${Lg("Pauze", "Paused")}<em>.</em></h2><button class="wg-btn" id="a">${Lg("Verder", "Resume")} →</button>`, () => on("#a", () => { hide(); last = 0; state = "playing"; }));
    }
  }

  /* ---------- mount ---------- */
  function mount() {
    if (root) return;
    if (!document.getElementById("wg-style")) { const st = document.createElement("style"); st.id = "wg-style"; st.textContent = CSS; document.head.appendChild(st); }
    root = document.createElement("div"); root.className = "wg";
    root.innerHTML = `<canvas></canvas><div class="wg-hud"><div class="wg-l"><div class="wg-score">0</div><div class="wg-rec"><span class="wg-best"></span><i class="wg-recbar"><b></b></i></div><div class="wg-combo"></div></div><div class="wg-mid"><span class="wg-stage"></span><span class="wg-pw"></span></div><div class="wg-btns"><button class="wg-snd" aria-label="Geluid"></button><button class="wg-x" aria-label="Sluiten">✕</button></div></div><div class="wg-ov"></div>`;
    document.body.appendChild(root);
    cv = root.querySelector("canvas"); cx = cv.getContext("2d"); scoreEl = root.querySelector(".wg-score"); bestEl = root.querySelector(".wg-best"); comboEl = root.querySelector(".wg-combo"); ov = root.querySelector(".wg-ov"); stageEl = root.querySelector(".wg-stage"); pwEl = root.querySelector(".wg-pw"); recbarEl = root.querySelector(".wg-recbar b"); pwLast = ""; sndEl = root.querySelector(".wg-snd");
    prevOverflow = [document.documentElement.style.overflow, document.body.style.overflow];
    document.documentElement.style.overflow = document.body.style.overflow = "hidden";
    sprites = [makeSprite(false), makeSprite(true)]; mouseX = null; keyDir = touchDir = 0; active = null; last = 0; x = 0; obstacles = []; pickups = []; tokens = []; particles = []; pops = []; def = 0; stage = 0; banner = null;
    const sndIco = () => { sndEl.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor"/>${muted ? '<path d="m22 9-6 6M16 9l6 6"/>' : '<path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>'}</svg>`; sndEl.setAttribute("aria-pressed", String(!muted)); };
    sndIco(); if (document.fonts && document.fonts.load) { try { document.fonts.load(`800 40px ${FONT_D}`); document.fonts.load(`700 16px ${FONT_B}`); } catch {} }
    sndEl.addEventListener("click", () => { muted = !muted; store.set(MUTE_KEY, muted ? "1" : "0"); sndIco(); if (!muted) beep(660, .06); });
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
  if (window.__WG_TEST) window.__WG_API = { get: () => ({ state, x, W, H, s, groundY, laneW, obstacles, pickups, tokens, score, elapsed, mult, found, slow, evKind, evPhase, windDir, maxV, stage, prof, misDoneRun }), setKey: d => { keyDir = d; }, start, setBonus: n => { bonus = n; }, setInv: n => { inv = n; }, card: () => scoreCard().then(b => new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(b); })) };
})();
