"use client";

import * as React from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface CostCategory {
  id: string;
  name: string;
  percent: number;
  color: string;
  amount: number;
}

const DEFAULT_CATEGORIES: CostCategory[] = [
  { id: "c1", name: "Architecture & Schema", percent: 18, color: "#F97316", amount: 1520 },
  { id: "c2", name: "Authentication & RLS", percent: 15, color: "#FB923C", amount: 1270 },
  { id: "c3", name: "Core UI Components", percent: 20, color: "#FACC15", amount: 1690 },
  { id: "c4", name: "API & Webhook Engine", percent: 22, color: "#88D635", amount: 1860 },
  { id: "c5", name: "Production Deployment", percent: 15, color: "#15803D", amount: 1270 },
  { id: "c6", name: "Scope Firewall Reserve", percent: 10, color: "#CBD5E1", amount: 840 },
];

export interface CostAnalysisProps {
  totalAmount?: number;
  categories?: CostCategory[];
  className?: string;
}

export function CostAnalysis({
  totalAmount = 8450,
  categories = DEFAULT_CATEGORIES,
  className,
}: CostAnalysisProps) {
  const [selectedMonth, setSelectedMonth] = React.useState("January");

  return (
    <div className={cn("flex flex-col justify-between h-full gap-3", className)}>
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-[#111827]">Cost analysis</h4>
          <p className="text-[11px] text-[#6B7280]">Milestone budget allocation</p>
        </div>
        <button
          onClick={() => setSelectedMonth(selectedMonth === "January" ? "Q1 2026" : "January")}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#111827] bg-[#F4F5F7] hover:bg-[#E5E7EB] rounded-lg transition-colors cursor-pointer"
        >
          <span>{selectedMonth}</span>
          <ChevronDown className="w-3 h-3 text-[#6B7280]" />
        </button>
      </div>

      {/* Amount Display */}
      <div>
        <span className="text-2xl font-bold tracking-tight text-[#111827]">
          {formatCurrency(totalAmount)}
        </span>
      </div>

      {/* Segmented Horizontal Bar (Matching ref.webp) */}
      <div className="w-full h-2.5 rounded-full overflow-hidden flex gap-0.5 my-1 bg-[#F1F3F6]">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="h-full first:rounded-l-full last:rounded-r-full transition-all hover:opacity-85"
            style={{
              width: `${cat.percent}%`,
              backgroundColor: cat.color,
            }}
            title={`${cat.name}: ${cat.percent}% (${formatCurrency(cat.amount)})`}
          />
        ))}
      </div>

      {/* Category Legend List (5 Workstreams) */}
      <div className="grid grid-cols-1 gap-1.5 pt-1">
        {categories.slice(0, 5).map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between text-xs py-0.5 text-[#4B5563]"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="w-2 h-2 rounded-xs shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span className="truncate text-[11px] text-[#374151]">
                {cat.name}
              </span>
            </div>
            <span className="font-semibold text-[#111827] font-mono text-[11px]">
              {cat.percent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
