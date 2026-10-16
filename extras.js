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
  /* The Official Unofficial: gratis dagprogramma op vrijdag en zaterdag (12:00–16:00) */
  const isOO = a => !!a && (a.day === "v" || a.day === "z") && !a.after && mins(a.start) < 960;
  const OO_NAME = "The Official Unofficial";
  const ooFree = () => L("Gratis", "Free");
  let ooOnly = false;
  const tagX = a => [a.country ? codes(a.country) : "", shown(a)[0] ? cap(shown(a)[0]) : ""].filter(Boolean).join(" · ");

  /* ---- tijd: "nu" klopt ook na middernacht en in de lokale tijdzone. Test met  ?now=2026-10-22T21:15  ---- */
  const getNow = () => { let d = null; try { const p = new URLSearchParams(location.search).get("now"); if (p) d = new Date(p); } catch (e) {} return d && !isNaN(d) ? d : new Date(); };
  const ymd = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  function festNow() { const n = getNow(); let m = n.getHours() * 60 + n.getMinutes(), ds = ymd(n); if (m < 360) { ds = ymd(new Date(n.getTime() - 864e5)); m += 1440; } return { ds, m }; }
  const isLive = a => { const f = festNow(); return dayOf(a.day).date === f.ds && mins(a.start) <= f.m && mins(a.end) > f.m; };

  /* =====================  v2: alle uitbreidingen  ===================== */
  const LS = { get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  const decorate = a => { const d = SITE[norm(a.name)]; a.country = d ? d.cc : undefined; a.genres = d ? d.g : (a.genre ? [a.genre.toLowerCase()] : []); };

  /* ---- taal NL/EN ---- */
  let lang = localStorage.getItem("lotd-lang") || ((navigator.language || "nl").toLowerCase().startsWith("nl") ? "nl" : "en");
  window.LOTD_LANG = lang; document.documentElement.lang = lang;
  const L = (nl, en) => lang === "en" ? en : nl;

  /* ---- afterparties (bron: leftofthedial.nl/extras/after-parties): starten direct na de laatste band; eindtijd is niet gepubliceerd ---- */
  const AFTER_DEF = [{ name: "DIY DJ Party", venue: "Rotown", day: "d" }, { name: "Sticker Night with Kiss all Hipsters", venue: "Rotown", day: "v" }, { name: "Surprise DJ Team", venue: "Rotown", day: "z" }, { name: "Closing Party", venue: "Uniek", day: "z" }];
  const AFTER_URL = "https://leftofthedial.nl/extras/after-parties/", AFTER_LEN = 90;
  const hhmm = m => { m = ((m % 1440) + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"); };
  function addAfter(defs) {
    for (let i = ACTS.length - 1; i >= 0; i--) if (ACTS[i].after) ACTS.splice(i, 1);
    (defs && defs.length ? defs : AFTER_DEF).forEach(d => {
      const v = VENUES.find(x => x.name === d.venue); if (!v) return;
      const last = Math.max(0, ...ACTS.filter(a => a.venueId === v.id && a.day === d.day).map(a => mins(a.end))); if (!d.start && !last) return;
      const st = d.start ? mins(d.start) : last, en = d.end ? mins(d.end) : st + AFTER_LEN;
      const a = { id: "afterparty-" + uslug(d.name) + "-" + d.day, name: d.name, venueId: v.id, day: d.day, start: hhmm(st), end: hhmm(en), genre: "Afterparty", after: true, endUnknown: !d.end };
      a.country = undefined; a.genres = ["afterparty"]; ACTS.push(a);
    });
  }
  const timeTxt = a => a.endUnknown ? L("vanaf ", "from ") + a.start : a.start + "–" + a.end;
  addAfter();
  const D = { "Nederland": "Netherlands", "Verenigd Koninkrijk": "United Kingdom", "Verenigde Staten": "United States", "Ierland": "Ireland", "Japan": "Japan", "Noorwegen": "Norway", "Denemarken": "Denmark", "Oostenrijk": "Austria", "Australië": "Australia", "België": "Belgium", "Frankrijk": "France", "Duitsland": "Germany", "Zweden": "Sweden", "Nieuw-Zeeland": "New Zealand", "Zuid-Afrika": "South Africa", "Nu": "Now", "Zoeken": "Search", "Favorieten": "Favorites", "Nu & straks": "Now & next", "Zoek act, locatie, genre of land…": "Search act, venue, genre or country…", "♡ Alleen favorieten": "♡ Favorites only", "Gedeelde lijst": "Shared list", "Locaties": "Venues", "Geen favorieten op deze dag.": "No favorites on this day.", "Nog geen favorieten.": "No favorites yet.", "Tik op het hartje bij een act om hem hier te zien.": "Tap the heart on an act to see it here.", "Geen acts met dit genre op deze dag.": "No acts with this genre on this day.", "Geen acts.": "No acts.", "Typ een act, locatie, genre of land.": "Type an act, venue, genre or country.", "Het festival begint op woensdag 21 oktober.": "The festival starts on Wednesday 21 October.", "Het festival is voorbij. Bedankt voor het meekijken!": "The festival is over. Thanks for following along!", "Naar de timetable": "Go to the timetable", "Meer info op leftofthedial.nl ↗": "More info on leftofthedial.nl ↗", "♥ In favorieten": "♥ In favorites", "♡ Toevoegen aan favorieten": "♡ Add to favorites", "Ook te zien": "Also playing", "Deel mijn favorieten": "Share my favorites", "Link gekopieerd": "Link copied", "Favorieten van een vriend": "A friend's favorites", "Bekijk": "View", "Toevoegen aan mijn favorieten": "Add to my favorites", "Kies welke locaties je in het tijdschema wilt zien.": "Choose which venues to show in the schedule.", "Alles": "All", "Geen": "None", "Toon alleen acts met een van deze genres.": "Only show acts with one of these genres.", "Wis filter": "Clear filter", "Klaar": "Done", "Het is even rustig. Niets in de komende 2 uur.": "Quiet for now. Nothing in the next 2 hours.", "Het is even rustig bij je favorieten. Niets in de komende 2 uur.": "Quiet for now. None of your favorites in the next 2 hours.", "Sluiten": "Close", "Favoriet": "Favorite", "Kies een festivaldag": "Choose a festival day", "Vergelijk met mijn lijst": "Compare with my list" };
  const PT = [[/^Locaties(.*)$/, "Venues$1"], [/^Nu bezig \((\d+)\)$/, "Playing now ($1)"], [/^Begint binnen een uur \((\d+)\)$/, "Starting within an hour ($1)"], [/^Daarna, binnen 2 uur \((\d+)\)$/, "Then, within 2 hours ($1)"], [/^nog (\d+) min$/, "$1 min left"], [/^over (\d+) min$/, "in $1 min"], [/^Niets gevonden voor “(.*)”\.$/, "Nothing found for “$1”."], [/^⚠ Overlapt met (.*)$/, (m, x) => "⚠ Overlaps with " + x.replace(/\) en /g, ") and ")], [/^Vriend(.*)$/, "Friend$1"], [/^(.* · )(Nederland|Verenigd Koninkrijk|Verenigde Staten|Ierland|Noorwegen|Denemarken|Oostenrijk|Australië|België|Frankrijk|Duitsland|Zweden|Nieuw-Zeeland|Zuid-Afrika)((?: \/ [^·]+)?)$/, (m, a, c, r) => a + D[c] + r.replace(/ \/ ([^ ]+(?: [^ ]+)*)/g, (mm, x) => " / " + (D[x] || x))]];
  const t = s => lang === "en" && D[s] !== undefined ? D[s] : s;
  function trNode(root) {
    if (lang !== "en" || !root) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), list = []; let n; while ((n = w.nextNode())) list.push(n);
    list.forEach(n => { const v = n.nodeValue.trim(); if (!v) return; let o = D[v]; if (o === undefined) for (const [re, rep] of PT) if (re.test(v)) { o = v.replace(re, rep); break; } if (o !== undefined) n.nodeValue = n.nodeValue.replace(v, o); });
    root.querySelectorAll("[placeholder],[aria-label]").forEach(e => ["placeholder", "aria-label"].forEach(a => { const v = e.getAttribute(a); if (v && D[v] !== undefined) e.setAttribute(a, D[v]); }));
  }
  const DL = { nl: ["Wo 21", "Do 22", "Vr 23", "Za 24"], en: ["Wed 21", "Thu 22", "Fri 23", "Sat 24"] };
  const setDays = () => DAYS.forEach((d, i) => { d.label = DL[lang][i]; }); setDays();

  /* ---- persistente extra's: ★ moet-ik-zien, vriendenlijst, tekstgrootte ---- */
  let stars = LS.get("lotd-stars", []).filter(id => isFav(id)), friend = LS.get("lotd-friend", { ids: [], on: true }), big = localStorage.getItem("lotd-big") === "1";
  if (!friend || !Array.isArray(friend.ids)) friend = { ids: [], on: true };
  document.documentElement.classList.toggle("big", big);
  const isStar = id => stars.includes(id), isFriend = id => friend.on && friend.ids.includes(id), saveStars = () => LS.set("lotd-stars", stars), saveFriend = () => LS.set("lotd-friend", friend);
  /* LOTD-iconen: rondje = logo. Vol = moet ik zien, linker helft gevuld ("left of the dial") = interessant, ring = niet gekozen */
  const dial = (k, sz = 24, on = true) => `<svg class="ico" width="${sz}" height="${sz}" viewBox="0 0 24 24" aria-hidden="true" fill="${on ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="${k === "must" ? "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" : "M7 10v11H3V10h4zm0 0l4.2-7.1c1-.3 2 .1 2.4 1l.4 1.5L13 10h6.2c1.2 0 2.1 1.1 1.9 2.3l-1.2 7c-.2 1-1 1.7-2 1.7H7"}"/></svg>`;
  const sv = (p, sz = 22) => `<svg class="ico2" width="${sz}" height="${sz}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const SI = { warn: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>', heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', ext: '<path d="M7 17 17 7M8 7h9v9"/>', down: '<path d="m6 9 6 6 6-6"/>', foot: '<path d="M4 16v-2.4C4 11.5 2.97 10.5 3 8c.03-2.7 1.5-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0zM20 20v-2.4c0-2.1 1.03-3.1 1-5.6-.03-2.7-1.5-6-4.5-6-1.87 0-2.5 1.8-2.5 3.5 0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0z"/>', radio: '<circle cx="12" cy="12" r="2"/><path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4M19.1 4.9a10 10 0 0 1 0 14.1M4.9 19.1a10 10 0 0 1 0-14.1"/>', pin: '<path d="M12 22s7-6.2 7-12A7 7 0 0 0 5 10c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>', walk: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>', acc: '<circle cx="12" cy="4.5" r="2"/><path d="M5 9l7 1 7-1M12 10v5l-3 6M12 15l3 6"/>', cal: '<rect x="3" y="5" width="18" height="16"/><path d="M3 10h18M8 3v4M16 3v4"/>' };
  const mark = id => isStar(id) ? dial("must", 14) : isFav(id) ? dial("int", 14) : "";
  toggleFav = function (id) { const was = isFav(id); favs = was ? favs.filter(x => x !== id) : [...favs, id]; saveFavs(); if (was && stars.includes(id)) { stars = stars.filter(x => x !== id); saveStars(); } render(true); };
  const clashes = a => a.cancelled ? [] : getClashes(a).filter(c => !c.act.cancelled);
  const clashLine = a => { const c = clashes(a); return c.length ? "⚠ Overlapt met " + c.map(x => `${x.act.name} (${x.minutes} min)`).join(", ").replace(/, ([^,]*)$/, " en $1") : ""; };
  const starHint = a => { const c = clashes(a); if (!c.length || !isFav(a.id)) return ""; if (isStar(a.id) && c.some(x => !isStar(x.act.id))) return L("♥ Dit is jouw ‘moet ik zien’.", "♥ This is your must-see."); const s = c.find(x => isStar(x.act.id)); return !isStar(a.id) && s ? L(`Botst met ♥ ${s.act.name} (moet je zien).`, `Clashes with ♥ ${s.act.name} (must-see).`) : ""; };

  /* ---- toegankelijkheid (bron: leftofthedial.nl/venues) ---- */
  const ACC = [["Annabel Down", 1, "", ""], ["Annabel Up", 0, "trappen", "stairs"], ["Arminius", 1, "via lift", "via elevator"], ["Baanhof", 0, "trappen", "stairs"], ["Barrio", 0, "trapjes", "small steps"], ["Bird", 1, "via rijplaat, rolstoeltoilet aanwezig", "via ramp, accessible toilet"], ["De Doelen", 1, "lift, rolstoeltoilet", "elevator, accessible toilet"], ["Mono", 1, "geen rolstoeltoilet (dichtstbij: Bird)", "no accessible toilet (nearest: Bird)"], ["Paradijskerk", 1, "rolstoellift, rolstoeltoilet", "wheelchair lift, accessible toilet"], ["Reijngoud", 1, "geen rolstoeltoilet (dichtstbij: Bird)", "no accessible toilet (nearest: Bird)"], ["Remastered", 1, "rolstoeltoilet aanwezig", "accessible toilet"], ["Rotown", 1, "gelijkvloers, rolstoeltoilet", "level access, accessible toilet"], ["Sahara", 0, "trappen", "stairs"], ["Salsability", 1, "via de vooringang, rolstoeltoilet", "via front entrance, accessible toilet"], ["Stalles", 0, "trappen", "stairs"], ["TR ", 1, "alle zalen, lift naar de grote zaal", "all rooms, elevator to the main hall"], ["Uniek", 0, "trappen", "stairs"], ["V11", 0, "trappen", "stairs"], ["V2_", 1, "oprijplaat, vraag het personeel; geen rolstoeltoilet (dichtstbij: Worm)", "ramp, ask staff; no accessible toilet (nearest: Worm)"], ["Waalse Kerk", 1, "oprijplaat, vraag het personeel; geen rolstoeltoilet (dichtstbij: Worm)", "ramp, ask staff; no accessible toilet (nearest: Worm)"], ["Worm", 1, "lift, rolstoeltoilet", "elevator, accessible toilet"]];
  const accLine = n => { const r = ACC.find(x => n.startsWith(x[0])); if (!r) return ""; const note = L(r[2], r[3]); return "♿ " + (r[1] ? L("Rolstoeltoegankelijk", "Wheelchair accessible") : L("Niet rolstoeltoegankelijk", "Not wheelchair accessible")) + (note ? " · " + note : ""); };

  /* ---- loopafstand (alleen als lineup.json "coords" bevat) ---- */
  const DEF_COORDS = {"Annabel": [51.92536, 4.47601], "Arminius": [51.91494, 4.47371], "Baanhof": [51.91282, 4.48025], "Bird": [51.92671, 4.47881], "Barrio": [51.9256, 4.478], "De Doelen": [51.92182, 4.47329], "Mono": [51.92858, 4.47827], "Paradijskerk": [51.9169, 4.4725], "Reijngoud": [51.9285, 4.47811], "Remastered": [51.91051, 4.4828], "Rotown": [51.91694, 4.47167], "Plato": [51.91703, 4.47208], "Sahara": [51.92525, 4.4759], "Salsability": [51.9246, 4.4779], "Stalles": [51.91712, 4.47203], "TR": [51.91998, 4.4741], "Uniek": [51.9187, 4.47], "V11": [51.91717, 4.48452], "V2_": [51.9145, 4.4707], "Waalse Kerk": [51.91384, 4.47991], "Worm": [51.915, 4.47]}, ADDR = {"Time is the New Space": "Schiekade 185", "Tramhuis": "Hermesplantsoen 3", "Zondebok en Zwarte Schaap": "Witte de Withstraat 96", "Annabel": "Schiestraat 20", "Arminius": "Museumpark 3", "Baanhof": "Baan 159", "Bird": "Raampoortstraat 24-28", "Barrio": "Teilingerstraat 19B", "De Doelen": "Schouwburgplein 50", "Mono": "Vijverhofstraat 15", "Paradijskerk": "Nieuwe Binnenweg 25", "Reijngoud": "Vijverhofstraat 10", "Remastered": "Willemsplein 79", "Rotown": "Nieuwe Binnenweg 19", "Plato": "Nieuwe Binnenweg 13b", "Sahara": "Schiestraat 18", "Salsability": "Delftsestraat 9", "Stalles": "Nieuwe Binnenweg 11A", "TR": "Schouwburgplein 25", "Uniek": "Mauritsweg 34", "V11": "Wijnhaven t/o 101", "V2_": "Eendrachtsstraat 10", "Waalse Kerk": "Pierre Baylestraat 1", "Worm": "Boomgaardsstraat 71"};
  let cached = LS.get("lotd-lineup", null), coords = Object.assign({}, DEF_COORDS, (cached && cached.coords) || {});
  const baseName = n => n.replace(/ (Up|Down|WBH|Foyer|1|2)( & (Up|Down|2))?$/, "");
  const coordOf = n => coords[n] || coords[baseName(n)];
  const addrOf = n => ADDR[n] || ADDR[baseName(n)] || "";
  /* ---- coördinaten controleren via adres (eenmalig per toestel, daarna bewaard) ---- */
  const GEOQ = {"Annabel": "Schiestraat 20, 3013 AH Rotterdam", "Arminius": "Museumpark 3, 3015 CB Rotterdam", "Baanhof": "Baan 159, 3011 CA Rotterdam", "Bird": "Raampoortstraat 24, 3032 AH Rotterdam", "Barrio": "Teilingerstraat 19B, 3032 AN Rotterdam", "De Doelen": "Schouwburgplein 50, 3012 CL Rotterdam", "Mono": "Vijverhofstraat 15, 3032 SB Rotterdam", "Paradijskerk": "Nieuwe Binnenweg 25, 3014 GB Rotterdam", "Reijngoud": "Vijverhofstraat 10, 3032 SN Rotterdam", "Remastered": "Willemsplein 79, 3016 DR Rotterdam", "Rotown": "Nieuwe Binnenweg 19, 3014 GB Rotterdam", "Plato": "Nieuwe Binnenweg 13, Rotterdam", "Sahara": "Schiestraat 18, 3013 AH Rotterdam", "Salsability": "Delftsestraat 9A, 3013 AB Rotterdam", "Stalles": "Nieuwe Binnenweg 11A, 3014 GA Rotterdam", "TR": "Schouwburgplein 25, 3012 CL Rotterdam", "Uniek": "Mauritsweg 34, 3012 JR Rotterdam", "V11": "Wijnhaven 101, 3011 WN Rotterdam", "V2_": "Eendrachtsstraat 10, 3012 XL Rotterdam", "Waalse Kerk": "Pierre Baylestraat 1, 3011 BH Rotterdam", "Worm": "Boomgaardsstraat 71, 3012 BN Rotterdam", "Time is the New Space": "Schiekade 185, 3013 BR Rotterdam", "Tramhuis": "Hermesplantsoen 3, 3014 GW Rotterdam", "Zondebok en Zwarte Schaap": "Witte de Withstraat 96, 3012 LC Rotterdam"};
  const geoQuery = n => GEOQ[n] || (ADDR[n] + ", Rotterdam");
  const DEF_MANUAL = () => { const o = {}; Object.keys(MANUAL).forEach(n => { o[n] = DEF_COORDS[n]; }); return o; };
  const MANUAL = { "Stalles": 1 }; /* handmatig gecontroleerde posities in DEF_COORDS: niet opzoeken */
  const GEO_V = 3;
  let geoStore = LS.get("lotd-geo3", null); if (!geoStore || geoStore.v !== GEO_V) geoStore = { v: GEO_V, c: {} };
  const applyGeo = () => { Object.keys(geoStore.c).forEach(n => { if (!MANUAL[n]) coords[n] = geoStore.c[n]; }); };
  applyGeo();
  (function geoAll() {
    if (!navigator.onLine) return;
    const todo = Object.keys(ADDR).filter(n => !MANUAL[n] && (!geoStore.c[n] || geoStore.q && geoStore.q[n] !== geoQuery(n))); if (!todo.length) return;
    geoStore.q = geoStore.q || {}; let k = 0, got = 0;
    const next = () => {
      if (k >= todo.length) { if (got) { LS.set("lotd-geo3", geoStore); if (route().p === "map") render(true); } return; }
      const n = todo[k++];
      fetch("https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=nl&bounded=1&viewbox=4.38,51.98,4.58,51.86&q=" + encodeURIComponent(geoQuery(n)), { headers: { Accept: "application/json" } })
        .then(r => r.json()).then(j => { if (j && j[0]) { const c = [+(+j[0].lat).toFixed(5), +(+j[0].lon).toFixed(5)]; if (c[0] > 51.86 && c[0] < 51.98 && c[1] > 4.38 && c[1] < 4.58) { geoStore.c[n] = c; geoStore.q[n] = geoQuery(n); coords[n] = c; got++; LS.set("lotd-geo3", geoStore); } } }).catch(() => {}).then(() => setTimeout(next, 1100));
    };
    setTimeout(next, 1500);
  })();
  const distM = (p, q) => { const R = 6371000, r = Math.PI / 180, dl = (q[0] - p[0]) * r, dg = (q[1] - p[1]) * r, h = Math.sin(dl / 2) ** 2 + Math.cos(p[0] * r) * Math.cos(q[0] * r) * Math.sin(dg / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
  const routeUrl = c => "https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=" + c[0] + "," + c[1];
  const walk = (a, b) => { const p = coordOf(venue(a.venueId).name), q2 = coordOf(venue(b.venueId).name); if (!p || !q2) return null; if (a.venueId === b.venueId) return 1; const R = 6371000, r = Math.PI / 180, dl = (q2[0] - p[0]) * r, dg = (q2[1] - p[1]) * r, h = Math.sin(dl / 2) ** 2 + Math.cos(p[0] * r) * Math.cos(q2[0] * r) * Math.sin(dg / 2) ** 2; return Math.max(1, Math.ceil(2 * R * Math.asin(Math.sqrt(h)) * 1.3 / 80)); };
  const nextLine = a => {
    if (!isFav(a.id) || a.cancelled) return ""; const e = mins(a.end);
    const n = ACTS.filter(x => x.id !== a.id && isFav(x.id) && !x.cancelled && x.day === a.day && mins(x.start) >= e).sort((x, y) => mins(x.start) - mins(y.start))[0]; if (!n) return "";
    const w = walk(a, n); if (w == null) return ""; const rest = mins(n.start) - e - w;
    return L(`Daarna: ${n.name} (${n.start}) · ${w} min lopen · ${rest >= 5 ? "ruim op tijd" : rest >= 0 ? "net op tijd" : "je mist ca. " + (-rest) + " min"}`, `Next: ${n.name} (${n.start}) · ${w} min walk · ${rest >= 5 ? "plenty of time" : rest >= 0 ? "just in time" : "you'll miss ~" + (-rest) + " min"}`);
  };

  /* ---- agenda-export (.ics) ---- */
  const icsDate = (a, tm) => { const [y, mo, d] = dayOf(a.day).date.split("-").map(Number), m = mins(tm); let h = Math.floor(m / 60), mi = m % 60, dd = d; if (h >= 24) { h -= 24; dd += 1; } return new Date(Date.UTC(y, mo - 1, dd, h - 2, mi)); }; // festival = CEST (UTC+2)
  const zt = d => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const esc2 = s => String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  const foldIcs = l => l.length > 73 ? l.match(/.{1,73}/g).join("\r\n ") : l;
  function download(name, text, type) { const u = URL.createObjectURL(new Blob([text], { type })), a = document.createElement("a"); a.href = u; a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { a.remove(); URL.revokeObjectURL(u); }, 1500); }
  function exportIcs(list, fname) {
    const st = zt(new Date()), out = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//LOTD 2026 Timetable//NL", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "X-WR-CALNAME:Left of the Dial 2026"];
    list.filter(a => !a.cancelled).forEach(a => { const v = venue(a.venueId), u = siteUrl(a); out.push("BEGIN:VEVENT", "UID:" + a.id + "@lotd-2026", "DTSTAMP:" + st, "DTSTART:" + zt(icsDate(a, a.start)), "DTEND:" + zt(icsDate(a, a.end)), "SUMMARY:" + esc2(a.name), "LOCATION:" + esc2(v.name + ", Rotterdam"), "DESCRIPTION:" + esc2([shown(a).map(cap).join(", "), u].filter(Boolean).join("\n")), "END:VEVENT"); });
    out.push("END:VCALENDAR"); download(fname, out.map(foldIcs).join("\r\n"), "text/calendar;charset=utf-8");
  }

  /* ---- statusbalk (offline, updates, mededelingen, installeer-tip) ---- */
  const bar = document.createElement("div"); bar.id = "lotd-status"; bar.setAttribute("role", "status"); document.body.appendChild(bar);
  const S = {}, PRIO = { update: 5, changes: 4, notice: 3, offline: 2, install: 1, saved: 0 };
  const post = (k, p) => { S[k] = p; paintStatus(); }, drop = k => { delete S[k]; paintStatus(); };
  function paintStatus() {
    const k = Object.keys(S).sort((a, b) => PRIO[b] - PRIO[a])[0];
    { const off = document.getElementById("tb-off"); if (off) off.hidden = navigator.onLine !== false; }
    if (!k) { bar.className = ""; bar.innerHTML = ""; return; }
    const p = S[k]; bar.className = "on" + (k === "offline" ? " off" : ""); clearTimeout(paintStatus.t); if (k === "offline" || k === "install" || k === "saved") paintStatus.t = setTimeout(() => { if (k === "install") LS.set("lotd-install-x", true); drop(k); }, k === "install" ? 12000 : 6000);
    const off = document.getElementById("tb-off"); if (off) off.hidden = navigator.onLine !== false;
    bar.innerHTML = `<span>${p.text()}${k !== "offline" && navigator.onLine === false ? " · Offline" : ""}</span>${p.btn ? `<button data-st-act="${k}">${p.btn()}</button>` : ""}${p.x ? `<button class="sx" data-st-x="${k}" aria-label="Sluiten">✕</button>` : ""}`; trNode(bar);
  }
  const ctl = document.createElement("div"); ctl.id = "lotd-ctl"; ctl.innerHTML = `<button data-lang="nl">NL</button><button data-lang="en">EN</button><button data-aa aria-label="Tekstgrootte / Text size">Aa</button>`; { const h2 = document.getElementById("title"), bar = document.createElement("div"); bar.className = "titlebar"; h2.parentNode.insertBefore(bar, h2);
    const lg = document.querySelector(".brandbar .lotd-mark"), home = document.createElement("button"); home.className = "tb-logo"; home.setAttribute("data-go", "/"); home.setAttribute("aria-label", "Timetable"); if (lg) home.appendChild(lg.cloneNode(true));
    const tools = document.createElement("div"); tools.className = "tb-tools";
    tools.innerHTML = `<span class="tb-off" id="tb-off" hidden>Offline</span><button class="tb-btn" data-go="/search" data-tb-search aria-label="Zoeken"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg></button><button class="tb-btn" data-menu aria-label="Menu"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2.2"/><circle cx="12" cy="12" r="2.2"/><circle cx="19" cy="12" r="2.2"/></svg></button>`;
    const tw = document.createElement("div"); tw.className = "tb-title"; tw.appendChild(h2); const sub = document.createElement("div"); sub.className = "tb-sub"; sub.id = "tb-sub"; sub.setAttribute("aria-live", "off"); tw.appendChild(sub);
    bar.appendChild(home); bar.appendChild(tw); bar.appendChild(tools); }
  function paintTicker() {
    const t = document.getElementById("lotd-ticker"); if (!t) return;
    const sep = "<b>\u2733</b>", one = ["LEFT OF THE DIAL 2026", L("21 / 22 / 23 / 24 OKTOBER", "21 / 22 / 23 / 24 OCTOBER"), "ROTTERDAM", "SOLD OUT", "SEE YOU DOWN THE FRONT"].map(x => `${x}${sep}`).join("");
    t.innerHTML = `<div class="lt-track"><span>${one}${one}</span><span>${one}${one}</span></div>`;
  }
  /* aftellen tot het festival / live-teller tijdens het festival */
  const nowOffset = getNow().getTime() - Date.now();
  const atLocal = (ds, hm) => { const [h, m] = hm.split(":").map(Number); const d = new Date(ds + "T00:00:00"); d.setMinutes(h * 60 + m + (h < 6 ? 1440 : 0)); return d; };
  function paintSub() {
    const el = document.getElementById("tb-sub"); if (!el) return;
    const first = ACTS.filter(a => a.day === DAYS[0].id && !a.cancelled).sort(byTime)[0], lastDay = DAYS[DAYS.length - 1], lastAct = ACTS.filter(a => a.day === lastDay.id).sort((x, y) => mins(y.end) - mins(x.end))[0];
    if (!first || !lastAct) { el.textContent = ""; return; }
    const now = Date.now() + nowOffset, start = atLocal(DAYS[0].date, first.start).getTime(), end = atLocal(lastDay.date, lastAct.end).getTime();
    const p2 = n => String(n).padStart(2, "0");
    if (now < start) {
      let t = Math.floor((start - now) / 1000); const d = Math.floor(t / 86400); t -= d * 86400; const h = Math.floor(t / 3600); t -= h * 3600; const m = Math.floor(t / 60), sec = t - m * 60;
      el.innerHTML = `<span class="cd-lab">${L("Nog", "Starts in")}</span><b>${d}</b>${L("d", "d")} <b>${p2(h)}</b>${L("u", "h")} <b>${p2(m)}</b>m <b>${p2(sec)}</b>s`; el.className = "tb-sub cd";
      el.setAttribute("aria-label", L(`Nog ${d} dagen, ${h} uur en ${m} minuten tot het festival`, `${d} days, ${h} hours and ${m} minutes until the festival`));
    } else if (now <= end) {
      const live = ACTS.filter(a => !a.cancelled && isLive(a)).length, f = festNow(), d = DAYS.find(x => x.date === f.ds);
      const nxt = d ? ACTS.filter(a => a.day === d.id && !a.cancelled && mins(a.start) > f.m).sort(byTime)[0] : null;
      el.className = "tb-sub is-live"; el.removeAttribute("aria-label");
      el.innerHTML = live ? `<i class="live-dot"></i>${d ? d.label + " · " : ""}${L(`${live} ${live === 1 ? "band" : "bands"} live`, `${live} ${live === 1 ? "band" : "bands"} live`)}` : nxt ? `${d.label} · ${L("eerstvolgende om", "next at")} ${nxt.start}` : (() => { const nd = DAYS[DAYS.findIndex(x => d && x.id === d.id) + 1], fa = nd && ACTS.filter(a => a.day === nd.id && !a.cancelled).sort(byTime)[0]; return fa ? `${nd.label} · ${L("vanaf", "from")} ${fa.start}` : L("Tot morgen!", "See you tomorrow!"); })();
    } else { el.className = "tb-sub"; el.textContent = L("Tot volgend jaar!", "See you next year!"); }
  }
  setInterval(paintSub, 1000); setTimeout(paintSub, 0);
  /* lopende balk bovenaan (vervangt de stilstaande header:before) */
  { const hd = document.querySelector("header"), t = document.createElement("div"); t.className = "lotd-ticker"; t.setAttribute("aria-hidden", "true");
    t.id = "lotd-ticker"; if (hd) hd.prepend(t); paintTicker(); }
  const paintCtl = () => { ctl.querySelectorAll("[data-lang]").forEach(b => b.classList.toggle("on", b.dataset.lang === lang)); ctl.querySelector("[data-aa]").classList.toggle("on", big); };
  function setLang(l) { setTimeout(() => { paintSub(); paintTicker(); }, 0); lang = l; window.LOTD_LANG = l; localStorage.setItem("lotd-lang", l); document.documentElement.lang = l; setDays(); paintCtl(); paintStatus(); render(true); }

  /* ---- menu (taal, tekstgrootte, installeren, delen) ---- */
  const menuHtml = () => {
    const inst = standaloneApp() ? "" : `<button class="mn-row" data-install>${L("Installeer de app", "Install the app")}<small>${iosDevice() ? L("Tik hier voor de stappen", "Tap for the steps") : L("Snel openen vanaf je beginscherm, ook offline", "Open from your home screen, also offline")}</small></button>`;
    return `<div data-menusheet><h2>Menu</h2>
      <div class="mn-lab">${L("Taal", "Language")}</div><div class="mn-seg"><button class="${lang === "nl" ? "on" : ""}" data-lang="nl" aria-pressed="${lang === "nl"}">Nederlands</button><button class="${lang === "en" ? "on" : ""}" data-lang="en" aria-pressed="${lang === "en"}">English</button></div>
      <div class="mn-lab">${L("Tekstgrootte", "Text size")}</div><div class="mn-seg"><button class="${big ? "" : "on"}" data-aa-set="0" aria-pressed="${!big}">${L("Normaal", "Normal")}</button><button class="${big ? "on" : ""} mn-big" data-aa-set="1" aria-pressed="${big}">${L("Groot", "Large")}</button></div>
      <div class="mn-list">${inst}<button class="mn-row" data-share-app>${L("Deel deze app", "Share this app")}<small>lotd.gijsbitter.nl</small></button><a class="mn-row" href="https://leftofthedial.nl" target="_blank" rel="noopener">leftofthedial.nl ↗<small>${L("Tickets, nieuws en meer", "Tickets, news and more")}</small></a></div>
      <p class="mn-meta">${navigator.onLine === false ? L("Offline · ", "Offline · ") : ""}${L("Tijden bijgewerkt: ", "Times updated: ")}${fmtDate()}</p></div>`;
  };
  const standaloneApp = () => navigator.standalone || matchMedia("(display-mode: standalone)").matches;
  const iosDevice = () => (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) && !window.MSStream;
  /* uitleg installeren op iPhone/iPad: Safari, Chrome/andere browsers, of een in-app browser (Instagram, Facebook, Gmail…) */
  const SHARE_ICO = `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" style="vertical-align:-4px"><path d="M12 3v12M7.5 7.5 12 3l4.5 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 10H6.5A1.5 1.5 0 0 0 5 11.5v8A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 17.5 10H16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
  function iosInstallSheet() {
    const ua = navigator.userAgent, inApp = /FBAN|FBAV|Instagram|Line\/|LinkedInApp|GSA\/|Snapchat|TikTok|Twitter|musical_ly/.test(ua), other = /CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/.test(ua);
    const url = location.origin + location.pathname;
    if (inApp) return `<h2>${L("Installeer de app", "Install the app")}</h2><p>${L("Je bekijkt de timetable nu in de browser van een andere app. Daar kun je hem niet op je beginscherm zetten.", "You're viewing the timetable inside another app's browser. You can't add it to your home screen from there.")}</p>
      <ol class="inst-steps"><li>${L("Tik op ••• of het kompas en kies <b>Open in Safari</b>.", "Tap ••• or the compass and choose <b>Open in Safari</b>.")}</li><li>${L("Of kopieer de link en plak hem in Safari:", "Or copy the link and paste it into Safari:")} <b>${esc(url.replace(/^https?:\/\//, ""))}</b></li><li>${L("Volg daar de stappen onder <b>Installeer de app</b> in het menu.", "Then follow the steps under <b>Install the app</b> in the menu.")}</li></ol>`;
    const steps = other
      ? [L(`Tik op de deelknop ${SHARE_ICO} rechts in de adresbalk.`, `Tap the share button ${SHARE_ICO} on the right of the address bar.`)]
      : [L(`Tik onderin op ${SHARE_ICO} <b>Deel</b>. Zie je die niet? Tik dan eerst op <b>•••</b> rechtsonder.`, `Tap ${SHARE_ICO} <b>Share</b> at the bottom. Don't see it? Tap <b>•••</b> bottom right first.`)];
    steps.push(L("Scroll omlaag en kies <b>Zet op beginscherm</b>. Staat het er niet? Tik op <b>Meer</b> of <b>Wijzig taken</b>.", "Scroll down and choose <b>Add to Home Screen</b>. Not there? Tap <b>More</b> or <b>Edit Actions</b>."));
    steps.push(L("Laat <b>Open als webapp</b> aan staan en tik op <b>Voeg toe</b>.", "Keep <b>Open as Web App</b> switched on and tap <b>Add</b>."));
    return `<h2>${L("Installeer de app", "Install the app")}</h2><p>${L("Zet de timetable op je beginscherm: hij opent dan als losse app, zonder adresbalk, en werkt ook offline.", "Put the timetable on your home screen: it opens as a separate app, without the address bar, and also works offline.")}</p>
      <ol class="inst-steps">${steps.map(x => `<li>${x}</li>`).join("")}</ol><p class="inst-note">${L("Werkt het niet? Kijk of privé-surfen uit staat en of je iOS up-to-date is.", "Not working? Check that private browsing is off and iOS is up to date.")}</p>`;
  }
  const openMenu = () => { sheet = menuHtml(); renderModal(); };
  const refreshMenu = () => { if (sheet && sheet.indexOf("data-menusheet") > -1) { sheet = menuHtml(); renderModal(); } };

  /* ---- offline-indicator ---- */
  let meta = { updated: (cached && cached.updated) || "2026-09-27T12:00:00" };
  const fmtDate = () => { try { return new Date(meta.updated).toLocaleString(lang === "en" ? "en-GB" : "nl-NL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }); } catch (e) { return ""; } };
  const updLine = () => `<div class="upd"><span>${sv(SI.heart, 13)}${favs.length} ${L("op je programma", "in your plan")}</span><span>${L("Tijden bijgewerkt: ", "Times updated: ")}${fmtDate()}</span></div><footer class="lotd-foot"><span>SEE YOU DOWN THE FRONT.</span><a href="https://leftofthedial.nl" target="_blank" rel="noopener">${L("Festivalwebsite", "Festival website")} ↗</a></footer>`;
  const netState = () => navigator.onLine === false ? post("offline", { text: () => L("Offline · je ziet de laatst opgeslagen tijden", "Offline · showing the last saved times") + " (" + fmtDate() + ")" }) : drop("offline");

  /* ---- live updates via lineup.json ---- */
  function buildActs(lines) {
    const out = [];
    lines.forEach(l => { const [vn, d, r] = l.split("|"); if (!r) return; let v = VENUES.find(x => x.name === vn); if (!v) { v = { id: "v" + VENUES.length, name: vn }; VENUES.push(v); v.color = "hsl(" + Math.round((VENUES.length - 1) * 137.5) % 360 + " 45% 38%)"; }
      r.split(";").forEach(tt => { const m = tt.trim().match(/^(\d\d)(\d\d)-(\d\d)(\d\d) (.+)$/); if (!m) return; const name = m[5]; out.push({ id: `${slug(name)}-${slug(vn)}-${d}-${m[1]}${m[2]}`, name, venueId: v.id, day: d, start: m[1] + ":" + m[2], end: m[3] + ":" + m[4], genre: /Workshop|Crash Course/.test(name) ? "Extra" : "" }); }); });
    return out;
  }
  let sheet = null;
  function applyLineup(j, silent) {
    const oldById = new Map(ACTS.map(a => [a.id, { ...a, vn: venue(a.venueId).name }])), sigOld = ACTS.map(a => a.id + a.end + (a.cancelled ? "x" : "")).join();
    const favBefore = silent ? LS.get("lotd-favs", []) : favs.slice(), canc = (j.cancelled || []).map(c => c.split("|"));
    const fresh = buildActs(j.raw); fresh.forEach(a => { decorate(a); a.cancelled = canc.some(([n, dd]) => norm(n) === norm(a.name) && (!dd || dd === a.day)); });
    ACTS.length = 0; fresh.forEach(a => ACTS.push(a)); addAfter(j.after); if (Array.isArray(j.food_tips) && j.food_tips.length) { window.__lotdFoodTips = j.food_tips; if (window.__lotdFoodApply) window.__lotdFoodApply(); }
    const mapId = id => { if (act(id)) return id; const o = oldById.get(id); if (!o) return null; const c = ACTS.filter(a => norm(a.name) === norm(o.name) && venue(a.venueId).name === o.vn && a.day === o.day).sort((x, y) => Math.abs(mins(x.start) - mins(o.start)) - Math.abs(mins(y.start) - mins(o.start))); return c.length ? c[0].id : null; };
    const uniq = a => [...new Set(a.filter(Boolean))];
    favs = uniq(favBefore.map(mapId)); stars = uniq((silent ? LS.get("lotd-stars", []) : stars).map(mapId)).filter(isFav); friend.ids = uniq(friend.ids.map(mapId));
    hiddenVenues = LS.get("lotd-hidden-venues", []).filter(id => VENUES.some(v => v.id === id)); const sh = sharedFromHash(); if (sh) sharedIds = sh;
    saveFavs(); saveStars(); saveFriend(); coords = Object.assign({}, DEF_COORDS, geoStore.c, DEF_MANUAL(), j.coords || {});
    const ch = []; favBefore.forEach(id => { const o = oldById.get(id); if (!o) return; const nid = mapId(id), n = nid && act(nid);
      if (!n) ch.push({ o, txt: L("staat niet meer in het programma", "is no longer in the program")});
      else if (n.cancelled && !o.cancelled) ch.push({ o, txt: L("vervalt", "is cancelled")});
      else if (n.start !== o.start || n.end !== o.end || n.day !== o.day || venue(n.venueId).name !== o.vn) ch.push({ o, txt: `${dayOf(o.day).label} ${o.start}–${o.end} ${o.vn}  →  ${dayOf(n.day).label} ${n.start}–${n.end} ${venue(n.venueId).name}` }); });
    return { ch, changed: sigOld !== ACTS.map(a => a.id + a.end + (a.cancelled ? "x" : "")).join() };
  }
  function handleLineup(j) {
    if (meta.updated !== j.updated || !cached) {
      const rep = applyLineup(j, false); meta = { updated: j.updated }; cached = j; LS.set("lotd-lineup", j);
      if (rep.ch.length) { const n = rep.ch.length; post("changes", { text: () => L(`Tijden bijgewerkt · ${n} wijziging${n > 1 ? "en" : ""} in je favorieten`, `Times updated · ${n} change${n > 1 ? "s" : ""} to your favorites`), btn: () => L("Bekijk", "View"), x: true, fn: () => { sheet = `<h2>${L("Wijzigingen in je favorieten", "Changes to your favorites")}</h2>` + rep.ch.map(c => `<div class="checkrow" style="display:block"><b>${c.o.name}</b><br>${c.txt}</div>`).join(""); renderModal(); } }); }
      else if (rep.changed) { post("saved", { text: () => L("Tijden bijgewerkt", "Times updated"), x: true }); setTimeout(() => drop("saved"), 8000); }
      render(true);
    }
    coords = Object.assign({}, coords, j.coords || {});
    const text = lang === "en" && j.notice_en ? j.notice_en : j.notice, key = j.notice || "";
    if (text && LS.get("lotd-notice-x", "") !== key) post("notice", { text: () => (lang === "en" && j.notice_en ? j.notice_en : j.notice), x: true, key }); else drop("notice");
  }
  let checking = false;
  async function checkLineup() { if (checking || navigator.onLine === false) return; checking = true; try { const r = await fetch("lineup.json?x=" + Date.now(), { cache: "no-store" }); if (!r.ok) throw 0; const j = await r.json(); if (!Array.isArray(j.raw) || !j.raw.length) throw 0; handleLineup(j); } catch (e) {} checking = false; }
  if (cached && Array.isArray(cached.raw) && cached.raw.length) { try { applyLineup(cached, true); } catch (e) { cached = null; } }
  if (cached && cached.notice && LS.get("lotd-notice-x", "") !== cached.notice) post("notice", { text: () => (lang === "en" && cached.notice_en ? cached.notice_en : cached.notice), x: true, key: cached.notice });

  /* ---- installeer-tip ---- */
  const visits = (LS.get("lotd-visits", 0) || 0) + 1; LS.set("lotd-visits", visits);
  const standalone = navigator.standalone || matchMedia("(display-mode: standalone)").matches, ios = (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) && !window.MSStream;
  let deferred = null;
  if (ios && !standalone && visits >= 2 && !LS.get("lotd-install-x", false)) post("install", { text: () => L("Zet de app op je beginscherm voor snelle toegang, ook offline.", "Add the app to your home screen for quick access, also offline."), btn: () => L("Hoe?", "How?"), x: true, fn: () => { sheet = iosInstallSheet(); renderModal(); } });
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferred = e; if (visits >= 2 && !LS.get("lotd-install-x", false)) post("install", { text: () => L("Installeer de app voor snelle toegang, ook offline.", "Install the app for quick access, also offline."), btn: () => L("Installeer", "Install"), x: true, fn: () => deferred && deferred.prompt() }); });

  /* ---- persoonlijke groene markering: alleen op dit toestel, aangezet via een eigen link (#g=…). Geen bandnamen in de code. ---- */
  const gnorm = x => String(x).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
  let green = LS.get("lotd-green", null); if (!green || !Array.isArray(green.names)) green = { names: [], on: true };
  const isGreen = id => { if (!green.on || !green.names.length || !isFav(id)) return false; const a = act(id); return !!a && green.names.includes(gnorm(a.name)); };
  const gr = id => isGreen(id) ? " gr" : "";
  function applyGreen() {
    const m = location.hash.match(/^#g=([0-9A-Za-z_-]+)/); if (!m) return false;
    const codes = new Set(m[1].match(/.{3}/g) || []), names = [...new Set(ACTS.filter(a => codes.has(shareCode(a))).map(a => gnorm(a.name)))];
    if (LS.get("lotd-green-done", "") !== m[1]) {
      let add = 0, up = 0;
      for (const n of names) {
        const perf = ACTS.filter(a => gnorm(a.name) === n && !a.cancelled), mine = perf.filter(a => isFav(a.id));
        if (mine.length) mine.forEach(a => { if (!isStar(a.id)) { stars.push(a.id); up++; } });
        else perf.forEach(a => { favs.push(a.id); add++; });
      }
      favs = [...new Set(favs)]; stars = [...new Set(stars)]; saveFavs(); saveStars(); LS.set("lotd-green-done", m[1]);
      post("saved", { text: () => L(`${names.length} bands groen gemarkeerd · ${add} optredens toegevoegd · ${up} naar ‘moet ik zien’`, `${names.length} bands marked green · ${add} shows added · ${up} moved to must-see`), x: true });
    }
    green = { names: [...new Set([...green.names, ...names])], on: true }; LS.set("lotd-green", green);
    history.replaceState(null, "", location.pathname + location.search + "#/favorites"); return true;
  }
  applyGreen();
  window.addEventListener("hashchange", () => { if (applyGreen()) render(); });

  /* ---- rijen, blokken, modal ---- */
  row = function (a, extra) {
    const d = dayOf(a.day), v = venue(a.venueId), cl = clashLine(a);
    return `<div class="item${isFav(a.id) ? (isStar(a.id) ? " must" : " int") : ""}${gr(a.id)}"><button class="t" data-open="${a.id}"><b>${a.cancelled ? `<s>${a.name}</s>` : a.name}${isFriend(a.id) ? ' <i class="fr"></i>' : ""}</b><span><i class="dot" style="background:${v.color}"></i>${v.name} · ${d.label} ${timeTxt(a)}${isOO(a) ? ` · <em class="oo-t">${OO_NAME} · ${ooFree()}</em>` : ""}${a.cancelled ? ` · <em class="clash">${L("Vervallen", "Cancelled")}</em>` : ""}${typeof extra === "string" && extra ? ` · <em class="when">${extra}</em>` : ""}${subX(a)}${cl ? `<em class="clash">${cl}</em>` : ""}</span></button><span class="rt2"><button class="hb ri ${isFav(a.id) && !isStar(a.id) ? "on" : ""}" data-int="${a.id}" aria-label="${L("Interessant", "Interesting")}" aria-pressed="${isFav(a.id) && !isStar(a.id)}">${dial("int", 24, isFav(a.id) && !isStar(a.id))}</button><button class="hb rm ${isStar(a.id) ? "on" : ""}" data-must="${a.id}" aria-label="${L("Moet ik zien", "Must-see")}" aria-pressed="${isStar(a.id)}">${dial("must", 24, isStar(a.id))}</button></span></div>`;
  };
  let genreOpen = false, selGenres = [], skipModal = false, nowFav = false;
  const allGenres = () => { const c = {}; ACTS.forEach(a => (a.genres || []).forEach(g => (c[g] = c[g] || new Set()).add(a.name))); return Object.entries(c).map(([g, s]) => [g, s.size]).sort((x, y) => x[0].localeCompare(y[0])); };
  const genreSheet = () => `<div class="ov"><div class="sheet" role="dialog" aria-modal="true" aria-label="Genre"><div class="grab"></div><button class="x" data-close-genres aria-label="Sluiten">✕</button><h2>Genre</h2><p>Toon alleen acts met een van deze genres.</p><div class="sheet-actions"><button data-no-genres>Wis filter</button><button data-close-genres>Klaar</button></div>${allGenres().map(([g, n]) => `<label class="checkrow"><input type="checkbox" data-genre="${g}" ${selGenres.includes(g) ? "checked" : ""}>${cap(g)}<span style="margin-left:auto;opacity:.5">${n}</span></label>`).join("")}</div></div>`;
  const _rm = renderModal;
  renderModal = function () {
    if (skipModal) return; const m = document.getElementById("modal");
    if (sheet) { m.innerHTML = `<div class="ov"><div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div><button class="x" data-close-sheet aria-label="Sluiten">✕</button>${sheet}</div></div>`; trNode(m); return; }
    if (genreOpen) { m.innerHTML = genreSheet(); trNode(m); return; }
    if (venueOpen) { _rm(); trNode(m); return; }
    const a = openId && act(openId); if (!a) { m.innerHTML = ""; return; }
    const v = venue(a.venueId), d = dayOf(a.day), url = a.after ? AFTER_URL : siteUrl(a), cl = clashLine(a), hint = starHint(a), acc = accLine(v.name), nx = nextLine(a);
    const c0 = coordOf(v.name), sub = [shown(a).map(cap).join(" · "), a.country ? names(a.country) : ""].filter(Boolean).join("  ·  "), mustOn = isStar(a.id), intOn = isFav(a.id) && !mustOn;
    const cls = clashes(a), accR = ACC.find(x => v.name.startsWith(x[0])), accNote = accR ? L(accR[2], accR[3]) : "";
    const notes = [isOO(a) ? `<p class="m-oo"><b>${OO_NAME}</b>${L("Gratis dagprogramma van Left of the Dial. Geen ticket of polsbandje nodig.", "Free daytime programme of Left of the Dial. No ticket or wristband needed.")}</p>` : "", a.endUnknown ? `<p>${L("Start direct na de laatste band van die avond. Eindtijd nog niet bekend.", "Starts straight after the last band of the night. End time not announced.")}</p>` : "", a.cancelled ? `<p class="clash">${L("Vervallen", "Cancelled")}</p>` : "", hint ? `<p>${hint}</p>` : "", isFriend(a.id) ? `<p>${L("Je vriend wil dit ook zien", "Your friend wants to see this too")}</p>` : "", nx ? `<p>${nx}</p>` : ""].join("");
    const clashHtml = cls.map(c => `<button class="m-clash" data-open="${c.act.id}">${sv(SI.warn, 18)}<span>${L(`${c.minutes} min overlap met`, `${c.minutes} min overlap with`)} <strong>${c.act.name}</strong></span><i aria-hidden="true">›</i></button>`).join("");
    const alt = ACTS.filter(x => x.name === a.name && x.id !== a.id).sort((x, y) => DAYS.findIndex(d2 => d2.id === x.day) - DAYS.findIndex(d2 => d2.id === y.day) || byTime(x, y));
    const addr = addrOf(v.name);
    const rows = [
      c0 ? `<div class="m-row m-route">${sv(SI.pin)}<a href="${routeUrl(c0)}" target="_blank" rel="noopener"><b>${addr || v.name}</b><small>Rotterdam · ${L("route", "directions")} ↗</small></a><button class="m-walk" data-here="${c0[0]},${c0[1]}">${sv(SI.foot, 18)}<b>${L("Looptijd", "Walk time")}</b></button></div>` : "",
      accR ? `<details class="m-row m-accd">${accNote ? "" : ""}<summary>${sv(SI.acc)}<span>${accR[1] ? L("Rolstoeltoegankelijk", "Wheelchair accessible") : L("Niet rolstoeltoegankelijk", "Not wheelchair accessible")}</span>${accNote ? sv(SI.down, 18) : ""}</summary>${accNote ? `<p>${accNote}</p>` : ""}</details>` : "",
      ...alt.map(x => `<button class="m-row m-alt" data-open="${x.id}">${sv(SI.cal)}<span><small>${L("Speelt ook", "Also playing")}</small><b>${dayOf(x.day).label} · ${timeTxt(x)} →</b><small>${venue(x.venueId).name}</small></span></button>`)
    ].join("");
    const tags = [a.country ? `<span class="m-cc">${names(a.country)}</span>` : "", shown(a).length ? `<span class="m-gen">${shown(a).map(cap).join(" · ")}</span>` : ""].join("");
    m.innerHTML = `<div class="ov"><div class="sheet act-sheet" role="dialog" aria-modal="true" aria-labelledby="m-title" style="--vc:${v.color}"><div class="m-hero"><div class="grab"></div><button class="x" data-close aria-label="${L("Sluiten", "Close")}">✕</button>${tags ? `<div class="m-tags">${tags}</div>` : ""}<h2 id="m-title">${a.cancelled ? `<s>${a.name}</s>` : a.name}</h2>${url ? `<a class="m-ext" href="${url}" target="_blank" rel="noopener">${a.after ? L("Meer over de afterparty's", "More about the after parties") : L("Meer info op leftofthedial.nl", "More on leftofthedial.nl")} ${sv(SI.ext, 14)}</a>` : ""}</div><div class="m-body"><div class="m-when"><div class="m-w-l"><small>${dayFull(a.day)}</small><b>${timeTxt(a)}</b></div><div class="m-w-r"><span><i class="dot" style="background:${v.color}"></i>${v.name}</span>${a.endUnknown ? "" : `<small>${durMin(a)} ${L("minuten", "minutes")}</small>`}</div></div>${clashHtml}${notes ? `<div class="m-note">${notes}</div>` : ""}<div class="m-rows">${rows}</div></div><div class="rate"><button class="r-must ${mustOn ? "on" : ""}" data-must="${a.id}" aria-pressed="${mustOn}">${dial("must", 22, mustOn)}${L("Moet ik zien", "Must-see")}${mustOn ? " ✓" : ""}</button><button class="r-int ${intOn ? "on" : ""}" data-int="${a.id}" aria-pressed="${intOn}">${dial("int", 22, intOn)}${L("Interessant", "Interesting")}${intOn ? " ✓" : ""}</button></div></div></div>`;
    trNode(m);
  };

  { const _rmF = renderModal; let lastFocus = null;
    renderModal = function () { const m = document.getElementById("modal"), was = !!m.querySelector(".ov"); if (!was) lastFocus = document.activeElement; _rmF(); const ov = m.querySelector(".ov");
      if (ov && !was) { const f = ov.querySelector(".x") || ov.querySelector("button, a, input"); if (f) try { f.focus({ preventScroll: true }); } catch (e) {} }
      if (!ov && was && lastFocus && document.contains(lastFocus)) try { lastFocus.focus({ preventScroll: true }); } catch (e) {}
      document.documentElement.classList.toggle("modal-open", !!ov); };
    document.addEventListener("keydown", e => { if (e.key !== "Tab") return; const sh = document.querySelector("#modal .sheet"); if (!sh) return; const it = [...sh.querySelectorAll('a[href],button:not([disabled]),input,summary,[tabindex]:not([tabindex="-1"])')].filter(x => x.offsetParent !== null); if (!it.length) return; const first = it[0], last = it[it.length - 1];
      if (!sh.contains(document.activeElement)) { e.preventDefault(); first.focus(); } else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }); }
  /* naar het huidige moment scrollen (volgt ook de testtijd ?now=) */
  function scrollToNow(smooth) {
    const tt = document.querySelector("#main .tt"), line = tt && tt.querySelector(".now"); if (!tt) return false;
    const labw = (tt.querySelector(".row .lab") || {}).offsetWidth || 110;
    let x;
    if (line) x = line.offsetLeft - labw - Math.min(90, (tt.clientWidth - labw) * 0.25);
    else { const f = festNow(), first = tt.querySelector(".tick"); x = first && f.m > 720 ? tt.scrollWidth : 0; }
    tt.scrollTo({ left: Math.max(0, x), behavior: smooth ? "smooth" : "auto" }); return true;
  }
  let autoNowDone = "", pref = "all", ttLayout = LS.get("lotd-layout", "grid") === "list" ? "list" : "grid";
  const prefOk = (a, pf) => pf === "all" ? true : pf === "must" ? isStar(a.id) : pf === "int" ? isFav(a.id) && !isStar(a.id) : isFav(a.id);
  const DAYFULL = { w: ["WOENSDAG", "WEDNESDAY"], d: ["DONDERDAG", "THURSDAY"], v: ["VRIJDAG", "FRIDAY"], z: ["ZATERDAG", "SATURDAY"] };
  const dayFull = id => { const d = dayOf(id), n = d.date.slice(8); return L(`${DAYFULL[id][0]} ${+n} OKTOBER`, `${DAYFULL[id][1]} ${+n} OCTOBER`); };
  const vHead = (icon, lab, h, p) => `<div class="vh"><span class="vh-lab">${icon}${lab}</span><h2>${h}</h2>${p ? `<p>${p}</p>` : ""}</div>`;
  const dayCap = id => { const t = dayFull(id).toLowerCase(); return t.charAt(0).toUpperCase() + t.slice(1); };
  const durMin = a => mins(a.end) - mins(a.start);
  const glItem = (a, extra) => { const v = venue(a.venueId), st = isStar(a.id), it = isFav(a.id) && !st, live = isLive(a) && !a.cancelled, cl = clashes(a).length;
    return `<button class="gl-item${st ? " must" : it ? " int" : ""}${gr(a.id)}${a.cancelled ? " cancel" : ""}${a.after ? " after" : ""}" data-open="${a.id}" style="--vc:${v.color}"><span class="gl-time">${a.start}<small>${a.endUnknown ? "…" : a.end}</small></span><span class="gl-main"><strong>${a.cancelled ? `<s>${a.name}</s>` : a.name}</strong><span class="gl-meta"><i class="dot" style="background:${v.color}"></i>${v.name}${isOO(a) ? ` · <em class="oo-t">${ooFree()}</em>` : ""}${tagX(a) ? " · " + tagX(a) : ""}${a.cancelled ? ` · <em class="clash">${L("Vervallen", "Cancelled")}</em>` : ""}${extra ? ` · <em class="when">${extra}</em>` : ""}</span>${cl ? `<span class="gl-clash">${sv(SI.warn, 14)}${L("Overlapt met een favoriet", "Overlaps a favourite")}</span>` : ""}</span><span class="gl-end">${live ? `<em class="gl-live">${L("NU", "NOW")}</em>` : ""}${st ? dial("must", 20) : it ? dial("int", 20) : `<i class="gl-chev" aria-hidden="true">›</i>`}</span></button>`; };
  const onFavPage = () => route().p === "favorites";
  const filterCount = () => (ooOnly ? 1 : 0) + (pref !== "all" && !onFavPage() ? 1 : 0) + (selGenres.length ? 1 : 0) + (hiddenVenues.length ? 1 : 0) + (friend.on && friend.ids.length ? 1 : 0);
  const filterHtml = () => {
    const sw = (on, attr, t, sub) => `<button class="fl-row" ${attr} role="switch" aria-checked="${on}"><span><b>${t}</b>${sub ? `<small>${sub}</small>` : ""}</span><i class="fl-sw${on ? " on" : ""}" aria-hidden="true"></i></button>`;
    const go = (attr, t, sub) => `<button class="fl-row" ${attr}><span><b>${t}</b><small>${sub}</small></span><i class="fl-chev" aria-hidden="true">›</i></button>`;
    const shownV = VENUES.length - hiddenVenues.length;
    return `<div data-filtersheet><h2>Filter</h2>
      ${onFavPage() ? "" : `<fieldset class="fl-pref"><legend>${L("Mijn selectie", "My selection")}</legend>${[["all", L("Alles", "Everything")], ["must", L("Moet ik zien", "Must-see")], ["int", L("Interessant", "Interesting")], ["both", L("Beide", "Both")]].map(([k, t]) => `<button class="${pref === k ? "on" : ""}" data-pref="${k}" role="radio" aria-checked="${pref === k}">${t}</button>`).join("")}</fieldset>`}
      ${friend.ids.length ? sw(friend.on, "data-fl-friend", L("Lijst van je vriend tonen", "Show your friend's list"), `${friend.ids.length} acts`) : ""}
      ${sw(ooOnly, "data-fl-oo", OO_NAME, L("Alleen het gratis dagprogramma (vr & za, 12–16 uur)", "Only the free daytime programme (Fri & Sat, 12–4 pm)"))}
      ${go("data-fl-genres", "Genre", selGenres.length ? selGenres.map(cap).join(", ") : L("Alle genres", "All genres"))}
      ${go("data-fl-venues", L("Locaties", "Venues"), hiddenVenues.length ? L(`${shownV} van ${VENUES.length} zichtbaar`, `${shownV} of ${VENUES.length} shown`) : L("Alle locaties", "All venues"))}
      <div class="sheet-actions"><button data-filter-clear>${L("Wis alles", "Clear all")}</button><button data-close-sheet>${L("Klaar", "Done")}</button></div></div>`;
  };
  /* ---- timetable ---- */
  vTimetable = function (onlyFavs) {
    const ids = sharedReadOnly && sharedIds ? sharedIds : null, f = festNow();
    const gOk = a => !selGenres.length || (a.genres || []).some(g => selGenres.includes(g));
    const pf = onFavPage() ? "both" : pref;
    const list = ACTS.filter(a => a.day === day && prefOk(a, pf) && (!ids || ids.includes(a.id)) && !hiddenVenues.includes(a.venueId) && gOk(a) && (!ooOnly || isOO(a)));
    const today = dayOf(day).date === f.ds, jump = today ? `<button class="to-now" data-to-now>${sv(SI.walk, 18)}${L("Naar nu", "Jump to now")}</button>` : "";
    const segHtml = `<div class="seg" role="tablist" aria-label="Kies een festivaldag">${DAYS.map(x => `<button class="${x.id === day ? "on" : ""}" data-day="${x.id}" role="tab" aria-selected="${x.id === day}">${x.label}</button>`).join("")}</div><div class="tt-tools">${jump}${sharedReadOnly ? `<button class="on" data-fav-only>${L("Gedeelde lijst ✕", "Shared list ✕")}</button>` : ""}<button class="flt-btn${filterCount() ? " on" : ""}" data-filter><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4"/></svg>Filter${filterCount() ? ` · ${filterCount()}` : ""}</button>${filterCount() ? `<button class="flt-clear" data-filter-clear aria-label="${L("Filters wissen", "Clear filters")}">${L("Wis", "Clear")}</button>` : ""}<span class="tt-count">${list.length} ${L(list.length === 1 ? "optreden" : "optredens", list.length === 1 ? "show" : "shows")}</span><span class="lay-tog" role="group" aria-label="${L("Weergave", "View")}"><button class="${ttLayout === "grid" ? "on" : ""}" data-layout="grid" aria-pressed="${ttLayout === "grid"}" aria-label="${L("Tijdschema", "Timetable grid")}"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg></button><button class="${ttLayout === "list" ? "on" : ""}" data-layout="list" aria-pressed="${ttLayout === "list"}" aria-label="${L("Lijst op tijd", "List by time")}"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg></button></span></div>`;
    if (!list.length) return segHtml + `<div class="empty">${filterCount() && !onFavPage() ? `${L("Geen optredens met deze filters.", "No shows with these filters.")}<br><button class="lnk" data-filter-clear>${L("Wis alle filters", "Clear all filters")}</button>` : onFavPage() ? (favs.length ? L("Geen favorieten op deze dag.", "No favourites on this day.") : L("Nog geen favorieten.<br>Tik op een act en kies ‘Moet ik zien’ of ‘Interessant’.", "No favourites yet.<br>Tap an act and choose ‘Must-see’ or ‘Interesting’.")) : L("Geen acts.", "No acts.")}</div>`;
    const ooN = list.filter(isOO).length;
    const caption = `<div class="tt-cap"><span>${dayFull(day)}</span>${ooN ? `<span class="oo-cap"><b>${OO_NAME}</b> · ${L("gratis dagprogramma 12:00–16:00", "free daytime programme 12:00–16:00")}</span>` : ""}</div>`;
    if (ttLayout === "list") { let ooHead = false, eveHead = false;
      return segHtml + caption + `<div class="gig-list">${list.slice().sort((x, y) => byTime(x, y) || venue(x.venueId).name.localeCompare(venue(y.venueId).name)).map(a => { let h = "";
        if (ooN && isOO(a) && !ooHead) { ooHead = true; h = `<div class="oo-head"><b>${OO_NAME}</b><span>${L("Gratis dagprogramma · geen ticket nodig", "Free daytime programme · no ticket needed")}</span></div>`; }
        else if (ooN && !isOO(a) && !eveHead) { eveHead = true; h = `<div class="oo-head eve"><b>${L("Festivalprogramma", "Festival programme")}</b><span>${L("Vanaf 16:00 · met ticket", "From 16:00 · ticket required")}</span></div>`; }
        return h + glItem(a); }).join("")}</div>`; }
    const start = Math.floor(Math.min(...list.map(a => mins(a.start))) / 60) * 60, end = Math.ceil(Math.max(...list.map(a => mins(a.end))) / 60) * 60, hours = (end - start) / 60, W = hours * PPH;
    let ticks = ""; for (let i = 0; i <= hours; i++) ticks += `<div class="tick" style="left:${i * PPH}px">${String((start / 60 + i) % 24).padStart(2, "0")}:00</div>`;
    const rows = VENUES.filter(v => list.some(a => a.venueId === v.id)).map(v => {
      const acts = list.filter(a => a.venueId === v.id).map(a => { const l = (mins(a.start) - start) / 60 * PPH, w = (mins(a.end) - mins(a.start)) / 60 * PPH, cl = clashes(a).length;
        return `<button class="act ${isOO(a) ? "oo " : ""}${a.after ? "after " : ""}${isStar(a.id) ? "must" : isFav(a.id) ? "int" : ""}${gr(a.id)} ${isFav(a.id) ? "fav" : ""} ${a.cancelled ? "cancel" : ""}" style="left:${l}px;width:${w - 4}px;--vc:${v.color}" data-open="${a.id}"${cl ? ' aria-label="Overlapt met favorieten"' : ""}>${isFav(a.id) ? `<i class="h">${mark(a.id)}</i>` : ""}${cl ? '<i class="clash-marker" title="Overlap met een favoriet" aria-hidden="true">!</i>' : ""}${isLive(a) && !a.cancelled ? '<em class="live">NU</em>' : ""}${isFriend(a.id) ? '<i class="fr"></i>' : ""}<b>${a.name}</b><span>${timeTxt(a)}</span><span class="g">${a.cancelled ? L("Vervallen", "Cancelled") : (isOO(a) ? `<em class="oo-t">${ooFree()}</em>` : "") + tagX(a)}</span></button>`; }).join("");
      return `<div class="row"><div class="lab${(n => n >= 12 ? " long xlong" : n >= 10 ? " long" : "")(Math.max(...v.name.split(/\s+/).map(w => w.length)))}"><i class="dot" style="background:${v.color}"></i><span class="lab-t" lang="nl">${v.name}<small>${(n => L(n === 1 ? "1 optreden" : n + " optredens", n === 1 ? "1 show" : n + " shows"))(list.filter(a => a.venueId === v.id).length)}</small></span></div><div class="track" style="width:${W}px;background-size:${PPH}px 100%">${acts}</div></div>`; }).join("");
    const ooA = list.filter(isOO), ooL = ooA.length ? (Math.min(720, ...ooA.map(a => mins(a.start))) - start) / 60 * PPH : 0, ooW = ooA.length ? (960 - start) / 60 * PPH - ooL : 0;
    const ooBand = ooA.length ? `<div class="oo-band" style="left:${ooL}px;width:${ooW}px"><span>${OO_NAME} · ${ooFree()}</span></div>` : "", ooZone = ooA.length ? `<div class="oo-zone" style="left:calc(var(--labw) + ${ooL}px);width:${ooW}px" aria-hidden="true"></div>` : "";
    const now = today && f.m >= start && f.m <= end ? `<div class="now" style="left:calc(var(--labw) + ${(f.m - start) / 60 * PPH}px)"></div>` : "";
    return segHtml + caption + `<div class="tt-wrap"><div class="tt"><div class="tt-in" style="width:calc(var(--labw) + ${W}px)"><div class="hrow"><div class="lab"></div><div class="trackh" style="width:${W}px">${ticks}${ooBand}</div></div>${ooZone}${rows}${now}</div></div></div>`;
  };

  /* ---- favorieten-pagina (agenda, vriend, jullie allebei) ---- */
  vFavs = function () {
    const banner = sharedIds && !sharedReadOnly ? `<div class="share-banner"><b>Favorieten van een vriend</b><button data-view-shared>Bekijk</button><button data-compare-shared>Vergelijk met mijn lijst</button><button data-add-shared>Toevoegen aan mijn favorieten</button></div>` : "";
    const both = friend.on && friend.ids.length ? ACTS.filter(a => isFav(a.id) && friend.ids.includes(a.id) && !a.cancelled).sort((x, y) => DAYS.findIndex(d => d.id === x.day) - DAYS.findIndex(d => d.id === y.day) || byTime(x, y)) : [];
    const nF = ACTS.filter(a => isFav(a.id)).length, nS = ACTS.filter(a => isStar(a.id)).length;
    return banner + vHead(sv(SI.heart, 14), L("JOUW SELECTIE", "YOUR SELECTION"), L("Jouw festival, jouw route.", "Your festival, your route."), `${nS} ${L("moet ik zien", "must-see")} · ${nF - nS} ${L("interessant", "interesting")}`) + `<div class="list"><div class="fav-bar"><span></span>${friend.ids.length ? `<button data-friend-clear>${L("Vriend wissen", "Clear friend")}</button>` : ""}${nF ? `<button class="fav-share" data-share><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5M5 14v6h14v-6"/></svg>${L("Delen", "Share")}</button>` : ""}</div>${both.length ? `<div class="grp">${L("Jullie allebei", "You both want to see")} (${both.length})</div>${both.map(a => row(a)).join("")}` : ""}</div>` + vTimetable(true) + updLine();
  };

  /* ---- zoeken ---- */
  const searchActs = s => { const words = fold(s).split(/\s+/).filter(Boolean); return ACTS.filter(a => { const hay = fold([a.name, venue(a.venueId).name, (a.genres || []).join(" "), a.country ? names(a.country) + " " + codes(a.country) + " " + a.country : ""].join(" ")); return words.every(w => hay.includes(w)); }); };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  resHtml = function (s, res) { return !s ? `<div class="empty">Typ een act, locatie, genre of land.</div>` : res.length ? res.sort((a, b) => DAYS.findIndex(d => d.id === a.day) - DAYS.findIndex(d => d.id === b.day) || byTime(a, b)).map(a => row(a)).join("") : `<div class="empty">Niets gevonden voor “${esc(s)}”.</div>`; };
  vSearch = function () { const s = q.trim(), res = s ? searchActs(s) : []; return `<div class="search"><input id="q" type="search" placeholder="Zoek act, locatie, genre of land…" value="${esc(q)}" autocomplete="off"></div><div class="list" id="res">${resHtml(s.toLowerCase(), res)}</div>`; };
  document.addEventListener("input", e => { if (e.target.id !== "q") return; e.stopImmediatePropagation(); q = e.target.value; const s = q.trim(), res = s ? searchActs(s) : [], box = document.getElementById("res"); box.innerHTML = resHtml(s.toLowerCase(), res); trNode(box); }, true);

  /* ---- Nu & straks ---- */
  const sortFav = (a, b) => (isFav(b.id) - isFav(a.id)) || (mins(a.start) - mins(b.start)) || a.name.localeCompare(b.name);
  /* ---- Nu & straks: per locatie, gesorteerd op afstand ---- */
  let here = null, hereBusy = false, hereErr = "";
  const locOn = () => !!LS.get("lotd-now-loc", false);
  const nowIdle = () => route().p === "now" && !openId && !sheet && !genreOpen && !venueOpen;
  function askHere(force) {
    if (hereBusy || !navigator.geolocation) { if (!navigator.geolocation) hereErr = "fail"; return; }
    if (!force && here && Date.now() - here.t < 120000) return;
    hereBusy = true;
    navigator.geolocation.getCurrentPosition(p => { here = { c: [p.coords.latitude, p.coords.longitude], t: Date.now() }; hereBusy = false; hereErr = ""; if (nowIdle()) render(true); },
      e => { hereBusy = false; hereErr = e && e.code === 1 ? "denied" : "fail"; if (e && e.code === 1) LS.set("lotd-now-loc", false); if (nowIdle()) render(true); },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
  }
  const walkMin = m => Math.max(1, Math.round(m * 1.3 / 80));
  const distTxt = m => { const w = walkMin(m); return w <= 45 ? L(`${w} min lopen`, `${w} min walk`) : (m / 1000).toFixed(1).replace(".", L(",", ".")) + " km"; };
  function vNowView() {
    const f = festNow(), d = DAYS.find(x => x.date === f.ds), demo = new URLSearchParams(location.search).get("now");
    if (!d) return `<div class="empty">${f.ds < DAYS[0].date ? L("Het festival begint op woensdag 21 oktober. Dan zie je hier per locatie wat er nu en straks speelt, met de dichtstbijzijnde bovenaan.", "The festival starts on Wednesday 21 October. Then you'll see what's on now and next at every venue here, nearest first.") : L("Het festival is voorbij. Bedankt voor het meekijken!", "The festival is over. Thanks for tuning in!")}<br><br><button class="big" data-go="/">${L("Naar de timetable", "To the timetable")}</button>${f.ds < DAYS[0].date ? `<p style="margin-top:18px"><a class="lnk" href="?now=2026-10-23T21:20#/now">${L("Bekijk een voorbeeld (vrijdag 21:20)", "See a preview (Friday 21:20)")}</a></p>` : ""}</div>`;
    if (locOn()) setTimeout(() => askHere(false), 0);
    const all = ACTS.filter(a => a.day === d.id && !a.cancelled && !hiddenVenues.includes(a.venueId) && (!nowFav || isFav(a.id)));
    const H = 180; // straks = binnen 3 uur
    const groups = {};
    all.forEach(a => {
      const s = mins(a.start), e = mins(a.end); if (e <= f.m || s > f.m + H) return;
      const v = venue(a.venueId), b = baseName(v.name), g = groups[b] = groups[b] || { name: b, c: coordOf(v.name), rooms: {} };
      const r = g.rooms[v.id] = g.rooms[v.id] || { v, now: null, next: [] };
      if (s <= f.m) r.now = a; else r.next.push(a);
    });
    let list = Object.values(groups);
    list.forEach(g => {
      g.rooms = Object.values(g.rooms).map(r => (r.next.sort(byTime), r.next = r.next.slice(0, r.now ? 1 : 2), r)).sort((x, y) => (!!y.now - !!x.now) || ((x.now ? mins(x.now.start) : mins(x.next[0].start)) - (y.now ? mins(y.now.start) : mins(y.next[0].start))));
      g.live = g.rooms.some(r => r.now);
      g.first = Math.min(...g.rooms.map(r => r.now ? 0 : mins(r.next[0].start)));
      g.dist = here && g.c ? distM(here.c, g.c) : null;
    });
    const useLoc = locOn() && here;
    list.sort((x, y) => useLoc ? ((x.dist == null) - (y.dist == null)) || (x.dist - y.dist) : (y.live - x.live) || (x.first - y.first) || x.name.localeCompare(y.name));
    const mark = a => (isStar(a.id) ? " must" : isFav(a.id) ? " int" : "") + gr(a.id);
    const icon = a => isStar(a.id) ? `<i class="nn-fav must" aria-label="${L("Moet ik zien", "Must-see")}">♥</i>` : isFav(a.id) ? `<i class="nn-fav" aria-label="${L("Interessant", "Interesting")}">★</i>` : "";
    const actRow = (a, live, multi, v) => {
      const s = mins(a.start), e = mins(a.end), pct = live ? Math.max(3, Math.min(100, Math.round((f.m - s) / Math.max(1, e - s) * 100))) : 0;
      const rest = live ? L(`nog ${e - f.m} min`, `${e - f.m} min left`) : (s - f.m <= 60 ? L(`over ${s - f.m} min`, `in ${s - f.m} min`) : L(`om ${a.start}`, `at ${a.start}`));
      return `<button class="nn-act${live ? " nn-live" : ""}${mark(a)}" data-open="${a.id}"><span class="nn-tag">${live ? L("NU", "NOW") : a.start}</span><span class="nn-main"><b>${a.name}${icon(a)}${isOO(a) ? ` <em class="oo-t">${ooFree()}</em>` : ""}</b>${multi ? `<small>${v.name.replace(baseName(v.name), "").trim()}</small>` : ""}${live ? `<span class="nn-bar"><i style="width:${pct}%"></i></span>` : ""}</span><span class="nn-rest">${rest}</span></button>`;
    };
    const cards = list.map((g, i) => {
      const multi = g.rooms.length > 1 || g.rooms.some(r => r.v.name !== g.name), atHere = useLoc && i === 0 && g.dist != null && g.dist < 120;
      const items = []; g.rooms.forEach(r => { if (r.now) items.push([r.now, true, r.v]); r.next.forEach(a => items.push([a, false, r.v])); });
      const rows = items.sort((x, y) => (y[1] - x[1]) || (mins(x[0].start) - mins(y[0].start))).map(([a, lv, v]) => actRow(a, lv, multi, v)).join("");
      const dist = useLoc && g.dist != null ? `<span class="nn-dist${atHere ? " here" : ""}">${atHere ? L("Je bent hier", "You're here") : distTxt(g.dist)}</span>` : "";
      return `<section class="nn-card${atHere ? " at" : ""}${useLoc && i === 0 && !atHere ? " near" : ""}"><button class="nn-head" data-mapven="${g.name.replace(/"/g, "&quot;")}" aria-label="${g.name}: ${L("lineup van deze locatie", "lineup of this venue")}"><h3>${g.name}</h3>${dist}<span class="nn-chev" aria-hidden="true">›</span></button>${rows}</section>`;
    }).join("");
    const locBar = locOn()
      ? `<div class="nn-loc on">${sv(SI.pin, 20)}<span>${here ? L("Gesorteerd op afstand vanaf jou", "Sorted by distance from you") : hereBusy ? L("Locatie zoeken…", "Finding your location…") : L("Locatie nog niet gevonden", "Location not found yet")}</span><button data-nowloc-refresh aria-label="${L("Locatie verversen", "Refresh location")}">↻</button><button data-nowloc aria-label="${L("Locatie uitzetten", "Turn off location")}">${L("Uit", "Off")}</button></div>`
      : `<button class="nn-loc off" data-nowloc>${sv(SI.pin, 20)}<span><b>${L("Sorteer op wat het dichtst bij is", "Sort by what's nearest")}</b><small>${hereErr === "denied" ? L("Locatietoegang is geweigerd. Sta het toe in je browserinstellingen.", "Location access was denied. Allow it in your browser settings.") : L("Tik om je locatie te gebruiken. Die blijft op je telefoon.", "Tap to use your location. It stays on your phone.")}</small></span></button>`;
    const head = vHead(`<i class="live-dot"></i>`, `LIVE · ${hhmm(f.m)}${demo ? " · TEST" : ""}`, L("Hier wil je zijn.", "This is where you want to be."), `${dayCap(d.id)} · ${L("nu & straks", "now & next")}`) + `<div class="nn-top"><div class="nn-filter" role="group" aria-label="Filter"><button class="${nowFav ? "" : "on"}" data-now-all aria-pressed="${!nowFav}">${L("Alles", "All")}</button><button class="${nowFav ? "on" : ""}" data-now-fav aria-pressed="${nowFav}">${L("Mijn favorieten", "My favourites")}</button></div></div>${locBar}`;
    const empty = `<div class="empty">${nowFav ? L("Geen favorieten nu of in de komende 3 uur.", "No favourites now or in the next 3 hours.") : L("Het is even rustig. Niets nu of in de komende 3 uur.", "It's quiet. Nothing now or in the next 3 hours.")}</div>`;
    return `<div class="list nn">${head}${cards || empty}</div>${updLine()}`;
  }

  /* ---- hoofdweergave ---- */
  ico.clock = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
  render = function (keep) {
    renderModal();
    const r = route(), main = document.getElementById("main"), tt0 = main.querySelector(".tt"), sc = keep ? [main.scrollTop, tt0 ? tt0.scrollLeft : 0, tt0 ? tt0.scrollTop : 0] : [0, 0, 0];
    const titles = { tt: "Timetable", now: L("Nu & straks", "Now & next"), search: L("Zoeken", "Search"), favorites: L("Favorieten", "Favorites"), game: "Wapperman", map: L("Kaart", "Map"), act: "Act" };
    document.getElementById("title").textContent = titles[r.p] || "Timetable";
    main.innerHTML = r.p === "search" ? vSearch() : r.p === "favorites" ? vFavs() : r.p === "act" ? vAct(r.id) : r.p === "now" ? vNowView() : r.p === "game" ? `<div id="wapperman-root"></div>` : r.p === "map" ? vMapView() : vTimetable(favOnly);
    if (r.p !== "map") killMap();
    if (r.p === "game") WappermanGame.mount(); else if (r.p === "map") { trNode(main); initMap(); } else trNode(main);
    { const sb = document.querySelector("[data-tb-search]"); if (sb) sb.classList.toggle("on", r.p === "search"); }
    const tab = r.p === "act" ? (sessionStorage.getItem("from") || "tt") : r.p, icon = { tt: "tt", now: "clock", search: "se", favorites: "fa", game: "game", map: "map" }, nav = document.getElementById("nav");
    nav.innerHTML = [["tt", "Timetable", "/"], ["now", L("Nu", "Now"), "/now"], ["map", L("Kaart", "Map"), "/map"], ["favorites", L("Favorieten", "Favorites"), "/favorites"], ["game", "Wapperman", "/game"]].map(([k, l, h]) => `<button class="${tab === k ? "on" : ""}" data-go="${h}" aria-current="${tab === k ? "page" : "false"}">${ico[icon[k]] || "◉"}${l}${k === "favorites" && favs.length ? `<i class="nav-badge" aria-label="${favs.length}">${favs.length}</i>` : ""}</button>`).join("");
    if (!keep && (r.p === "tt" || r.p === "favorites") && main.querySelector(".tt .now") && autoNowDone !== day + r.p) { autoNowDone = day + r.p; scrollToNow(false); }
    if (keep) { main.scrollTop = sc[0]; const tt = main.querySelector(".tt"); if (tt) { tt.scrollLeft = sc[1]; tt.scrollTop = sc[2]; } }
    if (r.p === "search" && !keep) { const i = document.getElementById("q"); if (i && q) i.focus(); }
  };

  ico.map = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 22s7-6.2 7-12A7 7 0 0 0 5 10c0 5.800 7 12 7 12z"/><circle cx="12" cy="10" r="2.500"/></svg>';
  /* ---- kaart ---- */
  const LOGO = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lotd-logo-c6lqMUD95gwzWwfVBJxT2zXsGQE1pk.png";
  let mapTok = 0, lmap = null, mapDay = null, mapVen = null, userDot = null;
  const mapGroups = () => { const g = {}; VENUES.forEach(v => { const b = baseName(v.name); (g[b] = g[b] || { name: b, ids: [], c: coordOf(v.name) }).ids.push(v.id); if (!g[b].c) g[b].c = coordOf(v.name); }); return Object.values(g); };
  const defMapDay = () => { const f = festNow(), d = DAYS.find(x => x.date === f.ds); return (d || DAYS[0]).id; };
  const mapSheet = () => {
    const g = mapGroups().find(x => x.name === mapVen); if (!g) return "";
    const list = ACTS.filter(a => g.ids.includes(a.venueId) && a.day === mapDay).sort(byTime), addr = addrOf(g.name);
    const seg = `<div class="seg" role="tablist" aria-label="${L("Kies een dag", "Pick a day")}">${DAYS.map(x => `<button class="${x.id === mapDay ? "on" : ""}" data-mapday="${x.id}" role="tab" aria-selected="${x.id === mapDay}">${x.label}</button>`).join("")}</div>`;
    const rows = list.length ? list.map(a => { const sub = g.ids.length > 1 ? venue(a.venueId).name.replace(g.name, "").trim() : "", mk = isStar(a.id) ? ' <span class="mk must">♥</span>' : isFav(a.id) ? ' <span class="mk">★</span>' : ""; return `<button class="m-act${a.cancelled ? " cx" : ""}" data-open="${a.id}"><time>${a.endUnknown ? a.start + "+" : a.start}</time><span><b>${a.cancelled ? `<s>${a.name}</s>` : a.name}${mk}</b>${sub ? `<small>${sub}</small>` : ""}</span></button>`; }).join("") : `<p class="m-empty">${L("Geen optredens op deze dag.", "No shows on this day.")}</p>`;
    return `<div class="m-sub">${L("Locatie", "Location")}</div><h2>${g.name}</h2>${g.c ? `<a class="m-row" href="${routeUrl(g.c)}" target="_blank" rel="noopener">${sv(SI.pin)}<span><b>${L("Route hierheen", "Directions")}</b>${addr ? `<small>${addr}, Rotterdam</small>` : ""}</span></a>` : ""}${seg}<div class="m-list">${rows}</div>`;
  };
  const openMapSheet = n => { mapVen = n; if (!mapDay) mapDay = defMapDay(); sheet = mapSheet(); sheet && (sheet = '<div data-mapsheet>' + sheet + '</div>'); renderModal(); };
  const vMapView = () => (mapMode === "food" ? vHead(sv(SI.pin, 14), "ROTTERDAM", L("Eten tussen de bands door.", "Food between the bands."), L("Snelle hap, friet en streetfood rond de zalen.", "Quick bites, fries and street food around the venues.")) : vHead(sv(SI.pin, 14), "ROTTERDAM", L("Van podium naar podium.", "From stage to stage."), L("Alle locaties op één plek. Tik op een logo voor de lineup.", "All venues in one place. Tap a logo for the line-up."))) + `<div class="map-tog" role="tablist" aria-label="${L("Kaartweergave", "Map view")}"><button class="${mapMode === "venues" ? "on" : ""}" data-mapmode="venues" role="tab" aria-selected="${mapMode === "venues"}">${L("Locaties", "Venues")}</button><button class="${mapMode === "food" ? "on" : ""}" data-mapmode="food" role="tab" aria-selected="${mapMode === "food"}">${L("Eten", "Food")}</button></div><div class="mapwrap${mapMode === "food" ? " food" : ""}" id="mapwrap"><div id="lmap" aria-label="${L("Kaart met alle locaties", "Map of all venues")}"></div><div class="mapbtns"><button data-maploc aria-label="${L("Mijn locatie", "My location")}"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/></svg></button><button data-mapfit aria-label="${L("Alles tonen", "Show all")}">${sv(SI.pin, 24)}</button></div><div class="mapnote" id="mapnote"></div></div>${mapMode === "food" ? foodPanel() : ""}<div class="venue-dir"${mapMode === "food" ? " hidden" : ""}>${mapGroups().sort((x, y) => x.name.localeCompare(y.name)).map(g => `<div class="vd-item"><button data-mapven="${g.name.replace(/"/g, "&quot;")}"><span class="vd-name">${g.name}</span><small>${addrOf(g.name) || "Rotterdam"}</small></button>${g.c ? `<a href="${routeUrl(g.c)}" target="_blank" rel="noopener" aria-label="${L("Looproute naar", "Walking route to")} ${g.name}">${L("Looproute", "Route")} ${sv(SI.ext, 14)}</a>` : ""}</div>`).join("")}</div>${updLine()}`;
  const loadLeaflet = () => new Promise((ok, no) => {
    if (window.L && window.L.map) return ok();
    if (!document.getElementById("lf-css")) { const l = document.createElement("link"); l.id = "lf-css"; l.rel = "stylesheet"; l.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"; document.head.appendChild(l); }
    const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"; s.onload = ok; s.onerror = no; document.head.appendChild(s);
  });
  const killMap = () => { if (lmap) { try { lmap.remove(); } catch (e) {} lmap = null; userDot = null; } };
  const mapFallback = () => { const el = document.getElementById("lmap"); if (!el) return; el.innerHTML = `<div class="mapfb"><p>${L("De kaart kon niet laden (geen internet?). Kies een locatie:", "The map could not load (offline?). Pick a location:")}</p>${mapGroups().map(g => `<button data-mapven="${g.name.replace(/"/g, "&quot;")}">${g.name}</button>`).join("")}</div>`; };
  const initMap = () => {
    killMap(); const tok = ++mapTok, wrap = document.getElementById("mapwrap"), main = document.getElementById("main"); if (!wrap) return;
    wrap.style.height = Math.round(Math.max(300, Math.min(main.clientHeight * 0.62, 520))) + "px";
    if (mapMode === "food") loadFood().then(() => { if (route().p === "map" && mapMode === "food") { paintFoodList(); drawFoodLayer(); } });
    const groups = mapGroups(), miss = groups.filter(g => !g.c);
    if (miss.length) document.getElementById("mapnote").textContent = L("Nog geen kaartpositie: ", "No map position yet: ") + miss.map(g => g.name).join(", ");
    loadLeaflet().then(() => {
      if (tok !== mapTok || !document.getElementById("lmap")) return; killMap(); const Lf = window.L;
      lmap = Lf.map("lmap", { zoomControl: false, attributionControl: true }).setView([51.919, 4.476], 14);
      Lf.control.zoom({ position: "topleft" }).addTo(lmap);
      const MT_KEY = "EN4CW9GfL80ss8bkjtYB";
      let tl = Lf.tileLayer("https://api.maptiler.com/maps/dataviz-light/{z}/{x}/{y}{r}.png?key=" + MT_KEY, { maxZoom: 19, attribution: "© MapTiler © OpenStreetMap contributors" }).addTo(lmap), errs = 0;
      const toOsm = () => { if (!lmap || tl._osm) return; lmap.removeLayer(tl); tl = Lf.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, className: "osm-grey", attribution: "© OpenStreetMap contributors" }).addTo(lmap); tl._osm = true; };
      tl.on("tileerror", () => { if (++errs === 3) toOsm(); });
      if (window.__mtOk === false) toOsm(); else if (window.__mtOk !== true) fetch("https://api.maptiler.com/maps/dataviz-light/14/8395/5417.png?key=" + MT_KEY, { mode: "cors" }).then(r => { window.__mtOk = r.ok; if (!r.ok) toOsm(); }).catch(() => {});
      const pts = [];
      groups.filter(g => g.c).forEach(g => {
        const ic = Lf.divIcon({ className: "lotd-pin", html: `<span class="pin"><img src="${LOGO}" alt="" onerror="this.remove()"><i>LOTD</i></span><em>${g.name}</em>`, iconSize: [46, 46], iconAnchor: [23, 23] });
        const mk = Lf.marker(g.c, { icon: ic, title: g.name, keyboard: true, alt: g.name }).addTo(lmap); mk.on("click", () => openMapSheet(g.name)); pts.push(g.c);
      });
      lmap._fit = () => pts.length && lmap.fitBounds(pts, { padding: [30, 30], maxZoom: 17 }); lmap._fit(); drawFoodLayer();
      const zc = () => { const z = lmap.getZoom(); wrap.classList.toggle("zl", z >= 15); }; lmap.on("zoomend", zc); zc();
      setTimeout(() => lmap && lmap.invalidateSize(), 200);
    }).catch(() => { if (tok === mapTok) mapFallback(); });
  };
  document.addEventListener("click", e => {
    const tg = e.target, c = sel => tg.closest && tg.closest(sel), stop = () => e.stopImmediatePropagation();
    if (sheet && c("[data-open]") && sheet.indexOf("data-mapsheet") > -1) { sheet = null; return; }
    let b;
    if ((b = c("[data-mapday]"))) { stop(); mapDay = b.getAttribute("data-mapday"); sheet = '<div data-mapsheet>' + mapSheet() + '</div>'; renderModal(); return; }
    if ((b = c("[data-mapven]"))) { stop(); openMapSheet(b.getAttribute("data-mapven")); return; }
    if (c("[data-mapfit]")) { stop(); lmap && lmap._fit && lmap._fit(); return; }
    if (c("[data-maploc]")) { stop(); if (!navigator.geolocation || !lmap) return; navigator.geolocation.getCurrentPosition(p => { const ll = [p.coords.latitude, p.coords.longitude]; here = { c: ll, t: Date.now() }; if (mapMode === "food") paintFoodList(); if (userDot) userDot.setLatLng(ll); else userDot = window.L.circleMarker(ll, { radius: 8, color: "#fff", weight: 3, fillColor: "#1717ff", fillOpacity: 1 }).addTo(lmap); lmap.setView(ll, Math.max(lmap.getZoom(), 15)); }, () => { const n = document.getElementById("mapnote"); if (n) n.textContent = L("Locatie niet beschikbaar. Sta locatietoegang toe.", "Location unavailable. Allow location access."); }, { enableHighAccuracy: true, timeout: 10000 }); return; }
  }, true);

  /* ==== ETEN: snelle eetplekken rond de zalen (OpenStreetMap + LOTD-tips) ==== */
  const FOOD_TIPS_DEF = [
    { name: "Bram Ladage", match: "bram ladage", cat: "friet", nl: "Hét Rotterdamse frietadres. Meerdere vestigingen in het centrum.", en: "The Rotterdam fries institution. Several outlets downtown." },
    { name: "Mama Hong", match: "mama hong", addr: "Hoogstraat, Rotterdam", cat: "azie", nl: "Vietnamese loempia's en bánh mì, al sinds 1982.", en: "Vietnamese spring rolls and bánh mì, since 1982." },
    { name: "Hung Kee", match: "hung kee", addr: "Witte de Withstraat 61B, 3012 BN Rotterdam", cat: "azie", nl: "Kip peper-zout. Ook laat nog open, vlak bij V2_ en Worm.", en: "Salt and pepper chicken. Open late, close to V2_ and Worm." },
    { name: "Sranang", match: "sranang", addr: "Nieuwe Binnenweg 211A, Rotterdam", cat: "broodjes", nl: "Surinaamse broodjes, probeer de kip kerrie. Al 40 jaar een begrip.", en: "Surinamese sandwiches, try the chicken curry. A local favourite for 40 years." },
    { name: "Panzerò", match: "panzer", addr: "Botersloot 50A, Rotterdam", cat: "broodjes", nl: "Streetfood uit Puglia: puccia en panzerotti. Bij de Markthal.", en: "Street food from Puglia: puccia and panzerotti. By the Markthal." },
    { name: "Guliano", match: "gulian|giulian", addr: "Meent 31A, Rotterdam", cat: "broodjes", nl: "Bistecca-focaccia met truffelmayo. Vooral overdag open.", en: "Bistecca focaccia with truffle mayo. Mostly open in the daytime." },
    { name: "Markthal", match: "^markthal", addr: "Dominee Jan Scharpstraat 298, Rotterdam", cat: "hal", nl: "Overdekte foodhal met tientallen snelle kraampjes. Sluit vroeg op de avond.", en: "Covered food hall with dozens of quick stalls. Closes early in the evening." },
    { name: "Bazar", match: "^bazar", addr: "Witte de Withstraat 16, Rotterdam", cat: "oost", nl: "Midden-Oosterse klassiekers, snel op tafel. Zitten, maar vlot.", en: "Middle Eastern classics, served fast. Sit-down but quick." }
  ];
  let foodTips = Array.isArray(window.__lotdFoodTips) ? window.__lotdFoodTips : FOOD_TIPS_DEF.slice();
  const FOOD_CATS = [["all", "Alles", "All"], ["friet", "Friet & snacks", "Fries & snacks"], ["burger", "Burger", "Burgers"], ["pizza", "Pizza", "Pizza"], ["oost", "Falafel & shoarma", "Falafel & shawarma"], ["azie", "Aziatisch", "Asian"], ["broodjes", "Broodjes", "Sandwiches"], ["kip", "Kip", "Chicken"]];
  const CAT_RX = [["pizza", /pizza/], ["burger", /burger|hamburger/], ["kip", /chicken|kip|wings/], ["oost", /kebab|doner|döner|shawarma|shoarma|falafel|turkish|lebanese|middle_eastern|syrian|arab|greek|gyros|persian|moroccan/], ["azie", /chinese|japanese|sushi|thai|vietnam|asian|noodle|ramen|korean|indonesian|dumpling|wok|poke|indian|bao/], ["broodjes", /sandwich|bagel|bakery|surinam|roti|sub|deli|panini|toast|caribbean/], ["friet", /friture|fries|chips|french_fries|snack|dutch|frites|friet|kapsalon/]];
  const FOOD_KEY = "lotd-food2", FOOD_TTL = 864e5;
  let FOOD = [], foodState = "idle", mapMode = LS.get("lotd-map-mode", "venues") === "food" ? "food" : "venues", foodQ = "", foodCat = "all", foodOpenOnly = false, foodVeg = false, foodShow = 40, foodLayer = null;
  const catOf = t => { const s = ((t.cuisine || "") + " " + (t.name || "")).toLowerCase(); for (const [k, rx] of CAT_RX) if (rx.test(s)) return k; return t.amenity === "food_court" ? "hal" : "overig"; };
  const catName = k => { const c = FOOD_CATS.find(x => x[0] === k); return c ? L(c[1], c[2]) : k === "hal" ? L("Foodhal", "Food hall") : L("Snel eten", "Quick bites"); };
  /* openingstijden (OSM opening_hours, de gangbare vormen); onbekend = null */
  const DD = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  function ohParse(oh) {
    if (!oh) return null; oh = oh.trim().replace(/(\d),\s*(?=(Mo|Tu|We|Th|Fr|Sa|Su)\b)/g, "$1;").replace(/\s+/g, " "); if (oh === "24/7") return { all: true };
    const week = {}; DD.forEach(d => week[d] = null);
    for (let rule of oh.split(";")) {
      rule = rule.trim(); if (!rule) continue;
      if (/\b(PH|SH)\b/.test(rule) && !/^(Mo|Tu|We|Th|Fr|Sa|Su)/.test(rule)) continue;
      rule = rule.replace(/,?\s*(PH|SH)\b(\s*off)?/g, "");
      const m = rule.match(/^((?:(?:Mo|Tu|We|Th|Fr|Sa|Su)(?:\s*-\s*(?:Mo|Tu|We|Th|Fr|Sa|Su))?\s*,?\s*)+)?\s*(.*)$/); if (!m) return null;
      let days = [];
      if (m[1]) { for (const part of m[1].split(",").map(x => x.trim()).filter(Boolean)) { const [a, b] = part.split("-").map(x => x.trim()); const ia = DD.indexOf(a), ib = b ? DD.indexOf(b) : ia; if (ia < 0 || ib < 0) return null; for (let i = ia; ; i = (i + 1) % 7) { days.push(DD[i]); if (i === ib) break; } } }
      else days = DD.slice();
      const tp = m[2].trim();
      if (/^(off|closed)$/i.test(tp)) { days.forEach(d => week[d] = []); continue; }
      const ranges = []; for (const r of tp.split(",").map(x => x.trim()).filter(Boolean)) { const t = r.match(/^(\d{1,2}):(\d\d)\s*-\s*(\d{1,2}):(\d\d)\+?$/); if (!t) return null; ranges.push([+t[1] * 60 + +t[2], +t[3] * 60 + +t[4]]); }
      if (!ranges.length) return null; days.forEach(d => week[d] = ranges);
    }
    return { week };
  }
  const hm = m => String(Math.floor((m % 1440) / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
  function ohState(oh) {
    const p = ohParse(oh); if (!p) return { open: null };
    if (p.all) return { open: true, allDay: true };
    const n = getNow(), dow = n.getDay(), m = n.getHours() * 60 + n.getMinutes(), today = p.week[DD[dow]], yest = p.week[DD[(dow + 6) % 7]];
    if (yest) for (const [a, b] of yest) if (b <= a && m < b) return { open: true, until: b };
    if (today) for (const [a, b] of today) { const e = b <= a ? b + 1440 : b; if (m >= a && m < e) return { open: true, until: e }; }
    if (today && today.length) { const nx = today.filter(([a]) => a > m).sort((x, y) => x[0] - y[0])[0]; if (nx) return { open: false, from: nx[0] }; }
    if (today === null && yest === null && !Object.values(p.week).some(Boolean)) return { open: null };
    return { open: false };
  }
  const stateTxt = st => st.open === true ? (st.allDay ? L("24 uur open", "Open 24 hours") : L(`Open tot ${hm(st.until)}`, `Open until ${hm(st.until)}`)) : st.open === false ? (st.from != null ? L(`Dicht · opent ${hm(st.from)}`, `Closed · opens ${hm(st.from)}`) : L("Nu dicht", "Closed now")) : L("Tijden onbekend", "Hours unknown");
  /* ophalen + cache */
  function buildFood(elements) {
    const out = [], seen = new Set();
    for (const e of elements || []) {
      const t = e.tags || {}, lat = e.lat || (e.center && e.center.lat), lon = e.lon || (e.center && e.center.lon);
      if (!t.name || !lat || !lon) continue; const key = t.name.toLowerCase() + "|" + lat.toFixed(4) + lon.toFixed(4); if (seen.has(key)) continue; seen.add(key);
      out.push({ id: e.type[0] + e.id, name: t.name, c: [+lat, +lon], cat: catOf({ cuisine: t.cuisine, name: t.name, amenity: t.amenity }), cuisine: (t.cuisine || "").replace(/_/g, " ").replace(/;/g, ", "), oh: t.opening_hours || "", veg: /yes|only/.test(t["diet:vegetarian"] || "") || /yes|only/.test(t["diet:vegan"] || ""), vegan: /yes|only/.test(t["diet:vegan"] || ""), addr: [t["addr:street"], t["addr:housenumber"]].filter(Boolean).join(" ") });
    }
    return out;
  }
  function mergeTips(list) {
    const geo = LS.get("lotd-foodgeo", {}) || {};
    list.forEach(f => { delete f.tip; });
    for (const tp of foodTips) {
      const rx = new RegExp(tp.match || tp.name, "i"), hits = list.filter(f => rx.test(f.name));
      if (hits.length) hits.forEach(f => { f.tip = tp; if (tp.cat && f.cat === "overig") f.cat = tp.cat; });
      else { const c = geo[tp.name]; list.push({ id: "tip-" + tp.name, name: tp.name, c: c || null, cat: tp.cat || "overig", cuisine: "", oh: tp.oh || "", veg: false, addr: (tp.addr || "").replace(/, \d{4} ?[A-Z]{2}/, "").replace(/, Rotterdam$/, ""), tip: tp }); }
    }
    return list;
  }
  function geoTips() {
    const geo = LS.get("lotd-foodgeo", {}) || {}, todo = foodTips.filter(tp => tp.addr && !geo[tp.name] && FOOD.some(f => f.id === "tip-" + tp.name)); if (!todo.length || navigator.onLine === false) return;
    let k = 0; const next = () => { if (k >= todo.length) return; const tp = todo[k++];
      fetch("https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=nl&bounded=1&viewbox=4.38,51.98,4.58,51.86&q=" + encodeURIComponent(tp.addr), { headers: { Accept: "application/json" } }).then(r => r.json()).then(j => { if (j && j[0]) { geo[tp.name] = [+(+j[0].lat).toFixed(5), +(+j[0].lon).toFixed(5)]; LS.set("lotd-foodgeo", geo); const f = FOOD.find(x => x.id === "tip-" + tp.name); if (f) { f.c = geo[tp.name]; if (route().p === "map" && mapMode === "food") { drawFoodLayer(); paintFoodList(); } } } }).catch(() => {}).then(() => setTimeout(next, 1100)); };
    next();
  }
  const FOOD_Q = `[out:json][timeout:25];(nwr["amenity"="fast_food"](51.903,4.455,51.935,4.495);nwr["amenity"="food_court"](51.903,4.455,51.935,4.495);nwr["amenity"="restaurant"]["cuisine"~"pizza|kebab|burger|falafel|shawarma|noodle|ramen|dumpling|friture|fries|sandwich|chicken|surinamese|vietnamese|poke|bagel"](51.903,4.455,51.935,4.495););out center tags;`;
  let foodErr = "";
  function loadFood(force) {
    const cached = LS.get(FOOD_KEY, null);
    if (cached && cached.list && !FOOD.length) { FOOD = mergeTips(cached.list.slice()); foodState = "ok"; }
    if (!force && cached && cached.list && cached.list.length && Date.now() - cached.t < FOOD_TTL) { geoTips(); return Promise.resolve(); }
    if (foodState === "loading") return Promise.resolve();
    if (navigator.onLine === false) { if (!FOOD.length) { FOOD = mergeTips([]); foodState = "offline"; } return Promise.resolve(); }
    if (!FOOD.length) foodState = "loading";
    const take = (els, src) => { const list = buildFood(els); if (list.length < 5) throw new Error(src + ": " + list.length); LS.set(FOOD_KEY, { t: Date.now(), list }); FOOD = mergeTips(list.slice()); foodState = "ok"; foodErr = ""; };
    const snap = () => fetch("food.json", { cache: "no-cache" }).then(r => { if (!r.ok) throw new Error("food.json " + r.status); return r.json(); }).then(j => take(j.elements, "food.json"));
    const urls = ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter", "https://overpass.private.coffee/api/interpreter"];
    const live = i => fetch(urls[i], { method: "POST", body: "data=" + encodeURIComponent(FOOD_Q), headers: { "Content-Type": "application/x-www-form-urlencoded" } }).then(r => { if (!r.ok) throw new Error("Overpass " + r.status); return r.json(); }).then(j => take(j.elements, "Overpass")).catch(e => { if (i + 1 < urls.length) return live(i + 1); throw e; });
    return snap().catch(() => live(0)).then(() => geoTips()).catch(e => { foodErr = String(e && e.message || e); if (!FOOD.length) { FOOD = mergeTips([]); } foodState = FOOD.some(f => !String(f.id).startsWith("tip-")) ? "ok" : "error"; geoTips(); });
  }
  const nearestVenue = c => { let best = null; mapGroups().forEach(g => { if (!g.c) return; const d = distM(c, g.c); if (!best || d < best.d) best = { name: g.name, d }; }); return best; };
  const foodFiltered = () => { const q = fold(foodQ.trim()); return FOOD.filter(f => (foodCat === "all" || f.cat === foodCat) && (!foodVeg || f.veg) && (!q || fold([f.name, f.cuisine, catName(f.cat), f.addr].join(" ")).includes(q)) && (!foodOpenOnly || ohState(f.oh).open === true)); };
  const foodSort = list => list.map(f => { const d = f.c && here ? distM(here.c, f.c) : null, st = ohState(f.oh), nv = f.c ? nearestVenue(f.c) : null, base = d != null ? d : nv ? nv.d : 3000;
    return { f, d, st, k: base - (f.tip ? 150 : 0) + (st.open === true ? 0 : st.open === false ? 5000 : 350) }; }).sort((a, b) => a.k - b.k || a.f.name.localeCompare(b.f.name));
  const fItem = ({ f, d, st }) => { const nv = !d && f.c ? nearestVenue(f.c) : null, where = d != null ? distTxt(d) : nv ? L(`${walkMin(nv.d)} min van ${nv.name}`, `${walkMin(nv.d)} min from ${nv.name}`) : (f.addr || "Rotterdam");
    return `<button class="fd-item${f.tip ? " tip" : ""}" data-food="${esc(f.id)}"><span class="fd-ico" aria-hidden="true">${f.tip ? "★" : catIcon(f.cat)}</span><span class="fd-main"><b>${esc(f.name)}${f.tip ? `<em class="fd-tip">LOTD-tip</em>` : ""}</b><small>${catName(f.cat)}${f.cuisine && f.cat === "overig" ? " · " + esc(f.cuisine) : ""}${f.veg ? " · " + L("vega", "veggie") : ""} · ${where}</small></span><span class="fd-st ${st.open === true ? "o" : st.open === false ? "c" : "u"}">${st.open === true ? (st.allDay ? "24/7" : L("tot ", "till ") + hm(st.until)) : st.open === false ? L("dicht", "closed") : "?"}</span></button>`; };
  const catIcon = k => ({ friet: "🍟", burger: "🍔", pizza: "🍕", oost: "🥙", azie: "🥡", broodjes: "🥪", kip: "🍗", hal: "🏛" }[k] || "🍽");
  const foodListHtml = () => {
    if (foodState === "loading" && !FOOD.length) return `<p class="fd-empty">${L("Eetplekken laden…", "Loading places to eat…")}</p>`;
    const all = foodSort(foodFiltered()), shown = all.slice(0, foodShow);
    const note = foodState === "error" ? `<p class="fd-note">${L("Kon de eetplekken niet laden. Alleen de LOTD-tips worden getoond.", "Couldn't load places to eat. Showing LOTD tips only.")}${foodErr ? ` <small>(${esc(foodErr)})</small>` : ""} <button class="lnk" data-food-retry>${L("Opnieuw", "Retry")}</button></p>` : foodState === "offline" ? `<p class="fd-note">${L("Offline: alleen de LOTD-tips.", "Offline: LOTD tips only.")}</p>` : "";
    return note + `<p class="fd-count">${all.length} ${L(all.length === 1 ? "plek" : "plekken", all.length === 1 ? "place" : "places")}${here ? L(" · dichtstbij eerst", " · nearest first") : ` · <button class="lnk" data-food-loc>${L("Sorteer op mijn locatie", "Sort by my location")}</button>`}</p>` + (shown.length ? shown.map(fItem).join("") : `<p class="fd-empty">${L("Niets gevonden. Probeer een ander filter.", "Nothing found. Try another filter.")}</p>`) + (all.length > shown.length ? `<button class="fd-more" data-food-more>${L(`Toon meer (${all.length - shown.length})`, `Show more (${all.length - shown.length})`)}</button>` : "") + `<p class="fd-src">${L("Bron: OpenStreetMap-bijdragers. Openingstijden kunnen afwijken.", "Source: OpenStreetMap contributors. Opening hours may differ.")}</p>`;
  };
  const foodPanel = () => `<div class="fd-panel"><div class="fd-search"><input id="fq" type="search" placeholder="${L("Zoek friet, pizza, falafel…", "Search fries, pizza, falafel…")}" value="${esc(foodQ)}" autocomplete="off"></div><div class="fd-chips" role="group" aria-label="${L("Soort eten", "Type of food")}">${FOOD_CATS.filter(c => c[0] === "all").map(([k, nl, en]) => `<button class="${foodCat === k ? "on" : ""}" data-food-cat="${k}" aria-pressed="${foodCat === k}">${L(nl, en)}</button>`).join("")}<button class="${foodOpenOnly ? "on" : ""}" data-food-open aria-pressed="${foodOpenOnly}">${L("Nu open", "Open now")}</button><button class="${foodVeg ? "on" : ""}" data-food-veg aria-pressed="${foodVeg}">${L("Vega", "Veggie")}</button>${FOOD_CATS.filter(c => c[0] !== "all").map(([k, nl, en]) => `<button class="${foodCat === k ? "on" : ""}" data-food-cat="${k}" aria-pressed="${foodCat === k}">${k === "all" ? L(nl, en) : catIcon(k) + " " + L(nl, en)}</button>`).join("")}</div><div id="food-list">${foodListHtml()}</div></div>`;
  const paintFoodList = () => { const el = document.getElementById("food-list"); if (el) { el.innerHTML = foodListHtml(); trNode(el); } };
  const foodSheet = f => {
    const st = ohState(f.oh), nv = f.c ? nearestVenue(f.c) : null, d = f.c && here ? distM(here.c, f.c) : null;
    return `<div data-foodsheet><div class="m-sub">${catName(f.cat)}${f.cuisine ? " · " + esc(f.cuisine) : ""}</div><h2>${esc(f.name)}</h2>${f.tip ? `<div class="fd-tipbox"><b>LOTD-tip</b>${esc(L(f.tip.nl, f.tip.en))}</div>` : ""}
      <div class="fd-stbig ${st.open === true ? "o" : st.open === false ? "c" : "u"}">${stateTxt(st)}</div>
      ${f.c ? `<div class="m-row m-route">${sv(SI.pin)}<a href="${routeUrl(f.c)}" target="_blank" rel="noopener"><b>${esc(f.addr || f.name)}</b><small>${d != null ? distTxt(d) + " · " : ""}${nv ? L(`${walkMin(nv.d)} min lopen van ${nv.name}`, `${walkMin(nv.d)} min walk from ${nv.name}`) : "Rotterdam"} · ${L("route", "directions")} ↗</small></a><button class="m-walk" data-here="${f.c[0]},${f.c[1]}">${sv(SI.foot, 18)}<b>${L("Looptijd", "Walk time")}</b></button></div>` : `<p>${esc(f.addr || "")}</p>`}
      ${f.oh ? `<p class="fd-oh">${esc(f.oh)}</p>` : ""}${f.veg ? `<p class="fd-oh">${f.vegan ? L("Veganistische opties", "Vegan options") : L("Vegetarische opties", "Vegetarian options")}</p>` : ""}</div>`;
  };
  const openFood = id => { const f = FOOD.find(x => x.id === id); if (!f) return; sheet = foodSheet(f); renderModal(); if (lmap && f.c) lmap.setView(f.c, Math.max(lmap.getZoom(), 16)); };
  function drawFoodLayer() {
    if (!lmap || !window.L) return; const Lf = window.L;
    if (foodLayer) { try { lmap.removeLayer(foodLayer); } catch (e) {} foodLayer = null; }
    document.getElementById("mapwrap") && document.getElementById("mapwrap").classList.toggle("food", mapMode === "food");
    if (mapMode !== "food") return;
    foodLayer = Lf.layerGroup();
    foodFiltered().filter(f => f.c).forEach(f => { const st = ohState(f.oh); const ic = Lf.divIcon({ className: "fd-pin" + (f.tip ? " tip" : "") + (st.open === false ? " closed" : ""), html: `<span>${f.tip ? "★" : catIcon(f.cat)}</span>`, iconSize: [30, 30], iconAnchor: [15, 15] });
      Lf.marker(f.c, { icon: ic, title: f.name, alt: f.name, keyboard: true }).on("click", () => openFood(f.id)).addTo(foodLayer); });
    foodLayer.addTo(lmap);
  }
  window.__lotdFoodApply = () => { foodTips = window.__lotdFoodTips; if (FOOD.length) FOOD = mergeTips(FOOD.filter(f => !String(f.id).startsWith("tip-"))); };
  document.addEventListener("input", e => { if (e.target.id !== "fq") return; e.stopImmediatePropagation(); foodQ = e.target.value; foodShow = 40; paintFoodList(); drawFoodLayer(); }, true);
  document.addEventListener("click", e => {
    const tg = e.target, c = sel => tg.closest && tg.closest(sel), stop = () => e.stopImmediatePropagation(); let b;
    if ((b = c("[data-mapmode]"))) { stop(); mapMode = b.dataset.mapmode; LS.set("lotd-map-mode", mapMode); if (mapMode === "food") loadFood().then(() => { if (route().p === "map") { paintFoodList(); drawFoodLayer(); } }); render(true); return; }
    if ((b = c("[data-food]"))) { stop(); if (sheet) { sheet = null; } openFood(b.dataset.food); return; }
    if ((b = c("[data-food-cat]"))) { stop(); foodCat = b.dataset.foodCat; foodShow = 40; document.querySelectorAll("[data-food-cat]").forEach(x => { x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", String(x === b)); }); paintFoodList(); drawFoodLayer(); return; }
    if ((b = c("[data-food-open]"))) { stop(); foodOpenOnly = !foodOpenOnly; b.classList.toggle("on", foodOpenOnly); b.setAttribute("aria-pressed", String(foodOpenOnly)); paintFoodList(); drawFoodLayer(); return; }
    if ((b = c("[data-food-veg]"))) { stop(); foodVeg = !foodVeg; b.classList.toggle("on", foodVeg); b.setAttribute("aria-pressed", String(foodVeg)); paintFoodList(); drawFoodLayer(); return; }
    if (c("[data-food-more]")) { stop(); foodShow += 40; paintFoodList(); return; }
    if (c("[data-food-retry]")) { stop(); foodState = "idle"; loadFood(true).then(() => { paintFoodList(); drawFoodLayer(); }); paintFoodList(); return; }
    if (c("[data-food-loc]")) { stop(); if (!navigator.geolocation) return; navigator.geolocation.getCurrentPosition(p => { here = { c: [p.coords.latitude, p.coords.longitude], t: Date.now() }; paintFoodList(); }, () => {}, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }); return; }
    if (c("[data-food-map]")) { stop(); mapMode = "food"; LS.set("lotd-map-mode", "food"); go("/map"); return; }
  }, true);

  /* ---- klikken (vóór de bestaande afhandeling) ---- */
  document.addEventListener("click", e => {
    const tg = e.target, stop = () => e.stopImmediatePropagation(), c = sel => tg.closest && tg.closest(sel);
    if (tg.classList && tg.classList.contains("ov") && (genreOpen || sheet)) { stop(); if (sheet) { sheet = null; renderModal(); } else { genreOpen = false; renderModal(); render(true); } return; }
    if (c("[data-close-sheet]")) { stop(); sheet = null; renderModal(); return; }
    if (c("[data-genres]")) { stop(); genreOpen = true; renderModal(); return; }
    if (c("[data-close-genres]")) { stop(); genreOpen = false; renderModal(); render(true); return; }
    if (c("[data-no-genres]")) { stop(); selGenres = []; document.getElementById("modal").innerHTML = genreSheet(); skipModal = true; render(true); skipModal = false; return; }
    const gc = c("[data-genre]"); if (gc) { stop(); const g = gc.dataset.genre; selGenres = gc.checked ? [...selGenres, g] : selGenres.filter(x => x !== g); skipModal = true; render(true); skipModal = false; return; }
    if (c("[data-menu]")) { stop(); openMenu(); return; }
    { const b = c("[data-aa-set]"); if (b) { stop(); big = b.dataset.aaSet === "1"; localStorage.setItem("lotd-big", big ? "1" : "0"); document.documentElement.classList.toggle("big", big); paintCtl(); refreshMenu(); return; } }
    if (c("[data-install]")) { stop(); if (deferred) { deferred.prompt(); } else if (iosDevice()) { sheet = iosInstallSheet(); renderModal(); } else { sheet = `<h2>${L("Installeer de app", "Install the app")}</h2><p>${L("Open het browsermenu (⋮) en kies ‘App installeren’ of ‘Toevoegen aan startscherm’.", "Open the browser menu (⋮) and choose ‘Install app’ or ‘Add to Home screen’.")}</p>`; renderModal(); } return; }
    if (c("[data-share-app]")) { stop(); const u = location.origin + "/"; if (navigator.share) navigator.share({ title: "Left of the Dial 2026 · Timetable", url: u }).catch(() => {}); else if (navigator.clipboard) navigator.clipboard.writeText(u).then(() => { post("saved", { text: () => L("Link gekopieerd", "Link copied"), x: true }); }); return; }
    { const b = c("[data-layout]"); if (b) { stop(); ttLayout = b.dataset.layout; LS.set("lotd-layout", ttLayout); render(true); if (ttLayout === "grid") setTimeout(() => { if (document.querySelector(".tt .now")) scrollToNow(false); }, 0); return; } }
    { const b = c("[data-pref]"); if (b) { stop(); pref = b.dataset.pref; favOnly = pref !== "all"; sheet = filterHtml(); render(true); return; } }
    if (c("[data-filter]")) { stop(); sheet = filterHtml(); renderModal(); return; }
    if (c("[data-filter-clear]")) { stop(); ooOnly = false; if (!onFavPage()) { pref = "all"; favOnly = false; } selGenres = []; hiddenVenues = []; saveVenues(); if (friend.on && friend.ids.length) { friend.on = false; saveFriend(); } if (sheet && sheet.indexOf("data-filtersheet") > -1) sheet = filterHtml(); render(true); return; }
    if (c("[data-fl-fav]")) { stop(); favOnly = !favOnly; sheet = filterHtml(); render(true); return; }
    if (c("[data-fl-oo]")) { stop(); ooOnly = !ooOnly; if (ooOnly && day !== "v" && day !== "z") day = "v"; sheet = filterHtml(); render(true); return; }
    if (c("[data-fl-friend]")) { stop(); friend.on = !friend.on; saveFriend(); sheet = filterHtml(); render(true); return; }
    if (c("[data-fl-genres]")) { stop(); sheet = null; genreOpen = true; renderModal(); return; }
    if (c("[data-fl-venues]")) { stop(); sheet = null; venueOpen = true; renderModal(); return; }
    if (c("[data-to-now]")) { stop(); scrollToNow(true); return; }
    if (c("[data-now-fav]")) { stop(); nowFav = true; render(true); return; }
    if (c("[data-now-all]")) { stop(); nowFav = false; render(true); return; }
    if (c("[data-nowloc-refresh]")) { stop(); askHere(true); render(true); return; }
    if (c("[data-nowloc]")) { stop(); const on = !locOn(); LS.set("lotd-now-loc", on); hereErr = ""; if (on) askHere(true); else here = null; render(true); return; }
    const mu = c("[data-must]"); if (mu) { stop(); const id = mu.dataset.must; if (!isFav(id)) { favs = [...favs, id]; saveFavs(); } stars = isStar(id) ? stars.filter(x => x !== id) : [...stars, id]; saveStars(); render(true); return; }
    const it = c("[data-int]"); if (it) { stop(); const id = it.dataset.int; if (isStar(id)) { stars = stars.filter(x => x !== id); saveStars(); render(true); return; } toggleFav(id); return; }
    const st = c("[data-star]"); if (st) { stop(); const id = st.dataset.star; if (!isFav(id)) { favs = [...favs, id]; saveFavs(); } stars = isStar(id) ? stars.filter(x => x !== id) : [...stars, id]; saveStars(); render(true); return; }
    const hb = c("[data-here]"); if (hb) { stop(); const q = hb.dataset.here.split(",").map(Number), setT = t => { const b = hb.querySelector("b"), sm = hb.querySelector("small"); (b || hb).textContent = t; if (sm) sm.textContent = ""; };
      const km = m => m < 1000 ? Math.round(m / 10) * 10 + " m" : (m / 1000).toFixed(1) + " km";
      setT(L("Locatie bepalen…", "Locating…"));
      if (!navigator.geolocation) { setT(L("Locatie niet beschikbaar", "Location unavailable")); return; }
      navigator.geolocation.getCurrentPosition(p => { const m = distM([p.coords.latitude, p.coords.longitude], q), min = Math.max(1, Math.ceil(m * 1.3 / 80));
        setT(m > 15000 ? L("Je bent ver weg (" + Math.round(m / 1000) + " km). Gebruik de routelink.", "You are far away (" + Math.round(m / 1000) + " km). Use the route link.") : L("Ca. " + min + " min lopen (" + km(m) + ")", "About " + min + " min walk (" + km(m) + ")")); },
        () => setT(L("Geen toegang tot je locatie", "No access to your location")), { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }); return; }
    const ic = c("[data-ics]"); if (ic) { stop(); const a = act(ic.dataset.ics); if (a) exportIcs([a], slug(a.name) + ".ics"); return; }
    if (c("[data-ics-all]")) { stop(); const l = ACTS.filter(a => isFav(a.id)).sort((x, y) => DAYS.findIndex(d => d.id === x.day) - DAYS.findIndex(d => d.id === y.day) || byTime(x, y)); if (l.length) exportIcs(l, "lotd-2026-favorieten.ics"); else alert(L("Je hebt nog geen favorieten.", "You have no favorites yet.")); return; }
    if (c("[data-friend]")) { stop(); friend.on = !friend.on; saveFriend(); render(true); return; }
    if (c("[data-friend-clear]")) { stop(); friend = { ids: [], on: true }; saveFriend(); render(true); return; }
    if (c("[data-compare-shared]")) { stop(); friend = { ids: (sharedIds || []).slice(), on: true }; saveFriend(); sharedIds = null; sharedReadOnly = false; history.replaceState(null, "", location.pathname + location.search + "#/favorites"); render(); return; }
    const lg = c("[data-lang]"); if (lg) { stop(); setLang(lg.dataset.lang); refreshMenu(); return; }
    if (c("[data-aa]")) { stop(); big = !big; localStorage.setItem("lotd-big", big ? "1" : "0"); document.documentElement.classList.toggle("big", big); paintCtl(); return; }
    const sa = c("[data-st-act]"); if (sa) { stop(); const p = S[sa.dataset.stAct]; if (p && p.fn) p.fn(); return; }
    const sx = c("[data-st-x]"); if (sx) { stop(); const k = sx.dataset.stX; if (k === "notice") LS.set("lotd-notice-x", S[k].key); if (k === "install") LS.set("lotd-install-x", true); drop(k); return; }
  }, true);
  document.addEventListener("keydown", e => { if (e.key === "Escape") { if (sheet) { sheet = null; renderModal(); } else if (genreOpen) { genreOpen = false; renderModal(); render(true); } else if (venueOpen) { venueOpen = false; renderModal(); render(true); } } });

  const css = document.createElement("style");
  css.textContent = `header .titlebar h2{text-transform:uppercase!important;letter-spacing:-.01em!important}
.tb-title{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center}.tb-title h2{flex:none!important}
.tb-sub{font:700 13px/1.2 Arial,Helvetica,sans-serif;color:#1717ff;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-variant-numeric:tabular-nums;min-height:16px}.tb-sub b{font-size:15px}.tb-sub .cd-lab{margin-right:5px}
.tb-sub .live-dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#1717ff;margin-right:6px;vertical-align:1px;animation:lotdPulse 1.4s ease-in-out infinite}
@keyframes lotdPulse{50%{opacity:.25}}@media (prefers-reduced-motion:reduce){.tb-sub .live-dot{animation:none}}
html.big .tb-sub{font-size:15px}html.big .tb-sub b{font-size:17px}
header:before{content:none!important;display:none!important}
.lotd-ticker{position:absolute;left:0;right:0;top:0;height:34px;background:#050505;color:#fff;overflow:hidden;display:flex;align-items:center;z-index:1}
.lt-track{display:flex;flex:none;white-space:nowrap;animation:lotdTick 40s linear infinite;will-change:transform}.lt-track span{flex:none;font:11px Arial,Helvetica,sans-serif;letter-spacing:.12em;padding-right:0}
@keyframes lotdTick{from{transform:translate3d(0,0,0)}to{transform:translate3d(-50%,0,0)}}
@media (prefers-reduced-motion:reduce){.lt-track{animation:none}}
html.big{width:auto!important;padding:0!important;border:0!important;border-radius:0!important;min-height:0!important;color:inherit!important;font-weight:inherit!important}
#statusbar{display:none!important}body:has(#modal .ov) #lotd-status{display:none!important}
html.big{--labw:132px}html.big .lab{font-size:13px!important}html.big .lab.long{font-size:12px!important}html.big .lab.xlong{font-size:11px!important}
[data-filtersheet] .sheet-actions button{min-height:48px;font-size:15px!important;font-weight:700}
header .brandbar{display:none!important}header{padding-bottom:0!important}
.titlebar{display:flex!important;align-items:center!important;gap:10px!important;flex-wrap:nowrap!important;padding:8px 0 10px;margin-top:30px}
.tb-logo{flex:none;width:44px;height:44px;padding:0;border:0;background:none;border-radius:50%}.tb-logo img{width:44px!important;height:44px!important;margin:0!important;border-radius:50%;display:block}
header .titlebar h2{flex:1;min-width:0;margin:0!important;font-size:28px!important;line-height:1.05!important;letter-spacing:-.03em!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tb-tools{display:flex;align-items:center;gap:6px;flex:none}.tb-btn{width:44px;height:44px;display:flex;align-items:center;justify-content:center;background:#fff;color:#000;border:2px solid #000;padding:0}.tb-btn.on{background:#000;color:#fff}.tb-btn:active{background:#1717ff;color:#fff;border-color:#1717ff}
.tb-off{font:700 11px Arial,sans-serif;background:#444;color:#fff;padding:4px 7px;letter-spacing:.04em;text-transform:uppercase}.tb-off[hidden]{display:none}
@media(min-width:700px){header .titlebar h2{font-size:36px!important}.tb-logo,.tb-logo img{width:52px!important;height:52px!important}}
#lotd-status{position:fixed;left:12px;right:12px;bottom:calc(84px + env(safe-area-inset-bottom,0px));z-index:1500;max-width:520px;margin:0 auto;box-shadow:0 6px 20px rgba(0,0,0,.28);padding:12px 14px!important;animation:lotdToast .22s ease-out}
@keyframes lotdToast{from{transform:translateY(12px);opacity:0}to{transform:none;opacity:1}}
.tt-tools{gap:8px!important}.flt-btn{display:inline-flex!important;align-items:center;gap:6px}.flt-btn.on{background:#000!important;color:#fff!important;border-color:#000!important}.flt-clear{border:0!important;background:none!important;text-decoration:underline;padding:8px 6px!important}
.fl-row{display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:14px 0;min-height:60px;background:none;border:0;border-top:1px solid #ddd;color:#000}.fl-row span{flex:1;min-width:0}.fl-row b{display:block;font-size:17px}.fl-row small{display:block;font-size:14px;color:#555;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fl-sw{flex:none;width:48px;height:28px;border:2px solid #000;background:#fff;position:relative}.fl-sw:after{content:"";position:absolute;top:3px;left:3px;width:18px;height:18px;background:#000;transition:left .15s}.fl-sw.on{background:#1717ff;border-color:#1717ff}.fl-sw.on:after{left:23px;background:#fff}.fl-chev{flex:none;font-style:normal;font-size:26px;line-height:1}
[data-filtersheet] .sheet-actions{margin-top:16px}
.mn-lab{font:700 13px Arial,sans-serif;text-transform:uppercase;letter-spacing:.06em;color:#555;margin:16px 0 6px}.mn-seg{display:flex;border:2px solid #000}.mn-seg button{flex:1;min-height:48px;background:#fff;color:#000;border:0;font-size:16px;font-weight:700}.mn-seg button+button{border-left:2px solid #000}.mn-seg button.on{background:#000;color:#fff}.mn-seg .mn-big{font-size:19px}
.mn-list{margin-top:18px}.mn-row{display:block;width:100%;text-align:left;padding:13px 0;min-height:56px;background:none;border:0;border-top:1px solid #ddd;color:#000;font-size:17px;font-weight:700;text-decoration:none}.mn-row small{display:block;font-size:14px;font-weight:400;color:#555;margin-top:2px}.mn-meta{font-size:13px!important;color:#666;margin-top:12px!important}
.fav-bar{display:flex;align-items:center;gap:8px;padding:12px 0 6px;font-size:15px}.fav-bar span{flex:1;min-width:0}.fav-bar button{min-height:44px;padding:0 12px;border:2px solid #000;background:#fff;color:#000;font-weight:700;font-size:15px;display:inline-flex;align-items:center;gap:6px}.fav-bar .fav-share{background:#000;color:#fff}
.m-route{display:flex!important;align-items:center;gap:10px}.m-route a{flex:1;min-width:0;display:flex;gap:12px;align-items:flex-start;color:inherit;text-decoration:none}.m-route a b{color:#1717ff;text-decoration:underline}.m-walk{flex:none;display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:0 12px;border:2px solid #1717ff;background:#fff;color:#1717ff;font-size:14px}.m-walk b{font-size:14px}
.m-when .m-acc{display:flex;align-items:center;gap:6px;margin-top:8px;font-size:14px;color:#333;font-weight:400}.m-when .m-acc .ico2{flex:none}
nav button{font-size:12px!important}
.tt-tools{flex-wrap:nowrap!important;overflow-x:auto;scrollbar-width:none}.tt-tools::-webkit-scrollbar{display:none}.tt-tools>button{flex:none;white-space:nowrap;flex-direction:row!important;gap:6px}.to-now{background:#1717ff!important;color:#fff!important;border-color:#1717ff!important;display:inline-flex;align-items:center;gap:6px;font-weight:700}.to-now .ico2{flex:none}
.nn{padding-top:10px}.nn-top{display:flex;align-items:center;gap:12px;margin:4px 0 10px}.nn-clock{display:flex;flex-direction:column;line-height:1.1}.nn-clock b{font-size:28px;font-variant-numeric:tabular-nums;letter-spacing:-.02em}.nn-clock span{font-size:13px;color:#555}.nn-filter{margin-left:auto;display:flex;border:2px solid #000}.nn-filter button{min-height:44px;padding:0 12px;background:#fff;color:#000;border:0;font-size:14px;font-weight:700}.nn-filter button.on{background:#000;color:#fff}
.nn-loc{display:flex;align-items:center;gap:10px;width:100%;box-sizing:border-box;margin:0 0 14px;padding:10px 12px;border:2px solid #1717ff;background:#fff;color:#000;text-align:left;font-size:15px}.nn-loc .ico2{color:#1717ff;flex:none}.nn-loc span{flex:1}.nn-loc small{display:block;font-size:13px;color:#555;margin-top:2px}.nn-loc b{color:#1717ff}.nn-loc.on{background:#1717ff;color:#fff}.nn-loc.on .ico2{color:#fff}.nn-loc.on button{min-height:40px;min-width:44px;background:#fff;color:#1717ff;border:0;font-weight:700;font-size:15px}
.nn-card{border:2px solid #000;margin:0 0 12px;background:#fff}.nn-card.at{border-color:#1717ff;box-shadow:0 0 0 2px #1717ff}.nn-head{display:flex;align-items:center;gap:8px;width:100%;padding:10px 12px;background:#000;color:#fff;border:0;text-align:left;min-height:48px}.nn-card.at .nn-head{background:#1717ff}.nn-head h3{margin:0;font-size:18px;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.nn-dist{font-size:13px;font-weight:700;white-space:nowrap;background:#fff;color:#000;padding:3px 7px}.nn-dist.here{color:#1717ff}.nn-chev{font-size:22px;line-height:1;opacity:.8}
.nn-act{display:flex;align-items:center;gap:10px;width:100%;padding:11px 12px;background:#fff;color:#000;border:0;border-top:1px solid #ddd;text-align:left;min-height:56px;border-left:6px solid transparent}.nn-act:first-of-type{border-top:0}.nn-act.must{border-left-color:#1717ff}.nn-act.int{border-left-color:#a9baff}.nn-tag{flex:none;min-width:50px;font-size:14px;font-weight:700;font-variant-numeric:tabular-nums;color:#555}.nn-act.nn-live .nn-tag{color:#fff;background:#1717ff;text-align:center;padding:3px 0;letter-spacing:.06em}.nn-main{flex:1;min-width:0}.nn-main b{display:block;font-size:17px;line-height:1.25}.nn-act:not(.nn-live) .nn-main b{font-weight:600}.nn-main small{display:block;font-size:13px;color:#555}.nn-fav{font-style:normal;margin-left:6px;font-size:14px;color:#000}.nn-fav.must{color:#1717ff}.nn-bar{display:block;height:4px;background:#e3e6ff;margin-top:6px}.nn-bar i{display:block;height:100%;background:#1717ff}.nn-rest{flex:none;font-size:13px;color:#333;text-align:right;white-space:nowrap}.nn-act.nn-live .nn-rest{font-weight:700;color:#000}
html.big .nn-main b{font-size:20px}html.big .nn-head h3{font-size:21px}html.big .nn-rest,html.big .nn-tag{font-size:16px}
.mapwrap{position:relative;isolation:isolate;width:100%;background:#e8e8e8}#lmap{position:absolute;inset:0;z-index:0}.mapbtns{position:absolute;right:12px;bottom:16px;z-index:500;display:flex;flex-direction:column;gap:8px}.mapbtns button{width:48px;height:48px;background:#fff;color:#000;border:2px solid #000;border-radius:0;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.25)}.mapbtns button:active{background:#1717ff;color:#fff}.mapnote{position:absolute;left:12px;right:70px;bottom:16px;z-index:500;font-size:13px;background:#fff;border:1px solid #000;padding:6px 8px;empty-cells:hide}.mapnote:empty{display:none}
.osm-grey{filter:grayscale(1) contrast(.9) brightness(1.08)}.lotd-pin{background:none!important;border:none!important}.lotd-pin .pin{display:block;width:32px;height:32px;margin:7px;font-size:7px;line-height:26px;transition:all .15s;border-radius:50%;background:#000;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.45);overflow:hidden;position:relative;color:#fff;font-family:Arial,sans-serif;font-weight:700;text-align:center}.lotd-pin .pin img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.lotd-pin .pin i{font-style:normal}.lotd-pin em{display:none;position:absolute;left:50%;top:49px;transform:translateX(-50%);white-space:nowrap;font:700 12px Arial,sans-serif;font-style:normal;background:#fff;color:#000;padding:1px 5px;border:1px solid #000}.zl .lotd-pin .pin{width:46px;height:46px;margin:0;font-size:9px;line-height:40px}.zl .lotd-pin em{display:block}.leaflet-container{font-family:Arial,sans-serif}.leaflet-control-zoom a{width:40px!important;height:40px!important;line-height:40px!important;border-radius:0!important;color:#000!important}
.mapfb{padding:16px;overflow:auto;height:100%}.mapfb button{display:block;width:100%;text-align:left;min-height:48px;margin:6px 0;padding:8px 12px;border:2px solid #000;background:#fff;font-size:16px;font-weight:700}
.m-coord{font-size:12px!important;color:#777;margin:0 0 4px 34px}.m-list{margin-top:8px}.m-act{display:flex;gap:12px;width:100%;text-align:left;align-items:flex-start;padding:12px 0;border:0;border-top:1px solid #ddd;background:none;min-height:52px;color:#000}.m-act time{font-weight:700;color:#1717ff;min-width:58px;font-size:16px;font-variant-numeric:tabular-nums}.m-act b{font-size:16px;display:block}.m-act small{display:block;color:#555;font-size:13px}.m-act.cx{opacity:.6}.m-act .mk{color:#000;font-size:14px}.m-act .mk.must{color:#1717ff}.m-empty{padding:16px 0;color:#555}
a.oth{text-decoration:none;color:inherit;box-sizing:border-box;display:block}.when{font-style:normal;font-weight:700;color:var(--accent)}.checkrow span{font-size:12px}
.hint{font-style:normal;color:var(--accent);font-weight:700}.upd{padding:14px 16px 22px;font-size:11px;color:var(--muted);text-align:center}
.fr{display:inline-block;width:9px;height:9px;border-radius:50%;background:#ff7a00;vertical-align:middle;margin-left:4px}.act .fr{position:absolute;right:6px;bottom:6px;margin:0;border:1px solid #fff}
.act.cancel{opacity:.5}.act.cancel b{text-decoration:line-through}.sheet s{opacity:.6}
#lotd-status{flex:none;display:none;align-items:center;gap:10px;padding:8px 14px;background:#1717ff;color:#fff;font:12px/1.35 Arial,Helvetica,sans-serif}#lotd-status.on{display:flex}#lotd-status.off{background:#444}
#lotd-status button{margin-left:auto;color:#fff;background:transparent;border:1px solid #fff;padding:0 10px;min-height:32px;font:700 11px Arial,Helvetica,sans-serif}#lotd-status button+button{margin-left:0}#lotd-status .sx{border:0;font-size:18px;padding:0 6px;min-width:32px}
.lnk{display:inline-block;background:none;border:0;padding:6px 0;margin:0;font:600 15px/1.35 Arial,Helvetica,sans-serif;color:#1717ff;text-decoration:underline;text-underline-offset:3px;text-align:left;cursor:pointer;min-height:36px}.lnk.info{margin:-2px 0 6px}.lnks{display:flex;flex-direction:column;align-items:flex-start;margin:8px 0 14px}
.rate{display:flex;gap:10px;margin-top:6px}.rate button{flex:1;min-height:56px;display:flex;align-items:center;justify-content:center;gap:8px;background:#fff;font:700 16px Arial,Helvetica,sans-serif;border-radius:0}.rate button i{font-style:normal;font-size:20px}
.rate .r-must{border:3px solid #1717ff;color:#1717ff}.rate .r-must.on{background:#1717ff;color:#fff}.rate .r-int{border:3px solid #050505;color:#050505}.rate .r-int.on{background:#050505;color:#fff}
.rt2{display:flex;flex:none}.hb.ri{color:#050505}.hb.rm{color:#1717ff}.hb .ico{display:block}.hb.on{background:transparent}.act .h{display:flex;align-items:center;top:6px!important;right:6px!important}.act .h .ico{display:block}
.act .h ~ b{padding-right:20px}
.act-sheet{padding-bottom:0!important}.act-sheet h2{margin:2px 44px 6px 0!important;font-size:30px;line-height:1.05}
.m-sub{font:600 13px Arial,Helvetica,sans-serif;letter-spacing:.04em;text-transform:uppercase;color:#444;margin:4px 44px 6px 0}
.lnk.info{font-size:14px;margin:0 0 14px;padding:0;min-height:0}
.m-when{border:2px solid #050505;padding:12px 14px;margin:0 0 12px}.m-when b{display:block;font:700 28px/1.05 Arial,Helvetica,sans-serif;letter-spacing:-.02em}.m-when span{display:block;margin-top:6px;font:600 15px Arial,Helvetica,sans-serif;color:#050505}
.m-note{background:#eeeeff;border-left:4px solid #1717ff;padding:8px 12px;margin:0 0 12px}.m-note p{margin:4px 0!important;font:14px/1.4 Arial,Helvetica,sans-serif!important}.m-note .clash{font-weight:700}
.m-rows{margin:0 0 4px}.m-row{display:flex;gap:12px;align-items:flex-start;width:100%;text-align:left;padding:12px 2px;border:0;border-top:1px solid #cfcfcf;background:none;color:#050505;text-decoration:none;font:15px/1.35 Arial,Helvetica,sans-serif;min-height:52px;cursor:default}
a.m-row,button.m-row{cursor:pointer}.m-row .ico2{flex:none;color:#1717ff;margin-top:1px}.m-row span{display:block;min-width:0}.m-row b{display:block;font-weight:700}.m-row small{display:block;color:#444;font-size:13px;margin-top:2px}a.m-row b,button.m-row b{color:#1717ff;text-decoration:underline;text-underline-offset:3px}
.act-sheet .rate{position:sticky;bottom:0;background:#fff;margin:10px -18px 0;padding:12px 18px calc(14px + env(safe-area-inset-bottom,0px));border-top:2px solid #050505}
.rate button .ico{flex:none}
.act .clash-marker ~ span.g{padding-right:24px}.act .clash-marker{position:absolute;right:5px;bottom:5px;top:auto!important;width:20px;height:20px;border-radius:50%;background:#fff!important;color:#050505!important;border:2px solid #050505;font:900 13px/16px Arial,Helvetica,sans-serif;font-style:normal;text-align:center}.act .fr{right:36px!important;bottom:9px!important}
.tt .act.act{background:#050505!important;color:#fff!important}.tt .act.act.must{background:#1717ff!important;color:#fff!important}.tt .act.act.int{background:#a9baff!important;color:#050505!important}
.tt .act.act.fav{border:0!important;box-shadow:none!important}.tt .act.int .h{color:#050505!important}.tt .act.int span,.tt .act.int .g{opacity:1!important}.tt .act.int .g{font-weight:600}.tt .act.int .fr{border-color:#050505}
.tt .act.after{background-image:repeating-linear-gradient(135deg,rgba(255,255,255,.14) 0 6px,transparent 6px 12px)}.tt .act.int.after{background-image:repeating-linear-gradient(135deg,rgba(0,0,0,.09) 0 6px,transparent 6px 12px)}
.titlebar{display:flex;align-items:flex-end;justify-content:space-between;gap:10px}.titlebar h2{margin-right:auto!important;min-width:0}
#lotd-ctl{display:flex;gap:6px;flex:none;margin-bottom:6px}#lotd-ctl button{color:#050505;background:#fff;border:2px solid #050505;font:700 14px Arial,Helvetica,sans-serif;height:44px;min-width:44px;padding:0 8px}#lotd-ctl button.on{background:#050505;color:#fff}
/* leesbaarheid op mobiel (WCAG 1.4.4/1.4.12): basis ruimer */
body{font-size:16px}header:before{font-size:11px!important}.brandcopy p{font-size:12px!important;white-space:normal!important}
.tick{font-size:12px!important}.lab{font-size:12px!important}.act b{font-size:15px!important}.act span{font-size:12px!important}.act .g{font-size:12px!important}
.item .t b{font-size:17px!important}.item .t span{font-size:14px!important}.meta{font-size:15px!important}.pill{font-size:13px!important;padding:6px 10px!important}
.seg button{font-size:15px!important}.tt-tools button{font-size:14px!important;min-height:44px!important}.oth{font-size:15px!important;min-height:48px}.grp{font-size:13px!important}
nav button{font-size:11px!important;letter-spacing:0!important;min-width:0;padding-left:0!important;padding-right:0!important}.upd{font-size:13px!important}#lotd-status{font-size:14px!important}#lotd-status button{min-height:44px!important}.det p,.sheet p{font-size:17px!important}.now-btn{font-size:13px!important;min-height:40px}

html.big body{font-size:19px}html.big .act b{font-size:18px!important}html.big .act span,html.big .act .g{font-size:14px!important}html.big .item .t b{font-size:20px!important}html.big .item .t span,html.big .meta{font-size:16px!important}html.big .seg button,html.big .tt-tools button,html.big .oth{font-size:17px!important}html.big .tick{font-size:14px!important}:root{--labw:112px}@media(min-width:700px){:root{--labw:120px}}.lab{width:var(--labw)!important;box-sizing:border-box;gap:6px;padding:0 6px!important}.lab .dot{flex:none;margin:0!important}.lab-t{min-width:0;overflow-wrap:break-word}.lab.long{letter-spacing:0!important;font-size:11px!important}.lab.xlong{font-size:10px!important}html.big .lab.long{font-size:12px!important}.tt .act .live{left:auto;right:4px;top:4px}
html.big .row{height:104px}html.big .pill,html.big .checkrow{font-size:15px!important}html.big nav button{font-size:13px!important}`;
  { const th = document.getElementById("theme-css"); if (th) document.head.insertBefore(css, th); else document.head.appendChild(css); }

  setInterval(() => { if (route().p === "now" && !openId && !venueOpen && !genreOpen && !sheet) render(true); }, 30000);
  setInterval(() => { if (document.visibilityState === "visible") checkLineup(); }, 300000);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") checkLineup(); });
  window.addEventListener("online", () => { netState(); checkLineup(); }); window.addEventListener("offline", netState);
  paintCtl(); netState(); render(); checkLineup();
})();
