"use client";

import { MilestoneProjectTimeline } from "./milestone-project-timeline";

import * as React from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Lock,
  Play,
  Send,
  FileCheck,
  Building2,
  Wallet,
  ArrowUpRight,
  GitCommit,
  Check,
  LayoutGrid,
  List as ListIcon,
  Calendar as CalendarIcon,
  Plus,
  Search,
  Video,
  MessageSquare,
  Paperclip,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  CalendarDays,
  X,
  AlertCircle,
  AlertTriangle,
  Sparkles,
  Users,
  Filter,
  UserPlus,
  Copy,
  Layers,
  Eye,
  FileText,
  StickyNote,
  Pencil,
  Trash2,
} from "lucide-react";

export function GoogleMeetIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={cn("inline-block shrink-0", className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 7V17L18 21.5V2.5L12 7Z" fill="#00832D"/>
      <path d="M3.5 3.5C2.12 3.5 1 4.62 1 6V18C1 19.38 2.12 20.5 3.5 20.5H12V3.5H3.5Z" fill="#0066DA"/>
      <path d="M18 6.5L22.29 3.21C22.68 2.91 23.25 3.19 23.25 3.68V20.32C23.25 20.81 22.68 21.09 22.29 20.79L18 17.5V6.5Z" fill="#EA4335"/>
      <path d="M12 3.5H18V12L12 7.5V3.5Z" fill="#2684FC"/>
      <path d="M12 16.5L18 20.5V12L12 16.5Z" fill="#00AC47"/>
      <path d="M18 12L23 16V8L18 12Z" fill="#FFBA00"/>
    </svg>
  );
}

export const ALL_HOURS_24 = [
  "12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM",
  "8 AM", "9 AM", "10 AM", "11 AM",
  "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM",
  "8 PM", "9 PM", "10 PM", "11 PM",
];

export const slotToHour = (slot: string): number => {
  const match = slot.match(/(\d+)\s*(AM|PM)/i);
  if (!match) return 8;
  let h = parseInt(match[1], 10);
  const period = match[2].toUpperCase();
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h;
};

export const getLocalIsoDate = (d: Date = new Date()): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const BASE_WEEK_DAYS = [
  { label: "MON 28", dateStr: "2026-09-28", dayIndex: 0 },
  { label: "TUE 29", dateStr: "2026-09-29", dayIndex: 1 },
  { label: "WED 30", dateStr: "2026-09-30", dayIndex: 2 },
  { label: "THU 01", dateStr: "2026-10-01", dayIndex: 3 },
  { label: "FRI 02", dateStr: "2026-10-02", dayIndex: 4 },
  { label: "SAT 03", dateStr: "2026-10-03", dayIndex: 5 },
  { label: "SUN 04", dateStr: "2026-10-04", dayIndex: 6 },
];

export function RealTimeIndicator({
  startHour = 8,
  endHour = 24,
  rowHeight = 110,
  timeColWidth = 75,
  headerOffset = 37,
  todayDayIndex = -1,
  totalDays = 7,
}: {
  startHour?: number;
  endHour?: number;
  rowHeight?: number;
  timeColWidth?: number;
  headerOffset?: number;
  todayDayIndex?: number;
  totalDays?: number;
}) {
  const [now, setNow] = React.useState<Date>(() => new Date());

  React.useEffect(() => {
    const updateTime = () => setNow(new Date());
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const hours = now.getHours();
  const minutes = now.getMinutes();

  // Accurate real device clock time
  const displayTime = now
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(":", ".");

  // If outside visible range, don't show the misplaced line
  if (hours < startHour || hours >= endHour) {
    return null;
  }

  const totalMinutes = (hours - startHour) * 60 + minutes;
  const topPx = headerOffset + (totalMinutes / 60) * rowHeight;

  // Single Day view: spans across the single day lane
  if (todayDayIndex === undefined || todayDayIndex < 0) {
    return (
      <div
        style={{ top: `${topPx}px` }}
        className="absolute left-0 right-0 z-30 pointer-events-none flex items-center transition-all duration-700 ease-out"
      >
        <div style={{ width: `${timeColWidth}px` }} className="text-right pr-2 shrink-0 flex items-center justify-end">
          <span className="text-[10px] font-mono font-bold text-[#7C3AED] bg-[#F5F3FF] px-1.5 py-0.5 rounded border border-[#DDD6FE] shadow-2xs">
            {displayTime}
          </span>
        </div>
        <div className="flex-1 flex items-center relative">
          <div className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] ring-2 ring-white shrink-0 -ml-1 z-10 shadow-xs animate-pulse" />
          <div className="w-full h-[1.5px] bg-[#7C3AED]" />
        </div>
      </div>
    );
  }

  // Week view: precisely highlight TODAY's column
  const colPercent = 100 / totalDays;
  const leftPercent = todayDayIndex * colPercent;

  return (
    <div
      style={{ top: `${topPx}px` }}
      className="absolute left-0 right-0 z-30 pointer-events-none flex items-center transition-all duration-700 ease-out"
    >
      <div style={{ width: `${timeColWidth}px` }} className="text-right pr-2 shrink-0 flex items-center justify-end">
        <span className="text-[10px] font-mono font-bold text-[#7C3AED] bg-[#F5F3FF] px-1.5 py-0.5 rounded border border-[#DDD6FE] shadow-2xs">
          {displayTime}
        </span>
      </div>

      <div className="flex-1 relative h-0">
        <div className="w-full border-b border-dashed border-[#DDD6FE]/40" />

        <div
          style={{
            left: `${leftPercent}%`,
            width: `${colPercent}%`,
          }}
          className="absolute top-[-0.75px] flex items-center"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] ring-2 ring-white shrink-0 -ml-1.5 z-10 shadow-xs animate-pulse" />
          <div className="w-full h-[2px] bg-[#7C3AED] shadow-[0_0_6px_rgba(124,58,237,0.4)]" />
        </div>
      </div>
    </div>
  );
}

export interface MilestoneItem {
  id: string;
  number: number | string;
  title: string;
  description: string;
  amount: number;
  status: "todo" | "in_progress" | "review" | "completed";
  escrowStatus: "funded" | "released" | "pre_funding_required" | "scope_locked";
  escrowLabel: string;
  progress: { completed: number; total: number };
  dueDate: string;
  dateDisplay: string;
  tags: string[];
  assignees: { name: string; initials: string; bg: string }[];
  meets: {
    id: string;
    title: string;
    time: string;
    date: string;
    type: "video" | "sync";
    link: string;
  }[];
  notes: {
    id: string;
    author: string;
    text: string;
    date: string;
  }[];
  deliverables: {
    id: string;
    title: string;
    completed: boolean;
    gitCommit?: string;
  }[];
  watchdogTimer?: string;
  loomUrl?: string;
  prDiff?: string;
  createdBy?: "business" | "freelancer";
}

const INITIAL_MILESTONES: MilestoneItem[] = [
  {
    id: "m1",
    number: 1,
    title: "Database Architecture & Prisma Schema",
    description: "Design 6 PostgreSQL tables, RLS isolation rules, and automated migration pipeline.",
    amount: 1500,
    status: "completed",
    escrowStatus: "released",
    escrowLabel: "Released & Transferred",
    progress: { completed: 4, total: 4 },
    dueDate: "2026-09-25",
    dateDisplay: "Sep 25, 2026",
    tags: ["Backend", "PostgreSQL", "Prisma"],
    createdBy: "business",
    assignees: [
      { name: "Alex Rivera", initials: "AR", bg: "bg-[#88D635] text-[#0A2600]" },
      { name: "Sarah Chen", initials: "SC", bg: "bg-[#111827] text-white" },
    ],
    meets: [
      {
        id: "mt1",
        title: "Database Schema Sign-off Sync",
        time: "02:00 PM - 02:30 PM",
        date: "2026-09-24",
        type: "video",
        link: "https://meet.google.com/schema-signoff",
      },
    ],
    notes: [
      {
        id: "n1",
        author: "Alex Rivera",
        text: "Database migrations executed cleanly on Supabase staging with 100% RLS coverage.",
        date: "Sep 24, 2026",
      },
      {
        id: "n2",
        author: "Sarah Chen",
        text: "Approved schema. Indexing on tenant_uuid and user_sessions looks optimal.",
        date: "Sep 25, 2026",
      },
    ],
    deliverables: [
      { id: "d1", title: "6 PostgreSQL tables designed & indexed (Prisma Schema v1)", completed: true },
      { id: "d2", title: "Row Level Security (RLS) policies tested & verified", completed: true },
      { id: "d3", title: "Seed scripts with faker test dataset for 50 tenants", completed: true },
      { id: "d4", title: "Merged commit 3a992e1 • Branch: feat/prisma-schema", completed: true, gitCommit: "3a992e1" },
    ],
  },
  {
    id: "m2",
    number: 2,
    title: "Core UI Components & NextAuth OAuth",
    description: "Google & GitHub authentication providers, session cookies, and responsive dashboard layout.",
    amount: 1500,
    status: "review",
    escrowStatus: "funded",
    escrowLabel: "72h Review Active",
    watchdogTimer: "66h 24m remaining",
    progress: { completed: 3, total: 4 },
    dueDate: "2026-09-30",
    dateDisplay: "Sep 30, 2026",
    tags: ["Frontend", "NextAuth", "Figma Spec"],
    createdBy: "freelancer",
    assignees: [
      { name: "Alex Rivera", initials: "AR", bg: "bg-[#88D635] text-[#0A2600]" },
      { name: "Sarah Chen", initials: "SC", bg: "bg-[#111827] text-white" },
    ],
    meets: [
      {
        id: "mt2",
        title: "Milestone 2 Acceptance & Demo Call",
        time: "09:00 AM - 10:30 AM",
        date: "2026-09-29",
        type: "video",
        link: "https://meet.google.com/demo-review-m2",
      },
    ],
    notes: [
      {
        id: "n3",
        author: "Alex Rivera",
        text: "Recorded 04:18 Loom walkthrough demonstrating OAuth token exchange & JWT rotation.",
        date: "Sep 28, 2026",
      },
      {
        id: "n4",
        author: "Sarah Chen",
        text: "Checking staging environment right now. Mobile viewport navbar behavior looks crisp.",
        date: "Sep 29, 2026",
      },
    ],
    deliverables: [
      { id: "d5", title: "Google & GitHub OAuth provider integration with callback routers", completed: true },
      { id: "d6", title: "Dashboard layout matching Figma spec (pixel-perfect)", completed: true },
      { id: "d7", title: "12/12 unit tests passing for tenant session isolation", completed: true },
      { id: "d8", title: "PR #42 diff reviewed on branch: feat/oauth-providers", completed: true, gitCommit: "8c3f20a" },
    ],
    loomUrl: "https://www.loom.com/share/demo-42",
    prDiff: "https://github.com/techventures/mvp/pull/42",
  },
  {
    id: "m3",
    number: "CO #1",
    title: "Change Order #1: Stripe Billing Portal",
    description: "Added scope: Customer self-serve billing portal with automated webhook retry handlers.",
    amount: 450,
    status: "in_progress",
    escrowStatus: "funded",
    escrowLabel: "Funded in Escrow",
    progress: { completed: 1, total: 3 },
    dueDate: "2026-10-05",
    dateDisplay: "Oct 05, 2026",
    tags: ["Payments", "Stripe", "Change Order"],
    createdBy: "business",
    assignees: [
      { name: "Alex Rivera", initials: "AR", bg: "bg-[#88D635] text-[#0A2600]" },
    ],
    meets: [
      {
        id: "mt3",
        title: "Stripe Webhook Architecture Sync",
        time: "11:00 AM - 12:00 PM",
        date: "2026-10-02",
        type: "video",
        link: "https://meet.google.com/stripe-sync-co1",
      },
    ],
    notes: [
      {
        id: "n5",
        author: "Sarah Chen",
        text: "Client request: Ensure webhook handles customer.subscription.deleted with grace period.",
        date: "Sep 27, 2026",
      },
      {
        id: "n6",
        author: "Alex Rivera",
        text: "Implementing stripe-event-signature verification with HMAC SHA-256 caching.",
        date: "Sep 29, 2026",
      },
    ],
    deliverables: [
      { id: "d9", title: "Stripe webhook endpoint with idempotency keys & retry queue", completed: true },
      { id: "d10", title: "Customer portal redirect with authenticated session token", completed: false },
      { id: "d11", title: "Invoice download & receipt PDF generation service", completed: false },
    ],
  },
  {
    id: "m4",
    number: 3,
    title: "Production Deployment & Vercel Launch",
    description: "Zero-downtime database migration, DNS domain SSL routing, and Sentry exception telemetry.",
    amount: 1500,
    status: "todo",
    escrowStatus: "pre_funding_required",
    escrowLabel: "Pre-Funding Required",
    progress: { completed: 0, total: 4 },
    dueDate: "2026-10-12",
    dateDisplay: "Oct 12, 2026",
    tags: ["DevOps", "Vercel", "Scope Firewall"],
    createdBy: "business",
    assignees: [
      { name: "Alex Rivera", initials: "AR", bg: "bg-[#88D635] text-[#0A2600]" },
      { name: "Sarah Chen", initials: "SC", bg: "bg-[#111827] text-white" },
    ],
    meets: [],
    notes: [
      {
        id: "n7",
        author: "Alex Rivera",
        text: "Scope Firewall Policy: Work begins immediately once client deposits Milestone 3 escrow.",
        date: "Sep 28, 2026",
      },
    ],
    deliverables: [
      { id: "d12", title: "Production database cluster provisioning on Supabase", completed: false },
      { id: "d13", title: "Custom apex domain setup with SSL and Cloudflare CDN proxy", completed: false },
      { id: "d14", title: "Sentry performance & error tracking monitoring hooks", completed: false },
      { id: "d15", title: "Automated smoke tests executing against production URL", completed: false },
    ],
  },
  {
    id: "m5",
    number: 4,
    title: "Master IP Assignment & Repository Sign-off",
    description: "Execute legal intellectual property transfer deed and hand over master GitHub organization access.",
    amount: 0,
    status: "todo",
    escrowStatus: "scope_locked",
    escrowLabel: "Scope Locked",
    progress: { completed: 0, total: 2 },
    dueDate: "2026-10-20",
    dateDisplay: "Oct 20, 2026",
    tags: ["Legal", "IP Transfer", "W-8BEN"],
    createdBy: "freelancer",
    assignees: [
      { name: "Sarah Chen", initials: "SC", bg: "bg-[#111827] text-white" },
    ],
    meets: [],
    notes: [
      {
        id: "n8",
        author: "System",
        text: "Cryptographic IP deed automatically unlocks upon client acceptance of all previous milestones.",
        date: "Sep 20, 2026",
      },
    ],
    deliverables: [
      { id: "d16", title: "Cryptographically signed Master Intellectual Property Transfer Deed", completed: false },
      { id: "d17", title: "Full administrative transfer of GitHub organization & API secrets", completed: false },
    ],
  },
];

export interface CalendarScheduleItem {
  id: string;
  dayIndex: number; // 0=MON, 1=TUE, 2=WED, 3=THU, 4=FRI, 5=SAT, 6=SUN
  dayLabel: string;
  dateStr: string; // e.g. "2026-09-28"
  timeSlot: string; // "8 AM", "9 AM", "10 AM", "11 AM", "12 AM", "1 PM"
  timeDisplay: string;
  title: string;
  category: "events" | "meetings" | "tasks";
  colorTheme: "purple" | "blue" | "mint" | "violet";
  meetUrl?: string;
  attendees?: string[];
  description?: string;
  createdBy?: "business" | "freelancer";
}

