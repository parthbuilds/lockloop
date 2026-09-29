"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export interface QuickTipCardProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function QuickTipCard({
  title = "Lock milestones with Dead-Man's Watchdog",
  description = "Daily 16:9 check-ins keep the 72h timer active and guarantee 100% escrow protection.",
  actionText = "Read policy",
  onAction,
  className,
}: QuickTipCardProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-white border border-black/[0.06] shadow-[0px_2px_8px_rgba(0,0,0,0.03)] overflow-hidden",
        className
      )}
    >
      <div className="flex flex-col justify-between h-full gap-2 min-w-0">
        <div>
          <h4 className="text-sm font-semibold text-[#111827] leading-tight">
            {title}
          </h4>
          <p className="text-[11px] text-[#6B7280] leading-snug mt-1">
            {description}
          </p>
        </div>

        <button
          onClick={onAction}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#111827] hover:text-[#2D6606] transition-colors cursor-pointer w-fit"
        >
          <span>{actionText}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mosaic Graphic Art (Pixel-Matched to ref.webp) */}
      <div className="shrink-0 grid grid-cols-3 gap-1 w-16 h-16 p-1 bg-[#F8F9FA] rounded-lg border border-black/[0.04]">
        <div className="rounded-xs bg-[#E8F8D6]" />
        <div className="rounded-xs bg-[#88D635]" />
        <div className="rounded-xs bg-[#E8F8D6]" />
        <div className="rounded-xs bg-[#88D635]" />
        <div className="rounded-xs bg-[#599B15]" />
        <div className="rounded-xs bg-[#88D635]" />
        <div className="rounded-xs bg-[#E8F8D6]" />
        <div className="rounded-xs bg-[#88D635]" />
        <div className="rounded-xs bg-[#E8F8D6]" />
      </div>
    </div>
  );
}
