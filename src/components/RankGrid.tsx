import { RANKS } from "@/lib/ranks";
import { RankBadge } from "./RankBadge";
import { cn } from "@/lib/utils";

interface Props {
  currentRankId: number;
}

export function RankGrid({ currentRankId }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-card/50 p-4">
      <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-widest text-muted-foreground">
        I Rank di God Of Ghisa
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {RANKS.map((r) => {
          const unlocked = r.id <= currentRankId;
          const isCurrent = r.id === currentRankId;
          return (
            <div
              key={r.id}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-xl p-2 text-center transition-colors",
                isCurrent && "bg-background/60 ring-2 ring-offset-2 ring-offset-card",
              )}
              style={isCurrent ? { boxShadow: `0 0 0 2px ${r.to}` } : undefined}
            >
              <RankBadge rank={r} size={48} locked={!unlocked} active={isCurrent} />
              <span
                className={cn(
                  "text-[10px] leading-tight font-medium",
                  unlocked ? "text-foreground" : "text-muted-foreground/60",
                )}
              >
                {r.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}