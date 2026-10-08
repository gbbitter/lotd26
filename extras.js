/* extras.js – laad dit bestand NA het hoofdscript (net voor </body>).
   Doet: echte genres + landen, genre-filter, tabblad "Nu & straks", link naar de officiële actpagina,
   zoeken op genre/land (ook zonder accenten) en een correcte "nu"-tijd (ook na middernacht). */
(function () {
  // Bron: leftofthedial.nl/line-up (naam|land|genres|optioneel: afwijkende pagina-slug)
  const SITE_RAW = `Al Cologne|UK|folk,indie pop,pop,singer-songwriter
Alice Costelloe|UK|folk,indie pop,pop,singer-songwriter
Alien Boy|US|alternative rock,indie pop,pop,rock
Any Young Mechanic|AU|folk,pop,slacker rock
Arkayla|UK|indie rock,rock
Ashnymph|UK|alt-rave,industrial,rock
Atticomatic|UK|art-pop,avant-garde,rock
August|UK|art-pop,art-rock,rock
Babe Haven|US|heavy,punk,rock
Bathing Suits|UK|alt-rave,noise,rock|bathing-suits
Bed|JP|alt-rave,heavy,industrial
Beige|NL|college rock,indie rock,shoegaze
Ben Kidson|UK|alt-hip hop,indie pop,lyrical-poetry,pop
Benchwarmer|UK|alternative rock,rock,shoegaze
Bert|UK|alt-soul,folk,singer-songwriter
Black Nylon|IE|post-punk,rock
Bloodworm|UK|post-punk,rock,wave
Bog Band|IE|alt-soul,indie pop,pop|bog-band-ire
Bramwell|UK|indie pop,powerpop,rock,slacker rock
Brooki|IE|alternative rock,rock
Burglar|IE|indie rock,rock,slacker rock
Casual Smart|UK|alt-country,folk,indie pop,pop
Charlie Noordewier|UK|alt-soul,folk,pop
Cherryholt|UK|indie pop,rock
Child Of Prague|IE|alt-country,folk,pop
Compost Compost Compost|UK|
Cordelia Gartside|UK|art-rock,indie rock,rock
Corin V|UK|folk,indie rock,singer-songwriter
Cosign|UK|dream pop,pop
Curiosity Shop|UK|alt-country,folk,indie pop,pop
Date Camp|DK|indie pop,rock
Daufødt|NO|heavy,noise,punk,rock
Doom Fever|NL|grunge,indie rock,rock
Ebby|NL|art-pop,experimental,rock
Echo Northstar|IE|alternative rock,indie rock,pop,rock
Esmeralda Road|IE|math rock,post-punk,rock
Family Stereo|UK|alt-country,folk,lyrical-poetry,pop
Fellatio|NL|alt-disco,alt-rave,avant-garde
Ferguson Hi-Fi|UK|garage,powerpop,rock
Flowers For The Dead|US|alternative rock,grunge,rock
Foot Foot|UK|art-rock,folk,indie rock,math rock
Gardens|AT|dream pop,indie pop,rock
Girlfriend.|IE|grunge,rock,shoegaze
Glasshouse Red Spider Mite|UK|art-pop,pop
Gnarcissists|US|punk,rock
Goodbye|UK|indie pop,indie rock
Gordi|AU|indie pop,pop
Gwen|UK|industrial,rock,wave
GX Nurse|UK|indie pop,rock,shoegaze|sunken-uk
Hamburger|UK|college rock,indie rock,rock,slacker rock
Hammok|NO|heavy,noise,punk,rock
Hillsboro|CA|indie rock,post-rock,rock
Holly Head|UK|dance-punk,post-punk,rock,shoegaze
Hungry|UK|dance-punk,post-punk,rock
Hyd|US|alt-disco,experimental,pop,synth pop
Imaginary Husband|UK|math rock,punk,rock
Insider Trading|UK|math rock,post-punk,post-rock,rock
Iskandr|NL|folk,industrial
Jackson Roy|UK|experimental,folk,indie pop
Jana Horn|US|folk,lyrical-poetry,pop,singer-songwriter
Jawdropped|US|rock,slacker rock
JJ Bull|UK|alt-disco,alt-rave,pop,synth pop
Juni Habel|NO|folk,singer-songwriter
Kelly No Brakes|SE/FR|dream pop,pop
La Flemme|FR|garage,rock
Lacuna|UK|dream pop,folk,pop,shoegaze
Latter|US|heavy,noise,punk,rock
Lawn Chair|US/DE|punk,rock
Leather.head|UK|experimental,post-rock,rock,slowcore
Leela Rosa|NL|art-pop,dream pop,pop
Lemonsuckr|UK|alt-rave,dance-punk,rock
Library Card|NL|lyrical-poetry,post-punk,rock|library-card-nl-2
Lots Of|UK|math rock,noise,rock
Lots Of Hands|UK|experimental,indie pop
Loveth Besamoh|NL|post-punk,rock
LTTL Mort|UK|alt-rave,industrial,rock,synth pop
Lucky Iris|UK|alt-disco,alt-pop,pop,synth pop
Magasin|NL|art-pop,post-punk,wave
Maicín|IE|folk,indie pop,rock,slacker rock
Maquina.|PT|alt-rave,heavy,industrial,metal,rock
Max Sloan|UK|folk,indie pop,singer-songwriter
Mek’Dr’Dr|BE|alt-pop,pop,post-punk,rock
Melanie Baker|UK|grunge,pop,rock
MF Tomlinson|UK|folk,singer-songwriter,slowcore
Michael Ian Cummings|US|rock,singer-songwriter
Midscale|FR|post-rock,rock,shoegaze
Milkweed|UK|experimental,folk
Milo Korbenski|UK|indie pop,indie rock,pop|milo-korbenski-uk-2
Mindsigh|UK|alternative rock,grunge,rock
Mixed Waste|BE|post-punk,rock
Mleko|UK|art-rock,post-rock,rock
Monde Ufo|US|indie pop,indie rock
Monks|UK|alt-rave,rock,synth pop
Mry|UK|dream pop,post-rock,shoegaze,slowcore
My Purse|NL|art-pop,post-punk
Nadeem Din-Gabisi|UK|alt-hip hop,alt-soul,lyrical-poetry,singer-songwriter
Neve Cariad|UK|alt-country,folk,pop,singer-songwriter
Newbuild|UK|dream pop,experimental,post-punk
Newhvn|IE|alternative rock,grunge,rock,shoegaze
Nico & Linus|UK|indie pop,indie rock,psych,rock
Nina Winder-Lind|SE/UK|folk,lyrical-poetry,pop,rock,singer-songwriter
Noonzy|BE|indie pop,pop
Normal Village|UK|art-punk,avant-garde,post-punk
Norman D. Loco|UK|art-pop,indie pop,indie rock
Omertà|UK|garage,noise,punk,rock
Oslo Twins|UK|alt-disco,alt-rave,pop,synth pop
Painkiller|UK|garage,rock
Pales|FR|heavy,noise,post-punk,rock
Part-Time Model|UK|indie rock,rock,synth pop
Paulie Swan|UK|lyrical-poetry,singer-songwriter
Perfect Binding|UK|folk,indie rock,post-rock
Plainhead|DE|dream pop,folk,pop,rock
Poodle|NL|art-punk,garage,rock
Pushbike|UK|college rock,powerpop,rock,slacker rock
Pyncher|UK|art-punk,garage,post-rock,rock
Rageflower|AU|indie rock,pop,rock
Rampressure|UK|garage,heavy,noise,post-punk,rock
Rian Brazil|UK|alt-hip hop,alt-pop,alt-rave,singer-songwriter
Ringlets|NZ|post-punk,rock
Ropeburn|UK/IE|folk,math rock,post-rock
Scotstown Dance Band|UK|alt-country,pop,rock
Serena Clara|UK|art-pop,lyrical-poetry,pop
Shark School|IE|punk,rock
Shitkid|SE|alt-pop,garage,indie rock,punk,rock
Shrink|UK|indie rock,rock
Smudged|NL|alt-rave,rock,synth pop,wave
Spanish Horses|FR/UK|indie pop,indie rock,rock|spanish-horses-uk
Spike Fuck|AU|noir,singer-songwriter,wave
State Of Grace|IE|alt-soul,rock
Stonks|BE|dance-punk,noise,punk,rock
Stoop Kid|BE|indie pop,pop,rock,slacker rock
Studio20|UK|alt-pop,experimental
Sundayclub|CA|indie pop,indie rock
Systeemfalen|NL|punk,rock,sludge
Telekura|IE|pop,synth pop
Thank|UK|alt-rave,heavy,industrial,noise,punk,rock
The Glowworms|UK|folk,indie rock,pop,rock|the-glowworms
The Guest List|UK|dance-punk,indie pop,indie rock,rock
The Healing Power Of Horses|UK|alt-pop,indie pop,pop,slowcore
The Heavenly Bodes|UK|garage,pop,psych,rock
The Jump Cuts|US|garage,indie rock,rock
The North|UK|alternative rock,indie rock,rock
The Paris Match|UK|garage,indie rock,powerpop,psych,rock
The Sewing Club|US|alternative rock,grunge,rock
The Slow Country|UK|folk,slacker rock
Thrilled|NL|rock,shoegaze|thrilled-nl-2
Toast Club|UK|indie pop,pop,rock
Tokyo Sea Dragons|UK|alt-pop,rock
Tooth|UK|alternative rock,indie rock,rock
Tough Cookie|UK|alternative rock,grunge,rock,slacker rock
Tracey Nelson|US|alt-country,folk
Trip Westerns|UK|alt-country,psych,rock
Turnspit|UK|alt-rave,pop,synth pop
Twenty One Children|ZA|heavy,punk,rock
Ugly Ozo|UK|grunge,indie pop,rock
Villagerrr|US|alt-country,folk|villager-us
Wesley & The Boys|US|punk,rock
What Jen Wants|UK|dream pop,grunge,rock,shoegaze
Wing!|UK|alt-hip hop,experimental,pop
Wyatt|UK|alt-country,rock
Yoo Doo Right|CA|post-rock,psych,rock
Zilcho Hamblin|UK|alt-country,pop,rock,singer-songwriter,slowcore`;

  Object.assign(CTRY, { AU: ["Australië", "AU"], BE: ["België", "BE"], FR: ["Frankrijk", "FR"], DE: ["Duitsland", "DE"], PT: ["Portugal", "PT"], SE: ["Zweden", "SE"], NZ: ["Nieuw-Zeeland", "NZ"], ZA: ["Zuid-Afrika", "ZA"] });
  const fold = s => String(s).toLowerCase().replace(/ø/g, "o").normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  const norm = s => fold(s).replace(/[^a-z0-9]/g, "");
  const uslug = s => fold(s).replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const SITE = {};
  SITE_RAW.split("\n").forEach(l => { const [n, cc, g, u] = l.split("|"); SITE[norm(n)] = { n, cc, g: g ? g.split(",") : [], u }; });
  ACTS.forEach(a => {
    const d = SITE[norm(a.name)];
    a.country = d ? d.cc : undefined;
    a.genres = d ? d.g : (a.genre ? [a.genre.toLowerCase()] : []);
  });
  const siteUrl = a => { const d = SITE[norm(a.name)]; return d ? "https://leftofthedial.nl/acts/" + (d.u || uslug(d.n) + "-" + d.cc.toLowerCase().replace("/", "-")) + "/" : null; };

  const cap = g => g.charAt(0).toUpperCase() + g.slice(1);
  const shown = a => { const g = a.genres || [], sp = g.filter(x => x !== "rock" && x !== "pop"); return (sp.length ? sp : g).slice(0, 3); };
  const codes = c => c.split("/").map(x => (CTRY[x] || [x, x])[1]).join("/");
  const names = c => c.split("/").map(x => (CTRY[x] || [x])[0]).join(" / ");
  const pillsX = a => shown(a).map(g => `<span class="pill">${cap(g)}</span>`).join("") + (a.country ? `<span class="pill">${codes(a.country)} · ${names(a.country)}</span>` : "");
  const subX = a => { const p = []; if (shown(a).length) p.push(shown(a).map(cap).join(" · ")); if (a.country) p.push(codes(a.country) + " · " + names(a.country)); return p.length ? "<br>" + p.join(" · ") : ""; };
  const tagX = a => [a.country ? codes(a.country) : "", shown(a)[0] ? cap(shown(a)[0]) : ""].filter(Boolean).join(" · ");

  /* ---- tijd: "nu" klopt ook na middernacht en in de lokale tijdzone. Test met  ?now=2026-10-22T21:15  ---- */
  const getNow = () => { let d = null; try { const p = new URLSearchParams(location.search).get("now"); if (p) d = new Date(p); } catch (e) {} return d && !isNaN(d) ? d : new Date(); };
  const ymd = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  function festNow() { const n = getNow(); let m = n.getHours() * 60 + n.getMinutes(), ds = ymd(n); if (m < 360) { ds = ymd(new Date(n.getTime() - 864e5)); m += 1440; } return { ds, m }; }
  const isLive = a => { const f = festNow(); return dayOf(a.day).date === f.ds && mins(a.start) <= f.m && mins(a.end) > f.m; };

  /* ---- rij in een lijst ---- */
  row = function (a, extra) {
    const d = dayOf(a.day), v = venue(a.venueId), clash = getClashes(a).length ? `<em class="clash">⚠ Overlapt met ${clashText(a)}</em>` : "";
    return `<div class="item"><button class="t" data-open="${a.id}"><b>${a.name}</b><span><i class="dot" style="background:${v.color}"></i>${v.name} · ${d.label} ${a.start}–${a.end}${typeof extra === "string" && extra ? ` · <em class="when">${extra}</em>` : ""}${subX(a)}${clash}</span></button><button class="hb ${isFav(a.id) ? "on" : ""}" data-fav="${a.id}" aria-label="Favoriet">${isFav(a.id) ? "♥" : "♡"}</button></div>`;
  };

  /* ---- genre-filter ---- */
  let genreOpen = false, selGenres = [], skipModal = false, nowFav = false;
  const allGenres = () => { const c = {}; ACTS.forEach(a => (a.genres || []).forEach(g => (c[g] = c[g] || new Set()).add(a.name))); return Object.entries(c).map(([g, s]) => [g, s.size]).sort((x, y) => x[0].localeCompare(y[0])); };
  const genreSheet = () => `<div class="ov"><div class="sheet" role="dialog" aria-modal="true" aria-label="Genre"><div class="grab"></div><button class="x" data-close-genres aria-label="Sluiten">✕</button><h2>Genre</h2><p>Toon alleen acts met een van deze genres.</p><div class="sheet-actions"><button data-no-genres>Wis filter</button><button data-close-genres>Klaar</button></div>${allGenres().map(([g, n]) => `<label class="checkrow"><input type="checkbox" data-genre="${g}" ${selGenres.includes(g) ? "checked" : ""}>${cap(g)}<span style="margin-left:auto;opacity:.5">${n}</span></label>`).join("")}</div></div>`;

  const _rm = renderModal;
  renderModal = function () {
    if (skipModal) return;
    const m = document.getElementById("modal");
    if (genreOpen) { m.innerHTML = genreSheet(); return; }
    if (venueOpen) return _rm();
    const a = openId && act(openId); if (!a) { m.innerHTML = ""; return; }
    const v = venue(a.venueId), d = dayOf(a.day), url = siteUrl(a);
    m.innerHTML = `<div class="ov"><div class="sheet" role="dialog" aria-modal="true" aria-label="${a.name}"><div class="grab"></div><button class="x" data-close aria-label="Sluiten">✕</button>${pillsX(a)}<h2>${a.name}</h2><div class="meta"><i class="dot" style="background:${v.color}"></i>${v.name}<br>${d.label} · ${a.start}–${a.end}${getClashes(a).length ? `<br><em class="clash">⚠ Overlapt met ${clashText(a)}</em>` : ""}</div>${others(a)}${url ? `<a class="oth" href="${url}" target="_blank" rel="noopener">Meer info op leftofthedial.nl ↗</a>` : ""}<button class="big ${isFav(a.id) ? "on" : ""}" data-fav="${a.id}">${isFav(a.id) ? "♥ In favorieten" : "♡ Toevoegen aan favorieten"}</button></div></div>`;
  };

  /* ---- timetable (zelfde opzet als eerder, plus genre-filter en betere "nu") ---- */
  vTimetable = function (onlyFavs) {
    const ids = sharedReadOnly && sharedIds ? sharedIds : null, f = festNow();
    const gOk = a => !selGenres.length || (a.genres || []).some(g => selGenres.includes(g));
    const list = ACTS.filter(a => a.day === day && (!onlyFavs || isFav(a.id)) && (!ids || ids.includes(a.id)) && !hiddenVenues.includes(a.venueId) && gOk(a));
    const today = dayOf(day).date === f.ds, jump = today ? `<button class="now-btn" data-now>Nu</button>` : "";
    const segHtml = `<div class="seg" role="tablist" aria-label="Kies een festivaldag">${DAYS.map(x => `<button class="${x.id === day ? "on" : ""}" data-day="${x.id}" role="tab" aria-selected="${x.id === day}">${x.label}</button>`).join("")}</div><div class="tt-tools"><button class="${favOnly || sharedReadOnly ? "on" : ""}" data-fav-only>${sharedReadOnly ? "Gedeelde lijst" : "♡ Alleen favorieten"}</button><button class="${selGenres.length ? "on" : ""}" data-genres>Genre${selGenres.length ? " · " + selGenres.length : ""}</button><button class="venue-btn" data-venues>Locaties${hiddenVenues.length ? ` · ${VENUES.length - hiddenVenues.length}` : ""}</button></div>`;
    if (!list.length) return segHtml + `<div class="empty">${selGenres.length ? "Geen acts met dit genre op deze dag." : onlyFavs ? (favs.length ? "Geen favorieten op deze dag." : "Nog geen favorieten.<br>Tik op het hartje bij een act om hem hier te zien.") : "Geen acts."}</div>`;
    const start = Math.floor(Math.min(...list.map(a => mins(a.start))) / 60) * 60, end = Math.ceil(Math.max(...list.map(a => mins(a.end))) / 60) * 60, hours = (end - start) / 60, W = hours * PPH;
    let ticks = ""; for (let i = 0; i <= hours; i++) ticks += `<div class="tick" style="left:${i * PPH}px">${String((start / 60 + i) % 24).padStart(2, "0")}:00</div>`;
    const rows = VENUES.filter(v => list.some(a => a.venueId === v.id)).map(v => {
      const acts = list.filter(a => a.venueId === v.id).map(a => {
        const l = (mins(a.start) - start) / 60 * PPH, w = (mins(a.end) - mins(a.start)) / 60 * PPH, cl = getClashes(a).length;
        return `<button class="act ${isFav(a.id) ? "fav" : ""}" style="left:${l}px;width:${w - 3}px;background:${v.color}" data-open="${a.id}"${cl ? ' aria-label="Overlapt met favorieten"' : ""}>${isFav(a.id) ? '<i class="h">♥</i>' : ""}${cl ? '<i class="h clash-marker">⚠</i>' : ""}${isLive(a) ? '<em class="live">NU</em>' : ""}<b>${a.name}</b><span>${a.start}–${a.end}</span><span class="g">${tagX(a)}</span></button>`;
      }).join("");
      return `<div class="row"><div class="lab"><i class="dot" style="background:${v.color}"></i>${v.name}</div><div class="track" style="width:${W}px;background-size:${PPH}px 100%">${acts}</div></div>`;
    }).join("");
    const now = today && f.m >= start && f.m <= end ? `<div class="now" style="left:${92 + (f.m - start) / 60 * PPH}px"></div>` : "";
    return segHtml + `<div class="tt-wrap">${jump}<div class="tt"><div class="tt-in" style="width:${92 + W}px"><div class="hrow"><div class="lab"></div><div class="trackh" style="width:${W}px">${ticks}</div></div>${rows}${now}</div></div></div>`;
  };

  /* ---- zoeken: naam, locatie, genre, land; accenten maken niet uit ---- */
  const searchActs = s => {
    const words = fold(s).split(/\s+/).filter(Boolean);
    return ACTS.filter(a => { const hay = fold([a.name, venue(a.venueId).name, (a.genres || []).join(" "), a.country ? names(a.country) + " " + codes(a.country) + " " + a.country : ""].join(" ")); return words.every(w => hay.includes(w)); });
  };
  vSearch = function () {
    const s = q.trim(), res = s ? searchActs(s) : [];
    return `<div class="search"><input id="q" type="search" placeholder="Zoek act, locatie, genre of land…" value="${q.replace(/"/g, "&quot;")}" autocomplete="off"></div><div class="list" id="res">${resHtml(s.toLowerCase(), res)}</div>`;
  };
  document.addEventListener("input", e => {
    if (e.target.id !== "q") return; e.stopImmediatePropagation(); q = e.target.value;
    const s = q.trim(), res = s ? searchActs(s) : []; document.getElementById("res").innerHTML = resHtml(s.toLowerCase(), res);
  }, true);

  /* ---- Nu & straks ---- */
  const sortFav = (a, b) => (isFav(b.id) - isFav(a.id)) || (mins(a.start) - mins(b.start)) || a.name.localeCompare(b.name);
  function vNowView() {
    const f = festNow(), d = DAYS.find(x => x.date === f.ds), demo = new URLSearchParams(location.search).get("now");
    if (!d) return `<div class="empty">${f.ds < DAYS[0].date ? "Het festival begint op woensdag 21 oktober." : "Het festival is voorbij. Bedankt voor het meekijken!"}<br><br><button class="big" data-go="/">Naar de timetable</button></div>`;
    const hh = String(Math.floor((f.m % 1440) / 60)).padStart(2, "0") + ":" + String(f.m % 60).padStart(2, "0");
    const all = ACTS.filter(a => a.day === d.id && !hiddenVenues.includes(a.venueId) && (!nowFav || isFav(a.id)));
    const live = all.filter(a => mins(a.start) <= f.m && mins(a.end) > f.m).sort(sortFav);
    const soon = all.filter(a => mins(a.start) > f.m && mins(a.start) <= f.m + 60).sort(sortFav);
    const later = all.filter(a => mins(a.start) > f.m + 60 && mins(a.start) <= f.m + 120).sort(sortFav);
    const sec = (t, arr, lab) => arr.length ? `<div class="grp">${t} (${arr.length})</div>${arr.map(a => row(a, lab(a))).join("")}` : "";
    const body = sec("Nu bezig", live, a => `nog ${mins(a.end) - f.m} min`) + sec("Begint binnen een uur", soon, a => `over ${mins(a.start) - f.m} min`) + sec("Daarna, binnen 2 uur", later, a => `over ${mins(a.start) - f.m} min`);
    return `<div class="tt-tools" style="padding-top:10px"><button class="${nowFav ? "on" : ""}" data-now-fav>♡ Alleen favorieten</button><span class="mono" style="margin-left:auto;font-size:12px">${d.label} · ${hh}${demo ? " (test)" : ""}</span></div><div class="list">${body || `<div class="empty">Het is even rustig${nowFav ? " bij je favorieten" : ""}. Niets in de komende 2 uur.</div>`}</div>`;
  }

  /* ---- hoofdweergave (met extra tab "Nu") ---- */
  ico.clock = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
  render = function (keep) {
    renderModal();
    const r = route(), main = document.getElementById("main"), tt0 = main.querySelector(".tt");
    const sc = keep ? [main.scrollTop, tt0 ? tt0.scrollLeft : 0, tt0 ? tt0.scrollTop : 0] : [0, 0, 0];
    const titles = { tt: "Timetable", now: "Nu & straks", search: "Zoeken", favorites: "Favorieten", game: "Wapperman", act: "Act" };
    document.getElementById("title").textContent = titles[r.p] || "Timetable";
    main.innerHTML = r.p === "search" ? vSearch() : r.p === "favorites" ? vFavs() : r.p === "act" ? vAct(r.id) : r.p === "now" ? vNowView() : r.p === "game" ? `<div id="wapperman-root"></div>` : vTimetable(favOnly);
    if (r.p === "game") WappermanGame.mount();
    const tab = r.p === "act" ? (sessionStorage.getItem("from") || "tt") : r.p, icon = { tt: "tt", now: "clock", search: "se", favorites: "fa", game: "game" };
    document.getElementById("nav").innerHTML = [["tt", "Timetable", "/"], ["now", "Nu", "/now"], ["search", "Zoeken", "/search"], ["favorites", "Favorieten", "/favorites"], ["game", "Wapperman", "/game"]].map(([k, l, h]) => `<button class="${tab === k ? "on" : ""}" data-go="${h}" aria-current="${tab === k ? "page" : "false"}">${ico[icon[k]] || "◉"}${l}</button>`).join("");
    if (keep) { main.scrollTop = sc[0]; const t = main.querySelector(".tt"); if (t) { t.scrollLeft = sc[1]; t.scrollTop = sc[2]; } }
    if (r.p === "search" && !keep) { const i = document.getElementById("q"); if (i && q) i.focus(); }
  };

  /* ---- klikken (vóór de bestaande klik-afhandeling) ---- */
  document.addEventListener("click", e => {
    const t = e.target, stop = () => e.stopImmediatePropagation();
    if (t.classList && t.classList.contains("ov") && genreOpen) { stop(); genreOpen = false; renderModal(); return; }
    if (t.closest("[data-genres]")) { stop(); genreOpen = true; renderModal(); return; }
    if (t.closest("[data-close-genres]")) { stop(); genreOpen = false; renderModal(); render(true); return; }
    if (t.closest("[data-no-genres]")) { stop(); selGenres = []; skipModal = false; document.getElementById("modal").innerHTML = genreSheet(); skipModal = true; render(true); skipModal = false; return; }
    const gc = t.closest("[data-genre]");
    if (gc) { stop(); const g = gc.dataset.genre; selGenres = gc.checked ? [...selGenres, g] : selGenres.filter(x => x !== g); skipModal = true; render(true); skipModal = false; return; }
    if (t.closest("[data-now-fav]")) { stop(); nowFav = !nowFav; render(true); return; }
  }, true);

  const css = document.createElement("style");
  css.textContent = "a.oth{text-decoration:none;color:inherit;box-sizing:border-box;display:block}.when{font-style:normal;font-weight:700;color:var(--accent)}.checkrow span{font-size:12px}";
  document.head.appendChild(css);
  setInterval(() => { if (route().p === "now" && !openId && !venueOpen && !genreOpen) render(true); }, 30000);
  render();
})();
