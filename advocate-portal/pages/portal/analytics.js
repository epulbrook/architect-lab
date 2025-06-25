import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import MinimalistLayout from '../../components/MinimalistLayout';

export default function MinimalistAnalytics() {
  const { data: session } = useSession();
  const [dateRange, setDateRange] = useState('30');

  return (
    <MinimalistLayout>
      <div className="space-y-16">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            Analytics
          </h1>
          <p className="text-gray-500 text-lg font-light">
            Deep insights into your referral performance
          </p>
        </div>

        {/* Free Tier Content */}
        {session?.user?.plan === 'free' ? (
          <div className="space-y-8">
            {/* Basic Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-2">
                <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">
                  TOTAL REFERRALS
                </div>
                <div className="text-2xl font-light text-gray-900">12</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">
                  CONVERSION RATE
                </div>
                <div className="text-2xl font-light text-gray-900">25%</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">
                  AVG. DEAL SIZE
                </div>
                <div className="text-2xl font-light text-gray-900">$15,000</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">
                  AVG. FOLLOW-UP
                </div>
                <div className="text-2xl font-light text-gray-900">2.3 days</div>
              </div>
            </div>

            {/* Basic Chart Placeholder */}
            <div className="border border-gray-200 rounded p-8">
              <h2 className="text-xl font-light text-gray-900 mb-6">Referrals Over Time</h2>
              <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-sm font-mono uppercase tracking-wider mb-2">
                    BASIC CHART
                  </div>
                  <div className="text-xs">
                    Last 30 days • Limited data
                  </div>
                </div>
              </div>
            </div>

            {/* Upgrade Prompt */}
            <div className="border border-gray-200 rounded p-8 bg-gray-50">
              <div className="text-center space-y-4">
                <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">
                  ADVANCED ANALYTICS AVAILABLE
                </div>
                <div className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  Get detailed conversion funnels, time-to-follow-up analysis, 
                  revenue attribution by partner, and custom report builder.
                </div>
                <button className="bg-gray-900 text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors">
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Pro Analytics Content */}
            <div className="text-center text-gray-400">
              <div className="text-sm font-mono uppercase tracking-wider mb-2">
                PRO ANALYTICS
              </div>
              <div className="text-xs">
                Advanced charts and reporting coming soon
              </div>
            </div>
          </div>
        )}
      </div>
    </MinimalistLayout>
  );
} 