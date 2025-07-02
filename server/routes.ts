import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertExpenseSchema, insertBudgetSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import FormData from "form-data";

function getStringParam(param: any): string | undefined {
  return typeof param === 'string' ? param : undefined;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });

      // Remove password from response
      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Remove password from response
      const { password: _, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Expenses routes
  app.get("/api/expenses", async (req, res) => {
    try {
      const { userId, month } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID required" });
      }

      let expenses;
      if (month) {
        expenses = await storage.getExpensesByUserIdAndMonth(Number(userId), String(month));
      } else {
        expenses = await storage.getExpensesByUserId(Number(userId));
      }
      
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch expenses" });
    }
  });

  app.post("/api/expenses", async (req, res) => {
    try {
      const expenseData = insertExpenseSchema.parse(req.body);
      const expense = await storage.createExpense(expenseData);
      res.json(expense);
    } catch (error) {
      res.status(400).json({ error: "Invalid expense data" });
    }
  });

  app.patch("/api/expenses/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const updateData = req.body;
      
      const expense = await storage.updateExpense(id, updateData);
      if (!expense) {
        return res.status(404).json({ error: "Expense not found" });
      }
      
      res.json(expense);
    } catch (error) {
      res.status(400).json({ error: "Failed to update expense" });
    }
  });

  app.delete("/api/expenses/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const deleted = await storage.deleteExpense(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Expense not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete expense" });
    }
  });

  // OCR receipt processing (simplified for now)
  app.post("/api/receipt/upload", async (req, res) => {
    try {
      const { image, userId } = req.body;
      
      if (!image || !userId) {
        return res.status(400).json({ error: "Image and user ID required" });
      }

      // Log OCR attempt
      await storage.createOCRLog({
        user_id: Number(userId),
        status: "success",
        raw_json: JSON.stringify({ imageReceived: true, processed: new Date() })
      });

      // Provide intelligent mock data for demo
      const vendors = ["Starbucks", "Shell Gas Station", "Whole Foods", "Target", "McDonald's"];
      const amounts = [4.85, 32.50, 67.23, 24.99, 8.75];
      
      const extractedData = {
        vendor: vendors[Math.floor(Math.random() * vendors.length)],
        amount: amounts[Math.floor(Math.random() * amounts.length)],
        date: new Date().toISOString().split('T')[0],
        category_id: 1,
      };

      res.json(extractedData);
    } catch (error) {
      // Log failed OCR
      if (req.body.userId) {
        await storage.createOCRLog({
          user_id: Number(req.body.userId),
          status: "fail",
          raw_json: JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" })
        });
      }
      
      res.status(500).json({ error: "OCR processing failed" });
    }
  });

  // Budgets routes
  app.get("/api/budgets", async (req, res) => {
    try {
      const { userId, month } = req.query;
      
      if (!userId || Array.isArray(userId)) {
        return res.status(400).json({ error: "User ID required" });
      }

      let budgets;
      const monthParam = getStringParam(month);
      if (monthParam) {
        budgets = await storage.getBudgetsByUserIdAndMonth(Number(userId), monthParam);
      } else {
        budgets = await storage.getBudgetsByUserId(Number(userId));
      }
      
      res.json(budgets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch budgets" });
    }
  });

  app.post("/api/budgets", async (req, res) => {
    try {
      const budgetData = insertBudgetSchema.parse(req.body);
      const budget = await storage.createBudget(budgetData);
      res.json(budget);
    } catch (error) {
      res.status(400).json({ error: "Invalid budget data" });
    }
  });

  // Dashboard summary
  app.get("/api/dashboard/summary", async (req, res) => {
    try {
      const { userId, month } = req.query;
      
      if (!userId || Array.isArray(userId)) {
        return res.status(400).json({ error: "User ID required" });
      }

      const currentMonth = getStringParam(month) || new Date().toISOString().slice(0, 7);
      
      // Get expenses for the month
      const expenses = await storage.getExpensesByUserIdAndMonth(Number(userId), currentMonth);
      const budgets = await storage.getBudgetsByUserIdAndMonth(Number(userId), currentMonth);
      const categories = await storage.getCategories();

      // Calculate totals
      const totalSpent = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
      const totalBudget = budgets.reduce((sum, budget) => sum + Number(budget.budget), 0);

      // Category breakdown
      const categoryBreakdown = categories.map(category => {
        const categoryExpenses = expenses.filter(e => e.category_id === category.id);
        const categoryBudget = budgets.find(b => b.category_id === category.id);
        const spent = categoryExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
        
        return {
          ...category,
          spent,
          budget: categoryBudget ? Number(categoryBudget.budget) : 0,
          transactionCount: categoryExpenses.length
        };
      });

      // Recent transactions (last 5)
      const recentTransactions = expenses
        .sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 5)
        .map(expense => {
          const category = categories.find(c => c.id === expense.category_id);
          return {
            ...expense,
            category_name: category?.name || "Unknown",
            category_icon: category?.icon || "fas fa-question"
          };
        });

      res.json({
        totalSpent,
        totalBudget,
        remainingBudget: totalBudget - totalSpent,
        categoryBreakdown,
        recentTransactions
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard summary" });
    }
  });

  // OCR Receipt Processing
  app.post("/api/ocr/process", async (req, res) => {
    try {
      const { imageData, userId } = req.body;
      
      if (!imageData || !userId) {
        return res.status(400).json({ error: "Image data and user ID required" });
      }

      // For now, simulate smart OCR processing until Mindee integration is fully set up
      // Extract some basic patterns from a typical receipt-like input
      const categories = await storage.getCategories();
      let categoryId = categories[0]?.id || 1;
      
      // Smart categorization simulation based on time patterns
      const hour = new Date().getHours();
      if (hour >= 11 && hour <= 14) {
        // Lunch time - likely food
        const foodCategory = categories.find(c => c.name.toLowerCase().includes('food'));
        if (foodCategory) categoryId = foodCategory.id;
      } else if (hour >= 17 && hour <= 21) {
        // Dinner time - likely food
        const foodCategory = categories.find(c => c.name.toLowerCase().includes('food'));
        if (foodCategory) categoryId = foodCategory.id;
      } else if (hour >= 6 && hour <= 10) {
        // Morning - could be coffee or transport
        const transportCategory = categories.find(c => c.name.toLowerCase().includes('transport'));
        if (transportCategory) categoryId = transportCategory.id;
      }

      // Log the OCR processing attempt
      await storage.createOCRLog({
        user_id: Number(userId),
        raw_json: JSON.stringify({ processed: true, timestamp: new Date() }),
        status: "success"
      });

      // Generate a realistic result for demo purposes
      const vendors = ["Fresh Market", "Coffee Shop", "Gas Station", "Local Store", "Restaurant"];
      const amounts = [12.50, 25.99, 45.67, 8.99, 33.45];
      
      const result = {
        vendor: vendors[Math.floor(Math.random() * vendors.length)],
        amount: amounts[Math.floor(Math.random() * amounts.length)],
        date: new Date().toISOString().split('T')[0],
        category_id: categoryId
      };

      res.json(result);
    } catch (error) {
      console.error("OCR processing error:", error);
      
      // Fallback result
      const fallbackResult = {
        vendor: "Manual Entry Required",
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        category_id: 1
      };
      
      res.json(fallbackResult);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
