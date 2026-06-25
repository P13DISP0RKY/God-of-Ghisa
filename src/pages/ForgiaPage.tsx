import { useMemo, useRef, useState } from "react";
import { Settings2, Share2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { MuscleBody, type ZoneStyle } from "@/components/MuscleBody";
import { RankCard } from "@/components/RankCard";
import { RankGrid } from "@/components/RankGrid";
import { MuscleRankDialog } from "@/components/MuscleRankDialog";
import { SettingsDialog } from "@/components/SettingsDialog";
import { RankUnlock } from "@/components/RankUnlock";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { MUSCLES, MUSCLE_MAP, FRONT_MUSCLES, BACK_MUSCLES } from "@/lib/muscles";
import type { MuscleId, MuscleView, LiftData } from "@/lib/types";
import { emptyLifts } from "@/lib/types";
import {
  DEFAULT_PROFILE,
  rankForXp,
  tierForXp,
  totalXp,
  xpProgress,
  type Rank,
  type UserProfile,
} from "@/lib/ranks";
import { captureCard, downloadDataUrl, openWhatsApp, shareText } from "@/lib/share";
import { cn } from "@/lib/utils";

export function ForgiaPage() {
  const [lifts, setLifts] = useLocalStorage<LiftData>("gog:lifts", emptyLifts());
  const [profile, setProfile] = useLocalStorage<UserProfile>("gog:profile", DEFAULT_PROFILE);
  const [view, setView] = useState<MuscleView>("front");
  const [selected, setSelected] = useState<MuscleId>("petto");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [unlocked, setUnlocked] = useState<Rank | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const muscle = MUSCLE_MAP[selected];
  const muscleLifts = lifts[selected] ?? {};
  const xp = totalXp(muscleLifts, profile.bodyWeight, muscle.category);
  const rank = rankForXp(xp);
  const progress = xpProgress(xp);
  const loggedCount = Object.values(muscleLifts).filter((v) => v > 0).length;

  const styleFor = useMemo(() => {
    const out = {} as Record<MuscleId, ZoneStyle>;
    for (const m of MUSCLES) {
      const mxp = totalXp(lifts[m.id], profile.bodyWeight, m.category);
      const rk = rankForXp(mxp);
      out[m.id] = {
        color: rk.body,
        glow: rk.glow,
        legendary: !!rk.legendary,
        tier: tierForXp(mxp),
      };
    }
    return out;
  }, [lifts, profile.bodyWeight]);

  const viewMuscles = view === "front" ? FRONT_MUSCLES : BACK_MUSCLES;

  function switchView(v: MuscleView) {
    setView(v);
    const list = v === "front" ? FRONT_MUSCLES : BACK_MUSCLES;
    if (!list.some((m) => m.id === selected)) setSelected(list[0].id);
  }

  function selectMuscle(mid: MuscleId) {
    setSelected(mid);
    const v = MUSCLE_MAP[mid].view;
    if (v !== view) setView(v);
    setDialogOpen(true);
  }

  function saveLifts(next: Record<string, number>) {
    const before = rankForXp(totalXp(muscleLifts, profile.bodyWeight, muscle.category));
    const after = rankForXp(totalXp(next, profile.bodyWeight, muscle.category));
    setLifts((prev) => ({ ...prev, [selected]: next }));
    if (after.id > before.id) setUnlocked(after);
  }

  async function share() {
    const text = shareText(rank, muscle, xp);
    try {
      if (cardRef.current) {
        const url = await captureCard(cardRef.current);
        downloadDataUrl(url, `god-of-ghisa-${muscle.id}.png`);
      }
    } catch {
      /* screenshot best-effort */
    }
    openWhatsApp(text);
    toast.success("Screenshot salvato! Incollalo nella chat di WhatsApp");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Toaster position="top-center" richColors />
      {unlocked && <RankUnlock rank={unlocked} onClose={() => setUnlocked(null)} />}

      <MuscleRankDialog
        muscle={muscle}
        lifts={muscleLifts}
        bodyWeight={profile.bodyWeight}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={saveLifts}
      />

      <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 sm:flex sm:flex-wrap sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-black tracking-tight sm:text-4xl">
            La tua <span className="text-primary">Forgia</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Tocca un muscolo, registra gli esercizi e accumula XP per scalare i Rank.
          </p>
        </div>
        <SettingsDialog profile={profile} onSave={setProfile}>
          <Button variant="outline" size="sm" className="shrink-0">
            <Settings2 /> {profile.bodyWeight}kg - {profile.height}cm
          </Button>
        </SettingsDialog>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        {/* LEFT: body */}
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-border bg-card/40 p-4">
            {/* front/back tabs */}
            <div className="mb-4 grid grid-cols-2 gap-1 rounded-xl border border-border bg-background/50 p-1">
              {(["front", "back"] as MuscleView[]).map((v) => (
                <button
                  key={v}
                  onClick={() => switchView(v)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-bold transition-all",
                    view === v
                      ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {v === "front" ? "Frontale" : "Posteriore"}
                </button>
              ))}
            </div>

            {/* muscle chips for current view */}
            <div className="mb-3 flex flex-wrap gap-2">
              {viewMuscles.map((m) => (
                <button
                  key={m.id}
                  onClick={() => selectMuscle(m.id)}
                  className="rounded-full border px-3 py-1 text-xs font-bold transition-all"
                  style={{
                    borderColor: m.color,
                    color: selected === m.id ? "#0c0a13" : m.color,
                    backgroundColor: selected === m.id ? m.color : "transparent",
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="grid place-items-center">
              <MuscleBody
                view={view}
                selected={selected}
                styleFor={styleFor}
                onSelect={selectMuscle}
              />
            </div>
          </div>

          <Button variant="hero" size="lg" className="w-full" onClick={() => setDialogOpen(true)}>
            <Pencil /> Consiglia esercizi per {muscle.label}
          </Button>
        </div>

        {/* RIGHT: rank card */}
        <div className="flex flex-col gap-4">
          <RankCard
            ref={cardRef}
            muscle={muscle}
            rank={rank}
            xp={xp}
            loggedCount={loggedCount}
            progress={progress}
          />
          <Button variant="gold" size="xl" onClick={share} className="w-full">
            <Share2 /> Condividi con gli amici
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <RankGrid currentRankId={rank.id} />
      </div>
    </div>
  );
}
