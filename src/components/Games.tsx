import { useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpRight, Check, GripVertical, RotateCcw, X } from 'lucide-react';
import type { Game } from '../types';

interface Props { game: Game; onDone: () => void; }

export function GameView({ game, onDone }: Props) {
  if (game.kind === 'quiz') return <Quiz game={game} onDone={onDone} />;
  if (game.kind === 'persona') return <Persona game={game} onDone={onDone} />;
  return <Order game={game} onDone={onDone} />;
}

function Quiz({ game, onDone }: { game: Extract<Game, { kind: 'quiz' }>; onDone: () => void }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const total = game.questions.length;
  const reset = () => { setI(0); setScore(0); setPicked(null); setFinished(false); };
  const next = () => { if (i + 1 < total) { setI(i + 1); setPicked(null); } else { setFinished(true); onDone(); } };

  if (finished) {
    const perfect = score === total;
    if (game.reward) {
      return (
        <div className="game-result">
          <strong>{score} z {total}</strong>
          {perfect ? (
            <div className="reward big"><Check size={20} /> <span>{game.reward}</span></div>
          ) : (
            <p>{game.fail || 'Odměna je za všechny správné odpovědi. Zkuste to znovu.'}</p>
          )}
          <button className={'btn ' + (perfect ? 'ghost-dark' : 'primary')} onClick={reset}><RotateCcw size={16} /> {perfect ? 'Hrát znovu' : 'Zkusit znovu'}</button>
        </div>
      );
    }
    const verdict = game.verdicts?.find((v) => score >= v.min)?.text
      ?? (perfect ? 'Všechno správně, skvělé!' : score >= total / 2 ? 'Pěkný výsledek!' : 'Příště to půjde lépe.');
    return (
      <div className="game-result">
        <strong>{score} z {total}</strong>
        <p>{verdict}</p>
        <button className="btn ghost-dark" onClick={reset}><RotateCcw size={16} /> Hrát znovu</button>
      </div>
    );
  }

  const q = game.questions[i];
  const answered = picked !== null;
  const reveal = answered && !game.hideAnswers;
  return (
    <div className="game">
      <div className="game-step">Otázka {i + 1} / {total}</div>
      {q.image && <img key={q.image.src} className="game-photo" src={q.image.src} alt={q.image.alt} width={640} height={640} decoding="async" />}
      <h3>{q.q}</h3>
      <div className="options">
        {q.options.map((o, k) => (
          <button key={i + '-' + k} disabled={answered}
            onClick={() => {
              setPicked(k);
              if (k === q.answer) setScore((s) => s + 1);
              // u hry o odměnu správnou odpověď neprozrazujeme, rovnou další otázka
              if (game.hideAnswers) setTimeout(next, 300);
            }}
            className={'option' + (reveal ? (k === q.answer ? ' right' : k === picked ? ' wrong' : '') : answered && k === picked ? ' picked' : '')}>
            <span>{o}</span>{reveal && k === q.answer && <Check size={18} />}{reveal && k === picked && k !== q.answer && <X size={18} />}
          </button>
        ))}
      </div>
      {reveal && (
        <div className="game-next">
          {q.explain && <p><b>{picked === q.answer ? 'Správně.' : `Správně je: ${q.options[q.answer]}.`}</b> {q.explain}</p>}
          <button className="btn primary" onClick={next}>{i + 1 < total ? 'Další otázka' : 'Zobrazit výsledek'}</button>
        </div>
      )}
    </div>
  );
}

function Persona({ game, onDone }: { game: Extract<Game, { kind: 'persona' }>; onDone: () => void }) {
  const [i, setI] = useState(0);
  const [tally, setTally] = useState<Record<string, number>>({});
  const [result, setResult] = useState<string | null>(null);
  if (result) {
    const r = game.results[result];
    return (
      <div className="game-result">
        <small>Jste typ</small>
        <strong>{r.title}</strong>
        <p>{r.text}</p>
        <div className="result-links">
          {r.links.map((l) => <a key={l.url} className="btn primary" href={l.url} target="_blank" rel="noreferrer">{l.label} <ArrowUpRight size={16} /></a>)}
        </div>
        <button className="btn ghost-dark" onClick={() => { setI(0); setTally({}); setResult(null); }}><RotateCcw size={16} /> Hrát znovu</button>
      </div>
    );
  }
  const q = game.questions[i];
  const types = Object.keys(game.results);
  return (
    <div className="game">
      <div className="game-step">Otázka {i + 1} / {game.questions.length}</div>
      <h3>{q.q}</h3>
      <div className="options">
        {q.options.map((o, k) => (
          <button key={i + '-' + k} className="option" onClick={() => {
            const t = o.r ? { ...tally, [o.r]: (tally[o.r] || 0) + 1 } : tally;
            setTally(t);
            if (i + 1 < game.questions.length) setI(i + 1);
            else {
              // nejvíc bodů; při shodě rozhoduje pořadí typů v results
              setResult(types.reduce((a, b) => ((t[b] || 0) > (t[a] || 0) ? b : a), types[0]));
              onDone();
            }
          }}><span>{String.fromCharCode(65 + k)}. {o.t}</span></button>
        ))}
      </div>
    </div>
  );
}

