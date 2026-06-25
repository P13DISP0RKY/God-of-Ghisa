import { forwardRef } from "react";
import type { Rank, XpProgress } from "@/lib/ranks";
import type { MuscleGroup } from "@/lib/muscles";
import { RankBadge } from "./RankBadge";
import { Progress } from "@/components/ui/progress";

interface Props {
  muscle: MuscleGroup;
  rank: Rank;
  xp: number;
  loggedCount: number;
  progress: XpProgress;
}

export const RankCard = forwardRef<HTMLDivElement, Props>(
  ({ muscle, rank, xp, loggedCount, progress }, ref) => {
    const { next, percent, nextXp } = progress;
    const isMax = !next;

    return (
      <div
        ref={ref}
        className="relative overflow-hidden rounded-2xl border-2 p-1 shadow-[var(--shadow-card)]"
        style={{
          borderColor: rank.to,
          backgroundImage: `linear-gradient(160deg, ${rank.from}22, ${rank.to}10)`,
        }}
      >
        <div
          className="flex items-center justify-between rounded-t-xl px-4 py-2"
          style={{ backgroundImage: `linear-gradient(120deg, ${rank.from}, ${rank.to})` }}
        >
          <span className="font-display text-xs font-bold uppercase tracking-widest text-white/90">
            {muscle.label}
          </span>
          <span className="font-display text-xs font-bold text-white/90">{xp} XP</span>
        </div>

        <div className="flex flex-col items-center gap-3 px-5 py-6 text-center">
          <div className="animate-float">
            <RankBadge rank={rank} size={108} active />
          </div>
          <div>
            <p className="font-display text-xl font-black" style={{ color: rank.to }}>
              {rank.name}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{rank.tagline}</p>
          </div>

          <div className="mt-2 w-full">
            {isMax ? (
              <p className="font-display text-sm font-bold text-accent">
                ⭐ Rank Massimo Raggiunto, Leggenda!
              </p>
            ) : (
              <>
                <Progress value={percent} className="h-2.5" />
                <p className="mt-2 text-xs text-muted-foreground">
                  Ti mancano{" "}
                  <span className="font-bold text-foreground">
                    {Math.max(0, (nextXp ?? 0) - xp)} XP
                  </span>{" "}
                  per superare{" "}
                  <span className="font-semibold" style={{ color: next.to }}>
                    {next.name}
                  </span>
                </p>
              </>
            )}
          </div>

          <div className="mt-3 w-full rounded-xl border border-border/60 bg-background/40 p-3 text-left text-sm">
            <p className="text-muted-foreground">
              Esercizi registrati:{" "}
              <span className="font-bold text-foreground">
                {loggedCount} / {muscle.exercises.length}
              </span>
            </p>
            <p className="mt-1 text-muted-foreground">
              XP cumulato: <span className="font-bold text-accent">{xp} XP</span>
            </p>
            <p className="mt-1 text-muted-foreground">
              Rank attuale:{" "}
              <span className="font-semibold" style={{ color: rank.to }}>
                {rank.name}
              </span>
            </p>
          </div>
          {!isMax && (
            <p className="text-[11px] text-muted-foreground/70">
              Diversifica gli esercizi per accumulare XP più in fretta.
            </p>
          )}
        </div>
      </div>
    );
  },
);
RankCard.displayName = "RankCard";
