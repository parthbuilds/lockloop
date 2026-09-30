"use client";

import * as React from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";
import { Card } from "./card";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Lock,
  Play,
  PlayCircle,
  GitCommit,
  GitBranch,
  Calendar as CalendarIcon,
  CalendarDays,
  Plus,
  Search,
  Video,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  AlertCircle,
  Sparkles,
  Trophy,
  Award,
  Filter,
  Eye,
  FileText,
  Pause,
  Maximize2,
  Volume2,
  Flame,
  Check,
  Download,
  Share2,
  RefreshCw,
} from "lucide-react";
import { ALL_HOURS_24 } from "./milestone-escrow-room";

// =============================================================================
// TYPES & DATA STRUCTURES
// =============================================================================

export interface CheckInItem {
  id: string;
  title: string;
  description: string;
  author: string;
  authorRole: "freelancer" | "business";
  authorInitials: string;
  milestoneId: string;
  milestoneTitle: string;
  dateStr: string; // "YYYY-MM-DD"
  timeSlot: string; // "2 PM"
  timeDisplay: string; // "2:15 PM"
  loomDuration: string; // "04:18"
  loomTitle: string;
  branch: string;
  commitHash: string;
  commitDiff: string;
  hoursLogged: number;
  status: "verified" | "review" | "acknowledged";
  isMilestoneAchievement?: boolean;
  achievementBadge?: string;
  escrowAmount?: number;
  notes?: string[];
  tags: string[];
}

export interface DayHeaderInfo {
  label: string;
  shortDay: string;
  dayNumber: string;
  dateStr: string;
  dayIndex: number;
  isToday: boolean;
  monthName: string;
  year: number;
}

// Fixed anchor date for 2026 sprint demo: Wednesday Sep 30, 2026
const ANCHOR_TODAY_ISO = "2026-09-30";

// Base week definitions
export const INITIAL_CHECKINS: CheckInItem[] = [
  {
    id: "po-1",
    title: "PostgreSQL Database Schema & NextAuth Session Primitives",
    description: "Configured Prisma schema, established database connection pools, and set up Google & GitHub OAuth provider flows with automated session invalidation.",
    author: "Alex Rivera",
    authorRole: "freelancer",
    authorInitials: "AR",
    milestoneId: "m1",
    milestoneTitle: "Milestone 1: Database Architecture & Schema",
    dateStr: "2026-09-28",
    timeSlot: "10 AM",
    timeDisplay: "10:15 AM",
    loomDuration: "05:42",
    loomTitle: "Database Schemas & Prisma Migrations Walkthrough",
    branch: "feat/db-schema-v1",
    commitHash: "4f91b2c",
    commitDiff: "prisma/schema.prisma (+210 -15)",
    hoursLogged: 5.5,
    status: "verified",
    isMilestoneAchievement: true,
    achievementBadge: "Milestone 1 Released ($1,500)",
    escrowAmount: 1500,
    tags: ["Prisma", "Postgres", "Auth", "Milestone 1"],
  },
  {
    id: "po-2",
    title: "Dockerized Local Dev Environment & Supabase Sync",
    description: "Configured docker-compose for local development, local pgvector extension setup, and seeded synthetic freelancer data.",
    author: "Alex Rivera",
    authorRole: "freelancer",
    authorInitials: "AR",
    milestoneId: "m1",
    milestoneTitle: "Milestone 1: Database Architecture & Schema",
    dateStr: "2026-09-28",
    timeSlot: "3 PM",
    timeDisplay: "3:30 PM",
    loomDuration: "03:10",
    loomTitle: "Docker Compose & Migration Scripts Test Run",
    branch: "chore/docker-compose",
    commitHash: "7b30a11",
    commitDiff: "docker-compose.yml (+64 -2)",
    hoursLogged: 3.2,
    status: "verified",
    tags: ["Docker", "DevOps", "Database"],
  },
  {
    id: "po-3",
    title: "JWT Cookie Encryption & Middleware Tenant Isolation",
    description: "Implemented Next.js edge middleware to inspect Bearer tokens, enforce sub-domain tenant separation, and prevent cross-tenant data leakage.",
    author: "Alex Rivera",
    authorRole: "freelancer",
    authorInitials: "AR",
    milestoneId: "m2",
    milestoneTitle: "Milestone 2: Core UI & API Sync",
    dateStr: "2026-09-29",
    timeSlot: "11 AM",
    timeDisplay: "11:20 AM",
    loomDuration: "04:50",
    loomTitle: "Edge Middleware & Token Verification Demo",
    branch: "feat/jwt-security",
    commitHash: "1e84cc2",
    commitDiff: "src/middleware.ts (+88 -6)",
    hoursLogged: 4.8,
    status: "verified",
    tags: ["Security", "JWT", "Edge"],
  },
  {
    id: "po-4",
    title: "NextAuth Google Provider + Row-Level Security Rules on User Table",
    description: "Finished the OAuth callback router, encrypted JWT session cookies, and tested tenant isolation with 12 unit tests.",
    author: "Alex Rivera",
    authorRole: "freelancer",
    authorInitials: "AR",
    milestoneId: "m2",
    milestoneTitle: "Milestone 2: Core UI & API Sync",
    dateStr: "2026-09-30",
    timeSlot: "2 PM",
    timeDisplay: "2:00 PM",
    loomDuration: "04:18",
    loomTitle: "OAuth & RLS Tenant Isolation Demo",
    branch: "feat/oauth-providers",
    commitHash: "8c3f20a",
    commitDiff: "src/lib/auth.ts (+142 -12)",
    hoursLogged: 4.2,
    status: "review",
    isMilestoneAchievement: true,
    achievementBadge: "Milestone 2 Goal Ready ($1,950)",
    escrowAmount: 1950,
    tags: ["OAuth", "RLS", "NextAuth", "Milestone 2"],
  },
  {
    id: "po-5",
    title: "Stripe Connect Express Onboarding Webhooks & Listener Stubs",
    description: "Constructed webhook signature verification, payout recipient account state handlers, and automated escrow balance release listeners.",
    author: "Alex Rivera",
    authorRole: "freelancer",
    authorInitials: "AR",
    milestoneId: "m3",
    milestoneTitle: "Milestone 3: Stripe Billing & Payout Webhooks",
    dateStr: "2026-10-01",
    timeSlot: "1 PM",
    timeDisplay: "1:45 PM",
    loomDuration: "06:12",
    loomTitle: "Stripe CLI Webhook Events & Ledger Audit Demo",
    branch: "feat/stripe-connect",
    commitHash: "9a2f180",
    commitDiff: "src/app/api/webhooks/stripe/route.ts (+180 -24)",
    hoursLogged: 5.0,
    status: "review",
    tags: ["Stripe", "Webhooks", "Billing"],
  },
  {
    id: "po-6",
    title: "Milestone 3 Sprint Checkpoint: Escrow Auto-Release Logic",
    description: "Verified neutral 3rd party payout execution test on sandbox. Tested 72h Dead-Man watchdog timer expiration handling.",
    author: "Alex Rivera",
    authorRole: "freelancer",
    authorInitials: "AR",
    milestoneId: "m3",
    milestoneTitle: "Milestone 3: Stripe Billing & Payout Webhooks",
    dateStr: "2026-10-02",
    timeSlot: "11 AM",
    timeDisplay: "11:00 AM",
    loomDuration: "04:30",
    loomTitle: "Dead-Man Watchdog Expiry Test & Escrow Trigger",
    branch: "feat/watchdog-release",
    commitHash: "3d55ab1",
    commitDiff: "src/lib/escrow.ts (+95 -8)",
    hoursLogged: 3.8,
    status: "review",
    isMilestoneAchievement: true,
    achievementBadge: "Milestone 3 Milestone Checkpoint ($800)",
    escrowAmount: 800,
    tags: ["Escrow", "Watchdog", "Milestone 3"],
  },
];

