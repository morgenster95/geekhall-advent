import type { Door } from './types';

/**
 * OBSAH KALENDÁŘE – všech 24 okének adventního kalendáře Geekhall 2026.
 * Texty, slevy a kódy jsou NÁVRH – ověřte je před spuštěním (u každé nabídky je poznámka `confirm`,
 * která se zobrazí jen v režimu CONTENT_MODE = 'draft'). Okénko se odemyká o půlnoci českého času (Europe/Prague).
 *
 * Texty: prázdný řádek = nový odstavec, jinak řádky zůstávají pod sebou.
 */
export const YEAR = 2026;

export const BASE = import.meta.env.BASE_URL;
export const SHOP = 'https://www.geekhall.cz/';
const IMG = BASE + 'img/';
void IMG;

/** Provozovatel kalendáře a pořadatel soutěží – DOPLNIT před spuštěním (patička + pravidla soutěží) */
export const OPERATOR = {
  name: 'DOPLNIT provozovatele (obchodní firma)',
  address: 'DOPLNIT sídlo',
  ico: 'DOPLNIT',
  dic: 'DOPLNIT',
  email: 'DOPLNIT@geekhall.cz',
  phone: '',
};
export const RULES_URL = '?pravidla';
export const PRIVACY_URL = SHOP + 'ochrana-osobnich-udaju/';
export const CONTACT_URL = SHOP + 'kontakt/';

export const CONTEST_DAYS = [5, 13, 19];

const shop = { url: SHOP, urlLabel: 'Do e-shopu Geekhall' };
const HOW = 'Kód zadejte v košíku e-shopu Geekhall.';
const CONF = 'Návrh nabídky – potvrdit podmínky, sortiment a platnost kódu v e-shopu.';

