import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

const SEOTool = () => {
  const [formData, setFormData] = useState({
    yourWebsite: '',
    competitor1: '',
    competitor2: '',
    competitor3: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

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
    
    if (!formData.yourWebsite) {
      setError('Please enter your website URL');
      return;
    }

    if (!validateUrls([formData.yourWebsite, formData.competitor1, formData.competitor2, formData.competitor3].filter(Boolean))) {
      setError('Please enter valid URLs (including http:// or https://)');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      // Analyze your website
      const yourWebsiteResult = await analyzeWebsite(formData.yourWebsite);
      
      // Analyze competitors if provided
      const competitorResults = [];
      if (formData.competitor1) {
        try {
          competitorResults.push(await analyzeWebsite(formData.competitor1));
        } catch (error) {
          console.error(`Failed to analyze competitor 1: ${error.message}`);
          // Continue with other competitors
        }
      }
      if (formData.competitor2) {
        try {
          competitorResults.push(await analyzeWebsite(formData.competitor2));
        } catch (error) {
          console.error(`Failed to analyze competitor 2: ${error.message}`);
          // Continue with other competitors
        }
      }
      if (formData.competitor3) {
        try {
          competitorResults.push(await analyzeWebsite(formData.competitor3));
        } catch (error) {
          console.error(`Failed to analyze competitor 3: ${error.message}`);
          // Continue with other competitors
        }
      }

      setResults({
        yourWebsite: yourWebsiteResult,
        competitors: competitorResults
      });

    } catch (error) {
      console.error('Analysis error:', error);
      setError(`Failed to analyze your website: ${error.message}. Please check the URL and try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeWebsite = async (url) => {
    try {
      // Use deployed Vercel API endpoint instead of localhost
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? '/api/seo-analyzer' 
        : 'http://localhost:3001/api/analyze';
        
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Transform backend data to match frontend expectations
      return transformBackendResult(result);
    } catch (error) {
      console.error('API call failed:', error);
      throw new Error(`Failed to analyze ${url}: ${error.message}`);
    }
  };

  const transformBackendResult = (backendResult) => {
    // The backend returns detailed analysis, we need to transform it for the frontend
    const scores = {
      overall: Math.round((backendResult.scores.performance + backendResult.scores.content + backendResult.scores.technical + backendResult.scores.mobile) / 4),
      performance: backendResult.scores.performance || 0,
      content: backendResult.scores.content || 0,
      technical: backendResult.scores.technical || 0,
      mobile: backendResult.scores.mobile || 0,
      optimization: Math.round((backendResult.scores.content + backendResult.scores.technical) / 2)
    };

    // Generate recommendations based on actual backend analysis
    const recommendations = generateRecommendationsFromBackend(backendResult, scores);
    
    // Generate detailed analysis based on actual scores
    const detailedAnalysis = {
      performance: generatePerformanceAnalysis(scores.performance),
      content: generateContentAnalysis(scores.content),
      technical: generateTechnicalAnalysis(scores.technical),
      mobile: generateMobileAnalysis(scores.mobile),
      optimization: generateOptimizationAnalysis(scores.optimization)
    };

    return {
      url: backendResult.url,
      loadTime: backendResult.loadTime,
      scores,
      recommendations,
      detailedAnalysis,
      backendData: backendResult // Keep original backend data for reference
    };
  };

  const generateRecommendationsFromBackend = (backendResult, scores) => {
    const recommendations = [];
    
    // Use actual backend recommendations if available
    if (backendResult.recommendations && backendResult.recommendations.length > 0) {
      backendResult.recommendations.forEach((rec, index) => {
        recommendations.push({
          category: getCategoryFromRecommendation(rec),
          priority: index < 2 ? 'High' : 'Medium',
          title: getTitleFromRecommendation(rec),
          description: rec,
          actions: getActionsFromRecommendation(rec)
        });
      });
    }

    // Add specific recommendations based on actual scores
    if (scores.performance < 80) {
      recommendations.push({
        category: 'Performance',
        priority: 'High',
        title: 'Optimize Page Speed',
        description: `Your page loads in ${Math.round(backendResult.loadTime / 1000 * 10) / 10} seconds. Aim for under 2 seconds for better user experience and SEO rankings.`,
        actions: [
          'Compress and optimize images (use WebP format)',
          'Minify CSS, JavaScript, and HTML files',
          'Enable browser caching',
          'Use a CDN for static assets',
          'Remove unused CSS and JavaScript'
        ]
      });
    }

    if (scores.content < 80) {
      const wordCount = backendResult.details?.wordCount || 0;
      recommendations.push({
        category: 'Content',
        priority: 'Medium',
        title: 'Improve Content Quality',
        description: `Your content has ${wordCount} words. More comprehensive content typically performs better in search.`,
        actions: [
          'Add more H2 and H3 headings for better structure',
          'Include target keywords naturally in headings and first paragraph',
          'Write meta descriptions between 150-160 characters',
          'Add more relevant internal links',
          'Include FAQ sections for long-tail keywords'
        ]
      });
    }

    if (scores.technical < 80) {
      recommendations.push({
        category: 'Technical',
        priority: 'High',
        title: 'Fix Technical SEO Issues',
        description: 'Several technical issues are affecting your search visibility.',
        actions: [
          'Add structured data markup (JSON-LD)',
          'Create or update XML sitemap',
          'Fix broken internal links',
          'Add canonical URLs to prevent duplicate content',
          'Implement proper robots.txt file'
        ]
      });
    }

    if (scores.mobile < 80) {
      recommendations.push({
        category: 'Mobile',
        priority: 'High',
        title: 'Improve Mobile Experience',
        description: 'Mobile users may have difficulty navigating your site.',
        actions: [
          'Ensure touch targets are at least 44px wide',
          'Increase font size for mobile readability',
          'Optimize images for mobile devices',
          'Test mobile navigation usability',
          'Implement AMP pages for faster mobile loading'
        ]
      });
    }

    return recommendations;
  };

  const getCategoryFromRecommendation = (recommendation) => {
    const lowerRec = recommendation.toLowerCase();
    if (lowerRec.includes('performance') || lowerRec.includes('speed') || lowerRec.includes('load')) return 'Performance';
    if (lowerRec.includes('content') || lowerRec.includes('word') || lowerRec.includes('text')) return 'Content';
    if (lowerRec.includes('technical') || lowerRec.includes('ssl') || lowerRec.includes('canonical')) return 'Technical';
    if (lowerRec.includes('mobile') || lowerRec.includes('viewport') || lowerRec.includes('responsive')) return 'Mobile';
    return 'Optimization';
  };

  const getTitleFromRecommendation = (recommendation) => {
    const lowerRec = recommendation.toLowerCase();
    if (lowerRec.includes('performance') || lowerRec.includes('speed')) return 'Optimize Page Speed';
    if (lowerRec.includes('content') || lowerRec.includes('word')) return 'Improve Content Quality';
    if (lowerRec.includes('technical') || lowerRec.includes('ssl')) return 'Fix Technical SEO Issues';
    if (lowerRec.includes('mobile') || lowerRec.includes('viewport')) return 'Improve Mobile Experience';
    if (lowerRec.includes('link')) return 'Enhance Internal Linking';
    return 'SEO Optimization';
  };

  const getActionsFromRecommendation = (recommendation) => {
    // Extract specific actions from the recommendation text
    const actions = [];
    const lowerRec = recommendation.toLowerCase();
    
    if (lowerRec.includes('word')) {
      actions.push('Increase content length to meet industry standards');
    }
    if (lowerRec.includes('link')) {
      actions.push('Add more internal links to important pages');
    }
    if (lowerRec.includes('ssl')) {
      actions.push('Implement SSL certificate for secure browsing');
    }
    if (lowerRec.includes('viewport')) {
      actions.push('Add proper viewport meta tag for mobile optimization');
    }
    if (lowerRec.includes('canonical')) {
      actions.push('Add canonical URLs to prevent duplicate content');
    }
    if (lowerRec.includes('structured data')) {
      actions.push('Implement structured data markup (JSON-LD)');
    }
    
    // Add default actions if none were extracted
    if (actions.length === 0) {
      actions.push('Review and implement the specific recommendation');
      actions.push('Test changes in a staging environment');
      actions.push('Monitor performance improvements');
    }
    
    return actions;
  };

  const generatePerformanceAnalysis = (score) => {
    if (score >= 90) return {
      status: 'Excellent',
      message: 'Your site loads quickly and efficiently.',
      details: 'Page load time is under 2 seconds, which is ideal for user experience and SEO.'
    };
    if (score >= 80) return {
      status: 'Good',
      message: 'Performance is solid but could be optimized.',
      details: 'Consider image compression and code minification for faster loading.'
    };
    if (score >= 70) return {
      status: 'Needs Improvement',
      message: 'Page speed is affecting user experience.',
      details: 'Focus on reducing server response time and optimizing images.'
    };
    return {
      status: 'Poor',
      message: 'Significant performance issues detected.',
      details: 'Immediate attention needed for page speed optimization.'
    };
  };

  const generateContentAnalysis = (score) => {
    if (score >= 90) return {
      status: 'Excellent',
      message: 'Content is well-optimized and engaging.',
      details: 'Good keyword usage, proper heading structure, and valuable content.'
    };
    if (score >= 80) return {
      status: 'Good',
      message: 'Content quality is solid.',
      details: 'Minor improvements in keyword density and internal linking would help.'
    };
    if (score >= 70) return {
      status: 'Needs Improvement',
      message: 'Content could be better optimized.',
      details: 'Focus on keyword research and content structure.'
    };
    return {
      status: 'Poor',
      message: 'Content optimization needs significant work.',
      details: 'Requires comprehensive content strategy and keyword optimization.'
    };
  };

  const generateTechnicalAnalysis = (score) => {
    if (score >= 90) return {
      status: 'Excellent',
      message: 'Technical SEO is well-implemented.',
      details: 'Proper structured data, clean code, and good technical foundation.'
    };
    if (score >= 80) return {
      status: 'Good',
      message: 'Technical setup is solid.',
      details: 'Minor technical improvements would enhance search visibility.'
    };
    if (score >= 70) return {
      status: 'Needs Improvement',
      message: 'Some technical issues need attention.',
      details: 'Focus on structured data and site architecture.'
    };
    return {
      status: 'Poor',
      message: 'Technical SEO requires immediate attention.',
      details: 'Critical technical issues affecting search engine crawling and indexing.'
    };
  };

  const generateMobileAnalysis = (score) => {
    if (score >= 90) return {
      status: 'Excellent',
      message: 'Mobile experience is optimized.',
      details: 'Responsive design works well across all devices.'
    };
    if (score >= 80) return {
      status: 'Good',
      message: 'Mobile optimization is solid.',
      details: 'Minor improvements in touch targets and mobile navigation.'
    };
    if (score >= 70) return {
      status: 'Needs Improvement',
      message: 'Mobile experience could be better.',
      details: 'Focus on mobile-first design and touch-friendly navigation.'
    };
    return {
      status: 'Poor',
      message: 'Mobile optimization needs significant work.',
      details: 'Site may be difficult to use on mobile devices.'
    };
  };

  const generateOptimizationAnalysis = (score) => {
    if (score >= 90) return {
      status: 'Excellent',
      message: 'Site is well-optimized for users and search engines.',
      details: 'Good user experience, clear navigation, and search-friendly structure.'
    };
    if (score >= 80) return {
      status: 'Good',
      message: 'Optimization is solid.',
      details: 'Minor UX improvements would enhance engagement.'
    };
    if (score >= 70) return {
      status: 'Needs Improvement',
      message: 'Some optimization opportunities exist.',
      details: 'Focus on user experience and conversion optimization.'
    };
    return {
      status: 'Poor',
      message: 'Significant optimization needed.',
      details: 'Site needs comprehensive UX and conversion optimization.'
    };
  };

  const resetForm = () => {
    setResults(null);
    setError(null);
    setFormData({
      yourWebsite: '',
      competitor1: '',
      competitor2: '',
      competitor3: ''
    });
  };

  return (
    <>
      <Helmet>
        <title>Competitor Website Checker | The Architect Lab</title>
        <meta name="description" content="Compare your website to competitors instantly. Get actionable SEO and web performance insights with our Competitor Website Checker tool." />
        <link rel="canonical" href="https://thearchitectlab.com/seo-analyzer" />
      </Helmet>
      <div className="w-full max-h-[80vh] overflow-y-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light mb-2">Who's Actually Better?</h1>
          <p className="text-gray-600 text-base mb-2">A reasonably objective assessment of two websites. Results may contain traces of uncomfortable truths.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {!results ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Website URL <span className="text-red-500">*</span>
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
                Competitor 1 URL (optional)
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
                Competitor 2 URL (optional)
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
                Competitor 3 URL (optional)
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
              {isLoading ? 'Analyzing...' : 'Analyze Websites'}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Results Heading and Sassy Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-2">Results</h2>
              <p className="text-lg text-gray-700 mb-4 font-medium italic">
                {getSassySummary(results)}
              </p>
              <h3 className="text-xl font-light mb-4">Your Website Performance</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-light mb-1">{results.yourWebsite.scores.overall}</div>
                  <div className="text-xs text-gray-600">Overall SEO</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-light mb-1">{results.yourWebsite.scores.performance}</div>
                  <div className="text-xs text-gray-600">Performance</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-light mb-1">{results.yourWebsite.scores.content}</div>
                  <div className="text-xs text-gray-600">Content</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-light mb-1">{results.yourWebsite.scores.technical}</div>
                  <div className="text-xs text-gray-600">Technical</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-light mb-1">{results.yourWebsite.scores.mobile}</div>
                  <div className="text-xs text-gray-600">Mobile</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-light mb-1">{results.yourWebsite.scores.optimization}</div>
                  <div className="text-xs text-gray-600">Optimization</div>
                </div>
              </div>
            </div>

            {/* Detailed Analysis Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-light mb-6">Detailed Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-black">Performance</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      results.yourWebsite.detailedAnalysis.performance.status === 'Excellent' ? 'bg-green-100 text-green-800' :
                      results.yourWebsite.detailedAnalysis.performance.status === 'Good' ? 'bg-blue-100 text-blue-800' :
                      results.yourWebsite.detailedAnalysis.performance.status === 'Needs Improvement' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {results.yourWebsite.detailedAnalysis.performance.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{results.yourWebsite.detailedAnalysis.performance.message}</p>
                  <p className="text-xs text-gray-600">{results.yourWebsite.detailedAnalysis.performance.details}</p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-black">Content</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      results.yourWebsite.detailedAnalysis.content.status === 'Excellent' ? 'bg-green-100 text-green-800' :
                      results.yourWebsite.detailedAnalysis.content.status === 'Good' ? 'bg-blue-100 text-blue-800' :
                      results.yourWebsite.detailedAnalysis.content.status === 'Needs Improvement' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {results.yourWebsite.detailedAnalysis.content.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{results.yourWebsite.detailedAnalysis.content.message}</p>
                  <p className="text-xs text-gray-600">{results.yourWebsite.detailedAnalysis.content.details}</p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-black">Technical</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      results.yourWebsite.detailedAnalysis.technical.status === 'Excellent' ? 'bg-green-100 text-green-800' :
                      results.yourWebsite.detailedAnalysis.technical.status === 'Good' ? 'bg-blue-100 text-blue-800' :
                      results.yourWebsite.detailedAnalysis.technical.status === 'Needs Improvement' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {results.yourWebsite.detailedAnalysis.technical.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{results.yourWebsite.detailedAnalysis.technical.message}</p>
                  <p className="text-xs text-gray-600">{results.yourWebsite.detailedAnalysis.technical.details}</p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-black">Mobile</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      results.yourWebsite.detailedAnalysis.mobile.status === 'Excellent' ? 'bg-green-100 text-green-800' :
                      results.yourWebsite.detailedAnalysis.mobile.status === 'Good' ? 'bg-blue-100 text-blue-800' :
                      results.yourWebsite.detailedAnalysis.mobile.status === 'Needs Improvement' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {results.yourWebsite.detailedAnalysis.mobile.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{results.yourWebsite.detailedAnalysis.mobile.message}</p>
                  <p className="text-xs text-gray-600">{results.yourWebsite.detailedAnalysis.mobile.details}</p>
                </div>
              </div>
            </div>

            {/* Backend Analysis Details */}
            {results.yourWebsite.backendData && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-light mb-6">Technical Analysis Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.yourWebsite.backendData.explanations && Object.entries(results.yourWebsite.backendData.explanations).map(([key, explanation]) => (
                    <div key={key} className="bg-white p-4 rounded-lg">
                      <h3 className="font-medium text-black mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                      <p className="text-sm text-gray-700">{explanation}</p>
                    </div>
                  ))}
                </div>
                
                {/* Additional Backend Data */}
                {results.yourWebsite.backendData.details && (
                  <div className="mt-6">
                    <h3 className="font-medium text-black mb-4">Page Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white p-3 rounded-lg text-center">
                        <div className="text-lg font-light">{results.yourWebsite.backendData.details.wordCount || 0}</div>
                        <div className="text-xs text-gray-600">Words</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg text-center">
                        <div className="text-lg font-light">{results.yourWebsite.backendData.details.images || 0}</div>
                        <div className="text-xs text-gray-600">Images</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg text-center">
                        <div className="text-lg font-light">{results.yourWebsite.backendData.details.internalLinks || 0}</div>
                        <div className="text-xs text-gray-600">Internal Links</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg text-center">
                        <div className="text-lg font-light">{results.yourWebsite.backendData.details.schemaCount || 0}</div>
                        <div className="text-xs text-gray-600">Schema Markup</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Actionable Recommendations */}
            {results.yourWebsite.recommendations.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-light mb-6">Actionable Recommendations</h2>
                <div className="space-y-4">
                  {results.yourWebsite.recommendations.map((rec, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border-l-4 border-black">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-black">{rec.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          rec.priority === 'High' ? 'bg-red-100 text-red-800' :
                          rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {rec.priority} Priority
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{rec.description}</p>
                      <div>
                        <h4 className="text-xs font-medium text-gray-800 mb-2 uppercase tracking-wide">Actions to take:</h4>
                        <ul className="space-y-1">
                          {rec.actions.map((action, actionIndex) => (
                            <li key={actionIndex} className="text-sm text-gray-700 flex items-start">
                              <span className="text-black mr-2">•</span>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Competitor Comparison */}
            {Object.keys(results.competitors).length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-light mb-4">Competitor Comparison</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3">Website</th>
                        <th className="text-center py-2 px-3">SEO</th>
                        <th className="text-center py-2 px-3">Performance</th>
                        <th className="text-center py-2 px-3">Content</th>
                        <th className="text-center py-2 px-3">Technical</th>
                        <th className="text-center py-2 px-3">Mobile</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(results.competitors).map(([url, competitor]) => (
                        <tr key={url} className="border-b border-gray-100">
                          <td className="py-2 px-3 text-xs truncate max-w-[120px]" title={url}>
                            {url.replace(/^https?:\/\//, '')}
                          </td>
                          <td className="text-center py-2 px-3">{competitor.scores.overall}</td>
                          <td className="text-center py-2 px-3">{competitor.scores.performance}</td>
                          <td className="text-center py-2 px-3">{competitor.scores.content}</td>
                          <td className="text-center py-2 px-3">{competitor.scores.technical}</td>
                          <td className="text-center py-2 px-3">{competitor.scores.mobile}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Summary Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-2">Summary</h2>
              <p className="text-gray-700 mb-4 italic">In plain English, rather than marketing speak</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-6">
                <div>
                  <div className="font-semibold tracking-wide text-gray-800 mb-2 text-sm uppercase">Overall Position</div>
                  <div className="text-gray-700 text-base">{getOverallPosition(results)}</div>
                </div>
                <div>
                  <div className="font-semibold tracking-wide text-gray-800 mb-2 text-sm uppercase">Technical State</div>
                  <div className="text-gray-700 text-base">{getTechnicalState(results)}</div>
                </div>
                <div>
                  <div className="font-semibold tracking-wide text-gray-800 mb-2 text-sm uppercase">Next Steps</div>
                  <div className="text-gray-700 text-base">{getNextSteps(results)}</div>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="text-center pt-4 pb-2 text-xs text-gray-500 italic">
              Made by people who read the documentation. Probably more accurate than asking a consultant.
            </div>

            <div className="text-center pt-4">
              <button
                onClick={resetForm}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium"
              >
                New Analysis
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Helper function for sassy summary
function getSassySummary(results) {
  if (!results || !results.competitors || results.competitors.length === 0) {
    return "Let's see how you stack up!";
  }
  const yourScore = results.yourWebsite.scores.overall;
  const competitorScore = results.competitors[0]?.scores?.overall;
  if (competitorScore === undefined) return "Let's see how you stack up!";
  const diff = yourScore - competitorScore;
  if (diff > 10) return "You're ahead by a whisker.";
  if (diff > 0) return "You're just ahead – but don't get cocky!";
  if (diff === 0) return "It's neck and neck! Time to up your game.";
  if (diff > -10) return "Your competitor is nipping at your heels!";
  return "Your competitor is ahead – but it's nothing a good cuppa and some tweaks can't fix.";
}

// Helper functions for summary columns
function getOverallPosition(results) {
  if (!results || !results.competitors || results.competitors.length === 0) {
    return "No competitor provided. You're in a league of your own!";
  }
  const yourScore = results.yourWebsite.scores.overall;
  const competitorScore = results.competitors[0]?.scores?.overall;
  const diff = yourScore - competitorScore;
  if (Math.abs(diff) < 5) return `Practically identical by ${Math.abs(diff)} points.`;
  if (diff > 0) return `You're ahead by ${diff} points.`;
  return `Competitor is ahead by ${Math.abs(diff)} points.`;
}

function getTechnicalState(results) {
  if (!results) return "No data.";
  const tech = results.yourWebsite.scores.technical;
  if (tech > 80) return "Technical setup is excellent. No major issues detected.";
  if (tech > 60) return "Technical setup is competent. Performance could be improved.";
  return "Technical issues detected. Needs attention.";
}

function getNextSteps(results) {
  if (!results) return "No data.";
  const perf = results.yourWebsite.scores.performance;
  if (perf > 80) return "Keep up the good work. Just a few tweaks left.";
  if (perf > 60) return "Some optimisation would help. Some catching up required.";
  return "Significant improvements needed. Time to roll up your sleeves.";
}

export default SEOTool; 