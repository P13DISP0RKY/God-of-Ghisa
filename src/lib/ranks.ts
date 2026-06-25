// ---------------------------------------------------------------------------
// RANK LOGIC — 10 RANK ufficiali, basati sul MOLTIPLICATORE DEL PESO CORPOREO
// Ratio = 1RM (massimale esercizio) / Peso Corporeo Globale.
// Le soglie sono scalate equamente su 10 livelli, con valori diversi per
// gambe (Squat/Stacco, ratio più alti) e parte alta (Panca/Press/Rematore).
// ---------------------------------------------------------------------------

export type LiftCategory = "legs" | "upper";

export interface Rank {
  /** 0 = Secco Clamoroso ... 9 = Sindrome di Schwarzenegger */
  id: number;
  name: string;
  from: string;
  to: string;
  glow: string;
  emoji: string;
  tagline: string;
  /** Colore pieno usato per illuminare il muscolo sull'omino. */
  body: string;
  /** Il rank leggendario riceve il bagliore neon orbitante. */
  legendary?: boolean;
}

// I 10 Rank ufficiali: dal più imbarazzante alla divinità assoluta.
export const RANKS: Rank[] = [
  {
    id: 0,
    name: "Secco Clamoroso",
    from: "#64748b",
    to: "#94a3b8",
    glow: "rgba(148,163,184,0.55)",
    emoji: "💀",
    body: "#5b6472",
    tagline: "Si vede l'osso da qui.",
  },
  {
    id: 1,
    name: "Sollevatore di Polemiche",
    from: "#78716c",
    to: "#a8a29e",
    glow: "rgba(168,162,158,0.55)",
    emoji: "🗣️",
    body: "#7c6f64",
    tagline: "Solleva più discussioni che pesi.",
  },
  {
    id: 2,
    name: "Piegatore di Grissini",
    from: "#92400e",
    to: "#d97706",
    glow: "rgba(217,119,6,0.55)",
    emoji: "🥖",
    body: "#b45309",
    tagline: "Massimale: un pacco di grissini.",
  },
  {
    id: 3,
    name: "Cercatore di Specchi",
    from: "#a16207",
    to: "#eab308",
    glow: "rgba(234,179,8,0.5)",
    emoji: "🪞",
    body: "#ca8a04",
    tagline: "Allena soprattutto lo sguardo allo specchio.",
  },
  {
    id: 4,
    name: "Ghisa Lover",
    from: "#64748b",
    to: "#e2e8f0",
    glow: "rgba(226,232,240,0.6)",
    emoji: "🥈",
    body: "#cbd5e1",
    tagline: "Ha una relazione seria con il bilanciere.",
  },
  {
    id: 5,
    name: "Animale da Spogliatoio",
    from: "#1d4ed8",
    to: "#38bdf8",
    glow: "rgba(56,189,248,0.6)",
    emoji: "💎",
    body: "#38bdf8",
    tagline: "Ruggisce tra una serie e l'altra.",
  },
  {
    id: 6,
    name: "Il Chad",
    from: "#7c3aed",
    to: "#c084fc",
    glow: "rgba(192,132,252,0.65)",
    emoji: "🔮",
    body: "#a855f7",
    tagline: "Sì.",
  },
  {
    id: 7,
    name: "Abusivo di Proteine",
    from: "#c026d3",
    to: "#f0abfc",
    glow: "rgba(240,171,252,0.65)",
    emoji: "⚡",
    body: "#e879f9",
    tagline: "Lo shaker è la sua borraccia.",
  },
  {
    id: 8,
    name: "Altezza Olimpo",
    from: "#d97706",
    to: "#fde047",
    glow: "rgba(253,224,71,0.7)",
    emoji: "👑",
    body: "#fbbf24",
    tagline: "Gli dei iniziano a preoccuparsi.",
  },
  {
    id: 9,
    name: "Sindrome di Schwarzenegger",
    from: "#dc2626",
    to: "#fb923c",
    glow: "rgba(248,80,40,0.85)",
    emoji: "🐉",
    body: "#ef4444",
    legendary: true,
    tagline: "I'll be back. Con altre 4 serie.",
  },
];

// 9 soglie del Ratio (1RM / Peso Corporeo) per salire ai tier 1..9.
// Il tier 0 (Secco Clamoroso) parte da ratio 0.
export const THRESHOLDS: Record<LiftCategory, number[]> = {
  // Squat / Stacco da terra: si arriva fino a oltre 3x il peso corporeo.
  legs: [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0],
  // Panca / OverHead Press / Rematore: ratio più contenuti.
  upper: [0.3, 0.5, 0.7, 0.9, 1.1, 1.3, 1.5, 1.75, 2.0],
};

