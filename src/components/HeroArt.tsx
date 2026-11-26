/**
 * Vánoční ilustrace v úvodu: telefon s okénky jako zabalenými dárky, sněhová čepice,
 * světelný řetěz kolem telefonu, jedlová větev s ozdobami a hromádka dárků.
 * Vše vektorově (SVG + CSS) – ostré na každém displeji, bez dalších souborů ke stažení.
 */

const TYPES = ['offer', 'game', 'tip', 'contest'] as const;
const BULBS = ['#ffd166', '#dc3545', '#35dccc', '#3ddc84'];

type P = [number, number];
/** bod na kubické Bézierově křivce */
function bez(a: P, b: P, c: P, d: P, t: number): P {
  const u = 1 - t;
  return [
    u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
    u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1],
  ];
}
/** řetěz: dva oblouky přes telefon (souřadnice v rámci telefonu 266 × 502) */
const SEGS: [P, P, P, P][] = [
  [[-22, 70], [60, 120], [200, 40], [290, 96]],
  [[290, 96], [200, 210], [60, 300], [-22, 430]],
];
const wirePath = SEGS.map(([a, b, c, d], i) => `${i ? '' : `M${a}`} C${b} ${c} ${d}`).join(' ');
const bulbs = SEGS.flatMap((s, si) => Array.from({ length: 8 }, (_, i) => {
  const t = (i + 0.5) / 8;
  const [x, y] = bez(...s, t);
  const [x2, y2] = bez(...s, Math.min(1, t + 0.01));
  const ang = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI;
  return { x, y, ang, color: BULBS[(si * 8 + i) % 4], delay: ((si * 8 + i) % 4) * 0.55 };
}));

function Bow({ className = '' }: { className?: string }) {
  return (
    <svg className={'bow ' + className} viewBox="0 0 40 22" aria-hidden="true">
      <path d="M20 13C14 2 4 0 3 6s8 9 17 7Z" />
      <path d="M20 13C26 2 36 0 37 6s-8 9-17 7Z" />
      <path className="bow-tail" d="M18 13l-6 9M22 13l6 9" />
      <circle cx="20" cy="13" r="3.6" />
    </svg>
  );
}

function SnowCap() {
  return (
    <svg className="ha-cap" viewBox="0 0 280 60" aria-hidden="true">
      <path fill="#dfe9ff" d="M8 34C6 16 30 8 58 12c22-12 52-10 70 0 24-10 58-10 76 2 26-6 64 0 68 22 2 8-6 10-10 6-2 10-12 12-16 4-6 10-18 10-20 0-10 6-22 4-26-4-8 12-22 10-26 0-8 8-20 6-24-2-6 14-20 12-22 0-10 6-20 4-22-4-10 4-18 2-20-6-6 6-16 6-18-2-6 4-10 0-6-6Z" />
      <path fill="#fff" d="M10 30C10 16 32 10 58 14c22-11 50-9 70 0 24-9 56-9 74 2 26-5 60 0 64 18-6 2-12 0-14-4-6 8-16 8-20 0-8 6-18 4-22-2-8 6-18 6-24-2-8 6-18 6-24 0-8 6-18 6-22-2-8 6-18 4-22-2-8 4-16 2-20-4-6 4-14 4-18-2-6 4-12 2-14-4-4 2-8 0-8-4Z" />
      <ellipse cx="70" cy="18" rx="22" ry="3" fill="#fff" opacity=".9" />
    </svg>
  );
}

function Garland() {
  return (
    <svg className="ha-garland" viewBox="0 0 266 502" aria-hidden="true">
      <path d={wirePath} fill="none" stroke="#06261a" strokeWidth="3.4" strokeLinecap="round" />
      <path d={wirePath} fill="none" stroke="#2a6b4d" strokeWidth="1" strokeDasharray="1 5" strokeLinecap="round" />
      {bulbs.map((b, i) => (
        <g key={i} transform={`translate(${b.x.toFixed(1)} ${b.y.toFixed(1)}) rotate(${(b.ang + 90).toFixed(0)})`}>
          <rect x="-3.4" y="-2" width="6.8" height="6" rx="1.4" fill="#1b2a1f" />
          <ellipse className="ha-bulb" cx="0" cy="11" rx="6" ry="8.6" fill={b.color} style={{ color: b.color, animationDelay: `${b.delay}s` }} />
          <ellipse cx="-2" cy="8" rx="1.6" ry="3" fill="#fff" opacity=".75" />
        </g>
      ))}
    </svg>
  );
}

