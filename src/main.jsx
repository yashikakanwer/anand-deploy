import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { db } from './utils/db';

// Mount React immediately
const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Fetch all public details from backend in the background
db.init()
  .catch((err) => {
    console.error('Failed to initialize local data cache', err);
  });
