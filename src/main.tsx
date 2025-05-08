
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import the context providers
import { ProfileCompletionProvider } from '@/components/ProfileCompletionContext.jsx';
import { ThemeProvider } from './components/ThemeProvider';

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light">
    <ProfileCompletionProvider>
      <div className="app-container">
        <App />
      </div>
    </ProfileCompletionProvider>
  </ThemeProvider>
);
