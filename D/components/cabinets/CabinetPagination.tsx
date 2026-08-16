"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CabinetsPagination } from "@/lib/api/cabinets";

export function CabinetPagination({
  pagination,
  onPageChange,
}: {
  pagination: CabinetsPagination;
  onPageChange: (page: number) => void;
}) {
  const { page, pageSize, total, totalPages } = pagination;

  if (total === 0) return null;

  const rangeStart = (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, total);

  // Keep the page list short: current page ±2, always show first/last.
  const pages = new Set<number>();
  for (let p = Math.max(1, page - 2); p <= Math.min(totalPages, page + 2); p++) {
    pages.add(p);
  }
  pages.add(1);
  pages.add(totalPages);
  const sortedPages = Array.from(pages).sort((a, b) => a - b);

  return (
    <div className="flex flex-col-reverse items-center justify-between gap-3 border-t border-neutral-100 px-4 py-3 sm:flex-row">
      <p className="text-sm text-neutral-500">
        Showing {rangeStart}–{rangeEnd} of {total}
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {sortedPages.map((p, i) => {
          const prev = sortedPages[i - 1];
          const showEllipsis = prev !== undefined && p - prev > 1;
          return (
            <span key={p} className="flex items-center gap-1">
              {showEllipsis && (
                <span className="px-1 text-sm text-neutral-400">…</span>
              )}
              <Button
                variant={p === page ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(p)}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </Button>
            </span>
          );
        })}

        <Button
          variant="outline"
          size="icon"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
