"use client";

import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Route-local — this drag-and-drop pattern is specific to this one
 * upload form for now. Fully interactive (real drag/drop + click to
 * browse + selected-file display), but there's no backend to actually
 * upload to yet — the parent form just holds the File in state.
 */
export function ProofOfDeliveryDropzone({
  file,
  onFileChange,
  error,
}: {
  file: File | null;
  onFileChange: (file: File | null) => void;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div>
      <label className="text-muted-foreground text-sm" id="proof-of-delivery-label">
        Proof of delivery
      </label>
      <div
        role="button"
        tabIndex={0}
        aria-labelledby="proof-of-delivery-label"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragOver(false);
          const dropped = event.dataTransfer.files[0];
          if (dropped) onFileChange(dropped);
        }}
        className={cn(
          "mt-2 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-4 py-8 text-center transition-colors",
          isDragOver ? "border-accent-400 bg-surface-raised" : "border-border-strong",
          error && "border-danger",
        )}
      >
        {file ? (
          <div className="flex items-center gap-3">
            <span className="text-foreground text-sm">{file.name}</span>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onFileChange(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="text-danger text-sm hover:underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            Drag a signed delivery note or agreement here, or click to browse
          </p>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
      />
      {error ? <p className="text-danger mt-1 text-sm">{error}</p> : null}
    </div>
  );
}
