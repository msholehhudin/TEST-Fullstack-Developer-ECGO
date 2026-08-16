import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import {
  formatHeartbeatExact,
  formatHeartbeatRelative,
} from "@/lib/format/heartbeat";

export function CabinetHeartbeat({ timestamp }: { timestamp: string | null }) {
  return (
    <Tooltip tabIndex={0}>
      <span className="cursor-default text-neutral-700">
        {formatHeartbeatRelative(timestamp)}
      </span>
      <TooltipContent>{formatHeartbeatExact(timestamp)}</TooltipContent>
    </Tooltip>
  );
}
