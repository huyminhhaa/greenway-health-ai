import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUp, Pause, Play } from 'lucide-react';
import { useHealthStore } from '../../store/useHealthStore';
import { getProduct } from '../../data/greenwayCatalog';
import { formatVnd } from '../../lib/health';
import { loc, useT } from '../../i18n';
import type { ProductScene } from './productScene';

const SAMPLE = getProduct('070707')!;

function goToChat() {
  const el = document.getElementById('tu-van');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

export function Hero() {
  const t = useT();
  const send = useHealthStore((s) => s.send);
  const [text, setText] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ProductScene | null>(null);
  const [webgl, setWebgl] = useState<'loading' | 'ok' | 'none'>('loading');
  const [paused, setPaused] = useState(false);
  const visibleRef = useRef(true);
  const pausedRef = useRef(false);
  pausedRef.current = paused;

  // Tải three.js sau khi chữ đã hiện, để hero không chờ 3D.
  useEffect(() => {
    let disposed = false;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    import('./productScene').then(({ mountProductScene }) => {
      if (disposed || !canvasRef.current) return;
      const scene = mountProductScene(canvasRef.current, { reducedMotion });
      if (!scene) {
        setWebgl('none');
        return;
      }
      sceneRef.current = scene;
      setWebgl('ok');
      scene.setPlaying(visibleRef.current && !pausedRef.current && !document.hidden);
    });
    return () => {
      disposed = true;
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  // Dừng khi ra khỏi màn hình hoặc tab ẩn.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const sync = () => sceneRef.current?.setPlaying(visibleRef.current && !pausedRef.current && !document.hidden);
    // Dừng vẽ 3D khi cảnh chỉ còn dưới 30% trong màn hình, để không tranh GPU với việc cuộn xuống phần chat.
    const io = new IntersectionObserver(
      ([e]) => {
        visibleRef.current = e.isIntersecting && e.intersectionRatio >= 0.3;
        sync();
      },
      { threshold: [0, 0.3, 0.6, 1] },
    );
    io.observe(stage);
    document.addEventListener('visibilitychange', sync);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.setPlaying(visibleRef.current && !paused && !document.hidden);
  }, [paused]);

  const ask = (value: string) => {
    if (!value.trim()) return;
    void send(value, [], { fromOutside: true });
    setText('');
    goToChat();
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(text);
  };

  return (
    <section className={`hero${paused ? ' is-paused' : ''}`} aria-labelledby="hero-title">
      <div className="hero__light" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="container hero__grid">
        <div className="hero__copy">
          <h1 id="hero-title">
            {t.hero.titleA}
            <br />
            {t.hero.titleB}
          </h1>
          <p className="lead hero__lead">{t.hero.lead}</p>

          <form className="hero__ask" onSubmit={onSubmit}>
            <label className="visually-hidden" htmlFor="hero-ask">
              {t.hero.askLabel}
            </label>
            <input
              id="hero-ask"
              name="message"
              className="input"
              autoComplete="off"
              enterKeyHint="send"
              placeholder={t.hero.placeholder}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button type="submit" className="btn btn--primary">
              <ArrowUp size={18} aria-hidden="true" />
              {t.hero.submit}
            </button>
          </form>

          <ul className="hero__quick" aria-label={t.hero.quickLabel}>
            {t.hero.quick.map((q) => (
              <li key={q.label}>
                <button type="button" className="key" onClick={() => ask(q.text)}>
                  {q.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="hero__stage" ref={stageRef}>
          <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" data-state={webgl} />
          {webgl === 'none' && (
            <img
              className="hero__fallback"
              src="/products/070707.webp"
              alt={loc(SAMPLE.name)}
              width={560}
              height={560}
              fetchPriority="high"
            />
          )}

          <figure className="rx-label" aria-label={t.hero.sampleLabel}>
            <figcaption className="rx-label__head">
              <span>{loc(SAMPLE.name)}</span>
              <span className="rx-label__pack">{loc(SAMPLE.pack)}</span>
            </figcaption>
            <div className="rx-label__row">
              <p className="rx-label__dose">{t.hero.sampleDose}</p>
              <p className="rx-stamp" aria-hidden="true">
                <span className="rx-stamp__time">08:00</span>
                <span>{t.hero.sampleStamp}</span>
              </p>
            </div>
            <p className="rx-label__when">{t.hero.sampleWhen}</p>
            <p className="rx-label__stub">
              <span>{t.hero.priceAt}</span>
              <span className="mono">{formatVnd(SAMPLE.price)}</span>
            </p>
          </figure>

          {webgl === 'ok' && (
            <button
              type="button"
              className="hero__pause"
              onClick={() => setPaused((p) => !p)}
              aria-pressed={paused}
            >
              {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
              {paused ? t.hero.resume : t.hero.pause}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
