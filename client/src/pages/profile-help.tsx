import { MobileHeader } from "../components/navigation/mobile-header";
import { BottomNav } from "../components/navigation/bottom-nav";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

export default function ProfileHelp() {
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen bg-app-background">
      <MobileHeader />
      <main className="pb-20">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="px-4 pt-4">
          <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate('/profile')}>
            ← Back to Profile
          </Button>
          <h1 className="text-2xl font-bold mb-6">Help & Support</h1>
          <div className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">FAQ</h2>
              <p className="text-gray-600 mb-2">Q: How do I reset my password?</p>
              <p className="text-gray-600 mb-4">A: Go to the login page and click "Forgot Password".</p>
              <p className="text-gray-600 mb-2">Q: How do I contact support?</p>
              <p className="text-gray-600">A: Email us at support@example.com.</p>
            </div>
          </div>
        </motion.div>
      </main>
      <BottomNav />
    </div>
  );
} 