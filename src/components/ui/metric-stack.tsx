import * as React from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface MetricItem {
  label: string;
  amount: number;
  currency?: string;
  changePercent?: number;
  changeText?: string;
  isPositive?: boolean;
}

export interface MetricStackProps {
  metrics?: MetricItem[];
  className?: string;
}

const DEFAULT_METRICS: MetricItem[] = [
  {
    label: "Total Escrow Secured",
    amount: 15000,
    changePercent: 5.1,
    changeText: "from contract baseline",
    isPositive: true,
  },
  {
    label: "Released Deliverables",
    amount: 6700,
    changePercent: 15.5,
    changeText: "on-time releases",
    isPositive: true,
  },
  {
    label: "Active In Escrow",
    amount: 8300,
    changePercent: 20.7,
    changeText: "protected in neutral hold",
    isPositive: true,
  },
];

export function MetricStack({
  metrics = DEFAULT_METRICS,
  className,
}: MetricStackProps) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-3 gap-4", className)}>
      {metrics.map((item, idx) => (
        <div
          key={idx}
          className="flex flex-col justify-between p-4 rounded-[20px] bg-[#F8F9FA] border border-black/[0.03]"
        >
          <span className="text-xs font-medium text-[#6B7280]">{item.label}</span>
          <div className="my-2">
            <span className="text-2xl font-bold tracking-tight text-[#111827]">
              {formatCurrency(item.amount, item.currency)}
            </span>
          </div>
          {item.changePercent !== undefined && (
            <div className="flex items-center gap-1.5 text-xs">
              {item.isPositive ? (
                <span className="inline-flex items-center font-bold text-[#2D6606]">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                  {item.changePercent}%
                </span>
              ) : (
                <span className="inline-flex items-center font-bold text-[#DC2626]">
                  <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                  {item.changePercent}%
                </span>
              )}
              <span className="text-[#9CA3AF] text-[11px] truncate">{item.changeText}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
