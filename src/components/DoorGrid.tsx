import { useEffect, useState } from 'react';
import { Check, Gamepad2, Lightbulb, PartyPopper, Percent, Scissors, Sparkles, Trophy } from 'lucide-react';
import type { DoorType } from '../types';
import { doors } from '../content';
import { Pack } from './Pack';

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
/** velká odměna na kartě: u slev „−10 %“, jinak null (zobrazí se ikona) */
export const rewardText = (coupon?: { value: string }) => {
  const m = coupon?.value.match(/(\d+)\s*%/);
  return m ? `−${m[1]} %` : null;
};

function useCols() {
  const get = () => (innerWidth >= 900 ? 6 : innerWidth >= 560 ? 4 : 3);
  const [cols, setCols] = useState(get);
  useEffect(() => { const on = () => setCols(get()); addEventListener('resize', on); return () => removeEventListener('resize', on); }, []);
  return cols;
}

/** Barevná paleta boosteru podle dne (osm barev promíchaných tak, aby sousední boostery nebyly stejné). Finále je zlaté. */
export const packClass = (day: number) => (day === 24 ? 'pk-final' : 'pk-' + ((day * 5) % 8));

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
                className={`card ${packClass(d.day)} t-${d.type} ${state}${today ? ' today' : ''}${opening === d.day ? ' opening' : ''}`}
                aria-label={label}
                aria-disabled={locked}
                onClick={(e) => onOpen(d.day, e.currentTarget)}
                style={{ animationDelay: `${i * 24}ms` }}
              >
                <span className="pk-front">
                  <span className="cf">
                    <span className="cf-head"><b>{d.day}. 12.</b><i>{stars(d.type)}</i></span>
                    <span className="cf-art">{rewardText(d.coupon) ? <strong className="cf-pct">{rewardText(d.coupon)}</strong> : typeIcon(d.type, 40)}<em className="sp s1" /><em className="sp s2" /><em className="sp s3" /></span>
                    <span className="cf-foot"><b>{LABELS[d.type]}</b><small>{RARITY[d.type]}</small></span>
                  </span>
                  {isOpen && <span className="cf-tick"><Check size={11} /></span>}
                </span>
                <span className="pk-wrap">
                  <span className="pk-body"><Pack badge={d.day} locked={locked} /></span>
                  <span className="pk-top"><Pack badge={d.day} locked={locked} /></span>
                  <span className="pk-cut" aria-hidden="true"><i /><Scissors size={22} /></span>
                  {today && <span className="card-badge">dnes</span>}
                </span>
                <span className="pk-burst" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
