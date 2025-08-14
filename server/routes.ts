import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve questions CSV file - checks root directory first, then fallback to client/src/data
  app.get('/api/questions', (req, res) => {
    const rootCsvPath = path.join(process.cwd(), 'questions.csv');
    const fallbackCsvPath = path.join(process.cwd(), 'client', 'src', 'data', 'questions.csv');
    
    // Try root directory first (editable version)
    if (fs.existsSync(rootCsvPath)) {
      res.setHeader('Content-Type', 'text/csv');
      res.sendFile(rootCsvPath);
    } else if (fs.existsSync(fallbackCsvPath)) {
      res.setHeader('Content-Type', 'text/csv');
      res.sendFile(fallbackCsvPath);
    } else {
      res.status(404).json({ error: 'Questions file not found' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
