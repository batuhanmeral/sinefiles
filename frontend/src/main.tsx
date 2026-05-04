import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import './styles/tailwind.css';
import './lib/i18n';

const root = document.getElementById('root');
if (!root) throw new Error('#root elementi bulunamadı');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
