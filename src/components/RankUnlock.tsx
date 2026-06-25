import { useEffect } from "react";
import confetti from "canvas-confetti";
import type { Rank } from "@/lib/ranks";
import { RankBadge } from "./RankBadge";
import { Button } from "@/components/ui/button";

function blast(colors: string[]) {
  const end = Date.now() + 900;
  (function frame() {
    confetti({ particleCount: 5, angle: 60, spread: 70, origin: { x: 0 }, colors });
    confetti({ particleCount: 5, angle: 120, spread: 70, origin: { x: 1 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
  confetti({ particleCount: 140, spread: 100, origin: { y: 0.6 }, colors });
}

export function RankUnlock({ rank, onClose }: { rank: Rank; onClose: () => void }) {
  useEffect(() => {
    blast([rank.from, rank.to, "#ffffff"]);
    const t = setTimeout(onClose, 4200);
    return () => clearTimeout(t);
  }, [rank, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-6 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div className="flex flex-col items-center text-center animate-rank-pop">
        <p className="font-display text-sm uppercase tracking-[0.4em] text-muted-foreground">
          Nuovo Rank Sbloccato
        </p>
        <div className="my-6 animate-float">
          <RankBadge rank={rank} size={150} active />
        </div>
        <h2
          className="font-display text-4xl font-black text-shine"
          style={{ color: rank.to }}
        >
          {rank.name}
        </h2>
        <p className="mt-3 max-w-xs text-muted-foreground">{rank.tagline}</p>
        <Button variant="hero" className="mt-8">
          Continua a spingere 💪
        </Button>
      </div>
    </div>
  );
}