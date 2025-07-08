import React from 'react'
import ReactDOM from 'react-dom/client'
import CombinedProvider from './context/CombinedProvider.context';
import { App } from './App'
import { ThemeConfig } from './config/theme.config';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeConfig>
        <CombinedProvider>
          <App/>
        </CombinedProvider>
    </ThemeConfig>
  </React.StrictMode>,
)
