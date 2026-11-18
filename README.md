# GyurMó

A gyurmokerites.hu új oldala. Két mappa: `frontend` (Next.js) és `backend` (Node, a rendelések és az üzenetek). Az árak egy fájlban vannak: `shared/catalog.json`. Az adatbázis egy helyi fájl, nem kell hozzá külön szerver.

## Indítás

Két terminál.

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

A oldal: http://localhost:3000
A rendelésnapló: http://localhost:3000/rendelesek
A rendelésnapló kulcsa a `backend/.env` fájl `ADMIN_TOKEN` értéke. A példafájlban nincs valódi kulcs: másold át, és írj bele egy sajátot. A `.env` és az adatbázis nem kerül gitre.

## Ár, méret, kapacitás

`shared/catalog.json`

- `products[].sizes[].price` a kész méret ára, forintban, acél borítással, gyártásra, automatika nélkül.
- `installFee` a szerelés díja, ha a teljesítést „Gyártás és szerelés”-re kérik.
- `claddings` az acél, alumínium és WPC szorzója.
- `fulfillment` a három mód: csak anyag (0,8), gyártás (1), gyártás és szerelés (1 + szerelési díj).
- `automation` típusonként 2 vagy 3 gép, saját árral.
- `workshop.weeklyCapacity` hány egység fér egy hétre. Az anyag 1-et, a gyártás 3-at, a komplett 4-et foglal. Egyedi méret és automatika plusz egyet kér.

Az egyedi nyílásnak nincs ára. A hét ettől még lefoglalható, a rendelés „Ajánlatra vár” státusszal kerül a naplóba.

A backend újraindítás nélkül is a friss fájlt olvassa minden kérésnél.

## Képek és 3D

- Bemutatófotók: `frontend/public/studio`
- Megvalósult munkák: `frontend/public/munkaink/<slug>/1.jpg`
- A régi nyitókép és logó: `frontend/public/archiv`
- A modell: `frontend/public/models/modern_fence_set.glb`
- A betöltő videó: `frontend/public/nyito.mp4`
- Nyers, még nem használt fotók: `frontend/public/archiv/nyers`

Új referencia: kép a mappába, bekezdés a `frontend/lib/content.ts` `works` listájába.

Új bútor: kép a `frontend/public/munkaink/butorok` mappába, tétel a `furniture` listába. A `place` értéke `Beltér` vagy `Kültér`, a `kind` értéke `Funkcionális` vagy `Design`. Árat a bútorokhoz szándékosan nem tettünk: egyeztetéssel mennek.

## Amit a régi oldalról áthoztunk

Szolgáltatások, a műhely szövege, gyakori kérdések, három vélemény, karrier, telefonszámok, email, a Délép telep, a Facebook, és a referenciafotók kategóriánként. A kész kapuk ára új: a régi oldalon szándékosan nem volt publikus ár.
