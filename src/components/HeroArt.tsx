import { Gamepad2, Lightbulb, Percent, Trophy } from 'lucide-react';
import { D20, PixelTree, SantaHat } from './Decor';
import { Pack } from './Pack';

const FAN = [
  { cls: 'f1 pk-0', icon: <Percent size={34} />, label: 'Sleva', stars: '★★★' },
  { cls: 'f2 pk-3', icon: <Gamepad2 size={34} />, label: 'Hra', stars: '★★' },
  { cls: 'f3 pk-7', icon: <Trophy size={34} />, label: 'Soutěž', stars: '★★★★' },
  { cls: 'f4 pk-4', icon: <Lightbulb size={34} />, label: 'Tip', stars: '★' },
];

/**
 * Úvodní ilustrace: obří booster „Advent 2026“, ze kterého lítají karty,
 * d20 a kostky v Santových čepicích a pixelový stromek. Vše vektorově, bez cizích postav.
 */
export function HeroArt() {
  return (
    <div className="hero-art" aria-hidden="true">
      <div className="ha-glow" />
      {FAN.map((f) => (
        <div key={f.cls} className={'hf ' + f.cls}>
          <div className="hf-in"><div className="hf-head"><b>{f.label}</b><i>{f.stars}</i></div><div className="hf-art">{f.icon}</div></div>
        </div>
      ))}
      <div className="ha-pack pk-5"><Pack mark="ADVENT" badge="2026" /></div>
      <div className="ha-d20"><D20 /><SantaHat className="hat" /></div>
      <div className="ha-tree"><PixelTree /></div>
      <span className="ha-confetti c1" /><span className="ha-confetti c2" /><span className="ha-confetti c3" /><span className="ha-confetti c4" /><span className="ha-confetti c5" />
    </div>
  );
}
