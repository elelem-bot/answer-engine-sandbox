import React, { useState } from "react";
import { useGuidance } from "@/lib/GuidanceContext";

export default function GuidanceDot({ tip, position = "top" }) {
  const { guidanceMode } = useGuidance();
  const [visible, setVisible] = useState(false);

  if (!guidanceMode) return null;

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <span className="relative inline-flex items-center justify-center ml-1.5 align-middle">
      {/* Pulsing dot */}
      <span
        className="relative flex h-2.5 w-2.5 cursor-pointer"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={() => setVisible(!visible)}
      >
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: "#2DC6FE" }} />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: "#2DC6FE" }} />
      </span>

      {/* Tooltip */}
      {visible && (
        <span
          className={`absolute z-50 ${positionClasses[position]} w-52 text-xs rounded-lg shadow-lg px-3 py-2 leading-relaxed pointer-events-none`}
          style={{ background: "#082D35", color: "#fff", border: "1px solid rgba(45,198,254,0.3)" }}
        >
          {tip}
          <span
            className="absolute w-2 h-2 rotate-45"
            style={{
              background: "#082D35",
              bottom: position === "top" ? "-4px" : "auto",
              top: position === "bottom" ? "-4px" : "auto",
              left: "50%",
              transform: "translateX(-50%) rotate(45deg)",
              border: "1px solid rgba(45,198,254,0.3)",
              borderTop: position === "top" ? "none" : undefined,
              borderLeft: position === "top" ? "none" : undefined,
              borderBottom: position === "bottom" ? "none" : undefined,
              borderRight: position === "bottom" ? "none" : undefined,
            }}
          />
        </span>
      )}
    </span>
  );
}