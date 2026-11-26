import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Eye, Layers, LogIn, Share2, ShoppingCart, UserRound } from 'lucide-react';
import { availableDay, BASE, CATEGORIES, CONTACT_URL, CONTEST_DAYS, contestOpen, doors as ALL_DOORS, OPERATOR, PRIVACY_URL, RULES_URL, SHOP } from './content';
import { CONTENT_MODE, DEMO_MODE, PREVIEW_KEY } from './config';
import { backend } from './backend';
import type { Door, Progress, User } from './types';
import { DoorGrid } from './components/DoorGrid';
import { DoorModal } from './components/DoorModal';
import { LoginDialog } from './components/LoginDialog';
import { GiftsDrawer } from './components/GiftsDrawer';
import { DiceArt, Celebrate, Logo } from './components/Decor';
import { HeroArt } from './components/HeroArt';

const EVE = Date.parse('2026-12-24T00:00:00+01:00');
const draft = CONTENT_MODE !== 'live';
const SS = 'gh-';

function readPreview(): boolean {
  try {
    const url = new URL(location.href);
    const q = url.searchParams.get('nahled');
    if (q !== null) {
      if (q === PREVIEW_KEY) sessionStorage.setItem(SS + 'nahled', '1');
      else sessionStorage.removeItem(SS + 'nahled');
      url.searchParams.delete('nahled');
      history.replaceState(null, '', url);
    }
    return sessionStorage.getItem(SS + 'nahled') === '1';
  } catch { return false; }
}

