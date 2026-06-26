import type { MuscleId, MuscleView } from "@/lib/types";
import {
  FRONT_VIEWBOX,
  BACK_VIEWBOX,
  FRONT_SILHOUETTE,
  BACK_SILHOUETTE,
  FRONT_MUSCLE_PATHS,
  BACK_MUSCLE_PATHS,
} from "@/lib/body-paths";

export interface ZoneStyle {
  color: string;
  glow: string;
  legendary: boolean;
  tier: number;
}

interface Props {
  view: MuscleView;
  selected: MuscleId | null;
  styleFor: Record<MuscleId, ZoneStyle>;
  onSelect: (id: MuscleId) => void;
}

export function MuscleBody({ view, selected, styleFor, onSelect }: Props) {
  const isFront = view === "front";
  const silhouette = isFront ? FRONT_SILHOUETTE : BACK_SILHOUETTE;
  const musclePaths = isFront ? FRONT_MUSCLE_PATHS : BACK_MUSCLE_PATHS;
  const viewBox = isFront ? FRONT_VIEWBOX : BACK_VIEWBOX;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center min-h-[550px] bg-[#0b0f19] p-6 rounded-2xl border border-slate-800/40">
      <svg
        viewBox={viewBox}
        className="w-full h-auto max-h-[75vh] mx-auto select-none overflow-visible"
      >
        <g transform="translate(0, 1301) scale(0.1, -0.1)">
          {/* silhouette del corpo */}
          <path
            d={silhouette}
            fill="#1e2330"
            stroke="#2d3548"
            strokeWidth={10}
            strokeLinejoin="round"
          />

          {/* muscoli cliccabili */}
          {(Object.keys(musclePaths) as MuscleId[]).map((id) => {
            const paths = musclePaths[id];
            if (!paths) return null;
            const st = styleFor[id];
            if (!st) return null;
            const lit = st.tier > 0;
            const isActive = selected === id;
            return (
              <g
                key={id}
                onClick={() => onSelect(id)}
                className="cursor-pointer transition-all duration-150"
                style={{
                  filter: isActive
                    ? `drop-shadow(0 0 20px ${st.glow || "#ffffff"})`
                    : undefined,
                }}
              >
                {paths.map((d, i) => (
                  <path
                    key={i}
                    d={d}
                    fill={lit ? st.color : "#3c4658"}
                    fillOpacity={isActive ? 1 : lit ? 0.95 : 0.85}
                    stroke={isActive ? "#ffffff" : "#111622"}
                    strokeWidth={isActive ? 25 : 8}
                    strokeLinejoin="round"
                  />
                ))}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
