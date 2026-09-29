import * as React from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", icon, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-3 text-[#9CA3AF] pointer-events-none flex items-center">
            {icon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            "w-full rounded-lg bg-[#FFFFFF] border border-[#E5E7EB] px-3.5 py-2 text-xs text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#111827] focus:ring-1 focus:ring-[#111827] transition-all",
            icon && "pl-9",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export function SearchInput(props: Omit<InputProps, "icon">) {
  return (
    <Input
      icon={<Search className="w-4 h-4 text-[#9CA3AF]" />}
      placeholder="Quick search"
      className="bg-[#FFFFFF] border border-black/[0.06] shadow-xs h-9.5 rounded-lg text-xs"
      {...props}
    />
  );
}
