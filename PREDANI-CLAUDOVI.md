# Předání: adventní kalendář Geekhall 2026

Tento projekt je kopie adventního kalendáře Mobil Maják (Vite + React + TypeScript + Firebase) přepracovaná pro e-shop Geekhall (geekhall.cz). Princip a funkce zůstávají stejné jako u Mobil Maják, měnila se jen značka, obsah a Firebase projekt.

## Stav
- Hotovo: rebrand (fialová paleta, textové logo GEEKHALL, pixelový motiv v patičce), nových 24 okének (`src/content.ts`), pravidla soutěží (`src/components/Rules.tsx`), README s kontrolním seznamem. `npm run build` prochází.
- Odměny = 13 slevových kódů (`GEEK-D20`, `GEEK-WAAAGH` …, seznam v `README.md` a `docs/slevove-kody.csv`) zadávaných v košíku e-shopu.
- Vzhled (logo, písmo Roboto, barvy `#202124` / `#dc3545` / `#35dccc`, obrázky) je převzatý z geekhall.cz, repo je na GitHubu `morgenster95/geekhall-advent`.
- Zbývá: Firebase projekt a jeho config do `src/config.ts`, doplnění provozovatele (`OPERATOR` v `src/content.ts`), ověření všech nabídek (okénka s poznámkou `confirm`), kódy v e-shopu, pak `CONTENT_MODE = 'live'`.
- Odkazy a kategorie jsou ověřené proti geekhall.cz (26. 11. 2026), slevy kategorií platí jen na produkty dané kategorie a minimum se počítá jen z nich. Obrázky z geekhall.cz smíme použít (potvrdil zadavatel).

## Jak pokračovat
1. `npm install && npm run dev`, náhled všech okének na `/?nahled=geekadvent`.
2. Postup a kontrolní seznam: `README.md`.
3. Kontrola na konci: `grep -rniE "mobil|maj[aá]k|mmaj" src index.html firestore.rules .firebaserc .github` nesmí nic najít (kromě slova „mobilem“ v tipu okénka 15).
4. Admin e-mail je v `src/config.ts` (`ADMIN_EMAILS`) a musí být stejný ve `firestore.rules` (`isAdmin()`).
5. Před spuštěním se nesmí zapomenout na `DEMO_MODE = false`, vyplněný Firebase config a nasazení pravidel Firestore.

Zdrojový vzor: repo `databali4market-art/mobilmajak` (je v něm i `docs/NOVY-KLIENT.md` se šablonovým postupem).
