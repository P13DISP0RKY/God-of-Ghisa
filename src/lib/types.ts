export type MuscleView = "front" | "back";

export type MuscleId =
  // front
  | "petto"
  | "deltoide_anteriore"
  | "deltoide_mediale"
  | "bicipiti"
  | "addominali"
  | "quadricipiti"
  | "avambracci"
  // back
  | "dorso"
  | "trapezio"
  | "deltoide_posteriore"
  | "tricipiti"
  | "lombari"
  | "femorali"
  | "polpacci"
  | "avambracci_back";

/**
 * Massimali 1RM (kg) registrati per ogni esercizio, raggruppati per muscolo.
 * Es: { quadricipiti: { squat: 120, leg_press: 200 } }.
 * Il Rank del muscolo nasce dalla SOMMA cumulativa dell'XP di tutti gli esercizi.
 */
export type LiftData = Partial<Record<MuscleId, Record<string, number>>>;

export interface Friend {
  id: string;
  name: string;
  weight: number; // peso sollevato (kg)
  bw?: number; // peso corporeo (kg)
  height?: number; // altezza (cm)
}

export function emptyLifts(): LiftData {
  return {};
}
