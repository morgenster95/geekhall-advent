import type { ReactNode } from 'react';
import { Lock, Snowflake } from 'lucide-react';
import { DiceHat } from './Decor';

/**
 * Obal boosteru: barevná fólie se zubatými lemy, kostkou v Santově čepici a sněhovou vločkou.
 * Barvy určuje třída pk-* na rodiči (proměnné --p1 a --p2). Velikost se škáluje podle šířky (cqw).
 */
export function Pack({ mark = 'ADVENT', badge, locked = false }: { mark?: string; badge: ReactNode; locked?: boolean }) {
  return (
    <span className="pack">
      <i className="pk-crimp top" />
      <i className="pk-crimp bottom" />
      <span className="pk-flake"><Snowflake /></span>
      <span className="pk-mark">{mark}</span>
      <span className="pk-emblem"><DiceHat /></span>
      <span className="pk-badge">{badge}</span>
      {locked && <span className="pk-lock"><Lock /></span>}
    </span>
  );
}
