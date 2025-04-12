import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base schema for YouTube Audio API response
export const youtubeAudioSchema = z.object({
  url: z.string().url(),
  title: z.string(),
  author: z.string()
});

export type YoutubeAudio = z.infer<typeof youtubeAudioSchema>;

// Keep the original users schema for compatibility
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
