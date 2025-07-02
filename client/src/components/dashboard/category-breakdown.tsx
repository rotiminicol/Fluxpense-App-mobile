import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CategoryBreakdown } from "../../types/expense";
import { formatCurrency } from "../../lib/auth";
import { getCategoryColor } from "../../hooks/use-categories";

interface CategoryBreakdownProps {
  categories: CategoryBreakdown[];
  onViewAll: () => void;
}

export function CategoryBreakdownComponent({ categories, onViewAll }: CategoryBreakdownProps) {
  return (
    <div className="mx-4 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Categories</h3>
        <button 
          onClick={onViewAll}
          className="text-primary text-sm font-medium hover:underline"
        >
          View All
        </button>
      </div>
      
      <div className="space-y-3">
        {categories.slice(0, 3).map((category) => {
          const progressPercentage = category.budget > 0 
            ? (category.spent / category.budget) * 100 
            : 0;
          
          return (
            <Card key={category.id} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ 
                        backgroundColor: `${getCategoryColor(category.color)}20`,
                        color: getCategoryColor(category.color)
                      }}
                    >
                      <i className={category.icon} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{category.name}</p>
                      <p className="text-sm text-gray-500">
                        {category.transactionCount} transactions
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(category.spent)}
                    </p>
                    <p className="text-xs text-gray-500">
                      of {formatCurrency(category.budget)}
                    </p>
                  </div>
                </div>
                <Progress 
                  value={progressPercentage} 
                  className="h-1.5"
                  style={{
                    '--progress-background': getCategoryColor(category.color)
                  } as React.CSSProperties}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