/** jedlová větev: hlavní větvička a postranní výhonky, hustě obsypané jehličím */
function FirBranch() {
  const twigs: [P, P][] = [[[0, 40], [290, 100]], [[90, 58], [150, 10]], [[170, 76], [240, 30]], [[120, 66], [160, 130]], [[220, 88], [262, 150]]];
  const needles: { x: number; y: number; dx: number; dy: number; c: string }[] = [];
  twigs.forEach(([a, b], ti) => {
    const n = ti === 0 ? 46 : 16;
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const ux = (b[0] - a[0]) / len, uy = (b[1] - a[1]) / len;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t;
      const l = (ti === 0 ? 24 : 17) * (1 - t * 0.45);
      for (const side of [1, -1]) {
        const ang = 0.95 * side;
        const dx = (ux * Math.cos(ang) - uy * Math.sin(ang)) * l, dy = (ux * Math.sin(ang) + uy * Math.cos(ang)) * l;
        needles.push({ x, y, dx, dy, c: ['#14583a', '#1f7a4d', '#2a8f5c', '#0f4a30'][(i + ti + (side > 0 ? 1 : 0)) % 4] });
      }
    }
  });
  return (
    <svg className="ha-fir" viewBox="-20 -10 330 220" aria-hidden="true">
      <g strokeLinecap="round" strokeWidth="2.6">
        {twigs.map(([a, b], i) => <path key={i} d={`M${a}L${b}`} stroke="#4a3221" strokeWidth={i ? 2 : 3.5} />)}
        {needles.map((n, i) => <path key={i} d={`M${n.x.toFixed(1)} ${n.y.toFixed(1)}l${n.dx.toFixed(1)} ${n.dy.toFixed(1)}`} stroke={n.c} />)}
      </g>
      {/* ozdoby */}
      <path d="M110 62v54M230 92v34" stroke="#ffd166" strokeWidth="1.2" />
      <g transform="translate(110 132)">
        <rect x="-5" y="-20" width="10" height="7" rx="2" fill="#ffd166" />
        <circle r="17" fill="#dc3545" />
        <path d="M-17 0a17 6 0 0 0 34 0" fill="none" stroke="#ffd166" strokeWidth="2" opacity=".9" />
        <circle cx="-6" cy="-6" r="5" fill="#fff" opacity=".45" />
      </g>
      <g transform="translate(230 140)">
        <rect x="-4" y="-16" width="8" height="6" rx="2" fill="#ffd166" />
        <circle r="13" fill="#35dccc" />
        <path d="M-9-5l18 10M-9 5l18-10" stroke="#fff" strokeWidth="1.6" opacity=".55" />
        <circle cx="-4" cy="-5" r="3.5" fill="#fff" opacity=".5" />
      </g>
    </svg>
  );
}

function Gifts() {
  return (
    <svg className="ha-gifts" viewBox="0 0 230 150" aria-hidden="true">
      <ellipse cx="118" cy="142" rx="110" ry="8" fill="#000" opacity=".25" />
      {/* velký růžový */}
      <rect x="10" y="62" width="104" height="80" rx="6" fill="#dc3545" />
      <rect x="10" y="62" width="104" height="80" rx="6" fill="url(#gShade)" />
      <rect x="4" y="50" width="116" height="20" rx="5" fill="#a78bfa" />
      <rect x="54" y="50" width="16" height="92" fill="#ffd166" />
      <path d="M62 50c-12-22-36-24-36-10 0 9 20 12 36 10Zm0 0c12-22 36-24 36-10 0 9-20 12-36 10Z" fill="#ffd166" stroke="#e9b23e" strokeWidth="1.5" />
      {/* modrý */}
      <rect x="120" y="84" width="74" height="58" rx="5" fill="#35dccc" />
      <rect x="120" y="84" width="74" height="58" rx="5" fill="url(#gShade)" />
      <rect x="116" y="76" width="82" height="15" rx="4" fill="#5cc8f0" />
      <rect x="150" y="76" width="13" height="66" fill="#fff" />
      <path d="M156 76c-8-15-26-17-26-7 0 7 14 8 26 7Zm0 0c8-15 26-17 26-7 0 7-14 8-26 7Z" fill="#fff" stroke="#dfe3e8" strokeWidth="1.2" />
      {/* malý zlatý */}
      <rect x="182" y="112" width="42" height="30" rx="4" fill="#ffb020" />
      <rect x="179" y="106" width="48" height="10" rx="3" fill="#ffc94d" />
      <rect x="198" y="106" width="9" height="36" fill="#dc3545" />
      <path d="M202 106c-5-9-15-10-15-4 0 4 8 5 15 4Zm0 0c5-9 15-10 15-4 0 4-8 5-15 4Z" fill="#dc3545" />
      <defs>
        <linearGradient id="gShade" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".18" />
          <stop offset=".55" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".18" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function HeroArt() {
  return (
    <div className="hero-art" aria-hidden="true">
      <div className="ha-glow" />
      <FirBranch />
      <div className="ha-phone">
        <div className="phone-mock xmas">
          <span className="pm-notch" />
          <div className="pm-head"><span>Advent</span><b>2026</b></div>
          <div className="pm-grid">
            {Array.from({ length: 12 }, (_, i) => {
              const open = i < 2, today = i === 2;
              return (
                <i key={i} className={`pm-gift t-${TYPES[i % 4]}${open ? ' open' : ''}${today ? ' today' : ''}`}>
                  {open ? <span className="pm-star">✦</span> : <Bow />}
                  <b>{i + 1}</b>
                </i>
              );
            })}
          </div>
          <div className="pm-foot">Dnes čeká okénko 3</div>
        </div>
        <SnowCap />
        <Garland />
      </div>
      <Gifts />
      <div className="gift-tag p1">Doprava zdarma nad 3 000 Kč</div>
      <div className="gift-tag p2 pink">Soutěž o poukaz 3 000 Kč</div>
      <div className="gift-tag p3">Až 10 % sleva</div>
    </div>
  );
}
