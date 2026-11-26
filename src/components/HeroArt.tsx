import { Dices, Gamepad2, Percent } from 'lucide-react';

/** Hrací kostka (SVG) s danými puntíky. */
function Die({ pips, className = '' }: { pips: [number, number][]; className?: string }) {
  return (
    <svg className={'die ' + className} viewBox="0 0 64 64" aria-hidden="true">
      <rect x="4" y="4" width="56" height="56" rx="13" fill="#fff" />
      <rect x="4" y="4" width="56" height="56" rx="13" fill="none" stroke="rgba(0,0,0,.12)" strokeWidth="2" />
      {pips.map(([x, y]) => <circle key={x + '-' + y} cx={x} cy={y} r="5" fill="#202124" />)}
    </svg>
  );
}

/**
 * Úvodní ilustrace: vějíř sběratelských karet, booster s nápisem Advent 2026 a poletující kostky.
 * Vše vektorově (SVG + CSS) – žádné cizí postavy ani obrázky ke stažení.
 */
export function HeroArt() {
  return (
    <div className="hero-art" aria-hidden="true">
      <div className="hc hc-l t-offer">
        <div className="hc-in">
          <div className="hc-head"><b>Sleva</b><i>★★★</i></div>
          <div className="hc-art"><Percent size={44} /><em className="sp s1" /><em className="sp s2" /></div>
          <div className="hc-foot"><strong>−10 %</strong><small>na Warhammer</small></div>
        </div>
      </div>
      <div className="hc hc-r t-game">
        <div className="hc-in">
          <div className="hc-head"><b>Hra</b><i>★★</i></div>
          <div className="hc-art"><Gamepad2 size={44} /><em className="sp s1" /><em className="sp s2" /></div>
          <div className="hc-foot"><strong>Kvíz</strong><small>pravý geek?</small></div>
        </div>
      </div>
      <div className="hc hc-c t-finale holo">
        <div className="hc-in">
          <div className="hc-head"><b>Advent</b><i>★★★★★</i></div>
          <div className="hc-art"><span className="hc-24">24</span><em className="sp s1" /><em className="sp s2" /><em className="sp s3" /></div>
          <div className="hc-foot"><strong>Karet</strong><small>Legendární sbírka</small></div>
        </div>
      </div>
      <div className="booster">
        <div className="bo-top" />
        <div className="bo-body">
          <Dices size={34} />
          <strong>ADVENT</strong>
          <span>2026</span>
          <small>24 karet</small>
        </div>
        <div className="bo-top bo-bottom" />
      </div>
      <Die className="d1" pips={[[20, 20], [44, 20], [32, 32], [20, 44], [44, 44]]} />
      <Die className="d2" pips={[[20, 20], [44, 44], [32, 32]]} />
      <Die className="d3" pips={[[20, 20], [44, 20], [20, 44], [44, 44]]} />
    </div>
  );
}
