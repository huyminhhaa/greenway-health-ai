import { useEffect, useState } from 'react';
import { CircleCheck, Send } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { metricsKey, useHealthStore } from '../../store/useHealthStore';
import { useT } from '../../i18n';
import {
  BMI_SCALE,
  METRIC_RANGES,
  bmiApplies,
  bmiCategory,
  bmiFrom,
  bmiToProgress,
  clamp,
  formatNumber,
  type MetricKey,
} from '../../lib/health';
import type { Gender } from '../../types/healthcare';

const THRESHOLDS = [18.5, 23, 25];

/** Một chỉ số: ô nhập tay (có đơn vị) và thanh kéo, cùng một giá trị. */
function MetricField({ metric }: { metric: MetricKey }) {
  const value = useHealthStore((s) => s.metrics[metric]);
  const setMetric = useHealthStore((s) => s.setMetric);
  const t = useT();
  const { min, max, step, fallback } = METRIC_RANGES[metric];
  const { label, unit } = t.profile.fields[metric];
  const [draft, setDraft] = useState(value === null ? '' : formatNumber(value));
  const [error, setError] = useState<string | null>(null);
  const id = `metric-${metric}`;

  // Đồng bộ ô nhập khi giá trị đổi từ thanh kéo.
  useEffect(() => {
    setDraft(value === null ? '' : formatNumber(value));
  }, [value]);

  const commit = (raw: string) => {
    const trimmed = raw.trim();
    if (trimmed === '') {
      setError(null);
      setMetric(metric, null);
      return;
    }
    const n = Number(trimmed.replace(',', '.'));
    if (!Number.isFinite(n)) {
      setError(t.profile.errNumber(fallback));
      return;
    }
    if (n < min || n > max) {
      setError(t.profile.errRange(label, min, max, unit));
      setMetric(metric, clamp(n, min, max));
      return;
    }
    setError(null);
    setMetric(metric, Math.round(n / step) * step);
  };

  const shown = value ?? fallback;
  const fill = ((shown - min) / (max - min)) * 100;

  return (
    <div className={`metric${value === null ? ' is-empty' : ''}`}>
      <div className="metric__row">
        <label className="metric__label" htmlFor={id}>
          {label}
        </label>
        <div className="metric__field">
          <input
            id={id}
            name={metric}
            className="metric__input mono"
            inputMode="decimal"
            autoComplete="off"
            placeholder={t.profile.range(min, max)}
            value={draft}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={(e) => commit(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commit((e.target as HTMLInputElement).value);
            }}
          />
          <span className="metric__unit" aria-hidden="true">
            {unit}
          </span>
        </div>
      </div>
      <input
        type="range"
        className="range"
        min={min}
        max={max}
        step={step}
        value={shown}
        aria-label={t.profile.slider(label)}
        aria-valuetext={value === null ? t.profile.empty : `${formatNumber(value)} ${unit}`}
        onChange={(e) => {
          setError(null);
          setMetric(metric, Number(e.target.value));
        }}
        style={{ ['--fill' as string]: `${fill}%` }}
      />
      {error && (
        <p id={`${id}-error`} className="metric__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function GenderKeys() {
  const t = useT();
  const gender = useHealthStore((s) => s.metrics.gender);
  const setMetric = useHealthStore((s) => s.setMetric);
  const options: { value: Gender; label: string }[] = [
    { value: 'female', label: t.profile.female },
    { value: 'male', label: t.profile.male },
  ];
  return (
    <fieldset className="gender">
      <legend className="metric__label">{t.profile.gender}</legend>
      <div className="gender__keys">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            className="key"
            aria-pressed={gender === o.value}
            onClick={() => setMetric('gender', gender === o.value ? null : o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function BmiMeter() {
  const t = useT();
  const metrics = useHealthStore((s) => s.metrics);
  const bmi = bmiFrom(metrics);
  const span = BMI_SCALE.max - BMI_SCALE.min;

  if (!bmiApplies(metrics.age)) {
    return <p className="bmi__empty">{t.profile.bmiChild}</p>;
  }
  if (bmi === null) {
    return <p className="bmi__empty">{t.profile.bmiEmpty}</p>;
  }
  const cat = bmiCategory(bmi);

  return (
    <div className="bmi" data-cat={cat.key}>
      <div className="bmi__head" aria-live="polite">
        <p className="bmi__figure">
          <span className="visually-hidden">{t.profile.bmiSr}</span>
          {formatNumber(bmi)}
        </p>
        <p className="bmi__cat">
          <strong>{cat.label}</strong>
          <span>{cat.hint}</span>
        </p>
      </div>
      <div className="bmi__track" aria-hidden="true">
        <span className="bmi__seg" data-k="under" style={{ ['--from' as string]: 0, ['--to' as string]: (18.5 - BMI_SCALE.min) / span }} />
        <span className="bmi__seg" data-k="balanced" style={{ ['--from' as string]: (18.5 - BMI_SCALE.min) / span, ['--to' as string]: (23 - BMI_SCALE.min) / span }} />
        <span className="bmi__seg" data-k="over" style={{ ['--from' as string]: (23 - BMI_SCALE.min) / span, ['--to' as string]: (25 - BMI_SCALE.min) / span }} />
        <span className="bmi__seg" data-k="obese" style={{ ['--from' as string]: (25 - BMI_SCALE.min) / span, ['--to' as string]: 1 }} />
        <span className="bmi__pin" style={{ ['--x' as string]: bmiToProgress(bmi) }} />
      </div>
      <div className="bmi__ticks mono" aria-hidden="true">
        {THRESHOLDS.map((t) => (
          <span key={t} style={{ ['--x' as string]: (t - BMI_SCALE.min) / span }}>
            {formatNumber(t)}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Cho khách thấy rõ: AI đã nhận chỉ số chưa, và gửi ngay để phân tích. */
function ReceiptBar() {
  const t = useT();
  const metrics = useHealthStore((s) => s.metrics);
  const sent = useHealthStore((s) => s.sentMetrics);
  const pending = useHealthStore((s) => s.pending);
  const sendMetrics = useHealthStore((s) => s.sendMetrics);
  const key = metricsKey(metrics);

  if (!key) return null;
  const upToDate = key === sent;

  return (
    <div className={`receipt${upToDate ? ' is-sent' : ''}`} aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={upToDate ? 'sent' : 'new'}
          className="receipt__text"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          <CircleCheck size={18} aria-hidden="true" />
          {upToDate ? t.profile.receiptSent : t.profile.receiptNew}
        </motion.p>
      </AnimatePresence>
      {!upToDate && (
        <button type="button" className="btn btn--primary btn--sm" disabled={pending} onClick={sendMetrics}>
          <Send size={16} aria-hidden="true" />
          {t.profile.sendMetrics}
        </button>
      )}
    </div>
  );
}

export function ProfilePanel({ showNote = true }: { showNote?: boolean }) {
  const t = useT();
  const clearMetrics = useHealthStore((s) => s.clearMetrics);
  const hasAny = useHealthStore((s) => Object.values(s.metrics).some((v) => v !== null));

  return (
    <div className="profile">
      {showNote && <p className="profile__note">{t.profile.note}</p>}
      <GenderKeys />
      <MetricField metric="age" />
      <MetricField metric="heightCm" />
      <MetricField metric="weightKg" />
      <BmiMeter />
      <ReceiptBar />
      {hasAny && (
        <button type="button" className="text-btn profile__clear" onClick={clearMetrics}>
          {t.profile.clear}
        </button>
      )}
    </div>
  );
}
