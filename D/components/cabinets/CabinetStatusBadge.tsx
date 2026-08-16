import { Badge } from "@/components/ui/badge";
import type { CabinetStatus } from "@/lib/types/cabinets";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<
  CabinetStatus,
  { label: string; variant: "success" | "danger" | "warning"; dot: string }
> = {
  ONLINE: { label: "Online", variant: "success", dot: "bg-emerald-500" },
  OFFLINE: { label: "Offline", variant: "danger", dot: "bg-rose-500" },
  MAINTENANCE: { label: "Maintenance", variant: "warning", dot: "bg-amber-500" },
};

export function CabinetStatusBadge({ status }: { status: CabinetStatus }) {
  const config = STATUS_CONFIG[status];

  return (
    <Badge variant={config.variant}>
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </Badge>
  );
}
