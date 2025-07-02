import { Home, List, BarChart3, User, Camera } from "lucide-react";
import { useLocation } from "wouter";
import React from "react";

interface BottomNavProps {
  onCameraClick?: () => void;
}

const navItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: List, label: "Expenses", path: "/expenses" },
  { icon: BarChart3, label: "Reports", path: "/reports" },
  { icon: User, label: "Profile", path: "/profile" },
];

export function BottomNav({ onCameraClick }: BottomNavProps) {
  const [location, navigate] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 px-2">
      <div className="relative flex items-center justify-between bg-white/80 backdrop-blur-2xl border-t border-gray-200 rounded-t-2xl shadow-2xl py-2" style={{ minHeight: 72 }}>
        {/* Left nav items */}
        <div className="flex flex-1 justify-evenly">
          {navItems.slice(0, 2).map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center px-2 ${location === item.path ? 'text-green-600' : 'text-gray-500 hover:text-green-500'}`}
              >
                <IconComponent size={22} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
        {/* Camera button in the center */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-7 z-10">
          <button
            onClick={onCameraClick}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-green-400 shadow-xl border-4 border-white flex items-center justify-center hover:scale-105 hover:from-green-500 hover:to-blue-400 transition-all"
            style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
          >
            <Camera size={32} className="text-white" />
          </button>
        </div>
        {/* Right nav items */}
        <div className="flex flex-1 justify-evenly">
          {navItems.slice(2).map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center px-2 ${location === item.path ? 'text-green-600' : 'text-gray-500 hover:text-green-500'}`}
              >
                <IconComponent size={22} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
