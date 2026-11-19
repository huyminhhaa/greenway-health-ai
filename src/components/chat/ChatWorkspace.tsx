import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ImageDown, Plus, RotateCcw, SlidersHorizontal, UserRoundCheck } from 'lucide-react';
import { useHealthStore } from '../../store/useHealthStore';
import { getProduct } from '../../data/greenwayCatalog';
import type { ChatMessage } from '../../types/healthcare';
import { formatNumber, metricsSummary } from '../../lib/health';
import { ProductLabel } from '../ecommerce/ProductCard';
import { ProfilePanel } from '../consultation/MetricSliders';
import { VoiceVisualizer } from '../consultation/VoiceVisualizer';
import { Composer, type ComposerHandle } from './Composer';

const CHARS_PER_SECOND = 110;
const PAUSE: Record<string, number> = { '.': 8, ',': 3, ':': 4, '?': 8, '\n': 10 };

/** Gõ dần câu trả lời theo nhịp có ngắt ở dấu câu. */
function StreamText({ text, active, onDone, onTick }: { text: string; active: boolean; onDone: () => void; onTick: () => void }) {
  const [shown, setShown] = useState(active ? 0 : text.length);
  const done = useRef(onDone);
  const tick = useRef(onTick);
  done.current = onDone;
  tick.current = onTick;

  useEffect(() => {
    if (!active) {
      setShown(text.length);
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(text.length);
      done.current();
      return;
    }
    let raf = 0;
    let last = performance.now();
    let budget = 0;
    let i = 0;
    const step = (now: number) => {
      budget += ((now - last) / 1000) * CHARS_PER_SECOND;
      last = now;
      while (i < text.length && budget >= (PAUSE[text[i]] ?? 1)) {
        budget -= PAUSE[text[i]] ?? 1;
        i++;
      }
      setShown(i);
      tick.current();
      if (i >= text.length) return done.current();
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [text, active]);

  const visible = text.slice(0, shown);
  return (
    <>
      {/* Bản đầy đủ cho trình đọc màn hình; bản gõ dần chỉ để nhìn. */}
      <span className="visually-hidden">{text}</span>
      <span aria-hidden="true" className="msg__text">
        {visible.split('\n').map((line, i, arr) => (
          <span key={i} className="msg__line">
            {line}
            {i === arr.length - 1 && shown < text.length && <span className="caret" />}
          </span>
        ))}
      </span>
    </>
  );
}

function AssistantMessage({ msg, isLast, onTick }: { msg: ChatMessage; isLast: boolean; onTick: () => void }) {
  const finish = useHealthStore((s) => s.finishStreaming);
  const send = useHealthStore((s) => s.send);
  const retry = useHealthStore((s) => s.retry);
  const pending = useHealthStore((s) => s.pending);
  const settled = !msg.streaming;

  return (
    <div className={`msg msg--ai${msg.error ? ' is-error' : ''}`}>
      <img className="msg__avatar" src="/greenway-mark.svg" alt="" width={32} height={35} />
      <div className="msg__body">
        <p className="msg__who">Dược sĩ AI</p>
        <p className="msg__content">
          <StreamText text={msg.text} active={!!msg.streaming} onDone={() => finish(msg.id)} onTick={onTick} />
        </p>

        {msg.error && (
          <button type="button" className="btn btn--quiet msg__retry" onClick={retry}>
            <RotateCcw size={16} aria-hidden="true" />
            Thử lại
          </button>
        )}

        {settled && msg.analysis && (
          <motion.div
            className="analysis"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            {msg.analysis.bmi !== null && (
              <p className="analysis__bmi">
                <span className="analysis__figure mono">{formatNumber(msg.analysis.bmi)}</span>
                <span>BMI, {msg.analysis.bmiLabel?.toLowerCase()}</span>
              </p>
            )}
            <ul className="analysis__list">
              {msg.analysis.findings.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </motion.div>
        )}

        {settled && msg.products && msg.products.length > 0 && (
          <ul className="msg__products" aria-label="Sản phẩm gợi ý">
            {msg.products.map((r, i) => {
              const p = getProduct(r.code);
              if (!p) return null;
              return (
                <motion.li
                  key={r.code}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.08 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  onAnimationComplete={onTick}
                >
                  <ProductLabel product={p} reason={r.reason} />
                </motion.li>
              );
            })}
          </ul>
        )}

        {settled && isLast && msg.suggestions && msg.suggestions.length > 0 && (
          <ul className="msg__suggest" aria-label="Gợi ý câu hỏi tiếp">
            {msg.suggestions.map((s) => (
              <li key={s}>
                <button type="button" className="key" disabled={pending} onClick={() => void send(s)}>
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function UserMessage({ msg }: { msg: ChatMessage }) {
  return (
    <div className="msg msg--me">
      <div className="msg__bubble">
        {msg.attachments && msg.attachments.length > 0 && (
          <ul className="msg__images" aria-label="Ảnh đã gửi">
            {msg.attachments.map((a) => (
              <li key={a.id}>
                <img src={a.url} alt={a.name} width={160} height={160} />
              </li>
            ))}
          </ul>
        )}
        {msg.text && <p className="msg__content">{msg.text}</p>}
      </div>
    </div>
  );
}

function useIsWide() {
  const q = '(min-width: 60rem)';
  const [wide, setWide] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const m = window.matchMedia(q);
    const on = () => setWide(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return wide;
}

/** Nhãn trên đầu khung chat: AI đang dùng chỉ số nào. Đổi chỉ số là nhãn đổi theo ngay. */
function MetricsChip({ onOpen }: { onOpen: () => void }) {
  const metrics = useHealthStore((s) => s.metrics);
  const summary = metricsSummary(metrics);
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.button
        key={summary || 'empty'}
        type="button"
        className={`chip${summary ? ' is-set' : ''}`}
        onClick={onOpen}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        aria-label={summary ? `Dược sĩ AI đang dùng chỉ số: ${summary}. Bấm để sửa` : 'Thêm chỉ số cơ thể'}
      >
        {summary ? <UserRoundCheck size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
        <span className="chip__text">{summary || 'Thêm chỉ số cơ thể'}</span>
      </motion.button>
    </AnimatePresence>
  );
}

export function ChatWorkspace() {
  const messages = useHealthStore((s) => s.messages);
  const pending = useHealthStore((s) => s.pending);
  const reset = useHealthStore((s) => s.reset);
  const focusTick = useHealthStore((s) => s.focusTick);
  const listRef = useRef<HTMLDivElement>(null);
  const stick = useRef(true);
  const composer = useRef<ComposerHandle | null>(null);
  const [dragging, setDragging] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const wide = useIsWide();

  const toBottom = () => {
    const el = listRef.current;
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  };

  useLayoutEffect(() => {
    stick.current = true;
    toBottom();
  }, [messages.length, pending, focusTick]);

  const onScroll = () => {
    const el = listRef.current;
    if (!el) return;
    stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  // Lăn chuột trên khung chat thì cuộn cả trang (theo yêu cầu); lịch sử chat kéo bằng thanh cuộn bên cạnh,
  // bàn phím hoặc vuốt trên điện thoại. Giữ Ctrl để phóng to vẫn chạy như thường.
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      window.scrollBy({ top: e.deltaY * unit, behavior: 'instant' as ScrollBehavior });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  useEffect(() => {
    if (!confirmReset) return;
    const t = setTimeout(() => setConfirmReset(false), 4000);
    return () => clearTimeout(t);
  }, [confirmReset]);

  const lastAi = [...messages].reverse().find((m) => m.role === 'assistant');

  /** Mở cột chỉ số: điện thoại mở phần thu gọn, máy tính đưa con trỏ vào ô Tuổi. */
  const openProfile = () => {
    if (!wide) setProfileOpen(true);
    requestAnimationFrame(() => {
      const el = document.getElementById('metric-age');
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      el?.focus({ preventScroll: true });
    });
  };

  return (
    <section id="tu-van" className="consult" aria-labelledby="consult-title">
      <div className="container">
        <header className="consult__head" data-reveal>
          <h2 id="consult-title">Nói chuyện với dược sĩ AI</h2>
          <p className="lead">Hỏi bao nhiêu lượt cũng được, gửi ảnh nếu cần. Chỉ số cơ thể chỉ thêm khi bạn muốn.</p>
        </header>

        <div className="consult__grid">
          <div
            className={`tray${dragging ? ' is-dragging' : ''}`}
            data-reveal="rise"
            onDragOver={(e) => {
              if (Array.from(e.dataTransfer.types).includes('Files')) {
                e.preventDefault();
                setDragging(true);
              }
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              if (e.dataTransfer.files.length) composer.current?.addFiles(e.dataTransfer.files);
            }}
          >
            <div className="tray__bar">
              <p className="tray__status" role="status">
                <img src="/greenway-mark.svg" alt="" width={18} height={20} />
                <span className="tray__status-text">{pending ? 'Dược sĩ AI đang soạn trả lời' : 'Dược sĩ AI sẵn sàng'}</span>
              </p>
              <MetricsChip onOpen={openProfile} />
              <button
                type="button"
                className="text-btn tray__reset"
                onClick={() => {
                  if (confirmReset) {
                    reset();
                    setConfirmReset(false);
                  } else setConfirmReset(true);
                }}
              >
                <RotateCcw size={15} aria-hidden="true" />
                {confirmReset ? 'Bấm lại để xóa' : 'Trò chuyện mới'}
              </button>
            </div>

            <div
              className="thread"
              ref={listRef}
              onScroll={onScroll}
              role="log"
              aria-live="polite"
              aria-label="Cuộc trò chuyện"
              tabIndex={0}
            >
              {messages.map((m) =>
                m.role === 'user' ? (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: 'bottom right' }}
                  >
                    <UserMessage msg={m} />
                  </motion.div>
                ) : (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <AssistantMessage msg={m} isLast={m.id === lastAi?.id} onTick={toBottom} />
                  </motion.div>
                ),
              )}
              {pending && (
                <div className="msg msg--ai msg--typing">
                  <img className="msg__avatar" src="/greenway-mark.svg" alt="" width={32} height={35} />
                  <div className="msg__body">
                    <VoiceVisualizer />
                    <span className="visually-hidden">Dược sĩ AI đang soạn trả lời</span>
                  </div>
                </div>
              )}
            </div>

            <Composer register={(h) => (composer.current = h)} />

            {dragging && (
              <div className="tray__drop" aria-hidden="true">
                <ImageDown size={28} />
                Thả ảnh vào đây để gửi kèm
              </div>
            )}
          </div>

          <aside className="consult__side" aria-labelledby="profile-title" data-reveal style={{ ['--i' as string]: 2 }}>
            {wide ? (
              <>
                <h3 id="profile-title" className="side__title">
                  Chỉ số cơ thể
                </h3>
                <ProfilePanel />
              </>
            ) : (
              <details className="side__details" open={profileOpen} onToggle={(e) => setProfileOpen(e.currentTarget.open)}>
                <summary>
                  <SlidersHorizontal size={18} aria-hidden="true" />
                  <span id="profile-title">Chỉ số cơ thể</span>
                  <span className="side__optional">không bắt buộc</span>
                </summary>
                <ProfilePanel showNote={false} />
              </details>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
