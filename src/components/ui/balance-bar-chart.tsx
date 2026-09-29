"use client";

import * as React from "react";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { BarChart3, LineChart as LineChartIcon, ChevronDown } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart";

export interface DayEscrowRecord {
  day: string;
  inReview: number; // Yellow: Deliverables submitted for 72h review
  released: number; // Lime: Funds released & IP transferred
  remaining: number; // Orange: Active escrow held
  total: number;
}

const DEFAULT_DAYS_DATA: DayEscrowRecord[] = [
  { day: "Sun", inReview: 100, released: 300, remaining: 150, total: 550 },
  { day: "Mon", inReview: 150, released: 450, remaining: 200, total: 800 },
  { day: "Tue", inReview: 80, released: 200, remaining: 120, total: 400 },
  { day: "Wed", inReview: 240, released: 700, remaining: 460, total: 1400 },
  { day: "Thu", inReview: 120, released: 350, remaining: 180, total: 650 },
  { day: "Fri", inReview: 200, released: 500, remaining: 300, total: 1000 },
  { day: "Sat", inReview: 90, released: 250, remaining: 110, total: 450 },
];

const chartConfig = {
  released: {
    label: "Released / Paid",
    color: "#88D635",
  },
  inReview: {
    label: "Under Review",
    color: "#FACC15",
  },
  remaining: {
    label: "Held in Escrow",
    color: "#FB923C",
  },
};

export interface BalanceBarChartProps {
  totalAmount?: number;
  data?: DayEscrowRecord[];
  className?: string;
}

export function BalanceBarChart({
  totalAmount = 12450,
  data = DEFAULT_DAYS_DATA,
  className,
}: BalanceBarChartProps) {
  const [chartType, setChartType] = React.useState<"bar" | "line">("bar");
  const [timeRange, setTimeRange] = React.useState<"7d" | "30d" | "milestone">("7d");

  return (
    <div className="flex flex-col gap-3.5">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 w-full">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#111827]">
            {formatCurrency(totalAmount)}
          </h2>
          <p className="text-xs text-[#6B7280]">
            Escrow balance overview & milestone burn
          </p>
        </div>

        {/* Legend & Controls - Right Aligned to edge */}
        <div className="flex flex-col items-end gap-2.5 shrink-0 ml-auto">
          {/* Legend Items */}
          <div className="flex items-center justify-end gap-3.5 text-xs font-medium text-[#4B5563]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FACC15]" />
              <span>In Review</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#88D635]" />
              <span>Released</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FB923C]" />
              <span>In Escrow</span>
            </div>
          </div>

          {/* Time Filter & Chart Toggle */}
          <div className="flex items-center gap-1 bg-[#F4F5F7] p-1 rounded-lg">
            <button
              onClick={() => setTimeRange(timeRange === "7d" ? "30d" : "7d")}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#111827] bg-white rounded-md shadow-2xs cursor-pointer"
            >
              <span>{timeRange}</span>
              <ChevronDown className="w-3 h-3 text-[#6B7280]" />
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                chartType === "bar"
                  ? "bg-white text-[#111827] shadow-2xs font-bold"
                  : "text-[#9CA3AF] hover:text-[#111827]"
              }`}
              title="Bar Chart"
            >
              <BarChart3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartType("line")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                chartType === "line"
                  ? "bg-white text-[#111827] shadow-2xs font-bold"
                  : "text-[#9CA3AF] hover:text-[#111827]"
              }`}
              title="Line Chart"
            >
              <LineChartIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recharts / Shadcn Chart View */}
      <div className="w-full h-60 pt-1">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              barGap={4}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#F1F3F6"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 11 }}
                dy={6}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 11 }}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.02)" }}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const item = payload[0].payload as DayEscrowRecord;
                  return (
                    <div className="rounded-lg border border-black/[0.08] bg-white p-3 shadow-lg text-xs space-y-1.5 min-w-[140px]">
                      <div className="font-bold text-[#111827] border-b border-[#F1F3F6] pb-1">
                        {label}, 7 Jan 2026
                      </div>
                      <div className="flex justify-between items-center text-[#854D0E]">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-xs bg-[#FACC15]" />
                          In Review
                        </span>
                        <span className="font-mono font-bold">${item.inReview}</span>
                      </div>
                      <div className="flex justify-between items-center text-[#2D6606]">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-xs bg-[#88D635]" />
                          Released
                        </span>
                        <span className="font-mono font-bold">${item.released}</span>
                      </div>
                      <div className="flex justify-between items-center text-[#9A3412]">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-xs bg-[#FB923C]" />
                          In Escrow
                        </span>
                        <span className="font-mono font-bold">${item.remaining}</span>
                      </div>
                    </div>
                  );
                }}
              />
              <Bar
                dataKey="inReview"
                stackId="escrow"
                fill="#FACC15"
                radius={[0, 0, 0, 0]}
                maxBarSize={44}
              />
              <Bar
                dataKey="released"
                stackId="escrow"
                fill="#88D635"
                radius={[0, 0, 0, 0]}
                maxBarSize={44}
              />
              <Bar
                dataKey="remaining"
                stackId="escrow"
                fill="#FB923C"
                radius={[4, 4, 0, 0]}
                maxBarSize={44}
              />
            </BarChart>
          ) : (
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#F1F3F6"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 11 }}
                dy={6}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 11 }}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="rounded-lg border border-black/[0.08] bg-white p-2.5 shadow-md text-xs">
                      <span className="font-bold text-[#111827]">{label}</span>
                      <div className="text-xs text-[#2D6606] font-mono mt-1 font-bold">
                        Released: ${payload[0]?.value}
                      </div>
                    </div>
                  );
                }}
              />
              <Line
                type="monotone"
                dataKey="released"
                stroke="#88D635"
                strokeWidth={3}
                dot={{ r: 4, fill: "#88D635" }}
                activeDot={{ r: 6, fill: "#111827" }}
              />
              <Line
                type="monotone"
                dataKey="inReview"
                stroke="#FACC15"
                strokeWidth={2}
                dot={{ r: 3, fill: "#FACC15" }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
