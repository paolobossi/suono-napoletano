// Special middleware for handling ads.txt and related requests
import { Request, Response, NextFunction } from 'express';

// The ads.txt content
const ADSENSE_CONTENT = 'google.com, pub-1733624280085328, DIRECT, f08c47fec0942fa0';

/**
 * Middleware to serve ads.txt content directly with proper headers 
 * and extensive path matching. This is designed to ensure ads.txt
 * is always accessible regardless of the URL structure.
 */
export function adsMiddleware(req: Request, res: Response, next: NextFunction) {
  const path = req.path.toLowerCase();
  
  // Test for multiple patterns to catch all possible ads.txt URL formats
  if (
    path === '/ads.txt' || 
    path.endsWith('/ads.txt') || 
    path.includes('ads.txt') ||
    path === '/suononapoletano.com/ads.txt'
  ) {
    console.log('ADS HANDLER: Serving ads.txt for path:', path);
    
    // Set proper headers for text content and caching
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
    
    // Send the content directly
    return res.send(ADSENSE_CONTENT);
  }
  
  // HTML fallback for ads.txt
  if (path === '/ads.html' || path.endsWith('/ads.html')) {
    console.log('ADS HANDLER: Serving ads.html for path:', path);
    
    // Set proper header for HTML content
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    
    // Send HTML with embedded ads.txt content
    return res.send(`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Ads.txt Content</title>
</head>
<body>
    <h1>Ads.txt Content</h1>
    <p>This is the content of our ads.txt file:</p>
    <pre>${ADSENSE_CONTENT}</pre>
</body>
</html>`);
  }
  
  // Not an ads.txt request, continue to next middleware
  next();
}