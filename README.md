# Adventní kalendář 2026 – Geek Hall

Kopie adventního kalendáře Mobil Maják (Vite + React + TypeScript + Firebase) přepracovaná pro e-shop Geek Hall (geekhall.cz: logo, písmo Roboto, barvy a obrázky převzaté z webu).
Princip a funkce jsou stejné: 24 okének odemykaných o půlnoci (Europe/Prague), přihlášení přes Google, kvízy a hry
(kvíz, řazení přetahováním, typový test), 3 soutěže (e-mail / tip čísla / fotka) s uzávěrkami i ve `firestore.rules`,
newsletterový souhlas (datum + znění), `/?admin` s exportem CSV, pravidla soutěží `/?pravidla`.
Rozdíl: e-shop místo poboček – odměny jsou **slevové kódy `GEEK-…` do košíku** (seznam níže).

## Co je potřeba doplnit před spuštěním

- [ ] **Firebase projekt** (viz níže) a `FIREBASE` v `src/config.ts`. Dokud je `apiKey` prázdný, web běží v ukázkovém režimu (data jen v prohlížeči).
- [ ] **Provozovatel** (`OPERATOR` v `src/content.ts`): firma, IČ a adresa prodejny jsou převzaté z patičky geekhall.cz (Svět karet s.r.o., IČO 11858770). Ověřit sídlo a doplnit DIČ.
- [ ] **Texty a nabídky v `src/content.ts`** jsou návrh (slevy, ceny soutěží, termíny). Každé okénko s poznámkou `confirm` ověřit a pak přepnout `CONTENT_MODE = 'live'`.
- [ ] Soutěž 13: doplnit skutečný počet odeslaných balíků za rok 2026. Ceny soutěží (3 000 / 1 000 / 2 000 Kč) potvrdit i v `src/components/Rules.tsx`.
- [x] Odkazy na kategorie, kontakt a ochranu údajů odpovídají skutečným adresám geekhall.cz (stav z 26. 11. 2026).
- [ ] Kódy z tabulky níže (a `docs/slevove-kody.csv`) založit v e-shopu jako slevové kupóny.
- [x] Logo (`public/img/logo-white.png`, `logo-black.svg`), barvy a písmo převzaté z geekhall.cz.
- [ ] Správce: Google e-mail v `ADMIN_EMAILS` (`src/config.ts`) **i** v `isAdmin()` ve `firestore.rules`.
- [ ] `DEMO_MODE = false` (výchozí), `PREVIEW_KEY` (`?nahled=geekadvent` odemkne všechna okénka).

## Slevové kódy (13)

Podmínky vycházejí z domluvených odměn. U kódů s kategorií se **minimální nákup počítá jen z produktů dané kategorie a sleva platí jen na ně**; u kódů „celý nákup“ (`GEEK-D20`, `GEEK-LOOT`, `GEEK-LEGENDA`) z celého košíku. „Max. objednávka“ znamená, že kód platí jen pro objednávky do uvedené hodnoty. Okénko 1 je uvítací bez kódu (doprava zdarma nad 3 000 Kč je podmínka e-shopu).
Kofola Nulka z nabídky vypadla. Stejné údaje jsou v `docs/slevove-kody.csv` (středník, UTF-8) pro import nebo ruční založení v e-shopu.

| Okénko | Kód | Odměna | Platí na | Minimální nákup | Max. objednávka | Platnost |
| --- | --- | --- | --- | --- | --- | --- |
| 2. 12. | `GEEK-D20` | Sleva 5 % | celý nákup | od 2 000 Kč | do 10 000 Kč | 31. 12. 2026 |
| 4. 12. | `GEEK-SOSKA` | Sleva 5 % | figurky a sošky | od 1 000 Kč | – | 31. 12. 2026 |
| 7. 12. | `GEEK-SILA` | Sleva 10 % | produkty Star Wars | od 2 000 Kč | do 10 000 Kč | 31. 12. 2026 |
| 9. 12. | `GEEK-KOSTKA` | Sleva 5 % | deskové hry | od 1 000 Kč | – | 31. 12. 2026 |
| 11. 12. | `GEEK-STETEC` | Sleva 10 % | barvení a modelařství | od 1 000 Kč | – | 31. 12. 2026 |
| 12. 12. | `GEEK-PLYSAK` | Sleva 10 % | plyšáci | bez minima | – | 31. 12. 2026 |
| 14. 12. | `GEEK-WAAAGH` | Sleva 10 % | Warhammer (40k, Age of Sigmar) | od 3 000 Kč | do 10 000 Kč | 31. 12. 2026 |
| 17. 12. | `GEEK-BRADAVICE` | Sleva 10 % | produkty Harry Potter | od 2 000 Kč | do 10 000 Kč | 31. 12. 2026 |
| 18. 12. | `GEEK-POKEBALL` | Sleva 5 % | Pokémon TCG | od 4 000 Kč | do 10 000 Kč | 31. 12. 2026 |
| 21. 12. | `GEEK-POKLAD` | Sleva 5 % | One Piece TCG | od 4 000 Kč | do 10 000 Kč | 31. 12. 2026 |
| 22. 12. | `GEEK-ZERG` | Sleva 10 % | produkty StarCraft | od 2 000 Kč | do 10 000 Kč | 31. 12. 2026 |
| 23. 12. | `GEEK-LOOT` | Sleva 5 % | celý nákup | od 2 000 Kč | do 10 000 Kč | 24. 12. 2026 |
| 24. 12. | `GEEK-LEGENDA` | Sleva 10 % | celý nákup | od 5 000 Kč | do 10 000 Kč | 31. 1. 2027 |

Zadání obsahovalo dvakrát stejnou slevu 5 % při nákupu nad 2 000 Kč do 10 000 Kč, proto jsou kódy dva: `GEEK-D20` (odměna za kvíz v okénku 2) a `GEEK-LOOT` (okénko 23).

## Firebase (jednorázově, cca 15 min)

1. console.firebase.google.com → nový projekt `geekhall-advent` (stejné ID je v `.firebaserc` a workflow; jiné ID změnit tam i v proměnné `FIREBASE_PROJECT_ID`).
2. Webová aplikace `</>` → `firebaseConfig` vložit do `src/config.ts`.
3. Authentication → Google → Enable. Authorized domains: doména kalendáře.
4. Firestore Database → `eur3`, production mode.
5. Hosting → Get started; případně vlastní doména (nastavit `authDomain` podle domény).
6. GitHub → Settings → Secrets → `FIREBASE_SERVICE_ACCOUNT` (JSON klíč servisního účtu; role Service Usage Consumer + Firebase Rules Admin).

## Vývoj a nasazení

```bash
npm install
npm run dev      # http://localhost:5173/
npm run build    # výstup v dist/
```

`main` → testovací kanál Firebase `test`, `produkce` → ostrý web (`.github/workflows/deploy.yml`).
Změny: `main` → vyzkoušet → sloučit do `produkce`.

## Struktura

| Soubor | Obsah |
| --- | --- |
| `src/content.ts` | všech 24 okének, provozovatel, odkazy |
| `src/config.ts` | Firebase, režimy, správci, souhlas s newsletterem |
| `src/components/Games.tsx` | kvíz, řazení, typový test |
| `src/components/Rules.tsx` | pravidla soutěží |
| `src/components/HeroArt.tsx`, `Decor.tsx` | ilustrace, logo, sníh, konfety |
| `firestore.rules` | pravidla databáze (soutěže ve dnech 5, 13, 19) |
