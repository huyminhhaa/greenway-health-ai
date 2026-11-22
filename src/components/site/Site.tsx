import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, ExternalLink, Globe } from 'lucide-react';
import { shopHome } from '../../data/greenwayCatalog';
import { LANGS, useLang, useT } from '../../i18n';

/** Chọn ngôn ngữ từ menu thả xuống. */
function LangSwitch() {
  const t = useT();
  const lang = useLang((s) => s.lang);
  const setLang = useLang((s) => s.setLang);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="lang"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          event.preventDefault();
          setOpen(false);
          triggerRef.current?.focus();
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className="lang__trigger"
        aria-label={`${t.lang.label}: ${t.lang[lang]}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <Globe size={19} aria-hidden="true" />
        <span>{lang.toUpperCase()}</span>
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      <div id={panelId} className="lang__menu" hidden={!open} role="group" aria-label={t.lang.label}>
        {LANGS.map((id) => (
          <button
            key={id}
            type="button"
            className="lang__option"
            aria-pressed={lang === id}
            lang={id}
            onClick={() => {
              setLang(id);
              setOpen(false);
              triggerRef.current?.focus();
            }}
          >
            {t.lang[id]}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Nav() {
  const t = useT();
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
        <a href="#top" className="nav__logo" aria-label={t.nav.home}>
          <img src="/greenway-wordmark.svg" alt="" width={124} height={30} className="nav__word" />
        </a>
        <nav aria-label={t.nav.main} className="nav__links">
          <a href="#san-pham" className="nav__link">
            {t.nav.products}
          </a>
          <LangSwitch />
          <a href="#tu-van" className="btn btn--clear nav__cta">
            {t.nav.start}
          </a>
        </nav>
      </div>
    </header>
  );
}

export function Faq() {
  const t = useT();
  return (
    <section className="faq" aria-labelledby="faq-title">
      <div className="container faq__grid">
        <h2 id="faq-title" data-reveal>
          {t.faq.title}
        </h2>
        <dl className="faq__rows">
          {t.faq.items.map((f, i) => (
            <div key={i} className="faq__row" data-reveal style={{ ['--i' as string]: i + 1 }}>
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
  const t = useT();
  const lang = useLang((s) => s.lang);
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__letter" data-reveal>
          <p className="footer__sign">{t.footer.sign}</p>
          <p className="footer__from">{t.footer.from}</p>
        </div>
        <div className="footer__side" data-reveal style={{ ['--i' as string]: 2 }}>
          <ul className="footer__links">
            <li>
              <a href="#tu-van">{t.footer.chat}</a>
            </li>
            <li>
              <a href="#san-pham">{t.footer.products}</a>
            </li>
            <li>
              <a href={shopHome(lang)} target="_blank" rel="noopener noreferrer" className="footer__ext">
                {t.footer.shop}
                <ExternalLink size={15} aria-hidden="true" />
              </a>
            </li>
          </ul>
          <p className="footer__legal">{t.footer.legal}</p>
          <p className="footer__legal">{t.footer.credit}</p>
        </div>
      </div>
    </footer>
  );
}
