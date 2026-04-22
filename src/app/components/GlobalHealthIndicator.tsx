import React from "react";

type HealthStatus = "ACTIVE" | "INACTIVE" | "WARNING";

interface GlobalHealthIndicatorProps {
  status?: HealthStatus;
}

const statusConfig: Record<HealthStatus, { label: string; color: string; glow: string }> = {
  ACTIVE: {
    label: "ACTIVE",
    color: "text-[#CBF34D]",
    glow: "shadow-[0_0_12px_4px_rgba(203,243,77,0.5)]",
  },
  INACTIVE: {
    label: "INACTIVE",
    color: "text-zinc-400",
    glow: "shadow-[0_0_8px_2px_rgba(161,161,170,0.3)]",
  },
  WARNING: {
    label: "WARNING",
    color: "text-yellow-400",
    glow: "shadow-[0_0_12px_4px_rgba(250,204,21,0.5)]",
  },
};

const GlobalHealthIndicator = ({ status = "ACTIVE" }: GlobalHealthIndicatorProps) => {
  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-3">
      {/* Label */}
      <span className="text-white/60 text-xs font-mono tracking-widest uppercase">
        GLOBAL HEALTH:
      </span>

      {/* Status badge */}
      <span className={`text-xs font-mono font-bold tracking-widest uppercase ${config.color}`}>
        [ {config.label} ]
      </span>

      {/* Animated glowing sun/star icon */}
      <div className="relative flex items-center justify-center w-5 h-5">
        {/* Outer glow ring */}
        <div
          className={`absolute w-5 h-5 rounded-full bg-[#CBF34D]/20 animate-pulse blur-sm ${config.glow}`}
        />
        {/* Inner core */}
        <div
          className={`relative w-3 h-3 rounded-full bg-[#CBF34D] animate-pulse ${config.glow}`}
          style={{
            boxShadow:
              status === "ACTIVE"
                ? "0 0 6px 2px rgba(203,243,77,0.8), 0 0 16px 4px rgba(203,243,77,0.4)"
                : undefined,
          }}
        />
        {/* Sun rays via pseudo-like radial spikes */}
        {status === "ACTIVE" && (
          <svg
            className="absolute w-5 h-5 animate-pulse"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* 8 rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <line
                key={angle}
                x1="10"
                y1="10"
                x2={10 + 8 * Math.cos((angle * Math.PI) / 180)}
                y2={10 + 8 * Math.sin((angle * Math.PI) / 180)}
                stroke="#CBF34D"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.7"
              />
            ))}
          </svg>
        )}
      </div>
    </div>
  );
};

export default GlobalHealthIndicator;
