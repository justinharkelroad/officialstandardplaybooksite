import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeInstalledWebApp } from './pwa.ts'

// Force rebuild
initializeInstalledWebApp();
createRoot(document.getElementById("root")!).render(<App />);
