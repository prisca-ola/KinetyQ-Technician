import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "md" | "lg";
}

// Centered dialog on desktop, bottom sheet on mobile. Closes on backdrop + Esc.
export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "md",
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "flex max-h-[92vh] w-full flex-col overflow-hidden bg-surface shadow-pop animate-fade-in",
          "rounded-t-2xl sm:rounded-2xl",
          size === "lg" ? "sm:max-w-xl" : "sm:max-w-md"
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
            {subtitle && <p className="text-[13px] text-neutral-500">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-ink"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="scroll-thin flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer && (
          <div className="border-t border-line px-5 py-3.5">{footer}</div>
        )}
      </div>
    </div>
  );
}
