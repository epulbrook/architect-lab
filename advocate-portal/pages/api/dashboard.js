import db from '../../lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const userId = session.user.id;

    // Get stats
    const partnersCount = db.prepare('SELECT COUNT(*) as count FROM partners WHERE user_id = ?').get(userId);
    const referralsCount = db.prepare('SELECT COUNT(*) as count FROM referrals WHERE user_id = ? AND stage != "closed"').get(userId);
    const revenueSum = db.prepare('SELECT SUM(deal_size) as total FROM referrals WHERE user_id = ? AND stage = "closed"').get(userId);
    const totalReferrals = db.prepare('SELECT COUNT(*) as count FROM referrals WHERE user_id = ?').get(userId);
    const closedReferrals = db.prepare('SELECT COUNT(*) as count FROM referrals WHERE user_id = ? AND stage = "closed"').get(userId);

    const stats = {
      totalPartners: partnersCount.count,
      activeReferrals: referralsCount.count,
      totalRevenue: revenueSum.total || 0,
      conversionRate: totalReferrals.count > 0 ? Math.round((closedReferrals.count / totalReferrals.count) * 100) : 0
    };

    // Get recent activity
    const recentActivity = db.prepare(`
      SELECT * FROM activities 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 10
    `).all(userId);

    // Get top partners by health score
    const topPartners = db.prepare(`
      SELECT * FROM partners 
      WHERE user_id = ? 
      ORDER BY health_score DESC 
      LIMIT 5
    `).all(userId);

    res.json({
      stats,
      recentActivity,
      topPartners
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 