const WEEK_HOURLY_EVENTS: CalendarScheduleItem[] = [
  // Monday 28 Sep
  {
    id: "we1",
    dayIndex: 0,
    dayLabel: "MON 28",
    dateStr: "2026-09-28",
    timeSlot: "8 AM",
    timeDisplay: "8 AM - 9 AM",
    title: "Client Presentation Preparation",
    category: "tasks",
    colorTheme: "purple",
    description: "Prepare Figma walkthrough and PRD acceptance documentation.",
    createdBy: "freelancer",
  },
  {
    id: "we2",
    dayIndex: 0,
    dayLabel: "MON 28",
    dateStr: "2026-09-28",
    timeSlot: "9 AM",
    timeDisplay: "9 AM - 10:30 AM",
    title: "Client Meeting Planning",
    category: "meetings",
    colorTheme: "blue",
    meetUrl: "https://meet.google.com/client-planning",
    attendees: ["Alex Rivera", "Sarah Chen"],
    description: "Align on deliverable acceptance criteria for Milestone 2.",
    createdBy: "business",
  },
  {
    id: "we3",
    dayIndex: 0,
    dayLabel: "MON 28",
    dateStr: "2026-09-28",
    timeSlot: "11 AM",
    timeDisplay: "11 AM - 12 PM",
    title: "Meetup with UI8 internal Team",
    category: "meetings",
    colorTheme: "mint",
    meetUrl: "https://meet.google.com/ui8-sync",
    attendees: ["Alex Rivera", "UI8 Design Lead"],
    createdBy: "freelancer",
  },

  // Tuesday 29 Sep (Today)
  {
    id: "we4",
    dayIndex: 1,
    dayLabel: "TUE 29",
    dateStr: "2026-09-29",
    timeSlot: "9 AM",
    timeDisplay: "9 AM - 10 AM",
    title: "Design Revisions (Milestone 2)",
    category: "tasks",
    colorTheme: "violet",
    description: "Review responsive viewport navigation drawer and cookie consent banner.",
    createdBy: "freelancer",
  },
  {
    id: "we5",
    dayIndex: 1,
    dayLabel: "TUE 29",
    dateStr: "2026-09-29",
    timeSlot: "11 AM",
    timeDisplay: "11 AM - 12:30 PM",
    title: "Client Feedback Meeting",
    category: "meetings",
    colorTheme: "blue",
    meetUrl: "https://meet.google.com/client-feedback-m2",
    attendees: ["Sarah Chen", "Alex Rivera", "Marcus Vance"],
    description: "Discuss 72h Dead-Man Watchdog review checklist and staging testing.",
    createdBy: "business",
  },

  // Wednesday 30 Sep
  {
    id: "we6",
    dayIndex: 2,
    dayLabel: "WED 30",
    dateStr: "2026-09-30",
    timeSlot: "8 AM",
    timeDisplay: "8 AM - 9 AM",
    title: "New Project Kickoff Meeting",
    category: "meetings",
    colorTheme: "blue",
    meetUrl: "https://meet.google.com/kickoff-stripe",
    attendees: ["Alex Rivera", "Sarah Chen"],
    createdBy: "business",
  },
  {
    id: "we7",
    dayIndex: 2,
    dayLabel: "WED 30",
    dateStr: "2026-09-30",
    timeSlot: "10 AM",
    timeDisplay: "10 AM - 11 AM",
    title: "Collaboration with Development Team",
    category: "meetings",
    colorTheme: "purple",
    meetUrl: "https://meet.google.com/dev-collab",
    attendees: ["Alex Rivera", "Stripe Engineer"],
    createdBy: "freelancer",
  },
  {
    id: "we8",
    dayIndex: 2,
    dayLabel: "WED 30",
    dateStr: "2026-09-30",
    timeSlot: "12 PM",
    timeDisplay: "12 PM - 1 PM",
    title: "Meetup with Gojek internal team",
    category: "meetings",
    colorTheme: "mint",
    meetUrl: "https://meet.google.com/gojek-review",
    createdBy: "freelancer",
  },

  // Thursday 01 Oct
  {
    id: "we9",
    dayIndex: 3,
    dayLabel: "THU 01",
    dateStr: "2026-10-01",
    timeSlot: "9 AM",
    timeDisplay: "9 AM - 10 AM",
    title: "Design Refinement",
    category: "tasks",
    colorTheme: "violet",
    description: "Polishing Stripe webhook event handlers and error states.",
    createdBy: "freelancer",
  },
  {
    id: "we10",
    dayIndex: 3,
    dayLabel: "THU 01",
    dateStr: "2026-10-01",
    timeSlot: "12 PM",
    timeDisplay: "12 PM - 1:30 PM",
    title: "Client Meeting Progress report",
    category: "meetings",
    colorTheme: "blue",
    meetUrl: "https://meet.google.com/progress-report",
    attendees: ["Sarah Chen", "Alex Rivera"],
    createdBy: "business",
  },

  // Friday 02 Oct
  {
    id: "we11",
    dayIndex: 4,
    dayLabel: "FRI 02",
    dateStr: "2026-10-02",
    timeSlot: "8 AM",
    timeDisplay: "8:30 AM - 10 AM",
    title: "Design Team Stand-up Meeting",
    category: "meetings",
    colorTheme: "blue",
    meetUrl: "https://meet.google.com/team-standup",
    createdBy: "business",
  },
  {
    id: "we12",
    dayIndex: 4,
    dayLabel: "FRI 02",
    dateStr: "2026-10-02",
    timeSlot: "9 AM",
    timeDisplay: "9 AM - 10 AM",
    title: "Final Touches on Client Project",
    category: "tasks",
    colorTheme: "purple",
    createdBy: "freelancer",
  },
  {
    id: "we13",
    dayIndex: 4,
    dayLabel: "FRI 02",
    dateStr: "2026-10-02",
    timeSlot: "11 AM",
    timeDisplay: "11 AM - 12 PM",
    title: "Industry Webinar / Workshop",
    category: "meetings",
    colorTheme: "mint",
    createdBy: "freelancer",
  },

  // Saturday 03 Oct
  {
    id: "we14",
    dayIndex: 5,
    dayLabel: "SAT 03",
    dateStr: "2026-10-03",
    timeSlot: "9 AM",
    timeDisplay: "9 AM - 10 AM",
    title: "Planning & Goal Setting for the Week",
    category: "tasks",
    colorTheme: "purple",
    createdBy: "freelancer",
  },

  // Sunday 04 Oct
  {
    id: "we15",
    dayIndex: 6,
    dayLabel: "SUN 04",
    dateStr: "2026-10-04",
    timeSlot: "10 AM",
    timeDisplay: "10 AM - 11 AM",
    title: "Meetup with Adobe internal team",
    category: "meetings",
    colorTheme: "mint",
    createdBy: "freelancer",
  },
];

export interface MilestoneEscrowRoomProps {
  role: "business" | "freelancer";
  onReleaseEscrow: () => void;
  onFundEscrow: () => void;
  onBackToDashboard: () => void;
  showToast: (msg: string) => void;
  className?: string;
}

