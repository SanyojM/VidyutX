import { useState } from 'react'
import PWABadge from './PWABadge.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      
      <PWABadge />
    </>
  )
}

export default App
