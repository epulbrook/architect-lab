import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  BarChart3, 
  Settings, 
  Bell,
  Menu,
  X,
  Plus
} from 'lucide-react';

export default function Layout({ children }) {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const navigation = [
    { name: 'Dashboard', href: '/portal/dashboard', icon: LayoutDashboard },
    { name: 'Partners', href: '/portal/partners', icon: Users },
    { name: 'Referrals', href: '/portal/referrals', icon: UserPlus },
    { name: 'Analytics', href: '/portal/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/portal/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 lg:translate-x-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Advocate Portal</h1>
            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
              session?.user?.plan === 'free' 
                ? 'bg-gray-100 text-gray-600' 
                : 'bg-blue-100 text-blue-600'
            }`}>
              {session?.user?.plan?.toUpperCase() || 'FREE'}
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 px-6 bg-white border-b">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-4">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </button>
            <Bell className="h-6 w-6 text-gray-500" />
            <div className="relative">
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
              >
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  {session?.user?.email?.[0]?.toUpperCase()}
                </div>
                <span className="hidden md:block">{session?.user?.email}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 