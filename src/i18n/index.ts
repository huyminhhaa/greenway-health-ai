/**
 * Đa ngôn ngữ (VI / EN).
 *
 *  - Chữ giao diện: src/i18n/vi.ts (bản gốc) và en.ts (phải đủ key như bản gốc, thiếu là build lỗi).
 *  - Dữ liệu có chữ (catalog): dùng kiểu `L10n` = { vi, en } và hàm `loc()` để hiển thị.
 *  - Trong component: `const t = useT()` rồi `t.hero.title`; ngoài React: `getT()`.
 *  - Thêm ngôn ngữ mới: tạo xx.ts theo khuôn của vi.ts, thêm vào LANGS và DICTS.
 */
import { create } from 'zustand';
import { vi } from './vi';
import { en } from './en';

export type Lang = 'vi' | 'en';
export type Dict = typeof vi;
/** Chuỗi có đủ mọi ngôn ngữ; TypeScript bắt buộc điền đủ. */
export type L10n = Record<Lang, string>;

const DICTS: Record<Lang, Dict> = { vi, en };
export const LANGS: Lang[] = ['vi', 'en'];
const STORAGE_KEY = 'gw-lang';

function readStored(): Lang | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'vi' || v === 'en' ? v : null;
  } catch {
    return null;
  }
}

/** Ưu tiên: ?lang= trên URL, rồi lựa chọn đã lưu, rồi tiếng Việt (khách chính ở Việt Nam). */
function initialLang(): Lang {
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  if (fromUrl === 'vi' || fromUrl === 'en') return fromUrl;
  return readStored() ?? 'vi';
}

interface LangState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useLang = create<LangState>((set) => ({
  lang: initialLang(),
  setLang: (lang) => set({ lang }),
}));

export const getLang = () => useLang.getState().lang;
export const getT = (): Dict => DICTS[getLang()];
export const useT = (): Dict => DICTS[useLang((s) => s.lang)];

/** Hiển thị một chuỗi dữ liệu: chuỗi thường (tên riêng, giống nhau mọi ngôn ngữ) hoặc L10n. */
export function loc(value: string | L10n, lang: Lang = getLang()): string {
  return typeof value === 'string' ? value : value[lang];
}

/** Locale cho định dạng số và tiền. */
export const localeOf = (lang: Lang = getLang()) => (lang === 'vi' ? 'vi-VN' : 'en-US');

/** Đồng bộ <html lang>, tiêu đề, mô tả trang, URL và lựa chọn đã lưu mỗi khi đổi ngôn ngữ. */
function applyDocument(lang: Lang) {
  const t = DICTS[lang];
  document.documentElement.lang = lang;
  document.title = t.meta.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description);
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* chế độ riêng tư: bỏ qua */
  }
  const url = new URL(window.location.href);
  if (lang === 'vi') url.searchParams.delete('lang');
  else url.searchParams.set('lang', lang);
  window.history.replaceState(null, '', url);
}

applyDocument(getLang());
useLang.subscribe((s, prev) => {
  if (s.lang !== prev.lang) applyDocument(s.lang);
});
