# Product Requirements Document (PRD)
## Project Name: LoopLock (The Social Accountability & Micro-Escrow Platform)
**Target Directory:** `/Users/parth/Developer/BUILD/freelance-itch`  
**Problem Statement Itch Score:** 76 / 100 (Severity: 8, TAM: 7, Whitespace: 7.5, Frequency: 7)  
**Status:** Approved Post-Grill-Me Architecture Specification  

---

## 1. Executive Summary & Problem Breakdown

### 1.1 The Core Problem
Informal freelance hiring (conducted via WhatsApp, Telegram, Twitter/X DMs, and personal referrals) suffers from a catastrophic structural failure: **The Inverted Effort-to-Reward Curve**.
- When clients pay a **30%–50% upfront deposit**, the freelancer captures high liquidity with minimal sunk cost.
- As the project encounters minor scope creep, fatigue, or a more lucrative client offer, the marginal financial reward of completing the remaining 50% drops below the mental and temporal cost.
- Because informal channels lack escrow, time tracking verification, legally binding IP transfer checkpoints, and public reputation stakes, the path of least resistance is to **ghost**.
- **Consequences:** Businesses lose thousands of dollars, inherit broken or un-versioned files without source code, experience critical launch delays, and possess zero legal recourse to claw back funds or claim damages.

### 1.2 The LoopLock Solution
LoopLock transforms informal deals into transparent, legally secured, and socially accountable partnerships through five interlocking systems:
1. **Behance/Dribbble-Style Social Work Feed**: Daily visual "Proof of Work" posts (screenshots, Loom walk-throughs, commit hashes, logged hours) replace silent text check-ins.
2. **Progressive Micro-Escrow (15–25% Tranches)**: Eliminates giant advance payouts. Escrow funds are secured upfront but released incrementally upon verified checklist items and audited timesheets.
3. **Dual-Signed Smart SOW & Progressive IP Escrow**: Intellectual property rights legally transfer tranche-by-tranche as payments clear.
4. **48h/72h Dead-Man's Switch**: Inactivity triggers automated escalation: 24h ping, 48h timesheet freeze, and 72h automated escrow lock with a 1-click client clawback and asset export.
5. **Change-Order Firewall & 2-Revision Cap**: Stops unpaid scope creep before it breeds resentment and abandonment.

---

## 2. Target Personas & User Journeys

### Persona A: The Hiring Business / Founder ("The Client")
- **Pain Point**: Burnt by past freelancers disappearing after receiving a $2,000 deposit; scared to prepay but unable to attract top talent without upfront commitment.
- **Needs**: Assured deliverables, transparent timesheets, version-controlled source files, clear tax invoices, and a kill-switch if work stops.
- **Workflow**:
  1. Accepts or generates a project invite link.
  2. Reviews milestones (e.g. 5 tranches of 20%), rates, and SOW terms.
  3. Digital e-signature on the Smart SOW; deposits Milestone 1 into micro-escrow.
  4. Follows the daily visual feed, reviews Loom/Git commits, and acknowledges time logs.
  5. One-click milestone approval releases payment + generates a tax invoice.

### Persona B: The Professional Freelancer ("The Creator / Builder")
- **Pain Point**: Clients demanding infinite unpaid revisions, delayed final payments, scope creep, and chaotic feedback across WhatsApp.
- **Needs**: Guaranteed payment security via funded escrow, protection against scope creep, quick daily check-ins, and a verifiable public reliability score.
- **Workflow**:
  1. Creates a project deal link with defined milestones, hourly estimates, and deliverables.
  2. Digital e-signature on terms.
  3. Logs daily hours and posts visual progress cards (screenshots/Figma/GitHub).
  4. Submits milestone for acceptance with attached Git/design version hashes.
  5. Gets paid immediately from escrow; builds a verifiable 0–100 Trust Score.

---

## 3. Comprehensive Feature Specifications

### 3.1 Social "Proof of Work" Activity Feed (Behance / Layers Aesthetic)
- **Daily Progress Posts**: Freelancers publish media-rich updates featuring:
  - Video embed / Loom preview or high-res screenshots.
  - Logged hours for the day (e.g., `4.5 hrs: Implemented Auth & Stripe Webhooks`).
  - Linked Git commit hash (`git: 9a4f2b1`) or Figma version link.
  - Acceptance checklist items toggled.
- **Interactive Reactions**: Clients can click `Acknowledge`, `Request Clarification`, or `Love it`.
- **Feed Pinning**: Important milestone deliverables remain pinned at the top of the feed until approved.

### 3.2 Timesheet Engine & Versioned Work History
- **Hour Tracking**: Freelancers log active hours categorized by milestone.
- **Historical Timesheet Drawer**: Full audit log showing:
  - Date, duration, milestone ID, description of task.
  - Linked commit/version ID.
  - Running total against milestone hourly budget.
- **Exportable Timesheet**: Client and freelancer can export verified CSV/PDF timesheets for tax and payroll compliance.

### 3.3 Universal Asset & Git Version Vault
- **Dual Support**:
  - Technical: GitHub/GitLab repository integration, branch tracking, commit hashes, and PR URLs.
  - Creative/Non-Technical: Figma version links, cloud drive attachments (Google Drive, Dropbox, Loom).
