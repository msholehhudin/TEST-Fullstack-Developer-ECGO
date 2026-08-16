import { cn } from "@/lib/utils";

export function CabinetSlotProgress({
  filled,
  total,
}: {
  filled: number;
  total: number;
}) {
  const ratio = total > 0 ? filled / total : 0;
  const isFull = filled === total && total > 0;
  const isLow = ratio <= 0.25;

  return (
    <div className="flex items-center gap-2">
      <span className="w-10 shrink-0 text-sm tabular-nums text-neutral-800">
        {filled}/{total}
      </span>
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-neutral-100">
        <div
          className={cn(
            "h-full rounded-full transition-[width]",
            isFull
              ? "bg-neutral-400"
              : isLow
                ? "bg-amber-500"
                : "bg-emerald-500"
          )}
          style={{ width: `${Math.min(100, ratio * 100)}%` }}
        />
      </div>
    </div>
  );
}
