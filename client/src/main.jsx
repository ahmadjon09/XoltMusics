import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ContextProvider } from './context/Context.jsx'
import { LanguageProvider } from './hooks/UseLanguage.jsx'
import { MusicProvider } from './context/MusicContext.jsx'
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/public/sw.js");
  });
}
createRoot(document.getElementById('root')).render(
  <ContextProvider>
    <LanguageProvider>
      <MusicProvider>
        <App />
      </MusicProvider>
    </LanguageProvider>
  </ContextProvider>
)
