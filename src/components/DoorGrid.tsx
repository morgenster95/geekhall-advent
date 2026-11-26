import { useEffect, useState } from 'react';
import { Check, Gamepad2, Lightbulb, Lock, PartyPopper, Percent, Sparkles, Trophy } from 'lucide-react';
import type { DoorType } from '../types';
import { doors } from '../content';

export const typeIcon = (t?: DoorType, size = 20) => {
  switch (t) {
    case 'offer': return <Percent size={size} />;
    case 'game': return <Gamepad2 size={size} />;
    case 'contest': return <Trophy size={size} />;
    case 'finale': return <PartyPopper size={size} />;
    case 'tip': return <Lightbulb size={size} />;
    default: return <Sparkles size={size} />;
  }
};

export const LABELS: Record<DoorType, string> = {
  offer: 'Sleva', game: 'Hra', tip: 'Tip', contest: 'Soutěž', finale: 'Finále',
};
/** vzácnost karty jako v TCG: čím lepší odměna, tím víc hvězdiček */
export const STARS: Record<DoorType, number> = { tip: 1, game: 2, offer: 3, contest: 4, finale: 5 };
export const RARITY: Record<DoorType, string> = { tip: 'Běžná', game: 'Neobvyklá', offer: 'Vzácná', contest: 'Epická', finale: 'Legendární' };
export const stars = (t: DoorType) => '★'.repeat(STARS[t]);

function useCols() {
  const get = () => (innerWidth >= 900 ? 6 : innerWidth >= 560 ? 4 : 3);
  const [cols, setCols] = useState(get);
  useEffect(() => { const on = () => setCols(get()); addEventListener('resize', on); return () => removeEventListener('resize', on); }, []);
  return cols;
}

/** Rub karty: kostka s puntíky na tmavém vzorovaném pozadí. */
function CardBack() {
  return (
    <svg className="cb-dice" viewBox="0 0 64 64" aria-hidden="true">
      <g transform="rotate(-12 32 32)">
        <rect x="10" y="10" width="44" height="44" rx="10" fill="#fff" />
        <g fill="#202124"><circle cx="21" cy="21" r="3.6" /><circle cx="43" cy="21" r="3.6" /><circle cx="32" cy="32" r="3.6" /><circle cx="21" cy="43" r="3.6" /><circle cx="43" cy="43" r="3.6" /></g>
      </g>
    </svg>
  );
}

interface Props {
  max: number;
  opened: Map<number, DoorType | undefined>;
  opening: number | null;
  onOpen: (day: number, el: HTMLElement) => void;
}

/** 24 okének jako sběratelské karty v albu. Neodemčené leží rubem nahoru, otevřené se otočí. */
export function DoorGrid({ max, opened, opening, onOpen }: Props) {
  const cols = useCols();
  return (
    <div className="binder">
      <div className="grid" style={{ ['--cols' as string]: cols }} role="list" aria-label="24 adventních karet">
        {doors.map((d, i) => {
          const isOpen = opened.has(d.day);
          const locked = d.day > max;
          const today = d.day === max && !isOpen;
          const state = isOpen ? 'opened' : locked ? 'locked' : 'available';
          const label = `Karta ${d.day}${locked ? ', odemkne se ' + d.day + '. prosince' : isOpen ? ', otočená' : ', otočit'}`;
          return (
            <div role="listitem" key={d.day} className="tile-slot">
              <button
                className={`card t-${d.type} ${state}${today ? ' today' : ''}${opening === d.day ? ' opening' : ''}`}
                aria-label={label}
                aria-disabled={locked}
                onClick={(e) => onOpen(d.day, e.currentTarget)}
                style={{ animationDelay: `${i * 24}ms` }}
              >
                <span className="card-inner">
                  <span className="face back">
                    <span className="cb-num">{d.day}</span>
                    <CardBack />
                    <span className="cb-foot">{locked ? <><Lock size={11} /> {d.day}. 12.</> : 'Advent 2026'}</span>
                    {today && <span className="card-badge">dnes</span>}
                  </span>
                  <span className="face front">
                    <span className="cf">
                      <span className="cf-head"><b>{d.day}. 12.</b><i>{stars(d.type)}</i></span>
                      <span className="cf-art">{typeIcon(d.type, 40)}<em className="sp s1" /><em className="sp s2" /><em className="sp s3" /></span>
                      <span className="cf-foot"><b>{LABELS[d.type]}</b><small>{RARITY[d.type]}</small></span>
                    </span>
                    {isOpen && <span className="cf-tick"><Check size={11} /></span>}
                  </span>
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
