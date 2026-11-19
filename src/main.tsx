import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { startReveal } from './lib/reveal';

// Bật trước khi React vẽ: MutationObserver bắt được mọi phần tử data-reveal khi chúng xuất hiện.
startReveal();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
