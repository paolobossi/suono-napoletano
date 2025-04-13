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
  // Multiple routes for ads.txt to ensure it's accessible from different paths
  app.get(["/ads.txt", "*/ads.txt", "/*/ads.txt"], (req, res) => {
    // Log the ads.txt request for debugging
    console.log('Serving ads.txt from path:', req.path);
    res.setHeader('Content-Type', 'text/plain');
    res.sendFile(path.join(process.cwd(), 'ads.txt')); // Serve from root directory
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
    
    // Handle ads.txt at any path level for compatibility with domain.com/ads.txt
    if (req.path.endsWith('/ads.txt')) {
      res.setHeader('Content-Type', 'text/plain');
      return res.sendFile(path.join(process.cwd(), 'ads.txt'));
    }
    
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
