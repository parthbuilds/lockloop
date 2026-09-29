"use client";

import * as React from "react";
import { formatCurrency } from "@/lib/utils";
import { BalanceBarChart, DayEscrowRecord } from "./balance-bar-chart";
import { TrendingUp, ShieldCheck } from "lucide-react";

export interface OverviewChartCardProps {
  role?: "business" | "freelancer";
  totalAmount?: number;
  totalIncome?: number;
  totalExpenses?: number;
  savedBalance?: number;
  className?: string;
}

export function OverviewChartCard({
  role = "business",
  totalAmount = 12450,
  totalIncome = 15000,
  totalExpenses = 6700,
  savedBalance = 8300,
  className,
}: OverviewChartCardProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-center">
      {/* Left: Recharts Bar Chart (approx 8.5 cols) */}
      <div className="xl:col-span-8 min-w-0">
        <BalanceBarChart totalAmount={totalAmount} />
      </div>

      {/* Right: 3 Vertical Metrics Stack (approx 3.5 cols, matching ref.webp) */}
      <div className="xl:col-span-4 flex flex-col justify-around h-full py-2 border-t xl:border-t-0 xl:border-l border-[#F1F3F6] xl:pl-6 gap-4">
        {/* Metric 1: Total Escrow Secured / Total Income */}
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-medium text-[#6B7280]">
            {role === "business" ? "Total project budget" : "Total contract earnings"}
          </span>
          <span className="text-2xl font-bold tracking-tight text-[#111827]">
            {formatCurrency(totalIncome)}
          </span>
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#2D6606] pt-0.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{role === "business" ? "100% funded in trust" : "5.1% from last month"}</span>
          </div>
        </div>

        {/* Metric 2: Total Disbursed / Expended */}
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-medium text-[#6B7280]">
            {role === "business" ? "Milestone payouts released" : "Disbursed to bank"}
          </span>
          <span className="text-2xl font-bold tracking-tight text-[#111827]">
            {formatCurrency(totalExpenses)}
          </span>
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#2D6606] pt-0.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{role === "business" ? "Transferred on IP delivery" : "Cleared via Stripe Express"}</span>
          </div>
        </div>

        {/* Metric 3: Protected In Escrow / Saved Balance */}
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-medium text-[#6B7280]">
            {role === "business" ? "Protected escrow reserve" : "Pending in escrow"}
          </span>
          <span className="text-2xl font-bold tracking-tight text-[#111827]">
            {formatCurrency(savedBalance)}
          </span>
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#2D6606] pt-0.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{role === "business" ? "SafeLock FDIC backed" : "Releases upon deliverable review"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
