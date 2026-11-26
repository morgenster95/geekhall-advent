# Předání: adventní kalendář Geekhall 2026

Tento projekt je kopie adventního kalendáře Mobil Maják (Vite + React + TypeScript + Firebase) přepracovaná pro e-shop Geekhall (geekhall.cz). Princip a funkce zůstávají stejné jako u Mobil Maják, měnila se jen značka, obsah a Firebase projekt.

## Stav
- Hotovo: rebrand (fialová paleta, textové logo GEEKHALL, pixelový motiv v patičce), nových 24 okének (`src/content.ts`), pravidla soutěží (`src/components/Rules.tsx`), README s kontrolním seznamem. `npm run build` prochází.
- Odměny = slevové kódy `GEEK-01` až `GEEK-24` zadávané v košíku e-shopu (žádné pobočky).
- Zbývá: GitHub repo (`databali4market-art/geekhall-advent`, prázdné, push z původní session nešel), Firebase projekt a jeho config do `src/config.ts`, doplnění provozovatele (`OPERATOR` v `src/content.ts`), ověření všech nabídek (okénka s poznámkou `confirm`), logo a barvy podle značky, kódy v e-shopu, pak `CONTENT_MODE = 'live'`.
- Geekhall.cz nebyl při tvorbě dostupný, sortiment, odkazy a nabídky jsou odhad.

## Jak pokračovat
1. `npm install && npm run dev`, náhled všech okének na `/?nahled=geekadvent`.
2. Postup a kontrolní seznam: `README.md`.
3. Kontrola na konci: `grep -rniE "mobil|maj[aá]k|mmaj" src index.html firestore.rules .firebaserc .github` nesmí nic najít (kromě slova „mobilem“ v tipu okénka 15).
4. Admin e-mail je v `src/config.ts` (`ADMIN_EMAILS`) a musí být stejný ve `firestore.rules` (`isAdmin()`).
5. Před spuštěním se nesmí zapomenout na `DEMO_MODE = false`, vyplněný Firebase config a nasazení pravidel Firestore.

Zdrojový vzor: repo `databali4market-art/mobilmajak` (je v něm i `docs/NOVY-KLIENT.md` se šablonovým postupem).
