"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, ChevronDown } from "lucide-react";

export interface RadialGaugeProps {
  score?: number; // 0 to 100
  title?: string;
  subtitle?: string;
  valueDisplay?: string;
  caption?: string;
  className?: string;
}

export function RadialGauge({
  score = 96,
  title = "Accountability health",
  subtitle = "Current trust status",
  valueDisplay = "$15,780",
  caption = "Based on 18 verified commits, 34.7h logged, and 0 ghosting strikes.",
  className,
}: RadialGaugeProps) {
  const [filterPeriod, setFilterPeriod] = React.useState("30d");

  // Semi-circle SVG calculation
  const radius = 64;
  const circumference = Math.PI * radius; // Half-circle
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={cn("flex flex-col justify-between h-full gap-2", className)}>
      {/* Top Header */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <h4 className="text-sm font-semibold text-[#111827]">{title}</h4>
          <p className="text-[11px] text-[#6B7280]">{subtitle}</p>
        </div>
        <button
          onClick={() => setFilterPeriod(filterPeriod === "30d" ? "All Time" : "30d")}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#111827] bg-[#F4F5F7] hover:bg-[#E5E7EB] rounded-lg transition-colors cursor-pointer"
        >
          <span>{filterPeriod}</span>
          <ChevronDown className="w-3 h-3 text-[#6B7280]" />
        </button>
      </div>

      {/* Main Value Display */}
      <div>
        <span className="text-2xl font-bold tracking-tight text-[#111827]">
          {valueDisplay}
        </span>
        <div className="flex items-center gap-1 text-xs font-bold text-[#2D6606] pt-0.5">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+17.5% milestone velocity</span>
        </div>
      </div>

      {/* Radial Semi-Circle Arc Gauge */}
      <div className="relative flex flex-col items-center justify-center my-1">
        <svg
          viewBox="0 0 160 88"
          className="w-44 overflow-visible"
        >
          {/* Background Track */}
          <path
            d="M 16 80 A 64 64 0 0 1 144 80"
            fill="none"
            stroke="#F4F5F7"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Active Gradient Arc */}
          <path
            d="M 16 80 A 64 64 0 0 1 144 80"
            fill="none"
            stroke="url(#limeGradientGauge)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="limeGradientGauge" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="50%" stopColor="#88D635" />
              <stop offset="100%" stopColor="#599B15" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute bottom-0 flex flex-col items-center">
          <span className="text-2xl font-bold tracking-tight text-[#111827] leading-none">
            {score}%
          </span>
          <span className="text-[10px] font-medium text-[#6B7280] mt-0.5">
            Reliability Trust Score
          </span>
        </div>
      </div>

      {/* Bottom Explanatory Caption */}
      <p className="text-[10px] leading-relaxed text-[#9CA3AF] pt-1 border-t border-[#F1F3F6]">
        {caption}
      </p>
    </div>
  );
}
