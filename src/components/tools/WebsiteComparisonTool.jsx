import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const SEOTool = () => {
  const [searchParams] = useSearchParams();
  const [hasAccess, setHasAccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [formData, setFormData] = useState({
    yourWebsite: '',
    competitor1: '',
    competitor2: '',
    competitor3: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    // Check access
    const access = searchParams.get('access');
    const email = searchParams.get('email');
    
    if (access === 'granted' && email) {
      setHasAccess(true);
      setUserEmail(email);
    } else {
      // Redirect to home if no access
      window.location.href = '/';
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateUrls = (urls) => {
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return urls.every(url => url === '' || urlPattern.test(url));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateUrls(Object.values(formData))) {
      alert('Please enter valid URLs');
      return;
    }

    setIsLoading(true);
    
    try {
      // Real API call to backend for main website
      const mainRes = await fetch('http://localhost:3002/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formData.yourWebsite })
      });
      const mainResult = await mainRes.json();
      if (!mainRes.ok) throw new Error(mainResult.error || 'Failed to analyze main website');

      // Analyze competitors in parallel if provided
      const competitorUrls = [formData.competitor1, formData.competitor2, formData.competitor3].filter(Boolean);
      const competitorResults = {};
      if (competitorUrls.length > 0) {
        const competitorPromises = competitorUrls.map(async (url) => {
          const res = await fetch('http://localhost:3002/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
          });
          const result = await res.json();
          if (res.ok) {
            competitorResults[url] = result.scores || {};
          } else {
            competitorResults[url] = { error: result.error || 'Failed to analyze' };
          }
        });
        await Promise.all(competitorPromises);
      }

      setResults({
        seoScore: mainResult.scores?.overall ?? 0,
        performanceScore: mainResult.scores?.performance ?? 0,
        contentScore: mainResult.scores?.content ?? 0,
        technicalScore: mainResult.scores?.technical ?? 0,
        recommendations: mainResult.recommendations || [],
        competitors: competitorResults
      });
    } catch (error) {
      console.error('Error analyzing websites:', error);
      alert('Error analyzing websites. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasAccess) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light mb-4">SEO Tool</h1>
          <p className="text-gray-600">Compare your website's performance against competitors</p>
        </div>

        {!results ? (
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Website URL
                </label>
                <input
                  type="url"
                  name="yourWebsite"
                  value={formData.yourWebsite}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Competitor 1 URL
                </label>
                <input
                  type="url"
                  name="competitor1"
                  value={formData.competitor1}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="https://competitor1.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Competitor 2 URL
                </label>
                <input
                  type="url"
                  name="competitor2"
                  value={formData.competitor2}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="https://competitor2.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Competitor 3 URL
                </label>
                <input
                  type="url"
                  name="competitor3"
                  value={formData.competitor3}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="https://competitor3.com"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {isLoading ? 'Analyzing...' : 'Compare Websites'}
              </button>
            </div>
          </form>
        ) : (
          <div className="max-w-7xl mx-auto">
            {/* Overall Score */}
            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-light mb-6">Overall Performance</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-light mb-2">{results.seoScore}</div>
                  <div className="text-sm text-gray-600">SEO Score</div>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-light mb-2">{results.performanceScore}</div>
                  <div className="text-sm text-gray-600">Performance</div>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-light mb-2">{results.contentScore}</div>
                  <div className="text-sm text-gray-600">Content</div>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-light mb-2">{results.technicalScore}</div>
                  <div className="text-sm text-gray-600">Technical</div>
                </div>
              </div>
            </div>

            {/* Competitor Comparison */}
            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-light mb-6">Competitor Comparison</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-6">Website</th>
                      <th className="text-center py-4 px-6">SEO</th>
                      <th className="text-center py-4 px-6">Performance</th>
                      <th className="text-center py-4 px-6">Content</th>
                      <th className="text-center py-4 px-6">Technical</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(results.competitors).map(([url, scores]) => (
                      <tr key={url} className="border-b">
                        <td className="py-4 px-6">{url}</td>
                        <td className="text-center py-4 px-6">{scores.seoScore}</td>
                        <td className="text-center py-4 px-6">{scores.performanceScore}</td>
                        <td className="text-center py-4 px-6">{scores.contentScore}</td>
                        <td className="text-center py-4 px-6">{scores.technicalScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-light mb-6">Recommendations</h2>
              <ul className="space-y-4">
                {results.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">{rec}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => setResults(null)}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium"
              >
                New Comparison
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SEOTool; 