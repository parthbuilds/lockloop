import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "dark" | "lime" | "outline" | "ghost" | "pill" | "icon";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "dark", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
          // Variant styling with modern tight border radii
          variant === "dark" &&
            "bg-[#111827] text-white hover:bg-[#1F2937] shadow-[0px_2px_6px_rgba(17,24,39,0.12)] rounded-lg",
          variant === "lime" &&
            "bg-[#88D635] text-[#0F2900] hover:bg-[#78C825] font-semibold shadow-[0px_2px_8px_rgba(136,214,53,0.22)] rounded-lg",
          variant === "outline" &&
            "bg-white text-[#111827] border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] rounded-lg shadow-xs",
          variant === "ghost" &&
            "bg-transparent text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827] rounded-md",
          variant === "pill" &&
            "bg-white border border-[#E5E7EB] text-[#111827] hover:bg-[#F9FAFB] rounded-full",
          variant === "icon" &&
            "w-9 h-9 rounded-lg bg-white border border-[#E5E7EB] text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#111827] shadow-xs",
          // Size styling
          size === "sm" && "text-xs px-2.5 py-1.5 gap-1.5",
          size === "md" && "text-xs font-semibold px-3.5 py-2 gap-2",
          size === "lg" && "text-sm px-5 py-2.5 gap-2.5",
          size === "icon" && "p-0",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
