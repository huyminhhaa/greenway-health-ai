import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { NEEDS, SHOP_HOME, productsFor } from '../../data/greenwayCatalog';
import { useHealthStore } from '../../store/useHealthStore';
import type { NeedId, Product } from '../../types/healthcare';
import { ProductTile } from './ProductCard';

/** Sản phẩm Greenway theo nhu cầu: thanh chọn nhu cầu + dải sản phẩm trượt ngang. */
export function ProductShowcase() {
  const [need, setNeed] = useState<NeedId>('sleep');
  const send = useHealthStore((s) => s.send);
  const railRef = useRef<HTMLUListElement>(null);
  const items = productsFor(need);

  const ask = (p: Product) => {
    void send(`Tư vấn giúp tôi về ${p.name}`, [], { fromOutside: true });
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('tu-van')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  const scrollBy = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <section id="san-pham" className="shelf" aria-labelledby="shelf-title">
      <div className="container">
        <header className="shelf__head" data-reveal>
          <h2 id="shelf-title">Sản phẩm Greenway theo nhu cầu</h2>
          <p className="lead">Giá và ảnh lấy từ cửa hàng chính hãng. Bấm mua, trang Greenway mở ra.</p>
        </header>

        <div className="shelf__bar" data-reveal style={{ ['--i' as string]: 1 }}>
          <div className="needs" role="tablist" aria-label="Chọn nhu cầu">
            {NEEDS.map((n) => (
              <button
                key={n.id}
                type="button"
                role="tab"
                id={`need-${n.id}`}
                aria-selected={need === n.id}
                aria-controls="shelf-panel"
                className="key"
                onClick={() => {
                  setNeed(n.id);
                  railRef.current?.scrollTo({ left: 0 });
                }}
              >
                {n.label}
              </button>
            ))}
          </div>
          <div className="shelf__arrows">
            <button type="button" className="icon-btn icon-btn--lg" onClick={() => scrollBy(-1)} aria-label="Xem sản phẩm trước">
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <button type="button" className="icon-btn icon-btn--lg" onClick={() => scrollBy(1)} aria-label="Xem sản phẩm tiếp">
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div id="shelf-panel" role="tabpanel" aria-labelledby={`need-${need}`} className="shelf__panel">
        <ul className="rail" ref={railRef} key={need}>
          {items.map((p, i) => (
            <li key={p.code} data-reveal="right" style={{ ['--i' as string]: i }}>
              <ProductTile product={p} onAsk={ask} />
            </li>
          ))}
          <li className="rail__end" data-reveal="right" style={{ ['--i' as string]: items.length }}>
            <a className="rail__shop" href={SHOP_HOME} target="_blank" rel="noopener noreferrer">
              <span>Xem toàn bộ cửa hàng Greenway</span>
              <ExternalLink size={20} aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
