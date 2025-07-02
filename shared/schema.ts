import { pgTable, text, serial, integer, boolean, decimal, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  created_at: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  is_default: boolean("is_default").default(true),
});

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  vendor: text("vendor").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  date: date("date").notNull(),
  category_id: integer("category_id").notNull(),
  notes: text("notes"),
  receipt_url: text("receipt_url"),
  source: text("source").notNull().default("manual"), // manual, camera, email
  created_at: timestamp("created_at").defaultNow(),
});

export const monthly_budgets = pgTable("monthly_budgets", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  category_id: integer("category_id").notNull(),
  month: text("month").notNull(), // Format: "2025-01"
  budget: decimal("budget", { precision: 10, scale: 2 }).notNull(),
});

export const ocr_logs = pgTable("ocr_logs", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  raw_json: text("raw_json"),
  status: text("status").notNull(), // success, fail, pending
  created_at: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  created_at: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertExpenseSchema = createInsertSchema(expenses).omit({
  id: true,
  created_at: true,
}).extend({
  amount: z.coerce.number().positive(),
});

export const insertBudgetSchema = createInsertSchema(monthly_budgets).omit({
  id: true,
}).extend({
  budget: z.coerce.number().positive(),
});

export const insertOCRLogSchema = createInsertSchema(ocr_logs).omit({
  id: true,
  created_at: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;

export type MonthlyBudget = typeof monthly_budgets.$inferSelect;
export type InsertMonthlyBudget = z.infer<typeof insertBudgetSchema>;

export type OCRLog = typeof ocr_logs.$inferSelect;
export type InsertOCRLog = z.infer<typeof insertOCRLogSchema>;