type OrderItem = Extract<Game, { kind: 'order' }>['items'][number];

function Order({ game, onDone }: { game: Extract<Game, { kind: 'order' }>; onDone: () => void }) {
  const sorted = useMemo(() => [...game.items].sort((a, b) => a.year - b.year), [game]);
  // pevné zamíchané pořadí, které nikdy neodpovídá správnému
  const start = useMemo(() => {
    const s = [...game.items].sort((a, b) => ((a.year * 7) % 11) - ((b.year * 7) % 11));
    return s.every((x, k) => x.label === sorted[k].label) ? [...s].reverse() : s;
  }, [game, sorted]);
  const [order, setOrder] = useState<OrderItem[]>(start);
  const [checked, setChecked] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);
  const listRef = useRef<HTMLOListElement>(null);

  const move = (from: number, to: number) => setOrder((o) => {
    if (to < 0 || to >= o.length || from === to) return o;
    const n = [...o]; const [x] = n.splice(from, 1); n.splice(to, 0, x); return n;
  });

  function onPointerDown(e: React.PointerEvent, label: string) {
    if (checked || (e.pointerType === 'mouse' && e.button !== 0)) return;
    e.preventDefault();
    listRef.current?.setPointerCapture(e.pointerId);
    setDragging(label);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging || !listRef.current) return;
    const cards = [...listRef.current.children] as HTMLElement[];
    const from = order.findIndex((x) => x.label === dragging);
    // cílová pozice = nejvzdálenější karta, přes jejíž střed jsme přejeli
    let to = from;
    cards.forEach((c, k) => {
      const r = c.getBoundingClientRect();
      const mid = r.top + r.height / 2;
      if (k < from && e.clientY < mid) to = Math.min(to, k);
      if (k > from && e.clientY > mid) to = Math.max(to, k);
    });
    if (to !== from) move(from, to);
  }
  const onPointerUp = () => setDragging(null);

  const allRight = order.every((x, k) => x.label === sorted[k].label);
  return (
    <div className="game">
      <p className="game-prompt">{game.prompt}</p>
      <ol className={'order-list' + (dragging ? ' is-dragging' : '')} ref={listRef} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
        {order.map((it, k) => {
          const ok = it.label === sorted[k].label;
          return (
            <li key={it.label} className={'order-card' + (dragging === it.label ? ' dragging' : '') + (checked ? (ok ? ' right' : ' wrong') : '')}>
              <div className="order-grab" onPointerDown={(e) => onPointerDown(e, it.label)} title={checked ? undefined : 'Přetáhněte'}>
                <span className="order-num">{k + 1}</span>
                {it.image && <img src={it.image} alt="" width={64} height={64} decoding="async" draggable={false} />}
                {!checked && <GripVertical size={18} className="order-grip" aria-hidden="true" />}
              </div>
              <span className="order-label">{it.label}{checked && <small>{it.year}</small>}</span>
              {checked ? (ok ? <Check size={20} aria-label="správně" /> : <X size={20} aria-label="špatně" />) : (
                <span className="order-arrows">
                  <button type="button" aria-label={`Posunout ${it.label} výš`} disabled={k === 0} onClick={() => move(k, k - 1)}><ArrowUp size={16} /></button>
                  <button type="button" aria-label={`Posunout ${it.label} níž`} disabled={k === order.length - 1} onClick={() => move(k, k + 1)}><ArrowDown size={16} /></button>
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {!checked ? (
        <div className="game-next"><button className="btn primary" onClick={() => { setChecked(true); onDone(); }}>Zkontrolovat</button></div>
      ) : (
        <div className="game-result">
          <strong>{allRight ? 'Všechno správně!' : 'Něco vedle'}</strong>
          <p>{allRight ? game.win : game.lose}</p>
          <div className="order-solution">
            <b>Správné pořadí:</b>
            <ol>{sorted.map((x) => <li key={x.label}>{x.label} ({x.year})</li>)}</ol>
          </div>
          <button className="btn ghost-dark" onClick={() => { setOrder(start); setChecked(false); }}><RotateCcw size={16} /> Hrát znovu</button>
        </div>
      )}
    </div>
  );
}
