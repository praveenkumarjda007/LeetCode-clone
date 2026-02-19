import { cn } from "@/lib/utils";

interface DifficultyBadgeProps {
  difficulty: "Easy" | "Medium" | "Hard" | string;
  className?: string;
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const variants = {
    Easy: "text-easy bg-easy-soft",
    Medium: "text-medium bg-medium-soft",
    Hard: "text-hard bg-hard-soft",
  };
  
  // Default to Easy if unknown, or handle dynamically
  const style = variants[difficulty as keyof typeof variants] || variants.Easy;

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border border-transparent", style, className)}>
      {difficulty}
    </span>
  );
}
