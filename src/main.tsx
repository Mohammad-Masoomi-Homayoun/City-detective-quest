import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import maplibregl from 'maplibre-gl'
import './index.css'
import App from './App.tsx'

// Enable right-to-left text rendering for Arabic/Hebrew
maplibregl.setRTLTextPlugin(
  'https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js',
  true
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
