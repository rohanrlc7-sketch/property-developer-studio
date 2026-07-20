/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, PointerEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, 
  Hammer, 
  Palette, 
  Copy, 
  MapPin, 
  RotateCcw, 
  Sparkles, 
  Calculator, 
  Check, 
  ArrowRight, 
  Home, 
  Columns, 
  ShieldCheck, 
  Droplets, 
  Zap, 
  Paintbrush, 
  ChevronRight,
  Info,
  Trash2,
  Plus,
  HelpCircle,
  Download,
  Eraser,
  Type,
  Undo,
  Slash,
  Spline,
  Sun,
  Moon,
  X
} from "lucide-react";

import { toPng } from "html-to-image";

import { INDIAN_STATES, StateInfo, DistrictInfo } from "./data/locationData";
import { DISTRICT_TRANSLATIONS } from "./data/districtTranslations";
import { calculateSetbacks, generateStructuralLayout, estimateMaterialExpenses, Setbacks, RoomLayout, BudgetSummary } from "./utils/engine";
import { TRANSLATIONS } from "./data/translations";

// Helper functions for 2D architectural blueprint layout (CAD drawing aesthetics)
export interface FurnitureItem {
  id: string;
  type: "bed" | "wardrobe" | "dining_table" | "chair" | "basin" | "sofa" | "toilet" | "tv_cabinet" | "plant" | "coffee_table";
  x: number; // 0 to 100 within buildable area
  y: number; // 0 to 100 within buildable area
  rotation: number; // 0, 90, 180, 270
  nameEn: string;
  nameBn: string;
}

const getInitialFurnitureForRooms = (roomsList: RoomLayout[]): FurnitureItem[] => {
  const list: FurnitureItem[] = [];
  roomsList.forEach(room => {
    const lowercaseId = room.id.toLowerCase();
    const centerX = room.x + room.width / 2;
    const centerY = room.y + room.height / 2;
    
    if (
      lowercaseId.includes("bedroom_attached") || 
      lowercaseId.includes("bedroom-attached") || 
      lowercaseId.includes("attached")
    ) {
      list.push({
        id: `f_bed_${room.id}_${Date.now()}`,
        type: "bed",
        x: Math.min(95, Math.max(5, room.x + room.width * 0.35)),
        y: Math.min(95, Math.max(5, room.y + room.height * 0.35)),
        rotation: 0,
        nameEn: "Comfort Double Bed",
        nameBn: "আরামদায়ক ডাবল খাট"
      });
      list.push({
        id: `f_wardrobe_${room.id}_${Date.now()}`,
        type: "wardrobe",
        x: Math.min(95, Math.max(5, room.x + room.width * 0.35)),
        y: Math.min(95, Math.max(5, room.y + room.height * 0.75)),
        rotation: 0,
        nameEn: "Modern Wardrobe",
        nameBn: "আধুনিক ওয়্যারড্রোব"
      });
      list.push({
        id: `f_toilet_${room.id}_${Date.now()}`,
        type: "toilet",
        x: Math.min(95, Math.max(5, room.x + room.width * 0.82)),
        y: Math.min(95, Math.max(5, room.y + room.height * 0.35)),
        rotation: 180,
        nameEn: "Attached Toilet",
        nameBn: "সংযুক্ত টয়লেট"
      });
      list.push({
        id: `f_basin_${room.id}_${Date.now()}`,
        type: "basin",
        x: Math.min(95, Math.max(5, room.x + room.width * 0.82)),
        y: Math.min(95, Math.max(5, room.y + room.height * 0.7)),
        rotation: 0,
        nameEn: "Ceramic Washbasin",
        nameBn: "সিরামিক ওয়াশবেসিন"
      });
    } else if (
      lowercaseId.includes("master") || 
      lowercaseId.includes("bedroom") || 
      lowercaseId.includes("bed") || 
      lowercaseId.includes("guest") || 
      lowercaseId.includes("kid")
    ) {
      list.push({
        id: `f_bed_${room.id}_${Date.now()}`,
        type: "bed",
        x: Math.min(95, Math.max(5, centerX)),
        y: Math.min(95, Math.max(5, centerY - room.height / 6)),
        rotation: 0,
        nameEn: "Comfort Double Bed",
        nameBn: "আরামদায়ক ডাবল খাট"
      });
      list.push({
        id: `f_wardrobe_${room.id}_${Date.now()}`,
        type: "wardrobe",
        x: Math.min(95, Math.max(5, room.x + room.width / 4)),
        y: Math.min(95, Math.max(5, room.y + room.height * 0.75)),
        rotation: 0,
        nameEn: "Modern Wardrobe",
        nameBn: "আধুনিক ওয়্যারড্রোব"
      });
    } else if (
      lowercaseId.includes("living") || 
      lowercaseId.includes("hall") || 
      lowercaseId.includes("drawing")
    ) {
      list.push({
        id: `f_sofa_${room.id}_${Date.now()}`,
        type: "sofa",
        x: Math.min(95, Math.max(5, centerX)),
        y: Math.min(95, Math.max(5, centerY + room.height / 5)),
        rotation: 0,
        nameEn: "Luxury Sectional Sofa",
        nameBn: "বিলাসবহুল সোফা"
      });
      list.push({
        id: `f_tv_${room.id}_${Date.now()}`,
        type: "tv_cabinet",
        x: Math.min(95, Math.max(5, centerX)),
        y: Math.min(95, Math.max(5, room.y + room.height * 0.15)),
        rotation: 0,
        nameEn: "Smart TV Console",
        nameBn: "স্মার্ট টিভি কনসোল"
      });
    } else if (
      lowercaseId.includes("dining")
    ) {
      list.push({
        id: `f_dining_${room.id}_${Date.now()}`,
        type: "dining_table",
        x: Math.min(95, Math.max(5, centerX)),
        y: Math.min(95, Math.max(5, centerY)),
        rotation: 0,
        nameEn: "6-Seat Dining Table",
        nameBn: "৬-আসন ডাইনিং টেবিল"
      });
    } else if (
      lowercaseId.includes("wash") || 
      lowercaseId.includes("toilet") || 
      lowercaseId.includes("bath")
    ) {
      list.push({
        id: `f_toilet_${room.id}_${Date.now()}`,
        type: "toilet",
        x: Math.min(95, Math.max(5, room.x + room.width / 4)),
        y: Math.min(95, Math.max(5, room.y + room.height / 3)),
        rotation: 0,
        nameEn: "Toilet Commode",
        nameBn: "টয়লেট কমোড"
      });
      list.push({
        id: `f_basin_${room.id}_${Date.now()}`,
        type: "basin",
        x: Math.min(95, Math.max(5, room.x + room.width * 0.75)),
        y: Math.min(95, Math.max(5, room.y + room.height / 3)),
        rotation: 0,
        nameEn: "Ceramic Washbasin",
        nameBn: "সিরামিক ওয়াশবেসিন"
      });
    } else if (
      lowercaseId.includes("study") || 
      lowercaseId.includes("office")
    ) {
      list.push({
        id: `f_chair_${room.id}_${Date.now()}`,
        type: "chair",
        x: Math.min(95, Math.max(5, centerX)),
        y: Math.min(95, Math.max(5, centerY)),
        rotation: 0,
        nameEn: "Ergonomic Office Chair",
        nameBn: "আরামদায়ক চেয়ার"
      });
    }
  });
  return list;
};

const getFurnitureSize = (type: string) => {
  switch (type) {
    case "bed": return { w: "w-14 sm:w-16", h: "h-14 sm:h-16", ml: "-ml-7 sm:-ml-8", mt: "-mt-7 sm:-mt-8" };
    case "wardrobe": return { w: "w-12 sm:w-14", h: "h-8 sm:h-10", ml: "-ml-6 sm:-ml-7", mt: "-mt-4 sm:-mt-5" };
    case "dining_table": return { w: "w-16 sm:w-20", h: "h-12 sm:h-16", ml: "-ml-8 sm:-ml-10", mt: "-mt-6 sm:-mt-8" };
    case "chair": return { w: "w-8 sm:w-10", h: "h-8 sm:h-10", ml: "-ml-4 sm:-ml-5", mt: "-mt-4 sm:-mt-5" };
    case "basin": return { w: "w-8 sm:w-10", h: "h-8 sm:h-10", ml: "-ml-4 sm:-ml-5", mt: "-mt-4 sm:-mt-5" };
    case "sofa": return { w: "w-14 sm:w-18", h: "h-10 sm:h-12", ml: "-ml-7 sm:-ml-9", mt: "-mt-5 sm:-mt-6" };
    case "toilet": return { w: "w-8 sm:w-10", h: "h-10 sm:h-12", ml: "-ml-4 sm:-ml-5", mt: "-mt-5 sm:-mt-6" };
    case "tv_cabinet": return { w: "w-14 sm:w-16", h: "h-6 sm:h-8", ml: "-ml-7 sm:-ml-8", mt: "-mt-3 sm:-mt-4" };
    case "plant": return { w: "w-8 sm:w-10", h: "h-8 sm:h-10", ml: "-ml-4 sm:-ml-5", mt: "-mt-4 sm:-mt-5" };
    case "coffee_table": return { w: "w-10 sm:w-12", h: "h-10 sm:h-12", ml: "-ml-5 sm:-ml-6", mt: "-mt-5 sm:-mt-6" };
    default: return { w: "w-10", h: "h-10", ml: "-ml-5", mt: "-mt-5" };
  }
};

const FurnitureDisplayIcon = ({ type, isSelected }: { type: string; isSelected: boolean }) => {
  const color = isSelected ? "#0d9488" : "#475569";
  const bg = isSelected ? "rgba(13, 148, 136, 0.15)" : "white";
  
  switch (type) {
    case "bed":
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-xs">
          {/* Bed frame */}
          <rect x="4" y="4" width="56" height="56" rx="4" fill={bg} stroke={color} strokeWidth="2.5" />
          {/* Headboard */}
          <rect x="4" y="4" width="56" height="10" rx="2" fill="none" stroke={color} strokeWidth="2" />
          {/* Pillows */}
          <rect x="8" y="18" width="20" height="12" rx="2" fill="none" stroke={color} strokeWidth="1.8" />
          <rect x="36" y="18" width="20" height="12" rx="2" fill="none" stroke={color} strokeWidth="1.8" />
          {/* Blanket line */}
          <line x1="4" y1="36" x2="60" y2="36" stroke={color} strokeWidth="2" strokeDasharray="3 3" />
          <path d="M 4 36 Q 32 42 60 36" fill="none" stroke={color} strokeWidth="1.8" />
        </svg>
      );
    case "wardrobe":
      return (
        <svg viewBox="0 0 64 40" className="w-full h-full drop-shadow-xs">
          {/* Wardrobe cabinet */}
          <rect x="2" y="2" width="60" height="36" rx="2" fill={bg} stroke={color} strokeWidth="2.5" />
          {/* Internal separator and hanger cues */}
          <line x1="32" y1="2" x2="32" y2="38" stroke={color} strokeWidth="1.8" />
          {/* Handles */}
          <rect x="28" y="16" width="1.5" height="8" rx="0.5" fill={color} />
          <rect x="34" y="16" width="1.5" height="8" rx="0.5" fill={color} />
        </svg>
      );
    case "dining_table":
      return (
        <svg viewBox="0 0 80 64" className="w-full h-full drop-shadow-xs">
          {/* Table */}
          <rect x="16" y="12" width="48" height="40" rx="6" fill={bg} stroke={color} strokeWidth="2.5" />
          {/* Chairs around table */}
          {/* Top chairs */}
          <path d="M 24 12 Q 28 4 32 12" fill="none" stroke={color} strokeWidth="2" />
          <path d="M 48 12 Q 52 4 56 12" fill="none" stroke={color} strokeWidth="2" />
          {/* Bottom chairs */}
          <path d="M 24 52 Q 28 60 32 52" fill="none" stroke={color} strokeWidth="2" />
          <path d="M 48 52 Q 52 60 56 52" fill="none" stroke={color} strokeWidth="2" />
          {/* Left/Right Chairs */}
          <path d="M 16 24 Q 8 28 16 32" fill="none" stroke={color} strokeWidth="2" />
          <path d="M 64 24 Q 72 28 64 32" fill="none" stroke={color} strokeWidth="2" />
        </svg>
      );
    case "chair":
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-xs">
          {/* Seat cushion */}
          <rect x="12" y="16" width="40" height="36" rx="8" fill={bg} stroke={color} strokeWidth="2.5" />
          {/* Backrest */}
          <path d="M 14 16 C 14 4, 50 4, 50 16" fill="none" stroke={color} strokeWidth="2.5" />
          {/* Armrests */}
          <rect x="8" y="24" width="4" height="20" rx="2" fill="none" stroke={color} strokeWidth="1.8" />
          <rect x="52" y="24" width="4" height="20" rx="2" fill="none" stroke={color} strokeWidth="1.8" />
        </svg>
      );
    case "basin":
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-xs">
          {/* Outer Basin board */}
          <rect x="8" y="8" width="48" height="48" rx="6" fill={bg} stroke={color} strokeWidth="2.5" />
          {/* Inner sink bowl */}
          <ellipse cx="32" cy="32" rx="16" ry="12" fill="none" stroke={color} strokeWidth="2" />
          {/* Faucet/Tap */}
          <path d="M 32 8 L 32 16" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          {/* Drain circle */}
          <circle cx="32" cy="35" r="2.5" fill="none" stroke={color} strokeWidth="1.5" />
        </svg>
      );
    case "sofa":
      return (
        <svg viewBox="0 0 80 48" className="w-full h-full drop-shadow-xs">
          {/* Sofa frame */}
          <rect x="4" y="4" width="72" height="40" rx="4" fill={bg} stroke={color} strokeWidth="2.5" />
          {/* Thick backrest */}
          <rect x="4" y="4" width="72" height="10" rx="2" fill="none" stroke={color} strokeWidth="2" />
          {/* Armrests */}
          <rect x="4" y="14" width="8" height="30" rx="2" fill="none" stroke={color} strokeWidth="2" />
          <rect x="68" y="14" width="8" height="30" rx="2" fill="none" stroke={color} strokeWidth="2" />
          {/* Cushion lines */}
          <line x1="32" y1="14" x2="32" y2="44" stroke={color} strokeWidth="1.5" />
          <line x1="48" y1="14" x2="48" y2="44" stroke={color} strokeWidth="1.5" />
        </svg>
      );
    case "toilet":
      return (
        <svg viewBox="0 0 48 64" className="w-full h-full drop-shadow-xs">
          {/* Water flush tank */}
          <rect x="6" y="4" width="36" height="14" rx="2" fill={bg} stroke={color} strokeWidth="2.5" />
          {/* Toilet bowl oval */}
          <ellipse cx="24" cy="38" rx="14" ry="20" fill={bg} stroke={color} strokeWidth="2.5" />
          <ellipse cx="24" cy="38" rx="10" ry="15" fill="none" stroke={color} strokeWidth="1.5" />
          {/* Inner hole */}
          <circle cx="24" cy="44" r="3.5" fill="none" stroke={color} strokeWidth="1.5" />
          {/* Flush button */}
          <circle cx="34" cy="11" r="2.5" fill={color} />
        </svg>
      );
    case "tv_cabinet":
      return (
        <svg viewBox="0 0 64 24" className="w-full h-full drop-shadow-xs">
          {/* Console Shelf */}
          <rect x="2" y="2" width="60" height="20" rx="2" fill={bg} stroke={color} strokeWidth="2.5" />
          {/* DVD / Box compartments */}
          <line x1="18" y1="2" x2="18" y2="22" stroke={color} strokeWidth="1.5" />
          <line x1="46" y1="2" x2="46" y2="22" stroke={color} strokeWidth="1.5" />
          {/* TV Screen Stand Stand */}
          <rect x="22" y="10" width="20" height="4" rx="1" fill={bg} stroke={color} strokeWidth="2" />
        </svg>
      );
    case "plant":
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-xs">
          {/* Outer planter pot */}
          <circle cx="32" cy="32" r="16" fill={bg} stroke={color} strokeWidth="2.5" />
          {/* Foliage leaves shooting outward */}
          <path d="M 32 16 Q 16 8 8 32 Q 24 24 32 32" fill="none" stroke={color} strokeWidth="1.8" />
          <path d="M 32 48 Q 48 56 56 32 Q 40 40 32 32" fill="none" stroke={color} strokeWidth="1.8" />
          <path d="M 48 32 Q 56 16 32 8" fill="none" stroke={color} strokeWidth="1.8" />
          <path d="M 16 32 Q 8 48 32 56" fill="none" stroke={color} strokeWidth="1.8" />
        </svg>
      );
    case "coffee_table":
      return (
        <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-xs">
          {/* Glass table rim */}
          <circle cx="24" cy="24" r="20" fill={bg} stroke={color} strokeWidth="2.5" />
          <line x1="24" y1="4" x2="24" y2="44" stroke={color} strokeWidth="1.2" strokeDasharray="2 2" />
          <line x1="4" y1="24" x2="44" y2="24" stroke={color} strokeWidth="1.2" strokeDasharray="2 2" />
        </svg>
      );
    default:
      return null;
  }
};

const renderAttachedBathroom = (room: any, lang: "bn" | "en") => {
  const lowercaseId = room.id.toLowerCase();
  const hasBath = room.attachedBathConfig?.enabled !== false && (lowercaseId.includes("bedroom_attached") || lowercaseId.includes("attached") || room.attachedBathConfig?.enabled);
  if (!hasBath) return null;

  const bathConfig = room.attachedBathConfig || {
    enabled: true,
    size: "medium",
    position: "top-right",
    actualW: 6,
    actualH: 5
  };

  if (bathConfig.enabled === false) return null;

  // Let's ensure bounded width & height in feet
  const bW = bathConfig.actualW || 6;
  const bH = bathConfig.actualH || 5;

  const wPct = Math.min(55, Math.max(15, (bW / room.actualW) * 100));
  const hPct = Math.min(55, Math.max(15, (bH / room.actualH) * 100));

  const pos = bathConfig.position || "top-right";

  // Position specific styles & borders
  let posStyle: React.CSSProperties = {};
  let borderClass = "";
  let doorSwingStyle: React.CSSProperties = {};
  let doorMaskStyle: React.CSSProperties = {};
  let doorSvgTransform = "";
  let toiletStyle: React.CSSProperties = {};
  let basinStyle: React.CSSProperties = {};

  if (pos === "top-left") {
    posStyle = { top: 0, left: 0, width: `${wPct}%`, height: `${hPct}%` };
    borderClass = "border-r-[2.5px] border-b-[2.5px] border-slate-700";
    
    // Door on bottom wall, right side:
    doorMaskStyle = { bottom: -1.5, right: 3, width: 14, height: 3 };
    doorSwingStyle = { bottom: -11, right: 0, width: 20, height: 20 };
    doorSvgTransform = "rotate(180deg)";

    // Toilet on left wall, Basin on top wall
    toiletStyle = { left: 4, top: "25%", width: 12, height: 16 };
    basinStyle = { top: 4, left: "50%", width: 12, height: 10 };
  } else if (pos === "top-right") {
    posStyle = { top: 0, right: 0, width: `${wPct}%`, height: `${hPct}%` };
    borderClass = "border-l-[2.5px] border-b-[2.5px] border-slate-700";
    
    // Door on bottom wall, left side:
    doorMaskStyle = { bottom: -1.5, left: 3, width: 14, height: 3 };
    doorSwingStyle = { bottom: -11, left: 0, width: 20, height: 20 };
    doorSvgTransform = "rotate(180deg)";

    // Toilet on right wall, Basin on top wall
    toiletStyle = { right: 4, top: "25%", width: 12, height: 16 };
    basinStyle = { top: 4, right: "50%", width: 12, height: 10 };
  } else if (pos === "bottom-left") {
    posStyle = { bottom: 0, left: 0, width: `${wPct}%`, height: `${hPct}%` };
    borderClass = "border-r-[2.5px] border-t-[2.5px] border-slate-700";
    
    // Door on top wall, right side:
    doorMaskStyle = { top: -1.5, right: 3, width: 14, height: 3 };
    doorSwingStyle = { top: -11, right: 0, width: 20, height: 20 };
    doorSvgTransform = "";

    // Toilet on left wall, Basin on bottom wall
    toiletStyle = { left: 4, bottom: "25%", width: 12, height: 16 };
    basinStyle = { bottom: 4, left: "55%", width: 12, height: 10 };
  } else if (pos === "bottom-right") {
    posStyle = { bottom: 0, right: 0, width: `${wPct}%`, height: `${hPct}%` };
    borderClass = "border-l-[2.5px] border-t-[2.5px] border-slate-700";
    
    // Door on top wall, left side:
    doorMaskStyle = { top: -1.5, left: 3, width: 14, height: 3 };
    doorSwingStyle = { top: -11, left: 0, width: 20, height: 20 };
    doorSvgTransform = "";

    // Toilet on right wall, Basin on bottom wall
    toiletStyle = { right: 4, bottom: "25%", width: 12, height: 16 };
    basinStyle = { bottom: 4, right: "55%", width: 12, height: 10 };
  }

  return (
    <div 
      className={`absolute bg-sky-500/[0.04] z-10 flex flex-col justify-between p-1 pointer-events-none ${borderClass}`}
      style={posStyle}
    >
      {/* Bathroom Label (Visual Partition Sign) */}
      <div className="absolute inset-x-0 bottom-1 sm:bottom-2 text-center pointer-events-none">
        <span className="text-[6px] sm:text-[8px] font-black uppercase text-slate-500 tracking-wider bg-white/75 border border-slate-200/50 px-1 py-0.2 rounded-sm shadow-3xs">
          {lang === "bn" ? "সংযুক্ত বাথরুম" : "Bath"}
        </span>
        <div className="text-[5px] sm:text-[7px] font-mono font-black text-slate-400 mt-0.5">
          {bW}' × {bH}'
        </div>
      </div>

      {/* Partition Door Cutout / Mask */}
      <div className="absolute bg-white z-11" style={doorMaskStyle} />

      {/* Partition Door Swing */}
      <div className="absolute z-12 overflow-visible pointer-events-none" style={doorSwingStyle}>
        <svg className="w-full h-full overflow-visible text-slate-600" viewBox="0 0 20 20" style={{ transform: doorSvgTransform }}>
          <path d="M 0 10 A 10 10 0 0 1 10 0" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="1.5 1" />
          <line x1="10" y1="0" x2="10" y2="10" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </div>

      {/* Commode WC Icon inside bathroom partition */}
      <div className="absolute p-px opacity-[0.25]" style={toiletStyle}>
        <svg className="w-full h-full text-sky-800" viewBox="0 0 20 20" fill="none">
          <ellipse cx="10" cy="11" rx="5" ry="6.5" stroke="currentColor" strokeWidth="1" />
          <ellipse cx="10" cy="11.5" rx="3" ry="4" stroke="currentColor" strokeWidth="0.8" />
          <rect x="4" y="1" width="12" height="3" rx="0.5" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      {/* Ceramic wash basin inside bathroom partition */}
      <div className="absolute p-px opacity-[0.25]" style={basinStyle}>
        <svg className="w-full h-full text-sky-800" viewBox="0 0 20 20" fill="none">
          <rect x="1" y="1" width="18" height="11" rx="1.5" stroke="currentColor" strokeWidth="1" />
          <ellipse cx="10" cy="6.5" rx="5.5" ry="3.5" stroke="currentColor" strokeWidth="0.8" />
        </svg>
      </div>
    </div>
  );
};

const getFurnitureSVG = (room: any) => {
  const id = room.id;
  const lowercaseId = id.toLowerCase();
  
  if (
    lowercaseId.includes("master") || 
    lowercaseId.includes("bedroom") || 
    lowercaseId.includes("bed") || 
    lowercaseId.includes("guest") || 
    lowercaseId.includes("kid")
  ) {
    let bedX = 25;
    let bedY = 20;
    
    // Shift bed frame if there is an active attached bathroom partition!
    const hasBath = room.attachedBathConfig?.enabled !== false && (lowercaseId.includes("bedroom_attached") || lowercaseId.includes("attached") || room.attachedBathConfig?.enabled);
    if (hasBath) {
      const bPos = room.attachedBathConfig?.position || "top-right";
      if (bPos === "top-right") {
        // Shift left and slightly down
        bedX = 12;
        bedY = 38;
      } else if (bPos === "top-left") {
        // Shift right and slightly down
        bedX = 48;
        bedY = 38;
      } else if (bPos === "bottom-right") {
        // Shift left
        bedX = 12;
        bedY = 15;
      } else if (bPos === "bottom-left") {
        // Shift right
        bedX = 48;
        bedY = 15;
      }
    }

    return (
      <svg className="absolute inset-0 w-full h-full p-4 text-slate-400 opacity-[0.16] pointer-events-none transition-all" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* bed frame */}
        <rect x={bedX} y={bedY} width="40" height="48" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2" />
        {/* mattress inner */}
        <rect x={bedX + 2.5} y={bedY + 2.5} width="35" height="43" rx="1" fill="none" stroke="currentColor" strokeWidth="0.8" />
        {/* pillows */}
        <rect x={bedX + 5} y={bedY + 5} width="12" height="9" rx="1" fill="none" stroke="currentColor" strokeWidth="1" />
        <rect x={bedX + 23} y={bedY + 5} width="12" height="9" rx="1" fill="none" stroke="currentColor" strokeWidth="1" />
        {/* blanket fold line */}
        <line x1={bedX + 2.5} y1={bedY + 24} x2={bedX + 37.5} y2={bedY + 24} stroke="currentColor" strokeWidth="1" />
        {/* bedside tables */}
        <rect x={bedX - 10} y={bedY} width="8" height="10" rx="1" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <rect x={bedX + 42} y={bedY} width="8" height="10" rx="1" fill="none" stroke="currentColor" strokeWidth="0.8" />
      </svg>
    );
  }
  
  if (lowercaseId.includes("kitchen")) {
    // Elegant Kitchen L-shape counter, gas hob, and sink basins
    return (
      <svg className="absolute inset-0 w-full h-full p-2.5 text-amber-500 opacity-[0.2] pointer-events-none transition-all" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* L-counter */}
        <path d="M 12 12 L 88 12 L 88 32 L 32 32 L 32 88 L 12 88 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
        {/* Hob/Stove burners */}
        <g transform="translate(56, 15) scale(0.95)">
          <rect x="0" y="0" width="22" height="13" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="6" cy="6.5" r="3" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <circle cx="16" cy="6.5" r="3" fill="none" stroke="currentColor" strokeWidth="0.8" />
        </g>
        {/* Double-basin sink */}
         <g transform="translate(15, 45) scale(0.9)">
          <rect x="0" y="0" width="13" height="24" rx="2" fill="none" stroke="currentColor" strokeWidth="1" />
          <rect x="2" y="2" width="9" height="9" rx="1" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <rect x="2" y="13" width="9" height="9" rx="1" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <line x1="-1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="1" />
        </g>
      </svg>
    );
  }
  
  if (lowercaseId.includes("toilet") || lowercaseId.includes("wash") || lowercaseId.includes("bath")) {
    // WC, flush tank, oval wash basin and shower grid
    return (
      <svg className="absolute inset-0 w-full h-full p-3 text-sky-550 opacity-[0.3] pointer-events-none transition-all" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* WC seat */}
        <g transform="translate(18, 18) scale(0.95)">
          <rect x="2" y="0" width="15" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="1" />
          <ellipse cx="9.5" cy="17" rx="7" ry="9" fill="none" stroke="currentColor" strokeWidth="1" />
          <ellipse cx="9.5" cy="16.5" rx="4.5" ry="6.5" fill="none" stroke="currentColor" strokeWidth="0.8" />
        </g>
        {/* Sink vanity cabinet */}
        <g transform="translate(58, 18) scale(0.95)">
          <rect x="0" y="0" width="18" height="15" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1" />
          <ellipse cx="9" cy="7.5" rx="6" ry="4.5" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <circle cx="9" cy="2" r="1" fill="none" stroke="currentColor" strokeWidth="1" />
        </g>
        {/* Glass shower stall separation */}
        <line x1="10" y1="62" x2="90" y2="62" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
        <circle cx="50" cy="78" r="2" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
    );
  }
  
  if (lowercaseId.includes("living") || lowercaseId.includes("hall") || lowercaseId.includes("drawing")) {
    // Sectional Sofa, Coffee Table, Accent Mat, Dining Table with 6 chairs around
    return (
      <svg className="absolute inset-0 w-full h-full p-4 text-slate-400 opacity-[0.16] pointer-events-none transition-all" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Sectional corner sofa */}
        <path d="M 10 10 L 52 10 L 52 22 L 22 22 L 22 52 L 10 52 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
        {/* Section cushions lines */}
        <line x1="22" y1="10" x2="22" y2="52" stroke="currentColor" strokeWidth="0.7" />
        <line x1="10" y1="22" x2="52" y2="22" stroke="currentColor" strokeWidth="0.7" />
        <line x1="36" y1="10" x2="36" y2="22" stroke="currentColor" strokeWidth="0.7" />
        <line x1="10" y1="36" x2="22" y2="36" stroke="currentColor" strokeWidth="0.7" />
        {/* Round coffee table */}
        <circle cx="34" cy="34" r="8" fill="none" stroke="currentColor" strokeWidth="1" />
        {/* Rectangular dining table in other sector */}
        <g transform="translate(56, 50) scale(0.95)">
          <rect x="6" y="6" width="28" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2" />
          {/* 6 Chairs */}
          <rect x="11" y="0" width="8" height="4" rx="0.5" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <rect x="23" y="0" width="8" height="4" rx="0.5" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <rect x="11" y="26" width="8" height="4" rx="0.5" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <rect x="23" y="26" width="8" height="4" rx="0.5" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <rect x="0" y="11" width="4" height="8" rx="0.5" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <rect x="36" y="11" width="4" height="8" rx="0.5" fill="none" stroke="currentColor" strokeWidth="0.8" />
        </g>
      </svg>
    );
  }
  
  if (lowercaseId.includes("pooja")) {
    // Beautiful temple design
    return (
      <svg className="absolute inset-0 w-full h-full p-2.5 text-amber-500 opacity-[0.3] pointer-events-none transition-all" viewBox="0 0 100 100" preserveAspectRatio="none">
        <rect x="20" y="20" width="60" height="60" rx="3" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <rect x="30" y="30" width="40" height="40" rx="2" fill="none" stroke="currentColor" strokeWidth="0.8" />
        {/* Sacred central flame/diya */}
        <path d="M 50 35 Q 43 48 50 56 Q 57 48 50 35" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="50" cy="49" r="1.5" fill="currentColor" />
        {/* Radial rays */}
        <line x1="50" y1="32" x2="50" y2="26" stroke="currentColor" strokeWidth="0.7" />
        <line x1="38" y1="42" x2="33" y2="39" stroke="currentColor" strokeWidth="0.7" />
        <line x1="62" y1="42" x2="67" y2="39" stroke="currentColor" strokeWidth="0.7" />
      </svg>
    );
  }
  
  if (lowercaseId.includes("verandah") || lowercaseId.includes("balcony") || lowercaseId.includes("lawn") || lowercaseId.includes("garden") || lowercaseId.includes("entrance")) {
    const isEntrance = lowercaseId.includes("entrance") || lowercaseId.includes("verandah");
    return (
      <svg className={`absolute inset-0 w-full h-full p-2 ${isEntrance ? 'text-amber-700 opacity-[0.65]' : 'text-emerald-500 opacity-[0.25]'} pointer-events-none transition-all`} viewBox="0 0 100 100" preserveAspectRatio="none">
        {isEntrance ? (
          <>
            {/* Elegant entry masonry pillars */}
            <rect x="8" y="72" width="10" height="10" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <rect x="8" y="72" width="6" height="6" x-delay="2" fill="currentColor" opacity="0.3" />
            
            <rect x="82" y="72" width="10" height="10" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <rect x="84" y="74" width="6" height="6" fill="currentColor" opacity="0.3" />
            
            {/* Broad entry brick steps */}
            <line x1="18" y1="77" x2="82" y2="77" stroke="currentColor" strokeWidth="1.5" />
            <line x1="22" y1="84" x2="78" y2="84" stroke="currentColor" strokeWidth="1.2" />
            <line x1="28" y1="91" x2="72" y2="91" stroke="currentColor" strokeWidth="1.0" />
            
            {/* Grand Main Entrance Double Swing Arc */}
            <path d="M 20 40 A 30 30 0 0 0 50 10" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <line x1="50" y1="10" x2="50" y2="40" stroke="currentColor" strokeWidth="1.5" />
            
            <path d="M 80 40 A 30 30 0 0 1 50 10" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <line x1="50" y1="10" x2="50" y2="40" stroke="currentColor" strokeWidth="1.5" />

            {/* Thick door frames */}
            <rect x="18" y="36" width="4" height="8" fill="currentColor" />
            <rect x="78" y="36" width="4" height="8" fill="currentColor" />
            
            {/* Flowing Entry arrow pointing into the house */}
            <path d="M 50 94 L 50 28" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M 43 40 L 50 28 L 57 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Clear bold label */}
            <text x="50" y="58" fill="currentColor" fontSize="9" fontWeight="900" textAnchor="middle" letterSpacing="1.2" fontFamily="sans-serif">ENTRY</text>
          </>
        ) : (
          <>
            <line x1="15" y1="20" x2="85" y2="20" stroke="currentColor" strokeWidth="1" />
            <line x1="15" y1="35" x2="85" y2="35" stroke="currentColor" strokeWidth="1" />
            <line x1="15" y1="50" x2="85" y2="50" stroke="currentColor" strokeWidth="1" />
            <line x1="15" y1="65" x2="85" y2="65" stroke="currentColor" strokeWidth="1" />
            <line x1="15" y1="80" x2="85" y2="80" stroke="currentColor" strokeWidth="1" />
            <path d="M 50 88 L 50 12 L 44 22 M 50 12 L 56 22" fill="none" stroke="currentColor" strokeWidth="1" />
          </>
        )}
      </svg>
    );
  }
  
  if (lowercaseId.includes("stairs") || lowercaseId.includes("stair")) {
    // Highly detailed building-plan-ready concrete structural staircase representation
    return (
      <svg className="absolute inset-0 w-full h-full p-2.5 text-indigo-700 opacity-[0.55] pointer-events-none transition-all" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Outer reinforced masonry wall guide */}
        <rect x="4" y="4" width="92" height="92" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3,2" />
        
        {/* Handrail dividing column */}
        <line x1="50" y1="4" x2="50" y2="80" stroke="currentColor" strokeWidth="2.5" />
        <rect x="47" y="78" width="6" height="4" fill="currentColor" />
        
        {/* Left Side: Stair Treads (UP Direction steps) */}
        <line x1="4" y1="16" x2="50" y2="16" stroke="currentColor" strokeWidth="1.2" />
        <line x1="4" y1="28" x2="50" y2="28" stroke="currentColor" strokeWidth="1.2" />
        <line x1="4" y1="40" x2="50" y2="40" stroke="currentColor" strokeWidth="1.2" />
        <line x1="4" y1="52" x2="50" y2="52" stroke="currentColor" strokeWidth="1.2" />
        <line x1="4" y1="64" x2="50" y2="64" stroke="currentColor" strokeWidth="1.2" />
        <line x1="4" y1="76" x2="50" y2="76" stroke="currentColor" strokeWidth="1.2" />
        
        {/* Mid-landing platform breaker */}
        <line x1="4" y1="82" x2="96" y2="82" stroke="currentColor" strokeWidth="2" />
        
        {/* Right Side: Stair Treads (Upper levels / continuing steps) */}
        <line x1="50" y1="70" x2="96" y2="70" stroke="currentColor" strokeWidth="1.2" />
        <line x1="50" y1="58" x2="96" y2="58" stroke="currentColor" strokeWidth="1.2" />
        <line x1="50" y1="46" x2="96" y2="46" stroke="currentColor" strokeWidth="1.2" />
        <line x1="50" y1="34" x2="96" y2="34" stroke="currentColor" strokeWidth="1.2" />
        <line x1="50" y1="22" x2="96" y2="22" stroke="currentColor" strokeWidth="1.2" />
        <line x1="50" y1="10" x2="96" y2="10" stroke="currentColor" strokeWidth="1.2" />
        
        {/* Curved directional ascending trajectory arrow */}
        <path d="M 27 74 L 27 20 Q 27 10 50 10 Q 73 10 73 20 L 73 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,1.5" />
        {/* Thick arrow head pointing upstairs */}
        <path d="M 68 40 L 73 48 L 78 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Up arrow circular starting dot */}
        <circle cx="27" cy="74" r="3" fill="currentColor" />
        
        {/* Text guide */}
        <text x="27" y="67" fill="currentColor" fontSize="8.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">UP</text>
      </svg>
    );
  }
  
  return null;
};

