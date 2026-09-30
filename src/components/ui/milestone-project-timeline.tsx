"use client";

import React, { useState } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Sparkles,
  Edit3,
  Sliders,
  Plus,
  Flame,
  ArrowRight,
  Send,
  AlertTriangle,
  FileText,
  Video,
  GitCommit,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  History,
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
  durationLabel: string;
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
  tags?: string[];
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
    durationLabel: "4 Weeks",
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
    tags: ["database", "prisma", "rls"],
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
    durationLabel: "6 Weeks",
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
    tags: ["auth", "nextauth", "jwt"],
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
    durationLabel: "8 Weeks",
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
    tags: ["stripe", "escrow-vault", "webhooks"],
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
    durationLabel: "6 Weeks",
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
    tags: ["scope-firewall", "ip-transfer", "security"],
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
    durationLabel: "8 Weeks",
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
    tags: ["security-audit", "playwright", "production"],
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

export const getJiraMilestoneStatus = (status: TimelineMilestone["status"]) => {
  switch (status) {
    case "completed":
      return { text: "DONE", bg: "bg-[#E3FCEF]", color: "text-[#006644]", border: "border-[#ABF5D1]" };
    case "in_review":
      return { text: "IN REVIEW", bg: "bg-[#FFF0B3]", color: "text-[#172B4D]", border: "border-[#FFE380]" };
    case "in_progress":
      return { text: "IN PROGRESS", bg: "bg-[#DEEBFF]", color: "text-[#0747A6]", border: "border-[#B3D4FF]" };
    default:
      return { text: "TO DO", bg: "bg-[#EBECF0]", color: "text-[#42526E]", border: "border-[#DFE1E6]" };
  }
};

