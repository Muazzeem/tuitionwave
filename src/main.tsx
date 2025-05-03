import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import the context provider
import { ProfileCompletionProvider } from '@/components/ProfileCompletionContext';
createRoot(document.getElementById("root")!).render(
  <ProfileCompletionProvider>
    <App />
  </ProfileCompletionProvider>
);