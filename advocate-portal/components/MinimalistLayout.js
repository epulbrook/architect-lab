import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function MinimalistLayout({ children }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const navigation = [
    { name: 'Overview', href: '/portal/dashboard' },
    { name: 'Partners', href: '/portal/partners' },
    { name: 'Referrals', href: '/portal/referrals' },
    { name: 'Analytics', href: '/portal/analytics' },
    { name: 'Settings', href: '/portal/settings' },
  ];

  const isActive = (href) => router.pathname === href;

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
              <span className="text-lg font-medium text-gray-900 tracking-tight">
                ADVOCATE PORTAL
              </span>
              <span className="ml-3 text-xs text-gray-400 font-mono uppercase tracking-wider">
                {session?.user?.plan === 'free' ? 'BETA.001' : 'PRO.001'}
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm transition-colors ${
                    isActive(item.href)
                      ? 'text-gray-900 font-medium'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => signOut()}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                {session?.user?.email}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>
    </div>
  );
} 