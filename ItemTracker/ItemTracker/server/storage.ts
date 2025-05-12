import { users, items, type User, type InsertUser, type Item, type InsertItem } from "@shared/schema";
import { nanoid } from "nanoid";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { db, pool } from "./db";
import { eq } from "drizzle-orm";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createItem(userId: number, item: InsertItem): Promise<Item>;
  getItemById(id: number): Promise<Item | undefined>;
  getItemByQrCodeId(qrCodeId: string): Promise<Item | undefined>;
  getItemsByUserId(userId: number): Promise<Item[]>;
  updateItem(id: number, item: Partial<Item>): Promise<Item | undefined>;
  deleteItem(id: number): Promise<boolean>;
  incrementScanCount(id: number): Promise<Item | undefined>;
  
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  public sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createItem(userId: number, insertItem: InsertItem): Promise<Item> {
    const qrCodeId = nanoid(10);
    
    const [item] = await db.insert(items).values({
      ...insertItem,
      userId,
      qrCodeId,
      scanCount: 0,
      lastScan: null,
      createdAt: new Date(),
      isActive: true,
    }).returning();
    
    return item;
  }

  async getItemById(id: number): Promise<Item | undefined> {
    const [item] = await db.select().from(items).where(eq(items.id, id));
    return item;
  }

  async getItemByQrCodeId(qrCodeId: string): Promise<Item | undefined> {
    const [item] = await db.select().from(items).where(eq(items.qrCodeId, qrCodeId));
    return item;
  }

  async getItemsByUserId(userId: number): Promise<Item[]> {
    return await db.select().from(items).where(eq(items.userId, userId));
  }

  async updateItem(id: number, updatedData: Partial<Item>): Promise<Item | undefined> {
    const [updatedItem] = await db.update(items)
      .set(updatedData)
      .where(eq(items.id, id))
      .returning();
    
    return updatedItem;
  }

  async deleteItem(id: number): Promise<boolean> {
    const result = await db.delete(items).where(eq(items.id, id));
    return true; // In PostgreSQL, if no error is thrown, the operation was successful
  }

  async incrementScanCount(id: number): Promise<Item | undefined> {
    const item = await this.getItemById(id);
    if (!item) return undefined;
    
    const currentScanCount = item.scanCount || 0;
    
    const [updatedItem] = await db.update(items)
      .set({
        scanCount: currentScanCount + 1,
        lastScan: new Date()
      })
      .where(eq(items.id, id))
      .returning();
    
    return updatedItem;
  }
}

export const storage = new DatabaseStorage();
