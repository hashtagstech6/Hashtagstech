"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * 3D Tilt Card Component
 * Wraps children to provide a hover tilt effect
 * Using framer-motion for smooth physics-based animation
 */
export default function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 90 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 90 });

  function onMouseMove({ clientX, clientY }: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseXWithOffsetX = clientX - rect.left;
    const mouseYWithOffsetY = clientY - rect.top;

    const xPct = mouseXWithOffsetX / width - 0.5;
    const yPct = mouseYWithOffsetY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative w-full h-full cursor-pointer" // cursor-pointer hints interactivity
    >
      <div 
        style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }} 
        className="w-full h-full"
      >
        {children}
      </div>
    </motion.div>
  );
}
