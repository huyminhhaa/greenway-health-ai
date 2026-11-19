/**
 * Hiệu ứng trượt vào khi cuộn: phần tử có `data-reveal` nhận class `is-in` khi vào màn hình.
 * Chỉ ẩn lúc đầu khi có class `js` trên <html>, nên tắt JavaScript nội dung vẫn hiện đủ.
 * Theo dõi cả phần tử thêm sau (đổi tab sản phẩm, tin nhắn mới) qua MutationObserver.
 */
export function startReveal() {
  const root = document.documentElement;
  root.classList.add('js');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.add('reveal-off');
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );

  const scan = (node: ParentNode) =>
    node.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)').forEach((el) => io.observe(el));

  scan(document);
  new MutationObserver((muts) => {
    for (const m of muts)
      m.addedNodes.forEach((n) => {
        if (!(n instanceof HTMLElement)) return;
        if (n.matches('[data-reveal]:not(.is-in)')) io.observe(n);
        scan(n);
      });
  }).observe(document.body, { childList: true, subtree: true });
}
