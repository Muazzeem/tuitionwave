import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import the context provider
import { ProfileCompletionProvider } from '@/components/ProfileCompletionContext.jsx';
createRoot(document.getElementById("root")!).render(
  <ProfileCompletionProvider>
    <div className="app-container">
      <App />
    </div>
  </ProfileCompletionProvider>
);