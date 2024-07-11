import React from 'react'
import MenuBar from './MenuBar.jsx'
import FileManagement from './FileManagement.jsx'

export default function Editor() {
  return (
    <>
        <MenuBar/>
        <div className="section">
          <FileManagement/>
        </div>
    </>
  )
}
