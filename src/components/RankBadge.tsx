import { useId } from "react";
import type { Rank } from "@/lib/ranks";
import { cn } from "@/lib/utils";

interface Props {
  rank: Rank;
  size?: number;
  active?: boolean;
  locked?: boolean;
  className?: string;
}

/** Colourful shield/medallion rank badge with a glowing rim and emoji. */
export function RankBadge({ rank, size = 64, active = false, locked = false, className }: Props) {
  const uid = useId().replace(/:/g, "");
  const gid = `badge-${uid}-${rank.id}`;

  return (
    <div
      className={cn("relative grid place-items-center", className)}
      style={{ width: size, height: size }}
    >
      {/* orbiting legendary glow */}
      {rank.legendary && !locked && (
        <span
          aria-hidden
          className="absolute inset-[-12%] animate-spin rounded-full opacity-80 blur-md"
          style={{
            background: `conic-gradient(${rank.from}, ${rank.to}, #fde047, ${rank.from})`,
            animationDuration: "4s",
          }}
        />
      )}
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="relative drop-shadow-lg"
      >
        <defs>
          <radialGradient id={`${gid}-fill`} cx="38%" cy="30%" r="80%">
            <stop offset="0%" stopColor={locked ? "#3a3a4a" : rank.to} />
            <stop offset="100%" stopColor={locked ? "#1f1f2b" : rank.from} />
          </radialGradient>
        </defs>
        {/* outer ring */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill={locked ? "#26263400" : "none"}
          stroke={locked ? "#3f3f50" : rank.to}
          strokeWidth="3"
          style={active && !locked ? { filter: `drop-shadow(0 0 8px ${rank.glow})` } : undefined}
        />
        {/* medallion body */}
        <circle cx="50" cy="50" r="39" fill={`url(#${gid}-fill)`} />
        {/* inner bevel */}
        <circle
          cx="50"
          cy="50"
          r="39"
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.5"
        />
        {/* gloss highlight */}
        {!locked && (
          <ellipse cx="40" cy="33" rx="20" ry="11" fill="rgba(255,255,255,0.28)" />
        )}
      </svg>
      <span
        className={cn("absolute leading-none", locked && "opacity-40 grayscale")}
        style={{ fontSize: size * 0.42 }}
      >
        {locked ? "🔒" : rank.emoji}
      </span>
    </div>
  );
}