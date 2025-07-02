import { Card, CardContent } from "@/components/ui/card";
import { ExpenseWithCategory } from "../../types/expense";
import { formatCurrency, formatDate } from "../../lib/auth";
import { getCategoryColor } from "../../hooks/use-categories";

interface RecentTransactionsProps {
  transactions: ExpenseWithCategory[];
  onViewAll: () => void;
}

export function RecentTransactions({ transactions, onViewAll }: RecentTransactionsProps) {
  return (
    <div className="mx-4 mt-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <button 
          onClick={onViewAll}
          className="text-primary text-sm font-medium hover:underline"
        >
          View All
        </button>
      </div>
      
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <Card key={transaction.id} className="border border-gray-200">
            <CardContent className="p-4 flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ 
                  backgroundColor: `${getCategoryColor(transaction.category_color || 'gray')}20`,
                  color: getCategoryColor(transaction.category_color || 'gray')
                }}
              >
                <i className={transaction.category_icon || 'fas fa-question'} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{transaction.vendor}</p>
                <p className="text-sm text-gray-500">{transaction.category_name}</p>
                <p className="text-xs text-gray-400">{formatDate(transaction.date)}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  -{formatCurrency(Number(transaction.amount))}
                </p>
                <div className="w-2 h-2 bg-secondary rounded-full mt-1 ml-auto" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
