import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Eye, EyeOff, Mail, ArrowLeft } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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
      damping: 12,
    },
  },
};

export default function Login() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const user = await authAPI.login(data.email, data.password);
      login(user);
      setLocation("/dashboard");
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <motion.div 
          className="absolute -left-20 -top-20 w-64 h-64 rounded-full bg-blue-50 z-0"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 0.9, 0.8],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div 
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-cyan-50 z-0"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 0.8, 0.7],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        <div className="w-full max-w-md z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="ghost"
              onClick={() => setLocation("/welcome")}
              className="mb-6 -ml-2 text-gray-600 hover:bg-transparent"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex justify-center mb-6">
                <img 
                  src="/big-bird.jpg" 
                  alt="ExpenseAI Logo" 
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
              <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-gray-500 text-center mt-2">Sign in to your ExpenseAI account</p>
            </motion.div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-gray-700">Password</FormLabel>
                          <a
                            href="/forgot-password"
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                          >
                            Forgot Password?
                          </a>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              className="pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="pt-2">
                  <Button
                    type="submit"
                    className="w-full py-6 text-base font-medium bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </motion.div>

                <motion.div variants={itemVariants} className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button 
                    variant="outline" 
                    type="button" 
                    className="w-full py-6 text-base border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
                    onClick={() => {
                      toast({
                        title: "Coming soon!",
                        description: "Google authentication will be available soon.",
                      });
                    }}
                  >
                    <FcGoogle className="mr-3 h-5 w-5" />
                    Continue with Google
                  </Button>
                </motion.div>
              </form>
            </Form>

            <motion.div 
              variants={itemVariants}
              className="mt-8 text-center text-sm text-gray-600"
            >
              <p>
                Don't have an account?{" "}
                <button
                  onClick={() => setLocation("/signup")}
                  className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Sign up
                </button>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-cyan-50 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="relative inline-block mb-8">
              <img 
                src="/3.jpg" 
                alt="Expense Tracking" 
                className="rounded-2xl shadow-2xl border-8 border-white transform rotate-2"
              />
              <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-xl shadow-lg">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <path d="M12 2v20m-5-5h10M5 17l-3 3m17 0l-3-3m0-14l3 3m-3-3h-4m-6 0H6m12 0h-4m6 4v4m-14-4v4m10-14h-4m-6 0H4m3 0l-3-3m14 3l3-3"></path>
                  </svg>
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Track Every Penny</h3>
            <p className="text-gray-600">Visualize your spending and take control of your finances with our intuitive dashboard.</p>
          </motion.div>
          
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
          <div className="absolute -top-10 -right-10 w-60 h-60 bg-cyan-100 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        </div>
      </div>
    </div>
  );
}
