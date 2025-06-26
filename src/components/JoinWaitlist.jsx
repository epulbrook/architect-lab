import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const airtableLinks = {
  'seo-analyser': 'https://airtable.com/your-competitor-form-link',
  'partnership-health': 'https://airtable.com/your-referral-form-link',
  'gdpr-checker': 'https://airtable.com/appD9KctcGOuVwNty/pag4A0lIkGiz2666X/form',
};

const toolFields = {
  'seo-analyser': [
    { label: 'Email', name: 'email', type: 'email', required: true },
    { label: 'Company', name: 'company', type: 'text', required: true },
    { label: 'Your Website', name: 'website', type: 'text', required: true },
  ],
  'partnership-health': [
    { label: 'Email', name: 'email', type: 'email', required: true },
    { label: 'Company', name: 'company', type: 'text', required: true },
    { label: '# of Partners', name: 'partners', type: 'number', required: true },
  ],
  'gdpr-checker': [
    { label: 'Email', name: 'email', type: 'email', required: true },
    { label: 'Company', name: 'company', type: 'text', required: true },
    { label: 'Markets', name: 'markets', type: 'checkbox-group', options: ['EU', 'UK', 'US'], required: true },
  ],
};

const toolTitles = {
  'seo-analyser': 'Competitor Website Checker',
  'partnership-health': 'Referral Management Portal',
  'gdpr-checker': 'GDPR Compliance Checker',
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const JoinWaitlist = () => {
  const query = useQuery();
  const tool = query.get('tool');
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!tool || !toolFields[tool]) {
    return <div className="p-10">Invalid tool selected.</div>;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: prev[name] ? { ...prev[name], [value]: checked } : { [value]: checked },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-16">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6 text-black">Get Early Access</h2>
        <h3 className="text-lg font-medium mb-6 text-gray-700">{toolTitles[tool]}</h3>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {toolFields[tool].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                {field.type === 'checkbox-group' ? (
                  <div className="flex gap-4">
                    {field.options.map((opt) => (
                      <label key={opt} className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          name={field.name}
                          value={opt}
                          checked={formData[field.name]?.[opt] || false}
                          onChange={handleChange}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    required={field.required}
                  />
                )}
              </div>
            ))}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium mt-4"
            >
              Join Waitlist
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p className="mb-6 text-green-700 font-medium">Thank you for joining the waitlist!</p>
            <a
              href={airtableLinks[tool]}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block py-3 px-6 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium"
            >
              Go to Airtable Form
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinWaitlist; 