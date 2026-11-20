/**
 * Toàn bộ chữ trên giao diện, bản tiếng Việt (bản gốc).
 * Kiểu của object này là "khuôn" cho mọi ngôn ngữ khác (xem en.ts): thêm một dòng ở đây
 * mà chưa thêm bản dịch thì `npm run build` báo lỗi, không lọt ra giao diện được.
 * Câu có tham số viết dạng hàm, để tham số cũng được kiểm tra kiểu.
 */
import type { NeedId } from '../types/healthcare';

export const vi = {
  meta: {
    title: 'Dược sĩ AI Greenway',
    description:
      'Nhắn cho dược sĩ AI như nhắn tin bình thường, gửi kèm ảnh, nhận gợi ý sản phẩm Greenway kèm liều dùng và mua tại cửa hàng chính hãng.',
  },
  skip: 'Vào thẳng khung trò chuyện',
  lang: { label: 'Ngôn ngữ', vi: 'Tiếng Việt', en: 'English' },

  nav: { home: 'Greenway Global, về đầu trang', main: 'Chính', products: 'Sản phẩm', start: 'Bắt đầu hỏi' },

  hero: {
    titleA: 'Kể triệu chứng,',
    titleB: 'nhận phác đồ Greenway.',
    lead: 'Nhắn như với dược sĩ quen, không cần điền form trước.',
    askLabel: 'Bạn đang gặp vấn đề gì?',
    placeholder: 'Ví dụ: tôi hay mất ngủ và mỏi vai gáy',
    submit: 'Hỏi ngay',
    quickLabel: 'Hỏi nhanh',
    quick: [
      { label: 'Khó ngủ', text: 'Tôi khó ngủ, hay tỉnh giữa đêm' },
      { label: 'Mỡ bụng', text: 'Tôi muốn giảm mỡ bụng' },
      { label: 'Đau vai gáy', text: 'Tôi hay đau mỏi vai gáy, tê tay khi ngủ dậy' },
      { label: 'Mỡ máu cao', text: 'Mỡ máu tôi hơi cao' },
    ],
    sampleLabel: 'Ví dụ một dòng trong phác đồ',
    sampleDose: '2 viên',
    sampleStamp: 'sau ăn sáng',
    sampleWhen: 'mỗi ngày, sau bữa sáng',
    priceAt: 'Giá tại Greenway',
    pause: 'Dừng chuyển động',
    resume: 'Chạy tiếp',
  },

  chat: {
    title: 'Nói chuyện với dược sĩ AI',
    lead: 'Hỏi bao nhiêu lượt cũng được, gửi ảnh nếu cần. Chỉ số cơ thể chỉ thêm khi bạn muốn.',
    ready: 'Dược sĩ AI sẵn sàng',
    typing: 'Dược sĩ AI đang soạn trả lời',
    newChat: 'Trò chuyện mới',
    confirmReset: 'Bấm lại để xóa',
    log: 'Cuộc trò chuyện',
    who: 'Dược sĩ AI',
    retry: 'Thử lại',
    productsLabel: 'Sản phẩm gợi ý',
    suggestLabel: 'Gợi ý câu hỏi tiếp',
    sentImages: 'Ảnh đã gửi',
    dropHere: 'Thả ảnh vào đây để gửi kèm',
    bmiLine: (label: string) => `BMI, ${label.toLowerCase()}`,
    chipUsing: (summary: string) => `Dược sĩ AI đang dùng chỉ số: ${summary}. Bấm để sửa`,
    addMetrics: 'Thêm chỉ số cơ thể',
    welcome:
      'Chào bạn, mình là dược sĩ AI của Greenway. Bạn đang thấy khó chịu ở đâu, hay muốn cải thiện điều gì? Cứ nhắn tự nhiên, gửi kèm ảnh cũng được.',
    welcomeSuggestions: ['Tôi khó ngủ, hay tỉnh giữa đêm', 'Tôi muốn giảm mỡ bụng', 'Tôi hay đau mỏi vai gáy', 'Mỡ máu tôi hơi cao'],
    sendError: (detail: string) =>
      `Chưa gửi được tin nhắn${detail ? ` (${detail})` : ''}. Tin của bạn vẫn còn đây, bấm thử lại nhé.`,
  },

  composer: {
    filesLabel: 'Ảnh sẽ gửi',
    remove: (name: string) => `Bỏ ảnh ${name}`,
    attach: 'Gửi kèm ảnh',
    inputLabel: 'Tin nhắn cho dược sĩ AI',
    placeholder: 'Nhắn cho dược sĩ AI…',
    send: 'Gửi',
    keys: 'Enter để gửi, Shift + Enter để xuống dòng. ',
    limit: (n: number) => `Gửi kèm tối đa ${n} ảnh.`,
    notImage: 'chỉ nhận file ảnh',
    tooBig: (mb: number) => `ảnh tối đa ${mb} MB`,
    tooMany: (n: number) => `tối đa ${n} ảnh một lần`,
    skipped: (problems: string) => `Một số file chưa được thêm: ${problems}.`,
  },

  profile: {
    title: 'Chỉ số cơ thể',
    optional: 'không bắt buộc',
    note: 'Không bắt buộc. Điền vào thì dược sĩ AI tính BMI và tư vấn sát hơn.',
    gender: 'Giới tính',
    female: 'Nữ',
    male: 'Nam',
    clear: 'Xóa các chỉ số',
    fields: {
      age: { label: 'Tuổi', unit: 'tuổi' },
      heightCm: { label: 'Chiều cao', unit: 'cm' },
      weightKg: { label: 'Cân nặng', unit: 'kg' },
    },
    range: (min: number, max: number) => `${min} đến ${max}`,
    slider: (label: string) => `${label}, kéo để chọn`,
    empty: 'Chưa nhập',
    errNumber: (example: number) => `Nhập một con số, ví dụ ${example}.`,
    errRange: (label: string, min: number, max: number, unit: string) => `${label} từ ${min} đến ${max} ${unit}.`,
    bmiChild: 'BMI theo chuẩn người lớn không áp dụng cho trẻ dưới 18 tuổi.',
    bmiEmpty: 'Có chiều cao và cân nặng, BMI sẽ hiện ở đây.',
    bmiSr: 'Chỉ số BMI ',
    receiptNew: 'Dược sĩ AI sẽ dùng các chỉ số này từ câu trả lời tiếp theo.',
    receiptSent: 'Dược sĩ AI đã dùng các chỉ số này.',
    sendMetrics: 'Gửi chỉ số cho AI phân tích',
  },

  /** Phân loại BMI chuẩn châu Á (WPRO). */
  bmi: {
    under: { label: 'Thiếu cân', hint: 'Cơ thể cần thêm năng lượng và vi chất.' },
    balanced: { label: 'Cân đối', hint: 'Giữ nhịp ăn uống và vận động hiện tại.' },
    over: { label: 'Thừa cân nhẹ', hint: 'Mỡ bắt đầu tích quanh vòng eo.' },
    obese: { label: 'Béo phì', hint: 'Nên giảm cân có kiểm soát để bảo vệ tim mạch.' },
  },

  /** Tóm tắt chỉ số, dùng cho nhãn trên khung chat và tin nhắn gửi chỉ số. */
  summary: {
    female: 'Nữ',
    male: 'Nam',
    age: (n: number) => `${n} tuổi`,
    prefix: 'Chỉ số của tôi:',
  },

  product: {
    byPackage: 'Theo bao bì',
    readBox: 'đọc hướng dẫn trên hộp',
    doseSr: 'Liều dùng gợi ý: ',
    buy: 'Mua tại Greenway',
    opensShop: ' (mở trang cửa hàng)',
    ask: 'Hỏi dược sĩ AI',
    askMessage: (name: string) => `Tư vấn giúp tôi về ${name}`,
  },

  /** Đơn vị đóng gói; catalog ghép với số lượng thành "60 viên nang" / "60 capsules". */
  units: {
    capsule: 'viên nang',
    tablet: 'viên',
    sachet: 'gói',
    teabag: 'túi lọc',
  },

  needs: {
    sleep: 'Giấc ngủ, căng thẳng',
    heart: 'Tim mạch, mỡ máu',
    joint: 'Xương khớp',
    weight: 'Cân nặng',
    digest: 'Tiêu hóa, gan',
    beauty: 'Da, tóc, phái nữ',
    immune: 'Đề kháng',
    men: 'Nam giới',
  } satisfies Record<NeedId, string> as Record<NeedId, string>,

  shelf: {
    title: 'Sản phẩm Greenway theo nhu cầu',
    lead: 'Giá và ảnh lấy từ cửa hàng chính hãng. Bấm mua, trang Greenway mở ra.',
    chooseNeed: 'Chọn nhu cầu',
    prev: 'Xem sản phẩm trước',
    next: 'Xem sản phẩm tiếp',
    allShop: 'Xem toàn bộ cửa hàng Greenway',
  },

  faq: {
    title: 'Trước khi bạn hỏi',
    items: [
      {
        q: 'Có phải đăng ký hay điền form không?',
        a: 'Không. Mở trang là hỏi được ngay. Tuổi, chiều cao, cân nặng chỉ thêm khi bạn muốn tư vấn sát hơn.',
      },
      { q: 'Gửi ảnh gì thì có ích?', a: 'Ảnh kết quả xét nghiệm, vùng da đang gặp vấn đề, hoặc hộp thuốc bạn đang dùng.' },
      { q: 'Mua sản phẩm ở đâu?', a: 'Tại cửa hàng chính hãng của Greenway Global. Mỗi sản phẩm có nút mở thẳng trang mua.' },
      {
        q: 'Dược sĩ AI có thay được bác sĩ không?',
        a: 'Không. Đây là tư vấn tham khảo về thực phẩm bảo vệ sức khỏe, không thay chẩn đoán hay đơn thuốc.',
      },
    ],
  },

  footer: {
    sign: 'Chúc bạn ngủ ngon, ăn ngon và khỏe từ bên trong.',
    from: 'Dược sĩ AI của Greenway',
    chat: 'Trò chuyện',
    products: 'Sản phẩm',
    shop: 'Cửa hàng Greenway Global',
    legal:
      'Sản phẩm là thực phẩm bảo vệ sức khỏe, không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh. Tư vấn mang tính tham khảo.',
    credit: 'Logo, ảnh và giá sản phẩm: Greenway Global.',
  },

  /** Câu trả lời mẫu của mock AI (src/services/api.ts). Backend thật sẽ tự trả lời theo `language`. */
  ai: {
    honor: { female: 'chị', male: 'anh', none: 'bạn' },
    opening: (g: string) => `Chào ${g}, cảm ơn ${g} đã kể. Những gì ${g} gặp khá phổ biến và cải thiện được từ gốc.`,
    openingNext: (needs: string) => `Mình hiểu rồi, thêm phần ${needs} vào nhé.`,
    and: ' và ',
    tipPrefix: (tip: string) => `Trước khi dùng sản phẩm: ${tip}`,
    noMetrics: ' Nếu muốn mình tính cả BMI, điền chiều cao, cân nặng ở cột bên cạnh.',
    reasonFor: (need: string) => `Cho nhu cầu ${need}`,
    bmiFinding: (bmi: string, label: string, hint: string) => `BMI ${bmi}: ${label.toLowerCase()} theo chuẩn châu Á. ${hint}`,
    causes: {
      sleep: 'Ngủ chập chờn thường đi cùng hệ thần kinh bị kích thích lâu ngày; buổi tối cơ thể không “hạ nhiệt” kịp nên khó vào giấc.',
      heart: 'Mỡ máu và huyết áp phản ánh chuyển hóa chất béo: cholesterol xấu bám thành mạch làm lòng mạch hẹp lại, tim phải làm việc nhiều hơn.',
      joint: 'Mỏi vai gáy, đau khớp hay gặp khi ngồi lâu, sụn khớp hao mòn và thiếu canxi, vitamin D. Tê tay lúc ngủ dậy còn liên quan tới tuần hoàn ngoại vi.',
      weight: 'Mỡ bụng tích lại khi tinh bột nhanh vượt nhu cầu; insulin tăng liên tục khiến cơ thể ưu tiên dự trữ mỡ quanh nội tạng.',
      digest: 'Đầy hơi, trào ngược thường do ăn nhanh, ăn khuya, ít chất xơ, khiến dạ dày quá tải và hệ vi sinh đường ruột mất cân bằng.',
      beauty: 'Da xỉn, tóc rụng thường do thiếu chất chống oxy hóa và collagen giảm dần sau tuổi 25, cộng thêm nắng và căng thẳng.',
      immune: 'Hay ốm vặt là dấu hiệu sức đề kháng giảm: thiếu vitamin C, D, ngủ ít và căng thẳng kéo dài đều góp phần.',
      men: 'Sức khỏe nam giới sau tuổi 35 chịu ảnh hưởng của nội tiết, giấc ngủ và tuần hoàn; cần chăm sóc đều chứ không chỉ khi có triệu chứng.',
    } satisfies Record<NeedId, string> as Record<NeedId, string>,
    tips: {
      sleep: 'Tắt màn hình trước khi ngủ 45 phút, giữ phòng tối và mát.',
      heart: 'Giảm đồ chiên rán, ăn cá 2 đến 3 bữa mỗi tuần, đi bộ nhanh 30 phút mỗi ngày.',
      joint: 'Cứ 45 phút ngồi, đứng dậy xoay cổ và vai chậm 10 vòng mỗi chiều.',
      weight: 'Ăn rau trước, đạm sau, tinh bột cuối; dừng tinh bột sau 19 giờ.',
      digest: 'Nhai chậm, không nằm ngay trong 2 tiếng sau bữa tối.',
      beauty: 'Thoa kem chống nắng mỗi sáng, ngủ trước 23 giờ.',
      immune: 'Ngủ đủ 7 tiếng, uống đủ nước ấm, ăn thêm trái cây có múi.',
      men: 'Duy trì vận động sức bền 3 buổi mỗi tuần và hạn chế rượu bia.',
    } satisfies Record<NeedId, string> as Record<NeedId, string>,

    imagesOnly: (n: number) =>
      `Mình đã nhận ${n} ảnh. Bạn kể thêm một chút: ảnh chụp gì, và bạn đang thấy khó chịu ở đâu? Mình sẽ đối chiếu cùng lời bạn kể.`,
    imagesOnlySuggest: ['Đây là kết quả xét nghiệm máu', 'Ảnh vùng da bị mụn', 'Hộp thuốc tôi đang uống'],
    metricsBmi: (bmi: string) => `Mình đã nhận chỉ số. BMI của bạn là ${bmi}, mình đã tính vào phân tích bên dưới.`,
    metricsNoBmi: 'Mình đã nhận chỉ số. Thêm chiều cao và cân nặng thì mình tính được BMI cho bạn.',
    metricsMore: '\nVới chỉ số này, mình gợi ý thêm:',
    metricsSame: '\nCác sản phẩm mình gợi ý ở trên vẫn phù hợp.',
    metricsAskMore: '\nBạn kể thêm điều đang làm bạn khó chịu để mình chọn sản phẩm cho đúng nhé.',
    thanks: 'Không có gì. Bạn cứ quay lại hỏi tiếp khi dùng sản phẩm thấy chưa ổn, mình vẫn nhớ cuộc trò chuyện này.',
    thanksSuggest: ['Nhắc tôi lịch uống trong ngày', 'Tôi muốn hỏi vấn đề khác'],
    priceHead: 'Giá tại cửa hàng Greenway hôm nay:',
    priceLine: (name: string, price: string, pack: string) => `${name}: ${price} (${pack})`,
    priceTotal: (n: number, total: string) =>
      `Cả ${n} sản phẩm là ${total}. Nếu muốn bắt đầu nhẹ ví hơn, bạn chọn sản phẩm đầu tiên trước, đó là món thiết yếu nhất.`,
    priceSuggest: ['Nếu chỉ chọn một sản phẩm?', 'Uống thế nào trong ngày?'],
    doseHead: 'Lịch dùng gợi ý:',
    doseLine: (name: string, dose: string, timing: string) => `${name}: ${dose}, ${timing}.`,
    doseDefault: (name: string) => `${name}: theo hướng dẫn trên bao bì, thường sau bữa ăn.`,
    doseNote: 'Uống cách thuốc kê đơn ít nhất 2 tiếng nếu bạn đang dùng thuốc.',
    doseSuggest: ['Có tác dụng phụ không?', 'Bao lâu thì thấy hiệu quả?'],
    safety:
      'Đây là thực phẩm bảo vệ sức khỏe, thường an toàn khi dùng đúng liều. Nếu bạn đang mang thai, cho con bú, có bệnh nền hoặc đang dùng thuốc kê đơn, hãy hỏi bác sĩ điều trị trước khi dùng. Bạn có đang thuộc trường hợp nào ở trên không?',
    safetySuggest: ['Tôi đang uống thuốc huyết áp', 'Không, tôi khỏe mạnh'],
    duration:
      'Thường cần dùng đều 4 đến 8 tuần để cơ thể thay đổi rõ, kèm thói quen sinh hoạt mình đã gợi ý. Sau 2 tuần, bạn quay lại kể mình nghe thay đổi nhé.',
    durationSuggest: ['Uống thế nào trong ngày?', 'Tôi muốn hỏi vấn đề khác'],
    combo:
      'Có thể dùng kèm những sản phẩm cùng nhóm dưới đây. Bắt đầu với một món trước, sau 2 tuần thêm món thứ hai để biết cơ thể hợp với gì.',
    whereBuy:
      'Bạn bấm “Mua tại Greenway” trên từng sản phẩm, trang của cửa hàng chính hãng Greenway Global sẽ mở ra, có sẵn giá và giỏ hàng.',
    followSuggest: ['Giá bao nhiêu?', 'Uống thế nào trong ngày?'],
    named: (name: string, brand: string, needs: string, price: string, pack: string, dose: string) =>
      `${name} thuộc dòng ${brand}, dành cho nhu cầu ${needs}. Giá ${price} cho ${pack}, dùng ${dose}.\nĐể biết có hợp với bạn không, bạn kể mình nghe tình trạng hiện tại nhé.`,
    namedDoseDefault: 'theo hướng dẫn trên bao bì, thường sau bữa ăn',
    namedReason: 'Sản phẩm bạn hỏi',
    namedSuggest: ['Tôi có nên dùng không?', 'Có tác dụng phụ không?', 'Có sản phẩm nào đi kèm?'],
    askMoreImages:
      'Mình đã nhận ảnh. Bạn mô tả thêm triệu chứng hoặc điều bạn muốn cải thiện (ví dụ ngủ, cân nặng, khớp, tiêu hóa) để mình gợi ý sát hơn nhé.',
    askMore: 'Bạn kể cụ thể hơn một chút nhé: khó chịu ở đâu, bao lâu rồi, lúc nào nặng hơn? Ví dụ “tôi khó ngủ, hay tỉnh lúc 3 giờ sáng”.',
    defaultSuggest: ['Giá bao nhiêu?', 'Uống thế nào trong ngày?', 'Có tác dụng phụ không?'],
  },
};
