import * as React from "react";
import { cn, formatCurrency } from "@/lib/utils";
import {
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  MoreHorizontal,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "./button";

export interface VirtualEscrowCardProps {
  cardHolder?: string;
  cardNumber?: string;
  milestoneLabel?: string;
  balance?: number;
  currency?: string;
  onFund?: () => void;
  onRelease?: () => void;
  onRequest?: () => void;
  onHistory?: () => void;
  className?: string;
}

export function VirtualEscrowCard({
  cardHolder = "Sarah Chen (Client)",
  cardNumber = "•••• •••• •••• 7890",
  milestoneLabel = "Active: Milestone 1",
  balance = 1500,
  currency = "USD",
  onFund,
  onRelease,
  onRequest,
  onHistory,
  className,
}: VirtualEscrowCardProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-[#111827]">Escrow Card</h4>
          <p className="text-xs text-[#6B7280]">Quick payment actions</p>
        </div>
        <Button variant="outline" size="sm" className="rounded-full h-8 text-xs font-medium">
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add funds
        </Button>
      </div>

      {/* The Physical Card Widget */}
      <div className="relative overflow-hidden w-full max-w-[340px] mx-auto aspect-[1.586/1] rounded-[18px] bg-gradient-to-br from-[#88D635] via-[#75BF26] to-[#599B15] p-5 text-[#0F2D00] shadow-[0_12px_28px_rgba(136,214,53,0.32)] transition-all hover:scale-[1.01] flex flex-col justify-between">
        {/* Subtle geometric light effect */}
        <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-white/20 blur-xl pointer-events-none" />

        {/* Card Top Row */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#143B00]/75">
              Micro-Escrow Locked
            </span>
            <span className="text-base font-bold tracking-tight text-[#0F2D00]">
              {formatCurrency(balance, currency)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#0F2D00]/10 px-2.5 py-1 rounded-full text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0F2D00]" />
            <span>PROTECTED</span>
          </div>
        </div>

        {/* EMV Chip & Contactless */}
        <div className="my-4 flex items-center justify-between">
          <div className="w-10 h-7 rounded-[6px] bg-gradient-to-tr from-[#E6CA65] to-[#FDF4B8] border border-[#C2A342]/60 shadow-inner flex items-center justify-center">
            <div className="w-7 h-4 border border-[#9A7B26]/40 rounded-[2px]" />
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-black/10 text-[#0F2D00]">
            {milestoneLabel}
          </span>
        </div>

        {/* Card Number & Bottom Details */}
        <div className="space-y-1">
          <p className="font-mono text-sm tracking-widest text-[#0F2D00]/90">
            {cardNumber}
          </p>
          <div className="flex items-center justify-between text-[11px] font-medium text-[#143B00]/80 pt-1">
            <span className="truncate max-w-[140px] font-semibold">{cardHolder}</span>
            <span className="font-mono">EXP: 03/30</span>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons Row (Matching ref.webp) */}
      <div className="grid grid-cols-5 gap-2 pt-1">
        <button
          onClick={onFund}
          className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-[16px] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all cursor-pointer group shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
          title="Fund Escrow"
        >
          <div className="w-8 h-8 rounded-[10px] bg-[#F4F5F7] group-hover:bg-[#E8F8D6] flex items-center justify-center transition-colors">
            <Plus className="w-4 h-4 text-[#111827] group-hover:text-[#2D6606]" />
          </div>
          <span className="text-[11px] font-medium text-[#4B5563] group-hover:text-[#111827]">
            Top up
          </span>
        </button>

        <button
          onClick={onRelease}
          className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-[16px] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all cursor-pointer group shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
          title="Release Escrow"
        >
          <div className="w-8 h-8 rounded-[10px] bg-[#F4F5F7] group-hover:bg-[#E8F8D6] flex items-center justify-center transition-colors">
            <ArrowUpRight className="w-4 h-4 text-[#111827] group-hover:text-[#2D6606]" />
          </div>
          <span className="text-[11px] font-medium text-[#4B5563] group-hover:text-[#111827]">
            Release
          </span>
        </button>

        <button
          onClick={onRequest}
          className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-[16px] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all cursor-pointer group shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
          title="Request Milestone"
        >
          <div className="w-8 h-8 rounded-[10px] bg-[#F4F5F7] group-hover:bg-[#F3F4F6] flex items-center justify-center transition-colors">
            <ArrowDownLeft className="w-4 h-4 text-[#111827]" />
          </div>
          <span className="text-[11px] font-medium text-[#4B5563] group-hover:text-[#111827]">
            Request
          </span>
        </button>

        <button
          onClick={onHistory}
          className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-[16px] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all cursor-pointer group shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
          title="Work History & Timesheets"
        >
          <div className="w-8 h-8 rounded-[10px] bg-[#F4F5F7] group-hover:bg-[#F3F4F6] flex items-center justify-center transition-colors">
            <Clock className="w-4 h-4 text-[#111827]" />
          </div>
          <span className="text-[11px] font-medium text-[#4B5563] group-hover:text-[#111827]">
            History
          </span>
        </button>

        <button
          className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-[16px] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all cursor-pointer group shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
          title="More Options"
        >
          <div className="w-8 h-8 rounded-[10px] bg-[#F4F5F7] group-hover:bg-[#F3F4F6] flex items-center justify-center transition-colors">
            <MoreHorizontal className="w-4 h-4 text-[#111827]" />
          </div>
          <span className="text-[11px] font-medium text-[#4B5563] group-hover:text-[#111827]">
            More
          </span>
        </button>
      </div>
    </div>
  );
}
