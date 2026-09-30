"use client";

import * as React from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";
import { Card } from "./card";
import {
  Clock,
  Download,
  GitCommit,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  Calendar as CalendarIcon,
  Plus,
  Search,
  Filter,
  X,
  FileText,
  DollarSign,
  AlertCircle,
  Briefcase,
  Layers,
  ChevronDown,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

// =============================================================================
// TYPES & DATA STRUCTURES
// =============================================================================

export type ContractMode = "hourly" | "weekly_retainer" | "milestone";

export interface TimesheetEntry {
  id: string; // e.g. "TS-108"
  date: string; // e.g. "Today, 14:30"
  isoDate: string; // e.g. "2026-09-30"
  weekPeriod: string; // e.g. "Week 40 (Sep 28 – Oct 04)"
  task: string;
  description: string;
  hours: number; // e.g. 4.2
  hourlyRate: number; // e.g. 85
  commitHash: string; // e.g. "8c3f20a"
  branch: string; // e.g. "feat/oauth-jwt"
  commitDiff: string; // e.g. "+142 / -12"
  milestoneId?: string; // e.g. "M2"
  milestoneTitle?: string; // e.g. "Core UI & API Engine"
  tags: string[];
  status: "approved" | "pending_review" | "locked";
  ciPassed: boolean;
}

export interface AuditedTimesheetManagerProps {
  role: "business" | "freelancer";
  showToast?: (msg: string) => void;
  className?: string;
}

// Sample Timesheet Seed Data
const INITIAL_TIMESHEET_ENTRIES: TimesheetEntry[] = [
  {
    id: "TS-108",
    date: "Today, 14:30",
    isoDate: "2026-09-30",
    weekPeriod: "Week 40 (Sep 28 – Oct 04)",
    task: "Setup OAuth callbacks & JWT session cookie encryption",
    description: "Configured Google & GitHub OAuth callbacks with PKCE flow, AES-256 session cookie encryption, and rate-limiting middleware.",
    hours: 4.2,
    hourlyRate: 85,
    commitHash: "8c3f20a",
    branch: "feat/oauth-jwt",
    commitDiff: "+142 / -12",
    milestoneId: "M2",
    milestoneTitle: "Core UI & API Engine",
    tags: ["auth", "nextauth", "jwt"],
    status: "pending_review",
    ciPassed: true,
  },
  {
    id: "TS-107",
    date: "Yesterday, 18:15",
    isoDate: "2026-09-29",
    weekPeriod: "Week 40 (Sep 28 – Oct 04)",
    task: "Responsive Recharts layout & bento command cards",
    description: "Built responsive Recharts balance visualization, Escrow Vault overview metrics, and quick-filter interaction chips.",
    hours: 5.5,
    hourlyRate: 85,
    commitHash: "7b2190f",
    branch: "feat/bento-dashboard",
    commitDiff: "+280 / -34",
    milestoneId: "M2",
    milestoneTitle: "Core UI & API Engine",
    tags: ["ui", "recharts", "dashboard"],
    status: "approved",
    ciPassed: true,
  },
  {
    id: "TS-106",
    date: "Mon 28 Sep, 16:40",
    isoDate: "2026-09-28",
    weekPeriod: "Week 40 (Sep 28 – Oct 04)",
    task: "Prisma schema migrations & PostgreSQL connection pool",
    description: "Added multi-tenant RLS schema with compound indexing on tenant_id, migration scripts, and Supabase pooling setup.",
    hours: 6.0,
    hourlyRate: 85,
    commitHash: "3a992e1",
    branch: "infra/prisma-pool",
    commitDiff: "+195 / -8",
    milestoneId: "M1",
    milestoneTitle: "Discovery & Database",
    tags: ["database", "prisma", "rls"],
    status: "approved",
    ciPassed: true,
  },
  {
    id: "TS-105",
    date: "Sun 27 Sep, 19:20",
    isoDate: "2026-09-27",
    weekPeriod: "Week 39 (Sep 21 – Sep 27)",
    task: "Stripe Connect webhook event idempotency listeners",
    description: "Implemented Redis-backed idempotency guards for Stripe account.updated and payment_intent.succeeded events.",
    hours: 7.0,
    hourlyRate: 85,
    commitHash: "4f9011d",
    branch: "feat/stripe-idempotency",
    commitDiff: "+160 / -15",
    milestoneId: "M3",
    milestoneTitle: "Stripe Connect Vault",
    tags: ["stripe", "webhooks", "redis"],
    status: "approved",
    ciPassed: true,
  },
  {
    id: "TS-104",
    date: "Fri 25 Sep, 17:00",
    isoDate: "2026-09-25",
    weekPeriod: "Week 39 (Sep 21 – Sep 27)",
    task: "Dockerized PostgreSQL test environment & seed scripts",
    description: "Created docker-compose setup with automated schema fixtures and Playwright integration tests.",
    hours: 5.8,
    hourlyRate: 85,
    commitHash: "6c201aa",
    branch: "ci/docker-fixtures",
    commitDiff: "+88 / -4",
    milestoneId: "M1",
    milestoneTitle: "Discovery & Database",
    tags: ["docker", "devops", "testing"],
    status: "approved",
    ciPassed: true,
  },
  {
    id: "TS-103",
    date: "Wed 23 Sep, 15:10",
    isoDate: "2026-09-23",
    weekPeriod: "Week 39 (Sep 21 – Sep 27)",
    task: "Cryptographic IP Transfer progressive hash validation",
    description: "Built automated SHA-256 checksum validator for client resource vault deliverables prior to escrow release.",
    hours: 6.2,
    hourlyRate: 85,
    commitHash: "9e110bb",
    branch: "security/ip-checksum",
    commitDiff: "+112 / -22",
    milestoneId: "M4",
    milestoneTitle: "Scope Firewall",
    tags: ["security", "crypto", "ip-transfer"],
    status: "approved",
    ciPassed: true,
  },
];

export function AuditedTimesheetManager({
  role,
  showToast = () => {},
  className,
}: AuditedTimesheetManagerProps) {
  // Contract Mode Switcher (Hourly, Weekly Retainer, Milestone)
  const [contractMode, setContractMode] = React.useState<ContractMode>("hourly");
  const [hourlyRate, setHourlyRate] = React.useState<number>(85);
  const [weeklyHourCap, setWeeklyHourCap] = React.useState<number>(40);
  const [weeklyRetainerFee, setWeeklyRetainerFee] = React.useState<number>(3400);

  // Active Pay Period Filter
  const [selectedPeriod, setSelectedPeriod] = React.useState<string>("week-40");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "approved" | "pending_review">("all");

  // Timesheet Entries
  const [entries, setEntries] = React.useState<TimesheetEntry[]>(INITIAL_TIMESHEET_ENTRIES);

  // New Log Entry Modal
  const [showLogModal, setShowLogModal] = React.useState(false);
  const [newTaskTitle, setNewTaskTitle] = React.useState("");
  const [newTaskDesc, setNewTaskDesc] = React.useState("");
  const [newHours, setNewHours] = React.useState("4.0");
  const [newBranch, setNewBranch] = React.useState("feat/api-endpoint");
  const [newCommit, setNewCommit] = React.useState("5a190ef");
  const [newMilestoneId, setNewMilestoneId] = React.useState("M2");

  // Current Week (Week 40) Computed Statistics
  const currentWeekEntries = React.useMemo(() => {
    return entries.filter((e) => e.weekPeriod.includes("Week 40"));
  }, [entries]);

  const currentWeekHours = React.useMemo(() => {
    return Math.round(currentWeekEntries.reduce((sum, e) => sum + e.hours, 0) * 10) / 10;
  }, [currentWeekEntries]);

  const currentWeekEarned = React.useMemo(() => {
    if (contractMode === "weekly_retainer") return weeklyRetainerFee;
    return Math.round(currentWeekHours * hourlyRate * 100) / 100;
  }, [contractMode, currentWeekHours, hourlyRate, weeklyRetainerFee]);

  const totalAllTimeHours = React.useMemo(() => {
    return Math.round(entries.reduce((sum, e) => sum + e.hours, 0) * 10) / 10;
  }, [entries]);

  const totalAllTimeEarned = React.useMemo(() => {
    return Math.round(totalAllTimeHours * hourlyRate * 100) / 100;
  }, [totalAllTimeHours, hourlyRate]);

  const capUsagePercent = Math.min(100, Math.round((currentWeekHours / weeklyHourCap) * 100));

  // Filtered Entries for Display
  const filteredEntries = React.useMemo(() => {
    return entries.filter((entry) => {
      // Period filter
      if (selectedPeriod === "week-40" && !entry.weekPeriod.includes("Week 40")) return false;
      if (selectedPeriod === "week-39" && !entry.weekPeriod.includes("Week 39")) return false;

      // Status filter
      if (statusFilter !== "all" && entry.status !== statusFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTask = entry.task.toLowerCase().includes(q);
        const matchesDesc = entry.description.toLowerCase().includes(q);
        const matchesCommit = entry.commitHash.toLowerCase().includes(q);
        const matchesBranch = entry.branch.toLowerCase().includes(q);
        const matchesId = entry.id.toLowerCase().includes(q);
        const matchesTags = entry.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTask && !matchesDesc && !matchesCommit && !matchesBranch && !matchesId && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [entries, selectedPeriod, statusFilter, searchQuery]);

  // Log Hours Submission
  const handleLogHours = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      showToast("Please enter a task summary");
      return;
    }

    const parsedHours = parseFloat(newHours) || 1.0;
    const newEntry: TimesheetEntry = {
      id: `TS-${100 + entries.length + 1}`,
      date: "Today, Just now",
      isoDate: "2026-09-30",
      weekPeriod: "Week 40 (Sep 28 – Oct 04)",
      task: newTaskTitle.trim(),
      description: newTaskDesc.trim() || "Worked on sprint deliverables with automated Git commit verification.",
      hours: parsedHours,
      hourlyRate,
      commitHash: newCommit.trim() || "3f8812a",
      branch: newBranch.trim() || "main",
      commitDiff: "+45 / -6",
      milestoneId: newMilestoneId,
      milestoneTitle: newMilestoneId === "M1" ? "Discovery & Database" : newMilestoneId === "M2" ? "Core UI & API" : "Stripe Connect",
      tags: ["verified", "git"],
      status: role === "business" ? "approved" : "pending_review",
      ciPassed: true,
    };

    setEntries([newEntry, ...entries]);
    setShowLogModal(false);
    setNewTaskTitle("");
    setNewTaskDesc("");
    showToast(`Logged ${parsedHours}h to Week 40 timesheet (${formatCurrency(parsedHours * hourlyRate)})`);
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = [
      "Entry ID",
      "Date",
      "Pay Period",
      "Contract Mode",
      "Task Summary",
      "Hours Logged",
      "Hourly Rate",
      "Total Amount ($)",
      "Git Commit",
      "Branch",
      "Milestone Tag",
      "Status",
      "CI Verification",
    ];

    const rows = entries.map((e) => [
      e.id,
      e.date,
      `"${e.weekPeriod}"`,
      contractMode.toUpperCase(),
      `"${e.task.replace(/"/g, '""')}"`,
      e.hours,
      `$${e.hourlyRate}`,
      `$${(e.hours * e.hourlyRate).toFixed(2)}`,
      e.commitHash,
      e.branch,
      e.milestoneId || "N/A",
      e.status.toUpperCase(),
      e.ciPassed ? "PASSED" : "FAILED",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lockloop-audited-timesheet-${contractMode}-week40.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Downloaded IRS & Tax compliant Audited Timesheet CSV");
  };

  // Client Weekly Approval
  const handleApproveWeek = () => {
    setEntries((prev) =>
      prev.map((e) => (e.weekPeriod.includes("Week 40") ? { ...e, status: "approved" } : e))
    );
    showToast(`Week 40 Timesheet approved! Escrow payment of ${formatCurrency(currentWeekEarned)} scheduled.`);
  };

  return (
    <div className={cn("flex flex-col gap-3.5 h-full min-h-0 overflow-hidden", className)}>
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & CONTRACT BILLING MODE SWITCHER                           */}
      {/* ========================================================================= */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-black/[0.06] shadow-[0px_2px_10px_rgba(0,0,0,0.03)] flex flex-col gap-3 shrink-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Title & Mode Context */}
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-mono font-semibold text-[#6B7280]">
              <span className="text-[#0C66E4] font-bold">LOCKLOOP / TIMESHEET</span>
              <span>•</span>
              <span className="text-[#166534] font-bold bg-[#DCFCE7] px-2 py-0.5 rounded text-[10px]">
                {contractMode === "hourly"
                  ? "HOURLY CONTRACT ($85/HR)"
                  : contractMode === "weekly_retainer"
                  ? "WEEKLY RETAINER ($3,400/WK)"
                  : "FIXED MILESTONE SOW ($4,950)"}
              </span>
              <span>•</span>
              <span>SOW-2026-9921</span>
            </div>

            <div className="flex items-center gap-2.5">
              <h1 className="text-lg font-bold tracking-tight text-[#111827]">
                Audited Timesheet & Version Log
              </h1>
              <span className="text-xs text-[#6B7280] hidden sm:inline">
                • {totalAllTimeHours} Total Hours Verified Across {entries.length} Commits
              </span>
            </div>
          </div>

          {/* Right: Contract Mode Switcher & Primary Actions */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Mode Switcher Pills */}
            <div className="flex items-center bg-[#F4F5F7] border border-[#E5E7EB] p-1 rounded-lg text-xs font-semibold text-[#4B5563]">
              <button
                onClick={() => {
                  setContractMode("hourly");
                  showToast("Switched to Hourly Contract Mode ($85/hr)");
                }}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-all cursor-pointer",
                  contractMode === "hourly"
                    ? "bg-white text-[#111827] shadow-xs font-bold"
                    : "hover:text-[#111827]"
                )}
                title="Hourly Contract with Weekly Cap & Pay Periods"
              >
                Hourly ($85/h)
              </button>

              <button
                onClick={() => {
                  setContractMode("weekly_retainer");
                  showToast("Switched to Weekly Retainer Mode ($3,400/wk)");
                }}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-all cursor-pointer",
                  contractMode === "weekly_retainer"
                    ? "bg-white text-[#111827] shadow-xs font-bold"
                    : "hover:text-[#111827]"
                )}
                title="Weekly Guaranteed Retainer Fee"
              >
                Weekly Retainer
              </button>

              <button
                onClick={() => {
                  setContractMode("milestone");
                  showToast("Switched to Fixed Milestone Mode (M1, M2, M3)");
                }}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-all cursor-pointer",
                  contractMode === "milestone"
                    ? "bg-white text-[#111827] shadow-xs font-bold"
                    : "hover:text-[#111827]"
                )}
                title="Fixed Milestone Deliverable Billing"
              >
                Milestone Mode
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="text-xs font-semibold gap-1.5 h-8 bg-white hover:bg-[#F9FAFB]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </Button>

            <Button
              variant="dark"
              size="sm"
              onClick={() => setShowLogModal(true)}
              className="text-xs font-bold gap-1.5 h-8 bg-[#0C66E4] hover:bg-[#0055CC] text-white"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Hours</span>
            </Button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. WEEKLY ESCROW CAP & PAYOUT HUD (Accurate Hours, Cap & Auto-Invoice)    */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-[#F1F3F6]">
          {/* Card 1: Weekly Hours & Hour Cap Progress */}
          <div className="bg-[#FAFBFD] p-3 rounded-xl border border-black/[0.06] flex flex-col justify-between gap-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center font-bold">
                  <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#111827] block">
                    Weekly Capacity
                  </span>
                  <span className="text-[10px] text-[#6B7280]">
                    {contractMode === "milestone" ? "Milestone M2 Track" : "Max 40.0h Allowed/Wk"}
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold text-[#111827]">
                {currentWeekHours} / {weeklyHourCap}h
              </span>
            </div>

            {/* Hour Cap Progress Bar */}
            <div className="space-y-1">
              <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA] rounded-full transition-all duration-500"
                  style={{ width: `${capUsagePercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#6B7280]">
                <span>{capUsagePercent}% of weekly cap logged</span>
                <span className="font-semibold text-[#166534]">{(weeklyHourCap - currentWeekHours).toFixed(1)}h remaining</span>
              </div>
            </div>
          </div>

          {/* Card 2: Current Pay Period Billable Total */}
          <div className="bg-[#FAFBFD] p-3 rounded-xl border border-black/[0.06] flex flex-col justify-between gap-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#DCFCE7] text-[#15803D] flex items-center justify-center font-bold">
                  <DollarSign className="w-3.5 h-3.5 text-[#166534]" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#111827] block">
                    Current Pay Period
                  </span>
                  <span className="text-[10px] text-[#6B7280]">
                    Week 40 (Sep 28 – Oct 04)
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-[#DCFCE7] text-[#15803D] px-1.5 py-0.5 rounded border border-[#BBF7D0]">
                {contractMode === "weekly_retainer" ? "Fixed Retainer" : `@ $${hourlyRate}/hr`}
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1 border-t border-black/[0.04]">
              <span className="text-lg font-black text-[#111827] font-mono">
                {formatCurrency(currentWeekEarned)}
              </span>
              <span className="text-[10px] text-[#6B7280] font-mono">
                All-time: {formatCurrency(totalAllTimeEarned)}
              </span>
            </div>
          </div>

          {/* Card 3: Auto-Invoicing & Review SLA */}
          <div className="bg-[#FAFBFD] p-3 rounded-xl border border-black/[0.06] flex flex-col justify-between gap-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FAF5FF] text-[#7C3AED] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#7C3AED]" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#111827] block">
                    Weekly Review SLA
                  </span>
                  <span className="text-[10px] text-[#6B7280]">
                    Decentralized Escrow Hold
                  </span>
                </div>
              </div>
              <Badge variant="lime" className="text-[9px] px-1.5 py-0.2">
                Green Zone
              </Badge>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-black/[0.04]">
              <span className="text-[11px] text-[#6B7280]">Auto-Release:</span>
              <span className="text-[11px] font-mono font-bold text-[#15803D] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Mon 12:00 PM EST
              </span>
            </div>
          </div>

          {/* Card 4: Verified Git Commit Activity */}
          <div className="bg-[#FAFBFD] p-3 rounded-xl border border-black/[0.06] flex flex-col justify-between gap-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#F0FDF4] text-[#166534] flex items-center justify-center font-bold">
                  <GitCommit className="w-3.5 h-3.5 text-[#166534]" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#111827] block">
                    Version Audit
                  </span>
                  <span className="text-[10px] text-[#6B7280]">
                    Cryptographic Integrity
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-[#E0F2FE] text-[#0369A1] px-1.5 py-0.5 rounded border border-[#BAE6FD]">
                100% CI Passed
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-black/[0.04]">
              <span className="text-[11px] text-[#6B7280]">Week 40 Diff:</span>
              <span className="text-[11px] font-mono font-bold text-[#111827]">
                +617 / -54 lines (3 PRs)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. TOOLBAR: PERIOD PICKER, SEARCH & APPROVAL CONTROLS                     */}
      {/* ========================================================================= */}
      <div className="bg-white p-3 rounded-xl border border-black/[0.06] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Pay Period Selector */}
          <div className="flex items-center bg-[#F4F5F7] border border-[#E5E7EB] rounded-lg p-0.5 text-xs font-semibold text-[#4B5563]">
            <button
              onClick={() => setSelectedPeriod("week-40")}
              className={cn(
                "px-2.5 py-1 rounded-md cursor-pointer transition-all",
                selectedPeriod === "week-40" ? "bg-white text-[#111827] shadow-2xs font-bold" : "hover:text-[#111827]"
              )}
            >
              Week 40 (Sep 28–Oct 04) • Current
            </button>
            <button
              onClick={() => setSelectedPeriod("week-39")}
              className={cn(
                "px-2.5 py-1 rounded-md cursor-pointer transition-all",
                selectedPeriod === "week-39" ? "bg-white text-[#111827] shadow-2xs font-bold" : "hover:text-[#111827]"
              )}
            >
              Week 39 (Sep 21–27) • Paid
            </button>
            <button
              onClick={() => setSelectedPeriod("all")}
              className={cn(
                "px-2.5 py-1 rounded-md cursor-pointer transition-all",
                selectedPeriod === "all" ? "bg-white text-[#111827] shadow-2xs font-bold" : "hover:text-[#111827]"
              )}
            >
              All Time
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-[#F4F5F7] border border-[#E5E7EB] rounded-lg p-0.5 text-xs font-semibold text-[#4B5563]">
            <button
              onClick={() => setStatusFilter("all")}
              className={cn(
                "px-2 py-1 rounded-md cursor-pointer",
                statusFilter === "all" ? "bg-white text-[#111827] shadow-2xs font-bold" : "hover:text-[#111827]"
              )}
            >
              All ({entries.length})
            </button>
            <button
              onClick={() => setStatusFilter("approved")}
              className={cn(
                "px-2 py-1 rounded-md cursor-pointer flex items-center gap-1",
                statusFilter === "approved" ? "bg-white text-[#111827] shadow-2xs font-bold" : "hover:text-[#111827]"
              )}
            >
              <CheckCircle2 className="w-3 h-3 text-[#15803D]" />
              Approved
            </button>
            <button
              onClick={() => setStatusFilter("pending_review")}
              className={cn(
                "px-2 py-1 rounded-md cursor-pointer flex items-center gap-1",
                statusFilter === "pending_review" ? "bg-white text-[#111827] shadow-2xs font-bold" : "hover:text-[#111827]"
              )}
            >
              <Clock className="w-3 h-3 text-[#B45309]" />
              In Review
            </button>
          </div>
        </div>

        {/* Right: Search & Client Weekly Approval */}
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search task, commit, branch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-[#F8F9FA] border border-[#E5E7EB] focus:border-[#0C66E4] focus:bg-white rounded-lg pl-8 pr-7 py-1.5 outline-hidden transition-all text-[#111827]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#111827]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {role === "business" && currentWeekEntries.some((e) => e.status === "pending_review") && (
            <Button
              variant="dark"
              size="sm"
              onClick={handleApproveWeek}
              className="text-xs font-bold bg-[#15803D] hover:bg-[#166534] text-white shrink-0"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              <span>Approve Week ({formatCurrency(currentWeekEarned)})</span>
            </Button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. AUDITED TIMESHEET & VERSION LOG CARDS FEED                             */}
      {/* ========================================================================= */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 pb-3 flex flex-col gap-2.5">
        {filteredEntries.length === 0 ? (
          <div className="bg-white rounded-xl border border-black/[0.06] p-8 text-center flex flex-col items-center justify-center gap-3 my-auto">
            <Clock className="w-8 h-8 text-[#9CA3AF]" />
            <h3 className="text-sm font-bold text-[#111827]">No Timesheet Entries Found</h3>
            <p className="text-xs text-[#6B7280]">
              No recorded time entries matched the current filters or pay period.
            </p>
          </div>
        ) : (
          filteredEntries.map((entry) => {
            const entryTotal = Math.round(entry.hours * entry.hourlyRate * 100) / 100;

            return (
              <div
                key={entry.id}
                className="bg-white p-3.5 rounded-xl border border-black/[0.06] shadow-2xs hover:shadow-xs transition-shadow flex flex-col gap-2.5 group"
              >
                {/* Header Row: ID, Task, Hours Badge, Subtotal & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="font-mono font-bold text-xs bg-[#111827] text-[#88D635] px-2 py-0.5 rounded shrink-0 shadow-2xs">
                      {entry.id}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-[#111827] group-hover:text-[#0C66E4] transition-colors">
                          {entry.task}
                        </h4>
                        {entry.ciPassed && (
                          <span className="text-[10px] font-bold text-[#15803D] bg-[#DCFCE7] px-1.5 py-0.2 rounded border border-[#BBF7D0] flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                            CI Verified
                          </span>
                        )}
                        <span
                          className={cn(
                            "text-[10px] font-semibold px-2 py-0.5 rounded border uppercase",
                            entry.status === "approved"
                              ? "bg-[#E3FCEF] text-[#006644] border-[#ABF5D1]"
                              : "bg-[#FFF0B3] text-[#172B4D] border-[#FFE380]"
                          )}
                        >
                          {entry.status === "approved" ? "Approved" : "In Review (72h)"}
                        </span>
                      </div>

                      {/* Context Line: Date & Contract Scope Tag */}
                      <div className="flex items-center gap-2 text-xs text-[#6B7280] font-mono mt-0.5">
                        <span>{entry.date}</span>
                        <span>•</span>
                        {contractMode === "milestone" ? (
                          <span className="font-semibold text-[#111827] bg-[#F4F5F7] px-1.5 py-0.2 rounded">
                            Milestone {entry.milestoneId}: {entry.milestoneTitle}
                          </span>
                        ) : (
                          <span className="font-semibold text-[#111827] bg-[#F4F5F7] px-1.5 py-0.2 rounded">
                            {entry.weekPeriod}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Hours & Subtotal Calculation Pill */}
                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="text-xs font-mono font-bold text-[#111827] bg-[#F4F5F7] px-2 py-0.5 rounded border border-[#E5E7EB]">
                          {entry.hours}h
                        </span>
                        <span className="text-xs text-[#6B7280] font-mono">
                          × ${entry.hourlyRate}/h =
                        </span>
                        <span className="text-sm font-mono font-black text-[#166534]">
                          {formatCurrency(entryTotal)}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#6B7280] font-mono">
                        Tax compliant record
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  {entry.description}
                </p>

                {/* Footer: Git Commit & Branch Audit Widget */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-black/[0.04] text-[11px] font-mono text-[#6B7280]">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <div className="flex items-center gap-1 text-[#0369A1] bg-[#F0F9FF] px-2 py-0.5 rounded border border-[#BAE6FD]">
                      <GitCommit className="w-3 h-3" />
                      <span>git: {entry.commitHash}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[#4B5563] bg-[#F4F5F7] px-2 py-0.5 rounded border border-[#E5E7EB]">
                      <GitBranch className="w-3 h-3" />
                      <span>{entry.branch}</span>
                    </div>

                    <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">
                      {entry.commitDiff}
                    </span>

                    {entry.tags.map((t) => (
                      <span key={t} className="text-[#6D28D9] bg-[#FAF5FF] px-1.5 py-0.2 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <span className="text-[10px] text-[#9CA3AF] self-end sm:self-center">
                    Audited for Schedule C / S-Corp Invoice
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. LOG HOURS DIALOG MODAL                                                 */}
      {/* ========================================================================= */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-black/[0.08] flex flex-col gap-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#F1F3F6] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0C66E4] text-white flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#111827]">
                    Log Time & Cryptographic Commit
                  </h3>
                  <span className="text-xs text-[#6B7280]">
                    {contractMode === "hourly"
                      ? "Hourly Contract: Week 40 ($85/hr)"
                      : contractMode === "weekly_retainer"
                      ? "Weekly Retainer Capacity"
                      : "Fixed Milestone Deliverable"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="p-1 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogHours} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="font-bold text-[#374151] block mb-1">
                  Task Summary *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement OAuth callbacks and JWT session handling"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full p-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-xs outline-hidden focus:border-[#0C66E4] focus:bg-white text-[#111827]"
                />
              </div>

              <div>
                <label className="font-bold text-[#374151] block mb-1">
                  Work Scope & Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain what code changes and user flows were implemented..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full p-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-xs outline-hidden focus:border-[#0C66E4] focus:bg-white text-[#111827]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#374151] block mb-1">
                    Hours Logged *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="24"
                    required
                    value={newHours}
                    onChange={(e) => setNewHours(e.target.value)}
                    className="w-full p-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-xs font-mono outline-hidden focus:border-[#0C66E4] focus:bg-white text-[#111827]"
                  />
                  <span className="text-[10px] text-[#166534] font-mono mt-1 block">
                    Estimated subtotal: {formatCurrency((parseFloat(newHours) || 0) * hourlyRate)}
                  </span>
                </div>

                <div>
                  <label className="font-bold text-[#374151] block mb-1">
                    Pay Period / Scope
                  </label>
                  {contractMode === "milestone" ? (
                    <select
                      value={newMilestoneId}
                      onChange={(e) => setNewMilestoneId(e.target.value)}
                      className="w-full p-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-xs outline-hidden cursor-pointer text-[#111827]"
                    >
                      <option value="M1">M1: Discovery & Database</option>
                      <option value="M2">M2: Core UI & API Engine</option>
                      <option value="M3">M3: Stripe Connect Vault</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      disabled
                      value="Week 40 (Sep 28 – Oct 04)"
                      className="w-full p-2 bg-[#F3F4F6] border border-[#E5E7EB] rounded-lg text-xs font-mono text-[#6B7280]"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#374151] block mb-1">
                    Git Branch
                  </label>
                  <input
                    type="text"
                    value={newBranch}
                    onChange={(e) => setNewBranch(e.target.value)}
                    className="w-full p-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-xs font-mono outline-hidden text-[#111827]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#374151] block mb-1">
                    Commit Hash
                  </label>
                  <input
                    type="text"
                    value={newCommit}
                    onChange={(e) => setNewCommit(e.target.value)}
                    className="w-full p-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-xs font-mono outline-hidden text-[#111827]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F3F6]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLogModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="dark"
                  size="sm"
                  className="bg-[#0C66E4] hover:bg-[#0055CC] text-white font-bold"
                >
                  Save Audited Entry
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
