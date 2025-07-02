import { Bell, User, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../hooks/use-auth";

export function MobileHeader() {
  const { user } = useAuth();

  return (
    <header className="bg-surface shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Receipt className="text-white" size={16} />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">ExpenseAI</h1>
          <p className="text-xs text-gray-500">
            Welcome, {user?.name || user?.email?.split('@')[0] || 'User'}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" className="w-8 h-8 bg-gray-100 rounded-full p-0">
          <Bell className="text-gray-600" size={16} />
        </Button>
        <Button variant="ghost" size="sm" className="w-8 h-8 bg-gray-100 rounded-full p-0">
          <User className="text-gray-600" size={16} />
        </Button>
      </div>
    </header>
  );
}
