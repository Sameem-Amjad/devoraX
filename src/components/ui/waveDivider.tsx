"use client";

interface WaveDividerProps {
  fromColor?: string;
  toColor?: string;
  flip?: boolean;
  height?: number;
}

export const WaveDivider = ({
  fromColor = "#020202",
  toColor = "#030303",
  flip = false,
  height = 80,
}: WaveDividerProps) => {
  return (
    <div
      className="relative overflow-hidden w-full pointer-events-none"
      style={{ height, background: fromColor, transform: flip ? "scaleY(-1)" : "none" }}
    >
      {/* Wave layer 1 — slowest */}
      <svg
        className="wave-layer-1 absolute bottom-0 left-0 w-[200%]"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        style={{ height }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,30 C180,60 360,0 540,30 C720,60 900,0 1080,30 C1260,60 1440,0 1440,30 L1440,60 L0,60 Z"
          fill={toColor}
          fillOpacity="0.5"
        />
      </svg>

      {/* Wave layer 2 — medium */}
      <svg
        className="wave-layer-2 absolute bottom-0 left-0 w-[200%]"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        style={{ height }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,20 C200,50 400,10 600,35 C800,60 1000,5 1200,30 C1320,45 1380,20 1440,25 L1440,60 L0,60 Z"
          fill={toColor}
          fillOpacity="0.7"
        />
      </svg>

      {/* Wave layer 3 — fastest / solid fill */}
      <svg
        className="wave-layer-3 absolute bottom-0 left-0 w-[200%]"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        style={{ height }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,40 C120,20 240,50 360,35 C480,20 600,50 720,38 C840,26 960,55 1080,38 C1200,22 1320,48 1440,36 L1440,60 L0,60 Z"
          fill={toColor}
        />
      </svg>
    </div>
  );
};
