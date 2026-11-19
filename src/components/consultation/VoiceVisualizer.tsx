import { useEffect, useRef } from 'react';

/**
 * Sóng âm hữu cơ dùng làm chỉ báo "đang soạn trả lời": các vạch co giãn bằng scaleY
 * trong requestAnimationFrame, không re-render React. Giảm chuyển động: vạch đứng yên.
 */
export function VoiceVisualizer({ bars = 14 }: { bars?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const els = Array.from(ref.current?.children ?? []) as HTMLElement[];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const n = els.length;
    const env = (x: number) => Math.sin(Math.PI * (0.1 + x * 0.8));
    if (reduce) {
      els.forEach((el, i) => (el.style.transform = `scaleY(${(0.25 + 0.4 * env(i / (n - 1))).toFixed(2)})`));
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      els.forEach((el, i) => {
        const x = i / (n - 1);
        const v = 0.18 + 0.7 * Math.abs(Math.sin(t * 5.2 + i * 0.9)) * (0.55 + 0.45 * Math.sin(t * 1.7 + x * 6));
        el.style.transform = `scaleY(${(v * env(x)).toFixed(3)})`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [bars]);

  return (
    <span ref={ref} className="wave keep-motion" aria-hidden="true">
      {Array.from({ length: bars }, (_, i) => (
        <span key={i} />
      ))}
    </span>
  );
}
