import type { MuscleId, MuscleView } from "./types";
import type { LiftCategory } from "./ranks";

export interface Exercise {
  id: string;
  label: string;
}

export interface MuscleGroup {
  id: MuscleId;
  label: string;
  color: string;
  view: MuscleView;
  /** Categoria di calcolo del ratio (soglie diverse per gambe vs parte alta). */
  category: LiftCategory;
  /** Esercizi selezionabili: ognuno aggiunge XP cumulativo al muscolo. */
  exercises: Exercise[];
}

export const MUSCLES: MuscleGroup[] = [
  // ---- FRONT ----
  {
    id: "petto", label: "Petto", color: "#f43f6e", view: "front", category: "upper",
    exercises: [
      { id: "panca_piana", label: "Panca Piana" },
      { id: "panca_inclinata", label: "Panca Inclinata" },
      { id: "croci_dips", label: "Croci / Dips" },
    ],
  },
  {
    id: "deltoide_anteriore", label: "Deltoide Anteriore", color: "#a855f7", view: "front", category: "upper",
    exercises: [
      { id: "military_press", label: "Military Press" },
      { id: "alzate_frontali", label: "Alzate Frontali" },
      { id: "arnold_press", label: "Arnold Press" },
    ],
  },
  {
    id: "deltoide_mediale", label: "Deltoide Mediale", color: "#c084fc", view: "front", category: "upper",
    exercises: [
      { id: "alzate_laterali", label: "Alzate Laterali" },
      { id: "lento_avanti", label: "Lento Avanti" },
      { id: "tirate_mento", label: "Tirate al Mento" },
    ],
  },
  {
    id: "bicipiti", label: "Bicipiti", color: "#fb923c", view: "front", category: "upper",
    exercises: [
      { id: "curl_bilanciere", label: "Curl Bilanciere" },
      { id: "curl_manubri", label: "Curl Manubri" },
      { id: "hammer_curl", label: "Hammer Curl" },
    ],
  },
  {
    id: "addominali", label: "Addominali", color: "#34d399", view: "front", category: "upper",
    exercises: [
      { id: "crunch_zavorrato", label: "Crunch Zavorrato" },
      { id: "leg_raise", label: "Leg Raise" },
      { id: "plank_zavorra", label: "Plank Zavorrato" },
    ],
  },
  {
    id: "addominali_bassi", label: "Addominali Bassi", color: "#10b981", view: "front", category: "upper",
    exercises: [
      { id: "hanging_leg_raise", label: "Hanging Leg Raise" },
      { id: "rev_crunch", label: "Reverse Crunch" },
      { id: "decline_situp", label: "Decline Sit-up" },
    ],
  },
  {
    id: "quadricipiti", label: "Quadricipiti", color: "#facc15", view: "front", category: "legs",
    exercises: [
      { id: "squat", label: "Squat" },
      { id: "leg_press", label: "Leg Press" },
      { id: "affondi", label: "Affondi" },
    ],
  },
  {
    id: "avambracci", label: "Avambracci", color: "#2dd4bf", view: "front", category: "upper",
    exercises: [
      { id: "wrist_curl", label: "Wrist Curl" },
      { id: "hammer_curl", label: "Hammer Curl" },
      { id: "farmer_walk", label: "Farmer Walk" },
    ],
  },
  {
    id: "dorso", label: "Dorso", color: "#22d3ee", view: "back", category: "upper",
    exercises: [
      { id: "trazioni", label: "Trazioni" },
      { id: "rematore", label: "Rematore" },
      { id: "lat_machine", label: "Lat Machine" },
    ],
  },
  {
    id: "trapezio", label: "Trapezio", color: "#06b6d4", view: "back", category: "upper",
    exercises: [
      { id: "shrug", label: "Shrug" },
      { id: "upright_row", label: "Upright Row" },
      { id: "face_pull_trap", label: "Face Pull" },
    ],
  },
  // ---- BACK ----
  {
    id: "deltoide_posteriore", label: "Deltoide Posteriore", color: "#818cf8", view: "back", category: "upper",
    exercises: [
      { id: "alzate_posteriori", label: "Alzate Posteriori" },
      { id: "face_pull", label: "Face Pull" },
      { id: "rematore_90", label: "Rematore 90°" },
    ],
  },
  {
    id: "tricipiti", label: "Tricipiti", color: "#60a5fa", view: "back", category: "upper",
    exercises: [
      { id: "french_press", label: "French Press" },
      { id: "push_down", label: "Push Down" },
      { id: "dips_tricipiti", label: "Dips alle Parallele" },
    ],
  },
  {
    id: "lombari", label: "Lombari", color: "#f59e0b", view: "back", category: "legs",
    exercises: [
      { id: "iperestensioni", label: "Iperestensioni" },
      { id: "stacco", label: "Stacco da Terra" },
      { id: "good_morning", label: "Good Morning" },
    ],
  },
  {
    id: "femorali", label: "Femorali", color: "#a78bfa", view: "back", category: "legs",
    exercises: [
      { id: "stacco_rumeno", label: "Stacco Rumeno" },
      { id: "leg_curl", label: "Leg Curl" },
      { id: "good_morning_fem", label: "Good Morning" },
    ],
  },
  {
    id: "polpacci", label: "Polpacci", color: "#38bdf8", view: "back", category: "legs",
    exercises: [
      { id: "calf_piedi", label: "Calf in Piedi" },
      { id: "calf_seduto", label: "Calf da Seduto" },
      { id: "pressa_calf", label: "Pressa Calf" },
    ],
  },
  {
    id: "avambracci_back", label: "Avambracci (Posteriori)", color: "#14b8a6", view: "back", category: "upper",
    exercises: [
      { id: "wrist_curl_back", label: "Wrist Curl" },
      { id: "reverse_curl", label: "Reverse Curl" },
      { id: "farmer_walk_back", label: "Farmer Walk" },
    ],
  },
];

export const MUSCLE_MAP = Object.fromEntries(MUSCLES.map((m) => [m.id, m])) as Record<
  MuscleId,
  MuscleGroup
>;

export const FRONT_MUSCLES = MUSCLES.filter((m) => m.view === "front");
export const BACK_MUSCLES = MUSCLES.filter((m) => m.view === "back");
