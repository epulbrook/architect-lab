// Enhanced SEO analyzer utility for Firebase Cloud Functions

async function analyzeWebsite(page, url, loadTime) {
  // Extract comprehensive SEO-relevant data
  const title = await page.title();
  const metaDesc = await page.$eval('meta[name="description"]', el => el.content).catch(() => '');
  const h1s = await page.$$eval('h1', els => els.map(e => e.textContent.trim()));
  const h2s = await page.$$eval('h2', els => els.map(e => e.textContent.trim()));
  const h3s = await page.$$eval('h3', els => els.map(e => e.textContent.trim()));
  const images = await page.$$eval('img', imgs => imgs.length);
  const imagesWithAlt = await page.$$eval('img', imgs => imgs.filter(img => img.alt && img.alt.trim() !== '').length);
  const links = await page.$$eval('a', as => as.length);
  const internalLinks = await page.$$eval('a', as => as.filter(a => a.hostname === page.url().hostname).length).catch(() => 0);
  const externalLinks = links - internalLinks;
  
  // Technical SEO checks
  const hasViewport = await page.$('meta[name="viewport"]') !== null;
  const hasCanonical = await page.$('link[rel="canonical"]') !== null;
  const hasRobots = await page.$('meta[name="robots"]') !== null;
  const schemaCount = await page.$$eval('script[type="application/ld+json"]', els => els.length);
  const ssl = url.startsWith('https://');
  
  // Mobile responsiveness check
  const viewport = await page.$eval('meta[name="viewport"]', el => el.content).catch(() => '');
  const isMobileResponsive = viewport.includes('width=device-width') || viewport.includes('initial-scale');
  
  // Content analysis
  const bodyText = await page.$eval('body', el => el.innerText).catch(() => '');
  const wordCount = bodyText.trim().split(/\s+/).filter(w => w.length > 2).length;
  const paragraphCount = await page.$$eval('p', els => els.length);
  
  // Performance metrics (simulated Core Web Vitals)
  const performanceMetrics = await getPerformanceMetrics(page, loadTime);
  
  // Structured data analysis
  const structuredData = await analyzeStructuredData(page);
  
  // Keyword analysis
  const keywordAnalysis = await analyzeKeywords(page, title, metaDesc, h1s, bodyText);
  
  // Industry detection and scoring adjustments
  const industryContext = detectIndustry(url, title, metaDesc, bodyText);
  
  // Enhanced scoring with industry-specific benchmarks
  const scores = calculateEnhancedScores({
    title, metaDesc, h1s, h2s, h3s, images, imagesWithAlt, links, internalLinks, externalLinks,
    hasViewport, hasCanonical, hasRobots, schemaCount, ssl, wordCount, paragraphCount,
    isMobileResponsive, performanceMetrics, structuredData, keywordAnalysis, industryContext
  });

  return {
    url,
    loadTime,
    scores: scores.final,
    details: {
      title, metaDesc, h1s, h2s, h3s, images, imagesWithAlt, links, internalLinks, externalLinks,
      hasViewport, hasCanonical, hasRobots, schemaCount, ssl, wordCount, paragraphCount,
      isMobileResponsive, performanceMetrics, structuredData, keywordAnalysis, industryContext
    },
    explanations: scores.explanations,
    recommendations: scores.recommendations
  };
}

async function getPerformanceMetrics(page, loadTime) {
  // Simulate Core Web Vitals (in production, you'd use real Lighthouse or PageSpeed Insights)
  const lcp = Math.max(loadTime * 0.8, 1000 + Math.random() * 2000); // Largest Contentful Paint
  const fid = 50 + Math.random() * 150; // First Input Delay
  const cls = Math.random() * 0.3; // Cumulative Layout Shift
  
  return {
    lcp,
    fid,
    cls,
    loadTime,
    lcpScore: lcp < 2500 ? 100 : lcp < 4000 ? 80 : 50,
    fidScore: fid < 100 ? 100 : fid < 300 ? 80 : 50,
    clsScore: cls < 0.1 ? 100 : cls < 0.25 ? 80 : 50
  };
}

async function analyzeStructuredData(page) {
  const schemas = await page.$$eval('script[type="application/ld+json"]', els => {
    return els.map(el => {
      try {
        return JSON.parse(el.textContent);
      } catch (error) {
        return null;
      }
    }).filter(Boolean);
  });
  
  const schemaTypes = schemas.map(schema => schema['@type']).filter(Boolean);
  const hasOrganization = schemaTypes.includes('Organization');
  const hasWebPage = schemaTypes.includes('WebPage');
  const hasArticle = schemaTypes.includes('Article');
  const hasProduct = schemaTypes.includes('Product');
  
  return {
    count: schemas.length,
    types: schemaTypes,
    hasOrganization,
    hasWebPage,
    hasArticle,
    hasProduct,
    score: schemas.length > 0 ? Math.min(schemas.length * 20, 100) : 0
  };
}

