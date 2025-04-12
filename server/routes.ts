import type { Express } from "express";
import { createServer, type Server } from "http";
import ytdl from "ytdl-core";

export async function registerRoutes(app: Express): Promise<Server> {
  // YouTube audio extraction endpoint
  app.get("/api/youtube/audio", async (req, res) => {
    try {
      const videoUrl = "https://youtu.be/gtMxyavOm_Q";
      
      // Validate video URL
      if (!ytdl.validateURL(videoUrl)) {
        return res.status(400).json({ message: "Invalid YouTube URL" });
      }
      
      // Get basic info to verify availability
      const info = await ytdl.getInfo(videoUrl);
      
      // Get audio-only format with highest quality
      const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
      const highestQualityAudio = audioFormats.sort((a, b) => {
        return parseInt(b.audioBitrate as string) - parseInt(a.audioBitrate as string);
      })[0];
      
      if (!highestQualityAudio || !highestQualityAudio.url) {
        return res.status(404).json({ message: "No audio stream found" });
      }
      
      // Return the audio URL to the client
      return res.json({ 
        url: highestQualityAudio.url,
        title: info.videoDetails.title,
        author: info.videoDetails.author.name
      });
    } catch (error) {
      console.error("Error fetching YouTube audio:", error);
      return res.status(500).json({ message: "Failed to extract audio from YouTube" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
