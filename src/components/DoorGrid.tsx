import { useEffect, useState } from 'react';
import { Check, Gamepad2, Gift, Lightbulb, Lock, PartyPopper, Percent, Trophy } from 'lucide-react';
import type { DoorType } from '../types';
import { doors } from '../content';
import { Lights } from './Decor';

export const typeIcon = (t?: DoorType, size = 20) => {
  switch (t) {
    case 'offer': return <Percent size={size} />;
    case 'game': return <Gamepad2 size={size} />;
    case 'contest': return <Trophy size={size} />;
    case 'finale': return <PartyPopper size={size} />;
    case 'tip': return <Lightbulb size={size} />;
    default: return <Gift size={size} />;
  }
};

export const LABELS: Record<DoorType, string> = {
  offer: 'Nabídka', game: 'Hra', tip: 'Tip', contest: 'Soutěž', finale: 'Finále',
};

function useCols() {
  const get = () => (innerWidth >= 900 ? 6 : innerWidth >= 560 ? 4 : 3);
  const [cols, setCols] = useState(get);
  useEffect(() => { const on = () => setCols(get()); addEventListener('resize', on); return () => removeEventListener('resize', on); }, []);
  return cols;
}

interface Props {
  max: number;
  opened: Map<number, DoorType | undefined>;
  opening: number | null;
  onOpen: (day: number, el: HTMLElement) => void;
}

/** 24 okének jako ikony na displeji telefonu. */
export function DoorGrid({ max, opened, opening, onOpen }: Props) {
  const cols = useCols();
  return (
    <div className="phone">
      <Lights className="phone-lights" count={14} />
      <div className="phone-bar" aria-hidden="true"><i className="notch" /><span>Adventní kalendář</span><span>Advent 2026</span></div>
      <div className="grid" style={{ ['--cols' as string]: cols }} role="list" aria-label="24 adventních okének">
        {doors.map((d, i) => {
          const isOpen = opened.has(d.day);
          const locked = d.day > max;
          const today = d.day === max && !isOpen;
          const state = isOpen ? 'opened' : locked ? 'locked' : 'available';
          const label = `Okénko ${d.day}${locked ? ', odemkne se ' + d.day + '. prosince' : isOpen ? ', otevřené' : ', otevřít'}`;
          return (
            <div role="listitem" key={d.day} className="tile-slot">
              <button
                className={`tile t-${d.type} ${state}${today ? ' today' : ''}${opening === d.day ? ' opening' : ''}`}
                aria-label={label}
                aria-disabled={locked}
                onClick={(e) => onOpen(d.day, e.currentTarget)}
                style={{ animationDelay: `${i * 24}ms` }}
              >
                <span className="tile-num">{d.day}</span>
                {!isOpen && <span className="bow" />}
                <span className="tile-ico">{typeIcon(d.type, 26)}</span>
                {locked && <span className="tile-lock"><Lock size={12} /></span>}
                {isOpen && <span className="tile-tick"><Check size={11} /></span>}
                {today && <span className="tile-badge">dnes</span>}
              </button>
              <span className="tile-label">{locked ? d.day + '. 12.' : LABELS[d.type]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
