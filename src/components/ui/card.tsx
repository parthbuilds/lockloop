import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "elevated" | "outline";
}

export function Card({ className, variant = "default", ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-white p-3.5 sm:p-4 transition-all duration-150",
        "border border-black/[0.06] shadow-[0px_2px_8px_rgba(0,0,0,0.03)]",
        variant === "subtle" && "bg-[#F8F9FA] shadow-none border-black/[0.04]",
        variant === "elevated" && "shadow-[0px_8px_24px_rgba(0,0,0,0.06)] border-black/[0.08]",
        variant === "outline" && "bg-transparent shadow-none border-black/[0.08]",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-between gap-3 pb-3", className)}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-sm font-semibold tracking-tight text-[#111827]", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs font-normal text-[#6B7280]", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("pt-0.5", className)} {...props} />;
}