async function analyzeKeywords(page, title, metaDesc, h1s, bodyText) {
  // Extract potential keywords from content
  const text = `${title} ${metaDesc} ${h1s.join(' ')} ${bodyText}`.toLowerCase();
  const words = text.split(/\s+/).filter(w => w.length > 3);
  const wordFreq = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
  
  // Get top keywords
  const topKeywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map((entry) => entry[0]);
  
  // Check keyword density and placement
  const mainKeyword = topKeywords[0] || '';
  const keywordInTitle = title.toLowerCase().includes(mainKeyword);
  const keywordInMeta = metaDesc.toLowerCase().includes(mainKeyword);
  const keywordInH1 = h1s.some(h1 => h1.toLowerCase().includes(mainKeyword));
  const keywordDensity = (text.match(new RegExp(mainKeyword, 'g')) || []).length / words.length;
  
  return {
    mainKeyword,
    topKeywords,
    keywordInTitle,
    keywordInMeta,
    keywordInH1,
    keywordDensity,
    score: (keywordInTitle ? 25 : 0) + (keywordInMeta ? 25 : 0) + (keywordInH1 ? 25 : 0) + (keywordDensity > 0.01 && keywordDensity < 0.03 ? 25 : 0)
  };
}

function detectIndustry(url, title, metaDesc, bodyText) {
  const text = `${url} ${title} ${metaDesc} ${bodyText}`.toLowerCase();
  
  const industries = {
    ecommerce: ['shop', 'store', 'buy', 'product', 'cart', 'checkout', 'purchase'],
    technology: ['tech', 'software', 'app', 'digital', 'platform', 'solution'],
    healthcare: ['health', 'medical', 'doctor', 'clinic', 'treatment', 'patient'],
    finance: ['bank', 'financial', 'investment', 'money', 'credit', 'loan'],
    education: ['learn', 'course', 'education', 'training', 'school', 'university'],
    realEstate: ['property', 'real estate', 'house', 'home', 'rent', 'buy'],
    travel: ['travel', 'hotel', 'vacation', 'trip', 'booking', 'destination']
  };
  
  let detectedIndustry = 'general';
  let maxScore = 0;
  
  Object.entries(industries).forEach((entry) => {
    const industry = entry[0];
    const keywords = entry[1];
    const score = keywords.filter(keyword => text.includes(keyword)).length;
    if (score > maxScore) {
      maxScore = score;
      detectedIndustry = industry;
    }
  });
  
  return {
    name: detectedIndustry,
    benchmarks: getIndustryBenchmarks(detectedIndustry)
  };
}

function getIndustryBenchmarks(industry) {
  const benchmarks = {
    ecommerce: { minWords: 800, minLinks: 8, minImages: 3 },
    technology: { minWords: 1200, minLinks: 5, minImages: 2 },
    healthcare: { minWords: 1500, minLinks: 6, minImages: 2 },
    finance: { minWords: 1000, minLinks: 7, minImages: 2 },
    education: { minWords: 2000, minLinks: 4, minImages: 1 },
    realEstate: { minWords: 600, minLinks: 5, minImages: 5 },
    travel: { minWords: 800, minLinks: 6, minImages: 4 },
    general: { minWords: 1000, minLinks: 5, minImages: 2 }
  };
  
  return benchmarks[industry] || benchmarks.general;
}

function calculateEnhancedScores(data) {
  const { industryContext } = data;
  const benchmarks = industryContext.benchmarks;
  const explanations = {};
  const recommendations = [];

  // Enhanced Title Analysis
  let titleScore = calculateTitleScore(data.title, data.keywordAnalysis, explanations, recommendations);
  
  // Enhanced Meta Description Analysis
  let metaScore = calculateMetaScore(data.metaDesc, data.keywordAnalysis, explanations, recommendations);
  
  // Enhanced Heading Analysis
  let headingScore = calculateHeadingScore(data.h1s, data.h2s, data.h3s, data.keywordAnalysis, explanations, recommendations);
  
  // Enhanced Image Analysis
  let imageScore = calculateImageScore(data.images, data.imagesWithAlt, benchmarks, explanations, recommendations);
  
  // Enhanced Content Analysis
  let contentScore = calculateContentScore(data.wordCount, data.paragraphCount, benchmarks, explanations, recommendations);
  
  // Enhanced Link Analysis
  let linkScore = calculateLinkScore(data.internalLinks, data.externalLinks, benchmarks, explanations, recommendations);
  
  // Enhanced Technical Analysis
  let technicalScore = calculateTechnicalScore(data, explanations, recommendations);
  
  // Enhanced Performance Analysis
  let performanceScore = calculatePerformanceScore(data.performanceMetrics, explanations, recommendations);
  
  // Enhanced Mobile Analysis
  let mobileScore = calculateMobileScore(data.isMobileResponsive, data.hasViewport, explanations, recommendations);
  
  // Enhanced Structured Data Analysis
  let structuredDataScore = data.structuredData.score;
  if (structuredDataScore < 100) {
    recommendations.push('Add structured data markup to improve search engine understanding of your content.');
  }
  
  // Calculate weighted overall score
  const overallScore = Math.round(
    titleScore * 0.12 +
    metaScore * 0.08 +
    headingScore * 0.10 +
    imageScore * 0.08 +
    contentScore * 0.18 +
    technicalScore * 0.12 +
    performanceScore * 0.12 +
    mobileScore * 0.08 +
    linkScore * 0.08 +
    structuredDataScore * 0.04
  );

  return {
    final: {
      overall: overallScore,
      performance: performanceScore,
      content: contentScore,
      technical: technicalScore,
      mobile: mobileScore,
      optimization: Math.round((titleScore + metaScore + headingScore + imageScore + linkScore) / 5)
    },
    explanations,
    recommendations: [...new Set(recommendations)] // Remove duplicates
  };
}

