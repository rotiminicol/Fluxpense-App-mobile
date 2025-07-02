import { useQuery } from "@tanstack/react-query";
import { categoryAPI } from "../lib/api";

export function useCategories() {
  return useQuery({
    queryKey: ['/api/categories'],
    queryFn: () => categoryAPI.getCategories(),
  });
}

export function getCategoryColor(colorName: string): string {
  const colorMap: Record<string, string> = {
    orange: 'var(--category-food)',
    blue: 'var(--category-transport)',
    green: 'var(--category-shopping)',
    purple: 'var(--category-entertainment)',
    red: 'var(--category-health)',
    gray: 'var(--category-bills)',
  };
  
  return colorMap[colorName] || colorMap.gray;
}

export function getCategoryIcon(icon: string): string {
  return icon || 'fas fa-question';
}
