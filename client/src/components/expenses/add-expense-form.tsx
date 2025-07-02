import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { insertExpenseSchema, type InsertExpense } from "@shared/schema";
import { useCategories, getCategoryColor } from "../../hooks/use-categories";
import { useCreateExpense } from "../../hooks/use-expenses";
import { OCRResult } from "../../types/expense";
import { motion } from "framer-motion";

interface AddExpenseFormProps {
  userId: number;
  onClose: () => void;
  ocrData?: OCRResult;
}

const expenseFormSchema = insertExpenseSchema.extend({
  date: insertExpenseSchema.shape.date,
});

export function AddExpenseForm({ userId, onClose, ocrData }: AddExpenseFormProps) {
  const [selectedCategory, setSelectedCategory] = useState<number>(ocrData?.category_id || 1);
  const { data: categories = [] } = useCategories();
  const createExpense = useCreateExpense();

  const form = useForm<InsertExpense>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      user_id: userId,
      vendor: ocrData?.vendor || "",
      amount: ocrData?.amount?.toString() || "",
      date: ocrData?.date || new Date().toISOString().split('T')[0],
      category_id: selectedCategory,
      notes: "",
      source: ocrData ? "camera" : "manual",
    },
  });

  const onSubmit = (data: InsertExpense) => {
    createExpense.mutate({
      ...data,
      category_id: selectedCategory,
    }, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="">
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Add Expense</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full p-0"
          >
            <X className="text-gray-600" size={16} />
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl p-6">
            {/* Amount Input */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-4 top-4 text-gray-500 text-lg">$</span>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-8 pr-4 py-4 text-lg font-medium"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Vendor Input */}
            <FormField
              control={form.control}
              name="vendor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Where did you spend?"
                      className="py-4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <div className="grid grid-cols-3 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`category-btn ${selectedCategory === category.id ? 'selected' : ''}`}
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                      style={{ 
                        backgroundColor: `${getCategoryColor(category.color)}20`,
                        color: getCategoryColor(category.color)
                      }}
                    >
                      <i className={category.icon} />
                    </div>
                    <span className="text-xs font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Input */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className="py-4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Add any additional details..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Receipt Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Receipt (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary transition-colors">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Camera className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">Tap to upload receipt photo</p>
                <input type="file" accept="image/*" className="hidden" />
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit"
              disabled={createExpense.isPending}
              className="w-full py-4 text-lg font-medium"
            >
              {createExpense.isPending ? "Adding..." : "Add Expense"}
            </Button>
          </form>
        </Form>
      </div>
    </motion.div>
  );
}
