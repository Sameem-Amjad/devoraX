import CONSTANTS from "../../utils/constants/constants";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  glow?: boolean;
}

const sizeMap = {
  sm: {
    text: "text-xl",
    icon: "w-6 h-6",
  },
  md: {
    text: "text-2xl",
    icon: "w-7 h-7",
  },
  lg: {
    text: "text-5xl",
    icon: "w-8 h-10",
  },
};

const Logo = ({ size = "md", glow = true }: LogoProps) => {
  const currentSize = sizeMap[size];

  return (
    <div className="flex flex-col items-center select-none leading-none">
      {/* Brand Row */}
      <div
        className={`
          flex items-center gap-0.1
          transition-all duration-300
          ${glow ? "hover:drop-shadow-[0_0_40px_rgba(45,212,191,0.55)]" : ""}
        `}
      >
        {/* Brand Text */}
        <span
          className={`
            font-semibold tracking-tight text-transparent bg-clip-text
            bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400
            ${currentSize.text}
          `}
          style={{ fontFamily: "Orbitron, sans-serif" }}
        >
          {CONSTANTS.AGENCY_NAME}
        </span>

        {/* X Mark */}
        <div
          className={`
            ${currentSize.icon}
            drop-shadow-[0_0_6px_rgba(45,212,191,0.35)]
            hover:drop-shadow-[0_0_16px_rgba(45,212,191,0.6)]
            transition-all duration-300
          `}
        >
          <svg
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <defs>
              <linearGradient
                id="xGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>

            {/* Diagonal Beam */}
            <rect
              x="26"
              y="6"
              width="12"
              height="52"
              rx="4"
              transform="rotate(45 32 32)"
              fill="url(#xGrad)"
            />

            {/* Opposite Beam */}
            <rect
              x="26"
              y="6"
              width="12"
              height="52"
              rx="4"
              transform="rotate(-45 32 32)"
              fill="url(#xGrad)"
            />

            {/* Inner Precision Cut (identity detail) */}
            <rect
              x="30"
              y="20"
              width="4"
              height="24"
              rx="2"
              transform="rotate(45 32 32)"
              fill="#0b1220"
            />
          </svg>
        </div>
      </div>

      {/* Tagline */}
      <span className="mt-1 text-[0.6rem] font-medium tracking-[0.25em] text-gray-400">
        WE MAKE IT HAPPEN
      </span>
    </div>
  );
};

export default Logo;
