import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, LogIn } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const buttonVariants = {
  hover: {
    scale: 1.03,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      type: "spring",
      stiffness: 300,
    },
  },
  tap: {
    scale: 0.98,
  },
};

export default function WelcomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [, setLocation] = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Create particles
    const particles = Array(50).fill(null).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: Math.random() * 2 - 1,
      speedY: Math.random() * 2 - 1,
      color: `rgba(59, 130, 246, ${Math.random() * 0.3 + 0.1})`
    }));
    
    // Animation loop
    let animationId: number;
    const animate = () => {
      if (!ctx) return;
      
      // Clear canvas with semi-transparent black for trail effect
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(particle => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []); 

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-6 relative">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      <button
        onClick={() => setLocation('/')}
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-800 transition-colors duration-200 text-gray-400 hover:text-white z-10"
        aria-label="Go back to splash screen"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <motion.div 
        className="text-center max-w-md w-full z-10"
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={containerVariants}
        style={{ opacity: 1 }} // Ensure the container is always visible
      >
        <motion.div 
          className="mb-12 flex flex-col items-center"
          variants={itemVariants}
        >
          <div className="w-40 h-40 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center border border-blue-500/20 mb-6 p-1 overflow-hidden">
            <img 
              src="/big bird.jpg" 
              alt="Expense Tracker Logo" 
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-4"
          >
            Welcome to ExpenseAI
          </motion.h1>
          <motion.p className="text-gray-300 mb-8">
            Start managing your expenses effectively and achieve your financial goals
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="space-y-4"
          variants={itemVariants}
        >
          <motion.div
            variants={itemVariants}
            className="w-full"
          >
            <motion.button
              onClick={() => setLocation('/signup')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 flex items-center justify-center"
              whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.button>
          </motion.div>
          
          <motion.div
            variants={itemVariants}
            className="w-full mt-4"
          >
            <motion.button
              onClick={() => setLocation('/login')}
              className="w-full bg-transparent border-2 border-blue-400 text-blue-400 hover:bg-blue-900/30 hover:text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 flex items-center justify-center"
              whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              whileTap={{ scale: 0.98 }}
            >
              <LogIn className="mr-2 h-5 w-5" />
              Log In
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Animated background elements */}
        <motion.div
          className="absolute -z-10 w-64 h-64 rounded-full bg-blue-500/5 -top-20 -right-20"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 0.8, 0.7],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="absolute -z-10 w-96 h-96 rounded-full bg-cyan-500/5 -bottom-40 -left-40"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </motion.div>
    </div>
  );
}
