"use client";

import React, { useState } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";
import { Card } from "./card";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lock,
  Unlock,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Edit3,
  Plus,
  Trash2,
  FileText,
  Video,
  GitCommit,
  Check,
  X,
  ExternalLink,
  Sliders,
  Flame,
  ArrowRight,
  HelpCircle,
  Send,
  AlertTriangle,
  History,
  TrendingUp,
} from "lucide-react";

export interface TimelineMilestone {
  id: string;
  number: string; // e.g. "M1", "M2"
  title: string;
  description: string;
  startMonth: number; // 1-indexed (1 to totalMonths)
  endMonth: number;
  startDate: string;
  endDate: string;
  escrowAmount: number;
  status: "completed" | "in_review" | "in_progress" | "proposed" | "delayed";
  progressPercent: number;
  maxIterations: number; // Fixed number of iterations contractually allowed (e.g. 2)
  usedIterations: number; // Current iterations used
  iterationHistory: {
    round: number;
    requestedBy: string;
    date: string;
    note: string;
    status: "completed" | "active";
  }[];
  deliverables: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  proofArtifacts?: {
    type: "loom" | "git" | "figma" | "doc";
    title: string;
    url: string;
    meta: string;
  }[];
}

export interface MutualAmendment {
  id: string;
  proposedBy: string;
  proposerRole: "business" | "freelancer";
  targetMilestoneId: string;
  milestoneNumber: string;
  currentSchedule: string;
  proposedSchedule: string;
  proposedStartMonth: number;
  proposedEndMonth: number;
  reason: string;
  date: string;
  freelancerApproved: boolean;
  clientApproved: boolean;
}

interface MilestoneProjectTimelineProps {
  role: "business" | "freelancer";
  showToast?: (message: string) => void;
  className?: string;
}

const INITIAL_MILESTONES: TimelineMilestone[] = [
  {
    id: "m1",
    number: "M1",
    title: "Discovery & Database Architecture",
    description: "Database schema design, Prisma ORM migrations, PostgreSQL connection pooling, and Row-Level Security policies.",
    startMonth: 1,
    endMonth: 1,
    startDate: "Sep 01, 2026",
    endDate: "Sep 28, 2026",
    escrowAmount: 1500,
    status: "completed",
    progressPercent: 100,
    maxIterations: 2,
    usedIterations: 1,
    iterationHistory: [
      {
        round: 1,
        requestedBy: "Sarah Chen (Client)",
        date: "Sep 18, 2026",
        note: "Add composite index on tenant_id + created_at for fast analytical queries.",
        status: "completed",
      },
    ],
    deliverables: [
      { id: "d1", title: "Prisma schema with multi-tenant RLS", completed: true },
      { id: "d2", title: "Dockerized local PostgreSQL test container", completed: true },
      { id: "d3", title: "Database migration script & seed data", completed: true },
    ],
    proofArtifacts: [
      { type: "git", title: "Migration: Init multi-tenant RLS", url: "#", meta: "git: 3a992e1" },
      { type: "loom", title: "Database Schema Walkthrough (16:9)", url: "#", meta: "14.2 mins" },
    ],
  },
  {
    id: "m2",
    number: "M2",
    title: "NextAuth & Core API Engine",
    description: "Google & GitHub OAuth, JWT session cookie encryption, rate-limiting middleware, and responsive Bento command layout.",
    startMonth: 2,
    endMonth: 3,
    startDate: "Oct 01, 2026",
    endDate: "Nov 15, 2026",
    escrowAmount: 1950,
    status: "in_review",
    progressPercent: 90,
    maxIterations: 2,
    usedIterations: 1,
    iterationHistory: [
      {
        round: 1,
        requestedBy: "Sarah Chen (Client)",
        date: "Oct 24, 2026",
        note: "Include refresh token rotation in NextAuth callbacks and lighten card borders.",
        status: "completed",
      },
    ],
    deliverables: [
      { id: "d4", title: "NextAuth Google & GitHub OAuth integration", completed: true },
      { id: "d5", title: "JWT token encryption & Redis token revoking", completed: true },
      { id: "d6", title: "Bento command grid matching Figma reference", completed: true },
      { id: "d7", title: "72h SLA review package & test suite", completed: false },
    ],
    proofArtifacts: [
      { type: "loom", title: "NextAuth OAuth Callback Demo (1080p)", url: "#", meta: "18.5 mins" },
      { type: "git", title: "feat(auth): next-auth google callback", url: "#", meta: "git: 8c3f20a" },
    ],
  },
  {
    id: "m3",
    number: "M3",
    title: "Stripe Connect & Escrow Vault",
    description: "Stripe Connect Custom/Express accounts, escrow milestone hold/release contracts, dispute safeguards, and webhook handlers.",
    startMonth: 3,
    endMonth: 5,
    startDate: "Nov 16, 2026",
    endDate: "Jan 15, 2027",
    escrowAmount: 1500,
    status: "in_progress",
    progressPercent: 35,
    maxIterations: 2,
    usedIterations: 0,
    iterationHistory: [],
    deliverables: [
      { id: "d8", title: "Stripe Connect Express onboarding flow", completed: true },
      { id: "d9", title: "Escrow hold & milestone progressive release API", completed: false },
      { id: "d10", title: "Idempotent Stripe webhook listeners", completed: false },
      { id: "d11", title: "Dispute & chargeback mitigation safeguards", completed: false },
    ],
    proofArtifacts: [
      { type: "git", title: "feat(escrow): stripe connect express endpoints", url: "#", meta: "git: 9a2f180" },
    ],
  },
  {
    id: "m4",
    number: "M4",
    title: "Scope Firewall & Resource Vault",
    description: "Cryptographic IP transfer progressive release, client resource vault with granular access, and change order billing.",
    startMonth: 5,
    endMonth: 6,
    startDate: "Jan 16, 2027",
    endDate: "Feb 28, 2027",
    escrowAmount: 1200,
    status: "proposed",
    progressPercent: 0,
    maxIterations: 2,
    usedIterations: 0,
    iterationHistory: [],
    deliverables: [
      { id: "d12", title: "Scope firewall automated change order generator", completed: false },
      { id: "d13", title: "Resource vault with download audit trail", completed: false },
      { id: "d14", title: "Automated IP transfer receipt generation", completed: false },
    ],
  },
  {
    id: "m5",
    number: "M5",
    title: "Security Audit, Beta & Production Launch",
    description: "OWASP penetration testing, end-to-end Playwright tests, load testing 1,000 req/sec, and AWS/Vercel production handover.",
    startMonth: 7,
    endMonth: 8,
    startDate: "Mar 01, 2027",
    endDate: "Apr 30, 2027",
    escrowAmount: 1800,
    status: "proposed",
    progressPercent: 0,
    maxIterations: 2,
    usedIterations: 0,
    iterationHistory: [],
    deliverables: [
      { id: "d15", title: "Third-party OWASP security audit signoff", completed: false },
      { id: "d16", title: "Playwright automated test suite (95% coverage)", completed: false },
      { id: "d17", title: "Production environment DNS & SSL cutover", completed: false },
    ],
  },
];