export const TIMELINE_HOURS = [
  "8 AM", "9 AM", "10 AM", "11 AM", "12 PM",
  "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM",
];

// Helper to calculate date by week offset
export function getWeekDates(weekOffset: number, anchorIso: string = ANCHOR_TODAY_ISO): DayHeaderInfo[] {
  const [ay, am, ad] = anchorIso.split("-").map(Number);
  const anchorDate = new Date(ay, am - 1, ad);

  // Find Monday of the week for anchorDate
  const currentDayOfWeek = anchorDate.getDay(); // 0 is Sun, 1 is Mon, 3 is Wed
  const daysFromMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;

  const baseMonday = new Date(anchorDate);
  baseMonday.setDate(anchorDate.getDate() - daysFromMonday + weekOffset * 7);

  const days: DayHeaderInfo[] = [];
  const dayNames = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  for (let i = 0; i < 7; i++) {
    const d = new Date(baseMonday);
    d.setDate(baseMonday.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;
    const dayName = dayNames[i];
    const label = `${dayName} ${day}`;

    days.push({
      label,
      shortDay: dayName,
      dayNumber: day,
      dateStr,
      dayIndex: i,
      isToday: dateStr === anchorIso,
      monthName: monthNames[d.getMonth()],
      year,
    });
  }

  return days;
}

interface ProofOfWorkFeedProps {
  role: "business" | "freelancer";
  showToast: (msg: string) => void;
  onBackToDashboard: () => void;
  onOpenChat?: () => void;
  onReleaseEscrow?: () => void;
  className?: string;
}

export function ProofOfWorkFeed({
  role,
  showToast,
  onBackToDashboard,
  onOpenChat,
  onReleaseEscrow,
  className,
}: ProofOfWorkFeedProps) {
  // Navigation & Time controls
  const [weekOffset, setWeekOffset] = React.useState<number>(0);
  const [calendarSpan, setCalendarSpan] = React.useState<"week" | "day">("week");
  const [selectedDayIndex, setSelectedDayIndex] = React.useState<number>(2); // Default to WED (Day index 2)
  const [showAllHours, setShowAllHours] = React.useState<boolean>(false);

  // Filters & Search
  const [statusFilter, setStatusFilter] = React.useState<"all" | "verified" | "review" | "achievements">("all");
  const [milestoneFilter, setMilestoneFilter] = React.useState<string>("all");
  const [typeFilter, setTypeFilter] = React.useState<"all" | "loom" | "git" | "achievement">("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Check-ins dataset
  const [checkIns, setCheckIns] = React.useState<CheckInItem[]>(INITIAL_CHECKINS);

  // Active inspector modals
  const [activeMediaModal, setActiveMediaModal] = React.useState<CheckInItem | null>(null);
  const [activeAchievementModal, setActiveAchievementModal] = React.useState<CheckInItem | null>(null);
  const [showSubmitModal, setShowSubmitModal] = React.useState<boolean>(false);

  // Video playback simulator inside modal
  const [isPlayingLoom, setIsPlayingLoom] = React.useState<boolean>(false);
  const [loomProgress, setLoomProgress] = React.useState<number>(35);

  // New check-in submission form state
  const [submitTitle, setSubmitTitle] = React.useState<string>("");
  const [submitDesc, setSubmitDesc] = React.useState<string>("");
  const [submitHours, setSubmitHours] = React.useState<string>("4.5");
  const [submitBranch, setSubmitBranch] = React.useState<string>("feat/api-endpoints");
  const [submitCommit, setSubmitCommit] = React.useState<string>("5c98d2a");
  const [submitMilestoneId, setSubmitMilestoneId] = React.useState<string>("m2");
  const [submitTimeSlot, setSubmitTimeSlot] = React.useState<string>("2 PM");
  const [isMilestoneCheck, setIsMilestoneCheck] = React.useState<boolean>(false);

  // Generate 7-day header array dynamically for current weekOffset
  const currentWeekDays = React.useMemo(() => {
    return getWeekDates(weekOffset, ANCHOR_TODAY_ISO);
  }, [weekOffset]);

  // Current month & year banner calculation
  const monthBanner = React.useMemo(() => {
    const firstDay = currentWeekDays[0];
    const lastDay = currentWeekDays[6];
    if (firstDay.monthName === lastDay.monthName) {
      return `${firstDay.monthName} ${firstDay.year}`;
    }
    return `${firstDay.monthName} – ${lastDay.monthName} ${lastDay.year}`;
  }, [currentWeekDays]);

  const dateSpanText = React.useMemo(() => {
    const firstDay = currentWeekDays[0];
    const lastDay = currentWeekDays[6];
    return `${firstDay.dayNumber} ${firstDay.monthName.slice(0, 3)} – ${lastDay.dayNumber} ${lastDay.monthName.slice(0, 3)} ${lastDay.year}`;
  }, [currentWeekDays]);

  // Filtered check-ins
  const filteredCheckIns = React.useMemo(() => {
    return checkIns.filter((item) => {
      // Status filter
      if (statusFilter === "verified" && item.status !== "verified") return false;
      if (statusFilter === "review" && item.status !== "review") return false;
      if (statusFilter === "achievements" && !item.isMilestoneAchievement) return false;

      // Milestone filter
      if (milestoneFilter !== "all" && item.milestoneId !== milestoneFilter) return false;

      // Type filter
      if (typeFilter === "loom" && !item.loomDuration) return false;
      if (typeFilter === "git" && !item.commitHash) return false;
      if (typeFilter === "achievement" && !item.isMilestoneAchievement) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCommit = item.commitHash.toLowerCase().includes(q);
        const matchesBranch = item.branch.toLowerCase().includes(q);
        const matchesMilestone = item.milestoneTitle.toLowerCase().includes(q);
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesCommit && !matchesBranch && !matchesMilestone && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [checkIns, statusFilter, milestoneFilter, typeFilter, searchQuery]);

  // Active time slots
  const activeHours = showAllHours ? ALL_HOURS_24 : TIMELINE_HOURS;

  // Selected date string in Day view
  const selectedDateStr = currentWeekDays[selectedDayIndex]?.dateStr || currentWeekDays[2].dateStr;
  const selectedDayInfo = currentWeekDays[selectedDayIndex] || currentWeekDays[2];

  // Navigation handlers
  const handleNavLeft = () => {
    if (calendarSpan === "week") {
      setWeekOffset((prev) => prev - 1);
      showToast("Moved to previous week");
    } else {
      if (selectedDayIndex > 0) {
        setSelectedDayIndex((prev) => prev - 1);
      } else {
        setWeekOffset((prev) => prev - 1);
        setSelectedDayIndex(6);
      }
      showToast("Moved to previous day");
    }
  };

  const handleNavRight = () => {
    if (calendarSpan === "week") {
      setWeekOffset((prev) => prev + 1);
      showToast("Moved to next week");
    } else {
      if (selectedDayIndex < 6) {
        setSelectedDayIndex((prev) => prev + 1);
      } else {
        setWeekOffset((prev) => prev + 1);
        setSelectedDayIndex(0);
      }
      showToast("Moved to next day");
    }
  };

  const handleJumpToToday = () => {
    setWeekOffset(0);
    const todayIndex = currentWeekDays.findIndex((d) => d.isToday);
    setSelectedDayIndex(todayIndex >= 0 ? todayIndex : 2);
    showToast(`Jumped to Today (WED 30, Sep 30, 2026)`);
  };

  // Submit check-in handler
  const handleCreateCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitTitle.trim()) {
      showToast("Please enter a deliverable title");
      return;
    }

    const targetDate = currentWeekDays[selectedDayIndex]?.dateStr || ANCHOR_TODAY_ISO;
    const newCheckIn: CheckInItem = {
      id: `po-${Date.now()}`,
      title: submitTitle,
      description: submitDesc || "Daily verified commit and screen walk-through.",
      author: role === "freelancer" ? "Alex Rivera" : "Sarah Chen",
      authorRole: role,
      authorInitials: role === "freelancer" ? "AR" : "SC",
      milestoneId: submitMilestoneId,
      milestoneTitle:
        submitMilestoneId === "m1"
          ? "Milestone 1: Database Architecture"
          : submitMilestoneId === "m2"
          ? "Milestone 2: Core UI & API Sync"
          : "Milestone 3: Stripe Billing",
      dateStr: targetDate,
      timeSlot: submitTimeSlot,
      timeDisplay: `${submitTimeSlot}:00`,
      loomDuration: "03:45",
      loomTitle: `${submitTitle} Walkthrough`,
      branch: submitBranch,
      commitHash: submitCommit,
      commitDiff: "src/app/page.tsx (+45 -8)",
      hoursLogged: parseFloat(submitHours) || 4.0,
      status: role === "business" ? "verified" : "review",
      isMilestoneAchievement: isMilestoneCheck,
      achievementBadge: isMilestoneCheck ? "Sprint Milestone Achievement" : undefined,
      escrowAmount: isMilestoneCheck ? 1950 : undefined,
      tags: ["Check-in", "Sprint 3"],
    };

    setCheckIns((prev) => [newCheckIn, ...prev]);
    showToast(`Check-in "${submitTitle}" successfully posted to the timeline!`);
    setShowSubmitModal(false);
    setSubmitTitle("");
    setSubmitDesc("");
  };

  return (
    <div className={cn("w-full min-w-0 flex flex-col gap-3.5 flex-1 min-h-0 overflow-hidden", className)}>
      {/* ========================================================================= */}
      {/* 1. TOP TOOLBAR & HEADER (Matches Milestones & Escrow Delivery Sprint Active) */}
      {/* ========================================================================= */}
      <div className="w-full bg-white p-3.5 sm:p-4 rounded-xl border border-black/[0.06] shadow-[0px_2px_10px_rgba(0,0,0,0.04)] flex flex-col gap-3 shrink-0">
        {/* Top Line: Title + Sprint Active Badge + View Mode Switchers + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-lg font-bold tracking-tight text-[#111827] flex items-center gap-2">
              <span>
                {role === "business"
                  ? "Client Proof-of-Work Verification Stream"
                  : "Freelancer Daily Proof-of-Work & Check-in Stream"}
              </span>
              <Badge variant="lime" className="text-[11px] rounded-md py-0.5 font-bold">
                Sprint Active
              </Badge>
            </h2>
            <span className="hidden md:inline-block text-xs text-[#6B7280]">
              • SOW-2026-9921 ($4,950 Contract Total)
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Proof Type Quick Filters */}
            <div className="flex items-center bg-[#F4F5F7] p-1 rounded-lg text-xs font-semibold text-[#6B7280]">
              <button
                onClick={() => setTypeFilter("all")}
                className={cn(
                  "flex items-center gap-1.5 py-1.5 px-2.5 rounded-md transition-all cursor-pointer whitespace-nowrap",
                  typeFilter === "all"
                    ? "bg-white text-[#111827] shadow-xs font-bold"
                    : "hover:text-[#111827]"
                )}
              >
                <span>All Proof ({checkIns.length})</span>
              </button>

              <button
                onClick={() => setTypeFilter("loom")}
                className={cn(
                  "flex items-center gap-1.5 py-1.5 px-2.5 rounded-md transition-all cursor-pointer whitespace-nowrap",
                  typeFilter === "loom"
                    ? "bg-white text-[#111827] shadow-xs font-bold"
                    : "hover:text-[#111827]"
                )}
              >
                <Video className="w-3.5 h-3.5 text-[#2D6606]" />
                <span>16:9 Videos</span>
              </button>

              <button
                onClick={() => setTypeFilter("git")}
                className={cn(
                  "flex items-center gap-1.5 py-1.5 px-2.5 rounded-md transition-all cursor-pointer whitespace-nowrap",
                  typeFilter === "git"
                    ? "bg-white text-[#111827] shadow-xs font-bold"
                    : "hover:text-[#111827]"
                )}
              >
                <GitCommit className="w-3.5 h-3.5 text-[#0369A1]" />
                <span>Commits & Diffs</span>
              </button>

              <button
                onClick={() => setTypeFilter("achievement")}
                className={cn(
                  "flex items-center gap-1.5 py-1.5 px-2.5 rounded-md transition-all cursor-pointer whitespace-nowrap",
                  typeFilter === "achievement"
                    ? "bg-white text-[#111827] shadow-xs font-bold"
                    : "hover:text-[#111827]"
                )}
              >
                <Trophy className="w-3.5 h-3.5 text-[#EAB308]" />
                <span>Milestones</span>
              </button>
            </div>

            {/* Post Check-in button */}
            <Button
              variant="dark"
              size="sm"
              onClick={() => setShowSubmitModal(true)}
              className="text-xs font-bold gap-1.5 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#88D635]" />
              <span>{role === "business" ? "Verify / Add Log" : "Record 16:9 Check-in"}</span>
            </Button>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. TOP METRICS CARDS ROW (Exact Style of Milestones & Escrow Delivery)    */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2.5 border-t border-[#F1F3F6]">
          {/* Top Card 1: Active Sprint & Dead-Man Watchdog */}
          <div className="bg-[#FAFBFD] p-3 rounded-xl border border-black/[0.06] flex flex-col justify-between gap-2 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#111827] text-[#88D635] flex items-center justify-center font-bold text-xs">
                  <Flame className="w-3.5 h-3.5 text-[#88D635]" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#111827] block">
                    Sprint 3: Active
                  </span>
                  <span className="text-[10px] text-[#6B7280]">
                    72h Dead-Man Watchdog
                  </span>
                </div>
              </div>
              <Badge variant="lime" className="text-[9px] px-1.5 py-0.2">
                Green Zone
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-black/[0.04]">
              <span className="text-[11px] text-[#6B7280]">Timer Remaining:</span>
              <span className="text-[11px] font-mono font-bold text-[#15803D] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                68h 14m
              </span>
            </div>
          </div>

          {/* Top Card 2: Milestone Achievements Pipeline */}
          <div className="bg-[#FAFBFD] p-3 rounded-xl border border-black/[0.06] flex flex-col justify-between gap-2 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#88D635]/20 text-[#2D6606] flex items-center justify-center font-bold text-xs">
                  <Trophy className="w-3.5 h-3.5 text-[#2D6606]" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#111827] block">
                    Milestones Pipeline
                  </span>
                  <span className="text-[10px] text-[#6B7280]">
                    2 of 4 Goals Achieved
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-[#DCFCE7] text-[#15803D] px-1.5 py-0.5 rounded border border-[#BBF7D0]">
                $1,500 Released
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-black/[0.04]">
              <span className="text-[11px] text-[#6B7280]">In Review:</span>
              <span className="text-[11px] font-bold text-[#B45309]">
                M2 Core UI ($1,950)
              </span>
            </div>
          </div>

          {/* Top Card 3: 16:9 Loom & Video Demos */}
          <div className="bg-[#FAFBFD] p-3 rounded-xl border border-black/[0.06] flex flex-col justify-between gap-2 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#EDE9FE] text-[#6D28D9] flex items-center justify-center font-bold text-xs">
                  <Video className="w-3.5 h-3.5 text-[#6D28D9]" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#111827] block">
                    16:9 Loom Demos
                  </span>
                  <span className="text-[10px] text-[#6B7280]">
                    Visual Proof Verified
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-[#F4F5F7] text-[#4B5563] px-1.5 py-0.5 rounded">
                24.2 mins
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-black/[0.04]">
              <span className="text-[11px] text-[#6B7280]">Latest Check-in:</span>
              <span className="text-[11px] font-semibold text-[#111827] truncate max-w-[130px]">
                OAuth Callback (4h ago)
              </span>
            </div>
          </div>

          {/* Top Card 4: Audited Commits & Hours */}
          <div className="bg-[#FAFBFD] p-3 rounded-xl border border-black/[0.06] flex flex-col justify-between gap-2 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center font-bold text-xs">
                  <GitCommit className="w-3.5 h-3.5 text-[#0369A1]" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#111827] block">
                    Verified Git Work
                  </span>
                  <span className="text-[10px] text-[#6B7280]">
                    18 Commits Logged
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-[#E0F2FE] text-[#0369A1] px-1.5 py-0.5 rounded border border-[#BAE6FD]">
                34.7 Hours
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-black/[0.04]">
              <span className="text-[11px] text-[#6B7280]">PR Diff:</span>
              <span className="text-[11px] font-mono text-[#111827]">
                +142 / -12 lines (#42)
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. MULTI-LEVEL FILTERS & SEARCH ROW                                       */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2.5 border-t border-[#F1F3F6]">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-[11px] font-semibold text-[#6B7280] mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Filter:
            </span>

            {/* Status pills */}
            {[
              { id: "all", label: "All Items", count: checkIns.length },
              {
                id: "verified",
                label: "Verified",
                count: checkIns.filter((c) => c.status === "verified").length,
              },
              {
                id: "review",
                label: "In Review (72h SLA)",
                count: checkIns.filter((c) => c.status === "review").length,
              },
              {
                id: "achievements",
                label: "🏆 Milestones Only",
                count: checkIns.filter((c) => c.isMilestoneAchievement).length,
              },
            ].map((pill) => (
              <button
                key={pill.id}
                onClick={() => setStatusFilter(pill.id as typeof statusFilter)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5",
                  statusFilter === pill.id
                    ? "bg-[#111827] text-white font-semibold"
                    : "bg-[#F4F5F7] text-[#4B5563] hover:bg-[#E5E7EB]"
                )}
              >
                <span>{pill.label}</span>
                <span
                  className={cn(
                    "text-[10px] font-mono px-1 rounded-full",
                    statusFilter === pill.id ? "bg-white/20 text-white" : "bg-[#E5E7EB] text-[#4B5563]"
                  )}
                >
                  {pill.count}
                </span>
              </button>
            ))}

            {/* Milestone dropdown filter */}
            <select
              value={milestoneFilter}
              onChange={(e) => setMilestoneFilter(e.target.value)}
              className="text-xs bg-[#F4F5F7] border border-[#E5E7EB] rounded-md px-2 py-1 text-[#111827] font-medium outline-hidden cursor-pointer"
            >
              <option value="all">All Milestones</option>
              <option value="m1">M1: DB & Architecture (Released)</option>
              <option value="m2">M2: Core UI & API Sync (In Review)</option>
              <option value="m3">M3: Stripe Payouts (Locked)</option>
            </select>

            {/* Content Type Filter */}
            <div className="flex items-center bg-[#F4F5F7] rounded-md p-0.5 text-[11px] font-semibold text-[#4B5563]">
              <button
                onClick={() => setTypeFilter("all")}
                className={cn(
                  "px-2 py-0.5 rounded cursor-pointer",
                  typeFilter === "all" ? "bg-white text-[#111827] shadow-2xs font-bold" : "hover:text-[#111827]"
                )}
              >
                All Media
              </button>
              <button
                onClick={() => setTypeFilter("loom")}
                className={cn(
                  "px-2 py-0.5 rounded cursor-pointer flex items-center gap-1",
                  typeFilter === "loom" ? "bg-white text-[#111827] shadow-2xs font-bold" : "hover:text-[#111827]"
                )}
              >
                <Video className="w-2.5 h-2.5 text-[#2D6606]" />
                Loom
              </button>
              <button
                onClick={() => setTypeFilter("git")}
                className={cn(
                  "px-2 py-0.5 rounded cursor-pointer flex items-center gap-1",
                  typeFilter === "git" ? "bg-white text-[#111827] shadow-2xs font-bold" : "hover:text-[#111827]"
                )}
              >
                <GitCommit className="w-2.5 h-2.5 text-[#0369A1]" />
                Commits
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search commits, Loom, PRs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-[#F4F5F7] border border-transparent focus:border-[#CBD5E1] focus:bg-white rounded-lg pl-8 pr-3 py-1.5 outline-hidden transition-all text-[#111827]"
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
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MAIN CONTENT AREA: VERIFIED PROOF-OF-WORK MEDIA & AUDIT STREAM         */}
      {/* ========================================================================= */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 pb-3 flex flex-col gap-3">
        {filteredCheckIns.length === 0 ? (
          <div className="bg-white rounded-xl border border-black/[0.06] p-8 text-center flex flex-col items-center justify-center gap-3 my-auto">
            <div className="w-12 h-12 rounded-full bg-[#F4F5F7] flex items-center justify-center text-[#9CA3AF]">
              <Video className="w-6 h-6 text-[#9CA3AF]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#111827]">No deliverables or proof match your active filters</h4>
              <p className="text-xs text-[#6B7280] mt-1">Try switching to &quot;All Proof&quot; or clearing your search query.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setTypeFilter("all");
                setStatusFilter("all");
                setMilestoneFilter("all");
                setSearchQuery("");
              }}
              className="text-xs font-semibold cursor-pointer"
            >
              Reset All Filters
            </Button>
          </div>
        ) : (
          filteredCheckIns.map((post) => (
            <Card key={post.id} className="p-3.5 sm:p-4 rounded-xl shadow-2xs hover:shadow-xs transition-shadow border border-black/[0.06] bg-white">
              <div className="flex flex-col md:flex-row gap-4 items-stretch">
                {/* LEFT: Smaller 16:9 Media Preview Card */}
                <div
                  onClick={() => setActiveMediaModal(post)}
                  className="w-full md:w-56 lg:w-64 shrink-0 aspect-video rounded-lg bg-[#0F172A] overflow-hidden flex flex-col justify-between p-2.5 relative group cursor-pointer border border-black/10 shadow-2xs hover:ring-2 hover:ring-[#88D635]/50 transition-all select-none"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/50" />

                  {/* Simulated Code / Terminal Background snippet */}
                  <div className="absolute inset-0 opacity-20 p-2 font-mono text-[8px] text-green-400 select-none overflow-hidden leading-tight">
                    <p className="text-white">$ git log -1</p>
                    <p className="text-zinc-400">{post.commitHash} ({post.branch})</p>
                    <p className="mt-0.5 text-yellow-300 truncate">{post.title}</p>
                    <p className="text-emerald-400 mt-0.5">✓ Tests passed ({post.hoursLogged}h)</p>
                  </div>

                  {/* Top Badges */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1 font-semibold">
                      <Video className="w-3 h-3 text-[#88D635]" />
                      <span>{post.loomDuration}</span>
                    </span>
                    {post.isMilestoneAchievement && (
                      <span className="bg-[#88D635] text-[#0A2600] text-[9px] font-bold px-1.5 py-0.2 rounded">
                        Milestone
                      </span>
                    )}
                  </div>

                  {/* Center Play Button with hover micro-interaction */}
                  <div className="relative z-10 flex flex-col items-center justify-center my-auto group-hover:scale-110 transition-transform">
                    <div className="w-9 h-9 rounded-full bg-[#88D635] text-[#0F2900] flex items-center justify-center shadow-md">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Bottom HUD: Branch & Commit */}
                  <div className="relative z-10 flex items-center justify-between text-[9px] text-zinc-300 font-mono">
                    <span className="bg-black/60 px-1.5 py-0.2 rounded truncate max-w-[110px]">
                      {post.branch}
                    </span>
                    <span className="bg-black/60 px-1.5 py-0.2 rounded">
                      {post.commitHash}
                    </span>
                  </div>
                </div>

                {/* RIGHT: Description & Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between gap-2.5">
                  {/* Header: Author + Timestamp + Milestone + Status Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-[#111827] text-[#88D635] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                        {post.authorInitials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-[#111827]">
                            {post.author}
                          </span>
                          <span className="text-[11px] text-[#6B7280]">
                            ({post.authorRole === "freelancer" ? "Freelancer" : "Client"})
                          </span>
                          <span className="text-[11px] text-[#9CA3AF]">•</span>
                          <span className="text-[11px] font-medium text-[#4B5563] truncate">
                            {post.milestoneTitle}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#9CA3AF]">
                          {post.dateStr} at {post.timeDisplay}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5">
                      {post.isMilestoneAchievement && (
                        <Badge variant="lime" className="text-[9px] py-0.2 hidden sm:inline-flex">
                          🏆 Milestone
                        </Badge>
                      )}
                      <Badge
                        variant={post.status === "verified" ? "lime" : "outline"}
                        className="text-[10px] py-0.2"
                      >
                        {post.status === "verified" ? "✓ Verified Check-in" : "Pending Review"}
                      </Badge>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h5
                      onClick={() => setActiveMediaModal(post)}
                      className="text-sm font-bold text-[#111827] hover:text-[#2D6606] cursor-pointer transition-colors"
                    >
                      {post.title}
                    </h5>
                    <p className="text-xs text-[#4B5563] mt-1 leading-relaxed line-clamp-2">
                      {post.description}
                    </p>
                  </div>

                  {/* Metadata Chips: Branch, Commit, Changes Diff, Hours, Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#1D4ED8] font-mono text-[11px] font-medium border border-blue-200/60">
                      <GitBranch className="w-3 h-3 text-[#2563EB]" />
                      {post.branch}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F8FAFC] text-[#334155] font-mono text-[11px] font-semibold border border-slate-200/80">
                      <GitCommit className="w-3 h-3 text-[#64748B]" />
                      {post.commitHash}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F0FDF4] text-[#15803D] font-mono text-[11px] font-semibold border border-green-200/60">
                      <FileText className="w-3 h-3 text-emerald-600" />
                      {post.commitDiff}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F4F5F7] text-[#374151] font-semibold text-[11px]">
                      <Clock className="w-3 h-3 text-[#6B7280]" />
                      {post.hoursLogged}h Logged
                    </span>
                    {post.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-[#EDE9FE] text-[#6D28D9] font-medium text-[10px] border border-purple-200/50">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Bottom Actions Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#F1F3F6] mt-0.5 gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* View More Button - Directly opens the popup modal */}
                      <Button
                        variant="dark"
                        size="sm"
                        onClick={() => setActiveMediaModal(post)}
                        className="text-xs font-bold gap-1.5 h-7.5 px-3 bg-[#111827] hover:bg-black text-white cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#88D635]" />
                        <span>View More</span>
                      </Button>

                      {role === "business" ? (
                        <Button
                          variant="lime"
                          size="sm"
                          onClick={() => {
                            setCheckIns((prev) =>
                              prev.map((c) => (c.id === post.id ? { ...c, status: "verified" } : c))
                            );
                            showToast(`Deliverable "${post.title}" verified! 72h Watchdog reset.`);
                          }}
                          className="font-bold text-xs h-7.5 px-3"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Acknowledge
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => showToast("Deliverable walkthrough updated with new commit notes!")}
                          className="font-bold text-xs h-7.5 px-3"
                        >
                          <Sparkles className="w-3.5 h-3.5 mr-1 text-[#2D6606]" />
                          Update
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (onOpenChat) onOpenChat();
                          else showToast("Opened comments thread");
                        }}
                        className="text-xs h-7.5 px-2 text-[#4B5563] hover:text-[#111827]"
                      >
                        <MessageSquare className="w-3.5 h-3.5 mr-1" />
                        Comment
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => showToast(`Opened GitHub Diff for commit ${post.commitHash}`)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4B5563] hover:text-[#111827] cursor-pointer"
                      >
                        <span>Git PR Diff</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* ========================================================================= */}
      {/* 7. FULL 16:9 LOOM & CODE INSPECTOR MODAL                                  */}
      {/* ========================================================================= */}
      {activeMediaModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl border border-black/10 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#F1F3F6] flex items-center justify-between bg-[#F8F9FA] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#111827] text-[#88D635] flex items-center justify-center font-bold">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
                    <span>{activeMediaModal.loomTitle}</span>
                    <Badge variant={activeMediaModal.status === "verified" ? "lime" : "outline"} className="text-[10px]">
                      {activeMediaModal.status === "verified" ? "Verified" : "Under Review"}
                    </Badge>
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    Logged by {activeMediaModal.author} • {activeMediaModal.dateStr} at {activeMediaModal.timeDisplay} ({activeMediaModal.hoursLogged}h)
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveMediaModal(null);
                  setIsPlayingLoom(false);
                }}
                className="p-1.5 rounded-lg hover:bg-[#E5E7EB] text-[#6B7280] hover:text-[#111827] cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 overflow-y-auto custom-scrollbar flex-1 flex flex-col gap-4">
              {/* 16:9 Video Canvas */}
              <div className="relative aspect-video rounded-xl bg-black overflow-hidden flex flex-col justify-between p-4 group select-none">
                {/* Simulated Screen Recording Preview */}
                <div className="absolute inset-0 bg-[#0B132B] flex flex-col">
                  {/* Top Bar of Simulated IDE */}
                  <div className="h-8 bg-[#1C2541] flex items-center justify-between px-3 text-xs text-zinc-300 font-mono border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                      <span className="ml-2 font-bold text-white">auth.ts — NextAuth v5 Provider Setup</span>
                    </div>
                    <span className="text-[11px] text-zinc-400">git: {activeMediaModal.commitHash}</span>
                  </div>

                  {/* Code Simulation */}
                  <div className="p-4 font-mono text-xs text-zinc-300 overflow-hidden leading-relaxed">
                    <p className="text-purple-400">import <span className="text-white">NextAuth</span> from <span className="text-emerald-400">&apos;next-auth&apos;</span>;</p>
                    <p className="text-purple-400">import <span className="text-white">Google</span> from <span className="text-emerald-400">&apos;next-auth/providers/google&apos;</span>;</p>
                    <p className="mt-2 text-zinc-500">// Row Level Security Enforced on Postgres Tenant Table</p>
                    <p className="text-blue-400">export const <span className="text-yellow-300">&#123; handlers, auth, signIn, signOut &#125;</span> = <span className="text-white">NextAuth(&#123;</span></p>
                    <p className="pl-4 text-white">providers: [Google],</p>
                    <p className="pl-4 text-white">callbacks: &#123;</p>
                    <p className="pl-8 text-blue-300">async session(&#123; session, token &#125;) &#123;</p>
                    <p className="pl-12 text-emerald-400">session.user.tenantId = token.tenantId;</p>
                    <p className="pl-12 text-emerald-400">session.user.escrowLock = true;</p>
                    <p className="pl-12 text-white">return session;</p>
                    <p className="pl-8 text-blue-300">&#125;</p>
                    <p className="pl-4 text-white">&#125;</p>
                    <p className="text-white">&#125;);</p>
                  </div>
                </div>

                {/* Big Center Play/Pause button if paused */}
                {!isPlayingLoom && (
                  <div
                    onClick={() => setIsPlayingLoom(true)}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer group-hover:bg-black/30 transition-colors"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#88D635] text-[#0A2600] flex items-center justify-center shadow-2xl scale-100 group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 fill-current ml-1" />
                    </div>
                  </div>
                )}

                {/* Video Controls Bar */}
                <div className="mt-auto relative z-10 bg-black/80 backdrop-blur-md rounded-lg p-2.5 flex items-center gap-3 text-white text-xs">
                  <button
                    onClick={() => setIsPlayingLoom(!isPlayingLoom)}
                    className="p-1 hover:text-[#88D635] transition-colors cursor-pointer"
                  >
                    {isPlayingLoom ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>

                  <span className="font-mono text-[11px] text-zinc-300">01:42 / {activeMediaModal.loomDuration}</span>

                  {/* Scrubber */}
                  <div
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      setLoomProgress(Math.round((clickX / rect.width) * 100));
                    }}
                    className="flex-1 h-1.5 bg-white/20 rounded-full cursor-pointer relative overflow-hidden"
                  >
                    <div
                      className="h-full bg-[#88D635] rounded-full transition-all"
                      style={{ width: `${loomProgress}%` }}
                    />
                  </div>

                  <Volume2 className="w-4 h-4 text-zinc-300 cursor-pointer" />
                  <Maximize2 className="w-4 h-4 text-zinc-300 cursor-pointer" />
                </div>
              </div>

              {/* Deliverable Description & Work Scope */}
              <div className="bg-[#FAFBFD] p-3.5 rounded-xl border border-black/[0.06] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#111827]">Deliverable Description & Work Scope</h4>
                  <span className="text-[11px] font-semibold text-[#6B7280]">
                    {activeMediaModal.hoursLogged} Hours Logged
                  </span>
                </div>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  {activeMediaModal.description}
                </p>
                {activeMediaModal.tags && activeMediaModal.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeMediaModal.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded bg-[#EDE9FE] text-[#6D28D9] font-medium text-[10px]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Code Changes & Git Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#FAFBFD] p-3.5 rounded-xl border border-black/[0.06] flex flex-col gap-2">
                  <h4 className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                    <GitCommit className="w-3.5 h-3.5 text-[#0369A1]" />
                    <span>Pull Request & Git Commit Audit</span>
                  </h4>
                  <div className="text-xs font-mono text-[#4B5563] space-y-1">
                    <p><span className="text-[#9CA3AF]">Branch:</span> {activeMediaModal.branch}</p>
                    <p><span className="text-[#9CA3AF]">Commit:</span> {activeMediaModal.commitHash}</p>
                    <p><span className="text-[#9CA3AF]">Diff:</span> {activeMediaModal.commitDiff}</p>
                    <p><span className="text-[#9CA3AF]">Tests:</span> 12 passed (Tenant RLS isolate)</p>
                  </div>
                </div>

                <div className="bg-[#FAFBFD] p-3.5 rounded-xl border border-black/[0.06] flex flex-col gap-2">
                  <h4 className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
                    <span>Watchdog Verification SLA</span>
                  </h4>
                  <div className="text-xs text-[#4B5563] space-y-1">
                    <p>Status: <span className="font-bold text-[#15803D]">Green Zone SLA (Verified)</span></p>
                    <p>Milestone: <span className="font-semibold text-[#111827]">{activeMediaModal.milestoneTitle}</span></p>
                    <p>Audit Trail: Timestamped to FDIC Escrow contract</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#F8F9FA] border-t border-[#F1F3F6] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => showToast(`Link to Loom video copied!`)}
                  className="text-xs"
                >
                  <Share2 className="w-3.5 h-3.5 mr-1" />
                  Copy Loom Link
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => showToast("Exported verified work session certificate (PDF)")}
                  className="text-xs"
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  Export Audit
                </Button>
              </div>

              <div className="flex items-center gap-2">
                {role === "business" && activeMediaModal.status !== "verified" && (
                  <Button
                    variant="lime"
                    size="sm"
                    onClick={() => {
                      setCheckIns((prev) =>
                        prev.map((c) => (c.id === activeMediaModal.id ? { ...c, status: "verified" } : c))
                      );
                      showToast(`Acknowledge deliverable "${activeMediaModal.title}"! Watchdog reset.`);
                      setActiveMediaModal(null);
                    }}
                    className="font-bold text-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Acknowledge Deliverable
                  </Button>
                )}
                <Button
                  variant="dark"
                  size="sm"
                  onClick={() => setActiveMediaModal(null)}
                  className="text-xs"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. MILESTONE ACHIEVEMENT INSPECTOR MODAL                                  */}
      {/* ========================================================================= */}
      {activeAchievementModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-black/10 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-[#111827] via-[#1E293B] to-[#111827] text-white flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#88D635] text-[#0A2600] flex items-center justify-center font-black text-lg shadow-lg">
                  🏆
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">
                      Sprint Milestone Achievement
                    </h3>
                    <span className="text-xs bg-[#88D635]/20 text-[#88D635] border border-[#88D635]/40 px-2 py-0.5 rounded-full font-bold">
                      {formatCurrency(activeAchievementModal.escrowAmount || 1950)} Escrow
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    {activeAchievementModal.milestoneTitle}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveAchievementModal(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto custom-scrollbar flex flex-col gap-4">
              <div>
                <h4 className="text-sm font-bold text-[#111827]">{activeAchievementModal.title}</h4>
                <p className="text-xs text-[#4B5563] mt-1 leading-relaxed">
                  {activeAchievementModal.description}
                </p>
              </div>

              {/* Checklist */}
              <div className="bg-[#FAFBFD] p-3.5 rounded-xl border border-black/[0.06] flex flex-col gap-2">
                <h5 className="text-xs font-bold text-[#111827]">Acceptance Criteria Verified:</h5>
                <div className="space-y-1.5 text-xs text-[#374151]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                    <span>16:9 Loom Screen Walkthrough Demo Attached ({activeAchievementModal.loomDuration})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                    <span>Row-Level Security & Tenant Isolation Tested with 12 Unit Tests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                    <span>Git PR Diff merged into main branch (+142 -12 lines)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                    <span>72h Dead-Man Watchdog in GREEN zone (68h remaining)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#F8F9FA] border-t border-[#F1F3F6] flex items-center justify-between shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveMediaModal(activeAchievementModal);
                  setActiveAchievementModal(null);
                }}
                className="text-xs gap-1.5"
              >
                <Play className="w-3.5 h-3.5 text-[#2D6606]" />
                Watch Loom Walkthrough
              </Button>

              <div className="flex items-center gap-2">
                {role === "business" && onReleaseEscrow && (
                  <Button
                    variant="lime"
                    size="sm"
                    onClick={() => {
                      onReleaseEscrow();
                      setActiveAchievementModal(null);
                    }}
                    className="font-bold text-xs"
                  >
                    <ShieldCheck className="w-4 h-4 mr-1" />
                    Release {formatCurrency(activeAchievementModal.escrowAmount || 1950)} Escrow
                  </Button>
                )}
                <Button
                  variant="dark"
                  size="sm"
                  onClick={() => setActiveAchievementModal(null)}
                  className="text-xs"
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. SUBMIT CHECK-IN MODAL (Freelancer or Client)                           */}
      {/* ========================================================================= */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-black/10 flex flex-col overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-[#F1F3F6] flex items-center justify-between bg-[#F8F9FA] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#111827] text-[#88D635] flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4 text-[#88D635]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#111827]">
                    {role === "business" ? "Log Verified Check-in" : "Record Daily 16:9 Check-in"}
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    Keep the 72h Dead-Man Watchdog active and update milestone progress.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="p-1 rounded-md text-[#9CA3AF] hover:text-[#111827]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCheckIn} className="p-4 sm:p-5 flex flex-col gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Deliverable Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Completed OAuth callback & PostgreSQL tables"
                  value={submitTitle}
                  onChange={(e) => setSubmitTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E5E7EB] focus:border-[#111827] outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Deliverable Walkthrough & Summary
                </label>
                <textarea
                  rows={3}
                  placeholder="Summarize the pull request diff, unit tests, and 16:9 video notes..."
                  value={submitDesc}
                  onChange={(e) => setSubmitDesc(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E5E7EB] focus:border-[#111827] outline-hidden resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">
                    Hours Worked
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={submitHours}
                    onChange={(e) => setSubmitHours(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-[#E5E7EB] outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">
                    Timeline Time Slot
                  </label>
                  <select
                    value={submitTimeSlot}
                    onChange={(e) => setSubmitTimeSlot(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-[#E5E7EB] outline-hidden font-mono"
                  >
                    {activeHours.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    value={submitBranch}
                    onChange={(e) => setSubmitBranch(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-[#E5E7EB] outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">
                    Commit Hash
                  </label>
                  <input
                    type="text"
                    value={submitCommit}
                    onChange={(e) => setSubmitCommit(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-[#E5E7EB] outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-[#FAFBFD] rounded-lg border border-[#E5E7EB]">
                <input
                  type="checkbox"
                  id="milestoneAchievement"
                  checked={isMilestoneCheck}
                  onChange={(e) => setIsMilestoneCheck(e.target.checked)}
                  className="rounded text-[#111827] focus:ring-[#88D635]"
                />
                <label htmlFor="milestoneAchievement" className="text-xs font-bold text-[#111827] cursor-pointer">
                  Tag as Milestone Achievement Goal ($1,950 Escrow Checkpoint)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F3F6]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSubmitModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="lime"
                  size="sm"
                  className="text-xs font-bold"
                >
                  Publish to Stream & Reset SLA
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
