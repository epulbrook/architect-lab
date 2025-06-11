import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import MainLandingPage from './components/MainLandingPage'
import ToolPage from './components/ToolPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLandingPage />} />
      <Route path="/tools/:toolId" element={<ToolPage />} />
    </Routes>
  )
}

export default App 