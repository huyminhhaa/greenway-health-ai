import { ExternalLink, MessageCircle } from 'lucide-react';
import type { Product } from '../../types/healthcare';
import { productUrl } from '../../data/greenwayCatalog';
import { formatVnd } from '../../lib/health';
import { loc, useLang, useT, type Dict } from '../../i18n';

function doseText(p: Product, t: Dict) {
  return p.dosage && p.timing
    ? { amount: loc(p.dosage), when: loc(p.timing) }
    : { amount: t.product.byPackage, when: t.product.readBox };
}

function BuyLink({ product }: { product: Product }) {
  const t = useT();
  const lang = useLang((s) => s.lang);
  return (
    <a className="link-action" href={productUrl(product, lang)} target="_blank" rel="noopener noreferrer">
      {t.product.buy}
      <ExternalLink size={16} aria-hidden="true" />
      <span className="visually-hidden">{t.product.opensShop}</span>
    </a>
  );
}

/**
 * Nhãn thuốc trong khung chat: giấy trên nhựa, liều dùng set như nhãn nhà thuốc,
 * cuống xé phía dưới mang giá và đường dẫn mua tại Greenway.
 */
export function ProductLabel({ product, reason }: { product: Product; reason: string }) {
  const t = useT();
  const dose = doseText(product, t);
  return (
    <article className="rx">
      <div className="rx__top">
        <img className="rx__img" src={product.image} alt="" width={88} height={88} loading="lazy" decoding="async" />
        <div className="rx__id">
          <p className="rx__reason">{reason}</p>
          <h3 className="rx__name">{loc(product.name)}</h3>
          <p className="rx__pack">{loc(product.pack)}</p>
        </div>
      </div>
      <p className="rx__dose">
        <span className="visually-hidden">{t.product.doseSr}</span>
        <span className="mono rx__amount">{dose.amount}</span>
        <span className="mono rx__when">{dose.when}</span>
      </p>
      <div className="rx__stub">
        <span className="mono rx__price">{formatVnd(product.price)}</span>
        <BuyLink product={product} />
      </div>
    </article>
  );
}

/** Thẻ sản phẩm trong dải sản phẩm theo nhu cầu. */
export function ProductTile({ product, onAsk }: { product: Product; onAsk: (p: Product) => void }) {
  const t = useT();
  const name = loc(product.name);
  return (
    <article className="tile">
      <div className="tile__media">
        <img src={product.image} alt={name} width={400} height={400} loading="lazy" decoding="async" />
      </div>
      <div className="tile__body">
        <p className="tile__brand">{product.brand}</p>
        <h3 className="tile__name">{name}</h3>
        <p className="tile__meta">
          <span className="mono">{formatVnd(product.price)}</span>
          <span>{loc(product.pack)}</span>
        </p>
      </div>
      <div className="tile__actions">
        <button type="button" className="btn btn--quiet" onClick={() => onAsk(product)}>
          <MessageCircle size={17} aria-hidden="true" />
          {t.product.ask}
        </button>
        <BuyLink product={product} />
      </div>
    </article>
  );
}
