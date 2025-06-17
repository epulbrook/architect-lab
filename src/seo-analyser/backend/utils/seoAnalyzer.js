// Node.js backend utility for SEO analysis with advanced, fact-based scoring and plain-English explanations

async function analyzeWebsite(page, url, loadTime) {
  // Extract SEO-relevant data
  const title = await page.title();
  const metaDesc = await page.$eval('meta[name="description"]', el => el.content).catch(() => '');
  const h1s = await page.$$eval('h1', els => els.map(e => e.textContent.trim()));
  const h2s = await page.$$eval('h2', els => els.map(e => e.textContent.trim()));
  const images = await page.$$eval('img', imgs => imgs.length);
  const imagesWithAlt = await page.$$eval('img', imgs => imgs.filter(img => img.alt && img.alt.trim() !== '').length);
  const links = await page.$$eval('a', as => as.length);
  const internalLinks = await page.$$eval('a', as => as.filter(a => a.hostname === page.url().hostname).length).catch(() => 0);
  const hasViewport = await page.$('meta[name="viewport"]') !== null;
  const hasCanonical = await page.$('link[rel="canonical"]') !== null;
  const hasRobots = await page.$('meta[name="robots"]') !== null;
  const schemaCount = await page.$$eval('script[type="application/ld+json"]', els => els.length);
  const ssl = url.startsWith('https://');
  const bodyText = await page.$eval('body', el => el.innerText).catch(() => '');
  const wordCount = bodyText.trim().split(/\s+/).filter(w => w.length > 2).length;

  // Keyword extraction (simple, for demo)
  const mainKeyword = h1s[0] ? h1s[0].split(' ')[0] : '';
  const keywordInTitle = title.toLowerCase().includes(mainKeyword.toLowerCase());
  const keywordInMeta = metaDesc.toLowerCase().includes(mainKeyword.toLowerCase());
  const keywordInH1 = h1s.length === 1 && h1s[0].toLowerCase().includes(mainKeyword.toLowerCase());

  // --- Fact-based scoring logic and explanations ---
  const explanations = {};
  const recommendations = [];

  // Title
  let titleScore = 0;
  if (title.length >= 50 && title.length <= 60 && keywordInTitle) {
    titleScore = 100;
    explanations.title = 'Your title tag is the right length and includes your main keyword. Great job!';
  } else if (title.length >= 30 && title.length < 50) {
    titleScore = 80;
    explanations.title = 'Your title tag is a bit short. Aim for 50–60 characters.';
    recommendations.push('Expand your title tag to 50–60 characters and include your main keyword.');
  } else if (title.length > 60 && title.length <= 70) {
    titleScore = 75;
    explanations.title = 'Your title tag is a bit long. Aim for 50–60 characters.';
    recommendations.push('Shorten your title tag to 50–60 characters.');
  } else if (title.length > 0) {
    titleScore = 50;
    explanations.title = 'Your title tag is present but not optimal.';
    recommendations.push('Make sure your title tag is 50–60 characters and includes your main keyword.');
  } else {
    explanations.title = 'Your page is missing a title tag.';
    recommendations.push('Add a title tag to your page.');
  }

  // Meta description
  let metaScore = 0;
  if (metaDesc.length >= 150 && metaDesc.length <= 160 && keywordInMeta) {
    metaScore = 100;
    explanations.meta = 'Your meta description is the right length and includes your main keyword.';
  } else if (metaDesc.length >= 120 && metaDesc.length < 150) {
    metaScore = 85;
    explanations.meta = 'Your meta description is a bit short. Aim for 150–160 characters.';
    recommendations.push('Expand your meta description to 150–160 characters and include your main keyword.');
  } else if (metaDesc.length > 160 && metaDesc.length <= 180) {
    metaScore = 75;
    explanations.meta = 'Your meta description is a bit long. Aim for 150–160 characters.';
    recommendations.push('Shorten your meta description to 150–160 characters.');
  } else if (metaDesc.length > 0) {
    metaScore = 60;
    explanations.meta = 'Your meta description is present but not optimal.';
    recommendations.push('Make sure your meta description is 150–160 characters and includes your main keyword.');
  } else {
    explanations.meta = 'Your page is missing a meta description.';
    recommendations.push('Add a meta description to your page.');
  }

  // Headings
  let headingScore = 0;
  if (h1s.length === 1 && h2s.length >= 2 && keywordInH1) {
    headingScore = 100;
    explanations.headings = 'You have one H1 and at least two H2s, and your H1 includes your main keyword.';
  } else if (h1s.length === 1 && h2s.length >= 1) {
    headingScore = 80;
    explanations.headings = 'You have one H1 and at least one H2, but your H1 could be improved.';
    recommendations.push('Make sure your H1 includes your main keyword and add more H2s for structure.');
  } else if (h1s.length === 1) {
    headingScore = 50;
    explanations.headings = 'You have one H1, but you need more H2s for structure.';
    recommendations.push('Add at least two H2 headings for better structure.');
  } else if (h1s.length > 1) {
    headingScore = 40;
    explanations.headings = 'You have multiple H1s. Only one H1 is recommended.';
    recommendations.push('Use only one H1 per page.');
  } else {
    explanations.headings = 'No H1 found. Every page should have one H1.';
    recommendations.push('Add a single H1 heading to your page.');
  }

  // Images
  let imageScore = 0;
  if (images === 0) {
    imageScore = 100;
    explanations.images = 'No images found, so no alt text issues.';
  } else if (imagesWithAlt === images) {
    imageScore = 100;
    explanations.images = 'All images have descriptive alt text. Good job!';
  } else if (imagesWithAlt / images >= 0.8) {
    imageScore = 80;
    explanations.images = 'Most images have alt text, but a few are missing.';
    recommendations.push('Add alt text to all images for better accessibility and SEO.');
  } else if (imagesWithAlt / images >= 0.5) {
    imageScore = 50;
    explanations.images = 'Some images have alt text, but many are missing.';
    recommendations.push('Add alt text to all images for better accessibility and SEO.');
  } else {
    imageScore = 0;
    explanations.images = 'Most images are missing alt text.';
    recommendations.push('Add alt text to all images for better accessibility and SEO.');
  }

  // Content
  let contentScore = 0;
  if (wordCount >= 1000) {
    contentScore = 100;
    explanations.content = 'Your page has a strong amount of content (1000+ words).';
  } else if (wordCount >= 500) {
    contentScore = 80;
    explanations.content = 'Your page has a decent amount of content, but more would help.';
    recommendations.push('Increase your content to at least 1000 words for better SEO.');
  } else if (wordCount >= 300) {
    contentScore = 50;
    explanations.content = 'Your page has some content, but it is on the low side.';
    recommendations.push('Increase your content to at least 1000 words for better SEO.');
  } else {
    contentScore = 0;
    explanations.content = 'Your page has very little content.';
    recommendations.push('Add more content to your page (aim for 1000+ words).');
  }

  // Internal Links
  let linkScore = 0;
  if (internalLinks >= 5) {
    linkScore = 100;
    explanations.links = 'You have plenty of internal links. Great for SEO!';
  } else if (internalLinks >= 3) {
    linkScore = 80;
    explanations.links = 'You have some internal links, but more would help.';
    recommendations.push('Add more internal links to important pages.');
  } else if (internalLinks >= 1) {
    linkScore = 50;
    explanations.links = 'You have very few internal links.';
    recommendations.push('Add more internal links to important pages.');
  } else {
    linkScore = 0;
    explanations.links = 'No internal links found.';
    recommendations.push('Add internal links to important pages.');
  }

  // Technical
  const techChecks = [ssl, hasViewport, hasCanonical, hasRobots, schemaCount > 0];
  const techCount = techChecks.filter(Boolean).length;
  let technicalScore = 0;
  if (techCount === 5) {
    technicalScore = 100;
    explanations.technical = 'All key technical SEO elements are present.';
  } else if (techCount >= 3) {
    technicalScore = 80;
    explanations.technical = 'Most technical SEO elements are present.';
    recommendations.push('Add any missing technical SEO elements: SSL, viewport, canonical, robots, schema.');
  } else if (techCount >= 1) {
    technicalScore = 50;
    explanations.technical = 'Some technical SEO elements are missing.';
    recommendations.push('Add any missing technical SEO elements: SSL, viewport, canonical, robots, schema.');
  } else {
    technicalScore = 0;
    explanations.technical = 'Most technical SEO elements are missing.';
    recommendations.push('Add SSL, viewport, canonical, robots, and schema tags.');
  }

  // Performance
  let performanceScore = 0;
  if (loadTime < 2000) {
    performanceScore = 100;
    explanations.performance = 'Your page loads very quickly (<2s).';
  } else if (loadTime < 3000) {
    performanceScore = 80;
    explanations.performance = 'Your page loads reasonably quickly (<3s).';
    recommendations.push('Improve your page speed by optimizing images and reducing script size.');
  } else if (loadTime < 5000) {
    performanceScore = 50;
    explanations.performance = 'Your page is a bit slow (<5s).';
    recommendations.push('Improve your page speed by optimizing images and reducing script size.');
  } else {
    performanceScore = 0;
    explanations.performance = 'Your page is very slow (>5s).';
    recommendations.push('Significantly improve your page speed by optimizing images and reducing script size.');
  }

  // Optimization: average of title, meta, heading, image, link
  const optimizationScore = Math.round((titleScore + metaScore + headingScore + imageScore + linkScore) / 5);

  // Content: average of content and link
  const contentAvgScore = Math.round((contentScore + linkScore) / 2);

  // Overall: weighted average
  const overallScore = Math.round(
    titleScore * 0.15 +
    metaScore * 0.10 +
    headingScore * 0.10 +
    imageScore * 0.10 +
    contentScore * 0.20 +
    technicalScore * 0.15 +
    performanceScore * 0.10 +
    linkScore * 0.10
  );

  return {
    url,
    loadTime,
    scores: {
      overall: overallScore,
      performance: performanceScore,
      optimization: optimizationScore,
      technical: technicalScore,
      content: contentAvgScore
    },
    details: {
      title,
      metaDesc,
      h1s,
      h2s,
      images,
      imagesWithAlt,
      links,
      internalLinks,
      hasViewport,
      hasCanonical,
      hasRobots,
      schemaCount,
      ssl,
      wordCount
    },
    explanations,
    recommendations
  };
}

module.exports = { analyzeWebsite }; 