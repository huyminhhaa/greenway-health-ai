/**
 * Lớp API của Dược sĩ AI Greenway.
 *
 * HƯỚNG DẪN CHO BACKEND
 * ---------------------
 * Hiện mọi câu trả lời là mock (trễ 800ms). Để nối API thật:
 *   1. Đặt `VITE_API_BASE_URL` trong file .env (ví dụ http://localhost:8000).
 *   2. Endpoint: POST /api/v1/chat, request/response dạng snake_case như `ChatRequestDTO`/`ChatReplyDTO`.
 * Mua hàng không đi qua app này: mỗi sản phẩm mở thẳng trang của nó trên cửa hàng Greenway.
 */
import type { Analysis, ChatReply, ChatRequest, NeedId, Recommendation } from '../types/healthcare';
import { NEED_KEYWORDS, NEEDS, PRODUCTS, getProduct, productsFor } from '../data/greenwayCatalog';
import { bmiApplies, bmiCategory, bmiFrom, fold, formatNumber, formatVnd } from '../lib/health';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const USE_MOCK = !API_BASE_URL;
const MOCK_LATENCY_MS = 800;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/* ------------------------------------------------------------------ */
/* POST /api/v1/chat                                                   */
/* ------------------------------------------------------------------ */

interface ChatRequestDTO {
  message: string;
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
  if (!res.ok) throw new Error(`Máy chủ trả về lỗi ${res.status}`);
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
/* ------------------------------------------------------------------ */

const NEED_CAUSE: Record<NeedId, string> = {
  sleep: 'Ngủ chập chờn thường đi cùng hệ thần kinh bị kích thích lâu ngày; buổi tối cơ thể không “hạ nhiệt” kịp nên khó vào giấc.',
  heart: 'Mỡ máu và huyết áp phản ánh chuyển hóa chất béo: cholesterol xấu bám thành mạch làm lòng mạch hẹp lại, tim phải làm việc nhiều hơn.',
  joint: 'Mỏi vai gáy, đau khớp hay gặp khi ngồi lâu, sụn khớp hao mòn và thiếu canxi, vitamin D. Tê tay lúc ngủ dậy còn liên quan tới tuần hoàn ngoại vi.',
  weight: 'Mỡ bụng tích lại khi tinh bột nhanh vượt nhu cầu; insulin tăng liên tục khiến cơ thể ưu tiên dự trữ mỡ quanh nội tạng.',
  digest: 'Đầy hơi, trào ngược thường do ăn nhanh, ăn khuya, ít chất xơ, khiến dạ dày quá tải và hệ vi sinh đường ruột mất cân bằng.',
  beauty: 'Da xỉn, tóc rụng thường do thiếu chất chống oxy hóa và collagen giảm dần sau tuổi 25, cộng thêm nắng và căng thẳng.',
  immune: 'Hay ốm vặt là dấu hiệu sức đề kháng giảm: thiếu vitamin C, D, ngủ ít và căng thẳng kéo dài đều góp phần.',
  men: 'Sức khỏe nam giới sau tuổi 35 chịu ảnh hưởng của nội tiết, giấc ngủ và tuần hoàn; cần chăm sóc đều chứ không chỉ khi có triệu chứng.',
};

const NEED_TIP: Record<NeedId, string> = {
  sleep: 'Tắt màn hình trước khi ngủ 45 phút, giữ phòng tối và mát.',
  heart: 'Giảm đồ chiên rán, ăn cá 2 đến 3 bữa mỗi tuần, đi bộ nhanh 30 phút mỗi ngày.',
  joint: 'Cứ 45 phút ngồi, đứng dậy xoay cổ và vai chậm 10 vòng mỗi chiều.',
  weight: 'Ăn rau trước, đạm sau, tinh bột cuối; dừng tinh bột sau 19 giờ.',
  digest: 'Nhai chậm, không nằm ngay trong 2 tiếng sau bữa tối.',
  beauty: 'Thoa kem chống nắng mỗi sáng, ngủ trước 23 giờ.',
  immune: 'Ngủ đủ 7 tiếng, uống đủ nước ấm, ăn thêm trái cây có múi.',
  men: 'Duy trì vận động sức bền 3 buổi mỗi tuần và hạn chế rượu bia.',
};

const needLabel = (id: NeedId) => NEEDS.find((n) => n.id === id)?.label.toLowerCase() ?? id;

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

function pick(needs: NeedId[], exclude: Set<string> = new Set()): Recommendation[] {
  const out: Recommendation[] = [];
  for (const need of needs) {
    for (const p of productsFor(need)) {
      if (out.length >= 3) break;
      if (exclude.has(p.code) || out.some((o) => o.code === p.code)) continue;
      out.push({ code: p.code, reason: `Cho nhu cầu ${needLabel(need)}` });
      if (out.filter((o) => o.reason.endsWith(needLabel(need))).length >= 2) break;
    }
  }
  return out;
}

function analysisFor(req: ChatRequest, needs: NeedId[]): Analysis | undefined {
  const bmi = bmiApplies(req.metrics.age) ? bmiFrom(req.metrics) : null;
  const findings = needs.slice(0, 2).map((n) => NEED_CAUSE[n]);
  if (bmi === null && findings.length === 0) return undefined;
  const cat = bmi !== null ? bmiCategory(bmi) : null;
  if (cat) findings.unshift(`BMI ${formatNumber(bmi!)}: ${cat.label.toLowerCase()} theo chuẩn châu Á. ${cat.hint}`);
  return { bmi, bmiLabel: cat?.label ?? null, findings };
}

function mockReply(req: ChatRequest): ChatReply {
  const t = fold(req.message);
  const prev = lastProducts(req.history);
  const isFirstTurn = !req.history.some((h) => h.role === 'user');

  if (req.attachments.length && !req.message.trim()) {
    return {
      text: `Mình đã nhận ${req.attachments.length} ảnh. Bạn kể thêm một chút: ảnh chụp gì, và bạn đang thấy khó chịu ở đâu? Mình sẽ đối chiếu cùng lời bạn kể.`,
      suggestions: ['Đây là kết quả xét nghiệm máu', 'Ảnh vùng da bị mụn', 'Hộp thuốc tôi đang uống'],
    };
  }

  // Khách bấm "Gửi chỉ số cho AI": phân tích lại với chỉ số mới, dựa trên các vấn đề đã kể trước đó.
  if (t.startsWith('chi so cua toi')) {
    const earlier = req.history.filter((h) => h.role === 'user' && !fold(h.text).startsWith('chi so cua toi'));
    const needs = detectNeeds(earlier.map((h) => h.text).join(' '));
    const bmi = bmiApplies(req.metrics.age) ? bmiFrom(req.metrics) : null;
    if (bmi !== null && bmi >= 23 && !needs.includes('weight')) needs.push('weight');
    const analysis = analysisFor(req, needs);
    const products = needs.length ? pick(needs, new Set(prev.map((p) => p.code))) : [];
    const head = bmi !== null
      ? `Mình đã nhận chỉ số. BMI của bạn là ${formatNumber(bmi)}, mình đã tính vào phân tích bên dưới.`
      : 'Mình đã nhận chỉ số. Thêm chiều cao và cân nặng thì mình tính được BMI cho bạn.';
    const tail = needs.length
      ? products.length ? '\nVới chỉ số này, mình gợi ý thêm:' : '\nCác sản phẩm mình gợi ý ở trên vẫn phù hợp.'
      : '\nBạn kể thêm điều đang làm bạn khó chịu để mình chọn sản phẩm cho đúng nhé.';
    return {
      text: head + tail,
      analysis,
      products,
      suggestions: needs.length
        ? ['Uống thế nào trong ngày?', 'Giá bao nhiêu?']
        : ['Tôi khó ngủ, hay tỉnh giữa đêm', 'Tôi muốn giảm mỡ bụng', 'Tôi hay đau mỏi vai gáy'],
    };
  }

  if (/cam on|thank|ok roi|vay nhe/.test(t)) {
    return {
      text: 'Không có gì. Bạn cứ quay lại hỏi tiếp khi dùng sản phẩm thấy chưa ổn, mình vẫn nhớ cuộc trò chuyện này.',
      suggestions: ['Nhắc tôi lịch uống trong ngày', 'Tôi muốn hỏi vấn đề khác'],
    };
  }

  if (prev.length && /gia|bao nhieu|tien|re hon|dat qua/.test(t)) {
    const lines = prev.map((r) => {
      const p = getProduct(r.code)!;
      return `${p.name}: ${formatVnd(p.price)} (${p.pack})`;
    });
    const total = prev.reduce((s, r) => s + (getProduct(r.code)?.price ?? 0), 0);
    return {
      text: `Giá tại cửa hàng Greenway hôm nay:\n${lines.join('\n')}\nCả ${prev.length} sản phẩm là ${formatVnd(total)}. Nếu muốn bắt đầu nhẹ ví hơn, bạn chọn sản phẩm đầu tiên trước, đó là món thiết yếu nhất.`,
      suggestions: ['Nếu chỉ chọn một sản phẩm?', 'Uống thế nào trong ngày?'],
    };
  }

  if (prev.length && /uong|lieu|khi nao|may vien|cach dung|lich/.test(t)) {
    const lines = prev.map((r) => {
      const p = getProduct(r.code)!;
      return p.dosage ? `${p.name}: ${p.dosage}, ${p.timing}.` : `${p.name}: theo hướng dẫn trên bao bì, thường sau bữa ăn.`;
    });
    return {
      text: `Lịch dùng gợi ý:\n${lines.join('\n')}\nUống cách thuốc kê đơn ít nhất 2 tiếng nếu bạn đang dùng thuốc.`,
      suggestions: ['Có tác dụng phụ không?', 'Bao lâu thì thấy hiệu quả?'],
    };
  }

  if (/tac dung phu|an toan|bau|cho con bu|dang uong thuoc|benh nen/.test(t)) {
    return {
      text: 'Đây là thực phẩm bảo vệ sức khỏe, thường an toàn khi dùng đúng liều. Nếu bạn đang mang thai, cho con bú, có bệnh nền hoặc đang dùng thuốc kê đơn, hãy hỏi bác sĩ điều trị trước khi dùng. Bạn có đang thuộc trường hợp nào ở trên không?',
      suggestions: ['Tôi đang uống thuốc huyết áp', 'Không, tôi khỏe mạnh'],
    };
  }

  if (prev.length && /bao lau|hieu qua|khi nao thay/.test(t)) {
    return {
      text: 'Thường cần dùng đều 4 đến 8 tuần để cơ thể thay đổi rõ, kèm thói quen sinh hoạt mình đã gợi ý. Sau 2 tuần, bạn quay lại kể mình nghe thay đổi nhé.',
      suggestions: ['Uống thế nào trong ngày?', 'Tôi muốn hỏi vấn đề khác'],
    };
  }

  if (prev.length && /di kem|ket hop|dung cung|them san pham/.test(t)) {
    const needs = [...new Set(prev.flatMap((r) => getProduct(r.code)?.needs ?? []))];
    const products = pick(needs, new Set(prev.map((p) => p.code)));
    if (products.length) {
      return {
        text: 'Có thể dùng kèm những sản phẩm cùng nhóm dưới đây. Bắt đầu với một món trước, sau 2 tuần thêm món thứ hai để biết cơ thể hợp với gì.',
        products,
        suggestions: ['Giá bao nhiêu?', 'Uống thế nào trong ngày?'],
      };
    }
  }

  if (/mua o dau|dat hang|mua the nao|chinh hang/.test(t)) {
    return {
      text: 'Bạn bấm “Mua tại Greenway” trên từng sản phẩm, trang của cửa hàng chính hãng Greenway Global sẽ mở ra, có sẵn giá và giỏ hàng.',
      suggestions: ['Giá bao nhiêu?', 'Uống thế nào trong ngày?'],
    };
  }

  // Hỏi về một sản phẩm cụ thể (nút "Hỏi dược sĩ AI" trên thẻ sản phẩm gửi kèm tên)
  const named = PRODUCTS.find((p) => t.includes(fold(p.name)));
  if (named) {
    const dose = named.dosage ? `${named.dosage}, ${named.timing}` : 'theo hướng dẫn trên bao bì, thường sau bữa ăn';
    return {
      text: `${named.name} thuộc dòng ${named.brand}, dành cho nhu cầu ${named.needs.map(needLabel).join(', ')}. Giá ${formatVnd(named.price)} cho ${named.pack}, dùng ${dose}.\nĐể biết có hợp với bạn không, bạn kể mình nghe tình trạng hiện tại nhé.`,
      products: [{ code: named.code, reason: 'Sản phẩm bạn hỏi' }],
      suggestions: ['Tôi có nên dùng không?', 'Có tác dụng phụ không?', 'Có sản phẩm nào đi kèm?'],
    };
  }

  const needs = detectNeeds(req.message);
  const metricsNeed: NeedId[] = [];
  const bmi = bmiFrom(req.metrics);
  if (bmi !== null && bmi >= 23 && bmiApplies(req.metrics.age) && !needs.includes('weight')) metricsNeed.push('weight');
  const allNeeds = [...needs, ...metricsNeed];

  if (allNeeds.length === 0) {
    return {
      text: req.attachments.length
        ? 'Mình đã nhận ảnh. Bạn mô tả thêm triệu chứng hoặc điều bạn muốn cải thiện (ví dụ ngủ, cân nặng, khớp, tiêu hóa) để mình gợi ý sát hơn nhé.'
        : 'Bạn kể cụ thể hơn một chút nhé: khó chịu ở đâu, bao lâu rồi, lúc nào nặng hơn? Ví dụ “tôi khó ngủ, hay tỉnh lúc 3 giờ sáng”.',
      suggestions: ['Tôi khó ngủ, hay tỉnh giữa đêm', 'Tôi muốn giảm mỡ bụng', 'Tôi hay đau mỏi vai gáy'],
    };
  }

  const products = pick(allNeeds, new Set(prev.map((p) => p.code)));
  const analysis = analysisFor(req, allNeeds);
  const g = req.metrics.gender === 'female' ? 'chị' : req.metrics.gender === 'male' ? 'anh' : 'bạn';
  const opening = isFirstTurn
    ? `Chào ${g}, cảm ơn ${g} đã kể. Những gì ${g} gặp khá phổ biến và cải thiện được từ gốc.`
    : `Mình hiểu rồi, thêm phần ${allNeeds.map(needLabel).join(' và ')} vào nhé.`;
  const tip = `Trước khi dùng sản phẩm: ${NEED_TIP[allNeeds[0]]}`;
  const noMetrics = bmi === null && isFirstTurn ? ' Nếu muốn mình tính cả BMI, điền chiều cao, cân nặng ở cột bên cạnh.' : '';

  return {
    text: `${opening}\n${tip}${noMetrics}`,
    analysis,
    products,
    suggestions: ['Giá bao nhiêu?', 'Uống thế nào trong ngày?', 'Có tác dụng phụ không?'],
  };
}
