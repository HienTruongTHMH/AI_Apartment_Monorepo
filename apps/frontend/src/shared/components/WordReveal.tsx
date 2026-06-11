import { CSSProperties, useRef } from "react";
import { useInView } from "motion/react";

export function WordReveal({ text, className, style }: { text: string; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <span ref={ref} className={className} style={style}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="nv-word" style={{ marginRight: "0.25em" }}>
          <span className="nv-word-inner" style={{
            animationPlayState: inView ? "running" : "paused",
            animationDelay: `${i * 0.08}s`,
          }}>
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}
