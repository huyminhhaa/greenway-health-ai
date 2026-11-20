import { MotionConfig } from 'framer-motion';
import { Nav, Faq, Footer } from './components/site/Site';
import { Hero } from './components/hero/Hero';
import { ChatWorkspace } from './components/chat/ChatWorkspace';
import { ProductShowcase } from './components/ecommerce/ProductShowcase';
import { useT } from './i18n';

export default function App() {
  const t = useT();
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip" href="#tu-van">
        {t.skip}
      </a>
      <Nav />
      <main id="top">
        <Hero />
        <ChatWorkspace />
        <ProductShowcase />
        <Faq />
      </main>
      <Footer />
    </MotionConfig>
  );
}
