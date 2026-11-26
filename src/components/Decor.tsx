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
