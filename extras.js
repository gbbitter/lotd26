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
  const SI = { pin: '<path d="M12 22s7-6.2 7-12A7 7 0 0 0 5 10c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>', walk: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>', acc: '<circle cx="12" cy="4.5" r="2"/><path d="M5 9l7 1 7-1M12 10v5l-3 6M12 15l3 6"/>', cal: '<rect x="3" y="5" width="18" height="16"/><path d="M3 10h18M8 3v4M16 3v4"/>' };
  const mark = id => isStar(id) ? dial("must", 14) : isFav(id) ? dial("int", 14) : "";
  toggleFav = function (id) { const was = isFav(id); favs = was ? favs.filter(x => x !== id) : [...favs, id]; saveFavs(); if (was && stars.includes(id)) { stars = stars.filter(x => x !== id); saveStars(); } render(true); };
  const clashes = a => a.cancelled ? [] : getClashes(a).filter(c => !c.act.cancelled);
  const clashLine = a => { const c = clashes(a); return c.length ? "⚠ Overlapt met " + c.map(x => `${x.act.name} (${x.minutes} min)`).join(", ").replace(/, ([^,]*)$/, " en $1") : ""; };
  const starHint = a => { const c = clashes(a); if (!c.length || !isFav(a.id)) return ""; if (isStar(a.id) && c.some(x => !isStar(x.act.id))) return L("♥ Dit is jouw ‘moet ik zien’.", "♥ This is your must-see."); const s = c.find(x => isStar(x.act.id)); return !isStar(a.id) && s ? L(`Botst met ♥ ${s.act.name} (moet je zien).`, `Clashes with ♥ ${s.act.name} (must-see).`) : ""; };

  /* ---- toegankelijkheid (bron: leftofthedial.nl/venues) ---- */
  const ACC = [["Annabel Down", 1, "", ""], ["Annabel Up", 0, "trappen", "stairs"], ["Arminius", 1, "via lift", "via elevator"], ["Baanhof", 0, "trappen", "stairs"], ["Barrio", 0, "trapjes", "small steps"], ["Bird", 1, "via rijplaat, rolstoeltoilet aanwezig", "via ramp, accessible toilet"], ["De Doelen", 1, "lift, rolstoeltoilet", "elevator, accessible toilet"], ["Mono", 1, "geen rolstoeltoilet (dichtstbij: Bird)", "no accessible toilet (nearest: Bird)"], ["Paradijskerk", 1, "rolstoellift, rolstoeltoilet", "wheelchair lift, accessible toilet"], ["Reijngoud", 1, "geen rolstoeltoilet (dichtstbij: Bird)", "no accessible toilet (nearest: Bird)"], ["Remastered", 1, "rolstoeltoilet aanwezig", "accessible toilet"], ["Rotown", 1, "gelijkvloers, rolstoeltoilet", "level access, accessible toilet"], ["Sahara", 0, "trappen", "stairs"], ["Salsability", 1, "via de vooringang, rolstoeltoilet", "via front entrance, accessible toilet"], ["Stalles", 0, "trappen", "stairs"], ["TR ", 1, "alle zalen, lift naar de grote zaal", "all rooms, elevator to the main hall"], ["Uniek", 0, "trappen", "stairs"], ["V11", 0, "trappen", "stairs"], ["V2_", 1, "oprijplaat, vraag het personeel; geen rolstoeltoilet (dichtstbij: Worm)", "ramp, ask staff; no accessible toilet (nearest: Worm)"], ["Waalse Kerk", 1, "oprijplaat, vraag het personeel; geen rolstoeltoilet (dichtstbij: Worm)", "ramp, ask staff; no accessible toilet (nearest: Worm)"], ["Worm", 1, "lift, rolstoeltoilet", "elevator, accessible toilet"]];
  const accLine = n => { const r = ACC.find(x => n.startsWith(x[0])); if (!r) return ""; const note = L(r[2], r[3]); return "♿ " + (r[1] ? L("Rolstoeltoegankelijk", "Wheelchair accessible") : L("Niet rolstoeltoegankelijk", "Not wheelchair accessible")) + (note ? " · " + note : ""); };

  /* ---- loopafstand (alleen als lineup.json "coords" bevat) ---- */
  const DEF_COORDS = {"Annabel": [51.92536, 4.47601], "Arminius": [51.91494, 4.47371], "Baanhof": [51.91282, 4.48025], "Bird": [51.92671, 4.47881], "Barrio": [51.9256, 4.478], "De Doelen": [51.92182, 4.47329], "Mono": [51.92858, 4.47827], "Paradijskerk": [51.9169, 4.4725], "Reijngoud": [51.9285, 4.47811], "Remastered": [51.91051, 4.4828], "Rotown": [51.91694, 4.47167], "Sahara": [51.92525, 4.4759], "Salsability": [51.9246, 4.4779], "Stalles": [51.9167, 4.4712], "TR": [51.91998, 4.4741], "Uniek": [51.9187, 4.47], "V11": [51.91717, 4.48452], "V2_": [51.9145, 4.4707], "Waalse Kerk": [51.91384, 4.47991], "Worm": [51.915, 4.47]}, ADDR = {"Annabel": "Schiestraat 20", "Arminius": "Museumpark 3", "Baanhof": "Baan 159", "Bird": "Raampoortstraat 24-28", "Barrio": "Teilingerstraat 19B", "De Doelen": "Schouwburgplein 50", "Mono": "Vijverhofstraat 15", "Paradijskerk": "Nieuwe Binnenweg 25", "Reijngoud": "Vijverhofstraat 10", "Remastered": "Willemsplein 79", "Rotown": "Nieuwe Binnenweg 19", "Sahara": "Schiestraat 18", "Salsability": "Delftsestraat 9", "Stalles": "Nieuwe Binnenweg 11A", "TR": "Schouwburgplein 25", "Uniek": "Mauritsweg 34", "V11": "Wijnhaven t/o 101", "V2_": "Eendrachtsstraat 10", "Waalse Kerk": "Pierre Baylestraat 1", "Worm": "Boomgaardsstraat 71"};
  let cached = LS.get("lotd-lineup", null), coords = Object.assign({}, DEF_COORDS, (cached && cached.coords) || {});
  const baseName = n => n.replace(/ (Up|Down|WBH|Foyer|1|2)( & (Up|Down|2))?$/, "");
  const coordOf = n => coords[n] || coords[baseName(n)];
  const addrOf = n => ADDR[n] || ADDR[baseName(n)] || "";
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
  const bar = document.createElement("div"); bar.id = "lotd-status"; bar.setAttribute("role", "status"); document.querySelector("header").after(bar);
  const S = {}, PRIO = { update: 5, changes: 4, notice: 3, offline: 2, install: 1, saved: 0 };
  const post = (k, p) => { S[k] = p; paintStatus(); }, drop = k => { delete S[k]; paintStatus(); };
  function paintStatus() {
    const k = Object.keys(S).sort((a, b) => PRIO[b] - PRIO[a])[0];
    if (!k) { bar.className = ""; bar.innerHTML = ""; return; }
    const p = S[k]; bar.className = "on" + (k === "offline" ? " off" : "");
    bar.innerHTML = `<span>${p.text()}${k !== "offline" && navigator.onLine === false ? " · Offline" : ""}</span>${p.btn ? `<button data-st-act="${k}">${p.btn()}</button>` : ""}${p.x ? `<button class="sx" data-st-x="${k}" aria-label="Sluiten">✕</button>` : ""}`; trNode(bar);
  }
  const ctl = document.createElement("div"); ctl.id = "lotd-ctl"; ctl.innerHTML = `<button data-lang="nl">NL</button><button data-lang="en">EN</button><button data-aa aria-label="Tekstgrootte / Text size">Aa</button>`; { const h2 = document.getElementById("title"), bar = document.createElement("div"); bar.className = "titlebar"; h2.parentNode.insertBefore(bar, h2); bar.appendChild(h2); bar.appendChild(ctl); }
  const paintCtl = () => { ctl.querySelectorAll("[data-lang]").forEach(b => b.classList.toggle("on", b.dataset.lang === lang)); ctl.querySelector("[data-aa]").classList.toggle("on", big); };
  function setLang(l) { lang = l; window.LOTD_LANG = l; localStorage.setItem("lotd-lang", l); document.documentElement.lang = l; setDays(); paintCtl(); paintStatus(); render(true); }

  /* ---- offline-indicator ---- */
  let meta = { updated: (cached && cached.updated) || "2026-09-27T12:00:00" };
  const fmtDate = () => { try { return new Date(meta.updated).toLocaleString(lang === "en" ? "en-GB" : "nl-NL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }); } catch (e) { return ""; } };
  const updLine = () => `<div class="upd">${L("Tijden bijgewerkt: ", "Times updated: ")}${fmtDate()}</div>`;
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
    ACTS.length = 0; fresh.forEach(a => ACTS.push(a)); addAfter(j.after);
    const mapId = id => { if (act(id)) return id; const o = oldById.get(id); if (!o) return null; const c = ACTS.filter(a => norm(a.name) === norm(o.name) && venue(a.venueId).name === o.vn && a.day === o.day).sort((x, y) => Math.abs(mins(x.start) - mins(o.start)) - Math.abs(mins(y.start) - mins(o.start))); return c.length ? c[0].id : null; };
    const uniq = a => [...new Set(a.filter(Boolean))];
    favs = uniq(favBefore.map(mapId)); stars = uniq((silent ? LS.get("lotd-stars", []) : stars).map(mapId)).filter(isFav); friend.ids = uniq(friend.ids.map(mapId));
    hiddenVenues = LS.get("lotd-hidden-venues", []).filter(id => VENUES.some(v => v.id === id)); const sh = sharedFromHash(); if (sh) sharedIds = sh;
    saveFavs(); saveStars(); saveFriend(); coords = Object.assign({}, DEF_COORDS, j.coords || {});
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
  const standalone = navigator.standalone || matchMedia("(display-mode: standalone)").matches, ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  let deferred = null;
  if (ios && !standalone && visits >= 2 && !LS.get("lotd-install-x", false)) post("install", { text: () => L("Tip: tik op Deel en kies ‘Zet op beginscherm’ voor snelle toegang, ook offline.", "Tip: tap Share, then ‘Add to Home Screen’ for quick access, also offline."), x: true });
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferred = e; if (visits >= 2 && !LS.get("lotd-install-x", false)) post("install", { text: () => L("Installeer de app voor snelle toegang, ook offline.", "Install the app for quick access, also offline."), btn: () => L("Installeer", "Install"), x: true, fn: () => deferred && deferred.prompt() }); });

  /* ---- rijen, blokken, modal ---- */
  row = function (a, extra) {
    const d = dayOf(a.day), v = venue(a.venueId), cl = clashLine(a);
    return `<div class="item"><button class="t" data-open="${a.id}"><b>${a.cancelled ? `<s>${a.name}</s>` : a.name}${isFriend(a.id) ? ' <i class="fr"></i>' : ""}</b><span><i class="dot" style="background:${v.color}"></i>${v.name} · ${d.label} ${timeTxt(a)}${a.cancelled ? ` · <em class="clash">${L("Vervallen", "Cancelled")}</em>` : ""}${typeof extra === "string" && extra ? ` · <em class="when">${extra}</em>` : ""}${subX(a)}${cl ? `<em class="clash">${cl}</em>` : ""}</span></button><span class="rt2"><button class="hb ri ${isFav(a.id) && !isStar(a.id) ? "on" : ""}" data-int="${a.id}" aria-label="${L("Interessant", "Interesting")}" aria-pressed="${isFav(a.id) && !isStar(a.id)}">${dial("int", 24, isFav(a.id) && !isStar(a.id))}</button><button class="hb rm ${isStar(a.id) ? "on" : ""}" data-must="${a.id}" aria-label="${L("Moet ik zien", "Must-see")}" aria-pressed="${isStar(a.id)}">${dial("must", 24, isStar(a.id))}</button></span></div>`;
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
    const notes = [a.endUnknown ? `<p>${L("Start direct na de laatste band van die avond. Eindtijd nog niet bekend.", "Starts straight after the last band of the night. End time not announced.")}</p>` : "", a.cancelled ? `<p class="clash">${L("Vervallen", "Cancelled")}</p>` : "", cl ? `<p class="clash">${cl}</p>` : "", hint ? `<p>${hint}</p>` : "", isFriend(a.id) ? `<p>${L("Je vriend wil dit ook zien", "Your friend wants to see this too")}</p>` : "", nx ? `<p>${nx}</p>` : ""].join("");
    const alt = ACTS.filter(x => x.name === a.name && x.id !== a.id).sort((x, y) => DAYS.findIndex(d2 => d2.id === x.day) - DAYS.findIndex(d2 => d2.id === y.day) || byTime(x, y));
    const rows = [
      c0 ? `<a class="m-row" href="${routeUrl(c0)}" target="_blank" rel="noopener">${sv(SI.pin)}<span><b>${L("Route naar", "Route to")} ${v.name}</b>${addrOf(v.name) ? `<small>${addrOf(v.name)}, Rotterdam</small>` : ""}</span></a>` : "",
      c0 ? `<button class="m-row" data-here="${c0[0]},${c0[1]}">${sv(SI.walk)}<span><b>${L("Looptijd vanaf mijn locatie", "Walking time from my location")}</b><small>${L("Tik om je locatie te gebruiken", "Tap to use your location")}</small></span></button>` : "",
      acc ? `<div class="m-row">${sv(SI.acc)}<span><b>${acc.replace("♿ ", "")}</b></span></div>` : "",
      ...alt.map(x => `<button class="m-row" data-open="${x.id}">${sv(SI.cal)}<span><b>${L("Speelt ook", "Also playing")}: ${dayOf(x.day).label} · ${x.start}</b><small>${venue(x.venueId).name}</small></span></button>`)
    ].join("");
    m.innerHTML = `<div class="ov"><div class="sheet act-sheet" role="dialog" aria-modal="true" aria-label="${a.name}"><div class="grab"></div><button class="x" data-close aria-label="Sluiten">✕</button>${sub ? `<div class="m-sub">${sub}</div>` : ""}<h2>${a.cancelled ? `<s>${a.name}</s>` : a.name}</h2>${url ? `<a class="lnk info" href="${url}" target="_blank" rel="noopener">Meer info op leftofthedial.nl ↗</a>` : ""}<div class="m-when"><b>${timeTxt(a)}</b><span>${d.label} · <i class="dot" style="background:${v.color}"></i>${v.name}</span></div>${notes ? `<div class="m-note">${notes}</div>` : ""}<div class="m-rows">${rows}</div><div class="rate"><button class="r-must ${mustOn ? "on" : ""}" data-must="${a.id}" aria-pressed="${mustOn}">${dial("must", 22)}${L("Moet ik zien", "Must-see")}</button><button class="r-int ${intOn ? "on" : ""}" data-int="${a.id}" aria-pressed="${intOn}">${dial("int", 22)}${L("Interessant", "Interesting")}</button></div></div></div>`;
    trNode(m);
  };

  /* ---- timetable ---- */
  vTimetable = function (onlyFavs) {
    const ids = sharedReadOnly && sharedIds ? sharedIds : null, f = festNow();
    const gOk = a => !selGenres.length || (a.genres || []).some(g => selGenres.includes(g));
    const list = ACTS.filter(a => a.day === day && (!onlyFavs || isFav(a.id)) && (!ids || ids.includes(a.id)) && !hiddenVenues.includes(a.venueId) && gOk(a));
    const today = dayOf(day).date === f.ds, jump = today ? `<button class="now-btn" data-now>Nu</button>` : "";
    const segHtml = `<div class="seg" role="tablist" aria-label="Kies een festivaldag">${DAYS.map(x => `<button class="${x.id === day ? "on" : ""}" data-day="${x.id}" role="tab" aria-selected="${x.id === day}">${x.label}</button>`).join("")}</div><div class="tt-tools"><button class="${favOnly || sharedReadOnly ? "on" : ""}" data-fav-only>${sharedReadOnly ? "Gedeelde lijst" : "♡ Alleen favorieten"}</button><button class="${selGenres.length ? "on" : ""}" data-genres>Genre${selGenres.length ? " · " + selGenres.length : ""}</button>${friend.ids.length ? `<button class="${friend.on ? "on" : ""}" data-friend>Vriend · ${friend.ids.length}</button>` : ""}<button class="venue-btn" data-venues>Locaties${hiddenVenues.length ? ` · ${VENUES.length - hiddenVenues.length}` : ""}</button></div>`;
    if (!list.length) return segHtml + `<div class="empty">${selGenres.length ? "Geen acts met dit genre op deze dag." : onlyFavs ? (favs.length ? "Geen favorieten op deze dag." : "Nog geen favorieten.<br>Tik op het hartje bij een act om hem hier te zien.") : "Geen acts."}</div>`;
    const start = Math.floor(Math.min(...list.map(a => mins(a.start))) / 60) * 60, end = Math.ceil(Math.max(...list.map(a => mins(a.end))) / 60) * 60, hours = (end - start) / 60, W = hours * PPH;
    let ticks = ""; for (let i = 0; i <= hours; i++) ticks += `<div class="tick" style="left:${i * PPH}px">${String((start / 60 + i) % 24).padStart(2, "0")}:00</div>`;
    const rows = VENUES.filter(v => list.some(a => a.venueId === v.id)).map(v => {
      const acts = list.filter(a => a.venueId === v.id).map(a => { const l = (mins(a.start) - start) / 60 * PPH, w = (mins(a.end) - mins(a.start)) / 60 * PPH, cl = clashes(a).length;
        return `<button class="act ${a.after ? "after " : ""}${isStar(a.id) ? "must" : isFav(a.id) ? "int" : ""} ${isFav(a.id) ? "fav" : ""} ${a.cancelled ? "cancel" : ""}" style="left:${l}px;width:${w - 3}px;background:${v.color}" data-open="${a.id}"${cl ? ' aria-label="Overlapt met favorieten"' : ""}>${isFav(a.id) ? `<i class="h">${mark(a.id)}</i>` : ""}${cl ? '<i class="clash-marker" title="Overlap met een favoriet" aria-hidden="true">!</i>' : ""}${isLive(a) && !a.cancelled ? '<em class="live">NU</em>' : ""}${isFriend(a.id) ? '<i class="fr"></i>' : ""}<b>${a.name}</b><span>${timeTxt(a)}</span><span class="g">${a.cancelled ? L("Vervallen", "Cancelled") : tagX(a)}</span></button>`; }).join("");
      return `<div class="row"><div class="lab"><i class="dot" style="background:${v.color}"></i>${v.name}</div><div class="track" style="width:${W}px;background-size:${PPH}px 100%">${acts}</div></div>`; }).join("");
    const now = today && f.m >= start && f.m <= end ? `<div class="now" style="left:${92 + (f.m - start) / 60 * PPH}px"></div>` : "";
    return segHtml + `<div class="tt-wrap">${jump}<div class="tt"><div class="tt-in" style="width:${92 + W}px"><div class="hrow"><div class="lab"></div><div class="trackh" style="width:${W}px">${ticks}</div></div>${rows}${now}</div></div></div>`;
  };

  /* ---- favorieten-pagina (agenda, vriend, jullie allebei) ---- */
  vFavs = function () {
    const banner = sharedIds && !sharedReadOnly ? `<div class="share-banner"><b>Favorieten van een vriend</b><button data-view-shared>Bekijk</button><button data-compare-shared>Vergelijk met mijn lijst</button><button data-add-shared>Toevoegen aan mijn favorieten</button></div>` : "";
    const both = friend.on && friend.ids.length ? ACTS.filter(a => isFav(a.id) && friend.ids.includes(a.id) && !a.cancelled).sort((x, y) => DAYS.findIndex(d => d.id === x.day) - DAYS.findIndex(d => d.id === y.day) || byTime(x, y)) : [];
    return banner + `<div class="list"><button class="share-btn" data-share>Deel mijn favorieten</button><button class="share-btn" data-ics-all>${L("Zet mijn favorieten in je agenda (.ics)", "Add my favorites to your calendar (.ics)")}</button>${friend.ids.length ? `<button class="share-btn" data-friend-clear>${L("Vriendenlijst wissen", "Clear friend's list")}</button>` : ""}${both.length ? `<div class="grp">${L("Jullie allebei", "You both want to see")} (${both.length})</div>${both.map(a => row(a)).join("")}` : ""}</div>` + vTimetable(true) + updLine();
  };

  /* ---- zoeken ---- */
  const searchActs = s => { const words = fold(s).split(/\s+/).filter(Boolean); return ACTS.filter(a => { const hay = fold([a.name, venue(a.venueId).name, (a.genres || []).join(" "), a.country ? names(a.country) + " " + codes(a.country) + " " + a.country : ""].join(" ")); return words.every(w => hay.includes(w)); }); };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  resHtml = function (s, res) { return !s ? `<div class="empty">Typ een act, locatie, genre of land.</div>` : res.length ? res.sort((a, b) => DAYS.findIndex(d => d.id === a.day) - DAYS.findIndex(d => d.id === b.day) || byTime(a, b)).map(a => row(a)).join("") : `<div class="empty">Niets gevonden voor “${esc(s)}”.</div>`; };
  vSearch = function () { const s = q.trim(), res = s ? searchActs(s) : []; return `<div class="search"><input id="q" type="search" placeholder="Zoek act, locatie, genre of land…" value="${esc(q)}" autocomplete="off"></div><div class="list" id="res">${resHtml(s.toLowerCase(), res)}</div>`; };
  document.addEventListener("input", e => { if (e.target.id !== "q") return; e.stopImmediatePropagation(); q = e.target.value; const s = q.trim(), res = s ? searchActs(s) : [], box = document.getElementById("res"); box.innerHTML = resHtml(s.toLowerCase(), res); trNode(box); }, true);

  /* ---- Nu & straks ---- */
  const sortFav = (a, b) => (isFav(b.id) - isFav(a.id)) || (mins(a.start) - mins(b.start)) || a.name.localeCompare(b.name);
  function vNowView() {
    const f = festNow(), d = DAYS.find(x => x.date === f.ds), demo = new URLSearchParams(location.search).get("now");
    if (!d) return `<div class="empty">${f.ds < DAYS[0].date ? "Het festival begint op woensdag 21 oktober." : "Het festival is voorbij. Bedankt voor het meekijken!"}<br><br><button class="big" data-go="/">Naar de timetable</button></div>`;
    const hh = String(Math.floor((f.m % 1440) / 60)).padStart(2, "0") + ":" + String(f.m % 60).padStart(2, "0");
    const all = ACTS.filter(a => a.day === d.id && !a.cancelled && !hiddenVenues.includes(a.venueId) && (!nowFav || isFav(a.id)));
    const live = all.filter(a => mins(a.start) <= f.m && mins(a.end) > f.m).sort(sortFav), soon = all.filter(a => mins(a.start) > f.m && mins(a.start) <= f.m + 60).sort(sortFav), later = all.filter(a => mins(a.start) > f.m + 60 && mins(a.start) <= f.m + 120).sort(sortFav);
    const sec = (tt, arr, lab) => arr.length ? `<div class="grp">${tt} (${arr.length})</div>${arr.map(a => row(a, lab(a))).join("")}` : "";
    const body = sec("Nu bezig", live, a => `nog ${mins(a.end) - f.m} min`) + sec("Begint binnen een uur", soon, a => `over ${mins(a.start) - f.m} min`) + sec("Daarna, binnen 2 uur", later, a => `over ${mins(a.start) - f.m} min`);
    return `<div class="tt-tools" style="padding-top:10px"><button class="${nowFav ? "on" : ""}" data-now-fav>♡ Alleen favorieten</button><span class="mono" style="margin-left:auto;font-size:12px">${d.label} · ${hh}${demo ? " (test)" : ""}</span></div><div class="list">${body || `<div class="empty">Het is even rustig${nowFav ? " bij je favorieten" : ""}. Niets in de komende 2 uur.</div>`}</div>${updLine()}`;
  }

  /* ---- hoofdweergave ---- */
  ico.clock = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
  render = function (keep) {
    renderModal();
    const r = route(), main = document.getElementById("main"), tt0 = main.querySelector(".tt"), sc = keep ? [main.scrollTop, tt0 ? tt0.scrollLeft : 0, tt0 ? tt0.scrollTop : 0] : [0, 0, 0];
    const titles = { tt: "Timetable", now: L("Nu & straks", "Now & next"), search: L("Zoeken", "Search"), favorites: L("Favorieten", "Favorites"), game: "Wapperman", act: "Act" };
    document.getElementById("title").textContent = titles[r.p] || "Timetable";
    main.innerHTML = r.p === "search" ? vSearch() : r.p === "favorites" ? vFavs() : r.p === "act" ? vAct(r.id) : r.p === "now" ? vNowView() : r.p === "game" ? `<div id="wapperman-root"></div>` : vTimetable(favOnly);
    if (r.p === "game") WappermanGame.mount(); else trNode(main);
    const tab = r.p === "act" ? (sessionStorage.getItem("from") || "tt") : r.p, icon = { tt: "tt", now: "clock", search: "se", favorites: "fa", game: "game" }, nav = document.getElementById("nav");
    nav.innerHTML = [["tt", "Timetable", "/"], ["now", L("Nu", "Now"), "/now"], ["search", L("Zoeken", "Search"), "/search"], ["favorites", L("Favorieten", "Favorites"), "/favorites"], ["game", "Wapperman", "/game"]].map(([k, l, h]) => `<button class="${tab === k ? "on" : ""}" data-go="${h}" aria-current="${tab === k ? "page" : "false"}">${ico[icon[k]] || "◉"}${l}</button>`).join("");
    if (keep) { main.scrollTop = sc[0]; const tt = main.querySelector(".tt"); if (tt) { tt.scrollLeft = sc[1]; tt.scrollTop = sc[2]; } }
    if (r.p === "search" && !keep) { const i = document.getElementById("q"); if (i && q) i.focus(); }
  };

  /* ---- klikken (vóór de bestaande afhandeling) ---- */
  document.addEventListener("click", e => {
    const tg = e.target, stop = () => e.stopImmediatePropagation(), c = sel => tg.closest && tg.closest(sel);
    if (tg.classList && tg.classList.contains("ov") && (genreOpen || sheet)) { stop(); if (sheet) { sheet = null; renderModal(); } else { genreOpen = false; renderModal(); render(true); } return; }
    if (c("[data-close-sheet]")) { stop(); sheet = null; renderModal(); return; }
    if (c("[data-genres]")) { stop(); genreOpen = true; renderModal(); return; }
    if (c("[data-close-genres]")) { stop(); genreOpen = false; renderModal(); render(true); return; }
    if (c("[data-no-genres]")) { stop(); selGenres = []; document.getElementById("modal").innerHTML = genreSheet(); skipModal = true; render(true); skipModal = false; return; }
    const gc = c("[data-genre]"); if (gc) { stop(); const g = gc.dataset.genre; selGenres = gc.checked ? [...selGenres, g] : selGenres.filter(x => x !== g); skipModal = true; render(true); skipModal = false; return; }
    if (c("[data-now-fav]")) { stop(); nowFav = !nowFav; render(true); return; }
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
    const lg = c("[data-lang]"); if (lg) { stop(); setLang(lg.dataset.lang); return; }
    if (c("[data-aa]")) { stop(); big = !big; localStorage.setItem("lotd-big", big ? "1" : "0"); document.documentElement.classList.toggle("big", big); paintCtl(); return; }
    const sa = c("[data-st-act]"); if (sa) { stop(); const p = S[sa.dataset.stAct]; if (p && p.fn) p.fn(); return; }
    const sx = c("[data-st-x]"); if (sx) { stop(); const k = sx.dataset.stX; if (k === "notice") LS.set("lotd-notice-x", S[k].key); if (k === "install") LS.set("lotd-install-x", true); drop(k); return; }
  }, true);
  document.addEventListener("keydown", e => { if (e.key === "Escape") { if (sheet) { sheet = null; renderModal(); } else if (genreOpen) { genreOpen = false; renderModal(); render(true); } } });

  const css = document.createElement("style");
  css.textContent = `a.oth{text-decoration:none;color:inherit;box-sizing:border-box;display:block}.when{font-style:normal;font-weight:700;color:var(--accent)}.checkrow span{font-size:12px}
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
nav button{font-size:12px!important}.upd{font-size:13px!important}#lotd-status{font-size:14px!important}#lotd-status button{min-height:44px!important}.det p,.sheet p{font-size:17px!important}.now-btn{font-size:13px!important;min-height:40px}
@media (max-width:420px){.titlebar{flex-wrap:wrap}#lotd-ctl{margin-bottom:0}header h2{margin-bottom:10px!important}}
html.big body{font-size:19px}html.big .act b{font-size:18px!important}html.big .act span,html.big .act .g{font-size:14px!important}html.big .item .t b{font-size:20px!important}html.big .item .t span,html.big .meta{font-size:16px!important}html.big .seg button,html.big .tt-tools button,html.big .oth{font-size:17px!important}html.big .lab,html.big .tick{font-size:14px!important}html.big .row{height:104px}html.big .pill,html.big .checkrow{font-size:15px!important}html.big nav button{font-size:13px!important}`;
  document.head.appendChild(css);

  setInterval(() => { if (route().p === "now" && !openId && !venueOpen && !genreOpen && !sheet) render(true); }, 30000);
  setInterval(() => { if (document.visibilityState === "visible") checkLineup(); }, 300000);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") checkLineup(); });
  window.addEventListener("online", () => { netState(); checkLineup(); }); window.addEventListener("offline", netState);
  paintCtl(); netState(); render(); checkLineup();
})();
