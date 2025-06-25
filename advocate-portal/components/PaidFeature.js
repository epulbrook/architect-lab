import { useSession } from 'next-auth/react';
import { Lock } from 'lucide-react';
import Link from 'next/link';

export default function PaidFeature({ children, requiredPlan = 'pro', feature }) {
  const { data: session } = useSession();
  
  const hasAccess = session?.user?.plan !== 'free';
  
  if (hasAccess) {
    return children;
  }
  
  return (
    <div className="relative">
      <div className="filter blur-sm pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg border">
          <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Upgrade to unlock {feature}
          </h3>
          <p className="text-gray-600 mb-4">
            Get advanced analytics and unlimited partners
          </p>
          <Link
            href="/portal/settings"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Upgrade Now
          </Link>
        </div>
      </div>
    </div>
  );
} 