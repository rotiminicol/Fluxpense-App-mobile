import { Card, CardContent } from "@/components/ui/card";
import { ExpenseWithCategory } from "../../types/expense";

interface SpendingChartProps {
  expenses: ExpenseWithCategory[];
}

export function SpendingChart({ expenses }: SpendingChartProps) {
  // Group expenses by week for simple chart visualization
  const weeklyData = Array.from({ length: 4 }, (_, i) => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - (weekStart.getDay() + 7 * (3 - i)));
    
    const weekExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      return expenseDate >= weekStart && expenseDate <= weekEnd;
    });
    
    const total = weekExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
    return { week: i + 1, total };
  });

  const maxAmount = Math.max(...weeklyData.map(w => w.total));

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Spending Trends</h3>
        <div className="h-48 bg-gradient-to-t from-primary from-0% via-blue-400 via-50% to-blue-200 to-100% rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 flex items-end justify-around px-4 pb-4">
            {weeklyData.map((week) => (
              <div
                key={week.week}
                className="bg-white bg-opacity-80 rounded-t w-8"
                style={{ 
                  height: maxAmount > 0 ? `${(week.total / maxAmount) * 80}%` : '10%'
                }}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Week 1</span>
          <span>Week 2</span>
          <span>Week 3</span>
          <span>Week 4</span>
        </div>
      </CardContent>
    </Card>
  );
}
