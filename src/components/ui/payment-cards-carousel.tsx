"use client";

import * as React from "react";
import { cn, formatCurrency } from "@/lib/utils";
import {
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  MoreHorizontal,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Check,
  QrCode,
  Building2,
  CreditCard as CreditCardIcon,
  Sparkles,
} from "lucide-react";
import { Button } from "./button";

export interface PaymentCard {
  id: string;
  type: "escrow" | "credit" | "debit";
  title: string;
  cardHolder: string;
  cardNumber: string;
  expiry: string;
  balance: number;
  currency: string;
  network: "visa" | "mastercard";
  tag: string;
}

const BUSINESS_CARDS: PaymentCard[] = [
  {
    id: "biz-1",
    type: "escrow",
    title: "Virtual Escrow",
    cardHolder: "TechVentures Inc.",
    cardNumber: "•••• •••• •••• 7890",
    expiry: "03/30",
    balance: 1500,
    currency: "USD",
    network: "visa",
    tag: "Protected",
  },
  {
    id: "biz-2",
    type: "credit",
    title: "Corporate Treasury",
    cardHolder: "Sarah Chen",
    cardNumber: "•••• •••• •••• 4242",
    expiry: "08/28",
    balance: 8300,
    currency: "USD",
    network: "mastercard",
    tag: "Reserve",
  },
  {
    id: "biz-3",
    type: "credit",
    title: "Operating Line",
    cardHolder: "TechVentures Inc.",
    cardNumber: "•••• •••• •••• 9921",
    expiry: "12/29",
    balance: 25000,
    currency: "USD",
    network: "visa",
    tag: "Active",
  },
];

const FREELANCER_CARDS: PaymentCard[] = [
  {
    id: "free-1",
    type: "debit",
    title: "Stripe Express",
    cardHolder: "Alex Rivera",
    cardNumber: "•••• •••• •••• 9104",
    expiry: "11/29",
    balance: 6700,
    currency: "USD",
    network: "visa",
    tag: "Disbursed",
  },
  {
    id: "free-2",
    type: "escrow",
    title: "Wise Business",
    cardHolder: "Alex Rivera Studio",
    cardNumber: "•••• •••• •••• 3318",
    expiry: "06/28",
    balance: 4250,
    currency: "USD",
    network: "mastercard",
    tag: "USD & EUR",
  },
  {
    id: "free-3",
    type: "escrow",
    title: "Escrow Claim",
    cardHolder: "Alex Rivera",
    cardNumber: "•••• •••• •••• 1152",
    expiry: "03/30",
    balance: 1500,
    currency: "USD",
    network: "visa",
    tag: "M2 Locked",
  },
];

export interface PaymentCardsCarouselProps {
  role?: "business" | "freelancer";
  onFund?: () => void;
  onRelease?: () => void;
  onRequest?: () => void;
  onHistory?: () => void;
  onAddPaymentMethod?: () => void;
  className?: string;
}

