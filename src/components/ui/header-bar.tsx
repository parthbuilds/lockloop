"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Bell, Settings, Plus } from "lucide-react";
import { SearchInput } from "./input";
import { Button } from "./button";

export interface HeaderBarProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  role?: "business" | "freelancer";
  onRoleChange?: (role: "business" | "freelancer") => void;
  onSearch?: (query: string) => void;
  onActionClick?: () => void;
  actionLabel?: string;
  className?: string;
}

export function HeaderBar({
  userName = "Michael Johnson",
  userEmail = "m.johnson@finex.com",
  userAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  role = "business",
  onRoleChange,
  onSearch,
  onActionClick,
  actionLabel = "Add widget",
  className,
}: HeaderBarProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between gap-3 w-full py-0.5",
        className
      )}
    >
      {/* Left Search Bar */}
      <div className="w-full max-w-sm">
        <SearchInput
          onChange={(e) => onSearch?.(e.target.value)}
          placeholder="Quick search"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Top Nav Role / Perspective Switcher */}
        {onRoleChange && (
          <div className="flex items-center bg-[#F4F5F7] p-0.5 rounded-lg border border-[#E5E7EB] text-xs font-semibold shadow-2xs">
            <button
              onClick={() => onRoleChange("business")}
              className={cn(
                "px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5",
                role === "business"
                  ? "bg-[#111827] text-white shadow-xs"
                  : "text-[#6B7280] hover:text-[#111827]"
              )}
              title="Switch to Client (Founder) view"
            >
              <span className={cn(
                "w-1.5 h-1.5 rounded-full",
                role === "business" ? "bg-[#88D635]" : "bg-[#9CA3AF]"
              )} />
              <span>Client (Founder)</span>
            </button>
            <button
              onClick={() => onRoleChange("freelancer")}
              className={cn(
                "px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5",
                role === "freelancer"
                  ? "bg-[#111827] text-white shadow-xs"
                  : "text-[#6B7280] hover:text-[#111827]"
              )}
              title="Switch to Freelancer (Builder) view"
            >
              <span className={cn(
                "w-1.5 h-1.5 rounded-full",
                role === "freelancer" ? "bg-[#88D635]" : "bg-[#9CA3AF]"
              )} />
              <span>Freelancer</span>
            </button>
          </div>
        )}

        {/* Bell Button */}
        <Button variant="icon" size="icon" className="relative h-9 w-9 rounded-lg" title="Notifications">
          <Bell className="w-4 h-4 text-[#4B5563]" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
        </Button>

        {/* Settings Button */}
        <Button variant="icon" size="icon" className="h-9 w-9 rounded-lg" title="Settings">
          <Settings className="w-4 h-4 text-[#4B5563]" />
        </Button>

        {/* User Profile Pill */}
        <div
          onClick={() => onRoleChange?.(role === "business" ? "freelancer" : "business")}
          className="flex items-center gap-2.5 px-3 py-1 rounded-lg bg-white border border-[#E5E7EB] shadow-xs cursor-pointer hover:border-[#D1D5DB] transition-all"
          title="Click to toggle perspective"
        >
          <img
            src={userAvatar}
            alt={userName}
            className="w-7 h-7 rounded-full object-cover border border-[#E5E7EB]"
          />
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-[#111827] leading-tight">
              {userName}
            </span>
            <span className="text-[10px] text-[#9CA3AF] leading-tight font-mono">
              {userEmail}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant="outline"
          onClick={onActionClick}
          className="h-9 px-3.5 text-xs font-semibold gap-1.5 rounded-lg"
        >
          <Plus className="w-3.5 h-3.5 text-[#111827]" />
          <span>{actionLabel}</span>
        </Button>
      </div>
    </header>
  );
}
