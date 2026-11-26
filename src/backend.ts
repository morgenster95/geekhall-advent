/**
 * Přihlášení a ukládání postupu.
 *  - S Firebase: přihlášení přes Google + Firestore (users/{uid}, entries/{uid}_{den}).
 *  - Bez Firebase (ukázkový režim): přihlášení e-mailem bez ověření, data v localStorage.
 */
import { FIREBASE, NEWSLETTER_CONSENT, firebaseEnabled } from './config';
import type { Progress, User } from './types';

const NEWSLETTER_KEY = 'gh-newsletter-optin';
const LOCAL_USER = 'gh-local-user';
const localKey = (uid: string, preview: boolean) => `gh-progress-${preview ? 'nahled' : 'live'}-${uid}`;

export interface Backend {
  mode: 'firebase' | 'local';
  /** spustí sledování přihlášení; vrací funkci pro odhlášení odběru */
  watch(cb: (u: User | null) => void): Promise<() => void>;
  signInGoogle(newsletter: boolean): Promise<void>;
  /** jen ukázkový režim bez Firebase: přihlášení e-mailem bez ověření */
  signInEmail(email: string, newsletter: boolean): Promise<void>;
  signOut(): Promise<void>;
  load(u: User, preview: boolean): Promise<Progress>;
  markOpened(u: User, day: number, preview: boolean): Promise<void>;
  /** soutěžní odpověď; contact = e-mail pro kontakt s výhercem, photo = JPEG jako data URL (soutěž 19) */
  submitEntry(u: User, day: number, answer: string, preview: boolean, extra: EntryExtra): Promise<void>;
  setNewsletter(u: User, v: boolean): Promise<void>;
  /** odpověď na jednorázovou nabídku newsletteru po otevření okénka */
  answerNewsletterOffer(u: User, v: boolean): Promise<void>;
  /** jen pro správce (ADMIN_EMAILS + firestore.rules): všechny kontakty a soutěžní odpovědi */
  exportData(): Promise<ExportData>;
  /** jen pro správce: fotky ze soutěže o nejhůř rozbitý displej */
  exportPhotos(): Promise<PhotoRow[]>;
}

export interface EntryExtra { contact: string; photo?: string }

export interface ContactRow { email: string; name: string; newsletter: boolean; consentStatus: string; newsletterAt: string; newsletterConsent: string; revokedAt: string; createdAt: string; lastSeenAt: string; opened: number }
export interface EntryRow { id: string; day: number; email: string; name: string; contact: string; answer: string; hasPhoto: boolean; createdAt: string }
export interface PhotoRow { id: string; contact: string; email: string; photo: string; createdAt: string }
export interface ExportData { contacts: ContactRow[]; entries: EntryRow[] }

/* ------------------------------------------------------------------ local */
function localBackend(): Backend {
  let listener: ((u: User | null) => void) | null = null;
  const read = (): User | null => { try { return JSON.parse(localStorage.getItem(LOCAL_USER) || 'null'); } catch { return null; } };
  const getP = (u: User, p: boolean): Progress => {
    try { return { opened: {}, entries: [], newsletter: false, ...JSON.parse(localStorage.getItem(localKey(u.uid, p)) || '{}') }; }
    catch { return { opened: {}, entries: [], newsletter: false }; }
  };
  const setP = (u: User, p: boolean, v: Progress) => { try { localStorage.setItem(localKey(u.uid, p), JSON.stringify(v)); } catch { /* */ } };
  return {
    mode: 'local',
    async watch(cb) { listener = cb; cb(read()); return () => { listener = null; }; },
    async signInGoogle() { throw new Error('Přihlášení přes Google zatím není nastavené.'); },
    async signInEmail(email, newsletter) {
      const u: User = { uid: 'local:' + email.toLowerCase(), email: email.toLowerCase(), name: null };
      try { localStorage.setItem(LOCAL_USER, JSON.stringify(u)); } catch { /* */ }
      const p = getP(u, false); p.newsletter = p.newsletter || newsletter; setP(u, false, p);
      listener?.(u);
    },
    async signOut() { try { localStorage.removeItem(LOCAL_USER); } catch { /* */ } listener?.(null); },
    async load(u, preview) { return getP(u, preview); },
    async markOpened(u, day, preview) { const p = getP(u, preview); p.opened[day] ||= new Date().toISOString(); setP(u, preview, p); },
    async submitEntry(u, day, _answer, preview) {
      const p = getP(u, preview);
      if (p.entries.includes(day)) throw new Error('V tomto okénku už vaši odpověď máme. Držíme palce!');
      p.entries.push(day); setP(u, preview, p);
    },
    async setNewsletter(u, v) { const p = getP(u, false); p.newsletter = v; setP(u, false, p); },
    async answerNewsletterOffer(u, v) { const p = getP(u, false); p.newsletter = p.newsletter || v; p.newsletterAsked = true; setP(u, false, p); },
    async exportData() { throw new Error('Export funguje až s nastaveným Firebase.'); },
    async exportPhotos() { throw new Error('Export funguje až s nastaveným Firebase.'); },
  };
}

