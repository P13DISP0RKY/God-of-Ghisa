import { useState, type ReactNode } from "react";
import type { UserProfile } from "@/lib/ranks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  profile: UserProfile;
  onSave: (p: UserProfile) => void;
  children: ReactNode;
}

export function SettingsDialog({ profile, onSave, children }: Props) {
  const [open, setOpen] = useState(false);
  const [bodyWeight, setBodyWeight] = useState(profile.bodyWeight);
  const [height, setHeight] = useState(profile.height);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">Il tuo profilo da Guerriero</DialogTitle>
          <DialogDescription>
            Il <b>peso corporeo</b> è fondamentale: ogni Rank si calcola come 1RM ÷ Peso Corporeo.
            Aggiornalo per ricalcolare istantaneamente tutti i tuoi muscoli.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bw">Peso corporeo (kg)</Label>
            <Input
              id="bw"
              type="number"
              min={20}
              value={bodyWeight || ""}
              onChange={(e) => setBodyWeight(Math.max(0, Number(e.target.value) || 0))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="h">Altezza (cm)</Label>
            <Input
              id="h"
              type="number"
              min={100}
              value={height || ""}
              onChange={(e) => setHeight(Math.max(0, Number(e.target.value) || 0))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="hero"
            onClick={() => {
              onSave({
                bodyWeight: bodyWeight || 75,
                height: height || 175,
              });
              setOpen(false);
            }}
          >
            Salva profilo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}