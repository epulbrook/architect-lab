# Advocate Portal

A comprehensive B2B referral management portal built with Next.js, featuring partner tracking, referral analytics, and real-time dashboard.

## Features

- **Email Authentication** - Magic link authentication with NextAuth.js
- **Partner Management** - Track partner health scores and performance
- **Referral Pipeline** - Kanban-style referral tracking
- **Analytics Dashboard** - Real-time metrics and charts
- **Free Tier** - Limited to 3 partners, upgrade for unlimited
- **SQLite Database** - Local development with easy migration to production

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Email Provider (SendGrid recommended)
EMAIL_SERVER_HOST=smtp.sendgrid.net
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=apikey
EMAIL_SERVER_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com

# Stripe (for payments)
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the portal.

## Project Structure

```
advocate-portal/
├── components/
│   ├── Layout.js          # Main layout with sidebar
│   └── PaidFeature.js     # Feature gating component
├── lib/
│   ├── auth.js           # NextAuth configuration
│   └── db.js             # Database setup
├── pages/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth].js
│   │   ├── dashboard.js
│   │   └── partners.js
│   ├── portal/
│   │   ├── signup.js
│   │   └── dashboard.js
│   ├── _app.js
│   └── index.js
├── styles/
│   └── globals.css
└── package.json
```

## Database Schema

The portal uses SQLite with the following tables:

- **users** - User accounts and plan information
- **partners** - Partner information and health scores
- **referrals** - Referral leads and pipeline stages
- **activities** - User activity logging

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Other Platforms

For platforms that don't support SQLite, consider migrating to:
- **Supabase** - PostgreSQL with real-time features
- **PlanetScale** - MySQL-compatible serverless database
- **Railway** - PostgreSQL with easy setup

## Integration with Existing Site

To integrate this portal with your existing website:

1. **Add CTA Button** - Link to `/portal/signup` from your main site
2. **Shared Authentication** - Use the same NextAuth setup across both sites
3. **Consistent Styling** - Adapt Tailwind classes to match your design system
4. **Domain Setup** - Deploy both sites under the same domain

## API Endpoints

- `GET /api/dashboard` - Dashboard statistics and data
- `GET /api/partners` - List user's partners
- `POST /api/partners` - Add new partner

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details. 