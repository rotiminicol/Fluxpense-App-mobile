import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

export default function Splash() {
  const [, setLocation] = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
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
      scale: 1.05,
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

  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    <div className="h-screen overflow-hidden flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 to-gray-800 relative">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      <motion.div 
        className="text-center max-w-md w-full relative"
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {/* Logo with animation */}
        <motion.div 
          className="flex justify-center mb-8"
          variants={itemVariants}
        >
          <motion.div 
            className="w-40 h-40 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center border border-blue-500/20 p-1 overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isVisible ? { 
              scale: 1, 
              opacity: 1,
              rotate: [0, 5, -5, 5, 0],
            } : {}}
            transition={{
              scale: { duration: 0.5 },
              opacity: { duration: 0.5 },
              rotate: { 
                delay: 0.5,
                duration: 1.5,
                type: "spring"
              }
            }}
          >
            <img 
              src="/big-bird.jpg" 
              alt="Expense Tracker Logo" 
              className="w-full h-full rounded-full object-cover"
            />
          </motion.div>
        </motion.div>

        {/* Title with animation */}
        <motion.div 
          className="space-y-2 mb-12"
          variants={itemVariants}
        >
          <motion.h1 
            className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            ExpenseAI
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            Smart Expense Tracking, Simplified
          </motion.p>
        </motion.div>

        {/* Continue button with animation */}
        <motion.div
          variants={itemVariants}
          className="space-y-4"
        >
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="w-full max-w-xs mx-auto"
          >
            <Button
              onClick={() => setLocation('/welcome')}
              className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              Continue
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Animated background elements */}
        <motion.div
          className="absolute -z-10 w-64 h-64 rounded-full bg-blue-500/5 top-20 -left-20"
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
          className="absolute -z-10 w-96 h-96 rounded-full bg-cyan-500/5 -bottom-40 -right-40"
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
