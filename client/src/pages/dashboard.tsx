import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Camera, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileContainer } from "../components/layout/mobile-container";
import { MobileHeader } from "../components/navigation/mobile-header";
import { BottomNav } from "../components/navigation/bottom-nav";
import { BudgetOverview } from "../components/dashboard/budget-overview";
import { CategoryBreakdownComponent } from "../components/dashboard/category-breakdown";
import { RecentTransactions } from "../components/dashboard/recent-transactions";
import { CameraInterface } from "../components/scanner/camera-interface";
import { OCRResultModal } from "../components/scanner/ocr-result-modal";
import { AddExpenseForm } from "../components/expenses/add-expense-form";
import { dashboardAPI } from "../lib/api";
import { useAuth } from "../hooks/use-auth";
import { useCreateExpense } from "../hooks/use-expenses";
import { getCurrentMonth } from "../lib/auth";
import { OCRResult } from "../types/expense";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [showCamera, setShowCamera] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [showOcrModal, setShowOcrModal] = useState(false);
  const createExpense = useCreateExpense();

  const { data: summary, isLoading } = useQuery({
    queryKey: ['/api/dashboard/summary', user?.id, getCurrentMonth()],
    queryFn: () => dashboardAPI.getSummary(user!.id, getCurrentMonth()),
    enabled: !!user?.id,
  });

  const handleScanResult = (result: OCRResult) => {
    setOcrResult(result);
    setShowOcrModal(true);
  };

  const handleAcceptOCR = (result: OCRResult) => {
    createExpense.mutate({
      user_id: user!.id,
      vendor: result.vendor,
      amount: result.amount.toString(),
      date: result.date,
      category_id: result.category_id,
      source: "camera",
    });
    setShowOcrModal(false);
    setOcrResult(null);
  };

  const handleEditOCR = (result: OCRResult) => {
    setShowOcrModal(false);
    setOcrResult(result);
    setShowAddForm(true);
  };

  if (showCamera) {
    return (
      <CameraInterface
        userId={user!.id}
        onClose={() => setShowCamera(false)}
        onScanResult={handleScanResult}
      />
    );
  }

  if (showAddForm) {
    return (
      <MobileContainer>
        <AddExpenseForm
          userId={user!.id}
          onClose={() => {
            setShowAddForm(false);
            setOcrResult(null);
          }}
          ocrData={ocrResult}
        />
      </MobileContainer>
    );
  }

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
        {summary && (
          <>
            <BudgetOverview summary={summary} />

            {/* Quick Actions */}
            <div className="mx-4 mt-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => setShowCamera(true)}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Camera className="text-white" size={20} />
                  </div>
                  <span className="text-sm font-medium">Scan Receipt</span>
                </Button>
                
                <Button
                  onClick={() => setShowAddForm(true)}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                    <Plus className="text-white" size={20} />
                  </div>
                  <span className="text-sm font-medium">Add Expense</span>
                </Button>
              </div>
            </div>

            <CategoryBreakdownComponent
              categories={summary.categoryBreakdown}
              onViewAll={() => navigate("/reports")}
            />

            <RecentTransactions
              transactions={summary.recentTransactions}
              onViewAll={() => navigate("/expenses")}
            />
          </>
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-4 z-40">
        <Button
          onClick={() => setShowCamera(true)}
          size="lg"
          className="w-14 h-14 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          <Camera size={24} />
        </Button>
      </div>

      <BottomNav />

      <OCRResultModal
        result={ocrResult}
        isOpen={showOcrModal}
        onClose={() => {
          setShowOcrModal(false);
          setOcrResult(null);
        }}
        onAccept={handleAcceptOCR}
        onEdit={handleEditOCR}
      />
    </MobileContainer>
  );
}
