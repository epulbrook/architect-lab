import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import MinimalistLayout from '../../components/MinimalistLayout';

export default function MinimalistDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalPartners: 0,
    activeReferrals: 0,
    totalRevenue: 0,
    conversionRate: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      const data = await response.json();
      setStats(data.stats);
      setRecentActivity(data.recentActivity);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <MinimalistLayout>
      <div className="space-y-16">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            Network Overview
          </h1>
          <p className="text-gray-500 text-lg font-light">
            A reasonably objective assessment of your advocate performance. 
            Results may contain traces of uncomfortable truths.
          </p>
        </div>

        {/* Key Metrics - Minimalist Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-2">
            <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">
              TOTAL PARTNERS
            </div>
            <div className="text-2xl font-light text-gray-900">
              {stats.totalPartners}
              {session?.user?.plan === 'free' && (
                <span className="text-sm text-gray-400 ml-2">/3</span>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">
              ACTIVE REFERRALS
            </div>
            <div className="text-2xl font-light text-gray-900">
              {stats.activeReferrals}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">
              REVENUE GENERATED
            </div>
            <div className="text-2xl font-light text-gray-900">
              ${stats.totalRevenue.toLocaleString()}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">
              CONVERSION RATE
            </div>
            <div className="text-2xl font-light text-gray-900">
              {stats.conversionRate}%
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="border border-gray-200 rounded p-8">
          <h2 className="text-xl font-light text-gray-900 mb-6">Summary</h2>
          <div className="text-gray-600 leading-relaxed">
            In plain English, rather than marketing speak
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div>
              <div className="text-xs text-gray-400 font-mono uppercase tracking-wider mb-2">
                OVERALL POSITION
              </div>
              <div className="text-gray-600 leading-relaxed">
                {stats.totalPartners === 0 
                  ? "No partners yet. Time to start building relationships."
                  : stats.conversionRate > 15
                  ? `You're performing well with a ${stats.conversionRate}% conversion rate.`
                  : `Room for improvement. ${stats.conversionRate}% conversion suggests partnerships need attention.`
                }
              </div>
            </div>
            
            <div>
              <div className="text-xs text-gray-400 font-mono uppercase tracking-wider mb-2">
                TECHNICAL STATE
              </div>
              <div className="text-gray-600 leading-relaxed">
                {stats.activeReferrals > 0 
                  ? "Pipeline is active. Follow-up processes functioning."
                  : "No active referrals. Either partners aren't engaged or processes need work."
                }
              </div>
            </div>
            
            <div>
              <div className="text-xs text-gray-400 font-mono uppercase tracking-wider mb-2">
                NEXT STEPS
              </div>
              <div className="text-gray-600 leading-relaxed">
                {session?.user?.plan === 'free' && stats.totalPartners >= 2
                  ? "Consider upgrading to track more partners and access detailed analytics."
                  : stats.totalPartners < 5
                  ? "Focus on adding quality partners before optimizing processes."
                  : "Optimize existing partnerships. Data suggests refinement over expansion."
                }
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity - Clean List */}
        <div>
          <h2 className="text-xl font-light text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={activity.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div className="text-gray-600">
                    {activity.description}
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    {new Date(activity.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 italic">
                No recent activity. Add partners and referrals to see updates here.
              </div>
            )}
          </div>
        </div>

        {/* Upgrade Prompt for Free Users */}
        {session?.user?.plan === 'free' && (
          <div className="border border-gray-200 rounded p-8 bg-gray-50">
            <div className="text-center space-y-4">
              <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">
                UPGRADE AVAILABLE
              </div>
              <div className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
                Advanced analytics, unlimited partners, and detailed reporting available. 
                Probably more accurate than asking a consultant.
              </div>
              <button className="bg-gray-900 text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors">
                View Plans
              </button>
            </div>
          </div>
        )}
      </div>
    </MinimalistLayout>
  );
} 