import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertItemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Items routes
  app.get("/api/items", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const items = await storage.getItemsByUserId(req.user.id);
    res.json(items);
  });

  app.post("/api/items", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const validatedData = insertItemSchema.parse(req.body);
      const item = await storage.createItem(req.user.id, validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create item" });
    }
  });

  app.get("/api/items/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const itemId = parseInt(req.params.id);
    if (isNaN(itemId)) {
      return res.status(400).json({ error: "Invalid item ID" });
    }

    const item = await storage.getItemById(itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (item.userId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(item);
  });

  app.put("/api/items/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const itemId = parseInt(req.params.id);
    if (isNaN(itemId)) {
      return res.status(400).json({ error: "Invalid item ID" });
    }

    const item = await storage.getItemById(itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (item.userId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    try {
      const validatedData = insertItemSchema.partial().parse(req.body);
      const updatedItem = await storage.updateItem(itemId, validatedData);
      res.json(updatedItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update item" });
    }
  });

  app.delete("/api/items/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const itemId = parseInt(req.params.id);
    if (isNaN(itemId)) {
      return res.status(400).json({ error: "Invalid item ID" });
    }

    const item = await storage.getItemById(itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (item.userId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    const success = await storage.deleteItem(itemId);
    if (success) {
      res.status(204).send();
    } else {
      res.status(500).json({ error: "Failed to delete item" });
    }
  });

  // QR Code scanner endpoint
  app.get("/api/qr/:qrCodeId", async (req, res) => {
    const qrCodeId = req.params.qrCodeId;
    
    const item = await storage.getItemByQrCodeId(qrCodeId);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    await storage.incrementScanCount(item.id);
    
    const user = await storage.getUser(item.userId);
    if (!user) {
      return res.status(404).json({ error: "Owner information not available" });
    }
    
    // Return only the necessary owner information for display
    const ownerInfo = {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      item: {
        name: item.name,
        description: item.description
      }
    };
    
    res.json(ownerInfo);
  });

  const httpServer = createServer(app);
  return httpServer;
}
