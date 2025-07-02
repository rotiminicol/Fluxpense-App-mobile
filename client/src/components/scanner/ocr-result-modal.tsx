import { CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OCRResult } from "../../types/expense";
import { formatCurrency, formatDate } from "../../lib/auth";

interface OCRResultModalProps {
  result: OCRResult | null;
  isOpen: boolean;
  onClose: () => void;
  onAccept: (result: OCRResult) => void;
  onEdit: (result: OCRResult) => void;
}

export function OCRResultModal({ 
  result, 
  isOpen, 
  onClose, 
  onAccept, 
  onEdit 
}: OCRResultModalProps) {
  if (!isOpen || !result) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm animate-slide-up">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Scan Results</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 rounded-full p-0"
            >
              <X className="text-gray-600" size={16} />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="text-green-600" size={20} />
                <span className="text-green-800 font-medium">Successfully Extracted</span>
              </div>
              <div className="text-sm text-green-700 space-y-1">
                <p><strong>Vendor:</strong> {result.vendor}</p>
                <p><strong>Amount:</strong> {formatCurrency(result.amount)}</p>
                <p><strong>Date:</strong> {formatDate(result.date)}</p>
                <p><strong>Category:</strong> Auto-detected</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                onClick={() => onAccept(result)}
                className="flex-1 bg-primary text-white py-3 rounded-xl font-medium hover:bg-blue-700"
              >
                Accept & Save
              </Button>
              <Button 
                onClick={() => onEdit(result)}
                variant="outline"
                className="flex-1 py-3 rounded-xl font-medium"
              >
                Edit Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
