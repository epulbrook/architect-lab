import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import MinimalistLayout from '../../components/MinimalistLayout';

export default function MinimalistReferrals() {
  const { data: session } = useSession();
  const [referrals, setReferrals] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetchReferrals();
    }
  }, [session]);

  const fetchReferrals = async () => {
    try {
      const response = await fetch('/api/referrals');
      const data = await response.json();
      setReferrals(data);
    } catch (error) {
      console.error('Error fetching referrals:', error);
    }
  };

  const handleAddReferral = async (referralData) => {
    try {
      const response = await fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(referralData),
      });
      
      if (response.ok) {
        setShowAddModal(false);
        fetchReferrals();
      }
    } catch (error) {
      console.error('Error adding referral:', error);
    }
  };

  return (
    <MinimalistLayout>
      <div className="space-y-16">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-light text-gray-900 mb-2">
              Referrals
            </h1>
            <p className="text-gray-500 text-lg font-light">
              Manage your referral pipeline
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Add Referral
          </button>
        </div>

        {/* Referrals Table */}
        <div className="border border-gray-200 rounded overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="px-6 py-4 text-xs text-gray-400 font-mono uppercase tracking-wider">
                  Lead
                </th>
                <th className="px-6 py-4 text-xs text-gray-400 font-mono uppercase tracking-wider">
                  Partner
                </th>
                <th className="px-6 py-4 text-xs text-gray-400 font-mono uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-4 text-xs text-gray-400 font-mono uppercase tracking-wider">
                  Deal Size
                </th>
                <th className="px-6 py-4 text-xs text-gray-400 font-mono uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {referrals.length > 0 ? (
                referrals.map((referral) => (
                  <tr key={referral.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-gray-900 font-medium">{referral.lead_name}</div>
                        <div className="text-gray-500 text-sm">{referral.company}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {referral.partner_name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-mono bg-gray-100 text-gray-700 rounded">
                        {referral.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-mono">
                      ${referral.deal_size?.toLocaleString() || '0'}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm font-mono">
                      {new Date(referral.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    No referrals yet. Add your first referral to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Referral Modal */}
        {showAddModal && (
          <MinimalistAddReferralModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddReferral}
          />
        )}
      </div>
    </MinimalistLayout>
  );
}

// Minimalist Add Referral Modal
function MinimalistAddReferralModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    partner_id: '',
    lead_name: '',
    lead_email: '',
    company: '',
    deal_size: '',
    notes: ''
  });
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/partners');
      const data = await response.json();
      setPartners(data);
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-gray-200 rounded p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h3 className="text-xl font-light text-gray-900">Add Referral</h3>
          <p className="text-gray-500 text-sm mt-2">
            Add a new referral to your pipeline
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs text-gray-400 font-mono uppercase tracking-wider mb-2">
              Partner *
            </label>
            <select
              required
              value={formData.partner_id}
              onChange={(e) => setFormData({...formData, partner_id: e.target.value})}
              className="w-full border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-gray-400"
            >
              <option value="">Select partner...</option>
              {partners.map((partner) => (
                <option key={partner.id} value={partner.id}>
                  {partner.name} - {partner.company}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs text-gray-400 font-mono uppercase tracking-wider mb-2">
              Lead Name *
            </label>
            <input
              type="text"
              required
              value={formData.lead_name}
              onChange={(e) => setFormData({...formData, lead_name: e.target.value})}
              className="w-full border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-gray-400"
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-400 font-mono uppercase tracking-wider mb-2">
              Lead Email
            </label>
            <input
              type="email"
              value={formData.lead_email}
              onChange={(e) => setFormData({...formData, lead_email: e.target.value})}
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
          
          <div>
            <label className="block text-xs text-gray-400 font-mono uppercase tracking-wider mb-2">
              Deal Size ($)
            </label>
            <input
              type="number"
              value={formData.deal_size}
              onChange={(e) => setFormData({...formData, deal_size: e.target.value})}
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
              Add Referral
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 