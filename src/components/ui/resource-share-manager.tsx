"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Badge } from "./badge";
import {
  Folder,
  FolderPlus,
  Upload,
  Search,
  Filter,
  MoreVertical,
  Share2,
  Send,
  CheckCircle2,
  FileText,
  FileCode,
  Image as ImageIcon,
  Key,
  Database,
  ExternalLink,
  Download,
  Trash2,
  Plus,
  X,
  ChevronRight,
  HardDrive,
  Clock,
  Tag as TagIcon,
  ShieldCheck,
  Building2,
  Sparkles,
  Layers,
  ArrowRight,
} from "lucide-react";

export interface ResourceFile {
  id: string;
  name: string;
  size: string;
  type: "image" | "code" | "document" | "secret" | "data";
  updatedAt: string;
}

export interface ResourceFolder {
  id: string;
  name: string;
  description: string;
  fileCount: number;
  totalSize: string;
  highlight?: boolean;
  pushedToFreelancer: boolean;
  pushedAt?: string;
  tags: string[];
  files: ResourceFile[];
  previewNote?: string;
}

const INITIAL_FOLDERS: ResourceFolder[] = [
  {
    id: "f1",
    name: "Brand Assets & Logos",
    description: "Official client vector logos, dark/light SVG marks, brand typography and color guides.",
    fileCount: 24,
    totalSize: "116.9 MB",
    pushedToFreelancer: true,
    pushedAt: "Sep 28, 2026, 10:45 AM",
    tags: ["Brand", "SVG", "Marketing"],
    files: [
      { id: "fl1", name: "techventures-logo-dark.svg", size: "48 KB", type: "image", updatedAt: "Sep 28, 2026" },
      { id: "fl2", name: "techventures-logo-light.svg", size: "52 KB", type: "image", updatedAt: "Sep 28, 2026" },
      { id: "fl3", name: "brand-guidelines-2026.pdf", size: "4.8 MB", type: "document", updatedAt: "Sep 25, 2026" },
      { id: "fl4", name: "favicon-bundle-package.zip", size: "1.2 MB", type: "document", updatedAt: "Sep 28, 2026" },
      { id: "fl5", name: "inter-font-suite.woff2", size: "820 KB", type: "code", updatedAt: "Sep 20, 2026" },
    ],
  },
  {
    id: "f2",
    name: "API Keys & Cloud Credentials",
    description: "Secure staging environment variables, Supabase service keys, Stripe test secrets and webhooks.",
    fileCount: 8,
    totalSize: "180.2 MB",
    highlight: true,
    previewNote: "The client can add secure credentials, env files and API keys directly for Alex Rivera...",
    pushedToFreelancer: true,
    pushedAt: "Sep 29, 2026, 08:30 AM",
    tags: ["Secrets", "Stripe", "Supabase", "AES-256"],
    files: [
      { id: "fl6", name: ".env.staging.production", size: "3.2 KB", type: "secret", updatedAt: "Sep 29, 2026" },
      { id: "fl7", name: "supabase-service-role.txt", size: "1.1 KB", type: "secret", updatedAt: "Sep 28, 2026" },
      { id: "fl8", name: "stripe-test-api-keys.json", size: "4.5 KB", type: "secret", updatedAt: "Sep 27, 2026" },
      { id: "fl9", name: "resend-transactional-token.key", size: "2.8 KB", type: "secret", updatedAt: "Sep 25, 2026" },
    ],
  },
  {
    id: "f3",
    name: "Figma & Design Specs",
    description: "Production UI component library, tokens, mobile viewports and layout breakpoints.",
    fileCount: 39,
    totalSize: "23.4 MB",
    pushedToFreelancer: true,
    pushedAt: "Sep 25, 2026, 04:15 PM",
    tags: ["Design", "Figma", "UI/UX"],
    files: [
      { id: "fl10", name: "SaaS-Dashboard-v2.4.fig", size: "18.2 MB", type: "document", updatedAt: "Sep 25, 2026" },
      { id: "fl11", name: "tokens-spacing-colors.json", size: "28 KB", type: "code", updatedAt: "Sep 24, 2026" },
      { id: "fl12", name: "auth-modal-screen-states.png", size: "1.4 MB", type: "image", updatedAt: "Sep 25, 2026" },
      { id: "fl13", name: "navigation-prototype.mp4", size: "3.8 MB", type: "image", updatedAt: "Sep 24, 2026" },
    ],
  },
  {
    id: "f4",
    name: "Product PRD & User Stories",
    description: "Detailed scope of work specifications, acceptance criteria, and edge-case wireframe documentation.",
    fileCount: 17,
    totalSize: "490 MB",
    pushedToFreelancer: true,
    pushedAt: "Sep 22, 2026, 02:00 PM",
    tags: ["PRD", "Scope", "Acceptance"],
    files: [
      { id: "fl14", name: "SOW-9921-Product-PRD.pdf", size: "12.5 MB", type: "document", updatedAt: "Sep 22, 2026" },
      { id: "fl15", name: "user-acceptance-checklist.md", size: "14 KB", type: "document", updatedAt: "Sep 22, 2026" },
      { id: "fl16", name: "stripe-tier-matrix.xlsx", size: "480 KB", type: "document", updatedAt: "Sep 21, 2026" },
    ],
  },
  {
    id: "f5",
    name: "Raw Seed Data & Schemas",
    description: "Sample tenant datasets, faker records for local testing, and mock Stripe customer exports.",
    fileCount: 96,
    totalSize: "1.3 GB",
    pushedToFreelancer: false,
    tags: ["Database", "SQL", "Seed Data"],
    files: [
      { id: "fl17", name: "dummy-tenants-5000.csv", size: "4.2 MB", type: "data", updatedAt: "Sep 20, 2026" },
      { id: "fl18", name: "initial-schema-dump.sql", size: "850 KB", type: "code", updatedAt: "Sep 19, 2026" },
      { id: "fl19", name: "postman-api-test-collection.json", size: "120 KB", type: "code", updatedAt: "Sep 18, 2026" },
    ],
  },
  {
    id: "f6",
    name: "Copy & Legal Requirements",
    description: "Production legal terms, Privacy Policy, in-app microcopy and transactional notification templates.",
    fileCount: 103,
    totalSize: "126.3 MB",
    pushedToFreelancer: true,
    pushedAt: "Sep 20, 2026, 11:20 AM",
    tags: ["Legal", "Copy", "GDPR"],
    files: [
      { id: "fl20", name: "Terms-of-Service-v1.pdf", size: "320 KB", type: "document", updatedAt: "Sep 20, 2026" },
      { id: "fl21", name: "Privacy-Policy-GDPR.pdf", size: "280 KB", type: "document", updatedAt: "Sep 20, 2026" },
      { id: "fl22", name: "onboarding-email-templates.html", size: "45 KB", type: "code", updatedAt: "Sep 19, 2026" },
    ],
  },
];

