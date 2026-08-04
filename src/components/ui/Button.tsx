import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "accent" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  block?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/50 focus-visible:ring-offset-2 " +
  "disabled:opacity-50 disabled:pointer-events-none select-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-brand-blue text-white hover:bg-brand-blue-700 shadow-brand-blue/40",
  accent: "bg-brand-yellow text-ink hover:bg-brand-yellow-600",
  ghost: "text-ink hover:bg-neutral-100",
  outline: "border border-line bg-surface text-ink hover:bg-neutral-50",
  danger: "bg-danger text-white hover:brightness-95",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", block, className, type = "button", ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(base, variants[variant], sizes[size], block && "w-full", className)}
      {...rest}
    />
  );
});
