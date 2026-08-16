import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { CabinetSummary } from "@/lib/hooks/useCabinetSummary";

const METRICS: {
  key: keyof CabinetSummary;
  label: string;
  dot?: string;
}[] = [
  { key: "total", label: "Total Cabinets" },
  { key: "online", label: "Online", dot: "bg-emerald-500" },
  { key: "offline", label: "Offline", dot: "bg-rose-500" },
  { key: "maintenance", label: "Maintenance", dot: "bg-amber-500" },
];

export function CabinetSummaryCards({
  state,
}: {
  state:
    | { status: "loading" }
    | { status: "error" }
    | { status: "success"; summary: CabinetSummary };
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {METRICS.map((metric) => (
        <Card key={metric.key}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-1.5">
              {metric.dot && (
                <span className={cn("h-1.5 w-1.5 rounded-full", metric.dot)} />
              )}
              {metric.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {state.status === "success" ? (
              <p className="text-2xl font-semibold tabular-nums text-neutral-900">
                {state.summary[metric.key]}
              </p>
            ) : state.status === "error" ? (
              <p className="text-2xl font-semibold text-neutral-300">—</p>
            ) : (
              <Skeleton className="h-8 w-12" />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