export function MilestoneEscrowRoom({
  role,
  onReleaseEscrow,
  onFundEscrow,
  onBackToDashboard,
  showToast,
  className,
}: MilestoneEscrowRoomProps) {
  const isClient = role === "business";

  // Navigation & View Mode
  const [viewMode, setViewMode] = React.useState<"board" | "list" | "calendar" | "timeline">("board");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "todo" | "in_progress" | "review" | "completed">("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Drag and drop state for Kanban
  const [draggedMilestoneId, setDraggedMilestoneId] = React.useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = React.useState<string | null>(null);

  // Today's accurate ISO date & dayIndex from device system clock (no UTC offset bug)
  const todayIso = React.useMemo(() => getLocalIsoDate(new Date()), []);
  const todayDayIndex = React.useMemo(() => {
    const idx = BASE_WEEK_DAYS.findIndex((d) => d.dateStr === todayIso);
    return idx >= 0 ? idx : 2; // Defaults to Wednesday (Sep 30) if within active sprint
  }, [todayIso]);

  // Calendar state (Reference Image 2)
  const [calendarTab, setCalendarTab] = React.useState<"all" | "events" | "meetings" | "tasks">("all");
  const [calendarSpan, setCalendarSpan] = React.useState<"day" | "week" | "month">("week");
  const [calendarSearch, setCalendarSearch] = React.useState("");
  const [selectedDayIndex, setSelectedDayIndex] = React.useState<number>(todayDayIndex);
  const [showAllHours, setShowAllHours] = React.useState(false);

  // Dynamic weekDayHeaders using accurate todayIso
  const weekDayHeaders = React.useMemo(() => {
    return BASE_WEEK_DAYS.map((dh) => ({
      ...dh,
      isToday: dh.dateStr === todayIso,
    }));
  }, [todayIso]);

  // Scroll refs for week + day grid auto-scroll
  const weekScrollRef = React.useRef<HTMLDivElement>(null);
  const dayScrollRef = React.useRef<HTMLDivElement>(null);

  // Milestone Data
  const [milestones, setMilestones] = React.useState<MilestoneItem[]>(INITIAL_MILESTONES);
  const [selectedMilestone, setSelectedMilestone] = React.useState<MilestoneItem | null>(null);

  // Dynamic week schedule events state
  const [weekEvents, setWeekEvents] = React.useState<CalendarScheduleItem[]>(WEEK_HOURLY_EVENTS);

  // Active Meet Viewer Modal
  const [activeMeetModal, setActiveMeetModal] = React.useState<CalendarScheduleItem | null>(null);

  // Modal state for adding Note or Meet
  const [showAddNoteModal, setShowAddNoteModal] = React.useState(false);
  const [targetMilestoneId, setTargetMilestoneId] = React.useState<string>("m2");
  const [noteType, setNoteType] = React.useState<"note" | "meet">("note");
  const [noteTitle, setNoteTitle] = React.useState("");
  const [noteDate, setNoteDate] = React.useState("2026-09-30");
  const [noteTime, setNoteTime] = React.useState("03:00 PM");

  // Meeting Editing & Rescheduling CRUD states
  const [isEditingMeet, setIsEditingMeet] = React.useState(false);
  const [isReschedulingMeet, setIsReschedulingMeet] = React.useState(false);
  const [editMeetTitle, setEditMeetTitle] = React.useState("");
  const [editMeetDesc, setEditMeetDesc] = React.useState("");
  const [editMeetUrl, setEditMeetUrl] = React.useState("");
  const [rescheduleDayIndex, setRescheduleDayIndex] = React.useState<number>(1);
  const [rescheduleSlot, setRescheduleSlot] = React.useState("9 AM");

  // PMS Backlog Item Modal State
  const [showAddBacklogModal, setShowAddBacklogModal] = React.useState(false);
  const [backlogTitle, setBacklogTitle] = React.useState("");
  const [backlogDesc, setBacklogDesc] = React.useState("");
  const [backlogAmount, setBacklogAmount] = React.useState("800");
  const [backlogTags, setBacklogTags] = React.useState("Backend, Stripe");
  const [backlogDueDate, setBacklogDueDate] = React.useState("2026-10-25");

  // Open inspector with fresh prefilled fields
  const openMeetInspector = (ev: CalendarScheduleItem) => {
    setActiveMeetModal(ev);
    setEditMeetTitle(ev.title);
    setEditMeetDesc(ev.description || "");
    setEditMeetUrl(ev.meetUrl || "");
    setRescheduleDayIndex(ev.dayIndex);
    setRescheduleSlot(ev.timeSlot);
    setIsEditingMeet(false);
    setIsReschedulingMeet(false);
  };

  // Meeting CRUD: Save Edits
  const handleSaveMeetEdit = () => {
    if (!activeMeetModal) return;
    const updated: CalendarScheduleItem = {
      ...activeMeetModal,
      title: editMeetTitle.trim() || activeMeetModal.title,
      description: editMeetDesc.trim(),
      meetUrl: editMeetUrl.trim() || activeMeetModal.meetUrl,
    };
    setWeekEvents((prev) => prev.map((ev) => (ev.id === activeMeetModal.id ? updated : ev)));
    setActiveMeetModal(updated);
    setIsEditingMeet(false);
    showToast("Meeting details updated successfully!");
  };

  // Meeting CRUD: Reschedule Slot & Date
  const handleSaveReschedule = () => {
    if (!activeMeetModal) return;
    const targetHeader = weekDayHeaders[rescheduleDayIndex] || weekDayHeaders[1];
    const updated: CalendarScheduleItem = {
      ...activeMeetModal,
      dayIndex: rescheduleDayIndex,
      dayLabel: targetHeader.label,
      dateStr: targetHeader.dateStr,
      timeSlot: rescheduleSlot,
      timeDisplay: `${rescheduleSlot} - ${rescheduleSlot.includes("AM") ? ((parseInt(rescheduleSlot) % 12) + 1) + " AM" : ((parseInt(rescheduleSlot) % 12) + 1) + " PM"}`,
    };
    setWeekEvents((prev) => prev.map((ev) => (ev.id === activeMeetModal.id ? updated : ev)));
    setActiveMeetModal(updated);
    setIsReschedulingMeet(false);
    showToast(`Rescheduled to ${targetHeader.label} at ${rescheduleSlot}!`);
  };

  // Meeting CRUD: Delete / Cancel
  const handleDeleteMeeting = () => {
    if (!activeMeetModal) return;
    const title = activeMeetModal.title;
    setWeekEvents((prev) => prev.filter((ev) => ev.id !== activeMeetModal.id));
    setActiveMeetModal(null);
    showToast(`Cancelled and deleted meeting "${title}"`);
  };

  // Backlog CRUD: Add Deliverable to PMS Backlog
  const handleCreateBacklogItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!backlogTitle.trim()) return;
    const newId = `m-backlog-${Date.now()}`;
    const newMilestone: MilestoneItem = {
      id: newId,
      number: `B${milestones.length + 1}`,
      title: backlogTitle.trim(),
      description: backlogDesc.trim() || "Item queued in PMS backlog pending escrow funding.",
      amount: Number(backlogAmount) || 800,
      status: "todo",
      escrowStatus: "scope_locked",
      escrowLabel: "Backlog • Scope Locked",
      progress: { completed: 0, total: 2 },
      dueDate: backlogDueDate || "2026-10-25",
      dateDisplay: "Oct 25, 2026",
      tags: backlogTags.split(",").map((t) => t.trim()).filter(Boolean),
      assignees: [
        role === "business"
          ? { name: "Sarah Chen", initials: "SC", bg: "bg-[#111827] text-white" }
          : { name: "Alex Rivera", initials: "AR", bg: "bg-[#88D635] text-[#0A2600]" },
      ],
      meets: [],
      notes: [
        {
          id: `nb-${Date.now()}`,
          author: role === "business" ? "Sarah Chen (Client)" : "Alex Rivera (Freelancer)",
          text: `Added to PMS backlog by ${role === "business" ? "Client" : "Freelancer"}.`,
          date: "Sep 29, 2026",
        },
      ],
      deliverables: [
        { id: `db-${Date.now()}-1`, title: "Architecture & schema acceptance spec", completed: false },
        { id: `db-${Date.now()}-2`, title: "Implementation, testing & code review", completed: false },
      ],
      createdBy: role,
    };
    setMilestones((prev) => [...prev, newMilestone]);
    setShowAddBacklogModal(false);
    setBacklogTitle("");
    setBacklogDesc("");
    showToast(`Added "${newMilestone.title}" to Backlog!`);
  };

  // Backlog CRUD: Delete Milestone
  const handleDeleteBacklogMilestone = (milestoneId: string) => {
    const target = milestones.find((m) => m.id === milestoneId);
    if (!target) return;
    if (target.createdBy && target.createdBy !== role) {
      showToast("Cannot delete: This item was created by the counterparty.");
      return;
    }
    setMilestones((prev) => prev.filter((m) => m.id !== milestoneId));
    setSelectedMilestone(null);
    showToast(`Removed "${target.title}" from Backlog.`);
  };

  // Filtered milestones
  const filteredMilestones = React.useMemo(() => {
    return milestones.filter((item) => {
      const matchesStatus =
        statusFilter === "all" ? true : item.status === statusFilter;
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.notes.some((n) => n.text.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesSearch;
    });
  }, [milestones, statusFilter, searchQuery]);

  // Filtered week schedule events
  const filteredWeekEvents = React.useMemo(() => {
    return weekEvents.filter((ev) => {
      const matchesCat = calendarTab === "all" || ev.category === calendarTab;
      const matchesSearch =
        calendarSearch.trim() === "" ||
        ev.title.toLowerCase().includes(calendarSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [weekEvents, calendarTab, calendarSearch]);

  // Earliest hour in week view (based on the highest card / earliest scheduled event)
  const weekEarliestHour = React.useMemo(() => {
    const hours = filteredWeekEvents
      .map((ev) => slotToHour(ev.timeSlot))
      .filter((h) => !isNaN(h));
    if (hours.length === 0) return 8;
    return Math.min(...hours);
  }, [filteredWeekEvents]);

  // Earliest hour in day view for the selected day
  const dayEarliestHour = React.useMemo(() => {
    const dayEvents = filteredWeekEvents.filter((ev) => ev.dayIndex === selectedDayIndex);
    const hours = dayEvents
      .map((ev) => slotToHour(ev.timeSlot))
      .filter((h) => !isNaN(h));
    if (hours.length === 0) return 8;
    return Math.min(...hours);
  }, [filteredWeekEvents, selectedDayIndex]);

  // Active start hour: in day view use day's earliest, in week view use week's earliest
  const activeStartHour = calendarSpan === "day" ? dayEarliestHour : weekEarliestHour;

  // Dynamic time rows: When showAllHours is false, start directly from the highest card's hour!
  // All subsequent hours follow naturally ("after 8 only to top and also then after can you make sure the time gets back in there")
  const timeRows = React.useMemo(() => {
    if (showAllHours) {
      return ALL_HOURS_24;
    }
    return ALL_HOURS_24.slice(activeStartHour);
  }, [showAllHours, activeStartHour]);

  // Auto-scroll logic: ensures earliest card is visible and focused at the top
  React.useEffect(() => {
    const ROW_HEIGHT_WEEK = 110;
    const ROW_HEIGHT_DAY = 100;
    const HEADER_OFFSET = 65;

    // When showAllHours is false, the top row is already activeStartHour (scrollTop = 0).
    // When showAllHours is true, scroll so activeStartHour is right at the top!
    const targetHour = showAllHours ? activeStartHour : 0;

    const scrollTo = (
      ref: React.RefObject<HTMLDivElement | null>,
      hour: number,
      rowHeight: number,
      offset: number
    ) => {
      if (ref.current) {
        ref.current.scrollTo({
          top: hour === 0 ? 0 : offset + hour * rowHeight,
          behavior: "smooth",
        });
      }
    };

    if (calendarSpan === "week") {
      requestAnimationFrame(() => scrollTo(weekScrollRef, targetHour, ROW_HEIGHT_WEEK, HEADER_OFFSET));
    } else if (calendarSpan === "day") {
      requestAnimationFrame(() => scrollTo(dayScrollRef, targetHour, ROW_HEIGHT_DAY, 28));
    }
  }, [calendarSpan, selectedDayIndex, showAllHours, activeStartHour]);

  // Handle Drag-and-Drop Drop Handler
  const handleDropMilestone = (milestoneId: string, newStatus: MilestoneItem["status"]) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id !== milestoneId) return m;

        let newEscrowStatus = m.escrowStatus;
        let newEscrowLabel = m.escrowLabel;

        if (newStatus === "review") {
          newEscrowStatus = "funded";
          newEscrowLabel = "72h Review Active";
        } else if (newStatus === "completed") {
          newEscrowStatus = "released";
          newEscrowLabel = "Released & Transferred";
        } else if (newStatus === "in_progress") {
          newEscrowStatus = "funded";
          newEscrowLabel = "In Progress";
        } else if (newStatus === "todo") {
          newEscrowLabel = "Scope Locked";
        }

        return {
          ...m,
          status: newStatus,
          escrowStatus: newEscrowStatus,
          escrowLabel: newEscrowLabel,
        };
      })
    );

    const statusLabels: Record<MilestoneItem["status"], string> = {
      todo: "To Do / Scope Locked",
      in_progress: "In Progress",
      review: "In Review (72h SLA)",
      completed: "Released & IP Transferred",
    };

    showToast(`Moved milestone to "${statusLabels[newStatus]}"!`);
    setDraggedMilestoneId(null);
    setDragOverCol(null);
  };

  // Handle adding new Note or Meet
  const handleSaveNoteOrMeet = () => {
    if (!noteTitle.trim()) {
      showToast("Please enter a title or note text.");
      return;
    }

    // Resolve day index safely against weekDayHeaders by dateStr
    const targetIdx = weekDayHeaders.findIndex((dh) => dh.dateStr === noteDate);
    const safeDayIdx = targetIdx >= 0 ? targetIdx : selectedDayIndex;
    const headerLabel = weekDayHeaders[safeDayIdx]?.label || "WED 30";

    let slot = "9 AM";
    if (noteTime.includes(":")) {
      const parts = noteTime.split(":");
      const hr = parseInt(parts[0], 10);
      const ampm = noteTime.toLowerCase().includes("pm") ? "PM" : "AM";
      const formattedHr = hr > 12 ? hr - 12 : hr === 0 ? 12 : hr;
      slot = `${formattedHr} ${ampm}`;
    } else if (noteTime.includes("AM") || noteTime.includes("PM")) {
      slot = noteTime;
    }

    if (noteType === "meet") {
      setWeekEvents((prev) => [
        ...prev,
        {
          id: `we-${Date.now()}`,
          dayIndex: safeDayIdx,
          dayLabel: headerLabel,
          dateStr: noteDate,
          timeSlot: slot,
          timeDisplay: noteTime,
          title: noteTitle,
          category: "meetings",
          colorTheme: "blue",
          meetUrl: "https://meet.google.com/freelance-itch-sync",
          attendees: isClient ? ["Sarah Chen (Client)"] : ["Alex Rivera (Builder)"],
          description: `Scheduled meeting for Milestone sync on ${noteDate}`,
          createdBy: role,
        },
      ]);
    } else {
      setWeekEvents((prev) => [
        ...prev,
        {
          id: `we-note-${Date.now()}`,
          dayIndex: safeDayIdx,
          dayLabel: headerLabel,
          dateStr: noteDate,
          timeSlot: slot,
          timeDisplay: noteTime || slot,
          title: noteTitle.length > 36 ? noteTitle.substring(0, 36) + "..." : noteTitle,
          category: "tasks",
          colorTheme: "purple",
          attendees: [isClient ? "Sarah Chen" : "Alex Rivera"],
          description: noteTitle,
          createdBy: role,
        },
      ]);
    }

    // Switch to that day if in day view so the user immediately sees the added card
    setSelectedDayIndex(safeDayIdx);

    setMilestones((prev) =>
      prev.map((item) => {
        if (item.id !== targetMilestoneId) return item;

        if (noteType === "meet") {
          const newMeet = {
            id: `mt-${Date.now()}`,
            title: noteTitle,
            time: noteTime,
            date: noteDate,
            type: "video" as const,
            link: "https://meet.google.com/freelance-itch-sync",
          };
          return {
            ...item,
            meets: [...item.meets, newMeet],
          };
        } else {
          const newNote = {
            id: `nt-${Date.now()}`,
            author: isClient ? "Sarah Chen (Client)" : "Alex Rivera (Builder)",
            text: noteTitle,
            date: noteDate,
          };
          return {
            ...item,
            notes: [...item.notes, newNote],
          };
        }
      })
    );

    showToast(
      noteType === "meet"
        ? `Scheduled meet "${noteTitle}" on ${noteDate} at ${noteTime}!`
        : `Added new note to milestone!`
    );

    setNoteTitle("");
    setShowAddNoteModal(false);
  };

  // Calendar dates generation (September / October 2026 active cycle)
  const calendarDays = React.useMemo(() => {
    const days = [];
    const startDate = new Date(2026, 8, 27);
    for (let i = 0; i < 35; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const iso = getLocalIsoDate(d);
      const isCurrentMonth = d.getMonth() === 8 || d.getMonth() === 9;
      const isToday = iso === todayIso;

      const dayMilestones = milestones.filter((m) => m.dueDate === iso);
      const dayMeets: { meet: MilestoneItem["meets"][0]; milestone: MilestoneItem }[] = [];
      const dayNotes: { note: MilestoneItem["notes"][0]; milestone: MilestoneItem }[] = [];

      milestones.forEach((m) => {
        m.meets.forEach((mt) => {
          if (mt.date === iso) dayMeets.push({ meet: mt, milestone: m });
        });
        m.notes.forEach((nt) => {
          if (nt.date === iso || nt.date.includes(iso)) {
            dayNotes.push({ note: nt, milestone: m });
          } else {
            const ntLower = nt.date.toLowerCase();
            const monthShort = d.toLocaleString("default", { month: "short" }).toLowerCase();
            const dayNum = String(d.getDate()).padStart(2, "0");
            const dayNumShort = String(d.getDate());
            if (ntLower.includes(monthShort) && (ntLower.includes(dayNum) || ntLower.includes(` ${dayNumShort}`) || ntLower.includes(`-${dayNumShort}`))) {
              dayNotes.push({ note: nt, milestone: m });
            }
          }
        });
      });

      days.push({
        date: d,
        iso,
        dayNum: d.getDate(),
        monthName: d.toLocaleString("default", { month: "short" }),
        isCurrentMonth,
        isToday,
        milestones: dayMilestones,
        meets: dayMeets,
        notes: dayNotes,
      });
    }
    return days;
  }, [milestones, todayIso]);

  // Helper for tag color styling
  const getTagBadgeStyle = (tag: string) => {
    const lower = tag.toLowerCase();
    if (lower.includes("backend") || lower.includes("sql") || lower.includes("prisma")) {
      return "bg-blue-50 text-blue-700 border-blue-200/80";
    }
    if (lower.includes("frontend") || lower.includes("next") || lower.includes("figma")) {
      return "bg-purple-50 text-purple-700 border-purple-200/80";
    }
    if (lower.includes("payment") || lower.includes("stripe")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
    }
    if (lower.includes("devops") || lower.includes("vercel") || lower.includes("firewall")) {
      return "bg-amber-50 text-amber-700 border-amber-200/80";
    }
    if (lower.includes("legal") || lower.includes("ip")) {
      return "bg-slate-100 text-slate-700 border-slate-200/80";
    }
    return "bg-gray-100 text-gray-700 border-gray-200/80";
  };

  return (
    <div className={cn("w-full min-w-0 flex flex-col gap-3.5 flex-1 min-h-0 overflow-hidden", className)}>
      {/* ========================================================================= */}
      {/* 1. UNIFIED TOOLBAR & VIEW CONTROLS (Pinned, Non-Scrollable Toolbar)       */}
      {/* ========================================================================= */}
      <div className="w-full bg-white p-3.5 sm:p-4 rounded-xl border border-black/[0.06] shadow-[0px_2px_10px_rgba(0,0,0,0.04)] flex flex-col gap-3 shrink-0">
        {/* Top Row: Title, Mode Tabs, and Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold tracking-tight text-[#111827] flex items-center gap-2">
              <span>{viewMode === "calendar" ? "Delivery & Meeting Calendar" : viewMode === "timeline" ? "Milestones Project Roadmap & Timeline" : "Milestones & Escrow Delivery"}</span>
              <Badge variant="lime" className="text-[11px] rounded-md py-0.5 font-bold">
                Sprint Active
              </Badge>
            </h2>
          </div>

          {/* View Switcher Tabs: Board | List | Calendar */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#F4F5F7] p-1 rounded-lg text-xs font-semibold text-[#6B7280]">
              <button
                onClick={() => setViewMode("board")}
                className={cn(
                  "flex items-center gap-1.5 py-1.5 px-3 rounded-md transition-all cursor-pointer whitespace-nowrap",
                  viewMode === "board"
                    ? "bg-white text-[#111827] shadow-xs font-bold"
                    : "hover:text-[#111827]"
                )}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Board View</span>
              </button>

              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "flex items-center gap-1.5 py-1.5 px-3 rounded-md transition-all cursor-pointer whitespace-nowrap",
                  viewMode === "list"
                    ? "bg-white text-[#111827] shadow-xs font-bold"
                    : "hover:text-[#111827]"
                )}
              >
                <ListIcon className="w-3.5 h-3.5" />
                <span>List View</span>
              </button>

              <button
                onClick={() => setViewMode("calendar")}
                className={cn(
                  "flex items-center gap-1.5 py-1.5 px-3 rounded-md transition-all cursor-pointer whitespace-nowrap",
                  viewMode === "calendar"
                    ? "bg-white text-[#111827] shadow-xs font-bold"
                    : "hover:text-[#111827]"
                )}
              >
                <CalendarIcon className="w-3.5 h-3.5 text-[#2D6606]" />
                <span>Calendar View</span>
              </button>

              <button
                onClick={() => setViewMode("timeline")}
                className={cn(
                  "flex items-center gap-1.5 py-1.5 px-3 rounded-md transition-all cursor-pointer whitespace-nowrap",
                  viewMode === "timeline"
                    ? "bg-white text-[#111827] shadow-xs font-bold"
                    : "hover:text-[#111827]"
                )}
              >
                <CalendarDays className="w-3.5 h-3.5 text-[#2D6606]" />
                <span>Timeline View</span>
              </button>
            </div>


          </div>
        </div>

        {/* Sub-toolbar: Dynamic for Board/List vs Calendar */}
        {viewMode !== "calendar" && viewMode !== "timeline" ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2.5 border-t border-[#F1F3F6]">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="text-[11px] font-semibold text-[#6B7280] mr-1">Status:</span>
              {[
                { id: "all", label: "All", count: milestones.length },
                {
                  id: "review",
                  label: "In Review (72h SLA)",
                  count: milestones.filter((m) => m.status === "review").length,
                },
                {
                  id: "in_progress",
                  label: "In Progress",
                  count: milestones.filter((m) => m.status === "in_progress").length,
                },
                {
                  id: "todo",
                  label: "To Do / Locked",
                  count: milestones.filter((m) => m.status === "todo").length,
                },
                {
                  id: "completed",
                  label: "Released",
                  count: milestones.filter((m) => m.status === "completed").length,
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
            </div>

            {/* Search & Actions */}
            <div className="flex items-center gap-2">
              <div className="relative w-44 sm:w-56">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="text"
                  placeholder="Find milestone, note..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-[#F4F5F7] border border-transparent focus:border-[#CBD5E1] focus:bg-white rounded-lg pl-8 pr-3 py-1.5 outline-hidden transition-all text-[#111827]"
                />
              </div>

              <button
                onClick={() => {
                  setTargetMilestoneId("m2");
                  setNoteType("meet");
                  setShowAddNoteModal(true);
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#111827] hover:bg-black text-xs font-bold text-white transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
              >
                <Video className="w-3.5 h-3.5 text-[#88D635]" />
                <span>Meet</span>
              </button>

              <button
                onClick={() => {
                  setTargetMilestoneId("m2");
                  setNoteType("note");
                  setShowAddNoteModal(true);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] text-xs font-semibold text-[#111827] transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#111827]" />
                <span>Note</span>
              </button>

              <button
                onClick={() => setShowAddBacklogModal(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#E8F8D6] border border-[#C6EE95] hover:bg-[#DDF3C3] text-xs font-bold text-[#2D6606] transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5 text-[#2D6606]" />
                <span>Backlog</span>
              </button>
            </div>
          </div>
        ) : (
          /* Calendar Sub-toolbar (Reference Image 2 Manageko style) */
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2.5 border-t border-[#F1F3F6]">
            {/* Category Tabs: All Scheduled | Events | Meetings | Task Reminders */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: "all", label: "All Scheduled", icon: <CalendarDays className="w-3.5 h-3.5" /> },
                { id: "events", label: "Events", icon: <Sparkles className="w-3.5 h-3.5" /> },
                { id: "meetings", label: "Meetings", icon: <Video className="w-3.5 h-3.5" /> },
                { id: "tasks", label: "Task Reminders", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCalendarTab(tab.id as typeof calendarTab)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer",
                    calendarTab === tab.id
                      ? "bg-[#111827] text-white shadow-xs"
                      : "text-[#6B7280] hover:text-[#111827] bg-[#F4F5F7]"
                  )}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* View Span: Day | Week | Month + Search + New Button */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[#F4F5F7] p-0.5 rounded-lg text-xs font-semibold text-[#6B7280]">
                {(["day", "week", "month"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setCalendarSpan(mode)}
                    className={cn(
                      "px-3 py-1.5 rounded-md transition-all cursor-pointer capitalize",
                      calendarSpan === mode
                        ? "bg-white text-[#111827] shadow-xs font-bold"
                        : "hover:text-[#111827]"
                    )}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              <div className="relative w-36 sm:w-44">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="text"
                  placeholder="Search meets..."
                  value={calendarSearch}
                  onChange={(e) => setCalendarSearch(e.target.value)}
                  className="w-full text-xs bg-[#F4F5F7] border border-transparent focus:border-[#CBD5E1] focus:bg-white rounded-lg pl-8 pr-2.5 py-1.5 outline-hidden text-[#111827]"
                />
              </div>

              <button
                onClick={() => {
                  setTargetMilestoneId("m2");
                  setNoteType("meet");
                  setShowAddNoteModal(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-[#111827] hover:bg-black rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. VIEW 1: BOARD / KANBAN VIEW WITH HTML5 DRAG & DROP                     */}
      {/* ========================================================================= */}
      {viewMode === "board" && (
        <div className="w-full bg-white rounded-xl border border-black/[0.06] shadow-[0px_2px_8px_rgba(0,0,0,0.03)] p-4 sm:p-5 flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Pinned Container Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#F1F3F6] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#111827] flex items-center justify-center text-[#88D635] font-black text-sm shrink-0 shadow-2xs">
                <LayoutGrid className="w-4 h-4 text-[#88D635]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#111827]">
                    Sprint Kanban & Escrow Pipeline
                  </h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#F4F5F7] text-[#4B5563] font-semibold border border-[#E5E7EB]">
                    4 Stages • Drag to Reorder
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  SOW-2026-9921 • $4,950 Contract Total • Protected under Neutral 100% FDIC Escrow
                </p>
              </div>
            </div>

            {/* Quick Summary Pill Indicators */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#DCFCE7] text-[#15803D] font-bold text-[11px] border border-[#BBF7D0]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>$1,500 Released</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FEF3C7] text-[#92400E] font-bold text-[11px] border border-[#FDE68A]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D97706]" />
                <span>$1,950 In Escrow</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F3F4F6] text-[#4B5563] font-bold text-[11px] border border-[#E5E7EB]">
                <Lock className="w-3.5 h-3.5 text-[#6B7280]" />
                <span>$1,500 Future Scope</span>
              </div>
            </div>
          </div>

          {/* Kanban Columns Grid - Fills full remaining height with internal column scrolling only */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5 flex-1 min-h-0 pt-3.5 overflow-hidden">
            {/* COLUMN 1: TO DO / SCOPE LOCKED */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
              }}
              onDragEnter={() => setDragOverCol("todo")}
              onDragLeave={() => setDragOverCol(null)}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("text/plain");
                if (id) handleDropMilestone(id, "todo");
              }}
              className={cn(
                "flex flex-col rounded-xl border transition-all duration-150 flex-1 min-h-0 h-full overflow-hidden shadow-2xs",
                dragOverCol === "todo"
                  ? "bg-[#88D635]/10 border-2 border-dashed border-[#88D635]"
                  : "bg-[#F8F9FA] border-black/[0.06]"
              )}
            >
              {/* Pinned Column Header (Never moves / never scrolls) */}
              <div className="flex items-center justify-between p-3.5 border-b border-black/[0.05] bg-[#F8F9FA] shrink-0 select-none">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#9CA3AF]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                    To Do / Scope Locked
                  </h4>
                  <span className="text-[10px] font-mono font-bold bg-white px-1.5 py-0.5 rounded-md border border-[#E5E7EB] text-[#4B5563]">
                    {filteredMilestones.filter((m) => m.status === "todo").length}
                  </span>
                </div>
                <button
                  onClick={() => setShowAddBacklogModal(true)}
                  className="p-1 rounded-md text-[#9CA3AF] hover:text-[#111827] hover:bg-white transition-colors cursor-pointer"
                  title="Add to Backlog"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Scrollable Column Cards Container (Only items move here) */}
              <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-3 flex flex-col gap-2.5">
                {filteredMilestones
                  .filter((m) => m.status === "todo")
                  .map((milestone) => (
                    <MilestoneBoardCard
                      key={milestone.id}
                      milestone={milestone}
                      isClient={isClient}
                      isDragging={draggedMilestoneId === milestone.id}
                      onDragStart={(id) => setDraggedMilestoneId(id)}
                      onDragEnd={() => setDraggedMilestoneId(null)}
                      onSelect={() => setSelectedMilestone(milestone)}
                      onAddNote={() => {
                        setTargetMilestoneId(milestone.id);
                        setNoteType("note");
                        setShowAddNoteModal(true);
                      }}
                      onAddMeet={() => {
                        setTargetMilestoneId(milestone.id);
                        setNoteType("meet");
                        setShowAddNoteModal(true);
                      }}
                      onFund={onFundEscrow}
                      onRelease={onReleaseEscrow}
                      showToast={showToast}
                      getTagBadgeStyle={getTagBadgeStyle}
                    />
                  ))}

                <button
                  onClick={() => setShowAddBacklogModal(true)}
                  className="w-full py-2 px-3 border border-dashed border-[#D1D5DB] hover:border-[#111827] rounded-lg text-xs font-semibold text-[#6B7280] hover:text-[#111827] bg-white/60 hover:bg-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs mt-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item to Backlog</span>
                </button>
              </div>
            </div>

            {/* COLUMN 2: IN PROGRESS */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
              }}
              onDragEnter={() => setDragOverCol("in_progress")}
              onDragLeave={() => setDragOverCol(null)}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("text/plain");
                if (id) handleDropMilestone(id, "in_progress");
              }}
              className={cn(
                "flex flex-col rounded-xl border transition-all duration-150 flex-1 min-h-0 h-full overflow-hidden shadow-2xs",
                dragOverCol === "in_progress"
                  ? "bg-[#88D635]/10 border-2 border-dashed border-[#88D635]"
                  : "bg-[#F8F9FA] border-black/[0.06]"
              )}
            >
              {/* Pinned Column Header (Never moves / never scrolls) */}
              <div className="flex items-center justify-between p-3.5 border-b border-black/[0.05] bg-[#F8F9FA] shrink-0 select-none">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FB923C]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                    In Progress
                  </h4>
                  <span className="text-[10px] font-mono font-bold bg-white px-1.5 py-0.5 rounded-md border border-[#E5E7EB] text-[#4B5563]">
                    {filteredMilestones.filter((m) => m.status === "in_progress").length}
                  </span>
                </div>
                <button
                  onClick={() => showToast("Opened Propose Change Order")}
                  className="p-1 rounded-md text-[#9CA3AF] hover:text-[#111827] hover:bg-white transition-colors cursor-pointer"
                  title="Add Change Order"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Scrollable Column Cards Container (Only items move here) */}
              <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-3 flex flex-col gap-2.5">
                {filteredMilestones
                  .filter((m) => m.status === "in_progress")
                  .map((milestone) => (
                    <MilestoneBoardCard
                      key={milestone.id}
                      milestone={milestone}
                      isClient={isClient}
                      isDragging={draggedMilestoneId === milestone.id}
                      onDragStart={(id) => setDraggedMilestoneId(id)}
                      onDragEnd={() => setDraggedMilestoneId(null)}
                      onSelect={() => setSelectedMilestone(milestone)}
                      onAddNote={() => {
                        setTargetMilestoneId(milestone.id);
                        setNoteType("note");
                        setShowAddNoteModal(true);
                      }}
                      onAddMeet={() => {
                        setTargetMilestoneId(milestone.id);
                        setNoteType("meet");
                        setShowAddNoteModal(true);
                      }}
                      onFund={onFundEscrow}
                      onRelease={onReleaseEscrow}
                      showToast={showToast}
                      getTagBadgeStyle={getTagBadgeStyle}
                    />
                  ))}
              </div>
            </div>

            {/* COLUMN 3: IN REVIEW & 72H SLA WATCHDOG */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
              }}
              onDragEnter={() => setDragOverCol("review")}
              onDragLeave={() => setDragOverCol(null)}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("text/plain");
                if (id) handleDropMilestone(id, "review");
              }}
              className={cn(
                "flex flex-col rounded-xl border transition-all duration-150 flex-1 min-h-0 h-full overflow-hidden shadow-2xs",
                dragOverCol === "review"
                  ? "bg-[#88D635]/10 border-2 border-dashed border-[#88D635]"
                  : "bg-[#FFFDF5] border-[#FDE68A]/70"
              )}
            >
              {/* Pinned Column Header (Never moves / never scrolls) */}
              <div className="flex items-center justify-between p-3.5 border-b border-[#FDE68A]/60 bg-[#FFFDF5] shrink-0 select-none">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] animate-pulse" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#92400E]">
                    In Review (72h SLA)
                  </h4>
                  <span className="text-[10px] font-mono font-bold bg-[#FEF3C7] px-1.5 py-0.5 rounded-md border border-[#FDE68A] text-[#92400E]">
                    {filteredMilestones.filter((m) => m.status === "review").length}
                  </span>
                </div>
                <Clock className="w-3.5 h-3.5 text-[#D97706]" />
              </div>

              {/* Scrollable Column Cards Container (Only items move here) */}
              <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-3 flex flex-col gap-2.5">
                {filteredMilestones
                  .filter((m) => m.status === "review")
                  .map((milestone) => (
                    <MilestoneBoardCard
                      key={milestone.id}
                      milestone={milestone}
                      isClient={isClient}
                      isHighlight
                      isDragging={draggedMilestoneId === milestone.id}
                      onDragStart={(id) => setDraggedMilestoneId(id)}
                      onDragEnd={() => setDraggedMilestoneId(null)}
                      onSelect={() => setSelectedMilestone(milestone)}
                      onAddNote={() => {
                        setTargetMilestoneId(milestone.id);
                        setNoteType("note");
                        setShowAddNoteModal(true);
                      }}
                      onAddMeet={() => {
                        setTargetMilestoneId(milestone.id);
                        setNoteType("meet");
                        setShowAddNoteModal(true);
                      }}
                      onFund={onFundEscrow}
                      onRelease={onReleaseEscrow}
                      showToast={showToast}
                      getTagBadgeStyle={getTagBadgeStyle}
                    />
                  ))}
              </div>
            </div>

            {/* COLUMN 4: RELEASED & COMPLETED */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
              }}
              onDragEnter={() => setDragOverCol("completed")}
              onDragLeave={() => setDragOverCol(null)}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("text/plain");
                if (id) handleDropMilestone(id, "completed");
              }}
              className={cn(
                "flex flex-col rounded-xl border transition-all duration-150 flex-1 min-h-0 h-full overflow-hidden shadow-2xs",
                dragOverCol === "completed"
                  ? "bg-[#88D635]/10 border-2 border-dashed border-[#88D635]"
                  : "bg-[#F0FDF4]/50 border-[#BBF7D0]/70"
              )}
            >
              {/* Pinned Column Header (Never moves / never scrolls) */}
              <div className="flex items-center justify-between p-3.5 border-b border-[#BBF7D0]/60 bg-[#F0FDF4]/80 shrink-0 select-none">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#15803D]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#166534]">
                    Released & IP Transferred
                  </h4>
                  <span className="text-[10px] font-mono font-bold bg-[#DCFCE7] px-1.5 py-0.5 rounded-md border border-[#BBF7D0] text-[#15803D]">
                    {filteredMilestones.filter((m) => m.status === "completed").length}
                  </span>
                </div>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
              </div>

              {/* Scrollable Column Cards Container (Only items move here) */}
              <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-3 flex flex-col gap-2.5">
                {filteredMilestones
                  .filter((m) => m.status === "completed")
                  .map((milestone) => (
                    <MilestoneBoardCard
                      key={milestone.id}
                      milestone={milestone}
                      isClient={isClient}
                      isDragging={draggedMilestoneId === milestone.id}
                      onDragStart={(id) => setDraggedMilestoneId(id)}
                      onDragEnd={() => setDraggedMilestoneId(null)}
                      onSelect={() => setSelectedMilestone(milestone)}
                      onAddNote={() => {
                        setTargetMilestoneId(milestone.id);
                        setNoteType("note");
                        setShowAddNoteModal(true);
                      }}
                      onAddMeet={() => {
                        setTargetMilestoneId(milestone.id);
                        setNoteType("meet");
                        setShowAddNoteModal(true);
                      }}
                      onFund={onFundEscrow}
                      onRelease={onReleaseEscrow}
                      showToast={showToast}
                      getTagBadgeStyle={getTagBadgeStyle}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. VIEW 2: LIST VIEW (Structured Container with Internal Scrollable Cards)  */}
      {/* ========================================================================= */}
      {viewMode === "list" && (
        <div className="w-full bg-white rounded-xl border border-black/[0.06] shadow-[0px_2px_8px_rgba(0,0,0,0.03)] p-4 sm:p-5 flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Pinned Container Header (Aligned with Sidebar bottom geometry) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#F1F3F6] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#111827] flex items-center justify-center text-[#88D635] font-black text-sm shrink-0 shadow-2xs">
                <ListIcon className="w-4 h-4 text-[#88D635]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#111827]">
                    Milestones & Escrow Deliverable Registry
                  </h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#F4F5F7] text-[#4B5563] font-semibold border border-[#E5E7EB]">
                    {filteredMilestones.length} of {milestones.length} Active
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  SOW-2026-9921 • $4,950 Contract Total • 100% In Neutral FDIC Escrow
                </p>
              </div>
            </div>

            {/* Quick Escrow Breakdown Badges */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#DCFCE7] text-[#15803D] font-bold text-[11px] border border-[#BBF7D0]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>$1,500 Released</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FEF3C7] text-[#92400E] font-bold text-[11px] border border-[#FDE68A]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D97706]" />
                <span>$1,950 In Escrow</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F3F4F6] text-[#4B5563] font-bold text-[11px] border border-[#E5E7EB]">
                <Lock className="w-3.5 h-3.5 text-[#6B7280]" />
                <span>$1,500 Future Scope</span>
              </div>
            </div>
          </div>

          {/* Scrollable Internal Cards Body (The only scrollable section) */}
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-3.5 pt-3.5 flex flex-col gap-3">
            {filteredMilestones.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-12 h-12 rounded-full bg-[#F4F5F7] flex items-center justify-center text-[#9CA3AF] mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-[#111827]">No milestones found</h4>
                <p className="text-xs text-[#6B7280] mt-1 max-w-sm">
                  No milestones match your current filter. Try selecting "All" or resetting your search query.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setStatusFilter("all");
                    setSearchQuery("");
                  }}
                  className="mt-4 text-xs font-semibold"
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              filteredMilestones.map((item) => {
                const percent = Math.round((item.progress.completed / item.progress.total) * 100);

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedMilestone(item)}
                    className="bg-[#FAFAFC] hover:bg-white rounded-xl border border-black/[0.07] hover:border-[#CBD5E1] p-4 sm:p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0px_4px_12px_rgba(0,0,0,0.05)] transition-all cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-5 group"
                  >
                    {/* Left Section: Number, Title, Tags & Description */}
                    <div className="flex-1 min-w-0 space-y-2.5">
                      {/* Top Badges Row */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={cn(
                            "w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 font-mono shadow-2xs",
                            item.status === "completed" && "bg-[#DCFCE7] text-[#15803D]",
                            item.status === "review" && "bg-[#FEF3C7] text-[#92400E]",
                            item.status === "in_progress" && "bg-[#FFEDD5] text-[#C2410C]",
                            item.status === "todo" && "bg-[#F3F4F6] text-[#4B5563]"
                          )}
                        >
                          {typeof item.number === "number" ? `M${item.number}` : item.number}
                        </span>

                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5",
                            item.status === "completed" && "bg-[#DCFCE7] text-[#15803D]",
                            item.status === "review" && "bg-[#FEF3C7] text-[#92400E]",
                            item.status === "in_progress" && "bg-[#FFEDD5] text-[#C2410C]",
                            item.status === "todo" && "bg-[#F3F4F6] text-[#4B5563]"
                          )}
                        >
                          {item.status === "review" && <Clock className="w-3.5 h-3.5 text-[#D97706]" />}
                          {item.status === "completed" && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {item.escrowStatus === "pre_funding_required" && <AlertTriangle className="w-3.5 h-3.5 text-[#D97706]" />}
                          {item.escrowStatus === "scope_locked" && <Lock className="w-3.5 h-3.5 text-[#6B7280]" />}
                          <span>{item.escrowLabel}</span>
                        </span>

                        {/* Milestone Category Tags (Properly spaced & styled) */}
                        <div className="flex items-center gap-1.5 flex-wrap ml-1">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className={cn(
                                "px-2 py-0.5 rounded-md text-[11px] font-medium border",
                                getTagBadgeStyle(tag)
                              )}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3 className="text-base font-bold text-[#111827] group-hover:text-black">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#6B7280] mt-1 leading-relaxed max-w-2xl">
                          {item.description}
                        </p>
                      </div>

                      {/* Sub-Info Row: Deliverables, Commits & Scheduled Meets */}
                      <div className="flex items-center gap-4 flex-wrap pt-1 text-xs text-[#4B5563]">
                        {/* Deliverables snippet */}
                        <div className="flex items-center gap-1.5 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                          <span>{item.progress.completed}/{item.progress.total} Deliverables Verified</span>
                        </div>

                        {/* Commit hash if available */}
                        {item.deliverables[0]?.gitCommit && (
                          <div className="flex items-center gap-1 font-mono text-[11px] bg-[#F4F5F7] px-2 py-0.5 rounded-md text-[#4B5563]">
                            <GitCommit className="w-3 h-3 text-[#6B7280]" />
                            <span>Commit {item.deliverables[0].gitCommit}</span>
                          </div>
                        )}

                        {/* Scheduled Meet Link Button */}
                        {item.meets.length > 0 && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              showToast(`Opened Google Meet: ${item.meets[0].link}`);
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EFF6FF] text-[#1D4ED8] hover:bg-[#DBEAFE] font-semibold text-[11px] transition-colors cursor-pointer border border-[#BFDBFE]"
                          >
                            <GoogleMeetIcon className="w-3.5 h-3.5" />
                            <span>{item.meets[0].title} • {item.meets[0].time}</span>
                            <ArrowUpRight className="w-3 h-3 ml-0.5" />
                          </div>
                        )}

                        {/* Notes count */}
                        {item.notes.length > 0 && (
                          <span className="flex items-center gap-1 text-[11px] text-[#6B7280]">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{item.notes.length} notes</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Section: Escrow Amount, Progress Bar & Quick Actions */}
                    <div
                      className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 lg:w-64 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#F1F3F6]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="text-left lg:text-right w-full">
                        <span className="text-xl font-bold font-mono text-[#111827] block">
                          {item.amount > 0 ? formatCurrency(item.amount) : "IP Deed Transfer"}
                        </span>
                        <span className="text-xs text-[#6B7280] font-medium block">
                          {item.escrowStatus === "released" && "✓ Transferred on IP Delivery"}
                          {item.escrowStatus === "funded" && "🛡️ 100% In Neutral FDIC Escrow"}
                          {item.escrowStatus === "pre_funding_required" && "⚠️ Awaiting Escrow Deposit"}
                          {item.escrowStatus === "scope_locked" && "🔒 Contract Completion Deed"}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full">
                        <div className="flex items-center justify-between text-[11px] mb-1 font-semibold text-[#4B5563]">
                          <span>Progress</span>
                          <span className="font-mono">{percent}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              item.status === "completed" && "bg-[#15803D]",
                              item.status === "review" && "bg-[#F59E0B]",
                              item.status === "in_progress" && "bg-[#EA580C]",
                              item.status === "todo" && "bg-[#9CA3AF]"
                            )}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 w-full pt-1">
                        {item.status === "review" && (
                          <>
                            {isClient ? (
                              <Button
                                variant="lime"
                                size="sm"
                                onClick={onReleaseEscrow}
                                className="flex-1 text-xs font-bold shadow-xs py-1.5"
                              >
                                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                                <span>Release $1,500</span>
                              </Button>
                            ) : (
                              <Button
                                variant="dark"
                                size="sm"
                                onClick={() => showToast("Nudge reminder sent to Sarah Chen!")}
                                className="flex-1 text-xs font-bold gap-1 py-1.5"
                              >
                                <Send className="w-3 h-3 text-[#88D635]" />
                                <span>Nudge Review</span>
                              </Button>
                            )}
                          </>
                        )}

                        {item.status === "todo" && item.escrowStatus === "pre_funding_required" && (
                          <>
                            {isClient ? (
                              <Button
                                variant="dark"
                                size="sm"
                                onClick={onFundEscrow}
                                className="flex-1 text-xs font-bold py-1.5"
                              >
                                Pre-Fund $1,500
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => showToast("Escrow funding request sent to client!")}
                                className="flex-1 text-xs font-semibold py-1.5"
                              >
                                Request Escrow
                              </Button>
                            )}
                          </>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedMilestone(item)}
                          className="text-xs py-1.5 hover:bg-white hover:border-[#111827]"
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 4. VIEW 3: CALENDAR VIEW (Reference Image 2 Manageko Exact Layout)        */}
      {/* ========================================================================= */}
{viewMode === "calendar" && (
        <div className="w-full bg-white rounded-xl border border-black/[0.06] shadow-[0px_2px_8px_rgba(0,0,0,0.03)] p-4 sm:p-5 flex flex-col gap-3.5 flex-1 min-h-0 overflow-hidden">
          {/* Time Navigation & Date Display (Ref Image 2) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1F3F6] pb-3 shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-base font-bold text-[#111827]">
                September – October 2026
              </span>

              <button
                onClick={() => {
                  const target = todayDayIndex >= 0 ? todayDayIndex : 2;
                  setSelectedDayIndex(target);
                  showToast(`Switched to Today (${weekDayHeaders[target]?.label || "WED 30"}, Sep 30, 2026)`);
                }}
                className="px-2.5 py-1 rounded-md bg-[#EDE9FE] hover:bg-[#DDD6FE] text-xs font-bold text-[#5B21B6] border border-[#DDD6FE]/70 cursor-pointer transition-colors"
              >
                Today
              </button>

              <div className="flex items-center gap-1 text-[#6B7280]">
                <button
                  onClick={() => {
                    setSelectedDayIndex((prev) => (prev > 0 ? prev - 1 : 6));
                    showToast("Previous date");
                  }}
                  className="p-1 rounded-md hover:bg-[#F4F5F7] cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedDayIndex((prev) => (prev < 6 ? prev + 1 : 0));
                    showToast("Next date");
                  }}
                  className="p-1 rounded-md hover:bg-[#F4F5F7] cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowAllHours((prev) => !prev);
                  showToast(!showAllHours ? "Showing all 24 hours (12 AM - 11 PM)" : `Focused on active hours (from ${ALL_HOURS_24[activeStartHour]})`);
                }}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border",
                  showAllHours
                    ? "bg-[#111827] text-white border-[#111827] shadow-2xs"
                    : "bg-[#F4F5F7] hover:bg-[#E5E7EB] text-[#4B5563] border-[#E5E7EB]"
                )}
                title={showAllHours ? "Showing all 24 hours (Click to focus active hours)" : `Focused on active hours starting from ${ALL_HOURS_24[activeStartHour]}`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{showAllHours ? "24 Hours (Full)" : `From ${ALL_HOURS_24[activeStartHour]} (Active)`}</span>
              </button>

              <div className="flex items-center gap-1.5 px-3 py-1 bg-[#F4F5F7] rounded-lg text-xs font-mono font-medium text-[#4B5563]">
                <CalendarIcon className="w-3.5 h-3.5 text-[#6B7280]" />
                <span>28 Sep - 04 Oct 2026</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* WEEK HOURLY SCHEDULE GRID (Accurate Timings matching Ref Image 2)         */}
          {/* ========================================================================= */}
          {calendarSpan === "week" && (
            <div className="border border-[#E5E7EB] rounded-xl overflow-hidden mt-1 bg-white shadow-2xs flex-1 flex flex-col min-h-0">
              <div className="overflow-x-auto flex-1 flex flex-col min-h-0">
                <div className="min-w-[760px] flex-1 flex flex-col min-h-0">
                  {/* Hourly Rows Container with Sticky Header - Unified scroll context ensures straight column lines */}
                  <div ref={weekScrollRef} className="relative divide-y divide-[#F1F3F6] overflow-y-auto flex-1 min-h-0 custom-scrollbar">
                    {/* Days Header - Sticky at the top INSIDE the scroll container for 100% column line alignment */}
                    <div className="grid grid-cols-[75px_repeat(7,1fr)] border-b border-[#E5E7EB] bg-[#F8F9FA] text-center text-xs font-bold text-[#4B5563] sticky top-0 z-30 shrink-0">
                      <div className="py-2.5 border-r border-[#E5E7EB] text-[11px] text-[#9CA3AF] flex items-center justify-center bg-[#F8F9FA]">
                        Time
                      </div>
                      {weekDayHeaders.map((dh) => (
                        <div
                          key={dh.label}
                          className={cn(
                            "py-2.5 border-r border-[#E5E7EB] last:border-r-0 transition-colors uppercase tracking-wider text-[11px] flex items-center justify-center gap-1",
                            dh.isToday ? "bg-[#EDE9FE] text-[#5B21B6] font-bold" : "text-[#4B5563] bg-[#F8F9FA]"
                          )}
                        >
                          <span>{dh.label}</span>
                          {dh.isToday && (
                            <span className="text-[9px] bg-[#88D635] text-[#0A2600] px-1 py-0.5 rounded-sm font-black">
                              TODAY
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Expander row for off-hours: lets user easily expand/collapse earlier times */}
                    {!showAllHours && activeStartHour > 0 && (
                      <div
                        onClick={() => {
                          setShowAllHours(true);
                          showToast("Expanded all 24 hours (12 AM - 11 PM)");
                        }}
                        className="py-1.5 px-3 bg-[#F8F9FA] hover:bg-[#F1F3F6] border-b border-[#E5E7EB] text-center text-xs font-semibold text-[#4B5563] hover:text-[#111827] flex items-center justify-center gap-2 cursor-pointer transition-colors select-none group"
                      >
                        <ChevronDown className="w-3.5 h-3.5 text-[#6B7280] group-hover:translate-y-0.5 transition-transform" />
                        <span>Show {activeStartHour} earlier hours (12 AM – {ALL_HOURS_24[activeStartHour - 1]})</span>
                        <span className="text-[10px] text-[#7C3AED] font-mono bg-[#EDE9FE] px-1.5 py-0.5 rounded font-bold">
                          Highest card starts at {ALL_HOURS_24[activeStartHour]}
                        </span>
                      </div>
                    )}
                    {showAllHours && activeStartHour > 0 && (
                      <div
                        onClick={() => {
                          setShowAllHours(false);
                          showToast(`Focused on active hours (starts from ${ALL_HOURS_24[activeStartHour]})`);
                        }}
                        className="py-1.5 px-3 bg-[#F8F9FA] hover:bg-[#F1F3F6] border-b border-[#E5E7EB] text-center text-xs font-semibold text-[#4B5563] hover:text-[#111827] flex items-center justify-center gap-2 cursor-pointer transition-colors select-none group"
                      >
                        <ChevronUp className="w-3.5 h-3.5 text-[#6B7280] group-hover:-translate-y-0.5 transition-transform" />
                        <span>Hide early off-hours (start from highest card: {ALL_HOURS_24[activeStartHour]})</span>
                      </div>
                    )}

                    {/* Real-time Indicator Line Component - Smooth live real-time position pointing at Today */}
                    <RealTimeIndicator
                      startHour={showAllHours ? 0 : activeStartHour}
                      endHour={24}
                      rowHeight={110}
                      headerOffset={activeStartHour > 0 ? 68 : 37}
                      timeColWidth={75}
                      todayDayIndex={todayDayIndex}
                      totalDays={7}
                    />

                    {timeRows.map((timeSlot) => {
                      // Off-hours dimming: rows outside 8 AM – 8 PM get a subtle grey wash
                      const slotHour = (() => {
                        const m = timeSlot.match(/(\d+)\s*(AM|PM)/i);
                        if (!m) return 8;
                        let h = parseInt(m[1], 10);
                        if (m[2].toUpperCase() === "PM" && h !== 12) h += 12;
                        if (m[2].toUpperCase() === "AM" && h === 12) h = 0;
                        return h;
                      })();
                      const isOffHours = slotHour < 8 || slotHour >= 20;
                      return (
                      <div
                        key={timeSlot}
                        className={cn(
                          "grid grid-cols-[75px_repeat(7,1fr)] min-h-[110px] items-stretch",
                          isOffHours && "bg-[#F6F7F9]"
                        )}
                      >
                        <div className={cn(
                          "p-2 border-r border-[#E5E7EB] text-right font-mono text-[11px] bg-[#FAFAFA] flex items-start justify-end shrink-0",
                          isOffHours ? "text-[#C4C9D4]" : "text-[#9CA3AF]"
                        )}>
                          <span>{timeSlot}</span>
                        </div>

                        {weekDayHeaders.map((dh) => {
                          const eventsInCell = filteredWeekEvents.filter(
                            (ev) => ev.dayIndex === dh.dayIndex && ev.timeSlot === timeSlot
                          );

                          return (
                            <div
                              key={dh.dayIndex}
                              className={cn(
                                "p-1.5 border-r border-[#E5E7EB] last:border-r-0 relative hover:bg-[#F9FAFB] transition-colors flex flex-col justify-start group/cell",
                                isOffHours && !dh.isToday && "bg-[#F6F7F9]",
                                dh.isToday && !isOffHours && "bg-[#FAF5FF]/30",
                                dh.isToday && isOffHours && "bg-[#F3EFF8]/60"
                              )}
                              onClick={() => {
                                setTargetMilestoneId("m2");
                                setNoteType("meet");
                                setNoteTime(timeSlot);
                                setNoteDate(dh.dateStr);
                                setShowAddNoteModal(true);
                              }}
                            >
                              {eventsInCell.map((ev) => (
                                <div
                                  key={ev.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openMeetInspector(ev);
                                  }}
                                  className={cn(
                                    "p-2 rounded-lg text-left text-xs mb-1.5 cursor-pointer transition-all shadow-2xs hover:shadow-xs border leading-tight select-none group/card",
                                    ev.colorTheme === "purple" && "bg-[#FAF5FF] text-[#6B21A8] border-[#E9D5FF] hover:border-[#D8B4FE]",
                                    ev.colorTheme === "blue" && "bg-[#F0F9FF] text-[#0369A1] border-[#BAE6FD] hover:border-[#7DD3FC]",
                                    ev.colorTheme === "mint" && "bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0] hover:border-[#86EFAC]",
                                    ev.colorTheme === "violet" && "bg-[#F5F3FF] text-[#5B21B6] border-[#DDD6FE] hover:border-[#C4B5FD]"
                                  )}
                                >
                                  <div className="flex items-center justify-between text-[10px] font-mono opacity-80 mb-1">
                                    <span className="font-semibold">{ev.timeDisplay}</span>
                                    {ev.meetUrl ? (
                                      <span title="Google Meet call" className="inline-flex items-center gap-0.5">
                                        <GoogleMeetIcon className="w-3 h-3" />
                                      </span>
                                    ) : (
                                      <StickyNote className="w-2.5 h-2.5 opacity-60" />
                                    )}
                                  </div>
                                  <span className="font-bold text-[#111827] block line-clamp-2 text-[11px] mb-1">
                                    {ev.title}
                                  </span>
                                  <div className="flex items-center justify-between pt-0.5 border-t border-current/10">
                                    <span className="text-[9px] font-semibold uppercase tracking-wider opacity-70">
                                      {ev.category}
                                    </span>
                                    <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[#111827] hover:underline">
                                      <Eye className="w-2.5 h-2.5" />
                                      <span>View</span>
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* DAY VIEW (Accurate Interactive Hourly Timeline + Day Focus Hub)           */}
          {/* ========================================================================= */}
          {calendarSpan === "day" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 flex-1 min-h-0 overflow-hidden">
              {/* LEFT 8 COLUMNS: Hourly Timeline */}
              <div className="lg:col-span-8 flex flex-col gap-3 min-h-0 overflow-hidden">
                {/* Day Selector Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#E5E7EB] shadow-2xs">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    {weekDayHeaders.map((dh) => (
                      <button
                        key={dh.dayIndex}
                        onClick={() => setSelectedDayIndex(dh.dayIndex)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0",
                          selectedDayIndex === dh.dayIndex
                            ? "bg-[#111827] text-white shadow-xs"
                            : "bg-[#F4F5F7] text-[#4B5563] hover:bg-[#E5E7EB]"
                        )}
                      >
                        <span>{dh.label}</span>
                        {dh.isToday && (
                          <span
                            className={cn(
                              "text-[9px] font-bold px-1 rounded-sm",
                              selectedDayIndex === dh.dayIndex
                                ? "bg-[#88D635] text-[#0A2600]"
                                : "bg-[#E8F8D6] text-[#2D6606]"
                            )}
                          >
                            TODAY
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-mono font-medium text-[#6B7280]">
                      {weekDayHeaders[selectedDayIndex]?.label} Sep/Oct 2026
                    </span>
                    <span className="text-xs font-bold bg-[#E8F8D6] text-[#2D6606] px-2.5 py-1 rounded-md">
                      {filteredWeekEvents.filter((ev) => ev.dayIndex === selectedDayIndex).length} Scheduled
                    </span>
                  </div>
                </div>

                {/* Day Timeline Container with Outer Protected Border & Inner Padded Scrollbar */}
                <div className="border border-[#E5E7EB] rounded-xl bg-white shadow-2xs overflow-hidden flex-1 min-h-0 flex flex-col">
                  <div ref={dayScrollRef} className="relative overflow-y-auto min-h-0 divide-y divide-[#E5E7EB]/80 pr-3.5 custom-scrollbar flex-1">
                    {/* Expander row for off-hours */}
                    {!showAllHours && activeStartHour > 0 && (
                      <div
                        onClick={() => {
                          setShowAllHours(true);
                          showToast("Expanded all 24 hours (12 AM - 11 PM)");
                        }}
                        className="py-1.5 px-3 bg-[#F8F9FA] hover:bg-[#F1F3F6] border-b border-[#E5E7EB] text-center text-xs font-semibold text-[#4B5563] hover:text-[#111827] flex items-center justify-center gap-2 cursor-pointer transition-colors select-none group"
                      >
                        <ChevronDown className="w-3.5 h-3.5 text-[#6B7280] group-hover:translate-y-0.5 transition-transform" />
                        <span>Show {activeStartHour} earlier hours (12 AM – {ALL_HOURS_24[activeStartHour - 1]})</span>
                        <span className="text-[10px] text-[#7C3AED] font-mono bg-[#EDE9FE] px-1.5 py-0.5 rounded font-bold">
                          Highest card starts at {ALL_HOURS_24[activeStartHour]}
                        </span>
                      </div>
                    )}
                    {showAllHours && activeStartHour > 0 && (
                      <div
                        onClick={() => {
                          setShowAllHours(false);
                          showToast(`Focused on active hours (starts from ${ALL_HOURS_24[activeStartHour]})`);
                        }}
                        className="py-1.5 px-3 bg-[#F8F9FA] hover:bg-[#F1F3F6] border-b border-[#E5E7EB] text-center text-xs font-semibold text-[#4B5563] hover:text-[#111827] flex items-center justify-center gap-2 cursor-pointer transition-colors select-none group"
                      >
                        <ChevronUp className="w-3.5 h-3.5 text-[#6B7280] group-hover:-translate-y-0.5 transition-transform" />
                        <span>Hide early off-hours (start from highest card: {ALL_HOURS_24[activeStartHour]})</span>
                      </div>
                    )}

                    {/* Real-time Indicator Line (when viewing Today) */}
                    {selectedDayIndex === todayDayIndex && (
                      <RealTimeIndicator
                        startHour={showAllHours ? 0 : activeStartHour}
                        endHour={24}
                        rowHeight={100}
                        headerOffset={activeStartHour > 0 ? 32 : 0}
                        timeColWidth={80}
                      />
                    )}

                    {/* Hourly Slots starting from highest card */}
                    {timeRows.map((slot) => {
                      const eventsInSlot = filteredWeekEvents.filter(
                        (ev) => ev.dayIndex === selectedDayIndex && ev.timeSlot === slot
                      );

                      return (
                        <div key={slot} className="flex items-stretch min-h-[96px] lg:min-h-[105px] hover:bg-[#FAFAFA]/70 transition-colors group">
                          {/* Left Time Column - self-stretch ensures continuous unbroken vertical border-r */}
                          <div className="w-20 shrink-0 self-stretch p-3 text-right font-mono text-xs font-semibold text-[#6B7280] border-r border-[#E5E7EB] bg-[#F8F9FA]/70 flex items-start justify-end">
                            <span>{slot}</span>
                          </div>

                          {/* Right Events / Empty Slot Lane with protective padding away from scrollbar */}
                          <div className="flex-1 p-2.5 min-w-0 flex flex-col justify-center pr-1.5">
                            {eventsInSlot.length > 0 ? (
                              <div className="space-y-2">
                                {eventsInSlot.map((ev) => (
                                  <div
                                    key={ev.id}
                                    onClick={() => openMeetInspector(ev)}
                                    className={cn(
                                      "p-3 rounded-lg border text-left shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2.5",
                                      ev.colorTheme === "purple" && "bg-[#FAF5FF] border-[#E9D5FF] text-[#581C87]",
                                      ev.colorTheme === "blue" && "bg-[#F0F9FF] border-[#BAE6FD] text-[#0369A1]",
                                      ev.colorTheme === "mint" && "bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D]",
                                      ev.colorTheme === "violet" && "bg-[#F5F3FF] border-[#DDD6FE] text-[#5B21B6]"
                                    )}
                                  >
                                    <div className="space-y-1 min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/90 border border-current/20 shadow-2xs">
                                          {ev.timeDisplay}
                                        </span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 flex items-center gap-1">
                                          {ev.category === "meetings" ? (
                                            <GoogleMeetIcon className="w-3 h-3" />
                                          ) : (
                                            <StickyNote className="w-3 h-3" />
                                          )}
                                          <span>{ev.category}</span>
                                        </span>
                                      </div>
                                      <h4 className="font-bold text-sm text-[#111827] truncate">
                                        {ev.title}
                                      </h4>
                                      {ev.description && (
                                        <p className="text-xs text-[#4B5563] line-clamp-1">
                                          {ev.description}
                                        </p>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                      {ev.attendees && ev.attendees.length > 0 && (
                                        <div className="text-[11px] font-medium text-[#6B7280] hidden md:block">
                                          {ev.attendees.join(", ")}
                                        </div>
                                      )}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openMeetInspector(ev);
                                        }}
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#111827] text-xs font-semibold shadow-2xs cursor-pointer"
                                        title="View details"
                                      >
                                        <Eye className="w-3.5 h-3.5 text-[#6B7280]" />
                                        <span>View</span>
                                      </button>
                                      {ev.meetUrl && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(ev.meetUrl, "_blank");
                                            showToast(`Joined video call: ${ev.title}`);
                                          }}
                                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#111827] text-white hover:bg-black text-xs font-bold shadow-xs cursor-pointer"
                                        >
                                          <GoogleMeetIcon className="w-3.5 h-3.5" />
                                          <span>Join Google Meet</span>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div
                                onClick={() => {
                                  setTargetMilestoneId("m2");
                                  setNoteType("meet");
                                  setNoteTime(slot);
                                  setNoteDate(weekDayHeaders[selectedDayIndex]?.dateStr || todayIso);
                                  setShowAddNoteModal(true);
                                }}
                                className="h-full min-h-[50px] flex items-center justify-start text-[11px] text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity pl-2 cursor-pointer font-medium"
                              >
                                <span className="hover:text-[#111827] inline-flex items-center gap-1">
                                  <Plus className="w-3 h-3" />
                                  <span>+ Add scheduled meet or note at {slot}</span>
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* RIGHT 4 COLUMNS: Day Focus, Dynamic Meets & Work Notes */}
              {(() => {
                const currentHeader = weekDayHeaders[selectedDayIndex] || weekDayHeaders[1];
                const activeDayMeets = weekEvents.filter(
                  (ev) => ev.dayIndex === selectedDayIndex && ev.category === "meetings"
                );
                const activeDayTasks = weekEvents.filter(
                  (ev) => ev.dayIndex === selectedDayIndex && ev.category === "tasks"
                );
                // Also retrieve all notes assigned to any milestone that match this date
                const dayMilestoneNotes = milestones.flatMap((m) =>
                  m.notes
                    .filter((n) => n.date === currentHeader.dateStr || (selectedDayIndex === 1 && (n.date.includes("29") || n.date.includes("Sep 29"))))
                    .map((n) => ({
                      ...n,
                      milestoneId: m.id,
                      milestoneNumber: m.number,
                      milestoneTitle: m.title,
                    }))
                );

                // Relatable milestone check: find if any event or task links to a milestone, or if it's active
                const relatedMilestone =
                  milestones.find((m) =>
                    activeDayMeets.some((ev) => ev.title.toLowerCase().includes(m.title.toLowerCase()) || ev.description?.toLowerCase().includes(m.title.toLowerCase())) ||
                    activeDayTasks.some((ev) => ev.title.toLowerCase().includes(m.title.toLowerCase()) || ev.description?.toLowerCase().includes(m.title.toLowerCase())) ||
                    dayMilestoneNotes.some((n) => n.milestoneId === m.id)
                  ) ||
                  (selectedDayIndex === 1 ? milestones.find((m) => m.status === "review" || m.status === "in_progress") : null);

                return (
                  <div className="lg:col-span-4 flex flex-col gap-3 min-h-0 overflow-y-auto custom-scrollbar">
                    {/* 1. Google Meet Priority Action Hub */}
                    <div className="bg-white p-4 rounded-xl border border-black/[0.06] shadow-[0px_2px_8px_rgba(0,0,0,0.03)] flex flex-col gap-3">
                      <div className="flex items-center justify-between border-b border-[#F1F3F6] pb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center">
                            <GoogleMeetIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#111827]">Google Meet Hub</h4>
                            <span className="text-[10px] text-[#6B7280]">
                              {activeDayMeets.length} session{activeDayMeets.length === 1 ? "" : "s"} on {currentHeader.label}
                            </span>
                          </div>
                        </div>
                        {activeDayMeets.length > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-ping" />
                            Live Ready
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-[#9CA3AF] bg-[#F4F5F7] px-2 py-0.5 rounded-full">
                            No Calls
                          </span>
                        )}
                      </div>

                      {activeDayMeets.length > 0 ? (
                        <div className="space-y-2.5">
                          {activeDayMeets.map((meet) => (
                            <div key={meet.id} className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono font-bold text-[#0369A1] bg-[#E0F2FE] px-1.5 py-0.5 rounded-sm">
                                  {meet.timeDisplay}
                                </span>
                                <span className="text-[10px] text-[#6B7280] font-medium truncate max-w-[140px]">
                                  {meet.attendees ? meet.attendees.join(", ") : "Team Sync"}
                                </span>
                              </div>
                              <h5 className="text-xs font-bold text-[#111827]">
                                {meet.title}
                              </h5>
                              {meet.description && (
                                <p className="text-[11px] text-[#4B5563] line-clamp-2">
                                  {meet.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2 pt-1">
                                {meet.meetUrl && (
                                  <button
                                    onClick={() => {
                                      window.open(meet.meetUrl, "_blank");
                                      showToast(`Joined video call: ${meet.title}`);
                                    }}
                                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#111827] text-white hover:bg-black text-xs font-bold shadow-xs cursor-pointer"
                                  >
                                    <GoogleMeetIcon className="w-3.5 h-3.5" />
                                    <span>Join Google Meet</span>
                                  </button>
                                )}
                                <button
                                  onClick={() => openMeetInspector(meet)}
                                  className="p-1.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F1F5F9] text-[#475569] cursor-pointer"
                                  title="Inspect or Reschedule"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                {meet.meetUrl && (
                                  <button
                                    onClick={() => {
                                      navigator.clipboard?.writeText(meet.meetUrl!);
                                      showToast("Copied Google Meet link to clipboard!");
                                    }}
                                    className="p-1.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F1F5F9] text-[#475569] cursor-pointer"
                                    title="Copy Meet Link"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center rounded-lg bg-[#F8FAFC] border border-dashed border-[#CBD5E1] space-y-2">
                          <p className="text-xs text-[#6B7280]">
                            No video sync calls scheduled for {currentHeader.label}.
                          </p>
                          <button
                            onClick={() => {
                              setTargetMilestoneId("m2");
                              setNoteType("meet");
                              setNoteDate(currentHeader.dateStr);
                              setShowAddNoteModal(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111827] text-white text-xs font-bold hover:bg-black cursor-pointer shadow-xs"
                          >
                            <Video className="w-3.5 h-3.5 text-[#88D635]" />
                            <span>Schedule Video Sync</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 2. Today's Notes & Deliverable Checklist */}
                    <div className="bg-white p-4 rounded-xl border border-black/[0.06] shadow-[0px_2px_8px_rgba(0,0,0,0.03)] flex flex-col gap-3">
                      <div className="flex items-center justify-between border-b border-[#F1F3F6] pb-2.5">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#7C3AED]" />
                          <h4 className="text-xs font-bold text-[#111827]">Day Notes & Deliverables</h4>
                        </div>
                        <button
                          onClick={() => {
                            setTargetMilestoneId("m2");
                            setNoteType("note");
                            setNoteDate(currentHeader.dateStr);
                            setShowAddNoteModal(true);
                          }}
                          className="text-[11px] font-bold text-[#7C3AED] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Note</span>
                        </button>
                      </div>

                      {/* Dynamic Tasks & Work Notes List */}
                      {activeDayTasks.length > 0 || dayMilestoneNotes.length > 0 ? (
                        <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                          {activeDayTasks.map((t) => (
                            <div key={t.id} className="p-2.5 rounded-lg bg-[#FDF4FF] border border-[#F5D0FE] text-xs space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-[#86198F] text-[10px] uppercase tracking-wider flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-[#A21CAF]" />
                                  <span>Task Reminder</span>
                                </span>
                                <span className="text-[10px] text-[#A21CAF] font-mono">{t.timeDisplay}</span>
                              </div>
                              <h6 className="font-bold text-[#701A75] text-xs">{t.title}</h6>
                              {t.description && (
                                <p className="text-[11px] text-[#86198F] leading-snug">
                                  {t.description}
                                </p>
                              )}
                            </div>
                          ))}

                          {dayMilestoneNotes.map((nt) => (
                            <div key={nt.id} className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-[#1E293B] text-[10px] uppercase tracking-wider">
                                  {nt.milestoneNumber}: {nt.milestoneTitle}
                                </span>
                                <span className="text-[10px] text-[#64748B] font-mono">{nt.date}</span>
                              </div>
                              <p className="text-[11px] text-[#334155] leading-snug">
                                {nt.text}
                              </p>
                              <span className="text-[10px] text-[#64748B] block pt-0.5">
                                Logged by: {nt.author}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-3 text-center rounded-lg bg-[#F8FAFC] border border-dashed border-[#CBD5E1]">
                          <p className="text-[11px] text-[#6B7280]">
                            No work notes logged for {currentHeader.label}.
                          </p>
                          <button
                            onClick={() => {
                              setTargetMilestoneId("m2");
                              setNoteType("note");
                              setNoteDate(currentHeader.dateStr);
                              setShowAddNoteModal(true);
                            }}
                            className="mt-1.5 text-xs font-bold text-[#7C3AED] hover:underline cursor-pointer inline-flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Log work note</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 3. Milestone Quick Navigator (ONLY rendered when relatable and necessary!) */}
                    {relatedMilestone && (
                      <div className="bg-[#111827] text-white p-4 rounded-xl shadow-xs flex flex-col gap-2.5 animate-in fade-in">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#88D635]">
                            Linked Deliverable
                          </span>
                          <Badge variant={relatedMilestone.status === "review" ? "lime" : "outline"} className="text-[10px] py-0">
                            {relatedMilestone.escrowLabel}
                          </Badge>
                        </div>
                        <h4 className="font-bold text-sm text-white">
                          {relatedMilestone.title}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-[#9CA3AF] border-t border-white/10 pt-2">
                          <span>Target: {relatedMilestone.dateDisplay}</span>
                          <span className="font-mono font-bold text-white">
                            {formatCurrency(relatedMilestone.amount)}
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedMilestone(relatedMilestone)}
                          className="w-full mt-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#88D635]" />
                          <span>View Milestone Inspection</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ========================================================================= */}
          {/* MONTH GRID VIEW                                                           */}
          {/* ========================================================================= */}
          {calendarSpan === "month" && (
            <div className="border border-[#E5E7EB] rounded-xl p-3 sm:p-4 bg-white shadow-2xs flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-1.5 pb-2.5 border-b border-[#F1F3F6] text-center text-xs font-bold text-[#6B7280] shrink-0">
                {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
                  <div key={d} className="py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Month Days Grid - Fills entire remaining vertical height without stretching */}
              <div className="grid grid-cols-7 grid-rows-5 gap-2 mt-2 flex-1 min-h-0 overflow-hidden">
                {calendarDays.map((day) => {
                  const hasEvents =
                    day.milestones.length > 0 || day.meets.length > 0 || day.notes.length > 0;

                  return (
                    <div
                      key={day.iso}
                      className={cn(
                        "h-full min-h-0 p-2 sm:p-2.5 rounded-lg border transition-all flex flex-col justify-between overflow-hidden group",
                        day.isToday
                          ? "bg-[#F7FEE7] border-[#88D635] shadow-xs"
                          : "bg-[#FAFAFA] border-[#F1F3F6] hover:bg-white hover:border-[#CBD5E1]",
                        !day.isCurrentMonth && "opacity-40"
                      )}
                      onClick={() => {
                        if (day.milestones.length > 0) {
                          setSelectedMilestone(day.milestones[0]);
                        } else {
                          setNoteDate(day.iso);
                          setShowAddNoteModal(true);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px]",
                            day.isToday
                              ? "bg-[#88D635] text-[#0A2600]"
                              : "text-[#4B5563] group-hover:text-[#111827]"
                          )}
                        >
                          {day.dayNum}
                        </span>
                        {day.isToday && (
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[#2D6606] bg-[#E8F8D6] px-1 rounded-sm">
                            Today
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-1 mt-1 overflow-hidden">
                        {day.meets.map(({ meet }) => (
                          <div
                            key={meet.id}
                            className="px-1.5 py-0.5 rounded-sm bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] text-[10px] font-semibold flex items-center gap-1 truncate cursor-pointer hover:bg-[#DBEAFE]"
                            title={`${meet.title} (${meet.time})`}
                            onClick={(e) => {
                              e.stopPropagation();
                              showToast(`Opened video call: ${meet.title}`);
                            }}
                          >
                            <GoogleMeetIcon className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">{meet.title}</span>
                          </div>
                        ))}

                        {day.notes.map(({ note }) => (
                          <div
                            key={note.id}
                            className="px-1.5 py-0.5 rounded-sm bg-[#FAF5FF] text-[#7C3AED] border border-[#E9D5FF] text-[10px] font-medium flex items-center gap-1 truncate cursor-pointer"
                            title={note.text}
                            onClick={(e) => {
                              e.stopPropagation();
                              showToast(`Note: ${note.text}`);
                            }}
                          >
                            <StickyNote className="w-2.5 h-2.5 shrink-0 text-[#9333EA]" />
                            <span className="truncate">{note.text}</span>
                          </div>
                        ))}

                        {day.milestones.map((m) => (
                          <div
                            key={m.id}
                            className={cn(
                              "px-1.5 py-0.5 rounded-sm text-[10px] font-bold flex items-center gap-1 truncate cursor-pointer",
                              m.status === "completed" && "bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]",
                              m.status === "review" && "bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]",
                              m.status === "in_progress" && "bg-[#FFEDD5] text-[#C2410C] border border-[#FED7AA]",
                              m.status === "todo" && "bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]"
                            )}
                            title={`${m.title} - ${formatCurrency(m.amount)} (${m.escrowLabel})`}
                          >
                            <ShieldCheck className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">
                              ${m.amount} {m.title.split(" ")[0]}
                            </span>
                          </div>
                        ))}
                      </div>

                      {!hasEvents && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-right">
                          <span className="text-[9px] text-[#9CA3AF] hover:text-[#111827] cursor-pointer inline-flex items-center gap-0.5">
                            <Plus className="w-2.5 h-2.5" /> Add
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4b. VIEW 4: PROJECT ROADMAP & MILESTONE TIMELINE VIEW                     */}
      {/* ========================================================================= */}
      {viewMode === "timeline" && (
        <MilestoneProjectTimeline
          role={role}
          showToast={showToast}
          className="flex-1"
        />
      )}


      {/* ========================================================================= */}
      {/* 5. MODAL: MEET DETAIL INSPECTOR, CRUD ACTIONS & RESCHEDULE ENGINE         */}
      {/* ========================================================================= */}
      {activeMeetModal && (() => {
        const isCreator = !activeMeetModal.createdBy || activeMeetModal.createdBy === role;
        const organizerLabel = activeMeetModal.createdBy === "business" 
          ? "Sarah Chen (Client)" 
          : "Alex Rivera (Freelancer)";

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-2xl border border-black/[0.08] flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#F1F3F6] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center">
                    <GoogleMeetIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#111827]">{activeMeetModal.title}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-[#6B7280]">
                        {activeMeetModal.dayLabel} • {activeMeetModal.timeDisplay}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-[#F1F5F9] font-medium text-[#475569]">
                        Organized by {organizerLabel}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveMeetModal(null);
                    setIsEditingMeet(false);
                    setIsReschedulingMeet(false);
                  }}
                  className="text-[#9CA3AF] hover:text-[#111827] p-1 rounded-md cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Role Isolation Notice: Read-only if scheduled by counterparty */}
              {!isCreator && (
                <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-2.5 text-xs text-[#475569]">
                  <Lock className="w-4 h-4 text-[#94A3B8] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#1E293B]">Read-Only • Counterparty Session</span>
                    <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
                      This meeting was organized by {organizerLabel}. Only the session creator has permission to edit, reschedule, or cancel this meeting.
                    </p>
                  </div>
                </div>
              )}

              {/* Organizer CRUD Controls Bar */}
              {isCreator && (
                <div className="flex items-center justify-between gap-2 p-2 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setIsEditingMeet(!isEditingMeet);
                        setIsReschedulingMeet(false);
                      }}
                      className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer",
                        isEditingMeet
                          ? "bg-[#111827] text-white"
                          : "bg-white border border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6]"
                      )}
                    >
                      <Pencil className="w-3 h-3" />
                      <span>{isEditingMeet ? "Cancel Edit" : "Edit Details"}</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsReschedulingMeet(!isReschedulingMeet);
                        setIsEditingMeet(false);
                      }}
                      className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer",
                        isReschedulingMeet
                          ? "bg-[#111827] text-white"
                          : "bg-white border border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6]"
                      )}
                    >
                      <CalendarDays className="w-3 h-3" />
                      <span>{isReschedulingMeet ? "Cancel Reschedule" : "Reschedule"}</span>
                    </button>
                  </div>

                  <button
                    onClick={handleDeleteMeeting}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Cancel and delete meeting"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              )}

              {/* Mode A: In-Place Editing Form */}
              {isEditingMeet ? (
                <div className="space-y-3 p-3 rounded-lg bg-[#FAF5FF] border border-[#E9D5FF] text-xs">
                  <span className="font-bold text-[#581C87] uppercase tracking-wider text-[11px] block">
                    Edit Meeting Information
                  </span>
                  <div>
                    <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                      Meeting Title
                    </label>
                    <input
                      type="text"
                      value={editMeetTitle}
                      onChange={(e) => setEditMeetTitle(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-md border border-[#D8B4FE] bg-white text-xs text-[#111827] outline-hidden focus:ring-1 focus:ring-[#7C3AED]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                      Agenda & Description
                    </label>
                    <textarea
                      rows={2}
                      value={editMeetDesc}
                      onChange={(e) => setEditMeetDesc(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-md border border-[#D8B4FE] bg-white text-xs text-[#111827] outline-hidden focus:ring-1 focus:ring-[#7C3AED]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                      Google Meet URL
                    </label>
                    <input
                      type="text"
                      value={editMeetUrl}
                      onChange={(e) => setEditMeetUrl(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-md border border-[#D8B4FE] bg-white text-xs font-mono text-[#2563EB] outline-hidden focus:ring-1 focus:ring-[#7C3AED]"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingMeet(false)}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="dark"
                      size="sm"
                      onClick={handleSaveMeetEdit}
                      className="text-xs font-bold"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : isReschedulingMeet ? (
                /* Mode B: Reschedule Date & Slot Form */
                <div className="space-y-3 p-3 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-xs">
                  <span className="font-bold text-[#15803D] uppercase tracking-wider text-[11px] block">
                    Reschedule Meeting Slot
                  </span>

                  <div>
                    <label className="text-[11px] font-semibold text-[#4B5563] block mb-1.5">
                      Select New Day:
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                      {weekDayHeaders.map((dh) => {
                        const [dayShort, dateNum] = dh.label.split(" ");
                        return (
                          <button
                            key={dh.dayIndex}
                            type="button"
                            onClick={() => setRescheduleDayIndex(dh.dayIndex)}
                            className={cn(
                              "py-1.5 px-1 rounded-md text-center text-[11px] font-semibold transition-all cursor-pointer border",
                              rescheduleDayIndex === dh.dayIndex
                                ? "bg-[#111827] text-white border-[#111827] shadow-xs"
                                : "bg-white text-[#4B5563] border-[#E5E7EB] hover:bg-[#F3F4F6]"
                            )}
                          >
                            <div className="font-mono">{dayShort}</div>
                            <div className="text-[9px] opacity-80">{dateNum}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#4B5563] block mb-1.5">
                      Select Time Slot:
                    </label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {["8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM"].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setRescheduleSlot(slot)}
                          className={cn(
                            "py-1.5 px-1 rounded-md text-center text-xs font-semibold transition-all cursor-pointer border",
                            rescheduleSlot === slot
                              ? "bg-[#15803D] text-white border-[#15803D] shadow-xs"
                              : "bg-white text-[#4B5563] border-[#E5E7EB] hover:bg-[#F3F4F6]"
                          )}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1 border-t border-[#BBF7D0]">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsReschedulingMeet(false)}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="dark"
                      size="sm"
                      onClick={handleSaveReschedule}
                      className="text-xs font-bold bg-[#15803D] hover:bg-[#166534]"
                    >
                      Confirm Reschedule
                    </Button>
                  </div>
                </div>
              ) : (
                /* Mode C: Standard Inspection View */
                <>
                  {/* Video Call Link Card */}
                  <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                    <span className="text-[11px] font-bold text-[#475569] uppercase tracking-wider block flex items-center gap-1.5">
                      <GoogleMeetIcon className="w-3.5 h-3.5" />
                      <span>Google Meet Video Link:</span>
                    </span>
                    <div className="flex items-center justify-between gap-2 bg-white p-2 rounded-md border border-[#CBD5E1]">
                      <span className="font-mono text-xs text-[#2563EB] truncate">
                        {activeMeetModal.meetUrl || "https://meet.google.com/freelance-itch-sync"}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(activeMeetModal.meetUrl || "https://meet.google.com/freelance-itch-sync");
                          showToast("Copied Google Meet link to clipboard!");
                        }}
                        className="p-1 hover:bg-[#F1F5F9] rounded-md text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                        title="Copy Link"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Attendees & Description */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[#6B7280]">
                      <span>Category:</span>
                      <span className="font-semibold text-[#111827] capitalize">{activeMeetModal.category}</span>
                    </div>
                    {activeMeetModal.attendees && (
                      <div className="flex items-center justify-between text-[#6B7280]">
                        <span>Attendees:</span>
                        <span className="font-medium text-[#111827]">{activeMeetModal.attendees.join(", ")}</span>
                      </div>
                    )}
                    {activeMeetModal.description && (
                      <p className="text-[#4B5563] text-xs pt-1 leading-relaxed border-t border-[#F1F3F6]">
                        {activeMeetModal.description}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Bottom Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F3F6]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActiveMeetModal(null);
                    setIsEditingMeet(false);
                    setIsReschedulingMeet(false);
                  }}
                  className="text-xs"
                >
                  Close
                </Button>
                <Button
                  variant="dark"
                  size="sm"
                  onClick={() => {
                    window.open(activeMeetModal.meetUrl || "https://meet.google.com/freelance-itch-sync", "_blank");
                    showToast("Launching Google Meet video call...");
                  }}
                  className="text-xs font-bold gap-1.5 shadow-xs"
                >
                  <GoogleMeetIcon className="w-3.5 h-3.5" />
                  <span>Join Google Meet</span>
                </Button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* 5B. MODAL: ADD DELIVERABLE / MILESTONE TO PMS BACKLOG                      */}
      {/* ========================================================================= */}
      {showAddBacklogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-black/[0.08] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#F1F3F6] pb-3">
              <div>
                <h4 className="text-sm font-bold text-[#111827] flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-[#2D6606]" />
                  <span>Add Deliverable to PMS Backlog</span>
                </h4>
                <p className="text-[11px] text-[#6B7280]">
                  New items start in &quot;To Do / Scope Locked&quot; status pending escrow tranche funding.
                </p>
              </div>
              <button
                onClick={() => setShowAddBacklogModal(false)}
                className="text-[#9CA3AF] hover:text-[#111827] p-1 rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBacklogItem} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-[#374151] block mb-1">
                  Deliverable / Milestone Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stripe Webhook Listener & Payout Automation"
                  value={backlogTitle}
                  onChange={(e) => setBacklogTitle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#D1D5DB] focus:border-[#111827] focus:ring-1 focus:ring-[#111827] outline-hidden text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#374151] block mb-1">
                  Scope & Acceptance Specification
                </label>
                <textarea
                  rows={2}
                  placeholder="Detail deliverable acceptance criteria, test suite coverage, and IP assignment."
                  value={backlogDesc}
                  onChange={(e) => setBacklogDesc(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#D1D5DB] focus:border-[#111827] focus:ring-1 focus:ring-[#111827] outline-hidden text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-semibold text-[#374151] block mb-1">
                    Escrow Budget ($)
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    value={backlogAmount}
                    onChange={(e) => setBacklogAmount(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#D1D5DB] focus:border-[#111827] focus:ring-1 focus:ring-[#111827] outline-hidden text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#374151] block mb-1">
                    Target Delivery Date
                  </label>
                  <input
                    type="date"
                    value={backlogDueDate}
                    onChange={(e) => setBacklogDueDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#D1D5DB] focus:border-[#111827] focus:ring-1 focus:ring-[#111827] outline-hidden text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#374151] block mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Backend, Stripe, Security"
                  value={backlogTags}
                  onChange={(e) => setBacklogTags(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#D1D5DB] focus:border-[#111827] focus:ring-1 focus:ring-[#111827] outline-hidden text-xs"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] text-[11px] text-[#6B7280]">
                <span>Author: </span>
                <span className="font-semibold text-[#111827]">
                  {role === "business" ? "Sarah Chen (Client)" : "Alex Rivera (Freelancer)"}
                </span>
                <p className="mt-0.5 text-[10px]">
                  Only you ({role === "business" ? "Client" : "Freelancer"}) will be able to remove or delete this backlog item.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F3F6]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddBacklogModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="dark"
                  size="sm"
                  className="text-xs font-bold gap-1 bg-[#111827] text-white hover:bg-black"
                >
                  <Plus className="w-3.5 h-3.5 text-[#88D635]" />
                  <span>Queue into Backlog</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: ADD NOTE OR MEET COMPOSER                                      */}
      {/* ========================================================================= */}
      {showAddNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-black/[0.08] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#F1F3F6] pb-3">
              <div className="flex items-center gap-2">
                {noteType === "meet" ? (
                  <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center">
                    <Video className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-[#F4F5F7] text-[#111827] flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                )}
                <h4 className="text-sm font-bold text-[#111827]">
                  {noteType === "meet" ? "Schedule Client / Builder Meet" : "Add Milestone Work Note"}
                </h4>
              </div>
              <button
                onClick={() => setShowAddNoteModal(false)}
                className="text-[#9CA3AF] hover:text-[#111827] p-1 rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center bg-[#F4F5F7] p-1 rounded-lg text-xs font-semibold text-[#6B7280]">
              <button
                onClick={() => setNoteType("note")}
                className={cn(
                  "flex-1 py-1 px-3 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5",
                  noteType === "note" ? "bg-white text-[#111827] shadow-xs font-bold" : "hover:text-[#111827]"
                )}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Work Note</span>
              </button>
              <button
                onClick={() => setNoteType("meet")}
                className={cn(
                  "flex-1 py-1 px-3 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5",
                  noteType === "meet" ? "bg-white text-[#111827] shadow-xs font-bold" : "hover:text-[#111827]"
                )}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Review Meet / Call</span>
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">
                Target Milestone:
              </label>
              <select
                value={targetMilestoneId}
                onChange={(e) => setTargetMilestoneId(e.target.value)}
                className="text-xs bg-[#F4F5F7] border border-[#E5E7EB] rounded-lg px-3 py-2 outline-hidden text-[#111827] font-medium"
              >
                {milestones.map((m) => (
                  <option key={m.id} value={m.id}>
                    {typeof m.number === "number" ? `M${m.number}: ` : `${m.number}: `}
                    {m.title} (${formatCurrency(m.amount)})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">
                {noteType === "meet" ? "Meet Agenda / Call Title:" : "Note / Update Content:"}
              </label>
              {noteType === "meet" ? (
                <input
                  type="text"
                  placeholder="e.g., Milestone 2 Acceptance Review & Demo Call"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="text-xs bg-[#F4F5F7] border border-[#E5E7EB] rounded-lg px-3 py-2 outline-hidden text-[#111827]"
                />
              ) : (
                <textarea
                  rows={3}
                  placeholder="e.g., Client requested webhook retry spec with exponential backoff..."
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="text-xs bg-[#F4F5F7] border border-[#E5E7EB] rounded-lg p-3 outline-hidden text-[#111827] resize-none"
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[#6B7280]">Date:</label>
                <input
                  type="date"
                  value={noteDate}
                  onChange={(e) => setNoteDate(e.target.value)}
                  className="bg-[#F4F5F7] border border-[#E5E7EB] rounded-lg px-2.5 py-1.5 text-xs text-[#111827]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[#6B7280]">Time Slot:</label>
                <input
                  type="text"
                  value={noteTime}
                  onChange={(e) => setNoteTime(e.target.value)}
                  placeholder="08:00 AM"
                  className="bg-[#F4F5F7] border border-[#E5E7EB] rounded-lg px-2.5 py-1.5 text-xs text-[#111827]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F3F6]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddNoteModal(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="dark"
                size="sm"
                onClick={handleSaveNoteOrMeet}
                className="text-xs font-bold gap-1.5 shadow-xs"
              >
                <Check className="w-3.5 h-3.5 text-[#88D635]" />
                <span>Save to Milestone & Calendar</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL: DETAILED MILESTONE INSPECTOR DRAWER                              */}
      {/* ========================================================================= */}
      {selectedMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-black/[0.08] flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#F1F3F6] pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider",
                      selectedMilestone.status === "completed" && "bg-[#DCFCE7] text-[#15803D]",
                      selectedMilestone.status === "review" && "bg-[#FEF3C7] text-[#92400E]",
                      selectedMilestone.status === "in_progress" && "bg-[#FFEDD5] text-[#C2410C]",
                      selectedMilestone.status === "todo" && "bg-[#F3F4F6] text-[#4B5563]"
                    )}
                  >
                    {selectedMilestone.escrowLabel}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#111827]">
                    {formatCurrency(selectedMilestone.amount)}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#111827]">
                  {selectedMilestone.title}
                </h3>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  {selectedMilestone.description}
                </p>
              </div>

              <button
                onClick={() => setSelectedMilestone(null)}
                className="text-[#9CA3AF] hover:text-[#111827] p-1 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedMilestone.status === "review" && (
              <div className="p-3 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] flex items-start gap-2.5 text-xs text-[#92400E]">
                <Clock className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">
                    72-Hour Dead-Man Watchdog Active • {selectedMilestone.watchdogTimer}
                  </span>
                  <p className="text-[11px] text-[#B45309] mt-0.5 leading-snug">
                    {isClient
                      ? "If no revision is requested before the SLA expires, funds will automatically disburse to the builder and Milestone 2 IP will transfer."
                      : "Your payment is protected. If client does not respond within the SLA, escrow will automatically release $1,500.00 to your bank account."}
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                Verified Deliverables Checklist:
              </span>
              <div className="p-3 rounded-lg bg-[#F8F9FA] border border-black/[0.04] space-y-2 text-xs">
                {selectedMilestone.deliverables.map((d) => (
                  <div key={d.id} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {d.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-[#D1D5DB] shrink-0" />
                      )}
                      <span className={cn(d.completed ? "text-[#111827]" : "text-[#6B7280]")}>
                        {d.title}
                      </span>
                    </div>
                    {d.gitCommit && (
                      <span className="font-mono text-[10px] text-[#6B7280] bg-white px-1.5 py-0.5 rounded-sm border border-[#E5E7EB]">
                        {d.gitCommit}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {selectedMilestone.loomUrl && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => showToast("Playing Loom Walkthrough Video (04:18)")}
                  className="flex items-center gap-2 p-2 rounded-lg bg-[#111827] text-white hover:bg-black transition-colors cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-[#88D635] text-[#0F2900] flex items-center justify-center shrink-0">
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </div>
                  <div className="text-left truncate">
                    <span className="font-semibold block truncate">Loom Video Demo</span>
                    <span className="text-[10px] text-zinc-400">04:18 Walkthrough</span>
                  </div>
                </button>

                <button
                  onClick={() => showToast("Opened GitHub PR Diff (#42)")}
                  className="flex items-center gap-2 p-2 rounded-lg bg-[#F4F5F7] text-[#111827] hover:bg-[#E5E7EB] transition-colors cursor-pointer border border-[#E5E7EB]"
                >
                  <GitCommit className="w-4 h-4 text-[#6B7280] shrink-0" />
                  <div className="text-left truncate">
                    <span className="font-semibold block truncate">PR #42 Diff</span>
                    <span className="text-[10px] text-[#6B7280] font-mono">feat/oauth-providers</span>
                  </div>
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#4B5563] flex items-center gap-1">
                    <Video className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Scheduled Meets ({selectedMilestone.meets.length})</span>
                  </span>
                  <button
                    onClick={() => {
                      setTargetMilestoneId(selectedMilestone.id);
                      setNoteType("meet");
                      setShowAddNoteModal(true);
                    }}
                    className="text-[10px] text-[#2563EB] font-bold hover:underline cursor-pointer"
                  >
                    + Schedule
                  </button>
                </div>
                {selectedMilestone.meets.length > 0 ? (
                  <div className="flex flex-col gap-1.5">
                    {selectedMilestone.meets.map((mt) => (
                      <div
                        key={mt.id}
                        className="p-2 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-xs flex flex-col gap-0.5"
                      >
                        <span className="font-bold text-[#1D4ED8] truncate">{mt.title}</span>
                        <div className="flex items-center justify-between text-[10px] text-[#2563EB]">
                          <span>{mt.date} • {mt.time}</span>
                          <span
                            onClick={() => window.open(mt.link, "_blank")}
                            className="font-bold underline cursor-pointer"
                          >
                            Join Meet &rarr;
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-[#9CA3AF] italic">No video calls scheduled.</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#4B5563] flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-[#111827]" />
                    <span>Work Notes ({selectedMilestone.notes.length})</span>
                  </span>
                  <button
                    onClick={() => {
                      setTargetMilestoneId(selectedMilestone.id);
                      setNoteType("note");
                      setShowAddNoteModal(true);
                    }}
                    className="text-[10px] text-[#111827] font-bold hover:underline cursor-pointer"
                  >
                    + Add Note
                  </button>
                </div>
                {selectedMilestone.notes.length > 0 ? (
                  <div className="flex flex-col gap-1.5">
                    {selectedMilestone.notes.map((nt) => (
                      <div
                        key={nt.id}
                        className="p-2 rounded-lg bg-[#F8F9FA] border border-black/[0.04] text-xs flex flex-col gap-0.5"
                      >
                        <div className="flex items-center justify-between text-[10px] font-semibold text-[#6B7280]">
                          <span>{nt.author}</span>
                          <span>{nt.date}</span>
                        </div>
                        <span className="text-[#374151] text-[11px]">{nt.text}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-[#9CA3AF] italic">No notes logged yet.</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F1F3F6]">
              {selectedMilestone.status === "review" && (
                <>
                  {isClient ? (
                    <Button
                      variant="lime"
                      size="sm"
                      onClick={() => {
                        setSelectedMilestone(null);
                        onReleaseEscrow();
                      }}
                      className="text-xs font-bold shadow-xs"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                      Approve & Release {formatCurrency(selectedMilestone.amount)}
                    </Button>
                  ) : (
                    <Button
                      variant="dark"
                      size="sm"
                      onClick={() => showToast("Pinged Sarah Chen for milestone review!")}
                      className="text-xs font-bold gap-1 shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5 text-[#88D635]" />
                      Nudge Client for Review
                    </Button>
                  )}
                </>
              )}

              {selectedMilestone.status === "todo" && selectedMilestone.escrowStatus === "pre_funding_required" && (
                <>
                  {isClient ? (
                    <Button
                      variant="dark"
                      size="sm"
                      onClick={() => {
                        setSelectedMilestone(null);
                        onFundEscrow();
                      }}
                      className="text-xs font-bold"
                    >
                      Pre-Fund {formatCurrency(selectedMilestone.amount)} Escrow
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => showToast("Funding reminder sent to client!")}
                      className="text-xs font-semibold"
                    >
                      Request Escrow Deposit
                    </Button>
                  )}
                </>
              )}

              {/* Backlog Item Removal for Creator */}
              {selectedMilestone.status === "todo" && (
                <>
                  {(!selectedMilestone.createdBy || selectedMilestone.createdBy === role) ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteBacklogMilestone(selectedMilestone.id)}
                      className="text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 font-semibold gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove from Backlog</span>
                    </Button>
                  ) : (
                    <span className="text-[11px] text-[#6B7280] italic flex items-center gap-1">
                      <Lock className="w-3 h-3 text-[#9CA3AF]" />
                      <span>Created by {selectedMilestone.createdBy === "business" ? "Client" : "Freelancer"} (Read-only)</span>
                    </span>
                  )}
                </>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedMilestone(null)}
                className="text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// SUB-COMPONENT: KANBAN BOARD CARD (Rich Project Card with Drag Handle)
// =========================================================================
interface MilestoneBoardCardProps {
  milestone: MilestoneItem;
  isClient: boolean;
  isHighlight?: boolean;
  isDragging?: boolean;
  onDragStart?: (id: string) => void;
  onDragEnd?: () => void;
  onSelect: () => void;
  onAddNote: () => void;
  onAddMeet: () => void;
  onFund: () => void;
  onRelease: () => void;
  showToast: (msg: string) => void;
  getTagBadgeStyle: (tag: string) => string;
}

function MilestoneBoardCard({
  milestone,
  isClient,
  isHighlight,
  isDragging,
  onDragStart,
  onDragEnd,
  onSelect,
  onAddNote,
  onAddMeet,
  onFund,
  onRelease,
  showToast,
  getTagBadgeStyle,
}: MilestoneBoardCardProps) {
  const percent = Math.round((milestone.progress.completed / milestone.progress.total) * 100);

  return (
    <div
      draggable={true}
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", milestone.id);
        onDragStart?.(milestone.id);
      }}
      onDragEnd={() => onDragEnd?.()}
      onClick={onSelect}
      className={cn(
        "p-3.5 rounded-xl bg-white border transition-all duration-150 shadow-[0px_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0px_4px_16px_rgba(0,0,0,0.06)] hover:border-[#CBD5E1] cursor-grab active:cursor-grabbing flex flex-col justify-between gap-3 group select-none",
        isDragging && "opacity-40 scale-95 border-dashed border-[#88D635]",
        isHighlight
          ? "border-[#FDE68A] ring-1 ring-[#F59E0B]/30"
          : "border-black/[0.06]"
      )}
    >
      <div className="flex items-center justify-between gap-1.5">
        <span
          className={cn(
            "font-mono text-[10px] font-bold px-2 py-0.5 rounded-md",
            milestone.status === "completed" && "bg-[#DCFCE7] text-[#15803D]",
            milestone.status === "review" && "bg-[#FEF3C7] text-[#92400E]",
            milestone.status === "in_progress" && "bg-[#FFEDD5] text-[#C2410C]",
            milestone.status === "todo" && "bg-[#F4F5F7] text-[#4B5563]"
          )}
        >
          {milestone.amount > 0 ? formatCurrency(milestone.amount) : "IP Deed"}
        </span>

        <span
          className={cn(
            "text-[10px] font-semibold flex items-center gap-1",
            milestone.status === "completed" && "text-[#15803D]",
            milestone.status === "review" && "text-[#D97706] font-bold",
            milestone.status === "in_progress" && "text-[#EA580C]",
            milestone.status === "todo" && "text-[#6B7280]"
          )}
        >
          {milestone.status === "review" && <Clock className="w-3 h-3" />}
          {milestone.status === "completed" && <CheckCircle2 className="w-3 h-3" />}
          <span>{milestone.escrowLabel}</span>
        </span>
      </div>

      <div>
        <h5 className="text-xs font-bold text-[#111827] group-hover:text-black line-clamp-2">
          {milestone.title}
        </h5>
        <p className="text-[11px] text-[#6B7280] line-clamp-2 mt-1 leading-snug">
          {milestone.description}
        </p>
      </div>

      {/* Tags row */}
      <div className="flex items-center gap-1 flex-wrap">
        {milestone.tags.map((tag) => (
          <span
            key={tag}
            className={cn("px-1.5 py-0.5 rounded-sm text-[9px] font-medium border", getTagBadgeStyle(tag))}
          >
            {tag}
          </span>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between text-[10px] font-semibold text-[#4B5563] mb-1">
          <span className="flex items-center gap-1">
            <span className="text-[#9CA3AF]">Progress:</span>
            <span>{milestone.progress.completed}/{milestone.progress.total}</span>
          </span>
          <span className="font-mono">{percent}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-[#F3F4F6] overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              milestone.status === "completed" && "bg-[#15803D]",
              milestone.status === "review" && "bg-[#F59E0B]",
              milestone.status === "in_progress" && "bg-[#EA580C]",
              milestone.status === "todo" && "bg-[#E5E7EB]"
            )}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {milestone.meets.length > 0 && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            window.open(milestone.meets[0].link, "_blank");
            showToast(`Opened video meet: ${milestone.meets[0].link}`);
          }}
          className="p-1.5 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-[10px] text-[#1D4ED8] hover:bg-[#DBEAFE] transition-colors flex items-center justify-between font-semibold"
        >
          <span className="flex items-center gap-1 truncate">
            <Video className="w-3 h-3 shrink-0" />
            <span className="truncate">{milestone.meets[0].title}</span>
          </span>
          <span className="font-mono shrink-0 ml-1 underline">Join &rarr;</span>
        </div>
      )}

      <div className="pt-2 border-t border-[#F1F3F6] flex items-center justify-between text-[11px] text-[#6B7280]">
        <div className="flex items-center gap-1.5">
          <CalendarIcon className="w-3 h-3 text-[#9CA3AF]" />
          <span className="text-[10px] font-mono">{milestone.dateDisplay.split(",")[0]}</span>
        </div>

        <div className="flex items-center gap-2">
          {milestone.notes.length > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] text-[#6B7280]" title={`${milestone.notes.length} notes`}>
              <MessageSquare className="w-3 h-3" />
              <span>{milestone.notes.length}</span>
            </span>
          )}

          {milestone.deliverables.length > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] text-[#6B7280]" title={`${milestone.deliverables.length} deliverables`}>
              <Paperclip className="w-3 h-3" />
              <span>{milestone.deliverables.length}</span>
            </span>
          )}

          <div className="flex -space-x-1 ml-1">
            {milestone.assignees.map((a, i) => (
              <div
                key={i}
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border border-white shadow-2xs",
                  a.bg
                )}
                title={a.name}
              >
                {a.initials}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
