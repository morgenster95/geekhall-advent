import { contestOpen, RULES_URL } from '../content';
import { NEWSLETTER_CONSENT } from '../config';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Camera, Check, ChevronLeft, ChevronRight, Copy, Share2, X } from 'lucide-react';
import type { Door, ListItem } from '../types';
import { LABELS, RARITY, stars, typeIcon } from './DoorGrid';
import { GameView } from './Games';

/** text s odstavci (prázdný řádek) a zalomeními řádků */
function Rich({ text, className }: { text: string; className?: string }) {
  return (
    <div className={className}>
      {text.split(/\n\s*\n/).map((par, k) => (
        <p key={k}>{par.split('\n').map((line, j) => <span key={j}>{j > 0 && <br />}{line.trim()}</span>)}</p>
      ))}
    </div>
  );
}

const itemText = (x: ListItem) => (typeof x === 'string' ? x : x.text);

/** zmenší fotku v prohlížeči na JPEG (data URL), aby se vešla do databáze (max. ~900 kB) */
async function compressPhoto(file: File): Promise<string> {
  if (file.type && !file.type.startsWith('image/')) throw new Error('Vyberte prosím fotku (JPG, PNG, HEIC).');
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((ok, fail) => {
      const i = new Image();
      i.onload = () => ok(i);
      i.onerror = () => fail(new Error('Tuto fotku se nepodařilo načíst. Zkuste jinou, nebo ji vyfoťte znovu.'));
      i.src = url;
    });
    for (const [max, q] of [[1280, 0.78], [1024, 0.72], [800, 0.65]] as const) {
      const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement('canvas');
      c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
      const data = c.toDataURL('image/jpeg', q);
      if (data.startsWith('data:image/jpeg') && data.length <= 880000) return data;
    }
    throw new Error('Fotku se nepodařilo zpracovat. Zkuste jinou.');
  } finally { URL.revokeObjectURL(url); }
}

interface Props {
  door: Door | null;
  /** e-mail přihlášeného uživatele (předvyplní se do soutěže) */
  email: string;
  /** náhled: soutěže jsou otevřené i po uzávěrce */
  preview: boolean;
  draft: boolean;
  entered: boolean;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  onShare: () => void;
  onCopy: (code: string) => void;
  onEnter: (day: number, answer: string, contact: string, photo?: string) => Promise<void>;
  onWin: () => void;
  /** ukázat jednorázovou nabídku newsletteru */
  offerNewsletter: boolean;
  onNewsletterOffer: (v: boolean) => void;
}

