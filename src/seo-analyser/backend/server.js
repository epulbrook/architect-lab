const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const { analyzeWebsite } = require('./utils/seoAnalyzer');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/analyze', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'Missing url in request body' });
  }
  let browser;
  try {
    browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    const start = Date.now();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    const loadTime = Date.now() - start;
    const result = await analyzeWebsite(page, url, loadTime);
    await browser.close();
    res.json(result);
  } catch (err) {
    if (browser) await browser.close();
    res.status(500).json({ error: err.message || 'Failed to analyze website' });
  }
});

app.listen(PORT, () => {
  console.log(`SEO Analyzer backend running on port ${PORT}`);
}); 