/**
 * Kiểu dữ liệu dùng chung giữa UI và API.
 * Phía API dùng snake_case (xem README.md), UI dùng camelCase; chuyển đổi nằm trong src/services/api.ts.
 */
import type { L10n, Lang } from '../i18n';

export type Gender = 'female' | 'male';

/** Chỉ số cơ thể, hoàn toàn không bắt buộc. `null` nghĩa là khách chưa nhập. */
export interface UserMetrics {
  gender: Gender | null;
  age: number | null; // 1 – 120
  heightCm: number | null; // 50 – 220
  weightKg: number | null; // 3 – 200
}

export type BmiCategoryKey = 'under' | 'balanced' | 'over' | 'obese';

export interface BmiCategory {
  key: BmiCategoryKey;
  label: string; // theo ngôn ngữ đang chọn
  hint: string;
}

/** Nhu cầu sức khỏe, dùng để lọc sản phẩm và để AI chọn gợi ý. */
export type NeedId = 'sleep' | 'heart' | 'joint' | 'weight' | 'digest' | 'beauty' | 'immune' | 'men';

/** Sản phẩm lấy từ cửa hàng Greenway Việt Nam (greenwayglobal.vn, giá VNĐ). */
export interface Product {
  code: string; // Mã sản phẩm của Greenway, dùng trong đường dẫn mua hàng
  brand: string; // Welllab, Balancer, TeaVitall
  brandPath: string; // Phần đường dẫn của thương hiệu trên cửa hàng
  name: string | L10n; // Tên ngắn để hiển thị; chuỗi thường khi là tên riêng giống nhau mọi ngôn ngữ
  catalogName: string; // Tên đầy đủ đúng như trên cửa hàng
  pack: L10n; // Quy cách, tạo bằng pack(60, 'capsule') trong catalog
  price: number; // VNĐ
  image: string;
  needs: NeedId[];
  /** Liều dùng gợi ý. `null` = dùng theo hướng dẫn trên bao bì. Backend thay bằng liều chính thức. */
  dosage: L10n | null;
  timing: L10n | null; // Thời điểm dùng: { vi: 'sau bữa sáng', en: 'after breakfast' }
}

export interface Recommendation {
  code: string;
  reason: string;
}

export interface Analysis {
  bmi: number | null;
  bmiLabel: string | null;
  findings: string[];
}

export interface ChatAttachment {
  id: string;
  name: string;
  url: string; // object URL để xem trước
  file?: File;
}

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  attachments?: ChatAttachment[];
  analysis?: Analysis;
  products?: Recommendation[];
  suggestions?: string[];
  /** Tin của AI đang được gõ dần ra màn hình. */
  streaming?: boolean;
  error?: boolean;
  /** Chi tiết lỗi kỹ thuật (nếu có); câu báo lỗi lấy từ từ điển theo ngôn ngữ đang chọn. */
  errorDetail?: string;
}

export interface ChatRequest {
  message: string;
  attachments: ChatAttachment[];
  metrics: UserMetrics;
  history: Pick<ChatMessage, 'role' | 'text' | 'products'>[];
  /** Ngôn ngữ khách đang dùng; AI trả lời bằng ngôn ngữ này. */
  lang: Lang;
}

export interface ChatReply {
  text: string;
  analysis?: Analysis;
  products?: Recommendation[];
  suggestions: string[];
}
