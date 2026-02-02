"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * BackgroundGridRain Component
 *
 * A visual effect component that renders:
 * 1. A subtle grid pattern background
 * 2. "Raining" vertical lines using framer-motion
 *
 * Intended to be used as a fixed background behind content.
 */
export default function BackgroundGridRain({ className }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion();
  const [lines, setLines] = useState<number[]>([]);
  const gridSize = 120; // Matches css bg size

  useEffect(() => {
    const calculateLines = () => {
      const width = window.innerWidth;
      const colCount = Math.floor(width / gridSize);
      const totalRainLines = 5; 
      
      // Ensure even distribution by dividing columns into segments
      const segmentSize = Math.floor(colCount / totalRainLines);
      const selectedCols: number[] = [];
      
      for (let i = 0; i < totalRainLines; i++) {
        // Calculate segment range
        const start = i * segmentSize;
        // Ensure the last segment goes to the end
        const end = (i === totalRainLines - 1) ? colCount : (i + 1) * segmentSize;
        
        if (start < colCount) {
          // Pick a random column within this segment
          const randomInSegment = Math.floor(Math.random() * (end - start)) + start;
          selectedCols.push(randomInSegment);
        }
      }
      
      setLines(selectedCols);
    };

    calculateLines();
    window.addEventListener("resize", calculateLines);
    return () => window.removeEventListener("resize", calculateLines);
  }, []);

  if (prefersReducedMotion) {
    return (
      <div 
        className={cn(
          "fixed inset-0 z-[-1] overflow-hidden bg-background pointer-events-none", 
          className
        )}
      >
        <div 
            className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]" 
            style={{ backgroundSize: `${gridSize}px ${gridSize}px` }}
        />
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[-1] overflow-hidden bg-background pointer-events-none select-none", 
        className
      )}
      aria-hidden="true"
    >
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" 
        style={{ backgroundSize: `${gridSize}px ${gridSize}px` }}
      />

      {/* Raining Lines */}
      {lines.map((colIndex) => (
        <RainLine key={colIndex} leftPosition={colIndex * gridSize} />
      ))}
    </div>
  );
}

function RainLine({ leftPosition }: { leftPosition: number }) {
  // Randomize characteristics for each line
  const { duration, delay, height } = useMemo(() => ({
    duration: 5 + Math.random() * 5, // 5-10s (slower)
    delay: Math.random() * 5, 
    height: 200 + Math.random() * 200, // Longer trails
  }), []);

  return (
    <div 
        className="absolute top-0 w-[1px] h-full"
        style={{ left: `${leftPosition}px` }}
    >
      <motion.div
        initial={{ y: -height }}
        animate={{ 
          y: "100vh",
          opacity: [0, 1, 0] 
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
          delay: delay,
        }}
        style={{ height }}
        className="absolute top-0 left-0 w-full bg-gradient-to-b from-transparent via-primary to-transparent opacity-70"
      />
    </div>
  );
}
