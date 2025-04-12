import express, { type Express } from "express";
import { createServer, type Server } from "http";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static files from the assets directory
  app.use('/assets', express.static(path.join(process.cwd(), 'assets')));
  
  // Audio endpoint - serving the local MP3 file
  app.get("/api/audio", (req, res) => {
    try {
      console.log("Audio API called, serving file from assets directory");
      
      // Ensure the file path is correct and matches exactly what's in the assets folder
      const audioPath = "/assets/TarantellaNapoletana.mp3";
      
      // Return the local audio file information
      return res.json({ 
        url: audioPath,
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
