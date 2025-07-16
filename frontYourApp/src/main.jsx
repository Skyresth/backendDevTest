import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import HandlerCart from './context/CartContext';
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <HandlerCart>
        <App />
      </HandlerCart>
    </BrowserRouter>
  </React.StrictMode>,
)
