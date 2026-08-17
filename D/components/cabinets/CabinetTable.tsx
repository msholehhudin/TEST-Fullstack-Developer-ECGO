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
        {cabinets.map((cabinet) => (
          <TableRow key={cabinet.id}>
            <TableCell className="font-medium text-neutral-900">
              <Link
                href={`/cabinets/${cabinet.id}`}
                className="hover:underline"
              >
                {cabinet.code}
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
