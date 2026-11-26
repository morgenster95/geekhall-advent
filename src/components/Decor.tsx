import { useEffect, useRef } from 'react';

/** Oficiální logo Geek Hall z geekhall.cz. light = bílá varianta na tmavé pozadí. */
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={'logo' + (light ? ' light' : '')}>
      <img src={import.meta.env.BASE_URL + 'img/' + (light ? 'logo-white.png' : 'logo-black.svg')} alt="Geek Hall" />
    </span>
  );
}

/** Hrací kostky jako velká silueta v pozadí (motiv převzatý z úvodu geekhall.cz). */
export function DiceArt({ className = '' }: { className?: string }) {
  const pip = (x: number, y: number) => <circle key={x + '-' + y} cx={x} cy={y} r="5.5" className="pip" />;
  return (
    <svg className={'dice-art ' + className} viewBox="0 0 260 150" aria-hidden="true">
      <g transform="rotate(-14 70 80)"><rect x="10" y="30" width="100" height="100" rx="20" fill="currentColor" />{[[35, 55], [85, 55], [60, 80], [35, 105], [85, 105]].map(([x, y]) => pip(x, y))}</g>
      <g transform="rotate(18 190 70)"><rect x="140" y="20" width="90" height="90" rx="18" fill="currentColor" />{[[165, 45], [205, 45], [165, 85], [205, 85]].map(([x, y]) => pip(x, y))}</g>
    </svg>
  );
}

/** Jemné sněžení na plátně. */
export function Snow({ count = 55 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext('2d')!;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, raf = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const flakes = Array.from({ length: count }, () => ({ x: Math.random(), y: Math.random(), r: 0.7 + Math.random() * 2, s: 0.15 + Math.random() * 0.45, d: Math.random() * 6.28 }));
    const resize = () => { w = c.clientWidth; h = c.clientHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(c);
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(c);
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        if (!reduce) {
          f.y += f.s / h * 1.4;
          f.x += Math.sin(t / 2400 + f.d) * 0.00025;
          if (f.y > 1.02) { f.y = -0.02; f.x = Math.random(); }
        }
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255,255,255,.75)';
        ctx.arc(f.x * w, f.y * h, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [count]);
  return <canvas ref={ref} className="snow" aria-hidden="true" />;
}

/** Konfety při otevření okénka nebo splnění hry. */
export function Celebrate({ burst }: { burst: number }) {
  if (!burst) return null;
  const colors = ['#dc3545', '#35dccc', '#ffffff', '#ffb020', '#2ecc71'];
  return (
    <div className="celebrate" key={burst} aria-hidden="true">
      {Array.from({ length: 34 }, (_, i) => (
        <i key={i} style={{
          ['--x' as string]: `${(Math.cos(i * 2.4) * (120 + (i * 37) % 220)).toFixed(0)}px`,
          ['--y' as string]: `${(Math.sin(i * 2.4) * (90 + (i * 53) % 180) - 120).toFixed(0)}px`,
          ['--r' as string]: `${(i * 47) % 360}deg`,
          animationDelay: `${(i % 6) * 0.03}s`,
          background: colors[i % colors.length],
        }} />
      ))}
    </div>
  );
}

/** Světelný řetěz: žárovky na prověšeném drátku, které se střídavě rozsvěcují. */
export function Lights({ count = 16, className = '' }: { count?: number; className?: string }) {
  const colors = ['#dc3545', '#ffd166', '#35dccc', '#3ddc84'];
  return (
    <div className={'lights ' + className} aria-hidden="true" style={{ ['--n' as string]: count }}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="bulb"><i style={{ background: colors[i % 4], color: colors[i % 4], animationDelay: `${(i % 4) * 0.45}s` }} /></span>
      ))}
    </div>
  );
}

/** Závěj sněhu – vlnitý okraj sekce. */
export function Drift({ className = '' }: { className?: string }) {
  return (
    <svg className={'drift ' + className} viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 80V46c60-26 110-30 170-8 70 26 120 22 190-6 70-26 120-24 190 2 72 28 124 26 200-4 66-26 126-26 190 0 70 28 130 26 200-4 56-24 100-24 150-8 50 14 100 12 150-4v56Z" fill="currentColor" />
    </svg>
  );
}

