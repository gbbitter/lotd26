/* REWIND THE DIAL — jouw Left of the Dial 2026 in ±60 seconden (story-stijl, persoonlijk, opnieuw af te spelen).
   Gebruikt alleen gegevens op dit toestel: favorieten, moet-ik-zien, route, Wapperman. Niets wordt verstuurd. */
(function () {
  "use strict";
  if (window.LotdRewind) return;
  const W = window.__lotdWrap || {};
  const LS = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } } };
  const lang = () => (W.lang ? W.lang() : (LS.get("lotd-lang", "nl") || "nl"));
  const L = (nl, en) => (lang() === "en" ? en : nl);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TICKETS = "https://leftofthedial.nl/tickets/";
  const SALE = new Date("2026-10-25T10:00:00+01:00");
  const DAYNAME = { w: ["woensdag", "Wednesday"], d: ["donderdag", "Thursday"], v: ["vrijdag", "Friday"], z: ["zaterdag", "Saturday"] };
  const dayN = id => L(DAYNAME[id] ? DAYNAME[id][0] : id, DAYNAME[id] ? DAYNAME[id][1] : id);
  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, L(".", ","));

  /* ---------- gegevens ---------- */
  function data() {
    const all = (typeof ACTS !== "undefined" ? ACTS : []).filter(a => !a.cancelled);
    const favIds = new Set(typeof favs !== "undefined" ? favs : LS.get("lotd-favs", []));
    const isStar = W.isStar || (id => (LS.get("lotd-stars", []) || []).includes(id));
    const isGreen = W.isGreen || (() => false);
    const mine = all.filter(a => favIds.has(a.id));
    const uniq = arr => [...new Set(arr)];
    const bands = uniq(all.filter(a => a.genre !== "Extra" && !a.after).map(a => a.name));
    const base = W.base || (n => n);
    const venues = uniq(all.map(a => base((typeof venue === "function" ? venue(a.venueId) : { name: "" }).name)));
    const cc = list => uniq(list.flatMap(a => (a.country || "").split("/").filter(Boolean)));
    const order = { w: 0, d: 1, v: 2, z: 3 };
    const t = a => (order[a.day] || 0) * 2000 + (typeof mins === "function" ? mins(a.start) : 0);
    const myBands = uniq(mine.map(a => a.name));
    const must = uniq(mine.filter(a => isStar(a.id)).sort((x, y) => (isGreen(y.id) - isGreen(x.id)) || t(x) - t(y)).map(a => a.name));
    const gCount = {}; mine.forEach(a => (a.genres || []).forEach(g => { if (g && g !== "extra" && g !== "afterparty") gCount[g] = (gCount[g] || 0) + 1; }));
    const spec = o => { const e = Object.entries(o).sort((x, y) => y[1] - x[1]), sp = e.filter(([g]) => g !== "rock" && g !== "pop"); return (sp.length >= 3 ? sp : e).slice(0, 4); };
    const genres = spec(gCount);
    const fGenre = {}; all.forEach(a => (a.genres || []).forEach(g => { if (g && g !== "extra" && g !== "afterparty") fGenre[g] = (fGenre[g] || 0) + 1; }));
    const festGenres = spec(fGenre);
    const dCount = {}; mine.forEach(a => { dCount[a.day] = (dCount[a.day] || 0) + 1; });
    const busiest = Object.entries(dCount).sort((x, y) => y[1] - x[1])[0];
    const vCount = {}; mine.forEach(a => { const n = base(venue(a.venueId).name); vCount[n] = (vCount[n] || 0) + 1; });
    const favVenue = Object.entries(vCount).sort((x, y) => y[1] - x[1])[0];
    const sorted = mine.slice().sort((x, y) => t(x) - t(y));
    let route = null; try { route = W.route ? W.route() : null; } catch (e) {}
    let musicMin = 0, walkMin = 0, hops = [];
    if (route && route.chosen && route.chosen.length) {
      const ch = route.chosen;
      ch.forEach((a, i) => { musicMin += Math.max(0, mins(a.end) - mins(a.start)); const n = ch[i + 1]; if (n && n.day === a.day && a.venueId !== n.venueId) { const w = W.walk ? W.walk(a, n) : null; if (w) walkMin += w; } });
      hops = uniq(ch.map(a => base(venue(a.venueId).name)));
    }
    const prof = LS.get("lotd-wapperman-profile", null) || {};
    const best = +(LS.get("lotd-wapperman-best", 0) || 0);
    const name = (() => { try { return (localStorage.getItem("lotd-wapperman-name") || "").trim(); } catch (e) { return ""; } })();
    const shows = all.filter(a => a.genre !== "Extra" && !a.after), festMin = shows.reduce((n, a) => n + (a.endUnknown ? 45 : Math.max(0, mins(a.end) - mins(a.start))), 0);
    const cTop = {}; bands.forEach(n => { const a = all.find(x => x.name === n); (a && a.country ? a.country.split("/") : []).forEach(c => { cTop[c] = (cTop[c] || 0) + 1; }); });
    const topC = Object.entries(cTop).sort((x, y) => y[1] - x[1])[0] || ["UK", 0];
    const lastEnd = Math.max(...all.filter(a => a.day === "z").map(a => mins(a.end) || 0)), hhmm = m => { m = m % 1440; return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"); };
    const oo = mine.filter(a => (a.day === "v" || a.day === "z") && mins(a.start) < 960).length;
    return {
      all, bands, venues, countries: cc(all), myCountries: cc(mine), mine, myBands, must, genres, festGenres, busiest, favVenue,
      first: sorted[0], last: sorted[sorted.length - 1], route, musicMin, walkKm: Math.round(walkMin * 80 / 100) / 10, hops,
      prof, best, name, oo, has: myBands.length > 0, played: !!(prof.games || best > 0),
      festHours: Math.round(festMin / 60), shows: shows.length, topC, lastNote: isFinite(lastEnd) ? hhmm(lastEnd) : "",
      top: LS.get("lotd-wapperman-top-cache", []) || []
    };
  }

  /* ---------- stijl ---------- */
  const CSS = `
#rw{position:fixed;inset:0;z-index:5000;background:#0b0b14;color:#fff;overflow:hidden;font-family:"Barlow",Arial,sans-serif;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;touch-action:none}
#rw *{box-sizing:border-box}
#rw .rw-bars{position:absolute;left:10px;right:10px;top:calc(10px + env(safe-area-inset-top,0px));display:flex;gap:4px;z-index:5}
#rw .rw-bars i{flex:1;height:3px;border-radius:2px;background:rgba(255,255,255,.3);overflow:hidden}
#rw .rw-bars i b{display:block;height:100%;width:0;background:#fff}
#rw .rw-top{position:absolute;left:12px;right:12px;top:calc(20px + env(safe-area-inset-top,0px));display:flex;align-items:center;gap:8px;z-index:6;font:800 13px/1 "Barlow Condensed",Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase}
#rw .rw-top span{flex:1;opacity:.85}
#rw .rw-x,#rw .rw-pp{width:40px;height:40px;border:0;border-radius:50%;background:rgba(0,0,0,.25);color:#fff;font:400 22px/1 Arial;display:grid;place-items:center;cursor:pointer}
#rw .rw-stage{position:absolute;inset:0}
#rw .sl{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:calc(76px + env(safe-area-inset-top,0px)) 26px calc(40px + env(safe-area-inset-bottom,0px));overflow:hidden}
#rw .sl.blue{background:#1717ff;color:#fff}#rw .sl.ink{background:#0b0b14;color:#fff}#rw .sl.pink{background:#ff3d9a;color:#fff}#rw .sl.yellow{background:#ffd23f;color:#141414}#rw .sl.white{background:#fff;color:#141414}
#rw .k{font:800 13px/1 "Barlow Condensed",Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;opacity:.85;margin-bottom:12px}
#rw .sl .rw-h,#rw .sl .h2{color:inherit!important}
#rw .rw-h{font:800 clamp(46px,15vw,92px)/.86 "Barlow Condensed",Arial,sans-serif;text-transform:uppercase;letter-spacing:-.01em;margin:0}
#rw .h2{font:800 clamp(34px,10.5vw,64px)/.9 "Barlow Condensed",Arial,sans-serif;text-transform:uppercase;margin:0}
#rw .rw-p{font:600 clamp(17px,4.8vw,22px)/1.3 "Barlow",Arial,sans-serif;margin:16px 0 0;max-width:30ch}
#rw .rw-big{font:800 clamp(110px,40vw,230px)/.8 "Barlow Condensed",Arial,sans-serif;letter-spacing:-.03em;display:block}
#rw .w{display:inline-block;opacity:0;transform:translateY(.5em) rotate(4deg);animation:rwUp .55s cubic-bezier(.2,.9,.3,1.3) forwards}
@keyframes rwUp{to{opacity:1;transform:none}}
@keyframes rwIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
@keyframes rwPop{0%{opacity:0;transform:scale(.3) rotate(-8deg)}70%{opacity:1;transform:scale(1.08) rotate(2deg)}100%{opacity:1;transform:none}}
@keyframes rwSpin{to{transform:rotate(-360deg)}}
@keyframes rwMarL{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes rwMarR{from{transform:translateX(-50%)}to{transform:translateX(0)}}
@keyframes rwEq{0%,100%{transform:scaleY(.25)}50%{transform:scaleY(1)}}
@keyframes rwFloat{0%{transform:translateY(110vh) rotate(0)}100%{transform:translateY(-20vh) rotate(var(--r,180deg))}}
@keyframes rwCred{from{transform:translateY(0)}to{transform:translateY(calc(-100% - var(--sh,100vh)))}}
@keyframes rwDash{to{stroke-dashoffset:0}}
@keyframes rwPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
#rw .in{opacity:0;animation:rwIn .6s ease forwards}
#rw .pop{opacity:0;animation:rwPop .6s cubic-bezier(.2,.9,.3,1.2) forwards}
#rw .dial{position:absolute;width:min(120vw,620px);aspect-ratio:1;right:-34vw;bottom:-30vw;opacity:.95;animation:rwSpin 26s linear infinite}
#rw .mq{position:absolute;left:0;right:0;white-space:nowrap;font:800 clamp(30px,9vw,54px)/1 "Barlow Condensed",Arial,sans-serif;text-transform:uppercase;letter-spacing:.01em;opacity:.95}
#rw .mq div{display:inline-block;animation:rwMarL linear infinite}
#rw .mq.r div{animation-name:rwMarR}
#rw .mq span{margin-right:.45em;color:rgba(255,255,255,.28)}
#rw .mq span.me{color:#fff}#rw .mq span.must{color:#ffd23f}
#rw .mq span.hz{color:#ff3d9a;margin-right:.45em}
#rw .chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
#rw .chips b{font:800 clamp(20px,6vw,30px)/1 "Barlow Condensed",Arial,sans-serif;text-transform:uppercase;padding:8px 12px;border-radius:4px;background:#fff;color:#1717ff}
#rw .eq{display:flex;align-items:flex-end;gap:10px;height:34vh;margin-top:22px}
#rw .eq div{flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:stretch;height:100%;gap:6px}
#rw .eq i{display:block;background:#141414;border-radius:4px 4px 0 0;transform-origin:bottom;animation:rwEq 1s ease-in-out infinite}
#rw .eq small{font:800 13px/1.05 "Barlow Condensed",Arial,sans-serif;text-transform:uppercase;letter-spacing:.04em;text-align:center;min-height:2.1em}
#rw .stack{display:flex;flex-direction:column;gap:2px;margin-top:10px}
#rw .stack b{font:800 clamp(30px,10vw,58px)/.95 "Barlow Condensed",Arial,sans-serif;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#rw .stack b:nth-child(odd){color:#ffd23f}
#rw .stats{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:20px}
#rw .stats div{border:2px solid currentColor;border-radius:8px;padding:12px}
#rw .stats b{display:block;font:800 clamp(38px,12vw,64px)/.9 "Barlow Condensed",Arial,sans-serif}
#rw .stats small{display:block;margin-top:6px;font:700 12px/1.2 "Barlow",Arial,sans-serif;text-transform:uppercase;letter-spacing:.06em;opacity:.8}
#rw .cc{display:flex;flex-wrap:wrap;gap:8px;margin-top:20px}
#rw .cc b{font:800 clamp(26px,8vw,40px)/1 "Barlow Condensed",Arial,sans-serif;padding:8px 12px;border:3px solid #141414;border-radius:6px}
#rw .heart{position:absolute;top:0;left:0;width:var(--s,28px);height:var(--s,28px);color:var(--c,#fff);animation:rwFloat var(--d,6s) linear forwards;animation-delay:var(--dl,0s);transform:translateY(110vh)}
#rw .cred{position:absolute;left:0;right:0;top:100%;text-align:center;animation:rwCred 9s linear forwards}
#rw .cred div{font:800 clamp(24px,7vw,36px)/1.25 "Barlow Condensed",Arial,sans-serif;text-transform:uppercase;opacity:.9}
#rw .cred small{display:block;margin:22px 0 6px;font:700 13px "Barlow",Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;opacity:.7}
#rw .rw-route svg{width:100%;height:30vh;margin-top:12px;overflow:visible}
#rw .rw-route path{fill:none;stroke:#fff;stroke-width:4;stroke-linecap:round;stroke-dasharray:6 10}
#rw .rw-route .ln{stroke-dasharray:2000;stroke-dashoffset:2000;animation:rwDash 4s ease forwards;stroke-width:5}
#rw .rw-wm canvas{width:min(46vw,210px);height:auto;display:block;margin:10px 0 0 -8px}
#rw .cta{display:flex;flex-direction:column;gap:10px;margin-top:22px;max-width:420px;pointer-events:auto}
#rw .cta a,#rw .cta button{display:flex;align-items:center;justify-content:center;gap:8px;min-height:54px;border-radius:8px;border:0;font:800 20px/1 "Barlow Condensed",Arial,sans-serif;letter-spacing:.04em;text-transform:uppercase;text-decoration:none;cursor:pointer}
#rw .cta .t1{background:#fff;color:#1717ff}
#rw .cta .t1.soon{background:#ffd23f;color:#141414;flex-direction:column;gap:3px}
#rw .cta .t1 small{font:700 12px/1 "Barlow",Arial,sans-serif;letter-spacing:.04em;text-transform:none}
#rw .cta .t2{background:rgba(23,23,255,.88);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);color:#fff;border:2px solid #fff}
#rw .cta .rw-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
#rw .tapL,#rw .tapR{position:absolute;top:0;bottom:0;z-index:4}
#rw.lite .rw-top{color:#141414}#rw.lite .rw-x,#rw.lite .rw-pp{background:rgba(0,0,0,.08);color:#141414}#rw.lite .rw-bars i{background:rgba(0,0,0,.18)}#rw.lite .rw-bars i b{background:#141414}
#rw .roul{margin-top:18px;min-height:2.1em;display:flex;align-items:center}
#rw .roul b{font:800 clamp(40px,13vw,80px)/.92 "Barlow Condensed",Arial,sans-serif;text-transform:uppercase;overflow-wrap:anywhere}
#rw .roul b.land{color:#ffd23f;animation:rwPop .5s cubic-bezier(.2,.9,.3,1.3)}
#rw .rdial{width:120px;height:120px;margin-bottom:18px}
#rw .rdial svg{position:static;width:100%;height:100%;animation:none;opacity:1}
#rw .reveal{opacity:0;transition:opacity .5s}#rw .reveal.on{opacity:1}
#rw .tapL{left:0;width:33%}#rw .tapR{right:0;width:67%}#rw.last .tapL,#rw.last .tapR{display:none}
#rw .rw-hint{position:absolute;left:0;right:0;bottom:calc(18px + env(safe-area-inset-bottom,0px));text-align:center;font:700 12px "Barlow",Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase;opacity:.6;z-index:3}
#rw .paused .sl *,#rw.paused .sl *{animation-play-state:paused!important}
@media (prefers-reduced-motion:reduce){#rw .dial,#rw .mq div,#rw .eq i{animation:none!important}#rw .heart{display:none}}
`;

  /* ---------- tekenwerk ---------- */
  const words = (txt, d0 = 0, step = 90) => esc(txt).split(" ").map((w, i) => `<span class="w" style="animation-delay:${d0 + i * step}ms">${w}</span>`).join(" ");
  const dialSvg = (col = "#fff", acc = "#ff3d9a") => `<svg class="dial" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="96" fill="none" stroke="${col}" stroke-width="3" opacity=".5"/>${Array.from({ length: 60 }, (_, i) => { const a = i * 6 * Math.PI / 180, r1 = i % 5 ? 84 : 76; return `<line x1="${100 + Math.cos(a) * r1}" y1="${100 + Math.sin(a) * r1}" x2="${100 + Math.cos(a) * 92}" y2="${100 + Math.sin(a) * 92}" stroke="${col}" stroke-width="${i % 5 ? 1.5 : 3}" opacity=".8"/>`; }).join("")}<circle cx="100" cy="100" r="56" fill="${col}" opacity=".12"/><circle cx="100" cy="100" r="44" fill="none" stroke="${col}" stroke-width="2"/><line x1="100" y1="100" x2="100" y2="22" stroke="${acc}" stroke-width="6" stroke-linecap="round"/><circle cx="100" cy="100" r="8" fill="${acc}"/></svg>`;
  const HEART = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 21.2l-1.4-1.3C5.4 15.2 2 12.1 2 8.3 2 5.2 4.4 2.8 7.5 2.8c1.7 0 3.4.8 4.5 2.1 1.1-1.3 2.8-2.1 4.5-2.1 3.1 0 5.5 2.4 5.5 5.5 0 3.8-3.4 6.9-8.6 11.6L12 21.2z"/></svg>';
  const hearts = (n, cols, d0 = 0) => reduced ? "" : Array.from({ length: n }, (_, i) => `<i class="heart" style="left:${Math.round(Math.random() * 92)}%;--s:${18 + Math.round(Math.random() * 46)}px;--c:${cols[i % cols.length]};--d:${3.5 + Math.random() * 3}s;--dl:${d0 + Math.random() * 2.5}s;--r:${Math.round(Math.random() * 360 - 180)}deg">${HEART}</i>`).join("");
  const marquee = (names, cls, top, dur, dir, mine, must) => { const row = names.map(n => `<span class="${must.has(n) ? "must" : mine.has(n) ? "me" : ""}">${esc(n)}</span><span class="hz">♥</span>`).join(""); return `<div class="mq ${dir}" style="top:${top}%"><div style="animation-duration:${dur}s">${row}${row}</div></div>`; };
  function counter(el, to, ms) { if (!el) return; if (reduced) { el.textContent = fmt(to); return; } const t0 = performance.now(); const step = now => { const k = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - k, 3); el.textContent = fmt(Math.round(to * e)); if (k < 1 && el.isConnected) requestAnimationFrame(step); }; requestAnimationFrame(step); }

  /* ---------- de slides ---------- */
  function wmAnim(el) { const cv = el.querySelector("canvas"); if (!cv || !window.WappermanGame || !WappermanGame.preview) { cv && cv.remove(); return; } const t0 = performance.now(); const loop = now => { if (!cv.isConnected) return; try { WappermanGame.preview(cv, (now - t0) / 1000 * 1.4, 140, 175, 0.95); } catch (e) { return; } if (!reduced) requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
  let curD = null;
  const rankTxt = () => { const D = curD; if (!D || !D.name || !D.top || !D.top.length) return ""; const i = D.top.findIndex(r => (r.name || "").toLowerCase() === D.name.toLowerCase()); return i >= 0 ? " " + L(`Je staat #${i + 1} in de top 10!`, `You're #${i + 1} in the top 10!`) : ""; };
  function slides(D) {
    const S = [];
    const mineSet = new Set(D.myBands), mustSet = new Set(D.must);
    const shuffled = D.bands.slice().sort(() => Math.random() - .5);
    const third = Math.ceil(shuffled.length / 3);
    const who = D.name ? esc(D.name) + ", " : "";
    /* 1. intro */
    S.push({ dur: 5200, cls: "blue", html: () => `${dialSvg()}<div class="k in">Left of the Dial 2026 · Rotterdam</div><h1 class="rw-h">${words("Rewind", 150)}<br>${words("the dial.", 450)}</h1><p class="rw-p in" style="animation-delay:1.1s">${who ? who + L("dit was jouw festival.", "this was your festival.") : L("Jouw festival, nog één keer.", "Your festival, one more time.")}</p>` });
    /* 2. de cijfers */
    S.push({ dur: 5600, cls: "ink", html: () => `<div class="k in">21 — 24 ${L("oktober", "October")}</div><div class="stats" style="color:#fff"><div class="pop" style="animation-delay:.1s"><b data-c="4">0</b><small>${L("dagen", "days")}</small></div><div class="pop" style="animation-delay:.35s"><b data-c="${D.venues.length}">0</b><small>${L("zalen", "venues")}</small></div><div class="pop" style="animation-delay:.6s"><b data-c="${D.bands.length}">0</b><small>bands</small></div><div class="pop" style="animation-delay:.85s"><b data-c="${D.countries.length}">0</b><small>${L("landen", "countries")}</small></div></div><p class="rw-p in" style="animation-delay:1.4s">${L("Eén stad. Heel veel nieuwe muziek.", "One city. So much new music.")}</p>`, after: el => el.querySelectorAll("[data-c]").forEach((b, i) => setTimeout(() => counter(b, +b.dataset.c, 1400), 150 + i * 250)) });
    /* 3. alle bands vliegen voorbij */
    S.push({ dur: 7600, cls: "blue", html: () => `${marquee(shuffled.slice(0, third), "", 6, 34, "", mineSet, mustSet)}${marquee(shuffled.slice(third, 2 * third), "", 19, 40, "r", mineSet, mustSet)}${marquee(shuffled.slice(2 * third), "", 72, 37, "", mineSet, mustSet)}${marquee(shuffled.slice().reverse().slice(0, third), "", 85, 44, "r", mineSet, mustSet)}<div style="position:relative;z-index:2;margin-top:2vh"><div class="k in">${L("Dit kwam er voorbij", "This came past")}</div><h2 class="h2">${words(L(`${D.bands.length} bands.`, `${D.bands.length} bands.`), 200)}<br>${words(D.has ? L(`${D.myBands.length} waren van jou.`, `${D.myBands.length} were yours.`) : L("Allemaal van jou.", "All of them yours."), 600)}</h2>${D.has ? `<p class="rw-p in" style="animation-delay:1.5s">${L("Wit = op jouw lijst, geel = moest je zien.", "White = on your list, yellow = must-see.")}</p>` : ""}</div>` });
    if (D.has) {
      /* 4. jouw lijst */
      const pct = Math.max(1, Math.round(D.myBands.length / Math.max(1, D.bands.length) * 100));
      S.push({ dur: 5600, cls: "pink", html: () => `${hearts(18, ["#fff", "#ffd23f", "#1717ff"])}<div class="k in">${L("Jouw lijst", "Your list")}</div><span class="rw-big pop" data-c="${D.myBands.length}">0</span><h2 class="h2">${words(L("bands op je lijst.", "bands on your list."), 500)}</h2><p class="rw-p in" style="animation-delay:1.2s">${L(`Dat is ${pct}% van de hele line-up.`, `That's ${pct}% of the whole line-up.`)} ${D.must.length ? L(`${D.must.length} daarvan moest je écht zien.`, `${D.must.length} of them you just had to see.`) : ""}</p>`, after: el => counter(el.querySelector("[data-c]"), D.myBands.length, 1300) });
      /* 5. jouw sound */
      const gs = D.genres.length ? D.genres : D.festGenres, top = gs[0] ? gs[0][0] : "indie", mx = gs.length ? gs[0][1] : 1;
      S.push({ dur: 5600, cls: "yellow", html: () => `<div class="k in">${L("Jouw sound van 2026", "Your sound of 2026")}</div><h1 class="rw-h">${words(top, 200)}</h1><div class="eq">${gs.map(([g, n], i) => `<div><i style="height:${Math.max(18, n / mx * 100)}%;animation-delay:${i * 0.17}s;animation-duration:${0.7 + i * 0.13}s"></i><small>${esc(g)}</small></div>`).join("")}${Array.from({ length: Math.max(0, 6 - gs.length) }, (_, i) => `<div><i style="height:${30 + i * 9}%;animation-delay:${i * .2}s;opacity:.25"></i><small></small></div>`).join("")}</div>` });
      /* 6. moet ik zien */
      const list = (D.must.length ? D.must : D.myBands).slice(0, 7);
      S.push({ dur: 6400, cls: "ink", html: () => `${hearts(10, ["#ff3d9a", "#1717ff"], .4)}<div class="k in">${D.must.length ? L("Moest je zien", "Must-see") : L("Op jouw lijst", "On your list")}</div><div class="stack">${list.map((n, i) => `<b class="pop" style="animation-delay:${0.25 + i * 0.32}s">${esc(n)}</b>`).join("")}</div>${(D.must.length || D.myBands.length) > list.length ? `<p class="rw-p in" style="animation-delay:${0.4 + list.length * 0.32}s">${L(`…en nog ${(D.must.length || D.myBands.length) - list.length} meer.`, `…and ${(D.must.length || D.myBands.length) - list.length} more.`)}</p>` : ""}` });
      /* 7. jouw route */
      if (D.route && D.route.chosen && D.route.chosen.length > 1) {
        const pts = D.hops.slice(0, 7), n = pts.length, path = pts.map((_, i) => { const x = 8 + i * (84 / Math.max(1, n - 1)), y = 50 + Math.sin(i * 1.7) * 32; return [x, y]; });
        const dpath = path.map((p, i) => (i ? "L" : "M") + p[0] + " " + p[1]).join(" ");
        const hours = Math.floor(D.musicMin / 60), rest = D.musicMin % 60;
        S.push({ dur: 6600, cls: "blue rw-route", html: () => `<div class="k in">${L("Jouw route", "Your route")}</div><h2 class="h2">${words(L(`${hours} uur${rest ? " " + rest + " min" : ""} live muziek.`, `${hours}h${rest ? " " + rest + "m" : ""} of live music.`), 150)}</h2><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path class="ln" d="${dpath}" vector-effect="non-scaling-stroke"/>${path.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="2.6" fill="${i ? "#fff" : "#ffd23f"}" class="pop" style="animation-delay:${0.4 + i * 0.45}s;transform-origin:${p[0]}px ${p[1]}px"/>`).join("")}</svg><div class="chips">${pts.map((v, i) => `<b class="pop" style="animation-delay:${0.5 + i * 0.4}s">${esc(v)}</b>`).join("")}</div>${D.walkKm >= 0.3 ? `<p class="rw-p in" style="animation-delay:2.4s">${L(`En zo'n ${String(D.walkKm).replace(".", ",")} km lopen tussen de zalen.`, `Plus about ${D.walkKm} km walking between venues.`)}</p>` : ""}` });
      }
      /* 8. de wereld */
      const ccs = D.myCountries.length ? D.myCountries : D.countries;
      S.push({ dur: 5200, cls: "white", html: () => `<div class="k in">${L("Jouw wereldkaart", "Your world map")}</div><h2 class="h2">${words(L(`Muziek uit ${ccs.length} ${ccs.length === 1 ? "land" : "landen"}.`, `Music from ${ccs.length} ${ccs.length === 1 ? "country" : "countries"}.`), 150)}</h2><div class="cc">${ccs.slice(0, 16).map((c, i) => `<b class="pop" style="animation-delay:${0.5 + i * 0.12}s;${i % 3 === 0 ? "background:#1717ff;color:#fff;border-color:#1717ff" : i % 3 === 1 ? "background:#ff3d9a;color:#fff;border-color:#ff3d9a" : ""}">${esc(c)}</b>`).join("")}</div>${D.busiest ? `<p class="rw-p in" style="animation-delay:1.8s">${L(`Je drukste dag: ${dayN(D.busiest[0])}, met ${D.busiest[1]} acts.`, `Your busiest day: ${dayN(D.busiest[0])}, with ${D.busiest[1]} acts.`)}${D.favVenue ? " " + L(`Je stamkroeg: ${esc(D.favVenue[0])}.`, `Your local: ${esc(D.favVenue[0])}.`) : ""}</p>` : ""}` });
    } else {
      S.push({ dur: 6000, cls: "yellow", html: () => `<div class="k in">${L("Het festival in cijfers", "The festival in numbers")}</div><h2 class="h2">${words(L("Vier dagen club.", "Four days of club."), 150)}</h2><div class="stats"><div class="pop" style="animation-delay:.3s"><b data-c="${D.festHours}">0</b><small>${L("uur live muziek", "hours of live music")}</small></div><div class="pop" style="animation-delay:.55s"><b data-c="${D.shows}">0</b><small>${L("optredens", "shows")}</small></div><div class="pop" style="animation-delay:.8s"><b data-c="${D.topC[1]}">0</b><small>${D.topC[0] === "UK" ? L("bands uit het VK", "bands from the UK") : L("bands uit ", "bands from ") + (W.country ? W.country(D.topC[0]) : D.topC[0])}</small></div><div class="pop" style="animation-delay:1.05s"><b>${D.lastNote || "04:00"}</b><small>${L("laatste noot, zaterdagnacht", "last note, Saturday night")}</small></div></div>`, after: el => el.querySelectorAll("[data-c]").forEach((b, i) => setTimeout(() => counter(b, +b.dataset.c, 1300), 300 + i * 250)) });
      S.push({ dur: 5600, cls: "pink", html: () => `${hearts(16, ["#fff", "#ffd23f"])}<div class="k in">${L("De sound van 2026", "The sound of 2026")}</div><div class="chips">${D.festGenres.map(([g], i) => `<b class="pop" style="animation-delay:${0.3 + i * 0.3}s;color:#ff3d9a">${esc(g)}</b>`).join("")}</div><p class="rw-p in" style="animation-delay:1.6s">${L("Volgend jaar maak je je eigen lijst met de app. Dan is deze rewind helemaal van jou.", "Next year, make your own list in the app. Then this rewind is all yours.")}</p>` });
    }
    /* 8b. de knop draait: een band die je (nog) niet zag, elke keer anders */
    const pool = D.bands.filter(n => !mineSet.has(n)), pick = pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
    if (pick) {
      const pa = D.all.find(a => a.name === pick) || {}, ctry = pa.country ? (W.country ? W.country(pa.country) : pa.country) : "", gen = (pa.genres || []).filter(g => g !== "extra").slice(0, 2).join(" · ");
      D.pick = pick;
      S.push({ dur: 6200, cls: "ink", html: () => `<div class="rdial pop">${dialSvg("#fff", "#ff3d9a")}</div><div class="k in">${D.has ? L("De knop draait nog één keer…", "One last turn of the dial…") : L("Draai aan de knop…", "Turn the dial…")}</div><h2 class="h2">${words(D.has ? L("Deze miste je nog:", "The one that got away:") : L("Jouw ontdekking:", "Your discovery:"), 150)}</h2><div class="roul"><b>…</b></div><p class="rw-p reveal">${esc([ctry, gen].filter(Boolean).join(" — "))}${ctry || gen ? "<br>" : ""}${L("Zet ’m op voor de terugweg.", "Put them on for the ride home.")}</p>`, after: el => {
        const b = el.querySelector(".roul b"), dl = el.querySelector(".rdial svg"); let d = 45, n = 0, rot = 0;
        const spin = () => { if (!b.isConnected) return; if (d > 340 || reduced) { b.textContent = pick; b.classList.add("land"); el.querySelector(".reveal").classList.add("on"); if (dl) dl.style.transform = `rotate(${rot - 20}deg)`; return; }
          b.textContent = pool[(n++ * 7 + Math.floor(Math.random() * pool.length)) % pool.length]; rot -= 37; if (dl) dl.style.transform = `rotate(${rot}deg)`; d *= 1.13; setTimeout(spin, d); };
        setTimeout(spin, 500); } });
    }
    /* 9. wapperman (of een uitnodiging als je nog niet speelde) */
    if (!D.played) {
      S.push({ dur: 5600, cls: "yellow rw-wm", html: () => { const t = (D.top || [])[0]; return `<div class="k in">Wapperman</div><canvas width="420" height="520"></canvas><h2 class="h2">${t ? words(L(`${t.name} staat bovenaan met ${fmt(t.score)} punten.`, `${t.name} tops the board with ${fmt(t.score)} points.`), 300) : words(L("Het scorebord staat nog open.", "The leaderboard is still open."), 300)}</h2><p class="rw-p in" style="animation-delay:1.3s">${L("Je hebt nog geen potje gespeeld. Wapperman blijft gewoon in de app: pak zoveel mogelijk bands en kom in de top 10.", "You haven't played yet. Wapperman stays in the app: catch as many bands as you can and make the top 10.")}</p>`; }, after: el => wmAnim(el) });
    }
    if (D.played) {
      S.push({ dur: 5600, cls: "yellow rw-wm", html: () => `<div class="k in">Wapperman</div><canvas width="420" height="520"></canvas><h2 class="h2">${words(L(`${fmt(D.best)} punten record.`, `${fmt(D.best)} points high score.`), 300)}</h2><p class="rw-p in" style="animation-delay:1.2s">${L(`${D.prof.games || 1}× gespeeld · ${(D.prof.crate || []).length} bands in je platenkast · skin: ${esc(window.WappermanGame && WappermanGame.skinName ? WappermanGame.skinName() : "Klassiek")}`, `${D.prof.games || 1} games · ${(D.prof.crate || []).length} bands in your crate · skin: ${esc(window.WappermanGame && WappermanGame.skinName ? WappermanGame.skinName() : "Classic")}`)}</p>${rankTxt()}`, after: el => wmAnim(el) });
    }
    /* 10. bedankt (aftiteling) */
    const cred = { dur: 16000, cls: "ink", after: el => { const c = el.querySelector(".cred"); if (!c) return; const H = c.offsetHeight, V = el.offsetHeight, sec = 9 * (H + V) / Math.max(1, H); c.style.setProperty("--sh", V + "px"); c.style.animationDuration = sec + "s"; cred.dur = Math.round(sec * 1000) + 400; }, html: () => `<div class="cred"><small>Thanks to</small>${["Everyone", "All the bands", "All the venues", "Every crew member", "Every volunteer", "You"].map(x => `<div>${x}</div>`).join("")}<small>${L("Op de podia van", "On the stages of")}</small>${D.venues.map(v => `<div>${esc(v)}</div>`).join("")}</div><div style="position:relative;z-index:2;background:linear-gradient(rgba(11,11,20,0),#0b0b14 40px,#0b0b14 calc(100% - 44px),rgba(11,11,20,0));padding:40px 0 50px;margin:-40px 0 0"><div class="k in">Thanks to everyone</div><h2 class="h2">${words("Thanks for supporting live music.", 200, 110)}</h2></div>` };
    S.push(cred);
    /* 11. it was a blast */
    S.push({ dur: 4400, cls: "pink", html: () => `${hearts(34, ["#fff", "#ffd23f", "#1717ff", "#141414"], 0)}<h1 class="rw-h" style="font-size:clamp(70px,24vw,150px);color:#1717ff!important">${words("It was", 100)}<br>${words("a blast.", 400)}</h1>` });
    /* 12. outro + tickets */
    S.push({ dur: 0, cls: "blue", html: () => { const now = W.now ? W.now() : new Date(), open = now >= SALE; return `${dialSvg("#fff", "#ffd23f")}<div class="k in">The club was open</div><h1 class="rw-h">${words("This was", 100)}<br>${words("Left of the Dial.", 350)}</h1><p class="rw-p in" style="animation-delay:1s">See you next year!</p><div class="cta in" style="animation-delay:1.4s"><a class="t1${open ? "" : " soon"}" href="${TICKETS}" target="_blank" rel="noopener">${open ? L("Tickets 2027 →", "Tickets 2027 →") : `${L("Tickets 2027", "Tickets 2027")}<small>${L("verkoop start zondag 25 oktober, 10:00", "on sale Sunday 25 October, 10:00")}</small>`}</a><div class="rw-row"><button class="t2" data-rw="replay">↺ ${L("Opnieuw", "Replay")}</button><button class="t2" data-rw="share">${L("Delen", "Share")}</button></div>${D.played ? "" : `<button class="t2" data-rw="game">${L("Speel Wapperman", "Play Wapperman")}</button>`}<button class="t2" data-rw="close">${L("Naar de app", "Back to the app")}</button></div>`; } });
    return S;
  }

  /* ---------- deelkaart ---------- */
  function shareCard(D) {
    return new Promise(res => {
      const c = document.createElement("canvas"); c.width = 1080; c.height = 1920; const g = c.getContext("2d"), F = '"Barlow Condensed","Arial Narrow",Arial,sans-serif', B = '"Barlow",Arial,sans-serif';
      g.fillStyle = "#1717ff"; g.fillRect(0, 0, 1080, 1920);
      g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 6; for (let r = 260; r < 1100; r += 70) { g.beginPath(); g.arc(1080, 1920, r, 0, 7); g.stroke(); }
      g.fillStyle = "#fff"; g.font = `800 44px ${F}`; g.fillText("LEFT OF THE DIAL 2026  ♥  ROTTERDAM", 70, 120);
      g.font = `800 190px ${F}`; g.fillText("REWIND", 64, 340); g.fillText("THE DIAL.", 64, 510);
      g.font = `600 44px ${B}`; g.fillStyle = "#c6d0ff"; g.fillText(D.name ? `${D.name}'s festival` : L("Mijn festival", "My festival"), 70, 600);
      const st = D.has ? [[D.myBands.length, L("bands op mijn lijst", "bands on my list")], [D.must.length, L("moest ik zien", "must-sees")], [D.myCountries.length || D.countries.length, L("landen", "countries")]] : [[D.bands.length, "bands"], [D.venues.length, L("zalen", "venues")], [D.countries.length, L("landen", "countries")]];
      st.forEach(([n, l], i) => { const x = 70 + i * 330; g.fillStyle = "#fff"; g.font = `800 150px ${F}`; g.fillText(String(n), x, 820); g.font = `700 34px ${B}`; g.fillStyle = "#c6d0ff"; g.fillText(l.toUpperCase(), x, 875); });
      g.fillStyle = "#fff"; g.font = `800 50px ${F}`; g.fillText((D.must.length ? L("MOEST IK ZIEN", "MY MUST-SEES") : D.has ? L("OP MIJN LIJST", "ON MY LIST") : L("MIJN ONTDEKKING", "MY DISCOVERY")), 70, 1010);
      (D.must.length ? D.must : D.has ? D.myBands : [D.pick].filter(Boolean)).slice(0, 7).forEach((n, i) => { g.fillStyle = i % 2 ? "#fff" : "#ffd23f"; g.font = `800 92px ${F}`; let t = n.toUpperCase(); while (g.measureText(t).width > 940 && t.length > 3) t = t.slice(0, -2); g.fillText(t, 70, 1110 + i * 100); });
      g.fillStyle = "#141414"; g.fillRect(0, 1790, 1080, 130); g.fillStyle = "#fff"; g.font = `800 58px ${F}`; g.fillText("THE CLUB WAS OPEN.", 70, 1872); g.font = `600 30px ${B}`; g.fillStyle = "#c6d0ff"; g.fillText(location.host, 760, 1868);
      c.toBlob(b => res(b), "image/png");
    });
  }

  /* ---------- speler ---------- */
  let root = null, S = [], idx = 0, t0 = 0, elapsed = 0, paused = false, raf = 0, D = null, holdT = 0, prevOverflow = "";
  function show(i) {
    idx = Math.max(0, Math.min(S.length - 1, i)); elapsed = 0; t0 = performance.now();
    const st = root.querySelector(".rw-stage"), sl = S[idx];
    st.innerHTML = `<section class="sl ${sl.cls}">${sl.html()}</section>`;
    if (sl.after) try { sl.after(st.firstElementChild); } catch (e) {}
    root.querySelectorAll(".rw-bars i b").forEach((b, k) => { b.style.width = k < idx ? "100%" : "0%"; });
    root.querySelector(".rw-hint").style.display = idx === 0 ? "" : "none";
    root.classList.toggle("last", !sl.dur); root.classList.toggle("lite", /yellow|white/.test(sl.cls));
  }
  function tick(now) {
    raf = requestAnimationFrame(tick); if (!root) return;
    const sl = S[idx]; if (!sl || !sl.dur) { const b = root.querySelectorAll(".rw-bars i b")[idx]; if (b) b.style.width = "100%"; return; }
    if (!paused) elapsed += now - t0; t0 = now;
    const k = Math.min(1, elapsed / sl.dur), b = root.querySelectorAll(".rw-bars i b")[idx]; if (b) b.style.width = (k * 100) + "%";
    if (k >= 1) show(idx + 1);
  }
  function setPaused(p) { paused = p; root.classList.toggle("paused", p); const pp = root.querySelector(".rw-pp"); if (pp) pp.textContent = p ? "▶" : "❚❚"; }
  async function share() {
    const text = L("Mijn Left of the Dial 2026, teruggespoeld. The club was open! ♥", "My Left of the Dial 2026, rewound. The club was open! ♥"), url = location.origin + "/";
    try { const blob = await shareCard(D), file = blob && new File([blob], "rewind-the-dial.png", { type: "image/png" }); if (file && navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: "Rewind the Dial", text: text + " " + url }); return; } if (blob && !navigator.share) { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "rewind-the-dial.png"; a.click(); return; } } catch (e) { if (e && e.name === "AbortError") return; }
    if (navigator.share) navigator.share({ title: "Rewind the Dial", text, url }).catch(() => {});
  }
  function close() {
    if (!root) return; cancelAnimationFrame(raf); root.remove(); root = null;
    document.documentElement.style.overflow = prevOverflow; document.removeEventListener("keydown", onKey);
    try { localStorage.setItem("lotd-rewind-seen", JSON.stringify(Date.now())); } catch (e) {}
  }
  function onKey(e) { if (!root) return; if (e.key === "Escape") close(); else if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); show(idx + 1); } else if (e.key === "ArrowLeft") show(idx - 1); }
  function play() {
    if (root) return; D = data(); curD = D; S = slides(D); idx = 0;
    try { window.WappermanGame && WappermanGame.top && WappermanGame.top().then(r => { if (r && r.list && r.list.length) D.top = r.list; }).catch(() => {}); } catch (e) {}
    try { localStorage.setItem("lotd-rewind-seen", JSON.stringify(Date.now())); } catch (e) {}
    if (!document.getElementById("rw-css")) { const st = document.createElement("style"); st.id = "rw-css"; st.textContent = CSS; document.head.appendChild(st); }
    root = document.createElement("div"); root.id = "rw"; root.setAttribute("role", "dialog"); root.setAttribute("aria-label", "Rewind the Dial");
    root.innerHTML = `<div class="rw-bars">${S.map(() => "<i><b></b></i>").join("")}</div><div class="rw-top"><span>Rewind the Dial</span><button class="rw-pp" aria-label="${L("Pauze", "Pause")}">❚❚</button><button class="rw-x" aria-label="${L("Sluiten", "Close")}">✕</button></div><div class="rw-stage"></div><div class="tapL"></div><div class="tapR"></div><div class="rw-hint">${L("Tik om verder te gaan · houd vast om te pauzeren", "Tap to continue · hold to pause")}</div>`;
    document.body.appendChild(root); prevOverflow = document.documentElement.style.overflow; document.documentElement.style.overflow = "hidden";
    root.querySelector(".rw-x").addEventListener("click", close);
    root.querySelector(".rw-pp").addEventListener("click", () => setPaused(!paused));
    const tap = dir => e => { if (performance.now() - holdT > 350 && holdT) { holdT = 0; return; } holdT = 0; show(idx + dir); };
    let hold = 0;
    ["tapL", "tapR"].forEach((c, k) => { const el = root.querySelector("." + c);
      el.addEventListener("pointerdown", () => { holdT = performance.now(); hold = setTimeout(() => setPaused(true), 300); });
      el.addEventListener("pointerup", e => { clearTimeout(hold); const long = performance.now() - holdT > 300; if (long) { setPaused(false); holdT = 0; return; } holdT = 0; show(idx + (k ? 1 : -1)); });
      el.addEventListener("pointercancel", () => { clearTimeout(hold); setPaused(false); holdT = 0; });
      el.addEventListener("contextmenu", e => e.preventDefault()); });
    root.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-rw]"); if (!b) return; const a = b.dataset.rw; if (a === "replay") { setPaused(false); S = slides(D); show(0); } else if (a === "share") share(); else if (a === "close") close(); else if (a === "game") { close(); location.hash = "#/game"; } });
    root.addEventListener("touchmove", e => { if (e.cancelable) e.preventDefault(); }, { passive: false });
    document.addEventListener("keydown", onKey);
    setPaused(false); show(0); t0 = performance.now(); raf = requestAnimationFrame(tick);
  }
  window.LotdRewind = { play, close, data };
})();
