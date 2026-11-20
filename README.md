# Greenway AI Health Concierge

Web app tư vấn sức khỏe bằng AI cho khách hàng Việt Nam: khách nhắn với "dược sĩ AI" như nhắn tin bình thường (gửi kèm ảnh được), nhận phân tích và gợi ý sản phẩm **Greenway Global** kèm liều dùng, rồi mua tại cửa hàng chính hãng của công ty mẹ ([new.mygreenway.com/shop](https://new.mygreenway.com/shop)).

## Phân chia vai trò
- **UI/UX & Frontend**: giao diện, hiệu ứng, mock state hoàn chỉnh (repo này).
- **Backend & AI**: `haminhhuy972@gmail.com`, nối API AI (LLM / RAG / đọc ảnh) theo hợp đồng bên dưới.

## Chạy thử

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # kiểm tra kiểu + build production
```

Không cần backend: mọi câu trả lời của AI đang là mock (trễ 800 ms) trong `src/services/api.ts`.

## Có gì trong giao diện
- **Hero 3D** (three.js): mô hình hộp, lọ Welllab, gói Balancer, hộp trà TeaVitall dựng từ ảnh bao bì thật (`public/products/3d`). Kéo để xoay 360°, có nút dừng chuyển động.
- **Chat trước, không form**: hỏi ngay từ hero; trò chuyện nhiều lượt, gửi ảnh (chọn, kéo thả, dán), AI trả lời kèm khối phân tích và thẻ sản phẩm (liều dùng, giá, nút "Mua tại Greenway").
- **Chỉ số cơ thể không bắt buộc**: tuổi 1–120, chiều cao, cân nặng, vừa kéo vừa nhập tay; BMI theo chuẩn châu Á (WPRO). Nhãn trên khung chat cho thấy AI đang dùng chỉ số nào; nút "Gửi chỉ số cho AI phân tích".
- **Sản phẩm theo nhu cầu**: 27 sản phẩm thật của Greenway Việt Nam (giá VNĐ, ảnh) trong `src/data/greenwayCatalog.ts`, mỗi sản phẩm mở thẳng trang mua.
- Thiết kế theo Hallmark (theme Dose), font có đủ dấu tiếng Việt, hiệu ứng trượt khi cuộn, tôn trọng chế độ giảm chuyển động.

## Đa ngôn ngữ (VI / EN)

Nút **VI / EN** trên thanh điều hướng; nhớ lựa chọn cho lần sau, hỗ trợ `?lang=en` trên đường dẫn, tự đổi `<html lang>`, tiêu đề trang, đường dẫn cửa hàng (`lang=`) và cách viết số tiền.

- **Chữ giao diện**: `src/i18n/vi.ts` là bản gốc, `src/i18n/en.ts` phải có đủ mọi key như bản gốc. Thêm một dòng vào `vi.ts` mà quên `en.ts` thì `npm run build` báo lỗi, nên không bao giờ sót bản dịch.
- **Trong component**: `const t = useT();` rồi dùng `t.hero.title`. Ngoài React: `getT()`.
- **Catalog**: tên riêng để chuỗi thường; chữ cần dịch dùng `{ vi, en }`; quy cách viết `pack(60, 'capsule')` để tự ra "60 viên nang" / "60 capsules".
- **Thêm ngôn ngữ mới** (ví dụ tiếng Nga): tạo `src/i18n/ru.ts` theo khuôn `vi.ts`, thêm `'ru'` vào `Lang`, `LANGS`, `DICTS` trong `src/i18n/index.ts`.
- Hệ thống không tự dịch máy: câu mới vẫn cần người viết bản tiếng Anh, nhưng TypeScript bảo đảm không thiếu câu nào.

## Cấu trúc

```
src/
  data/greenwayCatalog.ts      Danh mục sản phẩm, nhu cầu, đường dẫn mua
  services/api.ts              Lớp API: mock hiện tại + gọi API thật khi có VITE_API_BASE_URL
  store/useHealthStore.ts      State: chỉ số, tin nhắn, gửi tin
  components/hero/             Hero + cảnh 3D (productScene.ts)
  components/chat/             Khung chat, ô soạn tin
  components/consultation/     Bảng chỉ số cơ thể, sóng âm "đang soạn"
  components/ecommerce/        Thẻ sản phẩm, dải sản phẩm theo nhu cầu
  tokens.css, base.css, index.css
```

## API cho backend

Đặt `VITE_API_BASE_URL` trong `.env` (ví dụ `http://localhost:8000`) là giao diện chuyển từ mock sang gọi API thật, không cần sửa UI.

### `POST /api/v1/chat`

Request:

```json
{
  "message": "Tôi hay mất ngủ và mỏi vai gáy",
  "language": "vi",
  "images_base64": [],
  "profile": { "gender": "female", "age": 38, "height_cm": 158, "weight_kg": 62 },
  "history": [
    { "role": "user", "text": "…", "product_codes": [] },
    { "role": "assistant", "text": "…", "product_codes": ["070707"] }
  ]
}
```

- `language` là `"vi"` hoặc `"en"`: trả lời (`text`, `findings`, `reason`, `suggestions`) bằng đúng ngôn ngữ này.
- Mọi trường trong `profile` có thể là `null` (khách không bắt buộc nhập).
- Khi khách bấm "Gửi chỉ số cho AI phân tích", `message` bắt đầu bằng `Chỉ số của tôi:` (tiếng Anh: `My metrics:`).

Response:

```json
{
  "text": "Chào chị, …\nTrước khi dùng sản phẩm: …",
  "analysis": { "bmi": 24.8, "bmi_label": "Thừa cân nhẹ", "findings": ["…", "…"] },
  "products": [{ "code": "070707", "reason": "Cho nhu cầu tim mạch, mỡ máu" }],
  "suggestions": ["Giá bao nhiêu?", "Uống thế nào trong ngày?"]
}
```

- `analysis` có thể `null`; `products` là mã sản phẩm có trong `greenwayCatalog.ts` (mã lạ sẽ bị bỏ qua).
- Liều dùng hiển thị lấy từ `dosage`/`timing` trong catalog; sản phẩm chưa có liều chính thức hiện ghi "Theo bao bì", nên bổ sung từ dữ liệu Greenway.

Mua hàng không đi qua app này: thẻ sản phẩm mở `https://new.mygreenway.com/shop/<brand>/<code>?country=VN&lang=vi`.

## Ghi chú
- Logo, ảnh và giá sản phẩm thuộc Greenway Global.
- Sản phẩm là thực phẩm bảo vệ sức khỏe, không phải là thuốc; tư vấn mang tính tham khảo.
