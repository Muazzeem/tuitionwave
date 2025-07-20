import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import the context providers
import { ThemeProvider } from './components/ThemeProvider';

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light">
    <div className="app-container">
      <App />
    </div>
  </ThemeProvider>
);