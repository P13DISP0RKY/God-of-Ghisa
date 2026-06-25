import { useEffect, useState } from "react";
import { Dumbbell, TrendingUp, Zap, Plus, ChevronDown } from "lucide-react";
import type { MuscleGroup } from "@/lib/muscles";
import {
  computeRatio,
  rankForXp,
  totalXp,
  xpForRatio,
  xpProgress,
} from "@/lib/ranks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RankBadge } from "./RankBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface Props {
  muscle: MuscleGroup;
  lifts: Record<string, number>;
  bodyWeight: number;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSave: (lifts: Record<string, number>) => void;
}

interface NewExEntry {
  exerciseId: string;
  peso: number;
  reps: number;
  serie: number;
}

const TIPS: Record<string, string> = {
  petto: "Mantieni la schiena appoggiata e la presa sicura. Il peso usato è il tuo carico massimale stimato (1RM).",
  deltoide_anteriore: "Esegui il movimento in modo controllato. Evita di usare l'inerzia del busto.",
  deltoide_mediale: "Alzate lente e precise danno risultati migliori di pesi troppo alti.",
  bicipiti: "Tieni i gomiti fermi lungo il busto per isolare il muscolo al meglio.",
  addominali: "Concentrati sulla contrazione muscolare, non sulla velocità del movimento.",
  quadricipiti: "Scendi fino a 90° per massimizzare l'attivazione. Mantieni le ginocchia in asse.",
  dorso: "Porta le scapole insieme al termine del movimento per un'attivazione completa.",
  deltoide_posteriore: "Mantieni le spalle basse e stabili durante tutto il movimento.",
  tricipiti: "Tieni i gomiti vicini alla testa durante la pressione per isolare il tricipite.",
  avambracci: "Esegui i movimenti lentamente in entrambe le direzioni per massimizzare la tensione.",
  lombari: "Mantieni la schiena neutra: evita di inarcare eccessivamente la colonna.",
  femorali: "Controlla la fase di discesa: è quella che stimola maggiormente la crescita.",
  polpacci: "Esegui il movimento completo: dalla punta dei piedi fino al massimo allungamento.",
};