export function DoorModal({ door, email, preview, draft, entered, canPrev, canNext, onPrev, onNext, onClose, onShare, onCopy, onEnter, onWin, offerNewsletter, onNewsletterOffer }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const d = ref.current!;
    if (door && !d.open) d.showModal();
    if (!door && d.open) d.close();
    setFormError(''); setPhoto(null);
    bodyRef.current?.scrollTo(0, 0);
  }, [door]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!door?.contest || busy) return;
    const f = new FormData(e.currentTarget);
    const kind = door.contest.kind;
    if (kind === 'photo' && !photo) { setFormError('Přidejte prosím fotku.'); return; }
    setBusy(true); setFormError('');
    const answer = kind === 'number' ? String(f.get('answer') || '') : kind === 'photo' ? String(f.get('answer') || '').trim() || 'fotka' : 'registrace';
    try { await onEnter(door.day, answer, String(f.get('contact') || '').trim(), photo || undefined); }
    catch (er) { setFormError((er as Error).message); }
    finally { setBusy(false); }
  }

  async function pickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoBusy(true); setFormError('');
    try { setPhoto(await compressPhoto(file)); }
    catch (er) { setPhoto(null); setFormError((er as Error).message); e.target.value = ''; }
    finally { setPhotoBusy(false); }
  }

  const c = door?.contest;
  const open = !!c && (preview || contestOpen(c.until));
  return (
    <dialog ref={ref} className="modal" aria-label={door?.title || 'Okénko'} onCancel={(e) => { e.preventDefault(); onClose(); }} onClick={(e) => { if (e.target === ref.current) onClose(); }}>
      {door && (
        <div className="modal-card" key={door.day}>
          <button className="modal-close" aria-label="Zavřít" onClick={onClose}><X size={20} /></button>
          <div className={'modal-head t-' + door.type + (door.type === 'finale' ? ' holo' : '')}>
            <div className="mh-card">
              <div className="mh-top"><b>{door.day}. 12.</b><i>{stars(door.type)}</i></div>
              <div className="mh-art">{typeIcon(door.type, 64)}<em className="sp s1" /><em className="sp s2" /><em className="sp s3" /></div>
              <div className="mh-foot"><b>{LABELS[door.type]}</b><small>{RARITY[door.type]} karta č. {door.day}</small></div>
            </div>
          </div>
          <div className="modal-body" ref={bodyRef}>
            <div className="eyebrow">{typeIcon(door.type, 14)} {LABELS[door.type]}</div>
            <h2>{door.title}</h2>
            <Rich className="lead" text={door.text} />

            {door.image && (
              <figure className="door-image">
                <img src={door.image.src} alt={door.image.alt} loading="lazy" decoding="async" />
                {door.image.caption && <figcaption>{door.image.caption}</figcaption>}
              </figure>
            )}

            {door.list && (
              <ol className="steps">
                {door.list.map((x, k) => (
                  <li key={k}>
                    <span className="step-num">{k + 1}</span>
                    <div>
                      <span>{itemText(x)}</span>
                      {typeof x !== 'string' && x.image && (
                        <figure className="tip-photo">
                          <img src={x.image.src} alt={x.image.alt} loading="lazy" decoding="async" />
                          {x.image.caption && <figcaption>{x.image.caption}</figcaption>}
                        </figure>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )}

            {door.links && (
              <ul className="link-cards">
                {door.links.map((l) => (
                  <li key={l.url}><a href={l.url} target="_blank" rel="noreferrer"><strong>{l.label}</strong>{l.note && <span>{l.note}</span>}<ArrowUpRight size={16} /></a></li>
                ))}
              </ul>
            )}

            {door.more && <Rich className="more" text={door.more} />}

            {door.coupon && (
              <div className="coupon">
                <div className="coupon-top"><span>Slevový kód do košíku</span><b>{door.coupon.value}</b></div>
                {door.coupon.code ? (
                  <div className="coupon-row">
                    <code>{door.coupon.code}</code>
                    <button onClick={() => onCopy(door.coupon!.code!)}><Copy size={16} /> Kopírovat</button>
                  </div>
                ) : (
                  <div className="coupon-row secret"><span>Tajný kupón Geek Hall · {door.day}. prosince</span></div>
                )}
                <small>{door.coupon.valid.replace(/\.$/, '')}. Kód zadejte v košíku e-shopu.</small>
                <small>Kupón máte uložený i v sekci <b>Moje karty</b>.</small>
              </div>
            )}

            {door.game && <GameView game={door.game} onDone={onWin} />}

            {c && (
              <div className="contest">
                <div className="prize"><span>Výhra</span><b>{c.prize}</b></div>
                <p className="rules">{c.rules} <a href={RULES_URL} target="_blank" rel="noreferrer">Úplná pravidla</a></p>
                {entered ? (
                  <div className="success" role="status"><Check size={26} /><div><strong>Jste v soutěži.</strong><span>Výherce oznámíme e-mailem. Držíme palce!</span></div></div>
                ) : !open ? (
                  <div className="form-error" role="status">Tato soutěž už skončila. Děkujeme všem, kdo se zapojili!</div>
                ) : (
                  <form onSubmit={submit}>
                    {c.kind === 'number' && (<><label htmlFor="answer">Váš tip</label><input id="answer" name="answer" type="number" inputMode="numeric" min={0} max={1000000} step={1} required placeholder={c.placeholder} /></>)}
                    {c.kind === 'photo' && (
                      <>
                        <label htmlFor="photo">Fotka vašeho geek koutku</label>
                        <label className={'photo-drop' + (photo ? ' has-photo' : '')}>
                          <input id="photo" type="file" accept="image/*" onChange={pickPhoto} />
                          {photo ? <img src={photo} alt="Náhled vybrané fotky" /> : <span><Camera size={22} /> {photoBusy ? 'Zpracovávám fotku…' : 'Vyfotit nebo vybrat fotku'}</span>}
                        </label>
                        {photo && <small className="muted">Jinou fotku vyberete klepnutím na náhled.</small>}
                        <label htmlFor="answer">Pár slov k fotce (nepovinné)</label>
                        <textarea id="answer" name="answer" maxLength={500} rows={2} placeholder="Co na fotce je a čím se pochlubíte" />
                      </>
                    )}
                    <label htmlFor="contact">Váš e-mail</label>
                    <input id="contact" name="contact" type="email" required maxLength={254} defaultValue={email} autoComplete="email" />
                    <label className="check"><input type="checkbox" required /> <span>Souhlasím s <a href={RULES_URL} target="_blank" rel="noreferrer">pravidly soutěže</a> a se zpracováním osobních údajů{c.kind === 'photo' ? ', včetně zveřejnění fotky bez jména na webu a sociálních sítích Geek Hall' : ''}.</span></label>
                    {formError && <div className="form-error" role="alert">{formError}</div>}
                    <button className="btn primary" disabled={busy || photoBusy}>{busy ? 'Odesílám…' : c.kind === 'email' ? 'Zapojit se do soutěže' : c.kind === 'photo' ? 'Odeslat fotku' : 'Odeslat tip'} <ArrowRight size={17} /></button>
                  </form>
                )}
              </div>
            )}

            {door.url && (
              <div className="cta-row"><a className="btn primary" href={door.url} target="_blank" rel="noreferrer">{door.urlLabel || 'Do e-shopu'} <ArrowUpRight size={16} /></a></div>
            )}

            {offerNewsletter && (
              <div className="nl-offer" role="region" aria-label="Novinky e-mailem">
                <div className="nl-offer-icon" aria-hidden="true">✉</div>
                <div>
                  <strong>Chcete vědět o dalších slevách dřív než ostatní?</strong>
                  <p>{NEWSLETTER_CONSENT.text}</p>
                  <div className="nl-offer-actions">
                    <button className="btn primary" onClick={() => onNewsletterOffer(true)}>Ano, chci novinky</button>
                    <button className="btn ghost-dark" onClick={() => onNewsletterOffer(false)}>Teď ne</button>
                  </div>
                  <small>Kupóny z kalendáře dostanete tak jako tak. Nastavení změníte kdykoli v Moje karty.</small>
                </div>
              </div>
            )}

            {draft && door.confirm && <div className="draft-note"><b>K potvrzení:</b> {door.confirm}</div>}

            <nav className="modal-nav" aria-label="Další okénka">
              <button disabled={!canPrev} onClick={onPrev}><ChevronLeft size={17} /> Předchozí</button>
              <button onClick={onShare}><Share2 size={15} /> Sdílet</button>
              <button disabled={!canNext} onClick={onNext}>Další <ChevronRight size={17} /></button>
            </nav>
          </div>
        </div>
      )}
    </dialog>
  );
}
