import express, { type Express } from "express";
import { createServer, type Server } from "http";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static files from the assets directory
  app.use('/assets', express.static(path.join(process.cwd(), 'assets')));
  
  // Audio endpoint - now using local MP3 file
  app.get("/api/audio", (req, res) => {
    try {
      // Return the local audio file information
      return res.json({ 
        url: "/assets/TarantellaNapoletana.mp3",
        title: "Tarantella Napoletana",
        author: "Traditional"
      });
    } catch (error) {
      console.error("Error serving audio:", error);
      return res.status(500).json({ message: "Failed to serve audio file" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
