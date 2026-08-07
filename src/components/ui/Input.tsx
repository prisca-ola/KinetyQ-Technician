import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

interface FieldProps {
  label?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  htmlFor?: string;
}

export function Field({ label, hint, error, children, htmlFor }: FieldProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-[13px] font-semibold text-ink"
        >
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-[12px] font-medium text-danger">{error}</p>
      ) : hint ? (
        <p className="text-[12px] text-neutral-500">{hint}</p>
      ) : null}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, leading, trailing, ...rest },
  ref
) {
  return (
    <div className="relative">
      {leading && (
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
          {leading}
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full h-11 rounded-xl border bg-surface text-ink text-sm placeholder:text-neutral-400",
          "px-3.5 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue/40",
          invalid ? "border-danger focus:ring-danger/30" : "border-line focus:border-brand-blue",
          !!leading && "pl-10",
          !!trailing && "pr-10",
          className
        )}
        {...rest}
      />
      {trailing && (
        <span className="absolute inset-y-0 right-0 flex items-center pr-2.5">
          {trailing}
        </span>
      )}
    </div>
  );
});

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, invalid, rows = 3, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          "w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-neutral-400",
          "transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue/40",
          invalid ? "border-danger focus:ring-danger/30" : "border-line focus:border-brand-blue",
          className
        )}
        {...rest}
      />
    );
  }
);