export interface ResourceShareManagerProps {
  role?: "business" | "freelancer";
  showToast?: (msg: string) => void;
  onBackToDashboard?: () => void;
  className?: string;
}

export function ResourceShareManager({
  role = "business",
  showToast = () => { },
  onBackToDashboard,
  className,
}: ResourceShareManagerProps) {
  const isClient = role === "business";

  const [folders, setFolders] = React.useState<ResourceFolder[]>(INITIAL_FOLDERS);
  const [selectedFolderId, setSelectedFolderId] = React.useState<string>("f2");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [tagFilter, setTagFilter] = React.useState<string>("All");

  // Modals
  const [showNewFolderModal, setShowNewFolderModal] = React.useState(false);
  const [newFolderName, setNewFolderName] = React.useState("");
  const [newFolderDesc, setNewFolderDesc] = React.useState("");

  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [uploadFileName, setUploadFileName] = React.useState("");
  const [uploadTargetFolder, setUploadTargetFolder] = React.useState("f2");

  // Selected folder object
  const activeFolder = folders.find((f) => f.id === selectedFolderId) || folders[0];

  // Filtered folders
  const filteredFolders = React.useMemo(() => {
    return folders.filter((f) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTag =
        tagFilter === "All" || f.tags.includes(tagFilter);
      return matchesSearch && matchesTag;
    });
  }, [folders, searchQuery, tagFilter]);

  // Handle push folder to freelancer
  const handlePushFolder = (folderId: string) => {
    setFolders((prev) =>
      prev.map((f) =>
        f.id === folderId
          ? {
            ...f,
            pushedToFreelancer: true,
            pushedAt: new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
          }
          : f
      )
    );
    showToast(`Folder "${activeFolder.name}" pushed and synced with Alex Rivera's workspace!`);
  };

  // Create new folder
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      showToast("Please enter a folder name.");
      return;
    }

    const newFolder: ResourceFolder = {
      id: `f-${Date.now()}`,
      name: newFolderName,
      description: newFolderDesc || "Client assets and files ready for builder synchronization.",
      fileCount: 1,
      totalSize: "2.4 MB",
      pushedToFreelancer: false,
      tags: ["Client Source", "New"],
      files: [
        {
          id: `fl-${Date.now()}`,
          name: "readme-instructions.md",
          size: "2.4 KB",
          type: "document",
          updatedAt: "Just now",
        },
      ],
    };

    setFolders((prev) => [newFolder, ...prev]);
    setSelectedFolderId(newFolder.id);
    showToast(`Created folder "${newFolderName}"! Ready to upload files.`);
    setNewFolderName("");
    setNewFolderDesc("");
    setShowNewFolderModal(false);
  };

  // Add uploaded file to folder
  const handleUploadFile = () => {
    if (!uploadFileName.trim()) {
      showToast("Please enter a file name.");
      return;
    }

    setFolders((prev) =>
      prev.map((f) => {
        if (f.id !== uploadTargetFolder) return f;
        const newFile: ResourceFile = {
          id: `fl-${Date.now()}`,
          name: uploadFileName,
          size: "4.2 MB",
          type: uploadFileName.endsWith(".svg") || uploadFileName.endsWith(".png")
            ? "image"
            : uploadFileName.endsWith(".json") || uploadFileName.endsWith(".env")
              ? "secret"
              : "document",
          updatedAt: "Just now",
        };
        return {
          ...f,
          fileCount: f.fileCount + 1,
          files: [newFile, ...f.files],
        };
      })
    );

    showToast(`Uploaded "${uploadFileName}" to folder!`);
    setUploadFileName("");
    setShowUploadModal(false);
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & BREADCRUMB BAR (Matching Reference Image 1)               */}
      {/* ========================================================================= */}
      <div className="bg-white p-4.5 rounded-xl border border-black/[0.06] shadow-[0px_2px_8px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#6B7280] mb-1">
            <span>Projects</span>
            <span>&rsaquo;</span>
            <span className="font-semibold text-[#111827]">TechVentures Inc. (SOW-9921)</span>
            <span>&rsaquo;</span>
            <span className="text-[#111827] font-bold">Resource Share Manager</span>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-[#111827] flex items-center gap-2">
            <span>Client Resource & Asset Vault</span>
            <Badge variant="lime" className="text-xs rounded-md">
              Live Sync
            </Badge>
          </h2>
          <p className="text-xs text-[#6B7280] mt-0.5">
            {isClient
              ? "Organize logos, credentials, PRDs, and Figma assets in folders. Push changes directly to your freelancer's workspace."
              : "Access verified client assets, API keys, brand logos, and specifications provided by TechVentures Inc."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUploadModal(true)}
            className="text-xs font-semibold gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </Button>

          <Button
            variant="dark"
            size="sm"
            onClick={() => setShowNewFolderModal(true)}
            className="text-xs font-bold gap-1.5 shadow-xs"
          >
            <FolderPlus className="w-3.5 h-3.5 text-[#88D635]" />
            <span>New Folder</span>
          </Button>


        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN 2-COLUMN LAYOUT: FOLDER GRID (LEFT) + INFO PANEL (RIGHT)          */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT 8.5 COLUMNS: SEARCH, FILTERS & GORGEOUS PHYSICAL FOLDER CARDS */}
        <div className="lg:col-span-8 flex flex-col gap-3.5">
          {/* Search & Filter Bar */}
          <div className="bg-white p-3 rounded-xl border border-black/[0.06] shadow-[0px_2px_8px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search folders, assets, notes, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-[#F4F5F7] border border-transparent focus:border-[#CBD5E1] focus:bg-white rounded-lg pl-9 pr-3 py-1.5 outline-hidden transition-all text-[#111827]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#111827]"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Quick Filter Tags */}
            <div className="flex items-center gap-1 text-xs">
              <Filter className="w-3.5 h-3.5 text-[#6B7280] mr-1" />
              {["All", "Brand", "Secrets", "Design", "PRD"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setTagFilter(tag)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer",
                    tagFilter === tag
                      ? "bg-[#111827] text-white font-bold"
                      : "bg-[#F4F5F7] text-[#4B5563] hover:bg-[#E5E7EB]"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* FOLDER GRID (3 Columns of Rich Physical Folder Cards - Reference Image 1) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {filteredFolders.map((folder) => {
              const isSelected = selectedFolderId === folder.id;

              return (
                <div
                  key={folder.id}
                  onClick={() => setSelectedFolderId(folder.id)}
                  className={cn(
                    "relative rounded-2xl p-4.5 cursor-pointer transition-all duration-200 flex flex-col justify-between min-h-[175px] group select-none",
                    // Glowing highlighted style for folder (Matching Ref Image 1 blue/highlight card)
                    folder.highlight || isSelected
                      ? "bg-gradient-to-b from-[#3B82F6]/90 to-[#2563EB] text-white shadow-[0px_8px_24px_rgba(37,99,235,0.25)] border border-[#3B82F6]"
                      : "bg-[#F4F6F9] hover:bg-white text-[#111827] border border-black/[0.06] shadow-[0px_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0px_6px_20px_rgba(0,0,0,0.07)]"
                  )}
                >
                  {/* Visual Physical Folder Tab at Top (Matching Image 1) */}
                  <div
                    className={cn(
                      "absolute -top-2 left-4 w-20 h-3 rounded-t-lg transition-all",
                      folder.highlight || isSelected
                        ? "bg-[#2563EB]"
                        : "bg-[#E2E6ED] group-hover:bg-[#CBD5E1]"
                    )}
                  />

                  {/* Documents Peeking Out Preview for highlighted folder */}
                  {folder.previewNote && (folder.highlight || isSelected) && (
                    <div className="absolute top-2 right-4 left-4 bg-white/15 backdrop-blur-xs rounded-lg p-2 text-[10px] text-blue-50 border border-white/20 line-clamp-2">
                      {folder.previewNote}
                    </div>
                  )}

                  {/* Top Content Row */}
                  <div className={cn("relative z-10", folder.previewNote && (folder.highlight || isSelected) ? "pt-11" : "pt-1")}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                            folder.highlight || isSelected
                              ? "bg-white/20 text-white"
                              : "bg-white text-[#111827] shadow-2xs"
                          )}
                        >
                          <Folder className="w-4 h-4 fill-current" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold truncate max-w-[130px]">
                            {folder.name}
                          </h4>
                          <span
                            className={cn(
                              "text-[10px] block",
                              folder.highlight || isSelected ? "text-blue-100" : "text-[#6B7280]"
                            )}
                          >
                            {folder.fileCount} items • {folder.totalSize}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePushFolder(folder.id);
                        }}
                        className={cn(
                          "p-1.5 rounded-lg transition-colors cursor-pointer",
                          folder.highlight || isSelected
                            ? "bg-white/20 hover:bg-white/30 text-white"
                            : "hover:bg-[#E5E7EB] text-[#6B7280] hover:text-[#111827]"
                        )}
                        title="Push to Freelancer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p
                      className={cn(
                        "text-[11px] mt-2.5 line-clamp-2 leading-relaxed",
                        folder.highlight || isSelected ? "text-blue-50" : "text-[#6B7280]"
                      )}
                    >
                      {folder.description}
                    </p>
                  </div>

                  {/* Bottom Footer: Push Status Badge & Tags */}
                  <div
                    className={cn(
                      "pt-2 mt-2 border-t flex items-center justify-between text-[10px]",
                      folder.highlight || isSelected
                        ? "border-white/20 text-blue-100"
                        : "border-black/[0.04] text-[#6B7280]"
                    )}
                  >
                    <div className="flex items-center gap-1 truncate max-w-[120px]">
                      {folder.pushedToFreelancer ? (
                        <span className="flex items-center gap-1 font-semibold truncate text-emerald-300">
                          <CheckCircle2 className="w-3 h-3 shrink-0" />
                          <span className="truncate">Pushed to Builder</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 font-medium text-amber-500">
                          <Clock className="w-3 h-3 shrink-0" />
                          <span>Draft (Unpushed)</span>
                        </span>
                      )}
                    </div>

                    <span className="font-mono text-[9px] uppercase tracking-wider">
                      {folder.tags[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT 3.5 COLUMNS: INFO & STORAGE INSPECTOR (Matching Reference Image 1) */}
        <div className="lg:col-span-4 flex flex-col gap-3.5">
          {/* Info Card Container */}
          <div className="bg-white p-4.5 rounded-xl border border-black/[0.06] shadow-[0px_2px_8px_rgba(0,0,0,0.03)] flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#F1F3F6] pb-3">
              <h3 className="text-sm font-bold text-[#111827] flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-[#111827]" />
                <span>Info & Storage Meter</span>
              </h3>
              <span className="font-mono text-xs text-[#6B7280]">
                {activeFolder.totalSize}
              </span>
            </div>

            {/* Storage Progress Meters (Matching Image 1: Documents 48.5GB, Images 182.4MB) */}
            <div className="space-y-3">
              {/* Documents Meter */}
              <div className="p-3 rounded-lg bg-[#F8F9FA] border border-black/[0.04]">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#6B7280] font-medium">Documents & Specs</span>
                  <span className="font-bold text-[#111827] font-mono">48.5 GB</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#E5E7EB] overflow-hidden">
                  <div className="h-full bg-[#3B82F6] rounded-full w-[65%]" />
                </div>
              </div>

              {/* Images Meter */}
              <div className="p-3 rounded-lg bg-[#F8F9FA] border border-black/[0.04]">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#6B7280] font-medium">Logos & Media</span>
                  <span className="font-bold text-[#111827] font-mono">182.4 MB</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#E5E7EB] overflow-hidden">
                  <div className="h-full bg-[#EF4444] rounded-full w-[35%]" />
                </div>
              </div>
            </div>

            {/* Properties Section (Matching Image 1) */}
            <div className="space-y-2 text-xs border-t border-[#F1F3F6] pt-3">
              <span className="text-[11px] font-bold text-[#4B5563] uppercase tracking-wider block">
                Folder Properties:
              </span>

              <div className="flex items-center justify-between text-[#6B7280]">
                <span>Folder Name:</span>
                <span className="font-semibold text-[#111827] truncate max-w-[150px]">
                  {activeFolder.name}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#6B7280]">
                <span>Size:</span>
                <span className="font-mono text-[#111827]">{activeFolder.totalSize}</span>
              </div>
              <div className="flex items-center justify-between text-[#6B7280]">
                <span>Created Date:</span>
                <span className="font-mono text-[#111827]">12/03/2026</span>
              </div>
              <div className="flex items-center justify-between text-[#6B7280]">
                <span>Last Pushed:</span>
                <span className="font-mono text-[#111827]">
                  {activeFolder.pushedAt || "Not pushed yet"}
                </span>
              </div>
            </div>

            {/* Tags (Matching Image 1) */}
            <div className="space-y-1.5 border-t border-[#F1F3F6] pt-3">
              <span className="text-[11px] font-bold text-[#4B5563] uppercase tracking-wider block">
                Tags:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeFolder.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F4F5F7] text-[#4B5563] text-[10px] font-medium border border-[#E5E7EB]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Files inside active folder list */}
            <div className="space-y-2 border-t border-[#F1F3F6] pt-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">
                  Files Inside ({activeFolder.files.length}):
                </span>
                <button
                  onClick={() => {
                    setUploadTargetFolder(activeFolder.id);
                    setShowUploadModal(true);
                  }}
                  className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer"
                >
                  + Add file
                </button>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {activeFolder.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#F8F9FA] hover:bg-[#F1F3F6] transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {file.type === "image" && <ImageIcon className="w-3.5 h-3.5 text-[#3B82F6] shrink-0" />}
                      {file.type === "secret" && <Key className="w-3.5 h-3.5 text-[#EAB308] shrink-0" />}
                      {file.type === "code" && <FileCode className="w-3.5 h-3.5 text-[#10B981] shrink-0" />}
                      {file.type === "document" && <FileText className="w-3.5 h-3.5 text-[#6366F1] shrink-0" />}
                      {file.type === "data" && <Database className="w-3.5 h-3.5 text-[#F97316] shrink-0" />}
                      <span className="font-medium text-[#111827] truncate max-w-[140px]">
                        {file.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#6B7280] shrink-0">
                      <span>{file.size}</span>
                      <button
                        onClick={() => showToast(`Downloaded ${file.name}`)}
                        className="p-1 hover:text-[#111827] cursor-pointer"
                        title="Download"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Push / Sync Action Button */}
            <div className="pt-2 border-t border-[#F1F3F6]">
              <Button
                variant="dark"
                size="sm"
                onClick={() => handlePushFolder(activeFolder.id)}
                className="w-full text-xs font-bold gap-1.5 shadow-xs py-2 h-9"
              >
                <Send className="w-3.5 h-3.5 text-[#88D635]" />
                <span>Push & Sync Folder to Alex Rivera</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MODAL: CREATE NEW FOLDER                                               */}
      {/* ========================================================================= */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-black/[0.08] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#F1F3F6] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                  <FolderPlus className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#111827]">Create New Resource Folder</h4>
              </div>
              <button
                onClick={() => setShowNewFolderModal(false)}
                className="text-[#9CA3AF] hover:text-[#111827] p-1 rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">
                Folder Name:
              </label>
              <input
                type="text"
                placeholder="e.g., Auth Flow Screenshots & Wireframes"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="text-xs bg-[#F4F5F7] border border-[#E5E7EB] rounded-lg px-3 py-2 outline-hidden text-[#111827]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">
                Description / Instructions for Builder:
              </label>
              <textarea
                rows={3}
                placeholder="Describe what these assets are for and how the freelancer should use them..."
                value={newFolderDesc}
                onChange={(e) => setNewFolderDesc(e.target.value)}
                className="text-xs bg-[#F4F5F7] border border-[#E5E7EB] rounded-lg p-3 outline-hidden text-[#111827] resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F3F6]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNewFolderModal(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="dark"
                size="sm"
                onClick={handleCreateFolder}
                className="text-xs font-bold gap-1.5"
              >
                <FolderPlus className="w-3.5 h-3.5 text-[#88D635]" />
                <span>Create Folder</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL: UPLOAD FILE INTO FOLDER                                         */}
      {/* ========================================================================= */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-black/[0.08] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#F1F3F6] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#F0FDF4] text-[#15803D] flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#111827]">Upload Asset to Folder</h4>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-[#9CA3AF] hover:text-[#111827] p-1 rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">
                Select Destination Folder:
              </label>
              <select
                value={uploadTargetFolder}
                onChange={(e) => setUploadTargetFolder(e.target.value)}
                className="text-xs bg-[#F4F5F7] border border-[#E5E7EB] rounded-lg px-3 py-2 outline-hidden text-[#111827] font-medium"
              >
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.fileCount} items)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">
                File / Asset Name:
              </label>
              <input
                type="text"
                placeholder="e.g., logo-high-res.svg or stripe-webhook-secret.env"
                value={uploadFileName}
                onChange={(e) => setUploadFileName(e.target.value)}
                className="text-xs bg-[#F4F5F7] border border-[#E5E7EB] rounded-lg px-3 py-2 outline-hidden text-[#111827]"
              />
            </div>

            {/* Dropzone mockup */}
            <div className="border-2 border-dashed border-[#CBD5E1] rounded-xl p-5 text-center flex flex-col items-center justify-center gap-1.5 bg-[#F9FAFB]">
              <Upload className="w-6 h-6 text-[#9CA3AF]" />
              <span className="text-xs font-semibold text-[#111827]">
                Drag and drop files here, or browse
              </span>
              <span className="text-[10px] text-[#6B7280]">
                Supports SVG, PNG, PDF, ENV, ZIP, JSON (Max 500MB)
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F3F6]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowUploadModal(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="dark"
                size="sm"
                onClick={handleUploadFile}
                className="text-xs font-bold gap-1.5 shadow-xs"
              >
                <Upload className="w-3.5 h-3.5 text-[#88D635]" />
                <span>Upload & Ready to Push</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