/** Santova čepice (SVG) – nasazuje se na kostky a boostery. */
export function SantaHat({ className = '' }: { className?: string }) {
  return (
    <svg className={'santa-hat ' + className} viewBox="0 0 30 28" aria-hidden="true">
      <path d="M3 22Q5 6 20 3Q17 13 27 22Z" fill="#dc3545" />
      <path d="M12 8Q16 6 20 3Q18 9 21 14Q15 11 12 8Z" fill="#ff7b88" opacity=".6" />
      <rect x="1" y="20" width="28" height="7" rx="3.5" fill="#fff" />
      <circle cx="21" cy="4" r="3.6" fill="#fff" />
    </svg>
  );
}

/** Kostka s puntíky a Santovou čepicí – logo boosterů. */
export function DiceHat({ className = '' }: { className?: string }) {
  return (
    <svg className={'dice-hat ' + className} viewBox="0 0 64 64" aria-hidden="true">
      <g transform="rotate(8 32 38)">
        <rect x="10" y="16" width="44" height="44" rx="10" fill="#fff" />
        <g fill="#202124"><circle cx="21" cy="27" r="3.6" /><circle cx="43" cy="27" r="3.6" /><circle cx="32" cy="38" r="3.6" /><circle cx="21" cy="49" r="3.6" /><circle cx="43" cy="49" r="3.6" /></g>
      </g>
      <g transform="translate(5 -3) rotate(-18 16 14) scale(.95)">
        <path d="M3 22Q5 6 20 3Q17 13 27 22Z" fill="#dc3545" />
        <rect x="1" y="20" width="28" height="7" rx="3.5" fill="#fff" />
        <circle cx="21" cy="4" r="3.6" fill="#fff" />
      </g>
    </svg>
  );
}

/** d20 (dvacetistěnná kostka) s číslem 20. */
export function D20({ className = '' }: { className?: string }) {
  return (
    <svg className={'d20 ' + className} viewBox="0 0 100 100" aria-hidden="true">
      <defs><linearGradient id="d20g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#b46bff" /><stop offset="1" stopColor="#5a1fb8" /></linearGradient></defs>
      <polygon points="50,4 92,27 92,73 50,96 8,73 8,27" fill="url(#d20g)" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
      <polygon points="50,20 80,68 20,68" fill="rgba(255,255,255,.14)" stroke="#fff" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M50 4V20M92 27L80 68M8 27L20 68M92 73L80 68M8 73L20 68M50 96V68" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <text x="50" y="62" textAnchor="middle" fontSize="23" fontWeight="900" fill="#fff" fontFamily="Roboto Variable, Roboto, sans-serif">20</text>
    </svg>
  );
}

const TREE = ['......Y......', '.....YYY.....', '......G......', '.....GGG.....', '....GGRGG....', '.....GGG.....', '....GGGGG....', '...GBGGGYGG..', '..GGGGGGGGG..', '.....GGG.....', '....GGGGG....', '...GGPGGGRG..', '..GGGGGGGGGG.', '.GYGGGGGBGGGG', '......TT.....', '......TT.....'];
const TREE_COL: Record<string, string> = { G: '#2ecc71', R: '#dc3545', Y: '#ffd23f', B: '#35dccc', P: '#ff6fb5', T: '#8b5a2b' };
/** Pixelový (8bitový) vánoční stromek s blikajícími ozdobami. */
export function PixelTree({ className = '' }: { className?: string }) {
  return (
    <svg className={'pixel-tree ' + className} viewBox="0 0 13 16" shapeRendering="crispEdges" aria-hidden="true">
      {TREE.flatMap((row, y) => [...row].map((c, x) => (c === '.' ? null : <rect key={x + '-' + y} x={x} y={y} width="1.02" height="1.02" fill={TREE_COL[c]} className={'ptx' + (c === 'G' || c === 'T' ? '' : ' orn')} style={c === 'G' || c === 'T' ? undefined : { animationDelay: `${((x + y) % 5) * 0.35}s` }} />)))}
    </svg>
  );
}