export function MilestoneProjectTimeline({
  role,
  showToast = () => {},
  className,
}: MilestoneProjectTimelineProps) {
  // Timeline Milestones State
  const [milestones, setMilestones] = useState<TimelineMilestone[]>(INITIAL_MILESTONES);
  const [totalMonths, setTotalMonths] = useState<number>(8);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>("m2");

  // Centered Detail Popup Modal (Replacing side-drawer)
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [modalTab, setModalTab] = useState<"overview" | "iterations" | "proof">("overview");

  // Contract & Mutual Agreement State
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

  // Calculate Overall Progress
  const totalDeliverablesCount = milestones.reduce((sum, m) => sum + m.deliverables.length, 0);
  const completedDeliverablesCount = milestones.reduce(
    (sum, m) => sum + m.deliverables.filter((d) => d.completed).length,
    0
  );
  const overallProgressPercent = totalDeliverablesCount > 0
    ? Math.round((completedDeliverablesCount / totalDeliverablesCount) * 100)
    : 0;

  const totalEscrowAmount = milestones.reduce((sum, m) => sum + m.escrowAmount, 0);

  // Helper to get month list according to totalMonths
  const activeMonthList = Array.from({ length: totalMonths }, (_, i) => {
    const idx = i + 1;
    const existing = MONTH_LABELS_8.find((m) => m.monthIndex === idx);
    if (existing) return existing;
    return {
      monthIndex: idx,
      label: `Month ${idx}`,
      name: `M${idx} - 2027`,
      isCurrent: false,
    };
  });


  // Deliverable checkbox toggle
  const handleToggleDeliverable = (milestoneId: string, deliverableId: string) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id !== milestoneId) return m;
        const updated = m.deliverables.map((d) =>
          d.id === deliverableId ? { ...d, completed: !d.completed } : d
        );
        const comp = updated.filter((d) => d.completed).length;
        const progress = Math.round((comp / updated.length) * 100);
        return {
          ...m,
          deliverables: updated,
          progressPercent: progress,
          status: progress === 100 ? "completed" : progress > 0 ? "in_progress" : m.status,
        };
      })
    );
    showToast("Deliverable checklist item updated");
  };

  // Handlers for Mutual Agreement Protocol
  const handleApproveAmendment = () => {
    if (!pendingAmendment) return;

    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === pendingAmendment.targetMilestoneId) {
          return {
            ...m,
            endMonth: pendingAmendment.proposedEndMonth,
            endDate: "Feb 15, 2027",
            durationLabel: "12 Weeks (Extended)",
          };
        }
        return m;
      })
    );

    setPendingAmendment(null);
    setAgreementStatus("agreed");
    setFreelancerAgreed(true);
    setClientAgreed(true);
    showToast("Mutual Agreement Sealed: Timeline updated with both parties' signatures.");
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
    showToast(
      `Timeline amendment proposal submitted to ${role === "business" ? "Alex Rivera" : "Sarah Chen"} for mutual agreement.`
    );
  };

  // Iteration submission handler (enforces fixed limit)
  const handleRequestIteration = () => {
    if (!selectedMilestone) return;

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
      showToast(`Iteration ${nextRound} of ${selectedMilestone.maxIterations} logged. Maximum revision quota reached.`);
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
      setShowTimelineSetterModal(false);
      setShowAmendmentModal(true);
      showToast("Timeline is legally locked. Submit a Mutual Amendment Request for both parties to sign.");
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

  const openMilestoneModal = (id: string, initialTab: "overview" | "iterations" | "proof" = "overview") => {
    setSelectedMilestoneId(id);
    setModalTab(initialTab);
    setShowDetailModal(true);
  };

  return (
    <div className={cn("flex flex-col gap-3 h-full min-h-0 overflow-hidden", className)}>
      {/* ========================================================================= */}
      {/* 1. UNIFIED STREAMLINED TOP TOOLBAR & STATUS BAR                           */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-black/[0.06] shadow-[0px_2px_8px_rgba(0,0,0,0.03)] p-3.5 sm:p-4 flex flex-col gap-3 shrink-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Left: Title, Overall Progress & Contract Signature */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold text-[#0052CC] bg-[#DEEBFF] px-2 py-0.5 rounded tracking-wider">
                  LOCKLOOP / ROADMAP
                </span>
                <span className="text-[11px] font-mono text-[#6B7280]">SOW-2026-9921</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#2D6606]" />
                <h1 className="text-base font-bold text-[#111827] tracking-tight">
                  Project Roadmap Timeline
                </h1>
                <Badge variant="lime" className="text-[10px] px-1.5 py-0.5 font-bold">
                  {totalMonths} Months SOW
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-[#6B7280]">
                <span>Sep 2026 – Apr 2027</span>
                <span>•</span>
                <span className="font-semibold text-[#166534]">
                  {formatCurrency(totalEscrowAmount)} Total Escrow
                </span>
                <span>•</span>
                <span>{milestones.filter((m) => m.status === "completed").length} of {milestones.length} Phases Done</span>
              </div>
            </div>

            {/* Overall Completion Progress Gauge */}
            <div className="sm:border-l sm:border-[#E5E7EB] sm:pl-3 flex flex-col gap-1 min-w-[170px]">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[#4B5563]">Overall Progress</span>
                <span className="font-mono text-[#111827]">{overallProgressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#2D6606] to-[#88D635] rounded-full transition-all duration-500"
                  style={{ width: `${overallProgressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right: Contract Signature, Month Span Switcher & Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap justify-between lg:justify-end">
            {/* Dual Signatures Indicator */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono bg-[#F9FAFB] px-2.5 py-1.5 rounded-lg border border-black/[0.05]">
              <Lock className="w-3.5 h-3.5 text-[#2D6606]" />
              <span className="text-[#6B7280]">Contract:</span>
              <span className={cn("font-bold", freelancerAgreed ? "text-[#166534]" : "text-[#9CA3AF]")}>
                Alex (Dev) {freelancerAgreed ? "✓" : "⏳"}
              </span>
              <span className="text-[#D1D5DB]">•</span>
              <span className={cn("font-bold", clientAgreed ? "text-[#166534]" : "text-[#9CA3AF]")}>
                Sarah (Client) {clientAgreed ? "✓" : "⏳"}
              </span>
            </div>

            {/* Month Span Scale Switcher */}
            <div className="flex items-center bg-[#F4F5F7] p-0.5 rounded-lg text-xs font-semibold text-[#6B7280]">
              {[6, 8, 12].map((span) => (
                <button
                  key={span}
                  onClick={() => {
                    setTotalMonths(span);
                    showToast(`Timeline adjusted to ${span} Months`);
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

            {/* Action Buttons */}
            {agreementStatus === "agreed" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAmendmentModal(true)}
                className="text-xs font-semibold gap-1.5 h-8 bg-white hover:bg-[#F9FAFB]"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#2D6606]" />
                <span>Amendment</span>
              </Button>
            ) : (
              <Button
                variant="dark"
                size="sm"
                onClick={() => {
                  setFreelancerAgreed(true);
                  setClientAgreed(true);
                  setAgreementStatus("agreed");
                  showToast("Both parties approved the timeline proposal! Scope is now locked.");
                }}
                className="text-xs font-bold gap-1.5 h-8"
              >
                <Lock className="w-3.5 h-3.5 text-[#88D635]" />
                <span>Lock SOW</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenTimelineSetter}
              className="text-xs font-semibold gap-1.5 h-8 bg-white hover:bg-[#F9FAFB]"
              title="Configure Milestone Months, Dates & Iteration Limits"
            >
              <Sliders className="w-3.5 h-3.5 text-[#4B5563]" />
              <span>Settings</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PENDING AMENDMENT NOTIFICATION BANNER (if active)                      */}
      {/* ========================================================================= */}
      {pendingAmendment && agreementStatus === "amendment_pending" && (
        <div className="bg-[#FFFBEB] border border-[#FDE68A] p-3 rounded-xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in shrink-0">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-[#92400E] block">
                Pending Timeline Extension Proposal: {pendingAmendment.milestoneNumber} ({pendingAmendment.proposedSchedule})
              </span>
              <p className="text-[#B45309] mt-0.5 font-sans leading-relaxed">
                Reason: &ldquo;{pendingAmendment.reason}&rdquo; — Proposed by <span className="font-semibold">{pendingAmendment.proposedBy}</span>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
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
                  Accept & Re-Lock
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
      {/* 3. VISUAL MONTH ROADMAP GANTT TRACK (Tall, Full-Height & Spacious)         */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-black/[0.06] shadow-[0px_2px_8px_rgba(0,0,0,0.03)] overflow-hidden flex-1 min-h-0 flex flex-col">
        {/* Track Header */}
        <div className="p-3 sm:px-4 sm:py-3 border-b border-[#F1F3F6] flex items-center justify-between shrink-0 bg-[#FAFBFD]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2D6606] shadow-2xs" />
            <h2 className="text-sm font-bold text-[#111827]">Visual Schedule Track</h2>
            <span className="text-xs text-[#6B7280] font-mono hidden sm:inline">• Horizontal Month Gantt Roadmap</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <span className="bg-[#F4F5F7] px-2 py-0.5 rounded font-mono font-medium text-[#111827]">
              {milestones.length} SOW Phases
            </span>
            <span className="hidden sm:inline">• Click any row or bar to inspect details</span>
          </div>
        </div>

        {/* Scrollable Gantt Canvas with Proper Column Widths & Full Vertical Stretch */}
        <div className="flex-1 min-h-0 overflow-auto custom-scrollbar flex flex-col">
          <div className="min-w-[1540px] flex-1 flex flex-col">
            {/* Month Axis Header (Sticky at top) */}
            <div
              className="grid border-b border-[#E5E7EB] bg-[#F8F9FA] text-center text-xs font-bold text-[#4B5563] select-none sticky top-0 z-40 shrink-0 shadow-xs"
              style={{
                gridTemplateColumns: `340px repeat(${totalMonths}, minmax(150px, 1fr))`,
              }}
            >
              <div className="py-2.5 px-4 border-r border-[#E5E7EB] text-[11px] text-[#6B7280] font-bold text-left bg-[#F4F5F7]">
                Milestone Scope & Timeline Details
              </div>
              {activeMonthList.map((m) => (
                <div
                  key={m.monthIndex}
                  className={cn(
                    "py-2.5 px-2 border-r border-[#E5E7EB] last:border-r-0 flex flex-col items-center justify-center gap-0.5",
                    m.isCurrent && "bg-[#EDE9FE] text-[#5B21B6] font-black"
                  )}
                >
                  {m.isCurrent && (
                    <span className="text-[8px] bg-[#88D635] text-[#0A2600] px-1.5 rounded font-black tracking-wider leading-none shadow-2xs mb-0.5">
                      CURRENT
                    </span>
                  )}
                  <span className="text-xs font-bold tracking-tight">{m.label}</span>
                  <span className="text-[10px] text-[#9CA3AF] font-mono">{m.name}</span>
                </div>
              ))}
            </div>

            {/* Milestone Rows (Taller, spacious, filling height, with accurate dates & no text clipping) */}
            <div className="divide-y divide-[#F1F3F6] flex-1 flex flex-col justify-around">
              {milestones.map((m) => {
                const isSelected = m.id === selectedMilestoneId;
                const isHardCapped = m.usedIterations >= m.maxIterations;
                const monthSpan = Math.max(1, m.endMonth - m.startMonth + 1);
                const statusConfig = getJiraMilestoneStatus(m.status);

                return (
                  <div
                    key={m.id}
                    onClick={() => openMilestoneModal(m.id, "overview")}
                    className={cn(
                      "grid items-center transition-all cursor-pointer group min-h-[105px]",
                      "hover:bg-[#FAFBFD]",
                      isSelected && "bg-[#F0FDF4]/90"
                    )}
                    style={{
                      gridTemplateColumns: `340px repeat(${totalMonths}, minmax(150px, 1fr))`,
                    }}
                  >
                    {/* Left Meta Column: 340px wide, Jira Epic format with Key, Title, Status, Dates & Tags */}
                    <div className="p-3 sm:px-4 border-r border-[#E5E7EB] bg-[#FAFAFA] group-hover:bg-[#F4F5F7] transition-colors flex flex-col justify-between h-full gap-2">
                      {/* Row 1: Key, Title & Escrow Badge */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-1.5 flex-1 min-w-0">
                          <span className="px-1.5 py-0.5 rounded bg-[#0052CC] text-white font-mono font-bold text-[10px] shrink-0 shadow-2xs mt-0.5">
                            {m.number}
                          </span>
                          <h3 className="font-bold text-xs text-[#111827] group-hover:text-[#0052CC] transition-colors leading-snug line-clamp-2" title={m.title}>
                            {m.title}
                          </h3>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-md border border-[#BBF7D0] shrink-0 shadow-2xs">
                          {formatCurrency(m.escrowAmount)}
                        </span>
                      </div>

                      {/* Row 2: Status Pill & Exact Dates */}
                      <div className="flex items-center justify-between text-[11px] gap-2">
                        <div className="flex items-center gap-1.5 font-mono text-[#4B5563] text-[10.5px]">
                          <CalendarIcon className="w-3 h-3 text-[#9CA3AF] shrink-0" />
                          <span>{m.startDate} – {m.endDate}</span>
                        </div>
                        <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded border uppercase shrink-0 font-sans tracking-wide", statusConfig.bg, statusConfig.color, statusConfig.border)}>
                          {statusConfig.text}
                        </span>
                      </div>

                      {/* Row 3: Progress, Duration & Revision Cap */}
                      <div className="flex items-center justify-between text-[10px] text-[#6B7280]">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#0052CC] font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0052CC]" />
                            {m.progressPercent}% Complete
                          </span>
                          <span className="text-[#D1D5DB]">•</span>
                          <span className="font-mono text-[#6B7280]">{m.durationLabel}</span>
                        </div>
                        <span
                          className={cn(
                            "font-mono px-1.5 py-0.5 rounded text-[9px] font-semibold",
                            isHardCapped ? "bg-[#FEE2E2] text-[#991B1B] font-bold" : "bg-[#F3F4F6] text-[#4B5563]"
                          )}
                        >
                          Iter: {m.usedIterations}/{m.maxIterations}
                        </span>
                      </div>

                      {/* Row 4: Proper Milestone Domain Tags */}
                      {m.tags && m.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-black/[0.04]">
                          {m.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[9.5px] font-mono font-medium px-1.5 py-0.5 rounded bg-white text-[#4B5563] border border-[#E5E7EB] shadow-2xs hover:border-[#0052CC]/40 hover:text-[#0052CC] transition-colors"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Gantt Bar spanning startMonth to endMonth with Jira Progress Fill Track */}
                    <div
                      className="relative h-full flex items-center px-2 py-2"
                      style={{
                        gridColumn: `${m.startMonth + 1} / span ${monthSpan}`,
                      }}
                    >
                      <div
                        className={cn(
                          "relative w-full h-14 rounded-xl px-3 py-2 flex items-center shadow-xs transition-all border group-hover:shadow-md group-hover:scale-[1.006] overflow-hidden",
                          m.status === "completed"
                            ? "bg-[#F0FDF4] border-[#86EFAC] text-[#166534]"
                            : m.status === "in_review"
                            ? "bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]"
                            : m.status === "in_progress"
                            ? "bg-[#EFF6FF] border-[#BFDBFE] text-[#1E40AF]"
                            : "bg-[#F8FAFC] border-[#CBD5E1] text-[#475569]",
                          isSelected && "ring-2 ring-[#0052CC] shadow-md"
                        )}
                      >
                        {/* Jira-style Inner Progress Fill Track */}
                        <div
                          className={cn(
                            "absolute inset-y-0 left-0 transition-all duration-300 pointer-events-none opacity-20",
                            m.status === "completed"
                              ? "bg-[#16A34A]"
                              : m.status === "in_review"
                              ? "bg-[#D97706]"
                              : m.status === "in_progress"
                              ? "bg-[#2563EB]"
                              : "bg-[#64748B]"
                          )}
                          style={{ width: `${m.progressPercent}%` }}
                        />

                        {/* Compact 1-Month Layout vs Spacious Multi-Month Layout */}
                        {monthSpan === 1 ? (
                          <div className="relative z-10 flex flex-col justify-center h-full w-full min-w-0 gap-0.5">
                            <div className="flex items-center justify-between gap-1.5 min-w-0">
                              <span className="font-bold text-xs truncate tracking-tight" title={`${m.number}: ${m.title}`}>
                                {m.number}: {m.title}
                              </span>
                              <span className={cn("inline-flex items-center gap-1 text-[8.5px] font-bold uppercase px-1.5 py-0.5 rounded shadow-2xs shrink-0 border bg-white/95", statusConfig.color, statusConfig.border)}>
                                {m.status === "completed" && <CheckCircle2 className="w-2.5 h-2.5 text-[#166534]" />}
                                {m.status === "in_review" && <Clock className="w-2.5 h-2.5 text-[#D97706]" />}
                                {m.status === "in_progress" && <Flame className="w-2.5 h-2.5 text-[#2563EB]" />}
                                <span>{statusConfig.text}</span>
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-mono opacity-85">
                              <span>{m.startDate.slice(0, 6)} – {m.endDate.slice(0, 6)}</span>
                              <span className="font-semibold">{m.progressPercent}%</span>
                            </div>
                          </div>
                        ) : (
                          <div className="relative z-10 flex items-center justify-between w-full gap-3 min-w-0">
                            {/* Left: Milestone Number, Title & Schedule Details */}
                            <div className="flex flex-col min-w-0 justify-center">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="font-bold text-xs shrink-0">{m.number}:</span>
                                <span className="text-xs font-bold truncate tracking-tight" title={m.title}>
                                  {m.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono opacity-85 truncate">
                                <span>{m.startDate} – {m.endDate}</span>
                                <span>•</span>
                                <span className="font-semibold">{m.durationLabel}</span>
                                <span>•</span>
                                <span className="font-semibold">{m.progressPercent}% Complete</span>
                              </div>
                            </div>

                            {/* Right: Clean Status Pill */}
                            <span className={cn("flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded-md shadow-2xs border bg-white/95 shrink-0", statusConfig.color, statusConfig.border)}>
                              {m.status === "completed" && <CheckCircle2 className="w-3.5 h-3.5 text-[#166534]" />}
                              {m.status === "in_review" && <Clock className="w-3.5 h-3.5 text-[#D97706]" />}
                              {m.status === "in_progress" && <Flame className="w-3.5 h-3.5 text-[#2563EB]" />}
                              <span>{statusConfig.text}</span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Integrated Bottom Summary Footer to ground the card and utilize the vertical space properly */}
        <div className="p-3 sm:px-4 sm:py-2.5 border-t border-[#F1F3F6] bg-[#FAFBFD] flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 select-none">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#166534]" />
              <span className="text-[#6B7280]">Completed:</span>
              <span className="font-bold text-[#111827]">
                {milestones.filter((m) => m.status === "completed").length} Phase ({formatCurrency(milestones.filter((m) => m.status === "completed").reduce((s, m) => s + m.escrowAmount, 0))})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D97706]" />
              <span className="text-[#6B7280]">In Review:</span>
              <span className="font-bold text-[#111827]">
                {milestones.filter((m) => m.status === "in_review").length} Phase ({formatCurrency(milestones.filter((m) => m.status === "in_review").reduce((s, m) => s + m.escrowAmount, 0))})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
              <span className="text-[#6B7280]">In Progress:</span>
              <span className="font-bold text-[#111827]">
                {milestones.filter((m) => m.status === "in_progress").length} Phase ({formatCurrency(milestones.filter((m) => m.status === "in_progress").reduce((s, m) => s + m.escrowAmount, 0))})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#94A3B8]" />
              <span className="text-[#6B7280]">Upcoming:</span>
              <span className="font-bold text-[#111827]">
                {milestones.filter((m) => m.status === "proposed").length} Phases ({formatCurrency(milestones.filter((m) => m.status === "proposed").reduce((s, m) => s + m.escrowAmount, 0))})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-[#6B7280]">
            <span>Total Escrow: <strong className="text-[#166534]">{formatCurrency(totalEscrowAmount)}</strong></span>
            <span>•</span>
            <span>Contract ID: <strong className="text-[#111827]">SOW-2026-9921</strong></span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. CENTERED DETAIL POPUP MODAL (Replacing Unwanted Side Panel)             */}
      {/* ========================================================================= */}
      {showDetailModal && selectedMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-2xl border border-black/[0.08] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header: Confluence Milestone Spec */}
            {(() => {
              const selectedStatusConfig = getJiraMilestoneStatus(selectedMilestone.status);
              return (
                <div className="p-4 sm:p-5 border-b border-[#F1F3F6] flex items-start justify-between gap-3 bg-[#FAFBFD] shrink-0">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0052CC] text-white font-mono font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs">
                      {selectedMilestone.number}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold text-[#0052CC] bg-[#DEEBFF] px-2 py-0.5 rounded tracking-wider">
                          LOCKLOOP / {selectedMilestone.number}
                        </span>
                        <span className="text-[11px] font-sans text-[#6B7280]">Confluence Milestone Specification</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-[#111827] leading-snug">
                          {selectedMilestone.title}
                        </h2>
                        <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold border uppercase shrink-0", selectedStatusConfig.bg, selectedStatusConfig.color, selectedStatusConfig.border)}>
                          {selectedStatusConfig.text}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-[#6B7280] font-mono">
                        <span>{selectedMilestone.startDate} – {selectedMilestone.endDate} ({selectedMilestone.durationLabel})</span>
                        <span>•</span>
                        <span className="font-bold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded border border-[#BBF7D0]">
                          {formatCurrency(selectedMilestone.escrowAmount)} Locked in Escrow
                        </span>
                      </div>

                      {/* Domain Tags */}
                      {selectedMilestone.tags && selectedMilestone.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap mt-2">
                          {selectedMilestone.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white text-[#4B5563] border border-[#E5E7EB] shadow-2xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors cursor-pointer shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              );
            })()}

            {/* Modal Tab Navigation */}
            <div className="flex items-center border-b border-[#F1F3F6] bg-white px-5 shrink-0 text-xs font-semibold">
              {[
                { id: "overview", label: "Overview & Deliverables", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
                { id: "iterations", label: `Revisions (${selectedMilestone.usedIterations}/${selectedMilestone.maxIterations})`, icon: <History className="w-3.5 h-3.5" /> },
                { id: "proof", label: "Proof & Artifacts", icon: <Video className="w-3.5 h-3.5" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setModalTab(tab.id as typeof modalTab)}
                  className={cn(
                    "flex items-center gap-1.5 py-3 px-3.5 border-b-2 transition-all cursor-pointer whitespace-nowrap",
                    modalTab === tab.id
                      ? "border-[#0052CC] text-[#111827] font-bold"
                      : "border-transparent text-[#6B7280] hover:text-[#111827]"
                  )}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 text-xs custom-scrollbar">
              {/* TAB 1: OVERVIEW & DELIVERABLES */}
              {modalTab === "overview" && (
                <div className="flex flex-col gap-4">
                  {/* Scope Description */}
                  <div className="p-3.5 bg-[#F9FAFB] rounded-xl border border-black/[0.04]">
                    <span className="font-bold text-[#111827] block mb-1">Contract Scope Description</span>
                    <p className="text-[#4B5563] leading-relaxed">
                      {selectedMilestone.description}
                    </p>
                  </div>

                  {/* Confluence-style Acceptance Criteria Checklist */}
                  <div className="p-3.5 bg-[#FAFBFD] rounded-xl border border-black/[0.06] flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#0052CC]" />
                        <span className="font-bold text-[#111827] text-xs">Confluence Acceptance Criteria Specification</span>
                      </div>
                      <span className="text-[10px] font-semibold text-[#006644] bg-[#E3FCEF] px-2 py-0.5 rounded border border-[#ABF5D1]">
                        Contractually Binding SLA
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs text-[#4B5563] pt-1">
                      <div className="flex items-start gap-2">
                        <span className="text-[#006644] font-bold">✓</span>
                        <span>All deliverable checklist items must have passing CI checks and clean PR diffs</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#006644] font-bold">✓</span>
                        <span>16:9 recorded Loom video demo submitted for verification prior to escrow release</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#006644] font-bold">✓</span>
                        <span>Max {selectedMilestone.maxIterations} revision rounds strictly enforced before scope firewall triggers</span>
                      </div>
                    </div>
                  </div>

                  {/* Deliverables Checklist */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#111827] text-xs">
                        Deliverables Checklist ({selectedMilestone.deliverables.filter((d) => d.completed).length} of {selectedMilestone.deliverables.length})
                      </span>
                      <span className="text-[11px] text-[#6B7280]">
                        Click any item to toggle status
                      </span>
                    </div>

                    <div className="divide-y divide-[#F1F3F6] border border-[#E5E7EB] rounded-xl overflow-hidden bg-white shadow-2xs">
                      {selectedMilestone.deliverables.map((d) => (
                        <div
                          key={d.id}
                          onClick={() => handleToggleDeliverable(selectedMilestone.id, d.id)}
                          className={cn(
                            "p-3 flex items-center justify-between gap-3 hover:bg-[#FAFBFD] cursor-pointer transition-colors select-none",
                            d.completed && "bg-[#F0FDF4]/50"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={d.completed}
                              onChange={() => {}}
                              className="w-4 h-4 rounded text-[#2D6606] focus:ring-[#88D635] cursor-pointer"
                            />
                            <span
                              className={cn(
                                "font-medium text-xs",
                                d.completed ? "line-through text-[#6B7280]" : "text-[#111827]"
                              )}
                            >
                              {d.title}
                            </span>
                          </div>

                          <Badge
                            variant={d.completed ? "lime" : "outline"}
                            className="text-[9px] py-0 px-1.5 shrink-0"
                          >
                            {d.completed ? "Completed" : "Pending"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Escrow Lock Terms */}
                  <div className="p-3.5 bg-[#FAF5FF] border border-[#E9D5FF] rounded-xl flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#581C87] block">
                        Escrow Release Safeguards & 72h SLA
                      </span>
                      <p className="text-[#6B21A8] mt-0.5 leading-relaxed">
                        Funds ({formatCurrency(selectedMilestone.escrowAmount)}) are held in decentralized lock. Upon submission of deliverables, the 72-hour review window commences. If no dispute or revision is filed within 72h, escrow releases automatically.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: REVISIONS & ITERATION QUOTA */}
              {modalTab === "iterations" && (
                <div className="flex flex-col gap-4">
                  {/* Quota Banner */}
                  <div className="p-4 bg-gradient-to-r from-[#F0FDF4] to-[#DCFCE7] border border-[#86EFAC] rounded-xl flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold text-[#166534] uppercase tracking-wider block">
                        Contractual Revision Quota
                      </span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-2xl font-black text-[#14532D]">
                          {selectedMilestone.usedIterations}
                        </span>
                        <span className="text-sm font-semibold text-[#166534]">
                          of {selectedMilestone.maxIterations} Allowed Revisions Used
                        </span>
                      </div>
                      <p className="text-[11px] text-[#15803D] mt-1">
                        SOW agreed limit protects against scope creep. Further changes require a funded Change Order.
                      </p>
                    </div>

                    <Button
                      variant="dark"
                      size="sm"
                      onClick={() => setShowIterationModal(true)}
                      disabled={selectedMilestone.usedIterations >= selectedMilestone.maxIterations}
                      className="text-xs font-bold shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#88D635] mr-1" />
                      Request Revision
                    </Button>
                  </div>

                  {/* History Logs */}
                  <div className="flex flex-col gap-2">
                    <span className="font-bold text-[#111827] text-xs">
                      Revision Round History ({selectedMilestone.iterationHistory.length})
                    </span>

                    {selectedMilestone.iterationHistory.length === 0 ? (
                      <div className="p-6 text-center border border-dashed border-[#D1D5DB] rounded-xl text-[#6B7280]">
                        <Clock className="w-6 h-6 mx-auto mb-1.5 text-[#9CA3AF]" />
                        <span className="font-semibold block text-xs">No Revisions Logged Yet</span>
                        <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                          First submission is currently in progress/review. Milestone has {selectedMilestone.maxIterations} contractual revisions available.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {selectedMilestone.iterationHistory.map((h) => (
                          <div
                            key={h.round}
                            className="p-3.5 rounded-xl border border-[#E5E7EB] bg-white shadow-2xs flex flex-col gap-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-[#111827] text-white text-[10px] font-bold flex items-center justify-center">
                                  {h.round}
                                </span>
                                <span className="font-bold text-xs text-[#111827]">
                                  Revision Round {h.round}
                                </span>
                              </div>
                              <span className="text-[10px] font-mono text-[#6B7280]">{h.date}</span>
                            </div>

                            <p className="text-xs text-[#4B5563] bg-[#F9FAFB] p-2.5 rounded-lg border border-black/[0.04] leading-relaxed">
                              &ldquo;{h.note}&rdquo;
                            </p>

                            <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
                              <span>Requested by: <strong className="text-[#111827]">{h.requestedBy}</strong></span>
                              <Badge variant="lime" className="text-[9px] py-0 px-1.5">
                                {h.status === "completed" ? "Resolved" : "In Progress"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: PROOF ARTIFACTS & ACTIVITY */}
              {modalTab === "proof" && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="font-bold text-[#111827] text-xs">
                      Proof-of-Work Artifacts & Verification
                    </span>

                    {selectedMilestone.proofArtifacts && selectedMilestone.proofArtifacts.length > 0 ? (
                      <div className="space-y-2">
                        {selectedMilestone.proofArtifacts.map((art, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl border border-[#E5E7EB] bg-white shadow-2xs hover:border-[#CBD5E1] transition-all flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-[#F3F4F6] text-[#111827] flex items-center justify-center shrink-0">
                                {art.type === "loom" && <Video className="w-4 h-4 text-[#7C3AED]" />}
                                {art.type === "git" && <GitCommit className="w-4 h-4 text-[#2563EB]" />}
                                {art.type === "figma" && <Sparkles className="w-4 h-4 text-[#EA580C]" />}
                                {art.type === "doc" && <FileText className="w-4 h-4 text-[#16A34A]" />}
                              </div>
                              <div className="min-w-0">
                                <span className="font-bold text-xs text-[#111827] truncate block">
                                  {art.title}
                                </span>
                                <span className="text-[10px] font-mono text-[#6B7280]">
                                  {art.meta}
                                </span>
                              </div>
                            </div>

                            <a
                              href={art.url}
                              onClick={(e) => {
                                e.preventDefault();
                                showToast(`Opened proof artifact: ${art.title}`);
                              }}
                              className="px-2.5 py-1 rounded-md bg-[#F4F5F7] hover:bg-[#E5E7EB] text-xs font-semibold text-[#111827] flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                            >
                              <span>View</span>
                              <ExternalLink className="w-3 h-3 text-[#6B7280]" />
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center border border-dashed border-[#D1D5DB] rounded-xl text-[#6B7280]">
                        <FileText className="w-6 h-6 mx-auto mb-1 text-[#9CA3AF]" />
                        <span>No proof artifacts uploaded for this phase yet.</span>
                      </div>
                    )}
                  </div>

                  {/* Audit Trail */}
                  <div className="p-3.5 bg-[#FAFBFD] border border-black/[0.04] rounded-xl flex flex-col gap-2">
                    <span className="font-bold text-[#111827] text-xs">Milestone Lifecycle Audit Trail</span>
                    <div className="space-y-1.5 text-[11px] text-[#6B7280]">
                      <div className="flex items-center justify-between">
                        <span>SOW Schedule Locked</span>
                        <span className="font-mono">Sep 13, 2026</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Escrow Funded into Vault</span>
                        <span className="font-mono">Sep 14, 2026</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Work Sprint Initiated</span>
                        <span className="font-mono">{selectedMilestone.startDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-[#F1F3F6] flex items-center justify-between gap-3 bg-[#FAFBFD] shrink-0">
              <span className="text-xs text-[#6B7280] font-mono">
                {selectedMilestone.number} • {selectedMilestone.status.toUpperCase()}
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetailModal(false)}
                  className="text-xs"
                >
                  Close
                </Button>
                {selectedMilestone.status === "in_review" && (
                  <Button
                    variant="dark"
                    size="sm"
                    onClick={() => {
                      setMilestones((prev) =>
                        prev.map((m) =>
                          m.id === selectedMilestone.id ? { ...m, status: "completed", progressPercent: 100 } : m
                        )
                      );
                      setShowDetailModal(false);
                      showToast(`Milestone ${selectedMilestone.number} approved! Escrow released.`);
                    }}
                    className="text-xs font-bold gap-1 bg-[#15803D] hover:bg-[#166534] text-white"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#88D635]" />
                    <span>Approve & Release Funds</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: TIMELINE SETTER (Configure Spans, Months & Iteration Limits)     */}
      {/* ========================================================================= */}
      {showTimelineSetterModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-black/[0.1] shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-[#F1F3F6] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#2D6606]" />
                <h3 className="text-base font-bold text-[#111827]">
                  Timeline Schedule & Milestone Setter
                </h3>
              </div>
              <button
                onClick={() => setShowTimelineSetterModal(false)}
                className="p-1 rounded-md text-[#6B7280] hover:bg-[#F3F4F6]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-4 text-xs custom-scrollbar">
              <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-[#166534] leading-relaxed">
                <strong>Configurable Timeline Engine:</strong> Adjust project duration span (4 to 12 Months), assign milestones to month slots, and establish contractual iteration caps (1 to 3 revisions max).
              </div>

              {/* Total Duration Picker */}
              <div className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-xl bg-[#FAFAFA]">
                <div>
                  <span className="font-bold text-xs text-[#111827] block">
                    Overall Project Scope Duration
                  </span>
                  <span className="text-[#6B7280]">
                    Select total roadmap months for contract execution
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#E5E7EB]">
                  {[4, 6, 8, 12].map((mCount) => (
                    <button
                      key={mCount}
                      type="button"
                      onClick={() => setDraftTotalMonths(mCount)}
                      className={cn(
                        "px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-all",
                        draftTotalMonths === mCount
                          ? "bg-[#111827] text-white shadow-xs font-bold"
                          : "text-[#6B7280] hover:bg-[#F3F4F6]"
                      )}
                    >
                      {mCount} Months
                    </button>
                  ))}
                </div>
              </div>

              {/* Milestones Configuration List */}
              <div className="flex flex-col gap-2">
                <span className="font-bold text-[#111827]">Milestones Schedule & Limits</span>
                <div className="space-y-3">
                  {draftMilestones.map((m) => (
                    <div
                      key={m.id}
                      className="p-3.5 rounded-xl border border-[#E5E7EB] bg-white flex flex-col gap-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded bg-[#111827] text-white font-mono font-bold text-xs flex items-center justify-center">
                            {m.number}
                          </span>
                          <span className="font-bold text-xs text-[#111827]">{m.title}</span>
                        </div>
                        <div className="flex items-center gap-1 font-mono text-xs">
                          <span>$</span>
                          <input
                            type="number"
                            value={m.escrowAmount}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setDraftMilestones((prev) =>
                                prev.map((item) => (item.id === m.id ? { ...item, escrowAmount: val } : item))
                              );
                            }}
                            className="w-20 text-xs font-bold text-[#111827] border rounded px-1.5 py-0.5"
                          />
                        </div>
                      </div>

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
                            {Array.from({ length: draftTotalMonths }, (_, i) => i + 1).filter((mo) => mo >= m.startMonth).map((mo) => (
                              <option key={mo} value={mo}>
                                Month {mo}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[#6B7280] block font-medium">Iterations Limit</label>
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

            <div className="p-4 border-t border-[#F1F3F6] flex items-center justify-between shrink-0 bg-[#FAFBFD]">
              <span className="text-[11px] text-[#6B7280]">
                Schedule updates lock upon mutual agreement.
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
                  <span>Save Schedule</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: MUTUAL AMENDMENT REQUEST                                         */}
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
                <strong>Mutual Agreement Protocol:</strong> The SOW timeline is legally locked. Adjusting milestone dates generates an amendment request that <strong>both parties must sign</strong>.
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
                  placeholder="e.g. Third-party API webhook verification delay..."
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
                <span>Submit for Mutual Approval</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL: SUBMIT REVISION / ITERATION                                     */}
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
                        ⚠️ Caution: This will be your FINAL included revision round. Further changes require a funded Change Order.
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
