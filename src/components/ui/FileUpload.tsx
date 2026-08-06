import { useRef, useState } from "react";
import { CheckCircle2, FileUp, Lock, X } from "lucide-react";
import { cn } from "@/lib/cn";

interface FileUploadProps {
  label: string;
  hint?: string;
  /** controlled: the stored file name (we keep only the name at this stage) */
  value?: string;
  onChange: (fileName: string | undefined) => void;
  accept?: string;
}

// Document upload control. At this prototype stage we capture only the file
// name (no real upload); production stores the file securely for verification.
export function FileUpload({
  label,
  hint,
  value,
  onChange,
  accept = "image/*,application/pdf",
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  function handleFiles(files: FileList | null) {
    if (files && files[0]) onChange(files[0].name);
  }

  if (value) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-success/30 bg-success-50 px-3.5 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-ink">{label}</p>
            <p className="truncate text-[12px] text-neutral-500">{value}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-neutral-400 hover:bg-white hover:text-ink"
          aria-label={`Remove ${label}`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border border-dashed px-3.5 py-3.5 text-left transition-colors",
        drag ? "border-brand-blue bg-brand-blue-50" : "border-neutral-300 hover:border-brand-blue hover:bg-neutral-50"
      )}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-neutral-100">
        <FileUp className="h-[18px] w-[18px] text-neutral-500" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-ink">{label}</p>
        <p className="text-[12px] text-neutral-500">
          {hint ?? "PNG, JPG or PDF"}
        </p>
      </div>
      <span className="flex items-center gap-1 text-[11px] font-medium text-neutral-400">
        <Lock className="h-3 w-3" /> Secure
      </span>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </button>
  );
}
