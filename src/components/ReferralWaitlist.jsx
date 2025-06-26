import React, { useState } from 'react';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw22qkNZWcPWJHTpGfRfgCv0330XVo2owriai13UgJhVcFrye06dyFJ7VfWgwzsE1EWzQ/exec';

const ReferralWaitlist = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ email: '', company: '', partners: '', partnerEmail: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('email', formData.email);
    data.append('company', formData.company);
    data.append('partners', formData.partners);
    data.append('partner_email', formData.partnerEmail);
    data.append('tool_interest', 'Referral Management Portal');
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: data,
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body, .waitlist-root { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; background: #fafafa; color: #1a1a1a; overflow-x: hidden; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .hero { min-height: 100vh; display: flex; align-items: center; position: relative; background: linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%); }
        .hero::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 70% 30%, rgba(0, 0, 0, 0.02) 0%, transparent 50%); pointer-events: none; }
        .hero-content { display: grid; grid-template-columns: 1fr 380px; gap: 80px; width: 100%; align-items: center; }
        .hero-text { z-index: 2; }
        .brand { color: #666; font-size: 0.9rem; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px; }
        .headline { font-size: 3.8rem; font-weight: 300; line-height: 1.1; margin-bottom: 30px; color: #1a1a1a; }
        .headline strong { font-weight: 600; color: #333; }
        .subheadline { font-size: 1.25rem; color: #555; margin-bottom: 50px; font-weight: 300; line-height: 1.5; }
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin: 80px 0; }
        .feature-item { padding: 0; border-left: 2px solid #e1e1e1; padding-left: 20px; transition: border-color 0.3s ease; }
        .feature-item:hover { border-left-color: #999; }
        .feature-number { color: #999; font-size: 0.8rem; font-weight: 500; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
        .feature-title { color: #1a1a1a; font-size: 1.1rem; font-weight: 500; margin-bottom: 8px; }
        .feature-desc { color: #666; font-size: 0.95rem; line-height: 1.4; }
        .form-card { background: rgba(255, 255, 255, 0.8); border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 20px; padding: 40px; backdrop-filter: blur(20px); z-index: 2; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05); }
        .form-header { text-align: center; margin-bottom: 40px; }
        .form-title { font-size: 1.5rem; font-weight: 500; color: #1a1a1a; margin-bottom: 10px; }
        .form-subtitle { color: #666; font-size: 0.95rem; }
        .form-group { margin-bottom: 25px; }
        .form-group label { display: block; color: #333; font-size: 0.9rem; font-weight: 500; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
        .form-group input, .form-group select { width: 100%; padding: 16px 20px; background: rgba(255, 255, 255, 0.9); border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 12px; color: #1a1a1a; font-size: 1rem; transition: all 0.3s ease; }
        .form-group select { cursor: pointer; }
        .form-group input:focus, .form-group select:focus { outline: none; border-color: rgba(0, 0, 0, 0.3); background: rgba(255, 255, 255, 1); box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05); }
        .form-group input::placeholder { color: #999; }
        .form-group select option { background: #ffffff; color: #1a1a1a; }
        .submit-btn { width: 100%; padding: 18px; background: #1a1a1a; color: #ffffff; border: none; border-radius: 12px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 1px; }
        .submit-btn:hover { background: #333; transform: translateY(-2px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15); }
        .trust-note { text-align: center; margin-top: 20px; color: #999; font-size: 0.85rem; }
        @media (max-width: 968px) { .hero-content { grid-template-columns: 1fr; gap: 60px; text-align: center; } .headline { font-size: 3rem; } .features-grid { grid-template-columns: 1fr; gap: 40px; margin: 60px 0; } .form-card { padding: 30px; } }
        @media (max-width: 640px) { .headline { font-size: 2.5rem; } .subheadline { font-size: 1.1rem; } .form-card { padding: 25px; } }
      `}</style>
      <section className="hero waitlist-root">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="brand">The Architect Lab</div>
              <h1 className="headline">
                <strong>Referral</strong><br />
                Management Portal
              </h1>
              <p className="subheadline">
                Stop losing track of which partners actually bring in business and which ones just send you Christmas cards.
              </p>
              <div className="features-grid">
                <div className="feature-item">
                  <div className="feature-number">01</div>
                  <div className="feature-title">Partner Reality</div>
                  <div className="feature-desc">See who's actually worth their commission and who's just taking up space in your CRM</div>
                </div>
                <div className="feature-item">
                  <div className="feature-number">02</div>
                  <div className="feature-title">Deal Acceleration</div>
                  <div className="feature-desc">Turn your referral process from "eventually maybe" into "bloody hell, that was quick"</div>
                </div>
                <div className="feature-item">
                  <div className="feature-number">03</div>
                  <div className="feature-title">Proper Attribution</div>
                  <div className="feature-desc">Finally know where your revenue's actually coming from (hint: it's not your LinkedIn posts)</div>
                </div>
              </div>
            </div>
            <div className="form-card">
              <div className="form-header">
                <h2 className="form-title">Early Access</h2>
                <p className="form-subtitle">Get in before we iron out the inevitable bugs</p>
              </div>
              {!submitted ? (
                <form onSubmit={handleSubmit} id="referralForm">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="your@company.com" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="company">Company</label>
                    <input type="text" id="company" name="company" placeholder="Your Company" value={formData.company} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="partnerEmail">Partner Contact Email</label>
                    <input type="email" id="partnerEmail" name="partnerEmail" placeholder="partner@company.com" value={formData.partnerEmail} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="partners">Current Partners</label>
                    <select id="partners" name="partners" value={formData.partners} onChange={handleChange} required>
                      <option value="">How many you juggling?</option>
                      <option value="1-10">1-10 (manageable)</option>
                      <option value="10-25">10-25 (getting messy)</option>
                      <option value="25-50">25-50 (proper chaos)</option>
                      <option value="50-100">50-100 (good luck)</option>
                      <option value="100+">100+ (absolute madness)</option>
                    </select>
                  </div>
                  <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'Submitting...' : 'Join Waitlist'}</button>
                </form>
              ) : (
                <div className="trust-note">Legend! You're on the list.</div>
              )}
              <div className="trust-note">
                ✓ We won't spam you (we're not animals)
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReferralWaitlist; 