import express, { type Express } from "express";
import { createServer, type Server } from "http";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static files from the assets directory
  // Set Cache-Control headers for better performance and ensure proper MIME types
  app.use('/assets', express.static(path.join(process.cwd(), 'assets'), {
    maxAge: '1d', // Cache assets for 1 day
    setHeaders: (res, filePath) => {
      // Set proper content type for audio files
      if (filePath.endsWith('.mp3')) {
        res.setHeader('Content-Type', 'audio/mpeg');
      }
      // Set proper content type for image files
      else if (filePath.endsWith('.png')) {
        res.setHeader('Content-Type', 'image/png');
      }
    }
  }));
  
  // Audio endpoint - now using local MP3 file
  // HIGHEST PRIORITY ROUTE: Dedicated route handler for ads.txt with explicit content
  app.get(["/ads.txt", "*/ads.txt", "/*/ads.txt", "/public/ads.txt"], (req, res) => {
    // Log the ads.txt request for debugging
    console.log('Serving ads.txt from path:', req.path);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
    // DIRECTLY WRITE THE CONTENT instead of serving a file that might not be accessible
    return res.send('google.com, pub-1733624280085328, DIRECT, f08c47fec0942fa0');
  });

  // HTML fallback for ads.txt
  app.get(["/ads.html", "/public/ads.html"], (req, res) => {
    console.log('Serving ads.html from path:', req.path);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Ads.txt</title>
</head>
<body>
    <pre>google.com, pub-1733624280085328, DIRECT, f08c47fec0942fa0</pre>
</body>
</html>`);
  });
  
  app.get("/api/audio", (req, res) => {
    try {
      // Return the local audio file information with relative path for better compatibility
      // Using relative path to work in both development and production
      return res.json({ 
        url: "./assets/TarantellaNapoletana.mp3",
        title: "Tarantella Napoletana",
        author: "Traditional"
      });
    } catch (error) {
      console.error("Error serving audio:", error);
      return res.status(500).json({ message: "Failed to serve audio file" });
    }
  });

  // Add a fallback route for client-side SPA routing
  // This is important for deployed applications to handle refresh and direct URL access
  app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api') || req.path.startsWith('/assets')) {
      return next();
    }
    
    // This fallback handler for ads.txt has been moved to the main route handler above
    // We don't need it here anymore, as the dedicated route should handle it better
    
    // If this is a deployment, use special handling
    try {
      // In deployment environment, we'll return the index.html for all non-API routes
      // This allows client-side routing to work correctly when users refresh or access direct URLs
      const indexPath = path.join(process.cwd(), 'client', 'dist', 'client', 'index.html');
      console.log('Serving SPA fallback from:', indexPath);
      
      if (process.env.NODE_ENV === 'production' && require('fs').existsSync(indexPath)) {
        return res.sendFile(indexPath);
      }
      
      // In development, Vite handles this
      next();
    } catch (err) {
      console.error('Error in SPA fallback route:', err);
      next();
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
