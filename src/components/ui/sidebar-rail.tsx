"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShieldCheck,
  PlayCircle,
  Clock,
  FolderLock,
  Receipt,
  AlertTriangle,
  Zap,
  CalendarDays,
  ChevronRight,
  ChevronLeft,
  X,
  Layers,
} from "lucide-react";
import { Button } from "./button";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeVariant?: "dark" | "lime";
}

export interface SidebarRailProps {
  activeId?: string;
  onSelect?: (id: string) => void;
  role?: "freelancer" | "business";
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export function SidebarRail({
  activeId = "dashboard",
  onSelect,
  role = "business",
  collapsed = false,
  onToggleCollapse,
  className,
}: SidebarRailProps) {
  const [showUpgradeCard, setShowUpgradeCard] = React.useState(true);

  const navItems: NavItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: "escrow",
      label: "Escrow Milestones",
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: "3 Active",
      badgeVariant: "dark",
    },
    {
      id: "timeline",
      label: "Project Timeline",
      icon: <CalendarDays className="w-4 h-4" />,
      badge: "8 Mo",
      badgeVariant: "lime",
    },
    {
      id: "feed",
      label: "Proof-of-Work",
      icon: <PlayCircle className="w-4 h-4" />,
    },
    {
      id: "timesheet",
      label: "Timesheets",
      icon: <Clock className="w-4 h-4" />,
    },
    {
      id: "change-orders",
      label: "Scope Firewall",
      icon: <Layers className="w-4 h-4" />,
      badge: "1 Pending",
      badgeVariant: "lime",
    },
    {
      id: "resources",
      label: "Resource Share",
      icon: <FolderLock className="w-4 h-4" />,
      badge: "6 Folders",
      badgeVariant: "lime",
    },
    {
      id: "invoices",
      label: "Tax Invoices",
      icon: <Receipt className="w-4 h-4" />,
    },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col justify-between shrink-0 bg-white rounded-xl p-3.5 border border-black/[0.06] shadow-[0px_2px_8px_rgba(0,0,0,0.03)] transition-all duration-300",
        "h-[calc(100vh-1.75rem)] sticky top-3 sm:top-3.5 overflow-hidden",
        collapsed ? "w-16 items-center px-2" : "w-56",
        className
      )}
    >
      {/* Top Section: Brand + Navigation */}
      <div className="flex flex-col gap-4 w-full">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 px-2 py-1">
          <div className="w-7 h-7 rounded-lg bg-[#111827] flex items-center justify-center text-[#88D635] font-black text-sm shadow-xs shrink-0">
            L
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-base tracking-tight text-[#111827] leading-tight">
                LoopLock
              </span>
              <span className="text-[9px] text-[#9CA3AF] font-semibold tracking-wider uppercase truncate">
                Micro-Escrow Hub
              </span>
            </div>
          )}
        </div>

        {/* Navigation Items (strictly non-scrollable) */}
        <nav className="flex flex-col gap-0.5 w-full">
          {navItems.map((item) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelect?.(item.id)}
                className={cn(
                  "flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer text-left",
                  isActive
                    ? "bg-[#F4F5F7] text-[#111827] font-semibold"
                    : "text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]",
                  collapsed && "justify-center px-0"
                )}
                title={collapsed ? item.label : undefined}
              >
                <span
                  className={cn(
                    "shrink-0",
                    isActive ? "text-[#111827]" : "text-[#9CA3AF]"
                  )}
                >
                  {item.icon}
                </span>

                {!collapsed && (
                  <span className="truncate flex-1">{item.label}</span>
                )}

                {!collapsed && item.badge && (
                  <span
                    className={cn(
                      "px-1.5 py-0.5 rounded-md text-[9px] font-bold font-mono shrink-0",
                      item.badgeVariant === "dark"
                        ? "bg-[#111827] text-white"
                        : "bg-[#E8F8D6] text-[#2D6606]"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Pro Upgrade + Collapse Button */}
      <div className="flex flex-col gap-2 w-full pt-2">
        {!collapsed && showUpgradeCard && (
          <div className="relative p-3 rounded-lg bg-[#F8F9FA] border border-black/[0.04] flex flex-col gap-1.5">
            <button
              onClick={() => setShowUpgradeCard(false)}
              className="absolute top-2 right-2 text-[#9CA3AF] hover:text-[#111827] p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-[#111827] flex items-center justify-center text-[#88D635]">
                <Zap className="w-3 h-3 fill-current" />
              </div>
              <h5 className="text-xs font-bold text-[#111827]">Upgrade to Pro</h5>
            </div>
            <p className="text-[10px] text-[#6B7280] leading-snug">
              Smart IP escrow insurance & automated legal dispute mediation.
            </p>
            <Button variant="dark" size="sm" className="w-full text-[11px] py-1.5 h-7 mt-0.5">
              Upgrade now
            </Button>
          </div>
        )}

        {/* Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-[#9CA3AF] hover:text-[#111827] transition-colors w-full cursor-pointer rounded-lg hover:bg-[#F9FAFB]"
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5 mx-auto" />
          ) : (
            <>
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="text-[11px]">Collapse sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
