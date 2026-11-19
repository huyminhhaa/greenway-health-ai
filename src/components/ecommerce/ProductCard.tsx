import { ExternalLink, MessageCircle } from 'lucide-react';
import type { Product } from '../../types/healthcare';
import { productUrl } from '../../data/greenwayCatalog';
import { formatVnd } from '../../lib/health';

function doseText(p: Product) {
  return p.dosage ? { amount: p.dosage, when: p.timing ?? '' } : { amount: 'Theo bao bì', when: 'đọc hướng dẫn trên hộp' };
}

/**
 * Nhãn thuốc trong khung chat: giấy trên nhựa, liều dùng set như nhãn nhà thuốc,
 * cuống xé phía dưới mang giá và đường dẫn mua tại Greenway.
 */
export function ProductLabel({ product, reason }: { product: Product; reason: string }) {
  const dose = doseText(product);
  return (
    <article className="rx">
      <div className="rx__top">
        <img
          className="rx__img"
          src={product.image}
          alt=""
          width={88}
          height={88}
          loading="lazy"
          decoding="async"
        />
        <div className="rx__id">
          <p className="rx__reason">{reason}</p>
          <h3 className="rx__name">{product.name}</h3>
          <p className="rx__pack">{product.pack}</p>
        </div>
      </div>
      <p className="rx__dose">
        <span className="visually-hidden">Liều dùng gợi ý: </span>
        <span className="mono rx__amount">{dose.amount}</span>
        <span className="mono rx__when">{dose.when}</span>
      </p>
      <div className="rx__stub">
        <span className="mono rx__price">{formatVnd(product.price)}</span>
        <a className="link-action" href={productUrl(product)} target="_blank" rel="noopener noreferrer">
          Mua tại Greenway
          <ExternalLink size={16} aria-hidden="true" />
          <span className="visually-hidden"> (mở trang cửa hàng)</span>
        </a>
      </div>
    </article>
  );
}

/** Thẻ sản phẩm trong dải sản phẩm theo nhu cầu. */
export function ProductTile({ product, onAsk }: { product: Product; onAsk: (p: Product) => void }) {
  return (
    <article className="tile">
      <div className="tile__media">
        <img src={product.image} alt={product.name} width={400} height={400} loading="lazy" decoding="async" />
      </div>
      <div className="tile__body">
        <p className="tile__brand">{product.brand}</p>
        <h3 className="tile__name">{product.name}</h3>
        <p className="tile__meta">
          <span className="mono">{formatVnd(product.price)}</span>
          <span>{product.pack}</span>
        </p>
      </div>
      <div className="tile__actions">
        <button type="button" className="btn btn--quiet" onClick={() => onAsk(product)}>
          <MessageCircle size={17} aria-hidden="true" />
          Hỏi dược sĩ AI
        </button>
        <a className="link-action" href={productUrl(product)} target="_blank" rel="noopener noreferrer">
          Mua tại Greenway
          <ExternalLink size={16} aria-hidden="true" />
          <span className="visually-hidden"> (mở trang cửa hàng)</span>
        </a>
      </div>
    </article>
  );
}
