import { MobileHeader } from "../components/navigation/mobile-header";
import { BottomNav } from "../components/navigation/bottom-nav";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

export default function ProfileOCRSettings() {
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen bg-app-background">
      <MobileHeader />
      <main className="pb-20">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="px-4 pt-4">
          <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate('/profile')}>
            ← Back to Profile
          </Button>
          <h1 className="text-2xl font-bold mb-6">OCR Settings</h1>
          <div className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Enable OCR</span>
              <input type="checkbox" className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Auto-categorize Receipts</span>
              <input type="checkbox" className="w-5 h-5" />
            </div>
          </div>
        </motion.div>
      </main>
      <BottomNav />
    </div>
  );
} 