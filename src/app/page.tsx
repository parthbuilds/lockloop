"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  SidebarRail,
  HeaderBar,
  Card,
  OverviewChartCard,
  PaymentCardsCarousel,
  QuickCollaborators,
  GoalTracker,
  RadialGauge,
  CostAnalysis,
  SpendingLimitCard,
  QuickTipCard,
  TransactionList,
  Badge,
  Button,
  MilestoneEscrowRoom,
  ResourceShareManager,
  ProofOfWorkFeed,
  MilestoneProjectTimeline,
  AuditedTimesheetManager,
} from "@/components/ui";
import {
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Play,
  CheckCircle2,
  Clock,
  GitCommit,
  FileText,
  AlertTriangle,
  ArrowRight,
  Layers,
  Download,
  X,
  MessageSquare,
} from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = React.useState("dashboard");
  const [role, setRole] = React.useState<"business" | "freelancer">("business");
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [notification, setNotification] = React.useState<string | null>(null);

  // Active Modals
  const [showReleaseModal, setShowReleaseModal] = React.useState(false);
  const [showFundModal, setShowFundModal] = React.useState(false);
  const [showChatModal, setShowChatModal] = React.useState(false);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="h-screen max-h-screen bg-[#F1F3F6] p-3 sm:p-3.5 flex gap-3 text-[#111827] overflow-hidden">
      {/* Toast Alert */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white px-4 py-2.5 rounded-lg shadow-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-[#88D635]" />
          <span>{notification}</span>
        </div>
      )}

      {/* 1. Left Navigation Rail (strictly non-scrollable, fits viewport) */}
      <SidebarRail
        activeId={activeTab}
        onSelect={(id) => {
          setActiveTab(id);
          showToast(`Navigated to ${id.toUpperCase()}`);
        }}
        role={role}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* 2. Main Content Viewport - strictly matching sidebar height with internal scrolling only */}
      <div className="flex-1 flex flex-col gap-2.5 min-w-0 h-[calc(100vh-1.75rem)] max-h-[calc(100vh-1.75rem)] overflow-hidden">
        {/* Top Header Bar — plain shrink-0, no sticky (sticky doesn't work inside overflow:hidden) */}
        <div className="shrink-0">
          <HeaderBar
            userName={role === "business" ? "Sarah Chen" : "Alex Rivera"}
            userEmail={role === "business" ? "s.chen@techvent.io" : "alex@rivera.dev"}
            role={role}
            onRoleChange={(r) => {
              setRole(r);
              showToast(r === "business" ? "Switched to Client view (TechVentures Inc.)" : "Switched to Freelancer view (Alex Rivera)");
            }}
            actionLabel={role === "business" ? "Fund Escrow" : "Create Deal"}
            onActionClick={() => {
              if (role === "business") {
                setShowFundModal(true);
              } else {
                showToast("Opened New Deal Proposal Generator");
              }
            }}
            onSearch={(query) => showToast(`Searching for "${query}"...`)}
          />
        </div>


        {/* ========================================================================= */}
        {/* VIEW 1: MASTER BENTO DASHBOARD (Matching ref.webp pixel layout)          */}
        {/* ========================================================================= */}
        {activeTab === "dashboard" && (
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 pb-3">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
            {/* LEFT 8 COLUMNS: Overview Chart + Middle Cards + Bottom Cards */}
            <div className="lg:col-span-8 flex flex-col gap-3">
              {/* Top Card: Recharts Bar Chart on Left + 3 Stacked Metrics on Right (Exact ref.webp layout) */}
              <Card>
                <OverviewChartCard
                  role={role}
                  totalAmount={12450}
                  totalIncome={15000}
                  totalExpenses={6700}
                  savedBalance={8300}
                />
              </Card>

              {/* Middle Row: Spending Limit & Quick Tips (2 Columns) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <SpendingLimitCard
                  title={role === "business" ? "Monthly escrow limit" : "Monthly earnings target"}
                  subtitle={role === "business" ? "Allocated across 5 milestones" : "Secured across 5 milestones"}
                  currentAmount={8600}
                  maxAmount={10000}
                  onEdit={() => showToast(role === "business" ? "Adjust Escrow Limit" : "Adjust Earnings Goal")}
                />
                <QuickTipCard
                  title={
                    role === "business"
                      ? "Optimize your budget with these quick tips"
                      : "Maximize your payouts with progressive IP releases"
                  }
                  description={
                    role === "business"
                      ? "Start preparing for the 2025 tax season by saving 10–15% for deductions."
                      : "Daily 16:9 check-ins keep the 72h timer active and ensure automatic payout release."
                  }
                  actionText="Read more"
                  onAction={() => showToast("Opened Tax & Escrow Optimization Guide")}
                />
              </div>

              {/* Bottom Row: Cost Analysis + Financial Health + Goal Tracker (3 Columns) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
                <Card className="h-full flex flex-col justify-between">
                  <CostAnalysis totalAmount={8450} />
                </Card>

                <Card className="h-full flex flex-col justify-between">
                  <RadialGauge
                    score={role === "business" ? 75 : 96}
                    title={role === "business" ? "Financial health" : "Builder reliability"}
                    subtitle={role === "business" ? "Current status" : "Delivery trust score"}
                    valueDisplay={role === "business" ? "$15,780" : "96% On-Time"}
                    caption={
                      role === "business"
                        ? "Based on aggregated escrow burn metrics over the past 30 days"
                        : "Based on 14 completed milestones and 100% IP transfer rate"
                    }
                  />
                </Card>

                <Card className="h-full flex flex-col justify-between">
                  <GoalTracker
                    onAddGoal={() => showToast("Create New Milestone Proposal")}
                  />
                </Card>
              </div>
            </div>

            {/* RIGHT 4 COLUMNS: Swipable Payment Cards + Quick Payment + Transaction History */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              {/* 1. Swipable Cards & Mode Switcher (Cards / UPI / Bank Vault + 5 Action Buttons) */}
              <Card>
                <PaymentCardsCarousel
                  role={role}
                  onFund={() => {
                    if (role === "business") {
                      setShowFundModal(true);
                    } else {
                      showToast("Opened deliverable upload dialog for Milestone 2");
                    }
                  }}
                  onRelease={() => {
                    if (role === "business") {
                      setShowReleaseModal(true);
                    } else {
                      showToast("Transferred $1,500.00 disbursed earnings to your linked bank account!");
                    }
                  }}
                  onRequest={() => {
                    if (role === "business") {
                      showToast("Requested milestone submission from builder");
                    } else {
                      showToast("Nudge reminder sent to Sarah Chen for Milestone 2 review!");
                    }
                  }}
                  onHistory={() => {
                    setActiveTab("timesheet");
                    showToast("Switched to Audited Timesheets");
                  }}
                  onAddPaymentMethod={() =>
                    showToast(
                      role === "business"
                        ? "Opened Add Card / UPI VPA Drawer"
                        : "Opened Direct Bank Payout Settings"
                    )
                  }
                />
              </Card>

              {/* 2. Quick Payment & Collaborator Strip (Matching ref.webp) */}
              <Card>
                <QuickCollaborators
                  role={role}
                  onSelect={(c) => {
                    if (c.whatsAppNumber) {
                      showToast(`WhatsApp wa.me link generated for ${c.name} (${c.whatsAppNumber})`);
                    } else {
                      setShowChatModal(true);
                    }
                  }}
                />
              </Card>

              {/* 3. Transaction History Stream (Matching ref.webp) */}
              <Card>
                <TransactionList
                  role={role}
                  onSelectTransaction={(tx) => {
                    showToast(`Transaction ${tx.id}: ${tx.title} - ${tx.status}`);
                  }}
                />
              </Card>
            </div>
          </div>
        </div>
      )}

        {/* ========================================================================= */}
        {/* VIEW 2: ESCROW MILESTONES ACCEPTANCE ROOM                                 */}
        {/* ========================================================================= */}
        {activeTab === "escrow" && (
          <MilestoneEscrowRoom
            role={role}
            onReleaseEscrow={() => setShowReleaseModal(true)}
            onFundEscrow={() => setShowFundModal(true)}
            onBackToDashboard={() => setActiveTab("dashboard")}
            showToast={showToast}
            className="flex-1"
          />
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: PROJECT TIMELINE & ROADMAP DEDICATED VIEW                         */}
        {/* ========================================================================= */}
        {activeTab === "timeline" && (
          <div className="flex-1 min-h-0 flex flex-col gap-2.5 overflow-hidden">
            <MilestoneProjectTimeline
              role={role}
              showToast={showToast}
              className="flex-1"
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: PROOF-OF-WORK MEDIA FEED & TIMELINE VIEW                           */}
        {/* ========================================================================= */}
        {activeTab === "feed" && (
          <ProofOfWorkFeed
            role={role}
            showToast={showToast}
            onBackToDashboard={() => setActiveTab("dashboard")}
            onOpenChat={() => setShowChatModal(true)}
            onReleaseEscrow={() => setShowReleaseModal(true)}
            className="flex-1"
          />
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: TIMESHEETS & HOUR AUDITS                                          */}
        {/* ========================================================================= */}
        {activeTab === "timesheet" && (
          <AuditedTimesheetManager
            role={role}
            showToast={showToast}
            className="flex-1"
          />
        )}

        {/* ========================================================================= */}
        {/* VIEW 5: SCOPE FIREWALL & CHANGE ORDERS                                    */}
        {/* ========================================================================= */}
        {activeTab === "change-orders" && (
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 pb-3">
            <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-black/[0.06]">
              <div>
                <h3 className="text-base font-bold text-[#111827]">
                  Scope Firewall & Change Order Management
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Prevent unpaid revisions and ghosting. Extra work is pre-funded into escrow before execution.
                </p>
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Card className="flex flex-col justify-between">
                <span className="text-xs font-medium text-[#6B7280]">Revision Quota</span>
                <span className="text-2xl font-bold text-[#111827] my-1">1 of 2 Left</span>
                <span className="text-[11px] text-[#2D6606]">1 round used for M2</span>
              </Card>
              <Card className="flex flex-col justify-between">
                <span className="text-xs font-medium text-[#6B7280]">Change Orders Funded</span>
                <span className="text-2xl font-bold text-[#111827] my-1">+$450.00</span>
                <span className="text-[11px] text-[#2D6606]">Stripe Subscriptions Active</span>
              </Card>
              <Card className="flex flex-col justify-between">
                <span className="text-xs font-medium text-[#6B7280]">Pending Change Orders</span>
                <span className="text-2xl font-bold text-[#111827] my-1">0 Requests</span>
                <span className="text-[11px] text-[#6B7280]">Contract scope in sync</span>
              </Card>
            </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 6: RESOURCE SHARE MANAGER (Reference Image 1 Kintsugi style)         */}
        {/* ========================================================================= */}
        {(activeTab === "vault" || activeTab === "resources") && (
          <ResourceShareManager
            role={role}
            showToast={showToast}
            onBackToDashboard={() => setActiveTab("dashboard")}
          />
        )}

        {/* ========================================================================= */}
        {/* VIEW 7: INVOICES & TAX LEDGER                                             */}
        {/* ========================================================================= */}
        {activeTab === "invoices" && (
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 pb-3">
            <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-black/[0.06]">
              <div>
                <h3 className="text-base font-bold text-[#111827]">
                  Tax Invoices & Financial Ledger
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Legally binding invoices with GST/VAT compliance and progressive IP transfer receipts.
                </p>
              </div>

            </div>

            <Card className="divide-y divide-[#F1F3F6]">
              <div className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#111827] block">Tax Invoice #INV-2026-001</span>
                  <span className="text-[#6B7280]">Milestone 1: Database Architecture • Paid 25 Feb 2026</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#111827] font-mono">$1,500.00</span>
                  <Button variant="outline" size="sm" onClick={() => showToast("Downloaded INV-2026-001 PDF")}>
                    <Download className="w-3.5 h-3.5 mr-1" />
                    PDF
                  </Button>
                </div>
              </div>
              <div className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#111827] block">Proforma Invoice #PRO-9921-2</span>
                  <span className="text-[#6B7280]">Milestone 2 Escrow Pre-Funding • Held in Neutral Vault</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#111827] font-mono">$1,500.00</span>
                  <Button variant="outline" size="sm" onClick={() => showToast("Downloaded Proforma PDF")}>
                    <Download className="w-3.5 h-3.5 mr-1" />
                    PDF
                  </Button>
                </div>
              </div>
            </Card>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: RELEASE ESCROW CONFIRMATION                                      */}
      {/* ========================================================================= */}
      {showReleaseModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-black/[0.08] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#F1F3F6] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#2D6606]" />
                <h3 className="text-base font-bold text-[#111827]">
                  Release Milestone 2 Escrow
                </h3>
              </div>
              <button
                onClick={() => setShowReleaseModal(false)}
                className="text-[#9CA3AF] hover:text-[#111827] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#4B5563] leading-relaxed">
              Releasing escrow triggers an instant payout of <strong>$1,500.00</strong> to Alex Rivera, generates Tax Invoice <strong>#INV-2026-002</strong>, and unconditionally transfers 100% IP rights for Milestone 2 to TechVentures Inc.
            </p>

            <div className="p-3 rounded-lg bg-[#F8F9FA] border border-black/[0.04] space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Milestone:</span>
                <span className="font-bold text-[#111827]">Core UI & API Sync</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Amount:</span>
                <span className="font-mono font-bold text-[#111827]">$1,500.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">IP Transfer Clause:</span>
                <span className="text-[#2D6606] font-semibold">Active & Binding</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReleaseModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="lime"
                size="sm"
                onClick={() => {
                  setShowReleaseModal(false);
                  showToast("Released $1,500 Escrow! Tax Invoice #INV-002 generated & IP transferred.");
                }}
              >
                Confirm & Release $1,500
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: FUND ESCROW MODAL                                                */}
      {/* ========================================================================= */}
      {showFundModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-black/[0.08] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#F1F3F6] pb-3">
              <h3 className="text-base font-bold text-[#111827]">
                Pre-Fund Escrow Tranche
              </h3>
              <button
                onClick={() => setShowFundModal(false)}
                className="text-[#9CA3AF] hover:text-[#111827] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#4B5563]">
              Funds are deposited into neutral third-party escrow. The freelancer can only claim payout after your verified acceptance.
            </p>

            <div className="space-y-2 text-xs">
              <label className="font-semibold text-[#111827] block">
                Select Tranche to Fund:
              </label>
              <select className="w-full p-2.5 rounded-lg border border-[#E5E7EB] bg-white text-xs font-medium text-[#111827]">
                <option>Milestone 2: Core UI & API ($1,500.00)</option>
                <option>Milestone 3: Production Deploy ($1,500.00)</option>
                <option>Change Order #1: Stripe Subscriptions ($450.00)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFundModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="dark"
                size="sm"
                onClick={() => {
                  setShowFundModal(false);
                  showToast("Successfully funded $1,500 into neutral escrow!");
                }}
              >
                Authorize Deposit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: IN-APP DIRECT MESSENGER & WHATSAPP BRIDGE                        */}
      {/* ========================================================================= */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-black/[0.08] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#F1F3F6] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#111827] text-white flex items-center justify-center text-xs font-bold">
                  {role === "business" ? "AR" : "SC"}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#111827]">
                    {role === "business" ? "Alex Rivera (Lead Dev)" : "Sarah Chen (Founder)"}
                  </h3>
                  <span className="text-[10px] text-[#2D6606] font-semibold">Online • WhatsApp Linked</span>
                </div>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className="text-[#9CA3AF] hover:text-[#111827] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Thread */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 text-xs">
              <div className="bg-[#F4F5F7] p-3 rounded-lg max-w-[80%]">
                <p className="text-[#111827]">
                  {role === "business"
                    ? "Hey Sarah, just uploaded today's Loom walkthrough for Milestone 2. OAuth and RLS rules are ready for your review!"
                    : "Hey Alex, saw your latest check-in for Milestone 2! Testing out the Google OAuth callback now."}
                </p>
                <span className="text-[9px] text-[#9CA3AF] mt-1 block">10:14 AM</span>
              </div>
              <div className="bg-[#111827] text-white p-3 rounded-lg max-w-[80%] ml-auto">
                <p>
                  {role === "business"
                    ? "Watched the Loom, looks super clean! Does it also support Magic Links via email?"
                    : "Awesome Sarah! Let me know if you need any tweaks to the token expiry duration."}
                </p>
                <span className="text-[9px] text-zinc-400 mt-1 block text-right">10:18 AM</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-[#F1F3F6]">
              <input
                type="text"
                placeholder={
                  role === "business"
                    ? "Type a message to Alex Rivera..."
                    : "Type a message to Sarah Chen..."
                }
                className="flex-1 p-2 rounded-lg border border-[#E5E7EB] text-xs"
              />
              <Button
                variant="dark"
                size="sm"
                onClick={() => {
                  setShowChatModal(false);
                  showToast(
                    role === "business"
                      ? "Message sent to Alex Rivera!"
                      : "Message sent to Sarah Chen!"
                  );
                }}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
