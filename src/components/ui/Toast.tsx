import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/cn";

type Tone = "info" | "success";
interface Toast {
  id: number;
  msg: string;
  tone: Tone;
}

interface ToastCtx {
  toast: (msg: string, tone?: Tone) => void;
}

const Ctx = createContext<ToastCtx | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);

  const toast = useCallback((msg: string, tone: Tone = "info") => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, msg, tone }]);
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 2800);
  }, []);

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 lg:bottom-6">
        {items.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex max-w-sm items-center gap-2.5 rounded-xl bg-navy px-3.5 py-2.5 text-sm text-white shadow-pop animate-fade-in"
          >
            {t.tone === "success" ? (
              <CheckCircle2 className="h-[18px] w-[18px] text-success" />
            ) : (
              <Info className="h-[18px] w-[18px] text-brand-yellow" />
            )}
            <span className="font-medium">{t.msg}</span>
            <button
              className="ml-1 text-white/50 hover:text-white"
              onClick={() => setItems((prev) => prev.filter((x) => x.id !== t.id))}
              aria-label="Dismiss"
            >
              <X className={cn("h-4 w-4")} />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast(): ToastCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
