import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUp, Pause, Play } from 'lucide-react';
import { useHealthStore } from '../../store/useHealthStore';
import { getProduct } from '../../data/greenwayCatalog';
import { formatVnd } from '../../lib/health';
import type { ProductScene } from './productScene';

const QUICK = ['Khó ngủ', 'Mỡ bụng', 'Đau vai gáy', 'Mỡ máu cao'];
const QUICK_TEXT: Record<string, string> = {
  'Khó ngủ': 'Tôi khó ngủ, hay tỉnh giữa đêm',
  'Mỡ bụng': 'Tôi muốn giảm mỡ bụng',
  'Đau vai gáy': 'Tôi hay đau mỏi vai gáy, tê tay khi ngủ dậy',
  'Mỡ máu cao': 'Mỡ máu tôi hơi cao',
};

const SAMPLE = getProduct('070707')!;

function goToChat() {
  const el = document.getElementById('tu-van');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

export function Hero() {
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
    const io = new IntersectionObserver(([e]) => {
      visibleRef.current = e.isIntersecting;
      sync();
    });
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
            Kể triệu chứng,
            <br />
            nhận phác đồ Greenway.
          </h1>
          <p className="lead hero__lead">Nhắn như với dược sĩ quen, không cần điền form trước.</p>

          <form className="hero__ask" onSubmit={onSubmit}>
            <label className="visually-hidden" htmlFor="hero-ask">
              Bạn đang gặp vấn đề gì?
            </label>
            <input
              id="hero-ask"
              name="message"
              className="input"
              autoComplete="off"
              enterKeyHint="send"
              placeholder="Ví dụ: tôi hay mất ngủ và mỏi vai gáy"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button type="submit" className="btn btn--primary">
              <ArrowUp size={18} aria-hidden="true" />
              Hỏi ngay
            </button>
          </form>

          <ul className="hero__quick" aria-label="Hỏi nhanh">
            {QUICK.map((q) => (
              <li key={q}>
                <button type="button" className="key" onClick={() => ask(QUICK_TEXT[q])}>
                  {q}
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
              alt={SAMPLE.name}
              width={560}
              height={560}
              fetchPriority="high"
            />
          )}

          <figure className="rx-label" aria-label="Ví dụ một dòng trong phác đồ">
            <figcaption className="rx-label__head">
              <span>{SAMPLE.name}</span>
              <span className="rx-label__pack">{SAMPLE.pack}</span>
            </figcaption>
            <div className="rx-label__row">
              <p className="rx-label__dose">2 viên</p>
              <p className="rx-stamp" aria-hidden="true">
                <span className="rx-stamp__time">08:00</span>
                <span>sau ăn sáng</span>
              </p>
            </div>
            <p className="rx-label__when">mỗi ngày, sau bữa sáng</p>
            <p className="rx-label__stub">
              <span>Giá tại Greenway</span>
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
              {paused ? 'Chạy tiếp' : 'Dừng chuyển động'}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
