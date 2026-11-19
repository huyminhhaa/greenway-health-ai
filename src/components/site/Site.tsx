import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { SHOP_HOME } from '../../data/greenwayCatalog';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 8));
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => {
      window.removeEventListener('scroll', on);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container nav__inner">
        <a href="#top" className="nav__logo" aria-label="Greenway Global, về đầu trang">
          <img src="/greenway-wordmark.svg" alt="" width={124} height={30} className="nav__word" />
        </a>
        <nav aria-label="Chính" className="nav__links">
          <a href="#san-pham" className="nav__link">
            Sản phẩm
          </a>
          <a href="#tu-van" className="btn btn--clear nav__cta">
            Bắt đầu hỏi
          </a>
        </nav>
      </div>
    </header>
  );
}

const FAQ = [
  {
    q: 'Có phải đăng ký hay điền form không?',
    a: 'Không. Mở trang là hỏi được ngay. Tuổi, chiều cao, cân nặng chỉ thêm khi bạn muốn tư vấn sát hơn.',
  },
  {
    q: 'Gửi ảnh gì thì có ích?',
    a: 'Ảnh kết quả xét nghiệm, vùng da đang gặp vấn đề, hoặc hộp thuốc bạn đang dùng.',
  },
  {
    q: 'Mua sản phẩm ở đâu?',
    a: 'Tại cửa hàng chính hãng của Greenway Global. Mỗi sản phẩm có nút mở thẳng trang mua.',
  },
  {
    q: 'Dược sĩ AI có thay được bác sĩ không?',
    a: 'Không. Đây là tư vấn tham khảo về thực phẩm bảo vệ sức khỏe, không thay chẩn đoán hay đơn thuốc.',
  },
];

export function Faq() {
  return (
    <section className="faq" aria-labelledby="faq-title">
      <div className="container faq__grid">
        <h2 id="faq-title" data-reveal>Trước khi bạn hỏi</h2>
        <dl className="faq__rows">
          {FAQ.map((f, i) => (
            <div key={f.q} className="faq__row" data-reveal style={{ ['--i' as string]: i + 1 }}>
              <dt>{f.q}</dt>
              <dd>{f.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__letter" data-reveal>
          <p className="footer__sign">Chúc bạn ngủ ngon, ăn ngon và khỏe từ bên trong.</p>
          <p className="footer__from">Dược sĩ AI của Greenway</p>
        </div>
        <div className="footer__side" data-reveal style={{ ['--i' as string]: 2 }}>
          <ul className="footer__links">
            <li>
              <a href="#tu-van">Trò chuyện</a>
            </li>
            <li>
              <a href="#san-pham">Sản phẩm</a>
            </li>
            <li>
              <a href={SHOP_HOME} target="_blank" rel="noopener noreferrer" className="footer__ext">
                Cửa hàng Greenway Global
                <ExternalLink size={15} aria-hidden="true" />
              </a>
            </li>
          </ul>
          <p className="footer__legal">
            Sản phẩm là thực phẩm bảo vệ sức khỏe, không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh. Tư vấn
            mang tính tham khảo.
          </p>
          <p className="footer__legal">Logo, ảnh và giá sản phẩm: Greenway Global.</p>
        </div>
      </div>
    </footer>
  );
}
