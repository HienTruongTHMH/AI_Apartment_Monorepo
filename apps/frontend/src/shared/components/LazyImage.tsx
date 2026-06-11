import { CSSProperties, useRef, useState, useEffect } from "react";

export function LazyImage({ src, alt, className, style }: { src: string; alt: string; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRevealed(true); obs.disconnect(); } },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="relative w-full h-full">
      {!loaded && <div className="absolute inset-0 nv-skeleton" />}
      <img src={revealed ? src : undefined} alt={alt} className={className}
        style={{ ...style, opacity: loaded ? 1 : 0, transition: "opacity 0.35s ease" }}
        onLoad={() => setLoaded(true)} />
    </div>
  );
}
