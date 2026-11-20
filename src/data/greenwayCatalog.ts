import type { NeedId, Product } from '../types/healthcare';
import { getLang, type L10n, type Lang } from '../i18n';
import { vi } from '../i18n/vi';
import { en } from '../i18n/en';

/**
 * Danh mục lấy từ cửa hàng Greenway Việt Nam (API công khai của new.mygreenway.com,
 * thành phố Hà Nội, ngày 19/11/2026). Giá VNĐ và ảnh đúng như trên cửa hàng.
 *
 * Đa ngôn ngữ: tên riêng (Welllab Omega-3) để chuỗi thường; chữ cần dịch dùng { vi, en }.
 * Quy cách viết bằng pack(60, 'capsule') để tự ra "60 viên nang" / "60 capsules".
 *
 * `dosage`/`timing`: chỉ những dòng có trong brief dự án mới ghi liều cụ thể;
 * còn lại để `null` và giao diện hiện "theo hướng dẫn trên bao bì".
 * Backend nên thay bằng liều dùng chính thức của từng sản phẩm.
 */

const SHOP_BASE = 'https://greenwayglobal.vn/shop';
// TP Hồ Chí Minh: Greenway ưu tiên thành phố đã lưu hơn country; cần city_id để mở đúng danh mục Việt Nam.
const SHOP_CITY_ID = '2196478';

/** Đường dẫn mua tại cửa hàng chính hãng, đặt sẵn quốc gia Việt Nam và ngôn ngữ đang chọn. */
export function productUrl(p: Pick<Product, 'brandPath' | 'code'>, lang: Lang = getLang()): string {
  return `${SHOP_BASE}/brands/${p.brandPath}/${p.code}?country=VN&lang=${lang}&city_id=${SHOP_CITY_ID}`;
}

export const shopHome = (lang: Lang = getLang()) => `${SHOP_BASE}?country=VN&lang=${lang}&city_id=${SHOP_CITY_ID}`;

/** Thứ tự nhu cầu trên thanh chọn; tên hiển thị nằm trong từ điển (t.needs). */
export const NEEDS: NeedId[] = ['sleep', 'heart', 'joint', 'weight', 'digest', 'beauty', 'immune', 'men'];

type Unit = keyof typeof vi.units;
/** "60 viên nang" / "60 capsules", lấy đơn vị từ từ điển mọi ngôn ngữ. */
const pack = (count: number, unit: Unit): L10n => ({
  vi: `${count} ${vi.units[unit]}`,
  en: `${count} ${en.units[unit]}`,
});

const M = 'https://media.greenwaystart.com';

