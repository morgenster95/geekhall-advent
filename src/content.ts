import type { Door } from './types';

/**
 * OBSAH KALENDÁŘE – všech 24 okének adventního kalendáře Geek Hall 2026.
 * Slevové kódy odpovídají odměnám domluveným se zadavatelem (13 kódů, 3 soutěže, zbytek hry a tipy).
 * Kódy je potřeba založit v e-shopu (viz README). U okének s poznámkou `confirm` zbývá ověřit podmínky;
 * poznámka se zobrazí jen v režimu CONTENT_MODE = 'draft'. Okénko se odemyká o půlnoci českého času (Europe/Prague).
 *
 * Texty: prázdný řádek = nový odstavec, jinak řádky zůstávají pod sebou.
 */
export const YEAR = 2026;

export const BASE = import.meta.env.BASE_URL;
export const SHOP = 'https://geekhall.cz/';
const IMG = BASE + 'img/';

/** Provozovatel kalendáře a pořadatel soutěží. Údaje převzaty z patičky geekhall.cz (© Svět karet s.r.o., IČO 11858770, prodejna v Hodoníně) – ověřit sídlo a doplnit DIČ. */
export const OPERATOR = {
  name: 'Svět karet s.r.o.',
  address: 'Dolní Valy 3940/2, 695 01 Hodonín',
  ico: '11858770',
  dic: 'DOPLNIT',
  email: 'info@geekhall.cz',
  phone: '+420 606 373 676',
};
export const RULES_URL = '?pravidla';
export const PRIVACY_URL = SHOP + 'ochrana-osobnich-udaju/';
export const CONTACT_URL = SHOP + 'kontakty/';

/** Hlavní kategorie e-shopu (menu v hlavičce) */
export const CATEGORIES = [
  { label: 'Pokémoni', url: SHOP + 'kategorie/sberatelske-hry-2/pokemoni/' },
  { label: 'Merch', url: SHOP + 'kategorie/merch/' },
  { label: 'Deskové hry', url: SHOP + 'kategorie/deskove-hry/' },
  { label: 'Sběratelské hry', url: SHOP + 'kategorie/sberatelske-hry-2/' },
  { label: 'Doplňky a příslušenství', url: SHOP + 'kategorie/doplnky-a-prislusenstvi/' },
  { label: 'Další', url: SHOP + 'kategorie/dalsi-produkty/' },
  { label: 'Blog', url: SHOP + 'blog/' },
];
const CAT = {
  figurky: SHOP + 'kategorie/merch/figurky-a-sosky/',
  plysaci: SHOP + 'kategorie/merch/plysaci/',
  deskovky: SHOP + 'kategorie/deskove-hry/',
  barveni: SHOP + 'kategorie/dalsi-produkty/wargaming-a-barveni/',
  sberatelske: SHOP + 'kategorie/sberatelske-hry-2/',
  pokemon: SHOP + 'kategorie/sberatelske-hry-2/pokemoni/',
  onepiece: SHOP + 'kategorie/sberatelske-hry-2/one-piece-karty/',
  doplnky: SHOP + 'kategorie/doplnky-a-prislusenstvi/',
  merch: SHOP + 'kategorie/merch/',
};

export const CONTEST_DAYS = [5, 13, 19];

const shop = { url: SHOP, urlLabel: 'Do e-shopu Geek Hall' };
const HOW = 'Kód zadejte v košíku e-shopu Geek Hall.';
const CAP = 'Platí pro objednávky do 10 000 Kč.';
const CATNOTE = 'Hodnota nákupu se počítá jen z produktů této kategorie a sleva platí jen na ně.';
const CONF = 'Ověřit podmínky slevy a založit kód v e-shopu (viz README).';
const CONF_MIN = 'Založit kód v e-shopu: sleva jen na produkty dané kategorie, minimum se počítá jen z nich (viz README).';

