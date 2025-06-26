import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import MainLandingPage from './components/MainLandingPage'
import ToolPage from './components/ToolPage'
import WebsiteComparisonTool from './components/tools/WebsiteComparisonTool'
import MiniSEOAnalyser from './components/tools/MiniSEOAnalyser'
import CompetitorWaitlist from './components/CompetitorWaitlist'
import ReferralWaitlist from './components/ReferralWaitlist'
import GDPRWaitlist from './components/GDPRWaitlist'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLandingPage />} />
      <Route path="/tools/:toolId" element={<ToolPage />} />
      <Route path="/seo-analyzer" element={<WebsiteComparisonTool />} />
      <Route path="/mini-seo-analyser" element={<MiniSEOAnalyser />} />
      <Route path="/waitlist-competitor" element={<CompetitorWaitlist />} />
      <Route path="/waitlist-referral" element={<ReferralWaitlist />} />
      <Route path="/waitlist-gdpr" element={<GDPRWaitlist />} />
    </Routes>
  )
}

export default App 