/** `image` ở đây là ảnh gốc 3000px trên server Greenway; giao diện dùng bản thu nhỏ (xem PRODUCTS bên dưới). */
const SOURCE_PRODUCTS: Product[] = [
  {
    code: '070707', brand: 'Welllab', brandPath: 'welllab',
    name: 'Welllab Omega-3', catalogName: 'TPCN chứa nồng độ cao omega-3 Welllab OMEGA-3, 60 viên nang',
    pack: pack(60, 'capsule'), price: 834_000, image: `${M}/welllab/07045/7045_Welllab_Omega-3_1.jpg`,
    needs: ['heart', 'joint', 'sleep'],
    dosage: { vi: '2 viên mỗi ngày', en: '2 capsules a day' },
    timing: { vi: 'sau bữa sáng', en: 'after breakfast' },
  },
  {
    code: '070703', brand: 'Welllab', brandPath: 'welllab',
    name: 'Welllab Cardio Complex', catalogName: 'TPCN bổ sung cho hệ tim mạch Welllab CARDIO COMPLEX, 60 viên',
    pack: pack(60, 'tablet'), price: 760_000, image: `${M}/welllab/070703/WELLLAB_CARDIO_COMPLEX_070703-1.jpg`,
    needs: ['heart'], dosage: null, timing: null,
  },
  {
    code: '070708', brand: 'Welllab', brandPath: 'welllab',
    name: 'Welllab Angiolux Forte', catalogName: 'TPCN với diosmin hỗ trợ bảo vệ mạch máu Welllab ANGIOLUX FORTE, 60 viên',
    pack: pack(60, 'tablet'), price: 711_000, image: `${M}/welllab/070708/Welllab_ANGIOLUX_FORTE_070708-1.jpg`,
    needs: ['heart'], dosage: null, timing: null,
  },
  {
    code: '070712', brand: 'Welllab', brandPath: 'welllab',
    name: 'Welllab Stressout Phyto', catalogName: 'TPCN cho hệ thần kinh Welllab STRESSOUT PHYTO, 60 viên nang',
    pack: pack(60, 'capsule'), price: 687_000, image: `${M}/welllab/070712/Welllab_STRESSOUT_PHYTO_070712-1.jpg`,
    needs: ['sleep'], dosage: null, timing: null,
  },
  {
    code: '070710', brand: 'Welllab', brandPath: 'welllab',
    name: 'Welllab Hondrolux Active', catalogName: 'TPCN để duy trì khớp Welllab HONDROLUX ACTIVE, 60 viên nang',
    pack: pack(60, 'capsule'), price: 785_000, image: `${M}/welllab/070710/Welllab_HONDROLUX_ACTIVE_070710-1.jpg`,
    needs: ['joint'], dosage: null, timing: null,
  },
  {
    code: '070724', brand: 'Welllab', brandPath: 'welllab',
    name: 'Welllab Calcium & Vitamin K2', catalogName: 'TPCN với canxi cho người lớn và trẻ em từ 3 tuổi Welllab Calcium & Vitamin K2, 60 viên',
    pack: pack(60, 'tablet'), price: 491_000, image: `${M}/welllab-revitall/07052/Welllab_Calcium_K2_7052_60_tablets_1.jpg`,
    needs: ['joint'], dosage: null, timing: null,
  },
  {
    code: '070762', brand: 'Welllab', brandPath: 'welllab',
    name: 'Welllab Vitamin D3 2000 IU', catalogName: 'Thực phẩm chức năng chứa vitamin D3 2000 IU Welllab VITAMIN D3 PLUS, 120 viên',
    pack: pack(120, 'tablet'), price: 495_000, image: `${M}/welllab/070762/D3_2000_IU_Welllab_VITAMIN_D3_PLUS_070762-1.jpg`,
    needs: ['joint', 'immune'], dosage: null, timing: null,
  },
  {
    code: '070701', brand: 'Welllab', brandPath: 'welllab',
    name: 'Welllab C-Complex Plus', catalogName: 'TPCN vitamin C Welllab C-COMPLEX PLUS, 60 viên',
    pack: pack(60, 'tablet'), price: 564_000, image: `${M}/welllab/070701/Welllab_C_COMPLEX_PLUS_070701-1.jpg`,
    needs: ['immune', 'beauty'],
    dosage: { vi: '1 viên mỗi ngày', en: '1 tablet a day' },
    timing: { vi: 'buổi sáng', en: 'in the morning' },
  },
  {
    code: '070702', brand: 'Welllab', brandPath: 'welllab',
    name: 'Welllab Antisor Active', catalogName: 'TPCN bảo vệ cơ thể chống oxy hóa Welllab ANTISOR ACTIVE, 60 viên nang',
    pack: pack(60, 'capsule'), price: 589_000, image: `${M}/welllab/070702/Welllab_ANTISOR_ACTIVE_070702-1.jpg`,
    needs: ['immune'], dosage: null, timing: null,
  },
  {
    code: '070709', brand: 'Welllab', brandPath: 'welllab',
    name: 'Welllab Broncholux Intensive', catalogName: 'TPCN hỗ trợ hệ hô hấp Welllab BRONCHOLUX INTENSIVE, 60 viên nang',
    pack: pack(60, 'capsule'), price: 589_000, image: `${M}/welllab/070709/Welllab_BRONCHOLUX_INTENSIVE_070709-1.jpg`,
    needs: ['immune'], dosage: null, timing: null,
  },
  {
    code: '070728', brand: 'Welllab', brandPath: 'welllab',
    name: 'Welllab Antisweet Control', catalogName: 'TPCN hỗ trợ chuyển hóa Carbohydrate Welllab ANTISWEET CONTROL, 60 viên',
    pack: pack(60, 'tablet'), price: 589_000, image: `${M}/welllab/070728/Welllab_ANTISWEET_CONTROL_070728-1.jpg`,
    needs: ['weight'], dosage: null, timing: null,
  },
  {
    code: '070716', brand: 'Welllab', brandPath: 'welllab',
    name: 'Welllab Goodliver Formula', catalogName: 'TPCN để duy trì gan Welllab GOODLIVER FORMULA, 60 viên nang',
    pack: pack(60, 'capsule'), price: 589_000, image: `${M}/welllab/070716/Welllab_GOODLIVER_FORMULA_070716-1.jpg`,
    needs: ['digest'], dosage: null, timing: null,
  },
  {
    code: '070723', brand: 'Welllab', brandPath: 'welllab',
    name: 'Welllab Primrose Beauty', catalogName: 'TPCN dành cho phụ nữ WELLLAB PRIMROSE BEAUTY, 60 viên',
    pack: pack(60, 'tablet'), price: 834_000, image: `${M}/welllab/07050/07050_1.jpg`,
    needs: ['beauty'], dosage: null, timing: null,
  },
  {
    code: '070722', brand: 'Welllab', brandPath: 'welllab',
    name: 'Welllab Estro Comfort', catalogName: 'TPCN duy trì sức khỏe nữ giới Welllab ESTRO COMFORT, 60 viên',
    pack: pack(60, 'tablet'), price: 687_000, image: `${M}/welllab-revitall/070722/Welllab_Estro_Comfort_070722_1.jpg`,
    needs: ['beauty'], dosage: null, timing: null,
  },
  {
    code: '070711', brand: 'Welllab', brandPath: 'welllab',
    name: 'Welllab Luxmen Active', catalogName: 'TPCN cho nam giới Welllab LUXMEN ACTIVE, 60 viên',
    pack: pack(60, 'tablet'), price: 687_000, image: `${M}/welllab/070711/Welllab_LUXMEN_ACTIVE_070711-1.jpg`,
    needs: ['men'], dosage: null, timing: null,
  },
  {
    code: '012648', brand: 'Balancer', brandPath: 'balancer',
    name: { vi: 'Balancer Slim vị chuối', en: 'Balancer Slim Banana' },
    catalogName: 'Cocktail BALANCER SLIM vị “Chuối”, 5 gói',
    pack: pack(5, 'sachet'), price: 330_000, image: `${M}/balancer/012648/BALANCER_SLIM_Banana_flavor_012648-1.jpg`,
    needs: ['weight'],
    dosage: { vi: '1 gói thay 1 bữa', en: '1 sachet as a meal' },
    timing: { vi: 'bữa sáng hoặc bữa phụ chiều', en: 'for breakfast or an afternoon snack' },
  },
  {
    code: '01224', brand: 'Balancer', brandPath: 'balancer',
    name: 'Balancer Drain Maxi', catalogName: 'Thức uống thanh lọc cơ thể BALANCER DRAIN MAXI vị “Anh đào – Bạc hà”, 10 gói',
    pack: pack(10, 'sachet'), price: 259_000, image: `${M}/balancer/01224/Concentrate_Balancer_Drain_Maxi_01224_cherry_mint_flavor_10_sticks_box_and_stick.jpg`,
    needs: ['weight'], dosage: null, timing: null,
  },
  {
    code: '01246', brand: 'Balancer', brandPath: 'balancer',
    name: 'Balancer Prebio Mix', catalogName: 'Thức uống bổ sung lợi khuẩn BALANCER PREBIO MIX, 10 gói',
    pack: pack(10, 'sachet'), price: 326_000, image: `${M}/balancer/01246/Balancer_Prebio_01246_1.jpg`,
    needs: ['digest'], dosage: null, timing: null,
  },
  {
    code: '012621', brand: 'Balancer', brandPath: 'balancer',
    name: { vi: 'Balancer Collagen vị nam việt quất', en: 'Balancer Collagen Cranberry' },
    catalogName: 'Thức uống Balancer Collagen vị “Nam việt quất – Mâm xôi Bắc cực”, 10 gói',
    pack: pack(10, 'sachet'), price: 403_000, image: `${M}/balancer/01225/BALANCER_COLLAGEN_Cranberry-Cloudberry_1225_pack_and_portion.jpg`,
    needs: ['beauty'], dosage: null, timing: null,
  },
  {
    code: '01232', brand: 'Balancer', brandPath: 'balancer',
    name: 'Balancer Hot Comfort', catalogName: 'Thức uống nóng tăng cường miễn dịch BALANCER HOT COMFORT vị "Mâm xôi - gừng", 10 gói dài',
    pack: pack(10, 'sachet'), price: 277_000, image: `${M}/balancer/01232/product_box.jpg`,
    needs: ['immune'], dosage: null, timing: null,
  },
  {
    code: '01598', brand: 'TeaVitall', brandPath: 'teavitall',
    name: 'TeaVitall Express Balance 9', catalogName: 'Trà túi lọc dưỡng tâm TeaVitall Express Balance 9, 30 gói.',
    pack: pack(30, 'teabag'), price: 158_000, image: `${M}/teavitall/01598EU/TeaVitall_Express_Balance_9_Soothing_Tea_Drink_30_tea_bags_1598_1.jpg`,
    needs: ['sleep'],
    dosage: { vi: '1 tách trà ấm', en: '1 cup of warm tea' },
    timing: { vi: 'trước khi ngủ 1 tiếng', en: '1 hour before bed' },
  },
  {
    code: '01595', brand: 'TeaVitall', brandPath: 'teavitall',
    name: 'TeaVitall Express Cardex 6', catalogName: 'Trà túi lọc TeaVitall Express Cardex tăng cường sức khỏe tim mạch 6, 30 gói.',
    pack: pack(30, 'teabag'), price: 158_000, image: `${M}/teavitall/01595EU/TeaVitall_Express_Cardex_6_CVS_Tea_Drink_30_tea_bags_1595_1.jpg`,
    needs: ['heart'],
    dosage: { vi: '1 tách trà ấm', en: '1 cup of warm tea' },
    timing: { vi: 'sau 16 giờ', en: 'after 4 pm' },
  },
  {
    code: '01532', brand: 'TeaVitall', brandPath: 'teavitall',
    name: 'TeaVitall Express Step 12', catalogName: 'Trà túi lọc TeaVitall Express Step bảo vệ khớp khỏe mạnh 12, 30 gói',
    pack: pack(30, 'teabag'), price: 158_000, image: `${M}/teavitall/01532/TeaVitall_Express_Step_12_Joint_Recovery_Tea_Drink_30_tea_bags_1532_1.jpg`,
    needs: ['joint'], dosage: null, timing: null,
  },
  {
    code: '01594', brand: 'TeaVitall', brandPath: 'teavitall',
    name: 'TeaVitall Express Banquet 5', catalogName: 'Trà túi lọc TeaVitall Express Banquet tăng cường hệ tiêu hóa 5, 30 gói.',
    pack: pack(30, 'teabag'), price: 158_000, image: `${M}/teavitall/01594/TeaVitall_Express_Banquet_5_Digestion_Tea_Drink_30_tea_bags_1594_1.jpg`,
    needs: ['digest'], dosage: null, timing: null,
  },
  {
    code: '01590', brand: 'TeaVitall', brandPath: 'teavitall',
    name: 'TeaVitall Express Fresh 1', catalogName: 'Trà túi lọc TeaVitall Express Fresh thanh lọc giải độc 1, hộp 30 gói',
    pack: pack(30, 'teabag'), price: 158_000, image: `${M}/teavitall/01590/TeaVitall_Express_Fresh_1_Cleansing_Tea_Drink_30_tea_bags_1590_1.jpg`,
    needs: ['weight', 'digest'], dosage: null, timing: null,
  },
  {
    code: '01591', brand: 'TeaVitall', brandPath: 'teavitall',
    name: 'TeaVitall Express Pretty 2', catalogName: 'Trà túi lọc TeaVitall Express Pretty hỗ trợ sức khỏe phái nữ 2, hộp 30 gói',
    pack: pack(30, 'teabag'), price: 158_000, image: `${M}/teavitall/01591/TeaVitall_Express_Pretty_2_Women_Health_Tea_Drink_30_tea_bags_1591_1.jpg`,
    needs: ['beauty'], dosage: null, timing: null,
  },
  {
    code: '01592', brand: 'TeaVitall', brandPath: 'teavitall',
    name: 'TeaVitall Express Premier 3', catalogName: 'Trà túi lọc TeaVitall Express Premier tăng cường sức khỏe nam giới 3, hộp 30 gói.',
    pack: pack(30, 'teabag'), price: 158_000, image: `${M}/teavitall/01592/TeaVitall_Express_Premier_3_Men_Health_Tea_Drink_30_tea_bags_1592_1.jpg`,
    needs: ['men'], dosage: null, timing: null,
  },
];

