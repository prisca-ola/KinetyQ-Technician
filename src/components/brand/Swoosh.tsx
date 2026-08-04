// The KinetyQ signature "swoosh" - three tapered speed-lines. Used as a brand
// accent on dark panels and empty states. Colors default to the brand yellow +
// blue mix seen in the brand guide.

interface SwooshProps {
  className?: string;
  variant?: "duo" | "yellow" | "blue" | "white";
}

const COLORS: Record<NonNullable<SwooshProps["variant"]>, [string, string, string]> = {
  duo: ["#F9C80E", "#0077B6", "#F9C80E"],
  yellow: ["#F9C80E", "#F9C80E", "#F9C80E"],
  blue: ["#0077B6", "#0077B6", "#0077B6"],
  white: ["#FFFFFF", "#FFFFFF", "#FFFFFF"],
};

export function Swoosh({ className, variant = "duo" }: SwooshProps) {
  const [c1, c2, c3] = COLORS[variant];
  return (
    <svg
      className={className}
      viewBox="0 0 200 96"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 78 C 70 74, 128 54, 196 8"
        stroke={c1}
        strokeWidth="15"
        strokeLinecap="round"
      />
      <path
        d="M12 90 C 74 88, 128 70, 188 30"
        stroke={c2}
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d="M22 96 C 78 96, 126 84, 180 52"
        stroke={c3}
        strokeWidth="9"
        strokeLinecap="round"
      />
    </svg>
  );
}
