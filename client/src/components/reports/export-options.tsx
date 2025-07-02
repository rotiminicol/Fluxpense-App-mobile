import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download, ChevronRight } from "lucide-react";
import { ExpenseWithCategory } from "../../types/expense";
import { formatCurrency, formatDate } from "../../lib/auth";

interface ExportOptionsProps {
  expenses: ExpenseWithCategory[];
}

export function ExportOptions({ expenses }: ExportOptionsProps) {
  const exportToPDF = () => {
    // Create a simple CSV-like text format for demonstration
    const content = [
      "EXPENSE REPORT",
      "===============",
      "",
      "Date, Vendor, Category, Amount, Notes",
      ...expenses.map(expense => 
        `${formatDate(expense.date)}, ${expense.vendor}, ${expense.category_name}, ${formatCurrency(Number(expense.amount))}, ${expense.notes || ''}`
      ),
      "",
      `Total: ${formatCurrency(expenses.reduce((sum, expense) => sum + Number(expense.amount), 0))}`
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Vendor', 'Category', 'Amount', 'Notes'];
    const rows = expenses.map(expense => [
      expense.date,
      expense.vendor,
      expense.category_name || '',
      expense.amount,
      expense.notes || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      <Card className="border border-gray-200">
        <CardContent className="p-0">
          <Button
            variant="ghost"
            onClick={exportToPDF}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 rounded-none"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <FileText className="text-red-600" size={20} />
              </div>
              <div className="text-left">
                <p className="font-medium">Export as PDF</p>
                <p className="text-sm text-gray-500">Detailed expense report</p>
              </div>
            </div>
            <ChevronRight className="text-gray-400" size={16} />
          </Button>
        </CardContent>
      </Card>
      
      <Card className="border border-gray-200">
        <CardContent className="p-0">
          <Button
            variant="ghost"
            onClick={exportToCSV}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 rounded-none"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Download className="text-green-600" size={20} />
              </div>
              <div className="text-left">
                <p className="font-medium">Export as CSV</p>
                <p className="text-sm text-gray-500">Raw data for analysis</p>
              </div>
            </div>
            <ChevronRight className="text-gray-400" size={16} />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
