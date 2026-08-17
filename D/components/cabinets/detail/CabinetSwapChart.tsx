import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import type { HourlySwapPoint } from "@/lib/types/cabinet-detail";

const CHART_HEIGHT = 140;
const BAR_GAP = 4;

function formatHourLabel(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: true,
  }).format(new Date(iso));
}

export function CabinetSwapChart({ points }: { points: HourlySwapPoint[] }) {
  const total = points.reduce((sum, p) => sum + p.count, 0);
  // Round the axis max up to a "nice" number instead of the raw max, so a
  // single swap doesn't force the whole chart to look 100% full — the eye
  // reads bar height relative to a stable scale, not relative to whatever
  // happened to be the busiest hour.
  const rawMax = Math.max(...points.map((p) => p.count));
  const axisMax = rawMax <= 4 ? 4 : Math.ceil(rawMax / 5) * 5;

  return (
    <div>
      <p className="mb-4 text-sm text-neutral-500">
        <span className="font-semibold text-neutral-900">{total}</span>{" "}
        {total === 1 ? "swap" : "swaps"} in the last 24 hours
      </p>

      <div className="relative">
        {/* Gridlines: 0 / half / max, with the max value labeled so bar
            height has a fixed scale to read against. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 flex flex-col justify-between text-[10px] text-neutral-300"
          style={{ height: CHART_HEIGHT }}
        >
          <div className="flex items-center gap-2">
            <span className="w-4 text-right tabular-nums">{axisMax}</span>
            <div className="h-px flex-1 bg-neutral-100" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 text-right tabular-nums">
              {Math.round(axisMax / 2)}
            </span>
            <div className="h-px flex-1 bg-neutral-100" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 text-right tabular-nums">0</span>
            <div className="h-px flex-1 bg-neutral-200" />
          </div>
        </div>

        <div
          className="relative flex items-end gap-1 pl-6"
          style={{ height: CHART_HEIGHT }}
          role="img"
          aria-label="Swaps per hour over the last 24 hours"
        >
          {points.map((point) => {
            const heightPx =
              point.count === 0
                ? 0
                : Math.max(3, (point.count / axisMax) * CHART_HEIGHT);

            return (
              <Tooltip key={point.hour_start} className="relative flex-1">
                {point.count > 0 && (
                  <span
                    className="absolute left-1/2 -translate-x-1/2 text-[10px] font-semibold tabular-nums text-neutral-700"
                    style={{ bottom: heightPx + 4 }}
                  >
                    {point.count}
                  </span>
                )}
                <div
                  className={
                    point.count > 0
                      ? "w-full cursor-default rounded-t-sm bg-neutral-800 transition-colors hover:bg-neutral-900"
                      : "w-full cursor-default rounded-t-sm bg-neutral-100"
                  }
                  style={{ height: point.count > 0 ? heightPx : 2 }}
                />
                <TooltipContent className="-translate-y-[calc(100%+4px)]">
                  {point.count} swap{point.count === 1 ? "" : "s"} ·{" "}
                  {formatHourLabel(point.hour_start)}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>

      <div
        className="mt-1.5 flex pl-6 text-[10px] text-neutral-400"
        style={{ gap: BAR_GAP }}
      >
        {points.map((point, i) => (
          <div key={point.hour_start} className="flex-1 text-center">
            {i % 4 === 0 ? formatHourLabel(point.hour_start) : ""}
          </div>
        ))}
      </div>
    </div>
  );
}
