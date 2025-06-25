import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ReferralManagementPortal = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    currentReferralProcess: '',
    partnerCount: ''
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [showDemo, setShowDemo] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Referral Management Portal form submitted:', formData);
    setShowDemo(true);
  };

  const handleGetStarted = () => {
    // Link to the new Next.js portal
    window.open('https://advocate-portal.vercel.app', '_blank');
  };

  const handleIntegrationGuide = () => {
    navigate('/tools/portal/integration-guide');
  };

  // Demo data
  const demoData = {
    totalReferrals: 247,
    activePartners: 23,
    conversionRate: 34,
    avgDealSize: 45000,
    monthlyRevenue: 890000,
    topPartners: [
      { name: 'TechCorp Solutions', referrals: 28, revenue: 125000, health: 'Excellent' },
      { name: 'Digital Dynamics', referrals: 22, revenue: 98000, health: 'Good' },
      { name: 'Innovate Labs', referrals: 19, revenue: 87000, health: 'Good' },
      { name: 'Future Systems', referrals: 15, revenue: 67000, health: 'Needs Attention' }
    ],
    recentReferrals: [
      { id: 1, company: 'Acme Corp', partner: 'TechCorp Solutions', value: 45000, status: 'New', date: '2024-01-15' },
      { id: 2, company: 'Global Tech', partner: 'Digital Dynamics', value: 32000, status: 'Contacted', date: '2024-01-14' },
      { id: 3, company: 'Innovate Inc', partner: 'Innovate Labs', value: 67000, status: 'Qualified', date: '2024-01-13' },
      { id: 4, company: 'Future Co', partner: 'Future Systems', value: 28000, status: 'Closed Won', date: '2024-01-12' }
    ]
  };

  const renderDemoDashboard = () => (
    <div className="bg-gray-50 rounded-xl p-8 mb-12">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-light text-black">Demo Dashboard</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'overview' ? 'bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('partners')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'partners' ? 'bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Partners
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'referrals' ? 'bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Referrals
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl">
            <div className="text-2xl font-light text-black mb-2">{demoData.totalReferrals}</div>
            <div className="text-sm text-gray-600">Total Referrals</div>
          </div>
          <div className="bg-white p-6 rounded-xl">
            <div className="text-2xl font-light text-black mb-2">{demoData.activePartners}</div>
            <div className="text-sm text-gray-600">Active Partners</div>
          </div>
          <div className="bg-white p-6 rounded-xl">
            <div className="text-2xl font-light text-black mb-2">{demoData.conversionRate}%</div>
            <div className="text-sm text-gray-600">Conversion Rate</div>
          </div>
          <div className="bg-white p-6 rounded-xl">
            <div className="text-2xl font-light text-black mb-2">€{demoData.monthlyRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Monthly Revenue</div>
          </div>
        </div>
      )}

      {activeTab === 'partners' && (
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h4 className="text-lg font-medium text-black">Top Performing Partners</h4>
          </div>
          <div className="divide-y divide-gray-200">
            {demoData.topPartners.map((partner, index) => (
              <div key={index} className="p-6 flex justify-between items-center">
                <div>
                  <div className="font-medium text-black">{partner.name}</div>
                  <div className="text-sm text-gray-600">{partner.referrals} referrals</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-black">€{partner.revenue.toLocaleString()}</div>
                  <div className={`text-sm px-2 py-1 rounded-full inline-block ${
                    partner.health === 'Excellent' ? 'bg-green-100 text-green-800' :
                    partner.health === 'Good' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {partner.health}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'referrals' && (
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h4 className="text-lg font-medium text-black">Recent Referrals</h4>
          </div>
          <div className="divide-y divide-gray-200">
            {demoData.recentReferrals.map((referral) => (
              <div key={referral.id} className="p-6 flex justify-between items-center">
                <div>
                  <div className="font-medium text-black">{referral.company}</div>
                  <div className="text-sm text-gray-600">via {referral.partner}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-black">€{referral.value.toLocaleString()}</div>
                  <div className={`text-sm px-2 py-1 rounded-full inline-block ${
                    referral.status === 'New' ? 'bg-blue-100 text-blue-800' :
                    referral.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                    referral.status === 'Qualified' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {referral.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header with back button */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-black mb-6 flex items-center"
          >
            ← Back to Tools
          </button>
        </div>

        {/* SEO-optimized H1 */}
        <h1 className="text-4xl md:text-6xl font-light mb-8 text-black tracking-tight">
          Referral Management Portal
        </h1>
        
        {/* Main description */}
        <p className="text-lg md:text-xl text-gray-700 mb-12 leading-relaxed">
          Centralise your partner referral programme, score partner health, and optimise deal velocity with a data-driven dashboard.
        </p>

        {/* Demo Dashboard */}
        {showDemo && renderDemoDashboard()}

        {/* Key Features Section */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-light mb-8 text-black">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-medium mb-3 text-black">Partner Health Scores</h3>
              <p className="text-gray-700">See at a glance which partners drive the most revenue.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-medium mb-3 text-black">Referral Pipeline</h3>
              <p className="text-gray-700">Kanban & table views of every lead—from new to closed.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-medium mb-3 text-black">Conversion Analytics</h3>
              <p className="text-gray-700">Time-to-contact, close rate, and average deal size metrics.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-medium mb-3 text-black">Email & Slack Alerts</h3>
              <p className="text-gray-700">Never miss a hot partner referral.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-medium mb-3 text-black">CSV/PDF Exports</h3>
              <p className="text-gray-700">Built-in reporting for your quarterly reviews.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-medium mb-3 text-black">Real-time Dashboard</h3>
              <p className="text-gray-700">Monitor your referral programme performance in real-time.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-black text-white p-8 md:p-12 rounded-xl text-center">
          <h2 className="text-2xl md:text-3xl font-light mb-6">Ready to optimize your referral program?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join B2B teams who've increased their partner referral revenue by 40% with our data-driven approach.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Try Live Portal: robust external link */}
            <a
              href="https://advocate-portal.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors text-center"
              style={{ display: 'inline-block' }}
            >
              Try Live Portal
            </a>
            {/* Integration Guide: robust navigation */}
            <button
              onClick={() => {
                try {
                  navigate('/tools/portal/integration-guide');
                } catch (e) {
                  window.location.href = '/tools/portal/integration-guide';
                }
              }}
              className="px-8 py-4 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              Integration Guide
            </button>
            {/* Contact Sales: robust scroll */}
            <button
              onClick={() => {
                const el = document.getElementById('contact-form');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.location.hash = '#contact-form';
                }
              }}
              className="px-8 py-4 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              Contact Sales
            </button>
          </div>
        </div>

        {/* Contact Form */}
        <div id="contact-form" className="mt-16">
          <h2 className="text-2xl md:text-3xl font-light mb-8 text-black">Get Early Access</h2>
          <form onSubmit={handleSubmit} className="max-w-md space-y-4">
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder="Company Name"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Work Email"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
              required
            />
            <select
              name="currentReferralProcess"
              value={formData.currentReferralProcess}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
              required
            >
              <option value="">How do you currently track referrals?</option>
              <option value="spreadsheets">Spreadsheets</option>
              <option value="crm">CRM</option>
              <option value="manual">Manual tracking</option>
              <option value="other">Other</option>
            </select>
            <select
              name="partnerCount"
              value={formData.partnerCount}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
              required
            >
              <option value="">Number of active partners?</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-100">51-100</option>
              <option value="100+">100+</option>
            </select>
            <button
              type="submit"
              className="w-full py-3 px-6 bg-black text-white font-medium rounded-lg hover:bg-gray-900 transition-colors"
            >
              {showDemo ? 'Demo Dashboard' : 'Get Early Access'}
            </button>
          </form>
        </div>

        {/* Benefits Section */}
        <div className="mt-16">
          <h2 className="text-2xl md:text-3xl font-light mb-8 text-black">Why B2B Teams Choose Our Referral Management Portal</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-light mb-4 text-black">40%</div>
              <p className="text-gray-700">Average increase in partner referral revenue</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light mb-4 text-black">3x</div>
              <p className="text-gray-700">Faster deal velocity with automated tracking</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light mb-4 text-black">24/7</div>
              <p className="text-gray-700">Real-time visibility into your referral pipeline</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralManagementPortal; 