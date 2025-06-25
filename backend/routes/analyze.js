const express = require('express');
const puppeteer = require('puppeteer');
const { analyzeWebsite } = require('../utils/seoAnalyzer');

const router = express.Router();

router.post('/analyze', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  console.log(`🔍 Analyzing: ${url}`);
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    const startTime = Date.now();
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    const loadTime = Date.now() - startTime;
    const analysis = await analyzeWebsite(page, url, loadTime);
    await browser.close();
    console.log(`✅ Analysis complete for ${url}`);
    res.json(analysis);
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    res.status(500).json({ error: 'Analysis failed', message: error.message });
  }
});

module.exports = router; 