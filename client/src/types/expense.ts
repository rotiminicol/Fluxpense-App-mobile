export interface ExpenseWithCategory {
  id: number;
  user_id: number;
  vendor: string;
  amount: string;
  date: string;
  category_id: number;
  notes?: string;
  receipt_url?: string;
  source: string;
  created_at: Date;
  category_name?: string;
  category_icon?: string;
  category_color?: string;
}

export interface CategoryBreakdown {
  id: number;
  name: string;
  icon: string;
  color: string;
  spent: number;
  budget: number;
  transactionCount: number;
}

export interface DashboardSummary {
  totalSpent: number;
  totalBudget: number;
  remainingBudget: number;
  categoryBreakdown: CategoryBreakdown[];
  recentTransactions: ExpenseWithCategory[];
}

export interface OCRResult {
  vendor: string;
  amount: number;
  date: string;
  category_id: number;
}
