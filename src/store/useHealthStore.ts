import { create } from 'zustand';
import type { ChatAttachment, ChatMessage, UserMetrics } from '../types/healthcare';
import { sendChatMessage } from '../services/api';
import { metricsSummary, uid } from '../lib/health';

/** Tiền tố của tin nhắn gửi chỉ số; mock API nhận diện theo cụm này. */
export const METRICS_PREFIX = 'Chỉ số của tôi:';

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text: 'Chào bạn, mình là dược sĩ AI của Greenway. Bạn đang thấy khó chịu ở đâu, hay muốn cải thiện điều gì? Cứ nhắn tự nhiên, gửi kèm ảnh cũng được.',
  suggestions: ['Tôi khó ngủ, hay tỉnh giữa đêm', 'Tôi muốn giảm mỡ bụng', 'Tôi hay đau mỏi vai gáy', 'Mỡ máu tôi hơi cao'],
};

interface HealthState {
  metrics: UserMetrics;
  messages: ChatMessage[];
  pending: boolean;
  /** Tăng mỗi lần có tin nhắn được gửi từ ngoài khung chat (hero, thẻ sản phẩm) để khung chat cuộn tới. */
  focusTick: number;

  /** Chỉ số đã gửi cho AI ở lượt gần nhất (dạng chuỗi tóm tắt), để biết có chỉ số mới chưa gửi. */
  sentMetrics: string;

  setMetric: <K extends keyof UserMetrics>(key: K, value: UserMetrics[K]) => void;
  clearMetrics: () => void;
  /** Gửi chỉ số hiện tại thành một tin nhắn để dược sĩ AI phân tích ngay. */
  sendMetrics: () => void;
  send: (text: string, attachments?: ChatAttachment[], opts?: { fromOutside?: boolean }) => Promise<void>;
  retry: () => void;
  finishStreaming: (id: string) => void;
  reset: () => void;
}

const EMPTY_METRICS: UserMetrics = { gender: null, age: null, heightCm: null, weightKg: null };

export const useHealthStore = create<HealthState>((set, get) => ({
  metrics: EMPTY_METRICS,
  messages: [WELCOME],
  pending: false,
  focusTick: 0,
  sentMetrics: '',

  setMetric: (key, value) => set((s) => ({ metrics: { ...s.metrics, [key]: value } })),
  clearMetrics: () => set({ metrics: EMPTY_METRICS }),
  sendMetrics: () => {
    const summary = metricsSummary(get().metrics);
    if (!summary) return;
    void get().send(`${METRICS_PREFIX} ${summary}.`);
  },

  send: async (raw, attachments = [], opts) => {
    const text = raw.trim();
    if ((!text && attachments.length === 0) || get().pending) return;

    const userMsg: ChatMessage = { id: uid(), role: 'user', text, attachments };
    const history = get()
      .messages.filter((m) => m.id !== 'welcome' && !m.error)
      .map(({ role, text: t, products }) => ({ role, text: t, products }));

    set((s) => ({
      messages: [...s.messages.map((m) => ({ ...m, suggestions: undefined })), userMsg],
      pending: true,
      focusTick: opts?.fromOutside ? s.focusTick + 1 : s.focusTick,
    }));

    try {
      const metrics = get().metrics;
      const reply = await sendChatMessage({ message: text, attachments, metrics, history });
      set((s) => ({
        pending: false,
        sentMetrics: metricsSummary(metrics),
        messages: [...s.messages, { id: uid(), role: 'assistant', streaming: true, ...reply }],
      }));
    } catch (err) {
      set((s) => ({
        pending: false,
        messages: [
          ...s.messages,
          {
            id: uid(),
            role: 'assistant',
            error: true,
            text: `Chưa gửi được tin nhắn${err instanceof Error ? ` (${err.message})` : ''}. Tin của bạn vẫn còn đây, bấm thử lại nhé.`,
          },
        ],
      }));
    }
  },

  retry: () => {
    const msgs = get().messages;
    const lastUser = [...msgs].reverse().find((m) => m.role === 'user');
    if (!lastUser) return;
    set({ messages: msgs.filter((m) => !m.error && m.id !== lastUser.id) });
    void get().send(lastUser.text, lastUser.attachments);
  },

  finishStreaming: (id) =>
    set((s) => ({ messages: s.messages.map((m) => (m.id === id ? { ...m, streaming: false } : m)) })),

  reset: () => {
    get().messages.forEach((m) => m.attachments?.forEach((a) => URL.revokeObjectURL(a.url)));
    set({ messages: [WELCOME], pending: false, sentMetrics: '' });
  },
}));
