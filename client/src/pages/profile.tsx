import { User, Settings, HelpCircle, LogOut, Camera, CreditCard, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MobileContainer } from "../components/layout/mobile-container";
import { MobileHeader } from "../components/navigation/mobile-header";
import { BottomNav } from "../components/navigation/bottom-nav";
import { useAuth } from "../hooks/use-auth";
import { useLocation } from "wouter";
import { formatCurrency } from "../lib/auth";
import { motion } from "framer-motion";

export default function Profile() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const profileStats = {
    totalExpenses: 2847.50,
    thisMonth: 54,
    avgPerDay: 94.92
  };

  const menuItems = [
    {
      icon: User,
      label: "Personal Information",
      description: "Update your profile details",
      onClick: () => navigate("/profile/personal-info")
    },
    {
      icon: CreditCard,
      label: "Budget Settings",
      description: "Manage your monthly budgets",
      onClick: () => navigate("/profile/budget-settings")
    },
    {
      icon: Camera,
      label: "OCR Settings",
      description: "Receipt scanning preferences",
      onClick: () => navigate("/profile/ocr-settings")
    },
    {
      icon: Bell,
      label: "Notifications",
      description: "Budget alerts and reminders",
      onClick: () => navigate("/profile/notifications")
    },
    {
      icon: Settings,
      label: "App Settings",
      description: "Currency, language, and theme",
      onClick: () => navigate("/settings")
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "FAQ and contact support",
      onClick: () => navigate("/profile/help")
    }
  ];

  return (
    <MobileContainer>
      <MobileHeader />
      
      <main className="pb-20">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="px-4 pt-4">
          {/* Profile Header */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <Card className="mb-6 bg-white/80 backdrop-blur-2xl shadow-2xl border-none">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <User className="text-white" size={32} />
                </div>
                <h2 className="text-xl font-semibold mb-1">
                  {user?.name || user?.email?.split('@')[0] || 'User'}
                </h2>
                <p className="text-gray-600 text-sm mb-4">{user?.email}</p>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-semibold">{formatCurrency(profileStats.totalExpenses)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">This Month</p>
                    <p className="font-semibold">{profileStats.thisMonth}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Avg/Day</p>
                    <p className="font-semibold">{formatCurrency(profileStats.avgPerDay)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Menu Items */}
          <div className="space-y-3">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div key={index} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + index * 0.07 }}>
                  <Card className="bg-white/80 backdrop-blur-2xl border-none shadow-xl">
                    <CardContent className="p-0">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={item.onClick}
                        className="w-full p-4 flex items-center justify-between hover:bg-green-50 rounded-none h-auto"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <IconComponent className="text-gray-600" size={20} />
                          </div>
                          <div className="text-left">
                            <p className="font-medium">{item.label}</p>
                            <p className="text-sm text-gray-500">{item.description}</p>
                          </div>
                        </div>
                        <div className="text-gray-400">
                          <i className="fas fa-chevron-right" />
                        </div>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Logout Button */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <Card className="mt-6 bg-white/80 backdrop-blur-2xl border-none shadow-xl">
              <CardContent className="p-0">
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full p-4 flex items-center justify-between hover:bg-red-50 rounded-none h-auto text-red-600 hover:text-red-700"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <LogOut className="text-red-600" size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Sign Out</p>
                      <p className="text-sm text-gray-500">Sign out of your account</p>
                    </div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>

      <BottomNav />
    </MobileContainer>
  );
}
