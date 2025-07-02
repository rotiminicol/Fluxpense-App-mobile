import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';

const categoryOptions = [
  { name: 'Food', icon: '/1.jpg' },
  { name: 'Transport', icon: '/2.jpg' },
  { name: 'Shopping', icon: '/3.jpg' },
  { name: 'Other', icon: '/4.jpg' },
];

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    position: 'absolute',
  }),
  center: {
    x: 0,
    opacity: 1,
    position: 'relative',
    transition: { duration: 0.45, ease: 'easeInOut' },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    position: 'absolute',
    transition: { duration: 0.45, ease: 'easeInOut' },
  }),
};

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for back
  const [, navigate] = useLocation();
  const [budget, setBudget] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [savings, setSavings] = useState('');
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(false);

  const isLastStep = step === 5;
  const isFirstStep = step === 0;

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1);
      setStep((s) => s + 1);
    } else {
      navigate('/dashboard');
    }
  };
  const handleBack = () => {
    if (!isFirstStep) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  };

  // Custom toggle component
  const Toggle = ({ enabled, setEnabled, color }: { enabled: boolean; setEnabled: (v: boolean) => void; color: string }) => (
    <button
      type="button"
      onClick={() => setEnabled(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${enabled ? color : 'bg-gray-200'}`}
    >
      <span className="sr-only">Toggle</span>
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  );

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50 relative overflow-hidden">
      {/* Animated background blobs */}
      <motion.div className="absolute -left-32 -top-32 w-96 h-96 rounded-full bg-blue-100 z-0" animate={{ scale: [1, 1.1, 1], opacity: [0.7, 0.8, 0.7] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute -bottom-40 -right-40 w-[32rem] h-[32rem] rounded-full bg-cyan-100 z-0" animate={{ scale: [1, 1.1, 1], opacity: [0.7, 0.8, 0.7] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }} />
      {/* Logo at the very top */}
      <div className="w-full flex justify-center pt-8 z-10">
        <img src="/big-bird.jpg" alt="ExpenseAI Logo" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-2xl" />
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-lg z-10 px-4"
        style={{ minHeight: '400px', maxHeight: '480px', overflow: 'hidden', position: 'relative' }}>
        <AnimatePresence custom={direction} initial={false} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="w-full"
          >
            {/* Step 1: Welcome */}
            {step === 0 && (
              <div className="flex flex-col items-center justify-center gap-4 min-h-[300px] max-h-[400px] overflow-hidden">
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.7 }} className="w-36 h-36 rounded-2xl bg-gradient-to-br from-blue-200 via-cyan-200 to-emerald-200 flex items-center justify-center shadow-xl">
                  <img src="/4.jpg" alt="Onboarding Illustration" className="w-24 h-24 object-cover rounded-xl shadow-lg" />
                </motion.div>
                <motion.h2 className="text-2xl font-extrabold text-center bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent drop-shadow-lg" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>Welcome to ExpenseAI!</motion.h2>
                <motion.p className="text-base text-center text-gray-700 max-w-md" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>Your journey to smarter spending starts here. <span className="font-semibold text-blue-600">Track</span>, <span className="font-semibold text-cyan-600">analyze</span>, and <span className="font-semibold text-emerald-600">save</span> with ease. Let's personalize your experience in just a few steps!</motion.p>
                {/* Redesigned Track/Analyze/Save stepper */}
                <motion.div
                  className="flex items-center justify-center gap-0 w-full max-w-xs mt-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  {/* Track */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-bold shadow-lg animate-bounce">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" /><rect width="4" height="10" x="7" y="7" rx="1" /><rect width="4" height="6" x="15" y="11" rx="1" /></svg>
                      </div>
                    </div>
                    <span className="mt-2 text-xs font-semibold text-blue-600">Track</span>
                  </div>
                  {/* Line */}
                  <div className="h-1 w-6 bg-gradient-to-r from-blue-500 to-cyan-500 mx-1 rounded-full" />
                  {/* Analyze */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white text-lg font-bold shadow-lg animate-pulse">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h4l2 2" /></svg>
                      </div>
                    </div>
                    <span className="mt-2 text-xs font-semibold text-cyan-600">Analyze</span>
                  </div>
                  {/* Line */}
                  <div className="h-1 w-6 bg-gradient-to-r from-cyan-500 to-emerald-500 mx-1 rounded-full" />
                  {/* Save */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white text-lg font-bold shadow-lg animate-bounce">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19V6m0 0l-7 7m7-7l7 7" /></svg>
                      </div>
                    </div>
                    <span className="mt-2 text-xs font-semibold text-emerald-600">Save</span>
                  </div>
                </motion.div>
              </div>
            )}
            {/* Step 2: Set Monthly Budget */}
            {step === 1 && (
              <div className="flex flex-col items-center justify-center gap-4 min-h-[300px] max-h-[400px] overflow-hidden">
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.7 }} className="w-36 h-36 rounded-2xl bg-gradient-to-br from-blue-100 via-cyan-100 to-emerald-100 flex items-center justify-center shadow-xl">
                  <img src="/1.jpg" alt="Budget Illustration" className="w-20 h-20 object-cover rounded-xl shadow-lg" />
                </motion.div>
                <h2 className="text-xl font-bold text-center text-blue-700">Set Your Monthly Budget</h2>
                <input type="number" min="0" placeholder="$0.00" value={budget} onChange={e => setBudget(e.target.value)} className="w-40 text-center text-xl font-semibold rounded-xl border-2 border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 py-2 px-3 shadow-md bg-white/80 transition-all" />
                <p className="text-center text-gray-500 text-sm">A clear budget helps you stay on track and reach your goals faster!</p>
              </div>
            )}
            {/* Step 3: Select Expense Categories */}
            {step === 2 && (
              <div className="flex flex-col items-center justify-center gap-4 min-h-[300px] max-h-[400px] overflow-hidden">
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.7 }} className="w-36 h-36 rounded-2xl bg-gradient-to-br from-blue-100 via-cyan-100 to-emerald-100 flex items-center justify-center shadow-xl">
                  <img src="/2.jpg" alt="Categories Illustration" className="w-20 h-20 object-cover rounded-xl shadow-lg" />
                </motion.div>
                <h2 className="text-xl font-bold text-center text-blue-700">Choose Categories to Track</h2>
                <div className="flex flex-wrap gap-3 justify-center">
                  {categoryOptions.map(cat => (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setCategories(cats => cats.includes(cat.name) ? cats.filter(c => c !== cat.name) : [...cats, cat.name])}
                      className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all shadow-md ${categories.includes(cat.name) ? 'bg-gradient-to-r from-blue-500 to-cyan-400 border-blue-600 text-white scale-105' : 'bg-white/80 border-gray-200 text-gray-700 hover:border-blue-400'}`}
                    >
                      <img src={cat.icon} alt={cat.name} className="w-7 h-7 mb-1 rounded-full" />
                      <span className="text-xs font-medium">{cat.name}</span>
                    </button>
                  ))}
                </div>
                <p className="text-center text-gray-500 text-sm">Pick as many as you like. You can always change these later!</p>
              </div>
            )}
            {/* Step 4: Set Savings Goal */}
            {step === 3 && (
              <div className="flex flex-col items-center justify-center gap-4 min-h-[300px] max-h-[400px] overflow-hidden">
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.7 }} className="w-36 h-36 rounded-2xl bg-gradient-to-br from-blue-100 via-cyan-100 to-emerald-100 flex items-center justify-center shadow-xl">
                  <img src="/3.jpg" alt="Savings Illustration" className="w-20 h-20 object-cover rounded-xl shadow-lg" />
                </motion.div>
                <h2 className="text-xl font-bold text-center text-blue-700">Set a Savings Goal</h2>
                <input type="number" min="0" placeholder="$0.00" value={savings} onChange={e => setSavings(e.target.value)} className="w-40 text-center text-xl font-semibold rounded-xl border-2 border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 py-2 px-3 shadow-md bg-white/80 transition-all" />
                <p className="text-center text-gray-500 text-sm">A savings goal helps you build your future, one step at a time!</p>
              </div>
            )}
            {/* Step 5: Notification Preferences */}
            {step === 4 && (
              <div className="flex flex-col items-center justify-center gap-4 min-h-[300px] max-h-[400px] overflow-hidden">
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.7 }} className="w-36 h-36 rounded-2xl bg-gradient-to-br from-blue-100 via-cyan-100 to-emerald-100 flex items-center justify-center shadow-xl">
                  <img src="/5.jpg" alt="Notification Illustration" className="w-20 h-20 object-cover rounded-xl shadow-lg" />
                </motion.div>
                <h2 className="text-xl font-bold text-center text-blue-700">Notification Preferences</h2>
                <div className="flex flex-col gap-3 w-full max-w-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Email Alerts</span>
                    <Toggle enabled={notifEmail} setEnabled={setNotifEmail} color="bg-blue-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Push Notifications</span>
                    <Toggle enabled={notifPush} setEnabled={setNotifPush} color="bg-cyan-500" />
                  </div>
                </div>
                <p className="text-center text-gray-500 text-sm">Stay up to date with your spending and savings progress!</p>
              </div>
            )}
            {/* Step 6: Connect Bank Account */}
            {step === 5 && (
              <div className="flex flex-col items-center justify-center gap-4 min-h-[300px] max-h-[400px] overflow-hidden">
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.7 }} className="w-36 h-36 rounded-2xl bg-gradient-to-br from-blue-100 via-cyan-100 to-emerald-100 flex items-center justify-center shadow-xl">
                  <img src="/6.jpg" alt="Bank Illustration" className="w-20 h-20 object-cover rounded-xl shadow-lg" />
                </motion.div>
                <h2 className="text-xl font-bold text-center text-blue-700">Connect Your Bank (Optional)</h2>
                <Button className="w-full max-w-xs py-3 text-base bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg">Connect Bank</Button>
                <p className="text-center text-gray-500 text-xs max-w-xs">We use bank-level encryption. You can always connect your account later in settings.</p>
              </div>
            )}
            {/* Stepper */}
            <div className="mt-6 flex justify-center">
              <div className="flex gap-2">
                {[...Array(6)].map((_, idx) => (
                  <motion.div key={idx} className={`w-4 h-4 rounded-full border-2 ${idx === step ? 'bg-gradient-to-r from-blue-600 to-cyan-500 border-blue-600 scale-110' : 'bg-gray-200 border-gray-300'} transition-all`} animate={{ scale: idx === step ? 1.2 : 1, opacity: idx === step ? 1 : 0.7 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} />
                ))}
              </div>
            </div>
            <div className="mt-2 text-center text-xs text-gray-400">Step {step + 1} of 6</div>
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Buttons at the very bottom, always visible */}
      <div className="w-full flex justify-between items-center px-8 pb-8 z-10 max-w-lg mx-auto">
        <Button variant="outline" onClick={handleBack} disabled={isFirstStep} className="px-8 py-3 text-base">Back</Button>
        <Button onClick={handleNext} className="px-8 py-3 text-base bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg">{isLastStep ? 'Finish' : 'Next'}</Button>
      </div>
    </div>
  );
} 