# Adventní kalendář 2026 – Geekhall

Kopie adventního kalendáře Mobil Maják (Vite + React + TypeScript + Firebase) přepracovaná pro e-shop Geekhall.
Princip a funkce jsou stejné: 24 okének odemykaných o půlnoci (Europe/Prague), přihlášení přes Google, kvízy a hry
(kvíz, řazení přetahováním, typový test), 3 soutěže (e-mail / tip čísla / fotka) s uzávěrkami i ve `firestore.rules`,
newsletterový souhlas (datum + znění), `/?admin` s exportem CSV, pravidla soutěží `/?pravidla`.
Rozdíl: e-shop místo poboček – odměny jsou **slevové kódy `GEEK-xx` do košíku**.

## Co je potřeba doplnit před spuštěním

- [ ] **Firebase projekt** (viz níže) a `FIREBASE` v `src/config.ts`. Dokud je `apiKey` prázdný, web běží v ukázkovém režimu (data jen v prohlížeči).
- [ ] **Provozovatel** (`OPERATOR` v `src/content.ts`): firma, sídlo, IČ, DIČ, e-mail – zobrazí se v patičce a pravidlech.
- [ ] **Texty a nabídky v `src/content.ts`** jsou návrh (slevy, ceny soutěží, termíny). Každé okénko s poznámkou `confirm` ověřit a pak přepnout `CONTENT_MODE = 'live'`.
- [ ] Soutěž 13: doplnit skutečný počet odeslaných balíků za rok 2026. Ceny soutěží (3 000 / 1 000 / 2 000 Kč) potvrdit i v `src/components/Rules.tsx`.
- [ ] Odkazy: `PRIVACY_URL`, `CONTACT_URL`, odkazy na kategorie v okénkách 8 a 20 (odhad adres geekhall.cz).
- [ ] Kódy `GEEK-01` … `GEEK-24` vytvořit v e-shopu jako slevové kupóny podle textů okének.
- [ ] Logo: zatím textový logotyp v `src/components/Decor.tsx` (`Logo`). Oficiální SVG logo vložit tam, `public/favicon.svg` také.
- [ ] Barvy: tokeny `:root` v `src/styles.css` (zatím fialová + azurová) upravit podle značky.
- [ ] Správce: Google e-mail v `ADMIN_EMAILS` (`src/config.ts`) **i** v `isAdmin()` ve `firestore.rules`.
- [ ] `DEMO_MODE = false` (výchozí), `PREVIEW_KEY` (`?nahled=geekadvent` odemkne všechna okénka).

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
