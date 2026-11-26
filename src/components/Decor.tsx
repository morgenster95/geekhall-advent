import { useEffect, useRef } from 'react';

/** Logotyp GEEKHALL (textový; výměnou za oficiální SVG logo ho lze nahradit). light = varianta na tmavé pozadí. */
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={'logo' + (light ? ' light' : '')} role="img" aria-label="Geekhall">
      <svg viewBox="0 0 330 56" aria-hidden="true">
        <text x="0" y="44" fontFamily="'Open Sans Variable','Open Sans',system-ui,sans-serif" fontWeight="800" fontSize="50" letterSpacing="1" fill="currentColor">GEEK<tspan fill="#7c3aed">HALL</tspan></text>
      </svg>
    </span>
  );
}

/** Pixelový „vetřelec“ jako velká silueta v pozadí patičky. */
export function BeaconA({ className = '' }: { className?: string }) {
  const rows = ['00100000100', '00010001000', '00111111100', '01101110110', '11111111111', '10111111101', '10100000101', '00011011000'];
  return (
    <svg className={'beacon-a ' + className} viewBox="0 0 11 8" aria-hidden="true">
      {rows.flatMap((r, y) => [...r].map((c, x) => (c === '1' ? <rect key={x + '-' + y} x={x} y={y} width="1" height="1" /> : null)))}
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
  const colors = ['#7c3aed', '#29b6f6', '#ffffff', '#ffb020', '#2ecc71'];
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
  const colors = ['#7c3aed', '#ffd166', '#22d3ee', '#3ddc84'];
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
