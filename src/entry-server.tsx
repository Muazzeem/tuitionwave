import { renderToString } from 'react-dom/server';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './components/ThemeProvider';
import { HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router-dom/server';

export function render(url: string) {
  const helmetContext = {};
  
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <ThemeProvider defaultTheme="light">
        <StaticRouter location={url}>
          <div className="app-container">
            <App />
          </div>
        </StaticRouter>
      </ThemeProvider>
    </HelmetProvider>
  );

  // Extract helmet data
  const { helmet } = helmetContext as any;
  
  return { 
    html,
    helmet: helmet || {
      title: { toString: () => '' },
      meta: { toString: () => '' },
      link: { toString: () => '' },
      script: { toString: () => '' }
    }
  };
}