const getRoomBGColor = (id: string, isSelected: boolean) => {
  const lowercaseId = id.toLowerCase();
  
  if (lowercaseId.includes("stair") || lowercaseId.includes("lobby_stairs")) {
    return isSelected ? "bg-[#ede9fe]" : "bg-[#faf5ff] border-indigo-200/60"; // beautiful soft tech purple for stairs
  }
  if (lowercaseId.includes("entrance") || lowercaseId.includes("verandah")) {
    return isSelected ? "bg-[#ffedd5]" : "bg-[#fffbeb] border-amber-200/60"; // beautiful soft welcoming gold/amber for entrance
  }
  if (lowercaseId.includes("toilet") || lowercaseId.includes("wash") || lowercaseId.includes("bath")) {
    return isSelected ? "bg-[#e0f2fe]" : "bg-[#f0f9ff]"; // soft skylight blue WC
  }
  if (lowercaseId.includes("kitchen")) {
    return isSelected ? "bg-[#fffbeb]" : "bg-[#fffdf5]"; // soft light warm yellow kitchen
  }
  if (
    lowercaseId.includes("master") || 
    lowercaseId.includes("bedroom") || 
    lowercaseId.includes("bed") || 
    lowercaseId.includes("guest") || 
    lowercaseId.includes("kid")
  ) {
    return isSelected ? "bg-[#fafaf9]" : "bg-[#fbfbfa]"; // soft clean neutral beige beds
  }
  if (lowercaseId.includes("pooja")) {
    return isSelected ? "bg-[#fef9c3]" : "bg-[#fffdeb]/90"; // spiritual ivory gold temple
  }
  if (
    lowercaseId.includes("balcony") || 
    lowercaseId.includes("lawn") || 
    lowercaseId.includes("garden")
  ) {
    return isSelected ? "bg-[#ecfdf5]" : "bg-[#f5fdf9]"; // refreshing deck-front terrace green
  }
  return isSelected ? "bg-slate-50" : "bg-[#fafbfc]"; // living room and others
};

