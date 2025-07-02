import { MobileHeader } from "../components/navigation/mobile-header";
import { BottomNav } from "../components/navigation/bottom-nav";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

export default function ProfilePersonalInfo() {
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen bg-app-background">
      <MobileHeader />
      <main className="pb-20">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="px-4 pt-4">
          <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate('/profile')}>
            ← Back to Profile
          </Button>
          <h1 className="text-2xl font-bold mb-6">Personal Information</h1>
          <form className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Your Name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Your Email" />
            </div>
            <Button type="submit" className="w-full mt-4">Save</Button>
          </form>
        </motion.div>
      </main>
      <BottomNav />
    </div>
  );
} 