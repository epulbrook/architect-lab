import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import MinimalistLayout from '../../components/MinimalistLayout';

export default function MinimalistPartners() {
  const { data: session } = useSession();
  const [partners, setPartners] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetchPartners();
    }
  }, [session]);

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/partners');
      const data = await response.json();
      setPartners(data);
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  const handleAddPartner = async (partnerData) => {
    try {
      const response = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partnerData),
      });
      
      if (response.ok) {
        setShowAddModal(false);
        fetchPartners();
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error('Error adding partner:', error);
    }
  };

  return (
    <MinimalistLayout>
      <div className="space-y-16">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-light text-gray-900 mb-2">
              Partner Network
            </h1>
            <p className="text-gray-500 text-lg font-light">
              Manage your advocate relationships
              {session?.user?.plan === 'free' && (
                <span className="block text-sm text-gray-400 mt-1 font-mono">
                  {partners.length}/3 partners used • Free tier
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Add Partner
          </button>
        </div>

        {/* Partners Table - Clean & Minimal */}
        <div className="border border-gray-200 rounded overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="px-6 py-4 text-xs text-gray-400 font-mono uppercase tracking-wider">
                  Partner
                </th>
                <th className="px-6 py-4 text-xs text-gray-400 font-mono uppercase tracking-wider">
                  Performance Score
                </th>
                <th className="px-6 py-4 text-xs text-gray-400 font-mono uppercase tracking-wider">
                  Referrals
                </th>
                <th className="px-6 py-4 text-xs text-gray-400 font-mono uppercase tracking-wider">
                  Conversion
                </th>
                <th className="px-6 py-4 text-xs text-gray-400 font-mono uppercase tracking-wider">
                  Avg. Deal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {partners.length > 0 ? (
                partners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-gray-900 font-medium">{partner.name}</div>
                        <div className="text-gray-500 text-sm">{partner.company}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-12 h-1 bg-gray-200 rounded">
                          <div 
                            className="h-1 bg-gray-900 rounded"
                            style={{ width: `${partner.health_score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 font-mono">
                          {partner.health_score}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-mono">
                      {partner.referral_count || 0}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-mono">
                      {partner.conversion_rate ? `${Math.round(partner.conversion_rate)}%` : '0%'}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-mono">
                      ${partner.avg_deal_size ? Math.round(partner.avg_deal_size).toLocaleString() : '0'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    No partners yet. Add your first advocate to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Free Tier Message */}
        {session?.user?.plan === 'free' && partners.length >= 2 && (
          <div className="border border-gray-200 rounded p-6 bg-gray-50">
            <div className="text-sm text-gray-600 text-center">
              You're approaching the free tier limit. 
              <button className="ml-2 text-gray-900 underline hover:no-underline">
                Upgrade to add unlimited partners
              </button>
            </div>
          </div>
        )}

        {/* Add Partner Modal */}
        {showAddModal && (
          <MinimalistAddPartnerModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddPartner}
            isFreeTier={session?.user?.plan === 'free'}
            currentCount={partners.length}
          />
        )}
      </div>
    </MinimalistLayout>
  );
}

// Minimalist Add Partner Modal
function MinimalistAddPartnerModal({ onClose, onAdd, isFreeTier, currentCount }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    tags: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFreeTier && currentCount >= 3) {
      alert('Free tier limited to 3 partners. Upgrade to add more.');
      return;
    }
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-gray-200 rounded p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h3 className="text-xl font-light text-gray-900">Add Partner</h3>
          <p className="text-gray-500 text-sm mt-2">
            Add a new advocate to your network
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs text-gray-400 font-mono uppercase tracking-wider mb-2">
              Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-gray-400"
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-400 font-mono uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-gray-400"
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-400 font-mono uppercase tracking-wider mb-2">
              Company
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              className="w-full border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-gray-400"
            />
          </div>

          <div className="flex justify-between space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-gray-600 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
            >
              Add Partner
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 