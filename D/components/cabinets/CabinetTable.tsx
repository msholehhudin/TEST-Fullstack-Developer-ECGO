"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CabinetStatusBadge } from "@/components/cabinets/CabinetStatusBadge";
import { CabinetSlotProgress } from "@/components/cabinets/CabinetSlotProgress";
import { CabinetHeartbeat } from "@/components/cabinets/CabinetHeartbeat";
import { CabinetSortableHead } from "@/components/cabinets/CabinetSortableHead";
import type { Cabinet, CabinetSortBy, SortOrder } from "@/lib/types/cabinets";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function CabinetTable({
  cabinets,
  sortBy,
  sortOrder,
  onSort,
}: {
  cabinets: Cabinet[];
  sortBy?: CabinetSortBy;
  sortOrder: SortOrder;
  onSort: (column: CabinetSortBy) => void;
}) {
  const router = useRouter();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <CabinetSortableHead
            column="code"
            label="Code"
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={onSort}
          />
          <CabinetSortableHead
            column="branch"
            label="Branch"
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={onSort}
          />
          <CabinetSortableHead
            column="status"
            label="Status"
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={onSort}
          />
          <TableHead>Slots</TableHead>
          <CabinetSortableHead
            column="swap24h"
            label="Swaps (24h)"
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={onSort}
          />
          <CabinetSortableHead
            column="heartbeat"
            label="Last Heartbeat"
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={onSort}
          />
        </TableRow>
      </TableHeader>
      <TableBody>
        {cabinets.map((cabinet) => {
          const href = `/cabinets/${cabinet.id}`;

          return (
            <TableRow
              key={cabinet.id}
              className="group cursor-pointer border-l-2 border-l-transparent transition-colors hover:border-l-emerald-500 hover:bg-emerald-50/60"
              onClick={() => router.push(href)}
            >
              <TableCell className="font-medium text-neutral-900">
                <Link
                  href={href}
                  className="hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {cabinet.code}
                  {/* <ArrowUpRight className="h-3.5 w-3.5 text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100" /> */}
                </Link>
              </TableCell>
              <TableCell>{cabinet.branch_name}</TableCell>
              <TableCell>
                <CabinetStatusBadge status={cabinet.status} />
              </TableCell>
              <TableCell>
                <CabinetSlotProgress
                  filled={cabinet.slots_filled}
                  total={cabinet.slots_total}
                />
              </TableCell>
              <TableCell className="tabular-nums">
                {cabinet.swap_count_24h}
              </TableCell>
              <TableCell>
                <CabinetHeartbeat timestamp={cabinet.last_heartbeat_at} />
              </TableCell>

              <TableCell className="w-8 text-right">
                <ArrowUpRight className="ml-auto h-4 w-4 text-neutral-300 opacity-0 transition-opacity group-hover:opacity-100 group-hover:text-neutral-500" />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
