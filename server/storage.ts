import { users, categories, expenses, monthly_budgets, ocr_logs, type User, type InsertUser, type Category, type InsertCategory, type Expense, type InsertExpense, type MonthlyBudget, type InsertMonthlyBudget, type OCRLog, type InsertOCRLog } from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  getCategoryById(id: number): Promise<Category | undefined>;

  // Expenses
  getExpensesByUserId(userId: number): Promise<Expense[]>;
  getExpensesByUserIdAndMonth(userId: number, month: string): Promise<Expense[]>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  updateExpense(id: number, expense: Partial<InsertExpense>): Promise<Expense | undefined>;
  deleteExpense(id: number): Promise<boolean>;

  // Budgets
  getBudgetsByUserId(userId: number): Promise<MonthlyBudget[]>;
  getBudgetsByUserIdAndMonth(userId: number, month: string): Promise<MonthlyBudget[]>;
  createBudget(budget: InsertMonthlyBudget): Promise<MonthlyBudget>;
  updateBudget(id: number, budget: Partial<InsertMonthlyBudget>): Promise<MonthlyBudget | undefined>;

  // OCR Logs
  createOCRLog(log: InsertOCRLog): Promise<OCRLog>;
  getOCRLogsByUserId(userId: number): Promise<OCRLog[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private expenses: Map<number, Expense>;
  private budgets: Map<number, MonthlyBudget>;
  private ocrLogs: Map<number, OCRLog>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.expenses = new Map();
    this.budgets = new Map();
    this.ocrLogs = new Map();
    this.currentId = 1;

    // Seed default categories
    this.seedDefaultCategories();
  }

  private seedDefaultCategories() {
    const defaultCategories = [
      { name: "Food & Dining", icon: "fas fa-utensils", color: "orange", is_default: true },
      { name: "Transportation", icon: "fas fa-car", color: "blue", is_default: true },
      { name: "Shopping", icon: "fas fa-shopping-bag", color: "green", is_default: true },
      { name: "Entertainment", icon: "fas fa-gamepad", color: "purple", is_default: true },
      { name: "Health", icon: "fas fa-heartbeat", color: "red", is_default: true },
      { name: "Bills & Utilities", icon: "fas fa-receipt", color: "gray", is_default: true },
      { name: "Other", icon: "fas fa-ellipsis-h", color: "gray", is_default: true },
    ];

    defaultCategories.forEach(category => {
      const id = this.currentId++;
      this.categories.set(id, { ...category, id });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      name: insertUser.name || null,
      created_at: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentId++;
    const category: Category = { 
      ...insertCategory, 
      id,
      is_default: insertCategory.is_default ?? null
    };
    this.categories.set(id, category);
    return category;
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getExpensesByUserId(userId: number): Promise<Expense[]> {
    return Array.from(this.expenses.values()).filter(expense => expense.user_id === userId);
  }

  async getExpensesByUserIdAndMonth(userId: number, month: string): Promise<Expense[]> {
    return Array.from(this.expenses.values()).filter(expense => 
      expense.user_id === userId && expense.date.startsWith(month)
    );
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const id = this.currentId++;
    const expense: Expense = { 
      ...insertExpense, 
      id,
      amount: insertExpense.amount.toString(),
      notes: insertExpense.notes || null,
      receipt_url: insertExpense.receipt_url || null,
      source: insertExpense.source || "manual",
      created_at: new Date()
    };
    this.expenses.set(id, expense);
    return expense;
  }

  async updateExpense(id: number, updateData: Partial<InsertExpense>): Promise<Expense | undefined> {
    const expense = this.expenses.get(id);
    if (!expense) return undefined;
    
    const updated: Expense = { 
      ...expense, 
      ...updateData,
      amount: updateData.amount ? updateData.amount.toString() : expense.amount,
      notes: updateData.notes !== undefined ? updateData.notes || null : expense.notes,
      receipt_url: updateData.receipt_url !== undefined ? updateData.receipt_url || null : expense.receipt_url,
      source: updateData.source || expense.source
    };
    this.expenses.set(id, updated);
    return updated;
  }

  async deleteExpense(id: number): Promise<boolean> {
    return this.expenses.delete(id);
  }

  async getBudgetsByUserId(userId: number): Promise<MonthlyBudget[]> {
    return Array.from(this.budgets.values()).filter(budget => budget.user_id === userId);
  }

  async getBudgetsByUserIdAndMonth(userId: number, month: string): Promise<MonthlyBudget[]> {
    return Array.from(this.budgets.values()).filter(budget => 
      budget.user_id === userId && budget.month === month
    );
  }

  async createBudget(insertBudget: InsertMonthlyBudget): Promise<MonthlyBudget> {
    const id = this.currentId++;
    const budget: MonthlyBudget = { 
      ...insertBudget, 
      id,
      budget: insertBudget.budget.toString()
    };
    this.budgets.set(id, budget);
    return budget;
  }

  async updateBudget(id: number, updateData: Partial<InsertMonthlyBudget>): Promise<MonthlyBudget | undefined> {
    const budget = this.budgets.get(id);
    if (!budget) return undefined;
    
    const updated: MonthlyBudget = { 
      ...budget, 
      ...updateData,
      budget: updateData.budget ? updateData.budget.toString() : budget.budget
    };
    this.budgets.set(id, updated);
    return updated;
  }

  async createOCRLog(insertLog: InsertOCRLog): Promise<OCRLog> {
    const id = this.currentId++;
    const log: OCRLog = { 
      ...insertLog, 
      id,
      raw_json: insertLog.raw_json || null,
      created_at: new Date()
    };
    this.ocrLogs.set(id, log);
    return log;
  }

  async getOCRLogsByUserId(userId: number): Promise<OCRLog[]> {
    return Array.from(this.ocrLogs.values()).filter(log => log.user_id === userId);
  }
}

export const storage = new MemStorage();