/**
 * Ảnh gốc của Greenway nặng 0,1 đến 6 MB mỗi ảnh (3000px), giải mã chậm làm giật khi đổi danh mục.
 * Giao diện dùng bản WebP 480px tạo sẵn trong public/products/thumbs (mỗi ảnh khoảng 10 đến 40 KB).
 * Thêm sản phẩm mới: tạo thumbs/<code>.webp tương ứng, ảnh gốc vẫn lưu ở `sourceImage`.
 */
export const PRODUCTS: (Product & { sourceImage: string })[] = SOURCE_PRODUCTS.map((p) => ({
  ...p,
  sourceImage: p.image,
  image: `/products/thumbs/${p.code}.webp`,
}));

const BY_CODE = new Map(PRODUCTS.map((p) => [p.code, p]));
export const getProduct = (code: string) => BY_CODE.get(code);
export const productsFor = (need: NeedId) => PRODUCTS.filter((p) => p.needs.includes(need));

/** Từ khóa (đã bỏ dấu, chữ thường) tiếng Việt và tiếng Anh dẫn tới từng nhu cầu; dùng cho mock AI. */
export const NEED_KEYWORDS: Record<NeedId, RegExp> = {
  sleep: /\bngu\b|mat ngu|kho ngu|thuc giac|stress|cang thang|lo au|dau dau|sleep|insomnia|anxi|headache|wake up at night/,
  heart: /tim mach|benh tim|nhip tim|hoi hop|mo mau|huyet ap|cholesterol|mach mau|tuan hoan|te tay|gian tinh mach|heart|blood pressure|circulation|numb|varicose/,
  joint: /khop|\bvai\b|vai gay|co gay|dau lung|dau goi|khop goi|xuong|canxi|joint|shoulder|\bneck\b|back pain|knee|bone|calcium/,
  weight: /giam can|mo bung|\bbeo\b|can nang|vong eo|an kieng|duong huyet|tieu duong|weight|belly|\bfat\b|waist|diet|blood sugar|diabet/,
  digest: /tieu hoa|day hoi|trao nguoc|da day|tao bon|\bgan\b|\bruot\b|o chua|digest|bloat|reflux|stomach|constipat|liver|\bgut\b/,
  beauty: /(^|\s)da(?! ?day)(\s|$)|\bmun\b|\bsam\b|\btoc\b|collagen|kinh nguyet|man kinh|phu nu|\bskin\b|acne|\bhair\b|menopaus|\bperiod\b|women/,
  immune: /de khang|cam cum|cam lanh|\bbi cam\b|\bho\b|dau hong|vitamin c|om vat|mien dich|viem mui|so mui|immun|\bcold\b|\bflu\b|cough|sore throat/,
  men: /nam gioi|sinh ly|tuyen tien liet|dan ong|\bmen\b|\bmale\b|prostate|libido/,
};
