"use client";

import * as React from "react";
import { cn, formatCurrency } from "@/lib/utils";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldAlert,
  ShieldCheck,
  FileCheck,
  Clock,
} from "lucide-react";

export interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  currency?: string;
  type: "release" | "deposit" | "payout" | "declined";
  status: "Completed" | "Declined" | "In Escrow" | "Pending";
  category: string;
  invoiceId?: string;
}

const BUSINESS_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    title: "M1 Escrow Release",
    date: "25 Feb 2026",
    amount: 1500,
    currency: "USD",
    type: "release",
    status: "Completed",
    category: "DB Schema & Auth",
    invoiceId: "INV-2026-001",
  },
  {
    id: "tx-2",
    title: "Change Order #1 Escrow",
    date: "24 Feb 2026",
    amount: 450,
    currency: "USD",
    type: "deposit",
    status: "In Escrow",
    category: "Stripe Subscriptions",
  },
  {
    id: "tx-3",
    title: "M2 Escrow Pre-Funding",
    date: "21 Feb 2026",
    amount: 1500,
    currency: "USD",
    type: "deposit",
    status: "Completed",
    category: "Core UI & API",
  },
  {
    id: "tx-4",
    title: "Vault ACH Wire Top-Up",
    date: "19 Feb 2026",
    amount: 5000,
    currency: "USD",
    type: "deposit",
    status: "Completed",
    category: "Silicon Valley Bank",
  },
  {
    id: "tx-5",
    title: "Dispute Deposit Buffer",
    date: "18 Feb 2026",
    amount: 300,
    currency: "USD",
    type: "deposit",
    status: "Completed",
    category: "Neutral Safe Lock",
  },
  {
    id: "tx-6",
    title: "Change Order #2 Out of SOW",
    date: "17 Feb 2026",
    amount: -250,
    currency: "USD",
    type: "declined",
    status: "Declined",
    category: "Unapproved Revision",
  },
];

const FREELANCER_TRANSACTIONS: Transaction[] = [
  {
    id: "ftx-1",
    title: "M1 Milestone Disbursed",
    date: "25 Feb 2026",
    amount: 1500,
    currency: "USD",
    type: "release",
    status: "Completed",
    category: "DB Schema & Auth",
    invoiceId: "INV-2026-001",
  },
  {
    id: "ftx-2",
    title: "Stripe Express Payout",
    date: "24 Feb 2026",
    amount: -1500,
    currency: "USD",
    type: "payout",
    status: "Completed",
    category: "Transferred to Chase Bank",
  },
  {
    id: "ftx-3",
    title: "M2 Escrow In 72h Review",
    date: "21 Feb 2026",
    amount: 1500,
    currency: "USD",
    type: "deposit",
    status: "In Escrow",
    category: "Core UI & API",
  },
  {
    id: "ftx-4",
    title: "Change Order #1 Locked",
    date: "20 Feb 2026",
    amount: 450,
    currency: "USD",
    type: "deposit",
    status: "In Escrow",
    category: "Stripe Subscriptions",
  },
  {
    id: "ftx-5",
    title: "Escrow Guarantee Fee",
    date: "19 Feb 2026",
    amount: -15,
    currency: "USD",
    type: "payout",
    status: "Completed",
    category: "Platform Trust & Safety",
  },
];

export interface TransactionListProps {
  role?: "business" | "freelancer";
  transactions?: Transaction[];
  onSelectTransaction?: (tx: Transaction) => void;
  className?: string;
}

