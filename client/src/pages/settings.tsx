import { MobileHeader } from "../components/navigation/mobile-header";
import { BottomNav } from "../components/navigation/bottom-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

export default function Settings() {
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen bg-app-background">
      <MobileHeader />
      <main className="pb-20">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="px-4 pt-4">
          <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate('/profile')}>
            ← Back to Profile
          </Button>
          <h1 className="text-2xl font-bold mb-6">App Settings</h1>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-2xl border-none shadow-xl">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-2">Currency</h2>
                <p className="text-gray-600 mb-2">Choose your preferred currency.</p>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option value="usd">USD ($)</option>
                  <option value="eur">EUR (€)</option>
                  <option value="gbp">GBP (£)</option>
                </select>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-2xl border-none shadow-xl">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-2">Language</h2>
                <p className="text-gray-600 mb-2">Choose your preferred language.</p>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-2xl border-none shadow-xl">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-2">Theme</h2>
                <p className="text-gray-600 mb-2">Choose your preferred theme.</p>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System Default</option>
                </select>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
      <BottomNav />
    </div>
  );
} 