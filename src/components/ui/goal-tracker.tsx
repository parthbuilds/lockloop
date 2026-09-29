"use client";

import * as React from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { Plus, Database, Layout, Rocket, Zap, ShieldCheck } from "lucide-react";

export interface GoalItem {
  id: string;
  title: string;
  currentAmount: number;
  targetAmount: number;
  currency?: string;
  subtitle: string;
  progressColor?: "lime" | "orange" | "yellow" | "gray";
  icon?: React.ReactNode;
}

const DEFAULT_GOALS: GoalItem[] = [
  {
    id: "g1",
    title: "M1: DB Schema & Auth",
    currentAmount: 1500,
    targetAmount: 1500,
    subtitle: "Released • IP Transferred",
    progressColor: "lime",
    icon: <Database className="w-3.5 h-3.5 text-[#2D6606]" />,
  },
  {
    id: "g2",
    title: "M2: Core UI & API Sync",
    currentAmount: 1125,
    targetAmount: 1500,
    subtitle: "75% complete • 72h review",
    progressColor: "lime",
    icon: <Layout className="w-3.5 h-3.5 text-[#88D635]" />,
  },
  {
    id: "g3",
    title: "Change Order #1: Stripe",
    currentAmount: 450,
    targetAmount: 450,
    subtitle: "Funded in escrow • Active",
    progressColor: "orange",
    icon: <Zap className="w-3.5 h-3.5 text-[#EA580C]" />,
  },
  {
    id: "g4",
    title: "M3: Production Deploy",
    currentAmount: 0,
    targetAmount: 1500,
    subtitle: "Upcoming • Tranche 3",
    progressColor: "gray",
    icon: <Rocket className="w-3.5 h-3.5 text-[#9CA3AF]" />,
  },
];

export interface GoalTrackerProps {
  goals?: GoalItem[];
  onAddGoal?: () => void;
  className?: string;
}

export function GoalTracker({
  goals = DEFAULT_GOALS,
  onAddGoal,
  className,
}: GoalTrackerProps) {
  return (
    <div className={cn("flex flex-col justify-between h-full gap-2.5", className)}>
      {/* Header */}
      <div className="flex items-center justify-between pb-0.5">
        <div>
          <h4 className="text-sm font-semibold text-[#111827]">Goal tracker</h4>
          <p className="text-[11px] text-[#6B7280]">Milestone progression</p>
        </div>
        <button
          onClick={onAddGoal}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#111827] bg-[#F4F5F7] hover:bg-[#E5E7EB] rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-3 h-3 text-[#111827]" />
          <span>Add goals</span>
        </button>
      </div>

      {/* Goal Items List (All 4 Milestones fitted neatly) */}
      <div className="flex flex-col gap-1.5">
        {goals.slice(0, 4).map((item) => {
          const percent = Math.min(
            Math.round((item.currentAmount / item.targetAmount) * 100),
            100
          );

          return (
            <div
              key={item.id}
              className="flex items-center gap-2.5 px-2 py-1 rounded-lg hover:bg-[#F9FAFB] transition-colors"
            >
              {/* Icon Container */}
              <div className="w-7 h-7 rounded-lg bg-[#F4F5F7] flex items-center justify-center shrink-0">
                {item.icon}
              </div>

              {/* Title & Progress Bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs mb-0.5">
                  <span className="font-semibold text-[#111827] truncate text-[11px]">
                    {item.title}
                  </span>
                  <span className="font-mono text-[#4B5563] text-[10px] shrink-0">
                    <strong className="text-[#111827]">
                      {formatCurrency(item.currentAmount, item.currency)}
                    </strong>
                    {" / "}
                    {formatCurrency(item.targetAmount, item.currency)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 rounded-full bg-[#F3F4F6] overflow-hidden my-0.5">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      item.progressColor === "lime" && "bg-[#88D635]",
                      item.progressColor === "orange" && "bg-[#F97316]",
                      item.progressColor === "yellow" && "bg-[#FACC15]",
                      item.progressColor === "gray" && "bg-[#E5E7EB]"
                    )}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <span className="text-[10px] text-[#9CA3AF] block truncate leading-tight">
                  {item.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
