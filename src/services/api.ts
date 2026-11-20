/**
 * Lớp API của Dược sĩ AI Greenway.
 *
 * HƯỚNG DẪN CHO BACKEND
 * ---------------------
 * Hiện mọi câu trả lời là mock (trễ 800ms). Để nối API thật:
 *   1. Đặt `VITE_API_BASE_URL` trong file .env (ví dụ http://localhost:8000).
 *   2. Endpoint: POST /api/v1/chat, request/response dạng snake_case như `ChatRequestDTO`/`ChatReplyDTO`.
 *   3. Trả lời bằng ngôn ngữ trong trường `language` ('vi' hoặc 'en').
 * Mua hàng không đi qua app này: mỗi sản phẩm mở thẳng trang của nó trên cửa hàng Greenway.
 */
import type { Analysis, ChatReply, ChatRequest, NeedId, Recommendation } from '../types/healthcare';
import { NEED_KEYWORDS, PRODUCTS, getProduct, productsFor } from '../data/greenwayCatalog';
import { bmiApplies, bmiCategory, bmiFrom, fold, formatNumber, formatVnd } from '../lib/health';
import { getT, loc, type Lang } from '../i18n';
import { vi } from '../i18n/vi';
import { en } from '../i18n/en';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const USE_MOCK = !API_BASE_URL;
const MOCK_LATENCY_MS = 800;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/* ------------------------------------------------------------------ */
/* POST /api/v1/chat                                                   */
/* ------------------------------------------------------------------ */

interface ChatRequestDTO {
  message: string;
  language: Lang;
  images_base64: string[];
  profile: { gender: 'female' | 'male' | null; age: number | null; height_cm: number | null; weight_kg: number | null };
  history: { role: 'user' | 'assistant'; text: string; product_codes: string[] }[];
}

interface ChatReplyDTO {
  text: string;
  analysis: { bmi: number | null; bmi_label: string | null; findings: string[] } | null;
  products: { code: string; reason: string }[];
  suggestions: string[];
}

