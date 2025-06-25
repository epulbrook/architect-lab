import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import MainLandingPage from './components/MainLandingPage'
import ToolPage from './components/ToolPage'
import WebsiteComparisonTool from './components/tools/WebsiteComparisonTool'
import MiniSEOAnalyser from './components/tools/MiniSEOAnalyser'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLandingPage />} />
      <Route path="/tools/:toolId" element={<ToolPage />} />
      <Route path="/seo-analyzer" element={<WebsiteComparisonTool />} />
      <Route path="/mini-seo-analyser" element={<MiniSEOAnalyser />} />
    </Routes>
  )
}

export default App 