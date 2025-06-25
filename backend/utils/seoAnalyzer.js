const analyzeWebsite = async (page, url, loadTime) => {
  const pageData = await page.evaluate(() => {
    // Title analysis
    const title = document.querySelector('title')?.textContent || '';
    // Meta description
    const metaDesc = document.querySelector('meta[name="description"]')?.content || '';
    // Headings
    const h1s = document.querySelectorAll('h1');
    const h2s = document.querySelectorAll('h2');
    const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    // Images
    const images = document.querySelectorAll('img');
    const imagesWithAlt = document.querySelectorAll('img[alt]:not([alt=""])');
    // Links
    const allLinks = document.querySelectorAll('a[href]');
    const domain = window.location.hostname;
    const internalLinks = Array.from(allLinks).filter(link => {
      const href = link.getAttribute('href');
      return href && (href.startsWith('/') || href.includes(domain));
    });
    // Content
    const bodyText = document.body?.textContent || '';
    const wordCount = bodyText.trim().split(/\s+/).filter(word => word.length > 2).length;
    // Technical checks
    const viewport = document.querySelector('meta[name="viewport"]');
    const canonical = document.querySelector('link[rel="canonical"]');
    const robots = document.querySelector('meta[name="robots"]');
    const schema = document.querySelectorAll('script[type="application/ld+json"]');
    return {
      title: { text: title, length: title.length },
      metaDesc: { text: metaDesc, length: metaDesc.length },
      headings: { h1Count: h1s.length, h2Count: h2s.length, totalHeadings: allHeadings.length },
      images: { total: images.length, withAlt: imagesWithAlt.length },
      links: { total: allLinks.length, internal: internalLinks.length },
      content: { wordCount },
      technical: {
        hasViewport: !!viewport,
        hasCanonical: !!canonical,
        hasRobots: !!robots,
        schemaCount: schema.length
      }
    };
  });
  // Calculate scores using real SEO algorithms
  const titleScore = pageData.title.length >= 50 && pageData.title.length <= 60 ? 100 :
                    pageData.title.length >= 30 && pageData.title.length < 50 ? 80 :
                    pageData.title.length > 60 && pageData.title.length <= 70 ? 75 : 
                    pageData.title.length > 0 ? 50 : 0;
  const metaScore = pageData.metaDesc.length >= 150 && pageData.metaDesc.length <= 160 ? 100 :
                   pageData.metaDesc.length >= 120 && pageData.metaDesc.length < 150 ? 85 :
                   pageData.metaDesc.length > 160 && pageData.metaDesc.length <= 180 ? 75 :
                   pageData.metaDesc.length > 0 ? 60 : 0;
  const headingsScore = pageData.headings.h1Count === 1 && pageData.headings.h2Count >= 2 ? 100 :
                       pageData.headings.h1Count === 1 ? 80 :
                       pageData.headings.h1Count > 1 ? 40 : 0;
  const imageScore = pageData.images.total === 0 ? 100 : 
                    (pageData.images.withAlt / pageData.images.total) * 100;
  const contentScore = pageData.content.wordCount >= 1000 ? 100 :
                      pageData.content.wordCount >= 500 ? 85 :
                      pageData.content.wordCount >= 300 ? 70 :
                      pageData.content.wordCount >= 150 ? 50 : 20;
  const linkScore = pageData.links.internal >= 5 ? 100 :
                   pageData.links.internal >= 3 ? 80 :
                   pageData.links.internal >= 1 ? 60 : 30;
  const performanceScore = loadTime < 2000 ? 100 :
                          loadTime < 3000 ? 85 :
                          loadTime < 5000 ? 70 :
                          Math.max(30, 100 - (loadTime / 100));
  const technicalChecks = [
    url.startsWith('https://'),
    pageData.technical.hasViewport,
    pageData.technical.hasCanonical,
    pageData.technical.hasRobots,
    pageData.technical.schemaCount > 0
  ];
  const technicalScore = (technicalChecks.filter(Boolean).length / technicalChecks.length) * 100;
  const overallScore = Math.round((
    titleScore * 0.25 +
    metaScore * 0.15 +
    headingsScore * 0.15 +
    contentScore * 0.20 +
    technicalScore * 0.15 +
    imageScore * 0.10
  ));
  return {
    url,
    domain: new URL(url).hostname,
    timestamp: new Date().toISOString(),
    scores: {
      overall: overallScore,
      performance: Math.round(performanceScore),
      optimization: Math.round((titleScore + metaScore + headingsScore) / 3),
      technical: Math.round(technicalScore),
      content: Math.round((contentScore + linkScore) / 2)
    },
    details: pageData,
    loadTime: loadTime,
    recommendations: generateRecommendations(pageData, {
      title: titleScore,
      meta: metaScore,
      headings: headingsScore,
      images: imageScore,
      content: contentScore,
      links: linkScore
    })
  };
};

const generateRecommendations = (data, scores) => {
  const recommendations = [];
  if (scores.title < 80) {
    recommendations.push(`Optimize title length (currently ${data.title.length} characters)`);
  }
  if (scores.meta < 80) {
    recommendations.push('Add or improve meta description for better click-through rates');
  }
  if (scores.headings < 80) {
    recommendations.push('Use exactly one H1 tag and improve heading structure');
  }
  if (scores.images < 80) {
    recommendations.push(`Add alt text to ${data.images.total - data.images.withAlt} images`);
  }
  if (scores.content < 80) {
    recommendations.push('Increase content length for better SEO (aim for 500+ words)');
  }
  if (scores.links < 80) {
    recommendations.push('Add more internal links to improve site structure');
  }
  return recommendations.slice(0, 5);
};

module.exports = { analyzeWebsite }; 