export interface UserProfile {
  bodyWeight: number;
  height: number;
}

export const DEFAULT_PROFILE: UserProfile = { bodyWeight: 75, height: 175 };

/** Massimale relativo: Ratio = 1RM / Peso Corporeo. */
export function computeRatio(oneRepMax: number, bodyWeight: number): number {
  const bw = Math.max(bodyWeight, 1);
  return Math.max(oneRepMax, 0) / bw;
}

// ---------------------------------------------------------------------------
// SISTEMA XP CUMULATIVO
// Ogni esercizio registrato vale dei punti XP in base al suo ratio (1RM/peso).
// Il Rank del muscolo (uno dei 10) avanza con la SOMMA dell'XP di TUTTI gli
// esercizi di quel gruppo: per scalare bisogna progredire E diversificare.
// ---------------------------------------------------------------------------

/** Soglie XP cumulative per salire ai tier 1..9 (il tier 0 parte da 0). */
export const XP_THRESHOLDS = [120, 300, 540, 840, 1200, 1620, 2100, 2680, 3360];

/** XP di un singolo esercizio: un esercizio "al massimo" vale ~1000 XP. */
export function xpForRatio(ratio: number, category: LiftCategory): number {
  if (ratio <= 0) return 0;
  const th = THRESHOLDS[category];
  const top = th[th.length - 1]; // legs 3.0, upper 2.0
  return Math.round((Math.min(ratio, top) / top) * 1000);
}

/** XP totale di un muscolo a partire dai massimali dei suoi esercizi. */
export function totalXp(
  lifts: Record<string, number> | undefined,
  bodyWeight: number,
  category: LiftCategory,
): number {
  if (!lifts) return 0;
  let xp = 0;
  for (const v of Object.values(lifts)) {
    xp += xpForRatio(computeRatio(v, bodyWeight), category);
  }
  return xp;
}

/** Tier 0..9 in base all'XP cumulativo. */
export function tierForXp(xp: number): number {
  let tier = 0;
  for (const t of XP_THRESHOLDS) {
    if (xp >= t) tier += 1;
    else break;
  }
  return tier;
}

export function rankForXp(xp: number): Rank {
  return RANKS[tierForXp(xp)];
}

export interface XpProgress {
  current: Rank;
  next: Rank | null;
  /** percentuale completata verso il prossimo tier (0..100) */
  percent: number;
  xp: number;
  /** XP totale richiesto per il prossimo tier */
  nextXp: number | null;
}

export function xpProgress(xp: number): XpProgress {
  const tier = tierForXp(xp);
  const current = RANKS[tier];
  if (tier >= RANKS.length - 1) {
    return { current, next: null, percent: 100, xp, nextXp: null };
  }
  const lo = tier === 0 ? 0 : XP_THRESHOLDS[tier - 1];
  const hi = XP_THRESHOLDS[tier];
  const span = hi - lo || 1;
  const percent = Math.max(0, Math.min(100, ((xp - lo) / span) * 100));
  return { current, next: RANKS[tier + 1], percent, xp, nextXp: hi };
}

/** Indice del tier (0..9) per un certo ratio e categoria. */
export function tierForRatio(ratio: number, category: LiftCategory): number {
  const th = THRESHOLDS[category];
  let tier = 0;
  for (const t of th) {
    if (ratio >= t) tier += 1;
    else break;
  }
  return tier;
}

export function rankForRatio(ratio: number, category: LiftCategory): Rank {
  return RANKS[tierForRatio(ratio, category)];
}

export interface RankProgress {
  current: Rank;
  next: Rank | null;
  /** percentuale completata verso il prossimo tier (0..100) */
  percent: number;
  /** ratio richiesto per il prossimo tier */
  nextRatio: number | null;
  ratio: number;
}

export function progressToNext(
  ratio: number,
  category: LiftCategory,
): RankProgress {
  const th = THRESHOLDS[category];
  const tier = tierForRatio(ratio, category);
  const current = RANKS[tier];
  if (tier >= RANKS.length - 1) {
    return { current, next: null, percent: 100, nextRatio: null, ratio };
  }
  const lo = tier === 0 ? 0 : th[tier - 1];
  const hi = th[tier];
  const span = hi - lo || 1;
  const percent = Math.max(0, Math.min(100, ((ratio - lo) / span) * 100));
  return { current, next: RANKS[tier + 1], percent, nextRatio: hi, ratio };
}

/** Rank globale generico (per la classifica) usando le soglie gambe. */
export function rankForRatioGlobal(ratio: number): Rank {
  return rankForRatio(ratio, "legs");
}
