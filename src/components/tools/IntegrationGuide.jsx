import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const IntegrationGuide = () => {
  const [activeStep, setActiveStep] = useState(1);
  const navigate = useNavigate();

  const steps = [
    {
      id: 1,
      title: "Update package.json",
      description: "Add required dependencies to your existing project",
      content: `Add these dependencies to your existing \`package.json\`:

\`\`\`json
{
  "dependencies": {
    "next-auth": "^4.24.5",
    "stripe": "^14.9.0",
    "better-sqlite3": "^9.2.2",
    "recharts": "^2.8.0",
    "react-dnd": "^16.0.1",
    "react-dnd-html5-backend": "^16.0.1",
    "nodemailer": "^6.9.7",
    "csv-writer": "^1.6.0"
  }
}
\`\`\`

Then run: \`npm install\``
    },
    {
      id: 2,
      title: "Create Portal File Structure",
      description: "Add the portal files to your existing project",
      content: `Add these files to your existing project:

\`\`\`
your-existing-site/
├── lib/
│   ├── db.js (database setup)
│   └── auth.js (NextAuth config)
├── components/
│   ├── portal/
│   │   ├── Layout.js
│   │   └── PaidFeature.js
├── pages/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth].js
│   │   ├── dashboard.js
│   │   └── partners.js
│   └── portal/
│       ├── signup.js
│       ├── dashboard.js
│       ├── partners.js
│       ├── referrals.js
│       └── analytics.js
\`\`\``
    },
    {
      id: 3,
      title: "Update Your Existing CTA Button",
      description: "Modify your current homepage CTA to link to the portal",
      content: `In your current homepage component, update the CTA:

\`\`\`jsx
// Before
<Link href="/contact" className="...">
  Get Started
</Link>

// After  
<Link href="/portal/signup" className="...">
  Try Advocate Portal Free
</Link>
\`\`\``
    },
    {
      id: 4,
      title: "Add Environment Variables",
      description: "Configure authentication and payment settings",
      content: `Create/update your \`.env.local\`:

\`\`\`env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Email Provider (for magic links)
EMAIL_SERVER_HOST=smtp.sendgrid.net
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=apikey
EMAIL_SERVER_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=noreply@thearchitectlab.com

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
\`\`\``
    },
    {
      id: 5,
      title: "Create NextAuth API Route",
      description: "Set up authentication for the portal",
      content: `Create \`pages/api/auth/[...nextauth].js\`:

\`\`\`javascript
import NextAuth from 'next-auth'
import { authOptions } from '../../../lib/auth'

export default NextAuth(authOptions)
\`\`\``
    },
    {
      id: 6,
      title: "Protect Portal Routes",
      description: "Add authentication checks to portal pages",
      content: `Add this to any portal page:

\`\`\`javascript
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function PortalPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading
    if (!session) router.push('/portal/signup')
  }, [session, status])

  if (!session) return <div>Loading...</div>

  return (
    // Your portal content
  )
}
\`\`\``
    },
    {
      id: 7,
      title: "Add Portal Navigation",
      description: "Update your main navigation to include portal access",
      content: `Update your existing navigation to include portal access:

\`\`\`jsx
// In your main navigation component
import { useSession } from 'next-auth/react'

export default function Navigation() {
  const { data: session } = useSession()
  
  return (
    <nav>
      {/* Your existing nav items */}
      {session ? (
        <Link href="/portal/dashboard">Portal</Link>
      ) : (
        <Link href="/portal/signup">Try Portal Free</Link>
      )}
    </nav>
  )
}
\`\`\``
    },
    {
      id: 8,
      title: "Database Setup",
      description: "Configure the database for development and production",
      content: `**Development:**
The SQLite database will be created automatically in your project root.

**Production:**
Consider migrating to Supabase or PlanetScale for better scalability.

\`\`\`bash
# For Supabase
npm install @supabase/supabase-js

# For PlanetScale
npm install @planetscale/database
\`\`\``
    },
    {
      id: 9,
      title: "Styling Integration",
      description: "Integrate portal styling with your existing design system",
      content: `The portal uses Tailwind classes. Choose your approach:

**Option A:** Use Tailwind for portal pages only
**Option B:** Adapt the portal components to use your existing CSS framework
**Option C:** Create a hybrid approach with CSS modules

Example hybrid approach:
\`\`\`jsx
// components/portal/Layout.js
import styles from './PortalLayout.module.css'

export default function PortalLayout({ children }) {
  return (
    <div className={\`\${styles.portalContainer} bg-white\`}>
      {children}
    </div>
  )
}
\`\`\``
    },
    {
      id: 10,
      title: "Build & Test Locally",
      description: "Test the portal integration on your local development server",
      content: `\`\`\`bash
npm install
npm run dev
\`\`\`

Test the flow:
1. Visit \`/portal/signup\`
2. Enter email and company
3. Check email for magic link
4. Access portal dashboard

**Common Issues:**
- Ensure all environment variables are set
- Check that NextAuth is properly configured
- Verify database connection
- Test email delivery for magic links`
    },
    {
      id: 11,
      title: "Deployment Considerations",
      description: "Deploy your integrated portal to production",
      content: `**Vercel (Recommended):**
- Deploy as normal - Vercel handles everything
- Set environment variables in Vercel dashboard
- SQLite works fine for MVP

**Other Hosts:**
- May need to switch to Postgres/MySQL for some hosts
- Ensure serverless functions support Node.js

**Environment Variables for Production:**
\`\`\`env
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-production-secret
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
\`\`\``
    }
  ];

  const handleBackToPortal = () => {
    navigate('/tools/partnership-health');
  };

  return (
    <div className="w-full min-h-screen bg-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={handleBackToPortal}
            className="text-gray-600 hover:text-black mb-6 flex items-center"
          >
            ← Back to Referral Management Portal
          </button>
          <h1 className="text-4xl md:text-6xl font-light mb-6 text-black tracking-tight">
            Integration Guide
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl">
            Adding Advocate Portal to Your Existing Site. Follow these steps to integrate the Referral Management Portal into your current website.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="bg-gray-50 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-light mb-6 text-black">Benefits of This Approach</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <span className="text-green-500 mr-3 mt-1">✅</span>
              <div>
                <h3 className="font-medium text-black mb-1">Single codebase</h3>
                <p className="text-sm text-gray-700">Easier maintenance and updates</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-3 mt-1">✅</span>
              <div>
                <h3 className="font-medium text-black mb-1">Shared authentication</h3>
                <p className="text-sm text-gray-700">Users stay logged in across site</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-3 mt-1">✅</span>
              <div>
                <h3 className="font-medium text-black mb-1">SEO benefits</h3>
                <p className="text-sm text-gray-700">Portal pages indexed under main domain</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-3 mt-1">✅</span>
              <div>
                <h3 className="font-medium text-black mb-1">Consistent branding</h3>
                <p className="text-sm text-gray-700">Same domain, unified experience</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-3 mt-1">✅</span>
              <div>
                <h3 className="font-medium text-black mb-1">Cost effective</h3>
                <p className="text-sm text-gray-700">No additional hosting needed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Steps Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeStep === step.id
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Step {step.id}
              </button>
            ))}
          </div>
        </div>

        {/* Active Step Content */}
        <div className="bg-gray-50 rounded-xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-light mb-2 text-black">
              Step {activeStep}: {steps[activeStep - 1].title}
            </h2>
            <p className="text-gray-700">{steps[activeStep - 1].description}</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-x-auto">
              {steps[activeStep - 1].content}
            </pre>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
            disabled={activeStep === 1}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous Step
          </button>
          
          <button
            onClick={() => setActiveStep(Math.min(steps.length, activeStep + 1))}
            disabled={activeStep === steps.length}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Step
          </button>
        </div>

        {/* Alternative Quick Test */}
        <div className="mt-16 bg-blue-50 rounded-xl p-8">
          <h2 className="text-2xl font-light mb-4 text-black">Alternative: Quick Test Deployment</h2>
          <p className="text-gray-700 mb-6">
            If you want to test quickly first, you can:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Create a new Next.js project with just the portal</li>
            <li>Deploy to Vercel as <code className="bg-blue-100 px-2 py-1 rounded">portal-test.vercel.app</code></li>
            <li>Link from your main site temporarily</li>
            <li>Migrate to integrated approach once tested</li>
          </ol>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={handleBackToPortal}
            className="px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
          >
            Back to Referral Management Portal
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntegrationGuide; 