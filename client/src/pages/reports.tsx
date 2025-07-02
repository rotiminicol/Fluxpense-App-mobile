import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MobileContainer } from "../components/layout/mobile-container";
import { MobileHeader } from "../components/navigation/mobile-header";
import { BottomNav } from "../components/navigation/bottom-nav";
import { SpendingChart } from "../components/reports/spending-chart";
import { ExportOptions } from "../components/reports/export-options";
import { useExpenses } from "../hooks/use-expenses";
import { useAuth } from "../hooks/use-auth";
import { getCurrentMonth, formatCurrency } from "../lib/auth";
import { getCategoryColor } from "../hooks/use-categories";
import { ExpenseWithCategory } from "../types/expense";
import { motion } from "framer-motion";

interface CategoryBreakdown {
  [key: string]: {
    name: string;
    total: number;
    count: number;
    color: string;
  };
}

export default function Reports() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedPeriod, setSelectedPeriod] = useState<"month" | "3months" | "year">("month");
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  
  const { data: expenses = [], isLoading: isExpensesLoading } = useExpenses(
    user?.id || 0,
    selectedMonth
  );

  if (isAuthLoading) {
    return (
      <MobileContainer>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </MobileContainer>
    );
  }

  if (!user) {
    setLocation('/login');
    return null;
  }

  // Calculate category breakdown
  const categoryBreakdown = (expenses as ExpenseWithCategory[]).reduce((acc: CategoryBreakdown, expense: ExpenseWithCategory) => {
    const categoryName = expense.category_name || 'Unknown';
    if (!acc[categoryName]) {
      acc[categoryName] = {
        name: categoryName,
        total: 0,
        count: 0,
        color: expense.category_color || 'gray'
      };
    }
    acc[categoryName].total += Number(expense.amount);
    acc[categoryName].count += 1;
    return acc;
  }, {} as CategoryBreakdown);

  const totalSpent = expenses.reduce((sum: number, expense: ExpenseWithCategory) => sum + Number(expense.amount), 0);
  const lastMonthSpent = 2547.30; // This would be calculated from last month's data
  const changePercentage = totalSpent > 0 ? ((totalSpent - lastMonthSpent) / lastMonthSpent) * 100 : 0;

  if (isExpensesLoading) {
    return (
      <MobileContainer>
        <MobileHeader />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <BottomNav />
      </MobileContainer>
    );
  }

  return (
    <MobileContainer>
      <MobileHeader />
      
      <main className="pb-20">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="px-4 pt-4">
          <h1 className="text-xl font-semibold mb-6">Reports & Analytics</h1>

          {/* Time Period Selector */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <Button
              variant={selectedPeriod === "month" ? "default" : "ghost"}
              className="flex-1 text-sm"
              onClick={() => setSelectedPeriod("month")}
            >
              This Month
            </Button>
            <Button
              variant={selectedPeriod === "3months" ? "default" : "ghost"}
              className="flex-1 text-sm"
              onClick={() => setSelectedPeriod("3months")}
            >
              3 Months
            </Button>
            <Button
              variant={selectedPeriod === "year" ? "default" : "ghost"}
              className="flex-1 text-sm"
              onClick={() => setSelectedPeriod("year")}
            >
              Year
            </Button>
          </div>

          {/* Summary Cards */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 gap-4 mb-6">
            <Card className="bg-white/80 backdrop-blur-2xl border-none shadow-xl">
              <CardContent className="p-4">
                <p className="text-sm text-gray-500 mb-1">Total Spent</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
                <p className={`text-xs mt-1 ${changePercentage >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {changePercentage >= 0 ? '\u2191' : '\u2193'} {Math.abs(changePercentage).toFixed(1)}% from last month
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-2xl border-none shadow-xl">
              <CardContent className="p-4">
                <p className="text-sm text-gray-500 mb-1">Transactions</p>
                <p className="text-xl font-bold text-gray-900">{expenses.length}</p>
                <p className="text-xs text-blue-600 mt-1">\u2191 8% from last month</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Spending Trends Chart */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="mb-6">
            <SpendingChart expenses={expenses} />
          </motion.div>

          {/* Category Breakdown */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card className="mb-6 bg-white/80 backdrop-blur-2xl border-none shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
                <div className="space-y-4">
                  {Object.values(categoryBreakdown).map((category) => {
                    const percentage = totalSpent > 0 ? (category.total / totalSpent) * 100 : 0;
                    return (
                      <div key={category.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getCategoryColor(category.color) }}
                          />
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatCurrency(category.total)}</p>
                          <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Export Options */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Export Data</h3>
            <ExportOptions expenses={expenses} />
          </motion.div>
        </motion.div>
      </main>

      <BottomNav />
    </MobileContainer>
  );
}