export function MuscleRankDialog({
  muscle,
  lifts,
  bodyWeight,
  open,
  onOpenChange,
  onSave,
}: Props) {
  const [values, setValues] = useState<Record<string, number>>(lifts);
  const [addOpen, setAddOpen] = useState(false);
  const [entry, setEntry] = useState<NewExEntry>({
    exerciseId: muscle.exercises[0]?.id ?? "",
    peso: 0,
    reps: 0,
    serie: 0,
  });
  const [customName, setCustomName] = useState("");

  useEffect(() => {
    if (open) {
      setValues(lifts);
      setEntry({ exerciseId: muscle.exercises[0]?.id ?? "", peso: 0, reps: 0, serie: 0 });
      setCustomName("");
    }
  }, [open, lifts, muscle]);

  const xp = totalXp(values, bodyWeight, muscle.category);
  const rank = rankForXp(xp);
  const prog = xpProgress(xp);
  const tip = TIPS[muscle.id] ?? "Mantieni l'esecuzione controllata. Considera il massimale stimato (1RM).";

  function openAdd() {
    setEntry({ exerciseId: muscle.exercises[0]?.id ?? "", peso: 0, reps: 0, serie: 0 });
    setCustomName("");
    setAddOpen(true);
  }

  function confirmAdd() {
    if (entry.peso <= 0) return;
    const id = customName.trim()
      ? customName.trim().toLowerCase().replace(/\s+/g, "_")
      : entry.exerciseId;
    // Estimate 1RM via Epley: peso * (1 + reps/30), clamped if reps=0 → just use peso
    const oneRepMax =
      entry.reps > 0
        ? Math.round(entry.peso * (1 + entry.reps / 30))
        : entry.peso;
    setValues((prev) => ({ ...prev, [id]: oneRepMax }));
    setAddOpen(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2 text-xl">
              <Dumbbell className="size-5" style={{ color: muscle.color }} />
              {muscle.label}
            </DialogTitle>
            <DialogDescription>
              Aggiungi i tuoi esercizi per accumulare{" "}
              <b>XP</b> e scalare i Rank. Il Rank cresce con la{" "}
              <b>somma</b> di tutti i progressi.
            </DialogDescription>
          </DialogHeader>

          {/* live badge */}
          <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-background/40 p-3">
            <RankBadge rank={rank} size={64} active />
            <div className="min-w-0">
              <p className="font-display text-lg font-black" style={{ color: rank.to }}>
                {rank.name}
              </p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Zap className="size-3.5 text-accent" />
                <span className="font-bold text-accent">{xp} XP</span> cumulati
              </p>
            </div>
          </div>

          {/* logged exercises */}
          {Object.keys(values).length > 0 && (
            <div className="flex flex-col gap-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Esercizi registrati
              </Label>
              {Object.entries(values).map(([id, val]) => {
                if (!val) return null;
                const exLabel =
                  muscle.exercises.find((e) => e.id === id)?.label ??
                  id.replace(/_/g, " ");
                const exXp = xpForRatio(computeRatio(val, bodyWeight), muscle.category);
                return (
                  <div
                    key={id}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-background/30 px-3 py-2"
                  >
                    <span className="text-sm font-medium capitalize">{exLabel}</span>
                    <span className="text-xs text-accent font-bold">
                      {val} kg · +{exXp} XP
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* add button */}
          <Button variant="hero" className="w-full" onClick={openAdd}>
            <Plus className="size-4" /> Nuovo esercizio
          </Button>

          {/* progress to next tier */}
          <div className="rounded-xl border border-border/60 bg-background/40 p-3">
            {prog.next ? (
              <>
                <Progress value={prog.percent} className="h-2.5" />
                <p className="mt-2 text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 inline size-3.5" />
                  Ti mancano{" "}
                  <span className="font-bold text-foreground">
                    {Math.max(0, (prog.nextXp ?? 0) - xp)} XP
                  </span>{" "}
                  per diventare{" "}
                  <span className="font-semibold" style={{ color: prog.next.to }}>
                    {prog.next.name}
                  </span>
                  . Ti suggeriamo di aggiungere esercizi o aumentare gradualmente i carichi.
                </p>
              </>
            ) : (
              <p className="text-center font-display text-sm font-bold text-accent">
                ⭐ Rank massimo: Sindrome di Schwarzenegger raggiunta!
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Annulla
            </Button>
            <Button
              variant="hero"
              onClick={() => {
                onSave(values);
                onOpenChange(false);
              }}
            >
              Salva progressi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Nuovo esercizio popup ── */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">Nuovo esercizio</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {/* Esercizio */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">Esercizio</Label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-lg border border-primary bg-background px-3 py-2.5 pr-8 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  value={customName ? "__custom__" : entry.exerciseId}
                  onChange={(e) => {
                    if (e.target.value === "__custom__") {
                      setCustomName(" ");
                    } else {
                      setCustomName("");
                      setEntry((p) => ({ ...p, exerciseId: e.target.value }));
                    }
                  }}
                >
                  {muscle.exercises.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.label}
                    </option>
                  ))}
                  <option value="__custom__">+ Personalizzato...</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
              {customName.trim() !== "" || customName === " " ? (
                <Input
                  autoFocus
                  placeholder={`Es. ${muscle.exercises[0]?.label ?? "Panca Piana"}`}
                  value={customName.trimStart()}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="mt-1"
                />
              ) : null}
            </div>

            {/* Peso / Reps / Serie */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">Peso (kg)</Label>
                <Input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  placeholder="0"
                  value={entry.peso === 0 ? "" : entry.peso}
                  onChange={(e) =>
                    setEntry((p) => ({ ...p, peso: Math.max(0, Number(e.target.value) || 0) }))
                  }
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">Ripetizioni</Label>
                <Input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  placeholder="0"
                  value={entry.reps === 0 ? "" : entry.reps}
                  onChange={(e) =>
                    setEntry((p) => ({ ...p, reps: Math.max(0, Number(e.target.value) || 0) }))
                  }
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">Serie</Label>
                <Input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  placeholder="0"
                  value={entry.serie === 0 ? "" : entry.serie}
                  onChange={(e) =>
                    setEntry((p) => ({ ...p, serie: Math.max(0, Number(e.target.value) || 0) }))
                  }
                />
              </div>
            </div>

            {/* Tip */}
            <p className="rounded-lg bg-accent/10 px-3 py-2 text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-accent">Consiglio:</span> {tip}
            </p>
          </div>

          <DialogFooter className="mt-2">
            <Button variant="ghost" onClick={() => setAddOpen(false)}>
              Annulla
            </Button>
            <Button
              variant="hero"
              disabled={entry.peso <= 0}
              onClick={confirmAdd}
            >
              Aggiungi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
