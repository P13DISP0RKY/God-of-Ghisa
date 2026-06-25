import { useMemo, useState } from "react";
import { Plus, Trash2, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RankBadge } from "@/components/RankBadge";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { DEFAULT_PROFILE, rankForRatioGlobal, type UserProfile } from "@/lib/ranks";
import type { Friend, LiftData } from "@/lib/types";
import { emptyLifts } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ClassificaPage() {
  const [friends, setFriends] = useLocalStorage<Friend[]>("gog:friends", []);
  const [profile] = useLocalStorage<UserProfile>("gog:profile", DEFAULT_PROFILE);
  const [lifts] = useLocalStorage<LiftData>("gog:lifts", emptyLifts());

  const [name, setName] = useState("");
  const [lift, setLift] = useState(0);
  const [height, setHeight] = useState(0);

  // best 1RM the user logged across all muscles
  const myBestLift = useMemo(() => {
    let max = 0;
    for (const exMap of Object.values(lifts)) {
      if (!exMap) continue;
      for (const v of Object.values(exMap)) {
        if (v > max) max = v;
      }
    }
    return max;
  }, [lifts]);

  const entries = useMemo(() => {
    const me = {
      id: "me",
      name: "Tu",
      ratio: myBestLift / Math.max(profile.bodyWeight, 1),
      lift: myBestLift,
      bw: profile.bodyWeight,
      height: profile.height,
      isMe: true,
    };
    const others = friends.map((f) => {
      const body = f.bw || 75;
      return {
        id: f.id,
        name: f.name,
        ratio: f.weight / Math.max(body, 1),
        lift: f.weight,
        bw: body,
        height: f.height,
        isMe: false,
      };
    });
    return [me, ...others].sort((a, b) => b.ratio - a.ratio);
  }, [friends, myBestLift, profile.bodyWeight]);

  function add() {
    if (!name.trim() || lift <= 0) return;
    const f: Friend = {
      id: Math.random().toString(36).slice(2, 10),
      name: name.trim(),
      weight: lift,
      bw: 75,
      height: height > 0 ? height : undefined,
    };
    setFriends((prev) => [...prev, f]);
    setName("");
    setLift(0);
    setHeight(0);
  }

  function remove(fid: string) {
    setFriends((prev) => prev.filter((f) => f.id !== fid));
  }

  const medals = ["1.", "2.", "3."];

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
        <Crown className="mb-1 mr-1 inline size-8 text-accent" />
        Classifica
      </h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Aggiungi i tuoi amici col loro peso sollevato e peso corporeo. La classifica usa il{" "}
        <b>peso relativo</b>: chi solleva di piu rispetto al proprio peso vince. Battili!
      </p>

      {/* add form */}
      <div className="mb-6 grid gap-3 rounded-2xl border border-border bg-card/50 p-4 sm:grid-cols-[1fr_auto_auto_auto]">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">Nome amico</Label>
          <Input value={name} placeholder="Es. Marco" onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">Peso sollevato (kg)</Label>
          <Input
            type="number"
            className="sm:w-28"
            value={lift || ""}
            placeholder="80"
            onChange={(e) => setLift(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">Altezza (cm)</Label>
          <Input
            type="number"
            className="sm:w-28"
            value={height || ""}
            placeholder="175"
            onChange={(e) => setHeight(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="flex items-end">
          <Button variant="hero" onClick={add} className="w-full">
            <Plus /> Aggiungi
          </Button>
        </div>
      </div>

      {/* leaderboard */}
      <ul className="flex flex-col gap-2">
        {entries.map((en, i) => {
          const rank = rankForRatioGlobal(en.ratio);
          return (
            <li
              key={en.id}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3",
                en.isMe
                  ? "border-primary bg-primary/10 shadow-[var(--shadow-glow)]"
                  : "border-border bg-card/50",
              )}
            >
              <span className="w-8 text-center font-display text-lg font-black">
                {medals[i] ?? `${i + 1}.`}
              </span>
              <RankBadge rank={rank} size={42} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">
                  {en.name}{" "}
                  {en.isMe && (
                    <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">
                      TU
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  Peso: {en.bw || 75} kg | Altezza: {en.height || 175} cm
                </p>
              </div>
              <div className="text-right">
                <p className="font-display font-bold text-accent">
                  {en.ratio ? en.ratio.toFixed(2) : "0.00"}x
                </p>
                <p className="text-[10px] text-muted-foreground">peso relativo</p>
              </div>
              {!en.isMe && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => remove(en.id)}
                  aria-label="Rimuovi"
                >
                  <Trash2 />
                </Button>
              )}
            </li>
          );
        })}
      </ul>

      {entries.length === 1 && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Sei da solo in vetta... per ora. Aggiungi i tuoi amici e dimostra chi comanda.
        </p>
      )}
    </div>
  );
}
