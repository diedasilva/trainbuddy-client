"use client";

import React from "react";

interface BackgroundPatternProps {
  children: React.ReactNode;
  className?: string;
  // Couleurs du gradient principal
  gradientFrom?: string;
  gradientVia?: string;
  gradientTo?: string;
  // Direction du gradient
  gradientDirection?: "to-br" | "to-bl" | "to-tr" | "to-tl" | "to-r" | "to-l" | "to-t" | "to-b";
  // Couleurs des cercles flous
  circleColors?: {
    primary?: string;
    secondary?: string;
    tertiary?: string;
  };
  // Positions des cercles
  circlePositions?: {
    primary?: { left: string; top: string; size: string };
    secondary?: { left: string; top: string; size: string };
    tertiary?: { left: string; top: string; size: string };
  };
  // Couleurs des lignes
  lineColors?: {
    horizontal1?: string;
    horizontal2?: string;
    vertical1?: string;
    vertical2?: string;
  };
  // Couleurs des points décoratifs
  dotColors?: string[];
  // Opacité générale
  opacity?: number;
  // Grille de fond
  showGrid?: boolean;
  gridColor?: string;
  gridSize?: string;
}

export function BackgroundPattern({
  children,
  className = "",
  gradientFrom = "from-indigo-50",
  gradientVia = "via-white",
  gradientTo = "to-purple-50",
  gradientDirection = "to-br",
  circleColors = {
    primary: "from-blue-400/20 to-purple-400/20",
    secondary: "from-pink-400/20 to-orange-400/20",
    tertiary: "from-cyan-400/15 to-blue-400/15"
  },
  circlePositions = {
    primary: { left: "-left-4", top: "-top-4", size: "h-72 w-72" },
    secondary: { left: "-bottom-8", top: "-right-8", size: "h-96 w-96" },
    tertiary: { left: "left-1/2", top: "top-1/3", size: "h-64 w-64" }
  },
  lineColors = {
    horizontal1: "via-blue-200/50",
    horizontal2: "via-purple-200/50",
    vertical1: "via-indigo-200/30",
    vertical2: "via-pink-200/30"
  },
  dotColors = ["bg-blue-400/40", "bg-purple-400/40", "bg-pink-400/40", "bg-cyan-400/40"],
  opacity = 30,
  showGrid = true,
  gridColor = "rgba(255,255,255,0.1)",
  gridSize = "50px"
}: BackgroundPatternProps) {
  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Arrière-plan principal */}
      <div className={`bg-gradient- absolute inset-0${gradientDirection} ${gradientFrom} ${gradientVia} ${gradientTo}`}></div>
      
      {/* Motifs géométriques décoratifs */}
      <div className={`opacity- absolute inset-0${opacity}`}>
        {/* Cercles flous colorés */}
        <div className={`absolute ${circlePositions.primary?.left} ${circlePositions.primary?.top} ${circlePositions.primary?.size} rounded-full bg-gradient-to-r ${circleColors.primary} blur-3xl`}></div>
        <div className={`absolute ${circlePositions.secondary?.left} ${circlePositions.secondary?.top} ${circlePositions.secondary?.size} rounded-full bg-gradient-to-r ${circleColors.secondary} blur-3xl`}></div>
        <div className={`absolute ${circlePositions.tertiary?.left} ${circlePositions.tertiary?.top} ${circlePositions.tertiary?.size} -translate-x-1/2 rounded-full bg-gradient-to-r ${circleColors.tertiary} blur-3xl`}></div>
        
        {/* Lignes géométriques */}
        <div className={`absolute left-0 top-1/4 h-px w-full bg-gradient-to-r from-transparent ${lineColors.horizontal1} to-transparent`}></div>
        <div className={`absolute left-0 top-3/4 h-px w-full bg-gradient-to-r from-transparent ${lineColors.horizontal2} to-transparent`}></div>
        <div className={`absolute left-1/4 top-0 h-full w-px bg-gradient-to-b from-transparent ${lineColors.vertical1} to-transparent`}></div>
        <div className={`absolute right-1/4 top-0 h-full w-px bg-gradient-to-b from-transparent ${lineColors.vertical2} to-transparent`}></div>
        
        {/* Points décoratifs */}
        <div className={`absolute left-1/4 top-1/4 size-2 rounded-full ${dotColors[0] || "bg-blue-400/40"}`}></div>
        <div className={`absolute right-1/3 top-1/2 size-1 rounded-full ${dotColors[1] || "bg-purple-400/40"}`}></div>
        <div className={`absolute left-1/2 top-3/4 size-1.5 rounded-full ${dotColors[2] || "bg-pink-400/40"}`}></div>
        <div className={`absolute bottom-1/4 right-1/4 size-1 rounded-full ${dotColors[3] || "bg-cyan-400/40"}`}></div>
      </div>

      {/* Grille de fond subtile */}
      {showGrid && (
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
            backgroundSize: gridSize
          }}
        ></div>
      )}

      {/* Contenu principal */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
} 