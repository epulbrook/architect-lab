import React, { useState } from 'react';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw22qkNZWcPWJHTpGfRfgCv0330XVo2owriai13UgJhVcFrye06dyFJ7VfWgwzsE1EWzQ/exec';

const GDPRWaitlist = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    company: '',
    regions: [],
    concern: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        regions: checked
          ? [...prev.regions, value]
          : prev.regions.filter((r) => r !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('email', formData.email);
    data.append('company', formData.company);
    data.append('regions', formData.regions.join(', '));
    data.append('concern', formData.concern);
    data.append('tool_interest', 'GDPR Compliance Checker');
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
        .hero::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.02) 0%, transparent 50%); pointer-events: none; }
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
        .checkbox-group { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 15px; margin-top: 10px; }
        .checkbox-item { display: flex; align-items: center; gap: 8px; }
        .checkbox-item input[type="checkbox"] { width: auto; margin: 0; accent-color: #1a1a1a; }
        .checkbox-item label { font-size: 0.9rem; text-transform: none; letter-spacing: 0; margin: 0; color: #333; }
        .submit-btn { width: 100%; padding: 18px; background: #1a1a1a; color: #ffffff; border: none; border-radius: 12px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 1px; }
        .submit-btn:hover { background: #333; transform: translateY(-2px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15); }
        .trust-note { text-align: center; margin-top: 20px; color: #999; font-size: 0.85rem; }
        @media (max-width: 968px) { .hero-content { grid-template-columns: 1fr; gap: 60px; text-align: center; } .headline { font-size: 3rem; } .features-grid { grid-template-columns: 1fr; gap: 40px; margin: 60px 0; } .form-card { padding: 30px; } .checkbox-group { grid-template-columns: 1fr; } }
        @media (max-width: 640px) { .headline { font-size: 2.5rem; } .subheadline { font-size: 1.1rem; } .form-card { padding: 25px; } }
      `}</style>
      <section className="hero waitlist-root">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="brand">The Architect Lab</div>
              <h1 className="headline">
                <strong>GDPR</strong><br />
                Compliance Checker
              </h1>
              <p className="subheadline">
                Because getting fined by the EU for mishandling customer data is not the kind of international recognition you want.
              </p>
              <div className="features-grid">
                <div className="feature-item">
                  <div className="feature-number">01</div>
                  <div className="feature-title">Luxury Brand Audit</div>
                  <div className="feature-desc">GDPR compliance that doesn't make your customers feel like they're filling out tax forms</div>
                </div>
                <div className="feature-item">
                  <div className="feature-number">02</div>
                  <div className="feature-title">Border Crossing</div>
                  <div className="feature-desc">Navigate international data laws without needing a law degree or existential crisis</div>
                </div>
                <div className="feature-item">
                  <div className="feature-number">03</div>
                  <div className="feature-title">Brand-Safe Solutions</div>
                  <div className="feature-desc">Stay compliant without turning your elegant checkout into a consent form nightmare</div>
                </div>
              </div>
            </div>
            <div className="form-card">
              <div className="form-header">
                <h2 className="form-title">Early Access</h2>
                <p className="form-subtitle">Beat the regulatory rush, avoid the panic</p>
              </div>
              {!submitted ? (
                <form onSubmit={handleSubmit} id="gdprForm">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="your@company.com" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="company">Company</label>
                    <input type="text" id="company" name="company" placeholder="Your Company" value={formData.company} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Operating Regions</label>
                    <div className="checkbox-group">
                      {['EU/EEA', 'UK', 'US', 'Asia'].map((region) => (
                        <div className="checkbox-item" key={region}>
                          <input
                            type="checkbox"
                            id={region}
                            name="regions"
                            value={region}
                            checked={formData.regions.includes(region)}
                            onChange={handleChange}
                          />
                          <label htmlFor={region}>{region}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="concern">Biggest Worry</label>
                    <select id="concern" name="concern" value={formData.concern} onChange={handleChange} required>
                      <option value="">What's keeping you up?</option>
                      <option value="consent">Getting consent without annoying customers</option>
                      <option value="breaches">What happens when things go wrong</option>
                      <option value="vendors">Third-party vendors being dodgy</option>
                      <option value="transfers">Moving data across borders legally</option>
                      <option value="rights">Customers wanting their data deleted</option>
                      <option value="unsure">Honestly, no idea where to start</option>
                    </select>
                  </div>
                  <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'Submitting...' : 'Join Waitlist'}</button>
                </form>
              ) : (
                <div className="trust-note">Brilliant! You're on the list.</div>
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

export default GDPRWaitlist; 