const renderDoorSwing = (id: string) => {
  const lowercaseId = id.toLowerCase();
  
  // Doors are placed on residential spaces like toilets, kitchens, and bedrooms
  if (
    lowercaseId.includes("stair") || 
    lowercaseId.includes("lawn") || 
    lowercaseId.includes("garage") || 
    lowercaseId.includes("verandah") || 
    lowercaseId.includes("garden")
  ) {
    return null;
  }
  
  return (
    <svg className="absolute w-5 h-5 text-slate-400 opacity-[0.45] pointer-events-none z-20" viewBox="0 0 20 20" style={{ bottom: "2px", right: "2px", transform: "rotate(90deg)" }}>
      {/* Door Swing Quarter Arc */}
      <path d="M 0 20 A 20 20 0 0 1 20 0" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {/* Door Leaf */}
      <line x1="20" y1="0" x2="20" y2="20" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
};

const renderWindows = (room: any) => {
  const windows = [];
  
  // Top external wall
  if (room.y === 0) {
    windows.push(
      <div key="win-t" className="absolute top-[-3.5px] left-1/2 -translate-x-1/2 w-8 h-[7px] bg-white border border-slate-800 rounded-sm z-20 flex items-center justify-center shadow-sm">
        <div className="w-full h-[1px] bg-slate-400" />
      </div>
    );
  }
  // Bottom external wall
  if (room.y + room.height >= 90) {
    windows.push(
      <div key="win-b" className="absolute bottom-[-3.5px] left-1/2 -translate-x-1/2 w-8 h-[7px] bg-white border border-slate-800 rounded-sm z-20 flex items-center justify-center shadow-sm">
        <div className="w-full h-[1px] bg-slate-400" />
      </div>
    );
  }
  // Left external wall
  if (room.x === 0) {
    windows.push(
      <div key="win-l" className="absolute left-[-3.5px] top-1/2 -translate-y-1/2 h-8 w-[7px] bg-white border border-slate-800 rounded-sm z-20 flex flex-col items-center justify-center shadow-sm">
        <div className="h-full w-[1px] bg-slate-400" />
      </div>
    );
  }
  // Right external wall
  if (room.x + room.width >= 90) {
    windows.push(
      <div key="win-r" className="absolute right-[-3.5px] top-1/2 -translate-y-1/2 h-8 w-[7px] bg-white border border-slate-800 rounded-sm z-20 flex flex-col items-center justify-center shadow-sm">
        <div className="h-full w-[1px] bg-slate-400" />
      </div>
    );
  }
  
  return windows;
};

const renderCustomWindows = (room: any) => {
  const windows = [];
  
  if (room.windows) {
    if (room.windows.top) {
      windows.push(
        <div key="custom-win-t" className="absolute top-[-3.5px] left-1/2 -translate-x-1/2 w-8 h-[7px] bg-white border border-slate-800 rounded-sm z-20 flex items-center justify-center shadow-sm">
          <div className="w-full h-[1px] bg-slate-400" />
        </div>
      );
    }
    if (room.windows.bottom) {
      windows.push(
        <div key="custom-win-b" className="absolute bottom-[-3.5px] left-1/2 -translate-x-1/2 w-8 h-[7px] bg-white border border-slate-800 rounded-sm z-20 flex items-center justify-center shadow-sm">
          <div className="w-full h-[1px] bg-slate-400" />
        </div>
      );
    }
    if (room.windows.left) {
      windows.push(
        <div key="custom-win-l" className="absolute left-[-3.5px] top-1/2 -translate-y-1/2 h-8 w-[7px] bg-white border border-slate-800 rounded-sm z-20 flex flex-col items-center justify-center shadow-sm">
          <div className="h-full w-[1px] bg-slate-400" />
        </div>
      );
    }
    if (room.windows.right) {
      windows.push(
        <div key="custom-win-r" className="absolute right-[-3.5px] top-1/2 -translate-y-1/2 h-8 w-[7px] bg-white border border-slate-800 rounded-sm z-20 flex flex-col items-center justify-center shadow-sm">
          <div className="h-full w-[1px] bg-slate-400" />
        </div>
      );
    }
  } else {
    windows.push(...renderWindows(room));
  }
  
  return windows;
};

const renderCustomDoors = (room: any) => {
  const doors = [];
  
  if (room.doors) {
    if (room.doors.top) {
      const pos = room.doorPositions?.top ?? 25;
      doors.push(
        <div key="door-t" className="absolute pointer-events-none z-30" style={{ top: 0, left: `${pos}%`, transform: 'translate(-50%, -50%)', width: '38px', height: '38px' }}>
          {/* White Solid Boundary Mask to break the wall line */}
          <div className="absolute top-[16px] left-[-3px] w-[44px] h-[6px] bg-white z-10" />
          {/* Wall Jamb lines on both sides of the cutout */}
          <div className="absolute top-[16px] left-[-3px] w-[2.5px] h-[6px] bg-slate-800 z-11" />
          <div className="absolute top-[16px] left-[39px] w-[2.5px] h-[6px] bg-slate-800 z-11" />
          
          {/* Door swing vector graphic */}
          <svg className="absolute inset-0 w-full h-full z-12 overflow-visible" viewBox="0 0 38 38">
            {/* Swinging Door Leaf pointing DOWN (into the room) */}
            <line x1="2" y1="19" x2="2" y2="36" stroke="#1e293b" strokeWidth="1.8" />
            {/* Swing arc pathway bowing inwards */}
            <path d="M 2 36 A 17 17 0 0 0 19 19" fill="none" stroke="#64748b" strokeWidth="1.2" strokeDasharray="2 1.5" />
          </svg>
        </div>
      );
    }
    if (room.doors.bottom) {
      const pos = room.doorPositions?.bottom ?? 25;
      doors.push(
        <div key="door-b" className="absolute pointer-events-none z-30" style={{ bottom: 0, left: `${pos}%`, transform: 'translate(-50%, 50%)', width: '38px', height: '38px' }}>
          {/* Mask */}
          <div className="absolute top-[16px] left-[-3px] w-[44px] h-[6px] bg-white z-10" />
          {/* Wall Jambs */}
          <div className="absolute top-[16px] left-[-3px] w-[2.5px] h-[6px] bg-slate-800 z-11" />
          <div className="absolute top-[16px] left-[39px] w-[2.5px] h-[6px] bg-slate-800 z-11" />
          
          <svg className="absolute inset-0 w-full h-full z-12 overflow-visible" viewBox="0 0 38 38">
            {/* Swing door leaf pointing UP (into the room) */}
            <line x1="2" y1="19" x2="2" y2="2" stroke="#1e293b" strokeWidth="1.8" />
            {/* Arc path bowing inwards */}
            <path d="M 2 2 A 17 17 0 0 1 19 19" fill="none" stroke="#64748b" strokeWidth="1.2" strokeDasharray="2 1.5" />
          </svg>
        </div>
      );
    }
    if (room.doors.left) {
      const pos = room.doorPositions?.left ?? 25;
      doors.push(
        <div key="door-l" className="absolute pointer-events-none z-30" style={{ left: 0, top: `${pos}%`, transform: 'translate(-50%, -50%)', width: '38px', height: '38px' }}>
          {/* Mask */}
          <div className="absolute top-[-3px] left-[16px] w-[6px] h-[44px] bg-white z-10" />
          {/* Wall Jambs */}
          <div className="absolute top-[-3px] left-[16px] h-[2.5px] w-[6px] bg-slate-800 z-11" />
          <div className="absolute top-[39px] left-[16px] h-[2.5px] w-[6px] bg-slate-800 z-11" />
          
          <svg className="absolute inset-0 w-full h-full z-12 overflow-visible" viewBox="0 0 38 38">
            {/* Swing door leaf pointing RIGHT (into the room) */}
            <line x1="19" y1="2" x2="36" y2="2" stroke="#1e293b" strokeWidth="1.8" />
            {/* Arc bowing inwards */}
            <path d="M 36 2 A 17 17 0 0 1 19 19" fill="none" stroke="#64748b" strokeWidth="1.2" strokeDasharray="2 1.5" />
          </svg>
        </div>
      );
    }
    if (room.doors.right) {
      const pos = room.doorPositions?.right ?? 25;
      doors.push(
        <div key="door-r" className="absolute pointer-events-none z-30" style={{ right: 0, top: `${pos}%`, transform: 'translate(50%, -50%)', width: '38px', height: '38px' }}>
          {/* Mask */}
          <div className="absolute top-[-3px] left-[16px] w-[6px] h-[44px] bg-white z-10" />
          {/* Wall Jambs */}
          <div className="absolute top-[-3px] left-[16px] h-[2.5px] w-[6px] bg-slate-800 z-11" />
          <div className="absolute top-[39px] left-[16px] h-[2.5px] w-[6px] bg-slate-800 z-11" />
          
          <svg className="absolute inset-0 w-full h-full z-12 overflow-visible" viewBox="0 0 38 38">
            {/* Swing door leaf pointing LEFT (into the room) */}
            <line x1="19" y1="2" x2="2" y2="2" stroke="#1e293b" strokeWidth="1.8" />
            {/* Arc bowing inwards */}
            <path d="M 2 2 A 17 17 0 0 0 19 19" fill="none" stroke="#64748b" strokeWidth="1.2" strokeDasharray="2 1.5" />
          </svg>
        </div>
      );
    }
  } else {
    const standardSwing = renderDoorSwing(room.id);
    if (standardSwing) {
      doors.push(standardSwing);
    }
  }
  
  return doors;
};

export default function App() {
  // Locale State: 'bn' (Bengali) is the primary default, 'en' (English) alternative
  const [lang, setLang] = useState<"bn" | "en">("bn");

  // Theme State: 'light' or 'dark'
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      return (localStorage.getItem("theme") as "light" | "dark") || "light";
    } catch {
      return "light";
    }
  });

  // Save theme preference whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      console.warn("localStorage not available", e);
    }
  }, [theme]);

  // Technical Disclaimer Modal State
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  // Selection state
  const [selectedStateIndex, setSelectedStateIndex] = useState<number>(0); // West Bengal default
  const [selectedDistrictIndex, setSelectedDistrictIndex] = useState<number>(0); // Kolkata default

  // Core plot configurations
  const [plotWidth, setPlotWidth] = useState<number>(40); // frontage in feet
  const [plotDepth, setPlotDepth] = useState<number>(60); // depth in feet
  const [bhk, setBhk] = useState<string>("3 BHK");
  const [floors, setFloors] = useState<"single" | "duplex">("duplex");
  const [facing, setFacing] = useState<string>("North");

  // Dynamic state loaded from state/district database
  const currentState = INDIAN_STATES[selectedStateIndex];
  const currentDistrict = currentState.districts[selectedDistrictIndex] || currentState.districts[0];
  const [baseRate, setBaseRate] = useState<number>(currentDistrict.defaultRate);

  // Active Phase Navigation
  const [activePhase, setActivePhase] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Layout states
  const [setbacks, setSetbacks] = useState<Setbacks>({ front: 8, rear: 5, side: 4.5 });
  const [rooms, setRooms] = useState<RoomLayout[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomLayout | null>(null);

  // Floor Selector for Duplex view
  const [activeFloorView, setActiveFloorView] = useState<number>(0); // 0 = Ground, 1 = First

  // Cost estimates
  const [budget, setBudget] = useState<BudgetSummary | null>(null);

  // AI Expert consultation state
  const [consultationText, setConsultationText] = useState<string>("");
  const [isLoadingConsultation, setIsLoadingConsultation] = useState<boolean>(false);

  // Prompt copies
  const [copiedExterior, setCopiedExterior] = useState<boolean>(false);
  const [copiedInterior, setCopiedInterior] = useState<boolean>(false);

  // Paint Expense Phase States
  const [paintType, setPaintType] = useState<"interior" | "exterior" | "all">("all");
  const [paintQuality, setPaintQuality] = useState<"budget" | "standard" | "premium">("standard");
  const [paintCoats, setPaintCoats] = useState<number>(2);
  const [includePutty, setIncludePutty] = useState<boolean>(true);
  const [includePrimer, setIncludePrimer] = useState<boolean>(true);
  const [customCeilingHeight, setCustomCeilingHeight] = useState<number>(10);
  const [paintLaborRate, setPaintLaborRate] = useState<number>(12);

  // Customized Room Builder states
  const [isCustomized, setIsCustomized] = useState<boolean>(true);
  const [expandedCalcId, setExpandedCalcId] = useState<string | null>(null);
  
  const [customRoomType, setCustomRoomType] = useState<string>("bedroom");
  const [customRoomWidth, setCustomRoomWidth] = useState<number>(12);
  const [customRoomHeight, setCustomRoomHeight] = useState<number>(12);
  const [customRoomZone, setCustomRoomZone] = useState<string>("North-West (Vayavya)");
  const [customRoomFloor, setCustomRoomFloor] = useState<number>(0);
  const [editorTab, setEditorTab] = useState<"edit" | "list" | "draw" | "furniture">("list");

  // Furniture and active dragging state variables
  const [furnitureItems, setFurnitureItems] = useState<FurnitureItem[]>([]);
  const [selectedFurnitureId, setSelectedFurnitureId] = useState<string | null>(null);

  const [draggingRoomId, setDraggingRoomId] = useState<string | null>(null);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null);
  const [dragStartRoomCoords, setDragStartRoomCoords] = useState<{ x: number; y: number } | null>(null);
  const [dragStartFurnitureCoords, setDragStartFurnitureCoords] = useState<{ id: string; x: number; y: number }[]>([]);

  const [draggingFurnitureId, setDraggingFurnitureId] = useState<string | null>(null);
  const [dragStartFurniturePos, setDragStartFurniturePos] = useState<{ x: number; y: number } | null>(null);
  const [dragStartFurnitureCoord, setDragStartFurnitureCoord] = useState<{ x: number; y: number } | null>(null);

  // Manual drawing coordinate states (percentage-based 0 to 100)
  const [manualStrokes, setManualStrokes] = useState<{ type?: "pencil" | "straight" | "curve"; color: string; width: number; points: { x: number; y: number }[] }[]>([]);
  const [currentStroke, setCurrentStroke] = useState<{ type?: "pencil" | "straight" | "curve"; color: string; width: number; points: { x: number; y: number }[] } | null>(null);
  const [strokeColor, setStrokeColor] = useState<string>("#1e293b");
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [drawTool, setDrawTool] = useState<"pencil" | "straight" | "curve" | "text" | "eraser">("pencil");
  const [manualTexts, setManualTexts] = useState<{ id: string; text: string; x: number; y: number; color: string }[]>([]);
  const [textInput, setTextInput] = useState<string>("");
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const handlePointerDown = (e: PointerEvent<SVGSVGElement>) => {
    if (editorTab !== "draw") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (drawTool === "pencil" || drawTool === "straight" || drawTool === "curve") {
      setIsDrawing(true);
      setCurrentStroke({
        type: drawTool,
        color: strokeColor,
        width: strokeWidth,
        points: [{ x, y }]
      });
    } else if (drawTool === "text" && textInput.trim()) {
      const newText = {
        id: `txt_${Date.now()}`,
        text: textInput.trim(),
        x,
        y,
        color: strokeColor
      };
      setManualTexts(prev => [...prev, newText]);
      setTextInput("");
    } else if (drawTool === "eraser") {
      // erase strokes around (x, y)
      setManualStrokes(prev => prev.filter(stroke => {
        const isNear = stroke.points.some(p => {
          const dist = Math.sqrt((p.x - x) ** 2 + (p.y - y) ** 2);
          return dist < 4; // distance threshold in percentage coordinates
        });
        return !isNear;
      }));
    }
  };

  const handlePointerMove = (e: PointerEvent<SVGSVGElement>) => {
    if (editorTab !== "draw" || !isDrawing || !currentStroke) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

    setCurrentStroke(prev => {
      if (!prev) return null;
      if (prev.type === "straight" || prev.type === "curve") {
        const start = prev.points[0];
        return {
          ...prev,
          points: [start, { x, y }]
        };
      } else {
        return {
          ...prev,
          points: [...prev.points, { x, y }]
        };
      }
    });
  };

  const handlePointerUp = () => {
    if (editorTab !== "draw" || !isDrawing) return;
    setIsDrawing(false);
    if (currentStroke && currentStroke.points.length >= 2) {
      setManualStrokes(prev => [...prev, currentStroke]);
    }
    setCurrentStroke(null);
  };

  const [isDownloadingPng, setIsDownloadingPng] = useState<boolean>(false);

  const handleDownloadPNG = async () => {
    const element = document.getElementById("blueprint-card-print");
    if (!element) return;
    
    try {
      setIsDownloadingPng(true);
      
      const dataUrl = await toPng(element, {
        backgroundColor: "#ffffff",
        pixelRatio: 3, // Premium ultra-high-definition output
        style: {
          transform: "scale(1)",
          borderRadius: "0px",
          boxShadow: "none"
        }
      });
      
      const link = document.createElement("a");
      const filename = `Vastu_Floor_Plan_${plotWidth}x${plotDepth}_${floors === "duplex" ? (activeFloorView === 0 ? "Ground" : "First") : "Ground"}_Floor.png`;
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("PNG download failed:", err);
    } finally {
      setIsDownloadingPng(false);
    }
  };

  const [ROOM_TYPES, setROOM_TYPES] = useState([
    { value: "bedroom", labelEn: "Bedroom", labelBn: "বেডরুম", color: "#ecfdf5", defaultW: 12, defaultH: 12, descEn: "Secondary family bedroom with clean ventilation.", descBn: "পরিবারের সদস্যদের বা বাচ্চাদের জন্য পর্যাপ্ত আলো-বাতাসযুক্ত শয়নকক্ষ।" },
    { value: "master_bedroom", labelEn: "Master Bedroom", labelBn: "মাস্টার বেডরুম", color: "#e2e8f0", defaultW: 14, defaultH: 14, descEn: "Primary master suite with attached bathroom.", descBn: "প্রধান অত্যন্ত আরামদায়ক শোবার ঘর, যা সংযুক্ত ওয়াশরুমের সাথে অবস্থিত।" },
    { value: "bedroom_attached", labelEn: "Bedroom - Attached Bathroom", labelBn: "বেডরুম ও সংযুক্ত বাথরুম", color: "#f0fdfa", defaultW: 14, defaultH: 12, descEn: "Bedroom featuring an integrated, fully-equipped attached bathroom.", descBn: "টয়লেট এবং চমৎকার ফিটিংসযুক্ত সংযুক্ত বাথরুম সমন্বিত শয়নকক্ষ।" },
    { value: "study_room", labelEn: "Study Room", labelBn: "অধ্যয়ন কক্ষ", color: "#fff1f2", defaultW: 10, defaultH: 12, descEn: "Quiet workspace and library optimized for concentration.", descBn: "নীরব ও শান্ত পড়াশোনার ঘর বা হোম-অফিস স্পেস।" },
    { value: "wash_room", labelEn: "Washroom / Bath", labelBn: "টয়লেট / স্নানঘর", color: "#f1f5f9", defaultW: 6, defaultH: 8, descEn: "Clean, hygienic modern sanitary bathroom.", descBn: "আধুনিক ফিটিংসযুক্ত পরিষ্কার শুষ্ক বাথরুম ও ওয়াশ এরিয়া।" },
    { value: "dining", labelEn: "Dining Room", labelBn: "ডাইনিং স্পেস", color: "#dbeafe", defaultW: 12, defaultH: 12, descEn: "Cozy family dining area connecting the kitchen.", descBn: "পরিবারের সবার একসাথে খাওয়ার এবং চমৎকার খোশগল্প করার স্থান।" },
    { value: "living", labelEn: "Living Room", labelBn: "লিভিং/স্মার্ট হল", color: "#eff6ff", defaultW: 16, defaultH: 14, descEn: "Spacious reception lounge with large glass window grids.", descBn: "অতিথিদের আপ্যায়ন এবং আড্ডার জন্য বড় জানালার আধুনিক ড্রইং রুম।" },
    { value: "stairs", labelEn: "Stairs Area", labelBn: "সিঁড়ি ঘর (Stairs)", color: "#faf5ff", defaultW: 8, defaultH: 16, descEn: "Reinforced structural concrete stairs ascending to upper floors.", descBn: "পরবর্তী তলায় সহজে যাতায়াতের জন্য আরসিসি সিঁড়ির কাঠামোগত কোণ।" },
    { value: "entrance", labelEn: "Main Entrance", labelBn: "প্রধান প্রবেশদ্বার (Gate)", color: "#fffbeb", defaultW: 10, defaultH: 10, descEn: "Welcoming entrance porch or lobby connecting to the main driveway.", descBn: "বাড়ির সামনের আকর্ষণীয় প্রধান গেট ও প্রবেশদ্বার অঞ্চল।" },
    { value: "garage", labelEn: "Garage Option", labelBn: "গ্যারেজ অপশন (Garage)", color: "#f8fafc", defaultW: 12, defaultH: 16, descEn: "Secure covered vehicular parking with dynamic access gate.", descBn: "নিরাপদ গাড়ি বা মোটরবাইক পার্কিং এবং ড্রাইভওয়ের আচ্ছাদিত গেট অঞ্চল।" },
    { value: "gardening", labelEn: "Gardening Portion", labelBn: "বাগান বা লন (Gardening)", color: "#f0fdf4", defaultW: 15, defaultH: 10, descEn: "Verdant green yard with organic local shrubbery.", descBn: "সবুজ ঘাস এবং সুন্দর ফুলের গাছে সজ্জিত চমৎকার ছোট বাগান অংশ।" },
    { value: "balcony", labelEn: "Balcony / Verandah", labelBn: "বারান্দা / ব্যালকনি (Balcony)", color: "#f0fdfa", defaultW: 10, defaultH: 5, descEn: "Open air balcony or verandah section with safety railings.", descBn: "খোলা হাওয়া চলাচলের জন্য চমৎকার আরামদায়ক বারান্দা বা ব্যালকনি অঞ্চল।" }
  ]);

  const [ROOM_SIZE_PRESETS, setROOM_SIZE_PRESETS] = useState<Record<string, Array<{ w: number; h: number; labelEn: string; labelBn: string }>>>({
    bedroom: [
      { w: 10, h: 12, labelEn: "10' × 12' (Small Bedroom)", labelBn: "১০ × ১২ ফুট (ছোট বেডরুম)" },
      { w: 12, h: 12, labelEn: "12' × 12' (Standard Size)", labelBn: "১২ × ১২ ফুট (স্ট্যান্ডার্ড)" },
      { w: 14, h: 12, labelEn: "14' × 12' (Spacious Bed)", labelBn: "১৪ × ১২ ফুট (প্রশস্ত বেডরুম)" }
    ],
    master_bedroom: [
      { w: 12, h: 14, labelEn: "12' × 14' (Standard Master)", labelBn: "১২ × ১৪ ফুট (মাস্টার বেডরুম)" },
      { w: 14, h: 14, labelEn: "14' × 14' (Executive Master)", labelBn: "১৪ × ১৪ ফুট (উন্নত মাস্টার)" },
      { w: 14, h: 16, labelEn: "14' × 16' (Luxury Suite)", labelBn: "১৪ × ১৬ ফুট (বিলাসবহুল সুইট)" }
    ],
    bedroom_attached: [
      { w: 12, h: 14, labelEn: "12' × 14' (Attached Bed)", labelBn: "১২ × ১৪ ফুট (সংযুক্ত সহ বেড)" },
      { w: 14, h: 14, labelEn: "14' × 14' (Standard Attached Suite)", labelBn: "১৪ × ১৪ ফুট (স্ট্যান্ডার্ড সুইট)" },
      { w: 16, h: 14, labelEn: "16' × 14' (Executive Attached Suite)", labelBn: "১৬ × ১৪ ফুট (উন্নত সংযুক্ত সুইট)" }
    ],
    study_room: [
      { w: 10, h: 10, labelEn: "10' × 10' (Compact Study)", labelBn: "১০ × ১০ ফুট (ছোট স্টাডি)" },
      { w: 10, h: 12, labelEn: "10' × 12' (Standard Study)", labelBn: "১০ × ১২ ফুট (স্ট্যান্ডার্ড স্টাডি)" },
      { w: 12, h: 12, labelEn: "12' × 12' (Spacious Office)", labelBn: "১২ × ১২ ফুট (বড় স্টাডি)" }
    ],
    wash_room: [
      { w: 5, h: 7, labelEn: "5' × 7' (Cozy Bath & toilet)", labelBn: "৫ × ৭ ফুট (ছোট বাথরুম)" },
      { w: 6, h: 8, labelEn: "6' × 8' (Standard Washroom)", labelBn: "৬ × ৮ ফুট (স্ট্যান্ডার্ড বাথরুম)" },
      { w: 8, h: 8, labelEn: "8' × 8' (Premium Bathroom)", labelBn: "৮ × ৮ ফুট (প্রিমিয়াম বাথরুম)" }
    ],
    dining: [
      { w: 10, h: 10, labelEn: "10' × 10' (Compact Dining)", labelBn: "১০ × ১০ ফুট (ছোট ডাইনিং)" },
      { w: 12, h: 12, labelEn: "12' × 12' (Standard Dining)", labelBn: "১২ × ১২ ফুট (স্ট্যান্ডার্ড)" },
      { w: 14, h: 12, labelEn: "14' × 12' (Spacious Dining)", labelBn: "১৪ × ১২ ফুট (বড় ডাইনিং)" }
    ],
    living: [
      { w: 14, h: 14, labelEn: "14' × 14' (Cosy Living Room)", labelBn: "১৪ × ১৪ ফুট (ছোট লিভিং)" },
      { w: 16, h: 14, labelEn: "16' × 14' (Standard Family Hall)", labelBn: "১৬ × ১৪ ফুট (স্ট্যান্ডার্ড লিভিং)" },
      { w: 18, h: 16, labelEn: "18' × 16' (Grand Living Hall)", labelBn: "১৮ × ১৬ ফুট (বিশাল হলরুম)" }
    ],
    stairs: [
      { w: 8, h: 14, labelEn: "8' × 14' (Compact Stairs)", labelBn: "৮ × ১৪ ফুট (ছোট সিঁড়ি)" },
      { w: 8, h: 16, labelEn: "8' × 16' (Standard Stairs)", labelBn: "৮ × ১৬ ফুট (স্ট্যান্ডার্ড)" }
    ],
    garage: [
      { w: 10, h: 16, labelEn: "10' × 16' (Single Sedan)", labelBn: "১০ × ১৬ ফুট (ছোট গ্যারেজ)" },
      { w: 12, h: 16, labelEn: "12' × 16' (SUV & Bikes)", labelBn: "১২ × ১৬ ফুট (এসইউভি গ্যারেজ)" },
      { w: 14, h: 20, labelEn: "14' × 20' (Double Vehicle)", labelBn: "১৪ × ২০ ফুট (২টি গাড়ির গ্যারেজ)" }
    ],
    gardening: [
      { w: 10, h: 8, labelEn: "10' × 8' (Cozy Yard)", labelBn: "১০ × ৮ ফুট (ছোট উঠান)" },
      { w: 15, h: 10, labelEn: "15' × 10' (Standard green Lawn)", labelBn: "১৫ × ১০ ফুট (স্ট্যান্ডার্ড লন)" },
      { w: 25, h: 10, labelEn: "20' × 10' (Grand Lawn)", labelBn: "২০ × ১০ ফুট (বিশাল সবুজ লন)" }
    ],
    entrance: [
      { w: 8, h: 8, labelEn: "8' × 8' (Cozy Portico)", labelBn: "৮ × ৮ ফুট (ছোট বারান্দা)" },
      { w: 10, h: 10, labelEn: "10' × 10' (Standard Lobby)", labelBn: "১০ × ১০ ফুট (স্ট্যান্ডার্ড গেট)" },
      { w: 12, h: 10, labelEn: "12' × 10' (Grand Entrance)", labelBn: "১২ × ১০  ফুট (বড় প্রবেশদ্বার)" }
    ],
    balcony: [
      { w: 8, h: 4, labelEn: "8' × 4' (Compact Balcony)", labelBn: "৮ × ৪ ফুট (ছোট বারান্দা)" },
      { w: 10, h: 5, labelEn: "10' × 5' (Standard Balcony)", labelBn: "১০ × ৫ ফুট (স্ট্যান্ডার্ড বারান্দা)" },
      { w: 12, h: 6, labelEn: "12' × 6' (Spacious Balcony)", labelBn: "১২ × ৬ ফুট (প্রশস্ত বারান্দা)" }
    ]
  });

  // Dynamic Space Type adding states
  const [showAddNewFieldForm, setShowAddNewFieldForm] = useState<boolean>(false);
  const [newFieldNameEn, setNewFieldNameEn] = useState<string>("");
  const [newFieldNameBn, setNewFieldNameBn] = useState<string>("");
  const [newFieldDefaultW, setNewFieldDefaultW] = useState<number>(10);
  const [newFieldDefaultH, setNewFieldDefaultH] = useState<number>(12);
  const [newFieldColor, setNewFieldColor] = useState<string>("#fee2e2");

  const handleAddNewSpaceTypeField = () => {
    if (!newFieldNameEn.trim() || !newFieldNameBn.trim()) {
      alert(lang === "bn" ? "অনুগ্রহ করে ইংরেজি এবং বাংলা উভয় নাম লিখুন।" : "Please enter both English and Bengali names.");
      return;
    }

    const val = `custom_${Date.now()}`;
    const newField = {
      value: val,
      labelEn: newFieldNameEn,
      labelBn: newFieldNameBn,
      color: newFieldColor,
      defaultW: newFieldDefaultW,
      defaultH: newFieldDefaultH,
      descEn: `Custom defined space: ${newFieldNameEn}`,
      descBn: `ব্যবহারকারীর নিজস্ব কাস্টম স্পর্শ অঞ্চল: ${newFieldNameBn}`
    };

    setROOM_TYPES(prev => [...prev, newField]);

    // Add automatically generated presets for this room type
    setROOM_SIZE_PRESETS(prev => ({
      ...prev,
      [val]: [
        {
          w: Math.max(4, newFieldDefaultW - 2),
          h: Math.max(4, newFieldDefaultH - 2),
          labelEn: `${Math.max(4, newFieldDefaultW - 2)}' × ${Math.max(4, newFieldDefaultH - 2)}' (Small Size)`,
          labelBn: `${Math.max(4, newFieldDefaultW - 2)} × ${Math.max(4, newFieldDefaultH - 2)} ফুট (ছোট মাপ)`
        },
        {
          w: newFieldDefaultW,
          h: newFieldDefaultH,
          labelEn: `${newFieldDefaultW}' × ${newFieldDefaultH}' (Standard Size)`,
          labelBn: `${newFieldDefaultW} × ${newFieldDefaultH} ফুট (স্ট্যান্ডার্ড মাপ)`
        },
        {
          w: newFieldDefaultW + 2,
          h: newFieldDefaultH + 2,
          labelEn: `${newFieldDefaultW + 2}' × ${newFieldDefaultH + 2}' (Spacious)`,
          labelBn: `${newFieldDefaultW + 2} × ${newFieldDefaultH + 2} ফুট (বড় মাপ)`
        }
      ]
    }));

    // Reset states
    setNewFieldNameEn("");
    setNewFieldNameBn("");
    setNewFieldDefaultW(10);
    setNewFieldDefaultH(12);
    setNewFieldColor("#fee2e2");
    setShowAddNewFieldForm(false);
  };

  const ZONES_MAP = [
    { value: "South-West (Nairutya)", labelBn: "দক্ষিণ-পশ্চিম (নৈঋত কোণ)", x: 0, y: 0, status: "excellent" },
    { value: "South-East (Agneya)", labelBn: "দক্ষিণ-পূর্ব (অগ্নি কোণ)", x: 65, y: 0, status: "excellent" },
    { value: "North-West (Vayavya)", labelBn: "উত্তর-পশ্চিম (বায়ু কোণ)", x: 0, y: 70, status: "good" },
    { value: "North-East (Eshanya)", labelBn: "উত্তর-পূর্ব (ঈশান কোণ)", x: 75, y: 55, status: "excellent" },
    { value: "Center (Brahmasthan)", labelBn: "ব্রহ্মস্থান (মাঝখানে)", x: 25, y: 35, status: "excellent" },
    { value: "West (Varuna)", labelBn: "পশ্চিম দিক (বরুণ)", x: 0, y: 35, status: "good" },
    { value: "East (Aditya)", labelBn: "পূর্ব দিক (আদিত্য)", x: 75, y: 30, status: "excellent" },
    { value: "North (Soma)", labelBn: "উত্তর দিক (সোম)", x: 35, y: 70, status: "good" },
    { value: "South (Yama)", labelBn: "দক্ষিণ দিক (যম)", x: 35, y: 0, status: "neutral" }
  ];

  const getRoomTypeKeyFromId = (roomId: string): string => {
    const found = ROOM_TYPES.find(t => roomId.toLowerCase().includes(t.value.toLowerCase()));
    if (found) return found.value;

    const lowercaseId = roomId.toLowerCase();
    if (lowercaseId.includes("master_bed") || lowercaseId.includes("masterbed")) return "master_bedroom";
    if (lowercaseId.includes("bedroom") || lowercaseId.includes("bed_") || lowercaseId.includes("bed")) return "bedroom";
    if (lowercaseId.includes("study")) return "study_room";
    if (lowercaseId.includes("wash") || lowercaseId.includes("bath") || lowercaseId.includes("toilet")) return "wash_room";
    if (lowercaseId.includes("dining")) return "dining";
    if (lowercaseId.includes("living") || lowercaseId.includes("hall") || lowercaseId.includes("drawing")) return "living";
    if (lowercaseId.includes("stairs") || lowercaseId.includes("stair")) return "stairs";
    if (lowercaseId.includes("entrance") || lowercaseId.includes("gate") || lowercaseId.includes("verandah")) return "entrance";
    if (lowercaseId.includes("garage")) return "garage";
    if (lowercaseId.includes("gardening") || lowercaseId.includes("garden") || lowercaseId.includes("lawn")) return "gardening";
    if (lowercaseId.includes("balcony")) return "balcony";
    return "bedroom"; // fallback
  };

  // Load translations
  const t = TRANSLATIONS[lang];

  // Handle plot dimension change -> reset/recalculate default setbacks
  useEffect(() => {
    const calculatedSetbacks = calculateSetbacks(plotWidth, plotDepth);
    setSetbacks(calculatedSetbacks);
  }, [plotWidth, plotDepth]);

  // Recalculate everything on input changes
  useEffect(() => {
    let activeRooms = [...rooms];

    if (!isCustomized) {
      const generatedRooms = generateStructuralLayout(
        plotWidth,
        plotDepth,
        setbacks,
        bhk,
        facing
      );
      activeRooms = generatedRooms;
      setRooms(generatedRooms);
      setFurnitureItems(getInitialFurnitureForRooms(generatedRooms));
      
      // Automatically select the master bedroom initially
      const master = generatedRooms.find(r => r.id === "master_bed");
      if (master) {
        setSelectedRoom(master);
      } else if (generatedRooms.length > 0) {
        setSelectedRoom(generatedRooms[0]);
      }
    }

    const calculatedBudget = estimateMaterialExpenses(
      plotWidth,
      plotDepth,
      setbacks,
      floors,
      baseRate
    );

    if (isCustomized && activeRooms.length > 0) {
      const netCarpetArea = activeRooms.reduce((acc, room) => acc + (room.actualW * room.actualH), 0);
      const customBuiltUp = Math.round(netCarpetArea * 1.22); // 22% wall/corridor allowance
      
      // Re-run materials estimator with specific custom built-up area override
      const rawTotalCost = customBuiltUp * baseRate;
      const cementBags = Math.round(customBuiltUp * 0.4);
      const steelKg = Math.round(customBuiltUp * 4.1);
      const bricksCount = Math.round(customBuiltUp * 19.5);
      const sandCft = Math.round(customBuiltUp * 1.8);
      const aggCft = Math.round(customBuiltUp * 1.35);
      const footprintArea = Math.round(customBuiltUp / (floors === "duplex" ? 2 : 1));
      const foundationCost = Math.round(footprintArea * 170);
      const laborCost = Math.round(rawTotalCost * 0.28);
      
      const greySubtotal = (cementBags*430) + (steelKg*68) + (bricksCount*9) + (sandCft*62) + (aggCft*78) + foundationCost + laborCost;
      const totalGreyBudget = Math.round(rawTotalCost * 0.58);
      const factor = totalGreyBudget / (greySubtotal || 1);
      
      const resBudget = { ...calculatedBudget };
      resBudget.builtUpArea = customBuiltUp;
      resBudget.footprintArea = footprintArea;
      resBudget.totalCost = rawTotalCost;
      resBudget.greyStructureTotal = totalGreyBudget;
      resBudget.finishingWorksTotal = rawTotalCost - totalGreyBudget;
      
      // Override details in breakdowns
      resBudget.greyBreakdown = resBudget.greyBreakdown.map(item => {
        let cost = item.cost;
        let qtyStrEn = item.quantityStrEn;
        let qtyStrBn = item.quantityStrBn;
        if (item.id === "cement") {
          cost = Math.round(cementBags * 430 * factor);
          qtyStrEn = `${cementBags.toLocaleString()} bags`;
          qtyStrBn = `${cementBags.toLocaleString()} বস্তা (ব্যাগ)`;
        } else if (item.id === "steel") {
          cost = Math.round(steelKg * 68 * factor);
          qtyStrEn = `${(steelKg / 1000).toFixed(2)} Metric Tons`;
          qtyStrBn = `${(steelKg / 1000).toFixed(2)} মেট্রিক টন`;
        } else if (item.id === "bricks") {
          cost = Math.round(bricksCount * 9 * factor);
          qtyStrEn = `${bricksCount.toLocaleString()} units`;
          qtyStrBn = `${bricksCount.toLocaleString()} টি ইট`;
        } else if (item.id === "sand") {
          cost = Math.round(sandCft * 62 * factor);
          qtyStrEn = `${sandCft.toLocaleString()} cft`;
          qtyStrBn = `${sandCft.toLocaleString()} সেফটি (cft)`;
        } else if (item.id === "aggregate") {
          cost = Math.round(aggCft * 78 * factor);
          qtyStrEn = `${aggCft.toLocaleString()} cft`;
          qtyStrBn = `${aggCft.toLocaleString()} সেফটি (cft)`;
        } else if (item.id === "foundation") {
          cost = Math.round(foundationCost * factor);
        } else if (item.id === "labor_structural") {
          cost = Math.round(laborCost * factor);
        }
        return {
          ...item,
          cost,
          quantityStrEn: qtyStrEn,
          quantityStrBn: qtyStrBn,
          percentage: Math.round((cost / rawTotalCost) * 100)
        };
      });
      
      resBudget.finishingBreakdown = resBudget.finishingBreakdown.map(item => {
        let cost = item.cost;
        let qtyStrEn = item.quantityStrEn;
        let qtyStrBn = item.quantityStrBn;
        const totalFinishingBudget = rawTotalCost - totalGreyBudget;
        if (item.id === "flooring") {
          cost = Math.round(totalFinishingBudget * 0.28);
          qtyStrEn = `Approx ${(customBuiltUp * 1.15).toFixed(0)} sq.ft`;
          qtyStrBn = `প্রায় ${(customBuiltUp * 1.15).toFixed(0)} বর্গফুট`;
        } else if (item.id === "plumbing") {
          cost = Math.round(totalFinishingBudget * 0.20);
        } else if (item.id === "electrical") {
          cost = Math.round(totalFinishingBudget * 0.22);
        } else if (item.id === "doors_windows") {
          cost = Math.round(totalFinishingBudget * 0.18);
        } else if (item.id === "painting") {
          cost = Math.round(totalFinishingBudget * 0.12);
        }
        return {
          ...item,
          cost,
          quantityStrEn: qtyStrEn,
          quantityStrBn: qtyStrBn,
          percentage: Math.round((cost / rawTotalCost) * 100)
        };
      });
      
      setBudget(resBudget);
    } else {
      setBudget(calculatedBudget);
    }
    
    // Reset advice since parameters changed
    setConsultationText("");
  }, [plotWidth, plotDepth, bhk, floors, facing, baseRate, selectedStateIndex, selectedDistrictIndex, isCustomized, rooms.length, setbacks]);

  // Handle Preset changes
  const applyPreset = (w: number, d: number) => {
    setPlotWidth(w);
    setPlotDepth(d);
  };

  // Sync state-district defaults
  const handleStateChange = (stateIndex: number) => {
    setSelectedStateIndex(stateIndex);
    setSelectedDistrictIndex(0);
    const firstDistrict = INDIAN_STATES[stateIndex].districts[0];
    if (firstDistrict) {
      setBaseRate(firstDistrict.defaultRate);
    }
  };

  const handleDistrictChange = (districtIndex: number) => {
    setSelectedDistrictIndex(districtIndex);
    const dist = currentState.districts[districtIndex];
    if (dist) {
      setBaseRate(dist.defaultRate);
    }
  };

  // Perform Gemini Consultation API fetch
  const handleGetExpertAdvice = async () => {
    if (!budget) return;
    setIsLoadingConsultation(true);
    setConsultationText("");

    try {
      const response = await fetch("/api/gemini/expert-advice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phase: activePhase,
          state: currentState.nameEn,
          district: currentDistrict.name,
          dimensions: {
            width: plotWidth,
            depth: plotDepth
          },
          bhk,
          facing,
          floors,
          setbacks,
          budgetSummary: {
            builtUpArea: budget.builtUpArea,
            totalCost: budget.totalCost,
            rate: baseRate
          },
          roomDetails: rooms.map(r => ({
            name: r.nameEn,
            actualW: r.actualW,
            actualH: r.actualH,
            vastuZone: r.vastuZone
          })),
          language: lang
        })
      });

      const data = await response.json();
      if (response.ok) {
        setConsultationText(data.advice || "No consultation generated.");
      } else {
        setConsultationText(`Error: ${data.error || "Failed to communicate with server."}`);
      }
    } catch (err: any) {
      console.error(err);
      setConsultationText(`Failed to connect to backend: ${err.message || err}`);
    } finally {
      setIsLoadingConsultation(false);
    }
  };

  const handleUpdateSelectedRoom = (updates: Partial<RoomLayout>) => {
    if (!selectedRoom) return;
    setIsCustomized(true);
    
    const updatedRoom = { ...selectedRoom, ...updates };
    
    const buildableW = Math.max(10, plotWidth - 2 * setbacks.side);
    const buildableH = Math.max(10, plotDepth - setbacks.front - setbacks.rear);
    
    if (updates.actualW !== undefined) {
      updatedRoom.width = Math.min(100, Math.max(10, (updates.actualW / buildableW) * 100));
    }
    if (updates.actualH !== undefined) {
      updatedRoom.height = Math.min(100, Math.max(10, (updates.actualH / buildableH) * 100));
    }
    
    setRooms(prev => prev.map(r => r.id === selectedRoom.id ? updatedRoom : r));
    setSelectedRoom(updatedRoom);
  };

  const handleDeleteRoom = (roomId: string) => {
    setIsCustomized(true);
    const roomToDelete = rooms.find(r => r.id === roomId);
    const updated = rooms.filter(r => r.id !== roomId);
    setRooms(updated);
    if (selectedRoom?.id === roomId) {
      if (updated.length > 0) {
        setSelectedRoom(updated[0]);
      } else {
        setSelectedRoom(null);
      }
    }
    if (roomToDelete) {
      setFurnitureItems(prev => prev.filter(f => {
        const belongsToId = f.id.toLowerCase().includes(roomId.toLowerCase());
        const isSpatiallyInside = 
          f.x >= roomToDelete.x && f.x <= roomToDelete.x + roomToDelete.width &&
          f.y >= roomToDelete.y && f.y <= roomToDelete.y + roomToDelete.height;
        return !belongsToId && !isSpatiallyInside;
      }));
    }
  };

  const handleUpdateRoomQty = (room: RoomLayout, newQty: number) => {
    setIsCustomized(true);
    const roomTypeKey = getRoomTypeKeyFromId(room.id);
    const roomsOfType = rooms.filter(r => getRoomTypeKeyFromId(r.id) === roomTypeKey);
    const currentQty = roomsOfType.length;
    
    if (newQty === currentQty) return;
    
    if (newQty < currentQty) {
      // Remove the latest one of this type
      const toRemove = roomsOfType[roomsOfType.length - 1];
      const updated = rooms.filter(r => r.id !== toRemove.id);
      setRooms(updated);
      if (selectedRoom?.id === toRemove.id) {
        if (updated.length > 0) {
          setSelectedRoom(updated[0]);
        } else {
          setSelectedRoom(null);
        }
      }
      setFurnitureItems(prev => prev.filter(f => {
        const belongsToId = f.id.toLowerCase().includes(toRemove.id.toLowerCase());
        const isSpatiallyInside = 
          f.x >= toRemove.x && f.x <= toRemove.x + toRemove.width &&
          f.y >= toRemove.y && f.y <= toRemove.y + toRemove.height;
        return !belongsToId && !isSpatiallyInside;
      }));
    } else if (newQty > currentQty) {
      // Add a new similar one of this type
      const template = ROOM_TYPES.find(r => r.value === roomTypeKey) || ROOM_TYPES[0];
      const defaultZoneValue = ({
        master_bedroom: "South-West (Nairutya)",
        bedroom: "North-West (Vayavya)",
        bedroom_attached: "North-West (Vayavya)",
        study_room: "West (Varuna)",
        wash_room: "North-West (Vayavya)",
        dining: "Center (Brahmasthan)",
        living: "East (Aditya)",
        stairs: "South-West (Nairutya)",
        entrance: "North-East (Eshanya)",
        garage: "North-West (Vayavya)",
        gardening: "North-East (Eshanya)",
        balcony: "North-East (Eshanya)",
      } as Record<string, string>)[roomTypeKey] || "North-West (Vayavya)";

      const zoneInfo = ZONES_MAP.find(z => z.value === defaultZoneValue) || ZONES_MAP[0];
      
      const offsetCount = roomsOfType.length;
      const offsetX = Math.min(15, offsetCount * 4);
      const offsetY = Math.min(15, offsetCount * 4);

      const buildableW = Math.max(10, plotWidth - 2 * setbacks.side);
      const buildableH = Math.max(10, plotDepth - setbacks.front - setbacks.rear);
      
      const percentageW = Math.min(100, Math.max(10, (room.actualW / buildableW) * 100));
      const percentageH = Math.min(100, Math.max(10, (room.actualH / buildableH) * 100));

      const newRoom: RoomLayout = {
        id: `custom_${roomTypeKey}_${Date.now()}`,
        nameEn: `${template.labelEn} ${offsetCount + 1}`,
        nameBn: `${template.labelBn} ${offsetCount + 1}`,
        x: Math.min(85, Math.max(5, zoneInfo.x + offsetX)),
        y: Math.min(85, Math.max(5, zoneInfo.y + offsetY)),
        width: percentageW,
        height: percentageH,
        actualW: room.actualW,
        actualH: room.actualH,
        vastuZone: zoneInfo.value,
        vastuStatus: zoneInfo.status as any,
        colorHex: template.color,
        purpose: template.descEn,
        purposeBn: template.descBn
      };
      
      setRooms(prev => [...prev, newRoom]);
      setSelectedRoom(newRoom);
    }
  };

  const handleAddFurniture = (type: "bed" | "wardrobe" | "dining_table" | "chair" | "basin" | "sofa" | "toilet" | "tv_cabinet" | "plant" | "coffee_table") => {
    setIsCustomized(true);
    let spawnX = 50;
    let spawnY = 50;
    
    if (selectedRoom) {
      spawnX = selectedRoom.x + selectedRoom.width / 2;
      spawnY = selectedRoom.y + selectedRoom.height / 2;
    } else if (rooms.length > 0) {
      // Spawn in center of first room as fallback
      spawnX = rooms[0].x + rooms[0].width / 2;
      spawnY = rooms[0].y + rooms[0].height / 2;
    }

    const nameEnMap: Record<string, string> = {
      bed: "Comfort Double Bed",
      wardrobe: "Modern Wardrobe",
      dining_table: "6-Seat Dining Table",
      chair: "Ergonomic Office Chair",
      basin: "Ceramic Washbasin",
      sofa: "Luxury Sectional Sofa",
      toilet: "Toilet Commode",
      tv_cabinet: "Smart TV Console",
      plant: "Potted Indoor Plant",
      coffee_table: "Modern Coffee Table"
    };

    const nameBnMap: Record<string, string> = {
      bed: "আরামদায়ক ডাবল খাট",
      wardrobe: "আধুনিক ওয়্যারড্রোব",
      dining_table: "৬-আসন ডাইনিং টেবিল",
      chair: "আরামদায়ক চেয়ার",
      basin: "সিরামিক ওয়াশবেসিন",
      sofa: "বিলাসবহুল সোফা",
      toilet: "টয়লেট কমোড",
      tv_cabinet: "স্মার্ট টিভি কনসোল",
      plant: "ইনডোর টব",
      coffee_table: "আধুনিক কফি টেবিল"
    };

    const newItem: FurnitureItem = {
      id: `f_${type}_${Date.now()}`,
      type,
      x: Math.min(95, Math.max(5, spawnX)),
      y: Math.min(95, Math.max(5, spawnY)),
      rotation: 0,
      nameEn: nameEnMap[type] || "Custom Furniture",
      nameBn: nameBnMap[type] || "আসবাবপত্র"
    };

    setFurnitureItems(prev => [...prev, newItem]);
    setSelectedFurnitureId(newItem.id);
  };

  const handleRoomPointerDown = (e: PointerEvent, room: RoomLayout) => {
    if (editorTab === "draw") return;
    setIsCustomized(true);
    setSelectedRoom(room);
    setSelectedFurnitureId(null);

    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);

    setDraggingRoomId(room.id);
    setDragStartPos({ x: e.clientX, y: e.clientY });
    setDragStartRoomCoords({ x: room.x, y: room.y });

    const itemsInside = furnitureItems.filter(f => 
      f.x >= room.x && f.x <= room.x + room.width &&
      f.y >= room.y && f.y <= room.y + room.height
    );
    setDragStartFurnitureCoords(itemsInside.map(f => ({ id: f.id, x: f.x, y: f.y })));

    e.stopPropagation();
  };

  const handleRoomPointerMove = (e: PointerEvent, room: RoomLayout) => {
    if (draggingRoomId !== room.id || !dragStartPos || !dragStartRoomCoords) return;

    const container = document.getElementById("layout-canvas-container");
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const dx = e.clientX - dragStartPos.x;
    const dy = e.clientY - dragStartPos.y;

    const bWidthPercent = 100 - (setbacks.side * 2 / plotWidth) * 100;
    const bHeightPercent = 100 - ((setbacks.front + setbacks.rear) / plotDepth) * 100;
    const bWidthPixels = rect.width * (bWidthPercent / 100);
    const bHeightPixels = rect.height * (bHeightPercent / 100);

    const dPercentX = (dx / bWidthPixels) * 100;
    const dPercentY = (dy / bHeightPixels) * 100;

    const newX = Math.min(100 - room.width, Math.max(0, dragStartRoomCoords.x + dPercentX));
    const newY = Math.min(100 - room.height, Math.max(0, dragStartRoomCoords.y + dPercentY));

    const actualDx = newX - dragStartRoomCoords.x;
    const actualDy = newY - dragStartRoomCoords.y;

    setRooms(prev => prev.map(r => r.id === room.id ? { ...r, x: newX, y: newY } : r));
    setSelectedRoom(prev => prev && prev.id === room.id ? { ...prev, x: newX, y: newY } : prev);

    setFurnitureItems(prev => prev.map(f => {
      const match = dragStartFurnitureCoords.find(record => record.id === f.id);
      if (match) {
        return {
          ...f,
          x: Math.min(98, Math.max(2, match.x + actualDx)),
          y: Math.min(98, Math.max(2, match.y + actualDy))
        };
      }
      return f;
    }));
  };

  const handleRoomPointerUp = (e: PointerEvent, room: RoomLayout) => {
    if (draggingRoomId === room.id) {
      const target = e.currentTarget as HTMLElement;
      target.releasePointerCapture(e.pointerId);
      setDraggingRoomId(null);
      setDragStartPos(null);
      setDragStartRoomCoords(null);
      setDragStartFurnitureCoords([]);
    }
  };

  const handleFurniturePointerDown = (e: PointerEvent, item: FurnitureItem) => {
    setIsCustomized(true);
    setSelectedFurnitureId(item.id);
    setSelectedRoom(null);

    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);

    setDraggingFurnitureId(item.id);
    setDragStartFurniturePos({ x: e.clientX, y: e.clientY });
    setDragStartFurnitureCoord({ x: item.x, y: item.y });
    e.stopPropagation();
  };

  const handleFurniturePointerMove = (e: PointerEvent, item: FurnitureItem) => {
    if (draggingFurnitureId !== item.id || !dragStartFurniturePos || !dragStartFurnitureCoord) return;

    const container = document.getElementById("layout-canvas-container");
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const dx = e.clientX - dragStartFurniturePos.x;
    const dy = e.clientY - dragStartFurniturePos.y;

    const bWidthPercent = 100 - (setbacks.side * 2 / plotWidth) * 100;
    const bHeightPercent = 100 - ((setbacks.front + setbacks.rear) / plotDepth) * 100;
    const bWidthPixels = rect.width * (bWidthPercent / 100);
    const bHeightPixels = rect.height * (bHeightPercent / 100);

    const dPercentX = (dx / bWidthPixels) * 100;
    const dPercentY = (dy / bHeightPixels) * 100;

    const newX = Math.min(98, Math.max(2, dragStartFurnitureCoord.x + dPercentX));
    const newY = Math.min(98, Math.max(2, dragStartFurnitureCoord.y + dPercentY));

    setFurnitureItems(prev => prev.map(f => f.id === item.id ? { ...f, x: newX, y: newY } : f));
  };

  const handleFurniturePointerUp = (e: PointerEvent, item: FurnitureItem) => {
    if (draggingFurnitureId === item.id) {
      const target = e.currentTarget as HTMLElement;
      target.releasePointerCapture(e.pointerId);
      setDraggingFurnitureId(null);
      setDragStartFurniturePos(null);
      setDragStartFurnitureCoord(null);
    }
  };

  const handleResetToTemplate = () => {
    setIsCustomized(false);
    const calculatedSetbacks = calculateSetbacks(plotWidth, plotDepth);
    const generatedRooms = generateStructuralLayout(
      plotWidth,
      plotDepth,
      calculatedSetbacks,
      bhk,
      facing
    );
    setRooms(generatedRooms);
    setFurnitureItems(getInitialFurnitureForRooms(generatedRooms));
    const master = generatedRooms.find(r => r.id === "master_bed");
    setSelectedRoom(master || generatedRooms[0] || null);
  };

  const handleAddCustomRoom = () => {
    setIsCustomized(true);
    
    const template = ROOM_TYPES.find(r => r.value === customRoomType) || ROOM_TYPES[0];
    const zoneInfo = ZONES_MAP.find(z => z.value === customRoomZone) || ZONES_MAP[0];
    
    const buildableW = Math.max(10, plotWidth - 2 * setbacks.side);
    const buildableH = Math.max(10, plotDepth - setbacks.front - setbacks.rear);
    
    const percentageW = Math.min(100, Math.max(10, (customRoomWidth / buildableW) * 100));
    const percentageH = Math.min(100, Math.max(10, (customRoomHeight / buildableH) * 100));
    
    const newRoom: RoomLayout = {
      id: `custom_${customRoomType}_${Date.now()}`,
      nameEn: template.labelEn,
      nameBn: template.labelBn,
      x: zoneInfo.x,
      y: zoneInfo.y,
      width: percentageW,
      height: percentageH,
      actualW: customRoomWidth,
      actualH: customRoomHeight,
      vastuZone: zoneInfo.value,
      vastuStatus: zoneInfo.status as any,
      colorHex: template.color,
      purpose: template.descEn,
      purposeBn: template.descBn
    };
    
    setRooms(prev => [...prev, newRoom]);
    setSelectedRoom(newRoom);
    setEditorTab("edit");
  };

  const handleQuickAddRoomType = (roomTypeValue: string) => {
    setIsCustomized(true);

    const template = ROOM_TYPES.find(r => r.value === roomTypeValue) || ROOM_TYPES[0];
    
    // Map default vastu zone based on the room type
    const defaultZoneValue = ({
      master_bedroom: "South-West (Nairutya)",
      bedroom: "North-West (Vayavya)",
      bedroom_attached: "North-West (Vayavya)",
      study_room: "West (Varuna)",
      wash_room: "North-West (Vayavya)",
      dining: "Center (Brahmasthan)",
      living: "East (Aditya)",
      stairs: "South-West (Nairutya)",
      entrance: "North-East (Eshanya)",
      garage: "North-West (Vayavya)",
      gardening: "North-East (Eshanya)",
      balcony: "North-East (Eshanya)",
    } as Record<string, string>)[roomTypeValue] || "North-West (Vayavya)";

    const zoneInfo = ZONES_MAP.find(z => z.value === defaultZoneValue) || ZONES_MAP[0];
    
    // Calculate size percentages
    const buildableW = Math.max(10, plotWidth - 2 * setbacks.side);
    const buildableH = Math.max(10, plotDepth - setbacks.front - setbacks.rear);
    
    const percentageW = Math.min(100, Math.max(10, (template.defaultW / buildableW) * 100));
    const percentageH = Math.min(100, Math.max(10, (template.defaultH / buildableH) * 100));
    
    const newRoom: RoomLayout = {
      id: `custom_${roomTypeValue}_${Date.now()}`,
      nameEn: template.labelEn,
      nameBn: template.labelBn,
      x: zoneInfo.x,
      y: zoneInfo.y,
      width: percentageW,
      height: percentageH,
      actualW: template.defaultW,
      actualH: template.defaultH,
      vastuZone: zoneInfo.value,
      vastuStatus: zoneInfo.status as any,
      colorHex: template.color,
      purpose: template.descEn,
      purposeBn: template.descBn
    };
    
    setRooms(prev => [...prev, newRoom]);
    setSelectedRoom(newRoom);
  };

  const getItemCalculationBreakdown = (itemId: string, isGrey: boolean) => {
    if (!budget) return "";
    
    if (isGrey) {
      switch (itemId) {
        case "cement":
          return lang === "bn" 
            ? `• সূত্র (Formula): বিল্ট-আপ এরিয়া (Built-up Area) × ০.৪০ বস্তা/বর্গফুট।\n• আপনার মাপ: ${budget.builtUpArea} বর্গফুট × ০.৪০ = ${Math.round(budget.builtUpArea * 0.4)} বস্তা সিমেন্ট।\n• প্রতি বস্তার বাজার মূল্য: ₹৪৩০।\n• মোট আনুমানিক নির্মাণ গুণক সমন্বয় সহ বাস্তবসম্মত বাজার মূল্য হিসাব করা হয়েছে।`
            : `• Formula: Built-up Area × 0.40 bags per sq.ft.\n• Your calculation: ${budget.builtUpArea} sq.ft × 0.40 = ${Math.round(budget.builtUpArea * 0.4)} bags of cement.\n• Market Rate constant: ₹430 per bag.\n• Multiproc Factor adjusted for dynamic regional labor coefficients.`;
        case "steel":
          return lang === "bn"
            ? `• সূত্র (Formula): বিল্ট-আপ এরিয়া (Built-up Area) × ৪.১০ কেজি/বর্গফুট।\n• আপনার মাপ: ${budget.builtUpArea} বর্গফুট × ৪.১০ = ${Math.round(budget.builtUpArea * 4.1)} কেজি স্টিল রড।\n• বাজারে মানদণ্ড রিবড টিএমটি বার রেট: ₹৬৮/কেজি।\n• মোট টন ও কাস্টম গ্রেড লোহা বরাদ্দ সমন্বয় সহ।`
            : `• Formula: Built-up Area × 4.1 kg per sq.ft.\n• Your calculation: ${budget.builtUpArea} sq.ft × 4.1 = ${Math.round(budget.builtUpArea * 4.1)} kg of high-tensile TMT steel.\n• Market Rate constant: ₹68 per kg.\n• Proportional structural safety constants applied.`;
        case "bricks":
          return lang === "bn"
            ? `• সূত্র (Formula): বিল্ট-আপ এরিয়া (Built-up Area) × ১৯.৫০ টি ইট/বর্গফুট।\n• আপনার মাপ: ${budget.builtUpArea} বর্গফুট × ১৯.৫০ = ${Math.round(budget.builtUpArea * 19.5).toLocaleString()} টি লাল পোড়ামাটির ইট।\n• প্রথম শ্রেণীর মাটির ইটের রেট: ₹৯/টি।\n• মসলা গাঁথুনি এবং ৫% অপচয় (Wastage) অন্তর্ভুক্ত।`
            : `• Formula: Built-up Area × 19.5 bricks per sq.ft.\n• Your calculation: ${budget.builtUpArea} sq.ft × 19.5 = ${Math.round(budget.builtUpArea * 19.5).toLocaleString()} clay bricks.\n• Market Rate constant: ₹9 per brick.\n• Includes 5% structural breakage and wastage allowance.`;
        case "sand":
          return lang === "bn"
            ? `• সূত্র (Formula): বিল্ট-আপ এরিয়া (Built-up Area) × ১.৮০ cft/বর্গফুট।\n• আপনার মাপ: ${budget.builtUpArea} বর্গফুট × ১.৮০ = ${Math.round(budget.builtUpArea * 1.8).toLocaleString()} সেফটি মোটা বালি।\n• ভালো নদীর বালির স্ট্যান্ডার্ড রেট: ₹৬২/cft।\n• প্লাস্টারিং ও কংক্রিট ঢালাইয়ের অনুপাত সমন্বয় করা।`
            : `• Formula: Built-up Area × 1.80 cft per sq.ft.\n• Your calculation: ${budget.builtUpArea} sq.ft × 1.80 = ${Math.round(budget.builtUpArea * 1.8).toLocaleString()} cft course sand.\n• Market Rate constant: ₹62 per cft.\n• Covers foundation mortar and wall masonry ratios.`;
        case "aggregate":
          return lang === "bn"
            ? `• সূত্র (Formula): বিল্ট-আপ এরিয়া (Built-up Area) × ১.৩৫ cft/বর্গফুট।\n• আপনার মাপ: ${budget.builtUpArea} বর্গফুট × ১.৩৫ = ${Math.round(budget.builtUpArea * 1.35).toLocaleString()} সেফটি কংক্রিট সুরকি/পাথর কুচি।\n• কালো বেসাল্ট মেটাল পাথর রেট: ₹৭৮/cft।`
            : `• Formula: Built-up Area × 1.35 cft per sq.ft.\n• Your calculation: ${budget.builtUpArea} sq.ft × 1.35 = ${Math.round(budget.builtUpArea * 1.35).toLocaleString()} cft aggregates.\n• Market Rate constant: ₹78 per cft.\n• Calibrated for RCC structural beam-vibrator grades.`;
        case "foundation":
          return lang === "bn"
            ? `• সূত্র (Formula): ফুটপ্রিন্ট ফ্লোর এরিয়া (Footprint Area) × ₹১৭০/বর্গফুট।\n• আপনার নিচতলার মাপ: ${budget.footprintArea} বর্গফুট × ₹১৭০ রেট = ₹${(budget.footprintArea * 170).toLocaleString("en-IN")} ভিত্তি খনন ও আরসিসি ফুটিং খরচ।`
            : `• Formula: Footprint Ground Area × ₹170 per sq.ft.\n• Ground Excavation area: ${budget.footprintArea} sq.ft × ₹170 = ₹${(budget.footprintArea * 170).toLocaleString("en-IN")} foundation & sub-grade structure cost.\n• Assumes standard medium soil bearing density.`;
        case "labor_structural":
          return lang === "bn"
            ? `• সূত্র (Formula): মোট গ্রে স্ট্রাকচার বাজেটের প্রায় ২৮% বরাদ্দ মজুরি হিসেবে।\n• মোট খসড়া খরচ: ₹${Math.round(budget.totalCost * 0.28).toLocaleString("en-IN")} শ্রমিক ঠিকাদার ও সহকারী টিমকে পরিশোধযোগ্য বিল।`
            : `• Formula: Allocates ~28% of total structural grey cost exclusively to labor hire.\n• Estimate: ₹${Math.round(budget.totalCost * 0.28).toLocaleString("en-IN")} total payment for rod benders, masonry, and supervisors.`;
        default:
          return "";
      }
    } else {
      switch (itemId) {
        case "flooring":
          return lang === "bn"
            ? `• সূত্র (Formula): মোট বিল্ট-আপ এরিয়ার উপর ১৫% অতিরিক্ত অংশ ধরে মেঝের পরিমাপ হিসাব।\n• মেঝের এলাকা: প্রায় ${(budget.builtUpArea * 1.15).toFixed(0)} বর্গফুট ডবল-চার্জড ভিট্রিফাইড টাইলস।\n• ফিনিশিং বাজেটের ২৮% flooring এ বরাদ্দ।`
            : `• Formula: Calculates net built-up area plus 15% wall alignment offset.\n• Estimated tile surface: ${(budget.builtUpArea * 1.15).toFixed(0)} sq.ft.\n• Flooring represents 28% of the finishing budget allocation.`;
        case "plumbing":
          return lang === "bn"
            ? `• সূত্র (Formula): বাথরুম, স্যানিটারী ফিটিংস ও পানি লাইনের পাইপের জন্য মোট ফিনিশিং কাজের বাজেটের ২০% বরাদ্দ।\n• আনুমানিক বরাদ্দ: ₹${Math.round(budget.finishingWorksTotal * 0.2).toLocaleString("en-IN")} আধুনিক কল, শাওয়ার ও ফিটিংস এর ক্ষেত্রে।`
            : `• Formula: Allocates 20% of the interior finishing budget block for plumbing & drainage.\n• Allocated Budget: ₹${Math.round(budget.finishingWorksTotal * 0.2).toLocaleString("en-IN")}.\n• Covers sanitary CPVC pipes and ceramic vitreous ware.`;
        case "electrical":
          return lang === "bn"
            ? `• সূত্র (Formula): পুরো ঘরের ভিতর কনসিল্ড কপার ওয়্যারিং, ডিস্ট্রিবিউশন বক্স ও আধুনিক সুইচের জন্য ফিনিশিং বাজেটের ২২% বরাদ্দ।\n• অনুমিত সুইচরুম খরচ: ₹${Math.round(budget.finishingWorksTotal * 0.22).toLocaleString("en-IN")}.`
            : `• Formula: Standard 22% of finishing work allocated to electrification and panels.\n• Est. Cost: ₹${Math.round(budget.finishingWorksTotal * 0.22).toLocaleString("en-IN")}.\n• Sourced from safety wire diameter formulas and distribution breakers.`;
        case "doors_windows":
          return lang === "bn"
            ? `• সূত্র (Formula): শাল কাঠের দরজা ফ্রেম, ফ্ল্যাশ ডোর লিফ এবং ইউপিভিসি স্লাইডিং জানালার মোট খরচ ফিনিশিং বাজেটের ১৮% হিসাবে নির্ধারিত হয়েছে।`
            : `• Formula: 18% of finishing work allocated to door frames, laminated shutters, and glass windows.\n• Est. Cost: ₹${Math.round(budget.finishingWorksTotal * 0.18).toLocaleString("en-IN")}.`;
        case "painting":
          return lang === "bn"
            ? `• সূত্র (Formula): পুট্টি বেইজ, প্রাইমার কোট এবং বার্নিশের দুই কোট এশিয়ান ইমালশন কালারের জন্য ফিনিশিং বাজেটের ১২% বরাদ্দ।\n• পেইন্টিং বরাদ্দ: ₹${Math.round(budget.finishingWorksTotal * 0.12).toLocaleString("en-IN")}.`
            : `• Formula: 12% of finishing budget blocks assigned to wall preparation and two coats of acrylic emulsion.\n• Est. Painting Cost: ₹${Math.round(budget.finishingWorksTotal * 0.12).toLocaleString("en-IN")}.`;
        default:
          return "";
      }
    }
  };

  // Define descriptive prompts based on architectural selections
  const exteriorPromptText = `A premium architectural 3D rendering of a Modern Indian ${floors === "duplex" ? "Duplex Villa" : "Luxury Bungalow"} on a ${plotWidth}ft x ${plotDepth}ft plot. Built-up area is ${budget?.builtUpArea || 0} sq ft facing ${facing}, showcasing an elegant sleek front elevation with premium glass balconies, textured wood panel accents, robust steel trims, and an exquisite marble entrance verandah. The landscaping features native tropical plants, soft warm golden hour spotlights, and a modern glass water water cascade, capturing the liquid glass reflection, photorealistic, Unreal Engine 5 render, high contrast detail, 4k.`;

  const interiorPromptText = `A hyper-realistic premium interior visualization of the ${selectedRoom ? (selectedRoom.nameEn) : "interior spaces"} inside a modern custom home in India. High ceilings of 11ft with concealed ambient warm linear LED strips, double glazed sliding floor-to-ceiling glass doors opening onto an lush emerald garden. The furniture layout of this ${selectedRoom ? selectedRoom.vastuZone : "Brahmasthan"} zone is optimized for flow, displaying elegant Italian marble floors, soft premium velvet linens, custom brass fixtures, structural floating staircases under a stunning spectrum rainbow glass skylight casting dramatic color beams, photorealistic.`;

  const copyToClipboard = (text: string, isExterior: boolean) => {
    navigator.clipboard.writeText(text);
    if (isExterior) {
      setCopiedExterior(true);
      setTimeout(() => setCopiedExterior(false), 2000);
    } else {
      setCopiedInterior(true);
      setTimeout(() => setCopiedInterior(false), 2000);
    }
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"} flex flex-col font-sans transition-all duration-300 relative overflow-x-hidden selection:bg-teal-500 selection:text-white`}>
      
      {/* Interactive Soft Ambient Background Blob */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-teal-200/20 via-pink-100/15 to-emerald-200/20 blur-[130px] -translate-x-1/2 pointer-events-none z-0" />
      <div className="absolute top-3/4 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-pink-100/10 via-teal-200/20 to-indigo-100/15 blur-[150px] translate-x-1/2 pointer-events-none z-0" />

      {/* Header Panel */}
      <header className={`relative w-full z-20 backdrop-blur-md ${theme === "dark" ? "bg-slate-900/80 border-b border-slate-800" : "bg-white/75 border-b border-slate-200/80"} sticky top-0 px-4 py-3.5 sm:px-8 shadow-sm transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-teal-400 via-emerald-400 to-indigo-500 p-[1px]">
              <div className="bg-white dark:bg-slate-900 rounded-[11px] p-2">
                <Home className="w-6 h-6 text-teal-600 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-teal-700 via-emerald-600 to-indigo-700 bg-clip-text text-transparent">
                  {t.appName}
                </h1>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700">
                  NBC India
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                {t.appSub}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 text-xs font-extrabold ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-750 shadow-md"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs"
              }`}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>{lang === "bn" ? "লাইট মোড" : "Light"}</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span>{lang === "bn" ? "ডার্ক মোড" : "Dark"}</span>
                </>
              )}
            </button>

            {/* Language Toggle with Light Glow */}
            <div className="relative p-[1px] bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700">
              <div className="flex items-center bg-slate-50 dark:bg-slate-900 rounded-[7px] p-0.5 text-xs font-semibold">
                <button
                  id="toggle-lang-bn"
                  onClick={() => setLang("bn")}
                  className={`px-4 py-1.5 rounded-md transition-all cursor-pointer ${
                    lang === "bn"
                      ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  বাংলা
                </button>
                <button
                  id="toggle-lang-en"
                  onClick={() => setLang("en")}
                  className={`px-4 py-1.5 rounded-md transition-all cursor-pointer ${
                    lang === "en"
                      ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  English
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body Grid */}
      <main className="relative flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 z-10">
        
        {/* Step Navigation Page Selector Panel */}
        <div className="col-span-12 select-none mb-2">
          {/* Main 5-Step Progress Header */}
          <div className="flex flex-col gap-3 border border-indigo-100/80 bg-white/60 backdrop-blur-md p-4 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-500 via-emerald-400 to-indigo-500" />
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center border border-teal-100 shrink-0">
                <Sparkles className="w-4 h-4 text-teal-600 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-800">
                  {lang === "bn" ? "প্রোপার্টি ডিজাইন স্টুডিও" : "AI Property Studio"}
                </p>
                <p className="text-[10.5px] font-semibold text-slate-500">
                  {lang === "bn" 
                    ? "আপনার জমির মাপ দিন এবং ৫টি ধাপের মাধ্যমে পেয়ে যান এআই ব্লুপ্রিন্ট, খরচ ও ইন্টারিয়র গাইড।"
                    : "Actionable 2D architectural CAD, 3D visualizations, material receipts, and interior layouts."}
                </p>
              </div>
            </div>

            {/* Step navigation tabs (1 to 6) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
              {[1, 2, 3, 4, 5, 6].map((phNum) => {
                const isActive = activePhase === phNum;
                const phTitle = (t as any)[`phase${phNum}`];
                const phDesc = (t as any)[`phase${phNum}Desc`];
                let IconComp = MapPin;
                if (phNum === 2) IconComp = Compass;
                if (phNum === 3) IconComp = Sparkles;
                if (phNum === 4) IconComp = Calculator;
                if (phNum === 5) IconComp = Palette;
                if (phNum === 6) IconComp = Paintbrush;

                return (
                  <button
                    key={phNum}
                    onClick={() => {
                      setActivePhase(phNum as any);
                      scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`flex-1 min-w-[150px] lg:min-w-0 rounded-xl text-left p-3 transition-all relative border outline-none overflow-hidden ${
                      isActive 
                        ? "bg-gradient-to-br from-teal-50/70 to-emerald-50/70 border-teal-200 shadow-sm" 
                        : "bg-white/50 hover:bg-slate-50 text-slate-500 hover:text-slate-800 border-slate-100"
                    } cursor-pointer`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ${
                        isActive 
                          ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-sm" 
                          : "bg-slate-200 text-slate-500"
                      }`}>
                        {phNum}
                      </span>
                      <IconComp className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-teal-600 animate-pulse" : "text-slate-400"}`} />
                      <span className={`text-xs font-bold truncate ${isActive ? "text-teal-800 font-extrabold" : "text-slate-600"}`}>
                        {phTitle}
                      </span>
                    </div>
                    <span className="block text-[10px] text-slate-400 font-semibold truncate pl-7 leading-tight">
                      {phDesc}
                    </span>
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-500 via-emerald-500 to-indigo-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* TAB 1: Plot Configuration */}
        {activePhase === 1 && (
          <div className="col-span-12 grid grid-cols-1 xl:grid-cols-12 gap-8 animate-fade-in w-full">
            
            {/* Left Column of Page 1 (Box 1) */}
            <div className="xl:col-span-7 flex flex-col gap-6">
              
              {/* Box 1: Location & Configuration */}
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-md relative overflow-hidden group">
            {/* High-quality highlight overlay */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            <h2 className="text-lg font-bold text-teal-700 flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-teal-600" />
              {t.plotSizeTitle}
            </h2>

            <div className="space-y-4">
              {/* Dropdown 1: Country - FIXED to India */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  {t.country}
                </label>
                <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm flex items-center justify-between text-slate-700 cursor-not-allowed">
                  <span className="flex items-center gap-2 font-semibold text-slate-800">
                    India
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    NBC Standard
                  </span>
                </div>
              </div>

              {/* Dropdown 2 & 3: State & District with Local Info */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    {t.state}
                  </label>
                  <select
                    id="state-select"
                    value={selectedStateIndex}
                    onChange={(e) => handleStateChange(parseInt(e.target.value))}
                    className="w-full bg-white hover:bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none transition-colors shadow-sm"
                  >
                    {INDIAN_STATES.map((st, sIdx) => (
                      <option key={st.nameEn} value={sIdx}>
                        {lang === "bn" ? st.nameBn : st.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    {t.district}
                  </label>
                  <select
                    id="district-select"
                    value={selectedDistrictIndex}
                    onChange={(e) => handleDistrictChange(parseInt(e.target.value))}
                    className="w-full bg-white hover:bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none transition-colors shadow-sm"
                  >
                    {currentState.districts.map((dst, dIdx) => (
                      <option key={dst.name} value={dIdx}>
                        {lang === "bn" ? (DISTRICT_TRANSLATIONS[dst.name] || dst.name) : dst.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dynamic Soil Status Panel */}
              <div className="rounded-xl bg-teal-50/50 border border-teal-100 p-3 text-xs space-y-1.5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-teal-500/5 to-transparent pointer-events-none" />
                <div className="flex items-center gap-1.5 font-bold text-teal-700">
                  <Info className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
                  <span>{t.soilTypeLabel}:</span>
                </div>
                <div className="font-bold text-slate-800 pl-5">
                  {lang === "bn" ? currentDistrict.soilType.bn : currentDistrict.soilType.en}
                </div>
                <p className="text-slate-600 leading-relaxed font-normal pl-5 text-[11px]">
                  {lang === "bn" ? currentDistrict.foundationAdvice.bn : currentDistrict.foundationAdvice.en}
                </p>
              </div>

              {/* Sliders for Width and Depth */}
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                    <span>{t.widthLabel}</span>
                    <span className="text-teal-700 font-mono font-bold text-sm">{plotWidth} ft</span>
                  </div>
                  <input
                    id="plot-width-range"
                    type="range"
                    min="15"
                    max="80"
                    step="1"
                    value={plotWidth}
                    onChange={(e) => setPlotWidth(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg cursor-pointer accent-teal-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                    <span>{t.depthLabel}</span>
                    <span className="text-teal-700 font-mono font-bold text-sm">{plotDepth} ft</span>
                  </div>
                  <input
                    id="plot-depth-range"
                    type="range"
                    min="20"
                    max="120"
                    step="1"
                    value={plotDepth}
                    onChange={(e) => setPlotDepth(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg cursor-pointer accent-teal-600"
                  />
                </div>
              </div>

              {/* Standard presets selector */}
              <div>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {t.presetsTitle}
                </span>
                <div className="grid grid-cols-2 gap-2" id="presets">
                  <button
                    onClick={() => applyPreset(30, 40)}
                    className={`px-3 py-2 text-xs font-bold rounded-xl border text-center transition-all ${
                      plotWidth === 30 && plotDepth === 40
                        ? "bg-teal-50 border-teal-500 text-teal-800 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    30 x 40 <span className="text-[10px] text-slate-500 font-normal">(1,200 sq.ft)</span>
                  </button>
                  <button
                    onClick={() => applyPreset(40, 50)}
                    className={`px-3 py-2 text-xs font-bold rounded-xl border text-center transition-all ${
                      plotWidth === 40 && plotDepth === 50
                        ? "bg-teal-50 border-teal-500 text-teal-800 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    40 x 50 <span className="text-[10px] text-slate-500 font-normal">(2,000 sq.ft)</span>
                  </button>
                  <button
                    onClick={() => applyPreset(40, 60)}
                    className={`px-3 py-2 text-xs font-bold rounded-xl border text-center transition-all ${
                      plotWidth === 40 && plotDepth === 60
                        ? "bg-teal-50 border-teal-500 text-teal-800 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    40 x 60 <span className="text-[10px] text-slate-500 font-normal">(2,400 sq.ft)</span>
                  </button>
                  <button
                    onClick={() => applyPreset(50, 80)}
                    className={`px-3 py-2 text-xs font-bold rounded-xl border text-center transition-all ${
                      plotWidth === 50 && plotDepth === 80
                        ? "bg-teal-50 border-teal-500 text-teal-800 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    50 x 80 <span className="text-[10px] text-slate-500 font-normal">(4,000 sq.ft)</span>
                  </button>
                </div>
              </div>

              {/* BHK configuration controls */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {t.bhkLabel}
                </label>
                <div className="grid grid-cols-5 gap-1.5" id="bhk-select">
                  {["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK"].map((bOption) => (
                    <button
                      key={bOption}
                      onClick={() => setBhk(bOption)}
                      className={`py-1.5 text-xs font-bold rounded-lg border text-center transition-all ${
                        bhk === bOption
                          ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-900 border-teal-500 font-extrabold shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800"
                      }`}
                    >
                      {bOption.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Floors and Facings Selector */}
              <div className="grid grid-cols-2 gap-3.5 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    {t.floorsLabel}
                  </label>
                  <select
                    id="floors-select"
                    value={floors}
                    onChange={(e) => setFloors(e.target.value as "single" | "duplex")}
                    className="w-full bg-white border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none transition-colors shadow-sm"
                  >
                    <option value="single">{t.singleFloor}</option>
                    <option value="duplex">{t.duplexFloor}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    {t.facingLabel}
                  </label>
                  <select
                    id="facing-select"
                    value={facing}
                    onChange={(e) => setFacing(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none transition-colors shadow-sm"
                  >
                    <option value="North">{lang === "bn" ? "উত্তরমুখী (North)" : "North Face"}</option>
                    <option value="South">{lang === "bn" ? "দক্ষিণমুখী (South)" : "South Face"}</option>
                    <option value="East">{lang === "bn" ? "পূর্বমুখী (East)" : "East Face"}</option>
                    <option value="West">{lang === "bn" ? "পশ্চিমমুখী (West)" : "West Face"}</option>
                  </select>
                </div>
              </div>

            </div>
          </div>
          </div> {/* close Left Column xl:col-span-7 */}

          {/* Right Column of Page 1 (Box 2 & Box 3) */}
          <div className="xl:col-span-5 flex flex-col gap-6">

          {/* Box 2: Setbacks Summary Info */}
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm relative overflow-hidden">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between gap-1 mb-4">
              <span className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-600" />
                {t.bylawTitle}
              </span>
              <span className="text-[9px] bg-teal-50 text-teal-850 border border-teal-200 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 select-none">
                {lang === "bn" ? "পরিবর্তনযোগ্য" : "Adjustable"}
              </span>
            </h2>

            <div className="grid grid-cols-3 gap-2 text-center">
              {/* Front setback controller */}
              <div className="bg-slate-50/75 rounded-2xl p-2 sm:p-3 border border-slate-200/80 flex flex-col justify-between items-center group relative shadow-3xs hover:bg-slate-50 transition-colors">
                <span className="block text-[9px] text-slate-500 font-extrabold uppercase tracking-wide leading-tight text-center truncate w-full">{t.frontSetback}</span>
                <div className="my-1.5 text-center">
                  <span className="text-lg font-black text-slate-800 font-mono block leading-none">{setbacks.front} <span className="text-[10px] text-slate-500 font-bold">ft</span></span>
                  <span className="text-[8px] text-slate-400 font-bold">{(setbacks.front * 0.3048).toFixed(1)}m</span>
                </div>
                <div className="flex items-center gap-1 w-full mt-1 justify-center z-10">
                  <button 
                    type="button"
                    onClick={() => {
                      setSetbacks(prev => {
                        const nextFront = Math.max(0, prev.front - 0.5);
                        if (nextFront + prev.rear > plotDepth - 10) return prev;
                        return { ...prev, front: nextFront };
                      });
                    }}
                    className="w-6.5 h-6.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-250 text-slate-800 text-xs font-black flex items-center justify-center cursor-pointer transition shadow-3xs hover:shadow-2xs active:scale-90"
                  >
                    -
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setSetbacks(prev => {
                        const nextFront = Math.min(25, prev.front + 0.5);
                        if (nextFront + prev.rear > plotDepth - 10) return prev;
                        return { ...prev, front: nextFront };
                      });
                    }}
                    className="w-6.5 h-6.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-250 text-slate-800 text-xs font-black flex items-center justify-center cursor-pointer transition shadow-3xs hover:shadow-2xs active:scale-90"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Rear setback controller */}
              <div className="bg-slate-50/75 rounded-2xl p-2 sm:p-3 border border-slate-200/80 flex flex-col justify-between items-center group relative shadow-3xs hover:bg-slate-50 transition-colors">
                <span className="block text-[9px] text-slate-500 font-extrabold uppercase tracking-wide leading-tight text-center truncate w-full">{t.rearSetback}</span>
                <div className="my-1.5 text-center">
                  <span className="text-lg font-black text-slate-800 font-mono block leading-none">{setbacks.rear} <span className="text-[10px] text-slate-500 font-bold">ft</span></span>
                  <span className="text-[8px] text-slate-400 font-bold font-semibold">{(setbacks.rear * 0.3048).toFixed(1)}m</span>
                </div>
                <div className="flex items-center gap-1 w-full mt-1 justify-center z-10">
                  <button 
                    type="button"
                    onClick={() => {
                      setSetbacks(prev => {
                        const nextRear = Math.max(0, prev.rear - 0.5);
                        if (prev.front + nextRear > plotDepth - 10) return prev;
                        return { ...prev, rear: nextRear };
                      });
                    }}
                    className="w-6.5 h-6.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-250 text-slate-800 text-xs font-black flex items-center justify-center cursor-pointer transition shadow-3xs hover:shadow-2xs active:scale-90"
                  >
                    -
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setSetbacks(prev => {
                        const nextRear = Math.min(25, prev.rear + 0.5);
                        if (prev.front + nextRear > plotDepth - 10) return prev;
                        return { ...prev, rear: nextRear };
                      });
                    }}
                    className="w-6.5 h-6.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-250 text-slate-800 text-xs font-black flex items-center justify-center cursor-pointer transition shadow-3xs hover:shadow-2xs active:scale-90"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Side setback controller */}
              <div className="bg-slate-50/75 rounded-2xl p-2 sm:p-3 border border-slate-200/80 flex flex-col justify-between items-center group relative shadow-3xs hover:bg-slate-50 transition-colors">
                <span className="block text-[9px] text-slate-500 font-extrabold uppercase tracking-wide leading-tight text-center truncate w-full">{t.sideSetback}</span>
                <div className="my-1.5 text-center">
                  <span className="text-lg font-black text-slate-800 font-mono block leading-none">{setbacks.side} <span className="text-[10px] text-slate-500 font-bold">ft</span></span>
                  <span className="text-[8px] text-slate-400 font-bold">{(setbacks.side * 0.3048).toFixed(1)}m</span>
                </div>
                <div className="flex items-center gap-1 w-full mt-1 justify-center z-10">
                  <button 
                    type="button"
                    onClick={() => {
                      setSetbacks(prev => {
                        const nextSide = Math.max(0, prev.side - 0.5);
                        if (nextSide * 2 > plotWidth - 10) return prev;
                        return { ...prev, side: nextSide };
                      });
                    }}
                    className="w-6.5 h-6.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-250 text-slate-800 text-xs font-black flex items-center justify-center cursor-pointer transition shadow-3xs hover:shadow-2xs active:scale-90"
                  >
                    -
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setSetbacks(prev => {
                        const nextSide = Math.min(20, prev.side + 0.5);
                        if (nextSide * 2 > plotWidth - 10) return prev;
                        return { ...prev, side: nextSide };
                      });
                    }}
                    className="w-6.5 h-6.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-250 text-slate-800 text-xs font-black flex items-center justify-center cursor-pointer transition shadow-3xs hover:shadow-2xs active:scale-90"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Custom info and reset details */}
            <div className="mt-4 pt-3 border-t border-slate-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-[9px] text-emerald-600 font-black font-sans bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {lang === "bn" ? "✓ রিয়েল-টাইম এডজাস্টমেন্ট অ্যাক্টিভ" : "✓ Real-time direct control"}
              </span>
              <button
                type="button"
                onClick={() => {
                  const calculatedSetbacks = calculateSetbacks(plotWidth, plotDepth);
                  setSetbacks(calculatedSetbacks);
                }}
                className="text-[10px] font-bold text-teal-700 hover:text-teal-900 underline flex items-center gap-1 cursor-pointer transition"
              >
                {lang === "bn" ? "NBC নিয়মে রিসেট" : "Reset to NBC Bylaws"}
              </button>
            </div>

            <div className="mt-3 space-y-2.5 text-xs text-slate-700 bg-slate-50/50 p-3 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">{t.footprintArea}:</span>
                <span className="font-bold font-mono text-slate-800">{budget?.footprintArea.toLocaleString()} sq.ft</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">{t.builtUpArea} {floors === "duplex" ? "(G+1)" : "(G+0)"}:</span>
                <span className="font-bold text-teal-700 font-mono bg-teal-50 px-2 py-0.5 rounded border border-teal-200">{budget?.builtUpArea.toLocaleString()} sq.ft</span>
              </div>
            </div>
          </div>

          </div>

          </div>
        )}

        {/* PAGE 2-5: The 4 sequential phases view (Interactive 2D Floor Plan Canvas, 3D Rendering, Materials, Interior) */}
        {activePhase >= 2 && (
          <section className="col-span-12 flex flex-col gap-6 animate-fade-in" id="phase-blueprint-editor">
            
            {/* Quick Change Land Size Banner for Page 2 */}
            <div className="flex flex-col sm:flex-row items-center justify-between bg-emerald-50 border border-emerald-100 p-3.5 px-4 rounded-2xl gap-3 text-xs shadow-xs relative overflow-hidden font-semibold">
              <div className="absolute top-0 bottom-0 left-0 w-1 bg-emerald-600" />
              <span className="text-slate-600 flex items-center gap-2 font-semibold pl-2">
                <Info className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {lang === "bn" 
                    ? `জমির পরিমাপ বর্তমানে: ${plotWidth} ফুট প্রস্থ × ${plotDepth} ফুট দীর্ঘ। আপনি কি এই পরিমাপ পরিবর্তন করতে চান?` 
                    : `Active Plot Sizing: ${plotWidth}ft frontage × ${plotDepth}ft depth. Need to adjust boundaries?`}
                </span>
              </span>
              <button
                onClick={() => {
                  setActivePhase(1);
                  scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-pointer text-xs font-bold shadow-2xs transition shrink-0 hover:scale-[1.01]"
              >
                <span>{lang === "bn" ? "← জমির মাপ এডিট করুন (Phase 1)" : "← Edit land & district (Phase 1)"}</span>
              </button>
            </div>

            {/* Phase Container Panel */}
            <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm relative min-h-[500px] flex flex-col justify-between">
              <div className="absolute top-0 left-0 right-0 h-[100px] bg-gradient-to-b from-slate-50 to-transparent pointer-events-none" />

              <AnimatePresence mode="wait">
              {/* PHASE 2: STRUCTURAL LAYOUT GENERATION */}
              {activePhase === 2 && (
                <motion.div
                  key="phase2"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-6 flex-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start gap-4 flex-wrap">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                          <Columns className="w-5 h-5 text-teal-600" />
                          {t.blueprintHeading}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-normal mt-1">
                          {t.blueprintSub}
                        </p>
                      </div>

                      {/* Duplex Floor Selector if duplex represents */}
                      {floors === "duplex" && (
                        <div className="bg-slate-100 border border-slate-200 rounded-xl p-1 flex text-xs font-bold shadow-sm">
                          <button
                            onClick={() => setActiveFloorView(0)}
                            className={`px-3 py-1.5 rounded-lg transition-all ${
                              activeFloorView === 0
                                ? "bg-white text-teal-700 shadow-sm border border-slate-200"
                                : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            {lang === "bn" ? "নিচ তলা (Ground Floor)" : "Ground Floor"}
                          </button>
                          <button
                            onClick={() => setActiveFloorView(1)}
                            className={`px-3 py-1.5 rounded-lg transition-all ${
                              activeFloorView === 1
                                ? "bg-white text-teal-700 shadow-sm border border-slate-200"
                                : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            {lang === "bn" ? "দোতলা (First Floor)" : "First Floor"}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
                      
                      {/* Interactive Visual Blueprint Grid Canvas (SVG Based, Highly Scalable) */}
                      <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center items-center bg-slate-50 rounded-2xl border border-slate-200 p-4 pt-36 sm:pt-32 md:p-8 md:pt-32 xl:p-10 xl:pt-36 relative min-h-[540px] md:min-h-[640px] shadow-inner overflow-hidden">
                        
                        {/* Blueprint grid pattern background */}
                        <div className="absolute inset-0 opacity-[0.08] pointer-events-none" 
                             style={{backgroundImage: 'radial-gradient(circle, #475569 1.5px, transparent 1.5px)', backgroundSize: '16px 16px'}} />

                        {/* Live Statistical Overlay */}
                        {(() => {
                          const buildableWidth = Math.max(0, plotWidth - setbacks.side * 2);
                          const buildableDepth = Math.max(0, plotDepth - setbacks.front - setbacks.rear);
                          const buildableArea = Math.round(buildableWidth * buildableDepth);

                          const activeFloorRooms = rooms;
                          const netCarpetArea = activeFloorRooms.reduce((acc, r) => acc + (r.actualW * r.actualH), 0);
                          const activeFootprintArea = Math.round(netCarpetArea * 1.22);

                          // Efficiency ratio: Net Usable Area / Footprint Area
                          const carpetEfficiency = activeFootprintArea > 0 ? Math.round((netCarpetArea / activeFootprintArea) * 100) : 0;
                          // Space Utilization of Buildable envelope
                          const envelopeUtilization = buildableArea > 0 ? Math.round((activeFootprintArea / buildableArea) * 100) : 0;
                          const roomCount = activeFloorRooms.length;

                          return (
                            <div className="absolute top-4 left-4 right-4 z-20 backdrop-blur-md bg-white/90 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 sm:p-3.5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 transition-all hover:shadow-md animate-fade-in">
                              {/* Left: Floor info and rooms */}
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border border-teal-100/50 dark:border-teal-900/30">
                                  <Columns className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                  <div className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black">
                                    {lang === "bn" ? "সক্রিয় ফ্লোর প্ল্যান" : "Active Floor Stats"}
                                  </div>
                                  <div className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
                                    <span>
                                      {floors === "duplex" 
                                        ? (activeFloorView === 0 
                                            ? (lang === "bn" ? "নিচ তলা (Ground Floor)" : "Ground Floor") 
                                            : (lang === "bn" ? "দোতলা (First Floor)" : "First Floor")) 
                                        : (lang === "bn" ? "একতলা বাড়ি নকশা" : "Single Storey Plan")}
                                    </span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] text-teal-700 dark:text-teal-400 font-extrabold bg-teal-50 dark:bg-teal-950/30 px-1.5 py-0.2 rounded border border-teal-100/50 dark:border-teal-900/30 font-mono">
                                      {lang === "bn" ? `রুম: ${roomCount}টি` : `Rooms: ${roomCount}`}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Middle: Buildable vs Footprint */}
                              <div className="flex items-center justify-between md:justify-center gap-6 border-t md:border-t-0 border-slate-100 dark:border-slate-800/80 pt-2.5 md:pt-0">
                                <div className="space-y-0.5">
                                  <div className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded bg-rose-500/80" />
                                    {lang === "bn" ? "নির্মাণযোগ্য এলাকা" : "Buildable Area"}
                                  </div>
                                  <div className="text-sm font-black text-slate-800 dark:text-slate-100 font-mono">
                                    {buildableArea.toLocaleString()} <span className="text-[10px] font-bold text-slate-400">sq.ft</span>
                                  </div>
                                </div>

                                <div className="text-slate-200 dark:text-slate-800 font-mono text-xs hidden md:block">/</div>

                                <div className="space-y-0.5">
                                  <div className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded bg-emerald-500/80" />
                                    {lang === "bn" ? "ফুটপ্রিন্ট এলাকা" : "Footprint Area"}
                                  </div>
                                  <div className="text-sm font-black text-teal-700 dark:text-teal-400 font-mono">
                                    {activeFootprintArea.toLocaleString()} <span className="text-[10px] font-bold text-teal-600 dark:text-teal-500">sq.ft</span>
                                  </div>
                                </div>
                              </div>

                              {/* Right: Space Utilization & Efficiency */}
                              <div className="flex items-center justify-between md:justify-end gap-5 border-t md:border-t-0 border-slate-100 dark:border-slate-800/80 pt-2.5 md:pt-0">
                                <div className="space-y-0.5">
                                  <div className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">
                                    {lang === "bn" ? "স্থান ব্যবহার অনুপাত" : "Space Utilization"}
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
                                      <div 
                                        className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500" 
                                        style={{ width: `${envelopeUtilization}%` }}
                                      />
                                    </div>
                                    <span className="text-xs font-black text-slate-700 dark:text-slate-350 font-mono">{envelopeUtilization}%</span>
                                  </div>
                                </div>

                                <div className="px-2.5 py-1 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30 text-right">
                                  <div className="text-[8px] text-emerald-650 dark:text-emerald-400 uppercase tracking-widest font-black">
                                    {lang === "bn" ? "দক্ষতা (Efficiency)" : "Efficiency"}
                                  </div>
                                  <div className="text-xs font-mono font-black text-emerald-700 dark:text-emerald-350">
                                    {carpetEfficiency}%
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        <div id="blueprint-card-print" className="w-full max-w-[560px] aspect-[9/11] relative border border-slate-200 rounded-xl p-3 bg-white shadow-md font-semibold text-slate-700">
                          {/* Plot Boundary Line (Property Limit) */}
                          <div className="absolute inset-3 border-2 border-slate-500 rounded-lg pointer-events-none z-10" />

                          {/* Outer dimensions ruler */}
                          <div className="absolute -top-5 left-12 right-12 text-center text-[10px] font-extrabold font-mono text-slate-600 font-semibold">
                            {plotWidth} ft (Width)
                          </div>
                          <div className="absolute top-12 bottom-12 -right-6 flex items-center justify-center text-[10px] font-extrabold font-mono text-slate-600 rotate-90 font-semibold font-semibold">
                            {plotDepth} ft (Depth)
                          </div>

                          {/* Rooms placement inside the buildable setback box */}
                          <div className="w-full h-full relative" id="layout-canvas-container">
                            {/* Physical Setback & Buildable Boundary Overlay */}
                            {(() => {
                              const bLeft = (setbacks.side / plotWidth) * 100;
                              const bTop = (setbacks.rear / plotDepth) * 100;
                              const bWidth = 100 - ((setbacks.side * 2) / plotWidth) * 100;
                              const bHeightFromFormula = 100 - ((setbacks.front + setbacks.rear) / plotDepth) * 100;

                              return (
                                <>
                                  {/* Outside physical setbacks translucent shading */}
                                  <div className="absolute left-0 top-0 bottom-0 bg-rose-500/[0.015] border-r border-dashed border-rose-350/30 pointer-events-none z-10" style={{ width: `${bLeft}%` }} />
                                  <div className="absolute right-0 top-0 bottom-0 bg-rose-500/[0.015] border-l border-dashed border-rose-350/30 pointer-events-none z-10" style={{ width: `${bLeft}%` }} />
                                  <div className="absolute left-0 right-0 top-0 bg-rose-500/[0.015] border-b border-dashed border-rose-350/30 pointer-events-none z-10" style={{ height: `${bTop}%` }} />
                                  <div className="absolute left-0 right-0 bottom-0 bg-teal-500/[0.015] border-t border-dashed border-teal-350/30 pointer-events-none z-10" style={{ height: `${(setbacks.front / plotDepth) * 100}%` }} />

                                  {/* THE BORDER AFTER SETBACK AREA WHERE THE MAIN STRUCTURE OF THE HOUSE WILL BE CONSTRUCTED */}
                                  <div 
                                    className="absolute border-[2.5px] border-double border-emerald-600/75 rounded-md pointer-events-none z-15 shadow-[0_0_15px_rgba(16,185,129,0.08)] bg-emerald-500/[0.01]"
                                    style={{
                                      left: `${bLeft}%`,
                                      top: `${bTop}%`,
                                      width: `${bWidth}%`,
                                      height: `${bHeightFromFormula}%`,
                                    }}
                                  >
                                    {/* Double border corner CAD indicators */}
                                    <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-600" />
                                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-600" />
                                    <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-600" />
                                    <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-600" />

                                    {/* Real-time label indicating the main structural construction line */}
                                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-emerald-650 text-[7px] sm:text-[8px] font-black tracking-wider text-white uppercase shadow-xs flex items-center gap-1.5 whitespace-nowrap z-20">
                                      <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                                      {lang === "bn" ? "মূল বাড়ি নির্মাণ সীমানা রেখা (নির্মাণযোগ্য এলাকা)" : "Main Construction Envelope (Buildable Area)"}
                                    </div>
                                    
                                    {/* Envelope Dimensions Label */}
                                    <div className="absolute top-1 right-1 bg-emerald-50 text-[6.5px] sm:text-[7.5px] font-bold text-emerald-800 px-1 py-0.2 rounded border border-emerald-250/50">
                                      {Math.round(plotWidth - setbacks.side * 2)}' × {Math.round(plotDepth - setbacks.front - setbacks.rear)}'
                                    </div>
                                  </div>

                                  {/* Red/Amber Setback Dimension Badges */}
                                  <div className="absolute text-[8px] font-black text-rose-600 bg-white/95 border border-rose-200/80 px-1 rounded shadow-3xs pointer-events-none select-none z-20"
                                       style={{ left: `${bLeft / 2}%`, top: "50%", transform: "translate(-50%, -50%) rotate(-90deg)" }}>
                                    {setbacks.side}ft
                                  </div>
                                  <div className="absolute text-[8px] font-black text-rose-600 bg-white/95 border border-rose-200/80 px-1 rounded shadow-3xs pointer-events-none select-none z-20"
                                       style={{ right: `${bLeft / 2}%`, top: "50%", transform: "translate(50%, -50%) rotate(90deg)" }}>
                                    {setbacks.side}ft
                                  </div>
                                  <div className="absolute text-[8px] font-black text-rose-600 bg-white/95 border border-rose-200/80 px-1 rounded shadow-3xs pointer-events-none select-none z-20"
                                       style={{ left: "50%", top: `${bTop / 2}%`, transform: "translate(-50%, -50%)" }}>
                                    {setbacks.rear}ft
                                  </div>
                                  <div className="absolute text-[8px] font-black text-rose-600 bg-white/95 border border-rose-200/80 px-1 rounded shadow-3xs pointer-events-none select-none z-20"
                                       style={{ left: "50%", bottom: `${((setbacks.front / plotDepth) * 100) / 2}%`, transform: "translate(-50%, 50%)" }}>
                                    {setbacks.front}ft
                                  </div>
                                </>
                              );
                            })()}
                            {rooms.map((room) => {
                              // Standard relative positioning matching setbacks
                              // Let's compute exact position padding dynamically
                              const horizontalPadding = (setbacks.side / plotWidth) * 100;
                              const verticalTopPadding = (setbacks.rear / plotDepth) * 100;
                              const verticalHeightPercent = 100 - ((setbacks.front + setbacks.rear) / plotDepth) * 100;
                              const horizontalWidthPercent = 100 - (setbacks.side * 2 / plotWidth) * 100;

                              const lX = horizontalPadding + (room.x * horizontalWidthPercent) / 100;
                              const lY = verticalTopPadding + (room.y * verticalHeightPercent) / 100;
                              const lW = (room.width * horizontalWidthPercent) / 100;
                              const lH = (room.height * verticalHeightPercent) / 100;

                              const isSelected = selectedRoom?.id === room.id;

                              // Duplex customization: Make duplex look slightly different depending on floor
                              let renderRoom = true;
                              if (floors === "duplex" && activeFloorView === 1) {
                                // For first floor, pooja or porch can represent beautiful sky terrace / balconies!
                                if (room.id === "entrance_verandah") {
                                  room = {
                                    ...room,
                                    nameEn: "Open Terrace Balcony",
                                    nameBn: "খোলা ছাদ বা বারান্দা",
                                    colorHex: "#0ea5e9"
                                  };
                                } else if (room.id === "pooja_room") {
                                  room = {
                                    ...room,
                                    nameEn: "Study & Office Room",
                                    nameBn: "অধ্যয়ন ও অফিস রুম",
                                    colorHex: "#8b5cf6"
                                  };
                                }
                              }

                              const bgClass = getRoomBGColor(room.id, isSelected);

                              return (
                                <motion.button
                                  key={room.id}
                                  onPointerDown={(e) => handleRoomPointerDown(e, room)}
                                  onPointerMove={(e) => handleRoomPointerMove(e, room)}
                                  onPointerUp={(e) => handleRoomPointerUp(e, room)}
                                  onClick={(e) => {
                                    setSelectedRoom(room);
                                    setSelectedFurnitureId(null);
                                  }}
                                  className={`absolute flex flex-col justify-center items-center p-1.5 transition-all cursor-grab active:cursor-grabbing select-none touch-none group text-center overflow-visible z-20 ${bgClass} ${
                                    isSelected
                                      ? "ring-4 ring-slate-800/20 shadow-lg z-30 scale-[1.01]"
                                      : "shadow-sm"
                                  }`}
                                  style={{
                                    left: `${lX}%`,
                                    top: `${lY}%`,
                                    width: `${lW}%`,
                                    height: `${lH}%`,
                                    borderRadius: "4px",
                                    borderStyle: "solid",
                                    borderColor: isSelected ? "#1e293b" : "rgba(30, 41, 59, 0.95)",
                                    borderTopWidth: room.hiddenWalls?.top ? "0px" : (isSelected ? "4px" : "3px"),
                                    borderBottomWidth: room.hiddenWalls?.bottom ? "0px" : (isSelected ? "4px" : "3px"),
                                    borderLeftWidth: room.hiddenWalls?.left ? "0px" : (isSelected ? "4px" : "3px"),
                                    borderRightWidth: room.hiddenWalls?.right ? "0px" : (isSelected ? "4px" : "3px")
                                  }}
                                  whileHover={{ scale: 1.005 }}
                                  whileTap={{ scale: 0.995 }}
                                >
                                  {/* Window Glass Panes inside thickness of external walls */}
                                  {renderCustomWindows(room)}

                                  {/* 2D Furniture Layer */}
                                  {getFurnitureSVG(room)}

                                  {/* Custom Attached Bathroom Partition */}
                                  {renderAttachedBathroom(room, lang)}

                                  {/* Door Swing CAD Indicators */}
                                  {renderCustomDoors(room)}

                                  {/* Centered label layer conforming to standard floor plans */}
                                  <div className="relative z-10 flex flex-col items-center justify-center space-y-0.5 max-w-full pointer-events-none">
                                    <div className="text-[8px] sm:text-[10px] md:text-[11.5px] font-black text-slate-900 uppercase tracking-wide leading-tight px-1 py-0.5 bg-white/70 backdrop-blur-[0.5px] rounded border border-slate-200/55 max-w-[95%] truncate shadow-xs">
                                      {lang === "bn" ? room.nameBn : room.nameEn}
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center justify-center gap-1 mt-0.5">
                                      <span className="text-[7.5px] sm:text-[9.5px] font-mono font-extrabold text-slate-700 bg-white/90 px-1 py-0.2 rounded border border-slate-200/50 shadow-2xs">
                                        {room.actualW * room.actualH} {lang === "bn" ? "বর্গফুট" : "sq ft"}
                                      </span>
                                      
                                      <span className="text-[6.5px] sm:text-[8px] font-mono font-bold text-slate-500 bg-white/60 px-0.5 rounded border border-slate-100">
                                        {room.actualW}' × {room.actualH}'
                                      </span>
                                    </div>
                                  </div>

                                  {/* Small floating Vastu quality badge in corner */}
                                  <div className="absolute top-1 right-1 flex items-center gap-0.5 bg-white/90 px-1 py-0.2 rounded border border-slate-100 text-[6px] sm:text-[7.5px] font-bold text-slate-500 shadow-2xs pointer-events-none z-10 transition-all">
                                    <span className="uppercase text-[5px] sm:text-[6.5px] text-slate-400 font-semibold">Vastu</span>
                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                      room.vastuStatus === "excellent" 
                                        ? "bg-emerald-500 shadow-xs shadow-emerald-500/50" 
                                        : "bg-amber-500 shadow-xs shadow-amber-500/50"
                                    }`} />
                                  </div>
                                </motion.button>
                              );
                            })}

                            {editorTab !== "draw" && rooms.length === 0 && (
                              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10 pointer-events-auto">
                                <div className="p-5 bg-teal-50/95 border border-dashed border-teal-200/80 rounded-2xl max-w-sm flex flex-col items-center justify-center space-y-3.5 shadow-2xs">
                                  <div className="w-11 h-11 rounded-full bg-teal-100 flex items-center justify-center text-teal-650 shadow-xs animate-pulse">
                                    <Sparkles className="w-5 h-5" />
                                  </div>
                                  <div className="space-y-1">
                                    <h4 className="text-xs font-black text-teal-900 uppercase tracking-widest">
                                      {lang === "bn" ? "খালি গৃহ-নকশা ম্যাপ" : "Blank Blueprint Area"}
                                    </h4>
                                    <p className="text-[11px] leading-relaxed text-slate-500 font-medium font-sans">
                                      {lang === "bn"
                                        ? "ডানপাশের 'তালিকা (Space List)' ট্যাব থেকে পছন্দমতো ঘরের ওপর ক্লিক করে ম্যাপ ও নকশায় যোগ করুন।"
                                        : "Your drawing area is empty. Select space fields from the 'Space List' tab on the right to place and configure them!"}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={handleResetToTemplate}
                                      className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-550 text-white text-[10px] font-black tracking-wider uppercase rounded-lg shadow-sm transition hover:scale-103 cursor-pointer"
                                    >
                                      ✨ {lang === "bn" ? "অটো-ম্যাপ তৈরি করুন" : "Auto-Generate Layout"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* INTERACTIVE DRAGGABLE FURNITURE OVERLAY LAYER */}
                            {furnitureItems.map((item) => {
                              const horizontalPadding = (setbacks.side / plotWidth) * 100;
                              const verticalTopPadding = (setbacks.rear / plotDepth) * 100;
                              const verticalHeightPercent = 100 - ((setbacks.front + setbacks.rear) / plotDepth) * 100;
                              const horizontalWidthPercent = 100 - (setbacks.side * 2 / plotWidth) * 100;

                              const fX = horizontalPadding + (item.x * horizontalWidthPercent) / 100;
                              const fY = verticalTopPadding + (item.y * verticalHeightPercent) / 100;

                              const isSelected = selectedFurnitureId === item.id;
                              const size = getFurnitureSize(item.type);

                              return (
                                <div
                                  key={item.id}
                                  onPointerDown={(e) => handleFurniturePointerDown(e, item)}
                                  onPointerMove={(e) => handleFurniturePointerMove(e, item)}
                                  onPointerUp={(e) => handleFurniturePointerUp(e, item)}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedFurnitureId(item.id);
                                    setSelectedRoom(null);
                                  }}
                                  className={`absolute ${size.w} ${size.h} ${size.ml} ${size.mt} cursor-grab active:cursor-grabbing select-none touch-none flex items-center justify-center z-[40] transition-all duration-150 ${
                                    isSelected 
                                      ? "ring-[2.5px] ring-teal-500 rounded bg-teal-50/25 shadow-md scale-110 z-[45]" 
                                      : "hover:scale-103 hover:z-[42]"
                                  }`}
                                  style={{
                                    left: `${fX}%`,
                                    top: `${fY}%`,
                                    transform: `rotate(${item.rotation}deg)`,
                                  }}
                                >
                                  <FurnitureDisplayIcon type={item.type} isSelected={isSelected} />
                                </div>
                              );
                            })}

                            {/* SVG Manual Drawing Overlay Layer */}
                            <svg
                              className={`absolute inset-0 w-full h-full z-[35] ${
                                editorTab === "draw" ? "cursor-crosshair pointer-events-auto" : "pointer-events-none"
                              }`}
                              onPointerDown={handlePointerDown}
                              onPointerMove={handlePointerMove}
                              onPointerUp={handlePointerUp}
                              viewBox="0 0 100 100"
                              preserveAspectRatio="none"
                            >
                              {/* RENDER FINISHED STROKES */}
                              {manualStrokes.map((stroke, idx) => {
                                const p1 = stroke.points[0];
                                const p2 = stroke.points[stroke.points.length - 1];
                                if (!p1 || !p2) return null;
                                const strokeWidthScaled = stroke.width * 0.4;

                                if (stroke.type === "straight") {
                                  return (
                                    <line
                                      key={idx}
                                      x1={p1.x}
                                      y1={p1.y}
                                      x2={p2.x}
                                      y2={p2.y}
                                      stroke={stroke.color}
                                      strokeWidth={strokeWidthScaled}
                                      strokeLinecap="round"
                                    />
                                  );
                                }

                                if (stroke.type === "curve") {
                                  const dx = p2.x - p1.x;
                                  const dy = p2.y - p1.y;
                                  const dist = Math.sqrt(dx * dx + dy * dy);
                                  const bendFactor = 0.15;
                                  const nx = dist > 0 ? -dy / dist : 0;
                                  const ny = dist > 0 ? dx / dist : 0;
                                  const cx = (p1.x + p2.x) / 2 + nx * (dist * bendFactor);
                                  const cy = (p1.y + p2.y) / 2 + ny * (dist * bendFactor);

                                  return (
                                    <path
                                      key={idx}
                                      d={`M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`}
                                      fill="none"
                                      stroke={stroke.color}
                                      strokeWidth={strokeWidthScaled}
                                      strokeLinecap="round"
                                    />
                                  );
                                }

                                return (
                                  <polyline
                                    key={idx}
                                    points={stroke.points.map(p => `${p.x},${p.y}`).join(" ")}
                                    fill="none"
                                    stroke={stroke.color}
                                    strokeWidth={strokeWidthScaled}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                );
                              })}

                              {/* RENDER CURRENT RECORDING STROKE */}
                              {currentStroke && (() => {
                                const p1 = currentStroke.points[0];
                                const p2 = currentStroke.points[currentStroke.points.length - 1];
                                if (!p1 || !p2) return null;
                                const strokeWidthScaled = currentStroke.width * 0.4;

                                if (currentStroke.type === "straight") {
                                  return (
                                    <line
                                      x1={p1.x}
                                      y1={p1.y}
                                      x2={p2.x}
                                      y2={p2.y}
                                      stroke={currentStroke.color}
                                      strokeWidth={strokeWidthScaled}
                                      strokeLinecap="round"
                                    />
                                  );
                                }

                                if (currentStroke.type === "curve") {
                                  const dx = p2.x - p1.x;
                                  const dy = p2.y - p1.y;
                                  const dist = Math.sqrt(dx * dx + dy * dy);
                                  const bendFactor = 0.15;
                                  const nx = dist > 0 ? -dy / dist : 0;
                                  const ny = dist > 0 ? dx / dist : 0;
                                  const cx = (p1.x + p2.x) / 2 + nx * (dist * bendFactor);
                                  const cy = (p1.y + p2.y) / 2 + ny * (dist * bendFactor);

                                  return (
                                    <path
                                      d={`M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`}
                                      fill="none"
                                      stroke={currentStroke.color}
                                      strokeWidth={strokeWidthScaled}
                                      strokeLinecap="round"
                                    />
                                  );
                                }

                                return (
                                  <polyline
                                    points={currentStroke.points.map(p => `${p.x},${p.y}`).join(" ")}
                                    fill="none"
                                    stroke={currentStroke.color}
                                    strokeWidth={strokeWidthScaled}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                );
                              })()}

                              {/* RENDER TEXT ANNOTATIONS */}
                              {manualTexts.map((txt) => (
                                <g key={txt.id} transform={`translate(${txt.x}, ${txt.y})`} className="pointer-events-none select-none z-50">
                                  {/* Visual text background for high visibility */}
                                  <rect
                                    x="-14"
                                    y="-4"
                                    width="28"
                                    height="8"
                                    fill="white"
                                    stroke={txt.color}
                                    strokeWidth="0.4"
                                    rx="1.5"
                                    className="opacity-95 shadow-sm"
                                  />
                                  <text
                                    x="0"
                                    y="1.3"
                                    fill={txt.color}
                                    fontSize="3.2"
                                    fontWeight="900"
                                    textAnchor="middle"
                                    className="font-sans font-bold select-none pointer-events-none"
                                  >
                                    {txt.text}
                                  </text>
                                  {/* Floating remove button if eraser or draw mode is active */}
                                  {editorTab === "draw" && (
                                    <circle
                                      cx="14"
                                      cy="-4"
                                      r="1.8"
                                      fill="#ef4444"
                                      className="cursor-pointer pointer-events-auto hover:scale-110 transition-transform"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setManualTexts(prev => prev.filter(t => t.id !== txt.id));
                                      }}
                                    />
                                  )}
                                </g>
                              ))}
                            </svg>
                          </div>

                        </div>

                        {/* Download Plan Action Bar */}
                        <div className="w-full max-w-[560px] flex justify-center mt-3 z-10">
                          <button
                            onClick={handleDownloadPNG}
                            disabled={isDownloadingPng}
                            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg hover:brightness-105 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-55 cursor-pointer"
                          >
                            {isDownloadingPng ? (
                              <>
                                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                <span>{lang === "bn" ? "ডাউনলোড হচ্ছে..." : "Downloading PNG..."}</span>
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4 text-white shrink-0" />
                                <span>{t.downloadPngBtn}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Room inspector / custom floor planner with elegant boxes */}
                      <div className="lg:col-span-5 xl:col-span-4 space-y-4">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 h-full flex flex-col justify-between space-y-4 shadow-sm">
                          <div className="space-y-4">
                            
                            {/* Editor Mode Tabs */}
                            <div className="flex border-b border-slate-200 pb-1 text-[10px] sm:text-xs gap-1 flex-wrap sm:flex-nowrap">
                              <button
                                onClick={() => setEditorTab("list")}
                                className={`flex-1 py-1.5 px-0.5 rounded transition text-center font-bold whitespace-nowrap ${
                                  editorTab === "list" || editorTab === "furniture"
                                    ? "bg-white text-teal-700 border border-slate-200 font-bold shadow-sm"
                                    : "text-slate-500 hover:text-slate-800"
                                }`}
                              >
                                {lang === "bn" ? "ঘর ও আসবাব" : "Rooms & Furniture"}
                              </button>
                              <button
                                onClick={() => setEditorTab("edit")}
                                className={`flex-1 py-1.5 px-0.5 rounded transition text-center font-bold whitespace-nowrap ${
                                  editorTab === "edit"
                                    ? "bg-white text-teal-700 border border-slate-200 font-bold shadow-sm"
                                    : "text-slate-500 hover:text-slate-800"
                                }`}
                              >
                                {lang === "bn" ? "ঘর এডিট" : "Edit Space"}
                              </button>
                              <button
                                onClick={() => setEditorTab("draw")}
                                className={`flex-1 py-1.5 px-0.5 rounded transition text-center font-bold whitespace-nowrap ${
                                  editorTab === "draw"
                                    ? "bg-white text-teal-700 border border-slate-200 font-bold shadow-sm"
                                    : "text-slate-500 hover:text-slate-800"
                                }`}
                              >
                                {lang === "bn" ? "নিজে আঁকুন" : "Draw Mode"}
                              </button>
                            </div>

                            {/* TAB 1: EDIT SPACE */}
                            {editorTab === "edit" && (
                              <div className="space-y-4">
                                {selectedRoom ? (
                                  <div className="space-y-4">
                                    <div>
                                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                                        {t.roomDetailTitle}
                                      </span>
                                      <h4 className="text-base font-bold text-teal-800 mt-2 flex items-center justify-between">
                                        <span>{lang === "bn" ? selectedRoom.nameBn : selectedRoom.nameEn}</span>
                                        <button
                                          onClick={() => handleDeleteRoom(selectedRoom.id)}
                                          className="text-rose-600 hover:text-rose-500 transition p-1 hover:bg-rose-50 rounded"
                                          title={t.deleteRoomBtn}
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </h4>
                                      <p className="text-[11px] text-slate-500 mt-1">
                                        {lang === "bn" ? selectedRoom.purposeBn : selectedRoom.purpose}
                                      </p>
                                    </div>

                                    {/* Sliders for Width and Height in Feet */}
                                    <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-3 shadow-sm">
                                      
                                      {/* Dropdowns for Width & Height (User-requested Dropdown Option instead of predefined size) */}
                                      <div className="grid grid-cols-2 gap-3 pb-2 border-b border-slate-100 mb-1">
                                        <div className="space-y-1">
                                          <label className="text-[10px] uppercase tracking-wider font-extrabold text-teal-700 block">
                                            {lang === "bn" ? "প্রস্থ (Width Dropdown):" : "Width (Dropdown):"}
                                          </label>
                                          <select
                                            value={selectedRoom.actualW}
                                            onChange={(e) => handleUpdateSelectedRoom({ actualW: parseInt(e.target.value) })}
                                            className="w-full bg-slate-50 border border-slate-250 rounded px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-teal-500/50 font-bold"
                                          >
                                            {Array.from({ length: 25 }, (_, i) => i + 6).map((num) => (
                                              <option key={num} value={num}>
                                                {num} {lang === "bn" ? "ফুট" : "ft"}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                        
                                        <div className="space-y-1">
                                          <label className="text-[10px] uppercase tracking-wider font-extrabold text-teal-700 block">
                                            {lang === "bn" ? "দৈর্ঘ্য (Height Dropdown):" : "Height (Dropdown):"}
                                          </label>
                                          <select
                                            value={selectedRoom.actualH}
                                            onChange={(e) => handleUpdateSelectedRoom({ actualH: parseInt(e.target.value) })}
                                            className="w-full bg-slate-50 border border-slate-250 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-teal-500/50 font-bold"
                                          >
                                            {Array.from({ length: 25 }, (_, i) => i + 6).map((num) => (
                                              <option key={num} value={num}>
                                                {num} {lang === "bn" ? "ফুট" : "ft"}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                      </div>

                                      <div className="space-y-1">
                                        <div className="flex justify-between text-xs text-slate-500 font-bold">
                                          <span>{t.roomWidthLabel}</span>
                                          <span className="text-teal-700 font-bold font-mono">{selectedRoom.actualW} ft</span>
                                        </div>
                                        <input
                                          type="range"
                                          min="6"
                                          max="30"
                                          step="1"
                                          value={selectedRoom.actualW}
                                          onChange={(e) => handleUpdateSelectedRoom({ actualW: parseInt(e.target.value) })}
                                          className="w-full accent-teal-600 cursor-pointer h-1.5"
                                        />
                                      </div>

                                      <div className="space-y-1">
                                        <div className="flex justify-between text-xs text-slate-500 font-bold">
                                          <span>{t.roomHeightLabel}</span>
                                          <span className="text-teal-700 font-bold font-mono">{selectedRoom.actualH} ft</span>
                                        </div>
                                        <input
                                          type="range"
                                          min="6"
                                          max="30"
                                          step="1"
                                          value={selectedRoom.actualH}
                                          onChange={(e) => handleUpdateSelectedRoom({ actualH: parseInt(e.target.value) })}
                                          className="w-full accent-teal-600 cursor-pointer h-1.5"
                                        />
                                      </div>

                                      {/* Standard presets for quick resizing of selected space */}
                                      {(() => {
                                        const typeKey = getRoomTypeKeyFromId(selectedRoom.id);
                                        const presets = ROOM_SIZE_PRESETS[typeKey];
                                        if (!presets) return null;
                                        const activePresetIdx = presets.findIndex(p => selectedRoom.actualW === p.w && selectedRoom.actualH === p.h);
                                        return (
                                          <div className="space-y-1.5 pt-2 border-t border-slate-200">
                                            <label className="text-[10px] text-teal-700 font-bold uppercase tracking-wider block">
                                              {lang === "bn" ? "আকার পরিবর্তন করুন (Choose Size Option):" : "Resize to Choice Size Option:"}
                                            </label>
                                            <select
                                              value={activePresetIdx !== -1 ? activePresetIdx : ""}
                                              onChange={(e) => {
                                                const idxVal = e.target.value;
                                                if (idxVal !== "") {
                                                  const selectedPreset = presets[parseInt(idxVal)];
                                                  handleUpdateSelectedRoom({ actualW: selectedPreset.w, actualH: selectedPreset.h });
                                                }
                                              }}
                                              className="w-full bg-white border border-slate-250 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-teal-500/50 shadow-sm font-semibold"
                                            >
                                              <option value="" disabled className="text-slate-400">
                                                {lang === "bn" ? "-- একটি নির্দিষ্ট আকার সেট করুন --" : "-- Select a predefined size --"}
                                              </option>
                                              {presets.map((preset, idx) => (
                                                <option key={idx} value={idx}>
                                                  {lang === "bn" ? preset.labelBn : preset.labelEn} ({preset.w * preset.h} sq.ft)
                                                </option>
                                              ))}
                                            </select>
                                          </div>
                                        );
                                      })()}
                                    </div>

                                    {/* Move / Nudge Controls */}
                                    <div className="bg-slate-100/50 border border-slate-200 rounded-xl p-3 space-y-3">
                                      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                                        {lang === "bn" ? "অবস্থান পরিবর্তন (Nudge Canvas Position):" : "Canvas Position Nudging:"}
                                      </div>
                                      
                                      <div className="space-y-1">
                                        <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
                                          <span>{t.positionXLabel}</span>
                                          <span className="text-slate-800 font-mono font-extrabold">{Math.round(selectedRoom.x)}%</span>
                                        </div>
                                        <input
                                          type="range"
                                          min="0"
                                          max="85"
                                          step="1"
                                          value={selectedRoom.x}
                                          onChange={(e) => handleUpdateSelectedRoom({ x: parseInt(e.target.value) })}
                                          className="w-full accent-indigo-600 cursor-pointer h-1.5"
                                        />
                                      </div>

                                      <div className="space-y-1">
                                        <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
                                          <span>{t.positionYLabel}</span>
                                          <span className="text-slate-800 font-mono font-extrabold">{Math.round(selectedRoom.y)}%</span>
                                        </div>
                                        <input
                                          type="range"
                                          min="0"
                                          max="85"
                                          step="1"
                                          value={selectedRoom.y}
                                          onChange={(e) => handleUpdateSelectedRoom({ y: parseInt(e.target.value) })}
                                          className="w-full accent-indigo-600 cursor-pointer h-1.5"
                                        />
                                      </div>
                                    </div>

                                    {/* CUSTOM FEATURE: ERASE BOUNDARIES / WALLS */}
                                    <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-3 shadow-xs">
                                      <div className="flex items-center gap-1.5">
                                        <Eraser className="w-4 h-4 text-rose-500 shrink-0" />
                                        <span className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                                          {lang === "bn" ? "রুমের দেয়াল মুছুন / লুকান (Wall Eraser)" : "Erase / Hide Room Walls:"}
                                        </span>
                                      </div>
                                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                                        {lang === "bn" 
                                          ? "রুমের যেকোনো দেয়াল মুছতে নিচের বোতামগুলো ব্যবহার করুন। এর ফলে ওপেন-কনসেপ্ট বা যুক্ত রুম তৈরি করতে পারবেন।" 
                                          : "Select which wall boundaries to erase/hide to design open-concept layouts or connected rooms."}
                                      </p>
                                      
                                      <div className="grid grid-cols-2 gap-2 pt-1">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const hw = selectedRoom.hiddenWalls || {};
                                            handleUpdateSelectedRoom({
                                              hiddenWalls: { ...hw, top: !hw.top }
                                            });
                                          }}
                                          className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                                            selectedRoom.hiddenWalls?.top
                                              ? "bg-rose-50 border-rose-300 text-rose-700 shadow-2xs"
                                              : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300"
                                          }`}
                                        >
                                          <div className={`w-2 h-2 rounded-full ${selectedRoom.hiddenWalls?.top ? "bg-rose-600" : "bg-slate-400"}`} />
                                          <span>{lang === "bn" ? "উপরের দেয়াল" : "Top Wall"}</span>
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => {
                                            const hw = selectedRoom.hiddenWalls || {};
                                            handleUpdateSelectedRoom({
                                              hiddenWalls: { ...hw, bottom: !hw.bottom }
                                            });
                                          }}
                                          className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                                            selectedRoom.hiddenWalls?.bottom
                                              ? "bg-rose-50 border-rose-300 text-rose-700 shadow-2xs"
                                              : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300"
                                          }`}
                                        >
                                          <div className={`w-2 h-2 rounded-full ${selectedRoom.hiddenWalls?.bottom ? "bg-rose-600" : "bg-slate-400"}`} />
                                          <span>{lang === "bn" ? "নিচের দেয়াল" : "Bottom Wall"}</span>
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => {
                                            const hw = selectedRoom.hiddenWalls || {};
                                            handleUpdateSelectedRoom({
                                              hiddenWalls: { ...hw, left: !hw.left }
                                            });
                                          }}
                                          className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                                            selectedRoom.hiddenWalls?.left
                                              ? "bg-rose-50 border-rose-300 text-rose-700 shadow-2xs"
                                              : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300"
                                          }`}
                                        >
                                          <div className={`w-2 h-2 rounded-full ${selectedRoom.hiddenWalls?.left ? "bg-rose-600" : "bg-slate-400"}`} />
                                          <span>{lang === "bn" ? "বাম দেয়াল" : "Left Wall"}</span>
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => {
                                            const hw = selectedRoom.hiddenWalls || {};
                                            handleUpdateSelectedRoom({
                                              hiddenWalls: { ...hw, right: !hw.right }
                                            });
                                          }}
                                          className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                                            selectedRoom.hiddenWalls?.right
                                              ? "bg-rose-50 border-rose-300 text-rose-700 shadow-2xs"
                                              : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300"
                                          }`}
                                        >
                                          <div className={`w-2 h-2 rounded-full ${selectedRoom.hiddenWalls?.right ? "bg-rose-600" : "bg-slate-400"}`} />
                                          <span>{lang === "bn" ? "ডান দেয়াল" : "Right Wall"}</span>
                                        </button>
                                      </div>
                                      
                                      {/* Reset boundaries option */}
                                      {(selectedRoom.hiddenWalls?.top || selectedRoom.hiddenWalls?.bottom || selectedRoom.hiddenWalls?.left || selectedRoom.hiddenWalls?.right) && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            handleUpdateSelectedRoom({
                                              hiddenWalls: { top: false, bottom: false, left: false, right: false }
                                            });
                                          }}
                                          className="w-full text-center text-[10px] text-teal-600 font-extrabold hover:underline pt-1 cursor-pointer block"
                                        >
                                          {lang === "bn" ? "সব দেয়াল পুনরায় ফেরত আনুন (Reset All Walls)" : "Reset all wall boundaries"}
                                        </button>
                                      )}
                                    </div>

                                    {/* ATTACHED BATHROOM CONFIGURATION PANEL */}
                                    {(() => {
                                      const isAttached = selectedRoom.id.toLowerCase().includes("attached") || 
                                                       selectedRoom.id.toLowerCase().includes("bedroom_attached") ||
                                                       selectedRoom.attachedBathConfig !== undefined;
                                      if (!isAttached) return null;

                                      const bConfig = selectedRoom.attachedBathConfig || {
                                        enabled: true,
                                        size: "medium",
                                        position: "top-right",
                                        actualW: 6,
                                        actualH: 5
                                      };

                                      const pos = bConfig.position || "top-right";
                                      const size = bConfig.size || "medium";

                                      return (
                                        <div className="bg-sky-50/65 border border-sky-200 rounded-xl p-3.5 space-y-3.5 shadow-xs text-left">
                                          <div className="flex items-center gap-1.5">
                                            <div className="w-5 h-5 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600 font-extrabold text-xs">
                                              🚿
                                            </div>
                                            <span className="text-[11px] font-black uppercase text-slate-800 tracking-wider">
                                              {lang === "bn" ? "সংযুক্ত বাথরুম সেটআপ (Attached Bathroom)" : "Attached Bathroom Config:"}
                                            </span>
                                          </div>
                                          
                                          <p className="text-[10px] text-slate-500 font-semibold leading-relaxed font-sans">
                                            {lang === "bn" 
                                              ? "সংযুক্ত বাথরুমের আকার এবং অবস্থান পরিবর্তন করুন। রুম এবং বাথরুমের মাঝে স্বয়ংক্রিয় পার্টিশন এবং ওপেনিং তৈরি করা হবে।" 
                                              : "Customize the position and dimensions of the attached bathroom. A partition wall and door will be dynamically generated."}
                                          </p>

                                          {/* Toggle switch for attached bathroom */}
                                          <div className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-slate-150 shadow-3xs">
                                            <span className="text-[10.5px] font-bold text-slate-700">
                                              {lang === "bn" ? "সংযুক্ত বাথরুম অন রাখুন:" : "Enable Bathroom Partition:"}
                                            </span>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                handleUpdateSelectedRoom({
                                                  attachedBathConfig: {
                                                    ...bConfig,
                                                    enabled: !bConfig.enabled
                                                  }
                                                });
                                              }}
                                              className={`w-10 h-5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer ${
                                                bConfig.enabled ? "bg-teal-600 text-end" : "bg-slate-300 text-start"
                                              }`}
                                            >
                                              <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${bConfig.enabled ? "translate-x-5" : ""}`} />
                                            </button>
                                          </div>

                                          {bConfig.enabled !== false && (
                                            <>
                                              {/* Position grid buttons */}
                                              <div className="space-y-1.5">
                                                <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">
                                                  📍 {lang === "bn" ? "বাথরুমের অবস্থান (Corner Position):" : "Bathroom Corner Position:"}
                                                </label>
                                                <div className="grid grid-cols-2 gap-1.5">
                                                  {[
                                                    { key: "top-left", bn: "টপ-লেফট (উত্তর-পশ্চিম)", en: "Top-Left" },
                                                    { key: "top-right", bn: "টপ-রাইট (উত্তর-পূর্ব)", en: "Top-Right" },
                                                    { key: "bottom-left", bn: "বটম-লেফট (দক্ষিণ-পশ্চিম)", en: "Bottom-Left" },
                                                    { key: "bottom-right", bn: "বটম-রাইট (দক্ষিণ-পূর্ব)", en: "Bottom-Right" }
                                                  ].map((pItem) => {
                                                    const isActive = pos === pItem.key;
                                                    return (
                                                      <button
                                                        key={`bath-pos-${pItem.key}`}
                                                        type="button"
                                                        onClick={() => {
                                                          handleUpdateSelectedRoom({
                                                            attachedBathConfig: {
                                                              ...bConfig,
                                                              position: pItem.key as any
                                                            }
                                                          });
                                                        }}
                                                        className={`py-1.5 px-2 rounded-xl text-[10.5px] font-bold text-center border transition cursor-pointer ${
                                                          isActive 
                                                            ? "bg-teal-600 text-white border-teal-600 shadow-2xs" 
                                                            : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                                                        }`}
                                                      >
                                                        {lang === "bn" ? pItem.bn : pItem.en}
                                                      </button>
                                                    );
                                                  })}
                                                </div>
                                              </div>

                                              {/* Dimension preset sizes */}
                                              <div className="space-y-1.5 pt-1">
                                                <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">
                                                  📏 {lang === "bn" ? "বাথরুমের আকার (Bathroom Size):" : "Bathroom Size Preset:"}
                                                </label>
                                                <div className="grid grid-cols-3 gap-1">
                                                  {[
                                                    { key: "small", labels: { bn: "ছোট", en: "Cozy" }, w: 5, h: 4 },
                                                    { key: "medium", labels: { bn: "মাঝারি", en: "Regular" }, w: 6, h: 5 },
                                                    { key: "large", labels: { bn: "বড়", en: "Premium" }, w: 7, h: 5 },
                                                  ].map((szItem) => {
                                                    const isActive = size === szItem.key;
                                                    return (
                                                      <button
                                                        key={`bath-sz-${szItem.key}`}
                                                        type="button"
                                                        onClick={() => {
                                                          handleUpdateSelectedRoom({
                                                            attachedBathConfig: {
                                                              ...bConfig,
                                                              size: szItem.key as any,
                                                              actualW: szItem.w,
                                                              actualH: szItem.h
                                                            }
                                                          });
                                                        }}
                                                        className={`py-1 px-1.5 rounded-lg text-[10px] font-extrabold text-center border transition cursor-pointer ${
                                                          isActive 
                                                            ? "bg-slate-800 text-white border-slate-800 shadow-3xs" 
                                                            : "bg-white hover:bg-slate-50 border-slate-200 text-slate-650"
                                                        }`}
                                                      >
                                                        <div>{lang === "bn" ? szItem.labels.bn : szItem.labels.en}</div>
                                                        <div className="text-[8.5px] font-mono font-black opacity-80">{szItem.w}'×{szItem.h}'</div>
                                                      </button>
                                                    );
                                                  })}
                                                  {/* Custom size option */}
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      handleUpdateSelectedRoom({
                                                        attachedBathConfig: {
                                                          ...bConfig,
                                                          size: "custom"
                                                        }
                                                      });
                                                    }}
                                                    className={`py-1 px-1.5 rounded-lg text-[10px] font-extrabold text-center border transition col-span-3 cursor-pointer ${
                                                      size === "custom"
                                                        ? "bg-slate-800 text-white border-slate-800 shadow-3xs" 
                                                        : "bg-white hover:bg-slate-50 border-slate-200 text-slate-650"
                                                    }`}
                                                  >
                                                    {lang === "bn" ? "সরাসরি কাস্টম আকার দিন 👇" : "Set Custom Size Manually 👇"}
                                                  </button>
                                                </div>
                                              </div>

                                              {/* Custom sliders */}
                                              {size === "custom" && (
                                                <div className="p-2.5 bg-white ring-1 ring-slate-150 rounded-xl space-y-2.5">
                                                  <div className="space-y-1">
                                                    <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                                                      <span>{lang === "bn" ? "প্রস্থ (Width):" : "Bathroom Width:"}</span>
                                                      <span className="text-teal-700 font-mono font-black">{bConfig.actualW || 6} {lang === "bn" ? "ফুট" : "ft"}</span>
                                                    </div>
                                                    <input
                                                      type="range"
                                                      min="4"
                                                      max="10"
                                                      step="1"
                                                      value={bConfig.actualW || 6}
                                                      onChange={(e) => {
                                                        handleUpdateSelectedRoom({
                                                          attachedBathConfig: {
                                                            ...bConfig,
                                                            actualW: parseInt(e.target.value)
                                                          }
                                                        });
                                                      }}
                                                      className="w-full accent-teal-600 h-1 cursor-pointer"
                                                    />
                                                  </div>
                                                  <div className="space-y-1">
                                                    <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                                                      <span>{lang === "bn" ? "দৈর্ঘ্য (Length):" : "Bathroom Length:"}</span>
                                                      <span className="text-teal-700 font-mono font-black">{bConfig.actualH || 5} {lang === "bn" ? "ফুট" : "ft"}</span>
                                                    </div>
                                                    <input
                                                      type="range"
                                                      min="4"
                                                      max="10"
                                                      step="1"
                                                      value={bConfig.actualH || 5}
                                                      onChange={(e) => {
                                                        handleUpdateSelectedRoom({
                                                          attachedBathConfig: {
                                                            ...bConfig,
                                                            actualH: parseInt(e.target.value)
                                                          }
                                                        });
                                                      }}
                                                      className="w-full accent-teal-600 h-1 cursor-pointer"
                                                    />
                                                  </div>
                                                </div>
                                              )}
                                            </>
                                          )}
                                        </div>
                                      );
                                    })()}

                                    {/* CUSTOM FEATURE: MANUALLY ASSIGN DOORS & WINDOWS */}
                                    <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-3 shadow-xs">
                                      <div className="flex items-center gap-1.5">
                                        <div className="w-5 h-5 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 font-extrabold text-xs">
                                          🚪
                                        </div>
                                        <span className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                                          {lang === "bn" ? "দরজা ও জানালা বসান (Doors & Windows)" : "Manual Doors & Windows:"}
                                        </span>
                                      </div>
                                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                                        {lang === "bn" 
                                          ? "আপনার সুবিধামতো ঘরে দরজা এবং জানালা বসাতে বা সরাতে নিচের বোতামগুলো ব্যবহার করুন।" 
                                          : "Manually place or remove doors and windows on any of the four walls of this room."}
                                      </p>
                                      
                                      {/* Doors Section */}
                                      <div className="space-y-2">
                                        <div className="text-[9.5px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                          <span>🚪 {lang === "bn" ? "দরজা স্থাপন (Doors):" : "Place Doors on Walls:"}</span>
                                        </div>
                                        <div className="grid grid-cols-4 gap-1.5">
                                          {["top", "bottom", "left", "right"].map((side) => {
                                            const hasDoor = selectedRoom.doors?.[side] || false;
                                            const label = lang === "bn" 
                                              ? (side === "top" ? "উপরে" : side === "bottom" ? "নিচে" : side === "left" ? "বামে" : "ডানে")
                                              : (side === "top" ? "Top" : side === "bottom" ? "Bottom" : side === "left" ? "Left" : "Right");
                                            
                                            return (
                                              <button
                                                key={`door-${side}`}
                                                type="button"
                                                onClick={() => {
                                                  const currentDoors = selectedRoom.doors || {};
                                                  handleUpdateSelectedRoom({
                                                    doors: {
                                                      ...currentDoors,
                                                      [side]: !hasDoor
                                                    }
                                                  });
                                                }}
                                                className={`py-1.5 px-1 rounded-lg text-[10px] font-bold border transition text-center cursor-pointer ${
                                                  hasDoor
                                                    ? "bg-teal-50 border-teal-300 text-teal-700 shadow-3xs"
                                                    : "bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100 hover:border-slate-300"
                                                }`}
                                              >
                                                {label}
                                              </button>
                                            );
                                          })}
                                        </div>

                                        {/* Slider Nudge controls for manually positioned doors */}
                                        {selectedRoom.doors && (selectedRoom.doors.top || selectedRoom.doors.bottom || selectedRoom.doors.left || selectedRoom.doors.right) && (
                                          <div className="mt-2.5 p-2 bg-slate-50 border border-slate-150 rounded-lg space-y-2 text-left">
                                            <div className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">
                                              {lang === "bn" ? "↔ দরজা সরানোর স্লাইডার (Move Door):" : "↔ Adjust Door Position Slider:"}
                                            </div>
                                            
                                            {["top", "bottom", "left", "right"].map((side) => {
                                              if (!selectedRoom.doors?.[side]) return null;
                                              const doorLabel = lang === "bn"
                                                ? (side === "top" ? "উপরের দরজা" : side === "bottom" ? "নিচের দরজা" : side === "left" ? "বাম দরজা" : "ডান দরজা")
                                                : (side === "top" ? "Top Door" : side === "bottom" ? "Bottom Door" : side === "left" ? "Left Door" : "Right Door");
                                              
                                              const currentPos = selectedRoom.doorPositions?.[side] ?? 25;
                                              
                                              return (
                                                <div key={`slider-door-${side}`} className="space-y-0.5">
                                                  <div className="flex justify-between text-[9px] text-slate-650 font-black">
                                                    <span>{doorLabel}</span>
                                                    <span className="text-teal-700 font-mono font-black">{currentPos}%</span>
                                                  </div>
                                                  <input
                                                    type="range"
                                                    min="10"
                                                    max="90"
                                                    step="1"
                                                    value={currentPos}
                                                    onChange={(e) => {
                                                      const curPositions = selectedRoom.doorPositions || {};
                                                      handleUpdateSelectedRoom({
                                                        doorPositions: {
                                                          ...curPositions,
                                                          [side]: parseInt(e.target.value)
                                                        }
                                                      });
                                                    }}
                                                    className="w-full h-1 cursor-pointer accent-teal-600 block bg-slate-200 rounded"
                                                  />
                                                </div>
                                              );
                                            })}
                                          </div>
                                        )}
                                      </div>

                                      {/* Windows Section */}
                                      <div className="space-y-2">
                                        <div className="text-[9.5px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                          <span>🪟 {lang === "bn" ? "জানালা স্থাপন (Windows):" : "Place Windows on Walls:"}</span>
                                        </div>
                                        <div className="grid grid-cols-4 gap-1.5">
                                          {["top", "bottom", "left", "right"].map((side) => {
                                            const isDefaultWindowOnSide = !selectedRoom.windows && (
                                              (side === "top" && selectedRoom.y === 0) ||
                                              (side === "bottom" && selectedRoom.y + selectedRoom.height >= 90) ||
                                              (side === "left" && selectedRoom.x === 0) ||
                                              (side === "right" && selectedRoom.x + selectedRoom.width >= 90)
                                            );
                                            const hasWindow = selectedRoom.windows 
                                              ? (selectedRoom.windows?.[side] || false) 
                                              : isDefaultWindowOnSide;
                                              
                                            const label = lang === "bn" 
                                              ? (side === "top" ? "উপরে" : side === "bottom" ? "নিচে" : side === "left" ? "বামে" : "ডানে")
                                              : (side === "top" ? "Top" : side === "bottom" ? "Bottom" : side === "left" ? "Left" : "Right");

                                            return (
                                              <button
                                                key={`win-${side}`}
                                                type="button"
                                                onClick={() => {
                                                  const defaultWindows = selectedRoom.windows || {
                                                    top: selectedRoom.y === 0,
                                                    bottom: selectedRoom.y + selectedRoom.height >= 90,
                                                    left: selectedRoom.x === 0,
                                                    right: selectedRoom.x + selectedRoom.width >= 90
                                                  };
                                                  handleUpdateSelectedRoom({
                                                    windows: {
                                                      ...defaultWindows,
                                                      [side]: !hasWindow
                                                    }
                                                  });
                                                }}
                                                className={`py-1.5 px-1 rounded-lg text-[10px] font-bold border transition text-center cursor-pointer ${
                                                  hasWindow
                                                    ? "bg-teal-50 border-teal-300 text-teal-700 shadow-3xs"
                                                    : "bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100 hover:border-slate-300"
                                                }`}
                                              >
                                                {label}
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>

                                      {/* Reset to Default */}
                                      {(selectedRoom.doors || selectedRoom.windows) && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            handleUpdateSelectedRoom({
                                              doors: undefined,
                                              windows: undefined
                                            });
                                          }}
                                          className="w-full text-center text-[10px] text-teal-600 font-extrabold hover:underline pt-1 cursor-pointer block"
                                        >
                                          {lang === "bn" ? "পূর্বে-নির্ধারিত দরজা-জানালা রূপরেখায় ফিরে যান (Reset Placement)" : "Reset to default automatic placement"}
                                        </button>
                                      )}
                                    </div>

                                    {/* Vastu & Alignment details */}
                                    <div className="space-y-2 text-xs font-semibold">
                                      <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
                                        <span className="text-slate-500">Total Area:</span>
                                        <span className="text-teal-700 font-mono font-extrabold">
                                          {(selectedRoom.actualW * selectedRoom.actualH).toLocaleString()} sq.ft
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
                                        <span className="text-slate-500">{t.vastuZoneLabel}:</span>
                                        <span className="text-amber-800 font-bold">
                                          {selectedRoom.vastuZone}
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-center py-1.5">
                                        <span className="text-slate-500">{t.vastuLabel}:</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                          selectedRoom.vastuStatus === "excellent"
                                            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                            : "bg-amber-50 border-amber-200 text-amber-800"
                                        }`}>
                                          {selectedRoom.vastuStatus === "excellent" 
                                            ? t.vastuStatusExcellent 
                                            : t.vastuStatusGood}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 p-4">
                                      <Compass className="w-10 h-10 text-slate-400 mx-auto block mb-2 animate-spin-slow" />
                                      <p className="text-xs text-slate-500 leading-relaxed font-bold">
                                        {t.selectRoomPrompt}
                                      </p>
                                    </div>
                                    
                                    <div className="bg-teal-50/75 border border-teal-100 rounded-xl p-3.5 space-y-2 text-left">
                                      <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-extrabold text-teal-800 uppercase tracking-wider">
                                        <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                                        <span>{lang === "bn" ? "খালি লাল চিহ্নিত অংশ ব্যবহারের গাইড" : "Repurposing the Highlighted Gaps"}</span>
                                      </div>
                                      
                                      <p className="text-[10px] sm:text-[11px] text-teal-900/90 leading-relaxed font-semibold">
                                        {lang === "bn" 
                                          ? "লাল চিহ্নিত খালি অংশটি স্থাপত্য নকশায় গলি পথ (Circulation Corridor), কমন লবি এবং সিঁড়ির জন্য ব্যবহৃত হয়, যা সব রুমের সংযোগ রক্ষা করে। আপনি যেভাবে এটি যেকোনো কাজে ব্যবহার করতে পারেন:" 
                                          : "The empty gap represents the central hallway, lobby, and staircase required to connect the rooms. You can easily repurpose or occupy this space:"}
                                      </p>
                                      
                                      <ul className="list-disc list-inside text-[9.5px] sm:text-[10.5px] text-slate-700 space-y-1.5 pl-1 font-semibold">
                                        <li>
                                          <strong className="text-slate-900">{lang === "bn" ? "রুমের আকার বৃদ্ধি:" : "Resize Surrounding Rooms:"}</strong>{" "}
                                          {lang === "bn" 
                                            ? "মাস্টার বেডরুম বা কিচেন সিলেক্ট করে সাইজ ড্রপডাউন থেকে প্রস্থ (Width) বাড়ালে এই খালি স্থানটি অন্য কাজে ব্যবহৃত হয়ে যাবে।" 
                                            : "Click on the Master Bed or Kitchen, then increase their Width from the dropdown to let them expand into the gap."}
                                        </li>
                                        <li>
                                          <strong className="text-slate-900">{lang === "bn" ? "কাস্টম বাথরুম/স্টোর বসানো:" : "Create Custom Spaces:"}</strong>{" "}
                                          {lang === "bn" 
                                            ? "ঘর ও আসবাব ট্যাব থেকে 'লবি', 'স্টোর' বা 'সিঁড়ি ঘর' বানিয়ে স্লাইডার দিয়ে এই অংশে নিখুঁতভাবে বসিয়ে দিতে পারবেন।" 
                                            : "Go to the 'Rooms & Furniture' tab, create any room (like a Closet, Store, or Lobby) and slide its positions to fill the gap exactly."}
                                        </li>
                                        <li>
                                          <strong className="text-slate-900">{lang === "bn" ? "মডিফাইযোগ্য ডিফল্ট রুম:" : "Interact with Default Nodes:"}</strong>{" "}
                                          {lang === "bn" 
                                            ? "আমরা ম্যাপে 'লবি ও অভ্যন্তরীণ সিঁড়ি' এবং 'করিডোর ডাক্ট' যোগ করেছি, আপনি সেগুলোতে ক্লিক করে রিসাইজ বা ডিলিট করতে পারেন!" 
                                            : "We have rendered default 'Staircase & Lobby' and 'Safety Corridor' rooms on the canvas. Click them to resize or delete them!"}
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* TAB 3: SPACE LIST */}
                            {editorTab === "list" && (
                              <div className="space-y-4">
                                {/* SECTION 1: ADD SPACE FROM LIST */}
                                <div className="space-y-2">
                                  <div className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">
                                    {lang === "bn" ? "১. ম্যাপে নতুন ঘর যোগ করুন" : "1. Add Space from List:"}
                                  </div>
                                  
                                  {/* Grid of typical available architectural spaces */}
                                  <div className="grid grid-cols-2 gap-2 max-h-[170px] overflow-y-auto pr-1">
                                    {ROOM_TYPES.map(type => {
                                      const activeCount = rooms.filter(r => r.id.includes(type.value)).length;
                                      return (
                                        <button
                                          key={type.value}
                                          type="button"
                                          onClick={() => handleQuickAddRoomType(type.value)}
                                          className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/70 hover:border-slate-300 transition-all text-center relative group cursor-pointer shadow-3xs hover:shadow-2xs active:scale-[0.98]"
                                        >
                                          {activeCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-teal-650 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-bounce-slow">
                                              {activeCount}
                                            </span>
                                          )}
                                          <div
                                            className="w-6 h-6 rounded-full flex items-center justify-center border border-slate-250 text-slate-750 font-black text-[10px] mb-1.5 shadow-3xs"
                                            style={{ backgroundColor: type.color }}
                                          >
                                            {type.labelEn.substring(0, 1).toUpperCase()}
                                          </div>
                                          <span className="text-[11px] font-bold text-slate-800 text-center leading-tight">
                                            {lang === "bn" ? type.labelBn : type.labelEn}
                                          </span>
                                          <span className="text-[9px] text-slate-500 font-bold font-mono mt-0.5">
                                            +{type.defaultW}'×{type.defaultH}'
                                          </span>
                                        </button>
                                      );
                                    })}

                                    {/* ADD NEW FIELD ACTION CARD */}
                                    <button
                                      type="button"
                                      onClick={() => setShowAddNewFieldForm(prev => !prev)}
                                      className={`flex flex-col items-center justify-center p-3 rounded-xl border border-dashed transition-all text-center relative cursor-pointer shadow-3xs active:scale-[0.98] ${
                                        showAddNewFieldForm 
                                          ? "border-teal-500 bg-teal-50/65" 
                                          : "border-teal-300 bg-teal-50/15 hover:bg-teal-50/40 hover:border-teal-400"
                                      }`}
                                    >
                                      <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 mb-1.5 shadow-3xs border border-teal-200">
                                        <Plus className="w-3.5 h-3.5" />
                                      </div>
                                      <span className="text-[11px] font-extrabold text-teal-900 text-center leading-tight">
                                        {lang === "bn" ? "নতুন ফিল্ড" : "Add Field"}
                                      </span>
                                      <span className="text-[8px] text-teal-500 font-mono mt-0.5 opacity-80">
                                        + {lang === "bn" ? "নতুন ঘর টাইপ" : "New Room"}
                                      </span>
                                    </button>
                                  </div>

                                  {/* DYNAMIC FIELD FORM PANEL */}
                                  {showAddNewFieldForm && (
                                    <div className="bg-teal-50/60 border border-teal-200/80 rounded-xl p-3.5 space-y-3 shadow-3xs animate-fade-in my-2">
                                      <div className="flex justify-between items-center pb-1.5 border-b border-teal-200/40">
                                        <h5 className="text-[10px] font-extrabold text-teal-905 uppercase tracking-wider flex items-center gap-1.5">
                                          <Plus className="w-3.5 h-3.5" />
                                          {lang === "bn" ? "নতুন ফিল্ড কাস্টমাইজ করুন:" : "Customize New Field:"}
                                        </h5>
                                        <button 
                                          type="button" 
                                          onClick={() => setShowAddNewFieldForm(false)}
                                          className="text-teal-600 hover:text-rose-600 text-[9px] font-bold uppercase tracking-wider cursor-pointer transition-colors"
                                        >
                                          {lang === "bn" ? "বন্ধ করুন" : "Close"}
                                        </button>
                                      </div>

                                      <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                          <label className="text-[9px] text-slate-500 uppercase tracking-wide font-extrabold block">
                                            {lang === "bn" ? "বাংলা নাম:" : "Bengali Name:"}
                                          </label>
                                          <input 
                                            type="text" 
                                            value={newFieldNameBn}
                                            onChange={(e) => setNewFieldNameBn(e.target.value)}
                                            placeholder={lang === "bn" ? "যেমন: রান্নাঘর" : "e.g., রান্নাঘর"}
                                            className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-xs outline-none focus:border-teal-500 font-bold shadow-4xs"
                                          />
                                        </div>
                                        <div className="space-y-1">
                                          <label className="text-[9px] text-slate-500 uppercase tracking-wide font-extrabold block">
                                            {lang === "bn" ? "ইংরেজি নাম:" : "English Name:"}
                                          </label>
                                          <input 
                                            type="text" 
                                            value={newFieldNameEn}
                                            onChange={(e) => setNewFieldNameEn(e.target.value)}
                                            placeholder={lang === "bn" ? "যেমন: Kitchen" : "e.g., Kitchen"}
                                            className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-xs outline-none focus:border-teal-500 font-bold shadow-4xs"
                                          />
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                          <label className="text-[9px] text-slate-500 uppercase tracking-wide font-extrabold block">
                                            {lang === "bn" ? "প্রস্থ (Width):" : "Default Width:"}
                                          </label>
                                          <select
                                            value={newFieldDefaultW}
                                            onChange={(e) => setNewFieldDefaultW(parseInt(e.target.value))}
                                            className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs outline-none font-bold shadow-4xs cursor-pointer"
                                          >
                                            {Array.from({ length: 35 }, (_, i) => i + 4).map((num) => (
                                              <option key={num} value={num}>
                                                {num} {lang === "bn" ? "ফুট" : "ft"}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                        <div className="space-y-1">
                                          <label className="text-[9px] text-slate-500 uppercase tracking-wide font-extrabold block">
                                            {lang === "bn" ? "দৈর্ঘ্য (Length/Height):" : "Default Length:"}
                                          </label>
                                          <select
                                            value={newFieldDefaultH}
                                            onChange={(e) => setNewFieldDefaultH(parseInt(e.target.value))}
                                            className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs outline-none font-bold shadow-4xs cursor-pointer"
                                          >
                                            {Array.from({ length: 35 }, (_, i) => i + 4).map((num) => (
                                              <option key={num} value={num}>
                                                {num} {lang === "bn" ? "ফুট" : "ft"}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                      </div>

                                      <div className="space-y-1.5">
                                        <span className="text-[9px] text-slate-500 uppercase tracking-wide font-extrabold block">
                                          {lang === "bn" ? "কার্ডের ব্যাকগ্রাউন্ড কালার:" : "Card Accent Color:"}
                                        </span>
                                        <div className="flex gap-1.5 flex-wrap">
                                          {[
                                            "#fee2e2", // light red
                                            "#fef3c7", // light yellow
                                            "#ecfdf5", // light green
                                            "#ffedd5", // light orange
                                            "#e0f2fe", // light blue
                                            "#faf5ff", // light purple
                                            "#f1f5f9", // light slate
                                            "#ecfeff", // light cyan
                                          ].map((c) => (
                                            <button
                                              key={c}
                                              type="button"
                                              onClick={() => setNewFieldColor(c)}
                                              className="w-5.5 h-5.5 rounded-full border cursor-pointer transition-transform hover:scale-110 shrink-0 relative flex items-center justify-center shadow-4xs"
                                              style={{ backgroundColor: c, borderColor: newFieldColor === c ? "#0f766e" : "#e2e8f0" }}
                                            >
                                              {newFieldColor === c && <span className="w-1.5 h-1.5 rounded-full bg-teal-800" />}
                                            </button>
                                          ))}
                                        </div>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={handleAddNewSpaceTypeField}
                                        className="w-full bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-[11px] font-black uppercase tracking-wider py-1.5 rounded-lg shadow-sm transition h-8 flex items-center justify-center gap-1.5 cursor-pointer"
                                      >
                                        <Plus className="w-3.5 h-3.5" />
                                        {lang === "bn" ? "তালিকায় যুক্ত করুন" : "Add Field to List"}
                                      </button>
                                    </div>
                                  )}
                                </div>

                                {/* SECTION 2: CONFIGURE ACTIVE SPACES */}
                                <div className="space-y-2 pt-2 border-t border-slate-150">
                                  <div className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider flex justify-between items-center">
                                    <span>{lang === "bn" ? "২. ম্যাপে থাকা ঘরগুলোর মাপ এডিট করুন" : "2. Edit Active Blueprint Fields:"}</span>
                                    <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">
                                      {rooms.length} {lang === "bn" ? "টি সক্রিয়" : "active"}
                                    </span>
                                  </div>

                                  {rooms.length === 0 ? (
                                    <div className="text-center py-6 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                      <p className="text-[11px] font-bold text-slate-450">
                                        {lang === "bn" 
                                          ? "উপরের তালিকা থেকে যেকোনো ঘরে ক্লিক করে ম্যাপে যোগ করুন।" 
                                          : "No active fields. Click any space above to add it to your 2D map!"}
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="max-h-[300px] overflow-y-auto space-y-3 pr-1">
                                      {rooms.map(room => {
                                        const isSelected = selectedRoom?.id === room.id;
                                        return (
                                          <div
                                            key={room.id}
                                            className={`p-3 rounded-xl border transition-all ${
                                              isSelected
                                                ? "bg-slate-50/90 border-slate-400 shadow-sm ring-1 ring-slate-800/10"
                                                : "bg-white border-slate-200 hover:border-slate-350"
                                            }`}
                                            onClick={() => setSelectedRoom(room)}
                                          >
                                            {/* Header Row */}
                                            <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-100">
                                              <div className="flex items-center gap-1.5">
                                                <span
                                                  className="w-2.5 h-2.5 rounded-full border border-slate-400 shrink-0"
                                                  style={{ backgroundColor: room.colorHex }}
                                                />
                                                <input
                                                  type="text"
                                                  value={lang === "bn" ? room.nameBn : room.nameEn}
                                                  onChange={(e) => {
                                                    const val = e.target.value;
                                                    setRooms(prev => prev.map(r => r.id === room.id ? {
                                                      ...r,
                                                      nameEn: lang === "en" ? val : r.nameEn,
                                                      nameBn: lang === "bn" ? val : r.nameBn
                                                    } : r));
                                                  }}
                                                  onClick={(e) => e.stopPropagation()}
                                                  placeholder={lang === "bn" ? "নাম পরিবর্তন" : "Change Label"}
                                                  className="font-black text-xs bg-transparent border-b border-transparent hover:border-slate-300 focus:border-teal-500 px-1 py-0.5 text-slate-800 outline-none w-32 placeholder-slate-400"
                                                />
                                              </div>
                                              <div className="flex items-center gap-1">
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteRoom(room.id);
                                                  }}
                                                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-md hover:bg-slate-100 transition-all cursor-pointer"
                                                  title="Delete Room"
                                                >
                                                  <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                              </div>
                                            </div>

                                            {/* Size Controller row */}
                                            <div className="grid grid-cols-2 gap-2 mt-2 text-[11px]" onClick={(e) => e.stopPropagation()}>
                                              {/* Width Control */}
                                              <div className="space-y-1">
                                                <span className="text-[9px] text-slate-500 font-extrabold tracking-wide block uppercase">
                                                  {lang === "bn" ? "প্রস্থ (Width):" : "Width:"}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      const newW = Math.max(4, room.actualW - 1);
                                                      const buildableW = Math.max(10, plotWidth - 2 * setbacks.side);
                                                      const pctW = Math.min(100, Math.max(10, (newW / buildableW) * 100));
                                                      setRooms(prev => prev.map(r => r.id === room.id ? { ...r, actualW: newW, width: pctW } : r));
                                                    }}
                                                    className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-800 border border-slate-200 cursor-pointer"
                                                  >
                                                    -
                                                  </button>
                                                  <select
                                                    value={room.actualW}
                                                    onChange={(e) => {
                                                      const newW = parseInt(e.target.value);
                                                      const buildableW = Math.max(10, plotWidth - 2 * setbacks.side);
                                                      const pctW = Math.min(100, Math.max(10, (newW / buildableW) * 100));
                                                      setRooms(prev => prev.map(r => r.id === room.id ? { ...r, actualW: newW, width: pctW } : r));
                                                    }}
                                                    className="flex-1 bg-white border border-slate-250 rounded h-5 text-[10px] px-0.5 font-extrabold text-center text-slate-800 outline-none"
                                                  >
                                                    {Array.from({ length: 35 }, (_, i) => i + i < 5 ? 4 + i : 4 + i).map(num => (
                                                      <option key={num} value={num}>{num} ft</option>
                                                    ))}
                                                  </select>
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      const newW = Math.min(40, room.actualW + 1);
                                                      const buildableW = Math.max(10, plotWidth - 2 * setbacks.side);
                                                      const pctW = Math.min(100, Math.max(10, (newW / buildableW) * 100));
                                                      setRooms(prev => prev.map(r => r.id === room.id ? { ...r, actualW: newW, width: pctW } : r));
                                                    }}
                                                    className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-800 border border-slate-200 cursor-pointer"
                                                  >
                                                    +
                                                  </button>
                                                </div>
                                              </div>

                                              {/* Height Control */}
                                              <div className="space-y-1">
                                                <span className="text-[9px] text-slate-500 font-extrabold tracking-wide block uppercase">
                                                  {lang === "bn" ? "দৈর্ঘ্য (Length):" : "Length:"}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      const newH = Math.max(4, room.actualH - 1);
                                                      const buildableH = Math.max(10, plotDepth - setbacks.front - setbacks.rear);
                                                      const pctH = Math.min(100, Math.max(10, (newH / buildableH) * 100));
                                                      setRooms(prev => prev.map(r => r.id === room.id ? { ...r, actualH: newH, height: pctH } : r));
                                                    }}
                                                    className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-800 border border-slate-200 cursor-pointer"
                                                  >
                                                    -
                                                  </button>
                                                  <select
                                                    value={room.actualH}
                                                    onChange={(e) => {
                                                      const newH = parseInt(e.target.value);
                                                      const buildableH = Math.max(10, plotDepth - setbacks.front - setbacks.rear);
                                                      const pctH = Math.min(100, Math.max(10, (newH / buildableH) * 100));
                                                      setRooms(prev => prev.map(r => r.id === room.id ? { ...r, actualH: newH, height: pctH } : r));
                                                    }}
                                                    className="flex-1 bg-white border border-slate-250 rounded h-5 text-[10px] px-0.5 font-extrabold text-center text-slate-800 outline-none"
                                                  >
                                                    {Array.from({ length: 35 }, (_, i) => i + 4).map(num => (
                                                      <option key={num} value={num}>{num} ft</option>
                                                    ))}
                                                  </select>
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      const newH = Math.min(40, room.actualH + 1);
                                                      const buildableH = Math.max(10, plotDepth - setbacks.front - setbacks.rear);
                                                      const pctH = Math.min(100, Math.max(10, (newH / buildableH) * 100));
                                                      setRooms(prev => prev.map(r => r.id === room.id ? { ...r, actualH: newH, height: pctH } : r));
                                                    }}
                                                    className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-800 border border-slate-200 cursor-pointer"
                                                  >
                                                    +
                                                  </button>
                                                </div>
                                              </div>

                                              {/* Qty Control */}
                                              <div className="space-y-1">
                                                <span className="text-[9px] text-slate-500 font-extrabold tracking-wide block uppercase">
                                                  {lang === "bn" ? "পরিমাণ (Qty):" : "Qty:"}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      const roomTypeKey = getRoomTypeKeyFromId(room.id);
                                                      const roomsOfType = rooms.filter(r => getRoomTypeKeyFromId(r.id) === roomTypeKey);
                                                      handleUpdateRoomQty(room, Math.max(1, roomsOfType.length - 1));
                                                    }}
                                                    className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-800 border border-slate-200 cursor-pointer"
                                                  >
                                                    -
                                                  </button>
                                                  <span className="flex-1 text-center font-black text-xs text-slate-800 min-w-[20px]">
                                                    {rooms.filter(r => getRoomTypeKeyFromId(r.id) === getRoomTypeKeyFromId(room.id)).length}
                                                  </span>
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      const roomTypeKey = getRoomTypeKeyFromId(room.id);
                                                      const roomsOfType = rooms.filter(r => getRoomTypeKeyFromId(r.id) === roomTypeKey);
                                                      handleUpdateRoomQty(room, Math.min(6, roomsOfType.length + 1));
                                                    }}
                                                    className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-800 border border-slate-200 cursor-pointer"
                                                  >
                                                    +
                                                  </button>
                                                </div>
                                              </div>

                                              {/* Zone Control */}
                                              <div className="space-y-1">
                                                <span className="text-[9px] text-slate-500 font-extrabold tracking-wide block uppercase">
                                                  {lang === "bn" ? "স্থান/দিক (Vastu):" : "Vastu Zone:"}
                                                </span>
                                                <select
                                                  value={room.vastuZone}
                                                  onChange={(e) => {
                                                    const zoneVal = e.target.value;
                                                    const zoneInfo = ZONES_MAP.find(z => z.value === zoneVal) || ZONES_MAP[0];
                                                    setRooms(prev => prev.map(r => r.id === room.id ? {
                                                      ...r,
                                                      vastuZone: zoneVal,
                                                      vastuStatus: zoneInfo.status as any,
                                                      x: zoneInfo.x,
                                                      y: zoneInfo.y
                                                    } : r));
                                                  }}
                                                  className="w-full bg-white border border-slate-250 rounded h-5 text-[10px] px-1 font-bold text-slate-705 outline-none"
                                                >
                                                  {ZONES_MAP.map(opt => (
                                                    <option key={opt.value} value={opt.value}>
                                                      {lang === "bn" ? opt.labelBn : opt.value.split(" ")[0]}
                                                    </option>
                                                  ))}
                                                </select>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>

                                {/* SECTION 3: FURNITURE PLACEMENT */}
                                <div className="space-y-2 pt-3 border-t border-slate-200">
                                  <div className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">
                                    {lang === "bn" ? "৩. ম্যাপে আসবাবপত্র যোগ করুন (Spawn)" : "3. Place Furniture on Map:"}
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
                                    {[
                                      { type: "bed", nameEn: "Double Bed", nameBn: "ডাবল খাট" },
                                      { type: "wardrobe", nameEn: "Wardrobe", nameBn: "আলমারি" },
                                      { type: "dining_table", nameEn: "Dining Table", nameBn: "ডাইনিং টেবিল" },
                                      { type: "chair", nameEn: "Chair", nameBn: "চেয়ার" },
                                      { type: "basin", nameEn: "Washbasin", nameBn: "ওয়াশবেসিন" },
                                      { type: "sofa", nameEn: "Sofa Set", nameBn: "সোফা" },
                                      { type: "toilet", nameEn: "Toilet Commode", nameBn: "টয়লেট" },
                                      { type: "tv_cabinet", nameEn: "TV Cabinet", nameBn: "টিভি ক্যাবিনেট" },
                                      { type: "plant", nameEn: "Indoor Plant", nameBn: "ইনডোর গাছ" },
                                      { type: "coffee_table", nameEn: "Coffee Table", nameBn: "কফি টেবিল" }
                                    ].map((fItem) => (
                                      <button
                                        key={fItem.type}
                                        type="button"
                                        onClick={() => handleAddFurniture(fItem.type as any)}
                                        className="bg-white border border-slate-205 hover:border-teal-500 hover:bg-teal-50/20 rounded-xl p-1.5 flex items-center gap-2 text-left transition-all cursor-pointer shadow-3xs hover:shadow-2xs group"
                                      >
                                        <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center group-hover:bg-teal-100/50 transition-colors shrink-0">
                                          <div className="w-5 h-5">
                                            <FurnitureDisplayIcon type={fItem.type} isSelected={false} />
                                          </div>
                                        </div>
                                        <div className="min-w-0">
                                          <div className="text-[10.5px] font-black text-slate-800 tracking-wide leading-tight group-hover:text-teal-700 truncate">
                                            {lang === "bn" ? fItem.nameBn : fItem.nameEn}
                                          </div>
                                          <div className="text-[8px] text-slate-400 font-mono">
                                            + {lang === "bn" ? "বসান" : "Add item"}
                                          </div>
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* SECTION 4: ACTIVE FURNITURE EDIT PANEL */}
                                <div className="space-y-2 pt-3 border-t border-slate-200">
                                  <div className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">
                                    {lang === "bn" ? "৪. সিলেক্টেড আসবাবপত্র কাস্টমাইজ করুন" : "4. Edit Selected Furniture:"}
                                  </div>
                                  
                                  {(() => {
                                    const selectedFurniture = furnitureItems.find(f => f.id === selectedFurnitureId);
                                    if (!selectedFurniture) {
                                      return (
                                        <div className="bg-slate-100/80 border border-slate-200 rounded-xl p-3 text-center text-slate-500 text-[10.5px] font-medium leading-relaxed font-sans">
                                          {lang === "bn"
                                            ? "ম্যাপের যেকোনো আসবাবপত্র ক্লিক করে সিলেক্ট করুন; তারপর সেটি ঘোরানো, সরানো বা ডিলিট করার অপশন দেখতে পাবেন।"
                                            : "Click any furniture on the map above to select and unlock fine adjustments, rotation or deletion!"}
                                        </div>
                                      );
                                    }

                                    return (
                                      <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-3.5 shadow-xs animate-fadeIn">
                                        <div className="flex justify-between items-center bg-teal-50/50 p-2 rounded-lg border border-teal-100">
                                          <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 shrink-0">
                                              <FurnitureDisplayIcon type={selectedFurniture.type} isSelected={true} />
                                            </div>
                                            <div>
                                              <div className="text-[8px] font-semibold text-teal-850 uppercase tracking-widest">
                                                {lang === "bn" ? "সিলেক্টেড আসবাবপত্র" : "Selected Item"}
                                              </div>
                                              <h5 className="text-[11px] font-black text-slate-800 max-w-[150px] truncate">
                                                {lang === "bn" ? selectedFurniture.nameBn : selectedFurniture.nameEn}
                                              </h5>
                                            </div>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => setSelectedFurnitureId(null)}
                                            className="text-[9px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded cursor-pointer"
                                          >
                                            {lang === "bn" ? "বন্ধ" : "Close"}
                                          </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setFurnitureItems(prev => prev.map(f => f.id === selectedFurnitureId ? { ...f, rotation: (f.rotation + 90) % 360 } : f));
                                            }}
                                            className="flex-1 py-1.5 px-2 bg-teal-600 hover:bg-teal-550 text-white rounded-lg text-[10px] font-black tracking-wider uppercase flex items-center justify-center gap-1 shadow-sm hover:scale-101 transition cursor-pointer"
                                          >
                                            <RotateCcw className="w-3 h-3" />
                                            <span>{lang === "bn" ? "ঘোরান" : "Rotate +90°"}</span>
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => {
                                              setFurnitureItems(prev => prev.filter(f => f.id !== selectedFurnitureId));
                                              setSelectedFurnitureId(null);
                                            }}
                                            className="flex-1 py-1.5 px-2 bg-rose-50 border border-rose-150 text-rose-700 hover:bg-rose-100 rounded-lg text-[10px] font-black tracking-wider uppercase flex items-center justify-center gap-1 shadow-xs hover:scale-101 transition cursor-pointer"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                            <span>{lang === "bn" ? "মুছুন" : "Delete"}</span>
                                          </button>
                                        </div>

                                        <div className="space-y-3 border-t border-slate-100 pt-3">
                                          <div className="space-y-1">
                                            <div className="flex justify-between text-[9.5px] font-bold text-slate-600">
                                              <span>{lang === "bn" ? "আড়াআড়ি সরান (X):" : "Nudge Horizontal (X):"}</span>
                                              <span className="font-mono text-teal-650 font-black">{Math.round(selectedFurniture.x)}%</span>
                                            </div>
                                            <input
                                              type="range"
                                              min="2"
                                              max="98"
                                              value={selectedFurniture.x}
                                              onChange={(e) => {
                                                const updatedX = Number(e.target.value);
                                                setFurnitureItems(prev => prev.map(f => f.id === selectedFurnitureId ? { ...f, x: updatedX } : f));
                                              }}
                                              className="w-full accent-teal-600 cursor-pointer h-1 bg-slate-200 rounded"
                                            />
                                          </div>

                                          <div className="space-y-1">
                                            <div className="flex justify-between text-[9.5px] font-bold text-slate-600">
                                              <span>{lang === "bn" ? "খাড়া সরান (Y):" : "Nudge Vertical (Y):"}</span>
                                              <span className="font-mono text-teal-650 font-black">{Math.round(selectedFurniture.y)}%</span>
                                            </div>
                                            <input
                                              type="range"
                                              min="2"
                                              max="98"
                                              value={selectedFurniture.y}
                                              onChange={(e) => {
                                                const updatedY = Number(e.target.value);
                                                setFurnitureItems(prev => prev.map(f => f.id === selectedFurnitureId ? { ...f, y: updatedY } : f));
                                              }}
                                              className="w-full accent-teal-600 cursor-pointer h-1 bg-slate-200 rounded"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })()}
                                </div>
                              </div>
                            )}

                            {/* TAB 4: DRAW MANUALLY */}
                            {editorTab === "draw" && (
                              <div className="space-y-4">
                                <div className="bg-teal-50 border border-teal-150/80 rounded-xl p-3 text-xs text-teal-900 space-y-1 shadow-2xs">
                                  <p className="font-bold flex items-center gap-1.5 text-teal-850">
                                    <Sparkles className="w-4 h-4 text-teal-600 animate-pulse shrink-0" />
                                    <span>{lang === "bn" ? "ম্যানুয়াল স্কেচ গাইড" : "Manual Draw Guide:"}</span>
                                  </p>
                                  <p className="text-[11px] leading-relaxed text-slate-600 font-medium font-sans">
                                    {lang === "bn" 
                                      ? "উপরে ম্যাপ কার্ডের ভেতরের যেকোনো জায়গায় মাউস দিয়ে ড্র্যাগ করে বা টাচ স্ক্রিনে হাত দিয়ে সরাসরি দেয়াল, পার্টিশন বা নতুন কোন রুমের স্কেচ আঁকুন।"
                                      : "Click-and-drag or touch inside the visual layout card above to sketch walls, custom partitions, or any layout design manually!"}
                                  </p>
                                </div>

                                {/* Tools selector */}
                                <div className="space-y-4">
                                  {/* Line/Stroke Tools Sub-Group */}
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 block">
                                      {lang === "bn" ? "আঁকার পদ্ধতি নির্বাচন করুন:" : "Select Drawing Method:"}
                                    </label>
                                    <div className="grid grid-cols-3 gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => setDrawTool("pencil")}
                                        className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                                          drawTool === "pencil"
                                            ? "bg-slate-800 border-slate-800 text-white shadow-md scale-[1.02]"
                                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-350 shadow-3xs"
                                        }`}
                                      >
                                        <Paintbrush className="w-4 h-4 mb-0.5 text-teal-500" />
                                        <span className="text-[10px] font-extrabold">{lang === "bn" ? "মুক্তহস্ত" : "Freehand"}</span>
                                        <span className="text-[8px] text-slate-500 font-mono mt-0.5 opacity-80">{lang === "bn" ? "পেন্সিল" : "Pencil"}</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => setDrawTool("straight")}
                                        className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                                          drawTool === "straight"
                                            ? "bg-slate-800 border-slate-800 text-white shadow-md scale-[1.02]"
                                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-350 shadow-3xs"
                                        }`}
                                      >
                                        <Slash className="w-4 h-4 mb-0.5 rotate-45 text-indigo-500 shrink-0" />
                                        <span className="text-[10px] font-extrabold">{lang === "bn" ? "সোজা লাইন" : "Straight"}</span>
                                        <span className="text-[8px] text-slate-500 font-mono mt-0.5 opacity-80">{lang === "bn" ? "রুলার" : "Line"}</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => setDrawTool("curve")}
                                        className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                                          drawTool === "curve"
                                            ? "bg-slate-800 border-slate-800 text-white shadow-md scale-[1.02]"
                                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-350 shadow-3xs"
                                        }`}
                                      >
                                        <Spline className="w-4 h-4 mb-0.5 text-purple-500 shrink-0" />
                                        <span className="text-[10px] font-extrabold">{lang === "bn" ? "বক্ররেখা" : "Curve"}</span>
                                        <span className="text-[8px] text-slate-500 font-mono mt-0.5 opacity-80">{lang === "bn" ? "আর্ক" : "Curved"}</span>
                                      </button>
                                    </div>
                                  </div>

                                  {/* Annotation Helpers Sub-Group */}
                                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">
                                      {lang === "bn" ? "লেবেল ও এডিটিং:" : "Annotations & Modifications:"}
                                    </label>
                                    <div className="grid grid-cols-2 gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => setDrawTool("text")}
                                        className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                                          drawTool === "text"
                                            ? "bg-slate-800 border-slate-800 text-white shadow-md scale-[1.02]"
                                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-350 shadow-3xs"
                                        }`}
                                      >
                                        <Type className="w-4 h-4 mb-0.5 text-sky-500 hover:scale-105 shrink-0" />
                                        <span className="text-[10px] font-extrabold">{lang === "bn" ? "লেবেল" : "Label"}</span>
                                        <span className="text-[8px] text-slate-500 mt-0.5 opacity-80">{lang === "bn" ? "নাম" : "Add Text"}</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => setDrawTool("eraser")}
                                        className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                                          drawTool === "eraser"
                                            ? "bg-slate-800 border-slate-800 text-white shadow-md scale-[1.02]"
                                            : "bg-white border-slate-250 text-slate-750 hover:bg-slate-50 hover:border-slate-350 shadow-3xs"
                                        }`}
                                      >
                                        <Eraser className="w-4 h-4 mb-0.5 text-rose-500 hover:scale-105 shrink-0" />
                                        <span className="text-[10px] font-extrabold">{lang === "bn" ? "মুছুন" : "Eraser"}</span>
                                        <span className="text-[8px] text-slate-500 mt-0.5 opacity-80">{lang === "bn" ? "মুছে ফেলুন" : "Wipe Stroke"}</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* Conditional Settings based on Active Stroke Mode */}
                                {(drawTool === "pencil" || drawTool === "straight" || drawTool === "curve") && (
                                  <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-3 shadow-2xs">
                                    {/* Color Select */}
                                    <div className="space-y-1.5">
                                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                                        {lang === "bn" ? "লাইনের কালার বা রং:" : "Stroke Line Color:"}
                                      </span>
                                      <div className="flex gap-2">
                                        {[
                                          { hex: "#1e293b", name: "Wall (কালো)" },
                                          { hex: "#0d9488", name: "Teal (নীল)" },
                                          { hex: "#e11d48", name: "Setback (লাল)" },
                                          { hex: "#0284c7", name: "Water (আকাশি)" },
                                          { hex: "#15803d", name: "Garden (সবুজ)" }
                                        ].map((c) => (
                                          <button
                                            key={c.hex}
                                            type="button"
                                            onClick={() => setStrokeColor(c.hex)}
                                            style={{ backgroundColor: c.hex }}
                                            className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                                              strokeColor === c.hex
                                                ? "border-slate-800 scale-110 ring-2 ring-slate-800/10"
                                                : "border-transparent hover:scale-105"
                                            }`}
                                            title={c.name}
                                          />
                                        ))}
                                      </div>
                                    </div>

                                    {/* Brush Thickness */}
                                    <div className="space-y-1">
                                      <div className="flex justify-between text-[10px] font-bold text-slate-505">
                                        <span>{lang === "bn" ? "লাইনের পুরুত্ব (Line Weight):" : "Line Thickness:"}</span>
                                        <span className="font-mono text-teal-700">{strokeWidth}px</span>
                                      </div>
                                      <input
                                        type="range"
                                        min="1"
                                        max="8"
                                        value={strokeWidth}
                                        onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                                        className="w-full accent-slate-800 h-1.5 rounded-lg bg-slate-100 outline-none cursor-pointer"
                                      />
                                    </div>
                                  </div>
                                )}

                                {drawTool === "text" && (
                                  <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2 pb-3.5 shadow-2xs">
                                    <div className="space-y-1">
                                      <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 block">
                                        {lang === "bn" ? "লেবেলের লেখা লিখুন:" : "Write Label text:"}
                                      </label>
                                      <input
                                        type="text"
                                        value={textInput}
                                        onChange={(e) => setTextInput(e.target.value)}
                                        placeholder={lang === "bn" ? "যেমন- বারান্দা, লন, ওয়ান" : "e.g. Balcony, Lawn, Store..."}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-slate-500 font-bold"
                                      />
                                    </div>
                                    <p className="text-[9.5px] leading-relaxed text-slate-400 font-medium">
                                      {lang === "bn"
                                        ? "💡 নাম লিখে ম্যাপের ওপরে সরাসরি যেকোনো জায়গায় ক্লিক করলেই লেবেল বসে যাবে।"
                                        : "💡 Type text, then click anywhere on the layout blueprint above to place your label."}
                                    </p>
                                  </div>
                                )}

                                {/* Undo / Clear Options */}
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setManualStrokes(prev => prev.slice(0, -1));
                                    }}
                                    disabled={manualStrokes.length === 0}
                                    className="flex-1 py-1.5 px-3 bg-white border border-slate-200 text-slate-750 hover:bg-slate-50 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-2xs disabled:opacity-45 h-9 cursor-pointer"
                                  >
                                    <Undo className="w-3.5 h-3.5" />
                                    <span>{lang === "bn" ? "১ ধাপ পূর্বাবস্থায়" : "Undo Stroke"}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setManualStrokes([]);
                                      setManualTexts([]);
                                    }}
                                    disabled={manualStrokes.length === 0 && manualTexts.length === 0}
                                    className="flex-1 py-1.5 px-3 bg-rose-50 border border-rose-150 text-rose-700 hover:bg-rose-100/60 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-2xs disabled:opacity-45 h-9 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>{lang === "bn" ? "সব মুছুন" : "Clear Draft"}</span>
                                  </button>
                                </div>

                                {/* SECTION 3: FURNITURE PLACEMENT IN DRAW MODE */}
                                <div className="space-y-2 pt-3 border-t border-slate-200">
                                  <div className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">
                                    {lang === "bn" ? "৩. ম্যাপে আসবাবপত্র যোগ করুন (Spawn)" : "3. Place Furniture on Map:"}
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
                                    {[
                                      { type: "bed", nameEn: "Double Bed", nameBn: "ডাবল খাট" },
                                      { type: "wardrobe", nameEn: "Wardrobe", nameBn: "আলমারি" },
                                      { type: "dining_table", nameEn: "Dining Table", nameBn: "ডাইনিং টেবিল" },
                                      { type: "chair", nameEn: "Chair", nameBn: "চেয়ার" },
                                      { type: "basin", nameEn: "Washbasin", nameBn: "ওয়াশবেসিন" },
                                      { type: "sofa", nameEn: "Sofa Set", nameBn: "সোফা" },
                                      { type: "toilet", nameEn: "Toilet Commode", nameBn: "টয়লেট" },
                                      { type: "tv_cabinet", nameEn: "TV Cabinet", nameBn: "টিভি ক্যাবিনেট" },
                                      { type: "plant", nameEn: "Indoor Plant", nameBn: "ইনডোর গাছ" },
                                      { type: "coffee_table", nameEn: "Coffee Table", nameBn: "কফি টেবিল" }
                                    ].map((fItem) => (
                                      <button
                                        key={fItem.type}
                                        type="button"
                                        onClick={() => handleAddFurniture(fItem.type as any)}
                                        className="bg-white border border-slate-205 hover:border-teal-500 hover:bg-teal-50/20 rounded-xl p-1.5 flex items-center gap-2 text-left transition-all cursor-pointer shadow-3xs hover:shadow-2xs group"
                                      >
                                        <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center group-hover:bg-teal-100/50 transition-colors shrink-0">
                                          <div className="w-5 h-5">
                                            <FurnitureDisplayIcon type={fItem.type} isSelected={false} />
                                          </div>
                                        </div>
                                        <div className="min-w-0">
                                          <div className="text-[10.5px] font-black text-slate-800 tracking-wide leading-tight group-hover:text-teal-700 truncate">
                                            {lang === "bn" ? fItem.nameBn : fItem.nameEn}
                                          </div>
                                          <div className="text-[8px] text-slate-400 font-mono">
                                            + {lang === "bn" ? "বসান" : "Add item"}
                                          </div>
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* SECTION 4: ACTIVE FURNITURE EDIT PANEL IN DRAW MODE */}
                                <div className="space-y-2 pt-3 border-t border-slate-200">
                                  <div className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">
                                    {lang === "bn" ? "৪. সিলেক্টেড আসবাবপত্র কাস্টমাইজ করুন" : "4. Edit Selected Furniture:"}
                                  </div>
                                  
                                  {(() => {
                                    const selectedFurniture = furnitureItems.find(f => f.id === selectedFurnitureId);
                                    if (!selectedFurniture) {
                                      return (
                                        <div className="bg-slate-100/80 border border-slate-200 rounded-xl p-3 text-center text-slate-500 text-[10.5px] font-medium leading-relaxed font-sans">
                                          {lang === "bn"
                                            ? "ম্যাপের যেকোনো আসবাবপত্র ক্লিক করে সিলেক্ট করুন; তারপর সেটি ঘোরানো, সরানো বা ডিলিট করার অপশন দেখতে পাবেন।"
                                            : "Click any furniture on the map above to select and unlock fine adjustments, rotation or deletion!"}
                                        </div>
                                      );
                                    }

                                    return (
                                      <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-3.5 shadow-xs animate-fadeIn">
                                        <div className="flex justify-between items-center bg-teal-50/50 p-2 rounded-lg border border-teal-100">
                                          <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 shrink-0">
                                              <FurnitureDisplayIcon type={selectedFurniture.type} isSelected={true} />
                                            </div>
                                            <div>
                                              <div className="text-[8px] font-semibold text-teal-850 uppercase tracking-widest">
                                                {lang === "bn" ? "সিলেক্টেড আসবাবপত্র" : "Selected Item"}
                                              </div>
                                              <h5 className="text-[11px] font-black text-slate-800 max-w-[150px] truncate">
                                                {lang === "bn" ? selectedFurniture.nameBn : selectedFurniture.nameEn}
                                              </h5>
                                            </div>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => setSelectedFurnitureId(null)}
                                            className="text-[9px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded cursor-pointer"
                                          >
                                            {lang === "bn" ? "বন্ধ" : "Close"}
                                          </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setFurnitureItems(prev => prev.map(f => f.id === selectedFurnitureId ? { ...f, rotation: (f.rotation + 90) % 360 } : f));
                                            }}
                                            className="flex-1 py-1.5 px-2 bg-teal-600 hover:bg-teal-550 text-white rounded-lg text-[10px] font-black tracking-wider uppercase flex items-center justify-center gap-1 shadow-sm hover:scale-101 transition cursor-pointer"
                                          >
                                            <RotateCcw className="w-3 h-3" />
                                            <span>{lang === "bn" ? "ঘোরান" : "Rotate +90°"}</span>
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => {
                                              setFurnitureItems(prev => prev.filter(f => f.id !== selectedFurnitureId));
                                              setSelectedFurnitureId(null);
                                            }}
                                            className="flex-1 py-1.5 px-2 bg-rose-50 border border-rose-150 text-rose-700 hover:bg-rose-100 rounded-lg text-[10px] font-black tracking-wider uppercase flex items-center justify-center gap-1 shadow-xs hover:scale-101 transition cursor-pointer"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                            <span>{lang === "bn" ? "মুছুন" : "Delete"}</span>
                                          </button>
                                        </div>

                                        <div className="space-y-3 border-t border-slate-100 pt-3">
                                          <div className="space-y-1">
                                            <div className="flex justify-between text-[9.5px] font-bold text-slate-605 flex-wrap">
                                              <span>{lang === "bn" ? "আড়াআড়ি সরান (X):" : "Nudge Horizontal (X):"}</span>
                                              <span className="font-mono text-teal-650 font-black">{Math.round(selectedFurniture.x)}%</span>
                                            </div>
                                            <input
                                              type="range"
                                              min="2"
                                              max="98"
                                              value={selectedFurniture.x}
                                              onChange={(e) => {
                                                const updatedX = Number(e.target.value);
                                                setFurnitureItems(prev => prev.map(f => f.id === selectedFurnitureId ? { ...f, x: updatedX } : f));
                                              }}
                                              className="w-full accent-teal-600 cursor-pointer h-1 bg-slate-200 rounded"
                                            />
                                          </div>

                                          <div className="space-y-1">
                                            <div className="flex justify-between text-[9.5px] font-bold text-slate-605 flex-wrap">
                                              <span>{lang === "bn" ? "খাড়া সরান (Y):" : "Nudge Vertical (Y):"}</span>
                                              <span className="font-mono text-teal-650 font-black">{Math.round(selectedFurniture.y)}%</span>
                                            </div>
                                            <input
                                              type="range"
                                              min="2"
                                              max="98"
                                              value={selectedFurniture.y}
                                              onChange={(e) => {
                                                const updatedY = Number(e.target.value);
                                                setFurnitureItems(prev => prev.map(f => f.id === selectedFurnitureId ? { ...f, y: updatedY } : f));
                                              }}
                                              className="w-full accent-teal-600 cursor-pointer h-1 bg-slate-200 rounded"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })()}
                                </div>
                              </div>
                            )}


                          </div>

                          {/* Action Buttons Link */}
                          <div className="space-y-2 border-t border-slate-200 pt-3">
                            
                            {/* Reset button if layout is customized */}
                            {isCustomized && (
                              <button
                                onClick={handleResetToTemplate}
                                className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] py-1.5 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>{t.resetLayoutBtn}</span>
                              </button>
                            )}

                            <button
                              id="ask-expert-btn-ph1"
                              onClick={() => {
                                setActivePhase(5);
                                setTimeout(() => handleGetExpertAdvice(), 150);
                              }}
                              className="w-full bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white font-extrabold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-transform"
                            >
                              <Sparkles className="w-4 h-4" />
                              {t.askExpertBtn}
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>
              )}

              {/* PHASE 3: 3D VISUALIZATION PROMPT GENERATOR */}
              {activePhase === 3 && (
                <motion.div
                  key="phase3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-6 flex-1 flex flex-col justify-between"
                >
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Palette className="w-5 h-5 text-teal-600" />
                        {t.generate3DTitle}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        These structural descriptions are fully prepared with photorealistic cues (lighting, volumetric ambiance, architectural material ratios) optimized specifically for Imagen 3/Midjourney generators.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Exterior Prompts Card holds glassmorphism */}
                      <div className="rounded-xl bg-white border border-slate-200 p-4 space-y-3 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-teal-500/5 to-transparent pointer-events-none" />
                        <div className="space-y-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-750">
                            {t.exteriorPrompt}
                          </span>
                          <p className="text-xs text-slate-700 font-mono leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200 max-h-[160px] overflow-y-auto">
                            {exteriorPromptText}
                          </p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(exteriorPromptText, true)}
                          className="self-end bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 active:scale-95 transition-all"
                        >
                          {copiedExterior ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600">{t.copied}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>{t.copyPrompt}</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Interior Mood Prompts Card */}
                      <div className="rounded-xl bg-white border border-slate-200 p-4 space-y-3 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/5 to-transparent pointer-events-none" />
                        <div className="space-y-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-750">
                            {t.interiorPrompt} ({selectedRoom ? selectedRoom.nameEn : "Active Space"})
                          </span>
                          <p className="text-xs text-slate-700 font-mono leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200 max-h-[160px] overflow-y-auto">
                            {interiorPromptText}
                          </p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(interiorPromptText, false)}
                          className="self-end bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 active:scale-95 transition-all"
                        >
                          {copiedInterior ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-400">{t.copied}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>{t.copyPrompt}</span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>

                    {/* Highly Professional visual simulated 3D rendering representation with glass and rainbow styling */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4 overflow-hidden relative shadow-inner">
                      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col justify-center items-center text-center p-4 z-10 rounded-2xl">
                        <div className="p-3.5 rounded-full bg-gradient-to-tr from-rose-500 via-amber-400 via-emerald-400 to-indigo-500 p-[1.5px] mb-3">
                          <div className="bg-white rounded-full p-3.5 shadow-sm">
                            <Sparkles className="w-6 h-6 text-teal-650" />
                          </div>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800">
                          {lang === "bn" ? "৩ডি মডেল রেন্ডারিং মক-আপ সক্রিয় রয়েছে" : "3D Generative Mockups Integrated"}
                        </h4>
                        <p className="text-[11px] text-slate-500 max-w-md leading-relaxed mt-1">
                          {lang === "bn" 
                            ? "রঙের সঠিক বিন্যাস ও বাস্তু অনুযায়ী ঘরের বাহ্যিক ছবি দেখতে প্রম্পটগুলি জেনারেটরে ব্যবহার করুন বা এআই কনসালটেশন রিপোর্ট অপশন ব্যবহার করুন।"
                            : "Copy above prompts onto your Imagen 3 generator to see custom material textures, structural details, and daylight flow."}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-3 blur-md opacity-25">
                        <img 
                          src="https://picsum.photos/seed/villa/300/200" 
                          alt="Layout representation" 
                          className="rounded-lg object-cover w-full h-[110px]" 
                          referrerPolicy="no-referrer"
                        />
                        <img 
                          src="https://picsum.photos/seed/luxuryspace/300/200" 
                          alt="Interior representation" 
                          className="rounded-lg object-cover w-full h-[110px]" 
                          referrerPolicy="no-referrer"
                        />
                        <img 
                          src="https://picsum.photos/seed/architect/300/200" 
                          alt="Concept design" 
                          className="rounded-lg object-cover w-full h-[110px]" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* PHASE 4: MATERIAL & EXPENSE ESTIMATION */}
              {activePhase === 4 && budget && (
                <motion.div
                  key="phase4"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-6 flex-1 flex flex-col justify-between"
                >
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-teal-600" />
                        {t.costBreakdownHeading}
                      </h3>
                      <p className="text-xs text-slate-550 mt-1">
                        Sourced entirely from classical civil engineering load calculations & materials equations for G+{floors === "duplex" ? "1" : "0"} masonry buildings.
                      </p>
                    </div>

                    {/* Total Estimated Budget (Visual representation) inside Phase 4 */}
                    <div className="rounded-2xl p-[1px] bg-gradient-to-r from-teal-500 via-emerald-500 via-sky-500 to-indigo-600 overflow-hidden shadow-sm relative group">
                      <div className="bg-[#f8fafc] rounded-[15px] p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block select-none">
                            {t.totalEstCost}
                          </span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-teal-800 via-emerald-700 to-indigo-800 bg-clip-text text-transparent font-mono">
                              ₹{budget?.totalCost.toLocaleString("en-IN")}
                            </span>
                            <span className="text-xs text-slate-500 font-bold">INR</span>
                          </div>
                        </div>

                        {/* Configurable Rate controller inside card */}
                        <div className="flex-1 max-w-md space-y-2">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-500 font-semibold">{t.baseRateLabel}</span>
                            <span className="text-teal-700 font-mono font-extrabold">₹{baseRate} / sq.ft</span>
                          </div>
                          <input
                            id="base-rate-slider-ph4"
                            type="range"
                            min="1300"
                            max="3500"
                            step="50"
                            value={baseRate}
                            onChange={(e) => setBaseRate(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-slate-300 rounded-lg cursor-pointer accent-teal-600 outline-none transition-all"
                          />
                          <div className="flex justify-between text-[10px] text-slate-400 font-bold font-sans">
                            <span>Semi-Furnished (₹1300)</span>
                            <span>Premium (₹3500)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Column 1: Grey Structure Breakdown */}
                      <div className="space-y-3.5">
                        <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                          <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded bg-teal-600" />
                            {t.greyStructure}
                          </span>
                          <span className="text-sm font-extrabold text-teal-600 font-mono">
                            ₹{budget.greyStructureTotal.toLocaleString("en-IN")}
                          </span>
                        </div>

                         <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                          {budget.greyBreakdown.map((item) => {
                            const isExpanded = expandedCalcId === `grey_${item.id}`;
                            const breakdown = getItemCalculationBreakdown(item.id, true);
                            return (
                              <div
                                key={item.id}
                                onClick={() => setExpandedCalcId(isExpanded ? null : `grey_${item.id}`)}
                                className={`bg-white hover:bg-slate-50 rounded-xl p-3 border cursor-pointer transition-all space-y-1.5 relative overflow-hidden group ${
                                  isExpanded ? "border-teal-500 ring-2 ring-teal-500/10" : "border-slate-200 shadow-sm"
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex items-start gap-2">
                                    <HelpCircle className={`w-3.5 h-3.5 mt-0.5 transition-colors ${isExpanded ? "text-teal-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                                    <div>
                                      <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                                        {lang === "bn" ? item.nameBn : item.nameEn}
                                      </h4>
                                      <span className="inline-block text-[10px] font-bold text-slate-500 mt-0.5 font-mono">
                                        {lang === "bn" ? item.quantityStrBn : item.quantityStrEn}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-xs font-bold text-teal-600 font-mono block">
                                      ₹{item.cost.toLocaleString("en-IN")}
                                    </span>
                                    <span className="inline-block text-[9px] text-slate-500 font-bold">
                                      {item.percentage}% of total
                                    </span>
                                  </div>
                                </div>
                                <p className="text-[10px] text-slate-500 leading-normal font-light">
                                  {lang === "bn" ? item.detailsBn : item.detailsEn}
                                </p>

                                {isExpanded && breakdown && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="bg-slate-50 border border-teal-500/20 text-[10px] text-teal-800 rounded-lg p-2.5 font-sans mt-2 space-y-1 block leading-relaxed shadow-inner"
                                  >
                                    <span className="font-extrabold block text-slate-800 border-b border-slate-200 pb-1 select-none">
                                      🧮 {lang === "bn" ? "গণনা সূত্র ও বিবরণ" : "Formula & Dynamic Breakdown"}
                                    </span>
                                    <div className="whitespace-pre-line text-slate-650 text-[10px] mt-1 font-mono leading-relaxed">
                                      {breakdown}
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Column 2: Finishing Works Breakdown */}
                      <div className="space-y-3.5">
                        <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                          <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded bg-pink-600" />
                            {t.finishingWorks}
                          </span>
                          <span className="text-sm font-extrabold text-pink-600 font-mono">
                            ₹{budget.finishingWorksTotal.toLocaleString("en-IN")}
                          </span>
                        </div>

                        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                          {budget.finishingBreakdown.map((item) => {
                            const isExpanded = expandedCalcId === `finish_${item.id}`;
                            const breakdown = getItemCalculationBreakdown(item.id, false);
                            return (
                              <div
                                key={item.id}
                                onClick={() => setExpandedCalcId(isExpanded ? null : `finish_${item.id}`)}
                                className={`bg-white hover:bg-slate-50 rounded-xl p-3 border cursor-pointer transition-all space-y-1.5 relative overflow-hidden group ${
                                  isExpanded ? "border-pink-500 ring-2 ring-pink-500/10" : "border-slate-200 shadow-sm"
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex items-start gap-2">
                                    <HelpCircle className={`w-3.5 h-3.5 mt-0.5 transition-colors ${isExpanded ? "text-pink-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                                    <div>
                                      <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                                        {lang === "bn" ? item.nameBn : item.nameEn}
                                      </h4>
                                      <span className="inline-block text-[10px] font-bold text-slate-500 mt-0.5 font-mono">
                                        {lang === "bn" ? item.quantityStrBn : item.quantityStrEn}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-xs font-bold text-pink-600 font-mono block">
                                      ₹{item.cost.toLocaleString("en-IN")}
                                    </span>
                                    <span className="inline-block text-[9px] text-slate-500 font-bold">
                                      {item.percentage}% of total
                                    </span>
                                  </div>
                                </div>
                                <p className="text-[10px] text-slate-550 leading-normal font-light">
                                  {lang === "bn" ? item.detailsBn : item.detailsEn}
                                </p>

                                {isExpanded && breakdown && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="bg-slate-50 border border-pink-500/20 text-[10px] text-pink-850 rounded-lg p-2.5 font-sans mt-2 space-y-1 block leading-relaxed shadow-inner"
                                  >
                                    <span className="font-extrabold block text-slate-800 border-b border-slate-200 pb-1 select-none">
                                      🧮 {lang === "bn" ? "গণনা সূত্র ও বিবরণ" : "Formula & Dynamic Breakdown"}
                                    </span>
                                    <div className="whitespace-pre-line text-slate-650 text-[10px] mt-1 font-mono leading-relaxed">
                                      {breakdown}
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>
              )}

              {/* PHASE 5: INTERIOR & HOME DECORATION PLANNING */}
              {activePhase === 5 && (
                <motion.div
                  key="phase5"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-6 flex-1 flex flex-col justify-between"
                >
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-850 flex items-center gap-2">
                        <Palette className="w-5 h-5 text-teal-600" />
                        {t.interiorTitle}
                      </h3>
                      <p className="text-xs text-slate-550 mt-1 leading-relaxed">
                        Acting as a Senior Interior Architect. Double check advice metrics matched precisely to your active room component selection: <strong className="text-teal-600 font-bold">{selectedRoom ? (lang === "bn" ? selectedRoom.nameBn : selectedRoom.nameEn) : "All Spaces"}</strong>.
                      </p>
                    </div>

                    {/* Grid of Roadmap domains */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Domain 1: Space Utilization */}
                      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-2">
                        <h4 className="text-xs font-bold text-teal-600 flex items-center gap-1.5 uppercase">
                          <span className="w-2 h-2 rounded-full bg-teal-600" />
                          {t.flowTraffic}
                        </h4>
                        <p className="text-xs text-slate-650 leading-relaxed font-light">
                          {selectedRoom 
                            ? (lang === "bn" 
                              ? `রুম সাইজ ${selectedRoom.actualW}x${selectedRoom.actualH} ফুট। চলাচলের পথ সহজ রাখতে খাট ঘরের পশ্চিম বা দক্ষিণ দেয়ালে রাখুন। দরজা খোলার ব্যাসার্ধ পরিষ্কার রাখুন এবং জানালা দিয়ে আলো প্রবেশে বাধা ছাড়াই আলমারি রাখুন।`
                              : `Room footprint is ${selectedRoom.actualW}x${selectedRoom.actualH} ft. Position heavy beds or fixtures against South/West walls. Keep traffic passages at least 3.2 ft wide near balconies to ensure kinetic ventilation flow.`)
                            : (lang === "bn"
                              ? "প্রধান হল রুম থেকে অন্যান্য রুমে যাতায়াতের পথ সবসময় ৩.৫ ফুট চওড়া রাখুন। ড্রইং স্পেসের মাঝখানে কোনো আসবাবপত্র না রেখে সাইডে সোফা সেট এবং ডাইনিং সাজান।"
                              : "Maintain a clear Central passage (Brahmasthan) of 3.5 ft to optimize flow between master zones, kitchen corridors, and stairs.")}
                        </p>
                      </div>

                      {/* Domain 2: Color Palette */}
                      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-2">
                        <h4 className="text-xs font-bold text-teal-600 flex items-center gap-1.5 uppercase">
                          <span className="w-2 h-2 rounded-full bg-pink-600" />
                          {t.colorPalette}
                        </h4>
                        
                        <div className="flex gap-2 py-1">
                          <div className="flex-1 flex flex-col items-center gap-1 min-w-[50px]">
                            <div className="w-full h-8 rounded-md border border-slate-200" style={{backgroundColor: '#e6dfd2'}} />
                            <span className="text-[9px] font-mono font-bold text-slate-500">#e6dfd2</span>
                          </div>
                          <div className="flex-1 flex flex-col items-center gap-1 min-w-[50px]">
                            <div className="w-full h-8 rounded-md border border-slate-200" style={{backgroundColor: '#2c3539'}} />
                            <span className="text-[9px] font-mono font-bold text-slate-500">#2c3539</span>
                          </div>
                          <div className="flex-1 flex flex-col items-center gap-1 min-w-[50px]">
                            <div className="w-full h-8 rounded-md border border-slate-200" style={{backgroundColor: '#987654'}} />
                            <span className="text-[9px] font-mono font-bold text-slate-500">#987654</span>
                          </div>
                          <div className="flex-1 flex flex-col items-center gap-1 min-w-[50px]">
                            <div className="w-full h-8 rounded-md border border-slate-200 bg-gradient-to-r from-teal-400 via-pink-400 to-indigo-400" />
                            <span className="text-[9px] font-mono font-bold text-slate-500">Rainbow</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-650 leading-relaxed font-light">
                          {lang === "bn"
                            ? "প্রাইমারি ওয়াল ফিনিশ ক্রিম-হোয়াইট, সেকেন্ডারি ল্যাকার ওয়ালনাট কাঠ এবং রামধনু কাচের গ্লাস ডেকোরেশন দিয়ে আভিজাত্য ফুটিয়ে তোলার আধুনিক ভারতীয় পরামর্শ।"
                            : "Primary coating in warm Alabaster Whites, secondary in organic Matte Charcoal, accented with glowing spectral glass fixtures to achieve the liquid glass theme."}
                        </p>
                      </div>

                      {/* Domain 3: Lighting Plan */}
                      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-2">
                        <h4 className="text-xs font-bold text-teal-600 flex items-center gap-1.5 uppercase">
                          <span className="w-2 h-2 rounded-full bg-yellow-600" />
                          {t.lightingPlan}
                        </h4>
                        <p className="text-xs text-slate-650 leading-relaxed font-light">
                          {lang === "bn"
                            ? "১০ ওয়াটের ৩০০০কে (Warm COB) ডাউনলাইট দিয়ে চারপাশ উজ্জ্বল করুন। পড়ার টেবিলে বা রান্না স্ল্যাবে সরাসরি আলো দিতে টাস্ক লাইটিং এবং পিলারে আকর্ষণ বাড়াতে স্পটলাইট লাগান।"
                            : "Install 3000K Warm COB recessed downlights in coffered ceilings. Deploy focused task lighting under kitchen cabinets and vertical washlights to emphasize textured brickwork."}
                        </p>
                      </div>

                      {/* Domain 4: Material Textures */}
                      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-2">
                        <h4 className="text-xs font-bold text-teal-600 flex items-center gap-1.5 uppercase">
                          <span className="w-2 h-2 rounded-full bg-emerald-600" />
                          {t.materialsTextures}
                        </h4>
                        <p className="text-xs text-slate-650 leading-relaxed font-light">
                          {lang === "bn"
                            ? "মেঝের জন্য রাজস্থানি বা ইতালীয় মার্বেল পাথর, প্রধান ফার্নিচারে গর্জন প্লাই এবং সোফার ও কুশনে হালকা প্রাকৃতিক সুতির সুতি বা মখমল আবরণ ব্যবহারের চমৎকার রোডম্যাপ।"
                            : "Flooring with Makrana white marble or premium large Kajaria vitreous tiles. Teakwood doors framing coupled with high grade sand-finish plaster coats."}
                        </p>
                      </div>

                    </div>

                    {/* Core AI chat consultation output rendering block */}
                    {isLoadingConsultation ? (
                      <div className="rounded-xl border border-teal-200 bg-white p-6 text-center space-y-3 shadow-md">
                        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-xs text-teal-600 font-bold animate-pulse">
                          {t.consultingAi}
                        </p>
                      </div>
                    ) : consultationText ? (
                      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-md">
                        <div className="flex justify-between items-center pb-2.5 border-b border-slate-200">
                          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-teal-500" />
                            {t.expertReportTitle}
                          </span>
                          <button 
                            onClick={() => {
                              setConsultationText("");
                              scrollTo({ top: 0, behavior: 'smooth' });
                            }} 
                            className="text-[10px] bg-slate-50 text-slate-600 hover:text-slate-850 border border-slate-200 px-2 py-1 rounded shadow-sm transition"
                          >
                            Clear Report
                          </button>
                        </div>
                        
                        {/* Rendered Consultation text formatted with markdown support with beautiful style spacing */}
                        <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans max-h-[300px] overflow-y-auto pr-2 space-y-2">
                          {consultationText}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center shadow-sm">
                        <button
                          id="ask-expert-btn"
                          onClick={handleGetExpertAdvice}
                          className="w-full bg-gradient-to-r from-teal-500 via-emerald-500 via-pink-400 to-indigo-500 p-[1.5px] rounded-xl active:scale-95 transition-transform"
                        >
                          <div className="bg-white hover:bg-slate-50 rounded-[11px] py-3 px-4 flex items-center justify-center gap-2 shadow-inner border border-slate-200">
                            <Sparkles className="w-4 h-4 text-teal-600" />
                            <span className="text-xs font-bold text-teal-700">
                              {t.askExpertBtn}
                            </span>
                          </div>
                        </button>
                      </div>
                    )}

                  </div>
                </motion.div>
              )}

              {/* PHASE 6: PAINT EXPENSE CALCULATOR AND ESTIMATOR */}
              {activePhase === 6 && (
                <motion.div
                  key="phase6"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-6 flex-1 flex flex-col justify-between"
                >
                  {(() => {
                    // Constants & Pricing based on premium-ness
                    const coveragePerLiter = paintQuality === "budget" ? 120 : paintQuality === "standard" ? 140 : 155;
                    const baseLiterPrice = paintQuality === "budget" ? 180 : paintQuality === "standard" ? 310 : 520;
                    
                    const qtyPerKgPutty = 15; // 2 coats
                    const qtyPerLiterPrimer = 120; // 1 coat
                    
                    const puttyPricePerKg = 25;
                    const primerPricePerLiter = 140;

                    // Compute Interior wall area + ceiling area
                    let totalInteriorCeilingArea = 0;
                    let totalInteriorWallArea = 0;

                    if (rooms.length > 0) {
                      rooms.forEach(r => {
                        const ceilingArea = r.actualW * r.actualH;
                        const perimeter = 2 * (r.actualW + r.actualH);
                        const grossWallArea = perimeter * customCeilingHeight;
                        const netWallArea = grossWallArea * 0.85; // Less standard doors/windows

                        totalInteriorCeilingArea += ceilingArea;
                        totalInteriorWallArea += netWallArea;
                      });

                      // Account for duplex G+1 heights
                      if (floors === "duplex") {
                        totalInteriorCeilingArea *= 2;
                        totalInteriorWallArea *= 2;
                      }
                    } else {
                      // Fallback estimate matching global budget size metrics
                      const bUpArea = budget?.builtUpArea || (plotWidth * plotDepth * 0.7);
                      totalInteriorCeilingArea = bUpArea;
                      totalInteriorWallArea = bUpArea * 3;
                    }

                    const overallInteriorArea = totalInteriorCeilingArea + totalInteriorWallArea;

                    // Exterior Building block perimeter calculations
                    const horizontalWidthFt = plotWidth - (setbacks.side * 2);
                    const verticalDepthFt = plotDepth - (setbacks.front + setbacks.rear);
                    const buildingPerimeter = Math.max(20, 2 * (horizontalWidthFt + verticalDepthFt));
                    const buildingHeight = customCeilingHeight * (floors === "duplex" ? 2 : 1);
                    const totalExteriorWallArea = buildingPerimeter * buildingHeight * 0.85; // Doors/garage subtraction

                    let activePaintableArea = 0;
                    if (paintType === "interior") {
                      activePaintableArea = overallInteriorArea;
                    } else if (paintType === "exterior") {
                      activePaintableArea = totalExteriorWallArea;
                    } else {
                      activePaintableArea = overallInteriorArea + totalExteriorWallArea;
                    }

                    // Recipe requirements
                    const requiredPaintLiters = Math.max(1, Math.round((activePaintableArea * paintCoats) / coveragePerLiter));
                    const requiredPuttyKg = includePutty ? Math.max(1, Math.round(activePaintableArea / qtyPerKgPutty)) : 0;
                    const requiredPrimerLiters = includePrimer ? Math.max(1, Math.round(activePaintableArea / qtyPerLiterPrimer)) : 0;

                    // Total prices breakdown
                    const paintMaterialCost = requiredPaintLiters * baseLiterPrice;
                    const puttyMaterialCost = requiredPuttyKg * puttyPricePerKg;
                    const primerMaterialCost = requiredPrimerLiters * primerPricePerLiter;
                    const totalMaterialCost = paintMaterialCost + puttyMaterialCost + primerMaterialCost;

                    const totalLaborCost = Math.round(activePaintableArea * paintLaborRate);
                    const totalCost = totalMaterialCost + totalLaborCost;

                    return (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-bold text-slate-850 flex items-center gap-2">
                            <Paintbrush className="w-5 h-5 text-teal-600 animate-pulse animate-duration-1000" />
                            {lang === "bn" ? "রঙের মোট খরচ ও বিবরণ গণনা (Phase 6)" : "Paint Expense & Quality Estimator (Phase 6)"}
                          </h3>
                          <p className="text-xs text-slate-550 mt-1 leading-relaxed">
                            {lang === "bn"
                              ? "আপনার ডিজাইন করা আধুনিক লেআউট এবং ঘরের পরিমাপের ওপর ভিত্তি করে রিয়েল-টাইম নিখুঁত রঙের খরচ এস্টিমেট করুন।"
                              : "Generate high-accuracy material quantity recipes and labor cost structures relative to your active structural architecture plan."}
                          </p>
                        </div>

                        {/* Paint Scope Level Tabs */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-3xs">
                          <div className="space-y-1 text-center md:text-left">
                            <label className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider block">
                              {lang === "bn" ? "রং করার ক্ষেত্র বা পরিধি নির্বাচন করুন:" : "Determine Painting Scope:"}
                            </label>
                            <span className="text-[11px] text-slate-550 font-medium">
                              {lang === "bn"
                                ? "কোন অংশের খরচ দেখতে চান পরিবর্তন করুন"
                                : "Choose parts of the building to paint"}
                            </span>
                          </div>
                          
                          <div className="flex bg-slate-200/60 rounded-xl p-1 w-full md:w-auto self-stretch md:self-auto shrink-0 border border-slate-250">
                            <button
                              type="button"
                              onClick={() => setPaintType("interior")}
                              className={`flex-1 md:flex-initial px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                                paintType === "interior" ? "bg-white text-teal-700 shadow-sm" : "text-slate-650 hover:text-slate-900"
                              }`}
                            >
                              {lang === "bn" ? "শুধুমাত্র ভেতরের দেয়াল" : "Interior Layout"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setPaintType("exterior")}
                              className={`flex-1 md:flex-initial px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                                paintType === "exterior" ? "bg-white text-teal-700 shadow-sm" : "text-slate-655 hover:text-slate-900"
                              }`}
                            >
                              {lang === "bn" ? "শুধুমাত্র বাইরের দেয়াল" : "Exterior Fasad"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setPaintType("all")}
                              className={`flex-1 md:flex-initial px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                                paintType === "all" ? "bg-white text-teal-700 shadow-sm" : "text-slate-655 hover:text-slate-900"
                              }`}
                            >
                              {lang === "bn" ? "সম্পূর্ণ বাড়ি (উভয়)" : "Both (Entire App)"}
                            </button>
                          </div>
                        </div>

                        {/* Two Columns Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                          
                          {/* Controls Columns */}
                          <div className="lg:col-span-7 space-y-5">
                            
                            {/* Card-1: Controls Panel */}
                            <div className="space-y-5 bg-white border border-slate-205 rounded-2xl p-5 shadow-3xs">
                              
                              {/* Quality select list */}
                              <div className="space-y-3">
                                <label className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider block">
                                  {lang === "bn" ? "ইন্ডিয়ান স্ট্যান্ডার্ড রঙের কোয়ালিটি শ্রেণী:" : "Paint Quality & Premium Level:"}
                                </label>
                                
                                <div className="space-y-3">
                                  {[
                                    {
                                      id: "budget",
                                      titleEn: "Economy Matte (Distemper Paint)",
                                      titleBn: "ইকোনমি ম্যাট (অ্যাক্রিলিক ডিস্টেম্পার)",
                                      descEn: "Standard budget friendly option. Ideal for first coating or renting properties. Tractor Distemper class.",
                                      descBn: "সাশ্রয়ী দামের জনপ্রিয় সাধারণ ফিনিশ। প্রথম প্রলেপ বা ভাড়া বাড়ির জন্য আদর্শ মানের পেইন্ট।",
                                      priceRate: "₹180 /L",
                                      coverage: "~120 sq.ft/L"
                                    },
                                    {
                                      id: "standard",
                                      titleEn: "Standard Washable (Premium Acrylic Emulsion)",
                                      titleBn: "স্ট্যান্ডার্ড ধোয়াযোগ্য (প্রিমিয়াম ইমালশন)",
                                      descEn: "Mid-level premium washability, dirt repellent and smooth. Apcolite or EasyClean grade finish.",
                                      descBn: "মাঝারি বাজেটের সবচেয়ে জনপ্রিয় উজ্জ্বল দীর্ঘস্থায়ী পেইন্ট। ভেজা কাপড় দিয়ে দাগ পরিষ্কার করা যায়।",
                                      priceRate: "₹310 /L",
                                      coverage: "~140 sq.ft/L"
                                    },
                                    {
                                      id: "premium",
                                      titleEn: "Luxury Silk High-Gloss (Royale Premium)",
                                      titleBn: "লাক্সারি সিল্ক হাই-গ্লস (রয়্যাল প্রিমিয়াম)",
                                      descEn: "Top premium high sheen feel, maximum stain guard, extreme lifespan. Royale Silk grade paint.",
                                      descBn: "অভিজাত রাজকীয় গ্লস ফিনিশ, শতভাগ জল প্রতিরোধী এবং সর্বোচ্চ স্থায়ী বিলাসবহুল ফিনিশ।",
                                      priceRate: "₹520 /L",
                                      coverage: "~155 sq.ft/L"
                                    },
                                  ].map((tier) => (
                                    <button
                                      key={tier.id}
                                      type="button"
                                      onClick={() => setPaintQuality(tier.id as any)}
                                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                                        paintQuality === tier.id
                                          ? "border-teal-500 bg-teal-50/20 ring-1 ring-teal-500 shadow-3xs"
                                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/30 bg-white shadow-4xs"
                                      }`}
                                    >
                                      <div className="pt-0.5">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                          paintQuality === tier.id ? "border-teal-600 bg-teal-600 text-white" : "border-slate-300 bg-white"
                                        }`}>
                                          {paintQuality === tier.id && <Check className="w-2.5 h-2.5 stroke-[3.5]" />}
                                        </div>
                                      </div>
                                      
                                      <div className="flex-1 min-w-0 pr-1">
                                        <div className="flex justify-between items-center gap-2">
                                          <h4 className="text-xs font-black text-slate-800 tracking-wide">
                                            {lang === "bn" ? tier.titleBn : tier.titleEn}
                                          </h4>
                                          <span className="text-[10px] bg-slate-100 font-mono font-extrabold text-slate-700 px-1.5 py-0.5 rounded shrink-0">
                                            {tier.priceRate}
                                          </span>
                                        </div>
                                        <p className="text-[10.5px] text-slate-500 mt-1 leading-relaxed">
                                          {lang === "bn" ? tier.descBn : tier.descEn}
                                        </p>
                                        <div className="text-[9.5px] text-teal-650 font-mono font-black mt-1.5">
                                          {lang === "bn" ? `লিটার প্রতি কভারেজ এলাকা: ${tier.coverage}` : `Est. Coverage: ${tier.coverage}`}
                                        </div>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Putty and Primer addons */}
                              <div className="space-y-3 pt-4 border-t border-slate-150">
                                <label className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider block">
                                  {lang === "bn" ? "প্রস্তুতিমূলক স্তর সংযোজন (Addons):" : "Core Base Preparation Additives:"}
                                </label>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <button
                                    type="button"
                                    onClick={() => setIncludePutty(prev => !prev)}
                                    className={`p-3.5 rounded-xl border flex items-center gap-3 transition-colors cursor-pointer text-left ${
                                      includePutty ? "border-teal-500 bg-teal-50/10" : "border-slate-200 bg-white"
                                    }`}
                                  >
                                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition ${
                                      includePutty ? "bg-teal-600 border-teal-600 text-white" : "bg-white border-slate-300"
                                    }`}>
                                      {includePutty && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="text-[11.5px] font-black text-slate-800">
                                        {lang === "bn" ? "পুটি কোট (Wall Putty)" : "Acrylic Putty"}
                                      </div>
                                      <div className="text-[9px] text-slate-400 font-bold truncate">
                                        {lang === "bn" ? "মসূণ ফিনিশিং (+₹৮/ফুট)" : "Smooth Base (+₹8/sq.ft)"}
                                      </div>
                                    </div>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setIncludePrimer(prev => !prev)}
                                    className={`p-3.5 rounded-xl border flex items-center gap-3 transition-colors cursor-pointer text-left ${
                                      includePrimer ? "border-teal-500 bg-teal-50/10" : "border-slate-200 bg-white"
                                    }`}
                                  >
                                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition ${
                                      includePrimer ? "bg-teal-600 border-teal-600 text-white" : "bg-white border-slate-300"
                                    }`}>
                                      {includePrimer && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="text-[11.5px] font-black text-slate-800">
                                        {lang === "bn" ? "প্রাইমার স্তর (Wall Primer)" : "Acrylic Primer"}
                                      </div>
                                      <div className="text-[9px] text-slate-400 font-bold truncate">
                                        {lang === "bn" ? "স্থায়িত্ব ও উজ্জ্বলতা (+₹৫/ফুট)" : "Stain Guard (+₹5/sq.ft)"}
                                      </div>
                                    </div>
                                  </button>
                                </div>
                              </div>

                              {/* Fine adjustments: coats, heights, labor */}
                              <div className="space-y-4 pt-4 border-t border-slate-150">
                                
                                {/* Coats slider */}
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                                    <span>{lang === "bn" ? "রঙের প্রলেপ বা কোট সংখ্যা:" : "Number of Paint Coats:"}</span>
                                    <span className="font-mono text-teal-600 text-xs font-black">{paintCoats} {lang === "bn" ? "বার" : "Layers"}</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="1"
                                    max="3"
                                    step="1"
                                    value={paintCoats}
                                    onChange={(e) => setPaintCoats(Number(e.target.value))}
                                    className="w-full accent-teal-600 cursor-pointer h-1 bg-slate-200 rounded"
                                  />
                                </div>

                                {/* Custom ceiling height slider */}
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                                    <span>{lang === "bn" ? "সিলিং উচ্চতা (Ceiling Height):" : "Ceiling Height (Feet):"}</span>
                                    <span className="font-mono text-teal-600 text-xs font-black">{customCeilingHeight} ft</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="8"
                                    max="14"
                                    step="1"
                                    value={customCeilingHeight}
                                    onChange={(e) => setCustomCeilingHeight(Number(e.target.value))}
                                    className="w-full accent-teal-600 cursor-pointer h-1 bg-slate-200 rounded"
                                  />
                                </div>

                                {/* Custom labor rate slider */}
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                                    <span>{lang === "bn" ? "রংমিস্ত্রি বা পেইন্টিং লেবার চার্জ:" : "Painting Labor Fee (₹/sq.ft):"}</span>
                                    <span className="font-mono text-teal-600 text-xs font-black">₹{paintLaborRate} /sq.ft</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="6"
                                    max="25"
                                    step="1"
                                    value={paintLaborRate}
                                    onChange={(e) => setPaintLaborRate(Number(e.target.value))}
                                    className="w-full accent-teal-600 cursor-pointer h-1 bg-slate-200 rounded"
                                  />
                                </div>

                              </div>

                            </div>

                            {/* Info Box */}
                            <div className="bg-emerald-50 border border-emerald-150/80 rounded-2xl p-4 text-xs text-slate-650 flex gap-3">
                              <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                              <div className="space-y-1">
                                <p className="font-bold text-emerald-850">
                                  {lang === "bn" ? "পেশাদার টিপস ও কভারেজ গণনা" : "Standard Coverage Calculation Tip:"}
                                </p>
                                <p className="leading-relaxed text-[10.5px]">
                                  {lang === "bn"
                                    ? "মোট দেওয়ালের ক্ষেত্রফল থেকে দরজা ও জানালার পরিমাপ সাধারণত ১৫% মাইনাস করে এই নিখুঁত সূত্র-ভিত্তিক গণনা সম্পন্ন করা হয়েছে।"
                                    : "This estimator employs real civil metrics deducts 15% wall surface area matching doors & windows configuration precisely to active dimensions."}
                                </p>
                              </div>
                            </div>

                          </div>

                          {/* Summary Estimates column */}
                          <div className="lg:col-span-5 space-y-4">
                            
                            {/* Cost Banner Card */}
                            <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-950 rounded-2xl p-6 text-white shadow-md relative overflow-hidden flex flex-col items-center">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
                              <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl" />
                              
                              <span className="text-[10px] font-black tracking-widest text-emerald-300 uppercase mb-1">
                                {lang === "bn" ? "আনুমানিক পেইন্টিং বাজেট" : "Estimated Painting Budget"}
                              </span>
                              
                              <h2 className="text-3xl font-black text-white tracking-tight mb-4">
                                ₹{totalCost.toLocaleString()}
                              </h2>

                              {/* Itemized bar charts inside banner */}
                              <div className="w-full space-y-1 pb-1">
                                <div className="flex justify-between text-[9px] font-black text-slate-300">
                                  <span>{lang === "bn" ? "পণ্য সামগ্রী" : "Materials"} ({totalCost > 0 ? Math.round((totalMaterialCost/totalCost)*100) : 0}%)</span>
                                  <span>{lang === "bn" ? "পেইন্টার ফি" : "Labor Fees"} ({totalCost > 0 ? Math.round((totalLaborCost/totalCost)*100) : 0}%)</span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden flex">
                                  <div 
                                    className="h-full bg-gradient-to-r from-teal-400 to-teal-500" 
                                    style={{ width: `${totalCost > 0 ? (totalMaterialCost/totalCost)*100 : 0}%` }} 
                                  />
                                  <div 
                                    className="h-full bg-gradient-to-r from-emerald-400 to-green-500" 
                                    style={{ width: `${totalCost > 0 ? (totalLaborCost/totalCost)*100 : 0}%` }} 
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4 w-full border-t border-slate-800/80 pt-4 mt-3">
                                <div className="text-left">
                                  <span className="text-[8.5px] text-slate-400 block font-bold uppercase">{lang === "bn" ? "মোট ক্ষেত্রফল" : "Total Area"}</span>
                                  <span className="font-mono text-xs font-black text-white">{Math.round(activePaintableArea).toLocaleString()} sq.ft</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-[8.5px] text-slate-400 block font-bold uppercase">{lang === "bn" ? "লেবার রেট" : "Avg Labor"}</span>
                                  <span className="font-mono text-xs font-black text-white">₹{paintLaborRate}/sq.ft</span>
                                </div>
                              </div>
                            </div>

                            {/* Materials Recipe Detail Card */}
                            <div className="bg-white border border-slate-205 rounded-2xl p-5 shadow-3xs space-y-4">
                              <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                                {lang === "bn" ? "প্রয়োজনীয় উপকরণের তালিকা:" : "Estimated Recipe Quantities:"}
                              </h4>

                              <div className="space-y-3.5">
                                {/* Paint */}
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-7 h-7 rounded bg-teal-50 flex items-center justify-center shrink-0">
                                      <Paintbrush className="w-4 h-4 text-teal-600" />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="text-[11.5px] font-black text-slate-800 truncate">
                                        {lang === "bn" ? "ফিনিশ পেইন্ট (Premium Paint)" : "Finish Liquid Paint"}
                                      </div>
                                      <div className="text-[9px] text-slate-400 font-bold truncate">
                                        {paintQuality === "premium" ? "Premium Royale High-Sheen" : paintQuality === "standard" ? "Premium Emulsion Class" : "Matte Distemper Grade"}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <span className="font-mono font-black text-teal-650 text-xs block">
                                      {requiredPaintLiters} {lang === "bn" ? "লিটার" : "Liters"}
                                    </span>
                                    <span className="text-[9.5px] text-slate-400 font-mono font-semibold">
                                      ~₹{paintMaterialCost.toLocaleString()}
                                    </span>
                                  </div>
                                </div>

                                {/* Putty */}
                                {includePutty && (
                                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <div className="w-7 h-7 rounded bg-indigo-50 flex items-center justify-center shrink-0">
                                        <Zap className="w-4 h-4 text-indigo-600" />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="text-[11.5px] font-black text-slate-800 truncate">
                                          {lang === "bn" ? "ওয়াল পুটি পাউডার (Putty)" : "Acrylic Putty Powder"}
                                        </div>
                                        <div className="text-[9px] text-slate-400 font-bold truncate">
                                          {lang === "bn" ? "২ কোট প্রলেপ বেস" : "2 Surface Smoother Coats"}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <span className="font-mono font-black text-indigo-650 text-xs block">
                                        {requiredPuttyKg} {lang === "bn" ? "কেজি" : "Kgs"}
                                      </span>
                                      <span className="text-[9.5px] text-slate-400 font-mono font-semibold">
                                        ~₹{puttyMaterialCost.toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                )}

                                {/* Primer */}
                                {includePrimer && (
                                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <div className="w-7 h-7 rounded bg-amber-50 flex items-center justify-center shrink-0">
                                        <Droplets className="w-4 h-4 text-amber-600" />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="text-[11.5px] font-black text-slate-800 truncate">
                                          {lang === "bn" ? "ওয়াল প্রাইমার (Primer)" : "Wall Primer Undercoat"}
                                        </div>
                                        <div className="text-[9px] text-slate-400 font-bold truncate">
                                          {lang === "bn" ? "১ কোট রঙের বন্ডিং বেস" : "1 High Grip Coating"}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <span className="font-mono font-black text-amber-655 text-xs block">
                                        {requiredPrimerLiters} {lang === "bn" ? "লিটার" : "Liters"}
                                      </span>
                                      <span className="text-[9.5px] text-slate-400 font-mono font-semibold">
                                        ~₹{primerMaterialCost.toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                )}

                                {/* Painters Wages */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center shrink-0">
                                      <Check className="w-4 h-4 text-slate-600" />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="text-[11.5px] font-black text-slate-800 truncate">
                                        {lang === "bn" ? "লেবার ও পেইন্টিং কাজের মজুরি" : "Professional Labor Fees"}
                                      </div>
                                      <div className="text-[9px] text-slate-400 font-bold truncate">
                                        {lang === "bn" ? "দেওয়াল প্রস্তুতিকরণ ও পেইন্ট" : "Application & Wall prep"}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <span className="font-mono font-black text-slate-700 text-xs block">
                                      {lang === "bn" ? "পুরো সার্ভিস" : "Servicing"}
                                    </span>
                                    <span className="text-[9.5px] text-slate-400 font-mono font-semibold">
                                      ~₹{totalLaborCost.toLocaleString()}
                                    </span>
                                  </div>
                                </div>

                              </div>
                            </div>

                            {/* Room by Room Interior Breakdown (Only interior or all) */}
                            {rooms.length > 0 && paintType !== "exterior" && (
                              <div className="bg-teal-50/20 border border-teal-100 rounded-2xl p-4 shadow-3xs space-y-3">
                                <div className="flex justify-between items-center pb-2 border-b border-teal-100/60 flex-wrap gap-1">
                                  <h4 className="text-[10px] font-extrabold text-teal-850 uppercase tracking-widest flex items-center gap-1.5 min-w-0 truncate">
                                    <Columns className="w-3.5 h-3.5 text-teal-605" />
                                    <span>{lang === "bn" ? "রুম-ভিত্তিক আলাদা দেয়াল পেইন্ট হিসাব" : "Interior Room Breakdown:"}</span>
                                  </h4>
                                  <span className="text-[9px] bg-slate-150 text-slate-600 font-black font-mono px-1.5 py-0.5 rounded">
                                    {floors === "duplex" ? (lang === "bn" ? "দোতলা মোট" : "Ground + 1st") : (lang === "bn" ? "একতলা মোট" : "Ground Only")}
                                  </span>
                                </div>

                                <div className="max-h-[160px] overflow-y-auto pr-1 space-y-2">
                                  {rooms.map((rm) => {
                                    const rCeilingComp = rm.actualW * rm.actualH;
                                    const rWallComp = 2 * (rm.actualW + rm.actualH) * customCeilingHeight * 0.85;
                                    const rTotalAreaSingle = rCeilingComp + rWallComp;
                                    const multiplier = floors === "duplex" ? 2 : 1;
                                    
                                    const rmTotalAreaCombined = rTotalAreaSingle * multiplier;
                                    const rmPaintLiters = Math.max(1, Math.round((rmTotalAreaCombined * paintCoats) / coveragePerLiter));
                                    const rmPaintCostMat = rmPaintLiters * baseLiterPrice;
                                    const rmPuttyCost = includePutty ? Math.max(1, Math.round(rmTotalAreaCombined / qtyPerKgPutty)) * puttyPricePerKg : 0;
                                    const rmPrimerCost = includePrimer ? Math.max(1, Math.round(rmTotalAreaCombined / qtyPerLiterPrimer)) * primerPricePerLiter : 0;
                                    
                                    const rmTotalCost = (rmPaintCostMat + rmPuttyCost + rmPrimerCost) + (rmTotalAreaCombined * paintLaborRate);

                                    return (
                                      <div key={rm.id} className="flex justify-between items-center text-xs p-2 bg-white/80 border border-slate-100 rounded-lg shadow-4xs hover:border-teal-200 hover:bg-white transition-all">
                                        <div className="min-w-0 flex-1 pr-1">
                                          <div className="font-extrabold text-slate-800 truncate text-[11px]">
                                            {lang === "bn" ? rm.nameBn : rm.nameEn}
                                          </div>
                                          <div className="text-[9.5px] text-slate-400 font-mono font-medium">
                                            {Math.round(rm.actualW)}ft × {Math.round(rm.actualH)}ft • {Math.round(rmTotalAreaCombined)} sq.ft
                                          </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                          <span className="font-mono font-black text-teal-700 block">
                                            ₹{Math.round(rmTotalCost).toLocaleString()}
                                          </span>
                                          <span className="text-[8.5px] text-slate-400 font-bold">
                                            {rmPaintLiters} {lang === "bn" ? "লিটার রং" : "L paint"}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                          </div>

                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </section>
        )}

      </main>

      {/* Premium Footer with Developer Identity & Interactive Disclaimer */}
      <footer className="relative mt-auto w-full py-6 backdrop-blur-md bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 text-center sm:text-left">
            <p className="font-semibold text-slate-750 dark:text-slate-300">
              © 2026 Indian Property Developer & Cost Estimator. Designed & Developed by <span className="font-black text-slate-900 dark:text-slate-100">SUKANTA NANDI</span>.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDisclaimerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-amber-800 dark:text-amber-400 font-extrabold rounded-lg hover:bg-amber-100 dark:hover:bg-amber-950/45 cursor-pointer transition-all shadow-4xs text-[11px]"
              title={lang === "bn" ? "প্রযুক্তিগত দাবিত্যাগ দেখুন" : "View Technical Disclaimer"}
            >
              <span>⚠️</span>
              <span>{lang === "bn" ? "টেকনিক্যাল ডিসক্লেইমার" : "Technical Disclaimer"}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Disclaimer Modal */}
      <AnimatePresence>
        {isDisclaimerOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setIsDisclaimerOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-850 p-6 md:p-8 shadow-2xl relative overflow-hidden text-slate-800 dark:text-slate-105"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Background Accent Gradients */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center border border-amber-100 dark:border-amber-900/40 shrink-0">
                    <span className="text-lg">⚠️</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-black tracking-tight text-slate-850 dark:text-slate-50">
                      {lang === "bn" ? "প্রযুক্তিগত দাবিত্যাগ" : "Technical Disclaimer"}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                      {lang === "bn" ? "গুরুত্বপূর্ণ নোটিশ" : "Critical Safety & Algorithmic Notice"}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsDisclaimerOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4.5 my-2">
                {/* Parameter 1: AI-Driven Concept Limitations */}
                <div className="flex gap-3">
                  <div className="text-sm shrink-0 font-bold text-amber-500 font-mono">01.</div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-705 dark:text-slate-300 uppercase tracking-wide">
                      {lang === "bn" ? "এআই-চালিত ধারণাগত সীমাবদ্ধতা" : "AI-Driven Concept Limitations"}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {lang === "bn" 
                        ? "এই অ্যাপ্লিকেশনের ২ডি ব্লুপ্রিন্ট, লোড মেট্রিিক্স এবং খরচের হিসাব চার্টগুলি কৃত্রিম বুদ্ধিমত্তা (AI) এবং নির্দিষ্ট ইঞ্জিনিয়ারিং অ্যালগরিদম দ্বারা গণনাকৃত। এগুলি শুধুমাত্র প্রাথমিক ধারণাগত পর্যালোচনার জন্য তৈরি এবং চূড়ান্ত ব্লুপ্রিন্ট নয়।" 
                        : "The 2D blueprints, load metrics, and cost charts are calculations driven by AI and fixed engineering algorithms. They are meant strictly for preliminary conceptual stages only and should not be treated as final construction documentation."}
                    </p>
                  </div>
                </div>

                {/* Parameter 2: Mandatory Professional Verification */}
                <div className="flex gap-3">
                  <div className="text-sm shrink-0 font-bold text-teal-500 font-mono">02.</div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-705 dark:text-slate-300 uppercase tracking-wide">
                      {lang === "bn" ? "বাধ্যতামূলক পেশাদার যাচাইকরণ" : "Mandatory Professional Verification"}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {lang === "bn" 
                        ? "স্থানীয় বাজারের অস্থিরতা নির্মাণ সামগ্রী (যেমন সিমেন্ট, রড, বালি) এর দাম এবং স্থানীয় বিল্ডিং বাই-লকে প্রভাবিত করে। তাই বাস্তবায়নের পূর্বে সকল পরিমাপ ও পরিকল্পনা একজন সার্টিফাইড স্ট্রাকচারাল ইঞ্জিনিয়ার বা লাইসেন্সপ্রাপ্ত স্থপতির মাধ্যমে যাচাই করা বাধ্যতামূলক।" 
                        : "Local market volatility directly impacts material prices (such as steel, cement, and sand) and regional building bylaws. It is mandatory to verify all parameters, engineering safety, and structural designs with a certified structural engineer or licensed architect before physical execution."}
                    </p>
                  </div>
                </div>

                {/* Parameter 3: Liability Waiver */}
                <div className="flex gap-3">
                  <div className="text-sm shrink-0 font-bold text-indigo-500 font-mono">03.</div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-705 dark:text-slate-300 uppercase tracking-wide">
                      {lang === "bn" ? "দায়বদ্ধতা মওকুফ" : "Liability Waiver"}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {lang === "bn" 
                        ? "এই অ্যাপের যেকোনো ডেটা বা হিসাবের উপর ভিত্তি করে নেওয়া বাস্তব জীবন বা সাইটের নির্মাণ সিদ্ধান্ত বা ইঞ্জিনিয়ারিং পরিকল্পনার জন্য Indian Property Developer এবং এর মূল ডেভেলপার SUKANTA NANDI কোনো প্রকার আইনি বা আর্থিক দায়ভার বহন করবে না।" 
                        : "Indian Property Developer and its developer SUKANTA NANDI hold no legal, civil, or financial liability for real-world construction execution, onsite engineering, or financial decisions made based on this application's data."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-5 flex items-center justify-end">
                <button
                  onClick={() => setIsDisclaimerOpen(false)}
                  className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-xs font-bold rounded-xl shadow-md hover:from-teal-750 hover:to-emerald-750 cursor-pointer transition-all"
                >
                  {lang === "bn" ? "আমি বুঝতে পেরেছি" : "I Understand & Acknowledge"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
