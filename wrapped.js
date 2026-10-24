/* REWIND THE DIAL — jouw Left of the Dial 2026, teruggespoeld (story-stijl, persoonlijk, steeds opnieuw af te spelen).
   Alles gebeurt op dit toestel: favorieten, moet-ik-zien, route, Wapperman. Er wordt niets verstuurd.
   Opbouw: per slide HTML (tekst) + een canvas-laag met bewegende graphics (fx) + een VHS-laag (OSD, scanlines, glitch). */
(function () {
  "use strict";
  if (window.LotdRewind) return;
  const W = window.__lotdWrap || {};
  const LS = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } } };
  const lang = () => (W.lang ? W.lang() : (LS.get("lotd-lang", "nl") || "nl"));
  const L = (nl, en) => (lang() === "en" ? en : nl);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TICKETS = "https://leftofthedial.nl/tickets/";
  const SALE = new Date("2026-10-25T10:00:00+01:00");
  const DAYNAME = { w: ["woensdag", "Wednesday"], d: ["donderdag", "Thursday"], v: ["vrijdag", "Friday"], z: ["zaterdag", "Saturday"] };
  const DAYSH = { w: ["WO", "WED"], d: ["DO", "THU"], v: ["VR", "FRI"], z: ["ZA", "SAT"] };
  const DAYCOL = { w: "#5cf", d: "#ffd23f", v: "#ff3d9a", z: "#fff" };
  const dayN = id => L(DAYNAME[id] ? DAYNAME[id][0] : id, DAYNAME[id] ? DAYNAME[id][1] : id);
  const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, L(".", ","));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = k => 1 - Math.pow(1 - clamp(k, 0, 1), 3);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const hhmm = m => { m = ((m % 1440) + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"); };
  const F = '"Barlow Condensed","Arial Narrow",Arial,sans-serif', FB = '"Barlow",Arial,sans-serif', FM = '"DM Mono",ui-monospace,Menlo,Consolas,monospace';
  const BLUE = "#1717ff", PINK = "#ff3d9a", YEL = "#ffd23f", INK = "#0b0b14", CYAN = "#5cf";

  /* ---------- gegevens ---------- */
  const HEAVY = /punk|post-punk|noise|hardcore|garage|metal|grunge|thrash|sludge|doom|stoner/;
  const SOFT = /shoegaze|dream|slowcore|ambient|folk|singer|songwriter|americana|chamber|ballad|indie folk|lo-fi/;
  function data() {
    const all = (typeof ACTS !== "undefined" ? ACTS : []).filter(a => !a.cancelled);
    const favIds = new Set(typeof favs !== "undefined" ? favs : LS.get("lotd-favs", []));
    const isStar = W.isStar || (id => (LS.get("lotd-stars", []) || []).includes(id));
    const isGreen = W.isGreen || (() => false);
    const vname = a => (typeof venue === "function" ? (venue(a.venueId) || {}).name : "") || "";
    const base = W.base || (n => n);
    const mine = all.filter(a => favIds.has(a.id));
    const uniq = arr => [...new Set(arr)];
    const bands = uniq(all.filter(a => a.genre !== "Extra" && !a.after).map(a => a.name));
    const venues = uniq(all.map(a => base(vname(a))));
    const cc = list => uniq(list.flatMap(a => (a.country || "").split("/").filter(Boolean)));
    const order = { w: 0, d: 1, v: 2, z: 3 };
    const t = a => (order[a.day] || 0) * 2000 + mins(a.start);
    const myBands = uniq(mine.map(a => a.name));
    const must = uniq(mine.filter(a => isStar(a.id)).sort((x, y) => (isGreen(y.id) - isGreen(x.id)) || t(x) - t(y)).map(a => a.name));
    const rest = uniq(mine.filter(a => !isStar(a.id)).sort((x, y) => (isGreen(y.id) - isGreen(x.id)) || t(x) - t(y)).map(a => a.name)).filter(n => !must.includes(n));
    const top5 = must.concat(rest).slice(0, 5);
    const gCount = {}; mine.forEach(a => (a.genres || []).forEach(g => { if (g && g !== "extra" && g !== "afterparty") gCount[g] = (gCount[g] || 0) + 1; }));
    const spec = o => { const e = Object.entries(o).sort((x, y) => y[1] - x[1]), sp = e.filter(([g]) => g !== "rock" && g !== "pop"); return (sp.length >= 3 ? sp : e).slice(0, 5); };
    const genres = spec(gCount);
    const fGenre = {}; all.forEach(a => (a.genres || []).forEach(g => { if (g && g !== "extra" && g !== "afterparty") fGenre[g] = (fGenre[g] || 0) + 1; }));
    const festGenres = spec(fGenre);
    const dCount = {}; mine.forEach(a => { dCount[a.day] = (dCount[a.day] || 0) + 1; });
    const busiest = Object.entries(dCount).sort((x, y) => y[1] - x[1])[0];
    const vCount = {}; mine.forEach(a => { const n = base(vname(a)); vCount[n] = (vCount[n] || 0) + 1; });
    const favVenue = Object.entries(vCount).sort((x, y) => y[1] - x[1])[0], favVenues = Object.keys(vCount).length;
    let route = null; try { route = W.route ? W.route() : null; } catch (e) {}
    const chosen = route && route.chosen ? route.chosen.slice() : [];
    let musicMin = 0, walkMin = 0;
    chosen.forEach((a, i) => { musicMin += Math.max(0, mins(a.end) - mins(a.start)); const n = chosen[i + 1]; if (n && n.day === a.day && a.venueId !== n.venueId) { const w = W.walk ? W.walk(a, n) : null; if (w) walkMin += w; } });
    const hops = uniq(chosen.map(a => base(vname(a))));
    const seq = (chosen.length ? chosen : mine.slice().sort((x, y) => t(x) - t(y)));
    const first = seq[0], last = seq[seq.length - 1];
    const skipped = route && route.skipped ? route.skipped.filter(x => x.by) : [];
    /* routekaart: per dag de zalen in volgorde */
    const coordOf = n => (W.coord ? W.coord(n) : null);
    const legs = {}; chosen.forEach(a => { const c = coordOf(vname(a)); if (!c) return; (legs[a.day] = legs[a.day] || []); const l = legs[a.day]; const nm = base(vname(a)); if (!l.length || l[l.length - 1].n !== nm) l.push({ n: nm, c }); });
    const allPts = venues.map(n => ({ n, c: coordOf(n) })).filter(x => x.c);
    const prof = LS.get("lotd-wapperman-profile", null) || {};
    const best = +(LS.get("lotd-wapperman-best", 0) || 0);
    const name = (() => { try { return (localStorage.getItem("lotd-wapperman-name") || "").trim().slice(0, 16); } catch (e) { return ""; } })();
    const shows = all.filter(a => a.genre !== "Extra" && !a.after), festMin = shows.reduce((n, a) => n + (a.endUnknown ? 45 : Math.max(0, mins(a.end) - mins(a.start))), 0);
    const cTop = {}; bands.forEach(n => { const a = all.find(x => x.name === n); (a && a.country ? a.country.split("/") : []).forEach(c => { cTop[c] = (cTop[c] || 0) + 1; }); });
    const topC = Object.entries(cTop).sort((x, y) => y[1] - x[1])[0] || ["UK", 0];
    const lastEnd = Math.max(...all.filter(a => a.day === "z").map(a => mins(a.end) || 0));
    const late = mine.filter(a => mins(a.start) >= 23 * 60).length;
    const early = mine.filter(a => mins(a.start) < 19 * 60).length;
    const allG = mine.flatMap(a => a.genres || []).filter(g => g && g !== "extra" && g !== "afterparty");
    const heavy = allG.filter(g => HEAVY.test(g)).length / Math.max(1, allG.length), soft = allG.filter(g => SOFT.test(g)).length / Math.max(1, allG.length);
    const D = {
      all, bands, venues, countries: cc(all), myCountries: cc(mine), mine, myBands, must, top5, genres, festGenres, busiest, favVenue, dCount,
      first, last, route, chosen, musicMin, walkKm: Math.round(walkMin * 80 / 100) / 10, hops, skipped, legs, allPts,
      prof, best, name, has: myBands.length > 0, played: !!(prof.games || best > 0),
      festHours: Math.round(festMin / 60), shows: shows.length, topC, lastNote: isFinite(lastEnd) ? hhmm(lastEnd) : "",
      late, early, heavy, soft, favVenues, genreSpread: Object.keys(gCount).length,
      top: LS.get("lotd-wapperman-top-cache", []) || [], vname, base
    };
    D.arch = archetype(D);
    return D;
  }

  /* ---------- festival-type ---------- */
  const ICON = {
    hop: '<path d="M4 12h12M12 6l6 6-6 6"/><circle cx="4" cy="12" r="2"/>',
    owl: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/><path d="M17 3l.6 1.6L19 5l-1.4.5L17 7l-.6-1.5L15 5l1.4-.4z"/>',
    bird: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
    pit: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    dream: '<path d="M7 18h10.5a4 4 0 0 0 .4-8 6 6 0 0 0-11.4 1.5A3.3 3.3 0 0 0 7 18z"/><path d="M9 21h.01M13 21h.01"/>',
    fan: '<path d="M12 20.5l-1.3-1.2C5.6 14.7 2.5 11.9 2.5 8.4 2.5 5.6 4.7 3.5 7.4 3.5c1.6 0 3.1.8 4.1 2 1-1.2 2.5-2 4.1-2 2.7 0 4.9 2.1 4.9 4.9 0 3.5-3.1 6.3-8.2 10.9z"/>',
    home: '<path d="M3 11l9-7 9 7v9H3z"/><path d="M9 20v-6h6v6"/>',
    omni: '<path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/>',
    free: '<path d="M3 15c4 0 7-2 9-6 1 3 4 5 9 5-3 3-7 5-11 5-3 0-5-1.5-7-4z"/><path d="M12 9c0-3 1.5-5 4-6"/>'
  };
  function archetype(D) {
    const n = Math.max(1, D.mine.length);
    if (!D.has) return { k: "free", t: L("De Vrije Vogel", "The Free Spirit"), d: L("Geen lijstje, geen plan. Gewoon gaan waar de muziek je brengt. Respect.", "No list, no plan. Just going wherever the music takes you. Respect."),
      bars: [[L("Spontaniteit", "Spontaneity"), 100], [L("Planning", "Planning"), 3], [L("Vibes", "Vibes"), 100]] };
    const A = [
      { k: "hop", s: D.favVenues / 13, t: L("De Zaalhopper", "The Venue Hopper"), d: L(`Je favorieten stonden in ${D.favVenues} zalen. Jij kent elke stoeprand tussen Rotown en De Doelen.`, `Your favourites played ${D.favVenues} venues. You know every kerb between Rotown and De Doelen.`) },
      { k: "owl", s: D.late / n * 3.2, t: L("De Nachtbraker", "The Night Owl"), d: L(`${D.late} acts na elven. Jouw festival begint pas echt als de rest naar huis gaat.`, `${D.late} acts after 11pm. Your festival only really starts when the rest go home.`) },
      { k: "bird", s: D.early / n * 2.6, t: L("De Vroege Vogel", "The Early Bird"), d: L(`${D.early} acts vóór 19:00. Jij stond al vooraan toen de rest nog moest ontbijten.`, `${D.early} acts before 7pm. You were front row while others were still having breakfast.`) },
      { k: "globe", s: D.myCountries.length / 7, t: L("De Wereldreiziger", "The Globetrotter"), d: L(`Muziek uit ${D.myCountries.length} landen, zonder één keer te vliegen.`, `Music from ${D.myCountries.length} countries without boarding a single plane.`) },
      { k: "pit", s: D.heavy * 2.4, t: L("Het Moshpit-Beest", "The Pit Dweller"), d: L("Hard, snel en zweterig. Je oren piepen nog, en dat is precies goed.", "Loud, fast and sweaty. Your ears are still ringing, exactly as intended.") },
      { k: "dream", s: D.soft * 2.6, t: L("De Dromer", "The Dreamer"), d: L("Galm, gitaarmuren en ogen dicht. Jij zweefde door het festival.", "Reverb, walls of guitar and eyes closed. You floated through the festival.") },
      { k: "fan", s: (D.must.length >= 5 ? D.must.length / Math.max(1, D.myBands.length) * 2 : 0), t: L("De Superfan", "The Superfan"), d: L(`${D.must.length} bands die je écht moest zien. Jij komt niet om te kijken, jij komt om te beleven.`, `${D.must.length} must-see bands. You don't come to watch, you come to feel it.`) },
      { k: "home", s: D.favVenue ? D.favVenue[1] / n * 3 : 0, t: L("De Stamgast", "The Regular"), d: L(`${D.favVenue ? D.favVenue[0] : ""} was jouw huiskamer. De barman weet je naam inmiddels.`, `${D.favVenue ? D.favVenue[0] : ""} was your living room. The bartender knows your name by now.`) },
      { k: "omni", s: D.genreSpread / 11, t: L("De Alleseter", "The Omnivore"), d: L(`${D.genreSpread} genres op je lijst. Hokjes zijn voor anderen.`, `${D.genreSpread} genres on your list. Boxes are for other people.`) }
    ].sort((x, y) => y.s - x.s);
    const a = A[0], pc = v => clamp(Math.round(v), 4, 100);
    a.bars = [[L("Zaalhoppen", "Venue hopping"), pc(D.favVenues / 18 * 100)], [L("Nachtbrakerij", "Night owling"), pc(D.late / n * 220)], [L("Ontdekkingsdrang", "Discovery drive"), pc(D.myCountries.length / 9 * 100)]];
    return a;
  }
  const icon = (k, z = 44, c = "currentColor") => `<svg width="${z}" height="${z}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k] || ICON.omni}</svg>`;

  /* ---------- stijl ---------- */
  const CSS = `
#rw{position:fixed;inset:0;z-index:5000;background:${BLUE};color:#fff;overflow:hidden;font-family:${FB};-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;touch-action:none;transition:background-color .35s}
#rw *{box-sizing:border-box}
#rw .rw-fx{position:absolute;inset:0;width:100%;height:100%;z-index:0}
#rw .rw-scan{position:absolute;inset:0;pointer-events:none;z-index:3;background:repeating-linear-gradient(0deg,rgba(0,0,0,.07) 0 1px,transparent 1px 3px),radial-gradient(120% 90% at 50% 45%,transparent 60%,rgba(0,0,0,.35))}
#rw.lite .rw-scan{background:repeating-linear-gradient(0deg,rgba(0,0,0,.05) 0 1px,transparent 1px 3px),radial-gradient(120% 90% at 50% 45%,transparent 65%,rgba(0,0,0,.18))}
#rw .rw-bars{position:absolute;left:10px;right:10px;top:calc(10px + env(safe-area-inset-top,0px));display:flex;gap:3px;z-index:6}
#rw .rw-bars i{flex:1;height:3px;border-radius:2px;background:rgba(255,255,255,.3);overflow:hidden}
#rw .rw-bars i b{display:block;height:100%;width:0;background:#fff}
#rw .rw-top{position:absolute;left:12px;right:12px;top:calc(20px + env(safe-area-inset-top,0px));display:flex;align-items:center;gap:8px;z-index:6}
#rw .rw-osd{flex:1;min-width:0;font:500 13px/1.15 ${FM};letter-spacing:.06em;text-transform:uppercase;text-shadow:0 0 6px rgba(255,255,255,.5);white-space:nowrap;overflow:hidden}
#rw .rw-osd b{font-weight:500;display:block;font-size:15px}
#rw .rw-osd span{opacity:.75}
#rw .rw-x,#rw .rw-pp{flex:none;width:40px;height:40px;border:0;border-radius:50%;background:rgba(0,0,0,.25);color:#fff;font:400 20px/1 Arial;display:grid;place-items:center;cursor:pointer}
#rw.lite .rw-osd{text-shadow:none}
#rw.lite .rw-top{color:#141414}#rw.lite .rw-x,#rw.lite .rw-pp{background:rgba(0,0,0,.08);color:#141414}#rw.lite .rw-bars i{background:rgba(0,0,0,.18)}#rw.lite .rw-bars i b{background:#141414}
#rw .rw-stage{position:absolute;inset:0;z-index:2;will-change:transform}
#rw.glx .rw-stage{animation:rwGlx .34s steps(1) both}
@keyframes rwGlx{0%{clip-path:inset(12% 0 58% 0);transform:translate(-14px,0)}20%{clip-path:inset(46% 0 22% 0);transform:translate(12px,0)}40%{clip-path:inset(0 0 80% 0);transform:translate(-8px,0)}60%{clip-path:inset(68% 0 4% 0);transform:translate(6px,0)}80%{clip-path:inset(20% 0 40% 0);transform:translate(-3px,0)}100%{clip-path:inset(0);transform:none}}
#rw .sl{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:calc(84px + env(safe-area-inset-top,0px)) 24px calc(40px + env(safe-area-inset-bottom,0px));overflow:hidden}
#rw .sl.bottom{justify-content:flex-end;padding-bottom:calc(48px + env(safe-area-inset-bottom,0px))}
#rw .sl.topal{justify-content:flex-start;padding-top:calc(16vh + env(safe-area-inset-top,0px))}
#rw.lite .sl{color:#141414}
#rw .k{font:800 13px/1 ${F};letter-spacing:.18em;text-transform:uppercase;opacity:.9;margin-bottom:12px}
#rw .sl .rw-h,#rw .sl .h2{color:inherit!important}
#rw .rw-h{font:800 clamp(52px,17vw,104px)/.84 ${F};text-transform:uppercase;letter-spacing:-.01em;margin:0}
#rw .h2{font:800 clamp(34px,10.5vw,64px)/.9 ${F};text-transform:uppercase;margin:0}
#rw .rw-p{font:600 clamp(16px,4.6vw,21px)/1.3 ${FB};margin:14px 0 0;max-width:32ch}
#rw .shadow{text-shadow:0 2px 18px rgba(0,0,0,.65)}
#rw .rw-big{font:800 clamp(130px,46vw,260px)/.8 ${F};letter-spacing:-.03em;display:block}
#rw .w{display:inline-block;opacity:0;transform:translateY(.5em) rotate(4deg);animation:rwUp .55s cubic-bezier(.2,.9,.3,1.3) forwards}
#rw .slam{display:inline-block;opacity:0;animation:rwSlam .5s cubic-bezier(.2,.9,.25,1.25) forwards}
@keyframes rwSlam{0%{opacity:0;transform:scale(2.6) rotate(-6deg);filter:blur(8px)}60%{opacity:1;transform:scale(.94) rotate(1deg);filter:none}100%{opacity:1;transform:none}}
@keyframes rwUp{to{opacity:1;transform:none}}
@keyframes rwIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
@keyframes rwPop{0%{opacity:0;transform:scale(.3) rotate(-8deg)}70%{opacity:1;transform:scale(1.08) rotate(2deg)}100%{opacity:1;transform:none}}
@keyframes rwSpin{to{transform:rotate(-360deg)}}
@keyframes rwFade{to{opacity:1}}
@keyframes rwBeat{0%,100%{transform:scale(1)}12%{transform:scale(1.07)}}
@keyframes rwRgb{0%,100%{text-shadow:-3px 0 ${PINK},3px 0 ${CYAN}}25%{text-shadow:-5px 1px ${PINK},4px -1px ${CYAN}}50%{text-shadow:-2px 0 ${PINK},2px 0 ${CYAN}}75%{text-shadow:-6px -1px ${PINK},5px 1px ${CYAN}}}
@keyframes rwCred{from{transform:translateY(0)}to{transform:translateY(calc(-100% - var(--sh,100vh)))}}
@keyframes rwFlip{0%{opacity:0;transform:perspective(900px) rotateY(100deg) scale(.7)}60%{opacity:1;transform:perspective(900px) rotateY(-12deg) scale(1.03)}100%{opacity:1;transform:perspective(900px) rotateY(0) scale(1)}}
@keyframes rwShine{0%{transform:translateX(-120%) skewX(-20deg)}100%{transform:translateX(220%) skewX(-20deg)}}
@keyframes rwBar{from{width:0}to{width:var(--v)}}
@keyframes rwStrike{to{transform:scaleX(1)}}
@keyframes rwGlow{0%,100%{text-shadow:0 0 0 rgba(255,210,63,0)}50%{text-shadow:0 0 28px rgba(255,210,63,.85)}}
#rw .rgb{animation:rwRgb 1.8s steps(1) infinite}
#rw .in{opacity:0;animation:rwIn .6s ease forwards}
#rw .pop{opacity:0;animation:rwPop .6s cubic-bezier(.2,.9,.3,1.2) forwards}
#rw .dial{position:absolute;width:min(120vw,620px);aspect-ratio:1;right:-36vw;bottom:-32vw;opacity:0;animation:rwFade .8s forwards,rwSpin 26s linear infinite;pointer-events:none}
#rw .dial.late{animation:rwFade .8s 2.35s forwards,rwSpin 26s linear infinite}
#rw .dial.now{opacity:.95;animation:rwSpin 26s linear infinite}
#rw .nums{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:18px}
#rw .nums div{text-align:left}
#rw .nums b{display:block;font:800 clamp(34px,11vw,58px)/.9 ${F}}
#rw .nums small{display:block;font:700 11px/1.2 ${FB};letter-spacing:.08em;text-transform:uppercase;opacity:.8;margin-top:4px}
#rw .stats{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:18px}
#rw .stats div{border:2px solid currentColor;border-radius:10px;padding:12px;background:rgba(255,255,255,.06)}
#rw.lite .stats div{background:rgba(255,255,255,.35)}
#rw .stats b{display:block;font:800 clamp(36px,11.5vw,62px)/.9 ${F}}
#rw .stats small{display:block;margin-top:6px;font:700 12px/1.2 ${FB};text-transform:uppercase;letter-spacing:.06em;opacity:.85}
#rw .chips{display:flex;flex-wrap:wrap;gap:7px;margin-top:16px}
#rw .chips b{font:800 clamp(18px,5.4vw,26px)/1 ${F};text-transform:uppercase;padding:7px 11px;border-radius:5px;background:#fff;color:${BLUE}}
#rw .slot{font:800 clamp(30px,9vw,52px)/1 ${F};text-transform:uppercase;height:1.1em;overflow:hidden;color:${YEL};margin-top:6px}
#rw .arch{position:relative;margin-top:16px;border-radius:18px;padding:20px 18px 18px;background:linear-gradient(160deg,#20208a,#0d0d33 60%,#2a0a2a);border:2px solid rgba(255,255,255,.75);overflow:hidden;opacity:0;animation:rwFlip .9s 2.4s cubic-bezier(.2,.9,.3,1.1) forwards;box-shadow:0 18px 60px rgba(255,61,154,.35),0 0 0 6px rgba(255,255,255,.06)}
#rw .arch::before{content:"";position:absolute;inset:-60%;background:conic-gradient(from 0deg,${PINK},${YEL},${CYAN},${BLUE},${PINK});opacity:.28;animation:rwSpin 7s linear infinite;mix-blend-mode:screen;pointer-events:none}
#rw .arch::after{content:"";position:absolute;top:0;bottom:0;left:0;width:40%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.45),transparent);animation:rwShine 2.6s 3.2s ease-in-out infinite;pointer-events:none}
#rw .arch > *{position:relative;z-index:1}
#rw .arch .ic{width:64px;height:64px;border-radius:50%;display:grid;place-items:center;background:${YEL};color:#141414;margin-bottom:12px;box-shadow:0 0 0 6px rgba(255,210,63,.25)}
#rw .arch h3{font:800 clamp(38px,12vw,64px)/.88 ${F};text-transform:uppercase;margin:0;color:#fff}
#rw .arch p{font:600 15px/1.35 ${FB};margin:10px 0 14px;color:#e6e8ff}
#rw .arch .bar{display:grid;grid-template-columns:1fr auto;align-items:center;gap:4px 10px;margin-top:8px;font:800 13px/1 ${F};letter-spacing:.08em;text-transform:uppercase}
#rw .arch .bar i{grid-column:1/-1;height:8px;border-radius:4px;background:rgba(255,255,255,.18);overflow:hidden;display:block}
#rw .arch .bar i::after{content:"";display:block;height:100%;width:0;background:linear-gradient(90deg,${PINK},${YEL});border-radius:4px;animation:rwBar 1.2s var(--dl,3.4s) cubic-bezier(.2,.9,.3,1) forwards}
#rw .arch .no{position:absolute;right:16px;top:16px;font:500 12px ${FM};opacity:.7}
#rw .wall{margin-top:12px;max-height:34vh;overflow:hidden;-webkit-mask-image:linear-gradient(#000 78%,transparent);mask-image:linear-gradient(#000 78%,transparent)}
#rw .wall > div{display:flex;flex-wrap:wrap;gap:3px 12px}
#rw .wall > div.scroll{animation:rwWall 4.8s 3.6s ease-in-out forwards}
@keyframes rwWall{to{transform:translateY(var(--wy,0))}}
#rw .wall span{font:800 clamp(17px,5vw,24px)/1.08 ${F};text-transform:uppercase;opacity:0;animation:rwPop .35s cubic-bezier(.2,.9,.3,1.3) forwards}
#rw .wall span.m{color:${BLUE}}
#rw .t5{list-style:none;margin:14px 0 0;padding:0;display:flex;flex-direction:column;gap:6px}
#rw .t5 li{display:flex;align-items:center;gap:14px;opacity:0;animation:rwIn .5s cubic-bezier(.2,.9,.3,1.2) forwards}
#rw .t5 li em{font:800 clamp(46px,14vw,70px)/.9 ${F};font-style:normal;color:transparent;-webkit-text-stroke:2px #fff;width:1.1ch;flex:none;text-align:center}
#rw .t5 li b{font:800 clamp(24px,7.4vw,40px)/.95 ${F};text-transform:uppercase;min-width:0;overflow-wrap:anywhere}
#rw .t5 li.one{animation-name:rwPop}
#rw .t5 li.one em{color:${YEL};-webkit-text-stroke:0}
#rw .t5 li.one b{color:${YEL};font-size:clamp(34px,11vw,60px);animation:rwGlow 1.6s 1s ease-in-out infinite}
#rw .fl{display:grid;gap:10px;margin-top:16px}
#rw .fl div{border-left:5px solid ${YEL};padding:6px 0 6px 12px;background:linear-gradient(90deg,rgba(0,0,0,.18),transparent)}
#rw .fl div:last-child{border-color:${PINK}}
#rw .fl small{display:block;font:500 12px/1 ${FM};letter-spacing:.08em;text-transform:uppercase;opacity:.85}
#rw .fl b{display:block;font:800 clamp(28px,8.6vw,46px)/.95 ${F};text-transform:uppercase;margin:4px 0 2px}
#rw .fl span{font:600 14px/1.2 ${FB};opacity:.9}
#rw .vs{display:grid;gap:12px;margin-top:16px}
#rw .vs div{font:800 clamp(22px,6.6vw,34px)/1 ${F};text-transform:uppercase;display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 10px}
#rw .vs small{font:500 12px ${FM};letter-spacing:.08em;opacity:.85}
#rw .vs s{position:relative;text-decoration:none;opacity:.75}
#rw .vs s::after{content:"";position:absolute;left:-3px;right:-3px;top:52%;height:4px;background:#141414;transform:scaleX(0);transform-origin:left;animation:rwStrike .45s var(--dl,1s) ease-out forwards}
#rw .cc{display:flex;flex-wrap:wrap;gap:6px;margin-top:14px}
#rw .cc b{font:800 clamp(20px,6vw,30px)/1 ${F};padding:6px 10px;border:2px solid #fff;border-radius:6px}
#rw .gen{font:800 clamp(56px,19vw,120px)/.84 ${F};text-transform:uppercase;display:block;animation:rwBeat .469s infinite;transform-origin:left bottom;overflow-wrap:anywhere}
#rw .roul{margin-top:14px;min-height:2.1em;display:flex;align-items:center}
#rw .roul b{font:800 clamp(40px,13vw,80px)/.92 ${F};text-transform:uppercase;overflow-wrap:anywhere}
#rw .roul b.land{color:${YEL};animation:rwPop .5s cubic-bezier(.2,.9,.3,1.3)}
#rw .reveal{opacity:0;transition:opacity .5s}#rw .reveal.on{opacity:1}
#rw .rw-wm canvas{width:min(48vw,220px);height:auto;display:block;margin:6px 0 0 -8px}
#rw .cred{position:absolute;left:0;right:0;top:100%;text-align:center;animation:rwCred 9s linear forwards}
#rw .cred div{font:800 clamp(24px,7vw,36px)/1.25 ${F};text-transform:uppercase;opacity:.92}
#rw .cred small{display:block;margin:22px 0 6px;font:500 12px ${FM};letter-spacing:.14em;text-transform:uppercase;opacity:.75}
#rw .cta{display:flex;flex-direction:column;gap:9px;margin-top:20px;max-width:420px;pointer-events:auto}
#rw .cta a,#rw .cta button{display:flex;align-items:center;justify-content:center;gap:8px;min-height:52px;border-radius:8px;border:0;font:800 19px/1 ${F};letter-spacing:.04em;text-transform:uppercase;text-decoration:none;cursor:pointer}
#rw .cta .t1{background:#fff;color:${BLUE};box-shadow:0 0 0 0 rgba(255,255,255,.6);animation:rwPulseBtn 1.8s 2.2s infinite}
@keyframes rwPulseBtn{0%{box-shadow:0 0 0 0 rgba(255,255,255,.55)}70%{box-shadow:0 0 0 14px rgba(255,255,255,0)}100%{box-shadow:0 0 0 0 rgba(255,255,255,0)}}
#rw .cta .tix{min-height:84px;flex-direction:column;gap:6px;background:${YEL};color:#141414;font-size:clamp(26px,8vw,34px);animation:rwPulseY 1.4s 2s infinite,rwWiggle 4s 2.5s infinite}
#rw .cta .tix small{font:700 13px/1 ${FB};letter-spacing:.02em;text-transform:none}
#rw .cta .tix.soon{background:#fff;color:${BLUE}}
@keyframes rwPulseY{0%{box-shadow:0 0 0 0 rgba(255,210,63,.75)}70%{box-shadow:0 0 0 18px rgba(255,210,63,0)}100%{box-shadow:0 0 0 0 rgba(255,210,63,0)}}
@keyframes rwWiggle{0%,86%,100%{transform:none}88%{transform:rotate(-2.5deg) scale(1.03)}91%{transform:rotate(2.5deg) scale(1.03)}94%{transform:rotate(-1.5deg)}97%{transform:rotate(1deg)}}
#rw .cta .t1.soon{background:${YEL};color:#141414;flex-direction:column;gap:3px}
#rw .cta .t1 small{font:700 12px/1 ${FB};letter-spacing:.04em;text-transform:none}
#rw .cta .t2{background:rgba(23,23,255,.88);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);color:#fff;border:2px solid #fff}
#rw .cta .rw-row{display:grid;grid-template-columns:1fr 1fr;gap:9px}
#rw .tapL,#rw .tapR{position:absolute;top:0;bottom:0;z-index:4}
#rw .tapL{left:0;width:33%}#rw .tapR{right:0;width:67%}#rw.last .tapL,#rw.last .tapR{display:none}
#rw .rw-hint{position:absolute;left:0;right:0;bottom:calc(16px + env(safe-area-inset-bottom,0px));text-align:center;font:500 11px ${FM};letter-spacing:.1em;text-transform:uppercase;opacity:.7;z-index:3}
#rw.paused .sl *,#rw.paused .sl *::before,#rw.paused .sl *::after{animation-play-state:paused!important}
@media (prefers-reduced-motion:reduce){#rw .dial,#rw .gen,#rw .arch::before,#rw .arch::after{animation:none!important}#rw .rgb{animation:none}#rw.glx .rw-stage{animation:none}}
`;

  /* ---------- tekst-helpers ---------- */
  const words = (txt, d0 = 0, step = 90, cls = "w") => esc(txt).split(" ").map((w, i) => `<span class="${cls}" style="animation-delay:${d0 + i * step}ms">${w}</span>`).join(" ");
  const dialSvg = (col = "#fff", acc = PINK, extra = "") => `<svg class="dial ${extra}" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="96" fill="none" stroke="${col}" stroke-width="3" opacity=".5"/>${Array.from({ length: 60 }, (_, i) => { const a = i * 6 * Math.PI / 180, r1 = i % 5 ? 84 : 76; return `<line x1="${(100 + Math.cos(a) * r1).toFixed(1)}" y1="${(100 + Math.sin(a) * r1).toFixed(1)}" x2="${(100 + Math.cos(a) * 92).toFixed(1)}" y2="${(100 + Math.sin(a) * 92).toFixed(1)}" stroke="${col}" stroke-width="${i % 5 ? 1.5 : 3}" opacity=".8"/>`; }).join("")}<circle cx="100" cy="100" r="56" fill="${col}" opacity=".12"/><circle cx="100" cy="100" r="44" fill="none" stroke="${col}" stroke-width="2"/><line x1="100" y1="100" x2="100" y2="22" stroke="${acc}" stroke-width="6" stroke-linecap="round"/><circle cx="100" cy="100" r="8" fill="${acc}"/></svg>`;
  function counter(el, to, ms) { if (!el) return; if (reduced) { el.textContent = fmt(to); return; } const t0 = performance.now(); const step = now => { const k = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - k, 3); el.textContent = fmt(Math.round(to * e)); if (k < 1 && el.isConnected) requestAnimationFrame(step); }; requestAnimationFrame(step); }
  const countAll = (el, d0 = 150, gap = 220, ms = 1300) => el.querySelectorAll("[data-c]").forEach((b, i) => setTimeout(() => counter(b, +b.dataset.c, ms), d0 + i * gap));

  /* ---------- canvas-effecten ---------- */
  const FX = { shake: 0, flash: 0, flashCol: "255,255,255" };
  const HEARTP = typeof Path2D === "function" ? new Path2D("M12 21.2l-1.4-1.3C5.4 15.2 2 12.1 2 8.3 2 5.2 4.4 2.8 7.5 2.8c1.7 0 3.4.8 4.5 2.1 1.1-1.3 2.8-2.1 4.5-2.1 3.1 0 5.5 2.4 5.5 5.5 0 3.8-3.4 6.9-8.6 11.6L12 21.2z") : null;
  function heart(g, x, y, s, col, rot = 0) { if (!HEARTP) return; g.save(); g.translate(x, y); g.rotate(rot); g.scale(s / 24, s / 24); g.translate(-12, -12); g.fillStyle = col; g.fill(HEARTP); g.restore(); }
  const stepT = (st, t) => { const dt = st.lt == null ? 0 : clamp(t - st.lt, 0, .05); st.lt = t; return dt; };
  /* VHS-ruis voor overgangen en het terugspoelen */
  function noise(g, w, h, k, dark) {
    g.save();
    for (let i = 0; i < 26 * k; i++) { const y = Math.random() * h, hh = rnd(1, 10); g.fillStyle = `rgba(${dark ? "0,0,0" : "255,255,255"},${rnd(.05, .35) * k})`; g.fillRect(0, y, w, hh); }
    for (let i = 0; i < 260 * k; i++) { g.fillStyle = Math.random() < .5 ? `rgba(255,255,255,${.5 * k})` : `rgba(0,0,0,${.5 * k})`; g.fillRect(Math.random() * w, Math.random() * h, rnd(1, 3), rnd(1, 2)); }
    const ty = (performance.now() / 6) % (h + 80) - 40; g.fillStyle = `rgba(255,255,255,${.18 * k})`; g.fillRect(0, ty, w, 26);
    g.restore();
  }
  function waves(g, w, h, t, x, y, col, n = 7, gap = 70) {
    g.save(); g.lineWidth = 2;
    for (let i = 0; i < n; i++) { const r = ((t * 60 + i * gap) % (n * gap)) + 10, a = Math.max(0, 1 - r / (n * gap)); g.strokeStyle = `rgba(${col},${a * .5})`; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.stroke(); }
    g.restore();
  }
  function particles(g, st, dt, gy = 700) {
    st.p = (st.p || []).filter(p => p.life > 0);
    st.p.forEach(p => {
      p.vy += (p.g == null ? gy : p.g) * dt; p.vx *= (1 - p.drag * dt); p.vy *= (1 - p.drag * dt); p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt; p.life -= dt;
      const a = clamp(p.life / p.max * 1.6, 0, 1); g.globalAlpha = a;
      if (p.kind === "heart") heart(g, p.x, p.y, p.s, p.c, p.r);
      else if (p.kind === "conf") { g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2 * Math.abs(Math.cos(p.r * 2))); g.restore(); }
      else { g.fillStyle = p.c; g.beginPath(); g.arc(p.x, p.y, p.s, 0, 7); g.fill(); }
      g.globalAlpha = 1;
    });
  }
  const burst = (st, x, y, n, opt = {}) => { st.p = st.p || []; for (let i = 0; i < n; i++) { const a = opt.heart ? i / n * Math.PI * 2 : Math.random() * Math.PI * 2, sp = opt.heart ? (opt.sp || 260) * heartR(a) : rnd(.3, 1) * (opt.sp || 420); st.p.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - (opt.up || 0), s: opt.size ? opt.size() : rnd(3, 6), c: opt.cols[i % opt.cols.length], life: opt.life || rnd(1.2, 2.2), max: opt.life || 2, r: rnd(0, 6), vr: rnd(-6, 6), drag: opt.drag == null ? 1.2 : opt.drag, g: opt.g, kind: opt.kind || "dot" }); } };
  /* hartvorm in poolcoördinaten (voor vuurwerk in de vorm van een hart) */
  const heartR = a => { const x = 16 * Math.pow(Math.sin(a), 3), y = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)); return Math.hypot(x, y) / 17; };
  function heartBurst(st, x, y, cols, sp) { st.p = st.p || []; const n = 70, c = cols[Math.floor(Math.random() * cols.length)]; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, hx = 16 * Math.pow(Math.sin(a), 3), hy = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)); st.p.push({ x, y, vx: hx / 16 * sp, vy: hy / 16 * sp, s: rnd(2.2, 3.6), c, life: rnd(1.4, 1.9), max: 1.8, r: 0, vr: 0, drag: 1.6, g: 140, kind: "dot" }); } }
  function confetti(st, w, n) { burst(st, w / 2, -20, 0, { cols: [] }); for (let i = 0; i < n; i++) st.p.push({ x: rnd(0, w), y: rnd(-200, -10), vx: rnd(-40, 40), vy: rnd(60, 200), s: rnd(8, 14), c: [PINK, YEL, CYAN, "#fff", BLUE][i % 5], life: rnd(3, 5), max: 4, r: rnd(0, 6), vr: rnd(-8, 8), drag: .4, g: 120, kind: "conf" }); }

  /* ---------- de slides ---------- */
  function wmAnim(el) { const cv = el.querySelector("canvas"); if (!cv || !window.WappermanGame || !WappermanGame.preview) { cv && cv.remove(); return; } const t0 = performance.now(); const loop = now => { if (!cv.isConnected) return; try { WappermanGame.preview(cv, (now - t0) / 1000 * 1.6, 140, 175, 0.95); } catch (e) { return; } if (!reduced) requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
  const rankTxt = D => { if (!D || !D.name || !D.top || !D.top.length) return ""; const i = D.top.findIndex(r => (r.name || "").toLowerCase() === D.name.toLowerCase()); return i >= 0 ? " " + L(`Je staat #${i + 1} in de top 10!`, `You're #${i + 1} in the top 10!`) : ""; };
  const CC = { NL: [52.4, 4.9], UK: [51.5, -0.1], GB: [51.5, -0.1], US: [40.7, -74], IE: [53.3, -6.3], DK: [55.7, 12.6], ZA: [-33.9, 18.4], BE: [50.8, 4.4], DE: [52.5, 13.4], AU: [-33.9, 151.2], CA: [43.7, -79.4], SE: [59.3, 18.1], FR: [48.9, 2.35], NO: [59.9, 10.7], AT: [48.2, 16.4], NZ: [-36.8, 174.8], PT: [38.7, -9.1], JP: [35.7, 139.7], ES: [40.4, -3.7], IT: [41.9, 12.5], IS: [64.1, -21.9], FI: [60.2, 24.9], PL: [52.2, 21], CH: [47.4, 8.5], CZ: [50.1, 14.4], MX: [19.4, -99.1], BR: [-23.5, -46.6], KR: [37.6, 127], IL: [32.1, 34.8], AR: [-34.6, -58.4], CL: [-33.4, -70.6], CO: [4.7, -74.1], CN: [39.9, 116.4], IN: [19.1, 72.9], GR: [37.98, 23.7], HU: [47.5, 19], UA: [50.45, 30.5], EE: [59.4, 24.75], LT: [54.7, 25.3], LV: [56.95, 24.1], LU: [49.6, 6.1], SI: [46.05, 14.5], HR: [45.8, 16], RS: [44.8, 20.5], TR: [41, 29], NG: [6.5, 3.4], GH: [5.6, -0.2], KE: [-1.3, 36.8] };
  const RTM = [51.92, 4.48];

  function slides(D) {
    const S = [], mineSet = new Set(D.myBands), mustSet = new Set(D.must);
    const who = D.name ? esc(D.name) : "";
    /* 1. INTRO: VHS terugspoelen van zaterdagnacht naar woensdag, dan PLAY */
    S.push({ dur: 6800, bg: BLUE, osd: t => t < 2.35 ? "◀◀ REW" : "▶ PLAY",
      html: () => `${dialSvg("#fff", PINK, "late")}<div style="opacity:0;animation:rwFade .01s 2.35s forwards"><div class="k">Left of the Dial 2026 · Rotterdam</div><h1 class="rw-h rgb">${words("Rewind", 2400, 0, "slam")}<br>${words("the dial.", 2650, 120, "slam")}</h1><p class="rw-p in" style="animation-delay:3.4s">${who ? who + ", " + L("dit was jouw festival.", "this was your festival.") : L("Jouw festival, nog één keer.", "Your festival, one more time.")}</p></div>`,
      fx: (g, t, w, h, st) => {
        if (!st.names) { st.names = D.bands.slice().sort(() => Math.random() - .5).slice(0, 40).map(n => ({ n, y: rnd(.08, .95), x: rnd(0, 1.4), sp: rnd(1.2, 2.6), s: rnd(16, 46), me: mineSet.has(n) })); }
        if (t < 2.35) {
          g.fillStyle = "rgba(6,6,40,.6)"; g.fillRect(0, 0, w, h);
          const k = Math.pow(t / 2.35, 1.5), sp = 0.4 + k * 3;
          st.names.forEach(o => { o.x -= o.sp * sp * 0.016; if (o.x < -0.9) o.x = 1.2 + Math.random() * .3; g.font = `800 ${o.s}px ${F}`; g.fillStyle = o.me ? `rgba(255,210,63,.9)` : "rgba(255,255,255,.35)"; const x = o.x * w; g.fillText(o.n.toUpperCase(), x, o.y * h); g.fillStyle = "rgba(255,255,255,.08)"; g.fillRect(x + g.measureText(o.n.toUpperCase()).width, o.y * h - o.s * .35, 60 * sp, 3); });
          const m0 = 3 * 1440 + 1440 + 239, m1 = 18 * 60, m = Math.round(m0 + (m1 - m0) * k), di = clamp(Math.floor(m / 1440), 0, 3), dk = ["w", "d", "v", "z"][di];
          g.fillStyle = "rgba(0,0,30,.55)"; g.fillRect(0, h * .3, w, h * .27); g.textAlign = "center"; g.font = `500 ${Math.min(64, w * .16)}px ${FM}`; g.fillStyle = "#fff"; g.shadowColor = "rgba(255,255,255,.8)"; g.shadowBlur = 12;
          g.fillText("◀◀", w / 2, h * .38); g.font = `500 ${Math.min(40, w * .095)}px ${FM}`;
          g.fillText(`${L(DAYSH[dk][0], DAYSH[dk][1])} ${21 + di}.10.2026`, w / 2, h * .47); g.fillText(hhmm(m % 1440), w / 2, h * .53);
          g.shadowBlur = 0; g.textAlign = "left"; noise(g, w, h, .55);
        } else {
          if (!st.f) { st.f = 1; FX.flash = 1; FX.shake = 16; }
          waves(g, w, h, t, w * .92, h * .9, "255,255,255", 8, 60);
        }
      } });
    /* 2. WARP: alle bands vliegen op je af + de festivalcijfers */
    S.push({ dur: 7400, bg: INK, html: () => `<div class="shadow"><div class="k in">${L("Vier dagen, één stad", "Four days, one city")}</div><h2 class="h2">${words(L("Dit kwam er voorbij.", "This came past."), 200)}</h2><div class="nums"><div class="pop" style="animation-delay:.5s"><b data-c="${D.bands.length}">0</b><small>bands</small></div><div class="pop" style="animation-delay:.7s"><b data-c="${D.venues.length}">0</b><small>${L("zalen", "venues")}</small></div><div class="pop" style="animation-delay:.9s"><b data-c="${D.countries.length}">0</b><small>${L("landen", "countries")}</small></div><div class="pop" style="animation-delay:1.1s"><b data-c="4">0</b><small>${L("dagen", "days")}</small></div></div>${D.has ? `<p class="rw-p in" style="animation-delay:2.2s">${L(`<b style="color:${YEL}">${D.myBands.length}</b> daarvan waren van jou. Geel = jouw lijst.`, `<b style="color:${YEL}">${D.myBands.length}</b> of them were yours. Yellow = your list.`)}</p>` : ""}</div>`, after: el => countAll(el, 500, 200, 1500),
      fx: (g, t, w, h, st) => {
        const dt = stepT(st, t);
        if (!st.s) st.s = Array.from({ length: 130 }, () => { const n = D.bands[Math.floor(Math.random() * D.bands.length)] || "LOTD"; return { n: n.toUpperCase(), x: rnd(-1, 1), y: rnd(-1, 1), z: rnd(.15, 1.2), me: mineSet.has(n), must: mustSet.has(n) }; });
        const sp = (0.18 + 0.5 * ease(t / 1.6)) * (t > 6.4 ? 1 + (t - 6.4) * 3 : 1);
        st.s.forEach(o => { o.pz = o.z; o.z -= sp * dt; if (o.z < 0.04) { o.z = 1.2; o.pz = 1.2; o.x = rnd(-1, 1); o.y = rnd(-1, 1); } });
        st.s.sort((a, b) => b.z - a.z);
        g.textAlign = "center";
        st.s.forEach(o => {
          const X = w / 2 + o.x / o.z * w * .32, Y = h / 2 + o.y / o.z * h * .32, size = clamp(10 / o.z, 8, 110), a = clamp((1.2 - o.z) * 1.4, 0, 1);
          if (X < -300 || X > w + 300 || Y < -100 || Y > h + 100) return;
          const pX = w / 2 + o.x / o.pz * w * .32, pY = h / 2 + o.y / o.pz * h * .32;
          g.strokeStyle = o.me ? `rgba(255,210,63,${a * .5})` : `rgba(140,150,255,${a * .25})`; g.lineWidth = Math.max(1, size / 14); g.beginPath(); g.moveTo(pX, pY); g.lineTo(X, Y); g.stroke();
          g.font = `800 ${size}px ${F}`; g.fillStyle = o.must ? `rgba(255,61,154,${a})` : o.me ? `rgba(255,210,63,${a})` : `rgba(190,196,255,${a * .55})`; g.fillText(o.n, X, Y);
        });
        g.textAlign = "left";
      } });
    if (D.has) {
      /* 3. jouw lijst: het getal + een muur met al je bands */
      const pct = Math.max(1, Math.round(D.myBands.length / Math.max(1, D.bands.length) * 100));
      const wall = D.myBands.slice().sort(() => Math.random() - .5).slice(0, 110);
      S.push({ dur: 8600, bg: PINK, html: () => `<div class="k in">${L("Jouw lijst", "Your list")}</div><span class="rw-big pop" style="font-size:clamp(96px,32vw,180px)" data-c="${D.myBands.length}">0</span><h2 class="h2">${words(L("bands op je lijst.", "bands on your list."), 500)}</h2><p class="rw-p in" style="animation-delay:1.1s">${L(`Dat is ${pct}% van de line-up.`, `That's ${pct}% of the line-up.`)}${D.must.length ? " " + L(`<b style="color:${BLUE}">Blauw</b> = moest je zien (${D.must.length}).`, `<b style="color:${BLUE}">Blue</b> = must-see (${D.must.length}).`) : ""}</p><div class="wall"><div>${wall.map((n, i) => `<span class="${mustSet.has(n) ? "m" : ""}" style="animation-delay:${(1.5 + i * .035).toFixed(2)}s">${esc(n)}</span>`).join("")}</div></div>`,
        after: el => { counter(el.querySelector("[data-c]"), D.myBands.length, 1300); const w = el.querySelector(".wall"), inner = w && w.firstElementChild; if (inner) setTimeout(() => { const dy = inner.scrollHeight - w.clientHeight; if (dy > 10) { inner.style.setProperty("--wy", -dy + "px"); inner.classList.add("scroll"); } }, 60); },
        fx: (g, t, w, h, st) => { const dt = stepT(st, t);
          if (!st.b && t > .9) { st.b = 1; FX.shake = 12; burst(st, w * .3, h * .3, 70, { cols: ["#fff", YEL, BLUE, "#141414"], kind: "heart", size: () => rnd(14, 34), sp: 900, up: 250, drag: 1.4, life: 2.6 }); }
          if (t > 1 && Math.random() < .2) (st.p = st.p || []).push({ x: rnd(0, w), y: h + 30, vx: rnd(-20, 20), vy: rnd(-260, -140), s: rnd(12, 30), c: ["#fff", YEL, BLUE][Math.floor(rnd(0, 3))], life: 4, max: 4, r: rnd(-.4, .4), vr: rnd(-.6, .6), drag: 0, g: 0, kind: "heart" });
          particles(g, st, dt); } });
    } else {
      S.push({ dur: 6000, bg: YEL, lite: true, html: () => `<div class="k in">${L("Het festival in cijfers", "The festival in numbers")}</div><h2 class="h2">${words(L("Vier dagen club.", "Four days of club."), 150)}</h2><div class="stats"><div class="pop" style="animation-delay:.3s"><b data-c="${D.festHours}">0</b><small>${L("uur live muziek", "hours of live music")}</small></div><div class="pop" style="animation-delay:.55s"><b data-c="${D.shows}">0</b><small>${L("optredens", "shows")}</small></div><div class="pop" style="animation-delay:.8s"><b data-c="${D.topC[1]}">0</b><small>${D.topC[0] === "UK" ? L("bands uit het VK", "bands from the UK") : L("bands uit ", "bands from ") + esc(W.country ? W.country(D.topC[0]) : D.topC[0])}</small></div><div class="pop" style="animation-delay:1.05s"><b>${D.lastNote || "04:00"}</b><small>${L("laatste noot, zaterdagnacht", "last note, Saturday night")}</small></div></div>`, after: el => countAll(el, 300, 250),
        fx: (g, t, w, h, st) => { g.save(); g.globalAlpha = .12; g.fillStyle = "#141414"; for (let i = 0; i < 14; i++) { const x = ((i * 90 + t * 40) % (w + 200)) - 100; g.fillRect(x, 0, 30, h); } g.restore(); } });
    }
    /* 4. festival-type: shuffle, dan een holografische kaart */
    const ar = D.arch, archNames = [L("De Zaalhopper", "The Venue Hopper"), L("De Nachtbraker", "The Night Owl"), L("De Vroege Vogel", "The Early Bird"), L("De Wereldreiziger", "The Globetrotter"), L("Het Moshpit-Beest", "The Pit Dweller"), L("De Dromer", "The Dreamer"), L("De Superfan", "The Superfan"), L("De Stamgast", "The Regular"), L("De Alleseter", "The Omnivore")];
    S.push({ dur: 8800, bg: "#10102e", html: () => `<div class="k in">${L("Jouw festival-type", "Your festival type")}</div><h2 class="h2">${words(L("Jij bent…", "You are…"), 150)}</h2><div class="slot">…</div><div class="arch"><span class="no">LOTD/26 · ${esc((who || "№ " + (100 + Math.floor(Math.random() * 899))).toUpperCase())}</span><div class="ic">${icon(ar.k, 36, "#141414")}</div><h3>${esc(ar.t)}</h3><p>${esc(ar.d)}</p>${ar.bars.map(([l, v], i) => `<div class="bar" style="--v:${v}%;--dl:${3.3 + i * .25}s"><span>${esc(l)}</span><span>${v}</span><i></i></div>`).join("")}</div>`,
      after: el => { const s = el.querySelector(".slot"); let i = 0; const go = () => { if (!s.isConnected) return; if (i > 16) { s.style.transition = "opacity .25s"; s.style.opacity = "0"; return; } s.textContent = archNames[(i * 5 + 3) % archNames.length]; i++; setTimeout(go, 70 + i * 7); }; setTimeout(go, 400); },
      fx: (g, t, w, h, st) => { const dt = stepT(st, t);
        [[PINK, .3, .25], [BLUE, .75, .6], [CYAN, .4, .85]].forEach(([c, x, y], i) => { const X = w * (x + .12 * Math.sin(t * .7 + i * 2)), Y = h * (y + .08 * Math.cos(t * .6 + i)), r = w * .9; const gr = g.createRadialGradient(X, Y, 0, X, Y, r); gr.addColorStop(0, c + "55"); gr.addColorStop(1, c + "00"); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
        if (!st.c && t > 2.6) { st.c = 1; FX.flash = .8; FX.shake = 10; confetti(st, w, 110); burst(st, w / 2, h * .55, 50, { cols: [YEL, PINK, "#fff"], sp: 700, drag: 1.8, life: 1.6 }); }
        particles(g, st, dt); } });
    if (D.has) {
      /* 5. jouw sound: spectrum-analyser op 128 bpm */
      const gs = D.genres.length ? D.genres : D.festGenres, top = gs[0] ? gs[0][0] : "indie", share = gs[0] ? Math.round(gs[0][1] / Math.max(1, D.mine.length) * 100) : 0;
      S.push({ dur: 6000, bg: YEL, lite: true, cls: "topal", html: () => `<div class="k in">${L("Jouw sound van 2026", "Your sound of 2026")}</div><span class="pop" style="display:block;animation-delay:.2s"><span class="gen">${esc(top)}</span></span><p class="rw-p in" style="animation-delay:.9s">${L(`${share}% van jouw acts. Daarna:`, `${share}% of your acts. Followed by:`)}</p><div class="chips">${gs.slice(1, 5).map(([gn], i) => `<b class="pop" style="animation-delay:${1.2 + i * .25}s;background:#141414;color:${YEL}">${esc(gn)}</b>`).join("")}</div>`,
        fx: (g, t, w, h, st) => { const n = 28, bw = w / n, base = h, beat = Math.pow(1 - ((t * 2.133) % 1), 3);
          if (!st.ph) st.ph = Array.from({ length: n }, () => rnd(0, 6));
          for (let i = 0; i < n; i++) { const f = i / n, v = (.25 + .55 * Math.abs(Math.sin(t * (2 + f * 5) + st.ph[i])) * (1 - f * .5) + beat * (1 - f) * .45) * clamp(t * 1.5, 0, 1), bh = v * h * .42;
            g.fillStyle = i % 2 ? "#141414" : "rgba(20,20,20,.85)"; g.fillRect(i * bw + 2, base - bh, bw - 4, bh);
            st.pk = st.pk || []; st.pk[i] = Math.max((st.pk[i] || 0) - .006, v); g.fillStyle = PINK; g.fillRect(i * bw + 2, base - st.pk[i] * h * .42 - 8, bw - 4, 4); }
          g.fillStyle = `rgba(255,61,154,${beat * .12})`; g.fillRect(0, 0, w, h); } });
    }
    /* 6. alle zalen op de kaart van Rotterdam (geel = daar speelden jouw favorieten) */
    if (D.allPts.length > 2) {
      const favV = new Set(D.mine.map(a => D.base(D.vname(a))));
      const nFav = D.allPts.filter(p => favV.has(p.n)).length;
      S.push({ dur: 7800, bg: "#07071a", cls: "bottom", html: () => `<div class="shadow"><div class="k in">${L("Eén stad, één festival", "One city, one festival")}</div><h2 class="h2">${words(L(`${D.venues.length} zalen.`, `${D.venues.length} venues.`), 200)}<br>${words(L("Eén rondje Rotterdam.", "One big loop of Rotterdam."), 550)}</h2>${D.has && nFav ? `<p class="rw-p in" style="animation-delay:3.6s">${L(`<b style="color:${YEL}">Geel</b> = daar speelden jouw favorieten. ${nFav} zalen.`, `<b style="color:${YEL}">Yellow</b> = where your favourites played. ${nFav} venues.`)}</p>` : ""}</div>`,
        fx: (g, t, w, h, st) => {
          if (!st.proj) {
            const pts = D.allPts.map(p => p.c), la = pts.map(p => p[0]), lo = pts.map(p => p[1]);
            const a0 = Math.min(...la), a1 = Math.max(...la), o0 = Math.min(...lo), o1 = Math.max(...lo), k = Math.cos(51.92 * Math.PI / 180);
            const top = 100, bot = h * .6, sx = (w - 70) / ((o1 - o0) * k || 1e-3), sy = (bot - top) / ((a1 - a0) || 1e-3), sc = Math.min(sx, sy) * .9, cxo = (o0 + o1) / 2, cxa = (a0 + a1) / 2;
            st.proj = c => [w / 2 + (c[1] - cxo) * k * sc, (top + bot) / 2 - (c[0] - cxa) * sc];
            const mid = [cxa, cxo];
            st.v = D.allPts.map(p => ({ n: p.n, xy: st.proj(p.c), fav: favV.has(p.n), d: Math.hypot(p.c[0] - mid[0], (p.c[1] - mid[1]) * k) })).sort((a, b) => a.d - b.d);
            st.v.forEach((v, i) => { v.at = .5 + i * (3 / Math.max(1, st.v.length)); let best = null, bd = 1e9; for (let j = 0; j < i; j++) { const o = st.v[j], dd = Math.hypot(o.xy[0] - v.xy[0], o.xy[1] - v.xy[1]); if (dd < bd) { bd = dd; best = o; } } v.link = best; });
          }
          const P = st.proj;
          g.strokeStyle = "rgba(255,255,255,.05)"; g.lineWidth = 1; for (let x = 0; x < w; x += 28) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } for (let y = 0; y < h; y += 28) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
          const river = [[51.9085, 4.43], [51.9058, 4.455], [51.9075, 4.47], [51.909, 4.482], [51.9083, 4.495], [51.904, 4.51], [51.9, 4.53]];
          g.strokeStyle = "rgba(92,204,255,.16)"; g.lineWidth = 26; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath(); river.forEach((c, i) => { const [x, y] = P(c); i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.stroke();
          { const [x, y] = P([51.906, 4.462]); g.font = `500 11px ${FM}`; g.fillStyle = "rgba(92,204,255,.55)"; g.fillText("MAAS", x, y + 4); }
          st.v.forEach(v => { if (t < v.at || !v.link) return; const k = ease((t - v.at) / .5), [x0, y0] = v.link.xy, [x1, y1] = v.xy; g.strokeStyle = v.fav && v.link.fav ? "rgba(255,210,63,.55)" : "rgba(255,255,255,.22)"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x0 + (x1 - x0) * k, y0 + (y1 - y0) * k); g.stroke(); });
          st.v.forEach(v => { if (t < v.at) return; const [x, y] = v.xy, a = t - v.at, col = v.fav ? YEL : "#fff";
            if (a < 1.2) { g.strokeStyle = v.fav ? `rgba(255,210,63,${1 - a / 1.2})` : `rgba(255,255,255,${(1 - a / 1.2) * .7})`; g.lineWidth = 2; g.beginPath(); g.arc(x, y, 6 + a * 30, 0, 7); g.stroke(); }
            const r = (v.fav ? 6.5 : 4.5) * Math.min(1, a * 4) + (v.fav ? Math.sin(t * 5 + v.d * 400) * 1.2 : 0); if (v.fav) { g.shadowColor = YEL; g.shadowBlur = 14; } g.fillStyle = col; g.beginPath(); g.arc(x, y, Math.max(0, r), 0, 7); g.fill(); g.shadowBlur = 0; });
          g.font = `800 13px ${F}`; const lab = [];
          st.v.slice().sort((a, b) => b.fav - a.fav).forEach(v => { if (t < v.at + .15) return; const [x, y] = v.xy, txt = v.n.toUpperCase(), tw = g.measureText(txt).width, lx = x + 9 + tw < w - 6 ? x + 9 : x - 9 - tw, ly = y - 6; if (lab.some(b => Math.abs(b[1] - ly) < 14 && lx < b[0] + b[2] + 4 && lx + tw + 4 > b[0])) return; lab.push([lx, ly, tw]); g.fillStyle = v.fav ? YEL : "rgba(255,255,255,.85)"; g.fillText(txt, lx, ly); });
        } });
    }
    /* 10. de wereld: draaiende globe met lijnen naar Rotterdam */
    const ccs = (D.myCountries.length ? D.myCountries : D.countries).filter(c => CC[c]);
    S.push({ dur: 6800, bg: "#0d0d55", cls: "bottom", html: () => `<div class="shadow"><div class="k in">${D.has ? L("Jouw wereldkaart", "Your world map") : L("De wereld kwam naar Rotterdam", "The world came to Rotterdam")}</div><h2 class="h2">${words(L(`Muziek uit ${ccs.length} ${ccs.length === 1 ? "land" : "landen"}.`, `Music from ${ccs.length} ${ccs.length === 1 ? "country" : "countries"}.`), 150)}</h2><div class="cc">${ccs.slice(0, 18).map((c, i) => `<b class="pop" style="animation-delay:${.5 + i * .1}s;${i % 3 === 0 ? `background:${PINK};border-color:${PINK}` : i % 3 === 1 ? `background:${BLUE};border-color:${BLUE}` : ""}">${esc(c)}</b>`).join("")}</div></div>`,
      fx: (g, t, w, h, st) => {
        const R = Math.min(w * .42, h * .25), cx = w / 2, cy = Math.max(R + 100, h * .33), lat0 = 38 * Math.PI / 180, lon0 = (-22 + 34 * Math.sin(t * .5)) * Math.PI / 180;
        const pr = (la, lo) => { la *= Math.PI / 180; lo *= Math.PI / 180; const c = Math.sin(lat0) * Math.sin(la) + Math.cos(lat0) * Math.cos(la) * Math.cos(lo - lon0); return [cx + R * Math.cos(la) * Math.sin(lo - lon0), cy - R * (Math.cos(lat0) * Math.sin(la) - Math.sin(lat0) * Math.cos(la) * Math.cos(lo - lon0)), c]; };
        const gr = g.createRadialGradient(cx - R * .3, cy - R * .3, R * .1, cx, cy, R * 1.1); gr.addColorStop(0, "#2a2aff"); gr.addColorStop(1, "#0a0a40"); g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, R, 0, 7); g.fill();
        g.strokeStyle = "rgba(255,255,255,.18)"; g.lineWidth = 1;
        for (let la = -60; la <= 60; la += 30) { g.beginPath(); let on = false; for (let lo = -180; lo <= 180; lo += 6) { const [x, y, c] = pr(la, lo); if (c > 0) { on ? g.lineTo(x, y) : g.moveTo(x, y); on = true; } else on = false; } g.stroke(); }
        for (let lo = -180; lo < 180; lo += 30) { g.beginPath(); let on = false; for (let la = -90; la <= 90; la += 6) { const [x, y, c] = pr(la, lo); if (c > 0) { on ? g.lineTo(x, y) : g.moveTo(x, y); on = true; } else on = false; } g.stroke(); }
        g.strokeStyle = "rgba(255,255,255,.5)"; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, R, 0, 7); g.stroke();
        const v3 = (la, lo) => { la *= Math.PI / 180; lo *= Math.PI / 180; return [Math.cos(la) * Math.cos(lo), Math.cos(la) * Math.sin(lo), Math.sin(la)]; };
        const back = ([x, y, z]) => [Math.asin(clamp(z, -1, 1)) * 180 / Math.PI, Math.atan2(y, x) * 180 / Math.PI];
        ccs.forEach((c, i) => {
          const p = CC[c], k = clamp((t - .4 - i * .12) / 1.2, 0, 1); if (!k || c === "NL") return;
          const A = v3(p[0], p[1]), B = v3(RTM[0], RTM[1]); g.strokeStyle = i % 2 ? YEL : PINK; g.lineWidth = 2; g.beginPath(); let on = false;
          for (let s = 0; s <= 30 * k; s++) { const f = s / 30, m = [A[0] + (B[0] - A[0]) * f, A[1] + (B[1] - A[1]) * f, A[2] + (B[2] - A[2]) * f], n = Math.hypot(...m) || 1, lift = 1 + Math.sin(f * Math.PI) * .18, q = back(m.map(v => v / n)), [x, y, cz] = pr(q[0], q[1]); const X = cx + (x - cx) * lift, Y = cy + (y - cy) * lift; if (cz > -.05) { on ? g.lineTo(X, Y) : g.moveTo(X, Y); on = true; } else on = false; }
          g.stroke();
        });
        ccs.forEach((c, i) => { const p = CC[c], [x, y, z] = pr(p[0], p[1]); if (z <= 0) return; const pu = (t * 1.4 + i * .3) % 1; g.strokeStyle = `rgba(255,255,255,${1 - pu})`; g.lineWidth = 2; g.beginPath(); g.arc(x, y, 4 + pu * 14, 0, 7); g.stroke(); g.fillStyle = "#fff"; g.beginPath(); g.arc(x, y, 3.5, 0, 7); g.fill(); });
        { const [x, y, z] = pr(RTM[0], RTM[1]); if (z > 0) { heart(g, x, y, 18 + Math.sin(t * 6) * 3, PINK); g.font = `800 12px ${F}`; g.fillStyle = "#fff"; g.fillText("ROTTERDAM", x + 12, y - 8); } }
      } });
    /* 11. de knop draait: een band die je (nog) niet zag, elke keer anders */
    const pool = D.bands.filter(n => !mineSet.has(n)), pick = pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
    if (pick) {
      const pa = D.all.find(a => a.name === pick) || {}, ctry = pa.country ? (W.country ? W.country(pa.country) : pa.country) : "", gen = (pa.genres || []).filter(x => x !== "extra").slice(0, 2).join(" · ");
      D.pick = pick;
      S.push({ dur: 6400, bg: INK, html: () => `<div class="k in">${D.has ? L("De knop draait nog één keer…", "One last turn of the dial…") : L("Draai aan de knop…", "Turn the dial…")}</div><h2 class="h2">${words(D.has ? L("Deze miste je nog:", "The one that got away:") : L("Jouw ontdekking:", "Your discovery:"), 150)}</h2><div class="roul"><b>…</b></div><p class="rw-p reveal">${esc([ctry, gen].filter(Boolean).join(" — "))}${ctry || gen ? "<br>" : ""}${L("Zet ’m op voor de terugweg.", "Put them on for the ride home.")}</p>`,
        after: el => { const b = el.querySelector(".roul b"); let d = 45, n = 0;
          const spin = () => { if (!b.isConnected) return; if (d > 340 || reduced) { b.textContent = pick; b.classList.add("land"); el.querySelector(".reveal").classList.add("on"); el.dataset.land = "1"; return; }
            b.textContent = pool[(n++ * 7 + Math.floor(Math.random() * pool.length)) % pool.length]; el.dataset.rot = n; d *= 1.13; setTimeout(spin, d); };
          setTimeout(spin, 500); },
        fx: (g, t, w, h, st, el) => { const dt = stepT(st, t), landed = el && el.dataset.land === "1", R = Math.min(w * .36, 150), cx = w * .74, cy = h * .2;
          if (landed && !st.l) { st.l = t; FX.flash = .5; FX.shake = 10; burst(st, w * .3, h * .55, 60, { cols: [YEL, PINK, "#fff"], sp: 600, life: 1.6 }); }
          const rot = landed ? -(+el.dataset.rot || 0) * .65 : -(+((el && el.dataset.rot) || 0)) * .65 - (t % 1) * .2;
          g.save(); g.translate(cx, cy); g.rotate(rot); g.strokeStyle = "rgba(255,255,255,.7)"; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, R, 0, 7); g.stroke();
          for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2, r1 = i % 5 ? R * .88 : R * .78; g.lineWidth = i % 5 ? 1.5 : 3; g.beginPath(); g.moveTo(Math.cos(a) * r1, Math.sin(a) * r1); g.lineTo(Math.cos(a) * R * .96, Math.sin(a) * R * .96); g.stroke(); }
          g.strokeStyle = PINK; g.lineWidth = 7; g.lineCap = "round"; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -R * .8); g.stroke(); g.fillStyle = PINK; g.beginPath(); g.arc(0, 0, 10, 0, 7); g.fill(); g.restore();
          if (!landed) noise(g, w, h, .22); else waves(g, w, h, t, cx, cy, "255,210,63", 6, 50);
          particles(g, st, dt); } });
    }
    /* 12. Wapperman */
    if (!D.played) {
      S.push({ dur: 5800, bg: YEL, lite: true, cls: "rw-wm", html: () => { const tp = (D.top || [])[0]; return `<div class="k in">Wapperman</div><canvas width="420" height="520"></canvas><h2 class="h2">${tp ? words(L(`${tp.name} staat bovenaan met ${fmt(tp.score)} punten.`, `${tp.name} tops the board with ${fmt(tp.score)} points.`), 300) : words(L("Het scorebord staat nog open.", "The leaderboard is still open."), 300)}</h2><p class="rw-p in" style="animation-delay:1.3s">${L("Je hebt nog geen potje gespeeld. Wapperman blijft gewoon in de app: pak zoveel mogelijk bands en kom in de top 10.", "You haven't played yet. Wapperman stays in the app: catch as many bands as you can and make the top 10.")}</p>`; }, after: el => wmAnim(el),
        fx: (g, t, w, h, st) => { if (!st.r) st.r = Array.from({ length: 9 }, (_, i) => ({ x: rnd(0, w), y: rnd(-h, 0), v: rnd(60, 140), r: rnd(22, 40), a: rnd(0, 6), c: [PINK, BLUE, "#fff"][i % 3] })); const dt = stepT(st, t);
          st.r.forEach(o => { o.y += o.v * dt; o.a += dt * 3; if (o.y > h + 50) { o.y = -50; o.x = rnd(0, w); } g.save(); g.translate(o.x, o.y); g.rotate(o.a); g.globalAlpha = .55; g.fillStyle = "#141414"; g.beginPath(); g.arc(0, 0, o.r, 0, 7); g.fill(); g.strokeStyle = "rgba(255,255,255,.18)"; g.lineWidth = 1; for (let k = .45; k < .95; k += .12) { g.beginPath(); g.arc(0, 0, o.r * k, 0, 7); g.stroke(); } g.fillStyle = o.c; g.beginPath(); g.arc(0, 0, o.r * .32, 0, 7); g.fill(); g.fillStyle = "#141414"; g.fillRect(-o.r * .3, -1.5, o.r * .3, 3); g.restore(); }); } });
    } else {
      S.push({ dur: 6000, bg: YEL, lite: true, cls: "rw-wm", html: () => `<div class="k in">Wapperman</div><canvas width="420" height="520"></canvas><h2 class="h2"><span data-c="${D.best}">0</span> ${L("punten record.", "points high score.")}</h2><p class="rw-p in" style="animation-delay:1.2s">${L(`${D.prof.games || 1}× gespeeld · ${(D.prof.crate || []).length} bands in je platenkast · skin: ${esc(window.WappermanGame && WappermanGame.skinName ? WappermanGame.skinName() : "Klassiek")}.`, `${D.prof.games || 1} games · ${(D.prof.crate || []).length} bands in your crate · skin: ${esc(window.WappermanGame && WappermanGame.skinName ? WappermanGame.skinName() : "Classic")}.`)}${rankTxt(D)}</p>`, after: el => { wmAnim(el); countAll(el, 300, 0, 1600); },
        fx: (g, t, w, h, st) => { const dt = stepT(st, t); if (!st.c && t > 1.8) { st.c = 1; confetti(st, w, 140); FX.shake = 8; } particles(g, st, dt); } });
    }
    /* 13. bedankt: aftiteling over een sterrenhemel */
    const cred = { dur: 16000, bg: INK, after: el => { const c = el.querySelector(".cred"); if (!c) return; const H = c.offsetHeight, V = el.offsetHeight, sec = 8 * (H + V) / Math.max(1, H); c.style.setProperty("--sh", V + "px"); c.style.animationDuration = sec + "s"; cred.dur = Math.round(sec * 1000) + 400; },
      html: () => `<div class="cred"><small>Thanks to</small>${["Everyone", "All the bands", "All the venues", "Every crew member", "Every volunteer", "Every sound engineer", "You"].map(x => `<div>${x}</div>`).join("")}<small>${L("Op de podia van", "On the stages of")}</small>${D.venues.map(v => `<div>${esc(v)}</div>`).join("")}<small>${L("Gemaakt met liefde in", "Made with love in")}</small><div>Rotterdam ♥</div></div><div style="position:relative;z-index:2;background:linear-gradient(rgba(11,11,20,0),${INK} 40px,${INK} calc(100% - 44px),rgba(11,11,20,0));padding:40px 0 50px;margin:-40px 0 0"><div class="k in">Thanks to everyone</div><h2 class="h2">${words("Thanks for supporting live music.", 200, 110)}</h2></div>`,
      fx: (g, t, w, h, st) => { if (!st.s) st.s = Array.from({ length: 140 }, () => ({ x: rnd(0, w), y: rnd(0, h), z: rnd(.2, 1) }));
        st.s.forEach(o => { const y = (o.y - t * 18 * o.z + h * 10) % h; g.fillStyle = `rgba(255,255,255,${o.z * .8})`; g.fillRect(o.x, y, o.z * 2.2, o.z * 2.2); });
        const sh = (t % 3.3) / .7; if (sh < 1) { const x0 = w * (.9 - sh * .8), y0 = h * (.1 + sh * .3); const gr = g.createLinearGradient(x0, y0, x0 + 90, y0 - 30); gr.addColorStop(0, "rgba(255,255,255,.9)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.strokeStyle = gr; g.lineWidth = 2; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x0 + 90, y0 - 30); g.stroke(); } } };
    S.push(cred);
    /* 15. slot: See you next year + tickets, met vuurwerk */
    S.push({ dur: 0, bg: BLUE, osd: () => "■ STOP", html: () => `${dialSvg("#fff", YEL)}<div class="k in">${L("Dit was Left of the Dial 2026", "This was Left of the Dial 2026")}</div><h1 class="rw-h rgb" style="font-size:clamp(66px,22vw,132px)">${words("See you", 200, 0, "slam")}<br>${words("next year!", 520, 0, "slam")}</h1><p class="rw-p in" style="animation-delay:1s">${L("The club was open. Bedankt dat je erbij was.", "The club was open. Thanks for being there.")}</p><div class="cta in" style="animation-delay:1.3s"><a class="t1 tix" href="${TICKETS}" target="_blank" rel="noopener"><span class="tix-a"></span><small class="tix-b"></small></a><div class="rw-row"><button class="t2" data-rw="replay">↺ ${L("Opnieuw", "Replay")}</button><button class="t2" data-rw="share">${L("Deel je kaart", "Share card")}</button></div>${D.played ? "" : `<button class="t2" data-rw="game">${L("Speel Wapperman", "Play Wapperman")}</button>`}<button class="t2" data-rw="close">${L("Naar de app", "Back to the app")}</button></div>`,
      after: el => { const off = (W.now ? W.now().getTime() : Date.now()) - Date.now(), a = el.querySelector(".tix-a"), b = el.querySelector(".tix-b"), btn = el.querySelector(".tix");
        const upd = () => { if (!a.isConnected) return; const left = SALE.getTime() - (Date.now() + off);
          if (left <= 0) { btn.classList.remove("soon"); a.textContent = L("Koop je tickets nu!", "Get your tickets now!"); b.textContent = "Left of the Dial 2027 →"; return; }
          btn.classList.add("soon"); a.textContent = L("Tickets 2027", "Tickets 2027");
          if (left > 864e5) b.textContent = L("verkoop start zondag 25 oktober om 10:00", "on sale Sunday 25 October at 10:00");
          else { const s2 = Math.floor(left / 1000); b.textContent = L("verkoop start om 10:00 · nog ", "on sale at 10:00 · ") + `${Math.floor(s2 / 3600)}:${String(Math.floor(s2 / 60) % 60).padStart(2, "0")}:${String(s2 % 60).padStart(2, "0")}`; }
          setTimeout(upd, 1000); };
        upd(); },
      fx: (g, t, w, h, st) => { const dt = stepT(st, t); waves(g, w, h, t, w * .92, h * .92, "255,255,255", 7, 60);
        st.r = st.r || []; st.nx = st.nx == null ? .3 : st.nx;
        if (t > st.nx && t < 60) { st.nx = t + (t < 6 ? rnd(.3, .6) : rnd(1.2, 2.4)); st.r.push({ x: rnd(w * .15, w * .85), y: h + 10, vy: -rnd(h * .9, h * 1.2), ty: rnd(h * .08, h * .3) }); }
        st.r = st.r.filter(r => { r.y += r.vy * dt; r.vy *= .985; g.fillStyle = "#fff"; g.fillRect(r.x - 1.5, r.y, 3, 14); if (r.y <= r.ty) { if (t < 6) FX.shake = 7; if (Math.random() < .55) heartBurst(st, r.x, r.y, [YEL, PINK, "#fff"], 240); else burst(st, r.x, r.y, 70, { cols: ["#fff", YEL, PINK], sp: 340, drag: 1.6, g: 160, life: 1.6 }); return false; } return true; });
        if (!st.big && t > .75) { st.big = 1; FX.flash = .9; FX.shake = 20; heartBurst(st, w / 2, h * .2, [YEL], 380); }
        particles(g, st, dt, 160); } });
    return S;
  }

  /* ---------- deelkaart (1080×1920): jouw festival-type ---------- */
  function shareCard(D) {
    return new Promise(res => {
      const c = document.createElement("canvas"); c.width = 1080; c.height = 1920; const g = c.getContext("2d");
      const bg = g.createLinearGradient(0, 0, 1080, 1920); bg.addColorStop(0, BLUE); bg.addColorStop(1, "#0a0a3a"); g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
      g.strokeStyle = "rgba(255,255,255,.22)"; g.lineWidth = 5; for (let r = 260; r < 1100; r += 70) { g.beginPath(); g.arc(1080, 1920, r, 0, 7); g.stroke(); }
      g.fillStyle = "rgba(0,0,0,.08)"; for (let y = 0; y < 1920; y += 6) g.fillRect(0, y, 1080, 2);
      g.fillStyle = "#fff"; g.font = `500 34px ${FM}`; g.fillText("▶ PLAY   LOTD 2026  ♥  ROTTERDAM", 70, 110);
      g.font = `800 170px ${F}`; g.fillStyle = PINK; g.fillText("REWIND", 58, 300); g.fillStyle = CYAN; g.fillText("REWIND", 66, 300); g.fillStyle = "#fff"; g.fillText("REWIND", 62, 300); g.fillText("THE DIAL.", 62, 450);
      g.font = `600 42px ${FB}`; g.fillStyle = "#c6d0ff"; g.fillText(D.name ? `${D.name}'s festival` : L("Mijn festival", "My festival"), 70, 530);
      /* kaart */
      const cx = 70, cy = 600, cw = 940, ch = 520; const cg = g.createLinearGradient(cx, cy, cx + cw, cy + ch); cg.addColorStop(0, "#20208a"); cg.addColorStop(.6, "#0d0d33"); cg.addColorStop(1, "#3a0a3a"); g.fillStyle = cg;
      const rr = (x, y, w, h, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
      rr(cx, cy, cw, ch, 36); g.fill(); g.strokeStyle = "rgba(255,255,255,.8)"; g.lineWidth = 5; g.stroke();
      const holo = g.createLinearGradient(cx, cy, cx + cw, cy); [PINK, YEL, CYAN, PINK].forEach((col, i) => holo.addColorStop(i / 3, col)); g.globalAlpha = .22; g.fillStyle = holo; rr(cx, cy, cw, ch, 36); g.fill(); g.globalAlpha = 1;
      g.fillStyle = YEL; g.beginPath(); g.arc(cx + 100, cy + 110, 56, 0, 7); g.fill(); heart(g, cx + 100, cy + 112, 62, "#141414");
      g.fillStyle = "#fff"; g.font = `500 28px ${FM}`; g.fillText(L("FESTIVAL-TYPE", "FESTIVAL TYPE"), cx + 190, cy + 100);
      const fit = (txt, size, maxW, font = F, wt = 800) => { let s = size; g.font = `${wt} ${s}px ${font}`; while (g.measureText(txt).width > maxW && s > 30) { s -= 4; g.font = `${wt} ${s}px ${font}`; } };
      fit(D.arch.t.toUpperCase(), 110, cw - 80); g.fillText(D.arch.t.toUpperCase(), cx + 40, cy + 270);
      g.font = `600 34px ${FB}`; g.fillStyle = "#e6e8ff"; const wl = D.arch.d.split(" "); let line = "", ly = cy + 340; wl.forEach(wd => { if (g.measureText(line + wd).width > cw - 80) { g.fillText(line, cx + 40, ly); ly += 44; line = ""; } line += wd + " "; }); g.fillText(line, cx + 40, ly);
      D.arch.bars.forEach(([lb, v], i) => { const y = ly + 50 + i * 44; if (y > cy + ch - 30) return; g.font = `800 26px ${F}`; g.fillStyle = "#fff"; g.textAlign = "left"; g.fillText(lb.toUpperCase(), cx + 40, y); g.textAlign = "right"; g.fillText(String(v), cx + cw - 40, y); g.textAlign = "left"; g.fillStyle = "rgba(255,255,255,.18)"; rr(cx + 40, y + 10, cw - 80, 12, 6); g.fill(); const bgr = g.createLinearGradient(cx + 40, 0, cx + cw - 40, 0); bgr.addColorStop(0, PINK); bgr.addColorStop(1, YEL); g.fillStyle = bgr; rr(cx + 40, y + 10, Math.max(12, (cw - 80) * v / 100), 12, 6); g.fill(); });
      /* cijfers */
      const st = D.has ? [[D.myBands.length, L("bands", "bands")], [D.must.length, L("moest ik zien", "must-sees")], [D.myCountries.length, L("landen", "countries")]] : [[D.bands.length, "bands"], [D.venues.length, L("zalen", "venues")], [D.countries.length, L("landen", "countries")]];
      st.forEach(([n, l], i) => { const x = 70 + i * 330; g.fillStyle = "#fff"; g.font = `800 130px ${F}`; g.fillText(String(n), x, 1290); g.font = `700 30px ${FB}`; g.fillStyle = "#c6d0ff"; g.fillText(l.toUpperCase(), x, 1338); });
      g.fillStyle = "#fff"; g.font = `500 32px ${FM}`; g.fillText(D.has ? L("OP MIJN LIJST", "ON MY LIST") : L("MIJN ONTDEKKING", "MY DISCOVERY"), 70, 1420);
      { const names = D.has ? D.myBands.slice().sort(() => Math.random() - .5) : [D.pick].filter(Boolean); let x = 70, y = 1486, line = 0; g.font = `800 50px ${F}`;
        for (const n of names) { const t = n.toUpperCase(), tw = g.measureText(t).width; if (x + tw + g.measureText("  ♥").width > 1010) { line++; x = 70; y += 60; } if (line > 4) break; g.fillStyle = D.has && D.must.includes(n) ? YEL : "#fff"; g.fillText(t, x, y); x += tw; g.fillStyle = PINK; g.fillText("  ♥  ", x, y); x += g.measureText("  ♥  ").width; } }
      g.fillStyle = "#141414"; g.fillRect(0, 1810, 1080, 110); g.fillStyle = "#fff"; g.font = `800 54px ${F}`; g.fillText("THE CLUB WAS OPEN.", 70, 1882); g.font = `600 28px ${FB}`; g.fillStyle = "#c6d0ff"; g.textAlign = "right"; g.fillText(location.host, 1010, 1878);
      c.toBlob(b => res(b), "image/png");
    });
  }

  /* ---------- speler ---------- */
  let root = null, S = [], idx = 0, t0 = 0, elapsed = 0, paused = false, raf = 0, D = null, holdT = 0, prevOverflow = "", cv = null, g = null, dpr = 1, st = {}, clock = 0, glxT = 0;
  function show(i) {
    idx = Math.max(0, Math.min(S.length - 1, i)); elapsed = 0; t0 = performance.now(); st = {}; FX.flashCol = "255,255,255";
    const stage = root.querySelector(".rw-stage"), sl = S[idx];
    stage.innerHTML = `<section class="sl ${sl.cls || ""}">${sl.html()}</section>`;
    st.el = stage.firstElementChild;
    if (sl.after) try { sl.after(st.el); } catch (e) {}
    root.style.backgroundColor = sl.bg || BLUE;
    root.querySelectorAll(".rw-bars i b").forEach((b, k) => { b.style.width = k < idx ? "100%" : "0%"; });
    root.querySelector(".rw-hint").style.display = idx === 0 ? "" : "none";
    root.classList.toggle("last", !sl.dur); root.classList.toggle("lite", !!sl.lite);
    if (idx > 0 && !reduced) { root.classList.remove("glx"); void root.offsetWidth; root.classList.add("glx"); clearTimeout(glxT); glxT = setTimeout(() => root && root.classList.remove("glx"), 360); }
  }
  function size() { if (!cv) return; dpr = Math.min(2, window.devicePixelRatio || 1); const w = root.clientWidth, h = root.clientHeight; if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); } }
  const tc = s => { s = Math.floor(s); return `${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; };
  function tick(now) {
    raf = requestAnimationFrame(tick); if (!root) return;
    const dt = now - t0; t0 = now; if (!paused) { elapsed += dt; clock += dt; }
    const sl = S[idx], bars = root.querySelectorAll(".rw-bars i b");
    if (sl.dur) { const k = Math.min(1, elapsed / sl.dur); if (bars[idx]) bars[idx].style.width = (k * 100) + "%"; if (k >= 1) { show(idx + 1); return; } } else if (bars[idx]) bars[idx].style.width = "100%";
    const t = elapsed / 1000, osd = root.querySelector(".rw-osd");
    if (osd) { const mode = paused ? "❚❚ PAUSE" : sl.osd ? sl.osd(t) : "▶ PLAY"; const txt = `<b>${mode}</b><span>SP ${tc(clock / 1000)}${D.name ? " · " + esc(D.name.toUpperCase()) : ""}</span>`; if (osd._t !== txt) { osd.innerHTML = txt; osd._t = txt; } }
    if (!g) return; size(); const w = cv.width / dpr, h = cv.height / dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h);
    if (!reduced && sl.fx) { try { sl.fx(g, t, w, h, st, st.el); } catch (e) { /* een effect mag de speler nooit stoppen */ } }
    if (!reduced && idx > 0 && t < .34) noise(g, w, h, 1 - t / .34, !!sl.lite);
    if (FX.flash > 0) { g.fillStyle = `rgba(${FX.flashCol},${FX.flash * .85})`; g.fillRect(0, 0, w, h); if (!paused) FX.flash = Math.max(0, FX.flash - dt / 260); }
    const stage = root.querySelector(".rw-stage");
    if (FX.shake > .3 && !reduced) { stage.style.transform = `translate(${rnd(-1, 1) * FX.shake}px,${rnd(-1, 1) * FX.shake}px)`; if (!paused) FX.shake *= Math.pow(.86, dt / 16); } else if (stage.style.transform) { stage.style.transform = ""; FX.shake = 0; }
  }
  function setPaused(p) { paused = p; root.classList.toggle("paused", p); const pp = root.querySelector(".rw-pp"); if (pp) pp.textContent = p ? "▶" : "❚❚"; }
  async function share() {
    const text = L("Mijn Left of the Dial 2026, teruggespoeld. The club was open! ♥", "My Left of the Dial 2026, rewound. The club was open! ♥"), url = location.origin + "/";
    try { const blob = await shareCard(D), file = blob && new File([blob], "rewind-the-dial.png", { type: "image/png" }); if (file && navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: "Rewind the Dial", text: text + " " + url }); return; } if (blob && !navigator.share) { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "rewind-the-dial.png"; a.click(); return; } } catch (e) { if (e && e.name === "AbortError") return; }
    if (navigator.share) navigator.share({ title: "Rewind the Dial", text, url }).catch(() => {});
  }
  function close() {
    if (!root) return; cancelAnimationFrame(raf); root.remove(); root = null; cv = g = null;
    document.documentElement.style.overflow = prevOverflow; document.removeEventListener("keydown", onKey); window.removeEventListener("resize", size);
    try { localStorage.setItem("lotd-rewind-seen", JSON.stringify(Date.now())); } catch (e) {}
  }
  function onKey(e) { if (!root) return; if (e.key === "Escape") close(); else if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); show(idx + 1); } else if (e.key === "ArrowLeft") show(idx - 1); }
  function play() {
    if (root) return; D = data(); S = slides(D); idx = 0; clock = 0; FX.flash = 0; FX.shake = 0;
    try { window.WappermanGame && WappermanGame.top && WappermanGame.top().then(r => { if (r && r.list && r.list.length) D.top = r.list; }).catch(() => {}); } catch (e) {}
    try { localStorage.setItem("lotd-rewind-seen", JSON.stringify(Date.now())); } catch (e) {}
    if (!document.getElementById("rw-css")) { const s = document.createElement("style"); s.id = "rw-css"; s.textContent = CSS; document.head.appendChild(s); }
    root = document.createElement("div"); root.id = "rw"; root.setAttribute("role", "dialog"); root.setAttribute("aria-label", "Rewind the Dial");
    root.innerHTML = `<canvas class="rw-fx" aria-hidden="true"></canvas><div class="rw-stage"></div><div class="rw-scan" aria-hidden="true"></div><div class="rw-bars">${S.map(() => "<i><b></b></i>").join("")}</div><div class="rw-top"><div class="rw-osd" aria-hidden="true"></div><button class="rw-pp" aria-label="${L("Pauze", "Pause")}">❚❚</button><button class="rw-x" aria-label="${L("Sluiten", "Close")}">✕</button></div><div class="tapL"></div><div class="tapR"></div><div class="rw-hint">${L("Tik om verder · houd vast voor pauze", "Tap to skip · hold to pause")}</div>`;
    document.body.appendChild(root); prevOverflow = document.documentElement.style.overflow; document.documentElement.style.overflow = "hidden";
    cv = root.querySelector(".rw-fx"); try { g = cv.getContext("2d"); } catch (e) { g = null; } size(); window.addEventListener("resize", size);
    root.querySelector(".rw-x").addEventListener("click", close);
    root.querySelector(".rw-pp").addEventListener("click", () => setPaused(!paused));
    let hold = 0;
    ["tapL", "tapR"].forEach((c, k) => { const el = root.querySelector("." + c);
      el.addEventListener("pointerdown", () => { holdT = performance.now(); hold = setTimeout(() => setPaused(true), 300); });
      el.addEventListener("pointerup", () => { clearTimeout(hold); const long = performance.now() - holdT > 300; if (long) { setPaused(false); holdT = 0; return; } holdT = 0; show(idx + (k ? 1 : -1)); });
      el.addEventListener("pointercancel", () => { clearTimeout(hold); setPaused(false); holdT = 0; });
      el.addEventListener("contextmenu", e => e.preventDefault()); });
    root.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-rw]"); if (!b) return; const a = b.dataset.rw; if (a === "replay") { setPaused(false); D = data(); S = slides(D); clock = 0; root.querySelector(".rw-bars").innerHTML = S.map(() => "<i><b></b></i>").join(""); show(0); } else if (a === "share") share(); else if (a === "close") close(); else if (a === "game") { close(); location.hash = "#/game"; } });
    root.addEventListener("touchmove", e => { if (e.cancelable) e.preventDefault(); }, { passive: false });
    document.addEventListener("keydown", onKey);
    setPaused(false); show(0); t0 = performance.now(); raf = requestAnimationFrame(tick);
  }
  window.LotdRewind = { play, close, data };
})();