export function TransactionList({
  role = "business",
  transactions,
  onSelectTransaction,
  className,
}: TransactionListProps) {
  const activeTransactions = transactions || (role === "freelancer" ? FREELANCER_TRANSACTIONS : BUSINESS_TRANSACTIONS);
  const [filterPeriod, setFilterPeriod] = React.useState("7d");
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 3;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [role]);

  const totalPages = Math.max(1, Math.ceil(activeTransactions.length / pageSize));
  const paginatedTransactions = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return activeTransactions.slice(start, start + pageSize);
  }, [activeTransactions, currentPage]);

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-[#111827]">
          Transaction history
        </h4>
        <button
          onClick={() => setFilterPeriod(filterPeriod === "7d" ? "30d" : "7d")}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#111827] bg-[#F4F5F7] hover:bg-[#E5E7EB] rounded-lg transition-colors cursor-pointer"
        >
          <span>{filterPeriod}</span>
          <ChevronDown className="w-3 h-3 text-[#6B7280]" />
        </button>
      </div>

      {/* Sub-header labels (Matching ref.webp: ↑↓ Name, Amount) */}
      <div className="flex items-center justify-between text-[11px] font-medium text-[#9CA3AF] px-1 border-b border-[#F1F3F6] pb-1">
        <span className="flex items-center gap-1">
          <span>↑↓</span> Name
        </span>
        <span>Amount</span>
      </div>

      {/* Transaction List Items */}
      <div className="flex flex-col divide-y divide-[#F1F3F6]">
        {paginatedTransactions.map((tx) => {
          const isPositive = tx.amount > 0;
          return (
            <div
              key={tx.id}
              onClick={() => onSelectTransaction?.(tx)}
              className="flex items-center justify-between py-1.5 px-1 hover:bg-[#F9FAFB] rounded-lg transition-colors cursor-pointer group"
            >
              {/* Left: Icon & Name */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold",
                    tx.status === "Declined"
                      ? "bg-[#FEE2E2] text-[#991B1B]"
                      : tx.type === "release"
                      ? "bg-[#E8F8D6] text-[#2D6606]"
                      : tx.type === "payout"
                      ? "bg-[#111827] text-white"
                      : "bg-[#F4F5F7] text-[#111827]"
                  )}
                >
                  {tx.type === "release" && <FileCheck className="w-3.5 h-3.5" />}
                  {tx.type === "deposit" && <ArrowDownLeft className="w-3.5 h-3.5" />}
                  {tx.type === "payout" && <ArrowUpRight className="w-3.5 h-3.5" />}
                  {tx.type === "declined" && <ShieldAlert className="w-3.5 h-3.5" />}
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-[#111827] truncate group-hover:text-[#2D6606] transition-colors leading-tight">
                    {tx.title}
                  </span>
                  <span className="text-[10px] text-[#9CA3AF] truncate leading-tight">
                    {tx.date}
                  </span>
                </div>
              </div>

              {/* Right: Amount & Status Badge */}
              <div className="flex flex-col items-end shrink-0 pl-2">
                <span
                  className={cn(
                    "text-xs font-mono font-bold leading-tight",
                    tx.status === "Declined"
                      ? "text-[#EF4444]"
                      : isPositive
                      ? "text-[#111827]"
                      : "text-[#6B7280]"
                  )}
                >
                  {isPositive ? `+${formatCurrency(tx.amount)}` : formatCurrency(tx.amount)}
                </span>
                <span
                  className={cn(
                    "text-[9px] font-medium leading-tight",
                    tx.status === "Completed" && "text-[#166534]",
                    tx.status === "In Escrow" && "text-[#D97706]",
                    tx.status === "Declined" && "text-[#DC2626]",
                    tx.status === "Pending" && "text-[#6B7280]"
                  )}
                >
                  {tx.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-1.5 border-t border-[#F1F3F6] text-[11px] text-[#6B7280]">
          <span className="text-[10px] text-[#9CA3AF] font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentPage((p) => Math.max(1, p - 1));
              }}
              disabled={currentPage === 1}
              className="p-1 rounded-md bg-[#F4F5F7] hover:bg-[#E5E7EB] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-[#111827]"
              title="Previous page"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentPage((p) => Math.min(totalPages, p + 1));
              }}
              disabled={currentPage === totalPages}
              className="p-1 rounded-md bg-[#F4F5F7] hover:bg-[#E5E7EB] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-[#111827]"
              title="Next page"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
