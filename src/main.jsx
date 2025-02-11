import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Header from './components/HeaderCard.jsx'
import Footer from './components/FooterCard.jsx'
import Particles from './components/magicui/particles'; 

const color = "#FFFFFF";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Header /> 
      <App />
      <Footer />

      <Particles
        className="fixed top-0 left-0 w-full h-screen z-[-1]"
        quantity={200}
        color={color}
        refresh
      />
  </StrictMode>,
)