function useCountdown() {
  const calc = () => {
    const s = Math.max(0, Math.floor((EVE - Date.now()) / 1000));
    return [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
  };
  const [v, setV] = useState(calc);
  useEffect(() => { const id = setInterval(() => setV(calc()), 1000); return () => clearInterval(id); }, []);
  return v;
}

const plural = (n: number, one: string, few: string, many: string) => (n === 1 ? one : n >= 2 && n <= 4 ? few : many);

/* Ukázkový režim: host bez přihlášení, postup jen v tomto prohlížeči. */
const GUEST_KEY = 'gh-demo-host';
const EMPTY: Progress = { opened: {}, entries: [], newsletter: false };
function loadGuest(): Progress { try { return { ...EMPTY, ...JSON.parse(localStorage.getItem(GUEST_KEY) || '{}') }; } catch { return EMPTY; } }
function saveGuest(p: Progress) { try { localStorage.setItem(GUEST_KEY, JSON.stringify(p)); } catch { /* */ } }

export default function App() {
  const [preview, setPreview] = useState(() => DEMO_MODE || readPreview());
  /** bez přihlášení: ukázková verze nebo náhled (?nahled=…) – postup se ukládá jen v prohlížeči */
  const guest = DEMO_MODE || preview;
  const [today, setToday] = useState(() => availableDay());
  const max = preview ? 24 : today;
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [progress, setProgress] = useState<Progress>(EMPTY);
  const [modalDay, setModalDay] = useState<number | null>(null);
  const [opening, setOpening] = useState<number | null>(null);
  const [login, setLogin] = useState<{ open: boolean; reason?: string; pendingDay?: number }>({ open: false });
  const [drawer, setDrawer] = useState(false);
  const [toast, setToast] = useState('');
  const [burst, setBurst] = useState(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();
  const trigger = useRef<HTMLElement | null>(null);
  const countdown = useCountdown();

  const notify = useCallback((s: string) => {
    setToast(s);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 4200);
  }, []);

  useEffect(() => {
    let off: (() => void) | undefined;
    backend.watch((u) => { setUser(u); setAuthReady(true); }).then((f) => { off = f; });
    return () => off?.();
  }, [notify]);

  useEffect(() => {
    if (!user) { setProgress(guest ? loadGuest() : EMPTY); return; }
    backend.load(user, preview).then(setProgress).catch(() => notify('Nepodařilo se načíst váš postup. Zkuste obnovit stránku.'));
  }, [user, preview, notify]);

  useEffect(() => { const id = setInterval(() => setToday(availableDay()), 30000); return () => clearInterval(id); }, []);

  const openedMap = useMemo(() => {
    const m = new Map<number, Door['type']>();
    for (const d of Object.keys(progress.opened).map(Number)) if (d <= max) m.set(d, ALL_DOORS[d - 1]?.type);
    return m;
  }, [progress.opened, max]);
  const openedDoors = useMemo(() => ALL_DOORS.filter((d) => openedMap.has(d.day)), [openedMap]);

  const openDoor = useCallback(async (day: number, el?: HTMLElement) => {
    if (el) trigger.current = el;
    if (day > max) { notify(`Okénko ${day} se odemkne ${day}. prosince o půlnoci.`); return; }
    if (!user && !guest) { setLogin({ open: true, reason: 'Přihlaste se a otevřete okénko', pendingDay: day }); return; }
    if (!progress.opened[day]) {
      setOpening(day);
      await new Promise((r) => setTimeout(r, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 550));
      setOpening(null);
      setProgress((p) => { const n = { ...p, opened: { ...p.opened, [day]: new Date().toISOString() } }; if (!user) saveGuest(n); return n; });
      if (user) backend.markOpened(user, day, preview).catch(() => notify('Okénko se nepodařilo uložit k účtu. Zkuste to prosím znovu.'));
      setBurst((b) => b + 1);
    }
    setModalDay(day);
    const url = new URL(location.href); url.searchParams.set('den', String(day)); history.replaceState(null, '', url);
  }, [max, user, progress.opened, preview, notify]);

  useEffect(() => {
    if (user && login.pendingDay && !login.open) { const d = login.pendingDay; setLogin({ open: false }); void openDoor(d); }
  }, [user, login, openDoor]);

  const deepLinked = useRef(false);
  useEffect(() => {
    if (deepLinked.current || !authReady) return;
    const n = Number(new URLSearchParams(location.search).get('den'));
    if (n >= 1 && n <= 24) { deepLinked.current = true; void openDoor(n); }
  }, [authReady, openDoor]);

  function closeModal() {
    setModalDay(null);
    const url = new URL(location.href); url.searchParams.delete('den'); history.replaceState(null, '', url);
    trigger.current?.focus();
  }

  async function share() {
    const url = new URL(location.origin + BASE);
    if (modalDay) url.searchParams.set('den', String(modalDay));
    try {
      if (navigator.share) { await navigator.share({ title: 'Adventní kalendář Geek Hall', text: '24 dní, 24 překvapení: slevy, hry, tipy a soutěže až do Štědrého dne.', url: url.href }); return; }
      await navigator.clipboard.writeText(url.href);
      notify('Odkaz je zkopírovaný. Pošlete ho dál.');
    } catch (e) { if ((e as Error).name !== 'AbortError') notify('Sdílení se nepodařilo. Odkaz zkopírujte z adresního řádku.'); }
  }
  async function copy(code: string) {
    try { await navigator.clipboard.writeText(code); notify(`Kód ${code} je zkopírovaný.`); }
    catch { notify('Kód prosím označte a zkopírujte ručně.'); }
  }
  async function logout() { await backend.signOut(); setDrawer(false); notify('Byli jste odhlášeni. Zítra na vás čeká další okénko!'); }

  const door = modalDay ? ALL_DOORS[modalDay - 1] : null;
  const openedCount = openedMap.size;
  const status = preview ? 'Režim náhledu – všechna okénka jsou odemčená'
    : max === 0 ? 'První okénko se odemkne 1. prosince o půlnoci'
    : max >= 24 ? 'Všechna okénka jsou odemčená. Veselé Vánoce!'
    : openedMap.has(max) ? `Dnešní okénko máte otevřené. Zítra čeká ${max + 1}.`
    : `Dnes na vás čeká okénko číslo ${max}`;

  return (
    <>
      {preview && (
        <div className="preview-bar">
          <Eye size={15} /> {DEMO_MODE ? 'Ukázková verze pro prezentaci – všechna okénka lze proklikat bez přihlášení' : 'Náhled: všechna okénka odemčená, lze proklikat bez přihlášení (postup se ukládá jen v tomto prohlížeči)'}{draft ? ' · obsah je ukázkový, poznámky „K potvrzení“ zmizí po přepnutí na ostrý režim' : ''}
          {!DEMO_MODE && <button onClick={() => { try { sessionStorage.removeItem(SS + 'nahled'); } catch { /* */ } setPreview(false); }}>Ukončit</button>}
        </div>
      )}

      <div className="utility">
        <div className="wrap">
          <span className="reg-pill">Adventní kalendář 2026</span>
          <nav aria-label="Odkazy na web"><span className="hide-sm">Doprava ZDARMA nad 3 000 Kč</span><a href={SHOP + 'prodejna-geek-hall/'}>Naše prodejna</a><a href="mailto:info@geekhall.cz">info@geekhall.cz</a><a className="hide-sm" href="tel:+420606373676">+420 606 373 676</a></nav>
        </div>
      </div>
      <header className="topbar">
        <div className="wrap">
          <a href={SHOP} className="brand" aria-label="Geek Hall – e-shop"><Logo light /></a>
          <nav className="actions" aria-label="Ovládání">
            <button className="chip" onClick={share} aria-label="Sdílet kalendář"><Share2 size={16} /></button>
            {user || guest ? (
              <button className="chip pink" onClick={() => setDrawer(true)}><Layers size={16} /><span>Moje karty</span>{openedCount > 0 && <b className="badge">{openedCount}</b>}</button>
            ) : (
              <button className="chip pink" onClick={() => setLogin({ open: true })}><LogIn size={16} /><span>Přihlásit</span></button>
            )}
          </nav>
        </div>
      </header>
      <div className="mainnav"><div className="wrap">{CATEGORIES.map((c) => <a key={c.url} href={c.url}>{c.label}</a>)}<a className="sale" href={SHOP + 'akce/'}>Akce</a><span className="here">Adventní kalendář</span></div></div>

      {/* ------------------------------------------------------------- HERO */}
      <section className="hero">
        <DiceArt className="hero-dice" />
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <h1>Rozbalte si advent <span className="red">plný karet, slev a her</span> s námi!</h1>
            <p>Každý den o půlnoci nová karta: sleva, hra, tip nebo soutěž. Slevové kódy uplatníte v e-shopu Geek Hall.</p>
            <div className="hero-cta">
              <a href="#kalendar" className="btn teal">{user || guest ? 'K mé sbírce' : 'Ke kalendáři'}</a>
              {!user && !guest && <button className="btn pink" onClick={() => setLogin({ open: true })}>Přihlásit se</button>}
            </div>
          </div>
          <HeroArt />
        </div>
      </section>

      <div className="wrap countdown" aria-label="Odpočet do Štědrého dne">
        <div className="cd-label">Do Štědrého dne zbývá</div>
        <div className="cd-time">
          {countdown.map((v, i) => (
            <div key={i}><strong>{String(v).padStart(2, '0')}</strong><span>{[plural(v, 'den', 'dny', 'dní'), plural(v, 'hodina', 'hodiny', 'hodin'), plural(v, 'minuta', 'minuty', 'minut'), plural(v, 'sekunda', 'sekundy', 'sekund')][i]}</span></div>
          ))}
        </div>
      </div>

      {/* --------------------------------------------------------- CALENDAR */}
      <main>
        <section id="kalendar" className="calendar wrap">
          <h2 className="sec-title">Adventní kalendář</h2>
          <p className="sec-sub">Slevové kódy, kvízy, užitečné tipy a tři soutěže o skvělé výhry. Každá karta, kterou otočíte, zůstane ve vaší sbírce.</p>
          <div className="cal-bar">
            <div className="progress">
              <span>{user || guest ? <>Sbírka: <b>{openedCount}</b> z 24 karet</> : 'Přihlaste se a začněte sbírat'}</span>
              <div className="track"><i style={{ width: `${(openedCount / 24) * 100}%` }} /></div>
            </div>
            <span className="status">{status}</span>
          </div>
          <DoorGrid max={max} opened={openedMap} opening={opening} onOpen={openDoor} />
          <div className="legend" aria-hidden="true"><i className="t-offer" />Sleva<i className="t-game" />Hra<i className="t-tip" />Tip<i className="t-contest" />Soutěž<i className="t-finale" />Finále</div>
          <div className="cal-foot">
            {user ? <span>Přihlášeni jako <b>{user.email}</b> · <button className="link" onClick={() => setDrawer(true)}>Moje karty</button></span>
              : !guest && <button className="btn pink" onClick={() => setLogin({ open: true })}><LogIn size={17} /> Přihlásit se a začít</button>}
          </div>
        </section>

        <section className="how wrap">
          <h2 className="sec-title">Jak to funguje</h2>
          <ul className="why">
            <li><UserRound /><span>Přihlaste se jedním klikem přes Google</span></li>
            <li><Layers /><span>Každý den o půlnoci otočte novou kartu</span></li>
            <li><ShoppingCart /><span>Slevový kód zadejte v košíku e-shopu</span></li>
          </ul>
        </section>

        <section className="cats wrap" aria-label="Kategorie">
          <h2 className="sec-title">Kategorie</h2>
          <div className="cat-grid">
            <a className="cat" href={SHOP + 'kategorie/sberatelske-hry-2/pokemoni/'}><img src={BASE + 'img/pikachu.png'} alt="" loading="lazy" />Pokémoni</a>
            <a className="cat" href={SHOP + 'kategorie/deskove-hry/'}><img src={BASE + 'img/strategicke.jpg'} alt="" loading="lazy" />Deskové hry</a>
            <a className="cat" href={SHOP + 'kategorie/sberatelske-hry-2/'}><img src={BASE + 'img/pokeball.jpeg'} alt="" loading="lazy" />Sběratelské hry</a>
            <a className="cat" href={SHOP + 'kategorie/merch/'}><img src={BASE + 'img/obiwan.png'} alt="" loading="lazy" />Merch a figurky</a>
            <a className="cat" href={SHOP + 'kategorie/merch/'}><img src={BASE + 'img/potter.jpeg'} alt="" loading="lazy" />Harry Potter</a>
            <a className="cat" href={SHOP + 'kategorie/doplnky-a-prislusenstvi/'}><img src={BASE + 'img/kostky.jpeg'} alt="" loading="lazy" />Doplňky a příslušenství</a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <DiceArt className="footer-dice" />
        <div className="wrap">
          <div className="footer-cols">
            <div>
              <h3>Kontakt</h3>
              <p><a href={`mailto:${OPERATOR.email}`}>{OPERATOR.email}</a></p>
              <p><a href="tel:+420606373676">{OPERATOR.phone}</a></p>
              <p className="footer-addr"><b>Geek Hall</b> prodejna:<br />{OPERATOR.address}<br />IČO: {OPERATOR.ico}</p>
            </div>
            <div>
              <h3>K nákupu</h3>
              <ul>
                <li><a href={SHOP + 'prodejna-geek-hall/'} target="_blank" rel="noreferrer">Kamenná prodejna</a></li>
                <li><a href={CONTACT_URL} target="_blank" rel="noreferrer">Kontakty</a></li>
                <li><a href={SHOP + 'vse-o-nakupu/#doprava-a-platba'} target="_blank" rel="noreferrer">Platba a doprava</a></li>
                <li><a href={SHOP + 'obchodni-podminky/'} target="_blank" rel="noreferrer">Obchodní podmínky</a></li>
                <li><a href={PRIVACY_URL} target="_blank" rel="noreferrer">Ochrana osobních údajů</a></li>
              </ul>
            </div>
            <div>
              <h3>Kategorie</h3>
              <ul>{CATEGORIES.slice(0, 6).map((c) => <li key={c.url}><a href={c.url} target="_blank" rel="noreferrer">{c.label}</a></li>)}</ul>
            </div>
            <div>
              <h3>Adventní kalendář</h3>
              <ul>
                <li><a href={SHOP} target="_blank" rel="noreferrer">E-shop Geek Hall</a></li>
                <li><a href={RULES_URL} target="_blank" rel="noreferrer">Pravidla soutěží</a></li>
                <li><a href="#soukromi">Soukromí</a></li>
              </ul>
            </div>
          </div>
          <div id="soukromi" className="privacy">
            <h3>Soukromí</h3>
            <p>Správcem osobních údajů je {OPERATOR.name} (Geek Hall), IČ {OPERATOR.ico}. Pro přihlášení a ukládání dat používáme službu Firebase (Google). Ukládáme váš e-mail a jméno z účtu Google, která okénka jste otevřeli, soutěžní odpovědi (u soutěže o nejlepší geek koutek i zaslanou fotku) a to, zda chcete dostávat novinky. Údaje slouží jen k provozu adventního kalendáře a vyhodnocení soutěží; e-mailem s novinkami vás oslovíme jen tehdy, pokud jste k tomu dali souhlas (odvolat ho můžete kdykoli v sekci Moje dárky). Údaje z kalendáře uchováváme do 31. 3. 2027 (soutěžní údaje 3 měsíce od vyhlášení výsledků), kontakty se souhlasem do jeho odvolání. Web nepoužívá analytické ani reklamní cookies. Více v <a href={PRIVACY_URL} target="_blank" rel="noreferrer">zásadách ochrany osobních údajů</a>.</p>
          </div>
          <small>© 2026 Geek Hall · Provozovatel: {OPERATOR.name}, {OPERATOR.address}, IČ {OPERATOR.ico} · Okénka se odemykají o půlnoci (Europe/Prague)</small>
        </div>
      </footer>

      <DoorModal
        door={door}
        email={user?.email || ''}
        preview={preview}
        draft={draft}
        entered={!!door && progress.entries.includes(door.day)}
        canPrev={!!door && door.day > 1}
        canNext={!!door && door.day < max}
        onPrev={() => door && openDoor(door.day - 1)}
        onNext={() => door && openDoor(door.day + 1)}
        onClose={closeModal}
        onShare={share}
        onCopy={copy}
        onWin={() => setBurst((b) => b + 1)}
        offerNewsletter={!!user && !progress.newsletter && !progress.newsletterAsked}
        onNewsletterOffer={(v) => {
          if (!user) return;
          setProgress((p) => ({ ...p, newsletter: p.newsletter || v, newsletterAsked: true }));
          notify(v ? 'Děkujeme! Novinky vám budeme posílat e-mailem.' : 'Dobře, nebudeme otravovat.');
          backend.answerNewsletterOffer(user, v).catch(() => notify('Nastavení se nepodařilo uložit.'));
        }}
        onEnter={async (day, answer, contact, photo) => {
          if (!user && !guest) throw new Error('Nejste přihlášeni.');
          const c = ALL_DOORS[day - 1]?.contest;
          if (!CONTEST_DAYS.includes(day) || !c) throw new Error('Soutěž v tomto okénku neprobíhá.');
          if (!preview && !contestOpen(c.until)) throw new Error('Tato soutěž už skončila.');
          const a = answer.trim();
          if (a.length < 1) throw new Error('Vyplňte prosím odpověď.');
          if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact)) throw new Error('Zkontrolujte prosím e-mail.');
          if (user) await backend.submitEntry(user, day, a, preview, { contact: contact.toLowerCase(), photo });
          setProgress((p) => { const n = { ...p, entries: [...p.entries, day] }; if (!user) saveGuest(n); return n; });
          setBurst((b) => b + 1);
        }}
      />
      <LoginDialog open={login.open} reason={login.reason} onClose={() => setLogin({ open: false })} onSignedIn={() => { setLogin((l) => ({ ...l, open: false })); notify('Jste přihlášeni. Hezký advent!'); }} />
      <GiftsDrawer
        open={drawer} user={user} newsletter={progress.newsletter} doors={openedDoors}
        onClose={() => setDrawer(false)} onPick={(d) => { setDrawer(false); void openDoor(d); }} onCopy={copy} onLogout={logout}
        onNewsletter={(v) => { if (!user) return; setProgress((p) => ({ ...p, newsletter: v, newsletterAsked: true })); backend.setNewsletter(user, v).catch(() => notify('Nastavení se nepodařilo uložit.')); }}
      />
      <Celebrate burst={burst} />
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}