async function fileToBase64(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  let binary = '';
  new Uint8Array(buf).forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

export async function sendChatMessage(req: ChatRequest): Promise<ChatReply> {
  if (USE_MOCK) {
    await wait(MOCK_LATENCY_MS);
    return mockReply(req);
  }
  const body: ChatRequestDTO = {
    message: req.message,
    language: req.lang,
    images_base64: await Promise.all(req.attachments.filter((a) => a.file).map((a) => fileToBase64(a.file!))),
    profile: {
      gender: req.metrics.gender,
      age: req.metrics.age,
      height_cm: req.metrics.heightCm,
      weight_kg: req.metrics.weightKg,
    },
    history: req.history.map((h) => ({ role: h.role, text: h.text, product_codes: (h.products ?? []).map((p) => p.code) })),
  };
  const res = await fetch(`${API_BASE_URL}/api/v1/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const d = (await res.json()) as ChatReplyDTO;
  return {
    text: d.text,
    analysis: d.analysis ? { bmi: d.analysis.bmi, bmiLabel: d.analysis.bmi_label, findings: d.analysis.findings } : undefined,
    products: d.products.filter((p) => getProduct(p.code)),
    suggestions: d.suggestions,
  };
}

/* ------------------------------------------------------------------ */
/* Mock: bộ luật đơn giản, đủ để demo hội thoại nhiều lượt             */
/* Chữ trả lời nằm trong từ điển (t.ai); từ khóa nhận diện cả VI và EN */
/* ------------------------------------------------------------------ */

/** Ý định của câu hỏi, so trên chuỗi đã bỏ dấu, chữ thường. */
const INTENT = {
  thanks: /cam on|thank|ok roi|vay nhe|great|got it/,
  price: /gia|bao nhieu|tien|re hon|dat qua|price|cost|how much|cheaper|expensive/,
  dose: /uong|lieu|khi nao|may vien|cach dung|lich|dose|dosage|how do i take|when should|schedule|how many/,
  safety: /tac dung phu|an toan|bau|cho con bu|dang uong thuoc|benh nen|side effect|safe|pregnan|breastfeed|medication|medicine/,
  duration: /bao lau|hieu qua|khi nao thay|how long|results|work\b/,
  combo: /di kem|ket hop|dung cung|them san pham|goes well|pair|combine|together/,
  whereBuy: /mua o dau|dat hang|mua the nao|chinh hang|where.*buy|order|purchase|official/,
};
/** Tin "gửi chỉ số" có tiền tố theo ngôn ngữ; nhận cả hai để đổi ngôn ngữ giữa chừng vẫn đúng. */
const METRIC_PREFIXES = [vi.summary.prefix, en.summary.prefix].map((p) => fold(p).replace(/:$/, ''));

function detectNeeds(text: string): NeedId[] {
  const t = ` ${fold(text)} `;
  return (Object.keys(NEED_KEYWORDS) as NeedId[]).filter((id) => NEED_KEYWORDS[id].test(t));
}

function lastProducts(history: ChatRequest['history']): Recommendation[] {
  for (let i = history.length - 1; i >= 0; i--) {
    const p = history[i].products;
    if (p && p.length) return p;
  }
  return [];
}

function mockReply(req: ChatRequest): ChatReply {
  const T = getT();
  const ai = T.ai;
  const needLabel = (id: NeedId) => T.needs[id].toLowerCase();
  const name = (code: string) => loc(getProduct(code)!.name);

  /** Tối đa 3 sản phẩm, mỗi nhu cầu tối đa 2. */
  const pick = (needs: NeedId[], exclude: Set<string> = new Set()): Recommendation[] => {
    const out: Recommendation[] = [];
    for (const need of needs) {
      let perNeed = 0;
      for (const p of productsFor(need)) {
        if (out.length >= 3 || perNeed >= 2) break;
        if (exclude.has(p.code) || out.some((o) => o.code === p.code)) continue;
        out.push({ code: p.code, reason: ai.reasonFor(needLabel(need)) });
        perNeed++;
      }
    }
    return out;
  };

  const analysisFor = (needs: NeedId[]): Analysis | undefined => {
    const bmi = bmiApplies(req.metrics.age) ? bmiFrom(req.metrics) : null;
    const findings = needs.slice(0, 2).map((n) => ai.causes[n]);
    if (bmi === null && findings.length === 0) return undefined;
    const cat = bmi !== null ? bmiCategory(bmi) : null;
    if (cat && bmi !== null) findings.unshift(ai.bmiFinding(formatNumber(bmi), cat.label, cat.hint));
    return { bmi, bmiLabel: cat?.label ?? null, findings };
  };

  const t = fold(req.message);
  const prev = lastProducts(req.history);
  const isFirstTurn = !req.history.some((h) => h.role === 'user');
  const isMetrics = (s: string) => METRIC_PREFIXES.some((p) => fold(s).startsWith(p));

  if (req.attachments.length && !req.message.trim()) {
    return { text: ai.imagesOnly(req.attachments.length), suggestions: ai.imagesOnlySuggest };
  }

  // Khách bấm "Gửi chỉ số cho AI": phân tích lại với chỉ số mới, dựa trên các vấn đề đã kể trước đó.
  if (isMetrics(req.message)) {
    const earlier = req.history.filter((h) => h.role === 'user' && !isMetrics(h.text));
    const needs = detectNeeds(earlier.map((h) => h.text).join(' '));
    const bmi = bmiApplies(req.metrics.age) ? bmiFrom(req.metrics) : null;
    if (bmi !== null && bmi >= 23 && !needs.includes('weight')) needs.push('weight');
    const products = needs.length ? pick(needs, new Set(prev.map((p) => p.code))) : [];
    const head = bmi !== null ? ai.metricsBmi(formatNumber(bmi)) : ai.metricsNoBmi;
    const tail = needs.length ? (products.length ? ai.metricsMore : ai.metricsSame) : ai.metricsAskMore;
    return {
      text: head + tail,
      analysis: analysisFor(needs),
      products,
      suggestions: needs.length ? ai.followSuggest : T.chat.welcomeSuggestions.slice(0, 3),
    };
  }

  if (INTENT.thanks.test(t)) return { text: ai.thanks, suggestions: ai.thanksSuggest };

  if (prev.length && INTENT.price.test(t)) {
    const lines = prev.map((r) => {
      const p = getProduct(r.code)!;
      return ai.priceLine(name(r.code), formatVnd(p.price), loc(p.pack));
    });
    const total = prev.reduce((s, r) => s + (getProduct(r.code)?.price ?? 0), 0);
    return {
      text: `${ai.priceHead}\n${lines.join('\n')}\n${ai.priceTotal(prev.length, formatVnd(total))}`,
      suggestions: ai.priceSuggest,
    };
  }

  if (prev.length && INTENT.dose.test(t)) {
    const lines = prev.map((r) => {
      const p = getProduct(r.code)!;
      return p.dosage && p.timing ? ai.doseLine(name(r.code), loc(p.dosage), loc(p.timing)) : ai.doseDefault(name(r.code));
    });
    return { text: `${ai.doseHead}\n${lines.join('\n')}\n${ai.doseNote}`, suggestions: ai.doseSuggest };
  }

  if (INTENT.safety.test(t)) return { text: ai.safety, suggestions: ai.safetySuggest };

  if (prev.length && INTENT.duration.test(t)) return { text: ai.duration, suggestions: ai.durationSuggest };

  if (prev.length && INTENT.combo.test(t)) {
    const needs = [...new Set(prev.flatMap((r) => getProduct(r.code)?.needs ?? []))];
    const products = pick(needs, new Set(prev.map((p) => p.code)));
    if (products.length) return { text: ai.combo, products, suggestions: ai.followSuggest };
  }

  if (INTENT.whereBuy.test(t)) return { text: ai.whereBuy, suggestions: ai.followSuggest };

  // Hỏi về một sản phẩm cụ thể (nút "Hỏi dược sĩ AI" trên thẻ sản phẩm gửi kèm tên, ở ngôn ngữ nào cũng nhận)
  const named = PRODUCTS.find((p) => [loc(p.name, 'vi'), loc(p.name, 'en')].some((n) => t.includes(fold(n))));
  if (named) {
    const dose = named.dosage && named.timing ? `${loc(named.dosage)}, ${loc(named.timing)}` : ai.namedDoseDefault;
    return {
      text: ai.named(loc(named.name), named.brand, named.needs.map(needLabel).join(', '), formatVnd(named.price), loc(named.pack), dose),
      products: [{ code: named.code, reason: ai.namedReason }],
      suggestions: ai.namedSuggest,
    };
  }

  const needs = detectNeeds(req.message);
  const bmi = bmiFrom(req.metrics);
  if (bmi !== null && bmi >= 23 && bmiApplies(req.metrics.age) && !needs.includes('weight')) needs.push('weight');

  if (needs.length === 0) {
    return {
      text: req.attachments.length ? ai.askMoreImages : ai.askMore,
      suggestions: T.chat.welcomeSuggestions.slice(0, 3),
    };
  }

  const g = ai.honor[req.metrics.gender ?? 'none'];
  const opening = isFirstTurn ? ai.opening(g) : ai.openingNext(needs.map(needLabel).join(ai.and));
  const noMetrics = bmi === null && isFirstTurn ? ai.noMetrics : '';

  return {
    text: `${opening}\n${ai.tipPrefix(ai.tips[needs[0]])}${noMetrics}`,
    analysis: analysisFor(needs),
    products: pick(needs, new Set(prev.map((p) => p.code))),
    suggestions: ai.defaultSuggest,
  };
}