export const doors: Door[] = [
  {
    day: 1, type: 'tip', title: 'Level 1: Vítejte v adventu',
    text: `Hra začíná. Každou půlnoc tu čeká nový booster a v něm sleva, hra, tip nebo soutěž. Žádné prázdné obaly.

Slevové kódy zadáte v košíku e-shopu Geek Hall. U většiny platí sleva jen na produkty z jedné kategorie, třeba Warhammer, Pokémon nebo deskovky, a minimální nákup se počítá jen z nich. Podmínky najdete vždy u kódu.

Bonus na startu: doprava je u nás zdarma při nákupu nad 3 000 Kč.

Co otevřete, to máte ve sbírce. Najdete to kdykoli v sekci „Moje karty“.`,
    more: 'Zítra vás čeká první kvíz a s ním i první sleva. Rozbalte si ho.',
    ...shop,
  },
  {
    day: 2, type: 'game', title: 'Poznáte pravého geeka? Čtyři otázky',
    text: `Hvězdné války, kostky, Mario a nekonečno kamenů. Zvládnete čtyři otázky bez chyby?

Kdo odpoví správně na všechny, čeká ho odměna.`,
    game: {
      kind: 'quiz',
      hideAnswers: true,
      reward: 'Výborně, jste pravý geek! Do košíku zadejte kód GEEK-D20 a při nákupu nad 2 000 Kč máte slevu 5 %. Platí pro objednávky do 10 000 Kč a do 31. 12.',
      fail: 'Tentokrát to nevyšlo. Zkuste to znovu.',
      questions: [
        { q: 'Jak se jmenuje pouštní planeta, na které vyrůstal Luke Skywalker?', options: ['Hoth', 'Tatooine', 'Endor', 'Naboo'], answer: 1 },
        { q: 'Kterou kostkou se v Dungeons & Dragons hází na útok?', options: ['d6', 'd8', 'd12', 'd20'], answer: 3 },
        { q: 'Kterou princeznu zachraňuje Mario v původní hře Super Mario Bros.?', options: ['Zelda', 'Daisy', 'Peach', 'Rosalina'], answer: 2 },
        { q: 'Kolik Kamenů nekonečna je v komiksech a filmech Marvelu?', options: ['5', '6', '7', '9'], answer: 1 },
      ],
    },
    confirm: 'Založit kód GEEK-D20: 5 % při nákupu nad 2 000 Kč, do objednávky 10 000 Kč.',
  },
  {
    day: 3, type: 'tip', title: '4 tipy, jak pečovat o sběratelské figurky',
    text: 'Dobrá figurka vydrží roky, pokud se o ni správně staráte. Tady jsou čtyři zásady:',
    list: [
      'Mimo přímé slunce. UV záření vybledne barvy a zkřehne plast.',
      'Prach stírejte měkkým štětcem. Hadr a chemie umí poškodit lak.',
      'Vitrína nebo krabice. Zavřený prostor brání prachu i vlhkosti.',
      'Originální krabici nevyhazujte. Sběratelská hodnota je s ní výrazně vyšší.',
    ],
    more: 'Máte doma místo, kde by se hodila další? Zítra na vás čeká překvapení.',
    url: CAT.figurky, urlLabel: 'Figurky a sošky',
  },
  {
    day: 4, type: 'offer', title: '5 % na figurky a sošky',
    text: `Včera jsme si ukázali, jak o figurky pečovat. Dnes si můžete přidat další.

Pokud nakoupíte figurky a sošky za více než 1 000 Kč, máte na ně slevu 5 %. ${CATNOTE} ${HOW}

Platí do 31. 12.`,
    coupon: { code: 'GEEK-SOSKA', value: 'Sleva 5 % na figurky a sošky při jejich nákupu nad 1 000 Kč', valid: 'Platí do 31. 12.' },
    confirm: CONF_MIN, url: CAT.figurky, urlLabel: 'Figurky a sošky',
  },
  {
    day: 5, type: 'contest', title: 'Soutěž o herní set dle vašeho výběru',
    text: `Mikuláš letos nadělí geekovi radost.

Soutěžíme o nákup v e-shopu Geek Hall v hodnotě 3 000 Kč. Stačí vyplnit svůj e-mail a jste ve hře.

Výherce vylosujeme na Štědrý den 24. 12. a ozveme se mu e-mailem.

Držíme palce!`,
    contest: {
      kind: 'email',
      prize: 'Dárkový poukaz do e-shopu Geek Hall v hodnotě 3 000 Kč',
      rules: 'Zapojit se můžete do 23. 12. 2026 do 23:59. Výherce vylosujeme 24. 12. a pošleme mu e-mail.',
      until: '2026-12-23T23:59:59+01:00',
    },
    confirm: 'Potvrdit hlavní cenu (poukaz 3 000 Kč) a pořadatele soutěže.', ...shop,
  },
  {
    day: 6, type: 'game', title: 'Jak dobře znáte svět her?',
    text: 'Hrajete, sbíráte, nebo jen koukáte? Pět otázek, žádný stres.',
    game: {
      kind: 'quiz',
      verdicts: [
        { min: 5, text: 'Výborně, jste herní encyklopedie.' },
        { min: 3, text: 'Skvělý výsledek. Pár kousků vám ještě uniká.' },
        { min: 0, text: 'Nevadí. Hlavně že hrajete.' },
      ],
      questions: [
        { q: 'V jakém roce vyšel původní Tetris?', options: ['1984', '1992', '2001'], answer: 0, explain: 'Tetris vymyslel Alexej Pažitnov v Moskvě v roce 1984.' },
        { q: 'Co znamená zkratka RPG?', options: ['Rapid Play Game', 'Role-playing game', 'Real Pixel Graphics'], answer: 1, explain: 'Hraní rolí, kde ovládáte postavu a rozvíjíte její schopnosti.' },
        { q: 'Jak se jmenuje hrdina série The Legend of Zelda?', options: ['Zelda', 'Ganon', 'Link'], answer: 2, explain: 'Zelda je princezna, kterou Link zachraňuje. Častá záměna.' },
        { q: 'Kolik ok je na protější straně klasické šestistěnné kostky než šestka?', options: ['1', '2', '3'], answer: 0, explain: 'Součet protilehlých stran je vždy 7.' },
        { q: 'Který droid z Hvězdných válek komunikuje jen pípáním a hvízdáním?', options: ['C-3PO', 'R2-D2', 'BB-8 je jediný'], answer: 1, explain: 'R2-D2 mluví binárním jazykem. BB-8 pípá také, ale je z novější trilogie.' },
      ],
    },
  },
  {
    day: 7, type: 'offer', title: 'Star Wars: 10 % na produkty ze vzdálené galaxie',
    text: `Ať je s vámi Síla, i když je v košíku pár věcí navíc.

Pokud nakoupíte produkty Star Wars za více než 2 000 Kč, máte na ně slevu 10 %. ${CATNOTE} ${HOW}

${CAP} Platí do 31. 12.`,
    image: { src: IMG + 'obiwan.png', alt: 'Figurka Obi-Wan Kenobi z Hvězdných válek' },
    coupon: { code: 'GEEK-SILA', value: 'Sleva 10 % na produkty Star Wars při jejich nákupu nad 2 000 Kč', valid: 'Do objednávky 10 000 Kč, platí do 31. 12.' },
    confirm: CONF_MIN, url: CAT.sberatelske + 'star-wars-unlimited/', urlLabel: 'Star Wars: Unlimited',
  },
  {
    day: 8, type: 'tip', title: 'Dárek pro sběratele, hráče i deskovkáře',
    text: 'Vybrat dárek pro geeka není jednoduché. Proto jsme vybrali za vás.',
    links: [
      { label: 'Pro sběratele: karetní hry', url: CAT.sberatelske, note: 'Pokémon, One Piece, Lorcana, Magic, Riftbound i Star Wars: Unlimited.' },
      { label: 'Pro deskovkáře: deskové hry', url: CAT.deskovky, note: 'Strategické, rodinné, párty i kooperativní hry pro dlouhé zimní večery.' },
      { label: 'Pro fanoušky: merch a figurky', url: CAT.merch, note: 'Figurky, plyšáci, oblečení a geek domácnost z oblíbených světů.' },
      { label: 'Pro hráče: doplňky a příslušenství', url: CAT.doplnky, note: 'Obaly, alba, toploadery, kostky a herní podložky.' },
    ],
    more: 'Nevíte si rady? Napište nám a poradíme.',
  },
  {
    day: 9, type: 'offer', title: 'Deskové hry: 5 % na dlouhé zimní večery',
    text: `Vánoční svátky patří rodině a společné hře. Dnes jsou deskovky levnější.

Pokud nakoupíte deskové hry za více než 1 000 Kč, máte na ně slevu 5 %. ${CATNOTE} ${HOW}

Platí do 31. 12.`,
    image: { src: IMG + 'strategicke.jpg', alt: 'Strategické deskové hry' },
    coupon: { code: 'GEEK-KOSTKA', value: 'Sleva 5 % na deskové hry při jejich nákupu nad 1 000 Kč', valid: 'Platí do 31. 12.' },
    confirm: CONF_MIN, url: CAT.deskovky, urlLabel: 'Deskové hry',
  },
  {
    day: 10, type: 'tip', title: 'Dárek pro geeka: 5 věcí, než ho zabalíte',
    text: 'Dárek, který se trefí do vkusu, vyžaduje trochu přípravy. Zkontrolujte tyto věci ještě před zabalením:',
    list: [
      'Zjistěte, co už má. Duplicitní figurka nebo hra jsou nejčastější chyba.',
      'Správný set nebo edice. Karetní hry mají desítky edic, ověřte, kterou sbírá.',
      'Jazyk a pravidla. U deskovek a karet ověřte, zda je hra česky nebo anglicky.',
      'Nezapomeňte na příslušenství. Obaly, album nebo toploader chrání sbírku od prvního dne.',
      'Zvažte velikost a stav krabice. U sběratelských kousků záleží na neporušeném obalu.',
    ],
    more: 'Nevíte? Napište nám, jaký geek to je, a poradíme.',
    ...shop,
  },
  {
    day: 11, type: 'offer', title: 'Barvení a modelařství: 10 % na štětce a barvy',
    text: `Ať figurky na stole vypadají jako z turnaje. Dnes jsou barvy, štětce a modelářské potřeby levnější.

Pokud nakoupíte barvy a modelářské potřeby za více než 1 000 Kč, máte na ně slevu 10 %. ${CATNOTE} ${HOW}

Platí do 31. 12.`,
    coupon: { code: 'GEEK-STETEC', value: 'Sleva 10 % na barvení a modelařství při jejich nákupu nad 1 000 Kč', valid: 'Platí do 31. 12.' },
    confirm: CONF_MIN, url: CAT.barveni, urlLabel: 'Wargaming a barvení',
  },
  {
    day: 12, type: 'offer', title: 'Plyšáci: 10 % na mazlíky pod stromeček',
    text: `Plyšák se hodí pod stromeček každému, malému i velkému. Pokémoni, oblíbení hrdinové i klasika.

Při nákupu plyšáků máte slevu 10 %, bez minimální hodnoty nákupu. ${HOW}

Platí do 31. 12.`,
    image: { src: IMG + 'plysak.jpg', alt: 'Plyšák Teddiursa z kolekce Pokémon Squishmallows' },
    coupon: { code: 'GEEK-PLYSAK', value: 'Sleva 10 % na plyšáky', valid: 'Platí do 31. 12.' },
    confirm: CONF, url: CAT.plysaci, urlLabel: 'Plyšáci',
  },
  {
    day: 13, type: 'contest', title: 'Kolik balíčků jsme letos odeslali?',
    text: `Krabice, krabičky a pořádné balíky. Letos jsme jich odeslali opravdu hodně.

Zkuste odhadnout, kolik balíčků jsme v roce 2026 odeslali. Kdo se trefí nejblíž, vyhraje poukaz do e-shopu v hodnotě 1 000 Kč.

Zadejte svůj tip a e-mail. Tipy můžete posílat do pátku 18. 12. Výherce vyhlásíme v pondělí 21. 12. a ozveme se mu e-mailem.`,
    contest: {
      kind: 'number', placeholder: 'Váš tip (celé číslo)',
      prize: 'Dárkový poukaz do e-shopu Geek Hall v hodnotě 1 000 Kč',
      rules: 'Tipy můžete posílat do 18. 12. 2026 do 23:59. Vyhrává nejbližší tip, při shodě ten dříve odeslaný. Výherce vyhlásíme 21. 12.',
      until: '2026-12-18T23:59:59+01:00',
    },
    confirm: 'Doplnit skutečný počet odeslaných balíků za rok 2026 (pro vyhodnocení) a cenu 1 000 Kč.',
  },
  {
    day: 14, type: 'offer', title: 'Warhammer: 10 % ve jménu Císaře',
    text: `Za Císaře! Nebo za Sigmara, jak je libo. Armáda se sama nepostaví.

Pokud nakoupíte produkty Warhammer (40k a Age of Sigmar) za více než 3 000 Kč, máte na ně slevu 10 %. ${CATNOTE} ${HOW}

${CAP} Platí do 31. 12.`,
    image: { src: IMG + 'warhammer.png', alt: 'Logo Warhammer' },
    coupon: { code: 'GEEK-WAAAGH', value: 'Sleva 10 % na Warhammer (40k, Age of Sigmar) při jeho nákupu nad 3 000 Kč', valid: 'Do objednávky 10 000 Kč, platí do 31. 12.' },
    confirm: CONF_MIN, url: CAT.barveni, urlLabel: 'Wargaming a barvení',
  },
  {
    day: 15, type: 'tip', title: 'Jak vyfotit sbírku mobilem jako profík',
    text: 'Figurky, karty nebo herní kout si zaslouží pořádnou fotku. Pár jednoduchých triků:',
    list: [
      'Otřete čočku. Fotoaparát v kapse sbírá otisky víc, než si myslíte.',
      'Světlo z boku. Okno nebo lampa vedle sbírky dá fotce hloubku.',
      'Jednobarevné pozadí. List papíru za figurkou odstraní rozptýlení.',
      'Fotěte z úrovně očí figurky. Najednou působí živě.',
      'Zapněte portrétní režim. Pozadí se rozostří a figurka vynikne.',
    ],
    more: 'Fotky sbírky sdílejte! A zítra se sem vyplatí zase podívat.',
  },
  {
    day: 16, type: 'game', title: 'Seřaďte hry podle roku vydání',
    text: 'Od Pac-Mana po Minecraft. Pamatujete si, jak šel čas?',
    game: {
      kind: 'order',
      prompt: 'Seřaďte tyto hry od nejstarší po nejnovější. Karty přetáhněte, nebo je posouvejte šipkami.',
      win: 'Výborně, jste skutečný znalec.',
      lose: 'Nevadí. Pac-Mana jsme stejně hráli všichni.',
      items: [
        { label: 'Pac-Man', year: 1980 },
        { label: 'Super Mario Bros.', year: 1985 },
        { label: 'Doom', year: 1993 },
        { label: 'Pokémon Red a Green (Japonsko)', year: 1996 },
        { label: 'Minecraft (plná verze)', year: 2011 },
      ],
    },
  },
  {
    day: 17, type: 'offer', title: 'Harry Potter: 10 % z Příčné ulice',
    text: `Sova s dopisem dorazila. Bradavice posílají pozvánku na nákup.

Pokud nakoupíte produkty Harry Potter za více než 2 000 Kč, máte na ně slevu 10 %. ${CATNOTE} ${HOW}

${CAP} Platí do 31. 12.`,
    image: { src: IMG + 'potter.jpeg', alt: 'Sada oblečení Harry Potter, kolej Zmijozel' },
    coupon: { code: 'GEEK-BRADAVICE', value: 'Sleva 10 % na produkty Harry Potter při jejich nákupu nad 2 000 Kč', valid: 'Do objednávky 10 000 Kč, platí do 31. 12.' },
    confirm: CONF_MIN, url: CAT.merch, urlLabel: 'Merch',
  },
  {
    day: 18, type: 'offer', title: 'Pokémon TCG: 5 % na chytání karet',
    text: `Pikachu hlásí: ve vánočním nákupu to chce pár boosterů navíc.

Pokud nakoupíte produkty Pokémon TCG za více než 4 000 Kč, máte na ně slevu 5 %. ${CATNOTE} ${HOW}

${CAP} Platí do 31. 12.`,
    image: { src: IMG + 'pikachu.png', alt: 'Pikachu' },
    coupon: { code: 'GEEK-POKEBALL', value: 'Sleva 5 % na Pokémon TCG při jeho nákupu nad 4 000 Kč', valid: 'Do objednávky 10 000 Kč, platí do 31. 12.' },
    confirm: CONF_MIN, url: CAT.pokemon, urlLabel: 'Pokémoni',
  },
  {
    day: 19, type: 'contest', title: 'Soutěž o nejlepší geek koutek',
    text: `Police plná figurek, herní setup, nebo celá vitrína? Ukažte nám, kde bydlí váš nejoblíbenější kousek.

Vyfoťte svůj geek koutek a pošlete nám ho. Majitel toho nejzajímavějšího vyhraje nákup v e-shopu Geek Hall v hodnotě 2 000 Kč.

Fotky můžete posílat do úterý 22. 12., výherce vyhlásíme ve středu 23. 12.`,
    contest: {
      kind: 'photo',
      prize: 'Dárkový poukaz do e-shopu Geek Hall v hodnotě 2 000 Kč',
      rules: 'Fotky můžete posílat do 22. 12. 2026 do 23:59. Fotka musí být vlastní a neupravená. Výherce vyhlásíme 23. 12.',
      until: '2026-12-22T23:59:59+01:00',
    },
    confirm: 'Potvrdit cenu (poukaz 2 000 Kč) a že pořadatel smí fotky zveřejnit.',
  },
  {
    day: 20, type: 'game', title: 'Jaký jste typ geeka?',
    text: 'Někdo sbírá karty, jiný skládá armádu a další hraje u stolu s přáteli. Čtyři otázky a víme, jaký typ jste vy.',
    game: {
      kind: 'persona',
      // body: Sběratel 1A 2A 3A 4A · Hráč 1B 2B 3B 4B · Deskovkář 1C 2C 3C 4C
      // (při shodě vyhrává typ, který je v results dřív)
      questions: [
        { q: 'Jak nejraději trávíte volný večer?', options: [{ t: 'Přerovnáváním sbírky karet a figurek', r: 'collector' }, { t: 'Malováním figurek nebo skládáním modelu', r: 'gamer' }, { t: 'U stolu s kamarády a hrou', r: 'tabletop' }] },
        { q: 'Co by vás potěšilo pod stromečkem?', options: [{ t: 'Booster box nebo limitovaná figurka', r: 'collector' }, { t: 'Nová armáda nebo sada barev', r: 'gamer' }, { t: 'Nová deskovka', r: 'tabletop' }] },
        { q: 'Kolik máte doma věcí z oblíbené série?', options: [{ t: 'Celou vitrínu', r: 'collector' }, { t: 'Pár kousků, ale poctivě pomalovaných', r: 'gamer' }, { t: 'Spíš krabice her než věcí', r: 'tabletop' }] },
        { q: 'Na co se na Vánoce těšíte nejvíc?', options: [{ t: 'Až doma všechno vystavím', r: 'collector' }, { t: 'Na volno a velkou bitvu', r: 'gamer' }, { t: 'Na hru s celou rodinou', r: 'tabletop' }] },
      ],
      results: {
        collector: { title: 'Sběratel', text: 'Každý kousek má své místo. Doporučujeme karetní hry, figurky a sběratelské předměty.', links: [{ label: 'Sběratelské hry', url: CAT.sberatelske }, { label: 'Figurky a sošky', url: CAT.figurky }] },
        gamer: { title: 'Hráč a modelář', text: 'Vaším domovem je bojiště na stole. Doporučujeme Warhammer, barvy a herní příslušenství.', links: [{ label: 'Wargaming a barvení', url: CAT.barveni }, { label: 'Doplňky a příslušenství', url: CAT.doplnky }] },
        tabletop: { title: 'Deskovkář', text: 'Nejlepší hra je ta, u které se sejde parta. Doporučujeme deskovky pro každou příležitost.', links: [{ label: 'Deskové hry', url: CAT.deskovky }] },
      },
    },
  },
  {
    day: 21, type: 'offer', title: 'One Piece TCG: 5 % na hledání pokladu',
    text: `Poklad Gold Rogera čeká a nová karta do balíčku taky.

Pokud nakoupíte produkty One Piece TCG za více než 4 000 Kč, máte na ně slevu 5 %. ${CATNOTE} ${HOW}

${CAP} Platí do 31. 12.`,
    coupon: { code: 'GEEK-POKLAD', value: 'Sleva 5 % na One Piece TCG při jeho nákupu nad 4 000 Kč', valid: 'Do objednávky 10 000 Kč, platí do 31. 12.' },
    confirm: CONF_MIN, url: CAT.onepiece, urlLabel: 'One Piece TCG',
  },
  {
    day: 22, type: 'offer', title: 'StarCraft: 10 % a zerg rush do košíku',
    text: `Zerglingové jsou na cestě. Základnu už nepostavíte, ale s dnešní slevou si můžete postavit sbírku.

Pokud nakoupíte produkty StarCraft za více než 2 000 Kč, máte na ně slevu 10 %. ${CATNOTE} ${HOW}

${CAP} Platí do 31. 12.`,
    coupon: { code: 'GEEK-ZERG', value: 'Sleva 10 % na produkty StarCraft při jejich nákupu nad 2 000 Kč', valid: 'Do objednávky 10 000 Kč, platí do 31. 12.' },
    confirm: CONF_MIN, ...shop,
  },
  {
    day: 23, type: 'offer', title: 'Vánoční loot: 5 % na celý nákup',
    text: `Předvánoční loot je tady. Dnes si můžete přihodit cokoli, sleva se počítá z celého nákupu.

Při nákupu nad 2 000 Kč máte slevu 5 % na celý nákup, bez omezení na kategorii. ${HOW}

${CAP} Platí do 24. 12.`,
    image: { src: IMG + 'kostky.jpeg', alt: 'Solnička a pepřenka ve tvaru kostek z Dungeons & Dragons' },
    coupon: { code: 'GEEK-LOOT', value: 'Sleva 5 % na celý nákup nad 2 000 Kč', valid: 'Do objednávky 10 000 Kč, platí do 24. 12.' },
    confirm: CONF, ...shop,
  },
  {
    day: 24, type: 'finale', title: 'Krásné Vánoce od Geek Hallu',
    text: `Děkujeme, že jste s námi otevírali adventní okénka.

Dnes losujeme výherce hlavní ceny, poukazu do e-shopu Geek Hall. Výherci pošleme e-mail ještě dnes.

A protože k Vánocům patří dárky pro všechny, máme jeden i pro vás: legendární drop na závěr. Při nákupu nad 5 000 Kč máte slevu 10 % na celý nákup, bez omezení na kategorii. Platí pro objednávky do 10 000 Kč, kód zadejte do 31. 1. 2027.`,
    coupon: { code: 'GEEK-LEGENDA', value: 'Sleva 10 % na celý nákup nad 5 000 Kč', valid: 'Do objednávky 10 000 Kč, platí do 31. 1. 2027' },
    more: `Krásné Vánoce a ať se vám pod stromečkem sejde všechno, co si přejete.

Váš Geek Hall`,
    confirm: 'Potvrdit platnost kódu (do 31. 1. 2027?) a založit kód v e-shopu.', ...shop,
  },
];

/** soutěž je ještě otevřená (v náhledu vždy) */
export const contestOpen = (until: string, now = Date.now()) => now <= Date.parse(until);

export function availableDay(now = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Prague', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const get = (n: string) => Number(parts.find((x) => x.type === n)?.value);
  const y = get('year'), m = get('month'), d = get('day');
  if (y < YEAR || (y === YEAR && m < 12)) return 0;
  if (y > YEAR) return 24;
  return Math.min(24, d);
}
