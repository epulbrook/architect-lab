import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import MinimalistLayout from '../../components/MinimalistLayout';

export default function MinimalistSettings() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    email: '',
    companyName: ''
  });

  const tabs = [
    { id: 'profile', name: 'Profile' },
    { id: 'billing', name: 'Plan & Billing' },
  ];

  useEffect(() => {
    if (session?.user) {
      setProfile({
        email: session.user.email || '',
        companyName: session.user.companyName || ''
      });
    }
  }, [session]);

  return (
    <MinimalistLayout>
      <div className="space-y-16">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            Settings
          </h1>
          <p className="text-gray-500 text-lg font-light">
            Manage your account and preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'text-gray-900 font-medium'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <MinimalistProfileSettings profile={profile} setProfile={setProfile} />
            )}
            {activeTab === 'billing' && (
              <MinimalistBillingSettings currentPlan={session?.user?.plan} />
            )}
          </div>
        </div>
      </div>
    </MinimalistLayout>
  );
}

// Profile Settings Component
function MinimalistProfileSettings({ profile, setProfile }) {
  const handleSave = async () => {
    try {
      const response = await fetch('/api/settings/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      
      if (response.ok) {
        alert('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="border border-gray-200 rounded p-8">
      <h2 className="text-xl font-light text-gray-900 mb-6">Profile Information</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-xs text-gray-400 font-mono uppercase tracking-wider mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({...profile, email: e.target.value})}
            className="w-full border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-gray-400"
          />
        </div>
        
        <div>
          <label className="block text-xs text-gray-400 font-mono uppercase tracking-wider mb-2">
            Company Name
          </label>
          <input
            type="text"
            value={profile.companyName}
            onChange={(e) => setProfile({...profile, companyName: e.target.value})}
            className="w-full border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-gray-400"
          />
        </div>

        <div className="pt-4">
          <button
            onClick={handleSave}
            className="bg-gray-900 text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// Billing Settings Component
function MinimalistBillingSettings({ currentPlan }) {
  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 29,
      features: [
        'Unlimited partners',
        'Advanced analytics',
        'PDF exports',
        'Email notifications'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 79,
      features: [
        'Everything in Starter',
        'Slack integration',
        'Webhooks',
        'Custom branding'
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Current Plan */}
      <div className="border border-gray-200 rounded p-8">
        <h2 className="text-xl font-light text-gray-900 mb-4">Current Plan</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-light text-gray-900 capitalize">
              {currentPlan || 'Free'} Plan
            </p>
            <p className="text-gray-500 text-sm">
              {currentPlan === 'free' 
                ? 'Limited to 3 partners' 
                : 'Full access to all features'
              }
            </p>
          </div>
          {currentPlan !== 'free' && (
            <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              Manage Billing
            </button>
          )}
        </div>
      </div>

      {/* Available Plans */}
      <div className="border border-gray-200 rounded p-8">
        <h2 className="text-xl font-light text-gray-900 mb-6">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`border rounded p-6 ${
                currentPlan === plan.id ? 'border-gray-400 bg-gray-50' : 'border-gray-200'
              }`}
            >
              <div className="text-center mb-4">
                <h3 className="text-lg font-light text-gray-900">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-2xl font-light text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-500">/month</span>
                </div>
              </div>
              
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <span className="text-gray-400 mr-2">•</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-2 px-4 rounded text-sm font-medium transition-colors ${
                  currentPlan === plan.id
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
                disabled={currentPlan === plan.id}
              >
                {currentPlan === plan.id ? 'Current Plan' : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 