const MONTH_LABELS_8 = [
  { monthIndex: 1, label: "Month 1", name: "Sep 2026", isCurrent: false },
  { monthIndex: 2, label: "Month 2", name: "Oct 2026", isCurrent: true },
  { monthIndex: 3, label: "Month 3", name: "Nov 2026", isCurrent: false },
  { monthIndex: 4, label: "Month 4", name: "Dec 2026", isCurrent: false },
  { monthIndex: 5, label: "Month 5", name: "Jan 2027", isCurrent: false },
  { monthIndex: 6, label: "Month 6", name: "Feb 2027", isCurrent: false },
  { monthIndex: 7, label: "Month 7", name: "Mar 2027", isCurrent: false },
  { monthIndex: 8, label: "Month 8", name: "Apr 2027", isCurrent: false },
];

export function MilestoneProjectTimeline({
  role,
  showToast = () => {},
  className,
}: MilestoneProjectTimelineProps) {
  // Timeline Milestones State
  const [milestones, setMilestones] = useState<TimelineMilestone[]>(INITIAL_MILESTONES);
  const [totalMonths, setTotalMonths] = useState<number>(8);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>("m2");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Contract & Mutual Agreement State
  // "once agreed upon the timelines can only be changes on both the parties agreements"
  const [agreementStatus, setAgreementStatus] = useState<"agreed" | "draft_proposed" | "amendment_pending">("agreed");
  const [freelancerAgreed, setFreelancerAgreed] = useState<boolean>(true);
  const [clientAgreed, setClientAgreed] = useState<boolean>(true);

  // Active Pending Mutual Amendment (if any)
  const [pendingAmendment, setPendingAmendment] = useState<MutualAmendment | null>({
    id: "amend-101",
    proposedBy: "Alex Rivera (Freelancer)",
    proposerRole: "freelancer",
    targetMilestoneId: "m3",
    milestoneNumber: "M3",
    currentSchedule: "Month 3 – Month 5 (Nov 16 – Jan 15)",
    proposedSchedule: "Month 3 – Month 6 (Nov 16 – Feb 15)",
    proposedStartMonth: 3,
    proposedEndMonth: 6,
    reason: "Stripe Connect Express KYC onboarding requires extra custom webhook handlers and sandbox verification with compliance.",
    date: "Sep 29, 2026",
    freelancerApproved: true,
    clientApproved: false,
  });

  // Modals
  const [showTimelineSetterModal, setShowTimelineSetterModal] = useState(false);
  const [showAmendmentModal, setShowAmendmentModal] = useState(false);
  const [showIterationModal, setShowIterationModal] = useState(false);
  const [iterationNote, setIterationNote] = useState("");

  // Editor form state for Timeline Setter
  const [draftMilestones, setDraftMilestones] = useState<TimelineMilestone[]>(INITIAL_MILESTONES);
  const [draftTotalMonths, setDraftTotalMonths] = useState<number>(8);
  const [amendmentReason, setAmendmentReason] = useState("");
  const [amendmentTargetMilestone, setAmendmentTargetMilestone] = useState("m3");
  const [amendmentNewEndMonth, setAmendmentNewEndMonth] = useState(6);

  const selectedMilestone = milestones.find((m) => m.id === selectedMilestoneId) || milestones[0];

  // Helper to get month list according to totalMonths
  const activeMonthList = Array.from({ length: totalMonths }, (_, i) => {
    const idx = i + 1;
    const existing = MONTH_LABELS_8.find((m) => m.monthIndex === idx);
    if (existing) return existing;
    const yearOffset = Math.floor((i + 8) / 12);
    const mNum = ((i + 8) % 12) + 1;
    return {
      monthIndex: idx,
      label: `Month ${idx}`,
      name: `M${idx} - 2027`,
      isCurrent: false,
    };
  });

  // Filtered milestones
  const filteredMilestones = milestones.filter((m) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "active") return m.status === "in_progress" || m.status === "in_review";
    if (filterStatus === "completed") return m.status === "completed";
    if (filterStatus === "proposed") return m.status === "proposed";
    return true;
  });

  // Handlers for Mutual Agreement Protocol
  const handleApproveAmendment = () => {
    if (!pendingAmendment) return;

    // Apply the schedule change to target milestone
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === pendingAmendment.targetMilestoneId) {
          return {
            ...m,
            endMonth: pendingAmendment.proposedEndMonth,
            endDate: "Feb 15, 2027",
          };
        }
        return m;
      })
    );

    setPendingAmendment(null);
    setAgreementStatus("agreed");
    setFreelancerAgreed(true);
    setClientAgreed(true);
    showToast("Mutual Agreement Sealed: Timeline updated with both parties' cryptographic signatures.");
  };

  const handleDeclineAmendment = () => {
    setPendingAmendment(null);
    setAgreementStatus("agreed");
    showToast("Amendment proposal declined. Contract schedule remains locked to existing baseline.");
  };

  const handleProposeAmendmentSubmit = () => {
    if (!amendmentReason.trim()) {
      showToast("Please provide a reason for the timeline adjustment.");
      return;
    }

    const target = milestones.find((m) => m.id === amendmentTargetMilestone);
    if (!target) return;

    const newAmend: MutualAmendment = {
      id: `amend-${Date.now()}`,
      proposedBy: role === "business" ? "Sarah Chen (Client)" : "Alex Rivera (Freelancer)",
      proposerRole: role,
      targetMilestoneId: target.id,
      milestoneNumber: target.number,
      currentSchedule: `Month ${target.startMonth} – Month ${target.endMonth}`,
      proposedSchedule: `Month ${target.startMonth} – Month ${amendmentNewEndMonth}`,
      proposedStartMonth: target.startMonth,
      proposedEndMonth: amendmentNewEndMonth,
      reason: amendmentReason,
      date: "Sep 30, 2026",
      freelancerApproved: role === "freelancer",
      clientApproved: role === "business",
    };

    setPendingAmendment(newAmend);
    setAgreementStatus("amendment_pending");
    setShowAmendmentModal(false);
    setAmendmentReason("");
    showToast(`Timeline amendment proposal submitted to ${role === "business" ? "Alex Rivera" : "Sarah Chen"} for mutual agreement.`);
  };

  // Iteration submission handler (enforces fixed limit)
  const handleRequestIteration = () => {
    if (!selectedMilestone) return;

    // HARD CAP CHECK
    if (selectedMilestone.usedIterations >= selectedMilestone.maxIterations) {
      showToast(`Iteration Limit Reached! Exactly ${selectedMilestone.maxIterations} iterations were agreed in SOW contract.`);
      return;
    }

    if (!iterationNote.trim()) {
      showToast("Please enter specific feedback notes for this revision round.");
      return;
    }

    const nextRound = selectedMilestone.usedIterations + 1;
    const newHistoryItem = {
      round: nextRound,
      requestedBy: role === "business" ? "Sarah Chen (Client)" : "Alex Rivera (Freelancer)",
      date: "Sep 30, 2026",
      note: iterationNote.trim(),
      status: "active" as const,
    };

    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === selectedMilestone.id) {
          return {
            ...m,
            usedIterations: nextRound,
            iterationHistory: [newHistoryItem, ...m.iterationHistory],
          };
        }
        return m;
      })
    );

    setShowIterationModal(false);
    setIterationNote("");

    if (nextRound >= selectedMilestone.maxIterations) {
      showToast(`Iteration ${nextRound} of ${selectedMilestone.maxIterations} logged. Note: Maximum contractual revision quota now reached.`);
    } else {
      showToast(`Iteration ${nextRound} of ${selectedMilestone.maxIterations} submitted for review.`);
    }
  };

  // Open Timeline Setter Modal
  const handleOpenTimelineSetter = () => {
    setDraftMilestones(JSON.parse(JSON.stringify(milestones)));
    setDraftTotalMonths(totalMonths);
    setShowTimelineSetterModal(true);
  };

  // Save Timeline from Setter
  const handleSaveTimelineSetter = () => {
    if (agreementStatus === "agreed") {
      // If already agreed, editing triggers an amendment requirement!
      setShowTimelineSetterModal(false);
      setShowAmendmentModal(true);
      showToast("Timeline is legally locked. To modify it, submit a Mutual Amendment Request for both parties to sign.");
      return;
    }

    setMilestones(draftMilestones);
    setTotalMonths(draftTotalMonths);
    setShowTimelineSetterModal(false);
    setAgreementStatus("draft_proposed");
    setFreelancerAgreed(role === "freelancer");
    setClientAgreed(role === "business");
    showToast("Updated timeline proposal saved. Both parties must sign to lock the schedule.");
  };

  return (
    <div className={cn("w-full flex flex-col gap-3.5 flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-0.5 pb-3", className)}>
      {/* ========================================================================= */}
      {/* 1. MUTUAL AGREEMENT STATUS BAR & LOCK PROTOCOL                             */}
      {/* ========================================================================= */}
      <div className={cn(
        "rounded-xl border p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs transition-all",
        agreementStatus === "agreed"
          ? "bg-gradient-to-r from-[#F0FDF4] to-[#F7FEE7] border-[#86EFAC]/70"
          : agreementStatus === "amendment_pending"
          ? "bg-gradient-to-r from-[#FFFBEB] to-[#FEF3C7] border-[#FDE68A]"
          : "bg-gradient-to-r from-[#EFF6FF] to-[#EDE9FE] border-[#BFDBFE]"
      )}>
        <div className="flex items-start sm:items-center gap-3">
          <div className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs",
            agreementStatus === "agreed"
              ? "bg-[#111827] text-[#88D635]"
              : agreementStatus === "amendment_pending"
              ? "bg-[#D97706] text-white"
              : "bg-[#2563EB] text-white"
          )}>
            {agreementStatus === "agreed" ? (
              <Lock className="w-4 h-4 text-[#88D635]" />
            ) : agreementStatus === "amendment_pending" ? (
              <AlertTriangle className="w-4 h-4 text-white" />
            ) : (
              <Unlock className="w-4 h-4 text-white" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-[#111827]">
                {agreementStatus === "agreed"
                  ? "Timeline Locked by Mutual Consensus"
                  : agreementStatus === "amendment_pending"
                  ? "Mutual Amendment Requested (Awaiting Dual Signature)"
                  : "Proposed Project Timeline (Draft)"}
              </h3>
              <Badge
                variant={agreementStatus === "agreed" ? "lime" : agreementStatus === "amendment_pending" ? "orange" : "outline"}
                className="text-[10px] uppercase font-bold py-0.5"
              >
                {agreementStatus === "agreed" ? "Scope Sealed" : agreementStatus === "amendment_pending" ? "Under Review" : "Draft Proposal"}
              </Badge>
            </div>
            <p className="text-xs text-[#4B5563] mt-0.5">
              {agreementStatus === "agreed"
                ? "Both parties signed on Sep 13, 2026. Schedule & iteration caps can only be changed with mutual approval."
                : agreementStatus === "amendment_pending"
                ? `Pending change proposed by ${pendingAmendment?.proposedBy}. Both client & freelancer must approve.`
                : "Timeline schedule proposed. Once both parties agree, schedule locks permanently into escrow contract."}
            </p>
          </div>
        </div>

        {/* Dual Signature Badges & Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <div className="flex items-center gap-2 text-[11px] font-mono bg-white/80 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-black/[0.06] shadow-2xs">
            <span className="text-[#6B7280]">Signatures:</span>
            <span className={cn("flex items-center gap-1 font-bold", freelancerAgreed ? "text-[#166534]" : "text-[#9CA3AF]")}>
              {freelancerAgreed ? <CheckCircle2 className="w-3.5 h-3.5 text-[#2D6606]" /> : <Clock className="w-3.5 h-3.5" />}
              Alex (Dev)
            </span>
            <span className="text-[#D1D5DB]">•</span>
            <span className={cn("flex items-center gap-1 font-bold", clientAgreed ? "text-[#166534]" : "text-[#9CA3AF]")}>
              {clientAgreed ? <CheckCircle2 className="w-3.5 h-3.5 text-[#2D6606]" /> : <Clock className="w-3.5 h-3.5" />}
              Sarah (Client)
            </span>
          </div>

          {/* If Agreed: Allow proposing mutual amendment */}
          {agreementStatus === "agreed" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAmendmentModal(true)}
              className="text-xs font-semibold gap-1.5 h-8 bg-white hover:bg-[#F9FAFB]"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#2D6606]" />
              <span>Request Timeline Amendment</span>
            </Button>
          )}

          {/* If Draft: Allow editing or signing */}
          {agreementStatus === "draft_proposed" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenTimelineSetter}
                className="text-xs font-semibold gap-1.5 h-8 bg-white"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Edit Timeline</span>
              </Button>
              <Button
                variant="dark"
                size="sm"
                onClick={() => {
                  setFreelancerAgreed(true);
                  setClientAgreed(true);
                  setAgreementStatus("agreed");
                  showToast("Both parties approved the timeline proposal! Scope is now sealed.");
                }}
                className="text-xs font-bold gap-1.5 h-8"
              >
                <Lock className="w-3.5 h-3.5 text-[#88D635]" />
                <span>Approve & Lock Timeline</span>
              </Button>
            </>
          )}

          {/* Timeline Setter Button for instant configuration */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenTimelineSetter}
            className="text-xs font-semibold gap-1.5 h-8 bg-white hover:bg-[#F9FAFB]"
            title="Configure Timeline Spans (1 to 8 Months), Milestone Dates & Iteration Limits"
          >
            <Sliders className="w-3.5 h-3.5 text-[#4B5563]" />
            <span>Timeline Setter</span>
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PENDING AMENDMENT NOTIFICATION BANNER (if an amendment is active)       */}
      {/* ========================================================================= */}
      {pendingAmendment && agreementStatus === "amendment_pending" && (
        <div className="bg-[#FFFBEB] border border-[#FDE68A] p-3.5 rounded-xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-[#92400E] block">
                Pending Timeline Extension: {pendingAmendment.milestoneNumber} ({pendingAmendment.proposedSchedule})
              </span>
              <p className="text-[#B45309] mt-0.5 font-sans leading-relaxed">
                Reason: &ldquo;{pendingAmendment.reason}&rdquo; — Proposed by <span className="font-semibold">{pendingAmendment.proposedBy}</span>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            {/* If current user is client and proposer was freelancer (or vice-versa), allow approval */}
            {((role === "business" && pendingAmendment.proposerRole === "freelancer") ||
              (role === "freelancer" && pendingAmendment.proposerRole === "business")) ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeclineAmendment}
                  className="text-xs h-7 text-[#EF4444] hover:bg-[#FEF2F2] border-[#FCA5A5]"
                >
                  <X className="w-3 h-3 mr-1" />
                  Decline
                </Button>
                <Button
                  variant="dark"
                  size="sm"
                  onClick={handleApproveAmendment}
                  className="text-xs h-7 font-bold bg-[#15803D] hover:bg-[#166534] text-white"
                >
                  <Check className="w-3 h-3 mr-1 text-[#88D635]" />
                  Accept & Re-Lock Schedule
                </Button>
              </>
            ) : (
              <span className="text-[11px] font-mono bg-white px-2 py-1 rounded border border-[#FDE68A] text-[#92400E]">
                Waiting for {role === "business" ? "Alex Rivera" : "Sarah Chen"} to sign...
              </span>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TIMELINE CONTROLS & MONTH SPAN CONFIGURATION                            */}
      {/* ========================================================================= */}
      <div className="w-full bg-white p-3.5 sm:p-4 rounded-xl border border-black/[0.06] shadow-[0px_2px_8px_rgba(0,0,0,0.03)] flex flex-col gap-3 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Timeline Title & Month Scale */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#2D6606]" />
              <h2 className="text-base font-bold text-[#111827] tracking-tight">
                Project Roadmap Timeline ({totalMonths} Months)
              </h2>
            </div>
            <span className="text-xs font-mono text-[#6B7280] hidden sm:inline">
              • Sep 2026 – Apr 2027 • Total Escrow: $7,950
            </span>
          </div>

          {/* Right: Duration Span Switcher & Milestone Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-[#6B7280] hidden md:inline">Span:</span>
            <div className="flex items-center bg-[#F4F5F7] p-0.5 rounded-lg text-xs font-semibold text-[#6B7280]">
              {[4, 6, 8, 12].map((span) => (
                <button
                  key={span}
                  onClick={() => {
                    setTotalMonths(span);
                    showToast(`Timeline adjusted to ${span} Months Roadmap view`);
                  }}
                  className={cn(
                    "px-2.5 py-1 rounded-md transition-all cursor-pointer",
                    totalMonths === span
                      ? "bg-white text-[#111827] shadow-xs font-bold"
                      : "hover:text-[#111827]"
                  )}
                >
                  {span} Mo
                </button>
              ))}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center bg-[#F4F5F7] p-0.5 rounded-lg text-xs font-semibold text-[#6B7280]">
              {[
                { id: "all", label: "All" },
                { id: "active", label: "Active" },
                { id: "completed", label: "Done" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterStatus(f.id)}
                  className={cn(
                    "px-2.5 py-1 rounded-md transition-all cursor-pointer",
                    filterStatus === f.id
                      ? "bg-white text-[#111827] shadow-xs font-bold"
                      : "hover:text-[#111827]"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. VISUAL MONTH ROADMAP GANTT TRACK (Not an hourly calendar!)             */}
        {/* ========================================================================= */}
        <div className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-white shadow-2xs flex flex-col min-h-[300px]">
          {/* Month Axis Header (Month 1, Month 2, Month 3 ... Month 8) */}
          <div
            className="grid border-b border-[#E5E7EB] bg-[#F8F9FA] text-center text-xs font-bold text-[#4B5563] shrink-0 select-none"
            style={{
              gridTemplateColumns: `140px repeat(${totalMonths}, minmax(100px, 1fr))`,
            }}
          >
            {/* First Column Header: Milestone Label */}
            <div className="py-2.5 px-3 border-r border-[#E5E7EB] text-[11px] text-[#6B7280] font-bold text-left bg-[#F4F5F7]">
              Milestone / Scope
            </div>

            {/* Month Columns */}
            {activeMonthList.map((m) => (
              <div
                key={m.monthIndex}
                className={cn(
                  "py-2 px-1.5 border-r border-[#E5E7EB] last:border-r-0 flex flex-col items-center justify-center gap-0.5 relative",
                  m.isCurrent && "bg-[#EDE9FE] text-[#5B21B6] font-black"
                )}
              >
                {m.isCurrent && (
                  <span className="text-[9px] bg-[#88D635] text-[#0A2600] px-1.5 py-0.2 rounded font-black tracking-wider leading-none shadow-2xs animate-pulse">
                    CURRENT
                  </span>
                )}
                <span className="text-xs font-bold tracking-tight">{m.label}</span>
                <span className="text-[10px] text-[#9CA3AF] font-mono">{m.name}</span>
              </div>
            ))}
          </div>

          {/* Milestone Rows mapped against Month Columns */}
          <div className="divide-y divide-[#F1F3F6] overflow-x-auto flex-1 custom-scrollbar">
            {filteredMilestones.map((m) => {
              const isSelected = m.id === selectedMilestoneId;
              const isHardCapped = m.usedIterations >= m.maxIterations;

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMilestoneId(m.id)}
                  className={cn(
                    "grid items-center hover:bg-[#FAFBFD] transition-colors cursor-pointer group min-h-[58px]",
                    isSelected && "bg-[#F0FDF4]/50"
                  )}
                  style={{
                    gridTemplateColumns: `140px repeat(${totalMonths}, minmax(100px, 1fr))`,
                  }}
                >
                  {/* Left Metadata Column */}
                  <div className="p-2.5 border-r border-[#E5E7EB] bg-[#FAFAFA] flex flex-col justify-center h-full">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-xs text-[#111827]">{m.number}</span>
                      <span className="text-[10px] font-mono font-bold text-[#166534] bg-[#DCFCE7] px-1.5 py-0.5 rounded">
                        {formatCurrency(m.escrowAmount)}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#4B5563] truncate font-medium mt-0.5" title={m.title}>
                      {m.title}
                    </span>
                    <div className="flex items-center gap-1 mt-1">
                      {/* Fixed Iteration Badge */}
                      <span
                        className={cn(
                          "text-[9px] font-mono font-semibold px-1 rounded flex items-center gap-0.5",
                          isHardCapped
                            ? "bg-[#FEE2E2] text-[#991B1B] font-bold"
                            : "bg-[#F3F4F6] text-[#4B5563]"
                        )}
                        title={`Contract iteration limit: ${m.usedIterations} of ${m.maxIterations} used.`}
                      >
                        {isHardCapped && <Lock className="w-2.5 h-2.5 text-[#DC2626]" />}
                        Iter: {m.usedIterations}/{m.maxIterations}
                      </span>
                    </div>
                  </div>

                  {/* Gantt Bar spanning startMonth to endMonth */}
                  <div
                    className="relative h-full flex items-center px-1"
                    style={{
                      gridColumn: `${m.startMonth + 1} / span ${Math.max(1, m.endMonth - m.startMonth + 1)}`,
                    }}
                  >
                    <div
                      className={cn(
                        "w-full h-10 rounded-lg p-2 flex items-center justify-between gap-2 shadow-xs transition-all border",
                        m.status === "completed"
                          ? "bg-gradient-to-r from-[#DCFCE7] to-[#BBF7D0] border-[#86EFAC] text-[#166534]"
                          : m.status === "in_review"
                          ? "bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] border-[#FCD34D] text-[#92400E]"
                          : m.status === "in_progress"
                          ? "bg-gradient-to-r from-[#DBEAFE] to-[#BFDBFE] border-[#93C5FD] text-[#1E40AF]"
                          : "bg-gradient-to-r from-[#F1F5F9] to-[#E2E8F0] border-[#CBD5E1] text-[#475569]",
                        isSelected && "ring-2 ring-[#88D635] shadow-md"
                      )}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-bold text-xs shrink-0">{m.number}:</span>
                        <span className="text-xs font-semibold truncate">{m.title}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Status Icon */}
                        {m.status === "completed" && (
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase bg-white/70 px-1.5 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3 text-[#166534]" />
                            Done
                          </span>
                        )}
                        {m.status === "in_review" && (
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase bg-white/70 px-1.5 py-0.5 rounded text-[#92400E]">
                            <Clock className="w-3 h-3" />
                            72h Review
                          </span>
                        )}
                        {m.status === "in_progress" && (
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase bg-white/70 px-1.5 py-0.5 rounded text-[#1E40AF]">
                            <Flame className="w-3 h-3 text-[#2563EB]" />
                            Active
                          </span>
                        )}
                        {m.status === "proposed" && (
                          <span className="text-[10px] font-medium bg-white/70 px-1.5 py-0.5 rounded text-[#475569]">
                            Month {m.startMonth}–{m.endMonth}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. SELECTED MILESTONE INSPECTOR & ITERATION LIMIT ENFORCEMENT               */}
      {/* ========================================================================= */}
      {selectedMilestone && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
          {/* LEFT 8 COLS: Milestone Deliverables & Proof Artifacts */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            <Card className="p-4 sm:p-5 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1F3F6] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#88D635] bg-[#111827] px-2 py-0.5 rounded">
                      {selectedMilestone.number}
                    </span>
                    <h3 className="text-base font-bold text-[#111827]">
                      {selectedMilestone.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[#6B7280] mt-1">
                    {selectedMilestone.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <div className="text-right">
                    <span className="text-xs text-[#6B7280] block font-mono">Escrow Value</span>
                    <span className="text-base font-black text-[#111827]">
                      {formatCurrency(selectedMilestone.escrowAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Milestone Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-[#FAFBFD] border border-black/[0.04]">
                  <span className="text-[#6B7280] block text-[11px]">Timeline Schedule</span>
                  <span className="font-bold text-[#111827] block mt-0.5">
                    Month {selectedMilestone.startMonth} – Month {selectedMilestone.endMonth}
                  </span>
                  <span className="text-[10px] text-[#9CA3AF] font-mono">{selectedMilestone.startDate} – {selectedMilestone.endDate}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#FAFBFD] border border-black/[0.04]">
                  <span className="text-[#6B7280] block text-[11px]">Execution Status</span>
                  <span className="font-bold text-[#111827] block mt-0.5 capitalize">
                    {selectedMilestone.status.replace("_", " ")}
                  </span>
                  <span className="text-[10px] text-[#2D6606] font-mono font-semibold">
                    {selectedMilestone.progressPercent}% Verified
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#FAFBFD] border border-black/[0.04]">
                  <span className="text-[#6B7280] block text-[11px]">Fixed Iteration Cap</span>
                  <span className={cn(
                    "font-bold block mt-0.5",
                    selectedMilestone.usedIterations >= selectedMilestone.maxIterations
                      ? "text-[#DC2626]"
                      : "text-[#111827]"
                  )}>
                    {selectedMilestone.usedIterations} of {selectedMilestone.maxIterations} Used
                  </span>
                  <span className="text-[10px] text-[#6B7280] font-mono">
                    {selectedMilestone.maxIterations - selectedMilestone.usedIterations > 0
                      ? `${selectedMilestone.maxIterations - selectedMilestone.usedIterations} rounds left`
                      : "Hard cap reached"}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#FAFBFD] border border-black/[0.04]">
                  <span className="text-[#6B7280] block text-[11px]">Contract Rule</span>
                  <span className="font-bold text-[#111827] block mt-0.5">
                    Mutual Lock
                  </span>
                  <span className="text-[10px] text-[#6B7280] font-mono">Dual-sign required</span>
                </div>
              </div>

              {/* Deliverables Checklist */}
              <div>
                <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Scope Deliverables ({selectedMilestone.deliverables.filter(d => d.completed).length}/{selectedMilestone.deliverables.length})</span>
                  <span className="text-[11px] text-[#6B7280] font-normal">Tied to Escrow Release</span>
                </h4>
                <div className="divide-y divide-[#F1F3F6] border border-[#E5E7EB] rounded-lg overflow-hidden">
                  {selectedMilestone.deliverables.map((d) => (
                    <div
                      key={d.id}
                      className="p-2.5 flex items-center justify-between gap-3 text-xs bg-white hover:bg-[#FAFBFD]"
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-4 h-4 rounded flex items-center justify-center border",
                          d.completed
                            ? "bg-[#2D6606] border-[#2D6606] text-white"
                            : "border-[#D1D5DB] bg-white"
                        )}>
                          {d.completed && <Check className="w-3 h-3" />}
                        </div>
                        <span className={cn("font-medium", d.completed ? "text-[#111827]" : "text-[#4B5563]")}>
                          {d.title}
                        </span>
                      </div>
                      <Badge variant={d.completed ? "lime" : "outline"} className="text-[10px]">
                        {d.completed ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Proof of Work Artifacts */}
              {selectedMilestone.proofArtifacts && selectedMilestone.proofArtifacts.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2">
                    Verified Proof Artifacts
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedMilestone.proofArtifacts.map((art, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg border border-[#E5E7EB] bg-[#FAFBFD] flex items-center justify-between text-xs hover:border-[#88D635] transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {art.type === "loom" ? (
                            <Video className="w-4 h-4 text-[#7C3AED]" />
                          ) : (
                            <GitCommit className="w-4 h-4 text-[#2563EB]" />
                          )}
                          <div>
                            <span className="font-semibold text-[#111827] block truncate max-w-[200px]">
                              {art.title}
                            </span>
                            <span className="text-[10px] text-[#6B7280] font-mono">{art.meta}</span>
                          </div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-[#9CA3AF]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* RIGHT 4 COLS: FIXED ITERATION CONTROLLER & HARD CAP SCOPE GUARD */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <Card className="p-4 flex flex-col gap-3.5 border-black/[0.06]">
              <div className="flex items-center justify-between border-b border-[#F1F3F6] pb-2.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2D6606]" />
                  <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                    Iteration Quota Guard
                  </h4>
                </div>
                <Badge
                  variant={selectedMilestone.usedIterations >= selectedMilestone.maxIterations ? "red" : "lime"}
                  className="text-[10px] font-bold"
                >
                  {selectedMilestone.usedIterations >= selectedMilestone.maxIterations ? "Hard Cap Active" : "In Quota"}
                </Badge>
              </div>

              {/* Visual Iteration Counter */}
              <div className="p-3 rounded-xl bg-[#FAFBFD] border border-black/[0.04] flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6B7280] font-medium">Contractual Revisions:</span>
                  <span className="font-mono font-bold text-[#111827]">
                    {selectedMilestone.usedIterations} / {selectedMilestone.maxIterations} Rounds
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-[#E5E7EB] overflow-hidden flex">
                  <div
                    className={cn(
                      "h-full transition-all duration-300",
                      selectedMilestone.usedIterations >= selectedMilestone.maxIterations
                        ? "bg-[#EF4444]"
                        : "bg-[#2D6606]"
                    )}
                    style={{
                      width: `${(selectedMilestone.usedIterations / selectedMilestone.maxIterations) * 100}%`,
                    }}
                  />
                </div>

                {/* Status notice */}
                {selectedMilestone.usedIterations >= selectedMilestone.maxIterations ? (
                  <div className="flex items-start gap-1.5 text-[11px] text-[#991B1B] bg-[#FEF2F2] p-2 rounded-lg border border-[#FCA5A5] mt-1">
                    <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#DC2626]" />
                    <p className="leading-snug">
                      <strong>Hard Cap Reached (2/2):</strong> No further revisions are permitted under current SOW contract. Additional changes require an approved Scope Change Order.
                    </p>
                  </div>
                ) : (
                  <p className="text-[11px] text-[#2D6606] leading-snug">
                    ✓ {selectedMilestone.maxIterations - selectedMilestone.usedIterations} revision round remaining. Submitting feedback increments counter.
                  </p>
                )}
              </div>

              {/* Action Button: Request Iteration (Strictly disabled if limit reached) */}
              <Button
                variant={selectedMilestone.usedIterations >= selectedMilestone.maxIterations ? "outline" : "dark"}
                size="sm"
                disabled={selectedMilestone.usedIterations >= selectedMilestone.maxIterations}
                onClick={() => setShowIterationModal(true)}
                className="w-full text-xs font-bold gap-1.5 h-9"
              >
                {selectedMilestone.usedIterations >= selectedMilestone.maxIterations ? (
                  <>
                    <Lock className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    <span>Iteration Limit Reached (Hard Cap)</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#88D635]" />
                    <span>Request Revision Round ({selectedMilestone.usedIterations + 1}/{selectedMilestone.maxIterations})</span>
                  </>
                )}
              </Button>

              {/* If Hard Capped: Show Change Order Option */}
              {selectedMilestone.usedIterations >= selectedMilestone.maxIterations && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => showToast("Opened Scope Change Order Generator (+$450.00)")}
                  className="w-full text-xs font-semibold gap-1.5 border-[#FCD34D] bg-[#FFFBEB] text-[#92400E] hover:bg-[#FEF3C7]"
                >
                  <Plus className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Propose Paid Change Order ($450)</span>
                </Button>
              )}

              {/* Iteration Audit History */}
              <div className="pt-2 border-t border-[#F1F3F6]">
                <h5 className="text-[11px] font-bold text-[#111827] uppercase tracking-wider mb-2 flex items-center gap-1">
                  <History className="w-3 h-3 text-[#6B7280]" />
                  <span>Revision History Log</span>
                </h5>

                {selectedMilestone.iterationHistory.length === 0 ? (
                  <p className="text-xs text-[#9CA3AF] italic">No revisions requested yet. 1st submission pending.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {selectedMilestone.iterationHistory.map((item) => (
                      <div
                        key={item.round}
                        className="p-2 rounded-lg bg-[#FAFBFD] border border-black/[0.04] text-xs flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#111827]">Round #{item.round}</span>
                          <span className="text-[10px] text-[#9CA3AF] font-mono">{item.date}</span>
                        </div>
                        <p className="text-[11px] text-[#4B5563] leading-relaxed">&ldquo;{item.note}&rdquo;</p>
                        <span className="text-[10px] text-[#2D6606] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Resolved by Alex
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: TIMELINE SETTER & MILESTONE SCHEDULE BUILDER                     */}
      {/* ========================================================================= */}
      {showTimelineSetterModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-black/[0.1] shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="p-4 border-b border-[#F1F3F6] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#2D6606]" />
                <h3 className="text-base font-bold text-[#111827]">
                  Timeline Setter & Milestone Builder
                </h3>
              </div>
              <button
                onClick={() => setShowTimelineSetterModal(false)}
                className="p-1 rounded-md text-[#6B7280] hover:bg-[#F3F4F6]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto custom-scrollbar flex flex-col gap-4 text-xs">
              <p className="text-[#6B7280] leading-relaxed">
                Configure project duration and define milestone month schedules. Each milestone has an enforced fixed iteration limit.
              </p>

              {/* Total Project Duration */}
              <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-[#FAFBFD] border border-black/[0.06]">
                <label className="font-bold text-[#111827]">Total Project Timeline Span</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {[1, 4, 6, 8, 12].map((months) => (
                    <button
                      key={months}
                      onClick={() => setDraftTotalMonths(months)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer",
                        draftTotalMonths === months
                          ? "bg-[#111827] text-white border-[#111827] shadow-xs"
                          : "bg-white text-[#4B5563] border-[#E5E7EB] hover:bg-[#F3F4F6]"
                      )}
                    >
                      {months} {months === 1 ? "Month" : "Months"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Milestones List */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#111827] uppercase tracking-wider text-[11px]">
                    Milestones Configuration
                  </h4>
                  <span className="text-[11px] text-[#6B7280]">
                    {draftMilestones.length} Milestones Scheduled
                  </span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {draftMilestones.map((m, idx) => (
                    <div
                      key={m.id}
                      className="p-3.5 rounded-xl border border-[#E5E7EB] bg-white flex flex-col gap-2.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-mono text-xs bg-[#111827] text-[#88D635] px-1.5 py-0.5 rounded">
                            {m.number}
                          </span>
                          <input
                            type="text"
                            value={m.title}
                            onChange={(e) => {
                              const newTitle = e.target.value;
                              setDraftMilestones((prev) =>
                                prev.map((item) => (item.id === m.id ? { ...item, title: newTitle } : item))
                              );
                            }}
                            className="font-bold text-xs text-[#111827] bg-transparent border-b border-dashed border-[#D1D5DB] focus:border-[#2D6606] outline-hidden px-1"
                          />
                        </div>

                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-xs text-[#6B7280]">$</span>
                          <input
                            type="number"
                            value={m.escrowAmount}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setDraftMilestones((prev) =>
                                prev.map((item) => (item.id === m.id ? { ...item, escrowAmount: val } : item))
                              );
                            }}
                            className="w-18 text-xs font-bold text-[#111827] border rounded px-1.5 py-0.5"
                          />
                        </div>
                      </div>

                      {/* Month Range & Fixed Iterations Slider */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#F1F3F6] text-[11px]">
                        <div>
                          <label className="text-[#6B7280] block font-medium">Start Month</label>
                          <select
                            value={m.startMonth}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setDraftMilestones((prev) =>
                                prev.map((item) => (item.id === m.id ? { ...item, startMonth: val, endMonth: Math.max(val, item.endMonth) } : item))
                              );
                            }}
                            className="w-full mt-1 border border-[#D1D5DB] rounded-md p-1 font-semibold text-[#111827]"
                          >
                            {Array.from({ length: draftTotalMonths }, (_, i) => i + 1).map((mo) => (
                              <option key={mo} value={mo}>
                                Month {mo}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[#6B7280] block font-medium">End Month</label>
                          <select
                            value={m.endMonth}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setDraftMilestones((prev) =>
                                prev.map((item) => (item.id === m.id ? { ...item, endMonth: val } : item))
                              );
                            }}
                            className="w-full mt-1 border border-[#D1D5DB] rounded-md p-1 font-semibold text-[#111827]"
                          >
                            {Array.from({ length: draftTotalMonths }, (_, i) => i + 1).filter(mo => mo >= m.startMonth).map((mo) => (
                              <option key={mo} value={mo}>
                                Month {mo}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[#6B7280] block font-medium">Fixed Iterations Cap</label>
                          <select
                            value={m.maxIterations}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setDraftMilestones((prev) =>
                                prev.map((item) => (item.id === m.id ? { ...item, maxIterations: val } : item))
                              );
                            }}
                            className="w-full mt-1 border border-[#D1D5DB] rounded-md p-1 font-semibold text-[#111827]"
                          >
                            <option value={1}>1 Revision Max</option>
                            <option value={2}>2 Revisions Max (Standard)</option>
                            <option value={3}>3 Revisions Max</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#F1F3F6] flex items-center justify-between shrink-0 bg-[#FAFBFD]">
              <span className="text-[11px] text-[#6B7280]">
                Changes require mutual agreement if contract is active.
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTimelineSetterModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  variant="dark"
                  size="sm"
                  onClick={handleSaveTimelineSetter}
                  className="text-xs font-bold gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-[#88D635]" />
                  <span>Save Timeline Schedule</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL: MUTUAL AMENDMENT REQUEST (Requires both parties' consent)         */}
      {/* ========================================================================= */}
      {showAmendmentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-black/[0.1] shadow-2xl max-w-lg w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-[#F1F3F6] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#D97706]" />
                <h3 className="text-base font-bold text-[#111827]">
                  Propose Mutual Timeline Amendment
                </h3>
              </div>
              <button
                onClick={() => setShowAmendmentModal(false)}
                className="p-1 rounded-md text-[#6B7280] hover:bg-[#F3F4F6]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4 text-xs">
              <div className="p-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl text-[#92400E] leading-relaxed">
                <strong>Mutual Agreement Protocol:</strong> The SOW timeline is legally locked. Adjusting milestone dates or durations will generate a pending amendment request that <strong>both parties must sign</strong> before taking effect.
              </div>

              <div>
                <label className="font-bold text-[#111827] block mb-1">Target Milestone</label>
                <select
                  value={amendmentTargetMilestone}
                  onChange={(e) => setAmendmentTargetMilestone(e.target.value)}
                  className="w-full border border-[#D1D5DB] rounded-lg p-2 text-xs font-semibold text-[#111827]"
                >
                  {milestones.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.number}: {m.title} (Currently: Month {m.startMonth}–{m.endMonth})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-[#111827] block mb-1">Proposed New End Month</label>
                <select
                  value={amendmentNewEndMonth}
                  onChange={(e) => setAmendmentNewEndMonth(Number(e.target.value))}
                  className="w-full border border-[#D1D5DB] rounded-lg p-2 text-xs font-semibold text-[#111827]"
                >
                  {Array.from({ length: totalMonths }, (_, i) => i + 1).map((mo) => (
                    <option key={mo} value={mo}>
                      Extend delivery to Month {mo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-[#111827] block mb-1">Reason for Schedule Adjustment *</label>
                <textarea
                  rows={3}
                  value={amendmentReason}
                  onChange={(e) => setAmendmentReason(e.target.value)}
                  placeholder="e.g. Third-party payment gateway approval delay, additional security review round requested..."
                  className="w-full border border-[#D1D5DB] rounded-lg p-2.5 text-xs outline-hidden focus:border-[#2D6606]"
                />
              </div>
            </div>

            <div className="p-4 border-t border-[#F1F3F6] flex items-center justify-end gap-2 bg-[#FAFBFD]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAmendmentModal(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="dark"
                size="sm"
                onClick={handleProposeAmendmentSubmit}
                className="text-xs font-bold gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-[#88D635]" />
                <span>Submit Amendment for Mutual Approval</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. MODAL: SUBMIT REVISION / ITERATION (Strictly enforces fixed cap)         */}
      {/* ========================================================================= */}
      {showIterationModal && selectedMilestone && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-black/[0.1] shadow-2xl max-w-lg w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-[#F1F3F6] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2D6606]" />
                <h3 className="text-base font-bold text-[#111827]">
                  Submit Milestone Revision Round ({selectedMilestone.usedIterations + 1} of {selectedMilestone.maxIterations})
                </h3>
              </div>
              <button
                onClick={() => setShowIterationModal(false)}
                className="p-1 rounded-md text-[#6B7280] hover:bg-[#F3F4F6]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4 text-xs">
              <div className="p-3 bg-[#FAFBFD] border border-black/[0.06] rounded-xl flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#2D6606] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#111827] block">
                    Fixed Iteration Enforcement
                  </span>
                  <p className="text-[#6B7280] mt-0.5 leading-relaxed">
                    This milestone allows exactly <strong>{selectedMilestone.maxIterations} iterations</strong>.
                    {selectedMilestone.usedIterations + 1 === selectedMilestone.maxIterations ? (
                      <span className="text-[#D97706] font-semibold block mt-1">
                        ⚠️ Caution: This will be your FINAL included revision round. No further changes can be submitted without a funded Change Order.
                      </span>
                    ) : (
                      <span className="block mt-1">
                        You will have {selectedMilestone.maxIterations - (selectedMilestone.usedIterations + 1)} revision remaining after this round.
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#111827] block mb-1">
                  Specific Revision Instructions & Feedback *
                </label>
                <textarea
                  rows={4}
                  value={iterationNote}
                  onChange={(e) => setIterationNote(e.target.value)}
                  placeholder="Detail exact changes required for this revision round..."
                  className="w-full border border-[#D1D5DB] rounded-lg p-2.5 text-xs outline-hidden focus:border-[#2D6606]"
                />
              </div>
            </div>

            <div className="p-4 border-t border-[#F1F3F6] flex items-center justify-end gap-2 bg-[#FAFBFD]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowIterationModal(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="dark"
                size="sm"
                onClick={handleRequestIteration}
                className="text-xs font-bold gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-[#88D635]" />
                <span>Confirm Revision Request (Round {selectedMilestone.usedIterations + 1})</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
