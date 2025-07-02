import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CategoryBreakdown } from "../../types/expense";
import { formatCurrency } from "../../lib/auth";
import { getCategoryColor } from "../../hooks/use-categories";
import FoodIcon from "../ui/icons/food-icon";
import TransportIcon from "../ui/icons/transport-icon";
import ShoppingIcon from "../ui/icons/shopping-icon";
import { motion } from "framer-motion";

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
        {categories.slice(0, 3).map((category, idx) => {
          const progressPercentage = category.budget > 0 
            ? (category.spent / category.budget) * 100 
            : 0;
          let CustomIcon = null;
          if (category.name.toLowerCase().includes("food")) CustomIcon = FoodIcon;
          if (category.name.toLowerCase().includes("transport")) CustomIcon = TransportIcon;
          if (category.name.toLowerCase().includes("shopping")) CustomIcon = ShoppingIcon;
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="border-none bg-white/70 backdrop-blur-lg shadow-xl hover:shadow-2xl transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100 shadow"
                        style={{ color: getCategoryColor(category.color) }}
                      >
                        {CustomIcon ? <CustomIcon className="w-6 h-6" /> : <i className={category.icon} />}
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
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
