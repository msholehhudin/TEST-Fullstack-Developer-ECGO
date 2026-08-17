import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CabinetStatusBadge } from "@/components/cabinets/CabinetStatusBadge";
import { CabinetHeartbeat } from "@/components/cabinets/CabinetHeartbeat";
import type { CabinetDetailInfo } from "@/lib/types/cabinet-detail";

export function CabinetDetailHeader({ cabinet }: { cabinet: CabinetDetailInfo }) {
  return (
    <div className="flex flex-col gap-3">
      <Link
        href="/cabinets"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to cabinets
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-semibold text-neutral-900">
          {cabinet.code}
        </h1>
        <CabinetStatusBadge status={cabinet.status} />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500">
        <span>{cabinet.branch_name}</span>
        <span className="text-neutral-300">·</span>
        <span className="inline-flex items-center gap-1">
          Last heartbeat: <CabinetHeartbeat timestamp={cabinet.last_heartbeat_at} />
        </span>
      </div>
    </div>
  );
}
