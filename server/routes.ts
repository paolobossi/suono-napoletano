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
  // Note: ads.txt handling has been moved to a specialized middleware in ads-handler.ts
  // This ensures it's handled at the highest priority level before any route matching

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
