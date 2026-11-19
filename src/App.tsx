import { MotionConfig } from 'framer-motion';
import { Nav, Faq, Footer } from './components/site/Site';
import { Hero } from './components/hero/Hero';
import { ChatWorkspace } from './components/chat/ChatWorkspace';
import { ProductShowcase } from './components/ecommerce/ProductShowcase';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip" href="#tu-van">
        Vào thẳng khung trò chuyện
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
