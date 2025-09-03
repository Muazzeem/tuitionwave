import { hydrateRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './components/ThemeProvider';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

hydrateRoot(
  document.getElementById('root')!,
  <HelmetProvider>
    <ThemeProvider defaultTheme="light">
      <BrowserRouter>
        <div className="app-container">
          <App />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  </HelmetProvider>
);