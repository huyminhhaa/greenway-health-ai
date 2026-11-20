import type { BmiCategory, BmiCategoryKey, UserMetrics } from '../types/healthcare';
import { getT, localeOf } from '../i18n';

/** Giới hạn của từng chỉ số. Nhãn và đơn vị hiển thị nằm trong từ điển (t.profile.fields). */
export const METRIC_RANGES = {
  age: { min: 1, max: 120, step: 1, fallback: 30 },
  heightCm: { min: 50, max: 220, step: 1, fallback: 160 },
  weightKg: { min: 3, max: 200, step: 0.5, fallback: 55 },
} as const;

export type MetricKey = keyof typeof METRIC_RANGES;

export function calcBmi(heightCm: number, weightKg: number): number {
  const m = heightCm / 100;
  return Math.round((weightKg / (m * m)) * 10) / 10;
}

export function bmiFrom(metrics: UserMetrics): number | null {
  return metrics.heightCm && metrics.weightKg ? calcBmi(metrics.heightCm, metrics.weightKg) : null;
}

/** Ngưỡng WHO khu vực Tây Thái Bình Dương (WPRO) cho người châu Á: 18,5 / 23 / 25. Nhãn theo ngôn ngữ đang chọn. */
export function bmiCategory(bmi: number): BmiCategory {
  const key: BmiCategoryKey = bmi < 18.5 ? 'under' : bmi < 23 ? 'balanced' : bmi < 25 ? 'over' : 'obese';
  return { key, ...getT().bmi[key] };
}

/** BMI chỉ có ý nghĩa với người lớn; trẻ dưới 18 tuổi dùng biểu đồ tăng trưởng. */
export function bmiApplies(age: number | null): boolean {
  return age === null || age >= 18;
}

export const BMI_SCALE = { min: 14, max: 34 };
export function bmiToProgress(bmi: number): number {
  return Math.min(1, Math.max(0, (bmi - BMI_SCALE.min) / (BMI_SCALE.max - BMI_SCALE.min)));
}

/** 834000 → "834.000 ₫" (vi) hoặc "834,000 ₫" (en). */
export function formatVnd(amount: number): string {
  return `${new Intl.NumberFormat(localeOf()).format(amount)} ₫`;
}

export function formatNumber(n: number, digits = 1): string {
  return n.toLocaleString(localeOf(), { maximumFractionDigits: digits });
}

/** Bỏ dấu tiếng Việt để so khớp từ khóa. */
export function fold(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd');
}

/** "Nữ, 45 tuổi, 165 cm, 70 kg" / "Female, 45 yrs, 165 cm, 70 kg". Chuỗi rỗng khi chưa nhập gì. */
export function metricsSummary(m: UserMetrics): string {
  const t = getT().summary;
  const parts: string[] = [];
  if (m.gender) parts.push(m.gender === 'female' ? t.female : t.male);
  if (m.age !== null) parts.push(t.age(m.age));
  if (m.heightCm !== null) parts.push(`${formatNumber(m.heightCm)} cm`);
  if (m.weightKg !== null) parts.push(`${formatNumber(m.weightKg)} kg`);
  return parts.join(', ');
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export const uid = () => Math.random().toString(36).slice(2, 10);
