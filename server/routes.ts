import express, { type Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static files from the assets directory
  app.use('/assets', express.static(path.join(process.cwd(), 'assets'), {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.mp3')) {
        res.setHeader('Content-Type', 'audio/mpeg');
      } else if (filePath.endsWith('.png')) {
        res.setHeader('Content-Type', 'image/png');
      }
    }
  }));

  // Dedicated route for ads.txt (Google AdSense verification)
  app.get(['/ads.txt', '/public/ads.txt'], (req, res) => {
    console.log(`Serving ads.txt from path: ${req.path}`);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send('google.com, pub-1733624280085328, DIRECT, f08c47fec0942fa0');
  });

  // HTML fallback to preview ads.txt in browser
  app.get(['/ads.html', '/public/ads.html'], (req, res) => {
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

  // API endpoint for the audio file
  app.get("/api/audio", (req, res) => {
    try {
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

  // Fallback route for SPA support
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/assets')) {
      return next();
    }

    try {
      const indexPath = path.join(process.cwd(), 'client', 'dist', 'client', 'index.html');
      console.log('Serving SPA fallback from:', indexPath);

      if (process.env.NODE_ENV === 'production' && fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
      }

      next();
    } catch (err) {
      console.error('Error in SPA fallback route:', err);
      next();
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
