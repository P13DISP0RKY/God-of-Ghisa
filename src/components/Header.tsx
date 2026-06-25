import { Dumbbell, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

type Route = "home" | "classifica";

interface Props {
  current: Route;
  onNavigate: (r: Route) => void;
}

export function Header({ current, onNavigate }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <button onClick={() => onNavigate("home")} className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-lg [background-image:var(--gradient-hero)] shadow-[var(--shadow-glow)]">
            <Dumbbell className="size-5 text-primary-foreground" />
          </span>
          <span className="font-display text-lg font-black leading-none tracking-tight">
            GOD OF <span className="text-primary">GHISA</span>
          </span>
        </button>
        <nav className="flex items-center gap-1 text-sm font-semibold">
          <button
            onClick={() => onNavigate("home")}
            className={cn(
              "rounded-lg px-3 py-2 transition-colors hover:text-foreground",
              current === "home" ? "bg-secondary text-foreground" : "text-muted-foreground",
            )}
          >
            Allenamento
          </button>
          <button
            onClick={() => onNavigate("classifica")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors hover:text-foreground",
              current === "classifica" ? "bg-secondary text-foreground" : "text-muted-foreground",
            )}
          >
            <Trophy className="size-4" /> Classifica
          </button>
        </nav>
      </div>
    </header>
  );
}
