"""Haalt snelle eetplekken rond de LOTD-zalen op uit OpenStreetMap (Overpass)
en schrijft ze naar food.json. Draait via GitHub Actions (zie .github/workflows/food.yml),
zodat de app niet bij elke bezoeker Overpass hoeft te bevragen."""
import json, time, urllib.parse, urllib.request, sys

BBOX = "51.903,4.455,51.935,4.495"
CUIS = "pizza|kebab|burger|falafel|shawarma|noodle|ramen|dumpling|friture|fries|sandwich|chicken|surinamese|vietnamese|poke|bagel"
Q = (f'[out:json][timeout:60];('
     f'nwr["amenity"="fast_food"]({BBOX});'
     f'nwr["amenity"="food_court"]({BBOX});'
     f'nwr["amenity"="restaurant"]["cuisine"~"{CUIS}"]({BBOX});'
     f');out center tags;')
ENDPOINTS = ["https://overpass-api.de/api/interpreter",
             "https://overpass.kumi.systems/api/interpreter",
             "https://overpass.private.coffee/api/interpreter"]
KEEP = ["name", "amenity", "cuisine", "opening_hours", "diet:vegetarian", "diet:vegan", "addr:street", "addr:housenumber", "takeaway"]

def fetch():
    body = urllib.parse.urlencode({"data": Q}).encode()
    for url in ENDPOINTS:
        for attempt in range(2):
            try:
                req = urllib.request.Request(url, data=body, headers={"User-Agent": "lotd26-food-snapshot/1.0 (+https://lotd.gijsbitter.nl)"})
                with urllib.request.urlopen(req, timeout=90) as r:
                    return json.load(r)
            except Exception as e:
                print(f"{url} poging {attempt + 1}: {e}", file=sys.stderr); time.sleep(10)
    raise SystemExit("Geen enkele Overpass-server bereikbaar")

data = fetch()
els = []
for e in data.get("elements", []):
    t = e.get("tags", {})
    if not t.get("name"):
        continue
    lat = e.get("lat") or (e.get("center") or {}).get("lat")
    lon = e.get("lon") or (e.get("center") or {}).get("lon")
    if not lat or not lon:
        continue
    els.append({"type": e["type"], "id": e["id"], "lat": round(lat, 6), "lon": round(lon, 6),
                "tags": {k: t[k] for k in KEEP if k in t}})
if len(els) < 20:
    raise SystemExit(f"Te weinig resultaten ({len(els)}), food.json niet overschreven")
els.sort(key=lambda x: (x["tags"]["name"].lower(), x["id"]))
with open("food.json", "w", encoding="utf-8") as f:
    json.dump({"updated": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "source": "OpenStreetMap contributors (ODbL)", "elements": els}, f, ensure_ascii=False, separators=(",", ":"))
print(f"food.json: {len(els)} plekken")