/* --------------------------------------------------------------- firebase */
function firebaseBackend(): Backend {
  const sdk = (async () => {
    const [{ initializeApp, getApps }, auth, fs] = await Promise.all([import('firebase/app'), import('firebase/auth'), import('firebase/firestore')]);
    const app = getApps()[0] || initializeApp(FIREBASE);
    const a = auth.getAuth(app);
    a.languageCode = 'cs';
    const db = fs.getFirestore(app);
    return { a, auth, db, fs };
  })();

  const toUser = (u: { uid: string; email: string | null; displayName: string | null }): User => ({ uid: u.uid, email: (u.email || '').toLowerCase(), name: u.displayName });
  const userField = (preview: boolean) => (preview ? 'openedPreview' : 'opened');
  const entriesField = (preview: boolean) => (preview ? 'entriesPreview' : 'entries');

  /** pole, která se uloží při udělení / odvolání souhlasu s newsletterem */
  async function consentFields(v: boolean) {
    const { fs } = await sdk;
    return v
      ? { newsletter: true, newsletterAt: fs.serverTimestamp(), newsletterConsent: `${NEWSLETTER_CONSENT.version}: ${NEWSLETTER_CONSENT.text}` }
      : { newsletter: false, newsletterRevokedAt: fs.serverTimestamp() };
  }

  async function ensureProfile(u: User, newsletter: boolean) {
    const { db, fs } = await sdk;
    const ref = fs.doc(db, 'users', u.uid);
    const snap = await fs.getDoc(ref);
    const now = fs.serverTimestamp();
    const consent = newsletter ? { ...(await consentFields(true)), newsletterAsked: true } : {};
    if (!snap.exists()) await fs.setDoc(ref, { email: u.email, name: u.name, newsletter: false, createdAt: now, lastSeenAt: now, opened: {}, entries: [], ...consent });
    else await fs.updateDoc(ref, { email: u.email, name: u.name, lastSeenAt: now, ...consent });
  }
  const pendingNewsletter = () => { try { return localStorage.getItem(NEWSLETTER_KEY) === '1'; } catch { return false; } };

  return {
    mode: 'firebase',
    async watch(cb) {
      const { a, auth } = await sdk;
      // dokončení případného Google redirectu (když prohlížeč blokuje popup)
      auth.getRedirectResult(a).then((r) => r?.user && ensureProfile(toUser(r.user), pendingNewsletter())).catch(() => {});
      return auth.onAuthStateChanged(a, (u) => cb(u ? toUser(u) : null));
    },
    async signInGoogle(newsletter) {
      const { a, auth } = await sdk;
      const provider = new auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      try {
        const res = await auth.signInWithPopup(a, provider);
        await ensureProfile(toUser(res.user), newsletter);
      } catch (e) {
        const code = (e as { code?: string }).code || '';
        if (code === 'auth/popup-blocked' || code === 'auth/operation-not-supported-in-this-environment') {
          try { localStorage.setItem(NEWSLETTER_KEY, newsletter ? '1' : '0'); } catch { /* */ }
          await auth.signInWithRedirect(a, provider);
          return;
        }
        if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') throw new Error('Přihlášení bylo zrušeno.');
        throw new Error(humanError(code));
      }
    },
    async signInEmail() { throw new Error('Přihlásit se jde jen přes Google.'); },
    async signOut() { const { a, auth } = await sdk; await auth.signOut(a); },
    async load(u, preview) {
      const { db, fs } = await sdk;
      const snap = await fs.getDoc(fs.doc(db, 'users', u.uid));
      if (!snap.exists()) { await ensureProfile(u, false); return { opened: {}, entries: [], newsletter: false }; }
      const d = snap.data();
      const raw = (d[userField(preview)] || {}) as Record<string, { toDate?: () => Date } | string>;
      const opened: Record<number, string> = {};
      for (const [k, v] of Object.entries(raw)) opened[Number(k)] = typeof v === 'string' ? v : v?.toDate?.().toISOString() || '';
      return { opened, entries: (d[entriesField(preview)] || []) as number[], newsletter: !!d.newsletter, newsletterAsked: !!d.newsletterAsked };
    },
    async markOpened(u, day, preview) {
      const { db, fs } = await sdk;
      await fs.setDoc(fs.doc(db, 'users', u.uid), { [userField(preview)]: { [day]: new Date().toISOString() } }, { merge: true });
    },
    async submitEntry(u, day, answer, preview, extra) {
      const { db, fs } = await sdk;
      const id = `${u.uid}_${preview ? 'nahled_' : ''}${day}`;
      const now = fs.serverTimestamp();
      // odpověď i fotka se zapíší najednou (buď obojí, nebo nic)
      const batch = fs.writeBatch(db);
      batch.set(fs.doc(db, 'entries', id), { uid: u.uid, email: u.email, name: u.name, contact: extra.contact, day, answer, preview, hasPhoto: !!extra.photo, createdAt: now });
      if (extra.photo) batch.set(fs.doc(db, 'photos', id), { uid: u.uid, email: u.email, contact: extra.contact, day, preview, photo: extra.photo, createdAt: now });
      try {
        await batch.commit();
      } catch (e) {
        if ((e as { code?: string }).code === 'permission-denied') throw new Error('Odpověď se nepodařilo uložit. Buď ji už máme, nebo soutěž skončila.');
        throw new Error('Odpověď se nepodařilo uložit. Zkuste to prosím znovu.');
      }
      await fs.setDoc(fs.doc(db, 'users', u.uid), { [entriesField(preview)]: fs.arrayUnion(day) }, { merge: true });
    },
    async setNewsletter(u, v) {
      const { db, fs } = await sdk;
      await fs.setDoc(fs.doc(db, 'users', u.uid), { ...(await consentFields(v)), newsletterAsked: true }, { merge: true });
    },
    async answerNewsletterOffer(u, v) {
      const { db, fs } = await sdk;
      await fs.setDoc(fs.doc(db, 'users', u.uid), { ...(v ? await consentFields(true) : {}), newsletterAsked: true }, { merge: true });
    },
    async exportData() {
      const { db, fs } = await sdk;
      const iso = (v: unknown) => (v && typeof (v as { toDate?: () => Date }).toDate === 'function' ? (v as { toDate: () => Date }).toDate().toISOString() : typeof v === 'string' ? v : '');
      let users, entries;
      try { [users, entries] = await Promise.all([fs.getDocs(fs.collection(db, 'users')), fs.getDocs(fs.collection(db, 'entries'))]); }
      catch (e) {
        if ((e as { code?: string }).code === 'permission-denied') throw new Error('Tento účet nemá přístup ke kontaktům. Přidejte ho do ADMIN_EMAILS v config.ts i ve firestore.rules.');
        throw new Error('Data se nepodařilo načíst.');
      }
      const contacts: ContactRow[] = users.docs.map((d) => {
        const x = d.data();
        const consentStatus = x.newsletter ? 'souhlas' : x.newsletterRevokedAt ? 'odvolal' : x.newsletterAsked ? 'odmítl' : 'neodpověděl';
        return { email: x.email || '', name: x.name || '', newsletter: !!x.newsletter, consentStatus, newsletterAt: x.newsletter ? iso(x.newsletterAt) : '', newsletterConsent: x.newsletter ? x.newsletterConsent || '' : '', revokedAt: !x.newsletter ? iso(x.newsletterRevokedAt) : '', createdAt: iso(x.createdAt), lastSeenAt: iso(x.lastSeenAt), opened: Object.keys(x.opened || {}).length };
      }).sort((p, q) => p.createdAt.localeCompare(q.createdAt));
      const rows: EntryRow[] = entries.docs.map((d) => d.data()).filter((x) => !x.preview)
        .map((x) => ({ id: '', day: x.day, email: x.email || '', name: x.name || '', contact: x.contact || x.email || '', answer: x.answer || '', hasPhoto: !!x.hasPhoto, createdAt: iso(x.createdAt) }))
        .sort((p, q) => p.day - q.day || p.createdAt.localeCompare(q.createdAt));
      return { contacts, entries: rows };
    },
    async exportPhotos() {
      const { db, fs } = await sdk;
      const iso = (v: unknown) => (v && typeof (v as { toDate?: () => Date }).toDate === 'function' ? (v as { toDate: () => Date }).toDate().toISOString() : '');
      try {
        const snap = await fs.getDocs(fs.collection(db, 'photos'));
        return snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((x) => !(x as { preview?: boolean }).preview)
          .map((x) => { const y = x as Record<string, unknown>; return { id: String(y.id), email: String(y.email || ''), contact: String(y.contact || y.email || ''), photo: String(y.photo || ''), createdAt: iso(y.createdAt) }; })
          .sort((p, q) => p.createdAt.localeCompare(q.createdAt));
      } catch (e) {
        if ((e as { code?: string }).code === 'permission-denied') throw new Error('Tento účet nemá přístup k fotkám (ADMIN_EMAILS a firestore.rules).');
        throw new Error('Fotky se nepodařilo načíst.');
      }
    },
  };
}

function humanError(code: string) {
  switch (code) {
    case 'auth/network-request-failed': return 'Nepodařilo se připojit. Zkontrolujte připojení k internetu.';
    case 'auth/too-many-requests':
    case 'auth/quota-exceeded': return 'Příliš mnoho pokusů. Zkuste to prosím za chvíli.';
    case 'auth/unauthorized-domain': return 'Tato doména zatím není ve Firebase povolená (Authentication → Settings → Authorized domains).';
    case 'auth/operation-not-allowed': return 'Tento způsob přihlášení není ve Firebase zapnutý.';
    default: return 'Přihlášení se nepodařilo. Zkuste to prosím znovu.';
  }
}

export const backend: Backend = firebaseEnabled() ? firebaseBackend() : localBackend();
