import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function MinimalistSignup() {
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      sessionStorage.setItem('companyName', companyName);
      
      const result = await signIn('email', { 
        email, 
        callbackUrl: '/portal/dashboard',
        redirect: false 
      });
      
      if (result?.ok) {
        router.push('/auth/verify-request');
      }
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
            <span className="text-lg font-medium text-gray-900 tracking-tight">
              ADVOCATE PORTAL
            </span>
            <span className="ml-3 text-xs text-gray-400 font-mono uppercase tracking-wider">
              BETA.001
            </span>
          </div>
          <h1 className="text-3xl font-light text-gray-900 mb-4">
            Try Free
          </h1>
          <p className="text-gray-500 text-lg font-light leading-relaxed">
            A reasonably objective approach to partner referral tracking. 
            Results may contain traces of uncomfortable truths.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs text-gray-400 font-mono uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-3 text-gray-900 focus:outline-none focus:border-gray-400 transition-colors"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 font-mono uppercase tracking-wider mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-3 text-gray-900 focus:outline-none focus:border-gray-400 transition-colors"
              placeholder="Your Company"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Setting up account...' : 'Get Started'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center space-y-2">
          <div className="text-xs text-gray-400 space-y-1">
            <div>• No credit card required</div>
            <div>• Track up to 3 partners</div>
            <div>• Made by people who read the documentation</div>
          </div>
        </div>
      </div>
    </div>
  );
} 