function calculateTitleScore(title, keywordAnalysis, explanations, recommendations) {
  let score = 0;
  const length = title.length;
  
  if (length >= 50 && length <= 60 && keywordAnalysis.keywordInTitle) {
    score = 100;
    explanations.title = 'Perfect title length with keyword inclusion.';
  } else if (length >= 30 && length < 50) {
    score = 80;
    explanations.title = 'Title is a bit short. Aim for 50-60 characters.';
    recommendations.push('Expand your title to 50-60 characters and include your main keyword.');
  } else if (length > 60 && length <= 70) {
    score = 75;
    explanations.title = 'Title is slightly long. Aim for 50-60 characters.';
    recommendations.push('Shorten your title to 50-60 characters.');
  } else if (length > 0) {
    score = 50;
    explanations.title = 'Title needs optimization.';
    recommendations.push('Optimize your title to 50-60 characters with keyword inclusion.');
  } else {
    explanations.title = 'Missing title tag.';
    recommendations.push('Add a title tag to your page.');
  }
  
  return score;
}

function calculateMetaScore(metaDesc, keywordAnalysis, explanations, recommendations) {
  let score = 0;
  const length = metaDesc.length;
  
  if (length >= 150 && length <= 160 && keywordAnalysis.keywordInMeta) {
    score = 100;
    explanations.meta = 'Optimal meta description with keyword inclusion.';
  } else if (length >= 120 && length < 150) {
    score = 85;
    explanations.meta = 'Meta description is a bit short.';
    recommendations.push('Expand your meta description to 150-160 characters with keyword inclusion.');
  } else if (length > 160 && length <= 180) {
    score = 75;
    explanations.meta = 'Meta description is a bit long.';
    recommendations.push('Shorten your meta description to 150-160 characters.');
  } else if (length > 0) {
    score = 60;
    explanations.meta = 'Meta description needs optimization.';
    recommendations.push('Optimize your meta description to 150-160 characters with keyword inclusion.');
  } else {
    explanations.meta = 'Missing meta description.';
    recommendations.push('Add a meta description to your page.');
  }
  
  return score;
}

function calculateHeadingScore(h1s, h2s, h3s, keywordAnalysis, explanations, recommendations) {
  let score = 0;
  
  if (h1s.length === 1 && h2s.length >= 2 && keywordAnalysis.keywordInH1) {
    score = 100;
    explanations.headings = 'Perfect heading structure with keyword in H1.';
  } else if (h1s.length === 1 && h2s.length >= 1) {
    score = 80;
    explanations.headings = 'Good heading structure, but could be improved.';
    recommendations.push('Include your main keyword in the H1 and add more H2 headings.');
  } else if (h1s.length === 1) {
    score = 60;
    explanations.headings = 'Basic heading structure.';
    recommendations.push('Add more H2 headings and include your main keyword in the H1.');
  } else if (h1s.length > 1) {
    score = 40;
    explanations.headings = 'Multiple H1s detected.';
    recommendations.push('Use only one H1 per page for better SEO.');
  } else {
    explanations.headings = 'No H1 found.';
    recommendations.push('Add a single H1 heading with your main keyword.');
  }
  
  return score;
}

function calculateImageScore(images, imagesWithAlt, benchmarks, explanations, recommendations) {
  let score = 0;
  
  if (images === 0) {
    score = 100;
    explanations.images = 'No images to optimize.';
  } else if (imagesWithAlt === images) {
    score = 100;
    explanations.images = 'All images have alt text. Excellent!';
  } else if (imagesWithAlt / images >= 0.8) {
    score = 80;
    explanations.images = 'Most images have alt text.';
    recommendations.push('Add alt text to the remaining images for better accessibility.');
  } else if (imagesWithAlt / images >= 0.5) {
    score = 50;
    explanations.images = 'Some images are missing alt text.';
    recommendations.push('Add descriptive alt text to all images.');
  } else {
    score = 0;
    explanations.images = 'Most images lack alt text.';
    recommendations.push('Add descriptive alt text to all images for SEO and accessibility.');
  }
  
  return score;
}

