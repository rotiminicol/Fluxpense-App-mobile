import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { ExpenseWithCategory } from "../../types/expense";
import { formatCurrency, formatDate } from "../../lib/auth";
import { getCategoryColor } from "../../hooks/use-categories";
import { useDeleteExpense } from "../../hooks/use-expenses";

interface ExpenseListProps {
  expenses: ExpenseWithCategory[];
  onEdit: (expense: ExpenseWithCategory) => void;
}

export function ExpenseList({ expenses, onEdit }: ExpenseListProps) {
  const deleteExpense = useDeleteExpense();

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      deleteExpense.mutate(id);
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-receipt text-gray-400 text-xl" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No expenses yet</h3>
        <p className="text-gray-600">Start tracking your expenses by adding one manually or scanning a receipt.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <Card key={expense.id} className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ 
                  backgroundColor: `${getCategoryColor(expense.category_color || 'gray')}20`,
                  color: getCategoryColor(expense.category_color || 'gray')
                }}
              >
                <i className={expense.category_icon || 'fas fa-question'} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{expense.vendor}</p>
                <p className="text-sm text-gray-500">{expense.category_name}</p>
                <p className="text-xs text-gray-400">{formatDate(expense.date)}</p>
                {expense.notes && (
                  <p className="text-xs text-gray-500 mt-1 truncate">{expense.notes}</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  -{formatCurrency(Number(expense.amount))}
                </p>
                <div className="flex space-x-1 mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(expense)}
                    className="w-6 h-6 p-0"
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(expense.id)}
                    className="w-6 h-6 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
