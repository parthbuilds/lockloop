"use client";

import * as React from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { ShieldCheck, Pencil, AlertCircle } from "lucide-react";

export interface SpendingLimitCardProps {
  title?: string;
  subtitle?: string;
  currentAmount?: number;
  maxAmount?: number;
  currency?: string;
  onEdit?: () => void;
  className?: string;
}

export function SpendingLimitCard({
  title = "Escrow protection limit",
  subtitle = "Allocated across 5 milestones",
  currentAmount = 8600,
  maxAmount = 10000,
  currency = "USD",
  onEdit,
  className,
}: SpendingLimitCardProps) {
  const percent = Math.min(Math.round((currentAmount / maxAmount) * 100), 100);

  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-2.5 p-3.5 sm:p-4 rounded-xl bg-white border border-black/[0.06] shadow-[0px_2px_8px_rgba(0,0,0,0.03)]",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-[#111827]">{title}</h4>
          <p className="text-[11px] text-[#6B7280]">{subtitle}</p>
        </div>
        <button
          onClick={onEdit}
          className="text-[#9CA3AF] hover:text-[#111827] transition-colors p-1 rounded-md hover:bg-[#F4F5F7] cursor-pointer"
          title="Edit Limit"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-1.5 pt-1">
        {/* Progress Bar with Vivid Lime Fill (Matching ref.webp) */}
        <div className="w-full h-2.5 rounded-full bg-[#F4F5F7] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#88D635] shadow-[0_1px_4px_rgba(136,214,53,0.3)] transition-all duration-700"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Min / Max Labels */}
        <div className="flex items-center justify-between text-xs font-semibold text-[#111827]">
          <span className="font-mono">{formatCurrency(currentAmount, currency)}</span>
          <span className="text-[#9CA3AF] font-mono text-[11px]">{formatCurrency(maxAmount, currency)}</span>
        </div>
      </div>
    </div>
  );
}