- **Milestone Snapshotting**: When Milestone $N$ is submitted for approval, the platform generates an immutable snapshot of all attached assets and version hashes.
- **Emergency Asset Handover**: If a project triggers the Dead-Man's Switch, all stored files, Figma frames, and repository links in the vault are immediately unmasked and downloadable by the client.

### 3.4 Progressive Micro-Escrow Engine
- **Tranche Allocation**: Projects are divided into 4–6 micro-milestones (typically 15%–25% each).
- **State Machine**:
  - `DRAFT`: Milestone defined, SOW pending signature.
  - `AWAITING_DEPOSIT`: Client must fund milestone into escrow before work begins.
  - `FUNDED_IN_ESCROW`: Funds safely held in neutral platform escrow; freelancer actively logs hours.
  - `SUBMITTED_FOR_REVIEW`: Freelancer marks checklist complete; 72h review timer starts.
  - `RELEASED`: Client approves; funds instantly disburse to freelancer; tax invoice generated.
  - `LOCKED_DISPUTE`: Inactivity or disagreement halts automatic disbursements.
  - `REFUNDED`: Escrow returned to client via clawback or dispute settlement.

### 3.5 Automated Ghosting Escalation Ladder (Dead-Man's Switch)
- **T+0h to T+24h**: Normal activity window.
- **T+24h Inactivity**: Automated gentle reminder sent via In-App notification and WhatsApp deep link.
- **T+48h Inactivity**: Amber Alert status activated; timesheet logging paused; high-priority SMS/email alert sent to freelancer.
- **T+72h Inactivity**: **Dead-Man's Switch Triggers**:
  - Active milestone escrow automatically locks.
  - Client dashboard unlocks a 1-click `Clawback Escrow & Terminate` button.
  - Asset Vault unlocks all work-in-progress snapshots for client recovery.
  - Freelancer profile receives an `Unresponsive / Inactivity Strike`.

### 3.6 Change-Order Firewall & Scope Protection
- **Contract Baseline**: Agreement explicitly enumerates Included Scope and Excluded Scope.
- **Revision Quota**: 2 revision rounds per milestone included by default.
- **Change-Order Trigger**: Any out-of-scope work or revision beyond quota prompts the freelancer to submit a Change Order:
  - Change Description & Justification.
  - Additional Fee ($).
  - Additional Estimated Hours.
  - Timeline Adjustment.
- **Approval Gate**: Client must e-sign and fund the change-order into escrow before work commences.

### 3.7 In-App Project Messenger & WhatsApp Action Bridge
- **In-App Messaging**: Unified real-time chat with message threads, image attachments, timesheet tag embeds, and milestone status banners.
- **WhatsApp (`wa.me`) Deep Link Cards**: When milestones are ready for review or payments are pending, the UI generates pre-formatted WhatsApp deep links so parties can notify each other instantly with zero friction.

### 3.8 Dual-Signed Smart SOW & Legal Framework
- **Dynamic Generation**: Generates a standard, legally binding Service Agreement covering:
  - Milestone schedule & acceptance criteria.
  - Progressive IP Assignment: IP of milestone $N$ transfers unconditionally upon client release of milestone $N$ escrow.
  - Mutual Confidentiality (NDA terms).
  - Termination & Dead-Man's switch legal authorization.
- **E-Signature**: Cryptographic timestamped digital signature (Name, Email, IP Address, Timestamp).

### 3.9 Dispute Resolution System (3 Tiers)
- **Tier 1: AI Evidence Audit**: System parses SOW requirements against logged hours, feed updates, and version snapshots, generating a factual discrepancy summary.
- **Tier 2: 48h Mutual Settlement Room**: Parties can propose a split release (e.g. 60% refund to client, 40% payout to freelancer for partial hours).
- **Tier 3: Platform Arbiter**: Binding human administrator review and final escrow distribution.

### 3.10 Invoicing, Ledger & Financial Compliance
- **Proforma Invoice**: Generated when client funds milestone into escrow.
- **Final Tax Invoice**: Auto-generated upon release with GST/VAT/TIN details, company billing address, itemized milestone breakdown, and unique invoice serial numbers.
- **Ledger Overview**: Full financial summary showing Total Contract Value, Escrow Funded, Escrow Released, and Invoices Downloaded.

### 3.11 Trust & Accountability Matrix (0–100 Score)
- **Public Creator Profile**: Showcases past verified projects, portfolio feed items, client ratings.
- **Reliability Metrics**:
  - On-Time Delivery Rate (%).
  - Inactivity / Ghosting Strikes (0 = Clean, >1 = Warning Badge, >3 = Suspended).
  - Average Response Time (hrs).
  - Total Verified Hours Logged.
  - Milestone Completion Rate (%).

---

## 4. Technical Constraints & Architecture Principles
1. **No AI Slop / Generic Look**: Must feature a bespoke, high-craft, creator-centric UI inspired by Behance, Layers, and Linear.
2. **Next.js 16 + React 19 + TypeScript**: Full server and client component optimization.
3. **Tailwind CSS v4 + Lucide Icons**: Modern tokenized styling, crisp borders, dark/light contrast, and glassmorphism.
4. **State Machine Integrity**: Atomic state transitions for escrow, milestones, and dispute states.
5. **Full Single-Page Simplicity**: Intuitive tabs for Feed, Milestones, Timesheet, Asset Vault, Contract/SOW, Change Orders, and Invoices.
