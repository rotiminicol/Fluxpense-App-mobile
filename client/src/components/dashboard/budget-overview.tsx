import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "../../lib/auth";
import { DashboardSummary } from "../../types/expense";

interface BudgetOverviewProps {
  summary: DashboardSummary;
}

export function BudgetOverview({ summary }: BudgetOverviewProps) {
  const budgetUsedPercentage = summary.totalBudget > 0 
    ? (summary.totalSpent / summary.totalBudget) * 100 
    : 0;

  return (
    <Card className="mx-4 mt-4 bg-gradient-to-r from-primary to-blue-600 text-white border-none">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-blue-100 text-sm font-medium">This Month</p>
            <h2 className="text-2xl font-bold">{formatCurrency(summary.totalSpent)}</h2>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Budget</p>
            <p className="text-lg font-semibold">{formatCurrency(summary.totalBudget)}</p>
          </div>
        </div>
        
        <div className="bg-blue-700 rounded-full h-2 mb-2">
          <div 
            className="bg-white rounded-full h-2 transition-all duration-500" 
            style={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-blue-100">
          <span>{Math.round(budgetUsedPercentage)}% of budget used</span>
          <span>{formatCurrency(summary.remainingBudget)} left</span>
        </div>
      </CardContent>
    </Card>
  );
}
