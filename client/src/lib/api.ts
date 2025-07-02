import { apiRequest } from "./queryClient";
import { InsertExpense, InsertUser, User } from "@shared/schema";
import { DashboardSummary, OCRResult } from "../types/expense";

export const authAPI = {
  login: async (email: string, password: string): Promise<User> => {
    const response = await apiRequest('POST', '/api/auth/login', { email, password });
    return response.json();
  },

  signup: async (userData: InsertUser): Promise<User> => {
    const response = await apiRequest('POST', '/api/auth/signup', userData);
    return response.json();
  }
};

export const expenseAPI = {
  getExpenses: async (userId: number, month?: string) => {
    const params = new URLSearchParams({ userId: userId.toString() });
    if (month) params.append('month', month);
    
    const response = await apiRequest('GET', `/api/expenses?${params}`);
    return response.json();
  },

  createExpense: async (expense: InsertExpense) => {
    const response = await apiRequest('POST', '/api/expenses', expense);
    return response.json();
  },

  updateExpense: async (id: number, expense: Partial<InsertExpense>) => {
    const response = await apiRequest('PATCH', `/api/expenses/${id}`, expense);
    return response.json();
  },

  deleteExpense: async (id: number) => {
    const response = await apiRequest('DELETE', `/api/expenses/${id}`);
    return response.json();
  }
};

export const categoryAPI = {
  getCategories: async () => {
    const response = await apiRequest('GET', '/api/categories');
    return response.json();
  }
};

export const budgetAPI = {
  getBudgets: async (userId: number, month?: string) => {
    const params = new URLSearchParams({ userId: userId.toString() });
    if (month) params.append('month', month);
    
    const response = await apiRequest('GET', `/api/budgets?${params}`);
    return response.json();
  },

  createBudget: async (budget: any) => {
    const response = await apiRequest('POST', '/api/budgets', budget);
    return response.json();
  }
};

export const dashboardAPI = {
  getSummary: async (userId: number, month?: string): Promise<DashboardSummary> => {
    const params = new URLSearchParams({ userId: userId.toString() });
    if (month) params.append('month', month);
    
    const response = await apiRequest('GET', `/api/dashboard/summary?${params}`);
    return response.json();
  }
};

export const ocrAPI = {
  processReceipt: async (imageFile: File, userId: number): Promise<OCRResult> => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('userId', userId.toString());

    const response = await fetch('/api/receipt/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('OCR processing failed');
    }

    return response.json();
  }
};
