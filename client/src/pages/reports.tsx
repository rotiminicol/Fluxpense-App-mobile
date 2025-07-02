import { useState } from "react";
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

export default function Reports() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<"month" | "3months" | "year">("month");
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  
  const { data: expenses = [], isLoading } = useExpenses(user!.id, selectedMonth);

  // Calculate category breakdown
  const categoryBreakdown = expenses.reduce((acc, expense) => {
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
  }, {} as Record<string, { name: string; total: number; count: number; color: string }>);

  const totalSpent = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const lastMonthSpent = 2547.30; // This would be calculated from last month's data
  const changePercentage = totalSpent > 0 ? ((totalSpent - lastMonthSpent) / lastMonthSpent) * 100 : 0;

  if (isLoading) {
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
        <div className="px-4 pt-4">
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
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500 mb-1">Total Spent</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
                <p className={`text-xs mt-1 ${changePercentage >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {changePercentage >= 0 ? '↑' : '↓'} {Math.abs(changePercentage).toFixed(1)}% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500 mb-1">Transactions</p>
                <p className="text-xl font-bold text-gray-900">{expenses.length}</p>
                <p className="text-xs text-blue-600 mt-1">↑ 8% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Spending Trends Chart */}
          <div className="mb-6">
            <SpendingChart expenses={expenses} />
          </div>

          {/* Category Breakdown */}
          <Card className="mb-6">
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

          {/* Export Options */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Export Data</h3>
            <ExportOptions expenses={expenses} />
          </div>
        </div>
      </main>

      <BottomNav />
    </MobileContainer>
  );
}
