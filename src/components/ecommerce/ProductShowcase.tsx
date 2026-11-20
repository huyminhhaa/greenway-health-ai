import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { NEEDS, productsFor, shopHome } from '../../data/greenwayCatalog';
import { useHealthStore } from '../../store/useHealthStore';
import type { NeedId, Product } from '../../types/healthcare';
import { ProductTile } from './ProductCard';
import { loc, useLang, useT } from '../../i18n';

/** Tải trước ảnh của một danh mục (khi rê chuột hoặc focus vào nút) để lúc đổi không phải chờ ảnh. */
const prefetched = new Set<NeedId>();
function prefetch(need: NeedId) {
  if (prefetched.has(need)) return;
  prefetched.add(need);
  for (const p of productsFor(need)) {
    const img = new Image();
    img.decoding = 'async';
    img.src = p.image;
  }
}

/** Sản phẩm Greenway theo nhu cầu: thanh chọn nhu cầu + dải sản phẩm trượt ngang. */
export function ProductShowcase() {
  const t = useT();
  const lang = useLang((s) => s.lang);
  const [need, setNeed] = useState<NeedId>('sleep');
  // Lần đầu: thẻ trượt vào khi cuộn tới (data-reveal). Từ lần đổi danh mục: hiệu ứng CSS chạy ngay.
  const [switched, setSwitched] = useState(false);
  const send = useHealthStore((s) => s.send);
  const railRef = useRef<HTMLUListElement>(null);
  const items = productsFor(need);

  const ask = (p: Product) => {
    void send(t.product.askMessage(loc(p.name)), [], { fromOutside: true });
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('tu-van')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  const scrollBy = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' });
  };

  const choose = (id: NeedId) => {
    if (id === need) return;
    railRef.current?.scrollTo({ left: 0 });
    setSwitched(true);
    setNeed(id);
  };

  const itemProps = (i: number) =>
    switched
      ? { className: 'rail__item is-switching', style: { ['--i' as string]: i } }
      : { className: 'rail__item', 'data-reveal': 'right', style: { ['--i' as string]: i } };

  return (
    <section id="san-pham" className="shelf" aria-labelledby="shelf-title">
      <div className="container">
        <header className="shelf__head" data-reveal>
          <h2 id="shelf-title">{t.shelf.title}</h2>
          <p className="lead">{t.shelf.lead}</p>
        </header>

        <div className="shelf__bar" data-reveal style={{ ['--i' as string]: 1 }}>
          <div className="needs" role="tablist" aria-label={t.shelf.chooseNeed}>
            {NEEDS.map((id) => (
              <button
                key={id}
                type="button"
                role="tab"
                id={`need-${id}`}
                aria-selected={need === id}
                aria-controls="shelf-panel"
                className="key"
                onPointerEnter={() => prefetch(id)}
                onFocus={() => prefetch(id)}
                onClick={() => choose(id)}
              >
                {t.needs[id]}
              </button>
            ))}
          </div>
          <div className="shelf__arrows">
            <button type="button" className="icon-btn icon-btn--lg" onClick={() => scrollBy(-1)} aria-label={t.shelf.prev}>
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <button type="button" className="icon-btn icon-btn--lg" onClick={() => scrollBy(1)} aria-label={t.shelf.next}>
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div id="shelf-panel" role="tabpanel" aria-labelledby={`need-${need}`} className="shelf__panel">
        <ul className="rail" ref={railRef}>
          {items.map((p, i) => (
            // khóa theo danh mục để mỗi lần đổi, thẻ mới chạy lại hiệu ứng vào
            <li key={`${need}-${p.code}`} {...itemProps(i)}>
              <ProductTile product={p} onAsk={ask} />
            </li>
          ))}
          <li key={`${need}-end`} {...itemProps(items.length)} className={`${itemProps(items.length).className} rail__end`}>
            <a className="rail__shop" href={shopHome(lang)} target="_blank" rel="noopener noreferrer">
              <span>{t.shelf.allShop}</span>
              <ExternalLink size={20} aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
