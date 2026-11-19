import type { BmiCategory, UserMetrics } from '../types/healthcare';

export const METRIC_RANGES = {
  age: { min: 1, max: 120, step: 1, unit: 'tuổi', label: 'Tuổi', fallback: 30 },
  heightCm: { min: 50, max: 220, step: 1, unit: 'cm', label: 'Chiều cao', fallback: 160 },
  weightKg: { min: 3, max: 200, step: 0.5, unit: 'kg', label: 'Cân nặng', fallback: 55 },
} as const;

export type MetricKey = keyof typeof METRIC_RANGES;

export function calcBmi(heightCm: number, weightKg: number): number {
  const m = heightCm / 100;
  return Math.round((weightKg / (m * m)) * 10) / 10;
}

export function bmiFrom(metrics: UserMetrics): number | null {
  return metrics.heightCm && metrics.weightKg ? calcBmi(metrics.heightCm, metrics.weightKg) : null;
}

/** Ngưỡng WHO khu vực Tây Thái Bình Dương (WPRO) cho người châu Á: 18,5 / 23 / 25. */
export function bmiCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return { key: 'under', label: 'Thiếu cân', hint: 'Cơ thể cần thêm năng lượng và vi chất.' };
  if (bmi < 23) return { key: 'balanced', label: 'Cân đối', hint: 'Giữ nhịp ăn uống và vận động hiện tại.' };
  if (bmi < 25) return { key: 'over', label: 'Thừa cân nhẹ', hint: 'Mỡ bắt đầu tích quanh vòng eo.' };
  return { key: 'obese', label: 'Béo phì', hint: 'Nên giảm cân có kiểm soát để bảo vệ tim mạch.' };
}

/** BMI chỉ có ý nghĩa với người lớn; trẻ dưới 18 tuổi dùng biểu đồ tăng trưởng. */
export function bmiApplies(age: number | null): boolean {
  return age === null || age >= 18;
}

export const BMI_SCALE = { min: 14, max: 34 };
export function bmiToProgress(bmi: number): number {
  return Math.min(1, Math.max(0, (bmi - BMI_SCALE.min) / (BMI_SCALE.max - BMI_SCALE.min)));
}

const vnd = new Intl.NumberFormat('vi-VN');
export function formatVnd(amount: number): string {
  return `${vnd.format(amount)} ₫`;
}

export function formatNumber(n: number, digits = 1): string {
  return n.toLocaleString('vi-VN', { maximumFractionDigits: digits });
}

/** Bỏ dấu tiếng Việt để so khớp từ khóa. */
export function fold(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd');
}

/** "Nữ, 45 tuổi, 165 cm, 70 kg". Trả về chuỗi rỗng khi chưa nhập gì. */
export function metricsSummary(m: UserMetrics): string {
  const parts: string[] = [];
  if (m.gender) parts.push(m.gender === 'female' ? 'Nữ' : 'Nam');
  if (m.age !== null) parts.push(`${m.age} tuổi`);
  if (m.heightCm !== null) parts.push(`${formatNumber(m.heightCm)} cm`);
  if (m.weightKg !== null) parts.push(`${formatNumber(m.weightKg)} kg`);
  return parts.join(', ');
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export const uid = () => Math.random().toString(36).slice(2, 10);