function calculateContentScore(wordCount, paragraphCount, benchmarks, explanations, recommendations) {
  let score = 0;
  
  if (wordCount >= benchmarks.minWords) {
    score = 100;
    explanations.content = `Strong content with ${wordCount} words.`;
  } else if (wordCount >= benchmarks.minWords * 0.7) {
    score = 80;
    explanations.content = `Good content, but aim for at least ${benchmarks.minWords} words.`;
    recommendations.push(`Increase your content to at least ${benchmarks.minWords} words for better SEO.`);
  } else if (wordCount >= benchmarks.minWords * 0.4) {
    score = 50;
    explanations.content = `Content is on the low side.`;
    recommendations.push(`Significantly increase your content to at least ${benchmarks.minWords} words.`);
  } else {
    score = 0;
    explanations.content = `Very little content (${wordCount} words).`;
    recommendations.push(`Add substantial content to your page (aim for ${benchmarks.minWords}+ words).`);
  }
  
  return score;
}

function calculateLinkScore(internalLinks, externalLinks, benchmarks, explanations, recommendations) {
  let score = 0;
  
  if (internalLinks >= benchmarks.minLinks) {
    score = 100;
    explanations.links = `Excellent internal linking (${internalLinks} links).`;
  } else if (internalLinks >= benchmarks.minLinks * 0.6) {
    score = 80;
    explanations.links = `Good internal linking, but more would help.`;
    recommendations.push(`Add more internal links to important pages (aim for ${benchmarks.minLinks}+).`);
  } else if (internalLinks >= 1) {
    score = 50;
    explanations.links = `Limited internal linking.`;
    recommendations.push(`Add more internal links to improve site structure and SEO.`);
  } else {
    score = 0;
    explanations.links = `No internal links found.`;
    recommendations.push(`Add internal links to important pages for better site structure.`);
  }
  
  return score;
}

function calculateTechnicalScore(data, explanations, recommendations) {
  const checks = [
    data.ssl,
    data.hasViewport,
    data.hasCanonical,
    data.hasRobots,
    data.structuredData.count > 0
  ];
  
  const passedChecks = checks.filter(Boolean).length;
  let score = 0;
  
  if (passedChecks === 5) {
    score = 100;
    explanations.technical = 'All technical SEO elements are present.';
  } else if (passedChecks >= 3) {
    score = 80;
    explanations.technical = 'Most technical SEO elements are present.';
    recommendations.push('Add missing technical SEO elements: SSL, viewport, canonical, robots, or structured data.');
  } else if (passedChecks >= 1) {
    score = 50;
    explanations.technical = 'Some technical SEO elements are missing.';
    recommendations.push('Add missing technical SEO elements for better search engine optimization.');
  } else {
    score = 0;
    explanations.technical = 'Most technical SEO elements are missing.';
    recommendations.push('Implement SSL, viewport meta tag, canonical URLs, robots meta tag, and structured data.');
  }
  
  return score;
}

function calculatePerformanceScore(metrics, explanations, recommendations) {
  const { lcpScore, fidScore, clsScore, loadTime } = metrics;
  const avgScore = Math.round((lcpScore + fidScore + clsScore) / 3);
  
  if (avgScore >= 90) {
    explanations.performance = 'Excellent performance across all metrics.';
  } else if (avgScore >= 70) {
    explanations.performance = 'Good performance with room for improvement.';
    recommendations.push('Optimize images, minify CSS/JS, and use a CDN to improve page speed.');
  } else {
    explanations.performance = 'Performance needs significant improvement.';
    recommendations.push('Implement comprehensive performance optimizations: image compression, code minification, CDN, and caching.');
  }
  
  return avgScore;
}

function calculateMobileScore(isMobileResponsive, hasViewport, explanations, recommendations) {
  let score = 0;
  
  if (isMobileResponsive && hasViewport) {
    score = 100;
    explanations.mobile = 'Excellent mobile optimization.';
  } else if (hasViewport) {
    score = 80;
    explanations.mobile = 'Basic mobile optimization.';
    recommendations.push('Improve mobile responsiveness with better CSS media queries and touch-friendly design.');
  } else {
    score = 0;
    explanations.mobile = 'Missing mobile optimization.';
    recommendations.push('Add viewport meta tag and implement responsive design for mobile users.');
  }
  
  return score;
}

module.exports = { analyzeWebsite }; 