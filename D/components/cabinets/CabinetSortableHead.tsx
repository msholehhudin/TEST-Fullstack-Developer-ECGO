"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { TableHead } from "@/components/ui/table";
import type { CabinetSortBy, SortOrder } from "@/lib/types/cabinets";
import { cn } from "@/lib/utils";

export function CabinetSortableHead({
  column,
  label,
  sortBy,
  sortOrder,
  onSort,
  className,
}: {
  column: CabinetSortBy;
  label: string;
  sortBy?: CabinetSortBy;
  sortOrder: SortOrder;
  onSort: (column: CabinetSortBy) => void;
  className?: string;
}) {
  const isActive = sortBy === column;
  const Icon = !isActive ? ArrowUpDown : sortOrder === "asc" ? ArrowUp : ArrowDown;

  return (
    <TableHead className={className}>
      <button
        type="button"
        onClick={() => onSort(column)}
        className={cn(
          "inline-flex items-center gap-1 text-xs font-medium hover:text-neutral-900",
          isActive ? "text-neutral-900" : "text-neutral-500"
        )}
      >
        {label}
        <Icon className="h-3.5 w-3.5" />
      </button>
    </TableHead>
  );
}
