import db from '../../lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = session.user.id;
  const userPlan = session.user.plan || 'free';

  if (req.method === 'GET') {
    try {
      const partners = db.prepare(`
        SELECT p.*, 
               COUNT(r.id) as referral_count,
               AVG(CASE WHEN r.stage = 'closed' THEN r.deal_size END) as avg_deal_size,
               COUNT(CASE WHEN r.stage = 'closed' THEN 1 END) * 100.0 / NULLIF(COUNT(r.id), 0) as conversion_rate
        FROM partners p
        LEFT JOIN referrals r ON p.id = r.partner_id
        WHERE p.user_id = ?
        GROUP BY p.id
        ORDER BY p.health_score DESC
      `).all(userId);

      res.json(partners);
    } catch (error) {
      console.error('Error fetching partners:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      // Check free tier limit
      if (userPlan === 'free') {
        const count = db.prepare('SELECT COUNT(*) as count FROM partners WHERE user_id = ?').get(userId);
        if (count.count >= 3) {
          return res.status(400).json({ error: 'Free tier limited to 3 partners. Upgrade to add more.' });
        }
      }

      const { name, email, company, tags } = req.body;
      
      const stmt = db.prepare(`
        INSERT INTO partners (user_id, name, email, company, tags, health_score)
        VALUES (?, ?, ?, ?, ?, 50)
      `);
      
      const result = stmt.run(userId, name, email, company, tags);
      
      // Log activity
      const activityStmt = db.prepare(`
        INSERT INTO activities (user_id, type, description, related_id)
        VALUES (?, 'partner_added', ?, ?)
      `);
      activityStmt.run(userId, `Added new partner: ${name}`, result.lastInsertRowid);

      res.json({ id: result.lastInsertRowid, message: 'Partner added successfully' });
    } catch (error) {
      console.error('Error adding partner:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 