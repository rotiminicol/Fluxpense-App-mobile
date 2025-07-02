import { Home, List, BarChart3, User } from "lucide-react";
import { useLocation } from "wouter";

const navItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: List, label: "Expenses", path: "/expenses" },
  { icon: BarChart3, label: "Reports", path: "/reports" },
  { icon: User, label: "Profile", path: "/profile" },
];

export function BottomNav() {
  const [location, navigate] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-surface border-t border-gray-200 z-50">
      <div className="flex">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const IconComponent = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <IconComponent size={20} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
