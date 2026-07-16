import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { db } from './utils/db';

import { LanguageProvider } from './utils/LanguageContext.jsx';

// Mount React immediately
const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>
);

// Fetch all public details from backend in the background
db.init()
  .catch((err) => {
    console.error('Failed to initialize local data cache', err);
  });
