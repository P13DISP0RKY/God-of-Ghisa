import { toPng } from "html-to-image";
import type { Rank } from "./ranks";
import type { MuscleGroup } from "./muscles";

export function shareText(rank: Rank, muscle: MuscleGroup, xp: number): string {
  return (
    `🏋️ GOD OF GHISA 🏋️\n` +
    `Per ${muscle.label} ho raggiunto il rank "${rank.name}" ${rank.emoji} ` +
    `(${xp} XP cumulati)!\n` +
    `${rank.tagline}\n` +
    `Riesci a rankare più in alto di me? 😏💪`
  );
}

export async function captureCard(node: HTMLElement): Promise<string> {
  return toPng(node, {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: "#1a1726",
  });
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

export function openWhatsApp(text: string) {
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
}