/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const puppeteer = require("puppeteer");
const cors = require("cors");
const {analyzeWebsite} = require("./seoAnalyzer");

// Initialize CORS middleware
const corsHandler = cors({origin: true});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// SEO Analysis Cloud Function
exports.analyzeSEO = onRequest(async (request, response) => {
  // Handle CORS
  corsHandler(request, response, async () => {
    try {
      // Only allow POST requests
      if (request.method !== "POST") {
        response.status(405).json({error: "Method not allowed. Use POST."});
        return;
      }

      const {url} = request.body;

      if (!url) {
        response.status(400).json({error: "Missing url in request body"});
        return;
      }

      // Validate URL format
      try {
        new URL(url);
      } catch (error) {
        response.status(400).json({error: "Invalid URL format"});
        return;
      }

      logger.info(`Starting SEO analysis for: ${url}`);

      let browser;
      try {
        // Launch browser with optimized settings for Cloud Functions
        browser = await puppeteer.launch({
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--no-first-run",
            "--no-zygote",
            "--disable-gpu",
          ],
          headless: true,
        });

        const page = await browser.newPage();

        // Set user agent and viewport
        await page.setUserAgent("Mozilla/5.0 (compatible; SEO-Analyzer/1.0)");
        await page.setViewport({width: 1280, height: 720});

        // Measure load time
        const start = Date.now();
        await page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: 30000,
        });
        const loadTime = Date.now() - start;

        // Perform SEO analysis
        const result = await analyzeWebsite(page, url, loadTime);

        await browser.close();

        logger.info(`SEO analysis completed for: ${url}`);
        response.json(result);
      } catch (error) {
        if (browser) {
          await browser.close();
        }
        logger.error(`Error analyzing website ${url}:`, error);
        response.status(500).json({
          error: "Failed to analyze website",
          details: error.message,
        });
      }
    } catch (error) {
      logger.error("Unexpected error:", error);
      response.status(500).json({
        error: "Internal server error",
        details: error.message,
      });
    }
  });
});

// Health check endpoint
exports.health = onRequest((request, response) => {
  response.json({
    status: "healthy",
    service: "SEO Analyzer",
    timestamp: new Date().toISOString(),
  });
});
