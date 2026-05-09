import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { Web3Provider } from './providers/Web3Provider'
import { TelegramProvider } from './providers/TelegramProvider'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TelegramProvider>
      <Web3Provider>
        <App />
        <Toaster position="top-center" toastOptions={{ style: { background: '#1A1A1A', color: '#fff', border: '1px solid #333' } }} />
      </Web3Provider>
    </TelegramProvider>
  </StrictMode>,
)
