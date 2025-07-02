import { useState } from "react";
import { Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MobileContainer } from "../components/layout/mobile-container";
import { MobileHeader } from "../components/navigation/mobile-header";
import { BottomNav } from "../components/navigation/bottom-nav";
import { ExpenseList } from "../components/expenses/expense-list";
import { AddExpenseForm } from "../components/expenses/add-expense-form";
import { useExpenses } from "../hooks/use-expenses";
import { useAuth } from "../hooks/use-auth";
import { getCurrentMonth } from "../lib/auth";
import { ExpenseWithCategory } from "../types/expense";

export default function Expenses() {
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseWithCategory | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  
  const { data: expenses = [], isLoading } = useExpenses(user!.id, selectedMonth);

  const handleEdit = (expense: ExpenseWithCategory) => {
    setEditingExpense(expense);
    setShowAddForm(true);
  };

  if (showAddForm) {
    return (
      <MobileContainer>
        <AddExpenseForm
          userId={user!.id}
          onClose={() => {
            setShowAddForm(false);
            setEditingExpense(null);
          }}
        />
      </MobileContainer>
    );
  }

  return (
    <MobileContainer>
      <MobileHeader />
      
      <main className="pb-20">
        <div className="px-4 pt-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold">Expenses</h1>
            <Button
              onClick={() => setShowAddForm(true)}
              size="sm"
              className="flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Add</span>
            </Button>
          </div>

          {/* Month Filter */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter size={16} />
            </Button>
          </div>

          {/* Summary Card */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Spent</p>
                  <p className="text-xl font-bold text-gray-900">
                    ${expenses.reduce((sum, expense) => sum + Number(expense.amount), 0).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Transactions</p>
                  <p className="text-xl font-bold text-gray-900">{expenses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expense List */}
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ExpenseList expenses={expenses} onEdit={handleEdit} />
          )}
        </div>
      </main>

      <BottomNav />
    </MobileContainer>
  );
}