export function PaymentCardsCarousel({
  role = "business",
  onFund,
  onRelease,
  onRequest,
  onHistory,
  onAddPaymentMethod,
  className,
}: PaymentCardsCarouselProps) {
  const [activeMode, setActiveMode] = React.useState<"cards" | "upi" | "bank">("cards");
  const currentCards = role === "freelancer" ? FREELANCER_CARDS : BUSINESS_CARDS;
  const [cardIndex, setCardIndex] = React.useState(0);
  const [touchStartX, setTouchStartX] = React.useState<number | null>(null);

  React.useEffect(() => {
    setCardIndex(0);
  }, [role]);

  const activeCard = currentCards[cardIndex] || currentCards[0];

  const nextCard = () => {
    setCardIndex((prev) => (prev + 1) % currentCards.length);
  };

  const prevCard = () => {
    setCardIndex((prev) => (prev - 1 + currentCards.length) % currentCards.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 40) {
      nextCard();
    } else if (diff < -40) {
      prevCard();
    }
    setTouchStartX(null);
  };

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      {/* Top Header: "My card & Escrow" + Add Card Button */}
      <div className="flex items-center justify-between w-full">
        <div>
          <h4 className="text-sm font-semibold text-[#111827] whitespace-nowrap">
            {role === "business" ? "My card & Escrow" : "Payout & Escrow Cards"}
          </h4>
          <p className="text-[11px] text-[#6B7280] whitespace-nowrap">
            {role === "business" ? "Client funding & escrow" : "Direct builder disbursements"}
          </p>
        </div>
        <button
          onClick={onAddPaymentMethod}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#111827] bg-[#F4F5F7] hover:bg-[#E5E7EB] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5 text-[#111827]" />
          <span>{role === "business" ? "Add card" : "Link bank"}</span>
        </button>
      </div>

      {/* Payment Mode Switcher (Cards / UPI / Bank) */}
      <div className="flex items-center bg-[#F4F5F7] p-1 rounded-lg text-xs font-medium text-[#6B7280] w-full">
        <button
          onClick={() => setActiveMode("cards")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-md transition-all cursor-pointer whitespace-nowrap",
            activeMode === "cards"
              ? "bg-white text-[#111827] font-semibold shadow-xs"
              : "hover:text-[#111827]"
          )}
        >
          <CreditCardIcon className="w-3.5 h-3.5" />
          <span>Cards</span>
        </button>
        <button
          onClick={() => setActiveMode("upi")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-md transition-all cursor-pointer whitespace-nowrap",
            activeMode === "upi"
              ? "bg-white text-[#111827] font-semibold shadow-xs"
              : "hover:text-[#111827]"
          )}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>UPI</span>
        </button>
        <button
          onClick={() => setActiveMode("bank")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-md transition-all cursor-pointer whitespace-nowrap",
            activeMode === "bank"
              ? "bg-white text-[#111827] font-semibold shadow-xs"
              : "hover:text-[#111827]"
          )}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Vault</span>
        </button>
      </div>

      {/* MODE 1: SWIPABLE PHYSICAL CARDS (Authentic credit card dimensions, no stretching, no two-line wrap) */}
      {activeMode === "cards" && (
        <div className="relative w-full max-w-[320px] mx-auto">
          <div
            className="relative cursor-grab active:cursor-grabbing select-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* The Active Card with true 1.586/1 credit card aspect ratio */}
            <div
              className={cn(
                "relative w-full h-[202px] aspect-[1.586/1] rounded-[16px] p-4 text-white transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.08)] flex flex-col justify-between overflow-hidden border",
                activeCard.type === "escrow"
                  ? "bg-gradient-to-br from-[#88D635] via-[#73BE24] to-[#4F9410] text-[#0A2600] border-[#88D635]/40 shadow-[0_10px_24px_rgba(136,214,53,0.22)]"
                  : activeCard.type === "credit"
                  ? "bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#020617] text-white border-white/10 shadow-[0_10px_24px_rgba(0,0,0,0.3)]"
                  : "bg-gradient-to-br from-[#1E1B4B] via-[#0F172A] to-[#0B0F19] text-white border-white/10 shadow-[0_10px_24px_rgba(15,23,42,0.25)]"
              )}
            >
              {/* Subtle glass reflection & shine highlights */}
              <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-white/15 blur-2xl pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/10 pointer-events-none" />

              {/* Card Top Row: Title, Balance & Contactless / Security Pill */}
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <span
                    className={cn(
                      "text-[9px] font-extrabold uppercase tracking-widest block whitespace-nowrap",
                      activeCard.type === "escrow" ? "text-[#0F2D00]/70" : "text-zinc-400"
                    )}
                  >
                    {activeCard.title}
                  </span>
                  <span
                    className={cn(
                      "text-xl font-black tracking-tight block font-mono mt-0.5 whitespace-nowrap",
                      activeCard.type === "escrow" ? "text-[#0A2600]" : "text-white"
                    )}
                  >
                    {formatCurrency(activeCard.balance, activeCard.currency)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <div
                    className={cn(
                      "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-2xs whitespace-nowrap",
                      activeCard.type === "escrow"
                        ? "bg-[#0A2600]/15 text-[#0A2600]"
                        : "bg-white/10 text-zinc-200"
                    )}
                  >
                    <ShieldCheck className="w-3 h-3 shrink-0" />
                    <span>{activeCard.tag}</span>
                  </div>

                  {/* Contactless waves symbol */}
                  <svg
                    className={cn(
                      "w-3.5 h-3.5 rotate-90 shrink-0",
                      activeCard.type === "escrow" ? "text-[#0A2600]/60" : "text-zinc-400"
                    )}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  >
                    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                    <path d="M8.5 15.5a6 6 0 0 1 7 0" />
                  </svg>
                </div>
              </div>

              {/* Card Middle: EMV Metallic Chip */}
              <div className="relative z-10 my-auto flex items-center justify-between">
                <div className="w-9 h-6.5 rounded-[5px] bg-gradient-to-tr from-[#E6CA65] via-[#F5E296] to-[#C9A93E] border border-[#A8872B]/60 shadow-xs flex items-center justify-center p-0.5 shrink-0">
                  <div className="w-full h-full border border-[#856515]/40 rounded-[2px] flex">
                    <div className="w-1/2 border-r border-[#856515]/40" />
                    <div className="w-1/2" />
                  </div>
                </div>
                <span
                  className={cn(
                    "text-[9px] font-mono tracking-wider font-semibold opacity-70 whitespace-nowrap",
                    activeCard.type === "escrow" ? "text-[#0A2600]" : "text-zinc-300"
                  )}
                >
                  {role === "business" ? "FDIC ESCROW" : "STRIPE PAYOUT"}
                </span>
              </div>

              {/* Card Bottom: Number, Holder & Network Brand */}
              <div className="relative z-10 space-y-1">
                <p
                  className={cn(
                    "font-mono text-sm tracking-[0.16em] font-semibold whitespace-nowrap",
                    activeCard.type === "escrow"
                      ? "text-[#0A2600]/95"
                      : "text-zinc-100"
                  )}
                >
                  {activeCard.cardNumber}
                </p>

                <div
                  className={cn(
                    "flex items-end justify-between text-[11px] font-medium pt-0.5",
                    activeCard.type === "escrow"
                      ? "text-[#0F2D00]/80"
                      : "text-zinc-400"
                  )}
                >
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[8px] uppercase tracking-wider block opacity-70 font-semibold leading-none whitespace-nowrap">
                      Cardholder
                    </span>
                    <span className="truncate max-w-[130px] font-bold block leading-tight whitespace-nowrap">
                      {activeCard.cardHolder}
                    </span>
                  </div>

                  <div className="space-y-0.5 text-center shrink-0 px-2">
                    <span className="text-[8px] uppercase tracking-wider block opacity-70 font-semibold leading-none whitespace-nowrap">
                      Expires
                    </span>
                    <span className="font-mono text-[11px] font-bold block leading-tight whitespace-nowrap">
                      {activeCard.expiry}
                    </span>
                  </div>

                  <div className="flex items-center justify-end shrink-0">
                    {activeCard.network === "visa" ? (
                      <span className="font-black italic text-base tracking-wider font-sans leading-none">
                        VISA
                      </span>
                    ) : (
                      <div className="flex items-center -space-x-1.5">
                        <div className="w-4 h-4 rounded-full bg-[#EB001B] opacity-90 shadow-xs" />
                        <div className="w-4 h-4 rounded-full bg-[#F79E1B] opacity-90 shadow-xs" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Swiper Navigation & Dot Indicators */}
          <div className="flex items-center justify-between pt-2 px-1 w-full text-xs text-[#6B7280] h-7">
            <div className="flex items-center gap-1.5">
              {currentCards.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCardIndex(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all cursor-pointer",
                    cardIndex === i ? "w-5 bg-[#111827]" : "w-1.5 bg-[#D1D5DB]"
                  )}
                />
              ))}
              <span className="text-[10px] text-[#9CA3AF] ml-1 font-medium whitespace-nowrap">
                {cardIndex + 1} of {currentCards.length}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={prevCard}
                className="w-6 h-6 rounded-md bg-[#F4F5F7] hover:bg-[#E5E7EB] flex items-center justify-center text-[#111827] cursor-pointer"
                title="Previous card"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={nextCard}
                className="w-6 h-6 rounded-md bg-[#F4F5F7] hover:bg-[#E5E7EB] flex items-center justify-center text-[#111827] cursor-pointer"
                title="Next card"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: INSTANT UPI AUTOPAY (Authentic 320px credit card dimensions, no stretching, no two-line wrap) */}
      {activeMode === "upi" && (
        <div className="relative w-full max-w-[320px] mx-auto">
          <div className="w-full h-[202px] aspect-[1.586/1] rounded-[16px] p-4 bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#172554] text-white border border-blue-400/30 shadow-[0_8px_20px_rgba(29,78,216,0.18)] flex flex-col justify-between overflow-hidden relative">
            {/* Background glow */}
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-blue-400/15 blur-2xl pointer-events-none" />

            {/* Header: UPI 2.0 Badge & Status */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white text-[#1E3A8A] flex items-center justify-center font-black italic text-xs shadow-xs shrink-0">
                  UPI
                </div>
                <div>
                  <span className="text-xs font-bold text-white block leading-tight whitespace-nowrap">
                    {role === "business" ? "UPI AutoPay" : "UPI Instant"}
                  </span>
                  <span className="text-[10px] text-blue-200/80 whitespace-nowrap leading-none block">
                    NPCI e-Mandate
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 whitespace-nowrap shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{role === "business" ? "Active" : "Ready"}</span>
              </div>
            </div>

            {/* VPA Field Box */}
            <div className="relative z-10 p-2 rounded-lg bg-white/10 backdrop-blur-xs border border-white/15 flex items-center justify-between">
              <div className="flex flex-col min-w-0 pr-1">
                <span className="text-[8px] uppercase tracking-wider text-blue-200 font-semibold leading-none whitespace-nowrap block">
                  {role === "business" ? "Debit VPA" : "Payout VPA"}
                </span>
                <span className="font-mono text-xs font-bold text-white whitespace-nowrap truncate max-w-[155px] mt-0.5 block">
                  {role === "business" ? "techventures@okhdfcbank" : "alexrivera@icici"}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[8px] uppercase tracking-wider text-blue-200 font-semibold block leading-none whitespace-nowrap">
                  Tranche Cap
                </span>
                <span className="font-mono text-xs font-bold text-emerald-300 whitespace-nowrap leading-none block mt-0.5">
                  $1,500.00
                </span>
              </div>
            </div>

            {/* Bottom Row: Bank & Action Button */}
            <div className="relative z-10 flex items-center justify-between pt-0.5">
              <div className="flex items-center gap-1.5 text-[11px] text-blue-100 font-medium whitespace-nowrap truncate max-w-[150px]">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="truncate">{role === "business" ? "HDFC •••• 9210" : "ICICI •••• 4018"}</span>
              </div>

              <button
                onClick={onFund}
                className="h-6.5 px-2.5 rounded-md text-[11px] font-bold bg-white text-[#1E3A8A] hover:bg-blue-50 transition-colors shadow-xs cursor-pointer flex items-center whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-3 h-3 text-[#2563EB] mr-1 shrink-0" />
                {role === "business" ? "Pay via QR" : "Withdraw UPI"}
              </button>
            </div>
          </div>

          {/* Footer Bar: Matches exact height of Card dot indicator bar */}
          <div className="h-7 flex items-center justify-between pt-2 px-1 w-full text-xs text-[#6B7280]">
            <span className="text-[11px] text-[#6B7280] flex items-center gap-1 truncate font-medium whitespace-nowrap">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              NPCI Mandate Verified
            </span>
            <button
              onClick={onFund}
              className="text-[11px] font-semibold text-[#2563EB] hover:text-[#1D4ED8] hover:underline cursor-pointer shrink-0 whitespace-nowrap"
            >
              Scan QR &rarr;
            </button>
          </div>
        </div>
      )}

      {/* MODE 3: DIRECT FDIC ESCROW VAULT (Authentic 320px credit card dimensions, no stretching, no two-line wrap) */}
      {activeMode === "bank" && (
        <div className="relative w-full max-w-[320px] mx-auto">
          <div className="w-full h-[202px] aspect-[1.586/1] rounded-[16px] p-4 bg-gradient-to-br from-[#022C22] via-[#064E3B] to-[#0A1F18] text-white border border-emerald-500/30 shadow-[0_8px_20px_rgba(6,78,59,0.22)] flex flex-col justify-between overflow-hidden relative">
            {/* Background glow */}
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />

            {/* Header: Vault Trust & Security Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#88D635]/20 text-[#88D635] border border-[#88D635]/30 flex items-center justify-center shadow-xs shrink-0">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block leading-tight whitespace-nowrap">
                    FDIC Escrow Vault
                  </span>
                  <span className="text-[10px] text-emerald-200/80 whitespace-nowrap leading-none block">
                    Neutral Custody Trust
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#88D635]/20 text-[#88D635] border border-[#88D635]/30 whitespace-nowrap shrink-0">
                <ShieldCheck className="w-3 h-3 shrink-0" />
                <span>Safe Lock</span>
              </div>
            </div>

            {/* Vault Balance & Routing Box */}
            <div className="relative z-10 p-2 rounded-lg bg-black/25 backdrop-blur-xs border border-white/10 flex items-center justify-between">
              <div className="flex flex-col min-w-0 pr-1">
                <span className="text-[8px] uppercase tracking-wider text-emerald-300 font-semibold leading-none whitespace-nowrap block">
                  Escrow Reserve
                </span>
                <span className="font-mono text-sm font-black text-white whitespace-nowrap leading-none block mt-0.5">
                  $8,300.00
                </span>
              </div>
              <div className="text-right font-mono text-[10px] text-emerald-200 whitespace-nowrap shrink-0 leading-tight">
                <span className="block">Routing: 121000358</span>
                <span className="block">Vault: •••• 4912</span>
              </div>
            </div>

            {/* Bottom Row: Silicon Valley Bank & Action Button */}
            <div className="relative z-10 flex items-center justify-between pt-0.5">
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-100 font-medium whitespace-nowrap truncate max-w-[150px]">
                <span className="truncate">SVB Escrow Custody</span>
              </div>

              <button
                onClick={onFund}
                className="h-6.5 px-2.5 rounded-md text-[11px] font-bold bg-[#88D635] hover:bg-[#78BF2D] text-[#0A2600] transition-colors shadow-xs cursor-pointer flex items-center whitespace-nowrap shrink-0"
              >
                {role === "business" ? "Wire Details" : "Statements"}
              </button>
            </div>
          </div>

          {/* Footer Bar: Matches exact height of Card dot indicator bar */}
          <div className="h-7 flex items-center justify-between pt-2 px-1 w-full text-xs text-[#6B7280]">
            <span className="text-[11px] text-[#6B7280] flex items-center gap-1 truncate font-medium whitespace-nowrap">
              <Building2 className="w-3.5 h-3.5 text-[#111827] shrink-0" />
              ACH / Wire Pre-Approved
            </span>
            <button
              onClick={onFund}
              className="text-[11px] font-semibold text-[#111827] hover:text-black hover:underline cursor-pointer shrink-0 whitespace-nowrap"
            >
              Wire Details &rarr;
            </button>
          </div>
        </div>
      )}

      {/* 5 Quick Action Buttons (Full width of the card container) */}
      <div className="grid grid-cols-5 gap-2 pt-1 w-full">
        {role === "business" ? (
          <>
            <button
              onClick={onFund}
              className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all cursor-pointer group shadow-2xs"
              title="Top up Escrow"
            >
              <div className="w-7 h-7 rounded-md bg-[#F4F5F7] group-hover:bg-[#E8F8D6] flex items-center justify-center transition-colors">
                <Plus className="w-3.5 h-3.5 text-[#111827] group-hover:text-[#2D6606]" />
              </div>
              <span className="text-[10px] font-medium text-[#4B5563] group-hover:text-[#111827]">
                Top up
              </span>
            </button>

            <button
              onClick={onRelease}
              className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all cursor-pointer group shadow-2xs"
              title="Release Escrow Funds"
            >
              <div className="w-7 h-7 rounded-md bg-[#F4F5F7] group-hover:bg-[#E8F8D6] flex items-center justify-center transition-colors">
                <ArrowUpRight className="w-3.5 h-3.5 text-[#111827] group-hover:text-[#2D6606]" />
              </div>
              <span className="text-[10px] font-medium text-[#4B5563] group-hover:text-[#111827]">
                Release
              </span>
            </button>

            <button
              onClick={onRequest}
              className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all cursor-pointer group shadow-2xs"
              title="Request Milestone Acceptance"
            >
              <div className="w-7 h-7 rounded-md bg-[#F4F5F7] group-hover:bg-[#F3F4F6] flex items-center justify-center transition-colors">
                <ArrowDownLeft className="w-3.5 h-3.5 text-[#111827]" />
              </div>
              <span className="text-[10px] font-medium text-[#4B5563] group-hover:text-[#111827]">
                Request
              </span>
            </button>

            <button
              onClick={onHistory}
              className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all cursor-pointer group shadow-2xs"
              title="Timesheets & Work History"
            >
              <div className="w-7 h-7 rounded-md bg-[#F4F5F7] group-hover:bg-[#F3F4F6] flex items-center justify-center transition-colors">
                <Clock className="w-3.5 h-3.5 text-[#111827]" />
              </div>
              <span className="text-[10px] font-medium text-[#4B5563] group-hover:text-[#111827]">
                History
              </span>
            </button>

            <button
              onClick={onAddPaymentMethod}
              className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all cursor-pointer group shadow-2xs"
              title="Add Payment Method"
            >
              <div className="w-7 h-7 rounded-md bg-[#F4F5F7] group-hover:bg-[#F3F4F6] flex items-center justify-center transition-colors">
                <MoreHorizontal className="w-3.5 h-3.5 text-[#111827]" />
              </div>
              <span className="text-[10px] font-medium text-[#4B5563] group-hover:text-[#111827]">
                More
              </span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onRelease?.()}
              className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all cursor-pointer group shadow-2xs"
              title="Withdraw Disbursed Earnings"
            >
              <div className="w-7 h-7 rounded-md bg-[#F4F5F7] group-hover:bg-[#E8F8D6] flex items-center justify-center transition-colors">
                <ArrowUpRight className="w-3.5 h-3.5 text-[#111827] group-hover:text-[#2D6606]" />
              </div>
              <span className="text-[10px] font-medium text-[#4B5563] group-hover:text-[#111827]">
                Payout
              </span>
            </button>

            <button
              onClick={onRequest}
              className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all cursor-pointer group shadow-2xs"
              title="Nudge Client for Review"
            >
              <div className="w-7 h-7 rounded-md bg-[#F4F5F7] group-hover:bg-[#E8F8D6] flex items-center justify-center transition-colors">
                <ArrowDownLeft className="w-3.5 h-3.5 text-[#111827] group-hover:text-[#2D6606]" />
              </div>
              <span className="text-[10px] font-medium text-[#4B5563] group-hover:text-[#111827]">
                Nudge
              </span>
            </button>

            <button
              onClick={onFund}
              className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all cursor-pointer group shadow-2xs"
              title="Submit Work Deliverable"
            >
              <div className="w-7 h-7 rounded-md bg-[#F4F5F7] group-hover:bg-[#F3F4F6] flex items-center justify-center transition-colors">
                <Plus className="w-3.5 h-3.5 text-[#111827]" />
              </div>
              <span className="text-[10px] font-medium text-[#4B5563] group-hover:text-[#111827]">
                Submit
              </span>
            </button>

            <button
              onClick={onHistory}
              className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all cursor-pointer group shadow-2xs"
              title="Timesheets & Work History"
            >
              <div className="w-7 h-7 rounded-md bg-[#F4F5F7] group-hover:bg-[#F3F4F6] flex items-center justify-center transition-colors">
                <Clock className="w-3.5 h-3.5 text-[#111827]" />
              </div>
              <span className="text-[10px] font-medium text-[#4B5563] group-hover:text-[#111827]">
                Timesheet
              </span>
            </button>

            <button
              onClick={onAddPaymentMethod}
              className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all cursor-pointer group shadow-2xs"
              title="Bank Account Payout Settings"
            >
              <div className="w-7 h-7 rounded-md bg-[#F4F5F7] group-hover:bg-[#F3F4F6] flex items-center justify-center transition-colors">
                <Building2 className="w-3.5 h-3.5 text-[#111827]" />
              </div>
              <span className="text-[10px] font-medium text-[#4B5563] group-hover:text-[#111827]">
                Bank
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
