import { useState } from 'react'
import PWABadge from './PWABadge.jsx'
import './App.css'
import Editor from './components/Editor.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Editor/>
      <PWABadge />
    </>
  )
}

export default App
