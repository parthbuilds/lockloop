"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { MoreVertical } from "lucide-react";

export interface Collaborator {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  initials: string;
  online?: boolean;
  whatsAppNumber?: string;
}

const DEFAULT_COLLABORATORS: Collaborator[] = [
  {
    id: "c1",
    name: "Alex",
    role: "Lead Dev",
    initials: "AR",
    online: true,
    whatsAppNumber: "+15550192834",
  },
  {
    id: "c2",
    name: "Sarah",
    role: "Founder",
    initials: "SC",
    online: true,
    whatsAppNumber: "+15550192835",
  },
  {
    id: "c3",
    name: "Michael",
    role: "Design Lead",
    initials: "MJ",
    online: false,
  },
  {
    id: "c4",
    name: "Amanda",
    role: "QA Tester",
    initials: "AL",
    online: true,
  },
  {
    id: "c5",
    name: "David",
    role: "Escrow Arbiter",
    initials: "DR",
    online: false,
  },
  {
    id: "c6",
    name: "Sin",
    role: "Legal Advisor",
    initials: "SK",
    online: true,
  },
];

export interface QuickCollaboratorsProps {
  role?: "business" | "freelancer";
  collaborators?: Collaborator[];
  onSelect?: (c: Collaborator) => void;
  className?: string;
}

export function QuickCollaborators({
  role = "business",
  collaborators,
  onSelect,
  className,
}: QuickCollaboratorsProps) {
  const activeList = React.useMemo(() => {
    if (collaborators) return collaborators;
    if (role === "freelancer") {
      // Freelancer sees client (Sarah) first
      return [
        DEFAULT_COLLABORATORS[1], // Sarah (Founder)
        DEFAULT_COLLABORATORS[2], // Michael (Design Lead)
        DEFAULT_COLLABORATORS[3], // Amanda (QA)
        DEFAULT_COLLABORATORS[4], // David (Arbiter)
        DEFAULT_COLLABORATORS[5], // Sin (Legal)
      ];
    }
    // Client sees builder (Alex) first
    return [
      DEFAULT_COLLABORATORS[0], // Alex (Lead Dev)
      DEFAULT_COLLABORATORS[2], // Michael (Design Lead)
      DEFAULT_COLLABORATORS[3], // Amanda (QA)
      DEFAULT_COLLABORATORS[4], // David (Arbiter)
      DEFAULT_COLLABORATORS[5], // Sin (Legal)
    ];
  }, [collaborators, role]);
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-[#111827]">Quick payment & chat</h4>
          <p className="text-[11px] text-[#6B7280]">Active project participants</p>
        </div>
        <button
          className="text-[#9CA3AF] hover:text-[#111827] p-1 rounded-md transition-colors cursor-pointer"
          title="Collaborator Settings"
        >
          <MoreVertical className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Horizontal Avatars Row (Pixel-Matched to ref.webp) */}
      <div className="flex items-center justify-between gap-1 pt-1">
        {activeList.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect?.(c)}
            className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none transition-transform hover:-translate-y-0.5"
            title={`${c.name} (${c.role})`}
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-[#111827] text-white flex items-center justify-center font-bold text-xs shadow-xs border-2 border-white group-hover:ring-2 group-hover:ring-[#88D635] transition-all">
                {c.initials}
              </div>
              {c.online && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#88D635] ring-1.5 ring-white" />
              )}
            </div>
            <span className="text-[10px] font-medium text-[#4B5563] group-hover:text-[#111827] truncate max-w-[44px]">
              {c.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
