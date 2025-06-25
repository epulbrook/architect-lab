import { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import db from './db';

export const authOptions = {
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account.provider === 'email') {
        // Create or update user in database
        const stmt = db.prepare(`
          INSERT OR IGNORE INTO users (email) VALUES (?)
        `);
        stmt.run(user.email);
      }
      return true;
    },
    async session({ session, token }) {
      // Get user data from database
      const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
      const userData = stmt.get(session.user.email);
      
      session.user.id = userData?.id;
      session.user.plan = userData?.plan || 'free';
      session.user.companyName = userData?.company_name;
      
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
  },
}; 