export const doors: Door[] = [
  {
    day: 1, type: 'offer', title: 'Vítejte v adventu s Geekhallem',
    text: `Až do Štědrého dne na vás tady každý den čeká nové okénko. Slevy, hry, soutěže a tipy pro každého geeka.

A hned na začátek máme dárek: doprava zdarma k jakékoli objednávce.

${HOW} Platí do 31. 12.

Všechno, co otevřete, najdete i později v sekci „Moje dárky“. Další okénko se odemyká vždy o půlnoci.`,
    coupon: { code: 'GEEK-01', value: 'Doprava zdarma k jakékoli objednávce', valid: 'Platí do 31. 12.' },
    confirm: CONF, ...shop,
  },
  {
    day: 2, type: 'game', title: 'Poznáte pravého geeka? Čtyři otázky',
    text: `Hvězdné války, kostky, Mario a nekonečno kamenů. Zvládnete čtyři otázky bez chyby?

Kdo odpoví správně na všechny, čeká ho odměna.`,
    game: {
      kind: 'quiz',
      hideAnswers: true,
      reward: 'Výborně, jste pravý geek! Do košíku zadejte kód GEEK-02 a máte slevu 5 % na celý nákup. Platí do 31. 12.',
      fail: 'Tentokrát to nevyšlo. Zkuste to znovu.',
      questions: [
        { q: 'Jak se jmenuje pouštní planeta, na které vyrůstal Luke Skywalker?', options: ['Hoth', 'Tatooine', 'Endor', 'Naboo'], answer: 1 },
        { q: 'Kterou kostkou se v Dungeons & Dragons hází na útok?', options: ['d6', 'd8', 'd12', 'd20'], answer: 3 },
        { q: 'Kterou princeznu zachraňuje Mario v původní hře Super Mario Bros.?', options: ['Zelda', 'Daisy', 'Peach', 'Rosalina'], answer: 2 },
        { q: 'Kolik Kamenů nekonečna je v komiksech a filmech Marvelu?', options: ['5', '6', '7', '9'], answer: 1 },
      ],
    },
    confirm: 'Potvrdit slevu 5 % (kód GEEK-02) a že se zadá ručně v košíku.',
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
    ...shop,
  },
  {
    day: 4, type: 'offer', title: '10 % na figurky a sběratelské předměty',
    text: `Včera jsme si ukázali, jak o figurky pečovat. Dnes si můžete přidat další.

Sleva 10 % na figurky a sběratelské předměty. ${HOW}

Nabídka platí jen 48 hodin, do soboty 5. 12. do půlnoci.`,
    coupon: { code: 'GEEK-04', value: 'Sleva 10 % na figurky a sběratelské předměty', valid: 'Platí 48 hodin, do soboty 5. 12. do půlnoci' },
    confirm: CONF, ...shop,
  },
  {
    day: 5, type: 'contest', title: 'Soutěž o herní set dle vašeho výběru',
    text: `Mikuláš letos nadělí geekovi radost.

Soutěžíme o nákup v e-shopu Geekhall v hodnotě 3 000 Kč. Stačí vyplnit svůj e-mail a jste ve hře.

Výherce vylosujeme na Štědrý den 24. 12. a ozveme se mu e-mailem.

Držíme palce!`,
    contest: {
      kind: 'email',
      prize: 'Dárkový poukaz do e-shopu Geekhall v hodnotě 3 000 Kč',
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
    day: 7, type: 'offer', title: 'Hrnky a trička: sleva 15 %',
    text: `Hrnek s hláškou a tričko s motivem oblíbené série patří mezi dárky, které se vždy trefí.

Sleva 15 % na hrnky a trička. ${HOW}

Platí do 31. 12.`,
    coupon: { code: 'GEEK-07', value: 'Sleva 15 % na hrnky a trička', valid: 'Platí do 31. 12.' },
    confirm: CONF, ...shop,
  },
  {
    day: 8, type: 'tip', title: 'Dárek pro hráče, sběratele i deskovkáře',
    text: 'Vybrat dárek pro geeka není jednoduché. Proto jsme vybrali za vás.',
    links: [
      { label: 'Pro hráče: herní doplňky', url: SHOP, note: 'Podložky, ovladače, sluchátka a vše, co se hodí k hraní.' },
      { label: 'Pro sběratele: figurky a sběratelské předměty', url: SHOP, note: 'Kousky z oblíbených filmů, seriálů, her a komiksů.' },
      { label: 'Pro deskovkáře: hry a doplňky', url: SHOP, note: 'Společenské hry, kostky a karty pro dlouhé zimní večery.' },
    ],
    more: 'Nevíte si rady? Napište nám a poradíme.',
    confirm: 'Doplnit přímé odkazy na kategorie v e-shopu.',
  },
  {
    day: 9, type: 'offer', title: 'Deskovky a puzzle: sleva 12 %',
    text: `Vánoční svátky patří rodině a společné hře. Dnes jsou deskovky a puzzle levnější.

Sleva 12 % na deskové hry a puzzle. ${HOW}

Platí do 31. 12.`,
    coupon: { code: 'GEEK-09', value: 'Sleva 12 % na deskové hry a puzzle', valid: 'Platí do 31. 12.' },
    confirm: CONF, ...shop,
  },
  {
    day: 10, type: 'tip', title: 'Dárek pro geeka: 5 věcí, než ho zabalíte',
    text: 'Dárek, který se trefí do vkusu, vyžaduje trochu přípravy. Zkontrolujte tyto věci ještě před zabalením:',
    list: [
      'Zjistěte, co už má. Duplicitní figurka nebo hra jsou nejčastější chyba.',
      'Sedí platforma? Hra pro PlayStation nepoběží na Switchi.',
      'Vyberte správnou edici. Standardní, sběratelská, rozšíření.',
      'Přibalte baterie nebo nabíječku. Ať se dá hrát hned.',
      'Přidejte dárkovou poukázku. Jako pojistku pro velikost nebo jiný vkus.',
    ],
    more: 'Nevíte? Pomůže vám naše poradna: napište nám, jaký geek to je.',
    ...shop,
  },
  {
    day: 11, type: 'offer', title: 'Dva za cenu jednoho: druhá figurka zdarma',
    text: `Jednu pro sebe a druhou jako dárek.

Při koupi dvou vybraných figurek je ta levnější zdarma. ${HOW}

Platí do 31. 12.`,
    coupon: { code: 'GEEK-11', value: 'Druhá (levnější) vybraná figurka zdarma', valid: 'Platí do 31. 12.' },
    confirm: 'Upřesnit, které figurky se akce týká, a jak ji nastavit v košíku (slevový kód vs. akce).', ...shop,
  },
  {
    day: 12, type: 'tip', title: 'Jak zabalit křehký dárek, aby přežil cestu',
    text: `Figurka nebo sběratelský kousek si zaslouží opatrné zacházení. Pár zásad pro balení a předání:`,
    list: [
      'Chraňte rohy a výstupky. Hadříkem nebo bublinkovou fólií.',
      'Nechte originální krabici. Dodatečně ji zabalte do kartonu.',
      'Označte „křehké“. Ať ví i ten, kdo balíček nese.',
      'Při převzetí zkontrolujte obal. Poškozený balík reklamujte hned.',
    ],
    more: 'Nechcete balit sami? V e-shopu u objednávky vyberte dárkové balení, pokud je u produktu dostupné.',
    ...shop,
  },
  {
    day: 13, type: 'contest', title: 'Kolik balíčků jsme letos odeslali?',
    text: `Krabice, krabičky a pořádné balíky. Letos jsme jich odeslali opravdu hodně.

Zkuste odhadnout, kolik balíčků jsme v roce 2026 odeslali. Kdo se trefí nejblíž, vyhraje poukaz do e-shopu v hodnotě 1 000 Kč.

Zadejte svůj tip a e-mail. Tipy můžete posílat do pátku 18. 12. Výherce vyhlásíme v pondělí 21. 12. a ozveme se mu e-mailem.`,
    contest: {
      kind: 'number', placeholder: 'Váš tip (celé číslo)',
      prize: 'Dárkový poukaz do e-shopu Geekhall v hodnotě 1 000 Kč',
      rules: 'Tipy můžete posílat do 18. 12. 2026 do 23:59. Vyhrává nejbližší tip, při shodě ten dříve odeslaný. Výherce vyhlásíme 21. 12.',
      until: '2026-12-18T23:59:59+01:00',
    },
    confirm: 'Doplnit skutečný počet odeslaných balíků za rok 2026 (pro vyhodnocení) a cenu 1 000 Kč.',
  },
  {
    day: 14, type: 'offer', title: 'Gaming doplňky: sleva 10 %',
    text: `Dobrý hráč potřebuje dobré vybavení.

Sleva 10 % na herní doplňky. ${HOW}

Platí do 31. 12.`,
    coupon: { code: 'GEEK-14', value: 'Sleva 10 % na herní doplňky', valid: 'Platí do 31. 12.' },
    confirm: CONF, ...shop,
  },
  {
    day: 15, type: 'tip', title: 'Jak vyfotit sbírku mobilem jako profík',
    text: 'Figurky, LEGO nebo herní kout si zaslouží pořádnou fotku. Pár jednoduchých triků:',
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
    day: 17, type: 'offer', title: 'Tajný kód jen pro vás',
    text: `Dnešní okénko je tajné.

Zadejte tento tajný kód v košíku a dostanete malý dárek k objednávce.

Platí do 24. 12.`,
    coupon: { code: 'GEEK-17', value: 'Malý dárek k objednávce', valid: 'Platí do 24. 12.' },
    confirm: 'Určit, co je „malý dárek“ a jak se přidá k objednávce (ručně / automaticky).', ...shop,
  },
  {
    day: 18, type: 'offer', title: 'Doprava zdarma bez minima',
    text: `Dnes nemusíte nic počítat. Jakkoli malá objednávka, doprava vás nestojí nic.

${HOW}

Platí do 31. 12.`,
    coupon: { code: 'GEEK-18', value: 'Doprava zdarma bez minimální hodnoty objednávky', valid: 'Platí do 31. 12.' },
    confirm: CONF, ...shop,
  },
  {
    day: 19, type: 'contest', title: 'Soutěž o nejlepší geek koutek',
    text: `Police plná figurek, herní setup, nebo celá vitrína? Ukažte nám, kde bydlí váš nejoblíbenější kousek.

Vyfoťte svůj geek koutek a pošlete nám ho. Majitel toho nejzajímavějšího vyhraje nákup v e-shopu Geekhall v hodnotě 2 000 Kč.

Fotky můžete posílat do úterý 22. 12., výherce vyhlásíme ve středu 23. 12.`,
    contest: {
      kind: 'photo',
      prize: 'Dárkový poukaz do e-shopu Geekhall v hodnotě 2 000 Kč',
      rules: 'Fotky můžete posílat do 22. 12. 2026 do 23:59. Fotka musí být vlastní a neupravená. Výherce vyhlásíme 23. 12.',
      until: '2026-12-22T23:59:59+01:00',
    },
    confirm: 'Potvrdit cenu (poukaz 2 000 Kč) a že pořadatel smí fotky zveřejnit.',
  },
  {
    day: 20, type: 'game', title: 'Jaký jste typ geeka?',
    text: 'Někdo hraje, jiný sbírá, další balí karty do obalů. Čtyři otázky a víme, jaký typ jste vy.',
    game: {
      kind: 'persona',
      // body: Hráč 1A 2A 3A 4A · Sběratel 1B 2B 3B 4B · Deskovkář 1C 2C 3C 4C
      // (při shodě vyhrává typ, který je v results dřív)
      questions: [
        { q: 'Jak nejraději trávíte volný večer?', options: [{ t: 'U konzole nebo PC', r: 'gamer' }, { t: 'Přerovnáváním sbírky', r: 'collector' }, { t: 'U stolu s kamarády a hrou', r: 'tabletop' }] },
        { q: 'Co by vás potěšilo pod stromečkem?', options: [{ t: 'Nová sluchátka nebo ovladač', r: 'gamer' }, { t: 'Limitovaná figurka', r: 'collector' }, { t: 'Nová deskovka', r: 'tabletop' }] },
        { q: 'Kolik máte doma věcí z oblíbené série?', options: [{ t: 'Pár, hlavně hry', r: 'gamer' }, { t: 'Celou vitrínu', r: 'collector' }, { t: 'Spíš krabice her než věcí', r: 'tabletop' }] },
        { q: 'Na co se na Vánoce těšíte nejvíc?', options: [{ t: 'Na volno a nové hry', r: 'gamer' }, { t: 'Až doma všechno vystavím', r: 'collector' }, { t: 'Na hru s celou rodinou', r: 'tabletop' }] },
      ],
      results: {
        gamer: { title: 'Hráč', text: 'Vaším domovem je obrazovka. Doporučujeme herní doplňky.', links: [{ label: 'E-shop Geekhall', url: SHOP }] },
        collector: { title: 'Sběratel', text: 'Každý kousek má své místo. Doporučujeme figurky a sběratelské předměty.', links: [{ label: 'E-shop Geekhall', url: SHOP }] },
        tabletop: { title: 'Deskovkář', text: 'Nejlepší hra je ta, u které se sejde parta. Doporučujeme deskovky a puzzle.', links: [{ label: 'E-shop Geekhall', url: SHOP }] },
      },
    },
    confirm: 'Doplnit přímé odkazy na kategorie v e-shopu.',
  },
  {
    day: 21, type: 'offer', title: 'Balíček „Pro každého geeka“',
    text: `Hrnek, tričko a malá figurka. Dárek, který rozzáří každého geeka.

Při nákupu tří různých produktů z kategorií hrnky, trička a figurky získáte slevu 15 % na celý nákup. ${HOW}

Platí do 31. 12.`,
    coupon: { code: 'GEEK-21', value: 'Sleva 15 % při nákupu hrnku, trička a figurky', valid: 'Platí do 31. 12.' },
    confirm: 'Potvrdit podmínky balíčku (minimální obsah košíku).', ...shop,
  },
  {
    day: 22, type: 'tip', title: 'Stihnete dárky před Vánoci?',
    text: `Nezoufejte. Pár zásad, jak zajistit, aby dárek dorazil včas:

Objednávejte co nejdřív. Termíny pro doručení před Vánoci najdete v e-shopu v sekci doprava a platba.

Zvolte rychlý způsob dopravy. Výdejní místo je často rychlejší než doručení domů.

Kdyby se nestihlo, pošlete dárkový poukaz. Přijde e-mailem hned.`,
    more: 'Poslední termíny a otevírací dobu o svátcích zjistíte na webu Geekhall.',
    url: CONTACT_URL, urlLabel: 'Kontakt a doprava',
    confirm: 'Doplnit konkrétní poslední termíny objednávek a svátečního provozu.',
  },
  {
    day: 23, type: 'offer', title: 'Last minute: dárkový poukaz s bonusem',
    text: `Neurčili jste, co koupit? Dárkový poukaz přijde e-mailem hned a vyřeší všechno.

Při koupi dárkového poukazu dostanete bonus 10 %. ${HOW}

Platí do 24. 12.`,
    coupon: { code: 'GEEK-23', value: 'Bonus 10 % při koupi dárkového poukazu', valid: 'Platí do 24. 12.' },
    confirm: 'Ověřit, že e-shop dárkové poukazy prodává a jak bonus 10 % nastavit (může být jen slevový kód).', ...shop,
  },
  {
    day: 24, type: 'finale', title: 'Krásné Vánoce od Geekhallu',
    text: `Děkujeme, že jste s námi otevírali adventní okénka.

Dnes losujeme výherce hlavní ceny, poukazu do e-shopu Geekhall. Výherci pošleme e-mail ještě dnes.

A protože k Vánocům patří dárky pro všechny, máme jeden i pro vás: sleva 10 % na první nákup v novém roce. Stačí zadat kód do 31. 1. 2027.`,
    coupon: { code: 'GEEK-24', value: 'Sleva 10 % na nákup v lednu', valid: 'Platí do 31. 1. 2027' },
    more: `Krásné Vánoce a ať se vám pod stromečkem sejde všechno, co si přejete.

Váš Geekhall`,
    confirm: CONF, ...shop,
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
