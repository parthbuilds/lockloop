import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "lime" | "dark" | "yellow" | "orange" | "forest" | "red" | "gray" | "outline";
}

export function Badge({
  className,
  variant = "lime",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-tight transition-colors",
        variant === "lime" && "bg-[#E8F8D6] text-[#2D6606]",
        variant === "dark" && "bg-[#111827] text-white",
        variant === "yellow" && "bg-[#FEF9C3] text-[#854D0E]",
        variant === "orange" && "bg-[#FFEDD5] text-[#9A3412]",
        variant === "forest" && "bg-[#DCFCE7] text-[#166534]",
        variant === "red" && "bg-[#FEE2E2] text-[#991B1B]",
        variant === "gray" && "bg-[#F3F4F6] text-[#4B5563]",
        variant === "outline" && "border border-[#E5E7EB] text-[#4B5563] bg-white",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
